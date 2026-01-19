<script>
const data = [
 {
   "Type": "Git Training",
   "Description": "Git training covers managing code changes and collaboration using Git commands and workflows",
   "Status": "Active"
 },
 {
   "Type": "HTML Training",
   "Description": "HTML training teaches how to create and structure web pages using HTML tags and elements.",
   "Status": "Active"
 },
 {
   "Type": "React Training",
   "Description": "React training covers building UIs with components, state, and hooks.",
   "Status": "Active"
 },
 {
   "Type": "Nodejs Training",
   "Description": "Node.js training focuses on building server-side applications using JavaScript.",
   "Status": "Active"
 },
 {
   "Type": "Vuejs Training",
   "Description": "Vue.js training focuses on building UIs with Vue.js components.",
   "Status": "Active"
 }
]

const columns = [
    {
        sorter: false,
    },
    {
        title: "Type",
        dataIndex: "Type",
        sorter: {
        compare: (a, b) => {
            a = a.Type.toLowerCase();
            b = b.Type.toLowerCase();
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
            <template v-if="column.key === 'Status'">
                <span class="badge badge-success d-inline-flex align-items-center badge-xs">
                    <i class="ti ti-point-filled me-1"></i>{{record.Status}}
                </span>
            </template>
            <template v-if="column.key === 'action'">
                <div class="action-icon d-inline-flex">
                    <a href="javascript:void(0);" class="me-2" data-bs-toggle="modal" data-bs-target="#edit_training_type"><i class="ti ti-edit"></i></a>
                    <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#delete_modal"><i class="ti ti-trash"></i></a>
                </div>
            </template>
        </template>
    </a-table>
</template>