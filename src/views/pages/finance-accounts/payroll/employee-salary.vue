<template>
  <layout-header></layout-header>
  <layout-sidebar></layout-sidebar>
  <!-- Page Wrapper -->
  <div class="page-wrapper">
    <div class="content">
      <!-- Breadcrumb -->
      <div class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
        <div class="d-flex align-items-center">
          <index-breadcrumb :title="title" :text="text" :text1="text1" />
          <!-- Read-Only Badge -->
          <span
            v-if="isReadOnly"
            class="badge badge-warning-light ms-3 d-flex align-items-center"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="You have view-only access to this module"
          >
            <i class="ti ti-eye me-1"></i> Read Only
          </span>
        </div>
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div class="mb-2 d-flex gap-2">
            <!-- Create Payroll Button - Only visible if user can edit -->
            <button
              v-if="canEdit"
              type="button"
              class="btn btn-primary btn-sm d-flex align-items-center"
              data-bs-toggle="modal"
              data-bs-target="#bulk-payroll-modal"
            >
              <i class="ti ti-cash-banknote me-2"></i>Create Payroll
            </button>
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
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
          <div class="d-flex align-items-center gap-3">
            <h5 class="mb-0">Employee Salary List</h5>
            <!-- View Toggle -->
            <div class="btn-group" role="group">
              <button
                type="button"
                :class="['btn btn-sm', viewMode === 'standard' ? 'btn-primary' : 'btn-outline-primary']"
                @click="viewMode = 'standard'"
              >
                <i class="ti ti-list me-1"></i>Standard View
              </button>
              <button
                type="button"
                :class="['btn btn-sm', viewMode === 'budget-history' ? 'btn-primary' : 'btn-outline-primary']"
                @click="switchToBudgetHistory"
              >
                <i class="ti ti-history me-1"></i>Budget History
              </button>
            </div>
          </div>
          <div class="d-flex align-items-center flex-wrap row-gap-2">

            <!-- Filters Section -->
            <div class="filters-wrapper">
              <!-- Month Filter (Standard View) -->
              <div v-if="viewMode === 'standard'" class="filter-item">
                <a-date-picker
                  v-model:value="selectedMonth"
                  picker="month"
                  placeholder="Select month"
                  format="MMMM YYYY"
                  style="min-width: 180px"
                  @change="handleMonthChange"
                  allow-clear
                >
                  <template #suffixIcon>
                    <i class="ti ti-calendar"></i>
                  </template>
                </a-date-picker>
              </div>

              <!-- Date Range Picker (Budget History View) -->
              <div v-if="viewMode === 'budget-history'" class="filter-item">
                <a-range-picker
                  v-model:value="budgetHistoryRange"
                  picker="month"
                  placeholder="['Start Month', 'End Month']"
                  format="MMM YYYY"
                  style="min-width: 280px"
                  @change="handleBudgetHistoryRangeChange"
                >
                  <template #suffixIcon>
                    <i class="ti ti-calendar-time"></i>
                  </template>
                </a-range-picker>
              </div>

              <!-- Organization Filter -->
              <div class="filter-item">
                <a-select
                  v-model:value="selectedOrganization"
                  placeholder="All Organizations"
                  allow-clear
                  show-search
                  :filter-option="filterOption"
                  style="min-width: 180px"
                  @change="handleFilterChange"
                >
                  <template #suffixIcon>
                    <i class="ti ti-building"></i>
                  </template>
                  <a-select-option v-for="organization in availableSubsidiaries" :key="organization" :value="organization">
                    {{ organization }}
                  </a-select-option>
                </a-select>
              </div>

              <!-- Department Filter - Only visible if user has departments.read permission -->
              <div v-if="canReadDepartments" class="filter-item">
                <a-select
                  v-model:value="selectedDepartment"
                  placeholder="All Departments"
                  allow-clear
                  show-search
                  :filter-option="filterOption"
                  style="min-width: 180px"
                  @change="handleFilterChange"
                >
                  <template #suffixIcon>
                    <i class="ti ti-users-group"></i>
                  </template>
                  <a-select-option v-for="department in availableDepartments" :key="department" :value="department">
                    {{ department }}
                  </a-select-option>
                </a-select>
              </div>

              <!-- Sort Filter -->
              <div class="filter-item">
                <a-select
                  v-model:value="selectedSortBy"
                  placeholder="Recently Added"
                  show-search
                  :filter-option="filterOption"
                  style="min-width: 180px"
                  @change="handleFilterChange"
                >
                  <template #suffixIcon>
                    <i class="ti ti-arrows-sort"></i>
                  </template>
                  <a-select-option v-for="option in sortOptions" :key="option.key" :value="option.key">
                    {{ option.label }}
                  </a-select-option>
                </a-select>
              </div>

              <!-- Clear Filters Button -->
              <button
                v-if="selectedOrganization || selectedDepartment || selectedMonth || (budgetHistoryRange && budgetHistoryRange.length)"
                type="button"
                class="btn btn-outline-secondary btn-sm clear-filters-btn"
                @click="clearFilters"
              >
                <i class="ti ti-x me-1"></i>Clear
              </button>
            </div>
          </div>
        </div>

        <div class="card-body">
          <!-- Loading State - Matching grant-list and employee-list pattern -->
          <div v-if="loading" class="text-center my-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading payroll data...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="text-center my-3 py-5">
            <div class="mb-3">
              <i class="ti ti-alert-circle text-danger" style="font-size: 48px;"></i>
            </div>
            <p class="text-danger mb-3">{{ error }}</p>
            <button type="button" class="btn btn-primary btn-sm" @click="fetchPayrolls">
              <i class="ti ti-refresh me-1"></i>Try Again
            </button>
          </div>

          <!-- STANDARD VIEW TABLE -->
          <div v-else-if="viewMode === 'standard'" class="resize-observer-fix">
            <a-table
              v-if="tableData && tableData.length > 0"
              :columns="columns"
              :data-source="tableData"
              :row-key="record => record.employment_id"
              :pagination="false"
              :scroll="{ x: 'max-content' }"
              :expand-column-width="50"
              v-model:expanded-row-keys="expandedRowKeys"
              @change="handleTableChange"
              @expand="handleExpand"
            >
              <!-- Expandable Row Content -->
              <template #expandedRowRender="{ record }">
                <div class="expanded-row-content">
                  <div class="expanded-header">
                    <div class="expanded-title">
                      <i class="ti ti-file-invoice me-2"></i>
                      Payroll Details for {{ record.employeeName }}
                    </div>
                    <span class="expanded-count">{{ record.payrolls?.length || 0 }} record(s)</span>
                  </div>
                  <a-table
                    class="inner-payroll-table"
                    :columns="innerColumns"
                    :data-source="record.payrolls || []"
                    :row-key="innerRecord => innerRecord.id"
                    :pagination="false"
                    size="small"
                    :bordered="false"
                    :scroll="{ x: 2500 }"
                  >
                    <template #bodyCell="{ column, record: innerRecord }">
                      <!-- Pay Period Date -->
                      <template v-if="column.key === 'pay_period_date'">
                        <span class="date-badge">
                          <i class="ti ti-calendar-stats me-1"></i>
                          {{ formatDate(innerRecord.pay_period_date) }}
                        </span>
                      </template>
                      <!-- Grant Name -->
                      <template v-else-if="column.key === 'grant_name'">
                        <span class="grant-badge-inner">
                          <i class="ti ti-gift me-1"></i>
                          {{ innerRecord.grant_name }}
                        </span>
                      </template>
                      <!-- FTE -->
                      <template v-else-if="column.key === 'fte'">
                        <span class="fte-badge">{{ innerRecord.fte }}</span>
                      </template>
                      <!-- Salary Fields - Currency formatting -->
                      <template v-else-if="column.key === 'gross_salary'">
                        <span class="inner-salary gross">{{ formatCurrency(innerRecord.gross_salary) }}</span>
                      </template>
                      <template v-else-if="column.key === 'gross_salary_by_FTE'">
                        <span class="inner-salary">{{ formatCurrency(innerRecord.gross_salary_by_FTE) }}</span>
                      </template>
                      <template v-else-if="column.key === 'compensation_refund'">
                        <span class="inner-salary">{{ formatCurrency(innerRecord.compensation_refund) }}</span>
                      </template>
                      <template v-else-if="column.key === 'thirteen_month_salary'">
                        <span class="inner-salary">{{ formatCurrency(innerRecord.thirteen_month_salary) }}</span>
                      </template>
                      <template v-else-if="column.key === 'thirteen_month_salary_accured'">
                        <span class="inner-salary">{{ formatCurrency(innerRecord.thirteen_month_salary_accured) }}</span>
                      </template>
                      <!-- Benefits -->
                      <template v-else-if="column.key === 'pvd'">
                        <span class="inner-salary benefit">{{ formatCurrency(innerRecord.pvd) }}</span>
                      </template>
                      <template v-else-if="column.key === 'saving_fund'">
                        <span class="inner-salary benefit">{{ formatCurrency(innerRecord.saving_fund) }}</span>
                      </template>
                      <!-- Social Security -->
                      <template v-else-if="column.key === 'employer_social_security'">
                        <span class="inner-salary employer">{{ formatCurrency(innerRecord.employer_social_security) }}</span>
                      </template>
                      <template v-else-if="column.key === 'employee_social_security'">
                        <span class="inner-salary deduction">{{ formatCurrency(innerRecord.employee_social_security) }}</span>
                      </template>
                      <!-- Health Welfare -->
                      <template v-else-if="column.key === 'employer_health_welfare'">
                        <span class="inner-salary employer">{{ formatCurrency(innerRecord.employer_health_welfare) }}</span>
                      </template>
                      <template v-else-if="column.key === 'employee_health_welfare'">
                        <span class="inner-salary deduction">{{ formatCurrency(innerRecord.employee_health_welfare) }}</span>
                      </template>
                      <!-- Tax -->
                      <template v-else-if="column.key === 'tax'">
                        <span class="inner-salary deduction">{{ formatCurrency(innerRecord.tax) }}</span>
                      </template>
                      <!-- Salary Bonus -->
                      <template v-else-if="column.key === 'salary_bonus'">
                        <span class="inner-salary income">{{ formatCurrency(innerRecord.salary_bonus) }}</span>
                      </template>
                      <!-- Notes -->
                      <template v-else-if="column.key === 'notes'">
                        <span class="notes-text" :title="innerRecord.notes">{{ innerRecord.notes || '-' }}</span>
                      </template>
                      <!-- Total columns -->
                      <template v-else-if="column.key === 'total_salary'">
                        <span class="inner-salary total">{{ formatCurrency(innerRecord.total_salary) }}</span>
                      </template>
                      <template v-else-if="column.key === 'total_pvd'">
                        <span class="inner-salary total">{{ formatCurrency(innerRecord.total_pvd) }}</span>
                      </template>
                      <template v-else-if="column.key === 'total_saving_fund'">
                        <span class="inner-salary total">{{ formatCurrency(innerRecord.total_saving_fund) }}</span>
                      </template>
                      <template v-else-if="column.key === 'total_income'">
                        <span class="inner-salary income total">{{ formatCurrency(innerRecord.total_income) }}</span>
                      </template>
                      <template v-else-if="column.key === 'employer_contribution'">
                        <span class="inner-salary employer total">{{ formatCurrency(innerRecord.employer_contribution) }}</span>
                      </template>
                      <template v-else-if="column.key === 'total_deduction'">
                        <span class="inner-salary deduction total">{{ formatCurrency(innerRecord.total_deduction) }}</span>
                      </template>
                      <template v-else-if="column.key === 'net_salary'">
                        <span class="inner-salary net highlight">{{ formatCurrency(innerRecord.net_salary) }}</span>
                      </template>
                      <!-- Actions -->
                      <template v-else-if="column.key === 'actions'">
                        <div class="inner-action-buttons">
                          <a href="javascript:void(0);" class="inner-action-btn view" title="View">
                            <i class="ti ti-eye"></i>
                          </a>
                          <a v-if="canEdit" href="javascript:void(0);" class="inner-action-btn edit" title="Edit">
                            <i class="ti ti-edit"></i>
                          </a>
                          <a v-if="canEdit" href="javascript:void(0);" class="inner-action-btn delete" title="Delete">
                            <i class="ti ti-trash"></i>
                          </a>
                        </div>
                      </template>
                    </template>
                  </a-table>
                </div>
              </template>
              
              <!-- Custom Empty State -->
              <template #emptyText>
                <div class="text-center my-5 py-5">
                  <div class="mb-3">
                    <i class="ti ti-file-invoice text-muted" style="font-size: 48px;"></i>
                  </div>
                  <h6>No Payroll Records Found</h6>
                  <p class="text-muted">{{ emptyStateMessage }}</p>
                  <button
                    v-if="canEdit"
                    type="button"
                    class="btn btn-primary btn-sm mt-2"
                    data-bs-toggle="modal"
                    data-bs-target="#bulk-payroll-modal"
                  >
                    <i class="ti ti-cash-banknote me-1"></i>Create Payroll
                  </button>
                </div>
              </template>
              
              <!-- Custom cell rendering -->
              <template #bodyCell="{ column, record }">
                <!-- Organization Column -->
                <template v-if="column.key === 'organization'">
                  <span :class="[
                    'badge badge-sm fw-normal',
                    record.organization === 'SMRU' ? 'badge-primary' :
                      record.organization === 'BHF' ? 'badge-soft-primary fw-bold' :
                        'badge-secondary'
                  ]">
                    {{ record.organization }}
                  </span>
                </template>

                <!-- Initial Column -->
                <template v-else-if="column.key === 'initial'">
                  <span class="initial-badge">{{ record.initial }}</span>
                </template>

                <!-- Short Name Column -->
                <template v-else-if="column.key === 'short_name'">
                  <span class="fw-medium">{{ record.short_name }}</span>
                </template>

                <!-- Full Name Column -->
                <template v-else-if="column.key === 'full_name'">
                  <div class="d-flex align-items-center">
                    <div class="avatar avatar-sm bg-primary rounded-circle me-2 d-flex align-items-center justify-content-center">
                      <span class="text-white fw-medium" style="font-size: 0.7rem;">{{ getInitials(record.full_name) }}</span>
                    </div>
                    <div>
                      <span class="fw-medium">{{ record.full_name }}</span>
                      <br />
                      <small class="text-muted">{{ record.staff_id }}</small>
                    </div>
                  </div>
                </template>

                <!-- Pay Method Column -->
                <template v-else-if="column.key === 'pay_method'">
                  <span class="text-muted">{{ record.pay_method }}</span>
                </template>

                <!-- PVD/SVF Column -->
                <template v-else-if="column.key === 'pvd_svf'">
                  <span :class="[
                    'badge badge-sm',
                    record.pvd_svf !== '-' ? 'badge-soft-info' : 'badge-light'
                  ]">
                    {{ record.pvd_svf }}
                  </span>
                </template>

                <!-- Employee Status Column -->
                <template v-else-if="column.key === 'employee_status'">
                  <span :class="[
                    'badge badge-sm',
                    record.employee_status === 'Local ID' ? 'badge-soft-success' :
                      record.employee_status === 'Local non ID' ? 'badge-soft-warning' :
                        record.employee_status === 'Expats' ? 'badge-soft-info' :
                          'badge-secondary'
                  ]">
                    {{ record.employee_status }}
                  </span>
                </template>

                <!-- Total Gross Salary Column -->
                <template v-else-if="column.key === 'total_gross_salary'">
                  <span class="text-primary fw-medium">{{ formatCurrency(record.total_gross_salary) }}</span>
                </template>

                <!-- Total Net Salary Column -->
                <template v-else-if="column.key === 'total_net_salary'">
                  <span class="badge badge-soft-success fw-medium">{{ formatCurrency(record.total_net_salary) }}</span>
                </template>

                <!-- Funding Count Column -->
                <template v-else-if="column.key === 'funding_count'">
                  <span class="badge badge-soft-info fw-normal">
                    <i class="ti ti-chart-pie me-1"></i>{{ record.funding_count }}
                  </span>
                </template>

                <!-- Actions Column -->
                <template v-else-if="column.key === 'action'">
                  <div class="action-icon d-inline-flex">
                    <!-- View Details - Always visible -->
                    <a 
                      href="javascript:void(0);" 
                      class="me-2"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="View Details"
                    >
                      <i class="ti ti-eye"></i>
                    </a>
                    <!-- Edit - Only visible if user can edit -->
                    <a
                      v-if="canEdit"
                      href="javascript:void(0);"
                      class="me-2"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Edit"
                    >
                      <i class="ti ti-edit"></i>
                    </a>
                    <!-- Delete - Only visible if user can edit -->
                    <a
                      v-if="canEdit"
                      href="javascript:void(0);"
                      class="text-danger"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Delete"
                    >
                      <i class="ti ti-trash"></i>
                    </a>
                  </div>
                </template>
              </template>
            </a-table>

            <!-- Empty State for Standard View -->
            <div v-else class="text-center my-5 py-5">
              <div class="mb-3">
                <i class="ti ti-file-invoice text-muted" style="font-size: 48px;"></i>
              </div>
              <h6>No Payroll Records Found</h6>
              <p class="text-muted">{{ emptyStateMessage }}</p>
              <button
                v-if="canEdit"
                type="button"
                class="btn btn-primary btn-sm mt-2"
                data-bs-toggle="modal"
                data-bs-target="#bulk-payroll-modal"
              >
                <i class="ti ti-cash-banknote me-1"></i>Create Payroll
              </button>
            </div>

            <!-- SEPARATE PAGINATION COMPONENT -->
            <div v-if="tableData && tableData.length > 0" class="pagination-wrapper">
              <div class="d-flex justify-content-between align-items-center">
                <div class="pagination-info">
                  <!-- Optional: Additional info can go here -->
                </div>
                <a-pagination
                  v-model:current="currentPage"
                  v-model:page-size="pageSize"
                  :total="total"
                  :show-size-changer="true"
                  :show-quick-jumper="true"
                  :page-size-options="['10', '20', '50', '100', '200']"
                  :show-total="(total, range) => `${range[0]}-${range[1]} of ${total} items`"
                  @change="handlePaginationChange"
                  @show-size-change="handlePageSizeChange"
                />
              </div>
            </div>
          </div>

          <!-- BUDGET HISTORY VIEW TABLE -->
          <div v-else-if="viewMode === 'budget-history'" class="budget-history-container">
            <div v-if="budgetHistoryLoading" class="text-center my-3 py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2">Loading budget history data...</p>
            </div>
            <div v-else-if="filteredBudgetHistoryData && filteredBudgetHistoryData.length > 0" class="budget-history-table-wrapper">
              <table class="budget-history-table">
                <thead>
                  <tr>
                    <th class="fixed-col col-org">Organization</th>
                    <th class="fixed-col col-staff-id">Staff ID</th>
                    <th class="fixed-col col-employee">Employee Name</th>
                    <th class="fixed-col col-dept">Department</th>
                    <th class="fixed-col col-grant">Grant Name</th>
                    <th class="fixed-col col-fte">FTE</th>
                    <!-- Dynamic month columns -->
                    <th
                      v-for="month in budgetHistoryMonths"
                      :key="month.key"
                      class="month-col"
                    >
                      <div class="month-header">
                        <div class="month-label">{{ month.label }}</div>
                        <a-dropdown :trigger="['click']">
                          <a class="filter-icon" @click.prevent>
                            <i class="ti ti-filter"></i>
                          </a>
                          <template #overlay>
                            <a-menu>
                              <a-menu-item @click="clearMonthFilter(month.key)">
                                <i class="ti ti-x me-1"></i>Clear Filter
                              </a-menu-item>
                              <a-menu-divider />
                              <a-menu-item
                                v-for="grant in getGrantsForMonth(month.key)"
                                :key="grant"
                              >
                                <a-checkbox
                                  :checked="isGrantFilteredForMonth(month.key, grant)"
                                  @change="toggleGrantFilter(month.key, grant)"
                                >
                                  {{ grant }}
                                </a-checkbox>
                              </a-menu-item>
                            </a-menu>
                          </template>
                        </a-dropdown>
                      </div>
                    </th>
                    <th class="summary-col">Total Gross</th>
                    <th class="summary-col">Total Net</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in filteredBudgetHistoryData" :key="`${row.employment_id}_${row.employee_funding_allocation_id}`">
                    <td class="fixed-col col-org">
                      <span :class="['badge badge-sm fw-normal', getOrgBadgeClass(row.organization)]">
                        {{ row.organization }}
                      </span>
                    </td>
                    <td class="fixed-col col-staff-id">{{ row.staff_id }}</td>
                    <td class="fixed-col col-employee">
                      <div class="employee-cell">
                        <div class="avatar avatar-xs bg-primary rounded-circle me-2">
                          <span class="text-white" style="font-size: 0.6rem;">{{ getInitials(row.employee_name) }}</span>
                        </div>
                        <span>{{ row.employee_name }}</span>
                      </div>
                    </td>
                    <td class="fixed-col col-dept">{{ row.department }}</td>
                    <td class="fixed-col col-grant">
                      <span class="grant-name">{{ row.grant_name }}</span>
                    </td>
                    <td class="fixed-col col-fte">
                      <span class="fte-badge">{{ row.fte }}</span>
                    </td>
                    <!-- Dynamic month data cells -->
                    <td
                      v-for="month in budgetHistoryMonths"
                      :key="month.key"
                      :class="['month-cell', !row.monthly_data[month.key] ? 'empty-cell' : '']"
                    >
                      <div v-if="row.monthly_data[month.key]" class="month-data">
                        <div class="grant-badge">{{ row.grant_name }}</div>
                        <div class="salary-amount">{{ formatCurrency(row.monthly_data[month.key].gross_salary) }}</div>
                      </div>
                      <span v-else class="empty-indicator">-</span>
                    </td>
                    <td class="summary-col">
                      <span class="summary-value gross">{{ calculateRowTotalGross(row) }}</span>
                    </td>
                    <td class="summary-col">
                      <span class="summary-value net">{{ calculateRowTotalNet(row) }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- Empty State for Budget History -->
            <div v-else class="text-center my-5 py-5">
              <div class="mb-3">
                <i class="ti ti-file-invoice text-muted" style="font-size: 48px;"></i>
              </div>
              <h6>No Budget History Data</h6>
              <p class="text-muted">
                <span v-if="!budgetHistoryRange || !budgetHistoryRange.length">
                  Please select a date range to view budget history
                </span>
                <span v-else>
                  No payroll records found for the selected date range
                </span>
              </p>
            </div>

            <!-- Budget History Pagination -->
            <div v-if="filteredBudgetHistoryData && filteredBudgetHistoryData.length > 0" class="pagination-wrapper">
              <div class="d-flex justify-content-between align-items-center">
                <div class="pagination-info"></div>
                <a-pagination
                  v-model:current="budgetHistoryPage"
                  v-model:page-size="budgetHistoryPageSize"
                  :total="budgetHistoryTotal"
                  :show-size-changer="true"
                  :show-quick-jumper="true"
                  :page-size-options="['50', '100', '200']"
                  :show-total="(total, range) => `${range[0]}-${range[1]} of ${total} items`"
                  @change="handleBudgetHistoryPaginationChange"
                  @show-size-change="handleBudgetHistoryPageSizeChange"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <layout-footer></layout-footer>
  </div>
  <!-- /Page Wrapper -->
  <bulk-payroll-modal @refresh="fetchPayrolls" @payroll-created="handlePayrollCreated"></bulk-payroll-modal>
</template>
<script>
import { ref, reactive, computed, onMounted, nextTick } from "vue";
import { payrollService } from '@/services/payroll.service';
import { useLookupStore } from "@/stores/lookupStore";
import { useSharedDataStore } from "@/stores/sharedDataStore";
import { usePermissions } from '@/composables/usePermissions';
import dayjs from 'dayjs';

// Import Bootstrap or use global Bootstrap if available
let bootstrap;
try {
  bootstrap = require('bootstrap');
} catch (e) {
  // Fallback to global Bootstrap
  bootstrap = window.bootstrap || {};
}

// Helper function to parse currency strings for sorting
const parseCurrency = (value) => {
  if (!value || typeof value !== 'string') return 0;
  return parseFloat(value.replace(/[$,฿]/g, '')) || 0;
};

// Helper function to format currency (for use outside component)
const formatCurrencyHelper = (value) => {
  if (!value) return '฿0.00';
  return `฿${parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

import BulkPayrollModal from '@/components/modal/bulk-payroll-modal-simplified.vue';

export default {
  name: 'EmployeeSalary',
  components: {
    BulkPayrollModal,
  },
  data() {
    return {
      // Page metadata
      title: "Employee Salary",
      text: "HR",
      text1: "Employee Salary",

      // View mode
      viewMode: 'standard', // 'standard' or 'budget-history'

      // Reactive state
      payrolls: [],
      loading: false,
      error: null,

      // Search and filters
      searchQuery: "",
      selectedOrganization: null,
      selectedDepartment: null,
      selectedMonth: null, // dayjs object for month picker
      selectedSortBy: 'created_at',
      selectedSortOrder: 'desc',

      // Pagination
      currentPage: 1,
      pageSize: 10,
      total: 0,

      // Table selection
      selectedRowKeys: [],
      
      // Expanded row keys for nested table
      expandedRowKeys: [],

      // Budget History View state
      budgetHistoryRange: null, // [startDate, endDate] - dayjs objects
      budgetHistoryData: [],
      budgetHistoryMonths: [],
      budgetHistoryPage: 1,
      budgetHistoryPageSize: 50,
      budgetHistoryTotal: 0,
      budgetHistoryLoading: false,
      monthFilters: {}, // { 'YYYY-MM': ['Grant1', 'Grant2'] }

      // Available filter options (will be populated from lookup data)
      availableSubsidiaries: [],
      availableDepartments: [],
      subsidiaries: [],
      departments: [],

      // Sort options
      sortOptions: [
        { key: 'created_at', label: 'Recently Added' },
        { key: 'employee_name', label: 'Employee Name' },
        { key: 'staff_id', label: 'Staff ID' },
        { key: 'basic_salary', label: 'Basic Salary' },
        { key: 'organization', label: 'Organization' },
        { key: 'department', label: 'Department' },
        { key: 'last_7_days', label: 'Last 7 Days' },
        { key: 'last_month', label: 'Last Month' },
      ],
    };
  },

  computed: {
    // Pagination computed properties
    paginationStart() {
      if (this.total === 0) return 0;
      return (this.currentPage - 1) * this.pageSize + 1;
    },
    paginationEnd() {
      const end = this.currentPage * this.pageSize;
      return end > this.total ? this.total : end;
    },

    // Outer table columns - Employee and Employment information
    columns() {
      return [
        {
          title: 'Organization',
          dataIndex: 'organization',
          key: 'organization',
          width: 100,
          fixed: 'left',
          sorter: false,
        },
        {
          title: 'Initial',
          dataIndex: 'initial',
          key: 'initial',
          width: 80,
          sorter: false,
        },
        {
          title: 'Name',
          dataIndex: 'short_name',
          key: 'short_name',
          width: 150,
          sorter: false,
        },
        {
          title: 'Full Name',
          dataIndex: 'full_name',
          key: 'full_name',
          width: 200,
          sorter: false,
        },
        {
          title: 'Pay Method',
          dataIndex: 'pay_method',
          key: 'pay_method',
          width: 120,
          sorter: false,
        },
        {
          title: 'PVD/SVF',
          dataIndex: 'pvd_svf',
          key: 'pvd_svf',
          width: 100,
          sorter: false,
        },
        {
          title: 'Status',
          dataIndex: 'employee_status',
          key: 'employee_status',
          width: 120,
          sorter: false,
        },
        {
          title: 'Total Gross',
          dataIndex: 'total_gross_salary',
          key: 'total_gross_salary',
          width: 130,
          sorter: false,
        },
        {
          title: 'Total Net',
          dataIndex: 'total_net_salary',
          key: 'total_net_salary',
          width: 130,
          sorter: false,
        },
        {
          title: 'Allocations',
          dataIndex: 'funding_count',
          key: 'funding_count',
          width: 110,
          sorter: false,
        },
        {
          title: 'Actions',
          key: 'action',
          fixed: 'right',
          width: 100,
        },
      ];
    },

    // Inner table columns - Payroll details by funding allocation
    innerColumns() {
      return [
        {
          title: 'Pay Period',
          dataIndex: 'pay_period_date',
          key: 'pay_period_date',
          width: 120,
          fixed: 'left',
        },
        {
          title: 'Grant/Allocation',
          dataIndex: 'grant_name',
          key: 'grant_name',
          width: 180,
        },
        {
          title: 'FTE',
          dataIndex: 'fte',
          key: 'fte',
          width: 70,
        },
        {
          title: 'Gross Salary',
          dataIndex: 'gross_salary',
          key: 'gross_salary',
          width: 120,
        },
        {
          title: 'Gross by FTE',
          dataIndex: 'gross_salary_by_FTE',
          key: 'gross_salary_by_FTE',
          width: 120,
        },
        {
          title: 'Compensation Refund',
          dataIndex: 'compensation_refund',
          key: 'compensation_refund',
          width: 140,
        },
        {
          title: '13th Month',
          dataIndex: 'thirteen_month_salary',
          key: 'thirteen_month_salary',
          width: 110,
        },
        {
          title: '13th Month Accrued',
          dataIndex: 'thirteen_month_salary_accured',
          key: 'thirteen_month_salary_accured',
          width: 140,
        },
        {
          title: 'PVD',
          dataIndex: 'pvd',
          key: 'pvd',
          width: 100,
        },
        {
          title: 'Saving Fund',
          dataIndex: 'saving_fund',
          key: 'saving_fund',
          width: 110,
        },
        {
          title: 'Employer SS',
          dataIndex: 'employer_social_security',
          key: 'employer_social_security',
          width: 110,
        },
        {
          title: 'Employee SS',
          dataIndex: 'employee_social_security',
          key: 'employee_social_security',
          width: 110,
        },
        {
          title: 'Employer HW',
          dataIndex: 'employer_health_welfare',
          key: 'employer_health_welfare',
          width: 110,
        },
        {
          title: 'Employee HW',
          dataIndex: 'employee_health_welfare',
          key: 'employee_health_welfare',
          width: 110,
        },
        {
          title: 'Tax',
          dataIndex: 'tax',
          key: 'tax',
          width: 100,
        },
        {
          title: 'Salary Bonus',
          dataIndex: 'salary_bonus',
          key: 'salary_bonus',
          width: 110,
        },
        {
          title: 'Notes',
          dataIndex: 'notes',
          key: 'notes',
          width: 150,
          ellipsis: true,
        },
        // Total columns at the end
        {
          title: 'Total Salary',
          dataIndex: 'total_salary',
          key: 'total_salary',
          width: 120,
          className: 'total-column',
        },
        {
          title: 'Total PVD',
          dataIndex: 'total_pvd',
          key: 'total_pvd',
          width: 100,
          className: 'total-column',
        },
        {
          title: 'Total SVF',
          dataIndex: 'total_saving_fund',
          key: 'total_saving_fund',
          width: 100,
          className: 'total-column',
        },
        {
          title: 'Total Income',
          dataIndex: 'total_income',
          key: 'total_income',
          width: 120,
          className: 'total-column',
        },
        {
          title: 'Employer Contrib.',
          dataIndex: 'employer_contribution',
          key: 'employer_contribution',
          width: 130,
          className: 'total-column',
        },
        {
          title: 'Total Deduction',
          dataIndex: 'total_deduction',
          key: 'total_deduction',
          width: 130,
          className: 'total-column',
        },
        {
          title: 'Net Salary',
          dataIndex: 'net_salary',
          key: 'net_salary',
          width: 120,
          className: 'total-column highlight',
        },
        {
          title: 'Actions',
          dataIndex: 'actions',
          key: 'actions',
          width: 100,
          fixed: 'right',
        },
      ];
    },

    // Map API data to table format - Group by employment
    tableData() {
      // Group payrolls by employment_id
      const groupedByEmployment = {};

      this.payrolls.forEach(payroll => {
        const employmentId = payroll.employment_id;
        const employee = payroll.employment?.employee;
        const employment = payroll.employment;

        if (!groupedByEmployment[employmentId]) {
          // Get PVD/SVF status
          const hasPvd = employment?.pvd === true || employment?.pvd === 1;
          const hasSvf = employment?.saving_fund === true || employment?.saving_fund === 1;
          let pvdSvfStatus = '-';
          if (hasPvd && hasSvf) {
            pvdSvfStatus = 'PVD/SVF';
          } else if (hasPvd) {
            pvdSvfStatus = 'PVD';
          } else if (hasSvf) {
            pvdSvfStatus = 'SVF';
          }

          // Create new employment group
          groupedByEmployment[employmentId] = {
            employment_id: employmentId,
            organization: employee?.organization || 'N/A',
            staff_id: employee?.staff_id || 'N/A',
            initial: employee?.initial_en || this.getInitials(this.getEmployeeName(payroll)),
            short_name: employee?.first_name_en || 'N/A',
            full_name: this.getEmployeeName(payroll),
            employeeName: this.getEmployeeName(payroll),
            department: employment?.department?.name || 'N/A',
            position: employment?.position?.title || 'N/A',
            employment_type: employment?.employment_type || 'N/A',
            pay_method: employment?.pay_method || 'N/A',
            pvd_svf: pvdSvfStatus,
            employee_status: employee?.status || 'N/A',
            start_date: employment?.start_date || null,
            Image: this.getEmployeeImage(payroll),
            payrolls: [], // Array to hold payroll records for this employment
            total_gross_salary: 0,
            total_net_salary: 0,
            funding_count: 0,
          };
        }

        // Get grant name from funding allocation
        const fundingAllocation = payroll.employee_funding_allocation;
        const grantName = fundingAllocation?.grant_item?.grant?.name || 
                         fundingAllocation?.grant_item?.grant?.code ||
                         this.getFundingSourcesLabel(fundingAllocation?.allocation_type);

        // Add payroll to this employment's payroll array with all fields
        groupedByEmployment[employmentId].payrolls.push({
          id: payroll.id,
          pay_period_date: payroll.pay_period_date,
          grant_name: grantName,
          allocation_type: this.getFundingSourcesLabel(fundingAllocation?.allocation_type),
          fte: fundingAllocation?.fte || 'N/A',
          // Salary fields
          gross_salary: payroll.gross_salary,
          gross_salary_by_FTE: payroll.gross_salary_by_FTE,
          compensation_refund: payroll.compensation_refund,
          thirteen_month_salary: payroll.thirteen_month_salary,
          thirteen_month_salary_accured: payroll.thirteen_month_salary_accured,
          // Benefits
          pvd: payroll.pvd,
          saving_fund: payroll.saving_fund,
          // Social security
          employer_social_security: payroll.employer_social_security,
          employee_social_security: payroll.employee_social_security,
          // Health welfare
          employer_health_welfare: payroll.employer_health_welfare,
          employee_health_welfare: payroll.employee_health_welfare,
          // Tax and bonus
          tax: payroll.tax,
          salary_bonus: payroll.salary_bonus,
          notes: payroll.notes,
          // Totals
          total_salary: payroll.total_salary,
          total_pvd: payroll.total_pvd,
          total_saving_fund: payroll.total_saving_fund,
          total_income: payroll.total_income,
          employer_contribution: payroll.employer_contribution,
          total_deduction: payroll.total_deduction,
          net_salary: payroll.net_salary,
        });

        // Calculate totals
        groupedByEmployment[employmentId].total_gross_salary += parseFloat(payroll.gross_salary) || 0;
        groupedByEmployment[employmentId].total_net_salary += parseFloat(payroll.net_salary) || 0;
        groupedByEmployment[employmentId].funding_count = groupedByEmployment[employmentId].payrolls.length;
      });

      // Convert grouped object to array
      return Object.values(groupedByEmployment);
    },


    // Current sort label
    currentSortLabel() {
      const option = this.sortOptions.find(opt => opt.key === this.selectedSortBy);
      return option ? option.label : 'Recently Added';
    },

    // Empty state message
    emptyStateMessage() {
      return this.searchQuery
        ? 'No records match your search criteria.'
        : 'There are no payroll records to display.';
    },

    // Filtered budget history data based on month filters
    filteredBudgetHistoryData() {
      if (!this.budgetHistoryData.length) return [];
      
      // If no filters applied, return all data
      if (Object.keys(this.monthFilters).length === 0) {
        return this.budgetHistoryData;
      }

      // Apply filters
      return this.budgetHistoryData.filter(row => {
        // Check if row should be visible based on filters
        for (const monthKey in this.monthFilters) {
          const selectedGrants = this.monthFilters[monthKey];
          if (selectedGrants && selectedGrants.length > 0) {
            // If this row has data for this month and grant is in filter
            if (row.monthly_data[monthKey] && selectedGrants.includes(row.grant_name)) {
              return true;
            }
          }
        }
        return false;
      });
    },
  },

  async mounted() {
    try {
      // Suppress ResizeObserver warnings (harmless browser warnings)
      this.suppressResizeObserverWarnings();

      // Initialize components after Vue component is mounted
      await this.$nextTick();
      this.initializeTooltips();

      // Load lookup and department data (will skip departments if no permission)
      await this.initializeFilterData();

      // Fetch initial data
      await this.fetchPayrolls();
    } catch (error) {
      console.error('[EmployeeSalary] Error during component mount:', error);
      // Don't block the page from loading if filter data fails
      // The page can still function without department/organization filters
      if (error.status !== 403) {
        this.error = error.message || 'An error occurred while initializing the page';
      }
    }
  },

  methods: {
    // =================== API METHODS ===================

    // Build API parameters from current state
    buildApiParams() {
      // Ensure 1-based pagination and valid sizes
      const current = Number(this.currentPage) || 1;
      const perPage = Number(this.pageSize) || 10;
      const params = {
        page: current < 1 ? 1 : current,
        per_page: perPage < 1 ? 10 : perPage,
      };

      // Add search parameter
      if (this.searchQuery?.trim()) {
        params.search = this.searchQuery.trim();
      }

      // Add filter parameters
      if (this.selectedOrganization) {
        params.filter_organization = this.selectedOrganization;
      }

      if (this.selectedDepartment) {
        params.filter_department = this.selectedDepartment;
      }

      // Convert selected month to date range (start and end of month)
      if (this.selectedMonth) {
        const startDate = this.selectedMonth.startOf('month').format('YYYY-MM-DD');
        const endDate = this.selectedMonth.endOf('month').format('YYYY-MM-DD');
        params.filter_date_range = `${startDate},${endDate}`;
      }

      // Add sorting parameters
      if (this.selectedSortBy) {
        params.sort_by = this.selectedSortBy;
        params.sort_order = this.selectedSortOrder;
      }

      return params;
    },

    // Fetch payrolls from API
    async fetchPayrolls() {
      this.loading = true;
      this.error = null;

      try {
        const params = this.buildApiParams();
        const response = await payrollService.getPayrolls(params);

        if (response.success) {
          this.payrolls = response.data || [];

          // Update pagination info from API response
          if (response.pagination) {
            this.currentPage = response.pagination.current_page || 1;
            this.pageSize = response.pagination.per_page || 10;
            this.total = response.pagination.total || 0;
          } else {
            // Default pagination if not provided
            this.total = this.payrolls.length;
          }

          // Update available filter options if provided
          if (response.filters && response.filters.available_options) {
            this.updateFilterOptions(response.filters.available_options);
          }
        } else {
          throw new Error(response.message || 'Failed to fetch payrolls');
        }
      } catch (error) {
        console.error('Error fetching payrolls:', error);
        // Only show error if it's not a 404 or empty result
        if (error.response?.status !== 404 && error.response?.status !== 200) {
          this.error = error.message || 'An error occurred while fetching payrolls';
        }
        this.payrolls = [];
        this.total = 0;
      } finally {
        this.loading = false;
        // Wait for DOM to stabilize before allowing ResizeObserver
        await this.$nextTick();
      }
    },

    // Search payrolls by staff ID
    async handleStaffIdSearch(staffId) {
      this.loading = true;
      this.error = null;

      try {
        const params = {
          staff_id: staffId,
          page: 1,
          per_page: this.pageSize,
        };

        const response = await payrollService.searchPayrolls(params);

        if (response.success) {
          this.payrolls = response.data || [];
          this.currentPage = 1;

          if (response.pagination) {
            this.total = response.pagination.total;
          }
        } else {
          throw new Error(response.message || 'No payrolls found for this staff ID');
        }
      } catch (error) {
        console.error('Error searching payrolls:', error);
        this.error = error.message || 'An error occurred while searching payrolls';
        this.payrolls = [];
        this.total = 0;
      } finally {
        this.loading = false;
      }
    },

    // =================== EVENT HANDLERS ===================

    // Handle pagination change
    handlePaginationChange(page, pageSize) {
      this.currentPage = Number(page) > 0 ? Number(page) : 1;
      this.pageSize = Number(pageSize) > 0 ? Number(pageSize) : this.pageSize;
      this.fetchPayrolls();
    },

    // Handle page size change
    handlePageSizeChange(current, size) {
      this.currentPage = 1; // Reset to first page when changing page size
      this.pageSize = size;
      this.fetchPayrolls();
    },

    // Handle row expand/collapse
    handleExpand(expanded, record) {
      if (expanded) {
        // Add to expanded keys
        this.expandedRowKeys = [record.employment_id];
      } else {
        // Remove from expanded keys
        this.expandedRowKeys = [];
      }
    },

    // Handle table sorting and filtering changes
    handleTableChange(pagination, filters, sorter) {
      // Update pagination
      if (pagination) {
        const nextPage = Number(pagination.current);
        const nextSize = Number(pagination.pageSize);
        this.currentPage = nextPage > 0 ? nextPage : 1;
        this.pageSize = nextSize > 0 ? nextSize : this.pageSize;
      }

      // Update sorting
      if (sorter && sorter.field) {
        this.selectedSortBy = sorter.field;
        this.selectedSortOrder = sorter.order === 'ascend' ? 'asc' : 'desc';
      }

      // Fetch updated data
      this.fetchPayrolls();
    },

    // Handle search input
    async handleSearch() {
      // Reset to first page when searching
      this.currentPage = 1;
      await this.fetchPayrolls();
    },

    // Handle filter changes
    async handleFilterChange() {
      this.currentPage = 1; // Reset to first page
      await this.fetchPayrolls();
    },

    // Clear all filters
    async clearFilters() {
      this.searchQuery = "";
      this.selectedOrganization = null;
      this.selectedDepartment = null;
      this.selectedMonth = null;
      this.budgetHistoryRange = null;
      this.selectedSortBy = 'created_at';
      this.selectedSortOrder = 'desc';
      this.currentPage = 1;
      this.monthFilters = {};

      if (this.viewMode === 'standard') {
        await this.fetchPayrolls();
      } else {
        this.budgetHistoryData = [];
        this.budgetHistoryMonths = [];
      }
    },

    // =================== DATA TRANSFORMATION METHODS ===================

    // Get formatted employee name
    getEmployeeName(payroll) {
      if (payroll.employment?.employee) {
        const firstName = payroll.employment.employee.first_name_en || '';
        const lastName = payroll.employment.employee.last_name_en || '';
        return `${firstName} ${lastName}`.trim() || 'N/A';
      }
      return 'N/A';
    },

    // Get department and position
    getDepartmentPosition(payroll) {
      const dept = payroll.employment?.department?.name || '';
      const pos = payroll.employment?.position?.title || '';
      return dept && pos ? `${dept}/${pos}` : dept || pos || 'N/A';
    },

    // Get funding sources from employee funding allocation
    getFundingSources(payroll) {
      if (payroll.employee_funding_allocation) {
        const allocation = payroll.employee_funding_allocation;
        // All allocations are now grant type
        if (false) {
          return 'Organization Funded';
        } else if (allocation.allocation_type === 'grant') {
          return 'Grant Funded';
        }
        return allocation.allocation_type;
      }
      return 'General Fund';
    },

    // Get funding source label by type
    getFundingSourcesLabel(allocationType) {
      if (!allocationType) return 'General Fund';
      if (allocationType === 'grant') return 'Grant Funded';
      return allocationType;
    },

    // Get employee image
    getEmployeeImage(payroll) {
      // Return a default image or map from employee data
      return 'user-32.jpg';
    },

    // Get initials from employee name for avatar
    getInitials(name) {
      if (!name || name === 'N/A') return '?';
      const parts = name.trim().split(' ');
      if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    },

    // Format date for display
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },

    // Format currency for display
    formatCurrency(value) {
      if (!value) return '฿0.00';
      return `฿${parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },

    // Update filter options from API response
    updateFilterOptions(options) {
      if (options.subsidiaries) {
        this.availableSubsidiaries = options.subsidiaries;
      }
      if (options.departments) {
        this.availableDepartments = options.departments;
      }
    },

    // =================== UI METHODS ===================

    // Suppress ResizeObserver warnings (harmless browser warnings)
    suppressResizeObserverWarnings() {
      const originalError = console.error;
      console.error = (...args) => {
        if (
          args[0] &&
          typeof args[0] === 'string' &&
          args[0].includes('ResizeObserver loop')
        ) {
          // Suppress ResizeObserver warnings - they're harmless
          return;
        }
        originalError.apply(console, args);
      };

      // Also catch unhandled errors
      window.addEventListener('error', (event) => {
        if (
          event.message &&
          event.message.includes('ResizeObserver loop')
        ) {
          event.preventDefault();
          event.stopPropagation();
        }
      });
    },

    initializeTooltips() {
      try {
        // Check if Bootstrap is available
        const Bootstrap = window.bootstrap || bootstrap;

        if (Bootstrap && Bootstrap.Tooltip) {
          // Initialize all tooltips
          const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
          tooltipTriggerList.forEach(tooltipTriggerEl => {
            if (!Bootstrap.Tooltip.getInstance(tooltipTriggerEl)) {
              new Bootstrap.Tooltip(tooltipTriggerEl);
            }
          });
        }
      } catch (error) {
        console.warn('Tooltip initialization failed:', error);
      }
    },

    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },

    // Handle month picker change
    handleMonthChange(date) {
      this.selectedMonth = date;
      this.handleFilterChange();
    },

    // =================== LOOKUP AND DEPARTMENT DATA METHODS ===================

    // Initialize filter data from lookups and department positions
    async initializeFilterData() {
      await this.initSubsidiaries();
      // Only initialize departments if user has permission
      if (this.canReadDepartments) {
        await this.initDepartments();
      }
    },

    // Get organization data from lookups
    async fetchSubsidiaries() {
      try {
        const lookupStore = useLookupStore();
        const subsidiaries = lookupStore.getLookupsByType('organization');
        return subsidiaries || [];
      } catch (error) {
        console.error('Error fetching subsidiaries:', error);
        return [];
      }
    },

    // Initialize organization data
    async initSubsidiaries() {
      const lookupStore = useLookupStore();
      // If lookups aren't loaded yet, fetch them first
      if (!lookupStore.lookups.length) {
        await lookupStore.fetchAllLookupLists();
      }
      this.subsidiaries = lookupStore.getLookupsByType('organization');
      this.availableSubsidiaries = this.subsidiaries.map(sub => sub.value).filter(Boolean);
    },

    // Get departments from shared data store
    async fetchDepartments() {
      try {
        const sharedStore = useSharedDataStore();
        return await sharedStore.fetchDepartments(false, {});
      } catch (error) {
        console.error('Error fetching departments:', error);
        return [];
      }
    },

    // Initialize department data
    async initDepartments() {
      // Check permission before fetching
      if (!this.canReadDepartments) {
        console.warn('[EmployeeSalary] User does not have permission to access departments');
        this.availableDepartments = [];
        return;
      }
      
      try {
        const sharedStore = useSharedDataStore();
        // If departments aren't loaded yet, fetch them first
        if (!sharedStore.isDepartmentsLoaded) {
          await sharedStore.fetchDepartments(false, {});
        }
        this.departments = sharedStore.getDepartments || [];
        this.availableDepartments = this.departments.map(dept => dept.name).filter(Boolean);
      } catch (error) {
        console.error('[EmployeeSalary] Error initializing departments:', error);
        // Handle 403 gracefully - user doesn't have permission
        if (error.status === 403 || error.response?.status === 403) {
          console.warn('[EmployeeSalary] User does not have permission to access departments');
          this.availableDepartments = [];
        } else {
          // For other errors, still set empty array but log the error
          this.availableDepartments = [];
        }
      }
    },

    // Handle payroll created event from modal
    handlePayrollCreated(data) {
      console.log('Payroll created:', data);
      // Refresh the payroll list
      this.fetchPayrolls();
    },

    // Filter option for Ant Design Select search
    filterOption(input, option) {
      const text = option.children?.[0]?.children || option.label || '';
      return text.toLowerCase().includes(input.toLowerCase());
    },

    // =================== BUDGET HISTORY METHODS ===================

    // Switch to budget history view
    switchToBudgetHistory() {
      this.viewMode = 'budget-history';
      
      // Initialize with last 6 months if not set
      if (!this.budgetHistoryRange || !this.budgetHistoryRange.length) {
        const endDate = dayjs();
        const startDate = endDate.subtract(5, 'month').startOf('month');
        this.budgetHistoryRange = [startDate, endDate];
      }
      
      // Fetch budget history data
      this.fetchBudgetHistory();
    },

    // Handle budget history range change
    handleBudgetHistoryRangeChange(dates) {
      if (!dates || dates.length !== 2) {
        this.budgetHistoryRange = null;
        this.budgetHistoryData = [];
        this.budgetHistoryMonths = [];
        return;
      }

      const [startDate, endDate] = dates;
      
      // Validate max 6 months
      const monthsDiff = endDate.diff(startDate, 'month') + 1;
      if (monthsDiff > 6) {
        this.$message.warning('Date range cannot exceed 6 months');
        return;
      }

      this.budgetHistoryRange = dates;
      this.budgetHistoryPage = 1;
      this.fetchBudgetHistory();
    },

    // Fetch budget history data
    async fetchBudgetHistory() {
      if (!this.budgetHistoryRange || this.budgetHistoryRange.length !== 2) {
        return;
      }

      this.budgetHistoryLoading = true;
      this.error = null;

      try {
        const [startDate, endDate] = this.budgetHistoryRange;
        const params = {
          start_date: startDate.format('YYYY-MM'),
          end_date: endDate.format('YYYY-MM'),
          page: this.budgetHistoryPage,
          per_page: this.budgetHistoryPageSize,
        };

        // Add filters
        if (this.selectedOrganization) {
          params.organization = this.selectedOrganization;
        }
        if (this.selectedDepartment) {
          params.department = this.selectedDepartment;
        }

        const response = await payrollService.getBudgetHistory(params);

        if (response.success) {
          this.budgetHistoryData = response.data || [];
          this.budgetHistoryMonths = response.date_range?.months || [];
          
          // Update pagination
          if (response.pagination) {
            this.budgetHistoryPage = response.pagination.current_page || 1;
            this.budgetHistoryPageSize = response.pagination.per_page || 50;
            this.budgetHistoryTotal = response.pagination.total || 0;
          }
        } else {
          throw new Error(response.message || 'Failed to fetch budget history');
        }
      } catch (error) {
        console.error('Error fetching budget history:', error);
        // Only show error if it's not a 404 or empty result
        if (error.response?.status !== 404 && error.response?.status !== 200) {
          this.error = error.message || 'An error occurred while fetching budget history';
        }
        this.budgetHistoryData = [];
        this.budgetHistoryMonths = [];
        this.budgetHistoryTotal = 0;
      } finally {
        this.budgetHistoryLoading = false;
        // Wait for DOM to stabilize before allowing ResizeObserver
        await this.$nextTick();
      }
    },

    // Handle budget history pagination change
    handleBudgetHistoryPaginationChange(page, pageSize) {
      this.budgetHistoryPage = Number(page) > 0 ? Number(page) : 1;
      this.budgetHistoryPageSize = Number(pageSize) > 0 ? Number(pageSize) : this.budgetHistoryPageSize;
      this.fetchBudgetHistory();
    },

    // Handle budget history page size change
    handleBudgetHistoryPageSizeChange(current, size) {
      this.budgetHistoryPage = 1;
      this.budgetHistoryPageSize = size;
      this.fetchBudgetHistory();
    },

    // Get grants that appear in a specific month
    getGrantsForMonth(monthKey) {
      const grants = new Set();
      this.budgetHistoryData.forEach(row => {
        if (row.monthly_data[monthKey]) {
          grants.add(row.grant_name);
        }
      });
      return Array.from(grants).sort();
    },

    // Check if grant is filtered for a month
    isGrantFilteredForMonth(monthKey, grant) {
      return this.monthFilters[monthKey]?.includes(grant) || false;
    },

    // Toggle grant filter for a month
    toggleGrantFilter(monthKey, grant) {
      if (!this.monthFilters[monthKey]) {
        this.$set(this.monthFilters, monthKey, []);
      }
      
      const index = this.monthFilters[monthKey].indexOf(grant);
      if (index > -1) {
        this.monthFilters[monthKey].splice(index, 1);
      } else {
        this.monthFilters[monthKey].push(grant);
      }
    },

    // Clear month filter
    clearMonthFilter(monthKey) {
      if (this.monthFilters[monthKey]) {
        delete this.monthFilters[monthKey];
        this.$forceUpdate();
      }
    },

    // Calculate row total gross salary
    calculateRowTotalGross(row) {
      let total = 0;
      Object.values(row.monthly_data).forEach(data => {
        total += parseFloat(data.gross_salary) || 0;
      });
      return this.formatCurrency(total);
    },

    // Calculate row total net salary
    calculateRowTotalNet(row) {
      let total = 0;
      Object.values(row.monthly_data).forEach(data => {
        total += parseFloat(data.net_salary) || 0;
      });
      return this.formatCurrency(total);
    },

    // Get organization badge class
    getOrgBadgeClass(organization) {
      if (organization === 'SMRU') return 'badge-primary';
      if (organization === 'BHF') return 'badge-soft-primary fw-bold';
      return 'badge-secondary';
    },
  },

  // Expose refs for template access
  setup() {
    // Initialize permission checks for employee_salary module
    const { 
      canRead, 
      canEdit, 
      isReadOnly, 
      accessLevelText, 
      accessLevelBadgeClass 
    } = usePermissions('employee_salary');
    
    // Check if user has permission to access departments
    const { 
      canRead: canReadDepartments 
    } = usePermissions('departments');

    return {
      canRead,
      canEdit,
      isReadOnly,
      accessLevelText,
      accessLevelBadgeClass,
      canReadDepartments
    };
  },
};
</script>

