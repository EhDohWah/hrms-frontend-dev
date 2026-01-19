<script>
const data = [
  {
    Name: "Anthony Lewis",
    Image: "user-32.jpg",
    Role: "Finance",
    Date: "14 Jan 2024",
    Check_In: "09:00 AM",
    Status: "Present",
    Check_Out: "06:45 PM",
    Break: "30 Min",
    Late: "32 Min",
    Overtime: "20 Min",
    Production_Hours: "8.55 Hrs",
  },
  {
    Name: "Brian Villalobos",
    Image: "user-09.jpg",
    Role: "Developer",
    Date: "14 Jan 2024",
    Check_In: "09:00 AM",
    Status: "Present",
    Check_Out: "06:12 PM",
    Break: "20 Min",
    Late: "-",
    Overtime: "45 Min",
    Production_Hours: "7.54 Hrs",
  },
  {
    Name: "Harvey Smith",
    Image: "user-01.jpg",
    Role: "Developer",
    Date: "14 Jan 2024",
    Check_In: "09:00 AM",
    Status: "Present",
    Check_Out: "06:13 PM",
    Break: "50 Min",
    Late: "-",
    Overtime: "33 Min",
    Production_Hours: "8.45 Hrs",
  },
  {
    Name: "Stephan Peralt",
    Image: "user-33.jpg",
    Role: "Executive Officer",
    Date: "14 Jan 2024",
    Check_In: "09:00 AM",
    Status: "Present",
    Check_Out: "06:23 PM",
    Break: "41 Min",
    Late: "-",
    Overtime: "50 Min",
    Production_Hours: "8.55 Hrs",
  },
  {
    Name: "Doglas Martini",
    Image: "user-33.jpg",
    Role: "Manager",
    Date: "14 Jan 2024",
    Check_In: "09:00 AM",
    Status: "Present",
    Check_Out: "06:43 PM",
    Break: "23 Min",
    Late: "-",
    Overtime: "10 Min",
    Production_Hours: "8.22 Hrs",
  },
  {
    Name: "Linda Ray",
    Image: "user-02.jpg",
    Role: "Finance",
    Date: "14 Jan 2024",
    Check_In: "09:00 AM",
    Status: "Present",
    Check_Out: "07:15 PM",
    Break: "03 Min",
    Late: "-",
    Overtime: "-",
    Production_Hours: "8.32 Hrs",
  },
  {
    Name: "Elliot Murray",
    Image: "user-35.jpg",
    Role: "Finance",
    Date: "14 Jan 2024",
    Check_In: "09:00 AM",
    Status: "Present",
    Check_Out: "07:13 PM",
    Break: "32 Min",
    Late: "-",
    Overtime: "-",
    Production_Hours: "9.15 Hrs",
  },
  {
    Name: "Rebecca Smtih",
    Image: "user-36.jpg",
    Role: "Executive",
    Date: "14 Jan 2024",
    Check_In: "09:00 AM",
    Status: "Present",
    Check_Out: "09:17 PM",
    Break: "14 Min",
    Late: "12 Min",
    Overtime: "-",
    Production_Hours: "9.25 Hrs",
  },
  {
    Name: "Connie Waters",
    Image: "user-37.jpg",
    Role: "Developer",
    Date: "14 Jan 2024",
    Check_In: "09:00 AM",
    Status: "Present",
    Check_Out: "08:15 PM",
    Break: "12 Min",
    Late: "-",
    Overtime: "-",
    Production_Hours: "8.35Hrs",
  },
  {
    Name: "Lori Broaddus",
    Image: "user-38.jpg",
    Role: "Developer",
    Date: "14 Jan 2024",
    Check_In: "09:00 AM",
    Status: "Absent",
    Check_Out: "09:23 PM",
    Break: "10 Min",
    Late: "-",
    Overtime: "-",
    Production_Hours: "9.15 Hrs",
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
    title: "Check In",
    dataIndex: "Check_In",
    sorter: {
      compare: (a, b) => {
        a = a.Check_In.toLowerCase();
        b = b.Check_In.toLowerCase();
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
    title: "Check Out",
    dataIndex: "Check_Out",
    sorter: {
      compare: (a, b) => {
        a = a.Check_Out.toLowerCase();
        b = b.Check_Out.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Break",
    dataIndex: "Break",
    sorter: {
      compare: (a, b) => {
        a = a.Break.toLowerCase();
        b = b.Break.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Late",
    dataIndex: "Late",
    sorter: {
      compare: (a, b) => {
        a = a.Late.toLowerCase();
        b = b.Late.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Overtime",
    dataIndex: "Overtime",
    sorter: {
      compare: (a, b) => {
        a = a.Overtime.toLowerCase();
        b = b.Overtime.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Production Hours",
    dataIndex: "Production_Hours",
    key: "Production_Hours",
    sorter: {
      compare: (a, b) => {
        a = a.Production_Hours.toLowerCase();
        b = b.Production_Hours.toLowerCase();
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
              :src="require(`@/assets/img/users/${record.Image}`)"
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
            record.Status === 'Present' ? 'badge-soft-success' : 'badge-soft-danger',
          ]"
        >
          <i class="ti ti-point-filled me-1"></i>{{ record.Status }}
        </span>
      </template>
      <template v-if="column.key === 'Production_Hours'">
        <span
          class="d-inline-flex align-items-center badge-sm"
          :class="[
            'badge',
            record.Production_Hours === '8.55 Hrs'
              ? 'badge-success'
              : record.Production_Hours === '9.15 Hrs'
              ? 'badge-skyblue'
              : 'badge-danger',
          ]"
        >
          <i class="ti ti-clock-hour-11 me-1"></i>{{ record.Production_Hours }}
        </span>
      </template>
    </template>
  </a-table>
</template>
