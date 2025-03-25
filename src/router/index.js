import {createRouter, createWebHistory} from 'vue-router';
import { authGuard, roleGuard } from './guards';
import UnauthorizedPage from '@/views/pages/authentication/unauthorized.vue';

// Grant components
import grantIndex from '@/views/pages/grant/grant-index.vue';
import grantList from '@/views/pages/grant/grant-list.vue';
import grantDetails from '@/views/pages/grant/grant-details.vue';
import grantPositionList from '@/views/pages/grant/grant-position-list.vue';


// References components
import ReferencesList from '@/views/pages/recruitment/references/references-list.vue';

// Request components
import travelRequestIndex from '@/views/pages/requests/travel/travel-index.vue';
import travelRequestList from '@/views/pages/requests/travel/travel-list.vue';
import travelRequestDetails from '@/views/pages/requests/travel/travel-details.vue';

import dashboardIndex from '@/views/pages/dashboard/dashboard-index.vue';
import adminDashboard from '@/views/pages/dashboard/admin-dashboard/admin-dashboard.vue';
import employeeDashboard from '@/views/pages/dashboard/employee-dashboard/employee-dashboard.vue';
import hrManagerDashboard from '@/views/pages/dashboard/hr-manager-dashboard/hr-manager-dashboard.vue';
import hrAssistantDashboard from '@/views/pages/dashboard/hr-assistant-dashboard/hr-assistant-dashboard.vue';
import dealsDashboard from '@/views/pages/dashboard/deals-dashboard/deals-dashboard.vue';
import leadsDashboard from '@/views/pages/dashboard/leads-dashboard/leads-dashboard.vue';
import applicationIndex from '@/views/pages/applications/application-index.vue';
import chatIndex from '@/views/pages/applications/chat-index.vue';
import voiceCall from '@/views/pages/applications/calls/voice-call.vue';
import videoCall from '@/views/pages/applications/calls/video-call.vue';
import outgoingCall from '@/views/pages/applications/calls/outgoing-call.vue';
import incomingCall from '@/views/pages/applications/calls/incoming-call.vue';
import callHistory from '@/views/pages/applications/calls/call-history.vue';
import calendarIndex from '@/views/pages/applications/calendar-index.vue';
import emailIndex from '@/views/pages/applications/email-index.vue';
import emailReply from '@/views/pages/applications/email-reply.vue';
import superAdmin from '@/views/pages/superadmin/super-admin.vue';
import superDashboard from '@/views/pages/superadmin/super-dashboard/super-dashboard.vue';
import companiesList from '@/views/pages/superadmin/companies/companies-list.vue';
import Crmcompanies from '@/views/pages/superadmin/companies/companies-crm.vue';
import companiesDetails from '@/views/pages/superadmin/companies/companies-details.vue';
import superSubscription from '@/views/pages/superadmin/super-subscription.vue';
import clientsGrid from '@/views/pages/projects/clients/clients-grid.vue';
import clientsList from '@/views/pages/projects/clients/clients-list.vue';
import projectsIndex from '@/views/pages/projects/projects-index.vue';
import clientsDetails from '@/views/pages/projects/clients/clients-details.vue';
import projectGrid from '@/views/pages/projects/project/project-grid.vue';
import projectList from '@/views/pages/projects/project/project-list.vue';
import projectDetails from '@/views/pages/projects/project/project-details.vue';
import todoList from '@/views/pages/applications/todo-list.vue';
import todoIndex from '@/views/pages/applications/todo-index.vue';
import crmIndex from '@/views/pages/crm/crm-index.vue';
import dealsList from '@/views/pages/crm/deals/deals-list.vue';
import dealsGrid from '@/views/pages/crm/deals/deals-grid.vue';
import dealsDetails from '@/views/pages/crm/deals/deals-details.vue';
import leadsDetails from '@/views/pages/crm/leads/leads-details.vue';
import leadsGrid from '@/views/pages/crm/leads/leads-grid.vue';
import leadsList from '@/views/pages/crm/leads/leads-list.vue';
import employeesIndex from '@/views/pages/hrm/employees/employees-index.vue';
import employeesList from '@/views/pages/hrm/employees/employees-list.vue';
import employeesGrid from '@/views/pages/hrm/employees/employees-grid.vue';
import employeeDetails from '@/views/pages/hrm/employees/employee-details.vue';
import employeeDepartment from '@/views/pages/hrm/employees/employee-departments.vue';
import employeePositions from '@/views/pages/hrm/employees/employee-positions.vue';
import employeePolicy from '@/views/pages/hrm/employees/employee-policy.vue';
import ticketList from '@/views/pages/hrm/tickets/tickets-list.vue';
import ticketsIndex from '@/views/pages/hrm/tickets/tickets-index.vue';
import ticketsGrid from '@/views/pages/hrm/tickets/tickets-grid.vue';
import ticketsDetails from '@/views/pages/hrm/tickets/tickets-details.vue';
import accountingIndex from '@/views/pages/finance-accounts/accounting/accounting-index.vue';
import budgetsIndex from '@/views/pages/finance-accounts/accounting/budgets-index.vue';
import budgetsExpenses from '@/views/pages/finance-accounts/accounting/budgets-expenses.vue';
import budgetsRevenues from '@/views/pages/finance-accounts/accounting/budgets-revenues.vue';
import payrollIndex from '@/views/pages/finance-accounts/payroll/payroll-index.vue';
import employeeSalary from '@/views/pages/finance-accounts/payroll/employee-salary.vue';
import payslipIndex from '@/views/pages/finance-accounts/payroll/payslip-index.vue';
import payrollAdditions from '@/views/pages/finance-accounts/payroll/payroll-additions.vue';
import payrollOvertime from '@/views/pages/finance-accounts/payroll/payroll-overtime.vue';
import payrollDeduction from '@/views/pages/finance-accounts/payroll/payroll-deduction.vue';
import assetsIndex from '@/views/pages/administration/assets/assets-index.vue';
import assetsList from '@/views/pages/administration/assets/assets-list.vue';
import assetsCategories from '@/views/pages/administration/assets/assets-categories.vue';
import helpSupports from '@/views/pages/administration/supports/help-supports.vue';
import knowledgebaseIndex from '@/views/pages/administration/supports/knowledgebase-index.vue';
import knowledgebaseView from '@/views/pages/administration/supports/knowledgebase-view.vue';
import knowledgebaseDetails from '@/views/pages/administration/supports/knowledgebase-details.vue';
import userManagement from '@/views/pages/administration/user-management/user-management.vue';
import userList from '@/views/pages/administration/user-management/user-list.vue';
import rolesPermissions from '@/views/pages/administration/user-management/roles-permission.vue';
import permissionIndex from '@/views/pages/administration/user-management/permission-index.vue';
import generalSettings from '@/views/pages/administration/settings/general-settings/general-settings.vue';
import profileSettings from '@/views/pages/administration/settings/general-settings/profile-settings.vue';
import securitySettings from '@/views/pages/administration/settings/general-settings/security-settings.vue';
import notificationSettings from '@/views/pages/administration/settings/general-settings/notification-settings.vue';
import connectedApps from '@/views/pages/administration/settings/general-settings/connected-apps.vue';
import websiteSettings from '@/views/pages/administration/settings/website-settings/website-settings.vue';
import bussinessSettings from '@/views/pages/administration/settings/website-settings/bussiness-settings.vue';
import seoSettings from '@/views/pages/administration/settings/website-settings/seo-settings.vue';
import localizationSettings from '@/views/pages/administration/settings/website-settings/localization-settings.vue';
import prefixes from '@/views/pages/administration/settings/website-settings/prefixes-settings.vue';
import preferences from '@/views/pages/administration/settings/website-settings/preferences-settings.vue';
import appearance from '@/views/pages/administration/settings/website-settings/appearance-settings.vue';
import language from '@/views/pages/administration/settings/website-settings/language-settings.vue';
import languageWeb from '@/views/pages/administration/settings/website-settings/language-web.vue';
import addLanguage from '@/views/pages/administration/settings/website-settings/add-language.vue';
import authenticationSettings from '@/views/pages/administration/settings/website-settings/authentication-settings.vue';
import aiSettings from '@/views/pages/administration/settings/website-settings/ai-settings.vue';
import appSettings from '@/views/pages/administration/settings/app-settings/app-settings.vue';
import salarySettings from '@/views/pages/administration/settings/app-settings/salary-settings.vue';
import leaveType from '@/views/pages/administration/settings/app-settings/leave-type.vue';
import approvalSettings from '@/views/pages/administration/settings/app-settings/approval-settings.vue';
import invoiceSettings from '@/views/pages/administration/settings/app-settings/invoice-settings.vue';
import customFields from '@/views/pages/administration/settings/app-settings/custom-fields.vue';
import systemSettings from '@/views/pages/administration/settings/system-settings/system-settings.vue';
import emailSettings from '@/views/pages/administration/settings/system-settings/email-settings.vue';
import emailTemplate from '@/views/pages/administration/settings/system-settings/email-template.vue';
import smsSettings from '@/views/pages/administration/settings/system-settings/sms-settings.vue';
import smsTemplate from '@/views/pages/administration/settings/system-settings/sms-template.vue';
import otpSettings from '@/views/pages/administration/settings/system-settings/otp-settings.vue';
import gdprSettings from '@/views/pages/administration/settings/system-settings/gdpr-settings.vue';
import maintenanceMode from '@/views/pages/administration/settings/system-settings/maintenance-mode.vue';
import financialSettings from '@/views/pages/administration/settings/financial-settings/financial-settings.vue';
import paymentGateway from '@/views/pages/administration/settings/financial-settings/payment-gateway.vue';
import taxRates from '@/views/pages/administration/settings/financial-settings/tax-rates.vue';
import currenciesSettings from '@/views/pages/administration/settings/financial-settings/currencies-settings.vue';
import customCss from '@/views/pages/administration/settings/others-settings/custom-css.vue';
import customJs from '@/views/pages/administration/settings/others-settings/custom-js.vue';
import othersSettings from '@/views/pages/administration/settings/others-settings/others-settings.vue';
import cronJob from '@/views/pages/administration/settings/others-settings/cronjob-settings.vue'
import cronjobSchedule from '@/views/pages/administration/settings/others-settings/cronjob-schedule.vue'
import storageSettings from '@/views/pages/administration/settings/others-settings/storage-setings.vue';
import banIpAddress from '@/views/pages/administration/settings/others-settings/ban-ip-address.vue';
import backupSettings from '@/views/pages/administration/settings/others-settings/backup-settings.vue';
import clearCache from '@/views/pages/administration/settings/others-settings/clear-cache.vue';
import notesIndex from '@/views/pages/applications/notes-index.vue';
import socialFeed from '@/views/pages/applications/social-feed.vue';
import invoicesApp from '@/views/pages/applications/invoices-app.vue';
import addInvoices from '@/views/pages/applications/add-invoices.vue';
import editInvoices from '@/views/pages/applications/edit-invoices.vue';
import invoiceDetails from '@/views/pages/applications/invoice-details.vue';
import fileManager from '@/views/pages/applications/file-manager/file-manager.vue';
import kanbanView from '@/views/pages/applications/kanban-view/kanban-view.vue';
import pagesIndex from '@/views/pages/pages/pages-index.vue';
import starterIndex from '@/views/pages/pages/starter-index.vue';
import profileIndex from '@/views/pages/pages/profile-index.vue';
import galleryIndex from '@/views/pages/pages/gallery-index.vue';
import searchResult from '@/views/pages/pages/search-result.vue';
import timelineIndex from '@/views/pages/pages/timeline-index.vue';
import pricingIndex from '@/views/pages/pages/pricing-index.vue';
import comingSoon from '@/views/pages/pages/coming-soon.vue';
import underMaintenance from '@/views/pages/pages/under-maintenance.vue';
import underConstruction from '@/views/pages/pages/under-construction.vue';
import apiKeys from '@/views/pages/pages/api-keys.vue';
import privacyPolicy from '@/views/pages/pages/privacy-policy.vue';
import termsCondition from '@/views/pages/pages/terms-condition.vue';

