<template>
  <div id="app">
    <div class="main-wrapper">
      <router-view />
    </div>
    
    <!-- Permission Error Toast -->
    <div 
      v-if="permissionError.show" 
      class="permission-toast-container"
    >
      <div class="permission-toast alert alert-warning d-flex align-items-center" role="alert">
        <i class="ti ti-lock me-2"></i>
        <div>
          <strong>Permission Denied</strong>
          <p class="mb-0 small">{{ permissionError.message }}</p>
        </div>
        <button 
          type="button" 
          class="btn-close ms-auto" 
          @click="permissionError.show = false"
          aria-label="Close"
        ></button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      permissionError: {
        show: false,
        message: '',
        timer: null
      }
    };
  },
  mounted() {
    // Set data-layout attribute for CSS selectors to work (matching original template)
    document.documentElement.setAttribute('data-layout', 'default');
    
    // Listen for permission denied events from API service
    window.addEventListener('permission-denied', this.handlePermissionDenied);
  },
  beforeUnmount() {
    window.removeEventListener('permission-denied', this.handlePermissionDenied);
    if (this.permissionError.timer) {
      clearTimeout(this.permissionError.timer);
    }
  },
  methods: {
    handlePermissionDenied(event) {
      const { message } = event.detail;
      
      // Clear existing timer
      if (this.permissionError.timer) {
        clearTimeout(this.permissionError.timer);
      }
      
      // Show the error
      this.permissionError.message = message || "You don't have permission to perform this action";
      this.permissionError.show = true;
      
      // Auto-hide after 5 seconds
      this.permissionError.timer = setTimeout(() => {
        this.permissionError.show = false;
      }, 5000);
    }
  }
};
</script>

<style scoped>
.permission-toast-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 9999;
  max-width: 400px;
}

.permission-toast {
  background-color: #fff3cd;
  border: 1px solid #ffecb5;
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
