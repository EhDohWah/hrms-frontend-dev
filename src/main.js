import { createApp } from 'vue';
import { router } from './router';
import App from "./App.vue";
import {BootstrapVue3, BToastPlugin} from 'bootstrap-vue-3'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import VueFeather from 'vue-feather';
import FlagIcon from 'vue-flag-icon';
import VueSweetalert2 from 'vue-sweetalert2' 
import 'sweetalert2/dist/sweetalert2.min.css'
import VueApexCharts from "vue3-apexcharts"; 
import StarRating from 'vue-star-rating'
import VueFormWizard from "vue3-form-wizard";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import VueSelect from 'vue3-select2-component'
import DatePicker from 'vue3-datepicker'
import VCalendar from 'v-calendar';
import ThemifyIcon from "vue-themify-icons";
import { IconHome } from '@tabler/icons-vue';
import Vue3TagsInput from "vue3-tags-input";
import VueEasyLightbox from "vue-easy-lightbox";
import CKEditor from '@ckeditor/ckeditor5-vue';
import SimpleLineIcons from "vue-simple-line";
import CircleProgress from "vue3-circle-progress";
import "vue3-circle-progress/dist/circle-progress.css";
import { createPinia } from 'pinia';

/***********Layout Components **********/
import Layout_Header from '@/views/layouts/layout-header.vue';
import Layout_Sidebar from '@/views/layouts/layout-sidebar.vue';
import Horizontal_Header from '@/views/layouts/horizontal-header.vue';
import Two_Sidebar from '@/views/layouts/two-sidebar.vue';
import Stacked_Sidebar from '@/views/layouts/stacked-sidebar.vue';
import Theme_Settings from '@/views/layouts/theme-settings.vue';
import SidebarMenu from '@/views/layouts/sidebar-menu.vue';
import themeColor from '@/views/layouts/theme-color.vue';

/************Breadcrumb********************/

import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';


/************Page Components********************/

import employeeStatus from '@/views/pages/dashboard/admin-dashboard/employee-status.vue';
import jobApplicants from '@/views/pages/dashboard/admin-dashboard/job-applicants.vue';
import projectTable from '@/views/pages/dashboard/admin-dashboard/project-table.vue';
import salesOverview from '@/views/pages/dashboard/admin-dashboard/sales-overview.vue';
import schedulesIndex from '@/views/pages/dashboard/admin-dashboard/schedules-index.vue';
import welcomeWrap from '@/views/pages/dashboard/admin-dashboard/welcome-wrap.vue';
import welcomeHrManager from '@/views/pages/dashboard/hr-manager-dashboard/welcome-hr-manager.vue';
import countryDeals from '@/views/pages/dashboard/deals-dashboard/country-deals.vue';
import dealsStages from '@/views/pages/dashboard/deals-dashboard/deals-stages.vue';
import recentDeals from '@/views/pages/dashboard/deals-dashboard/recent-deals.vue';
import totalDeals from '@/views/pages/dashboard/deals-dashboard/total-deals.vue';
import employeeTop from '@/views/pages/dashboard/employee-dashboard/employee-top.vue';
import attendenceEmployee from '@/views/pages/dashboard/employee-dashboard/attendence-employee.vue';
import employeeTask from '@/views/pages/dashboard/employee-dashboard/employee-task.vue';
import employeePerformance from '@/views/pages/dashboard/employee-dashboard/employee-performance.vue';
import teamMember from '@/views/pages/dashboard/employee-dashboard/team-member.vue';
import leadsCountries from '@/views/pages/dashboard/leads-dashboard/leads-countries.vue';
import leadsReason from '@/views/pages/dashboard/leads-dashboard/leads-reason.vue';
import leadsRecent from '@/views/pages/dashboard/leads-dashboard/leads-recent.vue';
import leadsStages from '@/views/pages/dashboard/leads-dashboard/leads-stages.vue';
import totalLeads from '@/views/pages/dashboard/leads-dashboard/total-leads.vue';
import dealsBoard from '@/views/pages/crm/deals/deals-board.vue';
import leadsBoard from '@/views/pages/crm/leads/leads-board.vue';
import NotesCarousel from "@/views/pages/applications/notes-carousel.vue";
import socialImage from '@/views/pages/applications/social-image.vue';
import socialCarousel from '@/views/pages/applications/social-carousel.vue';
import recentFile from '@/views/pages/applications/file-manager/recent-file.vue';
import recentFolder from '@/views/pages/applications/file-manager/recent-folder.vue';
import recentVideo from '@/views/pages/applications/file-manager/recent-video.vue';
import allKanban from '@/views/pages/applications/kanban-view/all-kanban.vue';
import highKanban from '@/views/pages/applications/kanban-view/high-kanban.vue';
import lowKanban from '@/views/pages/applications/kanban-view/low-kanban.vue';
import mediumKanban from '@/views/pages/applications/kanban-view/medium-kanban.vue';

