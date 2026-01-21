<script>
import { useAssetUrl } from '@/composables/useAssetUrl();
const { getUserAvatar } = useAssetUrl();

const data = [
 {
   "Image": "user-49.jpg",
   "Employee": "Anthony Lewis",
   "Roll": "UI/UX Team",
   "Status": "Present",
   "Check_In": "09:00 AM",
   "Check_Out": "06:45 PM",
   "Break": "30 Min",
   "Late": "32 Min",
   "Production_Hours": "8.55 Hrs"
 },
 {
   "Image": "user-09.jpg",
   "Employee": "Brian Villalobos",
   "Roll": "Development",
   "Status": "Present",
   "Check_In": "09:00 AM",
   "Check_Out": "06:12 PM",
   "Break": "20 Min",
   "Late": "20 Min",
   "Production_Hours": "7.54 Hrs"
 },
 {
   "Image": "user-01.jpg",
   "Employee": "Harvey Smith",
   "Roll": "HR",
   "Status": "Present",
   "Check_In": "09:00 AM",
   "Check_Out": "06:13 PM",
   "Break": "50 Min",
   "Late": "23 Min",
   "Production_Hours": "8.45 Hrs"
 },
 {
   "Image": "user-33.jpg",
   "Employee": "Stephan Peralt",
   "Roll": "Management",
   "Status": "Present",
   "Check_In": "09:00 AM",
   "Check_Out": "06:23 PM",
   "Break": "41 Min",
   "Late": "50 Min",
   "Production_Hours": "8.35 Hrs"
 },
 {
   "Image": "user-34.jpg",
   "Employee": "Doglas Martini",
   "Roll": "Development",
   "Status": "Present",
   "Check_In": "09:00 AM",
   "Check_Out": "06:43 PM",
   "Break": "23 Min",
   "Late": "10 Min",
   "Production_Hours": "8.22 Hrs"
 },
 {
   "Image": "user-02.jpg",
   "Employee": "Linda Ray",
   "Roll": "UI/UX Team",
   "Status": "Present",
   "Check_In": "09:00 AM",
   "Check_Out": "07:15 PM",
   "Break": "03 Min",
   "Late": "30 Min",
   "Production_Hours": "8.32 Hrs"
 },
 {
   "Image": "user-35.jpg",
   "Employee": "Elliot Murray",
   "Roll": "UI/UX Team",
   "Status": "Present",
   "Check_In": "09:00 AM",
   "Check_Out": "07:13 PM",
   "Break": "32 Min",
   "Late": "41 Min",
   "Production_Hours": "9.15 Hrs"
 },
 {
   "Image": "user-30.jpg",
   "Employee": "Rebecca Smtih",
   "Roll": "UI/UX Team",
   "Status": "Present",
   "Check_In": "09:00 AM",
   "Check_Out": "09:17 PM",
   "Break": "14 Min",
   "Late": "12 Min",
   "Production_Hours": "9.25 Hrs"
 },
 {
   "Image": "user-36.jpg",
   "Employee": "Connie Waters",
   "Roll": "Management",
   "Status": "Present",
   "Check_In": "09:00 AM",
   "Check_Out": "08:15 PM",
   "Break": "12 Min",
   "Late": "03 Min",
   "Production_Hours": "8.35 Hrs"
 },
 {
   "Image": "user-38.jpg",
   "Employee": "Lori Broaddus",
   "Roll": "Finance",
   "Status": "Absent",
   "Check_In": "-",
   "Check_Out": "-",
   "Break": "-",
   "Late": "-",
   "Production_Hours": "0.00 Hrs"
 }
]

const columns = [
    {
        sorter: false,
    },
    {
        title: "Employee",
        dataIndex: "Employee",
        key: "Employee",
        sorter: {
        compare: (a, b) => {
            a = a.Employee.toLowerCase();
            b = b.Employee.toLowerCase();
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
    {
        title: "",
        key: "action",
        sorter: true,
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
            <template v-if="column.key === 'Employee'">
                <div class="d-flex align-items-center file-name-icon">
                    <a href="javascript:void(0);" class="avatar avatar-md border avatar-rounded">
                        <img :src="getUserAvatar(record.Image)" class="img-fluid" alt="img">
                    </a>
                    <div class="ms-2">
                        <h6 class="fw-medium"><a href="javascript:void(0);">{{record.Employee}}</a></h6>
                        <span class="fs-12 fw-normal ">{{record.Roll}}</span>
                    </div>
                </div>
            </template>
            <template v-if="column.key === 'Status'">
                <span class="d-inline-flex align-items-center" 
                    :class="['badge', record.Status === 'Present' ? 'badge-success-transparent' : 'badge-danger-transparent']">
                    <i class="ti ti-point-filled me-1"></i>{{record.Status}}
                </span>
            </template>
            <template v-if="column.key === 'Production_Hours'">
                <span class="d-inline-flex align-items-center"
                    :class="['badge', 
                        record.Production_Hours === '0.00 Hrs' ? 'badge-danger' :
                        record.Production_Hours === '7.54 Hrs' ? 'badge-danger' :
                        record.Production_Hours === '9.15 Hrs' ? 'badge-info' :
                        'badge-success']"    
                >
                    <i class="ti ti-clock-hour-11 me-1"></i>{{record.Production_Hours}}
                </span>
            </template>
            <template v-if="column.key === 'action'">
                <div class="action-icon d-inline-flex">
                    <a href="javascript:void(0);" class="me-2" data-bs-toggle="modal"
                        data-bs-target="#edit_attendance"><i class="ti ti-edit"></i></a>
                </div>
            </template>
        </template>
    </a-table>
</template>