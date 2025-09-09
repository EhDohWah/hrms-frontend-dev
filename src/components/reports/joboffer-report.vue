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
    <OverallJobOfferReportModal ref="overallJobOfferReportModal" :pdf-url="pdfUrl" />
</template>

<script>
import moment from 'moment';
import DateRangePicker from 'daterangepicker';
import ReportRow from '@/components/reports/report-row.vue';
import { message } from 'ant-design-vue';
import { reportJobOfferService } from '@/services/report-joboffer.service';
import OverallJobOfferReportModal from '@/components/modal/reports/overall-joboffer-report-modal.vue';

export default {
    components: {
        ReportRow,
        OverallJobOfferReportModal
    },
    data() {
        return {
            report: {
                id: 2,
                name: "Job Offer Report",
                description: "View all job offer reports",
                path: "/administration/reports/job-offer-report",
                icon: "file-text"
            },
            pdfUrl: null
        };
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
                const pdfBlob = await reportJobOfferService.generateJobOfferReportPDF(startDate, endDate);

                // Create a URL for the blob
                this.pdfUrl = window.URL.createObjectURL(pdfBlob);

                // Open the modal using the reference
                this.$refs.overallJobOfferReportModal.openModal();

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

                this.$message.loading({ content: 'Generating PDF...', key: 'pdfExport' });

                // Use the service to generate the PDF
                const pdfBlob = await reportJobOfferService.generateJobOfferReportPDF(startDate, endDate);

                // Create a URL for the blob and trigger download
                const url = window.URL.createObjectURL(pdfBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `job-offer-report-${startDate}-to-${endDate}.pdf`;
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

                // Use the service to generate the Excel file
                const excelBlob = await reportJobOfferService.generateJobOfferReportExcel(startDate, endDate);

                // Create a URL for the blob and trigger download
                const url = window.URL.createObjectURL(excelBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `job-offer-report-${startDate}-to-${endDate}.xlsx`;
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
        exportCSV() {
            message.success('Exported Job Offer Report as CSV');
        }
    },
    mounted() {
        const start = moment().subtract(29, 'days');
        const end = moment();
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

        // Set the initial value for the input.
        const initialStart = start.format('YYYY-MM-DD');
        const initialEnd = end.format('YYYY-MM-DD');
        this.$refs.dateInput.value = `${start.format('DD-MM-YYYY')} - ${end.format('DD-MM-YYYY')}`;
        this.$refs.dateInput.dataset.startDate = initialStart;
        this.$refs.dateInput.dataset.endDate = initialEnd;
    }
};
</script>