import settingsTab from '@/views/pages/administration/settings/settings-tab.vue';
import generalSidebar from '@/views/pages/administration/settings/general-settings/general-sidebar.vue';
import websiteSidebar from '@/views/pages/administration/settings/website-settings/website-sidebar.vue';
import appSidebar from '@/views/pages/administration/settings/app-settings/app-sidebar.vue';
import systemSidebar from '@/views/pages/administration/settings/system-settings/system-sidebar.vue';
import othersidebar from '@/views/pages/administration/settings/others-settings/others-sidebar.vue';
import financialSidebar from '@/views/pages/administration/settings/financial-settings/financial-sidebar.vue';

import Inputsize from "@/views/pages/uiinterface/forms/form-elements/formbasic/input-size.vue";
import Form_Validation_One from '@/views/pages/uiinterface/forms/form-validation-one.vue'
import Carouselthree from "@/views/pages/uiinterface/baseui/carousel/carousel-three.vue";
import Carouseltwo from "@/views/pages/uiinterface/baseui/carousel/carousel-two.vue";
import Carouselone from "@/views/pages/uiinterface/baseui/carousel/carousel-one.vue";
import LightBoxOne from "@/views/pages/uiinterface/baseui/lightbox/lightbox-one.vue";
import LightBoxTwo from "@/views/pages/uiinterface/baseui/lightbox/lightbox-two.vue";

import rtlemployeeStatus from '@/views/pages/layout/layout-rtl/rtl-employee-status.vue';
import rtljobApplicants from '@/views/pages/layout/layout-rtl/rtl-job-applicants.vue';
import rtlprojectTable from '@/views/pages/layout/layout-rtl/rtl-project-table.vue';
import rtlsalesOverview from '@/views/pages/layout/layout-rtl/rtl-sales-overview.vue';
import rtlschedulesIndex from '@/views/pages/layout/layout-rtl/rtl-schedules-index.vue';
import rtlwelcomeWrap from '@/views/pages/layout/layout-rtl/rtl-welcome-wrap.vue';

