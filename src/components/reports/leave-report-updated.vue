<template>
    <ReportRow :report="report" @preview="preview" @export-pdf="exportPDF" @export-excel="exportExcel"
        @export-csv="exportCSV">
        <template #input>
            <div class="d-flex gap-2 align-items-center" style="width: 100%;">
                <!-- Date Range Input - Takes up larger portion -->
                <div class="input-icon-end position-relative" style="flex: 2; min-width: 200px;">
                    <input type="text" ref="dateInput" class="form-control" placeholder="Select date range" />
                    <span class="input-icon-addon">
                        <i class="ti ti-calendar"></i>
                    </span>
                </div>

                <!-- Site Dropdown - Takes up proportional space -->
                <div style="flex: 1; min-width: 120px;">
                    <a-select v-model:value="selectedSite" placeholder="Select Site *" style="width: 100%"
                        :options="siteOptions" :get-popup-container="(triggerNode) => triggerNode.parentNode"
                        :dropdown-style="{ zIndex: 9999 }">
                        <template #suffixIcon>
                            <i class="ti ti-building"></i>
                        </template>
                    </a-select>
                </div>

                <!-- Department Dropdown - Takes up proportional space -->
                <div style="flex: 1; min-width: 180px;">
                    <a-select v-model:value="selectedDepartment" placeholder="Select Department *" style="width: 100%"
                        :options="departmentOptions" :get-popup-container="(triggerNode) => triggerNode.parentNode"
                        :dropdown-style="{ zIndex: 9999 }">
                        <template #suffixIcon>
                            <i class="ti ti-users"></i>
                        </template>
                    </a-select>
                </div>
            </div>
        </template>
    </ReportRow>

    <OverallLeaveReportModal ref="overallLeaveReportModal" :pdf-url="pdfUrl" />
</template>

<script>
import moment from 'moment';
import DateRangePicker from 'daterangepicker';
import ReportRow from '@/components/reports/report-row.vue';
import { message } from 'ant-design-vue';
import { reportLeaveService } from '@/services/report-leave.service';
import OverallLeaveReportModal from '@/components/modal/reports/overall-leave-report-modal.vue';
import { useSharedDataStore } from '@/stores/sharedDataStore';
import { workLocationService } from '@/services/worklocation.service';

