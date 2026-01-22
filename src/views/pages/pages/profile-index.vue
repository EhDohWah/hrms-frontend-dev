<template>
  <layout-sidebar></layout-sidebar>
  <layout-header></layout-header>
  <!-- Page Wrapper -->
  <div class="page-wrapper">
    <div class="content">
      <!-- Breadcrumb -->
      <div class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
        <index-breadcrumb :title="title" :text="text" :text1="text1" />

        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div class="dropdown me-2 mb-2">
            <a href="javascript:void(0);" class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
              data-bs-toggle="dropdown">
              <i class="ti ti-bell me-1"></i>Notifications
              <span class="badge bg-danger rounded-pill ms-1">3</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end p-3">
              <li>
                <a href="javascript:void(0);" class="dropdown-item rounded-1">
                  <i class="ti ti-user-check me-1"></i>Profile updated successfully
                </a>
              </li>
              <li>
                <a href="javascript:void(0);" class="dropdown-item rounded-1">
                  <i class="ti ti-mail me-1"></i>Email verification sent
                </a>
              </li>
              <li>
                <a href="javascript:void(0);" class="dropdown-item rounded-1">
                  <i class="ti ti-shield-lock me-1"></i>Password changed successfully
                </a>
              </li>
            </ul>
          </div>

          <div class="head-icons ms-2">
            <a href="javascript:void(0);" class="" data-bs-toggle="tooltip" data-bs-placement="top"
              data-bs-original-title="Collapse" id="collapse-header" @click="toggleHeader">
              <i class="ti ti-chevrons-up"></i>
            </a>
          </div>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <div class="card">
        <div class="card-body">
          <!-- Loading Overlay -->
          <div v-if="isLoading"
            class="position-absolute w-100 h-100 top-0 start-0 bg-white bg-opacity-75 d-flex align-items-center justify-content-center"
            style="z-index: 10; left: 0;">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <div class="border-bottom mb-4 pb-3">
            <h4>Profile</h4>
          </div>

          <!-- Profile Picture Section -->
          <div class="border-bottom mb-4 pb-4">
            <h6 class="mb-3 text-primary">Profile Picture</h6>
            <div class="d-flex align-items-center flex-wrap row-gap-3 bg-light w-100 rounded p-4">
              <div
                class="d-flex align-items-center justify-content-center avatar avatar-xxl rounded-circle border border-primary me-4 flex-shrink-0 text-dark frames">
                <img v-if="profileImage" :src="profileImage" alt="Profile" class="img-fluid rounded-circle" />
                <i v-else class="ti ti-photo text-gray-3 fs-16"></i>
              </div>
              <div class="profile-upload">
                <div class="mb-3">
                  <p class="fs-12 text-muted">
                    Recommended image size is 40px x 40px
                  </p>
                </div>
                <div class="profile-uploader d-flex align-items-center">
                  <div class="drag-upload-btn btn btn-primary me-3">
                    <i class="ti ti-upload me-1"></i> Upload
                    <input type="file" class="form-control image-sign" @change="handleImageUpload" />
                  </div>
                  <button class="btn btn-primary" @click="saveProfilePicture" :disabled="isLoading">
                    <i class="ti ti-device-floppy me-1"></i> Save Picture
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Username, Email, and Change Password in two equal columns -->
          <div class="border-bottom mb-4 pb-4">
            <div class="row">
              <!-- Left column: Username & Email -->
              <div class="col-12 col-md-6 mb-4 mb-md-0">
                <!-- Username Section -->
                <h6 class="mb-3 text-primary">Username</h6>
                <div class="input-group mb-4">
                  <span class="input-group-text bg-light">
                    <i class="ti ti-user"></i>
                  </span>
                  <input type="text" class="form-control" v-model="username" placeholder="Enter your username" />
                  <button class="btn btn-primary" @click="saveUsername" :disabled="isLoading">
                    <i class="ti ti-device-floppy me-1"></i> Save
                  </button>
                </div>

                <!-- Email Section -->
                <h6 class="mb-3 text-primary">Email</h6>
                <div class="input-group">
                  <span class="input-group-text bg-light">
                    <i class="ti ti-mail"></i>
                  </span>
                  <input type="email" class="form-control" v-model="email" placeholder="Enter your email" />
                  <button class="btn btn-primary" @click="saveEmail" :disabled="isLoading">
                    <i class="ti ti-device-floppy me-1"></i> Save
                  </button>
                </div>
              </div>

              <!-- Right column: Change Password -->
              <div class="col-12 col-md-6">
                <h6 class="mb-3 text-primary">Change Password</h6>
                <div class="card shadow-sm border">
                  <div class="card-body">
                    <div class="mb-3">
                      <label class="form-label">Current Password</label>
                      <div class="input-group">
                        <span class="input-group-text bg-light">
                          <i class="ti ti-lock"></i>
                        </span>
                        <input :type="showPassword ? 'text' : 'password'" class="form-control" v-model="currentPassword"
                          placeholder="Enter current password" />
                        <span @click="toggleShow" class="input-group-text bg-light cursor-pointer">
                          <i class="ti" :class="{
                            'ti-eye': showPassword,
                            'ti-eye-off': !showPassword
                          }"></i>
                        </span>
                      </div>
                    </div>

                    <div class="mb-3">
                      <label class="form-label">New Password</label>
                      <div class="input-group">
                        <span class="input-group-text bg-light">
                          <i class="ti ti-lock"></i>
                        </span>
                        <input :type="showPassword1 ? 'text' : 'password'" class="form-control" v-model="newPassword"
                          placeholder="Enter new password" />
                        <span @click="toggleShow1" class="input-group-text bg-light cursor-pointer">
                          <i class="ti" :class="{
                            'ti-eye': showPassword1,
                            'ti-eye-off': !showPassword1
                          }"></i>
                        </span>
                      </div>
                    </div>

                    <div class="mb-3">
                      <label class="form-label">Confirm Password</label>
                      <div class="input-group">
                        <span class="input-group-text bg-light">
                          <i class="ti ti-lock"></i>
                        </span>
                        <input :type="showPassword2 ? 'text' : 'password'" class="form-control"
                          v-model="confirmPassword" placeholder="Confirm new password" />
                        <span @click="toggleShow2" class="input-group-text bg-light cursor-pointer">
                          <i class="ti" :class="{
                            'ti-eye': showPassword2,
                            'ti-eye-off': !showPassword2
                          }"></i>
                        </span>
                      </div>
                    </div>

                    <button class="btn btn-primary w-100" @click="savePassword" :disabled="isLoading">
                      <i class="ti ti-device-floppy me-1"></i> Save Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- End of two-column row -->
        </div>
      </div>
    </div>
    <div class="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
      <p class="mb-0">2014 - 2025 &copy; SmartHR.</p>
      <p>
        Designed &amp; Developed By
        <a href="javascript:void(0);" class="text-primary">Dreams</a>
      </p>
    </div>
  </div>
  <!-- /Page Wrapper -->
