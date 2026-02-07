// src/plugins/echo.js
// WebSocket communication via Laravel Echo + Reverb (Pusher protocol)
// Authentication: HttpOnly cookie sent automatically via credentials: 'include'

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Pusher is still required for Reverb as it uses the Pusher protocol
window.Pusher = Pusher;

/**
 * Validate Reverb configuration.
 * Returns true if configuration is valid, false otherwise.
 * Logs warnings/errors depending on environment.
 */
function validateReverbConfig() {
    const isProduction = import.meta.env.VITE_ENV === 'production' || import.meta.env.MODE === 'production';

    const appKey = import.meta.env.VITE_REVERB_APP_KEY;
    const host = import.meta.env.VITE_REVERB_HOST;
    const authEndpoint = import.meta.env.VITE_BROADCASTING_AUTH_ENDPOINT;
    const scheme = import.meta.env.VITE_REVERB_SCHEME;

    const issues = [];

    // Check for placeholder values
    if (!appKey || appKey === 'your_reverb_app_key_here') {
        issues.push('VITE_REVERB_APP_KEY is not configured (still has placeholder value)');
    }

    // Check for missing host
    if (!host) {
        issues.push('VITE_REVERB_HOST is not configured');
    }

    // Check for missing auth endpoint
    if (!authEndpoint) {
        issues.push('VITE_BROADCASTING_AUTH_ENDPOINT is not configured');
    }

    // Production-specific checks
    if (isProduction) {
        // Check for HTTP in production (should be HTTPS)
        if (scheme === 'http') {
            issues.push('VITE_REVERB_SCHEME should be "https" in production');
        }

        if (authEndpoint && authEndpoint.startsWith('http://')) {
            issues.push('VITE_BROADCASTING_AUTH_ENDPOINT should use HTTPS in production');
        }
    }

    if (issues.length > 0) {
        if (isProduction) {
            console.error('[Echo] Reverb configuration issues detected:', issues);
            // In production, don't initialize Echo with invalid config
            return false;
        } else {
            console.warn('[Echo] Reverb configuration warnings:', issues);
            // In development, continue but warn
        }
    }

    return true;
}

let echoInstance = null;
let connectionListeners = [];
let permissionChannelSubscription = null; // Track permission channel subscription
let notificationChannelSubscription = null; // Track notification channel subscription
let activeUserChannels = new Map(); // Track active channel subscriptions per user to prevent premature leave
let permissionListenerInitialized = false; // Track if permission listener is already set up

/**
 * Unbind all connection event listeners to prevent memory leaks
 * CRITICAL: Must be called before disconnecting Echo instance
 */
function unbindConnectionListeners() {
    if (echoInstance?.connector?.pusher?.connection) {
        connectionListeners.forEach(({ event, handler }) => {
            try {
                echoInstance.connector.pusher.connection.unbind(event, handler);
            } catch (error) {
                // Silent fail
            }
        });
    }
    connectionListeners = [];
}

/**
 * Track channel subscriptions to prevent premature channel leave
 * Multiple listeners (permissions, notifications) share the same user channel
 */
function incrementChannelSubscription(userId, type) {
    const key = `user_${userId}`;
    if (!activeUserChannels.has(key)) {
        activeUserChannels.set(key, new Set());
    }
    activeUserChannels.get(key).add(type);
}

function decrementChannelSubscription(userId, type) {
    const key = `user_${userId}`;
    if (activeUserChannels.has(key)) {
        activeUserChannels.get(key).delete(type);

        // If no more subscriptions, leave the channel
        if (activeUserChannels.get(key).size === 0) {
            const channelName = `private-App.Models.User.${userId}`;
            if (echoInstance) {
                echoInstance.leave(channelName);
            }
            activeUserChannels.delete(key);
        }
    }
}

function hasActiveSubscription(userId, type) {
    const key = `user_${userId}`;
    return activeUserChannels.has(key) && activeUserChannels.get(key).has(type);
}

/**
 * Initialize Echo instance for WebSocket communication.
 * This function is idempotent - if Echo is already initialized and connected,
 * it returns the existing instance instead of creating a new one.
 * This prevents redundant broadcasting/auth calls on every route navigation.
 *
 * @param {Object} options - Configuration options
 * @param {boolean} options.force - Force reinitialize even if already connected (e.g., after token refresh)
 * @returns {Object|null} - The Echo instance or null if initialization failed
 */
