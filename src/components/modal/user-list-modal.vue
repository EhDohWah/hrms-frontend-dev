<template>
  <!-- Add Users -->
  <div class="modal fade" id="add_users">
    <div class="modal-dialog modal-dialog-centered modal-xl">
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
                  <a-select
                    :options="roles"
                    v-model:value="newUser.role"
                    id="roleseleuser"
                    placeholder="Select Role"
                    required
                    style="width: 100%"
                    :show-search="true"
                    :filter-option="filterOption"
                    :get-popup-container="getModalPopupContainer"
                    @change="updatePermissionsByRole('new')"
                  />
                </div>
              </div>

              <!-- Module Permissions Section -->
              <div class="col-md-12">
                <!-- Auto-permission notice for admin/hr-manager -->
                <div v-if="isNewUserRoleProtected" class="alert alert-success d-flex align-items-start" role="alert">
                  <i class="ti ti-shield-check me-2 mt-1"></i>
                  <div>
                    <strong>Auto-Permissions Enabled</strong>
                    <p class="mb-0 mt-1 small">
                      Users with <strong>{{ newUser.role }}</strong> role automatically receive ALL permissions to all modules. No manual permission assignment is needed.
                    </p>
                  </div>
                </div>

                <!-- Permissions UI for non-protected roles -->
                <template v-else>
                  <!-- Instructions -->
                  <div class="alert alert-info d-flex align-items-start py-2" role="alert">
                    <i class="ti ti-info-circle me-2 mt-1"></i>
                    <div class="small">
                      <strong>Read</strong> = View only | <strong>Edit</strong> = Full CRUD access (auto-enables Read)
                    </div>
                  </div>

                  <!-- Loading state for modules -->
                  <div v-if="loadingModules" class="text-center py-3">
                    <div class="spinner-border text-primary spinner-border-sm" role="status">
                      <span class="visually-hidden">Loading modules...</span>
                    </div>
                    <p class="mt-2 small">Loading modules...</p>
                  </div>

                  <!-- Hierarchical Permissions Accordion -->
                  <div v-else class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                      <h6 class="mb-0"><i class="ti ti-shield-lock me-2"></i>Module Permissions</h6>
                      <div>
                        <button type="button" class="btn btn-sm btn-outline-primary me-2" @click="selectAllPermissions('new')">
                          <i class="ti ti-check"></i> Select All
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-secondary" @click="clearAllPermissions('new')">
                          <i class="ti ti-x"></i> Clear All
                        </button>
                      </div>
                    </div>
                    <div class="card-body p-0">
                      <!-- Title-level Accordion -->
                      <div class="accordion" id="newUserPermissionsAccordion">
                        <div v-for="(titleConfig, title) in hierarchicalPermissions" :key="title" class="accordion-item">
                          <!-- Title Header -->
                          <h2 class="accordion-header">
                            <button
                              class="accordion-button collapsed py-2 bg-light"
                              type="button"
                              data-bs-toggle="collapse"
                              :data-bs-target="`#new-title-${title.replace(/[^a-zA-Z0-9]/g, '-')}`"
                            >
                              <i class="ti me-2" :class="`ti-${titleConfig.icon || 'folder'}`"></i>
                              <strong class="text-uppercase">{{ title }}</strong>
                              <span class="badge ms-2" :class="getTitlePermissionCount('new', title).count > 0 ? 'bg-success' : 'bg-secondary'">
                                {{ getTitlePermissionCount('new', title).count }}/{{ getTitlePermissionCount('new', title).total }}
                              </span>
                            </button>
                          </h2>
                          <div :id="`new-title-${title.replace(/[^a-zA-Z0-9]/g, '-')}`" class="accordion-collapse collapse">
                            <div class="accordion-body p-0">
                              <!-- Title-level actions -->
                              <div class="d-flex justify-content-end gap-1 p-2 border-bottom bg-white">
                                <button type="button" class="btn btn-xs btn-outline-success" @click="selectTitlePermissions('new', title)">
                                  <i class="ti ti-checks"></i> Select All in {{ title }}
                                </button>
                                <button type="button" class="btn btn-xs btn-outline-danger" @click="clearTitlePermissions('new', title)">
                                  <i class="ti ti-x"></i> Clear All
                                </button>
                              </div>

                              <!-- Menu-level sections -->
                              <div v-for="(modules, menuName) in titleConfig.menus" :key="menuName" class="menu-section">
                                <!-- Menu Header -->
                                <div class="menu-header d-flex justify-content-between align-items-center px-3 py-2">
                                  <div class="d-flex align-items-center">
                                    <i class="ti ti-folder me-2 text-secondary"></i>
                                    <span class="menu-name">{{ menuName }}</span>
                                    <span class="badge rounded-pill ms-2" :class="getMenuPermissionCount('new', title, menuName).count > 0 ? 'bg-primary' : 'bg-secondary'">
                                      {{ getMenuPermissionCount('new', title, menuName).count }}/{{ getMenuPermissionCount('new', title, menuName).total }}
                                    </span>
                                  </div>
                                  <div class="btn-group btn-group-sm">
                                    <button type="button" class="btn btn-outline-success btn-xs" @click="selectMenuPermissions('new', title, menuName)" title="Select all in this menu">
                                      <i class="ti ti-check"></i>
                                    </button>
                                    <button type="button" class="btn btn-outline-danger btn-xs" @click="clearMenuPermissions('new', title, menuName)" title="Clear all in this menu">
                                      <i class="ti ti-x"></i>
                                    </button>
                                  </div>
                                </div>

                                <!-- Module Permission Table -->
                                <table class="table table-sm table-hover mb-0 permission-table">
                                  <thead>
                                    <tr class="border-bottom">
                                      <th class="ps-4 py-1 fw-normal text-muted small" style="width: 60%">Module</th>
                                      <th class="text-center py-1 fw-normal text-muted small" style="width: 20%">Read</th>
                                      <th class="text-center py-1 fw-normal text-muted small" style="width: 20%">Edit</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="module in modules" :key="module.name" class="permission-row">
                                      <td class="ps-4 py-2">
                                          <div class="d-flex align-items-center">
                                          <i class="ti ti-circle-filled me-2 text-muted" style="font-size: 6px;"></i>
                                          <span class="text-dark">{{ module.display_name || module.name }}</span>
                                          </div>
                                        </td>
                                      <td class="text-center py-2">
                                        <div class="form-check form-check-md d-flex justify-content-center mb-0">
                                            <input
                                            class="form-check-input permission-checkbox"
                                              type="checkbox"
                                              v-model="newUser.permissions[module.name].read"
                                              @change="handleReadChange('new', module.name)"
                                            />
                                          </div>
                                        </td>
                                      <td class="text-center py-2">
                                        <div class="form-check form-check-md d-flex justify-content-center mb-0">
                                            <input
                                            class="form-check-input permission-checkbox"
                                              type="checkbox"
                                              v-model="newUser.permissions[module.name].edit"
                                              @change="handleEditChange('new', module.name)"
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
                  </div>
                </template>
              </div>

              <!-- Dashboard Widgets Section (NEW USER) -->
              <div class="col-md-12 mt-3">
                <div class="card">
                  <div class="card-header d-flex justify-content-between align-items-center">
                    <h6 class="mb-0">
                      <i class="ti ti-layout-dashboard me-2"></i>
                      Dashboard Widgets
                    </h6>
                    <div>
                      <button
                        type="button"
                        class="btn btn-sm btn-outline-primary me-2"
                        @click="selectAllWidgets('new')"
                      >
                        <i class="ti ti-check"></i> Select All
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-outline-secondary"
                        @click="selectDefaultWidgets('new')"
                      >
                        <i class="ti ti-refresh"></i> Defaults Only
                      </button>
                    </div>
                  </div>
                  <div class="card-body">
                    <div v-if="loadingWidgets" class="text-center py-3">
                      <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                      <span class="ms-2">Loading widgets...</span>
                    </div>
                    <div v-else>
                      <p class="text-muted small mb-3">
                        Select which dashboard widgets will be visible for this user. Widgets are filtered by permissions.
                      </p>
                      <div class="row g-3">
                        <div 
                          v-for="(categoryWidgets, category) in groupedWidgets" 
                          :key="category"
                          class="col-md-6"
                        >
                          <div class="border rounded p-2">
                            <h6 class="border-bottom pb-2 mb-2 text-capitalize">
                              <i class="ti ti-folder me-1"></i>{{ category }}
                            </h6>
                            <div 
                              v-for="widget in categoryWidgets" 
                              :key="widget.id"
                              class="form-check mb-2"
                            >
                              <input
                                class="form-check-input"
                                type="checkbox"
                                :id="`new-widget-${widget.id}`"
                                v-model="newUser.selectedWidgets"
                                :value="widget.id"
                              />
                              <label class="form-check-label" :for="`new-widget-${widget.id}`">
                                <i :class="widget.icon || 'ti ti-widget'" class="me-1"></i>
                                {{ widget.display_name }}
                                <span v-if="widget.is_default" class="badge bg-info-light text-info ms-1">Default</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
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

  <!-- Edit Users - Enhanced Tabbed Modal -->
  <div class="modal fade" id="edit_user">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">
            <i class="ti ti-user-edit me-2"></i>
            Edit User: {{ editUser.name }}
          </h4>
          <button
            type="button"
            class="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i class="ti ti-x"></i>
          </button>
        </div>

        <div class="modal-body pb-0">
          <!-- Section-specific success/error alerts -->
          <div v-if="sectionAlert.message" class="alert alert-dismissible fade show" :class="`alert-${sectionAlert.type}`" role="alert">
            <i class="ti me-2" :class="sectionAlert.type === 'success' ? 'ti-check' : 'ti-alert-circle'"></i>
            {{ sectionAlert.message }}
            <button type="button" class="btn-close" @click="sectionAlert.message = ''"></button>
          </div>

          <!-- Navigation Tabs -->
          <ul class="nav nav-pills nav-justified mb-4" id="editUserTabs" role="tablist">
            <li class="nav-item" role="presentation">
              <button 
                class="nav-link active" 
                id="user-info-tab" 
                data-bs-toggle="pill" 
                data-bs-target="#user-info-panel" 
                type="button" 
                role="tab"
              >
                <i class="ti ti-user me-1"></i>
                User Information
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button 
                class="nav-link" 
                id="permissions-tab" 
                data-bs-toggle="pill" 
                data-bs-target="#permissions-panel" 
                type="button" 
                role="tab"
              >
                <i class="ti ti-shield-lock me-1"></i>
                Permissions
                <span class="badge bg-secondary ms-1">{{ permissionsSummary.total }}</span>
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button 
                class="nav-link" 
                id="widgets-tab" 
                data-bs-toggle="pill" 
                data-bs-target="#widgets-panel" 
                type="button" 
                role="tab"
              >
                <i class="ti ti-layout-dashboard me-1"></i>
                Dashboard Widgets
                <span class="badge bg-secondary ms-1">{{ editUser.selectedWidgets.length }}</span>
              </button>
            </li>
          </ul>

          <!-- Tab Content -->
          <div class="tab-content" id="editUserTabContent">
            
            <!-- Section 1: User Information -->
            <div class="tab-pane fade show active" id="user-info-panel" role="tabpanel">
              <div class="card">
                <div class="card-header bg-light">
                  <h6 class="mb-0"><i class="ti ti-user me-2"></i>User Information</h6>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label">Name</label>
                        <input type="text" class="form-control" v-model="editUser.name" disabled />
                        <small class="text-muted">Name cannot be changed here</small>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" v-model="editUser.email" disabled />
                        <small class="text-muted">Email cannot be changed here</small>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="mb-3">
                        <label class="form-label">Role <span class="text-danger">*</span></label>
                        <a-select
                          :options="roles"
                          v-model:value="editUser.role"
                          id="roleedituser"
                          placeholder="Select Role"
                          required
                          style="width: 100%"
                          :show-search="true"
                          :filter-option="filterOption"
                          :get-popup-container="getModalPopupContainer"
                          @change="updatePermissionsByRole('edit')"
                        />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label class="form-label">New Password</label>
                        <div class="pass-group position-relative">
                          <input
                            :type="showEditPassword ? 'text' : 'password'"
                            class="pass-inputs form-control"
                            v-model="editUser.password"
                            placeholder="Enter new password (leave blank to keep current)"
                          />
                          <span
                            class="ti position-absolute top-50 end-0 translate-middle-y me-2"
                            :class="showEditPassword ? 'ti-eye' : 'ti-eye-off'"
                            @click="showEditPassword = !showEditPassword"
                            style="cursor: pointer;"
                          ></span>
                        </div>
                        <small class="text-muted">Leave blank to keep current password</small>
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
                  </div>
                </div>
                <div class="card-footer text-end">
                  <button 
                    type="button" 
                    class="btn btn-primary" 
                    @click="saveUserInfo"
                    :disabled="savingUserInfo"
                  >
                    <span v-if="savingUserInfo">
                      <span class="spinner-border spinner-border-sm me-1"></span>
                      Saving...
                    </span>
                    <span v-else>
                      <i class="ti ti-device-floppy me-1"></i>
                      Save User Information
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Section 2: Permissions -->
            <div class="tab-pane fade" id="permissions-panel" role="tabpanel">
              <div class="card">
                <div class="card-header bg-light">
                  <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <h6 class="mb-0"><i class="ti ti-shield-lock me-2"></i>Module Permissions</h6>
                    <div class="d-flex align-items-center gap-2">
                      <!-- Permission Summary -->
                      <span class="badge bg-success">
                        <i class="ti ti-edit me-1"></i>Full: {{ permissionsSummary.fullAccess }}
                      </span>
                      <span class="badge bg-warning text-dark">
                        <i class="ti ti-eye me-1"></i>Read: {{ permissionsSummary.readOnly }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="card-body">
                  <!-- Auto-permission notice for admin/hr-manager -->
                  <div v-if="isEditUserRoleProtected" class="alert alert-success d-flex align-items-start" role="alert">
                    <i class="ti ti-shield-check me-2 mt-1"></i>
                    <div>
                      <strong>Auto-Permissions Enabled</strong>
                      <p class="mb-0 mt-1 small">
                        Users with <strong>{{ editUser.role }}</strong> role automatically receive ALL permissions to all modules. No manual permission assignment is needed.
                      </p>
                    </div>
                  </div>

                  <!-- Permissions UI for non-protected roles -->
                  <template v-else>
                    <!-- Search and Actions Bar -->
                    <div class="row mb-3">
                      <div class="col-md-6">
                        <div class="input-group">
                          <span class="input-group-text bg-white">
                            <i class="ti ti-search"></i>
                          </span>
                          <input
                            type="text"
                            class="form-control"
                            placeholder="Search titles, menus, or modules..."
                            v-model="permissionSearchQuery"
                          />
                          <button 
                            v-if="permissionSearchQuery" 
                            type="button" 
                            class="btn btn-outline-secondary"
                            @click="permissionSearchQuery = ''"
                          >
                            <i class="ti ti-x"></i>
                          </button>
                        </div>
                      </div>
                      <div class="col-md-6 text-end">
                        <button type="button" class="btn btn-sm btn-outline-primary me-2" @click="selectAllPermissions('edit')">
                          <i class="ti ti-check"></i> Select All
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-secondary" @click="clearAllPermissions('edit')">
                          <i class="ti ti-x"></i> Clear All
                        </button>
                      </div>
                    </div>

                    <!-- Instructions -->
                    <div class="alert alert-info d-flex align-items-start py-2" role="alert">
                      <i class="ti ti-info-circle me-2 mt-1"></i>
                      <div class="small">
                        <strong>Read</strong> = View only | <strong>Edit</strong> = Full CRUD access (auto-enables Read)
                      </div>
                    </div>

                    <!-- Loading state -->
                    <div v-if="loadingModules" class="text-center py-3">
                      <div class="spinner-border text-primary spinner-border-sm" role="status"></div>
                      <span class="ms-2">Loading modules...</span>
                    </div>

                    <!-- Hierarchical Permissions Accordion -->
                    <div v-else class="accordion" id="editUserPermissionsAccordion">
                      <div v-for="(titleConfig, title) in filteredHierarchicalPermissions" :key="title" class="accordion-item">
                        <!-- Title Header -->
                        <h2 class="accordion-header">
                          <button
                            class="accordion-button collapsed py-2 bg-light"
                            type="button"
                            data-bs-toggle="collapse"
                            :data-bs-target="`#edit-title-${title.replace(/[^a-zA-Z0-9]/g, '-')}`"
                          >
                            <i class="ti me-2" :class="`ti-${titleConfig.icon || 'folder'}`"></i>
                            <strong class="text-uppercase">{{ title }}</strong>
                            <span class="badge ms-2" :class="getTitlePermissionCount('edit', title).count > 0 ? 'bg-success' : 'bg-secondary'">
                              {{ getTitlePermissionCount('edit', title).count }}/{{ getTitlePermissionCount('edit', title).total }}
                            </span>
                          </button>
                        </h2>
                        <div 
                          :id="`edit-title-${title.replace(/[^a-zA-Z0-9]/g, '-')}`" 
                          class="accordion-collapse collapse"
                          :class="{ 'show': permissionSearchQuery !== '' }"
                        >
                          <div class="accordion-body p-0">
                            <!-- Title-level actions -->
                            <div class="d-flex justify-content-end gap-1 p-2 border-bottom bg-white">
                              <button type="button" class="btn btn-xs btn-outline-success" @click="selectTitlePermissions('edit', title)">
                                <i class="ti ti-checks"></i> Select All in {{ title }}
                              </button>
                              <button type="button" class="btn btn-xs btn-outline-danger" @click="clearTitlePermissions('edit', title)">
                                <i class="ti ti-x"></i> Clear All
                              </button>
                            </div>

                            <!-- Menu-level sections -->
                            <div v-for="(modules, menuName) in titleConfig.menus" :key="menuName" class="menu-section">
                              <!-- Menu Header -->
                              <div class="menu-header d-flex justify-content-between align-items-center px-3 py-2">
                                <div class="d-flex align-items-center">
                                  <i class="ti ti-folder me-2 text-secondary"></i>
                                  <span class="menu-name">{{ menuName }}</span>
                                  <span class="badge rounded-pill ms-2" :class="getMenuPermissionCount('edit', title, menuName).count > 0 ? 'bg-primary' : 'bg-secondary'">
                                    {{ getMenuPermissionCount('edit', title, menuName).count }}/{{ getMenuPermissionCount('edit', title, menuName).total }}
                                  </span>
                                </div>
                                <div class="btn-group btn-group-sm">
                                  <button type="button" class="btn btn-outline-success btn-xs" @click="selectMenuPermissions('edit', title, menuName)" title="Select all in this menu">
                                    <i class="ti ti-check"></i>
                                  </button>
                                  <button type="button" class="btn btn-outline-danger btn-xs" @click="clearMenuPermissions('edit', title, menuName)" title="Clear all in this menu">
                                    <i class="ti ti-x"></i>
                                  </button>
                                </div>
                              </div>

                              <!-- Module Permission Table -->
                              <table class="table table-sm table-hover mb-0 permission-table">
                                <thead>
                                  <tr class="border-bottom">
                                    <th class="ps-4 py-1 fw-normal text-muted small" style="width: 60%">Module</th>
                                    <th class="text-center py-1 fw-normal text-muted small" style="width: 20%">Read</th>
                                    <th class="text-center py-1 fw-normal text-muted small" style="width: 20%">Edit</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                  <tr v-for="module in modules" :key="module.name" class="permission-row">
                                    <td class="ps-4 py-2">
                                        <div class="d-flex align-items-center">
                                        <i class="ti ti-circle-filled me-2 text-muted" style="font-size: 6px;"></i>
                                        <span class="text-dark">{{ module.display_name || module.name }}</span>
                                        </div>
                                      </td>
                                    <td class="text-center py-2">
                                      <div class="form-check form-check-md d-flex justify-content-center mb-0">
                                          <input
                                          class="form-check-input permission-checkbox"
                                            type="checkbox"
                                            v-model="editUser.permissions[module.name].read"
                                            @change="handleReadChange('edit', module.name)"
                                          />
                                        </div>
                                      </td>
                                    <td class="text-center py-2">
                                      <div class="form-check form-check-md d-flex justify-content-center mb-0">
                                          <input
                                          class="form-check-input permission-checkbox"
                                            type="checkbox"
                                            v-model="editUser.permissions[module.name].edit"
                                            @change="handleEditChange('edit', module.name)"
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

                      <!-- No results message -->
                      <div v-if="Object.keys(filteredHierarchicalPermissions).length === 0" class="text-center py-4 text-muted">
                        <i class="ti ti-search-off fs-1"></i>
                        <p class="mt-2">No modules found matching "{{ permissionSearchQuery }}"</p>
                      </div>
                    </div>
                  </template>
                </div>
                <div class="card-footer text-end">
                  <button 
                    type="button" 
                    class="btn btn-primary" 
                    @click="savePermissions"
                    :disabled="savingPermissions || isEditUserRoleProtected"
                  >
                    <span v-if="savingPermissions">
                      <span class="spinner-border spinner-border-sm me-1"></span>
                      Saving...
                    </span>
                    <span v-else>
                      <i class="ti ti-device-floppy me-1"></i>
                      Save Permissions
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Section 3: Dashboard Widgets -->
            <div class="tab-pane fade" id="widgets-panel" role="tabpanel">
              <div class="card">
                <div class="card-header bg-light">
                  <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <h6 class="mb-0"><i class="ti ti-layout-dashboard me-2"></i>Dashboard Widgets</h6>
                    <div>
                      <button
                        type="button"
                        class="btn btn-sm btn-outline-primary me-2"
                        @click="selectAllWidgets('edit')"
                      >
                        <i class="ti ti-check"></i> Select All
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-outline-secondary"
                        @click="selectDefaultWidgets('edit')"
                      >
                        <i class="ti ti-refresh"></i> Defaults Only
                      </button>
                    </div>
                  </div>
                </div>
                <div class="card-body">
                  <div v-if="loadingWidgets" class="text-center py-3">
                    <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                    <span class="ms-2">Loading widgets...</span>
                  </div>
                  <div v-else>
                    <p class="text-muted small mb-3">
                      Select which dashboard widgets will be visible for this user.
                    </p>
                    <div class="row g-3">
                      <div 
                        v-for="(categoryWidgets, category) in groupedWidgets" 
                        :key="category"
                        class="col-md-6"
                      >
                        <div class="border rounded p-3">
                          <h6 class="border-bottom pb-2 mb-2 text-capitalize">
                            <i class="ti ti-folder me-1"></i>{{ category }}
                            <span class="badge bg-secondary float-end">{{ categoryWidgets.length }}</span>
                          </h6>
                          <div 
                            v-for="widget in categoryWidgets" 
                            :key="widget.id"
                            class="form-check mb-2"
                          >
                            <input
                              class="form-check-input"
                              type="checkbox"
                              :id="`edit-widget-${widget.id}`"
                              v-model="editUser.selectedWidgets"
                              :value="widget.id"
                            />
                            <label class="form-check-label" :for="`edit-widget-${widget.id}`">
                              <i :class="widget.icon || 'ti ti-widget'" class="me-1"></i>
                              {{ widget.display_name }}
                              <span v-if="widget.is_default" class="badge bg-info-light text-info ms-1">Default</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card-footer text-end">
                  <button 
                    type="button" 
                    class="btn btn-primary" 
                    @click="saveWidgets"
                    :disabled="savingWidgets"
                  >
                    <span v-if="savingWidgets">
                      <span class="spinner-border spinner-border-sm me-1"></span>
                      Saving...
                    </span>
                    <span v-else>
                      <i class="ti ti-device-floppy me-1"></i>
                      Save Dashboard Widgets
                    </span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-light border"
            data-bs-dismiss="modal"
          >
            <i class="ti ti-x me-1"></i>
            Close
          </button>
        </div>
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
import { moduleService } from '@/services/module.service';
import { roleService } from '@/services/role.service';
import { dashboardService } from '@/services/dashboard.service';

// Menu hierarchy configuration matching sidebar structure
const MENU_HIERARCHY = {
  'Main Menu': {
    order: 0,
    icon: 'smart-home',
    menus: {
      'Dashboard': ['dashboard']
    }
  },
  'Grant': {
    order: 1,
    icon: 'award',
    menus: {
      'Grants': ['grants', 'grant_position']
    }
  },
  'Recruitment': {
    order: 2,
    icon: 'user-shield',
    menus: {
      'Recruitment': ['recruitment', 'interviews', 'job_offers']
    }
  },
  'HRM': {
    order: 3,
    icon: 'users',
    menus: {
      'Employee': ['employees', 'employment_records', 'employee_resignation'],
      'Holidays': ['holidays', 'holiday', 'hrm_holidays'],
      'Attendance': ['attendance_admin', 'attendance_employee', ],
      'Leaves': ['leaves_admin', 'leave_employee', 'leave_settings', 'leave_types', 'leave_balances'],
      'Travel': ['travel_admin', 'travel_employee'],
      'Training': ['training_list', 'employee_training']
    }
  },
  'Finance & Accounts': {
    order: 4,
    icon: 'cash',
    menus: {
      'Payroll': ['employee_salary', 'tax_settings', 'benefit_settings', 'payslip']
    }
  },
  'Administration': {
    order: 5,
    icon: 'building',
    menus: {
      'Organization Structure': ['organization', 'sites', 'departments', 'positions', 'section_departments', 'organization_structure'],
      'Lookups': ['lookups', 'lookup_list', 'lookup'],
      'User Management': ['user_management', 'users', 'roles', 'roles_permissions', 'permissions'],
      'Reports': ['report_list', 'reports', 'report'],
      'File Uploads': ['file_uploads', 'file_uploads_list'],
      'Recycle Bin': ['recycle_bin', 'recycle_bin_list']
    }
  }
};

import { useSelectMigration } from '@/composables/useSelectMigration';

export default {
  name: 'UserListModal',
  emits: ['user-added', 'user-updated', 'user-deleted'],
  setup() {
    const { filterOption, getModalPopupContainer } = useSelectMigration();
    return { filterOption, getModalPopupContainer };
  },
  data() {
    return {
      adminStore: null,
      loading: false,
      loadingModules: false,
      loadingRoles: false,
      showNewPassword: false,
      showNewConfirmPassword: false,
      showEditPassword: false,
      showEditConfirmPassword: false,
      alertMessage: '',
      alertClass: '',
      userToDelete: null,
      roles: [],
      modules: [],
      widgets: [],
      loadingWidgets: false,
      // Section-specific saving states
      savingUserInfo: false,
      savingPermissions: false,
      savingWidgets: false,
      // Section alert for edit modal
      sectionAlert: {
        message: '',
        type: 'success'
      },
      // Permission search query
      permissionSearchQuery: '',
      newUser: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
        permissions: {},
        profile_picture: null,
        selectedWidgets: []
      },
      editUser: {
        id: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
        permissions: {},
        profile_picture: null,
        selectedWidgets: []
      }
    };
  },
  computed: {
    /**
     * Group modules by category for accordion display
     */
    groupedModules() {
      const groups = {};

      this.modules.forEach(module => {
        const category = module.category || 'Other';
        if (!groups[category]) {
          groups[category] = [];
        }
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
     * Group widgets by category for display
     */
    groupedWidgets() {
      const groups = {};

      this.widgets.forEach(widget => {
        const category = widget.category || 'general';
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(widget);
      });

      // Sort categories and widgets within categories
      const sortedGroups = {};
      Object.keys(groups).sort().forEach(category => {
        sortedGroups[category] = groups[category].sort((a, b) => {
          if (a.default_order !== undefined && b.default_order !== undefined) {
            return a.default_order - b.default_order;
          }
          return (a.display_name || a.name).localeCompare(b.display_name || b.name);
        });
      });

      return sortedGroups;
    },
    /**
     * Check if new user's selected role is protected (admin or hr-manager)
     */
    isNewUserRoleProtected() {
      return this.newUser.role === 'admin' || this.newUser.role === 'hr-manager';
    },
    /**
     * Check if edit user's selected role is protected (admin or hr-manager)
     */
    isEditUserRoleProtected() {
      return this.editUser.role === 'admin' || this.editUser.role === 'hr-manager';
    },
    /**
     * Filter grouped modules by search query
     */
    filteredGroupedModules() {
      if (!this.permissionSearchQuery.trim()) {
        return this.groupedModules;
      }

      const query = this.permissionSearchQuery.toLowerCase().trim();
      const filtered = {};

      Object.entries(this.groupedModules).forEach(([category, modules]) => {
        const matchingModules = modules.filter(module => {
          const displayName = (module.display_name || module.name || '').toLowerCase();
          const name = (module.name || '').toLowerCase();
          const categoryLower = category.toLowerCase();
          return displayName.includes(query) || name.includes(query) || categoryLower.includes(query);
        });

        if (matchingModules.length > 0) {
          filtered[category] = matchingModules;
        }
      });

      return filtered;
    },
    /**
     * Calculate permissions summary for edit user
     */
    permissionsSummary() {
      let fullAccess = 0;
      let readOnly = 0;
      let total = 0;

      if (this.editUser.permissions) {
        Object.values(this.editUser.permissions).forEach(perm => {
          if (perm.read && perm.edit) {
            fullAccess++;
            total++;
          } else if (perm.read) {
            readOnly++;
            total++;
          }
        });
      }

      return { fullAccess, readOnly, total };
    },
    /**
     * Hierarchical permissions structure: Title → Menu → Submenus
     * Matches the sidebar menu organization
     */
    hierarchicalPermissions() {
      const hierarchy = {};

      // Initialize hierarchy from MENU_HIERARCHY config
      Object.entries(MENU_HIERARCHY).forEach(([title, config]) => {
        hierarchy[title] = {
          order: config.order,
          icon: config.icon,
          menus: {}
        };

        Object.entries(config.menus).forEach(([menuName, modulePatterns]) => {
          hierarchy[title].menus[menuName] = {
            modules: [],
            patterns: modulePatterns
          };
        });
      });

      // Assign modules to their matching menu
      this.modules.forEach(module => {
        const moduleName = (module.name || '').toLowerCase();
        let assigned = false;

        // Find matching title and menu
        for (const [, titleConfig] of Object.entries(hierarchy)) {
          for (const [, menuConfig] of Object.entries(titleConfig.menus)) {
            // Check if module matches any pattern for this menu
            const matches = menuConfig.patterns.some(pattern => {
              const patternLower = pattern.toLowerCase();
              // Exact match (highest priority) - always allowed
              if (moduleName === patternLower) {
                return true;
              }
              // For all patterns, only allow exact matches to prevent false positives
              // This prevents "payslip_report" from matching pattern "payslip"
              // and "employee_resignation" from matching pattern "resignation"
              // If you need prefix matching, add the full module name to the patterns array
              return false;
            });

            if (matches) {
              menuConfig.modules.push(module);
              assigned = true;
              break;
            }
          }
          if (assigned) break;
        }

        // If not assigned, skip the module (don't add to "Other" category)
        // Only modules that match the defined patterns in MENU_HIERARCHY will be shown
      });

      // Remove empty menus and titles
      const cleanedHierarchy = {};
      Object.entries(hierarchy)
        .sort((a, b) => a[1].order - b[1].order)
        .forEach(([title, titleConfig]) => {
          const nonEmptyMenus = {};
          Object.entries(titleConfig.menus).forEach(([menuName, menuConfig]) => {
            if (menuConfig.modules.length > 0) {
              // Sort modules by display_name
              menuConfig.modules.sort((a, b) => 
                (a.display_name || a.name).localeCompare(b.display_name || b.name)
              );
              nonEmptyMenus[menuName] = menuConfig.modules;
            }
          });

          if (Object.keys(nonEmptyMenus).length > 0) {
            cleanedHierarchy[title] = {
              icon: titleConfig.icon,
              menus: nonEmptyMenus
            };
          }
        });

      return cleanedHierarchy;
    },
    /**
     * Filtered hierarchical permissions based on search query
     */
    filteredHierarchicalPermissions() {
      if (!this.permissionSearchQuery.trim()) {
        return this.hierarchicalPermissions;
      }

      const query = this.permissionSearchQuery.toLowerCase().trim();
      const filtered = {};

      Object.entries(this.hierarchicalPermissions).forEach(([title, titleConfig]) => {
        const matchingMenus = {};

        Object.entries(titleConfig.menus).forEach(([menuName, modules]) => {
          // Check if title or menu name matches
          const titleMatches = title.toLowerCase().includes(query);
          const menuMatches = menuName.toLowerCase().includes(query);

          // Filter modules that match
          const matchingModules = modules.filter(module => {
            const displayName = (module.display_name || module.name || '').toLowerCase();
            const name = (module.name || '').toLowerCase();
            return titleMatches || menuMatches || displayName.includes(query) || name.includes(query);
          });

          if (matchingModules.length > 0) {
            matchingMenus[menuName] = matchingModules;
          }
        });

        if (Object.keys(matchingMenus).length > 0) {
          filtered[title] = {
            icon: titleConfig.icon,
            menus: matchingMenus
          };
        }
      });

      return filtered;
    }
  },
  async created() {
    this.adminStore = useAdminStore();
    await Promise.all([
      this.loadModules(),
      this.loadRoles(),
      this.loadWidgets()
    ]);
  },
  methods: {
    /**
     * Load modules from API
     */
    async loadModules() {
      this.loadingModules = true;
      try {
        const modulesData = await moduleService.fetchModules();

        if (!modulesData || modulesData.length === 0) {
          console.warn('[UserListModal] No modules found');
          this.modules = [];
          return;
        }

        this.modules = modulesData;

        // Initialize permission structure for all modules
        this.initializePermissions();

        console.log(`[UserListModal] Loaded ${modulesData.length} modules from API`);
      } catch (error) {
        console.error('[UserListModal] Error loading modules:', error);
        this.showAlert('Failed to load modules. Using fallback.', 'warning');
        this.modules = [];
      } finally {
        this.loadingModules = false;
      }
    },

    /**
     * Load roles from API
     */
    async loadRoles() {
      this.loadingRoles = true;
      try {
        const response = await roleService.getRoles();
        
        // API returns { success: true, data: [...] } directly from apiService.get
        const rolesData = response.data || response;

        if (rolesData && Array.isArray(rolesData)) {
          // Extract unique role names from the API response (de-duplicate across guards)
          const uniqueRoles = [...new Set(rolesData.map(role => role.name))];
          // Transform to object format for Ant Design Vue Select component
          this.roles = uniqueRoles.map(role => ({
            label: role.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            value: role
          }));
          console.log(`[UserListModal] Loaded ${this.roles.length} unique roles from API:`, this.roles);
        } else if (response.success && response.data) {
          // Alternative format: { success: true, data: [...] }
          const uniqueRoles = [...new Set(response.data.map(role => role.name))];
          // Transform to object format for Ant Design Vue Select component
          this.roles = uniqueRoles.map(role => ({
            label: role.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            value: role
          }));
          console.log(`[UserListModal] Loaded ${this.roles.length} unique roles from API:`, this.roles);
        } else {
          console.warn('[UserListModal] No roles found in API response:', response);
          this.roles = [];
        }
      } catch (error) {
        console.error('[UserListModal] Error loading roles:', error);
        this.showAlert('Failed to load roles. Using fallback.', 'warning');
        // Fallback to default roles in object format
        this.roles = [
          { label: 'Admin', value: 'admin' },
          { label: 'HR Manager', value: 'hr-manager' }
        ];
      } finally {
        this.loadingRoles = false;
      }
    },

    /**
     * Load dashboard widgets from API
     */
    async loadWidgets() {
      this.loadingWidgets = true;
      try {
        const response = await dashboardService.getAllWidgets();
        const widgetsData = response.data || response;
        
        if (widgetsData && Array.isArray(widgetsData)) {
          this.widgets = widgetsData.filter(w => w.is_active);
          console.log(`[UserListModal] Loaded ${this.widgets.length} widgets from API`);
          
          // Initialize default widgets selection
          this.initializeDefaultWidgets();
        } else {
          console.warn('[UserListModal] No widgets found in API response');
          this.widgets = [];
        }
      } catch (error) {
        console.error('[UserListModal] Error loading widgets:', error);
        this.widgets = [];
      } finally {
        this.loadingWidgets = false;
      }
    },

    /**
     * Initialize default widgets selection for new users
     */
    initializeDefaultWidgets() {
      const defaultWidgetIds = this.widgets
        .filter(w => w.is_default)
        .map(w => w.id);
      
      this.newUser.selectedWidgets = [...defaultWidgetIds];
    },

    /**
     * Select all widgets
     */
    selectAllWidgets(formType) {
      const allWidgetIds = this.widgets.map(w => w.id);
      if (formType === 'new') {
        this.newUser.selectedWidgets = [...allWidgetIds];
      } else {
        this.editUser.selectedWidgets = [...allWidgetIds];
      }
    },

    /**
     * Select only default widgets
     */
    selectDefaultWidgets(formType) {
      const defaultWidgetIds = this.widgets
        .filter(w => w.is_default)
        .map(w => w.id);
      
      if (formType === 'new') {
        this.newUser.selectedWidgets = [...defaultWidgetIds];
      } else {
        this.editUser.selectedWidgets = [...defaultWidgetIds];
      }
    },

    /**
     * Initialize permissions structure for all modules
     */
    initializePermissions() {
      const permissionsObj = {};

      this.modules.forEach(module => {
        permissionsObj[module.name] = {
          read: false,
          edit: false
        };
      });

      this.newUser.permissions = { ...permissionsObj };
      this.editUser.permissions = { ...permissionsObj };
    },

    /**
     * Update permissions based on selected role
     * Only admin and hr-manager get auto-permissions
     */
    updatePermissionsByRole(formType) {
      const role = formType === 'new' ? this.newUser.role : this.editUser.role;
      const permissionsTarget = formType === 'new' ? this.newUser.permissions : this.editUser.permissions;

      if (!role) {
        return;
      }

      // Clear all permissions first
      Object.keys(permissionsTarget).forEach(moduleName => {
        permissionsTarget[moduleName] = {
          read: false,
          edit: false
        };
      });

      // Only admin and hr-manager roles get auto-permissions (all modules with full access)
      // All other roles must have permissions assigned manually via UI
      const protectedRoles = ['admin', 'hr-manager'];

      if (protectedRoles.includes(role)) {
        // Auto-assign ALL permissions to admin and hr-manager
        Object.keys(permissionsTarget).forEach(moduleName => {
          permissionsTarget[moduleName] = {
            read: true,
            edit: true
          };
        });
        console.log(`[UserListModal] Auto-assigned all permissions to ${role} role`);
      } else {
        // For all other roles, permissions remain empty and must be set via UI
        console.log(`[UserListModal] Role ${role} requires manual permission assignment`);
      }
    },

    /**
     * Handle read checkbox change
     * If read is unchecked, automatically uncheck edit
     */
    handleReadChange(formType, moduleName) {
      const permissions = formType === 'new' ? this.newUser.permissions : this.editUser.permissions;

      if (!permissions[moduleName].read) {
        permissions[moduleName].edit = false;
      }
    },

    /**
     * Handle edit checkbox change
     * If edit is checked, automatically check read
     */
    handleEditChange(formType, moduleName) {
      const permissions = formType === 'new' ? this.newUser.permissions : this.editUser.permissions;

      if (permissions[moduleName].edit) {
        permissions[moduleName].read = true;
      }
    },

    /**
     * Select all permissions
     */
    selectAllPermissions(formType) {
      const permissions = formType === 'new' ? this.newUser.permissions : this.editUser.permissions;

      Object.keys(permissions).forEach(moduleName => {
        permissions[moduleName] = {
          read: true,
          edit: true
        };
      });
    },

    /**
     * Clear all permissions
     */
    clearAllPermissions(formType) {
      const permissions = formType === 'new' ? this.newUser.permissions : this.editUser.permissions;

      Object.keys(permissions).forEach(moduleName => {
        permissions[moduleName] = {
          read: false,
          edit: false
        };
      });
    },

    /**
     * Select all permissions for a specific Title (category)
     */
    selectTitlePermissions(formType, title) {
      const permissions = formType === 'new' ? this.newUser.permissions : this.editUser.permissions;
      const titleConfig = this.hierarchicalPermissions[title];

      if (titleConfig && titleConfig.menus) {
        Object.values(titleConfig.menus).forEach(modules => {
          modules.forEach(module => {
            if (permissions[module.name]) {
              permissions[module.name] = { read: true, edit: true };
            }
          });
        });
      }
    },

    /**
     * Clear all permissions for a specific Title (category)
     */
    clearTitlePermissions(formType, title) {
      const permissions = formType === 'new' ? this.newUser.permissions : this.editUser.permissions;
      const titleConfig = this.hierarchicalPermissions[title];

      if (titleConfig && titleConfig.menus) {
        Object.values(titleConfig.menus).forEach(modules => {
          modules.forEach(module => {
            if (permissions[module.name]) {
              permissions[module.name] = { read: false, edit: false };
            }
          });
        });
      }
    },

    /**
     * Select all permissions for a specific Menu within a Title
     */
    selectMenuPermissions(formType, title, menuName) {
      const permissions = formType === 'new' ? this.newUser.permissions : this.editUser.permissions;
      const titleConfig = this.hierarchicalPermissions[title];

      if (titleConfig && titleConfig.menus && titleConfig.menus[menuName]) {
        titleConfig.menus[menuName].forEach(module => {
          if (permissions[module.name]) {
            permissions[module.name] = { read: true, edit: true };
          }
        });
      }
    },

    /**
     * Clear all permissions for a specific Menu within a Title
     */
    clearMenuPermissions(formType, title, menuName) {
      const permissions = formType === 'new' ? this.newUser.permissions : this.editUser.permissions;
      const titleConfig = this.hierarchicalPermissions[title];

      if (titleConfig && titleConfig.menus && titleConfig.menus[menuName]) {
        titleConfig.menus[menuName].forEach(module => {
          if (permissions[module.name]) {
            permissions[module.name] = { read: false, edit: false };
          }
        });
      }
    },

    /**
     * Get permission count for a Title
     */
    getTitlePermissionCount(formType, title) {
      const permissions = formType === 'new' ? this.newUser.permissions : this.editUser.permissions;
      const titleConfig = this.hierarchicalPermissions[title];
      let count = 0;
      let total = 0;

      if (titleConfig && titleConfig.menus) {
        Object.values(titleConfig.menus).forEach(modules => {
          modules.forEach(module => {
            total++;
            if (permissions[module.name] && permissions[module.name].read) {
              count++;
            }
          });
        });
      }

      return { count, total };
    },

    /**
     * Get permission count for a Menu
     */
    getMenuPermissionCount(formType, title, menuName) {
      const permissions = formType === 'new' ? this.newUser.permissions : this.editUser.permissions;
      const titleConfig = this.hierarchicalPermissions[title];
      let count = 0;
      let total = 0;

      if (titleConfig && titleConfig.menus && titleConfig.menus[menuName]) {
        titleConfig.menus[menuName].forEach(module => {
          total++;
          if (permissions[module.name] && permissions[module.name].read) {
            count++;
          }
        });
      }

      return { count, total };
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

        // Convert permissions object to array format
        // Backend expects: modules[module_name][read]=true/false, modules[module_name][edit]=true/false
        formData.append('modules', JSON.stringify(this.newUser.permissions));

        // Add dashboard widgets selection
        formData.append('dashboard_widgets', JSON.stringify(this.newUser.selectedWidgets));

        // Add profile picture if exists
        if (this.newUser.profile_picture) {
          formData.append('profile_picture', this.newUser.profile_picture);
        }

        // Call the store action to create user
        const response = await this.adminStore.createUser(formData);

        if (response && response.success) {
          // Set user widgets after creation
          if (response.data && response.data.id && this.newUser.selectedWidgets.length > 0) {
            await this.setUserWidgets(response.data.id, this.newUser.selectedWidgets);
          }

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

        // Convert permissions object to array format
        formData.append('modules', JSON.stringify(this.editUser.permissions));

        // Add dashboard widgets selection
        formData.append('dashboard_widgets', JSON.stringify(this.editUser.selectedWidgets));

        // Add profile picture if exists
        if (this.editUser.profile_picture instanceof File) {
          formData.append('profile_picture', this.editUser.profile_picture);
        }

        // Call the store action to update user
        const response = await this.adminStore.updateUser(this.editUser.id, formData);

        if (response && response.success) {
          // Update user widgets
          await this.setUserWidgets(this.editUser.id, this.editUser.selectedWidgets);

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

    /**
     * Set dashboard widgets for a user
     */
    async setUserWidgets(userId, widgetIds) {
      try {
        await dashboardService.setUserWidgets(userId, widgetIds);
        console.log(`[UserListModal] Set widgets for user ${userId}:`, widgetIds);
      } catch (error) {
        console.error('[UserListModal] Error setting user widgets:', error);
        // Don't throw - widget setting is secondary to user creation/update
      }
    },

    /**
     * Show section-specific alert in edit modal (non-blocking)
     */
    showSectionAlert(message, type = 'success') {
      this.sectionAlert = { message, type };
      // Auto-dismiss after 4 seconds
      setTimeout(() => {
        this.sectionAlert.message = '';
      }, 4000);
    },

    /**
     * Save User Information section only
     */
    async saveUserInfo() {
      try {
        this.savingUserInfo = true;

        if (!this.editUser.id) {
          throw new Error('User ID is required');
        }

        // Validate password confirmation if password is provided
        if (this.editUser.password && this.editUser.password !== this.editUser.password_confirmation) {
          this.showSectionAlert('Passwords do not match', 'danger');
          return;
        }

        const formData = new FormData();
        formData.append('role', this.editUser.role);

        // Only include password if provided
        if (this.editUser.password) {
          formData.append('password', this.editUser.password);
          formData.append('password_confirmation', this.editUser.password_confirmation);
        }

        // We need to include existing name/email for the update (backend may require them)
        formData.append('name', this.editUser.name);
        formData.append('email', this.editUser.email);

        // Include current permissions and widgets to avoid losing them
        formData.append('modules', JSON.stringify(this.editUser.permissions));
        formData.append('dashboard_widgets', JSON.stringify(this.editUser.selectedWidgets));

        const response = await this.adminStore.updateUser(this.editUser.id, formData);

        if (response && response.success) {
          // Clear password fields after successful update
          this.editUser.password = '';
          this.editUser.password_confirmation = '';

          // Show success notification (modal stays open)
          this.showSectionAlert('User information saved successfully!', 'success');

          // Emit event to refresh user list
          this.$emit('user-updated');
        }
      } catch (error) {
        console.error('Error saving user info:', error);
        this.showSectionAlert(error.message || 'Failed to save user information', 'danger');
      } finally {
        this.savingUserInfo = false;
      }
    },

    /**
     * Save Permissions section only
     */
    async savePermissions() {
      try {
        this.savingPermissions = true;

        if (!this.editUser.id) {
          throw new Error('User ID is required');
        }

        const formData = new FormData();
        formData.append('name', this.editUser.name);
        formData.append('email', this.editUser.email);
        formData.append('role', this.editUser.role);
        formData.append('modules', JSON.stringify(this.editUser.permissions));
        formData.append('dashboard_widgets', JSON.stringify(this.editUser.selectedWidgets));

        const response = await this.adminStore.updateUser(this.editUser.id, formData);

        if (response && response.success) {
          // Show success notification (modal stays open)
          this.showSectionAlert('Permissions saved successfully!', 'success');

          // Emit event to refresh user list
          this.$emit('user-updated');

          // If permissions updated for current user, refresh their menu
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          if (currentUser && currentUser.id === this.editUser.id) {
            window.dispatchEvent(new CustomEvent('permissions-updated', {
              detail: { userId: this.editUser.id }
            }));
          }
        }
      } catch (error) {
        console.error('Error saving permissions:', error);
        this.showSectionAlert(error.message || 'Failed to save permissions', 'danger');
      } finally {
        this.savingPermissions = false;
      }
    },

    /**
     * Save Dashboard Widgets section only
     */
    async saveWidgets() {
      try {
        this.savingWidgets = true;

        if (!this.editUser.id) {
          throw new Error('User ID is required');
        }

        // Save widgets directly using the dashboard service
        await dashboardService.setUserWidgets(this.editUser.id, this.editUser.selectedWidgets);

        // Show success notification (modal stays open)
        this.showSectionAlert('Dashboard widgets saved successfully!', 'success');

        // Emit event to refresh user list
        this.$emit('user-updated');
      } catch (error) {
        console.error('Error saving widgets:', error);
        this.showSectionAlert(error.message || 'Failed to save dashboard widgets', 'danger');
      } finally {
        this.savingWidgets = false;
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

    resetNewUserForm() {
      this.newUser = {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
        permissions: {},
        profile_picture: null,
        selectedWidgets: []
      };

      // Reinitialize permissions
      this.initializePermissions();
      
      // Reinitialize default widgets
      this.initializeDefaultWidgets();
    },

    async setEditUser(user) {
      this.editUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        role: user.roles && user.roles.length > 0 ? user.roles[0].name : '',
        permissions: {},
        profile_picture: null,
        selectedWidgets: []
      };

      // Initialize permissions structure first
      const permissionsObj = {};
      this.modules.forEach(module => {
        permissionsObj[module.name] = {
          read: false,
          edit: false
        };
      });

      // Then populate with user's actual permissions
      if (user.permissions && user.permissions.length > 0) {
        user.permissions.forEach(perm => {
          const permName = perm.name;
          // Extract module name from permission (e.g., "user_management.read" -> "user_management")
          const parts = permName.split('.');
          if (parts.length === 2) {
            const moduleName = parts[0];
            const permType = parts[1];

            if (permissionsObj[moduleName]) {
              if (permType === 'read') {
                permissionsObj[moduleName].read = true;
              } else if (permType === 'edit') {
                permissionsObj[moduleName].edit = true;
              }
            }
          }
        });
      }

      this.editUser.permissions = permissionsObj;

      // Update permissions based on role if no permissions found
      if (!user.permissions || user.permissions.length === 0) {
        if (this.editUser.role) {
          this.updatePermissionsByRole('edit');
        }
      }

      // Load user's current widgets
      await this.loadUserWidgets(user.id);
    },

    /**
     * Load current widgets for a user when editing
     */
    async loadUserWidgets(userId) {
      try {
        const response = await dashboardService.getUserWidgets(userId);
        const widgetsData = response.data || response;
        
        if (widgetsData && Array.isArray(widgetsData)) {
          this.editUser.selectedWidgets = widgetsData.map(w => w.id);
          console.log(`[UserListModal] Loaded ${widgetsData.length} widgets for user ${userId}`);
        } else {
          // Fall back to default widgets if user has none
          this.editUser.selectedWidgets = this.widgets
            .filter(w => w.is_default)
            .map(w => w.id);
        }
      } catch (error) {
        console.error('[UserListModal] Error loading user widgets:', error);
        // Fall back to default widgets on error
        this.editUser.selectedWidgets = this.widgets
          .filter(w => w.is_default)
          .map(w => w.id);
      }
    }
  }
};
</script>

<style scoped>
/* ==========================================
   MODULE PERMISSIONS UI STYLES
   Visual hierarchy: Title > Menu > Module
   ========================================== */

/* Accordion Title Headers (Level 1) */
.accordion-button:not(.collapsed) {
  background-color: #f8f9fa;
  color: #000;
}

.accordion-button.bg-light {
  background-color: #e9ecef !important;
  font-weight: 600;
}

.accordion-button.bg-light:not(.collapsed) {
  background-color: #dee2e6 !important;
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.125);
}

/* Menu Section Headers (Level 2) */
.menu-section {
  border-bottom: 1px solid #e9ecef;
}

.menu-section:last-child {
  border-bottom: none;
}

.menu-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.menu-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #495057;
}

.bg-light.border-bottom {
  background-color: #f8f9fa !important;
}

/* Permission Table Styling (Level 3) */
.permission-table {
  margin-bottom: 0;
  border-collapse: separate;
  border-spacing: 0;
}

.permission-table thead tr {
  background-color: transparent;
}

.permission-table thead th {
  border-bottom: 1px solid #e9ecef;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 0.5px;
  color: #6c757d;
  vertical-align: middle;
}

.permission-table tbody tr.permission-row {
  transition: background-color 0.15s ease-in-out;
}

.permission-table tbody tr.permission-row:hover {
  background-color: #f8f9fa;
}

.permission-table tbody tr.permission-row td {
  vertical-align: middle;
  border-bottom: 1px solid #f0f0f0;
}

.permission-table tbody tr.permission-row:last-child td {
  border-bottom: none;
}

/* Checkbox Styling */
.permission-checkbox {
  width: 1.1rem;
  height: 1.1rem;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.permission-checkbox:hover {
  transform: scale(1.1);
}

.permission-checkbox:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.form-check-input:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Extra small button styles */
.btn-xs {
  padding: 0.2rem 0.5rem;
  font-size: 0.75rem;
  line-height: 1.2;
}

/* Modal Size */
.modal-xl {
  max-width: 1200px;
}

/* Nav pills styling for edit modal */
.nav-pills .nav-link {
  border-radius: 0.375rem;
  padding: 0.75rem 1rem;
}

.nav-pills .nav-link.active {
  background-color: #0d6efd;
}

.nav-pills .nav-link:not(.active) {
  background-color: #f8f9fa;
  color: #495057;
}

.nav-pills .nav-link:not(.active):hover {
  background-color: #e9ecef;
}

/* Badge styling */
.badge.bg-success {
  background-color: #198754 !important;
}

.badge.bg-primary {
  background-color: #0d6efd !important;
}

.badge.bg-secondary {
  background-color: #6c757d !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .modal-xl {
    max-width: 95%;
  }

  .permission-table {
    font-size: 0.875rem;
  }
  
  .permission-table thead th {
    font-size: 0.65rem;
    padding: 0.4rem 0.25rem;
  }
  
  .nav-pills .nav-link {
    padding: 0.5rem;
    font-size: 0.875rem;
  }
  
  .btn-xs {
    padding: 0.15rem 0.35rem;
    font-size: 0.7rem;
  }
  
  .permission-checkbox {
    width: 1rem;
    height: 1rem;
  }
}

/* Fix for Select2 dropdown inside Bootstrap modal */
:deep(.select2-container--open) {
  z-index: 9999 !important;
}

:deep(.select2-dropdown) {
  z-index: 9999 !important;
}

:deep(.modal-content .select2-container) {
  width: 100% !important;
}
</style>
