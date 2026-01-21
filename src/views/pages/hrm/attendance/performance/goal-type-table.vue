<script>
const data = [
 {

   "Type": "Performance Goals",
   "Description": "Goals that focus on enhancing an employee's performance in their current role.",
   "Status": "Active"
 },
 {

   "Type": "Development Goals",
   "Description": "Goals aimed at personal and professional growth to prepare for future roles or responsibilities.",
   "Status": "Active"
 },
 {

   "Type": "Project Goals",
   "Description": "Specific goals related to the completion and success of a project",
   "Status": "Active"
 },
 {

   "Type": "Financial Goals",
   "Description": "Goals that aim to achieve financial targets or improvements for the organization.",
   "Status": "Active"
 },
 {

   "Type": "Team Goals",
   "Description": "Goals set for a team to achieve collectively, fostering collaboration and cooperation.",
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
    }
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
                    <a href="javascript:void(0);" class="me-2" data-bs-toggle="modal" data-bs-target="#edit_goal_type"><i class="ti ti-edit"></i></a>
                    <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#delete_modal"><i class="ti ti-trash"></i></a>
                </div>
            </template>
        </template>
    </a-table>
</template>