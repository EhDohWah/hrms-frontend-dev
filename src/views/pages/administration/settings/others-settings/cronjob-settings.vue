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
        <breadcrumb :title="title" :text="text" :text1="text1" />
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
      <!-- /Breadcrumb -->

      <settings-tab></settings-tab>
      <div class="row">
        <others-sidebar></others-sidebar>
        <div class="col-xl-9">
          <div class="card">
            <div class="card-header px-0 mx-3">
              <div class="row g-3 align-items-center">
                <div class="col-md-6 col-sm-4">
                  <h4>Cronjob</h4>
                </div>
                <div class="col-md-6 col-sm-8">
                  <div
                    class="d-flex justify-content-sm-end align-items-center flex-wrap row-gap-2"
                  >
                    <router-link
                      to="/others-settings/cronjob-schedule"
                      class="btn btn-dark me-2"
                      ><i class="ti ti-clock-hour-4 me-2"></i>Cron Schedule</router-link
                    >
                    <a
                      href="javascript:void(0);"
                      class="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#add_cronjob"
                      ><i class="ti ti-circle-plus me-2"></i>Add Cronjob</a
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="card-body pb-0">
              <div class="card mb-3">
                <div
                  class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3"
                >
                  <h5>Cronjob List</h5>
                </div>
                <div class="card-body p-0">
                  <div class="custom-datatable-filter table-responsive">
                    <table class="table">
                      <thead class="thead-light">
                        <tr>
                          <th class="no-sort">
                            <div class="form-check form-check-md">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                id="select-all"
                              />
                            </div>
                          </th>
                          <th>Name</th>
                          <th>Schedule</th>
                          <th>Next Run</th>
                          <th>Last Run</th>
                          <th>Status</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <div class="form-check form-check-md">
                              <input class="form-check-input" type="checkbox" />
                            </div>
                          </td>
                          <td>
                            <h6 class="fw-medium">Report Generation Cron</h6>
                          </td>
                          <td>5 minutes</td>
                          <td>
                            <div>
                              <p class="mb-0">09 Sep 2024</p>
                              <p class="mb-0">10:15:38</p>
                            </div>
                          </td>
                          <td>
                            <div>
                              <p class="mb-0">09 Sep 2024</p>
                              <p class="mb-0">10:28:38</p>
                            </div>
                          </td>
                          <td>
                            <span
                              class="badge badge-success d-flex align-items-center badge-xs"
                            >
                              <i class="ti ti-point-filled me-1"></i>Running
                            </span>
                          </td>
                          <td>
                            <div class="action-icon d-inline-flex">
                              <a href="javascript:void(0);" class="me-2"
                                ><i class="ti ti-player-pause"></i
                              ></a>
                              <a
                                href="javascript:void(0);"
                                class="me-2"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_cronjob"
                                ><i class="ti ti-edit"></i
                              ></a>
                              <a href="javascript:void(0);" class=""><i class="ti ti-clock-bolt"></i></a>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div class="form-check form-check-md">
                              <input class="form-check-input" type="checkbox" />
                            </div>
                          </td>
                          <td>
                            <h6 class="fw-medium">Job Expired Cron</h6>
                          </td>
                          <td>3 minutes</td>
                          <td>
                            <div>
                              <p class="mb-0">09 Sep 2024</p>
                              <p class="mb-0">10:15:38</p>
                            </div>
                          </td>
                          <td>
                            <div>
                              <p class="mb-0">09 Sep 2024</p>
                              <p class="mb-0">10:28:38</p>
                            </div>
                          </td>
                          <td>
                            <span
                              class="badge badge-success d-flex align-items-center badge-xs"
                            >
                              <i class="ti ti-point-filled me-1"></i>Running
                            </span>
                          </td>
                          <td>
                            <div class="action-icon d-inline-flex">
                              <a href="javascript:void(0);" class="me-2"
                                ><i class="ti ti-player-pause"></i
                              ></a>
                              <a
                                href="javascript:void(0);"
                                class="me-2"
                                data-bs-toggle="modal"
                                data-bs-target="#edit_cronjob"
                                ><i class="ti ti-edit"></i
                              ></a>
                              <a href="javascript:void(0);" class=""><i class="ti ti-clock-bolt"></i></a>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3"
    >
      <p class="mb-0">2014 - 2025 &copy; SmartHR.</p>
      <p>
        Designed &amp; Developed By
        <a href="javascript:void(0);" class="text-primary">Dreams</a>
      </p>
    </div>
  </div>
  <!-- /Page Wrapper -->
  <!--Add Cronjob -->
  <div class="modal fade" id="add_cronjob">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Add Cronjob</h4>
          <button
            type="button"
            class="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body pb-0">
            <div class="row">
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Name</label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Schedule</label>
                  <a-select :options="SchedCron" id="schedcron" placeholder="Select" style="width: 100%" :show-search="true" :filter-option="filterOption" />
                </div>
              </div>
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-2 d-flex align-items-center">
                    <div class="mb-3">
                      <label class="form-label">Next Run</label>
                    </div>
                  </div>
                  <div class="col-md-5">
                    <div class="mb-3">
                      <div class="input-icon-end position-relative">
                        <date-picker
                          v-model="startdate"
                          class="form-control datetimepicker"
                          placeholder="dd/mm/yyyy"
                          :editable="true"
                          :clearable="false"
                          :input-format="dateFormat"
                        />
                        <span class="input-icon-addon">
                          <i class="ti ti-calendar text-gray-7"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-5">
                    <div class="mb-3">
                      <div class="input-icon position-relative w-100">
                        <a-time-picker
                          class="form-control timepicker"
                          placeholder="Choose"
                          use12-hours
                          format="h:mm a"
                          type="text"
                        />
                        <span class="input-icon-addon">
                          <i class="ti ti-clock-hour-3"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">URL</label>
                  <input type="text" class="form-control" />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light me-2" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Add Cronjob</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Cronjob -->

  <!-- Edit Cronjob -->
  <div class="modal fade" id="edit_cronjob">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Edit Cronjob</h4>
          <button
            type="button"
            class="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i class="ti ti-x"></i>
          </button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body pb-0">
            <div class="row">
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Name</label>
                  <input
                    type="text"
                    class="form-control"
                    value="Report Generation Cron"
                  />
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">Schedule</label>
                  <a-select
                    :options="EditSchedCron"
                    id="editschedcron"
                    placeholder="5 Minutes"
                    style="width: 100%"
                    :show-search="true"
                    :filter-option="filterOption"
                  />
                </div>
              </div>
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-2 d-flex align-items-center">
                    <div class="mb-3">
                      <label class="form-label">Next Run</label>
                    </div>
                  </div>
                  <div class="col-md-5">
                    <div class="mb-3">
                      <div class="input-icon-end position-relative">
                        <date-picker
                          v-model="startdateOne"
                          class="form-control datetimepicker"
                          placeholder="dd/mm/yyyy"
                          :editable="true"
                          :clearable="false"
                          :input-format="dateFormat"
                        />
                        <span class="input-icon-addon">
                          <i class="ti ti-calendar text-gray-7"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-5">
                    <div class="mb-3">
                      <div class="input-icon position-relative w-100">
                        <a-time-picker
                          class="form-control timepicker"
                          placeholder="Choose"
                          use12-hours
                          format="h:mm a"
                          type="text"
                        />
                        <span class="input-icon-addon">
                          <i class="ti ti-clock-hour-3"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="mb-3">
                  <label class="form-label">URL</label>
                  <input type="text" class="form-control" value="www.example.com" />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light me-2" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Save Cronjob</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Edit Cronjob -->
</template>
<script>
import { ref } from "vue";
const currentDate = ref(new Date());
const currentDateOne = ref(new Date());

import { useSelectMigration } from '@/composables/useSelectMigration';

export default {
  setup() {
    const { filterOption } = useSelectMigration();
    return { filterOption };
  },
  data() {
    return {
      startdate: currentDate,
      startdateOne: currentDateOne,
      dateFormat: "dd-MM-yyyy",
      title: "Settings",
      text: "Administration",
      text1: "Settings",
      SchedCron: ["Select", "5 Minutes", "3 Minutes"],
      EditSchedCron: ["Select", "5 Minutes", "3 Minutes"],
    };
  },
  methods: {
    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },
  },
};
</script>
