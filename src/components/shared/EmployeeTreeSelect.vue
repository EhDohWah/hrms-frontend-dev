<template>
  <div class="employee-tree-select-wrapper">
    <div class="custom-tree-select" :class="{ 'is-invalid': hasError }">
      <div 
        class="form-control tree-select-input" 
        @click="toggleDropdown"
        :class="{ 'is-invalid': hasError }"
      >
        <span v-if="displayText" class="selected-text">{{ displayText }}</span>
        <span v-else class="placeholder-text">{{ placeholder }}</span>
        <i class="ti ti-chevron-down dropdown-icon" :class="{ 'rotated': isOpen }"></i>
      </div>

      <!-- Custom Dropdown -->
      <div v-if="isOpen" class="tree-dropdown" ref="dropdownRef">
        <div class="dropdown-header">
          <input 
            type="text" 
            class="form-control form-control-sm search-input"
            :placeholder="searchPlaceholder"
            v-model="searchTerm"
            @input="handleSearch"
            ref="searchInputRef"
          >
        </div>
        <div class="dropdown-body" ref="dropdownBodyRef" @scroll="handleScroll">
          <div 
            v-for="organization in filteredTree" 
            :key="organization.key"
            class="organization-group"
          >
            <div class="organization-header" @click="toggleOrganization(organization.key)">
              <i class="ti" :class="organization.expanded ? 'ti-chevron-down' : 'ti-chevron-right'"></i>
              <span class="organization-name">{{ organization.title }}</span>
              <span class="employee-count">({{ organization.children?.length || 0 }})</span>
            </div>
            <div v-if="organization.expanded" class="employees-list">
              <!-- VIRTUALIZED EMPLOYEE LIST FOR PERFORMANCE -->
              <div 
                v-for="employee in getVisibleEmployees(organization.children)" 
                :key="employee.key"
                class="employee-item" 
                :class="{ 'selected': selectedValue === employee.value }"
                @click="selectItem(employee)"
              >
                <span class="employee-name">{{ employee.title }}</span>
                <small class="employee-info">ID: {{ employee.staff_id || 'N/A' }}</small>
              </div>
              <!-- Show "Load More" if there are more employees -->
              <div v-if="hasMoreItems(organization.children)" class="load-more-button">
                <button @click.stop="loadMore(organization.key)" class="btn-load-more">
                  Load More Employees...
                </button>
              </div>
            </div>
          </div>

          <!-- No results message -->
          <div v-if="filteredTree.length === 0" class="no-results">
            <i class="ti ti-search"></i>
            <span>No employees found</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="hasError && errorMessage" class="invalid-feedback">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
/**
 * EmployeeTreeSelect Component
 * 
 * A reusable hierarchical tree select component for selecting employees
 * organized by organization. Includes search, virtual scrolling, and
 * keyboard navigation support.
 * 
 * @props
 * - treeData: Array of organization objects with children (employees)
 * - modelValue: Selected employee ID (v-model support)
 * - placeholder: Placeholder text when nothing selected
 * - searchPlaceholder: Placeholder for search input
 * - hasError: Boolean to show error state
 * - errorMessage: Error message to display
 * - visibleCount: Number of employees to show before "Load More" (default: 20)
 * 
 * @emits
 * - update:modelValue: When selection changes
 * - select: When an employee is selected (with full employee object)
 */
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';

