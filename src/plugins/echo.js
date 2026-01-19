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
                console.warn(`[Echo] Failed to unbind ${event} listener:`, error);
            }
        });
        console.log(`[Echo] Unbound ${connectionListeners.length} connection listeners`);
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
    console.log(`[Echo] Channel tracking: user ${userId} now has [${[...activeUserChannels.get(key)].join(', ')}]`);
}

function decrementChannelSubscription(userId, type) {
    const key = `user_${userId}`;
    if (activeUserChannels.has(key)) {
        activeUserChannels.get(key).delete(type);
        console.log(`[Echo] Channel tracking: user ${userId} now has [${[...activeUserChannels.get(key)].join(', ')}]`);

        // If no more subscriptions, leave the channel
        if (activeUserChannels.get(key).size === 0) {
            const channelName = `private-App.Models.User.${userId}`;
            if (echoInstance) {
                echoInstance.leave(channelName);
                console.log(`[Echo] Left channel ${channelName} - no more active subscriptions`);
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
        key: process.env.VUE_APP_REVERB_APP_KEY || 'lwzlina3oymluc9m9nog',
        wsHost: process.env.VUE_APP_REVERB_HOST || '127.0.0.1',
        wsPort: process.env.VUE_APP_REVERB_PORT || 8081,
        wssPort: process.env.VUE_APP_REVERB_PORT || 8081,
        forceTLS: (process.env.VUE_APP_REVERB_SCHEME || 'http') === 'https',
        enabledTransports: ['ws', 'wss'],
        disableStats: true,
        authEndpoint: process.env.VUE_APP_BROADCASTING_AUTH_ENDPOINT || 'http://127.0.0.1:8000/broadcasting/auth',
        auth: {
            headers: { Authorization: `Bearer ${token}` },
        },
    };

    echoInstance = new Echo(reverbConfig);

    // Define connection event handlers - CRITICAL: Store references for cleanup
    const connectedHandler = () => {
        console.log('[Echo] ✅ Connected to Laravel Reverb!');
        console.log('[Echo] Configuration:', {
            host: reverbConfig.wsHost,
            port: reverbConfig.wsPort,
            scheme: reverbConfig.forceTLS ? 'wss' : 'ws'
        });
    };

    const connectingHandler = () => {
        console.log('[Echo] 🔄 Connecting to Reverb...');
    };

    const disconnectedHandler = () => {
        console.log('[Echo] ⚠️ Disconnected from Reverb');
    };

    const errorHandler = (err) => {
        console.error('[Echo] ❌ Connection error:', err);
    };

    const unavailableHandler = () => {
        console.error('[Echo] ❌ Reverb server unavailable');
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

    console.log(`[Echo] Bound ${connectionListeners.length} connection listeners`);

    window.Echo = echoInstance;

    return echoInstance;
}

export function disconnectEcho() {
    if (echoInstance) {
        // CRITICAL: Unbind all event listeners BEFORE disconnecting
        unbindConnectionListeners();

        // Reset channel subscriptions to prevent stale references
        permissionChannelSubscription = null;
        notificationChannelSubscription = null;

        // Clear all channel tracking
        activeUserChannels.clear();

        echoInstance.disconnect();
        echoInstance = null;
        delete window.Echo;
        console.log('[Echo] Disconnected and cleaned up all subscriptions');
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
        console.warn('[Echo] Cannot subscribe to permission updates - Echo not initialized');
        return null;
    }

    if (!userId) {
        console.warn('[Echo] Cannot subscribe to permission updates - no user ID provided');
        return null;
    }

    // Unsubscribe from existing subscription if any
    unsubscribeFromPermissionUpdates(userId);

    try {
        const channelName = `App.Models.User.${userId}`;

        // Subscribe to the user's private channel and listen for permission events
        permissionChannelSubscription = echoInstance
            .private(channelName)
            .listen('.user.permissions-updated', (event) => {
                console.log('[Echo] 🔐 Permission update received:', event);

                if (typeof callback === 'function') {
                    callback(event);
                }
            });

        // Track this subscription
        incrementChannelSubscription(userId, 'permissions');

        console.log(`[Echo] 🔐 Subscribed to permission updates on channel: ${channelName}`);
        return permissionChannelSubscription;
    } catch (error) {
        console.error('[Echo] Error subscribing to permission updates:', error);
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
        }

        // Update tracking
        decrementChannelSubscription(userId, 'permissions');

        console.log(`[Echo] 🔐 Stopped listening to permission updates for user ${userId}`);
    } catch (error) {
        console.warn('[Echo] Error unsubscribing from permission updates:', error);
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
        console.warn('[Echo] Cannot init permission listener - no user ID');
        return null;
    }

    // Dynamic import to avoid circular dependencies
    return import('@/stores/authStore').then(({ useAuthStore }) => {
        const authStore = useAuthStore();

        return subscribeToPermissionUpdates(userId, (event) => {
            // Delegate to authStore's handler
            authStore.handlePermissionUpdateEvent(event);
        });
    }).catch((error) => {
        console.error('[Echo] Error initializing permission listener:', error);
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
        console.warn('[Echo] Cannot subscribe to notifications - Echo not initialized');
        return null;
    }

    if (!userId) {
        console.warn('[Echo] Cannot subscribe to notifications - no user ID provided');
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
                console.log('[Echo] 🔔 Notification received:', notification);

                if (typeof callback === 'function') {
                    callback(notification);
                }
            });

        // Track this subscription
        incrementChannelSubscription(userId, 'notifications');

        console.log(`[Echo] 🔔 Subscribed to notifications on channel: ${channelName}`);
        return notificationChannelSubscription;
    } catch (error) {
        console.error('[Echo] Error subscribing to notifications:', error);
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
                console.log('[Echo] Could not stopListening, will be cleaned up on channel leave');
            }
            notificationChannelSubscription = null;
        }

        // Update tracking
        decrementChannelSubscription(userId, 'notifications');

        console.log(`[Echo] 🔔 Stopped listening to notifications for user ${userId}`);
    } catch (error) {
        console.warn('[Echo] Error unsubscribing from notifications:', error);
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
        console.warn('[Echo] Cannot init notification listener - no user ID');
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
            console.log(`[Echo] 🔔 Toast: ${notification.title}`, notification.message || '');
        }
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
        console.warn('[Echo] Cannot cleanup subscriptions - no user ID');
        return;
    }

    console.log(`[Echo] 🧹 Cleaning up all subscriptions for user ${userId}`);

    // Clear subscription references first
    permissionChannelSubscription = null;
    notificationChannelSubscription = null;

    // Clear tracking for this user
    const key = `user_${userId}`;
    activeUserChannels.delete(key);

    // Force leave the channel to ensure complete cleanup
    if (echoInstance) {
        const channelName = `private-App.Models.User.${userId}`;
        try {
            echoInstance.leave(channelName);
            console.log(`[Echo] 🧹 Force left channel ${channelName}`);
        } catch (error) {
            console.warn('[Echo] Error leaving channel during cleanup:', error);
        }
    }

    console.log(`[Echo] 🧹 Cleanup complete for user ${userId}`);
}
