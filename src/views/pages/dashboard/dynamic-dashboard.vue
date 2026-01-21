<template>
  <layout-header></layout-header>
  <layout-sidebar></layout-sidebar>
  <div class="page-wrapper">
    <div class="content">
      <!-- Breadcrumb -->
      <div class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
        <index-breadcrumb :title="title" :text="text" :text1="text1" />
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div class="me-2 mb-2">
            <button 
              class="btn btn-outline-primary d-flex align-items-center"
              @click="showWidgetManager = true"
            >
              <i class="ti ti-layout-dashboard me-2"></i>
              Customize Dashboard
            </button>
          </div>
          <div class="ms-2 head-icons">
            <a 
              href="javascript:void(0);" 
              :class="{ active: isCollapsed }" 
              @click="toggleCollapse"
              data-bs-toggle="tooltip" 
              data-bs-placement="top" 
              data-bs-original-title="Collapse" 
              id="collapse-header"
            >
              <i class="ti ti-chevrons-up"></i>
            </a>
          </div>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">Loading your dashboard...</p>
      </div>

      <!-- Dashboard Widgets -->
      <div v-else class="row">
        <template v-for="widget in visibleWidgets" :key="widget.id">
          <div :class="getWidgetSizeClass(widget.size)">
            <div class="card" :class="{ 'collapsed-card': widget.is_collapsed }">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">
                  <i :class="widget.icon" class="me-2"></i>
                  {{ widget.display_name }}
                </h5>
                <div class="card-actions">
                  <button 
                    class="btn btn-sm btn-link p-0 me-2"
                    @click="toggleWidgetCollapse(widget)"
                    :title="widget.is_collapsed ? 'Expand' : 'Collapse'"
                  >
                    <i :class="widget.is_collapsed ? 'ti ti-chevron-down' : 'ti ti-chevron-up'"></i>
                  </button>
                  <button 
                    class="btn btn-sm btn-link p-0 text-danger"
                    @click="hideWidget(widget)"
                    title="Hide widget"
                  >
                    <i class="ti ti-x"></i>
                  </button>
                </div>
              </div>
              <div class="card-body" v-show="!widget.is_collapsed">
                <component 
                  :is="getWidgetComponent(widget.component)" 
                  :widget="widget"
                  :config="widget.user_config || widget.config"
                />
              </div>
            </div>
          </div>
        </template>

        <!-- Empty State -->
        <div v-if="visibleWidgets.length === 0" class="col-12">
          <div class="card">
            <div class="card-body text-center py-5">
              <i class="ti ti-layout-dashboard text-muted" style="font-size: 4rem;"></i>
              <h4 class="mt-3">No widgets configured</h4>
              <p class="text-muted">Click "Customize Dashboard" to add widgets to your dashboard.</p>
              <button class="btn btn-primary" @click="showWidgetManager = true">
                <i class="ti ti-plus me-2"></i>
                Add Widgets
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <layout-footer></layout-footer>
  </div>

  <!-- Widget Manager Modal -->
  <div 
    class="modal fade" 
    :class="{ show: showWidgetManager }"
    :style="{ display: showWidgetManager ? 'block' : 'none' }"
    tabindex="-1"
    @click.self="showWidgetManager = false"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="ti ti-layout-dashboard me-2"></i>
            Customize Dashboard
          </h5>
          <button type="button" class="btn-close" @click="showWidgetManager = false"></button>
        </div>
        <div class="modal-body">
          <!-- Current Widgets -->
          <div class="mb-4">
            <h6 class="mb-3">Your Widgets</h6>
            <div v-if="widgets.length === 0" class="text-muted text-center py-3">
              No widgets added yet
            </div>
            <div v-else class="list-group">
              <div 
                v-for="(widget, index) in widgets" 
                :key="widget.id"
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <div class="d-flex align-items-center">
                  <i :class="widget.icon" class="me-3 text-primary"></i>
                  <div>
                    <strong>{{ widget.display_name }}</strong>
                    <br>
                    <small class="text-muted">{{ widget.description }}</small>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <button 
                    class="btn btn-sm btn-outline-secondary"
                    @click="moveWidgetUp(index)"
                    :disabled="index === 0"
                    title="Move up"
                  >
                    <i class="ti ti-arrow-up"></i>
                  </button>
                  <button 
                    class="btn btn-sm btn-outline-secondary"
                    @click="moveWidgetDown(index)"
                    :disabled="index === widgets.length - 1"
                    title="Move down"
                  >
                    <i class="ti ti-arrow-down"></i>
                  </button>
                  <div class="form-check form-switch">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      :id="'visible-' + widget.id"
                      :checked="widget.is_visible"
                      @change="toggleWidgetVisible(widget)"
                    >
                    <label class="form-check-label" :for="'visible-' + widget.id">
                      Visible
                    </label>
                  </div>
                  <button 
                    class="btn btn-sm btn-outline-danger"
                    @click="removeWidget(widget)"
                    title="Remove"
                  >
                    <i class="ti ti-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Available Widgets -->
          <div>
            <h6 class="mb-3">Available Widgets</h6>
            <div v-if="loadingAvailable" class="text-center py-3">
              <div class="spinner-border spinner-border-sm" role="status"></div>
              <span class="ms-2">Loading...</span>
            </div>
            <div v-else>
              <!-- Group by category -->
              <div v-for="(categoryWidgets, category) in availableWidgetsByCategory" :key="category" class="mb-3">
                <h6 class="text-muted mb-2">{{ getCategoryName(category) }}</h6>
                <div class="row g-2">
                  <div 
                    v-for="widget in categoryWidgets" 
                    :key="widget.id"
                    class="col-md-6"
                  >
                    <div 
                      class="card card-body p-3"
                      :class="{ 'bg-light': isWidgetAdded(widget.id) }"
                    >
                      <div class="d-flex justify-content-between align-items-start">
                        <div class="d-flex align-items-center">
                          <i :class="widget.icon" class="me-2 text-primary"></i>
                          <div>
                            <strong>{{ widget.display_name }}</strong>
                            <br>
                            <small class="text-muted">{{ widget.description }}</small>
                          </div>
                        </div>
                        <button 
                          v-if="!isWidgetAdded(widget.id)"
                          class="btn btn-sm btn-primary"
                          @click="addWidget(widget)"
                          :disabled="addingWidget === widget.id"
                        >
                          <span v-if="addingWidget === widget.id" class="spinner-border spinner-border-sm"></span>
                          <i v-else class="ti ti-plus"></i>
                        </button>
                        <span v-else class="badge bg-success">Added</span>
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
            class="btn btn-outline-secondary" 
            @click="resetToDefaults"
            :disabled="resetting"
          >
            <span v-if="resetting" class="spinner-border spinner-border-sm me-2"></span>
            Reset to Defaults
          </button>
          <button class="btn btn-primary" @click="showWidgetManager = false">
            Done
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showWidgetManager" class="modal-backdrop fade show"></div>
</template>

