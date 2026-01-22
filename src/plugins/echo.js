// src/plugins/echo.js
// import Echo from 'laravel-echo';
// import Pusher from 'pusher-js';

// window.Pusher = Pusher;

// let echoInstance = null;

// export function initEcho(token) {
//     // Cleanup old instance if any
//     if (echoInstance) {
//         echoInstance.disconnect();
//         echoInstance = null;
//     }

//     echoInstance = new Echo({
//         broadcaster: 'pusher',
//         key: '1kysachzmqjvsnxg3e4q',
//         wsHost: '127.0.0.1',
//         wsPort: 6001,
//         wssPort: 6001,
//         forceTLS: false,
//         encrypted: false,
//         disableStats: true,
//         enabledTransports: ['ws', 'wss'],
//         authEndpoint: 'http://127.0.0.1:8000/broadcasting/auth',
//         auth: {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         },
//     });

//     echoInstance.connector.pusher.connection.bind('connected', () => {
//         console.log('[Echo] Connected to Reverb!');
//     });
//     echoInstance.connector.pusher.connection.bind('error', (err) => {
//         console.error('[Echo] Connection error:', err);
//     });

//     // Attach to global if you want (for debugging)
//     window.Echo = echoInstance;

//     return echoInstance;
// }

// export function disconnectEcho() {
//     if (echoInstance) {
//         echoInstance.disconnect();
//         echoInstance = null;
//         delete window.Echo;

//         console.log('[Echo] Disconnected');
//     }
// }

// export function getEcho() {
//     return echoInstance;
// }

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Pusher is still required for Reverb as it uses the Pusher protocol
window.Pusher = Pusher;

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

export function initEcho(token) {
    // Cleanup old instance if any - IMPORTANT: Unbind listeners BEFORE disconnecting
    if (echoInstance) {
        unbindConnectionListeners();
        echoInstance.disconnect();
        echoInstance = null;
    }

    // Reverb Configuration
    const reverbConfig = {
        broadcaster: 'reverb',
        key: import.meta.env.VITE_REVERB_APP_KEY || 'qr5fnpjwyv6ckd89vk3d',
        wsHost: import.meta.env.VITE_REVERB_HOST || '127.0.0.1',
        wsPort: import.meta.env.VITE_REVERB_PORT || 8081,
        wssPort: import.meta.env.VITE_REVERB_PORT || 8081,
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME || 'http') === 'https',
        enabledTransports: ['ws', 'wss'],
        disableStats: true,
        authEndpoint: import.meta.env.VITE_BROADCASTING_AUTH_ENDPOINT || 'http://127.0.0.1:8000/broadcasting/auth',
        auth: {
            headers: { Authorization: `Bearer ${token}` },
        },
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
