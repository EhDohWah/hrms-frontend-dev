<script>
import { useAssetUrl } from '@/composables/useAssetUrl';
const { getUserAvatar } = useAssetUrl();

const data = [
  {
    Image: "user-32.jpg",
    Name: "Anthony Lewis",
    Email: "anthony@example.com",
    Created_Date: "12 Sep 2024",
    Role: "Employee",
    Status: "Active",
  },
  {
    Image: "user-09.jpg",
    Name: "Brian Villalobos",
    Email: "brian@example.com",
    Created_Date: "24 Oct 2024",
    Role: "Employee",
    Status: "Active",
  },
  {
    Image: "user-40.jpg",
    Name: "Sophie Headrick",
    Email: "sophie@example.com",
    Created_Date: "18 Feb 2024",
    Role: "Client",
    Status: "Active",
  },
  {
    Image: "user-33.jpg",
    Name: "Stephan Peralt",
    Email: "peral@example.com",
    Created_Date: "17 Oct 2024",
    Role: "Employee",
    Status: "Active",
  },
  {
    Image: "user-44.jpg",
    Name: "Thomas Bordelon",
    Email: "thomas@example.com",
    Created_Date: "20 Jul 2024",
    Role: "Client",
    Status: "Active",
  },
  {
    Image: "user-34.jpg",
    Name: "Doglas Martini",
    Email: "martniwr@example.com",
    Created_Date: "10 Apr 2024",
    Role: "Employee",
    Status: "Active",
  },
  {
    Image: "user-41.jpg",
    Name: "Cameron Drake",
    Email: "cameron@example.com",
    Created_Date: "29 Aug 2024",
    Role: "Client",
    Status: "Active",
  },
  {
    Image: "user-01.jpg",
    Name: "Harvey Smith",
    Email: "harvey@example.com",
    Created_Date: "22 Feb 2024",
    Role: "Employee",
    Status: "Inactive",
  },
  {
    Image: "user-39.jpg",
    Name: "Michael Walker",
    Email: "michael@example.com",
    Created_Date: "03 Nov 2024",
    Role: "Client",
    Status: "Active",
  },
  {
    Image: "user-42.jpg",
    Name: "Doris Crowley",
    Email: "doris@example.com",
    Created_Date: "17 Dec 2024",
    Role: "Client",
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
    title: "Role",
    dataIndex: "Role",
    key: "Role",
    sorter: {
      compare: (a, b) => {
        a = a.Role.toLowerCase();
        b = b.Role.toLowerCase();
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
      <template v-if="column.key === 'Name'">
        <div class="d-flex align-items-center file-name-icon">
          <a href="javascript:void(0);" class="avatar avatar-md border avatar-rounded">
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
      <template v-if="column.key === 'Role'">
        <span
          class="d-inline-flex align-items-center badge-xs"
          :class="[
            'badge',
            record.Role === 'Employee'
              ? 'badge-pink-transparent'
              : 'badge-purple-transparent',
          ]"
        >
          {{ record.Role }}
        </span>
      </template>
      <template v-if="column.key === 'Status'">
        <span
          class="d-inline-flex align-items-center badge-xs"
          :class="[
            'badge',
            record.Status === 'Active' ? 'badge-success' : 'badge-danger',
          ]"
        >
          <i class="ti ti-point-filled me-1"></i>{{ record.Status }}
        </span>
      </template>
    </template>
  </a-table>
</template>
