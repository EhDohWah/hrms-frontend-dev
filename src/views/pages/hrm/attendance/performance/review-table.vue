<script>
import { useAssetUrl } from '@/composables/useAssetUrl';
const { getUserAvatar } = useAssetUrl();

const data = [
  {
    Image: "user-32.jpg",
    Name: "Anthony Lewis",
    Designation: "Web Designer",
    Department: "Designing",
    Appraisal_Date: "14 Jan 2024",
    Status: "Active",
  },
  {
    Image: "user-09.jpg",
    Name: "Brian Villalobos",
    Designation: "Web Developer",
    Department: "Developer",
    Appraisal_Date: "21 Jan 2024",
    Status: "Active",
  },
  {
    Image: "user-01.jpg",
    Name: "Harvey Smith",
    Designation: "IOS Developer",
    Department: "Developer",
    Appraisal_Date: "18 Feb 2024",
    Status: "Active",
  },
  {
    Image: "user-33.jpg",
    Name: "Stephan Peralt",
    Designation: "Android Developer",
    Department: "Developer",
    Appraisal_Date: "24 Feb 2024",
    Status: "Active",
  },
  {
    Image: "user-34.jpg",
    Name: "Doglas Martini",
    Designation: "DevOps Engineer",
    Department: "DevOps",
    Appraisal_Date: "11 Mar 2024",
    Status: "Active",
  },
];

const columns = [
  {
    sorter: false,
  },
  {
    title: "Name",
    dataIndex: "Name",
    key: "Name",
    sorter: {
      compare: (a, b) => {
        a = a.Name.toLowerCase();
        b = b.Name.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Designation",
    dataIndex: "Designation",
    sorter: {
      compare: (a, b) => {
        a = a.Designation.toLowerCase();
        b = b.Designation.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Department",
    dataIndex: "Department",
    sorter: {
      compare: (a, b) => {
        a = a.Department.toLowerCase();
        b = b.Department.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Appraisal Date",
    dataIndex: "Appraisal_Date",
    sorter: {
      compare: (a, b) => {
        a = a.Appraisal_Date.toLowerCase();
        b = b.Appraisal_Date.toLowerCase();
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
      <template v-if="column.key === 'Name'">
        <div class="d-flex align-items-center file-name-icon">
          <a href="javascript:void(0);" class="avatar avatar-md avatar-rounded">
            <img
              :src="getUserAvatar(record.Image)"
              class="img-fluid"
              alt="img"
            />
          </a>
          <div class="ms-2">
            <h6 class="fw-medium">
              <a href="javascript:void(0);">{{ record.Name }}</a>
            </h6>
          </div>
        </div>
      </template>
      <template v-if="column.key === 'Status'">
        <span class="badge badge-success d-inline-flex align-items-center badge-xs">
          <i class="ti ti-point-filled me-1"></i>{{ record.Status }}
        </span>
      </template>
      <template v-if="column.key === 'action'">
        <div class="action-icon d-inline-flex">
          <a
            href="javascript:void(0);"
            class="me-2"
            data-bs-toggle="modal"
            data-bs-target="#edit_performance_appraisal"
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
