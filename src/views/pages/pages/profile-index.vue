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
          <div class="head-icons ms-2">
            <a href="javascript:void(0);" id="collapse-header" @click="toggleHeader">
              <i class="ti ti-chevrons-up"></i>
            </a>
          </div>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <a-spin :spinning="isLoading">
        <div class="row">
          <!-- Left Column: Profile Picture + Account Info -->
          <div class="col-12 col-lg-4 mb-4">
            <!-- Profile Picture Card -->
            <div class="card mb-4">
              <div class="card-body text-center">
                <div class="profile-avatar-wrap mb-3">
                  <a-avatar :size="100" :src="profileImage" class="profile-avatar">
                    <template #icon>
                      <i class="ti ti-user" style="font-size: 48px;"></i>
                    </template>
                  </a-avatar>
                </div>
                <h5 class="mb-1">{{ username || 'User' }}</h5>
                <p class="text-muted mb-3">{{ email }}</p>
                <div class="d-flex flex-column align-items-center gap-2">
                  <div class="upload-btn-wrap">
                    <a-button @click="triggerFileInput">
                      <i class="ti ti-upload me-1"></i> Choose Photo
                    </a-button>
                    <input
                      ref="fileInput"
                      type="file"
                      accept="image/*"
                      class="d-none"
                      @change="handleImageUpload"
                    />
                  </div>
                  <a-button
                    v-if="selectedFile"
                    type="primary"
                    :loading="savingPicture"
                    @click="saveProfilePicture"
                  >
                    <i class="ti ti-device-floppy me-1"></i> Save Picture
                  </a-button>
                  <span v-if="selectedFile" class="text-muted small">{{ selectedFile.name }}</span>
                </div>
                <p class="text-muted small mt-3 mb-0">Max file size: 2MB. Supported: JPG, PNG</p>
              </div>
            </div>

            <!-- Account Info Card -->
            <div class="card">
              <div class="card-header">
                <h6 class="card-title mb-0">
                  <i class="ti ti-user-circle me-2"></i>Account Information
                </h6>
              </div>
              <div class="card-body">
                <!-- Username -->
                <div class="mb-4">
                  <label class="form-label fw-medium">Username</label>
                  <div class="d-flex gap-2">
                    <a-input
                      v-model:value="username"
                      placeholder="Enter your username"
                      :maxlength="255"
                      class="flex-grow-1"
                    >
                      <template #prefix>
                        <i class="ti ti-user text-muted"></i>
                      </template>
                    </a-input>
                    <a-button type="primary" :loading="savingUsername" @click="saveUsername">
                      Save
                    </a-button>
                  </div>
                </div>

                <!-- Email -->
                <div>
                  <label class="form-label fw-medium">Email Address</label>
                  <div class="d-flex gap-2">
                    <a-input
                      v-model:value="email"
                      placeholder="Enter your email"
                      type="email"
                      class="flex-grow-1"
                    >
                      <template #prefix>
                        <i class="ti ti-mail text-muted"></i>
                      </template>
                    </a-input>
                    <a-button type="primary" :loading="savingEmail" @click="saveEmail">
                      Save
                    </a-button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Change Password -->
          <div class="col-12 col-lg-8 mb-4">
            <div class="card h-100">
              <div class="card-header">
                <h6 class="card-title mb-0">
                  <i class="ti ti-lock me-2"></i>Change Password
                </h6>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-12 col-md-8 col-lg-6">
                    <!-- Current Password -->
                    <div class="mb-3">
                      <label class="form-label fw-medium">Current Password</label>
                      <a-input-password
                        v-model:value="currentPassword"
                        placeholder="Enter current password"
                        :status="passwordErrors.currentPassword ? 'error' : ''"
                      >
                        <template #prefix>
                          <i class="ti ti-lock text-muted"></i>
                        </template>
                      </a-input-password>
                      <div v-if="passwordErrors.currentPassword" class="error-feedback">
                        {{ passwordErrors.currentPassword }}
                      </div>
                    </div>

                    <!-- New Password -->
                    <div class="mb-3">
                      <label class="form-label fw-medium">New Password</label>
                      <a-input-password
                        v-model:value="newPassword"
                        placeholder="Enter new password"
                        :status="passwordErrors.newPassword ? 'error' : ''"
                      >
                        <template #prefix>
                          <i class="ti ti-lock text-muted"></i>
                        </template>
                      </a-input-password>
                      <div v-if="passwordErrors.newPassword" class="error-feedback">
                        {{ passwordErrors.newPassword }}
                      </div>
                    </div>

                    <!-- Confirm Password -->
                    <div class="mb-4">
                      <label class="form-label fw-medium">Confirm New Password</label>
                      <a-input-password
                        v-model:value="confirmPassword"
                        placeholder="Confirm new password"
                        :status="passwordErrors.confirmPassword ? 'error' : ''"
                      >
                        <template #prefix>
                          <i class="ti ti-lock text-muted"></i>
                        </template>
                      </a-input-password>
                      <div v-if="passwordErrors.confirmPassword" class="error-feedback">
                        {{ passwordErrors.confirmPassword }}
                      </div>
                    </div>

                    <a-button type="primary" :loading="savingPassword" @click="savePassword" block>
                      <i class="ti ti-device-floppy me-1"></i> Update Password
                    </a-button>
                  </div>

                  <!-- Password Requirements -->
                  <div class="col-12 col-md-4 col-lg-6 mt-4 mt-md-0">
                    <div class="password-requirements">
                      <div class="req-header">
                        <i class="ti ti-shield-check me-1"></i> Password Requirements
                      </div>
                      <ul class="req-list">
                        <li :class="{ met: newPassword.length >= 8 }">
                          <i class="ti" :class="newPassword.length >= 8 ? 'ti-check' : 'ti-point'"></i>
                          At least 8 characters
                        </li>
                        <li :class="{ met: /[A-Z]/.test(newPassword) }">
                          <i class="ti" :class="/[A-Z]/.test(newPassword) ? 'ti-check' : 'ti-point'"></i>
                          One uppercase letter
                        </li>
                        <li :class="{ met: /[a-z]/.test(newPassword) }">
                          <i class="ti" :class="/[a-z]/.test(newPassword) ? 'ti-check' : 'ti-point'"></i>
                          One lowercase letter
                        </li>
                        <li :class="{ met: /\d/.test(newPassword) }">
                          <i class="ti" :class="/\d/.test(newPassword) ? 'ti-check' : 'ti-point'"></i>
                          One number
                        </li>
                        <li :class="{ met: /[@$!%*?&]/.test(newPassword) }">
                          <i class="ti" :class="/[@$!%*?&]/.test(newPassword) ? 'ti-check' : 'ti-point'"></i>
                          One special character (@$!%*?&)
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-spin>
    </div>
    <layout-footer></layout-footer>
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
      text: "Dashboard",
      text1: "Profile",
      username: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      profileImage: null,
      selectedFile: null,
      isLoading: false,
      savingPicture: false,
      savingUsername: false,
      savingEmail: false,
      savingPassword: false,
      passwordErrors: {},
    };
  },

  mounted() {
    this.fetchUserDetails();
    this.initProfileListener();
    window.addEventListener('profile-updated', this.handleProfileUpdate);
  },

  beforeUnmount() {
    window.removeEventListener('profile-updated', this.handleProfileUpdate);
  },

  methods: {
    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    initProfileListener() {
      const authStore = useAuthStore();
      if (authStore.user?.id) {
        initProfileUpdateListener(authStore.user.id);
      }
    },

    handleProfileUpdate(event) {
      const { updateType, data, message: eventMessage } = event.detail;
      switch (updateType) {
        case 'name':
          if (data?.name) this.username = data.name;
          break;
        case 'email':
          if (data?.email) this.email = data.email;
          break;
        case 'profile_picture':
          if (data?.profile_picture) {
            this.profileImage = `${import.meta.env.VITE_PUBLIC_URL}/storage/${data.profile_picture}`;
          }
          break;
      }
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
        if (file.size > 2 * 1024 * 1024) {
          message.warning('File size must be less than 2MB');
          return;
        }
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
        this.savingPicture = true;
        const response = await userService.updateProfilePicture(this.selectedFile);
        if (response && response.success) {
          const authStore = useAuthStore();
          await authStore.updateUserData();

          // Update profile image to server URL with cache-busting (replace stale blob URL)
          if (authStore.user?.profile_picture) {
            const t = authStore.user.profile_picture_updated_at || Date.now();
            this.profileImage = `${import.meta.env.VITE_PUBLIC_URL}/storage/${authStore.user.profile_picture}?t=${t}`;
          }

          message.success('Profile picture updated successfully');
          this.selectedFile = null;
        } else {
          throw new Error(response.message || 'Failed to update profile picture');
        }
      } catch (error) {
        message.error(error.message || 'Failed to update profile picture');
        console.error('Error updating profile picture:', error);
      } finally {
        this.savingPicture = false;
      }
    },

    async saveUsername() {
      if (!this.username.trim()) {
        message.warning('Username cannot be empty');
        return;
      }
      try {
        this.savingUsername = true;
        const response = await userService.updateUsername(this.username);
        if (response && response.success) {
          const authStore = useAuthStore();
          await authStore.updateUserData();
          message.success('Username updated successfully');
        } else {
          throw new Error(response.message || 'Failed to update username');
        }
      } catch (error) {
        message.error(error.message || 'Failed to update username');
        console.error('Error updating username:', error);
      } finally {
        this.savingUsername = false;
      }
    },

    async saveEmail() {
      if (!this.email.trim()) {
        message.warning('Email cannot be empty');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        message.warning('Please enter a valid email address');
        return;
      }
      try {
        this.savingEmail = true;
        const response = await userService.updateEmail(this.email);
        if (response && response.success) {
          const authStore = useAuthStore();
          await authStore.updateUserData();
          message.success('Email updated successfully');
        } else {
          throw new Error(response.message || 'Failed to update email');
        }
      } catch (error) {
        message.error(error.message || 'Failed to update email');
        console.error('Error updating email:', error);
      } finally {
        this.savingEmail = false;
      }
    },

    async savePassword() {
      this.passwordErrors = {};
      let hasError = false;

      if (!this.currentPassword) {
        this.passwordErrors.currentPassword = 'Current password is required';
        hasError = true;
      }
      if (!this.newPassword) {
        this.passwordErrors.newPassword = 'New password is required';
        hasError = true;
      } else if (this.newPassword.length < 8) {
        this.passwordErrors.newPassword = 'Password must be at least 8 characters';
        hasError = true;
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(this.newPassword)) {
        this.passwordErrors.newPassword = 'Password must include uppercase, lowercase, number, and special character';
        hasError = true;
      }
      if (!this.confirmPassword) {
        this.passwordErrors.confirmPassword = 'Please confirm your new password';
        hasError = true;
      } else if (this.newPassword !== this.confirmPassword) {
        this.passwordErrors.confirmPassword = 'Passwords do not match';
        hasError = true;
      }

      if (hasError) {
        message.warning('Please fix the errors before submitting');
        return;
      }

      try {
        this.savingPassword = true;
        const response = await userService.updatePassword({
          current_password: this.currentPassword,
          new_password: this.newPassword,
          confirm_password: this.confirmPassword,
        });
        if (response && response.success) {
          message.success(response.message || 'Password updated successfully');
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
          this.passwordErrors = {};
        } else {
          throw new Error(response.error || 'Failed to update password');
        }
      } catch (error) {
        if (error.errors) {
          Object.keys(error.errors).forEach(field => {
            if (Array.isArray(error.errors[field]) && error.errors[field].length > 0) {
              const mappedField = field === 'current_password' ? 'currentPassword'
                : field === 'new_password' ? 'newPassword'
                : field === 'confirm_password' ? 'confirmPassword' : field;
              this.passwordErrors[mappedField] = error.errors[field][0];
            }
          });
        }
        message.error(error.message || 'Failed to update password');
        console.error('Error updating password:', error);
      } finally {
        this.savingPassword = false;
      }
    },
  },
};
</script>

<style scoped>
.profile-avatar-wrap {
  display: inline-block;
  position: relative;
}

.profile-avatar {
  border: 3px solid #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.upload-btn-wrap {
  position: relative;
}

.error-feedback {
  margin-top: 4px;
  font-size: 0.875em;
  color: #ff4d4f;
  font-weight: 500;
}

.password-requirements {
  background-color: #f8f9fb;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
}

.password-requirements .req-header {
  background-color: #f0f5ff;
  border-bottom: 1px solid #d6e4ff;
  padding: 10px 16px;
  font-weight: 600;
  font-size: 14px;
  color: #1a1a2e;
}

.password-requirements .req-list {
  list-style: none;
  padding: 12px 16px;
  margin: 0;
}

.password-requirements .req-list li {
  padding: 5px 0;
  font-size: 13px;
  color: #8c8c8c;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s;
}

.password-requirements .req-list li.met {
  color: #52c41a;
}

.password-requirements .req-list li.met i {
  color: #52c41a;
}

.card-header {
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  padding: 16px 24px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
}

.gap-2 {
  gap: 0.5rem;
}
</style>
