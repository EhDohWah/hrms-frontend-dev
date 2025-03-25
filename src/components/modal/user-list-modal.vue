  <template>
    <!-- Add Users -->
    <div class="modal fade" id="add_users">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">Add User</h4>
            <button
              type="button"
              class="btn-close custom-btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <i class="ti ti-x"></i>
            </button>
          </div>
          <!-- Alert Message -->
          <div v-if="alertMessage" class="alert" :class="alertClass" role="alert">
            {{ alertMessage }}
          </div>
          <form @submit.prevent="submitNewUser" enctype="multipart/form-data">
            <div class="modal-body pb-0">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Name</label>
                    <input type="text" class="form-control" v-model="newUser.name" required />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" v-model="newUser.email" required />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Password</label>
                    <div class="pass-group position-relative">
                      <input 
                        :type="showNewPassword ? 'text' : 'password'" 
                        class="pass-input form-control" 
                        v-model="newUser.password" 
                        required 
                      />
                      <span 
                        class="ti position-absolute top-50 end-0 translate-middle-y me-2" 
                        :class="showNewPassword ? 'ti-eye' : 'ti-eye-off'"
                        @click="showNewPassword = !showNewPassword"
                        style="cursor: pointer;"
                      ></span>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Confirm Password</label>
                    <div class="pass-group position-relative">
                      <input 
                        :type="showNewConfirmPassword ? 'text' : 'password'" 
                        class="pass-inputs form-control" 
                        v-model="newUser.password_confirmation" 
                        required 
                      />
                      <span 
                        class="ti position-absolute top-50 end-0 translate-middle-y me-2" 
                        :class="showNewConfirmPassword ? 'ti-eye' : 'ti-eye-off'"
                        @click="showNewConfirmPassword = !showNewConfirmPassword"
                        style="cursor: pointer;"
                      ></span>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Profile Picture</label>
                    <input type="file" class="form-control" @change="handleFileUpload" accept="image/*" />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Role</label>
                    <vue-select
                      :options="roles"
                      v-model="newUser.role"
                      id="roleseleuser"
                      placeholder="Select"
                      required
                      @update:modelValue="updatePermissionsByRole"
                    />
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="card">
                    <div class="card-body p-0">
                      <div class="table-responsive">
                        <table class="table">
                          <thead class="thead-light">
                            <tr>
                              <th>Module Permissions</th>
                              <th>Create</th>
                              <th>Read</th>
                              <th>Update</th>
                              <th>Delete</th>
                              <th>Import</th>
                              <th>Export</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(actions, module) in modules" :key="module">
                              <td>
                                <h6 class="fs-14 fw-normal text-gray-9">{{ formatModuleName(module) }}</h6>
                              </td>
                              <td v-for="action in actions" :key="`${module}.${action}`">
                                <div class="form-check form-check-md">
                                  <input 
                                    class="form-check-input" 
                                    type="checkbox" 
                                    :value="`${module}.${action}`"
                                    v-model="newUser.permissions"
                                  />
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-white border me-2"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" :disabled="loading">
                {{ loading ? 'Adding...' : 'Add User' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- /Add Users -->

    <!-- Edit Users -->
    <div class="modal fade" id="edit_user">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">Edit User</h4>
            <button
              type="button"
              class="btn-close custom-btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <i class="ti ti-x"></i>
            </button>
          </div>
          <!-- Alert Message -->
          <div v-if="alertMessage" class="alert" :class="alertClass" role="alert">
            {{ alertMessage }}
          </div>
          <form @submit.prevent="updateExistingUser" enctype="multipart/form-data">
            <div class="modal-body pb-0">
              <div class="row">
                <div class="col-md-12">
                  <div class="mb-3">
                    <label class="form-label">Role</label>
                    <vue-select
                      :options="roles"
                      v-model="editUser.role"
                      id="roleedituser"
                      placeholder="Select"
                      required
                      @update:modelValue="updateEditPermissionsByRole"
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Password</label>
                    <div class="pass-group position-relative">
                      <input 
                        :type="showEditPassword ? 'text' : 'password'" 
                        class="pass-inputs form-control" 
                        v-model="editUser.password" 
                        placeholder="Enter new password" 
                      />
                      <span 
                        class="ti position-absolute top-50 end-0 translate-middle-y me-2" 
                        :class="showEditPassword ? 'ti-eye' : 'ti-eye-off'"
                        @click="showEditPassword = !showEditPassword"
                        style="cursor: pointer;"
                      ></span>
                    </div>
                    <small class="text-muted">Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.</small>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Confirm Password</label>
                    <div class="pass-group position-relative">
                      <input 
                        :type="showEditConfirmPassword ? 'text' : 'password'" 
                        class="pass-inputs form-control" 
                        v-model="editUser.password_confirmation" 
                        placeholder="Confirm new password" 
                      />
                      <span 
                        class="ti position-absolute top-50 end-0 translate-middle-y me-2" 
                        :class="showEditConfirmPassword ? 'ti-eye' : 'ti-eye-off'"
                        @click="showEditConfirmPassword = !showEditConfirmPassword"
                        style="cursor: pointer;"
                      ></span>
                    </div>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="card">
                    <div class="card-body p-0">
                      <div class="table-responsive">
                        <table class="table">
                          <thead class="thead-light">
                            <tr>
                              <th>Module Permissions</th>
                              <th>Create</th>
                              <th>Read</th>
                              <th>Update</th>
                              <th>Delete</th>
                              <th>Import</th>
                              <th>Export</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(actions, module) in modules" :key="module">
                              <td>
                                <h6 class="fs-14 fw-normal text-gray-9">{{ formatModuleName(module) }}</h6>
                              </td>
                              <td v-for="action in actions" :key="`${module}.${action}`">
                                <div class="form-check form-check-md">
                                  <input 
                                    class="form-check-input" 
                                    type="checkbox" 
                                    :value="`${module}.${action}`"
                                    v-model="editUser.permissions"
                                  />
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-white border me-2"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" :disabled="loading">
                {{ loading ? 'Updating...' : 'Update User' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- /Edit Users -->

    <!-- Delete Modal -->
    <div class="modal fade" id="delete_modal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body text-center">
            <span class="avatar avatar-xl bg-transparent-danger text-danger mb-3">
              <i class="ti ti-trash-x fs-36"></i>
            </span>
            <h4 class="mb-1">Confirm Delete</h4>
            <p class="mb-3">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div class="d-flex justify-content-center">
              <button
                type="button"
                class="btn btn-light me-3"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button 
                type="button" 
                class="btn btn-danger"
                @click="deleteUser"
                :disabled="loading"
              >
                {{ loading ? 'Deleting...' : 'Yes, Delete' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- /Delete Modal -->
  </template>
  <script>
  import { useAdminStore } from '@/stores/adminStore';
  

  export default {
    name: 'UserListModal',
    emits: ['user-added', 'user-updated', 'user-deleted'],
    data() {
      return {
        adminStore: null,
        loading: false,
        showNewPassword: false,
        showNewConfirmPassword: false,
        showEditPassword: false,
        showEditConfirmPassword: false,
        alertMessage: '',
        alertClass: '',
        userToDelete: null,
        roles: ["admin", "hr-manager", "hr-assistant", "employee"],
        modules: {
          admin: ['create', 'read', 'update', 'delete', 'import', 'export'],
          user: ['create', 'read', 'update', 'delete', 'import', 'export'],
          grant: ['create', 'read', 'update', 'delete', 'import', 'export'],
          interview: ['create', 'read', 'update', 'delete', 'import', 'export'],
          employee: ['create', 'read', 'update', 'delete', 'import', 'export'],
          employment: ['create', 'read', 'update', 'delete', 'import', 'export'],
          employment_history: ['create', 'read', 'update', 'delete', 'import', 'export'],
          children: ['create', 'read', 'update', 'delete', 'import', 'export'],
          questionnaire: ['create', 'read', 'update', 'delete', 'import', 'export'],
          language: ['create', 'read', 'update', 'delete', 'import', 'export'],
          reference: ['create', 'read', 'update', 'delete', 'import', 'export'],
          education: ['create', 'read', 'update', 'delete', 'import', 'export'],
          payroll: ['create', 'read', 'update', 'delete', 'import', 'export'],
          attendance: ['create', 'read', 'update', 'delete', 'import', 'export'],
          training: ['create', 'read', 'update', 'delete', 'import', 'export'],
          reports: ['create', 'read', 'update', 'delete', 'import', 'export'],
          travel_request: ['create', 'read', 'update', 'delete', 'import', 'export'],
          leave_request: ['create', 'read', 'update', 'delete', 'import', 'export'],
        },
        rolePermissions: {
          'admin': [], // Will be populated with all permissions
          'hr-manager': [], // Will be populated with all permissions
          'hr-assistant': [], // Will be populated with all permissions
          'employee': [
            'user.read',
            'user.update',
            'attendance.create',
            'attendance.read',
            'travel_request.create',
            'travel_request.read',
            'travel_request.update',
            'leave_request.create',
            'leave_request.read',
            'leave_request.update',
          ]
        },
        newUser: {
          name: '',
          email: '',
          password: '',
          password_confirmation: '',
          role: '',
          permissions: [],
          profile_picture: null
        },
        editUser: {
          id: null,
          name: '',
          email: '',
          password: '',
          password_confirmation: '',
          role: '',
          permissions: [],
          profile_picture: null
        }
      };
    },
    created() {
      this.adminStore = useAdminStore();
      this.initializeRolePermissions();
    },
    methods: {
      initializeRolePermissions() {
        // Generate all possible permissions
        const allPermissions = [];
        for (const [module, actions] of Object.entries(this.modules)) {
          for (const action of actions) {
            allPermissions.push(`${module}.${action}`);
          }
        }
        
        // Assign all permissions to admin, hr-manager, and hr-assistant roles
        this.rolePermissions['admin'] = [...allPermissions];
        this.rolePermissions['hr-manager'] = [...allPermissions];
        this.rolePermissions['hr-assistant'] = [...allPermissions];
        // Employee permissions are already defined in data()
      },
      
      updatePermissionsByRole(role) {
        if (role && this.rolePermissions[role]) {
          this.newUser.permissions = [...this.rolePermissions[role]];
        } else {
          this.newUser.permissions = [];
        }
      },
      
      updateEditPermissionsByRole(role) {
        if (role && this.rolePermissions[role]) {
          this.editUser.permissions = [...this.rolePermissions[role]];
        } else {
          this.editUser.permissions = [];
        }
      },
      
      async submitNewUser() {
        try {
          this.loading = true;
          
          // Create FormData object to handle file uploads
          const formData = new FormData();
          formData.append('name', this.newUser.name);
          formData.append('email', this.newUser.email);
          formData.append('password', this.newUser.password);
          formData.append('password_confirmation', this.newUser.password_confirmation);
          formData.append('role', this.newUser.role);
          
          // Add permissions as array
          if (this.newUser.permissions.length > 0) {
            this.newUser.permissions.forEach(permission => {
              formData.append('permissions[]', permission);
            });
          }
          
          // Add profile picture if exists
          if (this.newUser.profile_picture) {
            formData.append('profile_picture', this.newUser.profile_picture);
          }
          
          // Call the store action to create user
          const response = await this.adminStore.createUser(formData);
          
          if (response && response.success) {
            // Reset form
            this.resetNewUserForm();
            
            // Close modal
            document.getElementById('add_users').querySelector('[data-bs-dismiss="modal"]').click();
            
            // Emit event to parent component to refresh user list
            this.$emit('user-added');
            
            // Show success message
            this.showAlert('User created successfully', 'success');
          }
        } catch (error) {
          console.error('Error creating user:', error);
          this.showAlert(error.message || 'Failed to create user', 'danger');
        } finally {
          this.loading = false;
        }
      },
      
      async updateExistingUser() {
        try {
          this.loading = true;
          
          if (!this.editUser.id) {
            throw new Error('User ID is required for update');
          }
          
          // Create FormData object to handle file uploads
          const formData = new FormData();
          formData.append('name', this.editUser.name);
          formData.append('email', this.editUser.email);
          
          // Only include password if provided
          if (this.editUser.password) {
            formData.append('password', this.editUser.password);
            formData.append('password_confirmation', this.editUser.password_confirmation);
          }
          
          formData.append('role', this.editUser.role);
          
          // Add permissions as array
          if (this.editUser.permissions.length > 0) {
            this.editUser.permissions.forEach(permission => {
              formData.append('permissions[]', permission);
            });
          }
          
          // Add profile picture if exists
          if (this.editUser.profile_picture instanceof File) {
            formData.append('profile_picture', this.editUser.profile_picture);
          }
          
          // Call the store action to update user
          const response = await this.adminStore.updateUser(this.editUser.id, formData);
          
          if (response && response.success) {
            // Close modal
            document.getElementById('edit_user').querySelector('[data-bs-dismiss="modal"]').click();
            
            // Emit event to parent component to refresh user list
            this.$emit('user-updated');
            
            // Show success message
            this.showAlert('User updated successfully', 'success');
          }
        } catch (error) {
          console.error('Error updating user:', error);
          this.showAlert(error.message || 'Failed to update user', 'danger');
        } finally {
          this.loading = false;
        }
      },

      async deleteUser() {
        try {
          this.loading = true;
          
          if (!this.userToDelete) {
            throw new Error('No user selected for deletion');
          }
          
          // Call the store action to delete user
          const response = await this.adminStore.deleteUser(this.userToDelete);
          
          if (response && response.success) {
            // Close modal
            document.getElementById('delete_modal').querySelector('[data-bs-dismiss="modal"]').click();
            
            // Emit event to parent component to refresh user list
            this.$emit('user-deleted');
            
            // Show success message
            this.showAlert('User deleted successfully', 'success');
            
            // Reset userToDelete
            this.userToDelete = null;
          }
        } catch (error) {
          console.error('Error deleting user:', error);
          this.showAlert(error.message || 'Failed to delete user', 'danger');
        } finally {
          this.loading = false;
        }
      },
      
      confirmDelete(userId) {
        this.userToDelete = userId;
        // Open delete modal
        const deleteModal = document.getElementById('delete_modal');
        // Import Bootstrap Modal dynamically to avoid 'bootstrap is not defined' error
        if (deleteModal) {
          import('bootstrap').then(bootstrap => {
            const bsModal = new bootstrap.Modal(deleteModal);
            bsModal.show();
          });
        }
      },
      
      showAlert(message, type = 'danger') {
        this.alertMessage = message;
        this.alertClass = `alert-${type}`;
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
          this.alertMessage = '';
        }, 5000);
        
        // Auto-dismiss success alerts after 3 seconds
        if (type === 'success') {
          setTimeout(() => {
            this.alertMessage = '';
          }, 3000);
        }
      },
      
      handleFileUpload(event) {
        this.newUser.profile_picture = event.target.files[0];
      },
      
      handleEditFileUpload(event) {
        this.editUser.profile_picture = event.target.files[0];
      },
      
      formatModuleName(module) {
        // Convert snake_case to Title Case with spaces
        return module
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      },
      
      resetNewUserForm() {
        this.newUser = {
          name: '',
          email: '',
          password: '',
          password_confirmation: '',
          role: '',
          permissions: [],
          profile_picture: null
        };
      },
      
      setEditUser(user) {
        this.editUser = {
          id: user.id,
          password: '',
          password_confirmation: '',
          role: user.roles && user.roles.length > 0 ? user.roles[0].name : '',
          permissions: user.permissions ? user.permissions.map(p => p.name) : [],
          profile_picture: null
        };
        
        // Update permissions based on role if permissions array is empty
        if (this.editUser.role && (!this.editUser.permissions || this.editUser.permissions.length === 0)) {
          this.updateEditPermissionsByRole(this.editUser.role);
        }
      }
    }
  };
  </script>
