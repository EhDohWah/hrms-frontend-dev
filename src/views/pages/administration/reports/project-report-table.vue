<script>
const data = [
  {
    Image: "user-32.jpg",
    Project_ID: "PRO-001",
    Project_Name: "Office Management App",
    Leader: "Anthony Lewis",
    Img: "user-09.jpg",
    Img1: "user-47.jpg",
    Img2: "user-44.jpg",
    Team: "2",
    Deadline: "12 Sep 2024",
    Priority: "Low",
    Status: "Active",
  },
  {
    Image: "user-09.jpg",
    Project_ID: "PRO-002",
    Project_Name: "Clinic Management",
    Leader: "Brian Villalobos",
    Img: "user-17.jpg",
    Img1: "user-08.jpg",
    Img2: "user-18.jpg",
    Team: "3",
    Deadline: "24 Oct 2024",
    Priority: "Medium",
    Status: "Active",
  },
  {
    Image: "user-01.jpg",
    Project_ID: "PRO-003",
    Project_Name: "Educational Platform",
    Leader: "Harvey Smith",
    Img: "user-21.jpg",
    Img1: "user-22.jpg",
    Img2: "user-33.jpg",
    Team: "1",
    Deadline: "18 Feb 2024",
    Priority: "High",
    Status: "Active",
  },
  {
    Image: "user-33.jpg",
    Project_ID: "PRO-004",
    Project_Name: "Chat & Call  Mobile App",
    Leader: "Stephan Peralt",
    Img: "user-16.jpg",
    Img1: "user-26.jpg",
    Img2: "user-35.jpg",
    Team: "3",
    Deadline: "17 Oct 2024",
    Priority: "Low",
    Status: "Active",
  },
  {
    Image: "user-34.jpg",
    Project_ID: "PRO-005",
    Project_Name: "Travel Planning Website",
    Leader: "Doglas Martini",
    Img: "user-16.jpg",
    Img1: "user-36.jpg",
    Img2: "user-10.jpg",
    Team: "4",
    Deadline: "20 Jul 2024",
    Priority: "High",
    Status: "Active",
  },
  {
    Image: "user-02.jpg",
    Project_ID: "PRO-006",
    Project_Name: "Service Booking Software",
    Leader: "Linda Ray",
    Img: "user-11.jpg",
    Img1: "user-19.jpg",
    Img2: "user-20.jpg",
    Team: "5",
    Deadline: "10 Apr 2024",
    Priority: "Low",
    Status: "Active",
  },
  {
    Image: "user-22.jpg",
    Project_ID: "PRO-007",
    Project_Name: "Hotel Booking App",
    Leader: "Elliot Murray",
    Img: "user-14.jpg",
    Img1: "user-29.jpg",
    Img2: "user-22.jpg",
    Team: "4",
    Deadline: "29 Aug 2024",
    Priority: "Medium",
    Status: "Active",
  },
  {
    Image: "user-36.jpg",
    Project_ID: "PRO-008",
    Project_Name: "Car & Bike Rental Software",
    Leader: "Rebecca Smtih",
    Img: "user-08.jpg",
    Img1: "user-38.jpg",
    Img2: "user-42.jpg",
    Team: "2",
    Deadline: "22 Feb 2024",
    Priority: "Low",
    Status: "Inactive",
  },
  {
    Image: "user-37.jpg",
    Project_ID: "PRO-009",
    Project_Name: "Food Order App",
    Leader: "Connie Waters",
    Img: "user-26.jpg",
    Img1: "user-02.jpg",
    Img2: "user-40.jpg",
    Team: "1",
    Deadline: "03 Nov 2024",
    Priority: "Medium",
    Status: "Active",
  },
  {
    Image: "user-38.jpg",
    Project_ID: "PRO-010",
    Project_Name: "POS Admin Software",
    Leader: "Lori Broaddus",
    Img: "user-13.jpg",
    Img1: "user-11.jpg",
    Img2: "user-18.jpg",
    Team: "3",
    Deadline: "17 Dec 2024",
    Priority: "Low",
    Status: "Active",
  },
];

const columns = [
  {
    sorter: false,
  },
  {
    title: "Project ID",
    dataIndex: "Project_ID",
    sorter: {
      compare: (a, b) => {
        a = a.Project_ID.toLowerCase();
        b = b.Project_ID.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Project Name",
    dataIndex: "Project_Name",
    key: "Project_Name",
    sorter: {
      compare: (a, b) => {
        a = a.Project_Name.toLowerCase();
        b = b.Project_Name.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Leader",
    dataIndex: "Leader",
    key: "Leader",
    sorter: {
      compare: (a, b) => {
        a = a.Leader.toLowerCase();
        b = b.Leader.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Team",
    dataIndex: "Team",
    key: "Team",
    sorter: {
      compare: (a, b) => {
        a = a.Team.toLowerCase();
        b = b.Team.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Deadline",
    dataIndex: "Deadline",
    sorter: {
      compare: (a, b) => {
        a = a.Deadline.toLowerCase();
        b = b.Deadline.toLowerCase();
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
      <template v-if="column.key === 'Project_Name'">
        <div class="d-flex align-items-center file-name-icon">
          <h6 class="fw-medium">
            <a href="javascript:void(0);">{{ record.Project_Name }}</a>
          </h6>
        </div>
      </template>
      <template v-if="column.key === 'Leader'">
        <div class="d-flex align-items-center file-name-icon">
          <a href="javascript:void(0);" class="avatar avatar-md border avatar-rounded">
            <img
              :src="require(`@/assets/img/users/${record.Image}`)"
              class="img-fluid"
              alt="img"
            />
          </a>
          <div class="ms-2">
            <h6 class="fw-normal fs-14 text-gray-5">{{ record.Leader }}</h6>
          </div>
        </div>
      </template>
      <template v-if="column.key === 'Team'">
        <div class="avatar-list-stacked avatar-group-sm">
          <span class="avatar border-0">
            <img
              :src="require(`@/assets/img/users/${record.Img}`)"
              class="rounded-circle"
              alt="img"
            />
          </span>
          <span class="avatar border-0">
            <img
              :src="require(`@/assets/img/users/${record.Img1}`)"
              class="rounded-circle"
              alt="img"
            />
          </span>
          <span class="avatar border-0">
            <img
              :src="require(`@/assets/img/users/${record.Img2}`)"
              class="rounded-circle"
              alt="img"
            />
          </span>
          <span class="avatar group-counts bg-primary rounded-circle border-0 fs-10">
            +{{ record.Team }}
          </span>
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
            record.Status === 'Active' ? 'badge-success' : 'badge-danger',
          ]"
        >
          <i class="ti ti-point-filled me-1"></i>{{ record.Status }}
        </span>
      </template>
    </template>
  </a-table>
</template>
