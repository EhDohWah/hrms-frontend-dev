<script>
import { useAssetUrl } from '@/composables/useAssetUrl';
const { getUserAvatar } = useAssetUrl();

const data = [
  {
    Employee: "Anthony Lewis",
    Image: "user-32.jpg",
    Roll: "UI/UX Team",
    Date: "14 Jan 2024",
    Project: "Office Management",
    Assigned_Hours: "32",
    Worked_Hours: "13",
  },
  {
    Employee: "Brian Villalobos",
    Image: "user-09.jpg",
    Roll: "Development",
    Date: "21 Jan 2024",
    Project: "Project Management",
    Assigned_Hours: "45",
    Worked_Hours: "14",
  },
  {
    Employee: "Harvey Smith",
    Image: "user-01.jpg",
    Roll: "HR",
    Date: "20 Feb 2024",
    Project: "Project Management",
    Assigned_Hours: "45",
    Worked_Hours: "22",
  },
  {
    Employee: "Stephan Peralt",
    Image: "user-33.jpg",
    Roll: "Management",
    Date: "15 Mar 2024",
    Project: "Hospital Administration",
    Assigned_Hours: "45",
    Worked_Hours: "78",
  },
  {
    Employee: "Doglas Martini",
    Image: "user-34.jpg",
    Roll: "Development",
    Date: "12 Apr 2024",
    Project: "Office Management",
    Assigned_Hours: "36",
    Worked_Hours: "45",
  },
  {
    Employee: "Linda Ray",
    Image: "user-02.jpg",
    Roll: "UI/UX Team",
    Date: "20 May 2024",
    Project: "Hospital Administration",
    Assigned_Hours: "49",
    Worked_Hours: "14",
  },
  {
    Employee: "Elliot Murray",
    Image: "user-35.jpg",
    Roll: "Developer",
    Date: "06 Jul 2024",
    Project: "Video Calling App",
    Assigned_Hours: "57",
    Worked_Hours: "16",
  },
  {
    Employee: "Rebecca Smtih",
    Image: "user-36.jpg",
    Roll: "UI/UX Team",
    Date: "02 Sep 2024",
    Project: "Office Management",
    Assigned_Hours: "21",
    Worked_Hours: "18",
  },
  {
    Employee: "Connie Waters",
    Image: "user-37.jpg",
    Roll: "Management",
    Date: "15 Nov 2024",
    Project: "Project Management",
    Assigned_Hours: "32",
    Worked_Hours: "19",
  },
  {
    Employee: "Connie Waters",
    Image: "user-38.jpg",
    Roll: "Management",
    Date: "15 Nov 2024",
    Project: "Project Management",
    Assigned_Hours: "32",
    Worked_Hours: "19",
  },
];

const columns = [
  {
    sorter: false,
  },
  {
    title: "Employee",
    dataIndex: "Employee",
    key: "Employee",
    sorter: {
      compare: (a, b) => {
        a = a.Employee.toLowerCase();
        b = b.Employee.toLowerCase();
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
    title: "Project",
    dataIndex: "Project",
    key: "Project",
    sorter: {
      compare: (a, b) => {
        a = a.Project.toLowerCase();
        b = b.Project.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Assigned Hours",
    dataIndex: "Assigned_Hours",
    sorter: {
      compare: (a, b) => {
        a = a.Assigned_Hours.toLowerCase();
        b = b.Assigned_Hours.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Worked Hours",
    dataIndex: "Worked_Hours",
    sorter: {
      compare: (a, b) => {
        a = a.Worked_Hours.toLowerCase();
        b = b.Worked_Hours.toLowerCase();
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
      <template v-if="column.key === 'Employee'">
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
              <a href="javascript:void(0);">{{ record.Employee }}</a>
            </h6>
            <span class="fs-12 fw-normal">{{ record.Roll }}</span>
          </div>
        </div>
      </template>
      <template v-if="column.key === 'Project'">
        <p class="fs-14 fw-medium text-gray-9 d-flex align-items-center">
          {{ record.Project }}
          <a
            href="javascript:void(0);"
            class="ms-1"
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            data-bs-title="Worked on the Management
                    design & Development"
            ><i class="ti ti-info-circle text-info"></i
          ></a>
        </p>
      </template>
      <template v-if="column.key === 'action'">
        <div class="action-icon d-inline-flex">
          <a
            href="javascript:void(0);"
            class="me-2"
            data-bs-toggle="modal"
            data-bs-target="#edit_timesheet"
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
