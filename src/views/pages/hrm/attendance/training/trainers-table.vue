<script>
const data = [
 {
   "Image": "user-32.jpg",
   "Name": "Anthony Lewis",
   "Phone": "(123) 4567 890",
   "Email": "anthony@example.com",
   "Description": "Anthony is a trainer known for his expertise in leadership development.",
   "Status": "Active"
 },
 {
   "Image": "user-09.jpg",
   "Name": "Brian Villalobos",
   "Phone": "(179) 7382 829",
   "Email": "brian@example.com",
   "Description": "Brian is a trainer who excels in teaching advanced technical skills.",
   "Status": "Active"
 },
 {
   "Image": "user-01.jpg",
   "Name": "Harvey Smith",
   "Phone": "(184) 2719 738",
   "Email": "harvey@example.com",
   "Description": "Harvey is a trainer known for his expertise in conflict resolution.",
   "Status": "Active"
 },
 {
   "Image": "user-33.jpg",
   "Name": "Stephan Peralt",
   "Phone": "(193) 7839 748",
   "Email": "peral@example.com",
   "Description": "Stephan is a trainer who enhances creative problem-solving skills.",
   "Status": "Active"
 },
 {
   "Image": "user-34.jpg",
   "Name": "Doglas Martini",
   "Phone": "(183) 9302 890",
   "Email": "martniwr@example.com",
   "Description": "Doglas is a trainer who enhances project management skills.",
   "Status": "Active"
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
        title: "Email",
        dataIndex: "Email",
        sorter: {
        compare: (a, b) => {
            a = a.Email.toLowerCase();
            b = b.Email.toLowerCase();
            return a > b ? -1 : b > a ? 1 : 0;
        },
        },
    },
    {
        title: "Description",
        dataIndex: "Description",
        sorter: {
        compare: (a, b) => {
            a = a.Description.toLowerCase();
            b = b.Description.toLowerCase();
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
        sorter: true
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
                <div class="d-flex align-items-center file-name-icon">
                    <a href="javascript:void(0);" class="avatar avatar-md border avatar-rounded">
                        <img :src="require(`@/assets/img/users/${record.Image}`)" class="img-fluid" alt="img">
                    </a>
                    <div class="ms-2">
                        <h6 class="fw-medium"><a href="javascript:void(0);">{{record.Name}}</a></h6>
                    </div>
                </div>
            </template>
            <template v-if="column.key === 'Status'">
                <span class="badge badge-success d-inline-flex align-items-center badge-xs">
                    <i class="ti ti-point-filled me-1"></i>{{record.Status}}
                </span>
            </template>
            <template v-if="column.key === 'action'">
                <div class="action-icon d-inline-flex">
                    <a href="javascript:void(0);" class="me-2" data-bs-toggle="modal" data-bs-target="#edit_trainer"><i class="ti ti-edit"></i></a>
                    <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#delete_modal"><i class="ti ti-trash"></i></a>
                </div>
            </template>
        </template>
    </a-table>
</template>