<template>
  <div class="row">
    <div class="col-xl-4 d-flex">
      <div class="card flex-fill">
        <div class="card-header">
          <div
            class="d-flex align-items-center justify-content-between flex-wrap row-gap-2"
          >
            <h5>Recent Follow Up</h5>
            <div>
              <a href="javascript:void(0);" class="btn btn-light btn-sm px-3">View All</a>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="d-flex align-items-center justify-content-between mb-4">
            <div class="d-flex align-items-center">
              <a href="javascript:void(0);" class="avatar flex-shrink-0">
                <img
                  src="@/assets/img/users/user-27.jpg"
                  class="rounded-circle border border-2"
                  alt="img"
                />
              </a>
              <div class="ms-2">
                <h6 class="fs-14 fw-medium text-truncate mb-1">
                  <a href="javascript:void(0);">Alexander Jermai</a>
                </h6>
                <p class="fs-13">UI/UX Designer</p>
              </div>
            </div>
            <div class="d-flex align-items-center">
              <a href="javascript:void(0);" class="btn btn-light btn-icon btn-sm"
                ><i class="ti ti-mail-bolt fs-16"></i
              ></a>
            </div>
          </div>
          <div class="d-flex align-items-center justify-content-between mb-4">
            <div class="d-flex align-items-center">
              <a href="javascript:void(0);" class="avatar flex-shrink-0">
                <img
                  src="@/assets/img/users/user-42.jpg"
                  class="rounded-circle border border-2"
                  alt="img"
                />
              </a>
              <div class="ms-2">
                <h6 class="fs-14 fw-medium text-truncate mb-1">
                  <a href="javascript:void(0);">Doglas Martini</a>
                </h6>
                <p class="fs-13">Product Designer</p>
              </div>
            </div>
            <div class="d-flex align-items-center">
              <a href="javascript:void(0);" class="btn btn-light btn-icon btn-sm"
                ><i class="ti ti-phone-x fs-16"></i
              ></a>
            </div>
          </div>
          <div class="d-flex align-items-center justify-content-between mb-4">
            <div class="d-flex align-items-center">
              <a href="javascript:void(0);" class="avatar flex-shrink-0">
                <img
                  src="@/assets/img/users/user-43.jpg"
                  class="rounded-circle border border-2"
                  alt="img"
                />
              </a>
              <div class="ms-2">
                <h6 class="fs-14 fw-medium text-truncate mb-1">
                  <a href="javascript:void(0);">Daniel Esbella</a>
                </h6>
                <p class="fs-13">Project Manager</p>
              </div>
            </div>
            <div class="d-flex align-items-center">
              <a href="javascript:void(0);" class="btn btn-light btn-icon btn-sm"
                ><i class="ti ti-mail-bolt fs-16"></i
              ></a>
            </div>
          </div>
          <div class="d-flex align-items-center justify-content-between mb-4">
            <div class="d-flex align-items-center">
              <a href="javascript:void(0);" class="avatar flex-shrink-0">
                <img
                  src="@/assets/img/users/user-11.jpg"
                  class="rounded-circle border border-2"
                  alt="img"
                />
              </a>
              <div class="ms-2">
                <h6 class="fs-14 fw-medium text-truncate mb-1">
                  <a href="javascript:void(0);">Daniel Esbella</a>
                </h6>
                <p class="fs-13">Team Lead</p>
              </div>
            </div>
            <div class="d-flex align-items-center">
              <a href="javascript:void(0);" class="btn btn-light btn-icon btn-sm"
                ><i class="ti ti-brand-hipchat fs-16"></i
              ></a>
            </div>
          </div>
          <div class="d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
              <a href="javascript:void(0);" class="avatar flex-shrink-0">
                <img
                  src="@/assets/img/users/user-45.jpg"
                  class="rounded-circle border border-2"
                  alt="img"
                />
              </a>
              <div class="ms-2">
                <h6 class="fs-14 fw-medium text-truncate mb-1">
                  <a href="javascript:void(0);">Doglas Martini</a>
                </h6>
                <p class="fs-13">Team Lead</p>
              </div>
            </div>
            <div class="d-flex align-items-center">
              <a href="javascript:void(0);" class="btn btn-light btn-icon btn-sm"
                ><i class="ti ti-brand-hipchat fs-16"></i
              ></a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-xl-4 d-flex">
      <div class="card flex-fill">
        <div class="card-header">
          <div
            class="d-flex align-items-center justify-content-between flex-wrap row-gap-2"
          >
            <h5>Recent Activities</h5>
            <div>
              <router-link to="/crm/activity" class="btn btn-sm btn-light px-3"
                >View All</router-link
              >
            </div>
          </div>
        </div>
        <div class="card-body schedule-timeline activity-timeline">
          <div class="d-flex align-items-start">
            <div class="avatar avatar-md avatar-rounded bg-success flex-shrink-0">
              <i class="ti ti-phone fs-20"></i>
            </div>
            <div class="flex-fill ps-3 pb-4 timeline-flow">
              <p class="fw-medium text-gray-9 mb-1">
                <router-link to="/crm/activity"
                  >Drain responded to your appointment schedule question.</router-link
                >
              </p>
              <span>09:25 PM</span>
            </div>
          </div>
          <div class="d-flex align-items-start">
            <div class="avatar avatar-md avatar-rounded bg-info flex-shrink-0">
              <i class="ti ti-message-circle-2 fs-20"></i>
            </div>
            <div class="flex-fill ps-3 pb-4 timeline-flow">
              <p class="fw-medium text-gray-9 mb-1">
                <router-link to="/crm/activity"
                  >You sent 1 Message to the James.</router-link
                >
              </p>
              <span>10:25 PM</span>
            </div>
          </div>
          <div class="d-flex align-items-start">
            <div class="avatar avatar-md avatar-rounded bg-success flex-shrink-0">
              <i class="ti ti-phone fs-20"></i>
            </div>
            <div class="flex-fill ps-3 pb-4 timeline-flow">
              <p class="fw-medium text-gray-9 mb-1">
                <router-link to="/crm/activity"
                  >Denwar responded to your appointment on 25 Jan 2025, 08:15
                  PM</router-link
                >
              </p>
              <span>09:25 PM</span>
            </div>
          </div>
          <div class="d-flex align-items-start">
            <div class="avatar avatar-md avatar-rounded bg-purple flex-shrink-0">
              <i class="ti ti-user-circle fs-20"></i>
            </div>
            <div class="flex-fill ps-3 timeline-flow">
              <p class="fw-medium text-gray-9 mb-1">
                <router-link to="/crm/activity" class="d-flex align-items-center"
                  >Meeting With
                  <img
                    src="@/assets/img/users/user-58.jpg"
                    class="avatar avatar-sm rounded-circle mx-2"
                    alt="Img"
                  />Abraham</router-link
                >
              </p>
              <span>09:25 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-xl-4 d-flex">
      <div class="card flex-fill">
        <div class="card-header">
          <div class="d-flex align-items-center justify-content-between flex-wrap">
            <h5>Notifications</h5>
            <div>
              <a href="javascript:void(0);" class="btn btn-light btn-sm px-3">View All</a>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="d-flex align-items-start mb-4">
            <a href="javascript:void(0);" class="avatar flex-shrink-0">
              <img
                src="@/assets/img/users/user-27.jpg"
                class="rounded-circle border border-2"
                alt="img"
              />
            </a>
            <div class="ms-2">
              <h6 class="fs-14 fw-medium text-truncate mb-1">
                Lex Murphy requested access to UNIX
              </h6>
              <p class="fs-13 mb-2">Today at 9:42 AM</p>
              <div class="d-flex align-items-center">
                <a href="javascript:void(0);" class="avatar avatar-sm border flex-shrink-0 me-2"
                  ><img
                    src="@/assets/img/social/pdf-icon.svg"
                    class="w-auto h-auto"
                    alt="Img"
                /></a>
                <h6 class="fw-normal"><a href="javascript:void(0);">EY_review.pdf</a></h6>
              </div>
            </div>
          </div>
          <div class="d-flex align-items-start mb-4">
            <a href="javascript:void(0);" class="avatar flex-shrink-0">
              <img
                src="@/assets/img/users/user-28.jpg"
                class="rounded-circle border border-2"
                alt="img"
              />
            </a>
            <div class="ms-2">
              <h6 class="fs-14 fw-medium text-truncate mb-1">
                Lex Murphy requested access to UNIX
              </h6>
              <p class="fs-13 mb-0">Today at 10:00 AM</p>
            </div>
          </div>
          <div class="d-flex align-items-start mb-4">
            <a href="javascript:void(0);" class="avatar flex-shrink-0">
              <img
                src="@/assets/img/users/user-29.jpg"
                class="rounded-circle border border-2"
                alt="img"
              />
            </a>
            <div class="ms-2">
              <h6 class="fs-14 fw-medium text-truncate mb-1">
                Lex Murphy requested access to UNIX
              </h6>
              <p class="fs-13 mb-2">Today at 10:50 AM</p>
              <div class="d-flex align-items-center">
                <a href="javascript:void(0);" class="btn btn-primary btn-sm me-2">Approve</a>
                <a href="javascript:void(0);" class="btn btn-outline-primary btn-sm">Decline</a>
              </div>
            </div>
          </div>
          <div class="d-flex align-items-start">
            <a href="javascript:void(0);" class="avatar flex-shrink-0">
              <img
                src="@/assets/img/users/user-33.jpg"
                class="rounded-circle border border-2"
                alt="img"
              />
            </a>
            <div class="ms-2">
              <h6 class="fs-14 fw-medium text-truncate mb-1">
                Lex Murphy requested access to UNIX
              </h6>
              <p class="fs-13 mb-0">Today at 05:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
