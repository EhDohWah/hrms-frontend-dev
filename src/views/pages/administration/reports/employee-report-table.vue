<script>
import { useAssetUrl } from '@/composables/useAssetUrl';
const { getUserAvatar } = useAssetUrl();

const data = [
  {
    Emp_ID: "Emp-001",
    Image: "user-32.jpg",
    Name: "Anthony Lewis",
    Role: "Finance",
    Email: "anthony@example.com",
    Department: "Finance",
    Phone: "(123) 4567 890",
    Joining_Date: "12 Sep 2024",
    Status: "Active",
  },
  {
    Emp_ID: "Emp-002",
    Image: "user-09.jpg",
    Name: "Brian Villalobos",
    Role: "Developer",
    Email: "brian@example.com",
    Department: "Application Development",
    Phone: "(179) 7382 829",
    Joining_Date: "24 Oct 2024",
    Status: "Active",
  },
  {
    Emp_ID: "Emp-003",
    Image: "user-01.jpg",
    Name: "Harvey Smith",
    Role: "Developer",
    Email: "harvey@example.com",
    Department: "IT Management",
    Phone: "(184) 2719 738",
    Joining_Date: "18 Feb 2024",
    Status: "Active",
  },
  {
    Emp_ID: "Emp-004",
    Image: "user-33.jpg",
    Name: "Stephan Peralt",
    Role: "Executive Officer",
    Email: "peral@example.com",
    Department: "Web Development",
    Phone: "(193) 7839 748",
    Joining_Date: "17 Oct 2024",
    Status: "Active",
  },
  {
    Emp_ID: "Emp-005",
    Image: "user-33.jpg",
    Name: "Doglas Martini",
    Role: "Manager",
    Email: "martniwr@example.com",
    Department: "Sales",
    Phone: "(183) 9302 890",
    Joining_Date: "20 Jul 2024",
    Status: "Active",
  },
  {
    Emp_ID: "Emp-006",
    Image: "user-02.jpg",
    Name: "Linda Ray",
    Role: "Finance",
    Email: "ray456@example.com",
    Department: "UI / UX",
    Phone: "(120) 3728 039",
    Joining_Date: "10 Apr 2024",
    Status: "Active",
  },
  {
    Emp_ID: "Emp-007",
    Image: "user-35.jpg",
    Name: "Elliot Murray",
    Role: "Finance",
    Email: "murray@example.com",
    Department: "Account Management",
    Phone: "(102) 8480 832",
    Joining_Date: "29 Aug 2024",
    Status: "Active",
  },
  {
    Emp_ID: "Emp-008",
    Image: "user-36.jpg",
    Name: "Rebecca Smtih",
    Role: "Executive",
    Email: "smtih@example.com",
    Department: "Marketing",
    Phone: "(162) 8920 713",
    Joining_Date: "22 Feb 2024",
    Status: "Inactive",
  },
  {
    Emp_ID: "Emp-009",
    Image: "user-37.jpg",
    Name: "Connie Waters",
    Role: "Developer",
    Email: "connie@example.com",
    Department: "Administration",
    Phone: "(189) 0920 723",
    Joining_Date: "03 Nov 2024",
    Status: "Active",
  },
  {
    Emp_ID: "Emp-010",
    Image: "user-38.jpg",
    Name: "Lori Broaddus",
    Role: "Developer",
    Email: "broaddus@example.com",
    Department: "Business Development",
    Phone: "(168) 8392 823",
    Joining_Date: "17 Dec 2024",
    Status: "Active",
  },
];

const columns = [
  {
    sorter: false,
  },
  {
    title: "Emp ID",
    dataIndex: "Emp_ID",
    key: "Emp_ID",
    sorter: {
      compare: (a, b) => {
        a = a.Emp_ID.toLowerCase();
        b = b.Emp_ID.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
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
    title: "Email",
    dataIndex: "Email",
    sorter: {
      compare: (a, b) => {
        a = a.Email.toLowerCase();
        b = b.Email.toLowerCase();
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
    title: "Phone",
    dataIndex: "Phone",
    sorter: {
      compare: (a, b) => {
        a = a.Phone.toLowerCase();
        b = b.Phone.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Joining Date",
    dataIndex: "Joining_Date",
    sorter: {
      compare: (a, b) => {
        a = a.Joining_Date.toLowerCase();
        b = b.Joining_Date.toLowerCase();
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
      <template v-if="column.key === 'Emp_ID'">
        <router-link to="/employee/employee-details" class="link-default">{{
          record.Emp_ID
        }}</router-link>
      </template>
      <template v-if="column.key === 'Name'">
        <div class="d-flex align-items-center">
          <a
            href="javascript:void(0);"
            class="avatar avatar-md"
            data-bs-toggle="modal"
            data-bs-target="#view_details"
            ><img
              :src="getUserAvatar(record.Image)"
              class="img-fluid rounded-circle"
              alt="img"
          /></a>
          <div class="ms-2">
            <p class="text-dark mb-0">
              <a
                href="javascript:void(0);"
                data-bs-toggle="modal"
                data-bs-target="#view_details"
                >{{ record.Name }}</a
              >
            </p>
            <span class="fs-12">{{ record.Role }}</span>
          </div>
        </div>
      </template>
      <template v-if="column.key === 'Status'">
        <span
          class="d-inline-flex align-items-center badge-xs"
          :class="[
            'badge',
            record.Status === 'Active' ? 'badge-success' : 'badge-danger',
          ]"
        >
          <i class="ti ti-point-filled me-1"></i>Active
        </span>
      </template>
    </template>
  </a-table>
</template>
