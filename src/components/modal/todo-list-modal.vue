<template>
  <!-- Add Todo -->
  <div class="modal fade" id="add_todo">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Add New Todo</h4>
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
          <div class="modal-body">
            <div class="row">
              <div class="col-12">
                <div class="mb-3">
                  <label class="form-label">Todo Title</label>
                  <input type="text" class="form-control" />
                </div>
              </div>
              <div class="col-6">
                <div class="mb-3">
                  <label class="form-label">Tag</label>
                  <a-select :options="Remitag" id="remitag" placeholder="Select" />
                </div>
              </div>
              <div class="col-6">
                <div class="mb-3">
                  <label class="form-label">Priority</label>
                  <a-select :options="PrioSl" id="priosl" placeholder="Select" />
                </div>
              </div>
              <div class="col-lg-12">
                <div class="mb-3 summer-description-box notes-summernote">
                  <label class="form-label">Descriptions</label>
                  <ckeditor
                    :editor="editor"
                    v-model="editorData"
                    :config="editorConfig"
                  ></ckeditor>
                </div>
              </div>
              <div class="col-12">
                <div class="mb-3">
                  <label class="form-label">Add Assignee</label>
                  <a-select :options="AddAdif" id="addadif" placeholder="Select" />
                </div>
              </div>
              <div class="col-12">
                <div class="mb-0">
                  <label class="form-label">Status</label>
                  <a-select
                    :options="CompleTodo"
                    id="completodo"
                    placeholder="Select"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light me-2" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Add New Todo</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Add Todo -->

  <!-- Edit Todo -->
  <div class="modal fade" id="edit_todo">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Edit Todo</h4>
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
          <div class="modal-body">
            <div class="row">
              <div class="col-12">
                <div class="mb-3">
                  <label class="form-label">Todo Title</label>
                  <input
                    type="text"
                    class="form-control"
                    value="Update calendar and schedule"
                  />
                </div>
              </div>
              <div class="col-6">
                <div class="mb-3">
                  <label class="form-label">Tag</label>
                  <a-select :options="InterNal" id="internal" placeholder="Select" />
                </div>
              </div>
              <div class="col-6">
                <div class="mb-3">
                  <label class="form-label">Priority</label>
                  <a-select :options="ProTodo" id="protodo" placeholder="Select" />
                </div>
              </div>
              <div class="col-lg-12">
                <div class="mb-3 summer-description-box notes-summernote">
                  <label class="form-label">Descriptions</label>
                  <ckeditor
                    :editor="editor"
                    v-model="editorData"
                    :config="editorConfig"
                  ></ckeditor>
                </div>
              </div>
              <div class="col-12">
                <div class="mb-3">
                  <label class="form-label">Add Assignee</label>
                  <a-select :options="Sophtodo" id="sophtodo" placeholder="Sophie" />
                </div>
              </div>
              <div class="col-12">
                <div class="mb-0">
                  <label class="form-label">Status</label>
                  <a-select :options="HoldTodo" id="holdtodo" placeholder="Completed" />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light me-2" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- /Edit Todo -->

  <!-- Todo Details -->
  <div class="modal fade" id="view_todo">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark">
          <h4 class="modal-title text-white">Respond to any pending messages</h4>
          <span class="badge badge-danger d-inline-flex align-items-center"
            ><i class="ti ti-square me-1"></i>Urgent</span
          >
          <span><i class="ti ti-star-filled text-warning"></i></span>
          <a href="javascript:void(0);"><i class="ti ti-trash text-white"></i></a>
          <button
            type="button"
            class="btn-close custom-btn-close bg-transparent fs-16 text-white position-static"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i class="ti ti-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <h5 class="mb-2">Task Details</h5>
          <div class="border rounded mb-3 p-2">
            <div class="row row-gap-3">
              <div class="col-md-4">
                <div class="text-center">
                  <span class="d-block mb-1">Created On</span>
                  <p class="text-dark">22 July 2025</p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="text-center">
                  <span class="d-block mb-1">Due Date</span>
                  <p class="text-dark">22 July 2025</p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="text-center">
                  <span class="d-block mb-1">Status</span>
                  <span
                    class="badge badge-soft-success align-items-center justify-content-center"
                  >
                    <i class="fas fa-circle fs-6 me-1"></i>Completed
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <h5 class="mb-2">Description</h5>
            <p>
              Hiking is a long, vigorous walk, usually on trails or footpaths in the
              countryside. Walking for pleasure developed in Europe during the eighteenth
              century. Religious pilgrimages have existed much longer but they involve
              walking long distances for a spiritual purpose associated with specific
              religions and also we achieve inner peace while we hike at a local park.
            </p>
          </div>
          <div class="mb-3">
            <h5 class="mb-2">Tags</h5>
            <div class="d-flex align-items-center">
              <span class="badge badge-danger me-2">Internal</span>
              <span class="badge badge-success me-2">Projects</span>
              <span class="badge badge-secondary">Reminder</span>
            </div>
          </div>
          <div>
            <h5 class="mb-2">Assignee</h5>
            <div class="avatar-list-stacked avatar-group-sm">
              <span class="avatar avatar-rounded">
                <img
                  class="border border-white"
                  src="@/assets/img/profiles/avatar-23.jpg"
                  alt="img"
                />
              </span>
              <span class="avatar avatar-rounded">
                <img
                  class="border border-white"
                  src="@/assets/img/profiles/avatar-24.jpg"
                  alt="img"
                />
              </span>
              <span class="avatar avatar-rounded">
                <img
                  class="border border-white"
                  src="@/assets/img/profiles/avatar-25.jpg"
                  alt="img"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- /Todo Details -->

  <!-- Delete Modal -->
  <div class="modal fade" id="delete_modal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body text-center">
          <span class="avatar avatar-xl bg-transparent-danger text-danger mb-3">
            <i class="ti ti-trash-x fs-36"></i>
          </span>
          <h4 class="mb-1">Confirm Delete</h4>
          <p class="mb-3">
            You want to delete all the marked items, this cant be undone once you delete.
          </p>
          <div class="d-flex justify-content-center">
            <a
              href="javascript:void(0);"
              class="btn btn-light me-3"
              data-bs-dismiss="modal"
              >Cancel</a
            >
            <router-link to="/applications/todo-list" class="btn btn-danger"
              >Yes, Delete</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- /Delete Modal -->
</template>
<script>
import { useSelectMigration } from '@/composables/useSelectMigration';

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
export default {
  setup() {
    const { filterOption, getModalPopupContainer } = useSelectMigration();
    return { filterOption, getModalPopupContainer };
  },
  data() {
    return {
      editor: ClassicEditor,
      editorData: " ",
      editorConfig: {},
      HoldTodo: ["Select", "Completed", "Pending", "Onhold", "Inprogress"],
      Sophtodo: ["Select", "Sophie", "Cameron", "Doris", "Rufana"],
      ProTodo: ["Select", "Medium", "High", "Low"],
      InterNal: ["Select", "Internal", "Projects", "Meetings", "Reminder"],
      CompleTodo: ["Select", "Completed", "Pending", "Onhold", "Inprogress"],
      AddAdif: ["Select", "Sophie", "Camerson", "Doris", "Rufana"],
      PrioSl: ["Select", "Medium", "High", "Low"],
      Remitag: ["Select", "Internal", "Projects", "Meetings", "Reminder"],
    };
  },
  methods: {
    submitForm() {
      this.$router.push("/applications/todo");
    },
  },
};
</script>