<style scoped>
/* =================== FILTERS STYLING =================== */
.filters-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.filter-item {
  position: relative;
}

.filter-input {
  display: flex;
  align-items: center;
}

.filter-input .form-control {
  padding-left: 36px;
  padding-right: 28px;
  min-width: 200px;
}

.filter-input .filter-icon {
  position: absolute;
  left: 12px;
  color: #6c757d;
  z-index: 1;
}

/* =================== ANT DESIGN SELECT CUSTOMIZATION =================== */
:deep(.ant-select-selector) {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  min-width: 80px;
}

/* =================== PAGINATION WRAPPER =================== */
.pagination-wrapper {
  margin-top: 20px;
  padding: 20px 16px;
  border-top: 1px solid #e8e8e8;
  position: relative;
  z-index: 100;
}

.pagination-info {
  color: #666;
  font-size: 14px;
}

/* Ensure pagination is not overlapping */
.resize-observer-fix {
  position: relative;
  min-height: 100px;
  /* Prevent ResizeObserver loops by stabilizing layout */
  contain: layout style;
}

/* =================== ANT DESIGN PAGINATION =================== */
:deep(.ant-pagination) {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

:deep(.ant-pagination-total-text) {
  margin-right: 16px;
  color: #666;
  font-size: 14px;
}

:deep(.ant-pagination-options) {
  margin-left: 16px;
}

:deep(.ant-pagination-options-size-changer) {
  margin-right: 8px;
}

:deep(.ant-pagination-options-quick-jumper) {
  margin-left: 8px;
}

/* Fix dropdown placement - force dropdown to appear above */
:deep(.ant-pagination-options-size-changer .ant-select) {
  z-index: 1000;
}

:deep(.ant-pagination-options-size-changer .ant-select-dropdown) {
  z-index: 1050 !important;
  top: auto !important;
  bottom: calc(100% + 4px) !important;
}

/* Force dropdown to appear above the trigger */
:deep(.ant-select-dropdown) {
  z-index: 1050 !important;
}

/* Override Ant Design dropdown placement */
:deep(.ant-pagination .ant-select-dropdown) {
  position: absolute !important;
  bottom: calc(100% + 4px) !important;
  top: auto !important;
  margin-bottom: 0 !important;
  margin-top: 0 !important;
}

/* =================== CONTAINER OVERFLOW FIXES =================== */
.card-body {
  overflow: visible !important;
  padding-bottom: 0;
}

.card {
  overflow: visible !important;
  margin-bottom: 20px;
}

/* =================== EXPANDED ROW STYLING =================== */
:deep(.ant-table-expanded-row > .ant-table-cell) {
  padding: 16px !important;
  background: #fafafa;
}

.expanded-row-content {
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  overflow: hidden;
}

/* Inner table scroll container */
:deep(.inner-payroll-table .ant-table) {
  overflow-x: auto;
}

:deep(.inner-payroll-table .ant-table-container) {
  overflow-x: auto;
}

:deep(.inner-payroll-table .ant-table-body) {
  overflow-x: auto !important;
  overflow-y: auto !important;
  max-height: 400px;
}

/* Custom scrollbar styling for inner table */
:deep(.inner-payroll-table .ant-table-body::-webkit-scrollbar) {
  height: 8px;
  width: 8px;
}

:deep(.inner-payroll-table .ant-table-body::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 4px;
}

:deep(.inner-payroll-table .ant-table-body::-webkit-scrollbar-thumb) {
  background: #c1c1c1;
  border-radius: 4px;
}

:deep(.inner-payroll-table .ant-table-body::-webkit-scrollbar-thumb:hover) {
  background: #a1a1a1;
}

.expanded-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e8e8e8;
}

