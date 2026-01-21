<script>
const data = [
  {
    Title: "New Year",
    Date: "01 Jan 2024",
    Description: "First day of the new year",
    Status: "Active",
  },
  {
    Title: "Martin Luther King Jr. Day",
    Date: "15 Jan 2024",
    Description: "Celebrating the civil rights leader",
    Status: "Active",
  },
  {
    Title: "President's Day",
    Date: "19 Feb 2024",
    Description: "Honoring past US Presidents",
    Status: "Active",
  },
  {
    Title: "Good Friday",
    Date: "29 Mar 2024",
    Description: "Holiday before Easter",
    Status: "Active",
  },
  {
    Title: "Easter Monday",
    Date: "01 Apr 2024",
    Description: "Holiday after Easter",
    Status: "Active",
  },
  {
    Title: "Memorial Day",
    Date: "27 May 2024",
    Description: "Honors military personnel",
    Status: "Active",
  },
  {
    Title: "Independence Day",
    Date: "04 Jul 2024",
    Description: "Celebrates Independence",
    Status: "Active",
  },
  {
    Title: "Labour Day",
    Date: "02 Sep 2024",
    Description: "Honors working people",
    Status: "Inactive",
  },
  {
    Title: "Veterans Day",
    Date: "11 Nov 2024",
    Description: "Honors military veterans",
    Status: "Active",
  },
  {
    Title: "Christmas Day",
    Date: "25 Dec 2024",
    Description: "Celebration of Christmas",
    Status: "Active",
  },
];

const columns = [
  {
    sorter: false,
  },
  {
    title: "Title",
    dataIndex: "Title",
    key: "Title",
    sorter: {
      compare: (a, b) => {
        a = a.Title.toLowerCase();
        b = b.Title.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Date",
    dataIndex: "Date",
    sorter: {
      compare: (a, b) => {
        a = a.Date.toLowerCase();
        b = b.Date.toLowerCase();
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
      <template v-if="column.key === 'Title'">
        <h6 class="fw-medium">
          <a href="javascript:void(0);">{{ record.Title }}</a>
        </h6>
      </template>
      <template v-if="column.key === 'Status'">
        <span
          class="d-inline-flex align-items-center badge-sm"
          :class="[
            'badge',
            record.Status === 'Active' ? 'badge-success' : 'badge-danger',
          ]"
        >
          <i class="ti ti-point-filled me-1"></i>{{ record.Status }}
        </span>
      </template>
      <template v-if="column.key === 'action'">
        <div class="action-icon d-inline-flex">
          <a
            href="javascript:void(0);"
            class="me-2"
            data-bs-toggle="modal"
            data-bs-target="#edit_holiday"
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
