<template>
  <div class="row">
    <div class="col-xl-8 d-flex">
      <div class="card flex-fill">
        <div
          class="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-2"
        >
          <h5>Recent Deals</h5>
          <div class="d-flex align-items-center">
            <div>
              <router-link to="/crm/deals-list" class="btn btn-sm btn-light px-3"
                >View All</router-link
              >
            </div>
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-nowrap dashboard-table mb-0">
              <thead>
                <tr>
                  <th>Deal Name</th>
                  <th>Stage</th>
                  <th>Deal Value</th>
                  <th>Owner</th>
                  <th>Closed Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <h6 class="fw-medium">
                      <router-link to="/crm/deals-details">Collins</router-link>
                    </h6>
                  </td>
                  <td>Quality To Buy</td>
                  <td>$4,50,000</td>
                  <td>
                    <div class="d-flex align-items-center">
                      <a
                        href="javascript:void(0);"
                        class="avatar avatar-rounded flex-shrink-0 me-2"
                      >
                        <img src="@/assets/img/users/user-32.jpg" alt="Img" />
                      </a>
                      <h6 class="fw-medium">
                        <a href="javascript:void(0);">Anthony Lewis</a>
                      </h6>
                    </div>
                  </td>
                  <td>14 Jan 2024</td>
                </tr>
                <tr>
                  <td>
                    <h6 class="fw-medium">
                      <router-link to="/crm/deals-details">Konopelski</router-link>
                    </h6>
                  </td>
                  <td>Proposal Made</td>
                  <td>$3,15,000</td>
                  <td>
                    <div class="d-flex align-items-center">
                      <a
                        href="javascript:void(0);"
                        class="avatar avatar-rounded flex-shrink-0 me-2"
                      >
                        <img src="@/assets/img/users/user-09.jpg" alt="Img" />
                      </a>
                      <h6 class="fw-medium">
                        <a href="javascript:void(0);">Brian Villalobos</a>
                      </h6>
                    </div>
                  </td>
                  <td>21 Jan 2024</td>
                </tr>
                <tr>
                  <td>
                    <h6 class="fw-medium">
                      <router-link to="/crm/deals-details">Adams</router-link>
                    </h6>
                  </td>
                  <td>Contact Made</td>
                  <td>$8,40,000</td>
                  <td>
                    <div class="d-flex align-items-center">
                      <a
                        href="javascript:void(0);"
                        class="avatar avatar-rounded flex-shrink-0 me-2"
                      >
                        <img src="@/assets/img/users/user-01.jpg" alt="Img" />
                      </a>
                      <h6 class="fw-medium">
                        <a href="javascript:void(0);">Harvey Smith</a>
                      </h6>
                    </div>
                  </td>
                  <td>20 Feb 2024</td>
                </tr>
                <tr>
                  <td>
                    <h6 class="fw-medium">
                      <router-link to="/crm/deals-details">Schumm</router-link>
                    </h6>
                  </td>
                  <td>Quality To Buy</td>
                  <td>$6,10,000</td>
                  <td>
                    <div class="d-flex align-items-center">
                      <a
                        href="javascript:void(0);"
                        class="avatar avatar-rounded flex-shrink-0 me-2"
                      >
                        <img src="@/assets/img/users/user-33.jpg" alt="Img" />
                      </a>
                      <h6 class="fw-medium">
                        <a href="javascript:void(0);">Stephan Peralt</a>
                      </h6>
                    </div>
                  </td>
                  <td>15 Mar 2024</td>
                </tr>
                <tr>
                  <td>
                    <h6 class="fw-medium">
                      <router-link to="/crm/deals-details">Wisozk</router-link>
                    </h6>
                  </td>
                  <td>Presentation</td>
                  <td>$4,70,000</td>
                  <td>
                    <div class="d-flex align-items-center">
                      <a
                        href="javascript:void(0);"
                        class="avatar avatar-rounded flex-shrink-0 me-2"
                      >
                        <img src="@/assets/img/users/user-34.jpg" alt="Img" />
                      </a>
                      <h6 class="fw-medium">
                        <a href="javascript:void(0);">Doglas Martini</a>
                      </h6>
                    </div>
                  </td>
                  <td>12 Apr2024</td>
                </tr>
              </tbody>
            </table>
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
              <i class="ti ti-phone-filled fs-16"></i>
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
              <i class="ti ti-message-circle-2-filled fs-16"></i>
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
              <i class="ti ti-phone-filled fs-16"></i>
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
              <i class="ti ti-user-circle fs-16"></i>
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
  </div>
</template>
