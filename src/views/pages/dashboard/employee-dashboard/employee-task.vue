<template>
  <div class="row">
    <div class="col-xl-6 d-flex">
      <div class="card flex-fill">
        <div class="card-header">
          <div
            class="d-flex align-items-center justify-content-between flex-wrap row-gap-2"
          >
            <h5>Projects</h5>
            <div class="dropdown">
              <a
                href="javascript:void(0);"
                class="btn btn-white border-0 dropdown-toggle border btn-sm d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                Ongoing Projects
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >All Projects</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >Ongoing Projects</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <div class="card mb-4 shadow-none mb-md-0">
                <div class="card-body">
                  <div class="d-flex align-items-center justify-content-between mb-3">
                    <h6>Office Management</h6>
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
                            data-bs-target="#edit_task"
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
                  <div>
                    <div class="d-flex align-items-center mb-3">
                      <a href="javascript:void(0);" class="avatar">
                        <img
                          src="@/assets/img/users/user-32.jpg"
                          class="img-fluid rounded-circle"
                          alt="img"
                        />
                      </a>
                      <div class="ms-2">
                        <h6 class="fw-normal">
                          <a href="javascript:void(0);">Anthony Lewis</a>
                        </h6>
                        <span class="fs-13 d-block">Project Leader</span>
                      </div>
                    </div>
                    <div class="d-flex align-items-center mb-3">
                      <a
                        href="javascript:void(0);"
                        class="avatar bg-soft-primary rounded-circle"
                      >
                        <i class="ti ti-calendar text-primary fs-16"></i>
                      </a>
                      <div class="ms-2">
                        <h6 class="fw-normal">14 Jan 2024</h6>
                        <span class="fs-13 d-block">Deadline</span>
                      </div>
                    </div>
                    <div
                      class="d-flex align-items-center justify-content-between bg-transparent-light border border-dashed rounded p-2 mb-3"
                    >
                      <div class="d-flex align-items-center">
                        <span
                          class="avatar avatar-sm bg-success-transparent rounded-circle me-1"
                          ><i class="ti ti-checklist fs-16"></i
                        ></span>
                        <p>Tasks : <span class="text-gray-9">6 </span> /10</p>
                      </div>
                      <div class="avatar-list-stacked avatar-group-sm">
                        <span class="avatar avatar-rounded">
                          <img
                            class="border border-white"
                            src="@/assets/img/profiles/avatar-06.jpg"
                            alt="img"
                          />
                        </span>
                        <span class="avatar avatar-rounded">
                          <img
                            class="border border-white"
                            src="@/assets/img/profiles/avatar-07.jpg"
                            alt="img"
                          />
                        </span>
                        <span class="avatar avatar-rounded">
                          <img
                            class="border border-white"
                            src="@/assets/img/profiles/avatar-08.jpg"
                            alt="img"
                          />
                        </span>
                        <a
                          class="avatar bg-primary avatar-rounded text-fixed-white fs-12 fw-medium"
                          href="javascript:void(0);"
                        >
                          +2
                        </a>
                      </div>
                    </div>
                    <div
                      class="bg-soft-secondary p-2 rounded d-flex align-items-center justify-content-between"
                    >
                      <p class="text-secondary mb-0 text-truncate">Time Spent</p>
                      <h5 class="text-secondary text-truncate">
                        65/120 <span class="fs-14 fw-normal">Hrs</span>
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card shadow-none mb-0">
                <div class="card-body">
                  <div class="d-flex align-items-center justify-content-between mb-3">
                    <h6>Office Management</h6>
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
                            data-bs-target="#edit_task"
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
                  <div>
                    <div class="d-flex align-items-center mb-3">
                      <a href="javascript:void(0);" class="avatar">
                        <img
                          src="@/assets/img/users/user-33.jpg"
                          class="img-fluid rounded-circle"
                          alt="img"
                        />
                      </a>
                      <div class="ms-2">
                        <h6 class="fw-normal">
                          <a href="javascript:void(0);">Anthony Lewis</a>
                        </h6>
                        <span class="fs-13 d-block">Project Leader</span>
                      </div>
                    </div>
                    <div class="d-flex align-items-center mb-3">
                      <a
                        href="javascript:void(0);"
                        class="avatar bg-soft-primary rounded-circle"
                      >
                        <i class="ti ti-calendar text-primary fs-16"></i>
                      </a>
                      <div class="ms-2">
                        <h6 class="fw-normal">14 Jan 2024</h6>
                        <span class="fs-13 d-block">Deadline</span>
                      </div>
                    </div>
                    <div
                      class="d-flex align-items-center justify-content-between bg-transparent-light border border-dashed rounded p-2 mb-3"
                    >
                      <div class="d-flex align-items-center">
                        <span
                          class="avatar avatar-sm bg-success-transparent rounded-circle me-1"
                          ><i class="ti ti-checklist fs-16"></i
                        ></span>
                        <p>Tasks : <span class="text-gray-9">6 </span> /10</p>
                      </div>
                      <div class="avatar-list-stacked avatar-group-sm">
                        <span class="avatar avatar-rounded">
                          <img
                            class="border border-white"
                            src="@/assets/img/profiles/avatar-06.jpg"
                            alt="img"
                          />
                        </span>
                        <span class="avatar avatar-rounded">
                          <img
                            class="border border-white"
                            src="@/assets/img/profiles/avatar-07.jpg"
                            alt="img"
                          />
                        </span>
                        <span class="avatar avatar-rounded">
                          <img
                            class="border border-white"
                            src="@/assets/img/profiles/avatar-08.jpg"
                            alt="img"
                          />
                        </span>
                        <a
                          class="avatar bg-primary avatar-rounded text-fixed-white fs-12 fw-medium"
                          href="javascript:void(0);"
                        >
                          +2
                        </a>
                      </div>
                    </div>
                    <div
                      class="bg-soft-secondary p-2 rounded d-flex align-items-center justify-content-between"
                    >
                      <p class="text-secondary mb-0 text-truncate">Time Spent</p>
                      <h5 class="text-secondary text-truncate">
                        65/120 <span class="fs-14 fw-normal">Hrs</span>
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-xl-6 d-flex">
      <div class="card flex-fill">
        <div class="card-header">
          <div
            class="d-flex align-items-center justify-content-between flex-wrap row-gap-2"
          >
            <h5>Tasks</h5>
            <div class="dropdown">
              <a
                href="javascript:void(0);"
                class="btn btn-white border-0 dropdown-toggle border btn-sm d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                All Projects
              </a>
              <ul class="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >All Projects</a
                  >
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item rounded-1"
                    >Ongoing Projects</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="list-group list-group-flush">
            <div class="list-group-item border rounded mb-3 p-2">
              <div class="row align-items-center row-gap-3">
                <div class="col-md-8">
                  <div class="todo-inbox-check d-flex align-items-center">
                    <span><i class="ti ti-grid-dots me-2"></i></span>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" />
                    </div>
                    <span class="me-2 d-flex align-items-center rating-select"
                      ><i class="ti ti-star-filled filled"></i
                    ></span>
                    <div class="strike-info">
                      <h4 class="fs-14 text-truncate">Patient appointment booking</h4>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div
                    class="d-flex align-items-center justify-content-md-end flex-wrap row-gap-3"
                  >
                    <span class="badge bg-soft-pink d-inline-flex align-items-center me-2"
                      ><i class="fas fa-circle fs-6 me-1"></i>Onhold</span
                    >
                    <div class="d-flex align-items-center">
                      <div class="avatar-list-stacked avatar-group-sm">
                        <span class="avatar avatar-rounded">
                          <img
                            class="border border-white"
                            src="@/assets/img/profiles/avatar-13.jpg"
                            alt="img"
                          />
                        </span>
                        <span class="avatar avatar-rounded">
                          <img
                            class="border border-white"
                            src="@/assets/img/profiles/avatar-14.jpg"
                            alt="img"
                          />
                        </span>
                        <span class="avatar avatar-rounded">
                          <img
                            class="border border-white"
                            src="@/assets/img/profiles/avatar-15.jpg"
                            alt="img"
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="list-group-item border rounded mb-3 p-2">
              <div class="row align-items-center row-gap-3">
                <div class="col-md-8">
                  <div class="todo-inbox-check d-flex align-items-center">
                    <span><i class="ti ti-grid-dots me-2"></i></span>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" />
                    </div>
                    <span class="me-2 rating-select d-flex align-items-center"
                      ><i class="ti ti-star"></i
                    ></span>
                    <div class="strike-info">
                      <h4 class="fs-14 text-truncate">
                        Appointment booking with payment
                      </h4>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div
                    class="d-flex align-items-center justify-content-md-end flex-wrap row-gap-3"
                  >
                    <span
                      class="badge bg-transparent-purple d-flex align-items-center me-2"
                      ><i class="fas fa-circle fs-6 me-1"></i>Inprogress</span
                    >
                    <div class="d-flex align-items-center">
                      <div class="avatar-list-stacked avatar-group-sm">
                        <span class="avatar avatar-rounded">
                          <img
                            class="border border-white"
                            src="@/assets/img/profiles/avatar-20.jpg"
                            alt="img"
                          />
                        </span>
                        <span class="avatar avatar-rounded">
                          <img
                            class="border border-white"
                            src="@/assets/img/profiles/avatar-21.jpg"
                            alt="img"
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="list-group-item border rounded mb-3 p-2">
              <div class="row align-items-center row-gap-3">
                <div class="col-md-8">
                  <div class="todo-inbox-check d-flex align-items-center">
                    <span><i class="ti ti-grid-dots me-2"></i></span>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" />
                    </div>
                    <span class="me-2 rating-select d-flex align-items-center"
                      ><i class="ti ti-star"></i
                    ></span>
                    <div class="strike-info">
                      <h4 class="fs-14 text-truncate">
                        Patient and Doctor video conferencing
                      </h4>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div
                    class="d-flex align-items-center justify-content-md-end flex-wrap row-gap-3"
                  >
                    <span class="badge badge-soft-success align-items-center me-2"
                      ><i class="fas fa-circle fs-6 me-1"></i>Completed</span
                    >
                    <div class="d-flex align-items-center">
                      <div class="avatar-list-stacked avatar-group-sm">
                        <span class="avatar avatar-rounded">
                          <img
                            class="border border-white"
                            src="@/assets/img/profiles/avatar-28.jpg"
                            alt="img"
                          />
                        </span>
                        <span class="avatar avatar-rounded">
                          <img
                            class="border border-white"
                            src="@/assets/img/profiles/avatar-29.jpg"
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="list-group-item border rounded mb-3 p-2">
              <div class="row align-items-center row-gap-3">
                <div class="col-md-8">
                  <div
                    class="todo-inbox-check d-flex align-items-center todo-strike-content"
                  >
                    <span><i class="ti ti-grid-dots me-2"></i></span>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" checked />
                    </div>
                    <span class="me-2 rating-select d-flex align-items-center"
                      ><i class="ti ti-star"></i
                    ></span>
                    <div class="strike-info">
                      <h4 class="fs-14 text-truncate">Private chat module</h4>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div
                    class="d-flex align-items-center justify-content-md-end flex-wrap row-gap-3"
                  >
                    <span
                      class="badge badge-secondary-transparent d-flex align-items-center me-2"
                      ><i class="fas fa-circle fs-6 me-1"></i>Pending</span
                    >
                    <div class="d-flex align-items-center">
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
            <div class="list-group-item border rounded p-2">
              <div class="row align-items-center row-gap-3">
                <div class="col-md-8">
                  <div class="todo-inbox-check d-flex align-items-center">
                    <span><i class="ti ti-grid-dots me-2"></i></span>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" />
                    </div>
                    <span class="me-2 rating-select d-flex align-items-center"
                      ><i class="ti ti-star"></i
                    ></span>
                    <div class="strike-info">
                      <h4 class="fs-14 text-truncate">
                        Go-Live and Post-Implementation Support
                      </h4>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div
                    class="d-flex align-items-center justify-content-md-end flex-wrap row-gap-3"
                  >
                    <span
                      class="badge bg-transparent-purple d-flex align-items-center me-2"
                      ><i class="fas fa-circle fs-6 me-1"></i>Inprogress</span
                    >
                    <div class="d-flex align-items-center">
                      <div class="avatar-list-stacked avatar-group-sm">
                        <span class="avatar avatar-rounded">
                          <img
                            class="border border-white"
                            src="@/assets/img/profiles/avatar-28.jpg"
                            alt="img"
                          />
                        </span>
                        <span class="avatar avatar-rounded">
                          <img
                            class="border border-white"
                            src="@/assets/img/profiles/avatar-29.jpg"
                            alt="img"
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