.expanded-title {
  font-weight: 600;
  color: #333;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.expanded-count {
  background: var(--primary-color);
  color: #ffffff;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

/* Inner table styling */
:deep(.inner-payroll-table .ant-table-thead > tr > th) {
  background: #fafafa;
  font-weight: 600;
  font-size: 13px;
  padding: 10px 12px;
  border-bottom: 1px solid #e8e8e8;
}

:deep(.inner-payroll-table .ant-table-tbody > tr > td) {
  padding: 10px 12px;
  font-size: 13px;
}

:deep(.inner-payroll-table .ant-table-tbody > tr:hover > td) {
  background: #f5f5f5;
}

/* Inner table cells */
.inner-salary {
  font-weight: 500;
  font-size: 13px;
}

.inner-salary.gross {
  color: #333;
}

.inner-salary.income {
  color: #17a2b8;
}

.inner-salary.deduction {
  color: #dc3545;
}

.inner-salary.net {
  color: #28a745;
  font-weight: 700;
}

.inner-salary.benefit {
  color: #6f42c1;
}

.inner-salary.employer {
  color: #fd7e14;
}

.inner-salary.total {
  font-weight: 600;
  background: rgba(0, 0, 0, 0.03);
  padding: 2px 6px;
  border-radius: 4px;
}

.inner-salary.highlight {
  background: rgba(40, 167, 69, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
}

.allocation-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.allocation-badge.grant {
  background: rgba(23, 162, 184, 0.1);
  color: #17a2b8;
}

.allocation-badge.org {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

.fte-badge {
  background: #e9ecef;
  color: #495057;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.initial-badge {
  background: #e9ecef;
  color: #495057;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.grant-badge-inner {
  background: rgba(23, 162, 184, 0.1);
  color: #17a2b8;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notes-text {
  font-size: 11px;
  color: #6c757d;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}

/* Total column styling */
:deep(.total-column) {
  background: rgba(0, 0, 0, 0.02) !important;
}

:deep(.total-column.highlight) {
  background: rgba(40, 167, 69, 0.05) !important;
}

.date-badge {
  color: #6c757d;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
}

/* Inner action buttons */
.inner-action-buttons {
  display: flex;
  gap: 4px;
}

.inner-action-btn {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: #6c757d;
  font-size: 14px;
}

.inner-action-btn:hover {
  text-decoration: none;
}

.inner-action-btn.view:hover {
  background: rgba(23, 162, 184, 0.1);
  color: #17a2b8;
}

.inner-action-btn.edit:hover {
  background: rgba(242, 101, 34, 0.1);
  color: var(--primary-color);
}

.inner-action-btn.delete:hover {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

/* =================== TABLE HEADER STYLING =================== */
:deep(.ant-table-thead > tr > th) {
  background-color: #fafafa !important;
  color: #595959 !important;
  font-weight: 600 !important;
  border-bottom: 1px solid #e0e0e0 !important;
}

/* Ensure all table cells have consistent background */
:deep(.ant-table-tbody > tr > td) {
  background-color: #ffffff !important;
}

/* Fix for table rows hover state */
:deep(.ant-table-tbody > tr:hover > td) {
  background-color: #fafafa !important;
}

/* =================== BADGE SOFT VARIANTS =================== */
.badge-soft-success {
  background-color: rgba(40, 167, 69, 0.1);
  color: #28a745;
  padding: 4px 8px;
  border-radius: 4px;
}

.badge-soft-info {
  background-color: rgba(23, 162, 184, 0.1);
  color: #17a2b8;
}

.badge-soft-primary {
  background-color: rgba(242, 101, 34, 0.1);
  color: var(--primary-color);
}

/* =================== AVATAR STYLING =================== */
.avatar {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-sm {
  width: 28px;
  height: 28px;
}

/* =================== BUDGET HISTORY VIEW STYLES =================== */
.budget-history-container {
  width: 100%;
  overflow-x: auto;
  /* Prevent ResizeObserver loops */
  contain: layout style;
}

.budget-history-table-wrapper {
  max-height: 600px;
  min-height: 200px;
  overflow-y: auto;
  overflow-x: auto;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  /* Prevent ResizeObserver loops */
  contain: layout style;
}

.budget-history-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 11px;
  background: white;
}

.budget-history-table thead {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #f5f5f5;
}

.budget-history-table th {
  padding: 8px 6px;
  text-align: center;
  font-weight: 600;
  border: 1px solid #e0e0e0;
  background: #f5f5f5;
  white-space: nowrap;
  font-size: 11px;
}

.budget-history-table td {
  padding: 6px 4px;
  text-align: center;
  border: 1px solid #e8e8e8;
  background: white;
  font-size: 11px;
}

/* Fixed columns */
.budget-history-table .fixed-col {
  position: sticky;
  left: 0;
  background: white;
  z-index: 5;
}

.budget-history-table thead .fixed-col {
  background: #f5f5f5;
  z-index: 15;
}

.budget-history-table .col-org {
  left: 0;
  min-width: 80px;
}

.budget-history-table .col-staff-id {
  left: 80px;
  min-width: 90px;
}

.budget-history-table .col-employee {
  left: 170px;
  min-width: 150px;
  text-align: left;
}

.budget-history-table .col-dept {
  left: 320px;
  min-width: 120px;
}

.budget-history-table .col-grant {
  left: 440px;
  min-width: 150px;
  text-align: left;
}

.budget-history-table .col-fte {
  left: 590px;
  min-width: 60px;
}

/* Month columns */
.budget-history-table .month-col {
  min-width: 150px;
  max-width: 150px;
}

.month-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
}

.month-label {
  flex: 1;
  font-size: 11px;
}

.filter-icon {
  color: #666;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 3px;
  transition: all 0.2s;
}

.filter-icon:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--primary-color);
}

/* Month data cells */
.month-cell {
  padding: 4px !important;
}

.month-cell.empty-cell {
  background: #fafafa;
}

.empty-indicator {
  color: #ccc;
  font-size: 12px;
}

.month-data {
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: center;
}

.grant-badge {
  background: rgba(23, 162, 184, 0.1);
  color: #17a2b8;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 500;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.salary-amount {
  font-size: 10px;
  font-weight: 600;
  color: #333;
}

/* Summary columns */
.summary-col {
  min-width: 120px;
  background: #f9f9f9;
  font-weight: 600;
}

.summary-value {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
}

.summary-value.gross {
  background: rgba(23, 162, 184, 0.1);
  color: #17a2b8;
}

.summary-value.net {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

/* Employee cell */
.employee-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.avatar-xs {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Grant name cell */
.grant-name {
  font-size: 10px;
  font-weight: 500;
  color: #333;
  display: block;
  text-align: left;
  padding-left: 4px;
}

/* FTE badge */
.fte-badge {
  background: #e9ecef;
  color: #495057;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
}

/* View toggle buttons */
.btn-group .btn {
  font-size: 13px;
  padding: 6px 12px;
}

/* =================== RESPONSIVE DESIGN =================== */
@media (max-width: 992px) {
  .filters-wrapper {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .filter-input .form-control {
    min-width: 160px;
  }

  .pagination-wrapper {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .budget-history-table {
    font-size: 10px;
  }

  .budget-history-table th,
  .budget-history-table td {
    padding: 4px 3px;
  }
}
</style>