import PackagesTable from '@/views/pages/superadmin/packages/packages-table.vue';
import DomainTable from '@/views/pages/superadmin/domain/domain-table.vue';
import PurchaseTable from '@/views/pages/superadmin/purchase/purchase-table.vue';
import ContactsTable from '@/views/pages/crm/contacts/contacts-table.vue';
import CompanyTable from '@/views/pages/crm/companies/company-table.vue';
import PipelineTable from '@/views/pages/crm/pipeline/pipeline-table.vue';
import ActivityTable from '@/views/pages/crm/activity/activity-table.vue';
import HolidaysTable from '@/views/pages/hrm/holidays/holidays-table.vue';
import LeavesAdminTable from '@/views/pages/hrm/attendance/leaves/leaves-admin-table.vue';
import LeavesEmployeeTable from '@/views/pages/hrm/attendance/leaves/leaves-employee-table.vue';
import AttendenceAdminTable from '@/views/pages/hrm/attendance/attendance-admin-table.vue';
import AttendanceEmployeeTable from '@/views/pages/hrm/attendance/attendance-employee-table.vue';
import TimesheetsTable from '@/views/pages/hrm/attendance/timesheets-table.vue';
import ScheduleTimeTable from '@/views/pages/hrm/attendance/schedule-time-table.vue';
import OvertimeTable from '@/views/pages/hrm/attendance/overtime-table.vue';
import IndicatorTable from '@/views/pages/hrm/attendance/performance/indicator-table.vue';
import ReviewTable from '@/views/pages/hrm/attendance/performance/review-table.vue';
import GoalTrackingTable from '@/views/pages/hrm/attendance/performance/goal-tracking-table.vue';
import GoalTypeTable from '@/views/pages/hrm/attendance/performance/goal-type-table.vue';
import TrainingTable from '@/views/pages/hrm/attendance/training/training-table.vue';
import TrainersTable from '@/views/pages/hrm/attendance/training/trainers-table.vue';
import TrainingTypeTable from '@/views/pages/hrm/attendance/training/training-type-table.vue';
import PromotionTable from '@/views/pages/hrm/promotion/promotion-table.vue';
import ResignationTable from '@/views/pages/hrm/resignation/resignation-table.vue';
import TerminationTable from '@/views/pages/hrm/termination/termination-table.vue';
import JobTable from '@/views/pages/recruitment/jobs/job-table.vue';
import CandidatesTable from '@/views/pages/recruitment/candidates/candidates-table.vue';
import CandidatesBoard from '@/views/pages/recruitment/candidates/candidates-board.vue';
import RefferalsTable from '@/views/pages/recruitment/refferals/refferals-table.vue';
import ReferencesTable from '@/views/pages/recruitment/references/references-list.vue';
import EstimatesTable from '@/views/pages/finance-accounts/sales/estimates-table.vue';
import InvoicesTable from '@/views/pages/finance-accounts/sales/invoices-table.vue';
import PaymentsTable from '@/views/pages/finance-accounts/sales/payments-table.vue';
import ExpensesTable from '@/views/pages/finance-accounts/sales/expenses-table.vue';
import ProvidentTable from '@/views/pages/finance-accounts/sales/provident-table.vue';
import TaxesTable from '@/views/pages/finance-accounts/sales/taxes-table.vue';
import CategoriesTable from '@/views/pages/finance-accounts/accounting/categories-table.vue';
import PagesTable from '@/views/pages/content/pages-table.vue';
import BlogCategoriesTable from '@/views/pages/content/blogs/blog-categories-table.vue';
import BlogsCommentsTable from '@/views/pages/content/blogs/blogs-comments-table.vue';
import BlogTagsTable from '@/views/pages/content/blogs/blog-tags-table.vue';
import CountriesTable from '@/views/pages/content/location/countries-table.vue';
import StatesTable from '@/views/pages/content/location/states-table.vue';
import CitiesTable from '@/views/pages/content/location/cities-table.vue';
import TestimonialsTable from '@/views/pages/content/testimonials-table.vue';
import FaqTable from '@/views/pages/content/faq-table.vue';
import TaskBoardKanban from '@/views/pages/projects/task/task-board-kanban.vue';
import ExpensesReportTable from '@/views/pages/administration/reports/expenses-report-table.vue';
import InvoiceReportTable from '@/views/pages/administration/reports/invoice-report-table.vue';
import PaymentReportTable from '@/views/pages/administration/reports/payment-report-table.vue';
import ProjectReportTable from '@/views/pages/administration/reports/project-report-table.vue';
import TaskReportTable from '@/views/pages/administration/reports/task-report-table.vue';
import UserReportTable from '@/views/pages/administration/reports/user-report-table.vue';
import EmployeeReportTable from '@/views/pages/administration/reports/employee-report-table.vue';
import PayslipReportTable from '@/views/pages/administration/reports/payslip-report-table.vue';
import AttendanceReportTable from '@/views/pages/administration/reports/attendance-report-table.vue';
import LeaveReportTable from '@/views/pages/administration/reports/leave-report-table.vue';
import DailyReportTable from '@/views/pages/administration/reports/daily-report-table.vue';
import ProjectsImage from '@/views/pages/projects/project/projects-image.vue';
import SubscriptionTable from '@/views/pages/superadmin/subscription-table.vue';
import ProjectsTable from '@/views/pages/projects/project/projects-table.vue';
import clientTable from '@/views/pages/projects/clients/client-table.vue';

// Admin lookups
import lookupList from '@/views/pages/administration/lookups/lookup-list.vue';

// Admin department position
import departmentPositionList from '@/views/pages/administration/department-position/department-position-list.vue'; 

// Request Components
import travelRequestList from '@/views/pages/requests/travel/travel-list.vue';
import travelRequestDetails from '@/views/pages/requests/travel/travel-details.vue';

