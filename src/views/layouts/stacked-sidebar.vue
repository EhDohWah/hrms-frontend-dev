<template>
  <!-- Stacked Sidebar -->
  <div class="stacked-sidebar" id="stacked-sidebar">
    <div class="sidebar sidebar-stacked" style="display: flex !important">
      <div class="stacked-mini">
        <router-link to="/dashboard/" class="logo-small">
          <img src="@/assets/img/logo-small.svg" alt="Logo" />
        </router-link>
        <div class="sidebar-left slimscroll">
          <div class="d-flex align-items-center flex-column">
            <div class="mb-1 notification-item">
              <a href="javascript:void(0);" class="btn btn-menubar position-relative">
                <i class="ti ti-bell"></i>
                <span class="notification-status-dot"></span>
              </a>
            </div>
            <div class="mb-1">
              <a href="javascript:void(0);" class="btn btn-menubar btnFullscreen">
                <i class="ti ti-maximize"></i>
              </a>
            </div>
            <div class="mb-1">
              <a href="javascript:void(0);" class="btn btn-menubar position-relative">
                <i class="ti ti-shopping-bag"></i>
                <span
                  class="badge bg-success rounded-pill d-flex align-items-center justify-content-center header-badge"
                  >5</span
                >
              </a>
            </div>
            <div class="mb-1">
              <a href="javascript:void(0);" class="btn btn-menubar">
                <i class="ti ti-layout-grid-remove"></i>
              </a>
            </div>
            <div class="mb-1">
              <a href="javascript:void(0);" class="btn btn-menubar position-relative">
                <i class="ti ti-brand-hipchat"></i>
                <span
                  class="badge bg-info rounded-pill d-flex align-items-center justify-content-center header-badge"
                  >5</span
                >
              </a>
            </div>
            <div class="mb-1">
              <a
                href="javascript:void(0);"
                class="btn btn-menubar"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="ti ti-message"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="sidebar-right d-flex justify-content-between flex-column">
        <div class="sidebar-scroll">
          <h6 class="mb-3">Welcome to SmartHR</h6>
          <div class="sidebar-profile text-center rounded bg-light p-3 mb-4">
            <div class="avatar avatar-lg online mb-3">
              <img
                src="@/assets/img/profiles/avatar-02.jpg"
                alt="Img"
                class="img-fluid rounded-circle"
              />
            </div>
            <h6 class="fs-12 fw-normal mb-1">Adrian Herman</h6>
            <p class="fs-10">System Admin</p>
          </div>
          <div class="stack-menu">
            <div
              class="nav flex-column align-items-center nav-pills"
              role="tablist"
              aria-orientation="vertical"
            >
              <div class="row g-2">
                <div class="col-6">
                  <a
                    href="javascript:void(0);"
                    role="tab"
                    class="nav-link active"
                    title="Dashboard"
                    data-bs-toggle="tab"
                    data-bs-target="#menu-dashboard"
                    aria-selected="true"
                  >
                    <span><i class="ti ti-smart-home"></i></span>
                    <p>Dashboard</p>
                  </a>
                </div>
                <div class="col-6">
                  <a
                    href="javascript:void(0);"
                    role="tab"
                    class="nav-link"
                    title="Apps"
                    data-bs-toggle="tab"
                    data-bs-target="#menu-application"
                    aria-selected="false"
                  >
                    <span><i class="ti ti-layout-grid-add"></i></span>
                    <p>Applications</p>
                  </a>
                </div>
                <div class="col-6">
                  <a
                    href="javascript:void(0);"
                    role="tab"
                    class="nav-link"
                    title="Apps"
                    data-bs-toggle="tab"
                    data-bs-target="#menu-superadmin"
                    aria-selected="false"
                  >
                    <span><i class="ti ti-user-star"></i></span>
                    <p>Super Admin</p>
                  </a>
                </div>
                <div class="col-6">
                  <a
                    href="javascript:void(0);"
                    role="tab"
                    class="nav-link"
                    title="Layout"
                    data-bs-toggle="tab"
                    data-bs-target="#menu-layout"
                    aria-selected="false"
                  >
                    <span><i class="ti ti-layout-board-split"></i></span>
                    <p>Layouts</p>
                  </a>
                </div>
                <div class="col-6">
                  <a
                    href="javascript:void(0);"
                    role="tab"
                    class="nav-link"
                    title="Projects"
                    data-bs-toggle="tab"
                    data-bs-target="#menu-project"
                    aria-selected="false"
                  >
                    <span><i class="ti ti-folder"></i></span>
                    <p>Projects</p>
                  </a>
                </div>
                <div class="col-6">
                  <a
                    href="javascript:void(0);"
                    role="tab"
                    class="nav-link"
                    title="CRM"
                    data-bs-toggle="tab"
                    data-bs-target="#menu-crm"
                    aria-selected="false"
                  >
                    <span><i class="ti ti-user-shield"></i></span>
                    <p>Crm</p>
                  </a>
                </div>
                <div class="col-6">
                  <a
                    href="javascript:void(0);"
                    role="tab"
                    class="nav-link"
                    title="HRM"
                    data-bs-toggle="tab"
                    data-bs-target="#menu-hrm"
                    aria-selected="false"
                  >
                    <span><i class="ti ti-users"></i></span>
                    <p>Hrm</p>
                  </a>
                </div>
                <div class="col-6">
                  <a
                    href="javascript:void(0);"
                    role="tab"
                    class="nav-link"
                    title="Finance & Accounts"
                    data-bs-toggle="tab"
                    data-bs-target="#menu-finance"
                    aria-selected="false"
                  >
                    <span><i class="ti ti-shopping-cart-dollar"></i></span>
                    <p>Finance & Accounts</p>
                  </a>
                </div>
                <div class="col-6">
                  <a
                    href="javascript:void(0);"
                    role="tab"
                    class="nav-link"
                    title="Administration"
                    data-bs-toggle="tab"
                    data-bs-target="#menu-administration"
                    aria-selected="false"
                  >
                    <span><i class="ti ti-cash"></i></span>
                    <p>Administration</p>
                  </a>
                </div>
                <div class="col-6">
                  <a
                    href="javascript:void(0);"
                    role="tab"
                    class="nav-link"
                    title="Content"
                    data-bs-toggle="tab"
                    data-bs-target="#menu-content"
                    aria-selected="false"
                  >
                    <span><i class="ti ti-license"></i></span>
                    <p>Contents</p>
                  </a>
                </div>
                <div class="col-6">
                  <a
                    href="javascript:void(0);"
                    role="tab"
                    class="nav-link"
                    title="Pages"
                    data-bs-toggle="tab"
                    data-bs-target="#menu-pages"
                    aria-selected="false"
                  >
                    <span><i class="ti ti-page-break"></i></span>
                    <p>Pages</p>
                  </a>
                </div>
                <div class="col-6">
                  <a
                    href="javascript:void(0);"
                    role="tab"
                    class="nav-link"
                    title="Authentication"
                    data-bs-toggle="tab"
                    data-bs-target="#menu-authentication"
                    aria-selected="false"
                  >
                    <span><i class="ti ti-lock-check"></i></span>
                    <p>Authentication</p>
                  </a>
                </div>
                <div class="col-6">
                  <a
                    href="javascript:void(0);"
                    role="tab"
                    class="nav-link"
                    title="UI Elements"
                    data-bs-toggle="tab"
                    data-bs-target="#menu-ui-elements"
                    aria-selected="false"
                  >
                    <span><i class="ti ti-ux-circle"></i></span>
                    <p>Basic UI</p>
                  </a>
                </div>
              </div>
            </div>
            <div class="tab-content">
              <div class="tab-pane fade show active" id="menu-dashboard">
                <ul class="stack-submenu">
                  <li><router-link to="/dashboard/" class="active">Admin Dashboard</router-link></li>
                  <li><router-link to="/dashboard/employee-dashboard">Employee Dashboard</router-link></li>
                  <li><router-link to="/dashboard/deals-dashboard">Deals Dashboard</router-link></li>
                  <li><router-link to="/dashboard/leads-dashboard">Leads Dashboard</router-link></li>
                </ul>
              </div>
              <div class="tab-pane fade" id="menu-superadmin">
                <ul class="stack-submenu">
                  <li class="menu-title"><span>SUPER ADMIN</span></li>
                <li><router-link to="/super-admin/dashboard">Dashboard</router-link></li>
                <li><router-link to="/super-admin/companies">Companies</router-link></li>
                <li><router-link to="/super-admin/subscription">Subscriptions</router-link></li>
                <li><router-link to="/super-admin/packages">Packages</router-link></li>
                <li><router-link to="/super-admin/domain">Domain</router-link></li>
                <li><router-link to="/super-admin/purchase-transaction">Purchase Transaction</router-link></li>
                </ul>
              </div>
              <div class="tab-pane fade" id="menu-application">
                <ul class="stack-submenu">
                  <li><router-link to="/applications/chat">Chat</router-link></li>
                  <li class="submenu submenu-two">
                    <a href="javascript:void(0);"
                      >Calls<span class="menu-arrow inside-submenu"></span
                    ></a>
                    <ul>
                      <li><router-link to="/calls/video-call">Voice Call</router-link></li>
                      <li><router-link to="/calls/video-call">Video Call</router-link></li>
                      <li><router-link to="/calls/outgoing-call">Outgoing Call</router-link></li>
                      <li><router-link to="/calls/incoming-call">Incoming Call</router-link></li>
                      <li><router-link to="/calls/call-history">Call History</router-link></li>
                    </ul>
                  </li>
                  <li><router-link to="/applications/events">Calendar</router-link></li>
                  <li><router-link to="/applications/email">Email</router-link></li>
                  <li><router-link to="/applications/todo">To Do</router-link></li>
                  <li><router-link to="/applications/notes">Notes</router-link></li>
                  <li><router-link to="/applications/file-manager">File Manager</router-link></li>
                  <li><router-link to="/applications/kanban-view">Kanban</router-link></li>
                  <li><router-link to="/applications/invoices">Invoices</router-link></li>
                </ul>
              </div>
              <div class="tab-pane fade" id="menu-layout">
                <ul class="stack-submenu">
                  <li><router-link to="/layouts/layout-horizontal">Horizontal</router-link></li>
                  <li><router-link to="/layouts/layout-detached">Detached</router-link></li>
                  <li><router-link to="/layouts/layout-modern">Modern</router-link></li>
                  <li><router-link to="/layouts/layout-two-column">Two Column</router-link></li>
                  <li><router-link to="/layouts/layout-hovered">Hovered</router-link></li>
                  <li><router-link to="/layouts/layout-box">Boxed</router-link></li>
                  <li><router-link to="/layouts/layout-horizontal-single">Horizontal Single</router-link></li>
                  <li><router-link to="/layouts/layout-horizontal-overlay">Horizontal Overlay</router-link></li>
                  <li><router-link to="/layouts/layout-horizontal-box">Horizontal Box</router-link></li>
                  <li><router-link to="/layouts/layout-horizontal-sidemenu">Menu Aside</router-link></li>
                  <li><router-link to="/layouts/layout-vertical-transparent">Transparent</router-link></li>
                  <li><router-link to="/layouts/layout-without-header">Without Header</router-link></li>
                  <li><router-link to="/layouts/layout-rtl">RTL</router-link></li>
                  <li><router-link to="/layouts/layout-dark">Dark</router-link></li>
                </ul>
              </div>
              <div class="tab-pane fade" id="menu-project">
                <ul class="stack-submenu">
                  <li><router-link to="/projects/clients">Clients</router-link></li>
                  <li class="submenu">
                    <a href="javascript:void(0);"
                      ><span>Projects</span>
                      <span class="menu-arrow"></span>
                    </a>
                    <ul>
                      <li><router-link to="/projects/projects-list">Projects</router-link></li>
                      <li><router-link to="/projects/tasks">Tasks</router-link></li>
                      <li><router-link to="/projects/task-details">Task Board</router-link></li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div class="tab-pane fade" id="menu-crm">
                <ul class="stack-submenu">
                  <li>
                    <router-link to="/crm/contacts"><span>Contacts</span></router-link>
                  </li>
                  <li>
                    <router-link to="/crm/companies-crm"><span>Companies</span></router-link>
                  </li>
                  <li>
                    <router-link to="/crm/deals-list"><span>Deals</span></router-link>
                  </li>
                  <li>
                    <router-link to="/crm/leads-list"><span>Leads</span></router-link>
                  </li>
                  <li>
                    <router-link to="/crm/pipeline"><span>Pipeline</span></router-link>
                  </li>
                  <li>
                    <router-link to="/crm/analytics"><span>Analytics</span></router-link>
                  </li>
                  <li>
                    <router-link to="/crm/activity"><span>Activities</span></router-link>
                  </li>
                </ul>
              </div>
              <div class="tab-pane fade" id="menu-hrm">
                <ul class="stack-submenu">
                  <li class="submenu">
                    <a href="javascript:void(0);"
                      ><span>Employees</span>
                      <span class="menu-arrow"></span>
                    </a>
                    <ul>
                      <li><router-link to="/employee/employee-list">Employee Lists</router-link></li>
                      <li><router-link to="/employee/employee-grid">Employee Grid</router-link></li>
                      <li><router-link to="/employee/employee-details">Employee Details</router-link></li>
                      <li><router-link to="/employee/departments">Departments</router-link></li>
                      <li><router-link to="/employee/designations">Designations</router-link></li>
                      <li><router-link to="/employee/policy">Policies</router-link></li>
                    </ul>
                  </li>
                  <li class="submenu">
                    <a href="javascript:void(0);"
                      ><span>Tickets</span>
                      <span class="menu-arrow"></span>
                    </a>
                    <ul>
                      <li><router-link to="/tickets/ticket">Tickets</router-link></li>
                      <li><router-link to="/projects/task-details">Ticket Details</router-link></li>
                    </ul>
                  </li>
                  <li>
                    <router-link to="/hrm/holidays"><span>Holidays</span></router-link>
                  </li>
                  <li class="submenu">
                    <a href="javascript:void(0);"
                      ><span>Attendance</span>
                      <span class="menu-arrow"></span>
                    </a>
                    <ul>
                      <li class="submenu submenu-two">
                        <a href="javascript:void(0);"
                          >Leaves<span class="menu-arrow inside-submenu"></span
                        ></a>
                        <ul>
                          <li><router-link to="/leave/leaves-admin">Leaves (Admin)</router-link></li>
                          <li><router-link to="/leave/leaves-employee">Leave (Employee)</router-link></li>
                          <li><router-link to="/leave/leave-settings">Leave Settings</router-link></li>
                        </ul>
                      </li>
                      <li><router-link to="/attendance/attendance-admin">Attendance (Admin)</router-link></li>
                      <li><router-link to="/attendance/attendance-employee">Attendance (Employee)</router-link></li>
                      <li><router-link to="/attendance/timesheets">Timesheets</router-link></li>
                      <li><router-link to="/attendance/schedule-timing">Shift & Schedule</router-link></li>
                      <li><router-link to="/attendance/overtime">Overtime</router-link></li>
                    </ul>
                  </li>
                  <li class="submenu">
                    <a href="javascript:void(0);"
                      ><span>Performance</span>
                      <span class="menu-arrow"></span>
                    </a>
                    <ul>
                      <li>
                        <router-link to="/performance/performance-indicator">Performance Indicator</router-link>
                      </li>
                      <li><router-link to="/performance/performance-review">Performance Review</router-link></li>
                      <li>
                        <router-link to="/performance/performance-appraisal">Performance Appraisal</router-link>
                      </li>
                      <li><router-link to="/performance/goal-tracking">Goal List</router-link></li>
                      <li><router-link to="/performance/goal-type">Goal Type</router-link></li>
                    </ul>
                  </li>
                  <li class="submenu">
                    <a href="javascript:void(0);"
                      ><span>Training</span>
                      <span class="menu-arrow"></span>
                    </a>
                    <ul>
                      <li><router-link to="/training/training-list">Training List</router-link></li>
                      <li><router-link to="/training/trainers">Trainers</router-link></li>
                      <li><router-link to="/training/training-type">Training Type</router-link></li>
                    </ul>
                  </li>
                  <li>
                    <router-link to="/hrm/promotion"><span>Promotion</span></router-link>
                  </li>
                  <li>
                    <router-link to="/hrm/resignation"><span>Resignation</span></router-link>
                  </li>
                  <li>
                    <router-link to="/hrm/termination"><span>Termination</span></router-link>
                  </li>
                </ul>
              </div>
              <div class="tab-pane fade" id="menu-finance">
                <ul class="stack-submenu">
                  <li class="submenu">
                    <a href="javascript:void(0);"
                      ><span>Sales</span>
                      <span class="menu-arrow"></span>
                    </a>
                    <ul>
                      <li><router-link to="/sales/estimates">Estimates</router-link></li>
                      <li><router-link to="/sales/invoices">Invoices</router-link></li>
                      <li><router-link to="/sales/payments">Payments</router-link></li>
                      <li><router-link to="/sales/expenses">Expenses</router-link></li>
                      <li><router-link to="/sales/provident-fund">Provident Fund</router-link></li>
                      <li><router-link to="/sales/taxes">Taxes</router-link></li>
                    </ul>
                  </li>
                  <li class="submenu">
                    <a href="javascript:void(0);"
                      ><span>Accounting</span>
                      <span class="menu-arrow"></span>
                    </a>
                    <ul>
                      <li><router-link to="/accounting/categories">Categories</router-link></li>
                      <li><router-link to="/accounting/budgets">Budgets</router-link></li>
                      <li><router-link to="/accounting/budget-expenses">Budget Expenses</router-link></li>
                      <li><router-link to="/accounting/budget-revenues">Budget Revenues</router-link></li>
                    </ul>
                  </li>
                  <li class="submenu">
                    <a href="javascript:void(0);"
                      ><span>Payroll</span>
                      <span class="menu-arrow"></span>
                    </a>
                    <ul>
                      <li><router-link to="/payroll/employee-salary">Employee Salary</router-link></li>
                      <li><router-link to="/payroll/payslip">Payslip</router-link></li>
                      <li><router-link to="/payroll/payroll">Payroll Items</router-link></li>
                      <li><router-link to="/payroll/tax-settings">Tax Settings</router-link></li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div class="tab-pane fade" id="menu-administration">
                <ul class="stack-submenu">
                  <li class="submenu">
                    <a href="javascript:void(0);"
                      ><span>Assets</span>
                      <span class="menu-arrow"></span>
                    </a>
                    <ul>
                      <li><router-link to="/asset/assets">Assets</router-link></li>
                      <li><router-link to="/asset/asset-categories">Asset Categories</router-link></li>
                    </ul>
                  </li>
                  <li class="submenu">
                    <a href="javascript:void(0);"
                      ><span>Help & Supports</span>
                      <span class="menu-arrow"></span>
                    </a>
                    <ul>
                      <li><router-link to="/supports/knowledgebase">Knowledge Base</router-link></li>
                      <li><router-link to="/crm/activity">Activities</router-link></li>
                    </ul>
                  </li>
                  <li class="submenu">
                    <a href="javascript:void(0);"
                      ><span>User Management</span>
                      <span class="menu-arrow"></span>
                    </a>
                    <ul>
                      <li><router-link to="/user-management/users">Users</router-link></li>
                      <li><router-link to="/user-management/roles-permissions">Roles & Permissions</router-link></li>
                    </ul>
                  </li>
                  <li class="submenu">
                    <a href="javascript:void(0);"
                      ><span>Reports</span>
                      <span class="menu-arrow"></span>
                    </a>
                    <ul>
                      <li><router-link to="/reports/expenses-report">Expense Report</router-link></li>
                      <li><router-link to="/reports/invoice-report">Invoice Report</router-link></li>
                      <li><router-link to="/reports/payment-report">Payment Report</router-link></li>
                      <li><router-link to="/reports/project-report">Project Report</router-link></li>
                      <li><router-link to="/reports/task-report">Task Report</router-link></li>
                      <li><router-link to="/reports/user-report">User Report</router-link></li>
                      <li><router-link to="/reports/employee-report">Employee Report</router-link></li>
                      <li><router-link to="/reports/payslip-report">Payslip Report</router-link></li>
                      <li><router-link to="/reports/attendance-report">Attendance Report</router-link></li>
                      <li><router-link to="/reports/leave-report">Leave Report</router-link></li>
                      <li><router-link to="/reports/daily-report">Daily Report</router-link></li>
                    </ul>
                  </li>
                  <li class="submenu">
                    <a href="javascript:void(0);">
                      General Settings
                      <span class="menu-arrow"></span>
                    </a>
                    <ul>
                      <li><router-link to="/general-settings/profile-settings">Profile</router-link></li>
                      <li><router-link to="/general-settings/security-settings">Security</router-link></li>
                      <li><router-link to="/general-settings/notification-settings">Notifications</router-link></li>
                      <li><router-link to="/general-settings/connected-apps">Connected Apps</router-link></li>
                    </ul>
                  </li>
                  <li class="submenu">
                    <a href="javascript:void(0);">
                      Website Settings
                      <span class="menu-arrow"></span>
                    </a>
                    <ul>
                      <li><router-link to="/website-settings/bussiness-settings">Business Settings</router-link></li>
                      <li><router-link to="/website-settings/seo-settings">SEO Settings</router-link></li>
                      <li><router-link to="/website-settings/localization-settings">Localization</router-link></li>
                      <li><router-link to="/website-settings/prefixes">Prefixes</router-link></li>
                      <li><router-link to="/website-settings/preferences">Preferences</router-link></li>
                      <li><router-link to="/website-settings/appearance">Appearance</router-link></li>
                      <li><router-link to="/website-settings/language">Language</router-link></li>
                      <li><router-link to="/website-settings/authentication-settings">Authentication</router-link></li>
                      <li><router-link to="/website-settings/ai-settings">AI Settings</router-link></li>
                    </ul>
                  </li>
                  <li class="submenu">
                    <a href="javascript:void(0);"
                      >App Settings<span class="menu-arrow"></span
                    ></a>
                    <ul>
                      <li><router-link to="/app-settings/salary-settings">Salary Settings</router-link></li>
                      <li><router-link to="/app-settings/approval-settings">Approval Settings</router-link></li>
                      <li><router-link to="/app-settings/invoice-settings">Invoice Settings</router-link></li>
                      <li><router-link to="/app-settings/leave-type">Leave Type</router-link></li>
                      <li><router-link to="/app-settings/custom-fields">Custom Fields</router-link></li>
                    </ul>
                  </li>
                  <li class="submenu">
                    <a href="javascript:void(0);">
                      System Settings
                      <span class="menu-arrow"></span>
                    </a>
                    <ul>
                      <li><router-link to="/system-settings/email-settings">Email Settings</router-link></li>
                      <li><router-link to="/system-settings/email-template">Email Templates</router-link></li>
                      <li><router-link to="/system-settings/sms-settings">SMS Settings</router-link></li>
                      <li><router-link to="/system-settings/sms-template">SMS Templates</router-link></li>
                      <li><router-link to="/system-settings/otp-settings">OTP</router-link></li>
                      <li><router-link to="/system-settings/gdpr">GDPR Cookies</router-link></li>
                      <li><router-link to="/system-settings/maintenance-mode">Maintenance Mode</router-link></li>
                    </ul>
                  </li>
                  <li class="submenu">
                    <a href="javascript:void(0);">
                      Financial Settings
                      <span class="menu-arrow"></span>
                    </a>
                    <ul>
                      <li><router-link to="/financial-settings/payment-gateways">Payment Gateways</router-link></li>
                      <li><router-link to="/financial-settings/tax-rates">Tax Rate</router-link></li>
                      <li><router-link to="/financial-settings/currencies">Currencies</router-link></li>
                    </ul>
                  </li>
                  <li class="submenu">
                    <a href="javascript:void(0);"
                      >Other Settings<span class="menu-arrow"></span
                    ></a>
                    <ul>
                      <li><router-link to="/others-settings/custom-css">Custom CSS</router-link></li>
                      <li><router-link to="/others-settings/custom-js">Custom JS</router-link></li>
                      <li><router-link to="/others-settings/cronjob">Cronjob</router-link></li>
                      <li><router-link to="/others-settings/storage-settings">Storage</router-link></li>
                      <li><router-link to="/others-settings/ban-ip-address">Ban IP Address</router-link></li>
                      <li><router-link to="/others-settings/backup">Backup</router-link></li>
                      <li><router-link to="/others-settings/clear-cache">Clear Cache</router-link></li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div class="tab-pane fade" id="menu-content">
                <ul class="stack-submenu">
                  <li class="submenu">
                    <a href="javascript:void(0);"
                      >Blogs<span class="menu-arrow"></span
                    ></a>
                    <ul>
                      <li><router-link to="/blog/blogs">All Blogs</router-link></li>
                      <li><router-link to="/blog/blog-categories">Categories</router-link></li>
                      <li><router-link to="/blog/blog-comments">Comments</router-link></li>
                      <li><router-link to="/blog/blog-tags">Blog Tags</router-link></li>
                    </ul>
                  </li>
                  <li class="submenu">
                    <a href="javascript:void(0);"
                      >Locations<span class="menu-arrow"></span
                    ></a>
                    <ul>
                      <li><router-link to="/location/countries">Countries</router-link></li>
                      <li><router-link to="/location/states">States</router-link></li>
                      <li><router-link to="/location/cities">Cities</router-link></li>
                    </ul>
                  </li>
                  <li><router-link to="/content/testimonials">Testimonials</router-link></li>
                  <li><router-link to="/content/faq">FAQ’S</router-link></li>
                </ul>
              </div>
              <div class="tab-pane fade" id="menu-pages">
                <ul class="stack-submenu">
                  <li>
                    <router-link to="/pages/starter"><span>Starter</span></router-link>
                  </li>
                  <li>
                    <router-link to="/pages/profile"><span>Profile</span></router-link>
                  </li>
                  <li>
                    <router-link to="/pages/gallery"><span>Gallery</span></router-link>
                  </li>
                  <li>
                    <router-link to="/pages/search-result"><span>Search Results</span></router-link>
                  </li>
                  <li>
                    <router-link to="/pages/timeline"><span>Timeline</span></router-link>
                  </li>
                  <li>
                    <router-link to="/pages/pricing"><span>Pricing</span></router-link>
                  </li>
                  <li>
                    <router-link to="/pages/coming-soon"><span>Coming Soon</span></router-link>
                  </li>
                  <li>
                    <router-link to="/pages/under-maintenance"><span>Under Maintenance</span></router-link>
                  </li>
                  <li>
                    <router-link to="/pages/under-construction"><span>Under Construction</span></router-link>
                  </li>
                  <li>
                    <router-link to="/pages/api-keys"><span>API Keys</span></router-link>
                  </li>
                  <li>
                    <router-link to="/pages/privacy-policy"><span>Privacy Policy</span></router-link>
                  </li>
                  <li>
                    <router-link to="/pages/terms-condition"><span>Terms & Conditions</span></router-link>
                  </li>
                </ul>
              </div>
              <div class="tab-pane fade" id="menu-authentication">
                <ul class="stack-submenu">
                  <li class="submenu">
                    <a href="javascript:void(0);" class=""
                      >Login<span class="menu-arrow"></span
                    ></a>
                    <ul>
                      <li><router-link to="/">Cover</router-link></li>
                      <li><router-link to="/login-2">Illustration</router-link></li>
                      <li><router-link to="/login-3">Basic</router-link></li>
                    </ul>
                  </li>
                  <li class="submenu">
                    <a href="javascript:void(0);" class=""
                      >Register<span class="menu-arrow"></span
                    ></a>
                    <ul>
                      <li><router-link to="/register">Cover</router-link></li>
                      <li><router-link to="/register-2">Illustration</router-link></li>
                      <li><router-link to="/register-3">Basic</router-link></li>
                    </ul>
                  </li>
                  <li class="submenu">
                    <a href="javascript:void(0);"
                      >Reset Password<span class="menu-arrow"></span
                    ></a>
                    <ul>
                      <li><router-link to="/reset-password">Cover</router-link></li>
                      <li><router-link to="/reset-password-2">Illustration</router-link></li>
                      <li><router-link to="/reset-password-3">Basic</router-link></li>
                    </ul>
                  </li>
                  <li class="submenu">
                    <a href="javascript:void(0);"
                      >Email Verification<span class="menu-arrow"></span
                    ></a>
                    <ul>
                      <li><router-link to="/email-verification">Cover</router-link></li>
                      <li><router-link to="/email-verification-2">Illustration</router-link></li>
                      <li><router-link to="/email-verification-3">Basic</router-link></li>
                    </ul>
                  </li>
                  <li class="submenu">
                    <a href="javascript:void(0);"
                      >2 Step Verification<span class="menu-arrow"></span
                    ></a>
                    <ul>
                      <li><router-link to="/two-step-verification">Cover</router-link></li>
                      <li><router-link to="/two-step-verification-2">Illustration</router-link></li>
                      <li><router-link to="/two-step-verification-3">Basic</router-link></li>
                    </ul>
                  </li>
                  <li><router-link to="/lock-screen">Lock Screen</router-link></li>
                  <li><router-link to="/error-404">404 Error</router-link></li>
                  <li><router-link to="/error-500">500 Error</router-link></li>
                </ul>
              </div>
              <div class="tab-pane fade" id="menu-ui-elements">
                <ul class="stack-submenu">
                  <li class="submenu">
                    <a href="javascript:void(0);"
                      >Base UI<span class="menu-arrow"></span
                    ></a>
                    <ul>
                      <li><router-link to="/baseui/ui-alerts">Alerts</router-link></li>
                      <li><router-link to="/baseui/ui-accordion">Accordion</router-link></li>
                      <li><router-link to="/baseui/ui-avatar">Avatar</router-link></li>
                      <li><router-link to="/baseui/ui-badges">Badges</router-link></li>
                      <li><router-link to="/baseui/ui-borders">Border</router-link></li>
                      <li><router-link to="/baseui/ui-buttons">Buttons</router-link></li>
                      <li><router-link to="/baseui/ui-buttons-group">Button Group</router-link></li>
                      <li><router-link to="/baseui/ui-breadcrumb">Breadcrumb</router-link></li>
                      <li><router-link to="/baseui/ui-cards">Card</router-link></li>
                      <li><router-link to="/baseui/ui-carousel">Carousel</router-link></li>
                      <li><router-link to="/baseui/ui-colors">Colors</router-link></li>
                      <li><router-link to="/baseui/ui-dropdowns">Dropdowns</router-link></li>
                      <li><router-link to="/baseui/ui-grid">Grid</router-link></li>
                      <li><router-link to="/baseui/ui-images">Images</router-link></li>
                      <li><router-link to="/baseui/ui-lightbox">Lightbox</router-link></li>
                      <li><router-link to="/baseui/ui-media">Media</router-link></li>
                      <li><router-link to="/baseui/ui-modals">Modals</router-link></li>
                      <li><router-link to="/baseui/ui-offcanvas">Offcanvas</router-link></li>
                      <li><router-link to="/baseui/ui-pagination">Pagination</router-link></li>
                      <li><router-link to="/baseui/ui-popovers">Popovers</router-link></li>
                      <li><router-link to="/baseui/ui-progress">Progress</router-link></li>
                      <li><router-link to="/baseui/ui-placeholders">Placeholders</router-link></li>
                      <li><router-link to="/baseui/ui-spinner">Spinner</router-link></li>
                      <li><router-link to="/baseui/ui-sweetalerts">Sweet Alerts</router-link></li>
                      <li><router-link to="/baseui/ui-nav-tabs">Tabs</router-link></li>
                      <li><router-link to="/baseui/ui-tooltips">Tooltips</router-link></li>
                      <li><router-link to="/baseui/ui-typography">Typography</router-link></li>
                      <li><router-link to="/baseui/ui-video">Video</router-link></li>
                    </ul>
                  </li>
                  <li class="submenu">
                    <a href="javascript:void(0);">
                      Advanced UI<span class="menu-arrow"></span
                    ></a>
                    <ul>
                      <li><router-link to="/advancedui/ui-ribbon">Ribbon</router-link></li>
                      <li><router-link to="/advancedui/ui-clipboard">Clipboard</router-link></li>
                      <li><router-link to="/advancedui/ui-drag-drop">Drag & Drop</router-link></li>
                      <li><router-link to="/advancedui/ui-rangeslider">Range Slider</router-link></li>
                      <li><router-link to="/advancedui/ui-rating">Rating</router-link></li>
                      <li><router-link to="/advancedui/ui-text-editor">Text Editor</router-link></li>
                      <li><router-link to="/advancedui/ui-counter">Counter</router-link></li>
                      <li><router-link to="/advancedui/ui-scrollbar">Scrollbar</router-link></li>
                      <li><router-link to="/advancedui/ui-stickynote">Sticky Note</router-link></li>
                      <li><router-link to="/advancedui/ui-timeline">Timeline</router-link></li>
                    </ul>
                  </li>
                  <li class="submenu">
                    <a href="javascript:void(0);"
                      >Forms<span class="menu-arrow"></span>
                    </a>
                    <ul>
                      <li class="submenu submenu-two">
                        <a href="javascript:void(0);"
                          >Form Elements<span class="menu-arrow inside-submenu"></span
                        ></a>
                        <ul>
                          <li><router-link to="/form-elements/form-basic-inputs">Basic Inputs</router-link></li>
                          <li><router-link to="/form-elements/form-checkbox-radios">Checkbox & Radios</router-link></li>
                          <li><router-link to="/form-elements/form-input-groups">Input Groups</router-link></li>
                          <li><router-link to="/form-elements/form-grid-gutters">Grid & Gutters</router-link></li>
                          <li><router-link to="/form-elements/form-select">Form Select</router-link></li>
                          <li><router-link to="/form-elements/form-mask">Input Masks</router-link></li>
                          <li><router-link to="/form-elements/form-fileupload">File Uploads</router-link></li>
                        </ul>
                      </li>
                      <li class="submenu submenu-two">
                        <a href="javascript:void(0);"
                          >Layouts<span class="menu-arrow inside-submenu"></span
                        ></a>
                        <ul>
                          <li><router-link to="/form-layouts/form-horizontal">Horizontal Form</router-link></li>
                          <li><router-link to="/form-layouts/form-vertical">Vertical Form</router-link></li>
                          <li><router-link to="/form-layouts/form-floating-labels">Floating Labels</router-link></li>
                        </ul>
                      </li>
                      <li><router-link to="/forms/form-validation">Form Validation</router-link></li>
                      <li><router-link to="/forms/form-select2">Select2</router-link></li>
                      <li><router-link to="/forms/form-wizard">Form Wizard</router-link></li>
                    </ul>
                  </li>
                  <li class="submenu">
                    <a href="javascript:void(0);"
                      >Tables<span class="menu-arrow"></span
                    ></a>
                    <ul>
                      <li><router-link to="/tables/tables-basic">Basic Tables </router-link></li>
                      <li><router-link to="/tables/data-tables">Data Table </router-link></li>
                    </ul>
                  </li>
                  <li class="submenu">
                    <a href="javascript:void(0);"
                      >Charts<span class="menu-arrow"></span>
                    </a>
                    <ul>
                      <li><router-link to="/charts/chart-apex">Apex Charts</router-link></li>
                      <li><router-link to="/charts/chart-c3">Chart C3</router-link></li>
                      <li><router-link to="/charts/chart-js">Chart Js</router-link></li>
                      <li><router-link to="/charts/chart-morris">Morris Charts</router-link></li>
                      <li><router-link to="/charts/chart-flot">Flot Charts</router-link></li>
                    </ul>
                  </li>
                  <li class="submenu">
                    <a href="javascript:void(0);"
                      >Icons<span class="menu-arrow"></span>
                    </a>
                    <ul>
                      <li><router-link to="/icons/icon-fontawesome">Fontawesome Icons</router-link></li>
                      <li><router-link to="/icons/icon-feather">Feather Icons</router-link></li>
                      <li><router-link to="/icons/icon-ionic">Ionic Icons</router-link></li>
                      <li><router-link to="/icons/icon-material">Material Icons</router-link></li>
                      <li><router-link to="/icons/icon-pe7">Pe7 Icons</router-link></li>
                      <li><router-link to="/icons/icon-simpleline">Simpleline Icons</router-link></li>
                      <li><router-link to="/icons/icon-themify">Themify Icons</router-link></li>
                      <li><router-link to="/icons/icon-weather">Weather Icons</router-link></li>
                      <li><router-link to="/icons/icon-typicon">Typicon Icons</router-link></li>
                      <li><router-link to="/icons/icon-flag">Flag Icons</router-link></li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="p-3">
          <a href="javascript:void(0);" class="d-flex align-items-center fs-12 mb-3"
            >Documentation</a
          >
          <a href="javascript:void(0);" class="d-flex align-items-center fs-12"
            >Change Log<span class="badge bg-pink badge-xs text-white fs-10 ms-2"
              >v4.0.2</span
            ></a
          >
        </div>
      </div>
    </div>
  </div>
  <!-- /Stacked Sidebar -->
</template>
