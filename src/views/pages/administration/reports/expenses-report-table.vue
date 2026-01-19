<script>
const data = [
  {
    Expense_Name: "Online Course",
    Date: "14 Jan 2024",
    Payment_Method: "Cash",
    Amount: "$3000",
  },
  {
    Expense_Name: "Travel",
    Date: "20 Feb 2024",
    Payment_Method: "Cheque",
    Amount: "$2800",
  },
  {
    Expense_Name: "Office Supplies",
    Date: "15 Mar 2024",
    Payment_Method: "Cash",
    Amount: "$3300",
  },
  {
    Expense_Name: "Welcome Kit",
    Date: "12 Apr 2024",
    Payment_Method: "Cheque",
    Amount: "$3600",
  },
  {
    Expense_Name: "Equipment",
    Date: "20 May 2024",
    Payment_Method: "Cheque",
    Amount: "$2000",
  },
  {
    Expense_Name: "Miscellaneous",
    Date: "06 Jul 2024",
    Payment_Method: "Cash",
    Amount: "$3400",
  },
  {
    Expense_Name: "Payroll",
    Date: "02 Sep 2024",
    Payment_Method: "Cheque",
    Amount: "$4000",
  },
  {
    Expense_Name: "Cafeteria",
    Date: "15 Nov 2024",
    Payment_Method: "Cash",
    Amount: "$4500",
  },
  {
    Expense_Name: "Cleaning Supplies",
    Date: "10 Dec 2024",
    Payment_Method: "Cheque",
    Amount: "$3800",
  },
];

const columns = [
  {
    sorter: false,
  },
  {
    title: "Expense Name",
    dataIndex: "Expense_Name",
    key: "Expense_Name",
    sorter: {
      compare: (a, b) => {
        a = a.Expense_Name.toLowerCase();
        b = b.Expense_Name.toLowerCase();
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
    title: "Payment Method",
    dataIndex: "Payment_Method",
    sorter: {
      compare: (a, b) => {
        a = a.Payment_Method.toLowerCase();
        b = b.Payment_Method.toLowerCase();
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
      <template v-if="column.key === 'Expense_Name'">
        <h6 class="fs-14 fw-medium">{{ record.Expense_Name }}</h6>
      </template>
    </template>
  </a-table>
</template>