// Interview components 
import interviewsList from '@/views/pages/recruitment/interviews/interviews-list.vue';
import interviewsDetails from '@/views/pages/recruitment/interviews/interviews-details.vue';

// Grant components
import grantPositionModal from '@/components/modal/grant-position-modal.vue';


/************Modal********************/

import GrantModal from '@/components/modal/grant-modal.vue';
import GrantUploadModal from '@/components/modal/grant-upload-modal.vue';
import GrantModalUpdate from '@/components/modal/grant-modal-update.vue';     
import EmployeeUploadModal from '@/components/modal/employee-upload-modal.vue';

import CallHistoryModal from '@/components/modal/call-history-modal.vue';
import calendarModal from '@/components/modal/calendar-modal.vue';
import companiesModal from '@/components/modal/companies-modal.vue';
import companiesDetailsModal from '@/components/modal/companies-details-modal.vue';
import companiesCrmmodal from '@/components/modal/companies-crm-modal.vue';
import clientsListModal from '@/components/modal/clients-list-modal.vue'
import clientsDetailsModal from '@/components/modal/clients-details-modal.vue';
import projectGridModal from '@/components/modal/project-grid-modal.vue';
import projectDetailsModal from '@/components/modal/project-details-modal.vue';
import todoModal from '@/components/modal/todo-modal.vue';
import PurchaseModal from '@/components/modal/purchase-modal.vue';
import dealsGridModal from '@/components/modal/deals-grid-modal.vue';
import leadsModal from '@/components/modal/leads-modal.vue';
import dealsDetailsModal from '@/components/modal/deals-details-modal.vue';
import TasksModal from '@/components/modal/tasks-modal.vue';
import ContactsModal from '@/components/modal/contacts-modal.vue';
import ContactDetailsModal from '@/components/modal/contact-details-modal.vue';
import employeeListModal from '@/components/modal/employee-list-modal.vue';
import employeeDetailsModal from '@/components/modal/employee-details-modal.vue';
import departmentModal from '@/components/modal/department-modal.vue';
import designationsModal from '@/components/modal/designations-modal.vue';
import ticketDetailsModal from '@/components/modal/ticket-details-modal.vue';
import ticketsModal from '@/components/modal/tickets-modal.vue';
import budgetsModal from '@/components/modal/budgets-modal.vue';
import budgetsExpenseModal from '@/components/modal/budgets-expense-modal.vue';
import budgetsRevenuesModal from '@/components/modal/budgets-revenues-modal.vue';
import employeeSalaryModal from '@/components/modal/employee-salary-modal.vue';
import payrollModal from '@/components/modal/payroll-modal.vue';
import payrollDeductionModal from '@/components/modal/payroll-deduction-modal.vue';
import payrollOvertimeModal from '@/components/modal/payroll-overtime-modal.vue';
import assetsModal from '@/components/modal/assets-modal.vue';
import rolesModal from '@/components/modal/roles-modal.vue';
import CompanyDetailsModal from '@/components/modal/company-details-modal.vue';
import PipelineModal from '@/components/modal/pipeline-modal.vue';
import ActivityModal from '@/components/modal/activity-modal.vue';
import HolidaysModal from '@/components/modal/holidays-modal.vue';
import LeavesAdminModal from '@/components/modal/leaves-admin-modal.vue';
import LeavesEmployeeModal from '@/components/modal/leaves-employee-modal.vue';
import LeaveSettingsModal from '@/components/modal/leave-settings-modal.vue';
import AttendenceAdminModal from '@/components/modal/attendance-admin-modal.vue';
import AttendanceEmployeeModal from '@/components/modal/attendance-employee-modal.vue';
import TimesheetsModal from '@/components/modal/timesheets-modal.vue';
import leaveTypeModal from '@/components/modal/leave-type-modal.vue';
import customFieldsModal from '@/components/modal/custom-fields-modal.vue';
import emailModal from '@/components/modal/email-modal.vue';
import smsTemplateModal from '@/components/modal/sms-template-modal.vue';
import smsSettingsModal from '@/components/modal/sms-settings-modal.vue';
import taxRatesModal from '@/components/modal/tax-rates-modal.vue';
import currenciesModal from '@/components/modal/currencies-modal.vue';
import banModal from '@/components/modal/ban-modal.vue';
import backupModal from '@/components/modal/backup-modal.vue';
import clearModal from '@/components/modal/clear-modal.vue';
import ScheduleTimeModal from '@/components/modal/schedule-time-modal.vue';
import OvertimeModal from '@/components/modal/overtime-modal.vue';
import IndicatorModal from '@/components/modal/indicator-modal.vue';
import PerformanceAppraisalModal from '@/components/modal/performance-appraisal-modal.vue';
import TechnicalTable from '@/components/modal/technical-table.vue';
import OrganizationalTable from '@/components/modal/organizational-table.vue';
import GoalTrackingModal from '@/components/modal/goal-tracking-modal.vue';
import GoalTypeModal from '@/components/modal/goal-type-modal.vue';
import TrainingModal from '@/components/modal/training-modal.vue';
import TrainersModal from '@/components/modal/trainers-modal.vue';
import TrainingTypeModal from '@/components/modal/training-type-modal.vue';
import PromotionModal from '@/components/modal/promotion-modal.vue';
import apiKeysModal from '@/components/modal/api-keys-modal.vue';
import todoListModal from '@/components/modal/todo-list-modal.vue';
import notesModal from '@/components/modal/notes-modal.vue';
import ResignationModal from '@/components/modal/resignation-modal.vue';
import TerminationModal from '@/components/modal/termination-modal.vue';
import JobGridModal from '@/components/modal/job-grid-modal.vue';
import JobListModal from '@/components/modal/job-list-modal.vue';
import CandidatesGridModal from '@/components/modal/candidates-grid-modal.vue';
import CandidatesModal from '@/components/modal/candidates-modal.vue';
import CandidatesKanbanModal from '@/components/modal/candidates-kanban-modal.vue';
import EstimatesModal from '@/components/modal/estimates-modal.vue';
import InvoicesModal from '@/components/modal/invoices-modal.vue';
import ExpensesModal from '@/components/modal/expenses-modal.vue';
import ProvidentModal from '@/components/modal/provident-modal.vue';
import TaxesModal from '@/components/modal/taxes-modal.vue';
import CategoriesModal from '@/components/modal/categories-modal.vue';
import PagesModal from '@/components/modal/pages-modal.vue';
import BlogsModal from '@/components/modal/blogs-modal.vue';
import ContriesModal from '@/components/modal/contries-modal.vue';
import StatesModal from '@/components/modal/states-modal.vue';
import CitiesModal from '@/components/modal/cities-modal.vue';
import TestimonialsModal from '@/components/modal/testimonials-modal.vue';
import FaqModal from '@/components/modal/faq-modal.vue';
import policyModal from '@/components/modal/policy-modal.vue';
import adminDashboardModal from '@/components/modal/admin-dashboard-modal.vue';
import employeeDashboardModal from '@/components/modal/employee-dashboard-modal.vue';
import hrManagerDashboard from '@/views/pages/dashboard/hr-manager-dashboard/hr-manager-dashboard.vue';
import hrAssistantDashboard from '@/views/pages/dashboard/hr-assistant-dashboard/hr-assistant-dashboard.vue';
import PackagesModal from '@/components/modal/packages-modal.vue';
import DomainModal from '@/components/modal/domain-modal.vue';
import InterviewModal from '@/components/modal/interview-modal.vue';
import TravelEmployeeModal from '@/components/modal/travel-employee-modal.vue';

