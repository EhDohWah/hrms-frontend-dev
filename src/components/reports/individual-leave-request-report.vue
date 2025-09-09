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

                <!-- Staff ID Input - Takes up proportional space -->
                <div style="flex: 1; min-width: 180px;">
                    <div class="input-icon-end position-relative">
                        <input type="text" v-model="staffId" class="form-control" placeholder="Staff ID (required)"
                            @input="validateStaffId" />
                        <span class="input-icon-addon">
                            <i class="ti ti-id"></i>
                        </span>
                    </div>
                </div>
            </div>
        </template>
    </ReportRow>

    <OverallIndividualLeaveReportModal ref="overallIndividualLeaveReportModal" :pdf-url="pdfUrl" />
</template>

<script>
import moment from 'moment';
import DateRangePicker from 'daterangepicker';
import ReportRow from '@/components/reports/report-row.vue';
import { message } from 'ant-design-vue';
import { reportIndividualLeaveService } from '@/services/report-individual-leave.service';
import OverallIndividualLeaveReportModal from '@/components/modal/reports/overall-individual-leave-report-modal.vue';

export default {
    name: 'IndividualLeaveRequestReport',
    components: {
        ReportRow,
        OverallIndividualLeaveReportModal
    },
    data() {
        return {
            report: {
                id: 11,
                name: "Individual Leave Request Summary Report",
                description: "View leave request summary for individual employees",
                path: "/administration/reports/individual-leave-request-report",
                icon: "user-x"
            },
            pdfUrl: null,
            staffId: ''
        };
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
    },
    methods: {
        validateStaffId() {
            // Remove any non-alphanumeric characters and limit length
            this.staffId = this.staffId.replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
        },

        getReportParameters() {
            const startDate = this.$refs.dateInput.dataset.startDate;
            const endDate = this.$refs.dateInput.dataset.endDate;

            const params = {
                start_date: startDate,
                end_date: endDate,
                staff_id: this.staffId ? this.staffId.trim() : null
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

                if (!params.staff_id) {
                    message.error('Please enter a Staff ID.');
                    return;
                }

                message.loading({ content: 'Generating preview...', key: 'preview' });

                // Use the service to generate the PDF for preview with all parameters
                const pdfBlob = await reportIndividualLeaveService.generateIndividualLeaveReportPDF(
                    params.start_date,
                    params.end_date,
                    params.staff_id
                );

                // Create a URL for the blob
                this.pdfUrl = window.URL.createObjectURL(pdfBlob);

                // Open the modal using the reference
                this.$refs.overallIndividualLeaveReportModal.openModal();

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

                if (!params.staff_id) {
                    message.error('Please enter a Staff ID.');
                    return;
                }

                message.loading({ content: 'Generating PDF...', key: 'pdfExport' });

                // Use the service to generate the PDF with all parameters
                const pdfBlob = await reportIndividualLeaveService.generateIndividualLeaveReportPDF(
                    params.start_date,
                    params.end_date,
                    params.staff_id
                );

                // Create filename with filters
                let filename = `individual-leave-request-report-${params.start_date}-to-${params.end_date}`;
                if (params.staff_id) filename += `-${params.staff_id}`;
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

                if (!params.staff_id) {
                    message.error('Please enter a Staff ID.');
                    return;
                }

                message.loading({ content: 'Generating Excel...', key: 'excelExport' });

                // Use the service to generate the Excel file with all parameters
                const excelBlob = await reportIndividualLeaveService.generateIndividualLeaveReportExcel(
                    params.start_date,
                    params.end_date,
                    params.staff_id
                );

                // Create filename with filters
                let filename = `individual-leave-request-report-${params.start_date}-to-${params.end_date}`;
                if (params.staff_id) filename += `-${params.staff_id}`;
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

                if (!params.staff_id) {
                    message.error('Please enter a Staff ID.');
                    return;
                }

                message.loading({ content: 'Generating CSV...', key: 'csvExport' });

                // Use the service to generate the CSV file with all parameters
                const csvBlob = await reportIndividualLeaveService.generateIndividualLeaveReportCSV(
                    params.start_date,
                    params.end_date,
                    params.staff_id
                );

                // Create filename with filters
                let filename = `individual-leave-request-report-${params.start_date}-to-${params.end_date}`;
                if (params.staff_id) filename += `-${params.staff_id}`;
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
/* Custom styling for the input fields */
.input-icon-end {
    position: relative;
}

.input-icon-addon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #666;
    z-index: 2;
}

/* Ensure the parent container allows proper spacing */
.d-flex {
    gap: 0.5rem;
}

/* Input field styling */
.form-control {
    border-radius: 6px;
    border: 1px solid #d9d9d9;
    padding: 8px 35px 8px 12px;
    /* Right padding for icon */
    min-height: 38px;
    transition: border-color 0.3s, box-shadow 0.3s;
}

.form-control:hover {
    border-color: #4096ff;
}

.form-control:focus {
    border-color: #4096ff;
    box-shadow: 0 0 0 2px rgba(64, 150, 255, 0.2);
    outline: none;
}

.form-control::placeholder {
    color: #999;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .d-flex {
        flex-direction: column;
        gap: 0.75rem;
    }

    .d-flex>div {
        min-width: unset !important;
        flex: unset !important;
    }
}
</style>