export function initEcho({ force = false } = {}) {
    // If already initialized and not forcing, return existing instance
    if (echoInstance && window.__ECHO_INITIALIZED && !force) {
        return echoInstance;
    }

    // Cleanup old instance if any - IMPORTANT: Unbind listeners BEFORE disconnecting
    if (echoInstance) {
        unbindConnectionListeners();
        echoInstance.disconnect();
        echoInstance = null;
    }

    // Validate configuration before initializing
    const isConfigValid = validateReverbConfig();
    const isProduction = import.meta.env.VITE_ENV === 'production' || import.meta.env.MODE === 'production';

    if (!isConfigValid && isProduction) {
        console.error('[Echo] Skipping Echo initialization due to invalid configuration');
        // Return null but don't throw - allow app to function without real-time features
        return null;
    }

    // Reverb Configuration
    // NOTE: Authentication is now cookie-based (HttpOnly cookie for XSS protection)
    const broadcastAuthEndpoint = import.meta.env.VITE_BROADCASTING_AUTH_ENDPOINT || 'http://localhost:8000/broadcasting/auth';

    const reverbConfig = {
        broadcaster: 'reverb',
        key: import.meta.env.VITE_REVERB_APP_KEY || 'qr5fnpjwyv6ckd89vk3d',
        wsHost: import.meta.env.VITE_REVERB_HOST || 'localhost',
        wsPort: import.meta.env.VITE_REVERB_PORT || 8081,
        wssPort: import.meta.env.VITE_REVERB_PORT || 8081,
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME || 'http') === 'https',
        enabledTransports: ['ws', 'wss'],
        disableStats: true,
        // Custom authorizer using fetch with credentials: 'include'
        // Pusher.js's default XHR auth does NOT support withCredentials,
        // so the HttpOnly cookie would not be sent. This custom authorizer
        // uses the Fetch API which properly sends cookies cross-origin.
        authorizer: (channel) => ({
            authorize: (socketId, callback) => {
                fetch(broadcastAuthEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: JSON.stringify({
                        socket_id: socketId,
                        channel_name: channel.name,
                    }),
                    credentials: 'include',
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Broadcasting auth failed: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => callback(null, data))
                .catch(error => callback(true, error));
            },
        }),
    };

    echoInstance = new Echo(reverbConfig);

    // Define connection event handlers - CRITICAL: Store references for cleanup
    const connectedHandler = () => {
        // Connected successfully
    };

    const connectingHandler = () => {
        // Connecting...
    };

    const disconnectedHandler = () => {
        // Disconnected
    };

    const errorHandler = (err) => {
        // Connection error
    };

    const unavailableHandler = () => {
        // Server unavailable
    };

    // Bind connection event listeners
    echoInstance.connector.pusher.connection.bind('connected', connectedHandler);
    echoInstance.connector.pusher.connection.bind('connecting', connectingHandler);
    echoInstance.connector.pusher.connection.bind('disconnected', disconnectedHandler);
    echoInstance.connector.pusher.connection.bind('error', errorHandler);
    echoInstance.connector.pusher.connection.bind('unavailable', unavailableHandler);

    // Track all listeners for cleanup - CRITICAL for preventing memory leaks
    connectionListeners = [
        { event: 'connected', handler: connectedHandler },
        { event: 'connecting', handler: connectingHandler },
        { event: 'disconnected', handler: disconnectedHandler },
        { event: 'error', handler: errorHandler },
        { event: 'unavailable', handler: unavailableHandler }
    ];

    window.Echo = echoInstance;
    window.__ECHO_INITIALIZED = true;

    return echoInstance;
}

export function disconnectEcho() {
    if (echoInstance) {
        // CRITICAL: Unbind all event listeners BEFORE disconnecting
        unbindConnectionListeners();

        // Reset channel subscriptions to prevent stale references
        permissionChannelSubscription = null;
        notificationChannelSubscription = null;
        permissionListenerInitialized = false;

        // Clear all channel tracking
        activeUserChannels.clear();

        echoInstance.disconnect();
        echoInstance = null;
        delete window.Echo;
        delete window.__ECHO_INITIALIZED;
    }
}

export function getEcho() {
    return echoInstance;
}

export function isEchoInitialized() {
    // True if instance exists and the global flag is set
    return !!echoInstance && window.__ECHO_INITIALIZED === true;
}

// =========================================
// PERMISSION UPDATE CHANNEL SUBSCRIPTION
// =========================================

/**
 * Subscribe to permission update events for a specific user.
 * Called after Echo is initialized and user is authenticated.
 *
 * @param {number} userId - The user ID to subscribe to
 * @param {Function} callback - Callback function when permissions are updated
 */