import fileManagerModal from '@/components/modal/file-manager-modal.vue';

import blogsTagsModal from '@/components/modal/blogs-tags-modal.vue';
import cronjobScheduleModal from '@/components/modal/cronjob-schedule-modal.vue';
import userListModal from '@/components/modal/user-list-modal.vue';

import grantPositionList from '@/views/pages/grant/grant-position-list.vue';

import employeeSite from '@/views/pages/hrm/employees/employee-sites.vue';


import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'ionicons-npm/css/ionicons.css';
import 'material-icons/css/material-icons.min.css';
import 'material-icons/css/material-icons.css';
import 'pe7-icon/dist/dist/pe-icon-7-stroke.css';
import 'typicons.font/src/font/typicons.css';
import 'weathericons/css/weather-icons.css'
import '@/assets/css/feather.css'
import '@/assets/css/sticky.css'
import '@/assets/css/tabler-icons.css'
import '@/assets/css/vue-form-wizard.css';
import "boxicons/css/boxicons.min.css";
import "v-calendar/dist/style.css";
import '@/assets/scss/main.scss'

import swal from 'sweetalert2';
window.Swal = swal;

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
/*Global Components */

/*************Layout *****************/
app.component('layout-header',Layout_Header)
app.component('layout-sidebar',Layout_Sidebar)
app.component('horizontal-header',Horizontal_Header)
app.component('two-sidebar',Two_Sidebar)
app.component('stacked-sidebar',Stacked_Sidebar)
app.component('theme-settings',Theme_Settings)
app.component('sidebar-menu', SidebarMenu)
app.component('theme-color', themeColor)