import layoutIndex from '@/views/pages/layout/layout-index.vue';
import layoutHorizontal from '@/views/pages/layout/layout-horizontal.vue';
import layoutDetached from '@/views/pages/layout/layout-detached.vue';
import layoutModern from '@/views/pages/layout/layout-modern.vue';
import layoutTwocolum from '@/views/pages/layout/layout-two-column.vue';
import layoutHovered from '@/views/pages/layout/layout-hovered.vue';
import layoutBox from '@/views/pages/layout/layout-box.vue';
import layoutHorizontalSingle from '@/views/pages/layout/layout-horizontal-single.vue';
import layoutHorizontalOverlay from '@/views/pages/layout/layout-horizontal-overlay.vue';
import layoutHorizontalBox from '@/views/pages/layout/layout-horizontal-box.vue';
import layoutHorizontalSidemenu from '@/views/pages/layout/layout-horizontal-sidemenu.vue';
import layoutVerticalTransparent from '@/views/pages/layout/layout-vertical-transparent.vue';
import layoutWithoutHeader from '@/views/pages/layout/layout-without-header.vue';
import layoutRtl from '@/views/pages/layout/layout-rtl/layout-rtl.vue';
import layoutDark from '@/views/pages/layout/layout-dark.vue';


import Tables from '@/views/pages/uiinterface/tables/ui-tables'
import Tables_Basic from '@/views/pages/uiinterface/tables/tables-basic.vue'
import Data_Tables from '@/views/pages/uiinterface/tables/data-tables.vue'
import Chartapex from '@/views/pages/uiinterface/charts/apex/chart-apex.vue'
import Chartc3 from '@/views/pages/uiinterface/charts/c3/chart-c3.vue'
import Chartflot from '@/views/pages/uiinterface/charts/flot/chart-flot.vue'
import Chartjs from '@/views/pages/uiinterface/charts/js/chart-js.vue'
import Chartmorris from '@/views/pages/uiinterface/charts/morris/chart-morris.vue'
import Charts from '@/views/pages/uiinterface/charts/ui-charts.vue'
import Forms from '@/views/pages/uiinterface/forms/ui-forms.vue'
import Formbasicinput from '@/views/pages/uiinterface/forms/form-elements/formbasic/formbasic-input.vue'
import Formcheckboxradios from '@/views/pages/uiinterface/forms/form-elements/form-checkbox-radios.vue'
import Formgridgutters from '@/views/pages/uiinterface/forms/form-elements/form-grid-gutters.vue'
import Formselect from '@/views/pages/uiinterface/forms/form-elements/form-select.vue'
import FormInput from '@/views/pages/uiinterface/forms/form-elements/forminput/form-input.vue'
import Formmask from '@/views/pages/uiinterface/forms/form-elements/formmask/formmask.vue'
import Formfileupload from '@/views/pages/uiinterface/forms/form-elements/formfile-upload.vue'
import FormHorizontal from '@/views/pages/uiinterface/forms/layouts/form-horizontal.vue'
import Formvertical from '@/views/pages/uiinterface/forms/layouts/form-vertical.vue'
import Formfloatinglabels from '@/views/pages/uiinterface/forms/layouts/form-floating-labels.vue'
import Formvalidation from '@/views/pages/uiinterface/forms/form-validation.vue'
import Formselect2 from '@/views/pages/uiinterface/forms/form-select2.vue'
import FormElements from '@/views/pages/uiinterface/forms/form-elements/form-elements.vue'
import Formwizard from '@/views/pages/uiinterface/forms/form-wizard.vue'
import Advancedui from '@/views/pages/uiinterface/advancedUI/advanced-ui.vue'
import UI_Ribbon from '@/views/pages/uiinterface/advancedUI/ui-ribbon.vue'
import UI_Clipboard from '@/views/pages/uiinterface/advancedUI/ui-clipboard.vue'
import UI_Drag_Drop from '@/views/pages/uiinterface/advancedUI/ui-drag-drop.vue'
import UI_Text_Editor from '@/views/pages/uiinterface/advancedUI/ui-text-editor.vue'
import UI_Counter from '@/views/pages/uiinterface/advancedUI/ui-counter.vue'
import UI_Scrollbar from '@/views/pages/uiinterface/advancedUI/ui-scrollbar.vue'
import UI_Rating from '@/views/pages/uiinterface/advancedUI/ui-rating.vue'
import UI_Stickynote from '@/views/pages/uiinterface/advancedUI/ui-stickynote.vue'
import UI_Timeline from '@/views/pages/uiinterface/advancedUI/ui-timeline.vue'
import BaseUi from '@/views/pages/uiinterface/baseui/base-ui.vue'
import UI_Alerts from '@/views/pages/uiinterface/baseui/ui-alerts.vue'
import UI_Accordion from '@/views/pages/uiinterface/baseui/ui-accordion.vue'
import UI_Avatar from '@/views/pages/uiinterface/baseui/ui-avatar.vue'
import UI_Badges from '@/views/pages/uiinterface/baseui/ui-badges.vue'
import UI_Borders from '@/views/pages/uiinterface/baseui/ui-borders.vue'
import UI_Buttons from '@/views/pages/uiinterface/baseui/ui-buttons.vue'
import UI_Buttons_group from '@/views/pages/uiinterface/baseui/ui-buttons-group.vue'
import UI_Breadcrumb from '@/views/pages/uiinterface/baseui/ui-breadcrumb.vue'
import UI_Cards from '@/views/pages/uiinterface/baseui/ui-cards.vue'
import UI_Carousel from '@/views/pages/uiinterface/baseui/carousel/ui-carousel.vue'
import UI_Colors from '@/views/pages/uiinterface/baseui/ui-colors.vue'
import UI_Dropdowns from '@/views/pages/uiinterface/baseui/ui-dropdowns.vue'
import UI_Grid from '@/views/pages/uiinterface/baseui/ui-grid.vue'
import UI_Images from '@/views/pages/uiinterface/baseui/ui-images.vue'
import UI_Lightbox from '@/views/pages/uiinterface/baseui/lightbox/ui-lightbox.vue'
import UI_Media from '@/views/pages/uiinterface/baseui/ui-media.vue'
import UI_Modals from '@/views/pages/uiinterface/baseui/ui-modals.vue'
import UI_Offcanvas from '@/views/pages/uiinterface/baseui/ui-offcanvas.vue'
import UI_Pagination from '@/views/pages/uiinterface/baseui/ui-pagination.vue'
import UI_Popovers from '@/views/pages/uiinterface/baseui/ui-popovers.vue'
import UI_Progress from '@/views/pages/uiinterface/baseui/ui-progress.vue'
import UI_Placeholders from '@/views/pages/uiinterface/baseui/ui-placeholders.vue'
import UI_Rangeslider from '@/views/pages/uiinterface/advancedUI/ui-rangeslider.vue'
import Ui_Navtabs from '@/views/pages/uiinterface/baseui/ui-nav-tabs.vue'
import UI_Spinner from '@/views/pages/uiinterface/baseui/ui-spinner.vue'
import UI_Sweetalerts from '@/views/pages/uiinterface/baseui/ui-sweetalerts.vue'
import UI_Tooltips from '@/views/pages/uiinterface/baseui/ui-tooltips.vue'
import UI_Typography from '@/views/pages/uiinterface/baseui/ui-typography.vue'
import UI_Video from '@/views/pages/uiinterface/baseui/ui-video.vue'
import Icons from '@/views/pages/uiinterface/icons/ui-icons.vue'
import UI_Iconfontawesome from "@/views/pages/uiinterface/icons/icon-fontawesome.vue";
import UI_Iconfeather from "@/views/pages/uiinterface/icons/icon-feather.vue";
import UI_Iconionic from "@/views/pages/uiinterface/icons/icon-ionic.vue";
import UI_Iconmaterial from "@/views/pages/uiinterface/icons/icon-material.vue";
import UI_Iconpe7 from "@/views/pages/uiinterface/icons/icon-pe7.vue";
import UI_Iconsimpleline from "@/views/pages/uiinterface/icons/icon-simpleline.vue";
import UI_Iconthemify from "@/views/pages/uiinterface/icons/icon-themify.vue";
import UI_Iconweather from "@/views/pages/uiinterface/icons/icon-weather.vue";
import UI_Icontypicon from "@/views/pages/uiinterface/icons/icon-typicon.vue";
import UI_Iconflag from "@/views/pages/uiinterface/icons/icon-flag.vue";