<script>
import { dashboardService } from '@/services/dashboard.service';

// Import widget components
import WelcomeWidget from '@/components/dashboard-widgets/WelcomeWidget.vue';
import QuickActionsWidget from '@/components/dashboard-widgets/QuickActionsWidget.vue';
import EmployeeStatsWidget from '@/components/dashboard-widgets/EmployeeStatsWidget.vue';
import LeaveSummaryWidget from '@/components/dashboard-widgets/LeaveSummaryWidget.vue';
import SystemNotificationsWidget from '@/components/dashboard-widgets/SystemNotificationsWidget.vue';
import PlaceholderWidget from '@/components/dashboard-widgets/PlaceholderWidget.vue';

export default {
  name: 'DynamicDashboard',
  components: {
    WelcomeWidget,
    QuickActionsWidget,
    EmployeeStatsWidget,
    LeaveSummaryWidget,
    SystemNotificationsWidget,
    PlaceholderWidget,
  },
  data() {
    return {
      title: 'Dashboard',
      text: 'Home',
      text1: 'Dashboard',
      widgets: [],
      availableWidgets: [],
      loading: true,
      loadingAvailable: false,
      showWidgetManager: false,
      isCollapsed: false,
      addingWidget: null,
      resetting: false,
      categories: {},
    };
  },
  computed: {
    visibleWidgets() {
      return this.widgets.filter(w => w.is_visible);
    },
    availableWidgetsByCategory() {
      const grouped = {};
      this.availableWidgets.forEach(widget => {
        if (!grouped[widget.category]) {
          grouped[widget.category] = [];
        }
        grouped[widget.category].push(widget);
      });
      return grouped;
    },
  },
  async mounted() {
    await this.loadDashboard();
  },
  watch: {
    showWidgetManager(newVal) {
      if (newVal) {
        this.loadAvailableWidgets();
      }
    },
  },
  methods: {
    async loadDashboard() {
      this.loading = true;
      try {
        const response = await dashboardService.getMyWidgets();
        this.widgets = response.data || [];
      } catch (error) {
        console.error('Error loading dashboard:', error);
        this.$message.error('Failed to load dashboard');
      } finally {
        this.loading = false;
      }
    },

    async loadAvailableWidgets() {
      this.loadingAvailable = true;
      try {
        const response = await dashboardService.getAvailableWidgets();
        this.availableWidgets = response.data || [];
        this.categories = response.categories || dashboardService.getWidgetCategories();
      } catch (error) {
        console.error('Error loading available widgets:', error);
      } finally {
        this.loadingAvailable = false;
      }
    },

    getWidgetComponent(componentName) {
      // Map component names to actual components
      const componentMap = {
        'WelcomeWidget': 'WelcomeWidget',
        'QuickActionsWidget': 'QuickActionsWidget',
        'EmployeeStatsWidget': 'EmployeeStatsWidget',
        'LeaveSummaryWidget': 'LeaveSummaryWidget',
        'SystemNotificationsWidget': 'SystemNotificationsWidget',
      };
      
      return componentMap[componentName] || 'PlaceholderWidget';
    },

    getWidgetSizeClass(size) {
      return dashboardService.getWidgetSizeClass(size);
    },

    getCategoryName(category) {
      const names = dashboardService.getWidgetCategories();
      return names[category] || category;
    },

    isWidgetAdded(widgetId) {
      return this.widgets.some(w => w.id === widgetId);
    },

    async addWidget(widget) {
      this.addingWidget = widget.id;
      try {
        await dashboardService.addWidget(widget.id);
        await this.loadDashboard();
        this.$message.success(`${widget.display_name} added to dashboard`);
      } catch (error) {
        console.error('Error adding widget:', error);
        this.$message.error(error.message || 'Failed to add widget');
      } finally {
        this.addingWidget = null;
      }
    },

    async removeWidget(widget) {
      try {
        await dashboardService.removeWidget(widget.id);
        this.widgets = this.widgets.filter(w => w.id !== widget.id);
        this.$message.success(`${widget.display_name} removed from dashboard`);
      } catch (error) {
        console.error('Error removing widget:', error);
        this.$message.error(error.message || 'Failed to remove widget');
      }
    },

    async hideWidget(widget) {
      try {
        await dashboardService.toggleWidgetVisibility(widget.id);
        widget.is_visible = false;
        this.$message.info(`${widget.display_name} hidden`);
      } catch (error) {
        console.error('Error hiding widget:', error);
      }
    },

    async toggleWidgetVisible(widget) {
      try {
        await dashboardService.toggleWidgetVisibility(widget.id);
        widget.is_visible = !widget.is_visible;
      } catch (error) {
        console.error('Error toggling visibility:', error);
      }
    },

    async toggleWidgetCollapse(widget) {
      try {
        await dashboardService.toggleWidgetCollapse(widget.id);
        widget.is_collapsed = !widget.is_collapsed;
      } catch (error) {
        console.error('Error toggling widget collapse:', error);
      }
    },

    toggleCollapse() {
      // Navbar header collapse toggle - consistent with other pages
      this.isCollapsed = !this.isCollapsed;
      if (this.isCollapsed) {
        document.body.classList.add('header-collapse');
      } else {
        document.body.classList.remove('header-collapse');
      }
    },

    async moveWidgetUp(index) {
      if (index === 0) return;
      
      const temp = this.widgets[index];
      this.widgets[index] = this.widgets[index - 1];
      this.widgets[index - 1] = temp;
      
      await this.saveWidgetOrder();
    },

    async moveWidgetDown(index) {
      if (index === this.widgets.length - 1) return;
      
      const temp = this.widgets[index];
      this.widgets[index] = this.widgets[index + 1];
      this.widgets[index + 1] = temp;
      
      await this.saveWidgetOrder();
    },

    async saveWidgetOrder() {
      try {
        const widgetOrder = this.widgets.map(w => w.id);
        await dashboardService.reorderWidgets(widgetOrder);
      } catch (error) {
        console.error('Error saving widget order:', error);
      }
    },

    async resetToDefaults() {
      this.resetting = true;
      try {
        await dashboardService.resetToDefaults();
        await this.loadDashboard();
        this.$message.success('Dashboard reset to defaults');
      } catch (error) {
        console.error('Error resetting dashboard:', error);
        this.$message.error('Failed to reset dashboard');
      } finally {
        this.resetting = false;
      }
    },
  },
};
</script>

<style scoped>
.collapsed-card .card-body {
  display: none;
}

.card-actions .btn-link {
  color: #6c757d;
}

.card-actions .btn-link:hover {
  color: #0d6efd;
}

.card-actions .btn-link.text-danger:hover {
  color: #dc3545 !important;
}

.list-group-item {
  transition: background-color 0.2s;
}

.list-group-item:hover {
  background-color: #f8f9fa;
}

.modal.show {
  background-color: rgba(0, 0, 0, 0.5);
}

.gap-2 {
  gap: 0.5rem;
}
</style>
