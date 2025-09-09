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

                <!-- Training Title Dropdown - Takes up proportional space -->
                <div style="flex: 1; min-width: 220px;">
                    <a-select v-model:value="selectedTrainingTitle" placeholder="All Training Titles"
                        style="width: 100%" allow-clear :options="trainingTitleOptions"
                        :get-popup-container="(triggerNode) => triggerNode.parentNode"
                        :dropdown-style="{ zIndex: 9999 }" show-search :filter-option="filterTrainingOption"
                        :loading="loadingTrainings">
                        <template #suffixIcon>
                            <i class="ti ti-school"></i>
                        </template>
                    </a-select>
                </div>
            </div>
        </template>
    </ReportRow>

    <OverallTrainingAttendanceReportModal ref="overallTrainingAttendanceReportModal" :pdf-url="pdfUrl" />
</template>

<script>
import moment from 'moment';
import DateRangePicker from 'daterangepicker';
import ReportRow from '@/components/reports/report-row.vue';
import { message } from 'ant-design-vue';
import { reportTrainingService } from '@/services/report-training.service';
import { trainingService } from '@/services/training.service';
import OverallTrainingAttendanceReportModal from '@/components/modal/reports/overall-training-attendance-report-modal.vue';

export default {
    name: 'TrainingAttendanceReport',
    components: {
        ReportRow,
        OverallTrainingAttendanceReportModal
    },
    data() {
        return {
            report: {
                id: 8,
                name: "Training Attendance Report",
                description: "View attendance reports for specific trainings",
                path: "/administration/reports/training-attendance-report",
                icon: "school"
            },
            pdfUrl: null,
            selectedTrainingTitle: null,
            trainings: [],
            loadingTrainings: false
        };
    },
    computed: {
        trainingTitleOptions() {
            return this.trainings.map(training => ({
                label: training.title || training.name || training.training_title,
                value: training.title || training.name || training.training_title
            }));
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

        // Load training titles data asynchronously (non-blocking)
        this.loadTrainingTitles();
    },
    methods: {
        async loadTrainingTitles() {
            try {
                this.loadingTrainings = true;

                // Load trainings from trainingService
                const trainingsResponse = await trainingService.getTrainings();
                const rawTrainings = trainingsResponse.data || [];

                // Transform trainings to expected format
                this.trainings = rawTrainings.map(training => ({
                    id: training.id,
                    title: training.title || training.name || training.training_title,
                    name: training.title || training.name || training.training_title
                }));

                console.log('📚 Loaded training titles:', {
                    trainings: this.trainings.length
                });
            } catch (error) {
                console.error('Error loading training titles:', error);
                message.error('Failed to load training titles.');
            } finally {
                this.loadingTrainings = false;
            }
        },

        filterTrainingOption(inputValue, option) {
            return option.label.toLowerCase().includes(inputValue.toLowerCase());
        },

        getReportParameters() {
            const startDate = this.$refs.dateInput.dataset.startDate;
            const endDate = this.$refs.dateInput.dataset.endDate;

            const params = {
                start_date: startDate,
                end_date: endDate
            };

            if (this.selectedTrainingTitle) {
                params.training_title = this.selectedTrainingTitle;
            }

            return params;
        },

        async preview() {
            try {
                const params = this.getReportParameters();

                if (!params.start_date || !params.end_date) {
                    message.error('Please select a date range.');
                    return;
                }

                message.loading({ content: 'Generating preview...', key: 'preview' });

                // Use the service to generate the PDF for preview with all parameters
                const pdfBlob = await reportTrainingService.generateTrainingAttendanceReportPDF(
                    params.start_date,
                    params.end_date,
                    params.training_title
                );

                // Create a URL for the blob
                this.pdfUrl = window.URL.createObjectURL(pdfBlob);

                // Open the modal using the reference
                this.$refs.overallTrainingAttendanceReportModal.openModal();

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

                message.loading({ content: 'Generating PDF...', key: 'pdfExport' });

                // Use the service to generate the PDF with all parameters
                const pdfBlob = await reportTrainingService.generateTrainingAttendanceReportPDF(
                    params.start_date,
                    params.end_date,
                    params.training_title
                );

                // Create filename with filters
                let filename = `training-attendance-report-${params.start_date}-to-${params.end_date}`;
                if (params.training_title) filename += `-${params.training_title.replace(/[^a-zA-Z0-9]/g, '-')}`;
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

                message.loading({ content: 'Generating Excel...', key: 'excelExport' });

                // Use the service to generate the Excel file with all parameters
                const excelBlob = await reportTrainingService.generateTrainingAttendanceReportExcel(
                    params.start_date,
                    params.end_date,
                    params.training_title
                );

                // Create filename with filters
                let filename = `training-attendance-report-${params.start_date}-to-${params.end_date}`;
                if (params.training_title) filename += `-${params.training_title.replace(/[^a-zA-Z0-9]/g, '-')}`;
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

                message.loading({ content: 'Generating CSV...', key: 'csvExport' });

                // Use the service to generate the CSV file with all parameters
                const csvBlob = await reportTrainingService.generateTrainingAttendanceReportCSV(
                    params.start_date,
                    params.end_date,
                    params.training_title
                );

                // Create filename with filters
                let filename = `training-attendance-report-${params.start_date}-to-${params.end_date}`;
                if (params.training_title) filename += `-${params.training_title.replace(/[^a-zA-Z0-9]/g, '-')}`;
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

/* Make training title dropdown list wider for longer names */
:deep(.ant-select:nth-child(2) .ant-select-dropdown) {
    min-width: 300px !important;
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

/* Ensure long training names are fully visible */
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

/* Loading state styling */
:deep(.ant-select-selection-search-input) {
    height: auto;
}
</style>
