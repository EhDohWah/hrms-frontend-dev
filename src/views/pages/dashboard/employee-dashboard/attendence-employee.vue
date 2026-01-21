<template>
  <div class="row">
    <div class="col-xl-4 d-flex">
      <div class="card flex-fill border-primary attendance-bg">
        <div class="card-body">
          <div class="mb-4 text-center">
            <h6 class="fw-medium text-gray-5 mb-1">Attendance</h6>
            <h4>08:35 AM, 11 Mar 2025</h4>
          </div>
          <div
            class="attendance-circle-progress attendance-progress mx-auto mb-3"
            data-value="65"
          >
            <circle-progress :percent="65" />
            <span class="progress-left">
              <span class="progress-bar border-success"></span>
            </span>
            <span class="progress-right">
              <span class="progress-bar border-success"></span>
            </span>
            <div class="total-work-hours text-center w-100">
              <span class="fs-13 d-block mb-1">Total Hours</span>
              <h6>5:45:32</h6>
            </div>
          </div>
          <div class="text-center">
            <div class="badge badge-dark badge-md mb-3">Production : 3.45 hrs</div>
            <h6 class="fw-medium d-flex align-items-center justify-content-center mb-4">
              <i class="ti ti-fingerprint text-primary me-1"></i>
              Punch In at 10.00 AM
            </h6>
            <a href="javascript:void(0);" class="btn btn-primary w-100">Punch Out</a>
          </div>
        </div>
      </div>
    </div>
    <div class="col-xl-8 d-flex">
      <div class="row flex-fill">
        <div class="col-xl-3 col-md-6">
          <div class="card">
            <div class="card-body">
              <div class="border-bottom mb-3 pb-2">
                <span class="avatar avatar-sm bg-primary mb-2"
                  ><i class="ti ti-clock-stop"></i
                ></span>
                <h2 class="mb-2">8.36 / <span class="fs-20 text-gray-5"> 9</span></h2>
                <p class="fw-medium text-truncate">Total Hours Today</p>
              </div>
              <div>
                <p class="d-flex align-items-center fs-13">
                  <span
                    class="avatar avatar-xs rounded-circle bg-success flex-shrink-0 me-2"
                  >
                    <i class="ti ti-arrow-up fs-12"></i>
                  </span>
                  <span>5% This Week</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="card">
            <div class="card-body">
              <div class="border-bottom mb-3 pb-2">
                <span class="avatar avatar-sm bg-dark mb-2"
                  ><i class="ti ti-clock-up"></i
                ></span>
                <h2 class="mb-2">10 / <span class="fs-20 text-gray-5"> 40</span></h2>
                <p class="fw-medium text-truncate">Total Hours Week</p>
              </div>
              <div>
                <p class="d-flex align-items-center fs-13">
                  <span
                    class="avatar avatar-xs rounded-circle bg-success flex-shrink-0 me-2"
                  >
                    <i class="ti ti-arrow-up fs-12"></i>
                  </span>
                  <span>7% Last Week</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="card">
            <div class="card-body">
              <div class="border-bottom mb-3 pb-2">
                <span class="avatar avatar-sm bg-info mb-2"
                  ><i class="ti ti-calendar-up"></i
                ></span>
                <h2 class="mb-2">75 / <span class="fs-20 text-gray-5"> 98</span></h2>
                <p class="fw-medium text-truncate">Total Hours Month</p>
              </div>
              <div>
                <p class="d-flex align-items-center fs-13 text-truncate">
                  <span
                    class="avatar avatar-xs rounded-circle bg-danger flex-shrink-0 me-2"
                  >
                    <i class="ti ti-arrow-down fs-12"></i>
                  </span>
                  <span>8% Last Month</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="card">
            <div class="card-body">
              <div class="border-bottom mb-3 pb-2">
                <span class="avatar avatar-sm bg-pink mb-2"
                  ><i class="ti ti-calendar-star"></i
                ></span>
                <h2 class="mb-2">16 / <span class="fs-20 text-gray-5"> 28</span></h2>
                <p class="fw-medium text-truncate">Overtime this Month</p>
              </div>
              <div>
                <p class="d-flex align-items-center fs-13 text-truncate">
                  <span
                    class="avatar avatar-xs rounded-circle bg-danger flex-shrink-0 me-2"
                  >
                    <i class="ti ti-arrow-down fs-12"></i>
                  </span>
                  <span>6% Last Month</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-12">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col-xl-3">
                  <div class="mb-4">
                    <p class="d-flex align-items-center mb-1">
                      <i class="ti ti-point-filled text-dark-transparent me-1"></i>Total
                      Working hours
                    </p>
                    <h3>12h 36m</h3>
                  </div>
                </div>
                <div class="col-xl-3">
                  <div class="mb-4">
                    <p class="d-flex align-items-center mb-1">
                      <i class="ti ti-point-filled text-success me-1"></i>Productive Hours
                    </p>
                    <h3>08h 36m</h3>
                  </div>
                </div>
                <div class="col-xl-3">
                  <div class="mb-4">
                    <p class="d-flex align-items-center mb-1">
                      <i class="ti ti-point-filled text-warning me-1"></i>Break hours
                    </p>
                    <h3>22m 15s</h3>
                  </div>
                </div>
                <div class="col-xl-3">
                  <div class="mb-4">
                    <p class="d-flex align-items-center mb-1">
                      <i class="ti ti-point-filled text-info me-1"></i>Overtime
                    </p>
                    <h3>02h 15m</h3>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="progress bg-transparent-dark mb-3" style="height: 24px">
                    <div
                      class="progress-bar bg-white rounded"
                      role="progressbar"
                      style="width: 18%"
                    ></div>
                    <div
                      class="progress-bar bg-success rounded me-2"
                      role="progressbar"
                      style="width: 18%"
                    ></div>
                    <div
                      class="progress-bar bg-warning rounded me-2"
                      role="progressbar"
                      style="width: 5%"
                    ></div>
                    <div
                      class="progress-bar bg-success rounded me-2"
                      role="progressbar"
                      style="width: 28%"
                    ></div>
                    <div
                      class="progress-bar bg-warning rounded me-2"
                      role="progressbar"
                      style="width: 17%"
                    ></div>
                    <div
                      class="progress-bar bg-success rounded me-2"
                      role="progressbar"
                      style="width: 22%"
                    ></div>
                    <div
                      class="progress-bar bg-warning rounded me-2"
                      role="progressbar"
                      style="width: 5%"
                    ></div>
                    <div
                      class="progress-bar bg-info rounded me-2"
                      role="progressbar"
                      style="width: 3%"
                    ></div>
                    <div
                      class="progress-bar bg-info rounded"
                      role="progressbar"
                      style="width: 2%"
                    ></div>
                    <div
                      class="progress-bar bg-white rounded"
                      role="progressbar"
                      style="width: 18%"
                    ></div>
                  </div>
                </div>
                <div class="co-md-12">
                  <div
                    class="d-flex align-items-center justify-content-between flex-wrap row-gap-2"
                  >
                    <span class="fs-10">06:00</span>
                    <span class="fs-10">07:00</span>
                    <span class="fs-10">08:00</span>
                    <span class="fs-10">09:00</span>
                    <span class="fs-10">10:00</span>
                    <span class="fs-10">11:00</span>
                    <span class="fs-10">12:00</span>
                    <span class="fs-10">01:00</span>
                    <span class="fs-10">02:00</span>
                    <span class="fs-10">03:00</span>
                    <span class="fs-10">04:00</span>
                    <span class="fs-10">05:00</span>
                    <span class="fs-10">06:00</span>
                    <span class="fs-10">07:00</span>
                    <span class="fs-10">08:00</span>
                    <span class="fs-10">09:00</span>
                    <span class="fs-10">10:00</span>
                    <span class="fs-10">11:00</span>
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
