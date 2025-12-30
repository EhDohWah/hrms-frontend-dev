<template>
  <!-- Add Role Modal -->
  <div
    class="modal fade"
    id="add_role"
    tabindex="-1"
    aria-labelledby="addRoleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="addRoleModalLabel">Add Role</h4>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitNewRole" id="addRoleForm">
            <div class="mb-3">
              <label class="form-label">Role Name <span class="text-danger">*</span></label>
              <input
                type="text"
                class="form-control"
                v-model="newRole.name"
                @input="formatRoleName"
                placeholder="e.g., hr-coordinator"
                required
              />
              <small class="form-text text-muted">
                Use lowercase letters, numbers, and hyphens only. Spaces will be converted to hyphens.
              </small>
              <div v-if="newRole.nameError" class="text-danger mt-1">
                {{ newRole.nameError }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Status</label>
              <select class="form-select" v-model="newRole.status" disabled>
                <option value="active">Active</option>
              </select>
              <small class="form-text text-muted">All new roles are active by default</small>
            </div>

            <div class="d-flex justify-content-end gap-2">
              <button
                type="button"
                class="btn btn-light"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="btn btn-primary" 
                :disabled="loading || !isValidNewRole"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                Add Role
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Edit Role Modal -->
  <div
    class="modal fade"
    id="edit_role"
    tabindex="-1"
    aria-labelledby="editRoleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="editRoleModalLabel">Edit Role</h4>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitEditRole" id="editRoleForm">
            <div class="mb-3">
              <label class="form-label">Role Name <span class="text-danger">*</span></label>
              <input
                type="text"
                class="form-control"
                v-model="editRole.name"
                @input="formatEditRoleName"
                placeholder="e.g., hr-coordinator"
                required
              />
              <small class="form-text text-muted">
                Use lowercase letters, numbers, and hyphens only. Spaces will be converted to hyphens.
              </small>
              <div v-if="editRole.nameError" class="text-danger mt-1">
                {{ editRole.nameError }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Status</label>
              <select class="form-select" v-model="editRole.status">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div class="alert alert-warning" v-if="editRole.name">
              <i class="ti ti-alert-triangle me-2"></i>
              <strong>Warning:</strong> Renaming a role will affect all users currently assigned to this role.
            </div>

            <div class="d-flex justify-content-end gap-2">
              <button
                type="button"
                class="btn btn-light"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="btn btn-primary" 
                :disabled="loading || !isValidEditRole"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                Update Role
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { roleService } from "@/services/role.service";
import { Modal } from "bootstrap";

export default {
  name: "RoleListModal",
  emits: ["role-added", "role-updated"],
  data() {
    return {
      newRole: {
        name: "",
        status: "active",
        nameError: "",
      },
      editRole: {
        id: null,
        name: "",
        status: "active",
        nameError: "",
      },
      loading: false,
      addModal: null,
      editModal: null,
    };
  },
  computed: {
    isValidNewRole() {
      return this.newRole.name && 
             this.newRole.name.trim().length > 0 && 
             !this.newRole.nameError &&
             /^[a-z0-9-]+$/.test(this.newRole.name);
    },
    isValidEditRole() {
      return this.editRole.name && 
             this.editRole.name.trim().length > 0 && 
             !this.editRole.nameError &&
             /^[a-z0-9-]+$/.test(this.editRole.name);
    },
  },
  mounted() {
    // Initialize modals after DOM is ready
    this.$nextTick(() => {
      const addModalEl = document.getElementById("add_role");
      const editModalEl = document.getElementById("edit_role");
      
      if (addModalEl) {
        this.addModal = new Modal(addModalEl);
        // Reset form when modal is hidden
        addModalEl.addEventListener('hidden.bs.modal', () => {
          this.resetNewRoleForm();
        });
      }
      
      if (editModalEl) {
        this.editModal = new Modal(editModalEl);
      }
    });
  },
  methods: {
    formatRoleName() {
      // Convert spaces to hyphens and make lowercase
      let formatted = this.newRole.name
        .toLowerCase()
        .replace(/\s+/g, '-')  // Replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, ''); // Remove invalid characters
      
      this.newRole.name = formatted;
      
      // Validate
      if (!formatted) {
        this.newRole.nameError = "";
      } else if (!/^[a-z0-9-]+$/.test(formatted)) {
        this.newRole.nameError = "Only lowercase letters, numbers, and hyphens allowed";
      } else if (formatted === 'admin' || formatted === 'hr-manager') {
        this.newRole.nameError = "Cannot use protected role names";
      } else {
        this.newRole.nameError = "";
      }
    },
    formatEditRoleName() {
      // Convert spaces to hyphens and make lowercase
      let formatted = this.editRole.name
        .toLowerCase()
        .replace(/\s+/g, '-')  // Replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, ''); // Remove invalid characters
      
      this.editRole.name = formatted;
      
      // Validate
      if (!formatted) {
        this.editRole.nameError = "";
      } else if (!/^[a-z0-9-]+$/.test(formatted)) {
        this.editRole.nameError = "Only lowercase letters, numbers, and hyphens allowed";
      } else if (formatted === 'admin' || formatted === 'hr-manager') {
        this.editRole.nameError = "Cannot use protected role names";
      } else {
        this.editRole.nameError = "";
      }
    },
    openEdit(role) {
      this.editRole = {
        id: role.id,
        name: role.name,
        status: "active",
        nameError: "",
      };
    },
    async submitNewRole() {
      if (!this.isValidNewRole) {
        this.$message.error("Please enter a valid role name");
        return;
      }
      
      this.loading = true;
      try {
        const response = await roleService.createRole({
          name: this.newRole.name,
        });

        // BaseService returns the response directly - check for success
        if (response && (response.success !== false)) {
          this.$message.success(response.message || "Role created successfully");
          if (this.addModal) {
            this.addModal.hide();
          }
          this.resetNewRoleForm();
          this.$emit("role-added");
        } else {
          this.$message.error(response?.message || "Failed to create role");
        }
      } catch (error) {
        console.error("Error creating role:", error);
        // Handle structured errors from BaseService
        const errorMessage = error.message || 
          error.errors?.name?.[0] ||
          "Failed to create role";
        this.$message.error(errorMessage);
      } finally {
        this.loading = false;
      }
    },
    async submitEditRole() {
      if (!this.isValidEditRole) {
        this.$message.error("Please enter a valid role name");
        return;
      }
      
      this.loading = true;
      try {
        const response = await roleService.updateRole(this.editRole.id, {
          name: this.editRole.name,
        });

        // BaseService returns the response directly - check for success
        if (response && (response.success !== false)) {
          this.$message.success(response.message || "Role updated successfully");
          if (this.editModal) {
            this.editModal.hide();
          }
          this.$emit("role-updated");
        } else {
          this.$message.error(response?.message || "Failed to update role");
        }
      } catch (error) {
        console.error("Error updating role:", error);
        // Handle structured errors from BaseService
        const errorMessage = error.message ||
          error.errors?.name?.[0] ||
          "Failed to update role";
        this.$message.error(errorMessage);
      } finally {
        this.loading = false;
      }
    },
    resetNewRoleForm() {
      this.newRole = {
        name: "",
        status: "active",
        nameError: "",
      };
    },
  },
};
</script>

<style scoped>
.form-text {
  font-size: 0.875rem;
}

.alert {
  font-size: 0.875rem;
}

.gap-2 {
  gap: 0.5rem;
}
</style>
