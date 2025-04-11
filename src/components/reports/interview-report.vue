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
    id: 1,
    name: "Interview Report",
    description: "View all reports",
    path: "/administration/reports/interview-report",
    icon: "file-text"
};

const dateInput = ref(null);

const preview = () => message.success('Preview Interview Report');
const exportPDF = () => message.success('Exported Interview Report as PDF');
const exportExcel = () => message.success('Exported Interview Report as Excel');
const exportCSV = () => message.success('Exported Interview Report as CSV');

onMounted(() => {
    const start = moment().subtract(29, 'days');
    const end = moment();
    new DateRangePicker(dateInput.value, {
        startDate: start,
        endDate: end,
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
    });
});
</script>