import { createApp } from 'vue';
import { router } from './router';
import App from "./App.vue";
import { BootstrapVue3, BToastPlugin } from 'bootstrap-vue-3'
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
// Import themify icons CSS directly instead of the Vue component
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
import layoutFooter from '@/views/layouts/layout-footer.vue';

/************Breadcrumb********************/

import indexBreadcrumb from '@/components/breadcrumb/index-breadcrumb.vue';

// Recycle Bin components
import RecycleBinList from '@/views/pages/administration/recycle-bin/recycle-bin-list.vue';


/************Page Components********************/

import jobOffersList from '@/views/pages/recruitment/job-offers/job-offers-list.vue';
import reportList from '@/views/pages/administration/reports/report-list.vue';
import employmentList from '@/views/pages/hrm/employment/employment-list.vue';
import employeeStatus from '@/views/pages/dashboard/admin-dashboard/employee-status.vue';

import employeeListModal from '@/components/modal/employee-list-modal.vue';
import employeeDetailsModal from '@/components/modal/employee-details-modal.vue';

import welcomeWrap from '@/views/pages/dashboard/admin-dashboard/welcome-wrap.vue';
import welcomeHrManager from '@/views/pages/dashboard/hr-manager-dashboard/welcome-hr-manager.vue';
import welcomeHrAssistant from '@/views/pages/dashboard/hr-assistant-dashboard/welcome-hr-assistant.vue';

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
import EstimatesTable from '@/views/pages/finance-accounts/sales/estimates-table.vue';
import InvoicesTable from '@/views/pages/finance-accounts/sales/invoices-table.vue';
import PaymentsTable from '@/views/pages/finance-accounts/sales/payments-table.vue';
import ExpensesTable from '@/views/pages/finance-accounts/sales/expenses-table.vue';
import ProvidentTable from '@/views/pages/finance-accounts/sales/provident-table.vue';
import TaxesTable from '@/views/pages/finance-accounts/sales/taxes-table.vue';
import CategoriesTable from '@/views/pages/finance-accounts/accounting/categories-table.vue';
import PagesTable from '@/views/pages/content/pages-table.vue';

import PayslipReportTable from '@/views/pages/administration/reports/payslip-report-table.vue';
import AttendanceReportTable from '@/views/pages/administration/reports/attendance-report-table.vue';


// Reports components
import InterviewReport from '@/components/reports/interview-report.vue';
import JobOfferReport from '@/components/reports/joboffer-report.vue';
import ReportRow from '@/components/reports/report-row.vue';
import GrantHeadcountReport from '@/components/reports/grant-headcount-report.vue';

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
import grantAllocateEmployeeModal from '@/components/modal/grant-allocate-employee-modal.vue';
import employeeSalaryModal from '@/components/modal/employee-salary-modal.vue';
// Employee Training components
import employeeTrainingList from '@/views/pages/hrm/attendance/training/employee-training-list.vue';


/************Modal********************/
import jobOffersModal from '@/components/modal/job-offers-modal.vue';
import employeeTrainingModal from '@/components/modal/employee-training-modal.vue';
import GrantModal from '@/components/modal/grant-modal.vue';
import GrantUploadModal from '@/components/modal/grant-upload-modal.vue';
import GrantModalUpdate from '@/components/modal/grant-modal-update.vue';
import EmployeeUploadModal from '@/components/modal/employee-upload-modal.vue';


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
import taxSettingsModal from '@/components/modal/tax-settings-modal.vue';

import TrainingModal from '@/components/modal/training-modal.vue';
import TrainersModal from '@/components/modal/trainers-modal.vue';
import TrainingTypeModal from '@/components/modal/training-type-modal.vue';







import policyModal from '@/components/modal/policy-modal.vue';

import adminDashboardModal from '@/components/modal/admin-dashboard-modal.vue';
import employeeDashboardModal from '@/components/modal/employee-dashboard-modal.vue';




import hrManagerDashboard from '@/views/pages/dashboard/hr-manager-dashboard/hr-manager-dashboard.vue';
import hrAssistantDashboard from '@/views/pages/dashboard/hr-assistant-dashboard/hr-assistant-dashboard.vue';

import InterviewModal from '@/components/modal/interview-modal.vue';


import TravelEmployeeModal from '@/components/modal/travel-employee-modal.vue';
import userListModal from '@/components/modal/user-list-modal.vue';
import grantPositionList from '@/views/pages/grant/grant-position-list.vue';
import employeeSite from '@/views/pages/hrm/employees/employee-sites.vue';


import 'bootstrap/dist/css/bootstrap.min.css';
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
import '@/assets/css/font-display-override.css' // Font performance optimization
import '@/assets/css/vue-form-wizard.css';
import "boxicons/css/boxicons.min.css";
import "v-calendar/dist/style.css";
import '@/assets/scss/main.scss'


import swal from 'sweetalert2';
window.Swal = swal;

