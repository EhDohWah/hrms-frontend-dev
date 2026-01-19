<template>
  <layout-header></layout-header>
  <layout-sidebar></layout-sidebar>
  <!-- Page Wrapper -->
  <div class="page-wrapper">
    <div class="content">
      <!-- Breadcrumb -->
      <div
        class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3"
      >
        <div class="my-auto mb-2">
          <h2 class="mb-1">Pricing</h2>
          <nav>
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item">
                <router-link to="/dashboard/"
                  ><i class="ti ti-smart-home"></i
                ></router-link>
              </li>
              <li class="breadcrumb-item">Pages</li>
              <li class="breadcrumb-item active" aria-current="page">Pricing</li>
            </ol>
          </nav>
        </div>
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div class="me-2 mb-2">
            <div class="dropdown">
              <a
                href="javascript:void(0);"
                class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                <i class="ti ti-file-export me-1"></i>Export
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    ><i class="ti ti-file-type-pdf me-1"></i>Export as PDF</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    ><i class="ti ti-file-type-xls me-1"></i>Export as Excel
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="mb-2">
            <a
              href="javascript:void(0);"
              class="btn btn-primary d-flex align-items-center"
              data-bs-toggle="modal"
              data-bs-target="#add_plans"
            >
              <i class="ti ti-circle-plus me-2"></i>Add New Plan
            </a>
          </div>
          <div class="head-icons ms-2">
            <a
              href="javascript:void(0);"
              class=""
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-bs-original-title="Collapse"
              id="collapse-header"
              @click="toggleHeader"
            >
              <i class="ti ti-chevrons-up"></i>
            </a>
          </div>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <!-- Pricing -->
      <div class="card">
        <div class="card-body pb-1">
          <div class="d-flex justify-content-center align-items-center mb-4">
            <p class="mb-0 me-2">Monthly</p>
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                id="flexSwitchCheckDefault"
              />
            </div>
            <p>Yearly</p>
          </div>
          <div class="row justify-content-center">
            <div class="col-lg-4 col-md-6 col-sm-12">
              <div class="card mb-3">
                <div class="card-body">
                  <div class="card">
                    <div class="card-body">
                      <h4>Basic</h4>
                      <h1>$50<span class="fs-14 fw-normal text-gray">/monthly</span></h1>
                    </div>
                  </div>
                  <div class="pricing-content rounded bg-light mb-3">
                    <div class="price-hdr">
                      <h6 class="fs-14 fw-medium text-gray w-100">Features Includes</h6>
                    </div>
                    <div>
                      <span class="text-dark d-flex align-items-center mb-3"
                        ><i class="ti ti-discount-check-filled text-success me-2"></i>10
                        Employees</span
                      >
                      <span class="text-dark d-flex align-items-center mb-3"
                        ><i class="ti ti-discount-check-filled text-success me-2"></i>50
                        Projects</span
                      >
                      <span class="text-dark d-flex align-items-center mb-3"
                        ><i class="ti ti-discount-check-filled text-success me-2"></i>50
                        Clients</span
                      >
                      <span class="text-dark d-flex align-items-center mb-3"
                        ><i class="ti ti-discount-check-filled text-success me-2"></i>50
                        GB Storage</span
                      >
                      <span class="text-dark d-flex align-items-center mb-3"
                        ><i class="ti ti-circle-x-filled text-danger me-2"></i>Voice &
                        Video Chat</span
                      >
                      <span class="text-dark d-flex align-items-center"
                        ><i class="ti ti-circle-x-filled text-danger me-2"></i>CRM</span
                      >
                    </div>
                  </div>
                  <a href="javascript:void(0);" class="btn btn-dark w-100">Choose Plan</a>
                </div>
              </div>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <div class="card mb-3">
                <div class="card-body">
                  <div class="card">
                    <div class="card-body">
                      <h4>Professional</h4>
                      <h1>$100<span class="fs-14 fw-normal text-gray">/monthly</span></h1>
                    </div>
                  </div>
                  <div class="pricing-content rounded bg-light mb-3">
                    <div class="price-hdr">
                      <h6 class="fs-14 fw-medium text-gray w-100">Features Includes</h6>
                    </div>
                    <div>
                      <span class="text-dark d-flex align-items-center mb-3"
                        ><i class="ti ti-discount-check-filled text-success me-2"></i>50
                        Employees</span
                      >
                      <span class="text-dark d-flex align-items-center mb-3"
                        ><i class="ti ti-discount-check-filled text-success me-2"></i>100
                        Projects</span
                      >
                      <span class="text-dark d-flex align-items-center mb-3"
                        ><i class="ti ti-discount-check-filled text-success me-2"></i>100
                        Clients</span
                      >
                      <span class="text-dark d-flex align-items-center mb-3"
                        ><i class="ti ti-discount-check-filled text-success me-2"></i>50
                        GB Storage</span
                      >
                      <span class="text-dark d-flex align-items-center mb-3"
                        ><i class="ti ti-discount-check-filled text-success me-2"></i
                        >Voice & Video Chat</span
                      >
                      <span class="text-dark d-flex align-items-center"
                        ><i class="ti ti-circle-x-filled text-danger me-2"></i>CRM</span
                      >
                    </div>
                  </div>
                  <a href="javascript:void(0);" class="btn btn-dark w-100">Choose Plan</a>
                </div>
              </div>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <div class="card mb-3">
                <div class="card-body">
                  <div class="card">
                    <div class="card-body">
                      <h4>Enterprise</h4>
                      <h1>$200<span class="fs-14 fw-normal text-gray">/monthly</span></h1>
                    </div>
                  </div>
                  <div class="pricing-content rounded bg-light mb-3">
                    <div class="price-hdr">
                      <h6 class="fs-14 fw-medium text-gray w-100">Features Includes</h6>
                    </div>
                    <div>
                      <span class="text-dark d-flex align-items-center mb-3"
                        ><i class="ti ti-discount-check-filled text-success me-2"></i>100
                        Employees</span
                      >
                      <span class="text-dark d-flex align-items-center mb-3"
                        ><i class="ti ti-discount-check-filled text-success me-2"></i>200
                        Projects</span
                      >
                      <span class="text-dark d-flex align-items-center mb-3"
                        ><i class="ti ti-discount-check-filled text-success me-2"></i>200
                        Clients</span
                      >
                      <span class="text-dark d-flex align-items-center mb-3"
                        ><i class="ti ti-discount-check-filled text-success me-2"></i
                        >Unlimited Storage</span
                      >
                      <span class="text-dark d-flex align-items-center mb-3"
                        ><i class="ti ti-discount-check-filled text-success me-2"></i
                        >Voice & Video Chat</span
                      >
                      <span class="text-dark d-flex align-items-center"
                        ><i class="ti ti-discount-check-filled text-success me-2"></i
                        >CRM</span
                      >
                    </div>
                  </div>
                  <a href="javascript:void(0);" class="btn btn-dark w-100">Choose Plan</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- /Pricing -->

      <!-- Pricing Table -->
      <div class="card">
        <div
          class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3"
        >
          <h5>Plan Details</h5>
          <div
            class="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3"
          >
            <div class="me-3">
              <div class="input-icon-end position-relative">
                <input
                  type="text"
                  class="form-control date-range bookingrange"
                  ref="dateRangeInput"
                  placeholder="dd/mm/yyyy - dd/mm/yyyy"
                />
                <span class="input-icon-addon">
                  <i class="ti ti-chevron-down"></i>
                </span>
              </div>
            </div>
            <div class="dropdown">
              <a
                href="javascript:void(0);"
                class="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                Sort By : Last 7 Days
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >Recently Added</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >Ascending</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >Desending</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >Last Month</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >Last 7 Days</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="card-body p-0">
          <div class="custom-datatable-filter table-responsive">
            <a-table
              class="table datatable thead-light"
              :columns="columns"
              :data-source="data"
              :row-selection="rowSelection"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'Plan'">
                  <h6 class="fw-medium">
                    <a href="javascript:void(0);">{{ record.Plan }}</a>
                  </h6>
                </template>
              </template>
            </a-table>
          </div>
        </div>
      </div>
      <!-- /Pricing Table -->
    </div>

    <div
      class="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3"
    >
      <p class="mb-0">2014 - 2025 &copy; SmartHR.</p>
      <p>
        Designed &amp; Developed By
        <a href="javascript:void(0);" class="text-primary">Dreams</a>
      </p>
    </div>
  </div>
  <!-- /Page Wrapper -->
  <!-- Add Plan -->
  <div class="modal fade" id="add_plans">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Add New Plan</h4>
          <button
            type="button"
            class="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body pb-0">
            <div class="row">
              <div class="col-md-12">
                <div
                  class="d-flex align-items-center flex-wrap row-gap-3 bg-light w-100 rounded p-3 mb-4"
                >
                  <div
                    class="d-flex align-items-center justify-content-center avatar avatar-xxl rounded-circle border border-dashed me-2 flex-shrink-0 text-dark frames"
                  >
                    <img
                      src="@/assets/img/profiles/avatar-30.jpg"
                      alt="img"
                      class="rounded-circle"
                    />
                  </div>
                  <div class="profile-upload">
                    <div class="mb-2">
                      <h6 class="mb-1">Upload Profile Image</h6>
                      <p class="fs-12">Image should be below 4 mb</p>
                    </div>
                    <div class="profile-uploader d-flex align-items-center">
                      <div class="drag-upload-btn btn btn-sm btn-primary me-2">
                        Upload
                        <input type="file" class="form-control image-sign" multiple="" />
                      </div>
                      <a href="javascript:void(0);" class="btn btn-light btn-sm"
                        >Cancel</a
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Plan Name <span class="text-danger"> *</span></label
                  >
                  <vue-select :options="BasSele" id="bassele" placeholder="Select" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Plan Type <span class="text-danger"> *</span></label
                  >
                  <vue-select :options="YeaPric" id="yeapric" placeholder="Select" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Plan Position<span class="text-danger"> *</span></label
                  >
                  <vue-select :options="PlanPri" id="planpri" placeholder="Select" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label"
                    >Plan Currency<span class="text-danger"> *</span></label
                  >
                  <vue-select :options="CurrPri" id="currpri" placeholder="Select" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <div class="d-flex justify-content-between">
                    <label class="form-label"
                      >Plan Currency<span class="text-danger"> *</span></label
                    >
                    <span class="text-primary"
                      ><i class="fa-solid fa-circle-exclamation me-2"></i>Set 0 for
                      free</span
                    >
                  </div>
                  <vue-select :options="PercPri" id="percpri" placeholder="Select" />
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <label class="form-label"
                    >Discount Type<span class="text-danger"> *</span></label
                  >
                  <div class="pass-group">
                    <vue-select :options="PeFexSel" id="pefexsel" placeholder="Select" />
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="mb-3">
                  <label class="form-label"
                    >Discount<span class="text-danger"> *</span></label
                  >
                  <div class="pass-group">
                    <input type="text" class="form-control" />
                  </div>
                </div>
              </div>
              <div class="col-lg-3">
                <div class="mb-3">
                  <label class="form-label">Limitations Invoices</label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-lg-3">
                <div class="mb-3">
                  <label class="form-label">Max Customers</label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-lg-3">
                <div class="mb-3">
                  <label class="form-label">Product</label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-lg-3">
                <div class="mb-3">
                  <label class="form-label">Supplier</label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-lg-12">
                <div class="d-flex align-items-center justify-content-between mb-3">
                  <h6>Plan Modules</h6>
                  <div class="form-check d-flex align-items-center">
                    <label class="form-check-label mt-0 text-dark fw-medium">
                      <input class="form-check-input" type="checkbox" />
                      Select All
                    </label>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-3 col-sm-6">
                  <div class="form-check d-flex align-items-center mb-3">
                    <label class="form-check-label mt-0 text-dark fw-medium">
                      <input class="form-check-input" type="checkbox" />
                      Employees
                    </label>
                  </div>
                </div>
                <div class="col-lg-3 col-sm-6">
                  <div class="form-check d-flex align-items-center mb-3">
                    <label class="form-check-label mt-0 text-dark fw-medium">
                      <input class="form-check-input" type="checkbox" />
                      Invoices
                    </label>
                  </div>
                </div>
                <div class="col-lg-3 col-sm-6">
                  <div class="form-check d-flex align-items-center mb-3">
                    <label class="form-check-label mt-0 text-dark fw-medium">
                      <input class="form-check-input" type="checkbox" />
                      Reports
                    </label>
                  </div>
                </div>
                <div class="col-lg-3 col-sm-6">
                  <div class="form-check d-flex align-items-center mb-3">
                    <label class="form-check-label mt-0 text-dark fw-medium">
                      <input class="form-check-input" type="checkbox" />
                      Contacts
                    </label>
                  </div>
                </div>
                <div class="col-lg-3 col-sm-6">
                  <div class="form-check d-flex align-items-center mb-3">
                    <label class="form-check-label mt-0 text-dark fw-medium">
                      <input class="form-check-input" type="checkbox" />
                      Clients
                    </label>
                  </div>
                </div>
                <div class="col-lg-3 col-sm-6">
                  <div class="form-check d-flex align-items-center mb-3">
                    <label class="form-check-label mt-0 text-dark fw-medium">
                      <input class="form-check-input" type="checkbox" />
                      Estimates
                    </label>
                  </div>
                </div>
                <div class="col-lg-3 col-sm-6">
                  <div class="form-check d-flex align-items-center mb-3">
                    <label class="form-check-label mt-0 text-dark fw-medium">
                      <input class="form-check-input" type="checkbox" />
                      Goals
                    </label>
                  </div>
                </div>
                <div class="col-lg-3 col-sm-6">
                  <div class="form-check d-flex align-items-center mb-3">
                    <label class="form-check-label mt-0 text-dark fw-medium">
                      <input class="form-check-input" type="checkbox" />
                      Deals
                    </label>
                  </div>
                </div>
                <div class="col-lg-3 col-sm-6">
                  <div class="form-check d-flex align-items-center mb-3">
                    <label class="form-check-label mt-0 text-dark fw-medium">
                      <input class="form-check-input" type="checkbox" />
                      Projects
                    </label>
                  </div>
                </div>
                <div class="col-lg-3 col-sm-6">
                  <div class="form-check d-flex align-items-center mb-3">
                    <label class="form-check-label mt-0 text-dark fw-medium">
                      <input class="form-check-input" type="checkbox" />
                      Payments
                    </label>
                  </div>
                </div>
                <div class="col-lg-3 col-sm-6">
                  <div class="form-check d-flex align-items-center mb-3">
                    <label class="form-check-label mt-0 text-dark fw-medium">
                      <input class="form-check-input" type="checkbox" />
                      Assets
                    </label>
                  </div>
                </div>
                <div class="col-lg-3 col-sm-6">
                  <div class="form-check d-flex align-items-center mb-3">
                    <label class="form-check-label mt-0 text-dark fw-medium">
                      <input class="form-check-input" type="checkbox" />
                      Leads
                    </label>
                  </div>
                </div>
                <div class="col-lg-3 col-sm-6">
                  <div class="form-check d-flex align-items-center mb-3">
                    <label class="form-check-label mt-0 text-dark fw-medium">
                      <input class="form-check-input" type="checkbox" />
                      Tickets
                    </label>
                  </div>
                </div>
                <div class="col-lg-3 col-sm-6">
                  <div class="form-check d-flex align-items-center mb-3">
                    <label class="form-check-label mt-0 text-dark fw-medium">
                      <input class="form-check-input" type="checkbox" />
                      Taxes
                    </label>
                  </div>
                </div>
                <div class="col-lg-3 col-sm-6">
                  <div class="form-check d-flex align-items-center mb-3">
                    <label class="form-check-label mt-0 text-dark fw-medium">
                      <input class="form-check-input" type="checkbox" />
                      Activities
                    </label>
                  </div>
                </div>
                <div class="col-lg-3 col-sm-6">
                  <div class="form-check d-flex align-items-center mb-3">
                    <label class="form-check-label mt-0 text-dark fw-medium">
                      <input class="form-check-input" type="checkbox" />
                      Pipelines
                    </label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex align-items-center mb-3">
                    <label class="form-check-label mt-0 me-2 text-dark fw-medium">
                      Access Trial
                    </label>
                    <div class="form-check form-switch me-2">
                      <input
                        class="form-check-input me-2"
                        type="checkbox"
                        role="switch"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="row align-items-center gx-3">
                <div class="col-md-4">
                  <div class="d-flex align-items-center mb-3">
                    <div class="flex-fill">
                      <label class="form-label">Trial Days</label>
                      <input type="text" class="form-control" />
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="d-block align-items-center ms-3">
                    <label class="form-check-label mt-0 me-2 text-dark">
                      Is Recommended
                    </label>
                    <div class="form-check form-switch me-2">
                      <input
                        class="form-check-input me-2"
                        type="checkbox"
                        role="switch"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-md-5">
                  <div class="mb-3">
                    <label class="form-label"
                      >Status<span class="text-danger"> *</span></label
                    >
                    <vue-select :opitons="SelePri" id="selepri" placeholder="Select" />
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Description</label>
                  <textarea class="form-control"></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light me-2" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Add Plan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Plan -->
