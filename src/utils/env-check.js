// This file helps debug environment variable issues

export function checkEnvironment() {
  console.log('Environment:', process.env.NODE_ENV);
  console.log('API Base URL:', process.env.VUE_APP_API_BASE_URL);
  console.log('Environment Type:', process.env.VUE_APP_ENV);
  
  if (!process.env.VUE_APP_API_BASE_URL) {
    console.warn('WARNING: VUE_APP_API_BASE_URL is not defined!');
    console.warn('Using fallback URL instead.');
  }
}

// Call this function in your main.js or App.vue to verify environment variables 