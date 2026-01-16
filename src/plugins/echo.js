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
        authEndpoint: `${process.env.VUE_APP_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'}/broadcasting/auth`,
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

        echoInstance.disconnect();
        echoInstance = null;
        delete window.Echo;
        console.log('[Echo] Disconnected and cleaned up');
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
 *
 * @param {number} userId - The user ID to unsubscribe from
 */
export function unsubscribeFromPermissionUpdates(userId) {
    if (!echoInstance || !userId) {
        return;
    }

    try {
        const channelName = `private-App.Models.User.${userId}`;

        // Stop listening to the permission event
        if (permissionChannelSubscription) {
            permissionChannelSubscription.stopListening('.user.permissions-updated');
        }

        // Leave the channel
        echoInstance.leave(channelName);
        permissionChannelSubscription = null;

        console.log(`[Echo] 🔐 Unsubscribed from permission updates on channel: ${channelName}`);
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