</template>
<script>
import "daterangepicker/daterangepicker.css";
import "daterangepicker/daterangepicker.js";
import { ref } from "vue";
import { onMounted } from "vue";
import moment from "moment";
import DateRangePicker from "daterangepicker";
const columns = [
  {
    sorter: false,
  },
  {
    title: "Plan",
    dataIndex: "Plan",
    key: "Plan",
    sorter: {
      compare: (a, b) => {
        a = a.Plan.toLowerCase();
        b = b.Plan.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Plan Type",
    dataIndex: "PlanType",
    sorter: {
      compare: (a, b) => {
        a = a.PlanType.toLowerCase();
        b = b.PlanType.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Created Date",
    dataIndex: "CreatedDate",
    sorter: {
      compare: (a, b) => {
        a = a.CreatedDate.toLowerCase();
        b = b.CreatedDate.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Modified Date",
    dataIndex: "ModifiedDate",
    sorter: {
      compare: (a, b) => {
        a = a.ModifiedDate.toLowerCase();
        b = b.ModifiedDate.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Amount",
    dataIndex: "Amount",
    sorter: {
      compare: (a, b) => {
        a = a.Amount.toLowerCase();
        b = b.Amount.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Subscribed Users",
    dataIndex: "SubscribedUsers",
    sorter: {
      compare: (a, b) => {
        a = a.SubscribedUsers.toLowerCase();
        b = b.SubscribedUsers.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
];
const data = [
  {
    Plan: "Basic",
    PlanType: "Monthly",
    CreatedDate: "14 Jan 2024",
    ModifiedDate: "20 Feb 2024",
    Amount: "$50",
    SubscribedUsers: "30 Users",
  },
  {
    Plan: "Professional",
    PlanType: "Monthly",
    CreatedDate: "21 Feb 2024",
    ModifiedDate: "11 Mar 2024",
    Amount: "$100",
    SubscribedUsers: "40 Users",
  },
  {
    Plan: "Enterprise",
    PlanType: "Monthly",
    CreatedDate: "18 Mar 2024",
    ModifiedDate: "05 Apr 2024",
    Amount: "$200",
    SubscribedUsers: "50 Users",
  },
];
const rowSelection = {
  onChange: () => {},
  onSelect: () => {},
  onSelectAll: () => {},
};
export default {
  data() {
    return {
      data,
      columns,
      rowSelection,
      SelePri: ["Select", "Active", "Inactive"],
      PercPri: ["Select", "Fixed", "Percentage"],
      CurrPri: ["Select", "USD", "EURO"],
      PlanPri: ["Select", "1", "2", "3"],
      YeaPric: ["Select", "Monthly", "Yearly"],
      BasSele: ["Select", "Advanced", "Basic", "Enterprise"],
      PeFexSel: ["Select", "Fixed", "Percentage"],
    };
  },
  setup() {
    const dateRangeInput = ref(null);

    // Move the function declaration outside of the onMounted callback
    function booking_range(start, end) {
      return start.format("M/D/YYYY") + " - " + end.format("M/D/YYYY");
    }

    onMounted(() => {
      if (dateRangeInput.value) {
        const start = moment().subtract(6, "days");
        const end = moment();

        new DateRangePicker(
          dateRangeInput.value,
          {
            startDate: start,
            endDate: end,
            ranges: {
              Today: [moment(), moment()],
              Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
              "Last 7 Days": [moment().subtract(6, "days"), moment()],
              "Last 30 Days": [moment().subtract(29, "days"), moment()],
              "This Month": [moment().startOf("month"), moment().endOf("month")],
              "Last Month": [
                moment().subtract(1, "month").startOf("month"),
                moment().subtract(1, "month").endOf("month"),
              ],
            },
          },
          booking_range
        );

        booking_range(start, end);
      }
    });

    return {
      dateRangeInput,
    };
  },
  methods: {
    submitForm() {
      this.$router.push("/pages/pricings");
    },
    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },
  },
};
</script>
