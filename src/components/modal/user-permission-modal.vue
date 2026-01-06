<template>
  <!-- User Permission Management Modal -->
  <div class="modal fade" id="manage_user_permissions_modal">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h4 class="modal-title">
            <i class="ti ti-shield-lock me-2"></i>
            Manage User Permissions
          </h4>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <!-- Alert Message -->
        <div v-if="alertMessage" class="alert mx-3 mt-3" :class="alertClass" role="alert">
          <i class="ti" :class="alertIcon"></i>
          {{ alertMessage }}
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3">Loading user permissions...</p>
        </div>

        <!-- User Info & Permissions -->
        <div v-else class="modal-body pb-0">
          <!-- User Information -->
          <div class="card mb-3 border-primary">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-8">
                  <h5 class="mb-1">{{ user.name }}</h5>
                  <p class="text-muted mb-0">
                    <i class="ti ti-mail me-1"></i>{{ user.email }}
                  </p>
                  <div class="mt-2">
                    <span
                      v-for="role in user.roles"
                      :key="role"
                      class="badge bg-info me-1"
                    >
                      {{ role }}
                    </span>
                  </div>
                </div>
                <div class="col-md-4 text-end">
                  <div class="d-flex flex-column align-items-end">
                    <small class="text-muted">Permission Summary</small>
                    <div class="mt-2">
                      <span class="badge bg-success me-1">
                        <i class="ti ti-edit"></i> Full Access: {{ summary.fullAccess }}
                      </span>
                      <span class="badge bg-warning">
                        Read Only: {{ summary.readOnly }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Instructions -->
          <div class="alert alert-info d-flex align-items-start" role="alert">
            <i class="ti ti-info-circle me-2 mt-1"></i>
            <div>
              <strong>How it works:</strong>
              <ul class="mb-0 mt-2">
                <li><strong>Read</strong> - User can view the module but cannot create, edit, or delete</li>
                <li><strong>Edit</strong> - User has full access (Create, Update, Delete)</li>
                <li>Edit checkbox is automatically disabled if Read is unchecked</li>
              </ul>
            </div>
          </div>

          <!-- Search Filter -->
          <div class="mb-3">
            <div class="input-group">
              <span class="input-group-text">
                <i class="ti ti-search"></i>
              </span>
              <input
                type="text"
                class="form-control"
                placeholder="Search modules..."
                v-model="searchQuery"
              />
            </div>
          </div>

          <!-- Permissions Table by Category -->
          <div class="accordion" id="permissionsAccordion">
            <div
              v-for="(categoryModules, category) in groupedModules"
              :key="category"
              class="accordion-item"
            >
              <h2 class="accordion-header" :id="`heading-${category}`">
                <button
                  class="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  :data-bs-target="`#collapse-${category}`"
                  :aria-expanded="category === Object.keys(groupedModules)[0]"
                  :aria-controls="`collapse-${category}`"
                >
                  <i class="ti ti-folder me-2"></i>
                  <strong>{{ category }}</strong>
                  <span class="badge bg-secondary ms-2">{{ categoryModules.length }}</span>
                </button>
              </h2>
              <div
                :id="`collapse-${category}`"
                class="accordion-collapse collapse"
                :class="{ show: category === Object.keys(groupedModules)[0] }"
                :aria-labelledby="`heading-${category}`"
                data-bs-parent="#permissionsAccordion"
              >
                <div class="accordion-body p-0">
                  <div class="table-responsive">
                    <table class="table table-hover mb-0">
                      <thead class="table-light">
                        <tr>
                          <th class="w-50">Module</th>
                          <th class="text-center" style="width: 150px">
                            Read
                          </th>
                          <th class="text-center" style="width: 150px">
                            <i class="ti ti-edit me-1"></i>Edit (CRUD)
                          </th>
                          <th class="text-center" style="width: 100px">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="module in categoryModules" :key="module.name">
                          <td>
                            <div class="d-flex align-items-center">
                              <i class="ti me-2" :class="getModuleIcon(module.name)"></i>
                              <div>
                                <div>{{ module.display_name || module.name }}</div>
                                <small class="text-muted">{{ module.description || '' }}</small>
                              </div>
                            </div>
                          </td>
                          <td class="text-center">
                            <div class="form-check form-switch d-flex justify-content-center">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                :id="`read-${module.name}`"
                                v-model="permissions[module.name].read"
                                @change="handleReadChange(module.name)"
                              />
                            </div>
                          </td>
                          <td class="text-center">
                            <div class="form-check form-switch d-flex justify-content-center">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                :id="`edit-${module.name}`"
                                v-model="permissions[module.name].edit"
                                :disabled="!permissions[module.name].read"
                              />
                            </div>
                          </td>
                          <td class="text-center">
                            <span
                              v-if="!permissions[module.name] || (!permissions[module.name].read && !permissions[module.name].edit)"
                              class="badge bg-danger"
                            >
                              <i class="ti ti-ban"></i> No Access
                            </span>
                            <span
                              v-else-if="permissions[module.name].read && !permissions[module.name].edit"
                              class="badge bg-warning"
                            >
                              Read Only
                            </span>
                            <span
                              v-else-if="permissions[module.name].read && permissions[module.name].edit"
                              class="badge bg-success"
                            >
                              <i class="ti ti-edit"></i> Full Access
                            </span>
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

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-light" data-bs-dismiss="modal">
            <i class="ti ti-x me-1"></i>Cancel
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="savePermissions"
            :disabled="saving || loading"
          >
            <span v-if="saving">
              <span class="spinner-border spinner-border-sm me-1" role="status"></span>
              Saving...
            </span>
            <span v-else>
              <i class="ti ti-device-floppy me-1"></i>Save Permissions
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { moduleService } from '../../services/module.service';

export default {
  name: 'UserPermissionModal',
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      saving: false,
      user: {
        id: null,
        name: '',
        email: '',
        roles: []
      },
      modules: [],
      permissions: {},
      searchQuery: '',
      alertMessage: '',
      alertClass: '',
      alertIcon: ''
    };
  },
  computed: {
    /**
     * Filter modules based on search query
     */
    filteredModules() {
      if (!this.searchQuery) {
        return this.modules;
      }

      const query = this.searchQuery.toLowerCase();
      return this.modules.filter(module =>
        module.display_name.toLowerCase().includes(query) ||
        module.name.toLowerCase().includes(query) ||
        (module.description && module.description.toLowerCase().includes(query)) ||
        module.category.toLowerCase().includes(query)
      );
    },

    /**
     * Group filtered modules by category
     */
    groupedModules() {
      const groups = {};

      this.filteredModules.forEach(module => {
        const category = module.category || 'Other';
        if (!groups[category]) {
          groups[category] = [];
        }
        // Store module object instead of just name for better access
        groups[category].push(module);
      });

      // Sort categories and modules within categories
      const sortedGroups = {};
      Object.keys(groups).sort().forEach(category => {
        sortedGroups[category] = groups[category].sort((a, b) => {
          // Sort by order if available, otherwise by display_name
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
          }
          return (a.display_name || a.name).localeCompare(b.display_name || b.name);
        });
      });

      return sortedGroups;
    },

    /**
     * Calculate permission summary
     */
    summary() {
      let fullAccess = 0;
      let readOnly = 0;
      let noAccess = 0;

      Object.values(this.permissions).forEach(perm => {
        if (perm.read && perm.edit) {
          fullAccess++;
        } else if (perm.read && !perm.edit) {
          readOnly++;
        } else {
          noAccess++;
        }
      });

      return { fullAccess, readOnly, noAccess };
    }
  },
  methods: {
    /**
     * Load user permissions
     */
    async loadUserPermissions() {
      this.loading = true;
      this.clearAlert();

      try {
        // Fetch modules and user permissions
        const [modulesData, userPermissionsData] = await Promise.all([
          moduleService.fetchModules(),
          moduleService.getUserPermissions(this.userId)
        ]);

        if (!modulesData || modulesData.length === 0) {
          throw new Error('No modules found in the system');
        }

        if (!userPermissionsData) {
          throw new Error('Failed to load user permissions');
        }

        // Store modules
        this.modules = modulesData;

        // Store user info
        this.user = userPermissionsData.user;

        // Initialize permissions object for ALL modules
        // This ensures all modules are shown, even if user has no permissions
        this.permissions = {};
        
        // First, initialize all modules with default values (no access)
        modulesData.forEach(module => {
          this.permissions[module.name] = {
            read: false,
            edit: false
          };
        });

        // Then, update with actual user permissions
        if (userPermissionsData.modules) {
          Object.keys(userPermissionsData.modules).forEach(moduleName => {
            if (this.permissions[moduleName]) {
              this.permissions[moduleName] = {
                read: userPermissionsData.modules[moduleName].read || false,
                edit: userPermissionsData.modules[moduleName].edit || false
              };
            }
          });
        }

        console.log('[UserPermissionModal] Loaded permissions for user:', this.user.name);
        console.log('[UserPermissionModal] Total modules:', modulesData.length);
        console.log('[UserPermissionModal] Permissions initialized:', Object.keys(this.permissions).length);
      } catch (error) {
        console.error('[UserPermissionModal] Error loading permissions:', error);
        this.showAlert('error', 'Failed to load user permissions: ' + error.message);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Handle read checkbox change
     * If read is unchecked, automatically uncheck edit
     */
    handleReadChange(moduleName) {
      if (!this.permissions[moduleName].read) {
        this.permissions[moduleName].edit = false;
      }
    },

    /**
     * Save permissions
     */
    async savePermissions() {
      this.saving = true;
      this.clearAlert();

      try {
        const result = await moduleService.updateUserPermissions(this.userId, this.permissions);

        if (result.success) {
          this.showAlert('success', 'Permissions updated successfully!');

          // Emit event for parent component
          this.$emit('permissions-updated', {
            userId: this.userId,
            userName: this.user.name,
            permissionsCount: result.data.permissions_count
          });

          // Close modal after 1.5 seconds
          setTimeout(() => {
            const modalElement = document.getElementById('manage_user_permissions_modal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
              modal.hide();
            }
          }, 1500);
        } else {
          throw new Error(result.message || 'Failed to update permissions');
        }
      } catch (error) {
        console.error('[UserPermissionModal] Error saving permissions:', error);
        this.showAlert('error', 'Failed to save permissions: ' + error.message);
      } finally {
        this.saving = false;
      }
    },

    /**
     * Get module display name
     */
    getModuleDisplayName(moduleName) {
      const module = this.modules.find(m => m.name === moduleName);
      return module ? (module.display_name || module.name) : moduleName;
    },

    /**
     * Get module description
     */
    getModuleDescription(moduleName) {
      const module = this.modules.find(m => m.name === moduleName);
      return module ? (module.description || '') : '';
    },

    /**
     * Get module icon
     */
    getModuleIcon(moduleName) {
      const module = this.modules.find(m => m.name === moduleName);
      return module && module.icon ? `ti-${module.icon}` : 'ti-folder';
    },

    /**
     * Show alert message
     */
    showAlert(type, message) {
      this.alertMessage = message;

      if (type === 'success') {
        this.alertClass = 'alert-success';
        this.alertIcon = 'ti-circle-check';
      } else if (type === 'error') {
        this.alertClass = 'alert-danger';
        this.alertIcon = 'ti-alert-circle';
      } else if (type === 'warning') {
        this.alertClass = 'alert-warning';
        this.alertIcon = 'ti-alert-triangle';
      } else {
        this.alertClass = 'alert-info';
        this.alertIcon = 'ti-info-circle';
      }
    },

    /**
     * Clear alert message
     */
    clearAlert() {
      this.alertMessage = '';
      this.alertClass = '';
      this.alertIcon = '';
    }
  },
  watch: {
    /**
     * Watch userId prop changes to reload permissions
     */
    userId: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.loadUserPermissions();
        }
      }
    }
  },
  mounted() {
    // Listen for modal show event
    const modalElement = document.getElementById('manage_user_permissions_modal');
    if (modalElement) {
      modalElement.addEventListener('show.bs.modal', () => {
        if (this.userId) {
          this.loadUserPermissions();
        }
      });
    }
  }
};
</script>

<style scoped>
.accordion-button:not(.collapsed) {
  background-color: #f8f9fa;
  color: #000;
}

.form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.form-check-input:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}

.badge {
  font-size: 0.75rem;
  padding: 0.35em 0.65em;
}

.modal-xl {
  max-width: 1200px;
}

.alert i {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .modal-xl {
    max-width: 95%;
  }

  table {
    font-size: 0.875rem;
  }
}
</style>
