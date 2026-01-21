<script>
import { useAssetUrl } from '@/composables/useAssetUrl';
const { getUserAvatar } = useAssetUrl();

const data = [
  {
    Emp_Image: "user-32.jpg",
    Employee: "Anthony Lewis",
    Roll: "UI/UX Team",
    Date: "14 Jan 2024",
    Overtime_Hours: "32",
    Project: "Office Management",
    Image: "user-39.jpg",
    Name: "Michael Walker",
    Status: "Accepted",
  },
  {
    Emp_Image: "user-09.jpg",
    Employee: "Brian Villalobos",
    Roll: "Development",
    Date: "21 Jan 2024",
    Overtime_Hours: "45",
    Project: "Project Management",
    Image: "user-02.jpg",
    Name: "Sophie Headrick",
    Status: "Accepted",
  },
  {
    Emp_Image: "user-01.jpg",
    Employee: "Harvey Smith",
    Roll: "HR",
    Date: "20 Feb 2024",
    Overtime_Hours: "31",
    Project: "Project Management",
    Image: "user-03.jpg",
    Name: "Cameron Drake",
    Status: "Accepted",
  },
  {
    Emp_Image: "user-33.jpg",
    Employee: "Stephan Peralt",
    Roll: "Management",
    Date: "15 Mar 2024",
    Overtime_Hours: "45",
    Project: "Hospital Administration",
    Image: "user-04.jpg",
    Name: "Doris Crowley",
    Status: "Rejected",
  },
  {
    Emp_Image: "user-34.jpg",
    Employee: "Doglas Martini",
    Roll: "Development",
    Date: "12 Apr 2024",
    Overtime_Hours: "36",
    Project: "Office Management",
    Image: "user-06.jpg",
    Name: "Thomas Bordelon",
    Status: "Accepted",
  },
  {
    Emp_Image: "user-02.jpg",
    Employee: "Linda Ray",
    Roll: "UI/UX Team",
    Date: "20 May 2024",
    Overtime_Hours: "49",
    Project: "Hospital Administration",
    Image: "user-06.jpg",
    Name: "Kathleen Gutierrez",
    Status: "Accepted",
  },
  {
    Emp_Image: "user-35.jpg",
    Employee: "Elliot Murray",
    Roll: "Developer",
    Date: "06 Jul 2024",
    Overtime_Hours: "57",
    Project: "Video Calling App",
    Image: "user-07.jpg",
    Name: "Bruce Wright",
    Status: "Accepted",
  },
  {
    Emp_Image: "user-36.jpg",
    Employee: "Rebecca Smtih",
    Roll: "UI/UX Team",
    Date: "02 Sep 2024",
    Overtime_Hours: "21",
    Project: "Office Management",
    Image: "user-09.jpg",
    Name: "Estelle Morgan",
    Status: "Rejected",
  },
  {
    Emp_Image: "user-37.jpg",
    Employee: "Connie Waters",
    Roll: "Management",
    Date: "15 Nov 2024",
    Overtime_Hours: "32",
    Project: "Project Management",
    Image: "user-10.jpg",
    Name: "Stephen Dias",
    Status: "Accepted",
  },
  {
    Emp_Image: "user-38.jpg",
    Employee: "Connie Waters",
    Roll: "Management",
    Date: "15 Nov 2024",
    Overtime_Hours: "66",
    Project: "Ware house developement",
    Image: "user-05.jpg",
    Name: "Angela Thomas",
    Status: "Accepted",
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
    title: "Overtime Hours",
    dataIndex: "Overtime_Hours",
    sorter: {
      compare: (a, b) => {
        a = a.Overtime_Hours.toLowerCase();
        b = b.Overtime_Hours.toLowerCase();
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
      <template v-if="column.key === 'Employee'">
        <div class="d-flex align-items-center file-name-icon">
          <a href="javascript:void(0);" class="avatar avatar-md border avatar-rounded">
            <img
              :src="getUserAvatar(record.Emp_Image)"
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
        <div class="d-flex align-items-center">
          <a
            href="javascript:void(0);"
            class="fs-14 fw-medium text-gray-9 d-flex align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#overtime_details"
            >{{ record.Project }}
          </a>
          <a
            href="javascript:void(0);"
            class="ms-1"
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            data-bs-title="Worked on the Management
                    design & Development"
            ><i class="ti ti-info-circle text-info"></i
          ></a>
        </div>
      </template>
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
      <template v-if="column.key === 'Status'">
        <span
          class="d-inline-flex align-items-center badge-xs"
          :class="[
            'badge',
            record.Status === 'Accepted' ? 'badge-success' : 'badge-danger',
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
            data-bs-target="#edit_overtime"
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
