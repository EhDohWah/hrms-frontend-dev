// This file helps debug environment variable issues

export function checkEnvironment() {
  console.log('Environment:', process.env.NODE_ENV);
  console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
  console.log('Environment Type:', import.meta.env.VITE_ENV);
  
  if (!import.meta.env.VITE_API_BASE_URL) {
    console.warn('WARNING: VUE_APP_API_BASE_URL is not defined!');
    console.warn('Using fallback URL instead.');
  }
}

// Call this function in your main.js or App.vue to verify environment variables 