// Authentication component
import LoginIndex from '@/views/pages/authentication/login-index.vue';
import forgotPassword from '@/views/pages/authentication/forgot-password.vue';
import resetPassword from '@/views/pages/authentication/reset-password.vue';

import FormLayouts from '@/views/pages/uiinterface/forms/layouts/form-layouts.vue';

import packagesList from '@/views/pages/superadmin/packages/packages-list.vue';
import packagesGrid from '@/views/pages/superadmin/packages/packages-grid.vue';
import domainList from '@/views/pages/superadmin/domain/domain-list.vue';
import purchaseTransaction from '@/views/pages/superadmin/purchase/purchase-transaction.vue';
import TasksIndex from '@/views/pages/projects/task/tasks-index.vue';
import TaskBoard from '@/views/pages/projects/task/task-board.vue';
import TaskDetails from '@/views/pages/projects/task/task-details.vue';
import ContactsGrid from '@/views/pages/crm/contacts/contacts-grid.vue'
import ContactsList from '@/views/pages/crm/contacts/contacts-list.vue'
import ContactDetails from '@/views/pages/crm/contacts/contact-details.vue';
import CrmCompaniesGrid from '@/views/pages/crm/companies/companies-grid.vue';
import pipelineList from '@/views/pages/crm/pipeline/pipeline-list.vue';
import AnalyticsList from '@/views/pages/crm/analytics/analytics-list.vue';
import ActivityList from '@/views/pages/crm/activity/activity-list.vue';
import HrmIndex from '@/views/pages/hrm/hrm-index.vue';
import HolidaysList from '@/views/pages/hrm/holidays/holidays-list.vue';
import LeavesAdmin from '@/views/pages/hrm/attendance/leaves/leaves-admin.vue';
import LeaveIndex from '@/views/pages/hrm/attendance/leaves/leave-index.vue';
import LeavesEmployee from '@/views/pages/hrm/attendance/leaves/leaves-employee.vue';
import LeaveSettings from '@/views/pages/hrm/attendance/leaves/leave-settings.vue';
import AttendanceIndex from '@/views/pages/hrm/attendance/attendance-index.vue';
import AttendanceAdmin from '@/views/pages/hrm/attendance/attendance-admin.vue';
import AttendanceEmployee from '@/views/pages/hrm/attendance/attendance-employee.vue';
import TimesheetsList from '@/views/pages/hrm/attendance/timesheets-list.vue';
import ScheduleTiming from '@/views/pages/hrm/attendance/schedule-timing.vue';
import OvertimeList from '@/views/pages/hrm/attendance/overtime-list.vue';
import PerformanceIndex from '@/views/pages/hrm/attendance/performance/performance-index.vue';
import PerformanceIndicator from '@/views/pages/hrm/attendance/performance/performance-indicator.vue';
import PerformanceReview from '@/views/pages/hrm/attendance/performance/performance-review.vue';
import PerformanceAppraisal from '@/views/pages/hrm/attendance/performance/performance-appraisal.vue';
import GoalTracking from '@/views/pages/hrm/attendance/performance/goal-tracking.vue';
import GoalType from '@/views/pages/hrm/attendance/performance/goal-type.vue';
import TrainingIndex from '@/views/pages/hrm/attendance/training/training-index.vue';
import TrainingList from '@/views/pages/hrm/attendance/training/training-list.vue';
import TrainersList from '@/views/pages/hrm/attendance/training/trainers-list.vue';
import TrainingType from '@/views/pages/hrm/attendance/training/training-type.vue';
import PromotionList from '@/views/pages/hrm/promotion/promotion-list.vue';
import ResignationList from '@/views/pages/hrm/resignation/resignation-list.vue';
import TerminationList from '@/views/pages/hrm/termination/termination-list.vue';
import RecruitmentIndex from '@/views/pages/recruitment/recruitment-index.vue';
import JobGrid from '@/views/pages/recruitment/jobs/job-grid.vue';
import JobList from '@/views/pages/recruitment/jobs/job-list.vue';
import CandidatesGrid from '@/views/pages/recruitment/candidates/candidates-grid.vue';
import CandidatesList from '@/views/pages/recruitment/candidates/candidates-list.vue';
import CandidatesKanban from '@/views/pages/recruitment/candidates/candidates-kanban.vue';
import RefferalsList from '@/views/pages/recruitment/refferals/refferals-list.vue';
import SalesIndex from '@/views/pages/finance-accounts/sales/sales-index.vue';
import EstimatesList from '@/views/pages/finance-accounts/sales/estimates-list.vue';
import InvoicesList from '@/views/pages/finance-accounts/sales/invoices-list.vue';
import AddInvoices from '@/views/pages/finance-accounts/sales/add-invoices.vue';
import EditInvoices from '@/views/pages/finance-accounts/sales/edit-invoices.vue';
import InvoiceDetails from '@/views/pages/finance-accounts/sales/invoice-details.vue';
import PaymentsList from '@/views/pages/finance-accounts/sales/payments-list.vue';
import ExpensesList from '@/views/pages/finance-accounts/sales/expenses-list.vue';
import ProvidentFund from '@/views/pages/finance-accounts/sales/provident-fund.vue';
import TaxesList from '@/views/pages/finance-accounts/sales/taxes-list.vue';
import CategoriesList from '@/views/pages/finance-accounts/accounting/categories-list.vue';
import ContentIndex from '@/views/pages/content/content-index.vue';
import PagesList from '@/views/pages/content/pages-list.vue';
import BlogsIndex from '@/views/pages/content/blogs/blogs-index.vue';
import BlogsGrid from '@/views/pages/content/blogs/blogs-grid.vue';
import BlogCategories from '@/views/pages/content/blogs/blog-categories.vue';
import BlogComments from '@/views/pages/content/blogs/blog-comments.vue';
import BlogTags from '@/views/pages/content/blogs/blog-tags.vue';
import LocationIndex from '@/views/pages/content/location/location-index.vue';
import CountriesList from '@/views/pages/content/location/countries-list.vue';
import StatesList from '@/views/pages/content/location/states-list.vue';
import CitiesList from '@/views/pages/content/location/cities-list.vue';
import TestimonialsList from '@/views/pages/content/testimonials-list.vue';
import FaqList from '@/views/pages/content/faq-list.vue';
import ReportsIndex from '@/views/pages/administration/reports/reports-index.vue';
import ExpensesReport from '@/views/pages/administration/reports/expenses-report.vue';
import InvoiceReport from '@/views/pages/administration/reports/invoice-report.vue';
import PaymentReport from '@/views/pages/administration/reports/payment-report.vue';
import ProjectReport from '@/views/pages/administration/reports/project-report.vue';
import TaskReport from '@/views/pages/administration/reports/task-report.vue';
import UserReport from '@/views/pages/administration/reports/user-report.vue';
import EmployeeReport from '@/views/pages/administration/reports/employee-report.vue';
import PayslipReport from '@/views/pages/administration/reports/payslip-report.vue';
import AttendanceReport from '@/views/pages/administration/reports/attendance-report.vue';
import LeaveReport from '@/views/pages/administration/reports/leave-report.vue';
import DailyReport from '@/views/pages/administration/reports/daily-report.vue';
import InterviewsList from '@/views/pages/recruitment/interviews/interviews-list.vue';
import InterviewsDetails from '@/views/pages/recruitment/interviews/interviews-details.vue';
import employeeSite from '@/views/pages/hrm/employees/employee-sites.vue';
import lookupList from '@/views/pages/administration/lookups/lookup-list.vue';  
import departmentPositionList from '@/views/pages/administration/department-position/department-position-list.vue';

