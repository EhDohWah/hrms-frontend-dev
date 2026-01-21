/**
 * EventBus Composable
 * Provides easy access to the global event bus using Vue 3 Composition API
 */

import { inject } from 'vue';

export function useEventBus() {
    const eventBus = inject('eventBus');

    if (!eventBus) {
        throw new Error('EventBus not provided! Make sure it\'s provided in main.js');
    }

    return {
        // Emit an event
        emit: (event, ...args) => eventBus.emit(event, ...args),

        // Listen to an event
        on: (event, handler) => eventBus.on(event, handler),

        // Listen to an event once
        once: (event, handler) => {
            const onceHandler = (...args) => {
                handler(...args);
                eventBus.off(event, onceHandler);
            };
            eventBus.on(event, onceHandler);
        },

        // Remove event listener
        off: (event, handler) => eventBus.off(event, handler),

        // Remove all listeners for an event
        clear: (event) => eventBus.all.delete(event),

        // Get the raw eventBus instance if needed
        eventBus
    };
}

// For Options API components, you can also use inject directly:
// export default {
//   inject: ['eventBus'],
//   methods: {
//     handleSomething() {
//       this.eventBus.emit('someEvent', data);
//     }
//   }
// }
