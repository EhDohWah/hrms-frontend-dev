<script>
const data = [
  {
    Cand_ID: "Cand-001",
    Image: "user-01.jpg",
    Candidate: "Harold Gaynor",
    Email: "harold@example.com",
    Applied_Role: "Accountant",
    Phone: "(146) 8964 278",
    Applied_Date: "12 Sep 2024",
    Status: "Sent",
  },
  {
    Cand_ID: "Cand-002",
    Image: "user-34.jpg",
    Candidate: "Sandra Ornellas",
    Email: "sandra@example.com",
    Applied_Role: "App Developer",
    Phone: "(148) 9648 218",
    Applied_Date: "24 Oct 2024",
    Status: "Scheduled",
  },
  {
    Cand_ID: "Cand-003",
    Image: "user-09.jpg",
    Candidate: "John Harris",
    Email: "john@example.com",
    Applied_Role: "Technician",
    Phone: "(196) 2348 947",
    Applied_Date: "18 Feb 2024",
    Status: "Interviewed",
  },
  {
    Cand_ID: "Cand-004",
    Image: "user-26.jpg",
    Candidate: "Carole Langan",
    Email: "carole@example.com",
    Applied_Role: "Web Developer",
    Phone: "(138) 6487 295",
    Applied_Date: "17 Oct 2024",
    Status: "Offered",
  },
  {
    Cand_ID: "Cand-005",
    Image: "user-39.jpg",
    Candidate: "Charles Marks",
    Email: "charles@example.com",
    Applied_Role: "Sales Executive Officer",
    Phone: "(154) 6485 218",
    Applied_Date: "20 Jul 2024",
    Status: "Hired",
  },
  {
    Cand_ID: "Cand-006",
    Image: "user-24.jpg",
    Candidate: "Kerry Drake",
    Email: "kerry@example.com",
    Applied_Role: "Designer",
    Phone: "(185) 5947 097",
    Applied_Date: "20 Jul 2024",
    Status: "Rejected",
  },
  {
    Cand_ID: "Cand-007",
    Image: "user-33.jpg",
    Candidate: "David Carmona",
    Email: "david@example.com",
    Applied_Role: "Account Manager",
    Phone: "(106) 3485 978",
    Applied_Date: "29 Aug 2024",
    Status: "Hired",
  },
  {
    Cand_ID: "Cand-008",
    Image: "user-10.jpg",
    Candidate: "Margaret Soto",
    Email: "margaret@example.com",
    Applied_Role: "SEO Analyst",
    Phone: "(174) 3795 107",
    Applied_Date: "22 Feb 2024",
    Status: "Scheduled",
  },
  {
    Cand_ID: "Cand-009",
    Image: "user-11.jpg",
    Candidate: "Jeffrey Thaler",
    Email: "jeffrey@example.com",
    Applied_Role: "Admin",
    Phone: "(128) 0975 348",
    Applied_Date: "03 Nov 2024",
    Status: "App Received",
  },
  {
    Cand_ID: "Cand-010",
    Image: "user-57.jpg",
    Candidate: "Joyce Golston",
    Email: "joyce@example.com",
    Applied_Role: "Business Analyst",
    Phone: "(132) 1876 304",
    Applied_Date: "17 Dec 2024",
    Status: "Hired",
  },
];

const columns = [
  {
    sorter: false,
  },
  {
    title: "Cand ID",
    dataIndex: "Cand_ID",
    sorter: {
      compare: (a, b) => {
        a = a.Cand_ID.toLowerCase();
        b = b.Cand_ID.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Candidate",
    dataIndex: "Candidate",
    key: "Candidate",
    sorter: {
      compare: (a, b) => {
        a = a.Candidate.toLowerCase();
        b = b.Candidate.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Applied Role",
    dataIndex: "Applied_Role",
    sorter: {
      compare: (a, b) => {
        a = a.Applied_Role.toLowerCase();
        b = b.Applied_Role.toLowerCase();
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
    title: "Applied Date",
    dataIndex: "Applied_Date",
    key: "Applied_Date",
    sorter: {
      compare: (a, b) => {
        a = a.Applied_Date.toLowerCase();
        b = b.Applied_Date.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Resume",
    dataIndex: "Resume",
    key: "Resume",
    sorter: {
      compare: (a, b) => {
        a = a.Resume.toLowerCase();
        b = b.Resume.toLowerCase();
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
      <template v-if="column.key === 'Candidate'">
        <div class="d-flex align-items-center file-name-icon">
          <a href="javascript:void(0);" class="avatar avatar-md">
            <img
              :src="require(`@/assets/img/users/${record.Image}`)"
              class="img-fluid rounded-circle"
              alt="img"
            />
          </a>
          <div class="ms-2">
            <h6 class="fw-medium">
              <a href="javascript:void(0);">{{ record.Candidate }}</a>
            </h6>
            <span class="d-block mt-1">{{ record.Email }}</span>
          </div>
        </div>
      </template>
      <template v-if="column.key === 'Resume'">
        <div class="d-inline-flex">
          <a href="javascript:void(0);" class="text-gray me-2 fs-16"
            ><i class="ti ti-file-text"></i
          ></a>
          <a href="javascript:void(0);" class="text-gray fs-16"
            ><i class="ti ti-download"></i
          ></a>
        </div>
      </template>
      <template v-if="column.key === 'Status'">
        <span
          class="badge border"
          :class="[
            record.Status === 'Sent'
              ? 'border-purple text-purple'
              : record.Status === 'App Received'
              ? 'border-purple text-purple'
              : record.Status === 'Scheduled'
              ? 'border-pink text-pink'
              : record.Status === 'Interviewed'
              ? 'border-info text-info'
              : record.Status === 'Offered'
              ? 'border-warning text-warning'
              : record.Status === 'Hired'
              ? 'border-success text-success'
              : 'border-danger text-danger',
          ]"
          ><i class="ti ti-point-filled"></i>{{ record.Status }}</span
        >
      </template>
      <template v-if="column.key === 'action'">
        <div class="action-icon d-inline-flex">
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