// Suppress benign ResizeObserver errors for performance optimization
const resizeObserverLoopErr = /^ResizeObserver loop (limit exceeded|completed with undelivered notifications)/;
window.addEventListener('error', (e) => {
    if (resizeObserverLoopErr.test(e.message)) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
        return false;
    }
});

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
/*Global Components */

import eventBus from './plugins/eventBus';

/*************Layout *****************/
app.component('layout-header', Layout_Header)
app.component('layout-sidebar', Layout_Sidebar)
app.component('horizontal-header', Horizontal_Header)
app.component('two-sidebar', Two_Sidebar)
app.component('stacked-sidebar', Stacked_Sidebar)
app.component('theme-settings', Theme_Settings)
app.component('sidebar-menu', SidebarMenu)
app.component('theme-color', themeColor)
app.component('layout-footer', layoutFooter)
app.component('employee-training-list', employeeTrainingList)
app.component('employee-training-modal', employeeTrainingModal)
app.component('employee-salary-modal', employeeSalaryModal)
/*************Breadcrumb *****************/
app.component('index-breadcrumb', indexBreadcrumb)

/************Reports Components********************/
app.component('interview-report', InterviewReport)
app.component('job-offer-report', JobOfferReport)
app.component('report-row', ReportRow)
app.component('grant-headcount-report', GrantHeadcountReport)

/************Page Components********************/



/************Virtual Scroller********************/
app.component('job-offers-list', jobOffersList)
app.component('report-list', reportList)
app.component('employment-list', employmentList)
app.component('employee-list-modal', employeeListModal)
app.component('employee-details-modal', employeeDetailsModal)
app.component('recycle-bin-list', RecycleBinList)
app.component('trining-table', TrainingTable)
app.component('trainers-table', TrainersTable)
app.component('training-type-table', TrainingTypeTable)
app.component('promotion-table', PromotionTable)

app.component('resignation-table', ResignationTable)
app.component('termination-table', TerminationTable)
app.component('job-table', JobTable)
app.component('candidates-table', CandidatesTable)
app.component('candidates-board', CandidatesBoard)
app.component('refferals-table', RefferalsTable)
app.component('estimates-table', EstimatesTable)
app.component('invoices-table', InvoicesTable)
app.component('payments-table', PaymentsTable)
app.component('expenses-table', ExpensesTable)
app.component('provident-table', ProvidentTable)
app.component('taxes-table', TaxesTable)
app.component('categories-table', CategoriesTable)
app.component('pages-table', PagesTable)


app.component('payslip-report-table', PayslipReportTable)
app.component('attendance-report-table', AttendanceReportTable)
app.component('department-position-list', departmentPositionList)

app.component('hr-manager-dashboard', hrManagerDashboard)
app.component('hr-assistant-dashboard', hrAssistantDashboard)
app.component('travel-request-list', travelRequestList)
app.component('travel-request-details', travelRequestDetails)


app.component('interviews-list', interviewsList)
app.component('interviews-details', interviewsDetails)
app.component('grant-position-list', grantPositionList)
app.component('grant-position-modal', grantPositionModal)
app.component('employee-site', employeeSite)
app.component('lookup-list', lookupList)
/************Page Filter********************/


app.component('employee-status', employeeStatus)
app.component('welcome-wrap', welcomeWrap)
app.component('welcome-hr-manager', welcomeHrManager)
app.component('welcome-hr-assistant', welcomeHrAssistant)



/************Modal********************/

app.component('grant-allocate-employee-modal', grantAllocateEmployeeModal)
app.component('job-offers-modal', jobOffersModal)

app.component('payroll-deduction-modal', payrollDeductionModal)
app.component('payroll-overtime-modal', payrollOvertimeModal)
app.component('assets-modal', assetsModal)
app.component('roles-modal', rolesModal)
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
app.component('custom-fields-modal', customFieldsModal)
app.component('tax-settings-modal', taxSettingsModal)

app.component('training-modal', TrainingModal)
app.component('trainers-modal', TrainersModal)
app.component('training-type-modal', TrainingTypeModal)


app.component('policy-modal', policyModal)
app.component('admin-dashboard-modal', adminDashboardModal)
app.component('employee-dashboard-modal', employeeDashboardModal)
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
app.component('circle-progress', CircleProgress)
app.component('date-picker', DatePicker);
app.component('vue3-tags-input', Vue3TagsInput);
app.use(FlagIcon)
    .use(Antd)
    .use(VueEasyLightbox)
    .use(VueFormWizard)
app.use(VCalendar)
    .use(BootstrapVue3)
    .use(BToastPlugin)
    .use(SimpleLineIcons)
app.component('IconHome', IconHome);

// Provide EventBus globally (instead of using as plugin)
app.provide('eventBus', eventBus);

// Register ThemifyIcon as a component (instead of plugin)
app.component('themify-icon', ThemifyIcon);

app.use(CKEditor);
app.use(router).mount('#app');   
