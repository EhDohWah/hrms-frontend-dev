<script>
const data = [
 {
   "Image": "user-32.jpg",
   "Name": "Anthony Lewis",
   "Role": "Finance",
   "Paid_Amount": "$3000",
   "Paid_Month": "$3000",
   "Paid_Year": "$3000"
 },
 {
   "Image": "user-09.jpg",
   "Name": "Brian Villalobos",
   "Role": "Developer",
   "Paid_Amount": "$2500",
   "Paid_Month": "$2500",
   "Paid_Year": "$2500"
 },
 {
   "Image": "user-37.jpg",
   "Name": "Connie Waters",
   "Role": "Developer",
   "Paid_Amount": "$2800",
   "Paid_Month": "$2800",
   "Paid_Year": "$2800"
 },
 {
   "Image": "user-33.jpg",
   "Name": "Doglas Martini",
   "Role": "Manager",
   "Paid_Amount": "$3300",
   "Paid_Month": "$3300",
   "Paid_Year": "$3300"
 },
 {
   "Image": "user-35.jpg",
   "Name": "Elliot Murray",
   "Role": "Finance",
   "Paid_Amount": "$3600",
   "Paid_Month": "$3600",
   "Paid_Year": "$3600"
 },
 {
   "Image": "user-01.jpg",
   "Name": "Harvey Smith",
   "Role": "Developer",
   "Paid_Amount": "$2000",
   "Paid_Month": "$2000",
   "Paid_Year": "$2000"
 },
 {
   "Image": "user-02.jpg",
   "Name": "Linda Ray",
   "Role": "Finance",
   "Paid_Amount": "$3400",
   "Paid_Month": "$3400",
   "Paid_Year": "$3400"
 },
 {
   "Image": "user-38.jpg",
   "Name": "Lori Broaddus",
   "Role": "Developer",
   "Paid_Amount": "$4000",
   "Paid_Month": "$4000",
   "Paid_Year": "$4000"
 },
 {
   "Image": "user-36.jpg",
   "Name": "Rebecca Smtih",
   "Role": "Executive",
   "Paid_Amount": "$4500",
   "Paid_Month": "$4500",
   "Paid_Year": "$4500"
 }
]

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
    {
        title: "Paid Month",
        dataIndex: "Paid_Month",
        sorter: {
        compare: (a, b) => {
            a = a.Paid_Month.toLowerCase();
            b = b.Paid_Month.toLowerCase();
            return a > b ? -1 : b > a ? 1 : 0;
        },
        },
    },
    {
        title: "Paid Year",
        dataIndex: "Paid_Year",
        sorter: {
        compare: (a, b) => {
            a = a.Paid_Year.toLowerCase();
            b = b.Paid_Year.toLowerCase();
            return a > b ? -1 : b > a ? 1 : 0;
        },
        },
    },
]

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
        }
    },
}
</script>

<template>
    <a-table class="table datatable thead-light" 
        :columns="columns"  
        :data-source="data" 
        :row-selection="rowSelection"
    >
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'Name'">
                <div class="d-flex align-items-center">
                    <a href="javascript:void(0);" class="avatar avatar-md" data-bs-toggle="modal" data-bs-target="#view_details">
                        <img :src="require(`@/assets/img/users/${record.Image}`)" class="img-fluid rounded-circle" alt="img">
                    </a>
                    <div class="ms-2">
                        <p class="text-dark mb-0"><a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#view_details">Anthony Lewis</a></p>
                        <span class="fs-12">{{record.Name}}</span>
                    </div>
                </div>
            </template>
        </template>
    </a-table>
</template>