<script>
import "daterangepicker/daterangepicker.css";
import "daterangepicker/daterangepicker.js";
import { ref } from "vue";
import { onMounted } from "vue";
import moment from "moment";
import DateRangePicker from "daterangepicker";
import { usePermissions } from '@/composables/usePermissions';

export default {
  
  data() {
    return {
      title: "Holidays",
      text: "Employee",
      text1: "Holidays",
    };
  },
  methods: {
    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },
  },
  setup() {
    const dateRangeInput = ref(null);
    
    // Initialize permission checks for holidays module
    const { 
      canRead, 
      canEdit, 
      isReadOnly, 
      accessLevelText, 
      accessLevelBadgeClass 
    } = usePermissions('holidays');

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
      canRead,
      canEdit,
      isReadOnly,
      accessLevelText,
      accessLevelBadgeClass
    };
  },
  computed: {
    // Permission checks - primary source for reactivity
    canEditHolidays() {
      try {
        const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
        const hasEdit = Array.isArray(permissions) && permissions.includes('holidays.edit');
        // Also check if setup() computed is available
        return hasEdit || (this.canEdit?.value ?? false);
      } catch (e) {
        console.error('[HolidaysList] Error checking permissions:', e);
        return this.canEdit?.value ?? false;
      }
    },
    canReadHolidays() {
      try {
        const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
        const hasRead = Array.isArray(permissions) && permissions.includes('holidays.read');
        return hasRead || (this.canRead?.value ?? false);
      } catch (e) {
        return this.canRead?.value ?? false;
      }
    },
    isReadOnlyHolidays() {
      return this.canReadHolidays && !this.canEditHolidays;
    },
  },
};
</script>

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
        <div class="d-flex align-items-center">
          <index-breadcrumb :title="title" :text="text" :text1="text1" />
          <!-- Read-Only Badge -->
          <span 
            v-if="isReadOnlyHolidays" 
            class="badge bg-warning text-dark ms-3 d-flex align-items-center"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="You have view-only access to this module"
          >
            <i class="ti ti-eye me-1"></i> Read Only
          </span>
        </div>
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <!-- Add Holiday Button - Only visible if user can edit -->
          <div v-if="canEditHolidays" class="mb-2">
            <a
              href="javascript:void(0);"
              data-bs-toggle="modal"
              data-bs-target="#add_holiday"
              class="btn btn-primary d-flex align-items-center"
              ><i class="ti ti-circle-plus me-2"></i>Add Holiday</a
            >
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

      <div class="card">
        <div
          class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3"
        >
          <h5>Holidays List</h5>
        </div>
        <div class="card-body p-0">
          <div class="custom-datatable-filter table-responsive">
            <holidays-table></holidays-table>
          </div>
        </div>
      </div>
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

  <holidays-modal></holidays-modal>
</template>
