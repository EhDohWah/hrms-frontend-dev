<script>
const data = [
  {
    Image: "user-32.jpg",
    Resigning_Employee: "Anthony Lewis",
    Department: "Finance",
    Termination_Type: "Retirement",
    Notice_Date: "14 Jan 2024",
    Reason: "Employee retires",
    Resignation_Date: "14 Mar 2024",
  },
  {
    Image: "user-09.jpg",
    Resigning_Employee: "Brian Villalobos",
    Department: "Application Development",
    Termination_Type: "Insubordination",
    Notice_Date: "21 Jan 2024",
    Reason: "Entrepreneurial Pursuits",
    Resignation_Date: "21 Mar 2024",
  },
  {
    Image: "user-01.jpg",
    Resigning_Employee: "Harvey Smith",
    Department: "Web Development",
    Termination_Type: "Layoff",
    Notice_Date: "18 Feb 2024",
    Reason: "Workforce reduction",
    Resignation_Date: "18 Apr 2024",
  },
  {
    Image: "user-33.jpg",
    Resigning_Employee: "Stephan Peralt",
    Department: "UI / UX",
    Termination_Type: "Breach of Contract",
    Notice_Date: "14 Mar 2024",
    Reason: "Violates the terms of the contract",
    Resignation_Date: "14 May 2024",
  },
  {
    Image: "user-34.jpg",
    Resigning_Employee: "Doglas Martini",
    Department: "Marketing",
    Termination_Type: "Lack of Skills",
    Notice_Date: "10 Apr 2024",
    Reason: "Unable to perform job duties",
    Resignation_Date: "10 Jun 2024",
  },
];

const columns = [
  {
    sorter: false,
  },
  {
    title: "Resigning Employee",
    dataIndex: "Resigning_Employee",
    key: "Resigning_Employee",
    sorter: {
      compare: (a, b) => {
        a = a.Resigning_Employee.toLowerCase();
        b = b.Resigning_Employee.toLowerCase();
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
    title: "Termination Type",
    dataIndex: "Termination_Type",
    sorter: {
      compare: (a, b) => {
        a = a.Termination_Type.toLowerCase();
        b = b.Termination_Type.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Notice Date",
    dataIndex: "Notice_Date",
    sorter: {
      compare: (a, b) => {
        a = a.Notice_Date.toLowerCase();
        b = b.Notice_Date.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Reason",
    dataIndex: "Reason",
    sorter: {
      compare: (a, b) => {
        a = a.Reason.toLowerCase();
        b = b.Reason.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Resignation Date",
    dataIndex: "Resignation_Date",
    sorter: {
      compare: (a, b) => {
        a = a.Resignation_Date.toLowerCase();
        b = b.Resignation_Date.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "",
    dataIndex: "action",
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
      <template v-if="column.key === 'Resigning_Employee'">
        <div class="d-flex align-items-center">
          <router-link to="/sales/invoice-details" class="avatar avatar-md me-2">
            <img
              :src="require(`@/assets/img/users/${record.Image}`)"
              class="rounded-circle"
              alt="user"
            />
          </router-link>
          <h6 class="fw-medium">
            <router-link to="/sales/invoice-details">{{
              record.Resigning_Employee
            }}</router-link>
          </h6>
        </div>
      </template>
      <template v-if="column.key === 'action'">
        <div class="action-icon d-inline-flex">
          <a
            href="javascript:void(0);"
            class="me-2"
            data-bs-toggle="modal"
            data-bs-target="#edit_termination"
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
