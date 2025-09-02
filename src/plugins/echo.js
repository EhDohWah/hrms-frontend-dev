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

window.Pusher = Pusher;

let echoInstance = null;

export function initEcho(token) {
    if (echoInstance) {
        echoInstance.disconnect();
        echoInstance = null;
    }

    echoInstance = new Echo({
        broadcaster: 'pusher',
        key: '30367b7c70f149742ff9',
        cluster: 'ap1',
        forceTLS: true,
        // For development on localhost
        // authEndpoint: 'http://127.0.0.1:8000/broadcasting/auth',


        // For production on Netlify
        authEndpoint: process.env.VUE_APP_API_AUTH_URL || 'https://hrms.kanyawtech.io/broadcasting/auth',
        auth: {
            headers: { Authorization: `Bearer ${token}` },
        },
    });

    echoInstance.connector.pusher.connection.bind('connected', () => {
        console.log('[Echo] Connected to Pusher!');
    });
    echoInstance.connector.pusher.connection.bind('error', (err) => {
        console.error('[Echo] Connection error:', err);
    });

    window.Echo = echoInstance;

    return echoInstance;
}

export function disconnectEcho() {
    if (echoInstance) {
        echoInstance.disconnect();
        echoInstance = null;
        delete window.Echo;
        console.log('[Echo] Disconnected');
    }
}

export function getEcho() {
    return echoInstance;
}

export function isEchoInitialized() {
    // True if instance exists and the global flag is set
    return !!echoInstance && window.__ECHO_INITIALIZED === true;
}