export function subscribeToPermissionUpdates(userId, callback) {
    if (!echoInstance) {
        return null;
    }

    if (!userId) {
        return null;
    }

    // Check if already subscribed to this user's permissions
    if (permissionChannelSubscription && hasActiveSubscription(userId, 'permissions')) {
        return permissionChannelSubscription;
    }

    // Unsubscribe from existing subscription if any
    unsubscribeFromPermissionUpdates(userId);

    try {
        const channelName = `App.Models.User.${userId}`;

        // Subscribe to the user's private channel and listen for permission events
        permissionChannelSubscription = echoInstance
            .private(channelName)
            .listen('.user.permissions-updated', (event) => {
                if (typeof callback === 'function') {
                    callback(event);
                }
            });

        // Track this subscription
        incrementChannelSubscription(userId, 'permissions');

        return permissionChannelSubscription;
    } catch (error) {
        return null;
    }
}

/**
 * Unsubscribe from permission update events.
 * Called when user logs out or component is destroyed.
 * NOTE: Does NOT leave the channel - other listeners may still be active.
 * Use cleanupUserSubscriptions() to fully leave the channel.
 *
 * @param {number} userId - The user ID to unsubscribe from
 */
export function unsubscribeFromPermissionUpdates(userId) {
    if (!echoInstance || !userId) {
        return;
    }

    try {
        // Stop listening to the permission event without leaving channel
        // (notifications may still be using this channel)
        if (permissionChannelSubscription) {
            permissionChannelSubscription.stopListening('.user.permissions-updated');
            permissionChannelSubscription = null;
            permissionListenerInitialized = false;
        }

        // Update tracking
        decrementChannelSubscription(userId, 'permissions');
    } catch (error) {
        // Silent fail
    }
}

/**
 * Initialize permission update listener with authStore.
 * This is a convenience function that wires up the Echo subscription
 * with the authStore's handlePermissionUpdateEvent method.
 *
 * @param {number} userId - The user ID to subscribe to
 * @returns {Object|null} - The channel subscription or null if failed
 */
export function initPermissionUpdateListener(userId) {
    if (!userId) {
        return null;
    }

    // Prevent duplicate initialization
    if (permissionListenerInitialized && permissionChannelSubscription) {
        return Promise.resolve(permissionChannelSubscription);
    }

    // Dynamic import to avoid circular dependencies
    return import('@/stores/authStore').then(({ useAuthStore }) => {
        const authStore = useAuthStore();

        const subscription = subscribeToPermissionUpdates(userId, (event) => {
            // Delegate to authStore's handler
            authStore.handlePermissionUpdateEvent(event);
        });

        if (subscription) {
            permissionListenerInitialized = true;
        }

        return subscription;
    }).catch((error) => {
        return null;
    });
}

// =========================================
// NOTIFICATION CHANNEL SUBSCRIPTION
// =========================================

/**
 * Subscribe to all notifications for a user.
 * Uses Laravel Echo's .notification() method which listens for
 * Illuminate\Notifications\Events\BroadcastNotificationCreated events.
 *
 * @param {number} userId - The user ID to subscribe to
 * @param {Function} callback - Callback function when notification is received
 * @returns {Object|null} - The channel subscription or null if failed
 */
export function subscribeToNotifications(userId, callback) {
    if (!echoInstance) {
        return null;
    }

    if (!userId) {
        return null;
    }

    // Unsubscribe from existing subscription if any to prevent duplicate listeners
    unsubscribeFromNotifications(userId);

    try {
        const channelName = `App.Models.User.${userId}`;

        // Use .notification() for Laravel Notification broadcasts
        // This is different from .listen() - it specifically handles BroadcastNotificationCreated events
        notificationChannelSubscription = echoInstance
            .private(channelName)
            .notification((notification) => {
                if (typeof callback === 'function') {
                    callback(notification);
                }
            });

        // Track this subscription
        incrementChannelSubscription(userId, 'notifications');

        return notificationChannelSubscription;
    } catch (error) {
        return null;
    }
}

/**
 * Unsubscribe from notification events.
 * Called when user logs out or component is destroyed.
 * NOTE: Does NOT leave the channel - other listeners may still be active.
 * Use cleanupUserSubscriptions() to fully leave the channel.
 *
 * @param {number} userId - The user ID to unsubscribe from
 */
export function unsubscribeFromNotifications(userId) {
    if (!echoInstance || !userId) {
        return;
    }

    try {
        // For notifications, we need to get the channel and stopListening
        // Laravel Echo notification uses '.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated'
        if (notificationChannelSubscription) {
            try {
                // Try to stop listening to the notification event
                notificationChannelSubscription.stopListening('.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated');
            } catch (e) {
                // Fallback - some versions use different event names
            }
            notificationChannelSubscription = null;
        }

        // Update tracking
        decrementChannelSubscription(userId, 'notifications');
    } catch (error) {
        // Silent fail
    }
}

