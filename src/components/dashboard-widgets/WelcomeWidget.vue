<template>
  <div class="welcome-widget">
    <div class="row align-items-center">
      <div class="col-md-8">
        <div class="d-flex align-items-center">
          <div class="avatar avatar-xl me-3">
            <img 
              :src="userAvatar" 
              :alt="userName"
              class="rounded-circle"
              @error="handleAvatarError"
            >
          </div>
          <div>
            <h4 class="mb-1">{{ greeting }}, {{ userName }}!</h4>
            <p class="text-muted mb-0">{{ userRole }}</p>
            <small class="text-muted">{{ currentDate }}</small>
          </div>
        </div>
      </div>
      <div class="col-md-4 text-md-end mt-3 mt-md-0">
        <div class="welcome-stats">
          <div class="stat-item">
            <i class="ti ti-clock me-1"></i>
            <span>{{ lastLogin }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WelcomeWidget',
  props: {
    widget: {
      type: Object,
      default: () => ({}),
    },
    config: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      defaultAvatar: require('@/assets/img/profiles/avatar-default.jpg'),
    };
  },
  computed: {
    userName() {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.name || 'User';
    },
    userRole() {
      const role = localStorage.getItem('userRole') || '';
      return role.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    },
    userAvatar() {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.profile_picture || this.defaultAvatar;
    },
    greeting() {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good Morning';
      if (hour < 17) return 'Good Afternoon';
      return 'Good Evening';
    },
    currentDate() {
      return new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
    lastLogin() {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.last_login_at) {
        return new Date(user.last_login_at).toLocaleString();
      }
      return 'First login';
    },
  },
  methods: {
    handleAvatarError(e) {
      e.target.src = this.defaultAvatar;
    },
  },
};
</script>

<style scoped>
.welcome-widget {
  padding: 0.5rem 0;
}

.avatar-xl {
  width: 64px;
  height: 64px;
}

.avatar-xl img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.stat-item {
  display: inline-flex;
  align-items: center;
  color: #6c757d;
  font-size: 0.875rem;
}
</style>
