<script>
import { VueDraggableNext } from "vue-draggable-next";
import { useAssetUrl } from '@/composables/useAssetUrl';
const { getUserAvatar } = useAssetUrl();

export default {
  components: {
    draggable: VueDraggableNext,
  },
  data() {
    return {
      modules: {
        New: {
          DotClass: "bg-purple rounded-circle",
          Title: "New",
          Count: "30",
          Cards: [
            {
              BadgeClass: "badge bg-primary-transparent",
              BadgeNo: "Cand-001",
              Image: "user-39.jpg",
              Name: "Harold Gaynor",
              Email: "harold@example.com",
              Role: "Accountant",
              Date: "12 Sep 2024",
            },
            {
              BadgeClass: "badge bg-primary-transparent",
              BadgeNo: "Cand-002",
              Image: "user-40.jpg",
              Name: "Sandra Ornellas",
              Email: "sandra@example.com",
              Role: "Accountant",
              Date: "12 Sep 2024",
            },
          ],
        },
        Scheduled: {
          DotClass: "bg-pink rounded-circle",
          Title: "Scheduled",
          Count: "30",
          Cards: [
            {
              BadgeClass: "badge bg-primary-transparent",
              BadgeNo: "Cand-003",
              Image: "user-41.jpg",
              Name: "John Harris",
              Email: "john@example.com",
              Role: "Technician",
              Date: "12 Sep 2024",
            },
            {
              BadgeClass: "badge bg-primary-transparent",
              BadgeNo: "Cand-004",
              Image: "user-42.jpg",
              Name: "Carole Langan",
              Email: "carole@example.com",
              Role: "Web Developer",
              Date: "12 Sep 2024",
            },
            {
              BadgeClass: "badge bg-primary-transparent",
              BadgeNo: "Cand-005",
              Image: "user-44.jpg",
              Name: "Charles Marks",
              Email: "charles@example.com",
              Role: "SEO",
              Date: "12 Sep 2024",
            },
            {
              BadgeClass: "badge bg-primary-transparent",
              BadgeNo: "Cand-006",
              Image: "user-43.jpg",
              Name: "Kerry Drake",
              Email: "kerry@example.com",
              Role: "Designer",
              Date: "12 Sep 2024",
            },
          ],
        },
        Interviewed: {
          DotClass: "bg-info rounded-circle",
          Title: "Interviewed",
          Count: "30",
          Cards: [
            {
              BadgeClass: "badge bg-primary-transparent",
              BadgeNo: "Cand-007",
              Image: "user-46.jpg",
              Name: "David Carmona",
              Email: "david@example.com",
              Role: "Manager",
              Date: "12 Sep 2024",
            },
            {
              BadgeClass: "badge bg-primary-transparent",
              BadgeNo: "Cand-008",
              Image: "user-45.jpg",
              Name: "Margaret Soto",
              Email: "margaret@example.com",
              Role: "SEO Analyst",
              Date: "12 Sep 2024",
            },
            {
              BadgeClass: "badge bg-primary-transparent",
              BadgeNo: "Cand-009",
              Image: "user-48.jpg",
              Name: "Jeffrey Thaler",
              Email: "jeffrey@example.com",
              Role: "Admin",
              Date: "12 Sep 2024",
            },
          ],
        },
        Offered: {
          DotClass: "bg-warning rounded-circle",
          Title: "Offered",
          Count: "30",
          Cards: [
            {
              BadgeClass: "badge bg-primary-transparent",
              BadgeNo: "Cand-010",
              Image: "user-47.jpg",
              Name: "Joyce Golston",
              Email: "joyce@example.com",
              Role: "Business",
              Date: "12 Sep 2024",
            },
            {
              BadgeClass: "badge bg-primary-transparent",
              BadgeNo: "Cand-011",
              Image: "user-49.jpg",
              Name: "Cedric Rosalez",
              Email: "cedric@example.com",
              Role: "Financial",
              Date: "12 Sep 2024",
            },
          ],
        },
        Hired: {
          DotClass: "bg-success rounded-circle",
          Title: "Hired",
          Count: "30",
          Cards: [
            {
              BadgeClass: "badge bg-primary-transparent",
              BadgeNo: "Cand-012",
              Image: "user-50.jpg",
              Name: "Lillie Diaz",
              Email: "lillie@example.com",
              Role: "Receptionist",
              Date: "12 Sep 2024",
            },
            {
              BadgeClass: "badge bg-primary-transparent",
              BadgeNo: "Cand-013",
              Image: "user-51.jpg",
              Name: "Thomas Bordelon",
              Email: "thomas@example.com",
              Role: "Director",
              Date: "12 Sep 2024",
            },
          ],
        },
        Rejected: {
          DotClass: "bg-danger rounded-circle",
          Title: "Rejected",
          Count: "30",
          Cards: [
            {
              BadgeClass: "badge bg-primary-transparent",
              BadgeNo: "Cand-014",
              Image: "user-53.jpg",
              Name: "Bruce Wright",
              Email: "bruce@example.com",
              Role: "CEO",
              Date: "12 Sep 2024",
            },
            {
              BadgeClass: "badge bg-primary-transparent",
              BadgeNo: "Cand-013",
              Image: "user-54.jpg",
              Name: "Angela Thomas",
              Email: "angela@example.com",
              Role: "Consultant",
              Date: "12 Sep 2024",
            },
          ],
        },
      },
    };
  },
  methods: {
    onDragEnd() {},
    onModuleDragEnd() {},
  },
};
</script>

