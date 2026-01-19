<script>
const data = [
  {
    Goal_Type: "Development Goals",
    Subject: "Programming Skills",
    Target_Achievement: "Complete a HTML course",
    Start_Date: "14 Jan 2024",
    End_Date: "13 Mar 2024",
    Description: "Improve proficiency",
    Status: "Active",
    Progress: "Completed 70%",
  },
  {
    Goal_Type: "Project Goals",
    Subject: "App Development",
    Target_Achievement: "Deliver the app",
    Start_Date: "21 Jan 2024",
    End_Date: "21 Feb 2024",
    Description: "Complete the app",
    Status: "Active",
    Progress: "Completed 40%",
  },
  {
    Goal_Type: "Project Goals",
    Subject: "Web Development",
    Target_Achievement: "Deliver the template",
    Start_Date: "18 Feb 2024",
    End_Date: "18 Mar 2024",
    Description: "Complete the template",
    Status: "Active",
    Progress: "Completed 60%",
  },
];

const columns = [
  {
    sorter: false,
  },
  {
    title: "Goal Type",
    dataIndex: "Goal_Type",
    sorter: {
      compare: (a, b) => {
        a = a.Goal_Type.toLowerCase();
        b = b.Goal_Type.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Subject",
    dataIndex: "Subject",
    sorter: {
      compare: (a, b) => {
        a = a.Subject.toLowerCase();
        b = b.Subject.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Target Achievement",
    dataIndex: "Target_Achievement",
    sorter: {
      compare: (a, b) => {
        a = a.Target_Achievement.toLowerCase();
        b = b.Target_Achievement.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Start Date",
    dataIndex: "Start_Date",
    sorter: {
      compare: (a, b) => {
        a = a.Start_Date.toLowerCase();
        b = b.Start_Date.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "End Date",
    dataIndex: "End_Date",
    sorter: {
      compare: (a, b) => {
        a = a.End_Date.toLowerCase();
        b = b.End_Date.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Description",
    dataIndex: "Description",
    sorter: {
      compare: (a, b) => {
        a = a.Description.toLowerCase();
        b = b.Description.toLowerCase();
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
  {
    title: "Progress",
    dataIndex: "Progress",
    key: "Progress",
    sorter: {
      compare: (a, b) => {
        a = a.Progress.toLowerCase();
        b = b.Progress.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "",
    key: "action",
    sorter: true,
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
      <template v-if="column.key === 'Status'">
        <span class="badge badge-success d-inline-flex align-items-center badge-xs">
          <i class="ti ti-point-filled me-1"></i>{{ record.Status }}
        </span>
      </template>
      <template v-if="column.key === 'Progress'">
        <span class="fs-12 mb-1">{{ record.Progress }}</span>
        <div
          class="progress"
          role="progressbar"
          aria-label="Success example"
          aria-valuenow="25"
          aria-valuemin="0"
          aria-valuemax="100"
          style="width: 87px; height: 5px"
        >
          <div
            class="progress-bar bg-primary"
            :style="{
              width:
                record.Progress === 'Completed 70%'
                  ? '80%'
                  : record.Progress === 'Completed 40%'
                  ? '40%'
                  : '60%',
            }"
          ></div>
        </div>
      </template>
      <template v-if="column.key === 'action'">
        <div class="action-icon d-inline-flex">
          <a
            href="javascript:void(0);"
            class="me-2"
            data-bs-toggle="modal"
            data-bs-target="#edit_goal"
            ><i class="ti ti-edit"></i
          ></a>
          <a
            href="javascript:void(0);"
            data-bs-toggle="modal"
            data-bs-target="#delete_modal"
            ><i class="ti ti-trash"></i
          ></a>
        </div>
      </template>
    </template>
  </a-table>
</template>
