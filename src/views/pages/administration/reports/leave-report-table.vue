<script>
import { useAssetUrl } from '@/composables/useAssetUrl';
const { getReportImageUrl } = useAssetUrl();

const data = [
  {
    Image: "user-01.jpg",
    Invoice_ID: "Inv-001",
    Client_Name: "Michael Walker",
    Role: "CEO",
    Company_Name: "BrightWave Innovations",
    Created_Date: "14 Jan 2024",
    Due_Date: "15 Jan 2024",
    Amount: "$3000",
    Status: "Paid",
  },
  {
    Image: "user-02.jpg",
    Invoice_ID: "Inv-002",
    Client_Name: "Sophie Headrick",
    Role: "Manager",
    Company_Name: "Stellar Dynamics",
    Created_Date: "21 Jan 2024",
    Due_Date: "25 Jan 2024",
    Amount: "$2500",
    Status: "Sent",
  },
  {
    Image: "user-03.jpg",
    Invoice_ID: "Inv-003",
    Client_Name: "Cameron Drake",
    Role: "Director",
    Company_Name: "Quantum Nexus",
    Created_Date: "20 Feb 2024",
    Due_Date: "22 Feb 2024",
    Amount: "$2800",
    Status: "Partially Paid",
  },
  {
    Image: "user-04.jpg",
    Invoice_ID: "Inv-004",
    Client_Name: "Doris Crowley",
    Role: "Consultant",
    Company_Name: "EcoVision Enterprises",
    Created_Date: "15 Mar 2024",
    Due_Date: "17 Mar 2024",
    Amount: "$3300",
    Status: "Sent",
  },
  {
    Image: "user-05.jpg",
    Invoice_ID: "Inv-005",
    Client_Name: "Thomas Bordelon",
    Role: "Manager",
    Company_Name: "Aurora Technologies",
    Created_Date: "12 Apr 2024",
    Due_Date: "16 Apr 2024",
    Amount: "$3600",
    Status: "Paid",
  },
  {
    Image: "user-06.jpg",
    Invoice_ID: "Inv-006",
    Client_Name: "Kathleen Gutierrez",
    Role: "Director",
    Company_Name: "BlueSky Ventures",
    Created_Date: "20 May 2024",
    Due_Date: "21 May 2024",
    Amount: "$2000",
    Status: "Partially Paid",
  },
  {
    Image: "user-07.jpg",
    Invoice_ID: "Inv-007",
    Client_Name: "Bruce Wright",
    Role: "CEO",
    Company_Name: "TerraFusion Energy",
    Created_Date: "06 Jul 2024",
    Due_Date: "06 Jul 2024",
    Amount: "$3400",
    Status: "Sent",
  },
  {
    Image: "user-08.jpg",
    Invoice_ID: "Inv-008",
    Client_Name: "Estelle Morgan",
    Role: "Manager",
    Company_Name: "UrbanPulse Design",
    Created_Date: "02 Sep 2024",
    Due_Date: "04 Sep 2024",
    Amount: "$4000",
    Status: "Paid",
  },
  {
    Image: "user-09.jpg",
    Invoice_ID: "Inv-009",
    Client_Name: "Stephen Dias",
    Role: "CEO",
    Company_Name: "Nimbus Networks",
    Created_Date: "15 Nov 2024",
    Due_Date: "15 Nov 2024",
    Amount: "$4500",
    Status: "Partially Paid",
  },
  {
    Image: "user-10.jpg",
    Invoice_ID: "Inv-010",
    Client_Name: "Angela Thomas",
    Role: "Consultant",
    Company_Name: "Epicurean Delights",
    Created_Date: "10 Dec 2024",
    Due_Date: "11 Dec 2024",
    Amount: "$3800",
    Status: "Paid",
  },
];

const columns = [
  {
    sorter: false,
  },
  {
    title: "Invoice ID",
    dataIndex: "Invoice_ID",
    key: "Invoice_ID",
    sorter: {
      compare: (a, b) => {
        a = a.Invoice_ID.toLowerCase();
        b = b.Invoice_ID.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Client Name",
    dataIndex: "Client_Name",
    key: "Client_Name",
    sorter: {
      compare: (a, b) => {
        a = a.Client_Name.toLowerCase();
        b = b.Client_Name.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Company Name",
    dataIndex: "Company_Name",
    sorter: {
      compare: (a, b) => {
        a = a.Company_Name.toLowerCase();
        b = b.Company_Name.toLowerCase();
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
    title: "Due Date",
    dataIndex: "Due_Date",
    sorter: {
      compare: (a, b) => {
        a = a.Due_Date.toLowerCase();
        b = b.Due_Date.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Amount",
    dataIndex: "Amount",
    sorter: {
      compare: (a, b) => {
        a = a.Amount.toLowerCase();
        b = b.Amount.toLowerCase();
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
      <template v-if="column.key === 'Invoice_ID'">
        <router-link to="/sales/invoice-details" class="link-default">{{
          record.Invoice_ID
        }}</router-link>
      </template>
      <template v-if="column.key === 'Client_Name'">
        <div class="d-flex align-items-center">
          <a
            href="javascript:void(0);"
            class="avatar avatar-md"
            data-bs-toggle="modal"
            data-bs-target="#view_details"
            ><img
              :src="getReportImageUrl(record.Image)"
              class="img-fluid rounded-circle"
              alt="img"
          /></a>
          <div class="ms-2">
            <p class="text-dark mb-0">
              <a
                href="javascript:void(0);"
                data-bs-toggle="modal"
                data-bs-target="#view_details"
                >{{ record.Client_Name }}</a
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
            record.Status === 'Paid'
              ? 'badge-soft-success'
              : record.Status === 'Sent'
              ? 'badge-soft-purple'
              : 'badge-soft-warning',
          ]"
        >
          {{ record.Status }}
        </span>
      </template>
    </template>
  </a-table>
</template>