</template>

<script>
import { userService } from '@/services/user.service';
import { useAuthStore } from '@/stores/authStore';
import { message } from 'ant-design-vue';
import { initProfileUpdateListener } from '@/plugins/echo';

export default {
  data() {
    return {
      title: "Profile",
      text: "Pages",
      text1: "Profile",
      showPassword: false,
      showPassword1: false,
      showPassword2: false,
      username: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      profileImage: null,
      selectedFile: null,
      isLoading: false,
    };
  },

  mounted() {
    this.fetchUserDetails();
    this.initProfileListener();

    // Listen for profile updates from other tabs or WebSocket
    window.addEventListener('profile-updated', this.handleProfileUpdate);
  },

  beforeUnmount() {
    // Cleanup event listener
    window.removeEventListener('profile-updated', this.handleProfileUpdate);
  },
  
  methods: {
    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },
    toggleShow() {
      this.showPassword = !this.showPassword;
    },
    toggleShow1() {
      this.showPassword1 = !this.showPassword1;
    },
    toggleShow2() {
      this.showPassword2 = !this.showPassword2;
    },
    /**
     * Initialize profile update listener for real-time updates
     */
    initProfileListener() {
      const authStore = useAuthStore();
      if (authStore.user?.id) {
        initProfileUpdateListener(authStore.user.id);
      }
    },
    /**
     * Handle profile update events from WebSocket or other tabs
     */
    handleProfileUpdate(event) {
      const { updateType, data, message: eventMessage } = event.detail;

      // Update local form fields based on update type
      switch (updateType) {
        case 'name':
          if (data?.name) {
            this.username = data.name;
          }
          break;
        case 'email':
          if (data?.email) {
            this.email = data.email;
          }
          break;
        case 'profile_picture':
          if (data?.profile_picture) {
            this.profileImage = `${import.meta.env.VITE_PUBLIC_URL}/storage/${data.profile_picture}`;
          }
          break;
      }

      // Show notification if message provided
      if (eventMessage) {
        message.success(eventMessage);
      }
    },
    async fetchUserDetails() {
      try {
        this.isLoading = true;
        const response = await userService.getCurrentUser();
        if (response && response.data) {
          const userData = response.data;
          this.username = userData.name || "";
          this.email = userData.email || "";
          if (userData.profile_picture) {
            this.profileImage = `${import.meta.env.VITE_PUBLIC_URL}/storage/${userData.profile_picture}`;
          }
        }
      } catch (error) {
        message.error('Failed to load user details');
        console.error('Error fetching user details:', error);
      } finally {
        this.isLoading = false;
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        this.profileImage = URL.createObjectURL(file);
      }
    },

    async saveProfilePicture() {
      if (!this.selectedFile) {
        message.warning('Please select an image first');
        return;
      }

      try {
        this.isLoading = true;
        const response = await userService.updateProfilePicture(this.selectedFile);

        if (response && response.success) {
          // Refresh global state
          const authStore = useAuthStore();
          await authStore.updateUserData();
          if (!authStore.user) {
            console.error('Failed to update user data in store');
            throw new Error('Failed to update user data');
          }
          // Note: Real-time notification will be received via WebSocket
          message.success('Profile picture updated successfully');
        } else {
          throw new Error(response.message || 'Failed to update profile picture');
        }
      } catch (error) {
        message.error(error.message || 'Failed to update profile picture');
        console.error('Error updating profile picture:', error);
      } finally {
        this.isLoading = false;
        this.selectedFile = null;
      }
    },

    async saveUsername() {
      if (!this.username.trim()) {
        message.warning('Username cannot be empty');
        return;
      }

      try {
        this.isLoading = true;
        const response = await userService.updateUsername(this.username);

        if (response && response.success) {
          // Refresh global state
          const authStore = useAuthStore();
          await authStore.updateUserData();
          // Note: Real-time notification will be received via WebSocket
          message.success('Username updated successfully');
        } else {
          throw new Error(response.message || 'Failed to update username');
        }
      } catch (error) {
        message.error(error.message || 'Failed to update username');
        console.error('Error updating username:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async saveEmail() {
      if (!this.email.trim()) {
        message.warning('Email cannot be empty');
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        message.warning('Please enter a valid email address');
        return;
      }

      try {
        this.isLoading = true;
        const response = await userService.updateEmail(this.email);

        if (response && response.success) {
          // Refresh global state
          const authStore = useAuthStore();
          await authStore.updateUserData();
          // Note: Real-time notification will be received via WebSocket
          message.success('Email updated successfully');
        } else {
          throw new Error(response.message || 'Failed to update email');
        }
      } catch (error) {
        message.error(error.message || 'Failed to update email');
        console.error('Error updating email:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async savePassword() {
      // Validate password fields
      if (!this.currentPassword) {
        message.warning('Current password is required');
        return;
      }

      if (!this.newPassword) {
        message.warning('New password is required');
        return;
      }

      if (this.newPassword.length < 6) {
        message.warning('New password must be at least 6 characters');
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        message.warning('New password and confirmation do not match');
        return;
      }

      try {
        this.isLoading = true;
        const passwordData = {
          current_password: this.currentPassword,
          new_password: this.newPassword,
          confirm_password: this.confirmPassword
        };

        const response = await userService.updatePassword(passwordData);

        if (response && response.success) {
          // Note: Real-time notification will be received via WebSocket
          message.success(response.message || 'Password updated successfully');
          // Clear password fields after successful update
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
        } else {
          throw new Error(response.error || 'Failed to update password');
        }
      } catch (error) {
        message.error(error.message || 'Failed to update password');
        console.error('Error updating password:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
