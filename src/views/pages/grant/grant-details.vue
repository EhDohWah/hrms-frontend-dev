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
            <router-link :to="'/grant/edit/' + grantId" class="btn btn-primary">
              <i class="ti ti-pencil me-1"></i>Edit Grant
            </router-link>
          </div>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <!-- Grant Details -->
      <div class="row">
        <div class="col-lg-9">
          <div class="card">
            <div class="card-body">
              <div class="my-auto mb-4">
                <h6 class="fw-medium d-inline-flex align-items-center mb-3 mb-sm-0">
                  <router-link to="/grant/list">
                    <i class="ti ti-arrow-left me-2"></i>Back to Grant List
                  </router-link>
                </h6>
              </div>
              <div class="project-details">
                <h5 class="card-title">{{ grant.name }}</h5>
                <div class="row">
                  <div class="col-lg-6 col-md-6 col-sm-12">
                    <div class="project-info">
                      <label>Grant Code</label>
                      <p>{{ grant.code }}</p>
                    </div>
                    <div class="project-info">
                      <label>Grant Amount</label>
                      <p>{{ grant.amount }}</p>
                    </div>

                    
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12">
                    <div class="project-info">
                      <label>End Date</label>
                      <p>{{ grant.endDate }}</p>
                    </div>
                    
                  </div>
                </div>
              </div>

              <div class="project-description">
                <h5 class="card-title">Description</h5>
                <p>{{ grant.description }}</p>
              </div>

              <!-- Grant Items Table -->
              <div class="mt-4">
                <h5 class="card-title">Grant Items</h5>
                <div class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th>BG Line</th>
                        <th>Position</th>
                        <th>Salary</th>
                        <th>Benefit</th>
                        <th>Effort</th>
                        <th>Position Number</th>
                        <th>Cost Monthly</th>
                        <th>Total Amount Annual</th>
                        <th>Total Cost By Person</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in grant.items" :key="item.id">
                        <td>{{ item.bg_line }}</td>
                        <td>{{ item.grant_position }}</td>
                        <td>
                          {{ parseFloat(item.grant_salary).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }) }}
                        </td>
                        <td>
                          {{ parseFloat(item.grant_benefit).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }) }}
                        </td>
                        <td>{{ item.grant_level_of_effort }}</td>
                        <td class="text-center">{{ item.grant_position_number }}</td>
                        <td>
                          {{ parseFloat(item.costMonthly).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }) }}
                        </td>
                        <td>
                          {{ parseFloat(item.totalAmountAnnual).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }) }}
                        </td>
                        <td>
                          {{ parseFloat(item.totalCostByPerson).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div class="col-lg-3">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Timeline</h5>
              <div class="activity-feed">
                <div class="feed-item" v-for="activity in grant.activities" :key="activity.id">
                  <div class="feed-date">{{ activity.date }}</div>
                  <span class="feed-text">{{ activity.description }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- /Grant Details -->
    </div>


    <div
      class="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3"
    >
      <p class="mb-0">2014 - 2025 &copy; HRMS</p>
      <p>
        Designed &amp; Developed By
        <a href="javascript:void(0);" class="text-primary">Dreams</a>
      </p>
    </div>
  </div>
</template>

<script>
import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';
import { useGrantStore } from '@/stores/grantStore';

export default {
  name: 'GrantDetails',
  components: {
    indexBreadcrumb
  },
  data() {
    return {
      title: 'Grant Details',
      text: 'Grants',
      text1: 'Grant Details',
      grantId: this.$route.params.id,
      grant: {
        name: 'Loading...',
        code: '',
        amount: '',
        startDate: '',
        endDate: '',
        status: '',
        department: '',
        investigator: '',
        description: 'Loading grant details...',
        items: [],
        documents: [],
        activities: []
      },
      grantStore: useGrantStore()
    };
  },
  mounted() {
    this.fetchGrantDetails();
  },
  methods: {
    async fetchGrantDetails() {
      try {
        // First ensure we have the grants loaded
        await this.grantStore.fetchGrants();
        
        // Find the grant by ID
        const grantData = this.grantStore.getGrantById(parseInt(this.grantId) || this.grantId);
        
        if (grantData) {
          this.grant = {
            id: grantData.id,
            name: grantData.name,
            code: grantData.code,
            amount: grantData.amount || this.calculateTotalAmount(grantData.grant_items),
            startDate: grantData.startDate || new Date().toLocaleDateString(),
            endDate: grantData.end_date || grantData.endDate,
            status: grantData.status || 'Pending',
            department: grantData.department || 'Not specified',
            investigator: grantData.investigator || 'Not assigned',
            description: grantData.description || 'No description available',
            items: this.processGrantItems(grantData.grant_items || []),
            activities: [
              { id: 1, date: new Date().toLocaleDateString(), description: 'Grant details viewed' }
            ]
          };
        } else {
          console.error('Grant not found with ID:', this.grantId);
        }
      } catch (error) {
        console.error('Error fetching grant details:', error);
      }
    },
    
    processGrantItems(items) {
      return items.map(item => {
        const salary = parseFloat(item.grant_salary || 0);
        const benefit = parseFloat(item.grant_benefit || 0);
        const effort = parseFloat(item.grant_level_of_effort || 0) / 100;
        
        const costMonthly = ((salary + benefit) * effort);
        const totalAmountAnnual = (costMonthly * 12 * item.grant_position_number);
        const totalCostByPerson = (totalAmountAnnual / 2);
        
        
        return {
          id: item.id,
          bg_line: item.bg_line,
          grant_position: item.grant_position,
          grant_salary: item.grant_salary,
          grant_benefit: item.grant_benefit,
          grant_level_of_effort: item.grant_level_of_effort,
          grant_position_number: item.grant_position_number,
          position_id: item.position_id,
          costMonthly: costMonthly,
          totalCostByPerson: totalCostByPerson,
          totalAmountAnnual: totalAmountAnnual
        };
      });
    },
    
    calculateTotalAmount(items) {
      if (!items || !items.length) return '$0.00';
      const total = items.reduce((sum, item) => sum + Number(item.grant_total_amount || 0), 0);
      return `$${total.toFixed(2)}`;
    },
    
    getStatusClass(status) {
      const statusClasses = {
        'active': 'bg-success',
        'pending': 'bg-warning',
        'completed': 'bg-info',
        'cancelled': 'bg-danger'
      };
      return statusClasses[status.toLowerCase()] || 'bg-secondary';
    }
  }
};
</script>

<style scoped>
.project-info {
  margin-bottom: 1rem;
}
.project-info label {
  font-weight: 600;
  margin-bottom: 0.25rem;
}
.activity-feed {
  padding: 1rem 0;
}
.feed-item {
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
}
.feed-date {
  color: #888;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}
.file-card {
  margin-bottom: 1rem;
}
</style> 