<script>
import { useAssetUrl } from '@/composables/useAssetUrl';
const { getIconUrl } = useAssetUrl();

const data = [
  {
    Job_ID: "Job-001",
    Image: "apple.svg",
    Job_Title: "Senior IOS Developer",
    Roll: "25 Applicants",
    Category: "Software",
    Location: "New York , USA",
    Salary_Range: "30, 000 - 35, 000 / month",
    Posted_Date: "12 Sep 2024",
  },
  {
    Job_ID: "Job-002",
    Image: "php.svg",
    Job_Title: "Junior PHP Developer",
    Roll: "20 Applicants",
    Category: "Software",
    Location: "Los Angeles, USA",
    Salary_Range: "20, 000 - 25, 000 / month",
    Posted_Date: "24 Oct 2024",
  },
  {
    Job_ID: "Job-003",
    Image: "black.svg",
    Job_Title: "Junior PHP Developer",
    Roll: "20 Applicants",
    Category: "Software",
    Location: "Los Angeles, USA",
    Salary_Range: "20, 000 - 25, 000 / month",
    Posted_Date: "24 Oct 2024",
  },
  {
    Job_ID: "Job-004",
    Image: "react.svg",
    Job_Title: "Junior React Developer",
    Roll: "35 Applicants",
    Category: "Software",
    Location: "Bristol, UK",
    Salary_Range: "30, 000 - 35, 000 / month",
    Posted_Date: "18 Feb 2024",
  },
  {
    Job_ID: "Job-005",
    Image: "laravel.svg",
    Job_Title: "Senior Laravel Developer",
    Roll: "40 Applicants",
    Category: "Software",
    Location: "Washington, USA",
    Salary_Range: "32, 000 - 36, 000 / month",
    Posted_Date: "20 Jul 2024",
  },
  {
    Job_ID: "Job-006",
    Image: "devops.svg",
    Job_Title: "DevOps Engineer",
    Roll: "20 Applicants",
    Category: "Software",
    Location: "Coventry, UK",
    Salary_Range: "25, 000 - 35, 000 / month",
    Posted_Date: "10 Apr 2024",
  },
  {
    Job_ID: "Job-007",
    Image: "android.svg",
    Job_Title: "Junior Android Developer",
    Roll: "25 Applicants",
    Category: "Software",
    Location: "Chicago, USA",
    Salary_Range: "28, 000 - 32, 000 / month",
    Posted_Date: "29 Aug 2024",
  },
  {
    Job_ID: "Job-008",
    Image: "html.svg",
    Job_Title: "Senior HTML Developer",
    Roll: "35 Applicants",
    Category: "Software",
    Location: "Carlisle, UK",
    Salary_Range: "25, 000 - 28, 000 / month",
    Posted_Date: "22 Feb 2024",
  },
  {
    Job_ID: "Job-009",
    Image: "ui.svg",
    Job_Title: "Junior UI/UX Designer",
    Roll: "20 Applicants",
    Category: "Software",
    Location: "Lancaster, UK",
    Salary_Range: "20, 000 - 25, 000 / month",
    Posted_Date: "03 Nov 2024",
  },
  {
    Job_ID: "Job-010",
    Image: "grafic.svg",
    Job_Title: "Senior Graphic Designer",
    Roll: "25 Applicants",
    Category: "Software",
    Location: "San Diego, USA",
    Salary_Range: "22, 000 - 28, 000 / month",
    Posted_Date: "17 Dec 2024",
  },
];

const columns = [
  {
    sorter: false,
  },
  {
    title: "Job ID",
    dataIndex: "Job_ID",
    sorter: {
      compare: (a, b) => {
        a = a.Job_ID.toLowerCase();
        b = b.Job_ID.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Job Title",
    dataIndex: "Job_Title",
    key: "Job_Title",
    sorter: {
      compare: (a, b) => {
        a = a.Job_Title.toLowerCase();
        b = b.Job_Title.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Category",
    dataIndex: "Category",
    sorter: {
      compare: (a, b) => {
        a = a.Category.toLowerCase();
        b = b.Category.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Location",
    dataIndex: "Location",
    sorter: {
      compare: (a, b) => {
        a = a.Location.toLowerCase();
        b = b.Location.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Salary  Range",
    dataIndex: "Salary_Range",
    sorter: {
      compare: (a, b) => {
        a = a.Salary_Range.toLowerCase();
        b = b.Salary_Range.toLowerCase();
        return a > b ? -1 : b > a ? 1 : 0;
      },
    },
  },
  {
    title: "Posted Date",
    dataIndex: "Posted_Date",
    sorter: {
      compare: (a, b) => {
        a = a.Posted_Date.toLowerCase();
        b = b.Posted_Date.toLowerCase();
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
      <template v-if="column.key === 'Job_Title'">
        <div class="d-flex align-items-center file-name-icon">
          <a href="javascript:void(0);" class="avatar avatar-md bg-light rounded">
            <img
              :src="getIconUrl(record.Image)"
              class="img-fluid rounded-circle"
              alt="img"
            />
          </a>
          <div class="ms-2">
            <h6 class="fw-medium">
              <a href="javascript:void(0);">{{ record.Job_Title }}</a>
            </h6>
            <span class="d-block mt-1">{{ record.Roll }}</span>
          </div>
        </div>
      </template>
      <template v-if="column.key === 'action'">
        <div class="action-icon d-inline-flex">
          <a
            href="javascript:void(0);"
            class="me-2"
            data-bs-toggle="modal"
            data-bs-target="#edit_post"
            ><i class="ti ti-edit"></i
          ></a>
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
