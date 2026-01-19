<script>
const data = [
 {
   "Refferals_Image" : "user-32.jpg",
   "Refferals_ID": "Reff-001",
   "Referrer_Name": "Anthony Lewis",
   "Roll": "Finance",
   "Job_Image": "apple.svg",
   "Job_Reffered": "Senior IOS Developer",
   "Refferee_Image": "user-11.jpg",
   "Referee_Name": "Harold Gaynor",
   "Email": "harold@example.com",
   "Refferals_Bonus": "$200",
 },
 {
   "Refferals_Image" : "user-09.jpg",
   "Refferals_ID": "Reff-002",
   "Referrer_Name": "Brian Villalobos",
   "Roll" : "Developer",
   "Job_Image": "php.svg",
   "Job_Reffered": "Junior PHP Developer",
   "Refferee_Image": "user-29.jpg",
   "Referee_Name": "Sandra Ornellas",
   "Email": "sandra@example.com",
   "Refferals_Bonus": "$100",
 },
 {
   "Refferals_Image" : "user-01.jpg",
   "Refferals_ID": "Reff-003",
   "Referrer_Name": "Harvey Smith",
   "Roll": "Developer",
   "Job_Image": "black.svg",
   "Job_Reffered": "Network Engineer",
   "Refferee_Image": "user-16.jpg",
   "Referee_Name": "John Harris",
   "Email": "john@example.com",
   "Refferals_Bonus": "$300",
 },
 {
   "Refferals_Image" : "user-33.jpg",
   "Refferals_ID": "Reff-004",
   "Referrer_Name": "Stephan Peralt",
   "Roll": "Executive Officer",
   "Job_Image": "react.svg",
   "Job_Reffered": "Junior React Developer",
   "Refferee_Image": "user-57.jpg",
   "Referee_Name": "Whitney Barnette",
   "Email": "whitney@example.com",
   "Refferals_Bonus": "$150",
 },
 {
   "Refferals_Image" : "user-56.jpg",
   "Refferals_ID": "Reff-005",
   "Referrer_Name": "Doglas Martini",
   "Roll": "Manager",
   "Job_Image": "laravel.svg",
   "Job_Reffered": "Senior Laravel Developer",
   "Refferee_Image": "user-55.jpg",
   "Referee_Name": "Richard Thompson",
   "Email": "richard@example.com",
   "Refferals_Bonus": "$250",
 },
 {
   "Refferals_Image" : "user-34.jpg",
   "Refferals_ID": "Reff-006",
   "Referrer_Name": "Linda Ray",
   "Roll": "Finance",
   "Job_Image": "devops.svg",
   "Job_Reffered": "DevOps Engineer",
   "Refferee_Image": "user-45.jpg",
   "Referee_Name": "Kerry Drake",
   "Email": "kerry@example.com",
   "Refferals_Bonus": "$400",
 },
 {
   "Refferals_Image" : "user-42.jpg",
   "Refferals_ID": "Reff-007",
   "Referrer_Name": "Elliot Murray",
   "Roll": "Developer",
   "Job_Image": "android.svg",
   "Job_Reffered": "Junior Android Developer",
   "Refferee_Image": "user-30.jpg",
   "Referee_Name": "David Carmona",
   "Email": "david@example.com",
   "Refferals_Bonus": "$450",
 },
 {
   "Refferals_Image" : "user-38.jpg",
   "Refferals_ID": "Reff-008",
   "Referrer_Name": "Rebecca Smtih",
   "Roll": "Executive",
   "Job_Image": "html.svg",
   "Job_Reffered": "Senior HTML Developer",
   "Refferee_Image": "user-26.jpg",
   "Referee_Name": "Margaret Soto",
   "Email": "margaret@example.com",
   "Refferals_Bonus": "$220",
 },
 {
   "Refferals_Image" : "user-52.jpg",
   "Refferals_ID": "Reff-009",
   "Referrer_Name": "Connie Waters",
   "Roll": "Developer",
   "Job_Image": "ui.svg",
   "Job_Reffered": "Junior UI/UX Designer",
   "Refferee_Image": "user-44.jpg",
   "Referee_Name": "Jeffrey Thaler",
   "Email": "jeffrey@example.com",
   "Refferals_Bonus": "$180",
 },
 {
   "Refferals_Image" : "user-06.jpg",
   "Refferals_ID": "Reff-010",
   "Referrer_Name": "Lori Broaddus",
   "Roll": "Finance",
   "Job_Image": "grafic.svg",
   "Job_Reffered": "Senior Graphic Designer",
   "Refferee_Image": "user-10.jpg",
   "Referee_Name": "Joyce Golston",
   "Email": "joyce@example.com",
   "Refferals_Bonus": "$250",
 }
]

