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
</template>

<script setup>
import { ref, onMounted } from 'vue';
import moment from 'moment';
import DateRangePicker from 'daterangepicker';
import ReportRow from '@/components/reports/report-row.vue';
import { message } from 'ant-design-vue';
import { reportInterviewService } from '@/services/report-interview.service';

const report = {
    id: 1,
    name: "Interview Report",
    description: "View all reports",
    path: "/administration/reports/interview-report",
    icon: "file-text"
};

const dateInput = ref(null);

const preview = () => {
    message.success('Preview Interview Report');
};

const exportPDF = async () => {
    try {
        // Get the start_date and end_date that we store as data attributes
        const startDate = dateInput.value.dataset.startDate;
        const endDate = dateInput.value.dataset.endDate;

        if (!startDate || !endDate) {
            message.error('Please select a date range.');
            return;
        }

        message.loading({ content: 'Generating PDF...', key: 'pdfExport' });

        // Use the service to generate the PDF
        const pdfBlob = await reportInterviewService.generateInterviewReportPDF(startDate, endDate);

        // Create a URL for the blob and trigger download
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `interview-report-${startDate}-to-${endDate}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        message.success({ content: 'PDF generated successfully!', key: 'pdfExport' });
    } catch (error) {
        console.error('Error exporting PDF:', error);
        message.error({ content: 'Failed to generate PDF. Please try again.', key: 'pdfExport' });
    }
};

const exportExcel = () => {
    message.success('Exported Interview Report as Excel');
};

const exportCSV = () => {
    message.success('Exported Interview Report as CSV');
};

onMounted(() => {
    const start = moment().subtract(29, 'days');
    const end = moment();

    // Initialize the date range picker.
    new DateRangePicker(dateInput.value, {
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
        dateInput.value.value = `${start.format('DD-MM-YYYY')} - ${end.format('DD-MM-YYYY')}`;
        dateInput.value.dataset.startDate = formattedStart;
        dateInput.value.dataset.endDate = formattedEnd;
    });

    // Set the initial value for the input.
    const initialStart = start.format('YYYY-MM-DD');
    const initialEnd = end.format('YYYY-MM-DD');
    dateInput.value.value = `${start.format('DD-MM-YYYY')} - ${end.format('DD-MM-YYYY')}`;
    dateInput.value.dataset.startDate = initialStart;
    dateInput.value.dataset.endDate = initialEnd;
});
</script>