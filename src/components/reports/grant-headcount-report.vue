<template>
    <ReportRow :report="report" @preview="preview" @export-pdf="exportPDF" @export-excel="exportExcel"
        @export-csv="exportCSV">
        <template #input>
            <div class="input-icon-end position-relative">
                <input type="text" ref="dateInput" class="form-control" placeholder="Select date range" />
                <span class="input-icon-addon">
                    <i class="ti ti-calendar"></i>
                </span>
            </div>
        </template>
    </ReportRow>
    <OverallGrantHeadcountReportModal ref="overallGrantHeadcountReportModal" :pdf-url="pdfUrl" />
</template>

<script>
import moment from 'moment';
import DateRangePicker from 'daterangepicker';
import ReportRow from '@/components/reports/report-row.vue';
import { message } from 'ant-design-vue';
import { reportGrantHeadcountService } from '@/services/report-grant-headcount.service';
import OverallGrantHeadcountReportModal from '@/components/modal/reports/overall-grant-headcount-report-modal.vue';

export default {
    name: 'GrantHeadcountReport',
    components: {
        ReportRow,
        OverallGrantHeadcountReportModal
    },
    data() {
        return {
            report: {
                id: 3,
                name: "Grant Headcount Report",
                description: "Monthly headcount after paycheck",
                path: "/administration/reports/grant-headcount-report",
                icon: "users"
            },
            pdfUrl: null
        };
    },
    mounted() {
        const start = moment().subtract(29, 'days');
        const end = moment();

        // Initialize the date range picker
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

        // Set the initial value for the input
        const initialStart = start.format('YYYY-MM-DD');
        const initialEnd = end.format('YYYY-MM-DD');
        this.$refs.dateInput.value = `${start.format('DD-MM-YYYY')} - ${end.format('DD-MM-YYYY')}`;
        this.$refs.dateInput.dataset.startDate = initialStart;
        this.$refs.dateInput.dataset.endDate = initialEnd;
    },
    methods: {
        async preview() {
            try {
                // Get the start_date and end_date from the date input
                const startDate = this.$refs.dateInput.dataset.startDate;
                const endDate = this.$refs.dateInput.dataset.endDate;

                if (!startDate || !endDate) {
                    message.error('Please select a date range.');
                    return;
                }

                message.loading({ content: 'Generating preview...', key: 'preview' });

                // Use the service to generate the PDF for preview
                const pdfBlob = await reportGrantHeadcountService.generateGrantHeadcountReportPDF(startDate, endDate);

                // Create a URL for the blob
                this.pdfUrl = window.URL.createObjectURL(pdfBlob);

                // Open the modal using the reference
                this.$refs.overallGrantHeadcountReportModal.openModal();

                message.success({ content: 'Preview ready!', key: 'preview' });
            } catch (error) {
                console.error('Error generating preview:', error);
                message.error({ content: 'Failed to generate preview. Please try again.', key: 'preview' });
            }
        },
        async exportPDF() {
            try {
                // Get the start_date and end_date that we store as data attributes
                const startDate = this.$refs.dateInput.dataset.startDate;
                const endDate = this.$refs.dateInput.dataset.endDate;

                if (!startDate || !endDate) {
                    message.error('Please select a date range.');
                    return;
                }

                message.loading({ content: 'Generating PDF...', key: 'pdfExport' });

                // Use the service to generate the PDF
                const pdfBlob = await reportGrantHeadcountService.generateGrantHeadcountReportPDF(startDate, endDate);

                // Create a URL for the blob and trigger download
                const url = window.URL.createObjectURL(pdfBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `grant-headcount-report-${startDate}-to-${endDate}.pdf`;
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
                // Get the start_date and end_date that we store as data attributes
                const startDate = this.$refs.dateInput.dataset.startDate;
                const endDate = this.$refs.dateInput.dataset.endDate;

                if (!startDate || !endDate) {
                    message.error('Please select a date range.');
                    return;
                }

                message.loading({ content: 'Generating Excel...', key: 'excelExport' });

                // Use the service to generate the Excel
                const excelBlob = await reportGrantHeadcountService.generateGrantHeadcountReportExcel(startDate, endDate);

                // Create a URL for the blob and trigger download
                const url = window.URL.createObjectURL(excelBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `grant-headcount-report-${startDate}-to-${endDate}.xlsx`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                message.success({ content: 'Excel generated successfully!', key: 'excelExport' });
            } catch (error) {
                console.error('Error exporting Excel:', error);
                message.error({ content: 'Failed to generate Excel. Please try again.', key: 'excelExport' });
            }
        },
        exportCSV() {
            const startDate = this.$refs.dateInput.dataset.startDate;
            const endDate = this.$refs.dateInput.dataset.endDate;

            if (!startDate || !endDate) {
                message.error('Please select a date range.');
                return;
            }
            message.success('Exported Grant Headcount Report as CSV');
        }
    }
};
</script>
