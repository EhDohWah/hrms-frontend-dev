<template>
  <div class="row">
    <!-- Jobs Applicants -->
    <div class="col-xxl-4 d-flex">
      <div class="card flex-fill">
        <div
          class="card-header pb-2 d-flex align-items-center justify-content-between flex-wrap"
        >
          <h5 class="mb-2">Jobs Applicants</h5>
          <router-link to="/recuritment/job-list" class="btn btn-light btn-md mb-2"
            >View All</router-link
          >
        </div>
        <div class="card-body">
          <ul
            class="nav nav-tabs tab-style-1 nav-justified d-sm-flex d-block p-0 mb-4"
            role="tablist"
          >
            <li class="nav-item" role="presentation">
              <a
                class="nav-link fw-medium"
                data-bs-toggle="tab"
                data-bs-target="#openings"
                aria-current="page"
                href="#openings"
                aria-selected="true"
                role="tab"
                >Openings</a
              >
            </li>
            <li class="nav-item" role="presentation">
              <a
                class="nav-link fw-medium active"
                data-bs-toggle="tab"
                data-bs-target="#applicants"
                href="#applicants"
                aria-selected="false"
                tabindex="-1"
                role="tab"
                >Applicants</a
              >
            </li>
          </ul>
          <div class="tab-content">
            <div class="tab-pane fade" id="openings">
              <div class="d-flex align-items-center justify-content-between mb-4">
                <div class="d-flex align-items-center">
                  <a
                    href="javascript:void(0);"
                    class="avatar overflow-hidden flex-shrink-0 bg-gray-100"
                  >
                    <img
                      src="@/assets/img/icons/apple.svg"
                      class="img-fluid rounded-circle w-auto h-auto"
                      alt="img"
                    />
                  </a>
                  <div class="ms-2 overflow-hidden">
                    <p class="text-dark fw-medium text-truncate mb-0">
                      <a href="javascript:void(0);">Senior IOS Developer</a>
                    </p>
                    <span class="fs-12">No of Openings : 25 </span>
                  </div>
                </div>
                <a
                  href="javascript:void(0);"
                  class="btn btn-light btn-sm p-0 btn-icon d-flex align-items-center justify-content-center"
                  ><i class="ti ti-edit"></i
                ></a>
              </div>
              <div class="d-flex align-items-center justify-content-between mb-4">
                <div class="d-flex align-items-center">
                  <a
                    href="javascript:void(0);"
                    class="avatar overflow-hidden flex-shrink-0 bg-gray-100"
                  >
                    <img
                      src="@/assets/img/icons/php.svg"
                      class="img-fluid w-auto h-auto"
                      alt="img"
                    />
                  </a>
                  <div class="ms-2 overflow-hidden">
                    <p class="text-dark fw-medium text-truncate mb-0">
                      <a href="javascript:void(0);">Junior PHP Developer</a>
                    </p>
                    <span class="fs-12">No of Openings : 20 </span>
                  </div>
                </div>
                <a
                  href="javascript:void(0);"
                  class="btn btn-light btn-sm p-0 btn-icon d-flex align-items-center justify-content-center"
                  ><i class="ti ti-edit"></i
                ></a>
              </div>
              <div class="d-flex align-items-center justify-content-between mb-4">
                <div class="d-flex align-items-center">
                  <a
                    href="javascript:void(0);"
                    class="avatar overflow-hidden flex-shrink-0 bg-gray-100"
                  >
                    <img
                      src="@/assets/img/icons/react.svg"
                      class="img-fluid w-auto h-auto"
                      alt="img"
                    />
                  </a>
                  <div class="ms-2 overflow-hidden">
                    <p class="text-dark fw-medium text-truncate mb-0">
                      <a href="javascript:void(0);">Junior React Developer </a>
                    </p>
                    <span class="fs-12">No of Openings : 30 </span>
                  </div>
                </div>
                <a
                  href="javascript:void(0);"
                  class="btn btn-light btn-sm p-0 btn-icon d-flex align-items-center justify-content-center"
                  ><i class="ti ti-edit"></i
                ></a>
              </div>
              <div class="d-flex align-items-center justify-content-between mb-0">
                <div class="d-flex align-items-center">
                  <a
                    href="javascript:void(0);"
                    class="avatar overflow-hidden flex-shrink-0 bg-gray-100"
                  >
                    <img
                      src="@/assets/img/icons/laravel-icon.svg"
                      class="img-fluid w-auto h-auto"
                      alt="img"
                    />
                  </a>
                  <div class="ms-2 overflow-hidden">
                    <p class="text-dark fw-medium text-truncate mb-0">
                      <a href="javascript:void(0);">Senior Laravel Developer</a>
                    </p>
                    <span class="fs-12">No of Openings : 40 </span>
                  </div>
                </div>
                <a
                  href="javascript:void(0);"
                  class="btn btn-light btn-sm p-0 btn-icon d-flex align-items-center justify-content-center"
                  ><i class="ti ti-edit"></i
                ></a>
              </div>
            </div>
            <div class="tab-pane fade show active" id="applicants">
              <div class="d-flex align-items-center justify-content-between mb-4">
                <div class="d-flex align-items-center">
                  <a
                    href="javascript:void(0);"
                    class="avatar overflow-hidden flex-shrink-0"
                  >
                    <img
                      src="@/assets/img/users/user-09.jpg"
                      class="img-fluid rounded-circle"
                      alt="img"
                    />
                  </a>
                  <div class="ms-2 overflow-hidden">
                    <p class="text-dark fw-medium text-truncate mb-0">
                      <a href="javascript:void(0);">Brian Villalobos</a>
                    </p>
                    <span class="fs-13 d-inline-flex align-items-center"
                      >Exp : 5+ Years<i
                        class="ti ti-circle-filled fs-4 mx-2 text-primary"
                      ></i
                      >USA</span
                    >
                  </div>
                </div>
                <span class="badge badge-secondary badge-xs">UI/UX Designer</span>
              </div>
              <div class="d-flex align-items-center justify-content-between mb-4">
                <div class="d-flex align-items-center">
                  <a
                    href="javascript:void(0);"
                    class="avatar overflow-hidden flex-shrink-0"
                  >
                    <img
                      src="@/assets/img/users/user-32.jpg"
                      class="img-fluid rounded-circle"
                      alt="img"
                    />
                  </a>
                  <div class="ms-2 overflow-hidden">
                    <p class="text-dark fw-medium text-truncate mb-0">
                      <a href="javascript:void(0);">Anthony Lewis</a>
                    </p>
                    <span class="fs-13 d-inline-flex align-items-center"
                      >Exp : 4+ Years<i
                        class="ti ti-circle-filled fs-4 mx-2 text-primary"
                      ></i
                      >USA</span
                    >
                  </div>
                </div>
                <span class="badge badge-info badge-xs">Python Developer</span>
              </div>
              <div class="d-flex align-items-center justify-content-between mb-4">
                <div class="d-flex align-items-center">
                  <a
                    href="javascript:void(0);"
                    class="avatar overflow-hidden flex-shrink-0"
                  >
                    <img
                      src="@/assets/img/users/user-32.jpg"
                      class="img-fluid rounded-circle"
                      alt="img"
                    />
                  </a>
                  <div class="ms-2 overflow-hidden">
                    <p class="text-dark fw-medium text-truncate mb-0">
                      <a href="javascript:void(0);">Stephan Peralt</a>
                    </p>
                    <span class="fs-13 d-inline-flex align-items-center"
                      >Exp : 6+ Years<i
                        class="ti ti-circle-filled fs-4 mx-2 text-primary"
                      ></i
                      >USA</span
                    >
                  </div>
                </div>
                <span class="badge badge-pink badge-xs">Android Developer</span>
              </div>
              <div class="d-flex align-items-center justify-content-between mb-0">
                <div class="d-flex align-items-center">
                  <a
                    href="javascript:void(0);"
                    class="avatar overflow-hidden flex-shrink-0"
                  >
                    <img
                      src="@/assets/img/users/user-34.jpg"
                      class="img-fluid rounded-circle"
                      alt="img"
                    />
                  </a>
                  <div class="ms-2 overflow-hidden">
                    <p class="text-dark fw-medium text-truncate mb-0">
                      <a href="javascript:void(0);">Doglas Martini</a>
                    </p>
                    <span class="fs-13 d-inline-flex align-items-center"
                      >Exp : 2+ Years<i
                        class="ti ti-circle-filled fs-4 mx-2 text-primary"
                      ></i
                      >USA</span
                    >
                  </div>
                </div>
                <span class="badge badge-purple badge-xs">React Developer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- /Jobs Applicants -->

    <!-- Employees -->
    <div class="col-xxl-4 col-xl-6 d-flex">
      <div class="card flex-fill">
        <div
          class="card-header pb-2 d-flex align-items-center justify-content-between flex-wrap"
        >
          <h5 class="mb-2">Employees</h5>
          <router-link to="/employee/employee-list" class="btn btn-light btn-md mb-2"
            >View All</router-link
          >
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-nowrap mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div class="d-flex align-items-center">
                      <a href="javascript:void(0);" class="avatar">
                        <img
                          src="@/assets/img/users/user-32.jpg"
                          class="img-fluid rounded-circle"
                          alt="img"
                        />
                      </a>
                      <div class="ms-2">
                        <h6 class="fw-medium">
                          <a href="javascript:void(0);">Anthony Lewis</a>
                        </h6>
                        <span class="fs-12">Finance</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-secondary-transparent badge-xs">
                      Finance
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="d-flex align-items-center">
                      <a href="javascript:void(0);" class="avatar">
                        <img
                          src="@/assets/img/users/user-09.jpg"
                          class="img-fluid rounded-circle"
                          alt="img"
                        />
                      </a>
                      <div class="ms-2">
                        <h6 class="fw-medium">
                          <a href="javascript:void(0);">Brian Villalobos</a>
                        </h6>
                        <span class="fs-12">PHP Developer</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-danger-transparent badge-xs"
                      >Development</span
                    >
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="d-flex align-items-center">
                      <a href="javascript:void(0);" class="avatar">
                        <img
                          src="@/assets/img/users/user-01.jpg"
                          class="img-fluid rounded-circle"
                          alt="img"
                        />
                      </a>
                      <div class="ms-2">
                        <h6 class="fw-medium">
                          <a href="javascript:void(0);">Stephan Peralt</a>
                        </h6>
                        <span class="fs-12">Executive</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-info-transparent badge-xs">Marketing</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="d-flex align-items-center">
                      <a href="javascript:void(0);" class="avatar">
                        <img
                          src="@/assets/img/users/user-34.jpg"
                          class="img-fluid rounded-circle"
                          alt="img"
                        />
                      </a>
                      <div class="ms-2">
                        <h6 class="fw-medium">
                          <a href="javascript:void(0);">Doglas Martini</a>
                        </h6>
                        <span class="fs-12">Project Manager</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-purple-transparent badge-xs">Manager</span>
                  </td>
                </tr>
                <tr>
                  <td class="border-0">
                    <div class="d-flex align-items-center">
                      <a href="javascript:void(0);" class="avatar">
                        <img
                          src="@/assets/img/users/user-37.jpg"
                          class="img-fluid rounded-circle"
                          alt="img"
                        />
                      </a>
                      <div class="ms-2">
                        <h6 class="fw-medium">
                          <a href="javascript:void(0);">Anthony Lewis</a>
                        </h6>
                        <span class="fs-12">UI/UX Designer</span>
                      </div>
                    </div>
                  </td>
                  <td class="border-0">
                    <span class="badge badge-pink-transparent badge-xs"
                      >UI/UX Design</span
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- /Employees -->

    <!-- Todo -->
    <div class="col-xxl-4 col-xl-6 d-flex">
      <div class="card flex-fill">
        <div
          class="card-header pb-2 d-flex align-items-center justify-content-between flex-wrap"
        >
          <h5 class="mb-2">Todo</h5>
          <div class="d-flex align-items-center">
            <div class="dropdown mb-2 me-2">
              <a
                href="javascript:void(0);"
                class="btn btn-white border btn-sm d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                <i class="ti ti-calendar me-1"></i>Today
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >This Month</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >This Week</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1">Today</a>
                </li>
              </ul>
            </div>
            <a
              href="javascript:void(0);"
              class="btn btn-primary btn-icon btn-xs rounded-circle d-flex align-items-center justify-content-center p-0 mb-2"
              data-bs-toggle="modal"
              data-bs-target="#add_todo"
              ><i class="ti ti-plus fs-16"></i
            ></a>
          </div>
        </div>
        <div class="card-body">
          <div
            class="d-flex align-items-center todo-item border p-2 br-5 mb-2"
            :class="{ 'todo-strike': isClicked }"
            @click="toggleClicked"
          >
            <i class="ti ti-grid-dots me-2"></i>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="todo1" />
              <label class="form-check-label fw-medium" for="todo1">Add Holidays</label>
            </div>
          </div>
          <div
            class="d-flex align-items-center todo-item border p-2 br-5 mb-2"
            :class="{ 'todo-strike': isClickedOne }"
            @click="toggleClickedOne"
          >
            <i class="ti ti-grid-dots me-2"></i>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="todo2" />
              <label class="form-check-label fw-medium" for="todo2"
                >Add Meeting to Client</label
              >
            </div>
          </div>
          <div
            class="d-flex align-items-center todo-item border p-2 br-5 mb-2"
            :class="{ 'todo-strike': isClickedTwo }"
            @click="toggleClickedTwo"
          >
            <i class="ti ti-grid-dots me-2"></i>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="todo3" />
              <label class="form-check-label fw-medium" for="todo3"
                >Chat with Adrian</label
              >
            </div>
          </div>
          <div
            class="d-flex align-items-center todo-item border p-2 br-5 mb-2"
            :class="{ 'todo-strike': isClickedThree }"
            @click="toggleClickedThree"
          >
            <i class="ti ti-grid-dots me-2"></i>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="todo4" />
              <label class="form-check-label fw-medium" for="todo4"
                >Management Call</label
              >
            </div>
          </div>
          <div
            class="d-flex align-items-center todo-item border p-2 br-5 mb-2"
            :class="{ 'todo-strike': isClickedFour }"
            @click="toggleClickedFour"
          >
            <i class="ti ti-grid-dots me-2"></i>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="todo5" />
              <label class="form-check-label fw-medium" for="todo5">Add Payroll</label>
            </div>
          </div>
          <div
            class="d-flex align-items-center todo-item border p-2 br-5 mb-0"
            :class="{ 'todo-strike': isClickedFive }"
            @click="toggleClickedFive"
          >
            <i class="ti ti-grid-dots me-2"></i>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="todo6" />
              <label class="form-check-label fw-medium" for="todo6"
                >Add Policy for Increment
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- /Todo -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      isClicked: false,
      isClickedOne: false,
      isClickedTwo: false,
      isClickedThree: false,
      isClickedFour: false,
      isClickedFive: false,
    };
  },
  methods: {
    toggleClicked() {
      this.isClicked = !this.isClicked;
    },
    toggleClickedOne() {
      this.isClickedOne = !this.isClickedOne;
    },
    toggleClickedTwo() {
      this.isClickedTwo = !this.isClickedTwo;
    },
    toggleClickedThree() {
      this.isClickedThree = !this.isClickedThree;
    },
    toggleClickedFour() {
      this.isClickedFour = !this.isClickedFour;
    },
    toggleClickedFive() {
      this.isClickedFive = !this.isClickedFive;
    },
    toggleHeader() {
      document.getElementById("collapse-header").classList.toggle("active");
      document.body.classList.toggle("header-collapse");
    },
  },
};
</script>
