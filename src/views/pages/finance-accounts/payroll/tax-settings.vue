<template>
  <layout-header></layout-header>
  <layout-sidebar></layout-sidebar>
  <!-- Page Wrapper -->
  <div class="page-wrapper">
    <div class="content">
      <!-- Breadcrumb -->
      <div class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
        <index-breadcrumb :title="title" :text="text" :text1="text1" />
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div class="d-flex align-items-center me-2">
            <select class="form-select form-select-sm me-2" v-model="selectedYear" @change="handleYearChange"
              style="width: 100px;">
              <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
            </select>
            <span class="text-muted small">Tax Year</span>
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

      <!-- Main Tabs Navigation -->
      <ul class="nav nav-tabs mb-3 tab-style-6" id="tax-settings-tabs" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link" :class="{ active: activeKey === '1' }" id="tax-settings-tab" data-bs-toggle="tab"
            data-bs-target="#tax-settings-pane" type="button" role="tab" aria-controls="tax-settings-pane"
            :aria-selected="activeKey === '1'" @click="setActiveTab('1')">
            <i class="ti ti-settings me-1 align-middle d-inline-block"></i>Tax Settings
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" :class="{ active: activeKey === '2' }" id="tax-brackets-tab" data-bs-toggle="tab"
            data-bs-target="#tax-brackets-pane" type="button" role="tab" aria-controls="tax-brackets-pane"
            :aria-selected="activeKey === '2'" @click="setActiveTab('2')">
            <i class="ti ti-list me-1 align-middle d-inline-block"></i>Tax Brackets
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" :class="{ active: activeKey === '3' }" id="tax-calculator-tab" data-bs-toggle="tab"
            data-bs-target="#tax-calculator-pane" type="button" role="tab" aria-controls="tax-calculator-pane"
            :aria-selected="activeKey === '3'" @click="setActiveTab('3')">
            <i class="ti ti-calculator me-1 align-middle d-inline-block"></i>Tax Calculator
          </button>
        </li>
      </ul>

      <!-- Tab Content -->
      <div class="tab-content" id="tax-settings-tabContent">
        <!-- Tax Settings Tab -->
        <div class="tab-pane fade p-0 border-bottom-0" :class="{ 'show active': activeKey === '1' }"
          id="tax-settings-pane" role="tabpanel" aria-labelledby="tax-settings-tab" tabindex="0">
          <!-- Header Section -->
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 class="h3 mb-1">Tax Settings Management</h1>
              <p class="text-muted mb-0">Manage tax settings with advanced filtering, bulk operations, and year-based
                controls.
              </p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-primary btn-sm d-flex align-items-center" @click="bulkUpdateTaxSettings"
                :disabled="selectedTaxSettingKeys.length === 0">
                <i class="ti ti-upload me-1"></i>Bulk Update
              </button>
              <button class="btn btn-primary btn-sm d-flex align-items-center" @click="openAddTaxSettingModal">
                <i class="ti ti-plus me-1"></i>Create Setting
              </button>
              <button class="btn btn-outline-secondary btn-sm d-flex align-items-center" @click="exportToExcel">
                <i class="ti ti-download me-1"></i>Export
              </button>
            </div>
          </div>

          <!-- Filters Section -->
          <div class="card mb-4">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <i class="ti ti-filter me-2"></i>
                <h6 class="mb-0 me-3">Filters</h6>
              </div>
              <div class="row g-3">
                <div class="col-md-3">
                  <label class="form-label small">Search</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="ti ti-search"></i></span>
                    <input type="text" class="form-control" v-model="searchText" @input="handleSearch"
                      placeholder="Search by setting key...">
                  </div>
                </div>
                <div class="col-md-2">
                  <label class="form-label small">Setting Type</label>
                  <select class="form-select" v-model="filterSettingType" @change="applySettingTypeFilter">
                    <option value="">All types</option>
                    <option value="DEDUCTION">DEDUCTION</option>
                    <option value="RATE">RATE</option>
                    <option value="LIMIT">LIMIT</option>
                  </select>
                </div>
                <div class="col-md-2">
                  <label class="form-label small">Effective Year</label>
                  <select class="form-select" v-model="filterEffectiveYear" @change="applyEffectiveYearFilter">
                    <option value="">All years</option>
                    <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
                  </select>
                </div>
                <div class="col-md-2">
                  <label class="form-label small">Status</label>
                  <select class="form-select" v-model="filterIsSelected" @change="applyStatusFilter">
                    <option value="">All status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
                <div class="col-md-4 d-flex align-items-end">
                  <div class="d-flex gap-2 w-100">
                    <span class="badge bg-secondary">{{ totalTaxSettings }} total settings</span>
                    <span v-if="hasActiveFilters" class="badge bg-primary">{{ getActiveFiltersCount }} filters
                      active</span>
                    <button class="btn btn-outline-secondary btn-sm" @click="clearFilters"
                      :disabled="!hasActiveFilters">
                      <i class="ti ti-x me-1"></i>Clear filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tax Settings Table -->
          <div class="card">
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-borderless mb-0">
                  <thead class="table-light">
                    <tr>
                      <th class="border-0 ps-3" style="width: 200px;">
                        <div class="d-flex align-items-center">
                          Setting Key
                          <button class="btn btn-sm btn-link text-muted p-0 ms-1"
                            @click="handleTableSort('setting_key')">
                            <i class="ti ti-arrows-sort" :class="getSortIcon('setting_key')"></i>
                          </button>
                        </div>
                      </th>
                      <th class="border-0" style="width: 120px;">
                        <div class="d-flex align-items-center">
                          Value
                          <button class="btn btn-sm btn-link text-muted p-0 ms-1"
                            @click="handleTableSort('setting_value')">
                            <i class="ti ti-arrows-sort" :class="getSortIcon('setting_value')"></i>
                          </button>
                        </div>
                      </th>
                      <th class="border-0" style="width: 100px;">
                        <div class="d-flex align-items-center">
                          Type
                          <button class="btn btn-sm btn-link text-muted p-0 ms-1"
                            @click="handleTableSort('setting_type')">
                            <i class="ti ti-arrows-sort" :class="getSortIcon('setting_type')"></i>
                          </button>
                        </div>
                      </th>
                      <th class="border-0">Description</th>
                      <th class="border-0" style="width: 80px;">
                        <div class="d-flex align-items-center">
                          Year
                          <button class="btn btn-sm btn-link text-muted p-0 ms-1"
                            @click="handleTableSort('effective_year')">
                            <i class="ti ti-arrows-sort" :class="getSortIcon('effective_year')"></i>
                          </button>
                        </div>
                      </th>
                      <th class="border-0" style="width: 80px;">Status</th>
                      <th class="border-0 pe-3" style="width: 80px;">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="taxSettingsLoading">
                      <td colspan="7" class="text-center py-4">
                        <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                        Loading tax settings...
                      </td>
                    </tr>
                    <tr v-else-if="!taxSettings.length">
                      <td colspan="7" class="text-center py-4 text-muted">
                        No tax settings found
                      </td>
                    </tr>
                    <tr v-else v-for="record in taxSettings" :key="record.id" class="border-bottom">
                      <td class="ps-3">
                        <div>
                          <strong>{{ record.setting_key }}</strong>
                          <br>
                          <small class="text-muted">{{ getSettingKeyLabel(record.setting_key) }}</small>
                        </div>
                      </td>
                      <td>
                        <span class="fw-semibold" :class="getSettingValueClass(record.setting_type)">
                          {{ formatSettingValue(record.setting_value, record.setting_type) }}
                        </span>
                      </td>
                      <td>
                        <span class="badge" :class="getSettingTypeBadgeClass(record.setting_type)">
                          {{ record.setting_type }}
                        </span>
                      </td>
                      <td>
                        <span class="text-muted">{{ record.description || getSettingKeyDescription(record.setting_key)
                        }}</span>
                      </td>
                      <td>
                        <span class="badge badge-primary">{{ record.effective_year }}</span>
                      </td>
                      <td>
                        <div class="form-check form-switch">
                          <input class="form-check-input" type="checkbox" :checked="record.is_selected"
                            @change="toggleTaxSetting(record.id)" :disabled="taxSettingsLoading">
                          <label class="form-check-label small"
                            :class="record.is_selected ? 'text-success' : 'text-muted'">
                            {{ record.is_selected ? 'Active' : 'Inactive' }}
                          </label>
                        </div>
                      </td>
                      <td class="pe-3">
                        <div class="dropdown">
                          <button class="btn btn-sm btn-link text-muted" data-bs-toggle="dropdown">
                            <i class="ti ti-dots-vertical"></i>
                          </button>
                          <ul class="dropdown-menu dropdown-menu-end">
                            <li>
                              <a class="dropdown-item" @click="editTaxSetting(record)">
                                <i class="ti ti-edit me-2"></i>Edit
                              </a>
                            </li>
                            <li>
                              <a class="dropdown-item text-danger" @click="confirmDeleteTaxSetting(record.id)">
                                <i class="ti ti-trash me-2"></i>Delete
                              </a>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Backend Pagination -->
              <div class="pagination-wrapper p-3 border-top" v-if="total > 0">
                <div class="d-flex justify-content-between align-items-center">
                  <div class="text-muted small">
                    Showing {{ getShowingText() }}
                  </div>
                  <div class="d-flex align-items-center">
                    <div class="d-flex align-items-center me-3">
                      <label class="form-label me-2 mb-0 small">Show:</label>
                      <select class="form-select form-select-sm" v-model="pageSize" @change="handlePageSizeChange"
                        style="width: 80px;">
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>
                    </div>
                    <nav>
                      <ul class="pagination pagination-sm mb-0">
                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                          <button class="page-link" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
                            <i class="ti ti-chevron-left"></i>
                          </button>
                        </li>
                        <li class="page-item" :class="{ active: page === currentPage }" v-for="page in visiblePages"
                          :key="page">
                          <button class="page-link" @click="goToPage(page)">{{ page }}</button>
                        </li>
                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                          <button class="page-link" @click="goToPage(currentPage + 1)"
                            :disabled="currentPage === totalPages">
                            <i class="ti ti-chevron-right"></i>
                          </button>
                        </li>
                      </ul>
                    </nav>
                    <div class="d-flex align-items-center ms-3">
                      <label class="form-label me-2 mb-0 small">Go to:</label>
                      <input type="number" class="form-control form-control-sm" v-model.number="jumpToPage"
                        @keyup.enter="handleJumpToPage" :min="1" :max="totalPages" style="width: 60px;">
                      <button class="btn btn-sm btn-outline-secondary ms-1" @click="handleJumpToPage">
                        <i class="ti ti-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tax Brackets Tab -->
        <div class="tab-pane fade p-0 border-bottom-0" :class="{ 'show active': activeKey === '2' }"
          id="tax-brackets-pane" role="tabpanel" aria-labelledby="tax-brackets-tab" tabindex="0">
          <!-- Header Section -->
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 class="h3 mb-1">Tax Brackets Management</h1>
              <p class="text-muted mb-0">Configure income tax brackets and progressive tax rates for {{ selectedYear }}.
              </p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-primary btn-sm d-flex align-items-center" @click="openAddTaxBracketModal">
                <i class="ti ti-plus me-1"></i>Add Tax Bracket
              </button>
              <button class="btn btn-outline-secondary btn-sm d-flex align-items-center"
                @click="exportTaxBracketsToExcel">
                <i class="ti ti-download me-1"></i>Export
              </button>
            </div>
          </div>

          <!-- Tax Brackets Summary Cards -->
          <div class="row mb-4">
            <div class="col-lg-3 col-md-6">
              <div class="card border-0 bg-light-primary">
                <div class="card-body">
                  <div class="d-flex align-items-center">
                    <div class="flex-shrink-0">
                      <div class="avatar avatar-md bg-primary rounded-circle">
                        <i class="ti ti-list-numbers text-white"></i>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <h6 class="card-title mb-1">Total Brackets</h6>
                      <p class="card-text mb-0 text-muted">{{ totalTaxBrackets }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-3 col-md-6">
              <div class="card border-0 bg-light-success">
                <div class="card-body">
                  <div class="d-flex align-items-center">
                    <div class="flex-shrink-0">
                      <div class="avatar avatar-md bg-success rounded-circle">
                        <i class="ti ti-check text-white"></i>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <h6 class="card-title mb-1">Active Brackets</h6>
                      <p class="card-text mb-0 text-muted">{{ activeTaxBrackets }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-3 col-md-6">
              <div class="card border-0 bg-light-warning">
                <div class="card-body">
                  <div class="d-flex align-items-center">
                    <div class="flex-shrink-0">
                      <div class="avatar avatar-md bg-warning rounded-circle">
                        <i class="ti ti-percentage text-white"></i>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <h6 class="card-title mb-1">Highest Rate</h6>
                      <p class="card-text mb-0 text-muted">{{ highestTaxRate }}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-3 col-md-6">
              <div class="card border-0 bg-light-info">
                <div class="card-body">
                  <div class="d-flex align-items-center">
                    <div class="flex-shrink-0">
                      <div class="avatar avatar-md bg-info rounded-circle">
                        <i class="ti ti-calendar text-white"></i>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <h6 class="card-title mb-1">Tax Year</h6>
                      <p class="card-text mb-0 text-muted">{{ selectedYear }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Filters Section -->
          <div class="card mb-4">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <i class="ti ti-filter me-2"></i>
                <h6 class="mb-0 me-3">Filters</h6>
              </div>
              <div class="row g-3">
                <div class="col-md-3">
                  <label class="form-label small">Search</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="ti ti-search"></i></span>
                    <input type="text" class="form-control" v-model="taxBracketsSearchText"
                      @input="handleTaxBracketsSearch" placeholder="Search by bracket order...">
                  </div>
                </div>
                <div class="col-md-2">
                  <label class="form-label small">Effective Year</label>
                  <select class="form-select" v-model="taxBracketsFilters.effectiveYear"
                    @change="applyTaxBracketsEffectiveYearFilter">
                    <option value="">All years</option>
                    <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
                  </select>
                </div>
                <div class="col-md-2">
                  <label class="form-label small">Status</label>
                  <div class="form-check form-switch mt-2">
                    <input class="form-check-input" type="checkbox" v-model="taxBracketsFilters.activeOnly"
                      @change="applyTaxBracketsActiveFilter">
                    <label class="form-check-label small">Active only</label>
                  </div>
                </div>
                <div class="col-md-5 d-flex align-items-end">
                  <div class="d-flex gap-2 w-100">
                    <span class="badge bg-secondary">{{ totalTaxBracketsCount }} total brackets</span>
                    <button class="btn btn-outline-secondary btn-sm" @click="clearTaxBracketsFilters">
                      <i class="ti ti-x me-1"></i>Clear filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tax Brackets Table -->
          <div class="card">
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-borderless mb-0">
                  <thead class="table-light">
                    <tr>
                      <th class="border-0 ps-3" style="width: 80px;">
                        <div class="d-flex align-items-center">
                          Order
                          <button class="btn btn-sm btn-link text-muted p-0 ms-1"
                            @click="handleTaxBracketsTableSort('bracket_order')">
                            <i class="ti ti-arrows-sort" :class="getTaxBracketsSortIcon('bracket_order')"></i>
                          </button>
                        </div>
                      </th>
                      <th class="border-0" style="width: 250px;">
                        <div class="d-flex align-items-center">
                          Income Range
                          <button class="btn btn-sm btn-link text-muted p-0 ms-1"
                            @click="handleTaxBracketsTableSort('min_income')">
                            <i class="ti ti-arrows-sort" :class="getTaxBracketsSortIcon('min_income')"></i>
                          </button>
                        </div>
                      </th>
                      <th class="border-0" style="width: 120px;">
                        <div class="d-flex align-items-center">
                          Tax Rate
                          <button class="btn btn-sm btn-link text-muted p-0 ms-1"
                            @click="handleTaxBracketsTableSort('tax_rate')">
                            <i class="ti ti-arrows-sort" :class="getTaxBracketsSortIcon('tax_rate')"></i>
                          </button>
                        </div>
                      </th>
                      <th class="border-0">Description</th>
                      <th class="border-0" style="width: 80px;">
                        <div class="d-flex align-items-center">
                          Year
                          <button class="btn btn-sm btn-link text-muted p-0 ms-1"
                            @click="handleTaxBracketsTableSort('effective_year')">
                            <i class="ti ti-arrows-sort" :class="getTaxBracketsSortIcon('effective_year')"></i>
                          </button>
                        </div>
                      </th>
                      <th class="border-0" style="width: 80px;">Status</th>
                      <th class="border-0 pe-3" style="width: 80px;">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="taxBracketsLoading">
                      <td colspan="7" class="text-center py-4">
                        <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                        Loading tax brackets...
                      </td>
                    </tr>
                    <tr v-else-if="!taxBrackets.length">
                      <td colspan="7" class="text-center py-4 text-muted">
                        No tax brackets found
                      </td>
                    </tr>
                    <tr v-else v-for="record in taxBrackets" :key="record.id" class="border-bottom">
                      <td class="ps-3">
                        <div class="text-center">
                          <span class="badge badge-primary">{{ record.bracket_order }}</span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong class="text-primary">{{ formatIncomeRange(record.min_income, record.max_income)
                            }}</strong>
                          <br>
                          <small class="text-muted">Min: {{ formatCurrency(record.min_income) }}</small>
                          <span v-if="record.max_income">
                            <br>
                            <small class="text-muted">Max: {{ formatCurrency(record.max_income) }}</small>
                          </span>
                        </div>
                      </td>
                      <td>
                        <span class="fw-semibold" :class="getTaxRateClass(record.tax_rate)">
                          {{ record.tax_rate }}%
                        </span>
                      </td>
                      <td>
                        <span class="text-muted">{{ record.description || `${record.tax_rate}% tax bracket` }}</span>
                      </td>
                      <td>
                        <span class="badge badge-primary">{{ record.effective_year }}</span>
                      </td>
                      <td>
                        <span :class="['badge', record.is_active ? 'badge-success' : 'badge-secondary']">
                          {{ record.is_active ? 'Active' : 'Inactive' }}
                        </span>
                      </td>
                      <td class="pe-3">
                        <div class="dropdown">
                          <button class="btn btn-sm btn-link text-muted" data-bs-toggle="dropdown">
                            <i class="ti ti-dots-vertical"></i>
                          </button>
                          <ul class="dropdown-menu dropdown-menu-end">
                            <li>
                              <a class="dropdown-item" @click="editTaxBracket(record)">
                                <i class="ti ti-edit me-2"></i>Edit
                              </a>
                            </li>
                            <li>
                              <a class="dropdown-item text-danger" @click="confirmDeleteTaxBracket(record.id)">
                                <i class="ti ti-trash me-2"></i>Delete
                              </a>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Backend Pagination -->
              <div class="pagination-wrapper p-3 border-top" v-if="taxBracketsTotal > 0">
                <div class="d-flex justify-content-between align-items-center">
                  <div class="text-muted small">
                    Showing {{ getTaxBracketsShowingText() }}
                  </div>
                  <div class="d-flex align-items-center">
                    <div class="d-flex align-items-center me-3">
                      <label class="form-label me-2 mb-0 small">Show:</label>
                      <select class="form-select form-select-sm" v-model="taxBracketsPageSize"
                        @change="handleTaxBracketsPageSizeChange" style="width: 80px;">
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>
                    </div>
                    <nav>
                      <ul class="pagination pagination-sm mb-0">
                        <li class="page-item" :class="{ disabled: taxBracketsCurrentPage === 1 }">
                          <button class="page-link" @click="goToTaxBracketsPage(taxBracketsCurrentPage - 1)"
                            :disabled="taxBracketsCurrentPage === 1">
                            <i class="ti ti-chevron-left"></i>
                          </button>
                        </li>
                        <li class="page-item" :class="{ active: page === taxBracketsCurrentPage }"
                          v-for="page in taxBracketsVisiblePages" :key="page">
                          <button class="page-link" @click="goToTaxBracketsPage(page)">{{ page }}</button>
                        </li>
                        <li class="page-item" :class="{ disabled: taxBracketsCurrentPage === taxBracketsTotalPages }">
                          <button class="page-link" @click="goToTaxBracketsPage(taxBracketsCurrentPage + 1)"
                            :disabled="taxBracketsCurrentPage === taxBracketsTotalPages">
                            <i class="ti ti-chevron-right"></i>
                          </button>
                        </li>
                      </ul>
                    </nav>
                    <div class="d-flex align-items-center ms-3">
                      <label class="form-label me-2 mb-0 small">Go to:</label>
                      <input type="number" class="form-control form-control-sm" v-model.number="taxBracketsJumpToPage"
                        @keyup.enter="handleTaxBracketsJumpToPage" :min="1" :max="taxBracketsTotalPages"
                        style="width: 60px;">
                      <button class="btn btn-sm btn-outline-secondary ms-1" @click="handleTaxBracketsJumpToPage">
                        <i class="ti ti-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tax Calculator Tab -->
        <div class="tab-pane fade p-0 border-bottom-0" :class="{ 'show active': activeKey === '3' }"
          id="tax-calculator-pane" role="tabpanel" aria-labelledby="tax-calculator-tab" tabindex="0">
          <!-- Header Section -->
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 class="h3 mb-1">Tax Calculator</h1>
              <p class="text-muted mb-0">Calculate income tax, social security, and other deductions for {{ selectedYear
              }}</p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-primary btn-sm d-flex align-items-center" @click="saveCalculation"
                :disabled="!hasCalculationResults">
                <i class="ti ti-device-floppy me-1"></i>Save Calculation
              </button>
              <button class="btn btn-outline-secondary btn-sm d-flex align-items-center" @click="printCalculation"
                :disabled="!hasCalculationResults">
                <i class="ti ti-printer me-1"></i>Print
              </button>
              <button class="btn btn-primary btn-sm d-flex align-items-center" @click="resetCalculator">
                <i class="ti ti-refresh me-1"></i>Reset
              </button>
            </div>
          </div>

          <!-- Tax Calculator Content -->
          <div class="row">
            <div class="col-lg-8">
              <!-- Payroll Calculation Card -->
              <div class="card mb-4">
                <div class="card-body">
                  <div class="d-flex align-items-center mb-3">
                    <div class="avatar avatar-md bg-primary rounded-circle me-3">
                      <i class="ti ti-calculator text-white"></i>
                    </div>
                    <div>
                      <h5 class="mb-1">Payroll Calculation</h5>
                      <p class="text-muted mb-0">Calculate Thai Revenue Department compliant payroll with employment
                        deductions and personal allowances</p>
                    </div>
                  </div>

                  <form @submit.prevent="calculateTax">
                    <!-- Main Input Fields -->
                    <div class="row mb-4">
                      <div class="col-md-4">
                        <label class="form-label">Employee ID <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" v-model="calculator.employeeId"
                          placeholder="Enter employee ID">
                      </div>
                      <div class="col-md-4">
                        <label class="form-label">Monthly Gross Salary (฿) <span class="text-danger">*</span></label>
                        <input type="number" class="form-control" v-model="calculator.monthlySalary" placeholder="50000"
                          @input="calculateTaxRealTime" step="0.01" min="0">
                      </div>
                      <div class="col-md-4">
                        <label class="form-label">Tax Year</label>
                        <select class="form-select" v-model="calculator.calculationYear" @change="calculateTaxRealTime">
                          <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
                        </select>
                      </div>
                    </div>

                    <!-- Additional Income Section -->
                    <div class="mb-4">
                      <div class="d-flex align-items-center justify-content-between mb-3">
                        <h6 class="mb-0">Additional Income</h6>
                        <button type="button" class="btn btn-sm btn-outline-success" @click="addIncomeItem">
                          <i class="ti ti-plus me-1"></i>Add Income
                        </button>
                      </div>
                      <div v-if="calculator.additionalIncomes.length === 0" class="text-muted text-center py-3">
                        <i class="ti ti-plus-circle me-2"></i>No additional income items. Click "Add Income" to add
                        items.
                      </div>
                      <div v-else>
                        <div v-for="(income, index) in calculator.additionalIncomes" :key="index"
                          class="border rounded p-3 mb-2">
                          <div class="row align-items-end">
                            <div class="col-md-6">
                              <label class="form-label small">Income Type</label>
                              <select class="form-select form-select-sm" v-model="income.type"
                                @change="calculateTaxRealTime">
                                <option value="allowances">Allowances</option>
                                <option value="bonus">Bonus</option>
                                <option value="commission">Commission</option>
                                <option value="overtime">Overtime</option>
                                <option value="other">Other Income</option>
                              </select>
                            </div>
                            <div class="col-md-5">
                              <label class="form-label small">Amount (฿)</label>
                              <input type="number" class="form-control form-control-sm" v-model="income.amount"
                                @input="calculateTaxRealTime" step="0.01" min="0" placeholder="0">
                            </div>
                            <div class="col-md-1">
                              <button type="button" class="btn btn-sm btn-outline-danger"
                                @click="removeIncomeItem(index)">
                                <i class="ti ti-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Additional Deductions Section -->
                    <div class="mb-4">
                      <div class="d-flex align-items-center justify-content-between mb-3">
                        <h6 class="mb-0">Additional Deductions</h6>
                        <button type="button" class="btn btn-sm btn-outline-info" @click="addDeductionItem">
                          <i class="ti ti-plus me-1"></i>Add Deduction
                        </button>
                      </div>
                      <div v-if="calculator.additionalDeductions.length === 0" class="text-muted text-center py-3">
                        <i class="ti ti-plus-circle me-2"></i>No additional deduction items. Click "Add Deduction" to
                        add items.
                      </div>
                      <div v-else>
                        <div v-for="(deduction, index) in calculator.additionalDeductions" :key="index"
                          class="border rounded p-3 mb-2">
                          <div class="row align-items-end">
                            <div class="col-md-6">
                              <label class="form-label small">Deduction Type</label>
                              <select class="form-select form-select-sm" v-model="deduction.type"
                                @change="calculateTaxRealTime">
                                <option value="insurance">Life Insurance</option>
                                <option value="health_insurance">Health Insurance</option>
                                <option value="donation">Charitable Donations</option>
                                <option value="education">Education Expenses</option>
                                <option value="housing">Housing Loan Interest</option>
                                <option value="other">Other Deductions</option>
                              </select>
                            </div>
                            <div class="col-md-5">
                              <label class="form-label small">Amount (฿)</label>
                              <input type="number" class="form-control form-control-sm" v-model="deduction.amount"
                                @input="calculateTaxRealTime" step="0.01" min="0" placeholder="0">
                            </div>
                            <div class="col-md-1">
                              <button type="button" class="btn btn-sm btn-outline-danger"
                                @click="removeDeductionItem(index)">
                                <i class="ti ti-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Calculate Button -->
                    <div class="d-flex justify-content-center">
                      <button type="submit" class="btn btn-primary btn-lg px-5"
                        :disabled="calculatorLoading || !calculator.monthlySalary">
                        <span v-if="calculatorLoading" class="spinner-border spinner-border-sm me-2"
                          role="status"></span>
                        <i v-else class="ti ti-calculator me-2"></i>Calculate Payroll
                      </button>
                    </div>
                    <div class="text-center text-muted small mt-2">
                      <i class="ti ti-info-circle me-1"></i>Calculation updates automatically as you type
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div class="col-lg-4">
              <div class="card">
                <div class="card-header">
                  <h5 class="mb-0">Tax Calculation Results</h5>
                  <div v-if="hasCalculationResults" class="text-success small mt-1">
                    <i class="ti ti-check-circle me-1"></i>Calculated
                  </div>
                </div>
                <div class="card-body">
                  <div class="tax-results-summary">
                    <!-- Gross Income -->
                    <div class="result-item d-flex justify-content-between align-items-center py-2">
                      <span class="text-muted">Gross Income:</span>
                      <strong class="text-dark">{{ formatCurrency(calculator.grossIncome) }}</strong>
                    </div>

                    <!-- Personal Allowance -->
                    <div class="result-item d-flex justify-content-between align-items-center py-2">
                      <span class="text-muted">Personal Allowance:</span>
                      <strong class="text-dark">{{ formatCurrency(calculator.personalDeductions) }}</strong>
                    </div>

                    <!-- Taxable Income -->
                    <div class="result-item d-flex justify-content-between align-items-center py-2 border-top">
                      <span class="text-primary fw-semibold">Taxable Income:</span>
                      <strong class="text-primary fs-6">{{ formatCurrency(calculator.taxableIncome) }}</strong>
                    </div>


                    <!-- Tax Deductions -->
                    <div class="mt-3 mb-3">
                      <div class="result-item d-flex justify-content-between align-items-center py-2">
                        <span class="text-danger">Income Tax:</span>
                        <strong class="text-danger">{{ formatCurrency(calculator.incomeTax) }}</strong>
                      </div>
                      <div class="result-item d-flex justify-content-between align-items-center py-2">
                        <span class="text-warning">Social Security:</span>
                        <strong class="text-warning">{{ formatCurrency(calculator.socialSecurity) }}</strong>
                      </div>
                      <div class="result-item d-flex justify-content-between align-items-center py-2">
                        <span class="text-success">Provident Fund:</span>
                        <strong class="text-success">{{ formatCurrency(calculator.providentFund) }}</strong>
                      </div>
                    </div>

                    <!-- Net Income Highlight -->
                    <div class="result-highlight bg-success bg-opacity-10 border border-success rounded-3 p-3 mt-4">
                      <div class="d-flex justify-content-between align-items-center">
                        <span class="text-success fw-bold fs-6">Net Income:</span>
                        <div class="text-end">
                          <div class="text-success fw-bold fs-4">{{ formatCurrency(calculator.netIncome) }}</div>
                          <div class="text-muted small">***</div>
                        </div>
                      </div>
                    </div>

                    <!-- Tax Rates -->
                    <div class="row text-center mt-4">
                      <div class="col-6">
                        <div class="small text-muted mb-1">Effective Rate</div>
                        <div class="fw-bold text-primary fs-5">{{ calculator.effectiveTaxRate }}%</div>
                      </div>
                      <div class="col-6">
                        <div class="small text-muted mb-1">Marginal Rate</div>
                        <div class="fw-bold text-warning fs-5">{{ calculator.marginalTaxRate }}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tax Breakdown by Bracket -->
              <div v-if="calculator.taxBreakdown && calculator.taxBreakdown.length > 0" class="card mt-3">
                <div class="card-header">
                  <h6 class="mb-0">Tax Breakdown by Bracket</h6>
                </div>
                <div class="card-body p-2">
                  <div v-for="(bracket, index) in calculator.taxBreakdown" :key="index"
                    class="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <div class="small">
                      <div class="fw-semibold">{{ bracket.income_range }}</div>
                      <div class="text-muted">{{ bracket.tax_rate }}%</div>
                    </div>
                    <div class="text-end small">
                      <div class="fw-semibold text-primary">{{ formatCurrency(bracket.tax_amount) }}</div>
                      <div class="text-muted">on {{ formatCurrency(bracket.taxable_amount) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <layout-footer></layout-footer>
  </div>
  <!-- /Page Wrapper -->

  <!-- Tax Settings Modal -->
  <tax-settings-modal ref="taxSettingsModal" :editing-record="editingTaxSetting" @submit="handleTaxSettingSubmit"
    @cancel="handleTaxSettingCancel" />

  <!-- Tax Brackets Modal -->
  <tax-brackets-modal ref="taxBracketsModal" :editing-record="editingTaxBracket" @submit="handleTaxBracketSubmit"
    @cancel="handleTaxBracketCancel" />
</template>

<script>
import moment from 'moment';
import { taxSettingsService } from '@/services/tax-settings.service';
import { taxBracketsService } from '@/services/tax-brackets.service';
import { taxCalculationsService } from '@/services/tax-calculations.service';
import TaxSettingsModal from '@/components/modal/tax-settings-modal.vue';
import TaxBracketsModal from '@/components/modal/tax-brackets-modal.vue';
import { debounce } from 'lodash';

export default {
  components: {
    TaxSettingsModal,
    TaxBracketsModal
  },
  data() {
    return {
      title: "Tax Settings",
      text: "HR",
      text1: "Tax Settings",

      // Active tab tracking
      activeKey: '1',

      // Year selection
      selectedYear: new Date().getFullYear(),
      availableYears: [],

      // Loading states
      taxSettingsLoading: false,
      taxBracketsLoading: false,
      calculatorLoading: false,
      submitting: false,

      // Modal state
      editingTaxSetting: null,
      editingTaxBracket: null,

      // Search and Filters
      searchText: '',
      taxBracketsSearchText: '',
      taxBracketsFilters: {
        effectiveYear: '',
        activeOnly: false
      },
      // Backend Pagination (following employee-list pattern)
      currentPage: 1,
      pageSize: 10,
      total: 0,

      // Sorting and Filtering state (following employee-list pattern)
      sortedInfo: {},
      filteredInfo: {},

      // Individual filter states for custom dropdowns
      filterSettingType: '',
      filterEffectiveYear: '',
      filterIsSelected: '',

      // Jump to page input
      jumpToPage: null,

      // Debounced search function
      debouncedSearch: null,

      // Debounced functions
      debouncedTaxBracketsSearch: null,
      debouncedCalculation: null,

      // Tax Calculator data
      calculator: {
        employeeId: '',
        monthlySalary: 0,
        annualSalary: 0,
        calculationYear: new Date().getFullYear(),
        additionalIncomes: [],
        additionalDeductions: [],
        grossIncome: 0,
        taxableIncome: 0,
        personalDeductions: 0,
        incomeTax: 0,
        socialSecurity: 0,
        providentFund: 0,
        netIncome: 0,
        effectiveTaxRate: 0,
        marginalTaxRate: 0,
        taxBreakdown: []
      },

      // Tax rate summary data
      taxRates: {
        incomeTax: 10.0,
        socialSecurity: 5.0,
        providentFund: 5.0,
        corporateTax: 20.0
      },

      // API Data
      taxSettings: [],
      taxBrackets: [],
      rawTaxSettings: [],
      rawTaxBrackets: [],
      allowedKeys: [],

      // Tax Settings Table configuration
      selectedTaxSettingKeys: [],

      // Tax Brackets Backend Pagination (following tax settings pattern)
      taxBracketsCurrentPage: 1,
      taxBracketsPageSize: 10,
      taxBracketsTotal: 0,

      // Tax Brackets Sorting and Filtering state
      taxBracketsSortedInfo: {},
      taxBracketsFilteredInfo: {},

      // Tax Brackets Jump to page input
      taxBracketsJumpToPage: null,




    };
  },

  created() {
    // Initialize debounced functions
    this.debouncedSearch = debounce(this.performTaxSettingsSearch, 300);
    this.debouncedTaxBracketsSearch = debounce(this.performTaxBracketsSearch, 300);
    this.debouncedCalculation = debounce(this.performTaxCalculation, 500);
  },

  computed: {
    // Backend Pagination computed properties
    totalPages() {
      return Math.ceil(this.total / this.pageSize);
    },

    visiblePages() {
      const pages = [];
      const maxVisible = 5;
      const current = this.currentPage;
      const total = this.totalPages;

      let start = Math.max(1, current - Math.floor(maxVisible / 2));
      let end = Math.min(total, start + maxVisible - 1);

      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      return pages;
    },

    // Tax Brackets Backend Pagination computed properties
    taxBracketsTotalPages() {
      return Math.ceil(this.taxBracketsTotal / this.taxBracketsPageSize);
    },

    taxBracketsVisiblePages() {
      const pages = [];
      const maxVisible = 5;
      const current = this.taxBracketsCurrentPage;
      const total = this.taxBracketsTotalPages;

      let start = Math.max(1, current - Math.floor(maxVisible / 2));
      let end = Math.min(total, start + maxVisible - 1);

      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      return pages;
    },

    // Summary calculations
    totalTaxSettings() {
      return this.total || 0;
    },

    activeTaxSettings() {
      return this.taxSettings?.filter(setting => setting.is_selected)?.length || 0;
    },

    // Filter tracking (following employee-list pattern)
    hasActiveFilters() {
      return this.searchText ||
        this.filterSettingType ||
        this.filterEffectiveYear ||
        this.filterIsSelected ||
        (this.sortedInfo && this.sortedInfo.field);
    },

    getActiveFiltersCount() {
      let count = 0;
      if (this.searchText) count++;
      if (this.filterSettingType) count++;
      if (this.filterEffectiveYear) count++;
      if (this.filterIsSelected) count++;
      if (this.sortedInfo && this.sortedInfo.field) count++;
      return count;
    },

    totalTaxBrackets() {
      return this.taxBracketsTotal || 0;
    },

    totalTaxBracketsCount() {
      return this.taxBracketsTotal || 0;
    },

    activeTaxBrackets() {
      return this.taxBrackets?.filter(bracket => bracket.is_active)?.length || 0;
    },

    highestTaxRate() {
      if (!Array.isArray(this.taxBrackets) || this.taxBrackets.length === 0) return 0;
      return Math.max(...this.taxBrackets.map(bracket => bracket.tax_rate));
    },

    hasCalculationResults() {
      return this.calculator.grossIncome > 0 && (this.calculator.incomeTax > 0 || this.calculator.socialSecurity > 0 || this.calculator.providentFund > 0);
    }
  },

  watch: {
    // Watch for monthly salary changes to auto-calculate annual salary
    'calculator.monthlySalary'(newVal) {
      this.calculator.annualSalary = (parseFloat(newVal) || 0) * 12;
    },

    // Watch for active tab changes
    activeKey(newKey) {
      if (newKey === '1') {
        this.fetchTaxSettings();
      } else if (newKey === '2') {
        this.fetchTaxBrackets();
      } else if (newKey === '3') {
        this.initializeCalculator();
      }
    },

    // Watch for year changes
    selectedYear(newYear) {
      this.fetchTaxSettings();
      this.fetchTaxBrackets();
      this.calculator.calculationYear = newYear;
      if (this.activeKey === '3') {
        this.calculateTaxRealTime();
      }
    }
  },

  mounted() {
    this.availableYears = this.generateAvailableYears();
    this.initializeData();

    // Ensure the first tab is properly set as active
    this.setActiveTab('1');
  },

  methods: {
    // Initialization Methods
    async initializeData() {
      try {
        // Try to fetch data, but don't fail completely if one fails
        const promises = [
          this.fetchTaxSettings().catch(error => {
            console.warn('Tax settings fetch failed:', error);
            return null;
          }),
          this.fetchTaxBrackets().catch(error => {
            console.warn('Tax brackets fetch failed:', error);
            return null;
          })
        ];

        await Promise.allSettled(promises);

        // If both failed, show a warning but don't break the UI
        if (this.taxSettings.length === 0 && this.taxBrackets.length === 0) {
          this.showMessage('Unable to fetch tax data. Some features may not work properly.', 'warning');
        }

        this.initializeCalculator();
      } catch (error) {
        console.error('Error initializing data:', error);
        this.showMessage('Failed to load tax data', 'error');
      }
    },

    generateAvailableYears() {
      const currentYear = new Date().getFullYear();
      const years = [];
      for (let i = currentYear - 5; i <= currentYear + 10; i++) {
        years.push(i);
      }
      return years;
    },

    // Fallback data for development/testing when API is not available
    getFallbackTaxSettings() {
      return [
        {
          id: 1,
          setting_key: 'PERSONAL_ALLOWANCE',
          setting_value: 60000,
          setting_type: 'DEDUCTION',
          description: 'Personal allowance for income tax',
          effective_year: 2025,
          is_selected: true,
          created_at: '2025-01-01T00:00:00Z'
        },
        {
          id: 2,
          setting_key: 'SPOUSE_ALLOWANCE',
          setting_value: 60000,
          setting_type: 'DEDUCTION',
          description: 'Spouse allowance for income tax',
          effective_year: 2025,
          is_selected: true,
          created_at: '2025-01-01T00:00:00Z'
        },
        {
          id: 3,
          setting_key: 'CHILD_ALLOWANCE',
          setting_value: 30000,
          setting_type: 'DEDUCTION',
          description: 'Child allowance per child',
          effective_year: 2024,
          is_selected: true,
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 4,
          setting_key: 'SSF_MAX_MONTHLY',
          setting_value: 750,
          setting_type: 'LIMIT',
          description: 'Maximum monthly SSF contribution',
          effective_year: 2025,
          is_selected: false,
          created_at: '2025-01-01T00:00:00Z'
        },
        {
          id: 5,
          setting_key: 'SSF_RATE',
          setting_value: 5,
          setting_type: 'RATE',
          description: 'Social Security Fund contribution rate (%)',
          effective_year: 2025,
          is_selected: true,
          created_at: '2025-01-01T00:00:00Z'
        }
      ];
    },

    getFallbackTaxBrackets() {
      return [
        {
          id: 1,
          min_income: 0,
          max_income: 150000,
          tax_rate: 0,
          bracket_order: 1,
          effective_year: 2025,
          is_active: true,
          description: 'Tax-free bracket'
        },
        {
          id: 2,
          min_income: 150001,
          max_income: 300000,
          tax_rate: 5,
          bracket_order: 2,
          effective_year: 2025,
          is_active: true,
          description: '5% tax bracket'
        },
        {
          id: 3,
          min_income: 300001,
          max_income: 500000,
          tax_rate: 10,
          bracket_order: 3,
          effective_year: 2025,
          is_active: true,
          description: '10% tax bracket'
        },
        {
          id: 4,
          min_income: 500001,
          max_income: null,
          tax_rate: 20,
          bracket_order: 4,
          effective_year: 2025,
          is_active: true,
          description: '20% tax bracket'
        }
      ];
    },

    initializeCalculator() {
      this.calculator.calculationYear = this.selectedYear;
      this.calculateTaxRealTime();
    },

    // Year Selection Methods
    handleYearChange() {
      // Handled by watcher
    },

    // Tax Settings API Methods - Backend pagination (following employee-list pattern)
    async fetchTaxSettings(params = {}) {
      this.taxSettingsLoading = true;
      try {
        const queryParams = {
          page: params.page || this.currentPage || 1,
          per_page: params.per_page || this.pageSize,
          ...params
        };

        const response = await taxSettingsService.getTaxSettings(queryParams);

        if (response.success && response.data) {
          this.rawTaxSettings = response.data;
          this.taxSettings = response.data;

          // Update pagination properties from server response
          if (response.pagination) {
            this.total = response.pagination.total;
            this.currentPage = response.pagination.current_page;
            this.pageSize = response.pagination.per_page;
          } else {
            this.total = response.data.length;
            this.currentPage = 1;
          }

          this.updateTaxRatesSummary();
          this.showMessage('Tax settings loaded successfully', 'success');
        } else {
          this.rawTaxSettings = [];
          this.taxSettings = [];
          this.total = 0;
          this.showMessage('No tax settings data received', 'error');
        }
      } catch (error) {
        console.error('Error fetching tax settings:', error);
        this.showMessage('Using fallback tax settings data', 'warning');
        // Use fallback data for development/testing
        this.rawTaxSettings = this.getFallbackTaxSettings();
        this.taxSettings = this.rawTaxSettings;
        this.total = this.taxSettings.length;
        this.updateTaxRatesSummary();
      } finally {
        this.taxSettingsLoading = false;
      }
    },



    // Tax Brackets API Methods - Backend pagination (following employee-list pattern)
    async fetchTaxBrackets(params = {}) {
      this.taxBracketsLoading = true;
      try {
        const queryParams = {
          page: params.page || this.taxBracketsCurrentPage || 1,
          per_page: params.per_page || this.taxBracketsPageSize,
          ...params
        };

        const response = await taxBracketsService.getTaxBrackets(queryParams);

        if (response.success && response.data) {
          this.rawTaxBrackets = response.data;
          this.taxBrackets = response.data;

          // Update pagination properties from server response
          if (response.pagination) {
            this.taxBracketsTotal = response.pagination.total;
            this.taxBracketsCurrentPage = response.pagination.current_page;
            this.taxBracketsPageSize = response.pagination.per_page;
          } else {
            this.taxBracketsTotal = response.data.length;
            this.taxBracketsCurrentPage = 1;
          }

          this.showMessage('Tax brackets loaded successfully', 'success');
        } else {
          this.rawTaxBrackets = [];
          this.taxBrackets = [];
          this.taxBracketsTotal = 0;
          this.showMessage('No tax brackets data received', 'error');
        }
      } catch (error) {
        console.error('Error fetching tax brackets:', error);
        this.showMessage('Using fallback tax brackets data', 'warning');
        // Use fallback data for development/testing
        this.rawTaxBrackets = this.getFallbackTaxBrackets();
        this.taxBrackets = this.rawTaxBrackets.sort((a, b) => a.bracket_order - b.bracket_order);
        this.taxBracketsTotal = this.taxBrackets.length;
      } finally {
        this.taxBracketsLoading = false;
      }
    },

    updateTaxRatesSummary() {
      // Update the summary cards with actual data from API
      const ssfRate = this.getTaxSettingValue('SSF_RATE', 5);
      const pfMaxRate = this.getTaxSettingValue('PF_MAX_RATE', 5);

      this.taxRates = {
        incomeTax: this.highestTaxRate,
        socialSecurity: ssfRate,
        providentFund: pfMaxRate,
        corporateTax: 20.0 // This might come from a different API
      };
    },

    getTaxSettingValue(key, defaultValue = 0) {
      if (!Array.isArray(this.taxSettings)) {
        console.warn('taxSettings is not an array:', this.taxSettings);
        return defaultValue;
      }

      const setting = this.taxSettings.find(s => s.setting_key === key && s.is_selected);
      return setting ? parseFloat(setting.setting_value) : defaultValue;
    },

    // Tax Calculator Methods
    async calculateTax() {
      if (!this.calculator.monthlySalary || this.calculator.monthlySalary <= 0) {
        this.showMessage('Please enter a valid monthly salary', 'warning');
        return;
      }

      this.calculatorLoading = true;
      try {
        // Calculate totals from additional items
        const totalAdditionalIncome = this.calculator.additionalIncomes.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
        const totalAdditionalDeductions = this.calculator.additionalDeductions.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

        const calculationData = {
          employee_id: this.calculator.employeeId,
          monthly_salary: parseFloat(this.calculator.monthlySalary) || 0,
          annual_salary: parseFloat(this.calculator.annualSalary) || 0,
          additional_income: totalAdditionalIncome,
          additional_deductions: totalAdditionalDeductions,
          calculation_year: this.calculator.calculationYear,
          income_items: this.calculator.additionalIncomes,
          deduction_items: this.calculator.additionalDeductions
        };

        // Try API calculation first, fallback to client-side
        const response = await taxCalculationsService.calculatePayroll(calculationData);

        if (response.success) {
          this.updateCalculatorFromAPI(response.data);
        } else {
          // Fallback to client-side calculation
          this.calculateTaxClientSide(calculationData);
        }
      } catch (error) {
        console.error('Error calculating tax:', error);
        // Fallback to client-side calculation
        const totalAdditionalIncome = this.calculator.additionalIncomes.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
        const totalAdditionalDeductions = this.calculator.additionalDeductions.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

        this.calculateTaxClientSide({
          monthly_salary: parseFloat(this.calculator.monthlySalary) || 0,
          annual_salary: parseFloat(this.calculator.annualSalary) || 0,
          additional_income: totalAdditionalIncome,
          additional_deductions: totalAdditionalDeductions
        });
      } finally {
        this.calculatorLoading = false;
      }
    },

    calculateTaxRealTime() {
      if (this.debouncedCalculation) {
        this.debouncedCalculation();
      }
    },

    async performTaxCalculation() {
      if (this.calculator.monthlySalary > 0) {
        await this.calculateTax();
      }
    },

    calculateTaxClientSide(inputData) {
      const result = taxCalculationsService.calculateTaxClientSide(inputData, this.taxSettings, this.taxBrackets);

      if (result.success) {
        this.updateCalculatorFromClientSide(result.data);
      } else {
        this.showMessage('Error calculating taxes', 'error');
      }
    },

    updateCalculatorFromAPI(data) {
      this.calculator.grossIncome = data.gross_income || 0;
      this.calculator.taxableIncome = data.taxable_income || 0;
      this.calculator.personalDeductions = data.personal_deductions || 0;
      this.calculator.incomeTax = data.income_tax || 0;
      this.calculator.socialSecurity = data.social_security || 0;
      this.calculator.providentFund = data.provident_fund || 0;
      this.calculator.netIncome = data.net_income || 0;
      this.calculator.effectiveTaxRate = parseFloat(data.effective_tax_rate || 0).toFixed(2);
      this.calculator.marginalTaxRate = parseFloat(data.marginal_tax_rate || 0).toFixed(2);
      this.calculator.taxBreakdown = data.tax_breakdown || [];
    },

    updateCalculatorFromClientSide(data) {
      this.calculator.grossIncome = data.gross_income || 0;
      this.calculator.taxableIncome = data.taxable_income || 0;
      this.calculator.personalDeductions = data.personal_deductions || 0;
      this.calculator.incomeTax = data.income_tax || 0;
      this.calculator.socialSecurity = data.social_security || 0;
      this.calculator.providentFund = data.provident_fund || 0;
      this.calculator.netIncome = data.net_income || 0;
      this.calculator.effectiveTaxRate = parseFloat(data.effective_tax_rate || 0).toFixed(2);
      this.calculator.marginalTaxRate = parseFloat(data.marginal_tax_rate || 0).toFixed(2);
      this.calculator.taxBreakdown = data.tax_breakdown || [];
    },

    resetCalculator() {
      this.calculator = {
        employeeId: '',
        monthlySalary: 0,
        annualSalary: 0,
        calculationYear: this.selectedYear,
        additionalIncomes: [],
        additionalDeductions: [],
        grossIncome: 0,
        taxableIncome: 0,
        personalDeductions: 0,
        incomeTax: 0,
        socialSecurity: 0,
        providentFund: 0,
        netIncome: 0,
        effectiveTaxRate: 0,
        marginalTaxRate: 0,
        taxBreakdown: []
      };
    },

    // Additional Income Management
    addIncomeItem() {
      this.calculator.additionalIncomes.push({
        type: 'allowances',
        amount: 0
      });
    },

    removeIncomeItem(index) {
      this.calculator.additionalIncomes.splice(index, 1);
      this.calculateTaxRealTime();
    },

    // Additional Deductions Management
    addDeductionItem() {
      this.calculator.additionalDeductions.push({
        type: 'insurance',
        amount: 0
      });
    },

    removeDeductionItem(index) {
      this.calculator.additionalDeductions.splice(index, 1);
      this.calculateTaxRealTime();
    },

    async saveCalculation() {
      if (!this.hasCalculationResults) {
        this.showMessage('No calculation results to save', 'warning');
        return;
      }

      try {
        const calculationData = {
          monthly_salary: this.calculator.monthlySalary,
          annual_salary: this.calculator.annualSalary,
          allowances: this.calculator.allowances,
          other_income: this.calculator.otherIncome,
          deductions: this.calculator.deductions,
          dependents: this.calculator.dependents,
          calculation_year: this.calculator.calculationYear,
          results: {
            gross_income: this.calculator.grossIncome,
            taxable_income: this.calculator.taxableIncome,
            income_tax: this.calculator.incomeTax,
            social_security: this.calculator.socialSecurity,
            provident_fund: this.calculator.providentFund,
            net_income: this.calculator.netIncome,
            effective_tax_rate: this.calculator.effectiveTaxRate,
            marginal_tax_rate: this.calculator.marginalTaxRate,
            tax_breakdown: this.calculator.taxBreakdown
          }
        };

        const response = await taxCalculationsService.saveCalculation(calculationData);

        if (response.success) {
          this.showMessage('Tax calculation saved successfully', 'success');
        } else {
          this.showMessage(response.message || 'Failed to save calculation', 'error');
        }
      } catch (error) {
        console.error('Error saving calculation:', error);
        this.showMessage('Failed to save calculation', 'error');
      }
    },

    printCalculation() {
      if (!this.hasCalculationResults) {
        this.showMessage('No calculation results to print', 'warning');
        return;
      }

      window.print();
    },



    // Tax Settings Modal Methods
    openAddTaxSettingModal() {
      this.editingTaxSetting = null;
      this.$refs.taxSettingsModal.openModal();
    },

    editTaxSetting(record) {
      this.editingTaxSetting = { ...record };
      this.$refs.taxSettingsModal.openModal();
    },

    async handleTaxSettingSubmit(formData) {
      try {
        let response;

        if (this.editingTaxSetting && this.editingTaxSetting.id) {
          // Update existing tax setting
          response = await taxSettingsService.updateTaxSetting(this.editingTaxSetting.id, formData);
        } else {
          // Create new tax setting
          response = await taxSettingsService.createTaxSetting(formData);
        }

        if (response.success) {
          this.showMessage(response.message, 'success');
          await this.fetchTaxSettings();
          this.editingTaxSetting = null;
        } else {
          this.showMessage(response.message || 'Operation failed', 'error');
        }
      } catch (error) {
        console.error('Error submitting tax setting:', error);
        this.showMessage('Failed to save tax setting', 'error');
      }
    },

    handleTaxSettingCancel() {
      this.editingTaxSetting = null;
    },

    confirmDeleteTaxSetting(id) {
      if (confirm('Are you sure you want to delete this tax setting? This action cannot be undone.')) {
        this.deleteTaxSetting(id);
      }
    },

    async deleteTaxSetting(id) {
      try {
        const response = await taxSettingsService.deleteTaxSetting(id);

        if (response.success) {
          this.showMessage(response.message, 'success');
          await this.fetchTaxSettings();
          // Remove from selected keys if it was selected
          this.selectedTaxSettingKeys = this.selectedTaxSettingKeys.filter(key => key !== id);
        } else {
          this.showMessage(response.message || 'Failed to delete tax setting', 'error');
        }
      } catch (error) {
        console.error('Error deleting tax setting:', error);
        this.showMessage('Failed to delete tax setting', 'error');
      }
    },

    async bulkUpdateTaxSettings() {
      if (this.selectedTaxSettingKeys.length === 0) {
        this.showMessage('Please select tax settings to update', 'warning');
        return;
      }

      // This would open a bulk update modal or perform bulk operations
      this.showMessage('Bulk update functionality to be implemented', 'info');
    },

    async toggleTaxSetting(id) {
      try {
        const response = await taxSettingsService.toggleTaxSetting(id);

        if (response.success) {
          // Update the local data
          const setting = this.taxSettings.find(s => s.id === id);
          if (setting) {
            setting.is_selected = !setting.is_selected;
          }

          this.showMessage(response.message || 'Tax setting updated successfully', 'success');
        } else {
          this.showMessage(response.message || 'Failed to update tax setting', 'error');
        }
      } catch (error) {
        console.error('Error toggling tax setting:', error);
        this.showMessage('Failed to update tax setting', 'error');
      }
    },

    // Tax Brackets Modal Methods
    openAddTaxBracketModal() {
      this.editingTaxBracket = null;
      this.$refs.taxBracketsModal.openModal();
    },

    editTaxBracket(record) {
      this.editingTaxBracket = { ...record };
      this.$refs.taxBracketsModal.openModal();
    },

    async handleTaxBracketSubmit(formData) {
      try {
        let response;

        if (this.editingTaxBracket && this.editingTaxBracket.id) {
          // Update existing tax bracket
          response = await taxBracketsService.updateTaxBracket(this.editingTaxBracket.id, formData);
        } else {
          // Create new tax bracket
          response = await taxBracketsService.createTaxBracket(formData);
        }

        if (response.success) {
          this.showMessage(response.message, 'success');
          await this.fetchTaxBrackets();
          this.editingTaxBracket = null;
        } else {
          this.showMessage(response.message || 'Operation failed', 'error');
        }
      } catch (error) {
        console.error('Error submitting tax bracket:', error);
        this.showMessage('Failed to save tax bracket', 'error');
      }
    },

    handleTaxBracketCancel() {
      this.editingTaxBracket = null;
    },

    confirmDeleteTaxBracket(id) {
      if (confirm('Are you sure you want to delete this tax bracket? This action cannot be undone.')) {
        this.deleteTaxBracket(id);
      }
    },

    async deleteTaxBracket(id) {
      try {
        const response = await taxBracketsService.deleteTaxBracket(id);

        if (response.success) {
          this.showMessage(response.message, 'success');
          await this.fetchTaxBrackets();
        } else {
          this.showMessage(response.message || 'Failed to delete tax bracket', 'error');
        }
      } catch (error) {
        console.error('Error deleting tax bracket:', error);
        this.showMessage('Failed to delete tax bracket', 'error');
      }
    },

    // Search and Filter Methods (following employee-list pattern)
    handleSearch() {
      if (this.debouncedSearch) {
        this.debouncedSearch();
      }
    },

    // TABLE CHANGE HANDLER (for sorting/filtering only)
    handleTableChange(pagination, filters, sorter) {
      console.log('Table change (sorting/filtering):', filters, sorter);

      // Check if there's actually a meaningful change
      const hasFilterChange = JSON.stringify(filters) !== JSON.stringify(this.filteredInfo);
      const hasSorterChange = JSON.stringify(sorter) !== JSON.stringify(this.sortedInfo);

      // Only proceed if there's an actual filter or sort change
      if (!hasFilterChange && !hasSorterChange) {
        console.log('No meaningful change detected, skipping reload');
        return;
      }

      // Update filter state
      this.filteredInfo = filters;

      // Only update sorter if it's a real sort operation (has field and order)
      if (sorter && sorter.field && sorter.order) {
        console.log('Applying sort:', sorter);
        this.sortedInfo = sorter;
      } else if (!sorter || (!sorter.field && !sorter.order)) {
        console.log('Clearing sort (filtering only or no sort)');
        this.sortedInfo = {};
      }

      // Reset to first page when filter/sort changes
      this.currentPage = 1;

      // Build complete parameters
      const params = this.buildApiParams({
        page: 1,
        per_page: this.pageSize
      });

      // Fetch tax settings with new parameters
      this.fetchTaxSettings(params);
    },

    // Handle table sorting
    handleTableSort(column) {
      const currentOrder = this.sortedInfo.field === column && this.sortedInfo.order === 'ascend' ? 'descend' : 'ascend';

      this.sortedInfo = {
        field: column,
        order: currentOrder
      };

      this.currentPage = 1;

      const params = this.buildApiParams({
        page: 1,
        per_page: this.pageSize
      });

      this.fetchTaxSettings(params);
    },

    // PAGINATION EVENT HANDLERS - PRESERVE FILTERS AND SORTING (following employee-list pattern)
    handlePaginationChange(page, pageSize) {
      console.log('Pagination change:', page, pageSize);
      this.currentPage = page;
      this.pageSize = pageSize || this.pageSize;

      // Build complete parameters preserving current filters and sorting
      const params = this.buildApiParams({
        page: page,
        per_page: this.pageSize
      });

      this.fetchTaxSettings(params);
    },

    handleSizeChange(current, size) {
      console.log('Size change:', current, size);
      this.currentPage = 1; // Reset to first page when changing page size
      this.pageSize = size;

      // Build complete parameters preserving current filters and sorting
      const params = this.buildApiParams({
        page: 1,
        per_page: size
      });

      this.fetchTaxSettings(params);
    },

    // Helper method to build complete API parameters
    buildApiParams(baseParams = {}) {
      const params = {
        page: this.currentPage,
        per_page: this.pageSize,
        ...baseParams
      };

      // Add sorting parameters ONLY when user has explicitly clicked on a column to sort
      if (this.sortedInfo && this.sortedInfo.field && this.sortedInfo.order) {
        const sortField = this.mapSortField(this.sortedInfo.field);
        params.sort_by = sortField;
        params.sort_order = this.sortedInfo.order === 'ascend' ? 'asc' : 'desc';
      }

      // Add search parameter
      if (this.searchText) {
        params.search = this.searchText;
      }

      // Add filter parameters from custom filter dropdowns
      if (this.filterSettingType) {
        params.filter_setting_type = this.filterSettingType;
      }
      if (this.filterEffectiveYear) {
        params.filter_effective_year = this.filterEffectiveYear;
      }
      if (this.filterIsSelected) {
        params.filter_is_selected = this.filterIsSelected === 'true';
      }

      return params;
    },

    // Map frontend table field names to backend field names
    mapSortField(field) {
      const fieldMapping = {
        'setting_key': 'setting_key',
        'setting_value': 'setting_value',
        'setting_type': 'setting_type',
        'effective_year': 'effective_year'
      };
      return fieldMapping[field] || field;
    },

    performTaxSettingsSearch() {
      // Reset to first page when searching
      this.currentPage = 1;

      // Build parameters with search
      const params = this.buildApiParams({
        page: 1,
        per_page: this.pageSize
      });

      this.fetchTaxSettings(params);
    },



    clearFilters() {
      this.searchText = '';
      this.filterSettingType = '';
      this.filterEffectiveYear = '';
      this.filterIsSelected = '';
      this.currentPage = 1;
      this.sortedInfo = {};
      this.filteredInfo = {};

      // Fetch with cleared filters
      this.fetchTaxSettings();
    },

    // Individual filter methods (following employee-list pattern)
    applySettingTypeFilter() {
      this.currentPage = 1;
      const params = this.buildApiParams({
        page: 1,
        per_page: this.pageSize
      });
      this.fetchTaxSettings(params);
    },

    applyEffectiveYearFilter() {
      this.currentPage = 1;
      const params = this.buildApiParams({
        page: 1,
        per_page: this.pageSize
      });
      this.fetchTaxSettings(params);
    },

    applyStatusFilter() {
      this.currentPage = 1;
      const params = this.buildApiParams({
        page: 1,
        per_page: this.pageSize
      });
      this.fetchTaxSettings(params);
    },

    // Message helper method
    showMessage(text, type = 'info') {
      // Simple console logging for now, can be replaced with toast notifications
      console.log(`${type.toUpperCase()}: ${text}`);
      // You can integrate with your preferred notification system here
    },

    getSortIcon(column) {
      if (this.sortedInfo.field !== column) {
        return 'text-muted';
      }
      return this.sortedInfo.order === 'ascend' ? 'ti-arrow-up text-primary' : 'ti-arrow-down text-primary';
    },

    // Custom Pagination Methods
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.handlePaginationChange(page, this.pageSize);
      }
    },

    handleJumpToPage() {
      if (this.jumpToPage && this.jumpToPage >= 1 && this.jumpToPage <= this.totalPages) {
        this.goToPage(this.jumpToPage);
        this.jumpToPage = null;
      }
    },

    // Helper method for pagination text
    getShowingText() {
      if (this.total === 0) return 'No records found';

      const start = (this.currentPage - 1) * this.pageSize + 1;
      const end = Math.min(start + this.pageSize - 1, this.total);
      return `${start}-${end} of ${this.total} items`;
    },

    // Handle page size change from select dropdown
    handlePageSizeChange() {
      this.handleSizeChange(this.currentPage, this.pageSize);
    },

    handleTaxBracketsSearch() {
      if (this.debouncedTaxBracketsSearch) {
        this.debouncedTaxBracketsSearch();
      }
    },

    // TAX BRACKETS TABLE CHANGE HANDLER (for sorting/filtering only)
    handleTaxBracketsTableChange(pagination, filters, sorter) {
      console.log('Tax Brackets Table change (sorting/filtering):', filters, sorter);

      // Check if there's actually a meaningful change
      const hasFilterChange = JSON.stringify(filters) !== JSON.stringify(this.taxBracketsFilteredInfo);
      const hasSorterChange = JSON.stringify(sorter) !== JSON.stringify(this.taxBracketsSortedInfo);

      // Only proceed if there's an actual filter or sort change
      if (!hasFilterChange && !hasSorterChange) {
        console.log('No meaningful change detected, skipping reload');
        return;
      }

      // Update filter state
      this.taxBracketsFilteredInfo = filters;

      // Only update sorter if it's a real sort operation (has field and order)
      if (sorter && sorter.field && sorter.order) {
        console.log('Applying sort:', sorter);
        this.taxBracketsSortedInfo = sorter;
      } else if (!sorter || (!sorter.field && !sorter.order)) {
        console.log('Clearing sort (filtering only or no sort)');
        this.taxBracketsSortedInfo = {};
      }

      // Reset to first page when filter/sort changes
      this.taxBracketsCurrentPage = 1;

      // Build complete parameters
      const params = this.buildTaxBracketsApiParams({
        page: 1,
        per_page: this.taxBracketsPageSize
      });

      // Fetch tax brackets with new parameters
      this.fetchTaxBrackets(params);
    },

    // Handle tax brackets table sorting
    handleTaxBracketsTableSort(column) {
      const currentOrder = this.taxBracketsSortedInfo.field === column && this.taxBracketsSortedInfo.order === 'ascend' ? 'descend' : 'ascend';

      this.taxBracketsSortedInfo = {
        field: column,
        order: currentOrder
      };

      this.taxBracketsCurrentPage = 1;

      const params = this.buildTaxBracketsApiParams({
        page: 1,
        per_page: this.taxBracketsPageSize
      });

      this.fetchTaxBrackets(params);
    },

    performTaxBracketsSearch() {
      // Reset to first page when searching
      this.taxBracketsCurrentPage = 1;

      // Build parameters with search
      const params = this.buildTaxBracketsApiParams({
        page: 1,
        per_page: this.taxBracketsPageSize
      });

      this.fetchTaxBrackets(params);
    },

    // Tax Brackets Pagination Event Handlers (following employee-list pattern)
    handleTaxBracketsPaginationChange(page, pageSize) {
      console.log('Tax Brackets Pagination change:', page, pageSize);
      this.taxBracketsCurrentPage = page;
      this.taxBracketsPageSize = pageSize || this.taxBracketsPageSize;

      // Build complete parameters preserving current filters and sorting
      const params = this.buildTaxBracketsApiParams({
        page: page,
        per_page: this.taxBracketsPageSize
      });

      this.fetchTaxBrackets(params);
    },

    handleTaxBracketsPageSizeChange() {
      this.taxBracketsCurrentPage = 1; // Reset to first page when changing page size

      // Build complete parameters preserving current filters and sorting
      const params = this.buildTaxBracketsApiParams({
        page: 1,
        per_page: this.taxBracketsPageSize
      });

      this.fetchTaxBrackets(params);
    },

    // Helper method to build complete Tax Brackets API parameters (following employee-list pattern)
    buildTaxBracketsApiParams(baseParams = {}) {
      const params = {
        page: this.taxBracketsCurrentPage,
        per_page: this.taxBracketsPageSize,
        ...baseParams
      };

      // Add sorting parameters ONLY when user has explicitly clicked on a column to sort
      if (this.taxBracketsSortedInfo && this.taxBracketsSortedInfo.field && this.taxBracketsSortedInfo.order) {
        const sortField = this.mapTaxBracketsSortField(this.taxBracketsSortedInfo.field);
        params.sort_by = sortField;
        params.sort_order = this.taxBracketsSortedInfo.order === 'ascend' ? 'asc' : 'desc';
      }

      // Add search parameter (bracket_order search)
      if (this.taxBracketsSearchText) {
        params.search = this.taxBracketsSearchText;
      }

      // Add filter parameters
      if (this.taxBracketsFilters.effectiveYear) {
        params.filter_effective_year = this.taxBracketsFilters.effectiveYear;
      }
      if (this.taxBracketsFilters.activeOnly) {
        params.filter_is_active = this.taxBracketsFilters.activeOnly;
      }

      return params;
    },

    // Map frontend field names to backend field names for tax brackets
    mapTaxBracketsSortField(field) {
      const fieldMapping = {
        'bracket_order': 'bracket_order',
        'min_income': 'min_income',
        'max_income': 'max_income',
        'tax_rate': 'tax_rate',
        'effective_year': 'effective_year'
      };
      return fieldMapping[field] || field;
    },

    applyTaxBracketsFilters() {
      this.taxBracketsCurrentPage = 1;

      // Build parameters with filters
      const params = this.buildTaxBracketsApiParams({
        page: 1,
        per_page: this.taxBracketsPageSize
      });

      this.fetchTaxBrackets(params);
    },

    clearTaxBracketsFilters() {
      this.taxBracketsSearchText = '';
      this.taxBracketsFilters = {
        effectiveYear: '',
        activeOnly: false
      };
      this.taxBracketsCurrentPage = 1;
      this.taxBracketsSortedInfo = {};
      this.taxBracketsFilteredInfo = {};

      // Fetch with cleared filters
      this.fetchTaxBrackets();
    },

    // Tax Brackets Individual filter methods (following employee-list pattern)
    applyTaxBracketsEffectiveYearFilter() {
      this.taxBracketsCurrentPage = 1;
      const params = this.buildTaxBracketsApiParams({
        page: 1,
        per_page: this.taxBracketsPageSize
      });
      this.fetchTaxBrackets(params);
    },

    applyTaxBracketsActiveFilter() {
      this.taxBracketsCurrentPage = 1;
      const params = this.buildTaxBracketsApiParams({
        page: 1,
        per_page: this.taxBracketsPageSize
      });
      this.fetchTaxBrackets(params);
    },

    getTaxBracketsSortIcon(column) {
      if (this.taxBracketsSortedInfo.field !== column) {
        return 'text-muted';
      }
      return this.taxBracketsSortedInfo.order === 'ascend' ? 'ti-arrow-up text-primary' : 'ti-arrow-down text-primary';
    },

    // Tax Brackets Custom Pagination Methods
    goToTaxBracketsPage(page) {
      if (page >= 1 && page <= this.taxBracketsTotalPages) {
        this.handleTaxBracketsPaginationChange(page, this.taxBracketsPageSize);
      }
    },

    handleTaxBracketsJumpToPage() {
      if (this.taxBracketsJumpToPage && this.taxBracketsJumpToPage >= 1 && this.taxBracketsJumpToPage <= this.taxBracketsTotalPages) {
        this.goToTaxBracketsPage(this.taxBracketsJumpToPage);
        this.taxBracketsJumpToPage = null;
      }
    },

    // Helper method for tax brackets pagination text
    getTaxBracketsShowingText() {
      if (this.taxBracketsTotal === 0) return 'No records found';

      const start = (this.taxBracketsCurrentPage - 1) * this.taxBracketsPageSize + 1;
      const end = Math.min(start + this.taxBracketsPageSize - 1, this.taxBracketsTotal);
      return `${start}-${end} of ${this.taxBracketsTotal} items`;
    },

    // Utility Methods
    formatCurrency(amount) {
      if (!amount && amount !== 0) return '฿0.00';
      return `฿${amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    },

    formatDate(dateString) {
      if (!dateString) return '';
      return moment(dateString).format('DD MMM YYYY');
    },

    formatTime(dateString) {
      if (!dateString) return '';
      return moment(dateString).format('HH:mm');
    },

    formatIncomeRange(minIncome, maxIncome) {
      return taxBracketsService.formatIncomeRange(minIncome, maxIncome);
    },

    // Tax Settings Helper Methods
    getSettingKeyLabel(key) {
      const settingKeys = taxSettingsService.getTaxSettingKeys();
      const setting = settingKeys.find(s => s.value === key);
      return setting ? setting.label : key;
    },

    getSettingKeyDescription(key) {
      const descriptions = {
        // DEDUCTION category
        'PERSONAL_ALLOWANCE': 'Personal allowance for income tax',
        'SPOUSE_ALLOWANCE': 'Spouse allowance for income tax',
        'CHILD_ALLOWANCE': 'Child allowance per child',
        'DISABILITY_ALLOWANCE': 'Allowance for disability',
        'EDUCATION_ALLOWANCE': 'Allowance for education expenses',

        // RATE category
        'PERSONAL_EXPENSE_RATE': 'Rate for personal expenses deduction',
        'SSF_RATE': 'Social Security Fund contribution rate (%)',
        'PF_MIN_RATE': 'Minimum Provident Fund contribution rate',
        'PF_MAX_RATE': 'Maximum Provident Fund contribution rate',
        'CHARITABLE_DONATION_RATE': 'Rate for charitable donations',

        // LIMIT category
        'PERSONAL_EXPENSE_MAX': 'Maximum personal expenses deduction',
        'SSF_MAX_MONTHLY': 'Maximum monthly SSF contribution',
        'SSF_MAX_YEARLY': 'Maximum yearly SSF contribution',
        'HEALTH_INSURANCE_MAX': 'Maximum health insurance deduction',
        'LIFE_INSURANCE_MAX': 'Maximum life insurance deduction',
        'PENSION_INSURANCE_MAX': 'Maximum pension insurance deduction',
        'HOUSE_INTEREST_MAX': 'Maximum house interest deduction'
      };

      return descriptions[key] || `Setting for ${key}`;
    },

    getSettingTypeLabel(type) {
      const settingTypes = taxSettingsService.getTaxSettingTypes();
      const setting = settingTypes.find(s => s.value === type);
      return setting ? setting.label : type;
    },

    formatSettingValue(value, type) {
      if (!value && value !== 0) return '';

      const numValue = parseFloat(value);
      if (type === 'RATE') {
        return `${numValue}%`;
      } else if (type === 'DEDUCTION' || type === 'LIMIT') {
        return this.formatCurrency(numValue);
      }
      return numValue.toString();
    },

    getSettingValueClass(type) {
      switch (type) {
        case 'RATE':
          return 'text-warning';
        case 'DEDUCTION':
          return 'text-success';
        case 'LIMIT':
          return 'text-info';
        default:
          return 'text-primary';
      }
    },

    getSettingTypeBadgeClass(type) {
      switch (type) {
        case 'RATE':
          return 'bg-warning';
        case 'DEDUCTION':
          return 'bg-success';
        case 'LIMIT':
          return 'bg-info';
        default:
          return 'bg-secondary';
      }
    },

    // Tax Brackets Helper Methods
    getTaxRateClass(rate) {
      if (rate === 0) return 'text-success';
      if (rate <= 10) return 'text-primary';
      if (rate <= 20) return 'text-warning';
      return 'text-danger';
    },







    // Export Functions
    async exportToExcel() {
      try {
        this.showMessage('Exporting tax settings to Excel...', 'info');

        const params = {
          year: this.selectedYear,
          search: this.searchText
        };

        const response = await taxSettingsService.exportToExcel(params);

        if (response.success) {
          // Create download link
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `tax-settings-${this.selectedYear}.xlsx`);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);

          this.showMessage('Tax settings exported successfully', 'success');
        } else {
          this.showMessage(response.message || 'Export failed', 'error');
        }
      } catch (error) {
        console.error('Error exporting to Excel:', error);
        this.showMessage('Failed to export tax settings', 'error');
      }
    },

    async exportToPDF() {
      try {
        this.showMessage('Exporting tax settings to PDF...', 'info');

        const params = {
          year: this.selectedYear,
          search: this.searchText
        };

        const response = await taxSettingsService.exportToPDF(params);

        if (response.success) {
          // Create download link
          const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `tax-settings-${this.selectedYear}.pdf`);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);

          this.showMessage('Tax settings exported successfully', 'success');
        } else {
          this.showMessage(response.message || 'Export failed', 'error');
        }
      } catch (error) {
        message.destroy();
        console.error('Error exporting to PDF:', error);
        message.error('Failed to export tax settings');
      }
    },

    async exportTaxBracketsToExcel() {
      try {
        this.showMessage('Exporting tax brackets to Excel...', 'info');

        const params = {
          filter_effective_year: this.taxBracketsFilters.effectiveYear || this.selectedYear,
          search: this.taxBracketsSearchText,
          filter_is_active: this.taxBracketsFilters.activeOnly
        };

        const response = await taxBracketsService.exportToExcel(params);

        if (response.success) {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `tax-brackets-${this.selectedYear}.xlsx`);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);

          this.showMessage('Tax brackets exported successfully', 'success');
        } else {
          this.showMessage(response.message || 'Export failed', 'error');
        }
      } catch (error) {
        console.error('Error exporting tax brackets to Excel:', error);
        this.showMessage('Failed to export tax brackets', 'error');
      }
    },

    async exportTaxBracketsToPDF() {
      try {
        this.showMessage('Exporting tax brackets to PDF...', 'info');

        const params = {
          filter_effective_year: this.taxBracketsFilters.effectiveYear || this.selectedYear,
          search: this.taxBracketsSearchText,
          filter_is_active: this.taxBracketsFilters.activeOnly
        };

        const response = await taxBracketsService.exportToPDF(params);

        if (response.success) {
          const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `tax-brackets-${this.selectedYear}.pdf`);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);

          this.showMessage('Tax brackets exported successfully', 'success');
        } else {
          this.showMessage(response.message || 'Export failed', 'error');
        }
      } catch (error) {
        console.error('Error exporting tax brackets to PDF:', error);
        this.showMessage('Failed to export tax brackets', 'error');
      }
    },

    // Set active tab with proper Bootstrap functionality
    setActiveTab(tabKey) {
      this.activeKey = tabKey;

      // Handle tab-specific logic
      if (tabKey === '1') {
        this.fetchTaxSettings();
      } else if (tabKey === '2') {
        this.fetchTaxBrackets();
      } else if (tabKey === '3') {
        this.initializeCalculator();
      }
    },

    // Initialize calculator for tab 3
    initializeCalculator() {
      if (this.activeKey === '3' && this.calculator.monthlySalary === 0) {
        // Set default values or fetch employee data if needed
        this.calculator.calculationYear = this.selectedYear;
      }
    },

    // Toggle header
    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    }
  }
};
</script>

<style scoped>
.avatar {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.badge {
  font-size: 0.75rem;
  padding: 0.375rem 0.75rem;
}

.badge-success {
  background-color: #28a745;
  color: white;
}

.badge-danger {
  background-color: #dc3545;
  color: white;
}

.action-icon a {
  padding: 0.25rem;
  margin: 0 0.125rem;
  border-radius: 0.25rem;
  color: #6c757d;
  transition: all 0.2s;
}

.action-icon a:hover {
  background-color: #f8f9fa;
  color: #495057;
}

.bg-light-primary {
  background-color: rgba(13, 110, 253, 0.1) !important;
}

.bg-light-success {
  background-color: rgba(25, 135, 84, 0.1) !important;
}

.bg-light-warning {
  background-color: rgba(255, 193, 7, 0.1) !important;
}

.bg-light-info {
  background-color: rgba(13, 202, 240, 0.1) !important;
}

/* Tax Calculator Styling */
.tax-results-summary {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 0.5rem;
}

.result-item {
  border-bottom: 1px solid #e9ecef;
}

.result-item:last-child {
  border-bottom: none;
}

.result-highlight {
  border-width: 2px !important;
}

.avatar {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Additional Income/Deduction Items */
.income-deduction-item {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.income-deduction-item:hover {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

/* Tab Style-6 Integration */
.tab-style-6 .nav-link {
  border: 1px solid #dee2e6;
  border-bottom: 0;
  background-color: #f8f9fa;
  color: #6c757d;
  margin-right: 2px;
  transition: all 0.15s ease-in-out;
}

.tab-style-6 .nav-link:hover {
  background-color: #e9ecef;
  border-color: #dee2e6;
  color: #495057;
}

.tab-style-6 .nav-link.active {
  background-color: #fff;
  border-color: #dee2e6 #dee2e6 #fff;
  color: #0d6efd;
  font-weight: 500;
}

.tab-style-6 .nav-link i {
  font-size: 1rem;
}

/* Tab content styling */
#tax-settings-tabContent {
  border: 1px solid #dee2e6;
  border-top: 0;
  background-color: #fff;
}

#tax-settings-tabContent .tab-pane {
  padding: 1.5rem;
}

/* Ensure proper fade transition */
.tab-pane.fade {
  transition: opacity 0.15s linear;
}

.tab-pane.fade:not(.show) {
  opacity: 0;
}

.tab-pane.fade.show {
  opacity: 1;
}

/* Collapse header functionality */
#collapse-header.active i {
  transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transition: transform 0.3s ease;
}

#collapse-header i {
  transition: transform 0.3s ease;
}

/* Backend Pagination Styling */
.pagination-wrapper {
  background-color: #f8f9fa;
  border-top: 1px solid #dee2e6;
  margin-top: 0;
}

.pagination .page-link {
  border: 1px solid #dee2e6;
  color: #6c757d;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.pagination .page-link:hover {
  background-color: #e9ecef;
  border-color: #adb5bd;
  color: #495057;
}

.pagination .page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
  color: white;
}

.pagination .page-item.disabled .page-link {
  color: #6c757d;
  background-color: #fff;
  border-color: #dee2e6;
  cursor: not-allowed;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .nav-tabs .nav-link {
    font-size: 0.9rem;
    padding: 0.75rem 0.5rem;
  }

  .nav-tabs .nav-link i {
    display: none;
  }

  .pagination-wrapper .d-flex {
    flex-direction: column;
    gap: 1rem;
  }

  .pagination-wrapper .pagination {
    justify-content: center;
  }
}
</style>