export default {
    name: 'LeaveReport',
    components: {
        ReportRow,
        OverallLeaveReportModal
    },
    data() {
        return {
            report: {
                id: 4,
                name: "Leave Report",
                description: "Generate comprehensive leave reports",
                path: "/administration/reports/leave-report",
                icon: "calendar-x"
            },
            pdfUrl: null,
            selectedSite: null,
            selectedDepartment: null,
            sites: [],
            departments: [],
            sharedStore: useSharedDataStore()
        };
    },
    computed: {
        siteOptions() {
            return this.sites.map(site => ({
                label: site.value,
                value: site.value
            }));
        },
        departmentOptions() {
            return this.departments;
        }
    },
    async mounted() {
        const start = moment().subtract(29, 'days');
        const end = moment();

        // Initialize the date range picker first for immediate display
        new DateRangePicker(this.$refs.dateInput, {
            startDate: start,
            endDate: end,
            locale: {
                format: 'DD-MM-YYYY'
            },
            ranges: {
                Today: [moment(), moment()],
                Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                "Last 7 Days": [moment().subtract(6, 'days'), moment()],
                "Last 30 Days": [moment().subtract(29, 'days'), moment()],
                "This Month": [moment().startOf('month'), moment().endOf('month')],
                "Last Month": [
                    moment().subtract(1, 'month').startOf('month'),
                    moment().subtract(1, 'month').endOf('month')
                ],
                Annual: [moment().startOf('year'), moment().endOf('year')]
            }
        }, (start, end) => {
            // Callback when a new date range is selected.
            // Update the input's value and set custom data attributes.
            const formattedStart = start.format('YYYY-MM-DD');
            const formattedEnd = end.format('YYYY-MM-DD');
            this.$refs.dateInput.value = `${start.format('DD-MM-YYYY')} - ${end.format('DD-MM-YYYY')}`;
            this.$refs.dateInput.dataset.startDate = formattedStart;
            this.$refs.dateInput.dataset.endDate = formattedEnd;
        });

        // Set the initial value for the input immediately
        const initialStart = start.format('YYYY-MM-DD');
        const initialEnd = end.format('YYYY-MM-DD');
        this.$refs.dateInput.value = `${start.format('DD-MM-YYYY')} - ${end.format('DD-MM-YYYY')}`;
        this.$refs.dateInput.dataset.startDate = initialStart;
        this.$refs.dateInput.dataset.endDate = initialEnd;

        // Load sites and departments data asynchronously (non-blocking)
        this.loadSitesAndDepartments();
    },
    methods: {
        async loadSitesAndDepartments() {
            try {
                // Load work locations (sites) from workLocationService
                const workLocationsResponse = await workLocationService.getAllWorkLocations();
                const rawSites = workLocationsResponse.data || [];

                // Transform work locations to expected format
                this.sites = rawSites.map(site => ({
                    id: site.id,
                    value: site.name || site.location_name || site.value || site.title,
                    name: site.name || site.location_name || site.value || site.title
                }));

                // Load departments using the shared data store
                await this.sharedStore.fetchDepartments();
                const departments = this.sharedStore.getDepartments;

                // Format departments for the dropdown with the new API response format
                this.departments = departments.map(department => ({
                    label: department.name,
                    value: department.name,
                    id: department.id
                }));

                console.log('📊 Loaded sites and departments:', {
                    sites: this.sites.length,
                    departments: this.departments.length,
                    departmentSample: this.departments.slice(0, 3)
                });
            } catch (error) {
                console.error('Error loading sites and departments:', error);
                message.error('Failed to load site and department data.');
            }
        },

        getReportParameters() {
            const startDate = this.$refs.dateInput.dataset.startDate;
            const endDate = this.$refs.dateInput.dataset.endDate;

            const params = {
                start_date: startDate,
                end_date: endDate,
                work_location: this.selectedSite,
                department: this.selectedDepartment
            };

            return params;
        },

        async preview() {
            try {
                const params = this.getReportParameters();

                if (!params.start_date || !params.end_date) {
                    message.error('Please select a date range.');
                    return;
                }

                if (!params.work_location) {
                    message.error('Please select a work location.');
                    return;
                }

                if (!params.department) {
                    message.error('Please select a department.');
                    return;
                }

                message.loading({ content: 'Generating preview...', key: 'preview' });

                // Use the service to generate the PDF for preview with all parameters
                const pdfBlob = await reportLeaveService.generateLeaveReportPDF(
                    params.start_date,
                    params.end_date,
                    params.work_location,
                    params.department
                );

                // Create a URL for the blob
                this.pdfUrl = window.URL.createObjectURL(pdfBlob);

                // Open the modal using the reference
                this.$refs.overallLeaveReportModal.openModal();

                message.success({ content: 'Preview ready!', key: 'preview' });
            } catch (error) {
                console.error('Error generating preview:', error);
                message.error({ content: 'Failed to generate preview. Please try again.', key: 'preview' });
            }
        },
        async exportPDF() {
            try {
                const params = this.getReportParameters();

                if (!params.start_date || !params.end_date) {
                    message.error('Please select a date range.');
                    return;
                }

                if (!params.work_location) {
                    message.error('Please select a work location.');
                    return;
                }

                if (!params.department) {
                    message.error('Please select a department.');
                    return;
                }

                message.loading({ content: 'Generating PDF...', key: 'pdfExport' });

                // Use the service to generate the PDF with all parameters
                const pdfBlob = await reportLeaveService.generateLeaveReportPDF(
                    params.start_date,
                    params.end_date,
                    params.work_location,
                    params.department
                );

                // Create filename with filters
                let filename = `leave-report-${params.start_date}-to-${params.end_date}`;
                if (params.work_location) filename += `-${params.work_location}`;
                if (params.department) filename += `-${params.department}`;
                filename += '.pdf';

                // Create a URL for the blob and trigger download
                const url = window.URL.createObjectURL(pdfBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                message.success({ content: 'PDF generated successfully!', key: 'pdfExport' });
            } catch (error) {
                console.error('Error exporting PDF:', error);
                message.error({ content: 'Failed to generate PDF. Please try again.', key: 'pdfExport' });
            }
        },
        async exportExcel() {
            try {
                const params = this.getReportParameters();

                if (!params.start_date || !params.end_date) {
                    message.error('Please select a date range.');
                    return;
                }

                if (!params.work_location) {
                    message.error('Please select a work location.');
                    return;
                }

                if (!params.department) {
                    message.error('Please select a department.');
                    return;
                }

                message.loading({ content: 'Generating Excel...', key: 'excelExport' });

                // Use the service to generate the Excel file with all parameters
                const excelBlob = await reportLeaveService.generateLeaveReportExcel(
                    params.start_date,
                    params.end_date,
                    params.work_location,
                    params.department
                );

                // Create filename with filters
                let filename = `leave-report-${params.start_date}-to-${params.end_date}`;
                if (params.work_location) filename += `-${params.work_location}`;
                if (params.department) filename += `-${params.department}`;
                filename += '.xlsx';

                // Create a URL for the blob and trigger download
                const url = window.URL.createObjectURL(excelBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                message.success({ content: 'Excel file generated successfully!', key: 'excelExport' });
            } catch (error) {
                console.error('Error exporting Excel:', error);
                message.error({ content: 'Failed to generate Excel file. Please try again.', key: 'excelExport' });
            }
        },
        async exportCSV() {
            try {
                const params = this.getReportParameters();

                if (!params.start_date || !params.end_date) {
                    message.error('Please select a date range.');
                    return;
                }

                if (!params.work_location) {
                    message.error('Please select a work location.');
                    return;
                }

                if (!params.department) {
                    message.error('Please select a department.');
                    return;
                }

                message.loading({ content: 'Generating CSV...', key: 'csvExport' });

                // Use the service to generate the CSV file with all parameters
                const csvBlob = await reportLeaveService.generateLeaveReportCSV(
                    params.start_date,
                    params.end_date,
                    params.work_location,
                    params.department
                );

                // Create filename with filters
                let filename = `leave-report-${params.start_date}-to-${params.end_date}`;
                if (params.work_location) filename += `-${params.work_location}`;
                if (params.department) filename += `-${params.department}`;
                filename += '.csv';

                // Create a URL for the blob and trigger download
                const url = window.URL.createObjectURL(csvBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                message.success({ content: 'CSV file generated successfully!', key: 'csvExport' });
            } catch (error) {
                console.error('Error exporting CSV:', error);
                message.error({ content: 'Failed to generate CSV file. Please try again.', key: 'csvExport' });
            }
        }
    }
};
</script>

<style scoped>
/* Ensure dropdown menus appear properly */
:deep(.ant-select-dropdown) {
    z-index: 9999 !important;
    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05) !important;
    min-width: 200px !important;
}

/* Make department dropdown list even wider for longer names */
:deep(.ant-select:nth-child(3) .ant-select-dropdown) {
    min-width: 250px !important;
}

/* Ensure the parent container allows overflow */
:deep(.d-flex) {
    position: relative;
    overflow: visible;
}

/* Fix for dropdown positioning in flex containers */
:deep(.ant-select) {
    position: relative;
}

/* Ensure dropdown options are properly styled */
:deep(.ant-select-item) {
    padding: 8px 12px;
    min-height: auto;
    white-space: nowrap;
    overflow: visible;
    text-overflow: unset;
}

/* Ensure long department names are fully visible */
:deep(.ant-select-item-option-content) {
    white-space: nowrap;
    overflow: visible;
}

/* Custom styling for the select input */
:deep(.ant-select-selector) {
    border-radius: 6px;
    border: 1px solid #d9d9d9;
    padding: 4px 11px;
    min-height: 38px;
    display: flex;
    align-items: center;
}

:deep(.ant-select-selector:hover) {
    border-color: #4096ff;
}

:deep(.ant-select-focused .ant-select-selector) {
    border-color: #4096ff;
    box-shadow: 0 0 0 2px rgba(64, 150, 255, 0.2);
}

/* Icon styling */
:deep(.ant-select-arrow) {
    color: #666;
}

/* Placeholder styling */
:deep(.ant-select-selection-placeholder) {
    color: #999;
}
</style>