const columns = [
    {
        sorter: false,
    },
    {
        title: "Refferals ID",
        dataIndex: "Refferals_ID",
        sorter: {
        compare: (a, b) => {
            a = a.Refferals_ID.toLowerCase();
            b = b.Refferals_ID.toLowerCase();
            return a > b ? -1 : b > a ? 1 : 0;
        },
        },
    },
    {
        title: "Referrer Name",
        dataIndex: "Referrer_Name",
        key: "Referrer_Name",
        sorter: {
        compare: (a, b) => {
            a = a.Referrer_Name.toLowerCase();
            b = b.Referrer_Name.toLowerCase();
            return a > b ? -1 : b > a ? 1 : 0;
        },
        },
    },
    {
        title: "Job Reffered",
        dataIndex: "Job_Reffered",
        key: "Job_Reffered",
        sorter: {
        compare: (a, b) => {
            a = a.Job_Reffered.toLowerCase();
            b = b.Job_Reffered.toLowerCase();
            return a > b ? -1 : b > a ? 1 : 0;
        },
        },
    },
    {
        title: "Referee Name",
        dataIndex: "Referee_Name",
        key: "Referee_Name",
        sorter: {
        compare: (a, b) => {
            a = a.Referee_Name.toLowerCase();
            b = b.Referee_Name.toLowerCase();
            return a > b ? -1 : b > a ? 1 : 0;
        },
        },
    },
    {
        title: "Refferals Bonus",
        dataIndex: "Refferals_Bonus",
        key: "Refferals_Bonus",
        sorter: {
        compare: (a, b) => {
            a = a.Refferals_Bonus.toLowerCase();
            b = b.Refferals_Bonus.toLowerCase();
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
            <template v-if="column.key === 'Referrer_Name'">
                <div class="d-flex align-items-center file-name-icon">
                    <a href="javascript:void(0);" class="avatar avatar-md ">
                        <img :src="require(`@/assets/img/users/${record.Refferals_Image}`)" class="img-fluid rounded-circle" alt="img">
                    </a>
                    <div class="ms-2">
                        <h6 class="fw-medium"><a href="javascript:void(0);">{{record.Referrer_Name}}</a></h6>
                        <span class="d-block mt-1">{{record.Roll}}</span>
                    </div>
                </div>
            </template>
            <template v-if="column.key === 'Job_Reffered'">
                <div class="d-flex align-items-center file-name-icon">
                    <a href="javascript:void(0);" class="avatar avatar-md bg-light rounded">
                        <img :src="require(`@/assets/img/icons/${record.Job_Image}`)" class="img-fluid rounded-circle" alt="img">
                    </a>
                    <div class="ms-2">
                        <h6 class="fw-medium"><a href="javascript:void(0);">{{record.Job_Reffered}}</a></h6>
                        
                    </div>
                </div>
            </template>
            <template v-if="column.key === 'Referee_Name'">
                <div class="d-flex align-items-center file-name-icon">
                    <a href="javascript:void(0);" class="avatar avatar-md ">
                        <img :src="require(`@/assets/img/users/${record.Refferee_Image}`)" class="img-fluid rounded-circle" alt="img">
                    </a>
                    <div class="ms-2">
                        <h6 class="fw-medium"><a href="javascript:void(0);">{{record.Referee_Name}}</a></h6>
                        <span class="d-block mt-1">{{record.Email}}</span>
                    </div>
                </div>
            </template>
            <template v-if="column.key === 'action'">
                <div class="action-icon d-inline-flex">
                <a href="javascript:void(0);" class="me-2" ><i class="ti ti-edit"></i></a>
                    <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#delete_modal"><i class="ti ti-trash"></i></a>
                </div>
            </template>
        </template>
    </a-table>
</template>