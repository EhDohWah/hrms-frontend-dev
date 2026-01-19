<script>
const data = [
  {
    Task_Name: "Patient Appointment Booking",
    Project_Name: "Hospital Administration",
    Created_Date: "14 Jan 2024",
    Due_Date: "15 Jan 2024",
    Priority: "Low",
    Status: "Completed",
  },
  {
    Task_Name: "Payment Gateway",
    Project_Name: "Educational Platform",
    Created_Date: "21 Jan 2024",
    Due_Date: "25 Jan 2024",
    Priority: "Medium",
    Status: "Inprogress",
  },
  {
    Task_Name: "Doctor available module",
    Project_Name: "Clinic Management",
    Created_Date: "20 Feb 2024",
    Due_Date: "22 Feb 2024",
    Priority: "High",
    Status: "Completed",
  },
  {
    Task_Name: "Video Conferencing Module",
    Project_Name: "Chat & Call Mobile App",
    Created_Date: "15 Mar 2024",
    Due_Date: "17 Mar 2024",
    Priority: "Low",
    Status: "On Hold",
  },
  {
    Task_Name: "Private Chat Module",
    Project_Name: "Travel Planning Website",
    Created_Date: "12 Apr 2024",
    Due_Date: "16 Apr 2024",
    Priority: "High",
    Status: "Completed",
  },
  {
    Task_Name: "Services List & Grid View",
    Project_Name: "Service Booking Software",
    Created_Date: "20 May 2024",
    Due_Date: "21 May 2024",
    Priority: "Low",
    Status: "Pending",
  },
  {
    Task_Name: "Car Detail Moodule",
    Project_Name: "Car & Bike Rental Software",
    Created_Date: "06 Jul 2024",
    Due_Date: "06 Jul 2024",
    Priority: "Medium",
    Status: "Inprogress",
  },
  {
    Task_Name: "Location Module",
    Project_Name: "Food Order App",
    Created_Date: "02 Sep 2024",
    Due_Date: "04 Sep 2024",
    Priority: "Low",
    Status: "Completed",
  },
  {
    Task_Name: "Hotel List & Grid View",
    Project_Name: "Hotel Booking App",
    Created_Date: "15 Nov 2024",
    Due_Date: "15 Nov 2024",
    Priority: "Medium",
    Status: "Completed",
  },
  {
    Task_Name: "Warehouse Module",
    Project_Name: "POS Admin Software",
    Created_Date: "10 Dec 2024",
    Due_Date: "11 Dec 2024",
    Priority: "Low",
    Status: "Pending",
  },
];

const columns = [
  {
    sorter: false,
  },
  {
    title: "Task Name",
    dataIndex: "Task_Name",
    key: "Task_Name",
    sorter: {
      compare: (a, b) => {
        a = a.Task_Name.toLowerCase();
        b = b.Task_Name.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Project Name",
    dataIndex: "Project_Name",
    sorter: {
      compare: (a, b) => {
        a = a.Project_Name.toLowerCase();
        b = b.Project_Name.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Created Date",
    dataIndex: "Created_Date",
    sorter: {
      compare: (a, b) => {
        a = a.Created_Date.toLowerCase();
        b = b.Created_Date.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Due Date",
    dataIndex: "Due_Date",
    sorter: {
      compare: (a, b) => {
        a = a.Due_Date.toLowerCase();
        b = b.Due_Date.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Priority",
    dataIndex: "Priority",
    key: "Priority",
    sorter: {
      compare: (a, b) => {
        a = a.Priority.toLowerCase();
        b = b.Priority.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Status",
    dataIndex: "Status",
    key: "Status",
    sorter: {
      compare: (a, b) => {
        a = a.Status.toLowerCase();
        b = b.Status.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
];

const rowSelection = {
  onChange: () => {},
  onSelect: () => {},
  onSelectAll: () => {},
};

export default {
  data() {
    return {
      data,
      columns,
      rowSelection,
    };
  },
};
</script>

<template>
  <a-table
    class="table datatable thead-light"
    :columns="columns"
    :data-source="data"
    :row-selection="rowSelection"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'Task_Name'">
        <div class="d-flex align-items-center file-name-icon">
          <h6 class="fw-medium">
            <a href="javascript:void(0);">{{ record.Task_Name }}</a>
          </h6>
        </div>
      </template>
      <template v-if="column.key === 'Priority'">
        <span
          class="badge"
          :class="[
            record.Priority === 'Low'
              ? 'badge-success-transparent'
              : record.Priority === 'Medium'
              ? 'badge-warning-transparent'
              : 'badge-danger-transparent',
          ]"
          ><i class="ti ti-point-filled me-1"></i>{{ record.Priority }}</span
        >
      </template>
      <template v-if="column.key === 'Status'">
        <span
          class="d-inline-flex align-items-center badge-xs"
          :class="[
            'badge',
            record.Status === 'Completed'
              ? 'badge-success'
              : record.Status === 'Inprogress'
              ? 'badge-purple'
              : record.Status === 'On Hold'
              ? 'badge-warning'
              : 'badge-skyblue',
          ]"
        >
          <i class="ti ti-point-filled me-1"></i>{{ record.Status }}
        </span>
      </template>
    </template>
  </a-table>
</template>
