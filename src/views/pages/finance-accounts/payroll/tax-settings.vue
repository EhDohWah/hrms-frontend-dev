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
      <a-tabs v-model:activeKey="activeKey" type="card" class="mb-4">
        <a-tab-pane key="1">
          <template #tab>
            <i class="ti ti-settings me-2"></i>Tax Settings
          </template>
          <!-- Header Section -->
          <div class="page-header d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 class="page-title mb-0">Tax Settings</h3>
              <p class="text-muted">Manage tax rates, brackets, and deduction settings for payroll</p>
            </div>
            <div class="header-actions">
              <div class="d-flex gap-2">
                <button class="btn btn-outline-primary btn-sm d-flex align-items-center" @click="bulkUpdateTaxSettings"
                  :disabled="selectedTaxSettingKeys.length === 0">
                  <i class="ti ti-edit me-1"></i>Bulk Update ({{ selectedTaxSettingKeys.length }})
                </button>
                <button class="btn btn-primary d-flex align-items-center" @click="openAddTaxSettingModal">
                  <i class="ti ti-circle-plus me-2"></i>Add Tax Setting
                </button>
              </div>
            </div>
          </div>

          <!-- Tax Rate Cards -->
          <div class="row mb-4">
            <div class="col-lg-3 col-md-6">
              <div class="card border-0 bg-light-primary">
                <div class="card-body">
                  <div class="d-flex align-items-center">
                    <div class="flex-shrink-0">
                      <div class="avatar avatar-md bg-primary rounded-circle">
                        <i class="ti ti-percentage text-white"></i>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <h6 class="card-title mb-1">Income Tax</h6>
                      <p class="card-text mb-0 text-muted">{{ taxRates.incomeTax }}%</p>
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
                        <i class="ti ti-shield text-white"></i>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <h6 class="card-title mb-1">Social Security</h6>
                      <p class="card-text mb-0 text-muted">{{ taxRates.socialSecurity }}%</p>
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
                        <i class="ti ti-coins text-white"></i>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <h6 class="card-title mb-1">Provident Fund</h6>
                      <p class="card-text mb-0 text-muted">{{ taxRates.providentFund }}%</p>
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
                        <i class="ti ti-building text-white"></i>
                      </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                      <h6 class="card-title mb-1">Corporate Tax</h6>
                      <p class="card-text mb-0 text-muted">{{ taxRates.corporateTax }}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tax Settings Table -->
          <div class="row">
            <div class="col-sm-12">
              <div class="card">
                <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                  <div class="d-flex align-items-center">
                    <h5 class="mb-0 me-3">Tax Configuration</h5>
                    <div class="d-flex align-items-center text-muted small">
                      <span class="me-2">Total: {{ totalTaxSettings }}</span>
                      <span class="me-2">|</span>
                      <span class="me-2">Active: {{ activeTaxSettings }}</span>
                      <span class="me-2">|</span>
                      <span>Year: {{ selectedYear }}</span>
                    </div>
                  </div>
                  <div class="d-flex align-items-center flex-wrap row-gap-2">
                    <div class="dropdown me-2">
                      <a href="javascript:void(0);" class="btn btn-white border btn-sm d-inline-flex align-items-center"
                        data-bs-toggle="dropdown">
                        <i class="ti ti-file-export me-1"></i>Export
                      </a>
                      <ul class="dropdown-menu dropdown-menu-end p-3">
                        <li>
                          <a href="javascript:void(0);" class="dropdown-item rounded-1" @click="exportToExcel">
                            <i class="ti ti-file-type-xls me-1"></i>Export as Excel
                          </a>
                        </li>
                        <li>
                          <a href="javascript:void(0);" class="dropdown-item rounded-1" @click="exportToPDF">
                            <i class="ti ti-file-type-pdf me-1"></i>Export as PDF
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div class="input-icon-end position-relative">
                      <a-input v-model:value="searchText" placeholder="Search tax settings..." @input="handleSearch"
                        style="width: 250px;" allow-clear>
                        <template #suffix>
                          <i class="ti ti-search"></i>
                        </template>
                      </a-input>
                    </div>
                  </div>
                </div>
                <div class="card-body p-0">
                  <a-table :columns="taxSettingsColumns" :data-source="filteredTaxSettings"
                    :pagination="taxSettingsPagination" :loading="taxSettingsLoading" row-key="id"
                    :row-selection="taxSettingsRowSelection" size="middle" @change="handleTaxSettingsTableChange"
                    :scroll="{ x: 1200 }">
                    <!-- Setting Key column -->
                    <template #bodyCell="{ column, record }">
                      <template v-if="column.key === 'setting_key'">
                        <div>
                          <strong class="text-primary">{{ getSettingKeyLabel(record.setting_key) }}</strong>
                          <br>
                          <small class="text-muted">{{ record.setting_key }}</small>
                        </div>
                      </template>

                      <!-- Setting Value column -->
                      <template v-if="column.key === 'setting_value'">
                        <span class="fw-semibold" :class="getSettingValueClass(record.setting_type)">
                          {{ formatSettingValue(record.setting_value, record.setting_type) }}
                        </span>
                      </template>

                      <!-- Setting Type column -->
                      <template v-if="column.key === 'setting_type'">
                        <span class="badge" :class="getSettingTypeBadgeClass(record.setting_type)">
                          {{ getSettingTypeLabel(record.setting_type) }}
                        </span>
                      </template>

                      <!-- Status column -->
                      <template v-if="column.key === 'is_active'">
                        <span :class="['badge', record.is_active ? 'badge-success' : 'badge-secondary']">
                          {{ record.is_active ? 'Active' : 'Inactive' }}
                        </span>
                      </template>

                      <!-- Effective Year column -->
                      <template v-if="column.key === 'effective_year'">
                        <span class="badge"
                          :class="record.effective_year === selectedYear ? 'badge-primary' : 'badge-outline-secondary'">
                          {{ record.effective_year }}
                        </span>
                      </template>

                      <!-- Created At column -->
                      <template v-if="column.key === 'created_at'">
                        <div>
                          <div class="small">{{ formatDate(record.created_at) }}</div>
                          <div class="text-muted small">{{ formatTime(record.created_at) }}</div>
                        </div>
                      </template>

                      <!-- Action column -->
                      <template v-if="column.key === 'action'">
                        <div class="action-icon d-inline-flex">
                          <a-tooltip title="Edit Tax Setting">
                            <a href="javascript:void(0);" class="me-2" @click="editTaxSetting(record)">
                              <i class="ti ti-edit"></i>
                            </a>
                          </a-tooltip>
                          <a-tooltip title="Delete Tax Setting">
                            <a href="javascript:void(0);" @click="confirmDeleteTaxSetting(record.id)"
                              class="text-danger">
                              <i class="ti ti-trash"></i>
                            </a>
                          </a-tooltip>
                        </div>
                      </template>
                    </template>
                  </a-table>
                </div>
              </div>
            </div>
          </div>
        </a-tab-pane>

        <!-- Tax Brackets Tab -->
        <a-tab-pane key="2">
          <template #tab>
            <i class="ti ti-list me-2"></i>Tax Brackets
          </template>
          <div class="page-header d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 class="page-title mb-0">Tax Brackets</h3>
              <p class="text-muted">Configure income tax brackets and progressive tax rates for {{ selectedYear }}</p>
            </div>
            <div class="header-actions">
              <button class="btn btn-primary d-flex align-items-center" @click="openAddTaxBracketModal">
                <i class="ti ti-circle-plus me-2"></i>Add Tax Bracket
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

          <!-- Tax Brackets Table -->
          <div class="row">
            <div class="col-sm-12">
              <div class="card">
                <div class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                  <div class="d-flex align-items-center">
                    <h5 class="mb-0 me-3">Progressive Tax Brackets</h5>
                    <div class="d-flex align-items-center text-muted small">
                      <span class="me-2">Year: {{ selectedYear }}</span>
                    </div>
                  </div>
                  <div class="d-flex align-items-center flex-wrap row-gap-2">
                    <div class="dropdown me-2">
                      <a href="javascript:void(0);" class="btn btn-white border btn-sm d-inline-flex align-items-center"
                        data-bs-toggle="dropdown">
                        <i class="ti ti-file-export me-1"></i>Export
                      </a>
                      <ul class="dropdown-menu dropdown-menu-end p-3">
                        <li>
                          <a href="javascript:void(0);" class="dropdown-item rounded-1"
                            @click="exportTaxBracketsToExcel">
                            <i class="ti ti-file-type-xls me-1"></i>Export as Excel
                          </a>
                        </li>
                        <li>
                          <a href="javascript:void(0);" class="dropdown-item rounded-1" @click="exportTaxBracketsToPDF">
                            <i class="ti ti-file-type-pdf me-1"></i>Export as PDF
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div class="input-icon-end position-relative">
                      <a-input v-model:value="taxBracketsSearchText" placeholder="Search tax brackets..."
                        @input="handleTaxBracketsSearch" style="width: 250px;" allow-clear>
                        <template #suffix>
                          <i class="ti ti-search"></i>
                        </template>
                      </a-input>
                    </div>
                  </div>
                </div>
                <div class="card-body p-0">
                  <a-table :columns="taxBracketsColumns" :data-source="filteredTaxBrackets"
                    :pagination="taxBracketsPagination" :loading="taxBracketsLoading" row-key="id" size="middle"
                    @change="handleTaxBracketsTableChange" :scroll="{ x: 800 }">
                    <!-- Bracket Order column -->
                    <template #bodyCell="{ column, record }">
                      <template v-if="column.key === 'bracket_order'">
                        <div class="text-center">
                          <span class="badge badge-primary">{{ record.bracket_order }}</span>
                        </div>
                      </template>

                      <!-- Income Range column -->
                      <template v-if="column.key === 'income_range'">
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
                      </template>

                      <!-- Tax Rate column -->
                      <template v-if="column.key === 'tax_rate'">
                        <span class="fw-semibold" :class="getTaxRateClass(record.tax_rate)">
                          {{ record.tax_rate }}%
                        </span>
                      </template>

                      <!-- Status column -->
                      <template v-if="column.key === 'is_active'">
                        <span :class="['badge', record.is_active ? 'badge-success' : 'badge-secondary']">
                          {{ record.is_active ? 'Active' : 'Inactive' }}
                        </span>
                      </template>

                      <!-- Action column -->
                      <template v-if="column.key === 'action'">
                        <div class="action-icon d-inline-flex">
                          <a-tooltip title="Edit Tax Bracket">
                            <a href="javascript:void(0);" class="me-2" @click="editTaxBracket(record)">
                              <i class="ti ti-edit"></i>
                            </a>
                          </a-tooltip>
                          <a-tooltip title="Delete Tax Bracket">
                            <a href="javascript:void(0);" @click="confirmDeleteTaxBracket(record.id)"
                              class="text-danger">
                              <i class="ti ti-trash"></i>
                            </a>
                          </a-tooltip>
                        </div>
                      </template>
                    </template>
                  </a-table>
                </div>
              </div>
            </div>
          </div>
        </a-tab-pane>

        <!-- Tax Calculator Tab -->
        <a-tab-pane key="3">
          <template #tab>
            <i class="ti ti-calculator me-2"></i>Tax Calculator
          </template>
          <div class="page-header d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 class="page-title mb-0">Tax Calculator</h3>
              <p class="text-muted">Calculate income tax, social security, and other deductions for {{ selectedYear }}
              </p>
            </div>
            <div class="header-actions">
              <div class="d-flex align-items-center">
                <button class="btn btn-outline-primary btn-sm me-2" @click="saveCalculation"
                  :disabled="!hasCalculationResults">
                  <i class="ti ti-device-floppy me-1"></i>Save Calculation
                </button>
                <button class="btn btn-outline-secondary btn-sm me-2" @click="printCalculation"
                  :disabled="!hasCalculationResults">
                  <i class="ti ti-printer me-1"></i>Print
                </button>
                <button class="btn btn-outline-info btn-sm" @click="resetCalculator">
                  <i class="ti ti-refresh me-1"></i>Reset
                </button>
              </div>
            </div>
          </div>

          <!-- Tax Calculator Content -->
          <div class="row">
            <div class="col-lg-8">
              <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <h5 class="mb-0">Employee Tax Calculator</h5>
                  <div class="d-flex align-items-center">
                    <label class="form-label me-2 mb-0 small">Calculation Year:</label>
                    <select class="form-select form-select-sm" v-model="calculator.calculationYear"
                      @change="calculateTaxRealTime" style="width: 100px;">
                      <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
                    </select>
                  </div>
                </div>
                <div class="card-body">
                  <form @submit.prevent="calculateTax">
                    <div class="row mb-3">
                      <div class="col-md-6">
                        <label class="form-label">Monthly Salary <span class="text-danger">*</span></label>
                        <div class="input-group">
                          <span class="input-group-text">฿</span>
                          <input type="number" class="form-control" v-model="calculator.monthlySalary"
                            placeholder="Enter monthly salary" @input="calculateTaxRealTime" step="0.01" min="0">
                        </div>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">Annual Salary</label>
                        <div class="input-group">
                          <span class="input-group-text">฿</span>
                          <input type="number" class="form-control" v-model="calculator.annualSalary"
                            placeholder="Auto-calculated" readonly>
                        </div>
                      </div>
                    </div>

                    <div class="row mb-3">
                      <div class="col-md-6">
                        <label class="form-label">Allowances</label>
                        <div class="input-group">
                          <span class="input-group-text">฿</span>
                          <input type="number" class="form-control" v-model="calculator.allowances" placeholder="0"
                            @input="calculateTaxRealTime" step="0.01" min="0">
                        </div>
                        <div class="form-text">
                          <small>Housing, transportation, and other allowances</small>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">Other Income</label>
                        <div class="input-group">
                          <span class="input-group-text">฿</span>
                          <input type="number" class="form-control" v-model="calculator.otherIncome" placeholder="0"
                            @input="calculateTaxRealTime" step="0.01" min="0">
                        </div>
                        <div class="form-text">
                          <small>Bonuses, commissions, and other income</small>
                        </div>
                      </div>
                    </div>

                    <div class="row mb-4">
                      <div class="col-md-6">
                        <label class="form-label">Additional Deductions</label>
                        <div class="input-group">
                          <span class="input-group-text">฿</span>
                          <input type="number" class="form-control" v-model="calculator.deductions" placeholder="0"
                            @input="calculateTaxRealTime" step="0.01" min="0">
                        </div>
                        <div class="form-text">
                          <small>Insurance, donations, and other deductible expenses</small>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">Dependents</label>
                        <input type="number" class="form-control" v-model="calculator.dependents" placeholder="0"
                          @input="calculateTaxRealTime" min="0" max="10">
                        <div class="form-text">
                          <small>Number of dependent children or family members</small>
                        </div>
                      </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center">
                      <button type="submit" class="btn btn-primary" :disabled="calculatorLoading">
                        <span v-if="calculatorLoading" class="spinner-border spinner-border-sm me-2"
                          role="status"></span>
                        <i v-else class="ti ti-calculator me-2"></i>Calculate Tax
                      </button>
                      <div class="text-muted small">
                        <i class="ti ti-info-circle me-1"></i>Calculation updates automatically as you type
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div class="col-lg-4">
              <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <h5 class="mb-0">Tax Calculation Results</h5>
                  <div v-if="hasCalculationResults" class="text-success small">
                    <i class="ti ti-check-circle me-1"></i>Calculated
                  </div>
                </div>
                <div class="card-body">
                  <div class="tax-summary">
                    <!-- Gross Income -->
                    <div class="summary-item d-flex justify-content-between mb-3">
                      <span class="d-flex align-items-center">
                        <i class="ti ti-coins me-2 text-primary"></i>Gross Income:
                      </span>
                      <strong class="text-primary">{{ formatCurrency(calculator.grossIncome) }}</strong>
                    </div>

                    <!-- Personal Deductions -->
                    <div class="summary-item d-flex justify-content-between mb-2">
                      <span class="small text-muted">Personal Allowance:</span>
                      <span class="small text-muted">{{ formatCurrency(calculator.personalDeductions) }}</span>
                    </div>

                    <!-- Taxable Income -->
                    <div class="summary-item d-flex justify-content-between mb-3 p-2 bg-light rounded">
                      <span class="fw-semibold">Taxable Income:</span>
                      <strong class="text-info">{{ formatCurrency(calculator.taxableIncome) }}</strong>
                    </div>

                    <hr>

                    <!-- Tax Breakdown -->
                    <div class="summary-item d-flex justify-content-between mb-2">
                      <span class="d-flex align-items-center">
                        <i class="ti ti-receipt-tax me-2 text-danger"></i>Income Tax:
                      </span>
                      <strong class="text-danger">{{ formatCurrency(calculator.incomeTax) }}</strong>
                    </div>
                    <div class="summary-item d-flex justify-content-between mb-2">
                      <span class="d-flex align-items-center">
                        <i class="ti ti-shield me-2 text-warning"></i>Social Security:
                      </span>
                      <strong class="text-warning">{{ formatCurrency(calculator.socialSecurity) }}</strong>
                    </div>
                    <div class="summary-item d-flex justify-content-between mb-3">
                      <span class="d-flex align-items-center">
                        <i class="ti ti-piggy-bank me-2 text-success"></i>Provident Fund:
                      </span>
                      <strong class="text-success">{{ formatCurrency(calculator.providentFund) }}</strong>
                    </div>

                    <hr>

                    <!-- Net Income -->
                    <div class="summary-item d-flex justify-content-between mb-3 p-3 bg-success bg-opacity-10 rounded">
                      <span class="fw-bold text-success">Net Income:</span>
                      <strong class="text-success fs-5">{{ formatCurrency(calculator.netIncome) }}</strong>
                    </div>

                    <!-- Tax Rates -->
                    <div class="row text-center">
                      <div class="col-6">
                        <div class="small text-muted">Effective Rate</div>
                        <div class="fw-semibold text-primary">{{ calculator.effectiveTaxRate }}%</div>
                      </div>
                      <div class="col-6">
                        <div class="small text-muted">Marginal Rate</div>
                        <div class="fw-semibold text-warning">{{ calculator.marginalTaxRate }}%</div>
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
        </a-tab-pane>
      </a-tabs>
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
import { Modal, message } from 'ant-design-vue';
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

      // Search
      searchText: '',
      taxBracketsSearchText: '',

      // Debounced search functions
      debouncedTaxSettingsSearch: null,
      debouncedTaxBracketsSearch: null,
      debouncedCalculation: null,

      // Tax Calculator data
      calculator: {
        monthlySalary: 0,
        annualSalary: 0,
        allowances: 0,
        otherIncome: 0,
        deductions: 0,
        dependents: 0,
        calculationYear: new Date().getFullYear(),
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

      // Tax Settings Table configuration
      selectedTaxSettingKeys: [],
      taxSettingsCurrentPage: 1,
      taxSettingsPageSize: 10,
      taxSettingsPagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        pageSizeOptions: ['10', '20', '50', '100'],
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
      },

      // Tax Brackets Table configuration
      taxBracketsCurrentPage: 1,
      taxBracketsPageSize: 10,
      taxBracketsPagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        pageSizeOptions: ['10', '20', '50', '100'],
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
      },

      // Tax Settings Table columns
      taxSettingsColumns: [
        {
          title: 'Setting Key',
          dataIndex: 'setting_key',
          key: 'setting_key',
          sorter: true,
          width: 200,
          fixed: 'left'
        },
        {
          title: 'Value',
          dataIndex: 'setting_value',
          key: 'setting_value',
          sorter: true,
          width: 130,
          align: 'right'
        },
        {
          title: 'Type',
          dataIndex: 'setting_type',
          key: 'setting_type',
          width: 100,
          filters: [
            { text: 'Deduction', value: 'DEDUCTION' },
            { text: 'Rate', value: 'RATE' },
            { text: 'Limit', value: 'LIMIT' }
          ]
        },
        {
          title: 'Effective Year',
          dataIndex: 'effective_year',
          key: 'effective_year',
          sorter: true,
          width: 120,
          align: 'center'
        },
        {
          title: 'Status',
          dataIndex: 'is_active',
          key: 'is_active',
          width: 100,
          filters: [
            { text: 'Active', value: true },
            { text: 'Inactive', value: false }
          ]
        },
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
          ellipsis: true,
          width: 200
        },
        {
          title: 'Created',
          dataIndex: 'created_at',
          key: 'created_at',
          sorter: true,
          width: 120
        },
        {
          title: 'Action',
          key: 'action',
          width: 100,
          fixed: 'right'
        }
      ],

      // Tax Brackets Table columns
      taxBracketsColumns: [
        {
          title: 'Order',
          dataIndex: 'bracket_order',
          key: 'bracket_order',
          sorter: true,
          width: 80,
          align: 'center'
        },
        {
          title: 'Income Range',
          key: 'income_range',
          width: 250
        },
        {
          title: 'Tax Rate (%)',
          dataIndex: 'tax_rate',
          key: 'tax_rate',
          sorter: true,
          width: 120,
          align: 'right'
        },
        {
          title: 'Status',
          dataIndex: 'is_active',
          key: 'is_active',
          width: 100,
          filters: [
            { text: 'Active', value: true },
            { text: 'Inactive', value: false }
          ]
        },
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
          ellipsis: true
        },
        {
          title: 'Action',
          key: 'action',
          width: 100,
          fixed: 'right'
        }
      ]
    };
  },

  created() {
    // Initialize debounced functions
    this.debouncedTaxSettingsSearch = debounce(this.performTaxSettingsSearch, 300);
    this.debouncedTaxBracketsSearch = debounce(this.performTaxBracketsSearch, 300);
    this.debouncedCalculation = debounce(this.performTaxCalculation, 500);
  },

  computed: {
    // Tax Settings Row selection configuration
    taxSettingsRowSelection() {
      return {
        selectedRowKeys: this.selectedTaxSettingKeys,
        onChange: this.onTaxSettingsSelectChange,
        getCheckboxProps: (record) => ({
          disabled: false,
          name: record.id,
        }),
      };
    },

    // Filtered tax settings based on search
    filteredTaxSettings() {
      if (!Array.isArray(this.taxSettings)) return [];

      if (!this.searchText) {
        return this.taxSettings;
      }

      return this.taxSettings.filter(setting =>
        this.getSettingKeyLabel(setting.setting_key).toLowerCase().includes(this.searchText.toLowerCase()) ||
        setting.setting_key.toLowerCase().includes(this.searchText.toLowerCase()) ||
        setting.description?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        setting.setting_type.toLowerCase().includes(this.searchText.toLowerCase())
      );
    },

    // Filtered tax brackets based on search
    filteredTaxBrackets() {
      if (!Array.isArray(this.taxBrackets)) return [];

      if (!this.taxBracketsSearchText) {
        return this.taxBrackets;
      }

      return this.taxBrackets.filter(bracket =>
        bracket.description?.toLowerCase().includes(this.taxBracketsSearchText.toLowerCase()) ||
        bracket.bracket_order.toString().includes(this.taxBracketsSearchText.toLowerCase())
      );
    },

    // Summary calculations
    totalTaxSettings() {
      return this.taxSettings?.length || 0;
    },

    activeTaxSettings() {
      return this.taxSettings?.filter(setting => setting.is_active)?.length || 0;
    },

    totalTaxBrackets() {
      return this.taxBrackets?.length || 0;
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
          message.warning('Unable to fetch tax data. Some features may not work properly.');
        }

        this.initializeCalculator();
      } catch (error) {
        console.error('Error initializing data:', error);
        message.error('Failed to load tax data');
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
          description: 'Personal allowance for tax calculation',
          effective_year: 2025,
          is_active: true,
          created_at: '2025-01-01T00:00:00Z'
        },
        {
          id: 2,
          setting_key: 'SSF_RATE',
          setting_value: 5.0,
          setting_type: 'RATE',
          description: 'Social Security Fund contribution rate',
          effective_year: 2025,
          is_active: true,
          created_at: '2025-01-01T00:00:00Z'
        },
        {
          id: 3,
          setting_key: 'PF_MIN_RATE',
          setting_value: 3.0,
          setting_type: 'RATE',
          description: 'Provident Fund minimum contribution rate',
          effective_year: 2025,
          is_active: true,
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

    // Tax Settings API Methods
    async fetchTaxSettings() {
      this.taxSettingsLoading = true;
      try {
        const response = await taxSettingsService.getTaxSettingsByYear(this.selectedYear);
        if (response.success) {
          // Ensure we always have an array, even if API returns unexpected data structure
          let data = response.data;
          if (data && typeof data === 'object' && data.data) {
            data = data.data;
          }

          // Transform nested structure to flat array
          if (data && typeof data === 'object' && !Array.isArray(data)) {
            console.log('Transforming nested tax settings data:', data);
            const transformedData = this.transformTaxSettingsData(data, this.selectedYear);
            console.log('Transformed tax settings data:', transformedData);
            this.rawTaxSettings = transformedData;
            this.taxSettings = transformedData;
          } else if (Array.isArray(data)) {
            this.rawTaxSettings = data;
            this.taxSettings = data;
          } else {
            console.warn('API returned unexpected data structure for tax settings:', data);
            this.rawTaxSettings = [];
            this.taxSettings = [];
          }

          this.taxSettingsPagination.total = this.taxSettings.length;
          this.updateTaxRatesSummary();
        } else {
          message.error(response.message || 'Failed to fetch tax settings');
          this.rawTaxSettings = [];
          this.taxSettings = [];
        }
      } catch (error) {
        console.error('Error fetching tax settings:', error);
        message.warning('Using fallback tax settings data');
        // Use fallback data for development/testing
        this.rawTaxSettings = this.getFallbackTaxSettings();
        this.taxSettings = this.rawTaxSettings;
        this.taxSettingsPagination.total = this.taxSettings.length;
        this.updateTaxRatesSummary();
      } finally {
        this.taxSettingsLoading = false;
      }
    },

    /**
     * Transform nested tax settings data to flat array format
     * @param {Object} nestedData - Nested data from API
     * @param {number} year - The year for the settings
     * @returns {Array} Transformed flat array
     */
    transformTaxSettingsData(nestedData, year) {
      console.log('Starting transformation with data:', nestedData, 'and year:', year);
      const transformed = [];

      // Process DEDUCTION category
      if (nestedData.DEDUCTION) {
        console.log('Processing DEDUCTION category:', nestedData.DEDUCTION);
        Object.entries(nestedData.DEDUCTION).forEach(([key, value]) => {
          const item = {
            id: `deduction_${key}`,
            setting_key: key,
            setting_value: value,
            setting_type: 'DEDUCTION',
            effective_year: year,
            is_active: true,
            description: this.getSettingKeyDescription(key),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          transformed.push(item);
          console.log('Added DEDUCTION item:', item);
        });
      }

      // Process RATE category
      if (nestedData.RATE) {
        console.log('Processing RATE category:', nestedData.RATE);
        Object.entries(nestedData.RATE).forEach(([key, value]) => {
          const item = {
            id: `rate_${key}`,
            setting_key: key,
            setting_value: value,
            setting_type: 'RATE',
            effective_year: year,
            is_active: true,
            description: this.getSettingKeyDescription(key),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          transformed.push(item);
          console.log('Added RATE item:', item);
        });
      }

      // Process LIMIT category
      if (nestedData.LIMIT) {
        console.log('Processing LIMIT category:', nestedData.LIMIT);
        Object.entries(nestedData.LIMIT).forEach(([key, value]) => {
          const item = {
            id: `limit_${key}`,
            setting_key: key,
            setting_value: value,
            setting_type: 'LIMIT',
            effective_year: year,
            is_active: true,
            description: this.getSettingKeyDescription(key),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          transformed.push(item);
          console.log('Added LIMIT item:', item);
        });
      }

      console.log('Final transformed array:', transformed);
      return transformed;
    },

    async fetchTaxBrackets() {
      this.taxBracketsLoading = true;
      try {
        const response = await taxBracketsService.getTaxBracketsByYear(this.selectedYear);
        if (response.success) {
          // Ensure we always have an array, even if API returns unexpected data structure
          let data = response.data;
          if (data && typeof data === 'object' && data.data) {
            data = data.data;
          }

          // Ensure it's an array
          if (Array.isArray(data)) {
            this.rawTaxBrackets = data;
            this.taxBrackets = data.sort((a, b) => a.bracket_order - b.bracket_order);
          } else {
            console.warn('API returned non-array data for tax brackets:', data);
            this.rawTaxBrackets = [];
            this.taxBrackets = [];
          }

          this.taxBracketsPagination.total = this.taxBrackets.length;
        } else {
          message.error(response.message || 'Failed to fetch tax brackets');
          this.rawTaxBrackets = [];
          this.taxBrackets = [];
        }
      } catch (error) {
        console.error('Error fetching tax brackets:', error);
        message.warning('Using fallback tax brackets data');
        // Use fallback data for development/testing
        this.rawTaxBrackets = this.getFallbackTaxBrackets();
        this.taxBrackets = this.rawTaxBrackets.sort((a, b) => a.bracket_order - b.bracket_order);
        this.taxBracketsPagination.total = this.taxBrackets.length;
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

      const setting = this.taxSettings.find(s => s.setting_key === key && s.is_active);
      return setting ? parseFloat(setting.setting_value) : defaultValue;
    },

    // Tax Calculator Methods
    async calculateTax() {
      if (!this.calculator.monthlySalary || this.calculator.monthlySalary <= 0) {
        message.warning('Please enter a valid monthly salary');
        return;
      }

      this.calculatorLoading = true;
      try {
        const calculationData = {
          monthly_salary: parseFloat(this.calculator.monthlySalary) || 0,
          annual_salary: parseFloat(this.calculator.annualSalary) || 0,
          allowances: parseFloat(this.calculator.allowances) || 0,
          other_income: parseFloat(this.calculator.otherIncome) || 0,
          deductions: parseFloat(this.calculator.deductions) || 0,
          dependents: parseInt(this.calculator.dependents) || 0,
          calculation_year: this.calculator.calculationYear
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
        this.calculateTaxClientSide({
          monthly_salary: parseFloat(this.calculator.monthlySalary) || 0,
          annual_salary: parseFloat(this.calculator.annualSalary) || 0,
          allowances: parseFloat(this.calculator.allowances) || 0,
          other_income: parseFloat(this.calculator.otherIncome) || 0,
          deductions: parseFloat(this.calculator.deductions) || 0,
          dependents: parseInt(this.calculator.dependents) || 0
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
        message.error('Error calculating taxes');
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
        monthlySalary: 0,
        annualSalary: 0,
        allowances: 0,
        otherIncome: 0,
        deductions: 0,
        dependents: 0,
        calculationYear: this.selectedYear,
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

    async saveCalculation() {
      if (!this.hasCalculationResults) {
        message.warning('No calculation results to save');
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
          message.success('Tax calculation saved successfully');
        } else {
          message.error(response.message || 'Failed to save calculation');
        }
      } catch (error) {
        console.error('Error saving calculation:', error);
        message.error('Failed to save calculation');
      }
    },

    printCalculation() {
      if (!this.hasCalculationResults) {
        message.warning('No calculation results to print');
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
          message.success(response.message);
          await this.fetchTaxSettings();
          this.editingTaxSetting = null;
        } else {
          message.error(response.message || 'Operation failed');
        }
      } catch (error) {
        console.error('Error submitting tax setting:', error);
        message.error('Failed to save tax setting');
      }
    },

    handleTaxSettingCancel() {
      this.editingTaxSetting = null;
    },

    confirmDeleteTaxSetting(id) {
      Modal.confirm({
        title: 'Delete Tax Setting',
        content: 'Are you sure you want to delete this tax setting? This action cannot be undone.',
        okText: 'Yes, Delete',
        cancelText: 'Cancel',
        okType: 'danger',
        onOk: () => this.deleteTaxSetting(id)
      });
    },

    async deleteTaxSetting(id) {
      try {
        const response = await taxSettingsService.deleteTaxSetting(id);

        if (response.success) {
          message.success(response.message);
          await this.fetchTaxSettings();
          // Remove from selected keys if it was selected
          this.selectedTaxSettingKeys = this.selectedTaxSettingKeys.filter(key => key !== id);
        } else {
          message.error(response.message || 'Failed to delete tax setting');
        }
      } catch (error) {
        console.error('Error deleting tax setting:', error);
        message.error('Failed to delete tax setting');
      }
    },

    async bulkUpdateTaxSettings() {
      if (this.selectedTaxSettingKeys.length === 0) {
        message.warning('Please select tax settings to update');
        return;
      }

      // This would open a bulk update modal or perform bulk operations
      message.info('Bulk update functionality to be implemented');
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
          message.success(response.message);
          await this.fetchTaxBrackets();
          this.editingTaxBracket = null;
        } else {
          message.error(response.message || 'Operation failed');
        }
      } catch (error) {
        console.error('Error submitting tax bracket:', error);
        message.error('Failed to save tax bracket');
      }
    },

    handleTaxBracketCancel() {
      this.editingTaxBracket = null;
    },

    confirmDeleteTaxBracket(id) {
      Modal.confirm({
        title: 'Delete Tax Bracket',
        content: 'Are you sure you want to delete this tax bracket? This action cannot be undone.',
        okText: 'Yes, Delete',
        cancelText: 'Cancel',
        okType: 'danger',
        onOk: () => this.deleteTaxBracket(id)
      });
    },

    async deleteTaxBracket(id) {
      try {
        const response = await taxBracketsService.deleteTaxBracket(id);

        if (response.success) {
          message.success(response.message);
          await this.fetchTaxBrackets();
        } else {
          message.error(response.message || 'Failed to delete tax bracket');
        }
      } catch (error) {
        console.error('Error deleting tax bracket:', error);
        message.error('Failed to delete tax bracket');
      }
    },

    // Search Methods
    handleSearch() {
      if (this.debouncedTaxSettingsSearch) {
        this.debouncedTaxSettingsSearch();
      }
    },

    performTaxSettingsSearch() {
      // Search is handled by computed property filteredTaxSettings
      // This method can be extended for server-side search
    },

    handleTaxBracketsSearch() {
      if (this.debouncedTaxBracketsSearch) {
        this.debouncedTaxBracketsSearch();
      }
    },

    performTaxBracketsSearch() {
      // Search is handled by computed property filteredTaxBrackets
      // This method can be extended for server-side search
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
        'PERSONAL_ALLOWANCE': 'Personal allowance for tax calculation',
        'SPOUSE_ALLOWANCE': 'Allowance for spouse',
        'CHILD_ALLOWANCE': 'Allowance per child',
        'DISABILITY_ALLOWANCE': 'Allowance for disability',
        'EDUCATION_ALLOWANCE': 'Allowance for education expenses',

        // RATE category
        'PERSONAL_EXPENSE_RATE': 'Rate for personal expenses deduction',
        'SSF_RATE': 'Social Security Fund contribution rate',
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
          return 'badge-warning';
        case 'DEDUCTION':
          return 'badge-success';
        case 'LIMIT':
          return 'badge-info';
        default:
          return 'badge-secondary';
      }
    },

    // Tax Brackets Helper Methods
    getTaxRateClass(rate) {
      if (rate === 0) return 'text-success';
      if (rate <= 10) return 'text-primary';
      if (rate <= 20) return 'text-warning';
      return 'text-danger';
    },

    // Table Event Handlers
    handleTaxSettingsTableChange(pagination) {
      this.taxSettingsCurrentPage = pagination.current;
      this.taxSettingsPageSize = pagination.pageSize;
      this.taxSettingsPagination.current = pagination.current;
      this.taxSettingsPagination.pageSize = pagination.pageSize;

      // Handle sorting and filtering here if needed for server-side operations
    },

    handleTaxBracketsTableChange(pagination) {
      this.taxBracketsCurrentPage = pagination.current;
      this.taxBracketsPageSize = pagination.pageSize;
      this.taxBracketsPagination.current = pagination.current;
      this.taxBracketsPagination.pageSize = pagination.pageSize;

      // Handle sorting and filtering here if needed for server-side operations
    },

    // Row Selection Handlers
    onTaxSettingsSelectChange(selectedRowKeys) {
      this.selectedTaxSettingKeys = selectedRowKeys;
    },

    // Export Functions
    async exportToExcel() {
      try {
        message.loading('Exporting tax settings to Excel...', 0);

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

          message.destroy();
          message.success('Tax settings exported successfully');
        } else {
          message.destroy();
          message.error(response.message || 'Export failed');
        }
      } catch (error) {
        message.destroy();
        console.error('Error exporting to Excel:', error);
        message.error('Failed to export tax settings');
      }
    },

    async exportToPDF() {
      try {
        message.loading('Exporting tax settings to PDF...', 0);

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

          message.destroy();
          message.success('Tax settings exported successfully');
        } else {
          message.destroy();
          message.error(response.message || 'Export failed');
        }
      } catch (error) {
        message.destroy();
        console.error('Error exporting to PDF:', error);
        message.error('Failed to export tax settings');
      }
    },

    async exportTaxBracketsToExcel() {
      try {
        message.loading('Exporting tax brackets to Excel...', 0);

        const params = {
          year: this.selectedYear,
          search: this.taxBracketsSearchText
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

          message.destroy();
          message.success('Tax brackets exported successfully');
        } else {
          message.destroy();
          message.error(response.message || 'Export failed');
        }
      } catch (error) {
        message.destroy();
        console.error('Error exporting tax brackets to Excel:', error);
        message.error('Failed to export tax brackets');
      }
    },

    async exportTaxBracketsToPDF() {
      try {
        message.loading('Exporting tax brackets to PDF...', 0);

        const params = {
          year: this.selectedYear,
          search: this.taxBracketsSearchText
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

          message.destroy();
          message.success('Tax brackets exported successfully');
        } else {
          message.destroy();
          message.error(response.message || 'Export failed');
        }
      } catch (error) {
        message.destroy();
        console.error('Error exporting tax brackets to PDF:', error);
        message.error('Failed to export tax brackets');
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
.tax-summary {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 0.5rem;
}

.summary-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
}

.summary-item:last-child {
  border-bottom: none;
  padding-top: 1rem;
}

/* Ant Design Tabs Custom Styling */
.ant-tabs-card>.ant-tabs-nav .ant-tabs-tab {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-bottom: none;
  color: #6c757d;
}

.ant-tabs-card>.ant-tabs-nav .ant-tabs-tab-active {
  background: #fff;
  color: #0d6efd;
  border-color: #0d6efd;
}

.ant-tabs-card>.ant-tabs-nav .ant-tabs-tab:hover {
  color: #495057;
}

.ant-tabs-card .ant-tabs-content-holder {
  border: 1px solid #dee2e6;
  border-top: none;
  background: #fff;
}

.ant-tabs-card .ant-tabs-content {
  padding: 1.5rem;
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .nav-tabs .nav-link {
    font-size: 0.9rem;
    padding: 0.75rem 0.5rem;
  }

  .nav-tabs .nav-link i {
    display: none;
  }
}
</style>