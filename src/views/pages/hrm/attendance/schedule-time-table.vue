<script>
const data = [
  {
    Image: "user-32.jpg",
    Name: "Anthony Lewis",
    Job_Title: "Accountant",
  },
  {
    Image: "user-09.jpg",
    Name: "Brian Villalobos",
    Job_Title: "Accountant",
  },
  {
    Image: "user-01.jpg",
    Name: "Harvey Smith",
    Job_Title: "Accountant",
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
    title: "Job Title",
    dataIndex: "Job_Title",
    sorter: {
      compare: (a, b) => {
        a = a.Job_Title.toLowerCase();
        b = b.Job_Title.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "User Available Timeings",
    dataIndex: "User_Available",
    key: "User_Available",
    sorter: {
      compare: (a, b) => {
        a = a.User_Available.toLowerCase();
        b = b.User_Available.toLowerCase();
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
          <a href="javascript:void(0);" class="avatar avatar-md border avatar-rounded">
            <img
              :src="require(`@/assets/img/users/${record.Image}`)"
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
      <template v-if="column.key === 'User_Available'">
        <div>
          <p class="mb-0">11-03-2020 - 11:00 AM-12:00 PM</p>
          <p class="mb-0">12-03-2020 - 10:00 AM-11:00 AM</p>
          <p class="mb-0">01-01-1970 - 10:00 AM-11:00 AM</p>
        </div>
      </template>
      <template v-if="column.key === 'action'">
        <div>
          <a
            href="javascript:void(0);"
            data-bs-toggle="modal"
            data-bs-target="#schedule_timing"
            class="btn btn-dark"
            >Schedule Timing</a
          >
        </div>
      </template>
    </template>
  </a-table>
</template>
