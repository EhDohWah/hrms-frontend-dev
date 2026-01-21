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
              <!-- Profile Picture Preview -->
              <div class="position-relative me-4 flex-shrink-0">
                <div
                  class="d-flex align-items-center justify-content-center avatar avatar-xxl rounded-circle border border-primary text-dark frames overflow-hidden"
                  :class="{ 'border-success': uploadSuccess, 'border-danger': uploadError }">
                  <img v-if="profileImage" :src="profileImage" alt="Profile" class="img-fluid rounded-circle"
                       @error="handleImageError" />
                  <i v-else class="ti ti-photo text-gray-3 fs-16"></i>
                </div>
                <!-- Edit overlay on hover -->
                <div v-if="profileImage && !selectedFile"
                     class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center rounded-circle edit-overlay"
                     @click="triggerFileInput">
                  <i class="ti ti-pencil text-white fs-20"></i>
                </div>
              </div>

              <div class="profile-upload flex-grow-1">
                <!-- File Info Display -->
                <div v-if="selectedFile" class="mb-3 p-3 bg-white rounded border">
                  <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center">
                      <i class="ti ti-file-type-jpg text-primary fs-24 me-2"></i>
                      <div>
                        <p class="mb-0 fw-medium text-truncate" style="max-width: 200px;">{{ selectedFile.name }}</p>
                        <small class="text-muted">{{ formatFileSize(selectedFile.size) }}</small>
                      </div>
                    </div>
                    <button type="button" class="btn btn-sm btn-outline-danger" @click="clearSelectedFile"
                            :disabled="isUploading">
                      <i class="ti ti-x"></i>
                    </button>
                  </div>
                  <!-- Upload Progress -->
                  <div v-if="isUploading" class="mt-2">
                    <div class="progress" style="height: 6px;">
                      <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                           role="progressbar"
                           :style="{ width: uploadProgress + '%' }"
                           :aria-valuenow="uploadProgress"
                           aria-valuemin="0"
                           aria-valuemax="100">
                      </div>
                    </div>
                    <small class="text-muted">Uploading... {{ uploadProgress }}%</small>
                  </div>
                </div>

                <!-- Success/Error Messages -->
                <div v-if="uploadSuccess" class="alert alert-success py-2 mb-3 d-flex align-items-center">
                  <i class="ti ti-circle-check me-2"></i>
                  <span>Profile picture updated successfully!</span>
                </div>
                <div v-if="uploadError" class="alert alert-danger py-2 mb-3 d-flex align-items-center">
                  <i class="ti ti-alert-circle me-2"></i>
                  <span>{{ uploadErrorMessage }}</span>
                </div>

                <!-- Guidelines -->
                <div v-if="!selectedFile" class="mb-3">
                  <p class="fs-12 text-muted mb-1">
                    Recommended image size is 40px x 40px
                  </p>
                  <p class="fs-12 text-muted mb-0">
                    <i class="ti ti-info-circle me-1"></i>
                    Supported formats: JPG, PNG, GIF, WebP (Max: 2MB)
                  </p>
                </div>

                <!-- Action Buttons -->
                <div class="profile-uploader d-flex align-items-center flex-wrap gap-2">
                  <div class="drag-upload-btn btn me-2"
                       :class="selectedFile ? 'btn-outline-primary' : 'btn-primary'">
                    <i class="ti ti-upload me-1"></i> {{ selectedFile ? 'Change File' : 'Select Image' }}
                    <input type="file"
                           ref="fileInput"
                           class="form-control image-sign"
                           accept="image/jpeg,image/png,image/gif,image/webp"
                           @change="handleImageUpload" />
                  </div>
                  <button v-if="selectedFile"
                          class="btn btn-primary"
                          @click="saveProfilePicture"
                          :disabled="isUploading || !selectedFile">
                    <span v-if="isUploading" class="spinner-border spinner-border-sm me-1" role="status"></span>
                    <i v-else class="ti ti-device-floppy me-1"></i>
                    {{ isUploading ? 'Uploading...' : 'Save Picture' }}
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
      // Enhanced upload state
      isUploading: false,
      uploadProgress: 0,
      uploadSuccess: false,
      uploadError: false,
      uploadErrorMessage: '',
      // Validation constants
      maxFileSize: 2 * 1024 * 1024, // 2MB
      allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
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
    /**
     * Validate selected file before upload
     */
    validateFile(file) {
      // Check file type
      if (!this.allowedFileTypes.includes(file.type)) {
        return {
          valid: false,
          error: `Invalid file type. Allowed: JPG, PNG, GIF, WebP`
        };
      }
      // Check file size
      if (file.size > this.maxFileSize) {
        return {
          valid: false,
          error: `File too large. Maximum size is ${this.formatFileSize(this.maxFileSize)}`
        };
      }
      return { valid: true };
    },

    /**
     * Format file size for display
     */
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    /**
     * Trigger file input click programmatically
     */
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    /**
     * Clear selected file and reset state
     */
    clearSelectedFile() {
      this.selectedFile = null;
      this.uploadError = false;
      this.uploadErrorMessage = '';
      this.uploadSuccess = false;
      // Reset file input
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
      // Restore original profile image from store
      const authStore = useAuthStore();
      if (authStore.user?.profile_picture) {
        this.profileImage = `${import.meta.env.VITE_PUBLIC_URL}/storage/${authStore.user.profile_picture}`;
      } else {
        this.profileImage = null;
      }
    },

    /**
     * Handle image error for broken images
     */
    handleImageError(event) {
      const name = this.username || 'User';
      const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      event.target.src = `data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
          <rect fill="#6366f1" width="80" height="80" rx="40"/>
          <text x="50%" y="50%" dy=".35em" fill="white" font-family="Arial" font-size="32" text-anchor="middle">
            ${initials}
          </text>
        </svg>`
      )}`;
    },

    /**
     * Handle file selection with validation
     */
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Reset states
      this.uploadError = false;
      this.uploadErrorMessage = '';
      this.uploadSuccess = false;

      // Validate file
      const validation = this.validateFile(file);
      if (!validation.valid) {
        this.uploadError = true;
        this.uploadErrorMessage = validation.error;
        message.warning(validation.error);
        // Reset file input
        event.target.value = '';
        return;
      }

      this.selectedFile = file;
      this.profileImage = URL.createObjectURL(file);
    },

    /**
     * Save profile picture with progress tracking
     */
    async saveProfilePicture() {
      if (!this.selectedFile) {
        message.warning('Please select an image first');
        return;
      }

      // Reset states
      this.uploadError = false;
      this.uploadErrorMessage = '';
      this.uploadSuccess = false;
      this.isUploading = true;
      this.uploadProgress = 0;

      try {
        // Simulate progress for better UX (since we can't track actual XHR progress easily)
        const progressInterval = setInterval(() => {
          if (this.uploadProgress < 90) {
            this.uploadProgress += 10;
          }
        }, 100);

        const response = await userService.updateProfilePicture(this.selectedFile);

        // Complete progress
        clearInterval(progressInterval);
        this.uploadProgress = 100;

        if (response && response.success) {
          // Refresh global state
          const authStore = useAuthStore();
          await authStore.updateUserData();
          if (!authStore.user) {
            console.error('Failed to update user data in store');
            throw new Error('Failed to update user data');
          }

          // Show success state
          this.uploadSuccess = true;
          message.success('Profile picture updated successfully');

          // Clear success message after 3 seconds
          setTimeout(() => {
            this.uploadSuccess = false;
          }, 3000);
        } else {
          throw new Error(response.message || 'Failed to update profile picture');
        }
      } catch (error) {
        this.uploadError = true;
        this.uploadErrorMessage = error.message || 'Failed to update profile picture';
        message.error(this.uploadErrorMessage);
        console.error('Error updating profile picture:', error);
      } finally {
        this.isUploading = false;
        this.uploadProgress = 0;
        this.selectedFile = null;
        // Reset file input
        if (this.$refs.fileInput) {
          this.$refs.fileInput.value = '';
        }
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

/* Edit overlay for profile picture */
.edit-overlay {
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  cursor: pointer;
  transition: opacity 0.2s ease-in-out;
}

.position-relative:hover .edit-overlay {
  opacity: 1;
}

/* Avatar size consistency */
.avatar-xxl {
  width: 80px;
  height: 80px;
}

.avatar-xxl img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Progress bar animation */
.progress-bar-animated {
  animation: progress-bar-stripes 1s linear infinite;
}

@keyframes progress-bar-stripes {
  0% {
    background-position: 1rem 0;
  }
  100% {
    background-position: 0 0;
  }
}

/* File input overlay styling */
.drag-upload-btn {
  position: relative;
  overflow: hidden;
}

.drag-upload-btn input[type="file"] {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

/* Border color transitions */
.border-success {
  border-color: #198754 !important;
  transition: border-color 0.3s ease;
}

.border-danger {
  border-color: #dc3545 !important;
  transition: border-color 0.3s ease;
}
</style>