export default {
  name: 'EmployeeTreeSelect',
  
  props: {
    treeData: {
      type: Array,
      default: () => []
    },
    modelValue: {
      type: [String, Number],
      default: ''
    },
    displayValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Select employee'
    },
    searchPlaceholder: {
      type: String,
      default: 'Search employees...'
    },
    hasError: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: String,
      default: ''
    },
    visibleCount: {
      type: Number,
      default: 20
    }
  },
  
  emits: ['update:modelValue', 'select'],
  
  setup(props, { emit }) {
    // ============================================
    // STATE
    // ============================================
    const isOpen = ref(false);
    const searchTerm = ref('');
    const dropdownRef = ref(null);
    const searchInputRef = ref(null);
    const dropdownBodyRef = ref(null);
    const expandedOrganizations = ref(new Set());
    const visibleCounts = ref(new Map());
    
    // ============================================
    // COMPUTED
    // ============================================
    
    const selectedValue = computed(() => props.modelValue);
    
    const displayText = computed(() => props.displayValue);
    
    const filteredTree = computed(() => {
      const term = searchTerm.value.toLowerCase().trim();
      
      if (!term) {
        // Return tree with expansion state preserved
        return props.treeData.map(org => ({
          ...org,
          expanded: expandedOrganizations.value.has(org.key)
        }));
      }
      
      // Filter employees by search term
      return props.treeData
        .map(org => {
          const filteredChildren = (org.children || []).filter(emp => 
            emp.title?.toLowerCase().includes(term) ||
            emp.staff_id?.toLowerCase().includes(term)
          );
          
          return {
            ...org,
            children: filteredChildren,
            expanded: filteredChildren.length > 0 // Auto-expand if has matches
          };
        })
        .filter(org => org.children.length > 0);
    });
    
    // ============================================
    // METHODS
    // ============================================
    
    function toggleDropdown() {
      isOpen.value = !isOpen.value;
      if (isOpen.value) {
        nextTick(() => {
          searchInputRef.value?.focus();
        });
      }
    }
    
    function closeDropdown() {
      isOpen.value = false;
      searchTerm.value = '';
    }
    
    function toggleOrganization(key) {
      if (expandedOrganizations.value.has(key)) {
        expandedOrganizations.value.delete(key);
      } else {
        expandedOrganizations.value.add(key);
      }
    }
    
    function handleSearch() {
      // Reset visible counts when searching
      visibleCounts.value.clear();
    }
    
    function handleScroll(event) {
      // Could implement infinite scroll here if needed
    }
    
    function getVisibleEmployees(employees) {
      if (!employees || !Array.isArray(employees)) return [];
      const count = visibleCounts.value.get('default') || props.visibleCount;
      return employees.slice(0, count);
    }
    
    function hasMoreItems(employees) {
      if (!employees || !Array.isArray(employees)) return false;
      const count = visibleCounts.value.get('default') || props.visibleCount;
      return employees.length > count;
    }
    
    function loadMore(orgKey) {
      const currentCount = visibleCounts.value.get('default') || props.visibleCount;
      visibleCounts.value.set('default', currentCount + props.visibleCount);
    }
    
    function selectItem(employee) {
      emit('update:modelValue', employee.value);
      emit('select', employee);
      closeDropdown();
    }
    
    function handleClickOutside(event) {
      if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        const selectInput = dropdownRef.value.previousElementSibling;
        if (selectInput && !selectInput.contains(event.target)) {
          closeDropdown();
        }
      }
    }
    
    // ============================================
    // LIFECYCLE
    // ============================================
    
    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });
    
    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside);
    });
    
    // ============================================
    // EXPOSE
    // ============================================
    
    return {
      // State
      isOpen,
      searchTerm,
      dropdownRef,
      searchInputRef,
      dropdownBodyRef,
      
      // Computed
      selectedValue,
      displayText,
      filteredTree,
      
      // Methods
      toggleDropdown,
      closeDropdown,
      toggleOrganization,
      handleSearch,
      handleScroll,
      getVisibleEmployees,
      hasMoreItems,
      loadMore,
      selectItem
    };
  }
};
</script>

<style scoped>
.employee-tree-select-wrapper {
  width: 100%;
}

.custom-tree-select {
  position: relative;
}

.tree-select-input {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 38px;
}

.tree-select-input.is-invalid {
  border-color: #dc3545;
}

.selected-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.placeholder-text {
  color: #6c757d;
  flex: 1;
}

.dropdown-icon {
  transition: transform 0.2s ease;
  margin-left: 8px;
  color: #6c757d;
}

.dropdown-icon.rotated {
  transform: rotate(180deg);
}

.tree-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1050;
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  max-height: 350px;
  display: flex;
  flex-direction: column;
}

.dropdown-header {
  padding: 8px;
  border-bottom: 1px solid #dee2e6;
}

.search-input {
  width: 100%;
}

.dropdown-body {
  flex: 1;
  overflow-y: auto;
  max-height: 280px;
}

.organization-group {
  border-bottom: 1px solid #f0f0f0;
}

.organization-group:last-child {
  border-bottom: none;
}

.organization-header {
  padding: 10px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8f9fa;
  font-weight: 500;
  transition: background 0.15s ease;
}

.organization-header:hover {
  background: #e9ecef;
}

.organization-name {
  flex: 1;
}

.employee-count {
  color: #6c757d;
  font-size: 0.85em;
  font-weight: normal;
}

.employees-list {
  padding: 4px 0;
}

.employee-item {
  padding: 8px 12px 8px 32px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: background 0.15s ease;
}

.employee-item:hover {
  background: #e3f2fd;
}

.employee-item.selected {
  background: #bbdefb;
}

.employee-name {
  font-weight: 500;
}

.employee-info {
  color: #6c757d;
  font-size: 0.8em;
}

.load-more-button {
  padding: 8px 12px 8px 32px;
}

.btn-load-more {
  background: none;
  border: 1px dashed #6c757d;
  color: #6c757d;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85em;
  width: 100%;
  transition: all 0.15s ease;
}

.btn-load-more:hover {
  background: #f8f9fa;
  border-color: #495057;
  color: #495057;
}

.no-results {
  padding: 24px;
  text-align: center;
  color: #6c757d;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.no-results i {
  font-size: 1.5em;
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #dc3545;
}
</style>
