<script>
import { useAssetUrl } from '@/composables/useAssetUrl';
const { getUserAvatar } = useAssetUrl();

const data = [
  {
    Image: "user-39.jpg",
    Invoice_ID: "Inv-001",
    Client_Name: "Michael Walker",
    Role: "CEO",
    Company_Name: "BrightWave Innovations",
    Payment_Type: "Paypal",
    Paid_Date: "15 Jan 2024",
    Paid_Amount: "$3000",
  },
  {
    Image: "user-40.jpg",
    Invoice_ID: "Inv-002",
    Client_Name: "Sophie Headrick",
    Role: "Manager",
    Company_Name: "Stellar Dynamics",
    Payment_Type: "Paypal",
    Paid_Date: "25 Jan 2024",
    Paid_Amount: "$2500",
  },
  {
    Image: "user-41.jpg",
    Invoice_ID: "Inv-003",
    Client_Name: "Cameron Drake",
    Role: "Director",
    Company_Name: "Quantum Nexus",
    Payment_Type: "Paypal",
    Paid_Date: "22 Feb 2024",
    Paid_Amount: "$2800",
  },
  {
    Image: "user-42.jpg",
    Invoice_ID: "Inv-004",
    Client_Name: "Doris Crowley",
    Role: "Consultant",
    Company_Name: "EcoVision Enterprises",
    Payment_Type: "Paypal",
    Paid_Date: "15 Mar 2024",
    Paid_Amount: "$3300",
  },
  {
    Image: "user-43.jpg",
    Invoice_ID: "Inv-005",
    Client_Name: "Thomas Bordelon",
    Role: "Manager",
    Company_Name: "Aurora Technologies",
    Payment_Type: "Paypal",
    Paid_Date: "16 Apr 2024",
    Paid_Amount: "$3600",
  },
  {
    Image: "user-44.jpg",
    Invoice_ID: "Inv-006",
    Client_Name: "Kathleen Gutierrez",
    Role: "Director",
    Company_Name: "BlueSky Ventures",
    Payment_Type: "Paypal",
    Paid_Date: "21 May 2024",
    Paid_Amount: "$2000",
  },
  {
    Image: "user-45.jpg",
    Invoice_ID: "Inv-007",
    Client_Name: "Bruce Wright",
    Role: "CEO",
    Company_Name: "TerraFusion Energy",
    Payment_Type: "Paypal",
    Paid_Date: "06 Jul 2024",
    Paid_Amount: "$3400",
  },
  {
    Image: "user-46.jpg",
    Invoice_ID: "Inv-008",
    Client_Name: "Estelle Morgan",
    Role: "Manager",
    Company_Name: "UrbanPulse Design",
    Payment_Type: "Paypal",
    Paid_Date: "04 Sep 2024",
    Paid_Amount: "$4000",
  },
  {
    Image: "user-47.jpg",
    Invoice_ID: "Inv-009",
    Client_Name: "Stephen Dias",
    Role: "CEO",
    Company_Name: "Nimbus Networks",
    Payment_Type: "Paypal",
    Paid_Date: "15 Nov 2024",
    Paid_Amount: "$4500",
  },
  {
    Image: "user-48.jpg",
    Invoice_ID: "Inv-010",
    Client_Name: "Angela Thomas",
    Role: "Consultant",
    Company_Name: "Epicurean Delights",
    Payment_Type: "Paypal",
    Paid_Date: "11 Dec 2024",
    Paid_Amount: "$3800",
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
    title: "Payment Type",
    dataIndex: "Payment_Type",
    sorter: {
      compare: (a, b) => {
        a = a.Payment_Type.toLowerCase();
        b = b.Payment_Type.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Paid Date",
    dataIndex: "Paid_Date",
    sorter: {
      compare: (a, b) => {
        a = a.Paid_Date.toLowerCase();
        b = b.Paid_Date.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Paid Amount",
    dataIndex: "Paid_Amount",
    sorter: {
      compare: (a, b) => {
        a = a.Paid_Amount.toLowerCase();
        b = b.Paid_Amount.toLowerCase();
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
              <a href="javascript:void(0);">{{ record.Client_Name }}</a>
            </h6>
            <span class="fs-12 fw-normal">{{ record.Role }}</span>
          </div>
        </div>
      </template>
    </template>
  </a-table>
</template>