/*************Breadcrumb *****************/
app.component('index-breadcrumb', indexBreadcrumb)

/************Page Components********************/
app.component('employee-top',employeeTop)
app.component('attendence-employee',attendenceEmployee)
app.component('employee-task',employeeTask)
app.component('employee-performance',employeePerformance)
app.component('team-member',teamMember)
app.component('total-deals',totalDeals)
app.component('recent-deals',recentDeals)
app.component('deals-stages',dealsStages)
app.component('country-deals',countryDeals)
app.component('leads-countries',leadsCountries)
app.component('leads-reason',leadsReason)
app.component('leads-stages',leadsStages)
app.component('leads-recent',leadsRecent)
app.component('total-leads',totalLeads)
app.component('welcome-wrap',welcomeWrap)
app.component('welcome-hr-manager',welcomeHrManager)
app.component('schedules-index',schedulesIndex)
app.component('sales-overview',salesOverview)
app.component('project-table',projectTable)
app.component('job-applicants',jobApplicants)
app.component('employee-status',employeeStatus)
app.component('deals-board',dealsBoard)
app.component('leads-board',leadsBoard)
app.component('all-kanban',allKanban)
app.component('high-kanban',highKanban)
app.component('low-kanban',lowKanban)
app.component('medium-kanban',mediumKanban)

app.component('general-sidebar',generalSidebar)
app.component('website-sidebar',websiteSidebar)
app.component('app-sidebar',appSidebar)
app.component('system-sidebar',systemSidebar)
app.component('others-sidebar',othersidebar)
app.component('financial-sidebar',financialSidebar)
app.component('settings-tab',settingsTab)

app.component('packages-table', PackagesTable)
app.component('domain-table', DomainTable)
app.component('purchase-table', PurchaseTable)
app.component('contacts-table', ContactsTable)
app.component('company-table', CompanyTable)
app.component('pipeline-table', PipelineTable)
app.component('activity-table', ActivityTable)
app.component('holidays-table', HolidaysTable)
app.component('leaves-admin-table', LeavesAdminTable)
app.component('leaves-employee-table', LeavesEmployeeTable)
app.component('attendence-admin-table', AttendenceAdminTable)
app.component('attendence-employee-table', AttendanceEmployeeTable)
app.component('timesheets-table', TimesheetsTable)
app.component('schedule-time-table', ScheduleTimeTable)
app.component('overtime-table', OvertimeTable)
app.component('indicator-table', IndicatorTable)
app.component('review-table', ReviewTable)
app.component('goal-tracking-table', GoalTrackingTable)
app.component('goal-type-table', GoalTypeTable)
app.component('trining-table', TrainingTable)
app.component('trainers-table', TrainersTable)
app.component('training-type-table', TrainingTypeTable)
app.component('promotion-table', PromotionTable)
app.component("notes-carousel", NotesCarousel);
app.component('social-image',socialImage)
app.component('social-carousel',socialCarousel)
app.component('recent-file',recentFile)
app.component('recent-folder',recentFolder)
app.component('recent-video',recentVideo)
app.component('resignation-table', ResignationTable)
app.component('termination-table', TerminationTable)
app.component('job-table', JobTable)
app.component('candidates-table', CandidatesTable)
app.component('candidates-board', CandidatesBoard)
app.component('refferals-table', RefferalsTable)
app.component('references-table', ReferencesTable)
app.component('estimates-table', EstimatesTable)
app.component('invoices-table', InvoicesTable)
app.component('payments-table', PaymentsTable)
app.component('expenses-table', ExpensesTable)
app.component('provident-table', ProvidentTable)
app.component('taxes-table', TaxesTable)
app.component('categories-table', CategoriesTable)
app.component('pages-table', PagesTable)
app.component('blog-categories-table', BlogCategoriesTable)
app.component('blogs-comments-table', BlogsCommentsTable)
app.component('blog-tags-table', BlogTagsTable)
app.component('countries-table', CountriesTable)
app.component('states-table', StatesTable)
app.component('cities-table', CitiesTable)
app.component('testimonials-table', TestimonialsTable)
app.component('faq-table', FaqTable)
app.component('task-board-kanban', TaskBoardKanban)
app.component('expenses-report-table', ExpensesReportTable)
app.component('invoice-report-table', InvoiceReportTable)
app.component('payment-report-table', PaymentReportTable)
app.component('project-report-table', ProjectReportTable)
app.component('task-report-table', TaskReportTable)
app.component('user-report-table', UserReportTable)
app.component('employee-report-table', EmployeeReportTable)
app.component('payslip-report-table', PayslipReportTable)
app.component('attendance-report-table', AttendanceReportTable)
app.component('leave-report-table', LeaveReportTable)
app.component('daily-report-table', DailyReportTable)
app.component('projects-image', ProjectsImage)
app.component('subscription-table', SubscriptionTable)
app.component('projects-table', ProjectsTable)
app.component('client-table', clientTable)
app.component('department-position-list', departmentPositionList)

