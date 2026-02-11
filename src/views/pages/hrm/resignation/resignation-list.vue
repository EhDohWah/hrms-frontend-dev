<script setup>
/**
 * Resignation List Page
 *
 * Modernized to use:
 * - <script setup> Composition API
 * - Props-based modal pattern (matching employment-list, grant-list)
 * - layout-footer component
 * - Proper event handling between table and modal
 */
import { ref } from 'vue';
import { resignationService } from '@/services/resignation.service';
import { message } from 'ant-design-vue';

// State for modal
const resignationModalVisible = ref(false);
const editingResignation = ref(null);
const tableRef = ref(null);

// Page data
const title = 'Resignation';
const text = 'Performance';
const text1 = 'Resignation';

// Modal handlers
const openAddModal = () => {
  editingResignation.value = null;
  resignationModalVisible.value = true;
};

const openEditModal = async (record) => {
  try {
    // Fetch full resignation details for the edit form
    const response = await resignationService.getResignationDetails(record.id);
    if (response?.success && response.data) {
      editingResignation.value = response.data;
      resignationModalVisible.value = true;
    } else {
      message.error('Failed to load resignation details');
    }
  } catch (error) {
    console.error('Error loading resignation details:', error);
    message.error('Failed to load resignation details');
  }
};

const closeModal = () => {
  resignationModalVisible.value = false;
  editingResignation.value = null;
};

const handleSaved = () => {
  // Refresh the table data after create/update/acknowledge
  tableRef.value?.fetchResignations();
};

// Header collapse toggle
const toggleHeader = () => {
  document.getElementById('collapse-header')?.classList.toggle('active');
  document.body.classList.toggle('header-collapse');
};
</script>

<template>
  <layout-header></layout-header>
  <layout-sidebar></layout-sidebar>

  <!-- Page Wrapper -->
  <div class="page-wrapper">
    <div class="content">
      <!-- Breadcrumb -->
      <div
        class="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3"
      >
        <index-breadcrumb :title="title" :text="text" :text1="text1" />
        <div class="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div class="mb-2">
            <a
              href="javascript:void(0);"
              class="btn btn-primary d-flex align-items-center"
              @click="openAddModal"
            >
              <i class="ti ti-circle-plus me-2"></i>Add Resignation
            </a>
          </div>
          <div class="head-icons ms-2">
            <a
              href="javascript:void(0);"
              class=""
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-bs-original-title="Collapse"
              id="collapse-header"
              @click="toggleHeader"
            >
              <i class="ti ti-chevrons-up"></i>
            </a>
          </div>
        </div>
      </div>
      <!-- /Breadcrumb -->

      <!-- Resignation List -->
      <div class="row">
        <div class="col-sm-12">
          <div class="card">
            <div
              class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3"
            >
              <h5 class="d-flex align-items-center">Resignation List</h5>
            </div>
            <div class="card-body p-0">
              <div class="custom-datatable-filter table-responsive">
                <resignation-table
                  ref="tableRef"
                  @edit="openEditModal"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- /Resignation List -->
    </div>

    <layout-footer></layout-footer>
  </div>
  <!-- /Page Wrapper -->

  <!-- Resignation Modal (props-based) -->
  <resignation-modal
    :visible="resignationModalVisible"
    :editing-resignation="editingResignation"
    @saved="handleSaved"
    @close="closeModal"
  />
</template>