const routes = [
  // Public routes
  {
    path: '/login',
    name: 'login',
    component: LoginIndex,
    meta: {
        title: 'Login'
    }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: forgotPassword,
    meta: {
        title: 'Forgot Password'
    }
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: resetPassword,
    meta: {
        title: 'Reset Password'
    }
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: UnauthorizedPage,
    meta: {
        title: 'Unauthorized Access'
    }
  },

  // Protected routes
  {
    path: '/dashboard/admin-dashboard',
    name: 'admin-dashboard',
    component: adminDashboard,
    beforeEnter: roleGuard(['admin']),
    meta: {
      requiresAuth: true,
      title: 'Admin Dashboard'
    }
  },
  {
    path: '/dashboard/employee-dashboard',
    name: 'employee-dashboard',
    component: employeeDashboard,
    beforeEnter: roleGuard(['employee', 'hr-manager', 'admin', 'hr-assistant']),
    meta: {
      requiresAuth: true,
      title: 'Employee Dashboard'
    }

  },
  {
    path: '/dashboard/deals-dashboard',
    name: 'deals-dashboard',
    component: dealsDashboard,
    beforeEnter: roleGuard(['hr-manager', 'admin']),
    meta: {
      requiresAuth: true,
      title: 'Deals Dashboard'
    }

  },
  {
    path: '/dashboard/hr-manager-dashboard',
    name: 'hr-manager-dashboard',
    component: hrManagerDashboard,
    beforeEnter: roleGuard(['hr-manager', 'admin']),
    meta: {
      requiresAuth: true,
      title: 'HR Manager Dashboard'
    }
  },
  {
    path: '/dashboard/hr-assistant-dashboard',
    name: 'hr-assistant-dashboard',
    component: hrAssistantDashboard,
    beforeEnter: roleGuard(['hr-assistant', 'hr-manager' ,'admin']),
    meta: {
      requiresAuth: true,
      title: 'HR Assistant Dashboard'
    }
  },

  // Default redirect
  {
    path: '/',
    redirect: () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const userRole = localStorage.getItem('userRole')?.toLowerCase();
      
      if (user && userRole) {
        switch (userRole) {
          case 'admin':
            return '/dashboard/admin-dashboard';
          case 'hr-manager':
            return '/dashboard/hr-manager-dashboard';
          case 'hr-assistant':
            return '/dashboard/hr-assistant-dashboard';
          case 'employee':
            return '/dashboard/employee-dashboard';
          default:
            return '/login';
        }
      }
      return '/login';
    }
  },
  {
    path: '/website-settings',
    component: websiteSettings,
    children: [
      { path: '', redirect: '/website-settings/bussiness-settings' },
      { path: "bussiness-settings", component: bussinessSettings },
      { path: "seo-settings", component: seoSettings },
      { path: "localization-settings", component: localizationSettings },
      { path: "prefixes", component: prefixes },
      { path: "preferences", component: preferences },
      { path: "appearance", component: appearance },
      { path: "language", component: language },
      { path: "add-language", component: addLanguage },
      { path: "language-web", component: languageWeb },
      { path: "authentication-settings", component: authenticationSettings },
      { path: "ai-settings", component: aiSettings },
    ]
  },
  {
    path: '/others-settings',
    component: othersSettings,
    children: [
      { path: '', redirect: '/others-settings/custom-css' },
      { path: "custom-css", component: customCss },
      { path: "custom-js", component: customJs },
      { path: "cronjob", component: cronJob },
      { path: "cronjob-schedule", component: cronjobSchedule },
      { path: "storage-settings", component: storageSettings },
      { path: "ban-ip-address", component: banIpAddress },
      { path: "backup", component: backupSettings },
      { path: "clear-cache", component: clearCache },
    ]
  },
  {
    path: '/financial-settings',
    component: financialSettings,
    children: [
      { path: '', redirect: '/financial-settings/payment-gateways' },
      { path: "payment-gateways", component: paymentGateway },
      { path: "tax-rates", component: taxRates },
      { path: "currencies", component: currenciesSettings },
    ]
  },
  {
    path: '/system-settings',
    component: systemSettings,
    children: [
      { path: '', redirect: '/system-settings/email-settings' },
      { path: "otp-settings", component: otpSettings },
      { path: "email-settings", component: emailSettings },
      { path: "email-template", component: emailTemplate },
      { path: "sms-settings", component: smsSettings },
      { path: "sms-template", component: smsTemplate },
      { path: "gdpr", component: gdprSettings },
      { path: "maintenance-mode", component: maintenanceMode },
    ]
  },
  {
    path: '/app-settings',
    component: appSettings,
    children: [
      { path: '', redirect: '/app-settings/salary-settings' },
      { path: "salary-settings", component: salarySettings },
      { path: "leave-type", component: leaveType },
      { path: "approval-settings", component: approvalSettings },
      { path: "invoice-settings", component: invoiceSettings },
      { path: "custom-fields", component: customFields },
    ]
  },
  {
    path: '/general-settings',
    component: generalSettings,
    children: [
      { path: '', redirect: '/general-settings/profile-settings' },
      { path: "profile-settings", component: profileSettings },
      { path: "security-settings", component: securitySettings },
      { path: "notification-settings", component: notificationSettings },
      { path: "connected-apps", component: connectedApps },
    ]
  },

  {
    path: '/lookups',
    component: lookupList,
    beforeEnter: roleGuard(['admin']),
    meta: {
      requiresAuth: true,
      title: 'Lookups'
    },
    children: [
      { path: '', redirect: '/lookups/lookup-list' },
      { path: "lookup-list", component: lookupList }
    ]
  },

  {
    path: '/department-positions',
    component: departmentPositionList,
    beforeEnter: roleGuard(['admin']),
    meta: {
      requiresAuth: true,
      title: 'Department Positions'
    },
    children: [
      { path: '', redirect: '/department-positions/department-position-list' },
      { path: "department-position-list", component: departmentPositionList }
    ]
  }, 
  
  {
    path: '/user-management',
    component: userManagement,
    beforeEnter: roleGuard(['admin']),
    meta: {
      requiresAuth: true,
      title: 'User Management'
    },
    children: [
      { path: '', redirect: '/user-management/users' },
      { path: "users", component: userList },
      { path: "roles-permissions", component: rolesPermissions },
      { path: "permission", component: permissionIndex },
    ]
  },
  {
    path: '/supports',
    component: helpSupports,
    children: [
      { path: '', redirect: '/supports/knowledgebase' },
      { path: "knowledgebase", component: knowledgebaseIndex },
      { path: "knowledgebase-view", component: knowledgebaseView },
      { path: "knowledgebase-details", component: knowledgebaseDetails },
    ]
  },
  {
    path: '/asset',
    component: assetsIndex,
    children: [
      { path: '', redirect: '/asset/assets' },
      { path: "assets", component: assetsList },
      { path: "asset-categories", component: assetsCategories },
    ]
  },
  {
    path: '/layouts',
    component: layoutIndex,
    children: [
      { path: '', redirect: '/layouts/layout-horizontal' },
      { path: "layout-horizontal", component: layoutHorizontal },
      { path: "layout-detached", component: layoutDetached },
      { path: "layout-modern", component: layoutModern },
      { path: "layout-two-column", component: layoutTwocolum },
      { path: "layout-hovered", component: layoutHovered },
      { path: "layout-box", component: layoutBox },
      { path: "layout-horizontal-single", component: layoutHorizontalSingle },
      { path: "layout-horizontal-overlay", component: layoutHorizontalOverlay },
      { path: "layout-horizontal-box", component: layoutHorizontalBox },
      { path: "layout-horizontal-sidemenu", component: layoutHorizontalSidemenu },
      { path: "layout-vertical-transparent", component: layoutVerticalTransparent },
      { path: "layout-without-header", component: layoutWithoutHeader },
      { path: "layout-rtl", component: layoutRtl },
      { path: "layout-dark", component: layoutDark },
    ]
  },
  {
    path: '/pages',
    component: pagesIndex,
    children: [
      { path: '', redirect: '/pages/starter' },
      { path: "starter", component: starterIndex },
      { path: "profile", component: profileIndex },
      { path: "gallery", component: galleryIndex },
      { path: "search-result", component: searchResult },
      { path: "timeline", component: timelineIndex },
      { path: "pricing", component: pricingIndex },
      { path: "coming-soon", component: comingSoon },
      { path: "under-maintenance", component: underMaintenance },
      { path: "under-construction", component: underConstruction },
      { path: "api-keys", component: apiKeys },
      { path: "terms-condition", component: termsCondition },
      { path: "privacy-policy", component: privacyPolicy },
    ]
  },
  {
    path: '/payroll',
    component: payrollIndex,
    children: [
      { path: '', redirect: '/payroll/employee-salary' },
      { path: "employee-salary", component: employeeSalary },
      { path: "payslip", component: payslipIndex },
      { path: "payroll", component: payrollAdditions },
      { path: "payroll-overtime", component: payrollOvertime },
      { path: "payroll-deduction", component: payrollDeduction },
    ]
  },
  {
    path: '/accounting',
    component: accountingIndex,
    children: [
      { path: '', redirect: '/accounting/budgets' },
      { path: "budgets", component: budgetsIndex },
      { path: "budget-expenses", component: budgetsExpenses },
      { path: "budget-revenues", component: budgetsRevenues },
      { path: "categories", component: CategoriesList },
    ]
  },
  {
    path: '/content',
    component: ContentIndex,
    children: [
      { path: '', redirect: '/content/pages' },
      { path: "pages", component: PagesList },
      { path: "testimonials", component: TestimonialsList },
      { path: "faq", component: FaqList },
    ]
  },
  {
    path: '/reports',
    component: ReportsIndex,
    children: [
      { path: '', redirect: '/reports/expenses-report' },
      { path: "expenses-report", component: ExpensesReport },
      { path: "invoice-report", component: InvoiceReport },
      { path: "payment-report", component: PaymentReport },
      { path: "project-report", component: ProjectReport },
      { path: "task-report", component: TaskReport },
      { path: "user-report", component: UserReport },
      { path: "employee-report", component: EmployeeReport },
      { path: "payslip-report", component: PayslipReport },
      { path: "attendance-report", component: AttendanceReport },
      { path: "leave-report", component: LeaveReport },
      { path: "daily-report", component: DailyReport },
    ]
  },
  {
    path: '/location',
    component: LocationIndex,
    children: [
      { path: '', redirect: '/location/countries' },
      { path: "countries", component: CountriesList },
      { path: "states", component: StatesList },
      { path: "cities", component: CitiesList },
    ]
  },
  {
    path: '/blog',
    component: BlogsIndex,
    children: [
      { path: '', redirect: '/blog/blogs' },
      { path: "blogs", component: BlogsGrid },
      { path: "blog-categories", component: BlogCategories },
      { path: "blog-comments", component: BlogComments },
      { path: "blog-tags", component: BlogTags },
    ]
  },
  {
    path: '/sales',
    component: SalesIndex,
    children: [
      { path: '', redirect: '/sales/estimates' },
      { path: "estimates", component: EstimatesList },
      { path: "invoices", component: InvoicesList },
      { path: "add-invoices", component: AddInvoices },
      { path: "edit-invoices", component: EditInvoices },
      { path: "invoice-details", component: InvoiceDetails },
      { path: "payments", component: PaymentsList },
      { path: "expenses", component: ExpensesList },
      { path: "provident-fund", component: ProvidentFund },
      { path: "taxes", component: TaxesList },
    ]
  },
  {
    path: '/recruitment',
    component: RecruitmentIndex,
    beforeEnter: roleGuard(['hr-assistant', 'hr-manager', 'admin']),
    meta: {
      requiresAuth: true,
      title: 'Recruitment'
    },
    children: [
      { path: '', redirect: '/recruitment/job-list' },
      { path: "job-grid", component: JobGrid },
      { path: "job-list", component: JobList },
      { path: "candidates-grid", component: CandidatesGrid },
      { path: "candidates-list", component: CandidatesList },
      { path: "candidates-kanban", component: CandidatesKanban },
      { path: "refferals", component: RefferalsList },
      { path: "references", component: ReferencesList },
      { path: "interviews-list", component: InterviewsList },
      { path: "interviews-details", component: InterviewsDetails },
    ]
  },
  {    
    path: '/hrm',
    component: HrmIndex,
    children: [
      { path: '', redirect: '/hrm/holidays' },
      { path: "holidays", component: HolidaysList },
      { path: "promotion", component: PromotionList }, 
      { path: "resignation", component: ResignationList }, 
      { path: "termination", component: TerminationList }, 
    ]
  },
  {    
    path: '/training',
    component: TrainingIndex,
    children: [
      { path: '', redirect: '/training/training-list' },
      { path: "training-list", component: TrainingList },
      { path: "trainers", component: TrainersList },
      { path: "training-type", component: TrainingType },
    ]
  },
  {    
    path: '/performance',
    component: PerformanceIndex,
    children: [
      { path: '', redirect: '/performance/performance-indicator' },
      { path: "performance-indicator", component: PerformanceIndicator },
      { path: "performance-review", component: PerformanceReview },
      { path: "performance-appraisal", component: PerformanceAppraisal },
      { path: "goal-tracking", component: GoalTracking },
      { path: "goal-type", component: GoalType },
    ]
  },
  {
    path: '/attendance',
    component: AttendanceIndex,
    children: [
      { path: '', redirect: '/attendance/attendance-admin' },
      { path: "attendance-admin", component: AttendanceAdmin },
      { path: "attendance-employee", component: AttendanceEmployee },
      { path: "timesheets", component: TimesheetsList },
      { path: "schedule-timing", component: ScheduleTiming },
      { path: "overtime", component: OvertimeList }      
    ]
  },
  {
    path: '/leave/admin',
    component: LeaveIndex,
    beforeEnter: roleGuard(['hr-assistant', 'hr-manager', 'admin']),
    meta: {
      requiresAuth: true,
      title: 'Leave Management'
    },
    children: [
      { path: '', redirect: '/leave/admin/leaves-admin' },
      { path: "leaves-admin", component: LeavesAdmin },
      { path: "leave-settings", component: LeaveSettings },
    ]
  },
  {
    path: '/leave/employee', 
    component: LeaveIndex,
    beforeEnter: roleGuard(['employee']),
    meta: {
      requiresAuth: true,
      title: 'My Leave'
    },
    children: [
      { path: '', redirect: '/leave/employee/leaves-employee' },
      { path: "leaves-employee", component: LeavesEmployee },
    ]

  },
  {
    path: '/tickets',
    component: ticketsIndex,
    children: [
      { path: '', redirect: '/tickets/ticket' },
      { path: "ticket", component: ticketList },
      { path: "tickets-grid", component: ticketsGrid },
      { path: "tickets-details", component: ticketsDetails },
    ]
  },
  {
    path: '/employee',
    component: employeesIndex,
    beforeEnter: roleGuard(['hr-assistant', 'hr-manager', 'admin']),
    meta: {
      requiresAuth: true,
      title: 'Employee'
    },
    children: [
      { path: '', redirect: '/employee/employee-list' },
      { path: "employee-list", component: employeesList },
      { path: "employee-grid", component: employeesGrid },
      // Updated route with dynamic parameter
      { path: "employee-details/:id", component: employeeDetails },
      { path: "departments", component: employeeDepartment },
      { path: "positions", component: employeePositions },
      { path: "policy", component: employeePolicy },
      { path: "site", component: employeeSite },
    ]
  },
  {
    path: '/crm',
    component: crmIndex,
    children: [
      { path: '', redirect: '/crm/deals-grid' },
      { path: "deals-grid", component: dealsGrid },
      { path: "deals-list", component: dealsList },
      { path: "deals-details", component: dealsDetails },
      { path: "leads-grid", component: leadsGrid },
      { path: "leads-list", component: leadsList },
      { path: "leads-details", component: leadsDetails },
      { path: "contacts-grid", component: ContactsGrid },
      { path: "contacts", component: ContactsList },
      { path: "contact-details", component: ContactDetails },
      { path: "companies-grid", component: CrmCompaniesGrid },
      { path: "companies-crm", component: Crmcompanies },
      { path: "companies-details", component: companiesDetails },
      { path: "pipeline", component: pipelineList },
      { path: "analytics", component: AnalyticsList },
      { path: "activity", component: ActivityList },
    ]
  },
  {
    path: '/projects',
    component: projectsIndex,
    children: [
      { path: '', redirect: '/projects/client-grid' },
      { path: "clients-grid", component: clientsGrid },
      { path: "clients", component: clientsList },
      { path: "clients-details", component: clientsDetails },
      { path: "projects-grid", component: projectGrid },
      { path: "projects-list", component: projectList },
      { path: "projects-details", component: projectDetails },
      { path: "tasks", component: TasksIndex },
      { path: "task-board", component: TaskBoard },
      { path: "task-details", component: TaskDetails },
    ]
  },
  {
    path: '/super-admin',
    component: superAdmin,
    children: [
      { path: '', redirect: '/super-admin/dashboard' },
      { path: "dashboard", component: superDashboard },
      { path: "companies", component: companiesList },
      { path: "subscription" , component: superSubscription },
      { path: "packages" , component: packagesList },
      { path: "packages-grid" , component: packagesGrid },
      { path: "domain" , component: domainList },
      { path: "purchase-transaction" , component: purchaseTransaction }
    ]
  },
  {
    path: '/applications',
    component: applicationIndex,
    children: [
      { path: '', redirect: '/applications/chat' },
      { path: "chat", component: chatIndex },
      { path: "events", component: calendarIndex },
      { path: "email", component: emailIndex },
      { path: "email-reply", component: emailReply },
      { path: "todo", component: todoIndex },
      { path: "todo-list", component: todoList },
      { path: "notes", component: notesIndex },
      { path: "social-feed", component: socialFeed },
      { path: "invoices", component: invoicesApp },
      { path: "add-invoices", component: addInvoices },
      { path: "edit-invoices", component: editInvoices },
      { path: "invoice-details", component: invoiceDetails },
      { path: "file-manager", component: fileManager },
      { path: "kanban-view", component: kanbanView },
    ]
  },
  {
    path: '/calls',
    component: applicationIndex,
    children: [
      { path: '', redirect: '/calls/voice-call' },
      { path: "voice-call", component: voiceCall },
      { path: "video-call", component: videoCall },
      { path: "outgoing-call", component: outgoingCall },
      { path: "incoming-call", component: incomingCall },
      { path: "call-history", component: callHistory },
    ]
  },
  {
    path: '/dashboard',
    component: dashboardIndex,
    children: [
      { path: '', redirect: '/dashboard/admin-dashboard' },
      { path: "admin-dashboard", component: adminDashboard },
      { path: "employee-dashboard", component: employeeDashboard },
      { path: "deals-dashboard", component: dealsDashboard },
      { path: "leads-dashboard", component: leadsDashboard },
    ]
  },
  {
    path: '/icons',
    component: Icons,
    children: [
      { path: '', redirect: '/icons/icon-fontawesome' },
      { path: "icon-fontawesome", component: UI_Iconfontawesome },
      { path: "icon-feather", component: UI_Iconfeather },
      { path: "icon-ionic", component: UI_Iconionic },
      { path: "icon-material", component: UI_Iconmaterial },
      { path: "icon-pe7", component: UI_Iconpe7 },
      { path: "icon-simpleline", component: UI_Iconsimpleline },
      { path: "icon-themify", component: UI_Iconthemify },
      { path: "icon-weather", component: UI_Iconweather },
      { path: "icon-typicon", component: UI_Icontypicon },
      { path: "icon-flag", component: UI_Iconflag },
    ]
  },
  {
    path: '/baseui',
    component: BaseUi,
    children: [
      { path: '', redirect: '/baseui/ui-alerts' },
      { path: "ui-alerts", component: UI_Alerts },
      { path: "ui-accordion", component: UI_Accordion },
      { path: "ui-avatar", component: UI_Avatar },
      { path: "ui-badges", component: UI_Badges },
      { path: "ui-borders", component: UI_Borders },
      { path: "ui-buttons", component: UI_Buttons },
      { path: "ui-buttons-group", component: UI_Buttons_group },
      { path: "ui-breadcrumb", component: UI_Breadcrumb },
      { path: "ui-cards", component: UI_Cards },
      { path: "ui-carousel", component: UI_Carousel },
      { path: "ui-colors", component: UI_Colors },
      { path: "ui-dropdowns", component: UI_Dropdowns },
      { path: "ui-grid", component: UI_Grid },
      { path: "ui-images", component: UI_Images },
      { path: "ui-lightbox", component: UI_Lightbox},
      { path: "ui-media", component: UI_Media},
      { path: "ui-modals", component: UI_Modals},
      { path: "ui-offcanvas", component: UI_Offcanvas},
      { path: "ui-pagination", component: UI_Pagination},
      { path: "ui-popovers", component: UI_Popovers},
      { path: "ui-progress", component: UI_Progress},
      { path: "ui-placeholders", component: UI_Placeholders},
      { path: "ui-nav-tabs", component: Ui_Navtabs},
      { path: "ui-spinner", component: UI_Spinner},
      { path: "ui-sweetalerts", component: UI_Sweetalerts},
      { path: "ui-tooltips", component: UI_Tooltips},
      { path: "ui-typography", component: UI_Typography},
      { path: "ui-video", component: UI_Video},
    ]
  },
  {
    path: '/advancedui',
    component: Advancedui,
    children: [
      { path: '', redirect: '/advancedui/ui-ribbon' },
      { path: "ui-ribbon", component: UI_Ribbon },
      { path: "ui-clipboard", component: UI_Clipboard },
      { path: "ui-drag-drop", component: UI_Drag_Drop },
      { path: "ui-text-editor", component: UI_Text_Editor },
      { path: "ui-counter", component: UI_Counter },
      { path: "ui-scrollbar", component: UI_Scrollbar },
      { path: "ui-rating", component: UI_Rating },
      { path: "ui-stickynote", component: UI_Stickynote },
      { path: "ui-rangeslider", component: UI_Rangeslider},
      { path: "ui-timeline", component: UI_Timeline }
    ]
  },
  {
    path: '/tables',
    component: Tables,
    children: [
      { path: '', redirect: '/tables/data-tables' },
      { path: "data-tables", component: Data_Tables },
      { path: "tables-basic", component: Tables_Basic }
    ]
  },
  {
    path: '/charts',
    component: Charts,
    children: [
      { path: '', redirect: '/charts/chart-apex' },
      { path: "chart-apex", component: Chartapex },
      { path: "chart-c3", component: Chartc3 },
      { path: "chart-flot", component: Chartflot },
      { path: "chart-js", component: Chartjs },
      { path: "chart-morris", component: Chartmorris }
    ]
  },
  {
    path: '/form-elements',
    component: FormElements,
    children: [
      { path: '', redirect: '/form-elements/form-basic-inputs' },
      { path: "form-basic-inputs", component: Formbasicinput },
      { path: "form-checkbox-radios", component: Formcheckboxradios },
      { path: "form-grid-gutters", component: Formgridgutters },
      { path: "form-input-groups", component: FormInput },
      { path: "form-select", component: Formselect },
      { path: "form-mask", component: Formmask },
      { path: "form-fileupload", component: Formfileupload },
    ]
  },
  {
    path: '/form-layouts',
    component: FormLayouts,
    children: [
      { path: '', redirect: '/form-layouts/form-horizontal' },
      { path: "form-horizontal", component: FormHorizontal },
      { path: "form-vertical", component: Formvertical },
      { path: "form-floating-labels", component: Formfloatinglabels },
    ]
  },
  {
    path: '/forms',
    component: Forms,
    children: [
      { path: '', redirect: '/forms/form-validation' },
      { path: "form-validation", component: Formvalidation },
      { path: "form-select2", component: Formselect2 },
      { path: "form-wizard", component: Formwizard },
    ]
  },
  {
    path: '/grant',
    component: grantIndex,
    beforeEnter: roleGuard(['admin', 'hr-manager', 'hr-assistant']),
    children: [
      { path: '', redirect: '/grant/list' },
      { 
        path: 'list',
        component: grantList,
        meta: { 
          title: 'Grants',
          requiresAuth: true,
          roles: ['admin', 'hr-manager']
        }
      },
      { 
        path: 'details/:id',
        component: grantDetails,
        meta: { 
          title: 'Grant Details',
          requiresAuth: true,
          roles: ['admin', 'hr-manager']
        }
      }, 
      {
        path: 'grant-position',
        component: grantPositionList,
        meta: { 
          title: 'Grant Position',
        }
      }
    ]
  },
  {
    path: '/requests/travel/admin',
    component: travelRequestIndex,
    beforeEnter: roleGuard(['admin', 'hr-manager', 'hr-assistant']),
    meta: {
      requiresAuth: true,
      title: 'Travel Requests Admin'
    },
    children: [
      { 
        path: '', 
        component: () => import('@/views/pages/requests/travel/travel-admin.vue'),
        meta: {
          title: 'Travel Requests Admin'
        }
      },
      { path: ':id', component: travelRequestDetails }
    ]
  },
  {
    path: '/requests/travel',
    component: travelRequestIndex, 
    beforeEnter: roleGuard(['employee', 'hr-manager', 'hr-assistant']),
    meta: {
      requiresAuth: true,
      title: 'Travel Requests'
    },

    children: [
      { path: '', component: travelRequestList },
      { path: ':id', component: travelRequestDetails }
    ]
  },
];
export const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    linkActiveClass: 'active',
    routes,
}); 

// Title handling
router.afterEach((to) => {
    // Handle RTL layout
    if (to.name === "layout-rtl") {
        document.body.classList.add("layout-mode-rtl");
    } else {
        document.body.classList.remove("layout-mode-rtl");
    }

    // Update page title
    const defaultTitle = 'HRMS';
    let title = to.meta.title || defaultTitle;
    
    // If you want to always include the default title
    if (to.meta.title) {
        document.title = `${title} - ${defaultTitle}`;
    } else {
        document.title = defaultTitle;
    }
});

// Scroll behavior
router.beforeEach((to, from, next) => {
    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    next();
});

// Global navigation guard
router.beforeEach(authGuard);

export default router;