app.component('hr-manager-dashboard', hrManagerDashboard)
app.component('hr-assistant-dashboard', hrAssistantDashboard)
app.component('travel-request-list', travelRequestList)
app.component('travel-request-details', travelRequestDetails)

app.component('rtl-welcome-wrap',rtlwelcomeWrap)
app.component('rtl-schedules-index',rtlschedulesIndex)
app.component('rtl-sales-overview',rtlsalesOverview)
app.component('rtl-project-table',rtlprojectTable)
app.component('rtl-job-applicants',rtljobApplicants)
app.component('rtl-employee-status',rtlemployeeStatus)

app.component("input-size", Inputsize);
app.component('form-validation-one',Form_Validation_One)
app.component("carousel-one", Carouselone);
app.component("carousel-two", Carouseltwo);
app.component("carousel-three", Carouselthree);
app.component("lightbox-one", LightBoxOne);
app.component("lightbox-two", LightBoxTwo);

app.component('interviews-list', interviewsList)
app.component('interviews-details', interviewsDetails)
app.component('grant-position-list', grantPositionList)
app.component('grant-position-modal', grantPositionModal)
app.component('employee-site', employeeSite)
app.component('lookup-list', lookupList)
/************Page Filter********************/


/************Modal********************/
app.component('call-history-modal',CallHistoryModal)
app.component('calendar-modal',calendarModal)
app.component('companies-modal',companiesModal)
app.component('companies-details-modal',companiesDetailsModal)
app.component('companies-crm-modal',companiesCrmmodal)
app.component('clients-list-modal',clientsListModal)
app.component('clients-details-modal',clientsDetailsModal)
app.component('project-grid-modal',projectGridModal)
app.component('project-details-modal',projectDetailsModal)
app.component('todo-modal',todoModal)
app.component('deals-grid-modal',dealsGridModal)
app.component('leads-modal',leadsModal)
app.component('deals-details-modal',dealsDetailsModal)
app.component('purchase-modal', PurchaseModal)
app.component('tasks-modal', TasksModal)
app.component('contacts-modal', ContactsModal)
app.component('contact-details-modal', ContactDetailsModal)
app.component('employee-list-modal',employeeListModal)
app.component('employee-details-modal',employeeDetailsModal)
app.component('department-modal',departmentModal)
app.component('designations-modal',designationsModal)
app.component('ticket-details-modal',ticketDetailsModal)
app.component('tickets-modal',ticketsModal)
app.component('budgets-modal',budgetsModal)
app.component('budgets-expense-modal',budgetsExpenseModal)
app.component('budgets-revenues-modal',budgetsRevenuesModal)
app.component('employee-salary-modal',employeeSalaryModal)
app.component('payroll-modal',payrollModal)
app.component('payroll-deduction-modal',payrollDeductionModal)
app.component('payroll-overtime-modal',payrollOvertimeModal)
app.component('assets-modal',assetsModal)
app.component('roles-modal',rolesModal)
app.component('company-details-modal', CompanyDetailsModal)
app.component('pipeline-modal', PipelineModal)
app.component('activity-modal', ActivityModal)
app.component('holidays-modal', HolidaysModal)
app.component('leaves-admin-modal', LeavesAdminModal)
app.component('leaves-employee-modal', LeavesEmployeeModal)
app.component('leave-settings-modal', LeaveSettingsModal)
app.component('attendence-admin-modal', AttendenceAdminModal)
app.component('attendance-employee-modal', AttendanceEmployeeModal)
app.component('timesheets-modal', TimesheetsModal)
app.component('leave-type-modal', leaveTypeModal)
app.component('custom-fields-modal',customFieldsModal)
app.component('email-modal',emailModal)
app.component('sms-template-modal',smsTemplateModal)
app.component('sms-settings-modal',smsSettingsModal)
app.component('tax-rates-modal',taxRatesModal)
app.component('currencies-modal',currenciesModal)
app.component('ban-modal',banModal)
app.component('backup-modal',backupModal)
app.component('clear-modal',clearModal)
app.component('schedule-time-modal', ScheduleTimeModal)
app.component('overtime-modal', OvertimeModal)
app.component('indicator-modal', IndicatorModal)
app.component('performance-appraisal-modal', PerformanceAppraisalModal)
app.component('technical-table', TechnicalTable)
app.component('organizational-table', OrganizationalTable)
app.component('goal-tracking-modal', GoalTrackingModal)
app.component('goal-type-modal', GoalTypeModal)
app.component('training-modal', TrainingModal)
app.component('trainers-modal', TrainersModal)
app.component('training-type-modal', TrainingTypeModal)
app.component('promotion-modal', PromotionModal)
app.component('api-keys-modal',apiKeysModal)
app.component('todo-list-modal',todoListModal)
app.component('notes-modal',notesModal)
app.component('resignation-modal', ResignationModal)
app.component('termination-modal', TerminationModal)
app.component('job-grid-modal', JobGridModal)
app.component('job-list-modal', JobListModal)
app.component('candidates-grid-modal', CandidatesGridModal)
app.component('candidates-modal', CandidatesModal)
app.component('candidates-kanban-modal', CandidatesKanbanModal)
app.component('estimates-modal', EstimatesModal)
app.component('invoices-modal', InvoicesModal)
app.component('expenses-modal', ExpensesModal)
app.component('provident-modal', ProvidentModal)
app.component('taxes-modal', TaxesModal)
app.component('categories-modal', CategoriesModal)
app.component('pages-modal', PagesModal)
app.component('blogs-modal', BlogsModal)
app.component('countries-modal', ContriesModal)
app.component('states-modal', StatesModal)
app.component('cities-modal', CitiesModal)
app.component('testimonials-modal', TestimonialsModal)
app.component('faq-modal', FaqModal)
app.component('policy-modal', policyModal)
app.component('admin-dashboard-modal', adminDashboardModal)
app.component('employee-dashboard-modal', employeeDashboardModal)
app.component('packages-modal', PackagesModal) 
app.component('domain-modal', DomainModal)
app.component('file-manager-modal', fileManagerModal)
app.component('blogs-tags-modal', blogsTagsModal)
app.component('cronjob-schedule-modal', cronjobScheduleModal)
app.component('user-list-modal', userListModal)
app.component('interview-modal', InterviewModal)
app.component('travel-employee-modal', TravelEmployeeModal)

app.component('grant-modal', GrantModal)
app.component('grant-upload-modal', GrantUploadModal)
app.component('grant-modal-update', GrantModalUpdate)
app.component('employee-upload-modal', EmployeeUploadModal)

app.component('vue-select', VueSelect);
app.component(VueFeather.name, VueFeather)
app.use(VueSweetalert2)
app.use(VueApexCharts)
app.component('star-rating', StarRating)
app.component('circle-progress',CircleProgress)
app.component('date-picker', DatePicker);
app.component('vue3-tags-input', Vue3TagsInput);
app.use(FlagIcon)
.use(Antd)
.use(VueEasyLightbox)
.use(VueFormWizard)
app.use(VCalendar)
.use(BootstrapVue3)
.use(BToastPlugin)
  .use(ThemifyIcon)
  .use(SimpleLineIcons)
app.component('IconHome', IconHome);
app.use(CKEditor);
app.use(router).mount('#app'); 

