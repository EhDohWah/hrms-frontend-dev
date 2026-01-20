<script>
import { useAssetUrl } from '@/composables/useAssetUrl';
const { getUserAvatar } = useAssetUrl();

const data = [
  {
    Image: "user-32.jpg",
    Promoted_Employee: "Anthony Lewis",
    Department: "Finance",
    Designation_From: "Accountant",
    Designation_To: "Sr Accountant",
    Promotion_Date: "14 Jan 2024",
  },
  {
    Image: "user-09.jpg",
    Promoted_Employee: "Brian Villalobos",
    Department: "Application Development",
    Designation_From: "Jr App Developer",
    Designation_To: "Sr App Developer",
    Promotion_Date: "21 Jan 2024",
  },
  {
    Image: "user-01.jpg",
    Promoted_Employee: "Harvey Smith",
    Department: "Web Development",
    Designation_From: "Sr Web Developer",
    Designation_To: "Team Lead",
    Promotion_Date: "20 Feb 2024",
  },
  {
    Image: "user-33.jpg",
    Promoted_Employee: "Stephan Peralt",
    Department: "UI / UX",
    Designation_From: "Jr Designer",
    Designation_To: "Sr Designer",
    Promotion_Date: "15 Mar 2024",
  },
  {
    Image: "user-34.jpg",
    Promoted_Employee: "Doglas Martini",
    Department: "Marketing",
    Designation_From: "SEO Analyst",
    Designation_To: "Sr SEO Analyst",
    Promotion_Date: "10 Apr 2024",
  },
];

const columns = [
  {
    sorter: false,
  },
  {
    title: "Promoted Employee",
    dataIndex: "Promoted_Employee",
    key: "Promoted_Employee",
    sorter: {
      compare: (a, b) => {
        a = a.Promoted_Employee.toLowerCase();
        b = b.Promoted_Employee.toLowerCase();
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
    title: "Designation From",
    dataIndex: "Designation_From",
    sorter: {
      compare: (a, b) => {
        a = a.Designation_From.toLowerCase();
        b = b.Designation_From.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Designation To",
    dataIndex: "Designation_To",
    sorter: {
      compare: (a, b) => {
        a = a.Designation_To.toLowerCase();
        b = b.Designation_To.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Promotion Date",
    dataIndex: "Promotion_Date",
    sorter: {
      compare: (a, b) => {
        a = a.Promotion_Date.toLowerCase();
        b = b.Promotion_Date.toLowerCase();
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
      <template v-if="column.key === 'Promoted_Employee'">
        <div class="d-flex align-items-center">
          <router-link to="/sales/invoice-details" class="avatar avatar-md me-2">
            <img
              :src="getUserAvatar(record.Image)"
              class="rounded-circle"
              alt="user"
            />
          </router-link>
          <h6 class="fw-medium">
            <router-link to="/sales/invoice-details">{{
              record.Promoted_Employee
            }}</router-link>
          </h6>
        </div>
      </template>
      <template v-if="column.key === 'action'">
        <div class="action-icon d-inline-flex">
          <a href="javascript:void(0);" class="me-2"
            ><i
              class="ti ti-edit"
              data-bs-toggle="modal"
              data-bs-target="#edit_promotion"
            ></i
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