<template>
  <div class="d-flex align-items-start overflow-auto project-status pb-4">
    <div
      class="p-3 rounded bg-transparent-secondary w-100 me-3"
      v-for="(module, color) in modules"
      :key="color"
    >
      <div class="bg-white p-2 rounded mb-2">
        <div class="d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center">
            <span class="bg-soft-pink p-1 d-flex rounded-circle me-2">
              <span class="d-block p-1" :class="module.DotClass"></span>
            </span>
            <h5 class="me-2">{{ module.Title }}</h5>
            <span class="badge bg-light rounded-pill">{{ module.Count }}</span>
          </div>
          <div class="dropdown">
            <a
              href="javascript:void(0);"
              class="d-inline-flex align-items-center"
              data-bs-toggle="dropdown"
            >
              <i class="ti ti-dots-vertical"></i>
            </a>
            <ul class="dropdown-menu dropdown-menu-end p-3">
              <li>
                <a href="javascript:void(0);" class="dropdown-item rounded-1"
                  ><i class="ti ti-edit me-2"></i>Edit</a
                >
              </li>
              <li>
                <a
                  href="javascript:void(0);"
                  class="dropdown-item rounded-1"
                  data-bs-toggle="modal"
                  data-bs-target="#delete_modal"
                  ><i class="ti ti-trash me-2"></i>Delete</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="kanban-drag-wrap">
        <draggable
          :list="module.Cards"
          :group="{ name: 'kanban', pull: true, put: true }"
          @end="onDragEnd(color)"
        >
          <div v-for="Card in module.Cards" :key="Card.id">
            <div class="card kanban-card mb-2">
              <div class="card-body">
                <div
                  class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3"
                >
                  <div class="d-flex align-items-center flex-shrink-0">
                    <span :class="Card.BadgeClass">{{ Card.BadgeNo }}</span>
                  </div>
                  <div class="dropdown">
                    <a
                      href="javascript:void(0);"
                      class="d-inline-flex align-items-center"
                      data-bs-toggle="dropdown"
                    >
                      <i class="ti ti-dots-vertical"></i>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end p-3">
                      <li>
                        <a
                          href="javascript:void(0);"
                          class="dropdown-item rounded-1"
                          data-bs-toggle="modal"
                          data-bs-target="#delete_modal"
                          ><i class="ti ti-trash me-2"></i>Delete</a
                        >
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="d-flex align-items-center flex-shrink-0 mb-3">
                  <a
                    href="javascript:void(0);"
                    class="avatar avatar-lg avatar rounded-circle me-2"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#candidate_details"
                  >
                    <img
                      :src="getUserAvatar(Card.Image)"
                      class="img-fluid h-auto w-auto"
                      alt="img"
                    />
                  </a>
                  <div class="d-flex flex-column">
                    <div class="d-flex flex-wrap">
                      <h6 class="text-dark fs-16 fw-semibold">
                        <a
                          href="javascript:void(0);"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#candidate_details"
                          >{{ Card.Name }}</a
                        >
                      </h6>
                    </div>
                    <p class="text-gray fs-13 fw-normal">{{ Card.Email }}</p>
                  </div>
                </div>
                <div class="d-flex justify-content-between">
                  <div>
                    <h6 class="text-gray fs-14 fw-normal mb-2">Applied Role</h6>
                    <span class="text-dark fs-14 fw-medium">{{ Card.Role }}</span>
                  </div>
                  <span class="border-start text-gray fs-14 fw-normal"></span>
                  <div>
                    <h6 class="text-gray fs-14 fw-normal mb-2">Applied Date</h6>
                    <span class="text-dark fs-14 fw-medium">{{ Card.Date }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </draggable>
      </div>
      <div class="pt-2">
        <a
          href="javascript:void(0);"
          class="btn btn-white border border-dashed d-flex align-items-center justify-content-center"
        >
          <i class="ti ti-plus me-2"></i>
          New Project
        </a>
      </div>
    </div>
  </div>
</template>
