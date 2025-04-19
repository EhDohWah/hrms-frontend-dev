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

const report = {
    id: 3,
    name: "Grant Headcount Report",
    description: "Monthly headcount after paycheck",
    path: "/administration/reports/grant-headcount-report",
    icon: "users"
};

const dateInput = ref(null);

const preview = () => {
    // Get the start_date and end_date that we store as data attributes
    const startDate = dateInput.value.dataset.startDate;
    const endDate = dateInput.value.dataset.endDate;

    if (!startDate || !endDate) {
        message.error('Please select a date range.');
        return;
    }
    message.success('Preview Grant Headcount Report');
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

        // Here you would call your service to generate the PDF
        // const pdfBlob = await reportGrantHeadcountService.generateGrantHeadcountReportPDF(startDate, endDate);

        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Placeholder for PDF generation
        message.success({ content: 'PDF generated successfully!', key: 'pdfExport' });

        // Uncomment when service is implemented
        /*
        // Create a URL for the blob and trigger download
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `grant-headcount-report-${startDate}-to-${endDate}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        */
    } catch (error) {
        console.error('Error exporting PDF:', error);
        message.error({ content: 'Failed to generate PDF. Please try again.', key: 'pdfExport' });
    }
};

const exportExcel = () => {
    const startDate = dateInput.value.dataset.startDate;
    const endDate = dateInput.value.dataset.endDate;

    if (!startDate || !endDate) {
        message.error('Please select a date range.');
        return;
    }
    message.success('Exported Grant Headcount Report as Excel');
};

const exportCSV = () => {
    const startDate = dateInput.value.dataset.startDate;
    const endDate = dateInput.value.dataset.endDate;

    if (!startDate || !endDate) {
        message.error('Please select a date range.');
        return;
    }
    message.success('Exported Grant Headcount Report as CSV');
};

onMounted(() => {
    const start = moment().startOf('month');
    const end = moment().endOf('month');

    // Initialize the date range picker with monthly view
    new DateRangePicker(dateInput.value, {
        startDate: start,
        endDate: end,
        locale: {
            format: 'MMMM YYYY'
        },
        ranges: {
            "This Month": [moment().startOf('month'), moment().endOf('month')],
            "Last Month": [
                moment().subtract(1, 'month').startOf('month'),
                moment().subtract(1, 'month').endOf('month')
            ],
            "Last 3 Months": [
                moment().subtract(2, 'month').startOf('month'),
                moment().endOf('month')
            ],
            "Last 6 Months": [
                moment().subtract(5, 'month').startOf('month'),
                moment().endOf('month')
            ],
            "This Year": [moment().startOf('year'), moment().endOf('year')],
            "Last Year": [
                moment().subtract(1, 'year').startOf('year'),
                moment().subtract(1, 'year').endOf('year')
            ]
        }
    }, (start, end) => {
        // Callback when a new date range is selected.
        // Make sure we're working with the first and last day of months
        const startMonth = start.startOf('month');
        const endMonth = end.endOf('month');

        // Format for display and data attributes
        const formattedStart = startMonth.format('YYYY-MM-DD');
        const formattedEnd = endMonth.format('YYYY-MM-DD');

        // Update the input display value
        dateInput.value.value = `${startMonth.format('MMMM YYYY')} - ${endMonth.format('MMMM YYYY')}`;

        // Store the actual dates as data attributes
        dateInput.value.dataset.startDate = formattedStart;
        dateInput.value.dataset.endDate = formattedEnd;
    });

    // Set the initial value for the input
    const initialStart = start.format('YYYY-MM-DD');
    const initialEnd = end.format('YYYY-MM-DD');
    dateInput.value.value = `${start.format('MMMM YYYY')} - ${end.format('MMMM YYYY')}`;
    dateInput.value.dataset.startDate = initialStart;
    dateInput.value.dataset.endDate = initialEnd;
});
</script>
