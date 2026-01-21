<script>
import { useAssetUrl } from '@/composables/useAssetUrl';
const { getUserAvatar } = useAssetUrl();

const data = [
  {
    Image: "user-32.jpg",
    Name: "Anthony Lewis",
    Role: "Finance",
    Date: "14 Jan 2024",
    Department: "Finance",
    Status: "Present",
  },
  {
    Image: "user-09.jpg",
    Name: "Brian Villalobos",
    Role: "Developer",
    Date: "14 Jan 2024",
    Department: "Application Development",
    Status: "Present",
  },
  {
    Image: "user-01.jpg",
    Name: "Harvey Smith",
    Role: "Developer",
    Date: "14 Jan 2024",
    Department: "IT Management",
    Status: "Present",
  },
  {
    Image: "user-33.jpg",
    Name: "Stephan Peralt",
    Role: "Executive Officer",
    Date: "14 Jan 2024",
    Department: "Web Development",
    Status: "Present",
  },
  {
    Image: "user-33.jpg",
    Name: "Doglas Martini",
    Role: "Manager",
    Date: "14 Jan 2024",
    Department: "Sales",
    Status: "Present",
  },
  {
    Image: "user-02.jpg",
    Name: "Linda Ray",
    Role: "Finance",
    Date: "14 Jan 2024",
    Department: "UI / UX",
    Status: "Present",
  },
  {
    Image: "user-35.jpg",
    Name: "Elliot Murray",
    Role: "Finance",
    Date: "14 Jan 2024",
    Department: "Account Management",
    Status: "Present",
  },
  {
    Image: "user-36.jpg",
    Name: "Rebecca Smtih",
    Role: "Executive",
    Date: "14 Jan 2024",
    Department: "Marketing",
    Status: "Present",
  },
  {
    Image: "user-37.jpg",
    Name: "Connie Waters",
    Role: "Developer",
    Date: "14 Jan 2024",
    Department: "Administration",
    Status: "Present",
  },
  {
    Image: "user-38.jpg",
    Name: "Lori Broaddus",
    Role: "Developer",
    Date: "14 Jan 2024",
    Department: "Business Development",
    Status: "Absent",
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
            />
          </a>
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
            record.Status === 'Present' ? 'badge-soft-success' : 'badge-soft-danger',
          ]"
        >
          <i class="ti ti-point-filled me-1"></i>{{ record.Status }}
        </span>
      </template>
    </template>
  </a-table>
</template>
