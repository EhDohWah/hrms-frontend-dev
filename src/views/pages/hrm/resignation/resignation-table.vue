<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAssetUrl } from '@/composables/useAssetUrl';
import { resignationService } from '@/services/resignation.service';
import { message } from 'ant-design-vue';
import { FilePdfOutlined, DownloadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';

const { getUserAvatar } = useAssetUrl();

// State
const data = ref([]);
const loading = ref(false);
const downloadingId = ref(null);

// Table columns
const columns = [
  {
    title: 'Employee',
    dataIndex: 'employeeName',
    key: 'employeeName',
    sorter: (a, b) => a.employeeName.localeCompare(b.employeeName),
  },
  {
    title: 'Staff ID',
    dataIndex: 'staffId',
    key: 'staffId',
    sorter: (a, b) => a.staffId.localeCompare(b.staffId),
  },
  {
    title: 'Department',
    dataIndex: 'department',
    key: 'department',
    sorter: (a, b) => (a.department || '').localeCompare(b.department || ''),
  },
  {
    title: 'Reason',
    dataIndex: 'reason',
    key: 'reason',
    sorter: (a, b) => (a.reason || '').localeCompare(b.reason || ''),
  },
  {
    title: 'Submission Date',
    dataIndex: 'submissionDate',
    key: 'submissionDate',
    sorter: (a, b) => new Date(a.submissionDate) - new Date(b.submissionDate),
  },
  {
    title: 'Last Working Date',
    dataIndex: 'lastWorkingDate',
    key: 'lastWorkingDate',
    sorter: (a, b) => new Date(a.lastWorkingDate) - new Date(b.lastWorkingDate),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    sorter: (a, b) => (a.status || '').localeCompare(b.status || ''),
  },
  {
    title: 'Recommendation Letter',
    key: 'recommendationLetter',
    align: 'center',
    width: 180,
  },
  {
    title: 'Actions',
    key: 'action',
    align: 'center',
    width: 100,
  },
];

const rowSelection = ref({
  selectedRowKeys: [],
  onChange: (selectedRowKeys) => {
    rowSelection.value.selectedRowKeys = selectedRowKeys;
  },
});

// Status tag color mapping
const getStatusColor = (status) => {
  const colors = {
    'Pending': 'warning',
    'Acknowledged': 'success',
    'Rejected': 'error',
  };
  return colors[status] || 'default';
};

// Check if resignation is acknowledged (can download recommendation letter)
const canDownloadLetter = (record) => {
  return record.status === 'Acknowledged';
};

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Fetch resignations from API
const fetchResignations = async () => {
  loading.value = true;
  try {
    const response = await resignationService.getResignations();
    if (response.success && response.data) {
      data.value = response.data.map(item => ({
        id: item.id,
        key: item.id,
        employeeId: item.employeeId,
        employeeName: item.employee?.name || '-',
        staffId: item.employee?.staffId || '-',
        department: item.department?.name || '-',
        position: item.position?.title || '-',
        reason: item.reason || '-',
        submissionDate: formatDate(item.resignationDate),
        lastWorkingDate: formatDate(item.lastWorkingDate),
        status: item.acknowledgementStatus || 'Pending',
        image: null, // Employee image not included in resignation response
      }));
    }
  } catch (error) {
    console.error('Error fetching resignations:', error);
    message.error('Failed to load resignations');
  } finally {
    loading.value = false;
  }
};

// Download recommendation letter
const downloadRecommendationLetter = async (record) => {
  if (!canDownloadLetter(record)) {
    message.warning('Recommendation letter is only available for acknowledged resignations');
    return;
  }

  downloadingId.value = record.id;
  try {
    await resignationService.downloadRecommendationLetter(record.id, record.employeeName);
    message.success('Recommendation letter downloaded successfully');
  } catch (error) {
    console.error('Error downloading recommendation letter:', error);
    message.error(error.message || 'Failed to download recommendation letter');
  } finally {
    downloadingId.value = null;
  }
};

// Edit resignation (emit event or open modal)
const editResignation = (record) => {
  // This will be connected to the edit modal
  console.log('Edit resignation:', record);
};

// Delete resignation
const deleteResignation = async (record) => {
  try {
    await resignationService.deleteResignation(record.id);
    message.success('Resignation deleted successfully');
    fetchResignations();
  } catch (error) {
    console.error('Error deleting resignation:', error);
    message.error('Failed to delete resignation');
  }
};

// Lifecycle
onMounted(() => {
  fetchResignations();
});
</script>

<template>
  <a-table
    class="table datatable thead-light"
    :columns="columns"
    :data-source="data"
    :loading="loading"
    :row-selection="rowSelection"
    :pagination="{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} records` }"
    row-key="id"
  >
    <template #bodyCell="{ column, record }">
      <!-- Employee Column with Avatar -->
      <template v-if="column.key === 'employeeName'">
        <div class="d-flex align-items-center">
          <span class="avatar avatar-md me-2">
            <img
              :src="getUserAvatar(record.image)"
              class="rounded-circle"
              alt="user"
            />
          </span>
          <div>
            <h6 class="fw-medium mb-0">{{ record.employeeName }}</h6>
            <small class="text-muted">{{ record.position }}</small>
          </div>
        </div>
      </template>

      <!-- Status Column -->
      <template v-else-if="column.key === 'status'">
        <a-tag :color="getStatusColor(record.status)">
          {{ record.status }}
        </a-tag>
      </template>

      <!-- Recommendation Letter Column -->
      <template v-else-if="column.key === 'recommendationLetter'">
        <a-button
          v-if="canDownloadLetter(record)"
          type="primary"
          size="small"
          :loading="downloadingId === record.id"
          @click="downloadRecommendationLetter(record)"
        >
          <template #icon>
            <FilePdfOutlined />
          </template>
          Download PDF
        </a-button>
        <a-tooltip v-else title="Only available for acknowledged resignations">
          <a-button type="default" size="small" disabled>
            <template #icon>
              <FilePdfOutlined />
            </template>
            Not Available
          </a-button>
        </a-tooltip>
      </template>

      <!-- Action Column -->
      <template v-else-if="column.key === 'action'">
        <div class="action-icon d-inline-flex">
          <a-tooltip title="Edit">
            <a
              href="javascript:void(0);"
              class="me-2"
              data-bs-toggle="modal"
              data-bs-target="#edit_resignation"
              @click="editResignation(record)"
            >
              <EditOutlined />
            </a>
          </a-tooltip>
          <a-popconfirm
            title="Are you sure you want to delete this resignation?"
            ok-text="Yes"
            cancel-text="No"
            @confirm="deleteResignation(record)"
          >
            <a-tooltip title="Delete">
              <a href="javascript:void(0);">
                <DeleteOutlined />
              </a>
            </a-tooltip>
          </a-popconfirm>
        </div>
      </template>
    </template>
  </a-table>
</template>