/**
 * Initialize notification listener with a notification store or handler.
 * This is a convenience function that wires up the Echo subscription
 * with a notification handling mechanism.
 *
 * @param {number} userId - The user ID to subscribe to
 * @param {Object} options - Options for notification handling
 * @param {Function} options.onNotification - Callback when notification is received
 * @param {boolean} options.showToast - Whether to show toast notifications (default: true)
 * @returns {Promise<Object|null>} - The channel subscription or null if failed
 */
export function initNotificationListener(userId, options = {}) {
    if (!userId) {
        return Promise.resolve(null);
    }

    const {
        onNotification = null,
        showToast = true
    } = options;

    return subscribeToNotifications(userId, (notification) => {
        // Call custom handler if provided
        if (typeof onNotification === 'function') {
            onNotification(notification);
        }

        // Optionally show toast notification
        if (showToast && notification.title) {
            // You can integrate with your toast/notification UI library here
        }
    });
}

// =========================================
// PROFILE UPDATE CHANNEL SUBSCRIPTION
// =========================================

let profileChannelSubscription = null;
let profileListenerInitialized = false;

/**
 * Subscribe to profile update events for a specific user.
 * Called after Echo is initialized and user is authenticated.
 *
 * @param {number} userId - The user ID to subscribe to
 * @param {Function} callback - Callback function when profile is updated
 * @returns {Object|null} - The channel subscription or null if failed
 */
export function subscribeToProfileUpdates(userId, callback) {
    if (!echoInstance) {
        return null;
    }

    if (!userId) {
        return null;
    }

    // Check if already subscribed to this user's profile updates
    if (profileChannelSubscription && hasActiveSubscription(userId, 'profile')) {
        return profileChannelSubscription;
    }

    // Unsubscribe from existing subscription if any
    unsubscribeFromProfileUpdates(userId);

    try {
        const channelName = `App.Models.User.${userId}`;

        // Subscribe to the user's private channel and listen for profile events
        profileChannelSubscription = echoInstance
            .private(channelName)
            .listen('.user.profile-updated', (event) => {
                if (typeof callback === 'function') {
                    callback(event);
                }
            });

        // Track this subscription
        incrementChannelSubscription(userId, 'profile');

        return profileChannelSubscription;
    } catch (error) {
        return null;
    }
}

/**
 * Unsubscribe from profile update events.
 * Called when user logs out or component is destroyed.
 *
 * @param {number} userId - The user ID to unsubscribe from
 */
export function unsubscribeFromProfileUpdates(userId) {
    if (!echoInstance || !userId) {
        return;
    }

    try {
        if (profileChannelSubscription) {
            profileChannelSubscription.stopListening('.user.profile-updated');
            profileChannelSubscription = null;
            profileListenerInitialized = false;
        }

        // Update tracking
        decrementChannelSubscription(userId, 'profile');
    } catch (error) {
        // Silent fail
    }
}

/**
 * Initialize profile update listener with authStore.
 * This is a convenience function that wires up the Echo subscription
 * with the authStore's handleProfileUpdateEvent method.
 *
 * @param {number} userId - The user ID to subscribe to
 * @returns {Promise<Object|null>} - The channel subscription or null if failed
 */
export function initProfileUpdateListener(userId) {
    if (!userId) {
        return Promise.resolve(null);
    }

    // Prevent duplicate initialization
    if (profileListenerInitialized && profileChannelSubscription) {
        return Promise.resolve(profileChannelSubscription);
    }

    // Dynamic import to avoid circular dependencies
    return import('@/stores/authStore').then(({ useAuthStore }) => {
        const authStore = useAuthStore();

        const subscription = subscribeToProfileUpdates(userId, (event) => {
            // Delegate to authStore's handler
            if (authStore.handleProfileUpdateEvent) {
                authStore.handleProfileUpdateEvent(event);
            }
        });

        if (subscription) {
            profileListenerInitialized = true;
        }

        return subscription;
    }).catch(() => {
        return null;
    });
}

/**
 * Cleanup all user-specific subscriptions.
 * Should be called on logout to prevent memory leaks.
 * Forces channel leave regardless of subscription tracking.
 *
 * @param {number} userId - The user ID to cleanup subscriptions for
 */
export function cleanupUserSubscriptions(userId) {
    if (!userId) {
        return;
    }

    // Clear subscription references first
    permissionChannelSubscription = null;
    notificationChannelSubscription = null;
    profileChannelSubscription = null;
    permissionListenerInitialized = false;
    profileListenerInitialized = false;

    // Clear tracking for this user
    const key = `user_${userId}`;
    activeUserChannels.delete(key);

    // Force leave the channel to ensure complete cleanup
    if (echoInstance) {
        const channelName = `private-App.Models.User.${userId}`;
        try {
            echoInstance.leave(channelName);
        } catch (error) {
            // Silent fail
        }
    }
}
