<template>
  <div class="sidebar-contact">
    <!-- <div class="toggle-theme" data-bs-toggle="offcanvas" data-bs-target="#theme-setting">
      <i class="fa fa-cog fa-w-16 fa-spin"></i>
    </div> -->
  </div>
  <div class="sidebar-themesettings offcanvas offcanvas-end" id="theme-setting">
    <div class="offcanvas-header d-flex align-items-center justify-content-between bg-dark">
      <div>
        <h3 class="mb-1 text-white">Theme Customizer</h3>
        <p class="text-light">Choose your themes & layouts etc.</p>
      </div>
      <a href="javascript:void(0);" class="custom-btn-close d-flex align-items-center justify-content-center text-white"
        data-bs-dismiss="offcanvas"><i class="ti ti-x"></i></a>
    </div>
    <div class="themesettings-inner offcanvas-body">
      <div class="accordion accordion-customicon1 accordions-items-seperate" id="settingtheme">
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button text-dark fs-16" type="button" data-bs-toggle="collapse"
              data-bs-target="#layoutsetting" aria-expanded="true" aria-controls="collapsecustomicon1One">
              Select Layouts
            </button>
          </h2>
          <div id="layoutsetting" class="accordion-collapse collapse show">
            <div class="accordion-body">
              <div class="row gx-3">
                <div class="col-4">
                  <div class="theme-layout mb-3">
                    <input type="radio" name="LayoutTheme" id="defaultLayout" value="default" checked />
                    <label for="defaultLayout">
                      <span class="d-block mb-2 layout-img">
                        <img src="@/assets/img/theme/default.svg" alt="img" />
                      </span>
                      <span class="layout-type">Default</span>
                    </label>
                  </div>
                </div>
                <div class="col-4">
                  <div class="theme-layout mb-3">
                    <input type="radio" name="LayoutTheme" id="miniLayout" value="mini" />
                    <label for="miniLayout">
                      <span class="d-block mb-2 layout-img">
                        <img src="@/assets/img/theme/mini.svg" alt="img" />
                      </span>
                      <span class="layout-type">Mini</span>
                    </label>
                  </div>
                </div>
                <div class="col-4">
                  <div class="theme-layout mb-3">
                    <input type="radio" name="LayoutTheme" id="horizontalLayout" value="horizontal" />
                    <label for="horizontalLayout">
                      <span class="d-block mb-2 layout-img">
                        <img src="@/assets/img/theme/horizontal.svg" alt="img" />
                      </span>
                      <span class="layout-type">Horizontal</span>
                    </label>
                  </div>
                </div>
                <div class="col-4">
                  <div class="theme-layout mb-3">
                    <input type="radio" name="LayoutTheme" id="horizontal-singleLayout" value="horizontal-single" />
                    <label for="horizontal-singleLayout">
                      <span class="d-block mb-2 layout-img">
                        <img src="@/assets/img/theme/horizontal-single.svg" alt="img" />
                      </span>
                      <span class="layout-type">Horizontal Single</span>
                    </label>
                  </div>
                </div>
                <div class="col-4">
                  <div class="theme-layout mb-3">
                    <input type="radio" name="LayoutTheme" id="detachedLayout" value="detached" />
                    <label for="detachedLayout">
                      <span class="d-block mb-2 layout-img">
                        <img src="@/assets/img/theme/horizontal-single.svg" alt="img" />
                      </span>
                      <span class="layout-type">Detached</span>
                    </label>
                  </div>
                </div>
                <div class="col-4">
                  <div class="theme-layout mb-3">
                    <input type="radio" name="LayoutTheme" id="twocolumnLayout" value="twocolumn" />
                    <label for="twocolumnLayout">
                      <span class="d-block mb-2 layout-img">
                        <img src="@/assets/img/theme/two-column.svg" alt="img" />
                      </span>
                      <span class="layout-type">Two Column</span>
                    </label>
                  </div>
                </div>
                <div class="col-4">
                  <div class="theme-layout mb-3">
                    <input type="radio" name="LayoutTheme" id="without-headerLayout" value="without-header" />
                    <label for="without-headerLayout">
                      <span class="d-block mb-2 layout-img">
                        <img src="@/assets/img/theme/without-header.svg" alt="img" />
                      </span>
                      <span class="layout-type">Without Header</span>
                    </label>
                  </div>
                </div>
                <div class="col-4">
                  <div class="theme-layout mb-3">
                    <input type="radio" name="LayoutTheme" id="horizontal-overlayLayout" value="horizontal-overlay" />
                    <label for="horizontal-overlayLayout">
                      <span class="d-block mb-2 layout-img">
                        <img src="@/assets/img/theme/overlay.svg" alt="img" />
                      </span>
                      <span class="layout-type">Overlay</span>
                    </label>
                  </div>
                </div>
                <div class="col-4">
                  <div class="theme-layout mb-3">
                    <input type="radio" name="LayoutTheme" id="horizontal-sidemenuLayout" value="horizontal-sidemenu" />
                    <label for="horizontal-sidemenuLayout">
                      <span class="d-block mb-2 layout-img">
                        <img src="@/assets/img/theme/menu-aside.svg" alt="img" />
                      </span>
                      <span class="layout-type">Menu Aside</span>
                    </label>
                  </div>
                </div>
                <div class="col-4">
                  <div class="theme-layout mb-3">
                    <input type="radio" name="LayoutTheme" id="stackedLayout" value="stacked" />
                    <label for="stackedLayout">
                      <span class="d-block mb-2 layout-img">
                        <img src="@/assets/img/theme/stacked.svg" alt="img" />
                      </span>
                      <span class="layout-type">Menu Stacked</span>
                    </label>
                  </div>
                </div>
                <div class="col-4">
                  <div class="theme-layout mb-3">
                    <input type="radio" name="LayoutTheme" id="modernLayout" value="modern" />
                    <label for="modernLayout">
                      <span class="d-block mb-2 layout-img">
                        <img src="@/assets/img/theme/modern.svg" alt="img" />
                      </span>
                      <span class="layout-type">Modern</span>
                    </label>
                  </div>
                </div>
                <div class="col-4">
                  <div class="theme-layout mb-3">
                    <input type="radio" name="LayoutTheme" id="transparentLayout" value="transparent" />
                    <label for="transparentLayout">
                      <span class="d-block mb-2 layout-img">
                        <img src="@/assets/img/theme/transparent.svg" alt="img" />
                      </span>
                      <span class="layout-type">Transparent</span>
                    </label>
                  </div>
                </div>
                <div class="col-4">
                  <router-link to="/layouts/layout-rtl" class="theme-layout mb-3">
                    <span class="d-block mb-2 layout-img">
                      <img src="@/assets/img/theme/rtl.svg" alt="img" />
                    </span>
                    <span class="layout-type">RTL</span>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button text-dark fs-16" type="button" data-bs-toggle="collapse"
              data-bs-target="#sidebarsetting" aria-expanded="true">
              Layout Width
            </button>
          </h2>
          <div id="sidebarsetting" class="accordion-collapse collapse show">
            <div class="accordion-body">
              <div class="d-flex align-items-center">
                <div class="theme-width m-1 me-2">
                  <input type="radio" name="width" id="fluidWidth" value="fluid" checked />
                  <label for="fluidWidth" class="d-block rounded fs-12">Fluid Layout
                  </label>
                </div>
                <div class="theme-width m-1">
                  <input type="radio" name="width" id="boxWidth" value="box" />
                  <label for="boxWidth" class="d-block rounded fs-12">Boxed Layout
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button text-dark fs-16" type="button" data-bs-toggle="collapse"
              data-bs-target="#cardsetting" aria-expanded="true" aria-controls="collapsecustomicon1One">
              Card Layout
            </button>
          </h2>
          <div id="cardsetting" class="accordion-collapse collapse show">
            <div class="accordion-body pb-0">
              <div class="row gx-3">
                <div class="col-4">
                  <div class="theme-layout mb-3">
                    <input type="radio" name="card" id="borderedCard" value="bordered" checked />
                    <label for="borderedCard">
                      <span class="d-block mb-2 layout-img">
                        <img src="@/assets/img/theme/bordered.svg" alt="img" />
                      </span>
                      <span class="layout-type">Bordered</span>
                    </label>
                  </div>
                </div>
                <div class="col-4">
                  <div class="theme-layout mb-3">
                    <input type="radio" name="card" id="borderlessCard" value="borderless" />
                    <label for="borderlessCard">
                      <span class="d-block mb-2 layout-img">
                        <img src="@/assets/img/theme/borderless.svg" alt="img" />
                      </span>
                      <span class="layout-type">Borderless</span>
                    </label>
                  </div>
                </div>
                <div class="col-4">
                  <div class="theme-layout mb-3">
                    <input type="radio" name="card" id="shadowCard" value="shadow" />
                    <label for="shadowCard">
                      <span class="d-block mb-2 layout-img">
                        <img src="@/assets/img/theme/shadow.svg" alt="img" />
                      </span>
                      <span class="layout-type">Only Shadow</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button text-dark fs-16" type="button" data-bs-toggle="collapse"
              data-bs-target="#sidebarsetting" aria-expanded="true">
              Sidebar Color
            </button>
          </h2>
          <div id="sidebarsetting" class="accordion-collapse collapse show">
            <div class="accordion-body">
              <div class="d-flex align-items-center">
                <div class="theme-colorselect m-1 me-2">
                  <input type="radio" name="sidebar" id="lightSidebar" value="light" checked />
                  <label for="lightSidebar" class="d-block rounded mb-2"> </label>
                </div>
                <div class="theme-colorselect m-1 me-2">
                  <input type="radio" name="sidebar" id="darkgreenSidebar" value="darkgreen" />
                  <label for="darkgreenSidebar" class="d-block rounded bg-darkgreen mb-2">
                  </label>
                </div>
                <div class="theme-colorselect m-1 me-2">
                  <input type="radio" name="sidebar" id="nightblueSidebar" value="nightblue" />
                  <label for="nightblueSidebar" class="d-block rounded bg-nightblue mb-2">
                  </label>
                </div>
                <div class="theme-colorselect m-1 me-2">
                  <input type="radio" name="sidebar" id="darkgraySidebar" value="darkgray" />
                  <label for="darkgraySidebar" class="d-block rounded bg-darkgray mb-2">
                  </label>
                </div>
                <div class="theme-colorselect m-1 me-2">
                  <input type="radio" name="sidebar" id="royalblueSidebar" value="royalblue" />
                  <label for="royalblueSidebar" class="d-block rounded bg-royalblue mb-2">
                  </label>
                </div>
                <div class="theme-colorselect m-1 me-2">
                  <input type="radio" name="sidebar" id="indigoSidebar" value="indigo" />
                  <label for="indigoSidebar" class="d-block rounded bg-indigo mb-2">
                  </label>
                </div>
                <div class="theme-colorselect m-1 mt-0">
                  <div class="theme-container-background"></div>
                  <div class="pickr-container-background"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button text-dark fs-16" type="button" data-bs-toggle="collapse"
              data-bs-target="#modesetting" aria-expanded="true">
              Color Mode
            </button>
          </h2>
          <div id="modesetting" class="accordion-collapse collapse show">
            <div class="accordion-body">
              <div class="row gx-3">
                <div class="col-6">
                  <div class="theme-mode">
                    <input type="radio" name="theme" id="lightTheme" value="light" checked />
                    <label for="lightTheme" class="p-2 rounded fw-medium w-100">
                      <span class="avatar avatar-md d-inline-flex rounded me-2"><i
                          class="ti ti-sun-filled"></i></span>Light Mode
                    </label>
                  </div>
                </div>
                <div class="col-6">
                  <div class="theme-mode">
                    <input type="radio" name="theme" id="darkTheme" value="dark" />
                    <label for="darkTheme" class="p-2 rounded fw-medium w-100">
                      <span class="avatar avatar-md d-inline-flex rounded me-2"><i
                          class="ti ti-moon-filled"></i></span>Dark Mode
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button text-dark fs-16" type="button" data-bs-toggle="collapse"
              data-bs-target="#sizesetting" aria-expanded="true" aria-controls="collapsecustomicon1One">
              Sidebar Size
            </button>
          </h2>
          <div id="sizesetting" class="accordion-collapse collapse show">
            <div class="accordion-body pb-0">
              <div class="row gx-3">
                <div class="col-4">
                  <div class="theme-layout mb-3">
                    <input type="radio" name="size" id="defaultSize" value="default" checked />
                    <label for="defaultSize">
                      <span class="d-block mb-2 layout-img">
                        <img src="@/assets/img/theme/default.svg" alt="img" />
                      </span>
                      <span class="layout-type">Default</span>
                    </label>
                  </div>
                </div>
                <div class="col-4">
                  <div class="theme-layout mb-3">
                    <input type="radio" name="size" id="compactSize" value="compact" />
                    <label for="compactSize">
                      <span class="d-block mb-2 layout-img">
                        <img src="@/assets/img/theme/compact.svg" alt="img" />
                      </span>
                      <span class="layout-type">Compact</span>
                    </label>
                  </div>
                </div>
                <div class="col-4">
                  <div class="theme-layout mb-3">
                    <input type="radio" name="size" id="hoverviewSize" value="hoverview" />
                    <label for="hoverviewSize">
                      <span class="d-block mb-2 layout-img">
                        <img src="@/assets/img/theme/hoverview.svg" alt="img" />
                      </span>
                      <span class="layout-type">Hover View</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button text-dark fs-16" type="button" data-bs-toggle="collapse"
              data-bs-target="#colorsetting" aria-expanded="true">
              Top Bar Color
            </button>
          </h2>
          <div id="colorsetting" class="accordion-collapse collapse show">
            <div class="accordion-body pb-1">
              <div class="d-flex align-items-center flex-wrap">
                <div class="theme-colorselect mb-3 me-3">
                  <input type="radio" name="topbar" id="whiteTopbar" value="white" checked />
                  <label for="whiteTopbar" class="white-topbar"></label>
                </div>
                <div class="theme-colorselect mb-3 me-3">
                  <input type="radio" name="topbar" id="darkaquaTopbar" value="darkaqua" />
                  <label for="darkaquaTopbar" class="darkaqua-topbar"></label>
                </div>
                <div class="theme-colorselect mb-3 me-3">
                  <input type="radio" name="topbar" id="whiterockTopbar" value="whiterock" />
                  <label for="whiterockTopbar" class="whiterock-topbar"></label>
                </div>
                <div class="theme-colorselect mb-3 me-3">
                  <input type="radio" name="topbar" id="rockblueTopbar" value="rockblue" />
                  <label for="rockblueTopbar" class="rockblue-topbar"></label>
                </div>
                <div class="theme-colorselect mb-3 me-3">
                  <input type="radio" name="topbar" id="bluehazeTopbar" value="bluehaze" />
                  <label for="bluehazeTopbar" class="bluehaze-topbar"></label>
                </div>
                <div class="theme-colorselect mb-3 me-3">
                  <input type="radio" name="topbar" id="orangeGradientTopbar" value="orangegradient" />
                  <label for="orangeGradientTopbar" class="orange-gradient-topbar"></label>
                </div>
                <div class="theme-colorselect mb-3 me-3">
                  <input type="radio" name="topbar" id="purpleGradientTopbar" value="purplegradient" />
                  <label for="purpleGradientTopbar" class="purple-gradient-topbar"></label>
                </div>
                <div class="theme-colorselect mb-3 me-3">
                  <input type="radio" name="topbar" id="blueGradientTopbar" value="bluegradient" />
                  <label for="blueGradientTopbar" class="blue-gradient-topbar"></label>
                </div>
                <div class="theme-colorselect mb-3 me-3">
                  <input type="radio" name="topbar" id="maroonGradientTopbar" value="maroongradient" />
                  <label for="maroonGradientTopbar" class="maroon-gradient-topbar"></label>
                </div>
                <div class="theme-colorselect mb-3 mt-0">
                  <div class="theme-topbar"></div>
                  <div class="pickr-topbar"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button text-dark fs-16" type="button" data-bs-toggle="collapse"
              data-bs-target="#topcolorsetting" aria-expanded="true">
              Top Bar Background
            </button>
          </h2>
          <div id="topcolorsetting" class="accordion-collapse collapse show">
            <div class="accordion-body">
              <h6 class="mb-1 fw-medium">Pattern</h6>
              <div class="d-flex align-items-center">
                <div class="theme-topbarbg me-3 mb-2">
                  <input type="radio" name="topbarbg" id="pattern1" value="pattern1" checked />
                  <label for="pattern1" class="d-block rounded">
                    <img src="@/assets/img/theme/pattern-01.svg" alt="img" class="rounded" />
                  </label>
                </div>
                <div class="theme-topbarbg me-3 mb-2">
                  <input type="radio" name="topbarbg" id="pattern2" value="pattern2" />
                  <label for="pattern2" class="d-block rounded">
                    <img src="@/assets/img/theme/pattern-02.svg" alt="img" class="rounded" />
                  </label>
                </div>
                <div class="theme-topbarbg me-3 mb-2">
                  <input type="radio" name="topbarbg" id="pattern3" value="pattern3" />
                  <label for="pattern3" class="d-block rounded">
                    <img src="@/assets/img/theme/pattern-03.svg" alt="img" class="rounded" />
                  </label>
                </div>
              </div>
              <h6 class="mb-1 fw-medium">Colors</h6>
              <div class="d-flex align-items-center">
                <div class="theme-colorselect m-1 me-3">
                  <input type="radio" name="topbarcolor" id="whiteTopbarcolor" value="white" checked />
                  <label for="whiteTopbarcolor" class="white-topbar"></label>
                </div>
                <div class="theme-colorselect m-1 me-3">
                  <input type="radio" name="topbarcolor" id="primaryTopbarcolor" value="primary" />
                  <label for="primaryTopbarcolor" class="primary-topbar"></label>
                </div>
                <div class="theme-colorselect m-1 me-3">
                  <input type="radio" name="topbarcolor" id="blackpearlTopbarcolor" value="blackpearl" />
                  <label for="blackpearlTopbarcolor" class="blackpearl-topbar"></label>
                </div>
                <div class="theme-colorselect m-1 me-3">
                  <input type="radio" name="topbarcolor" id="maroonTopbarcolor" value="maroon" />
                  <label for="maroonTopbarcolor" class="maroon-topbar"></label>
                </div>
                <div class="theme-colorselect m-1 me-3">
                  <input type="radio" name="topbarcolor" id="bluegemTopbarcolor" value="bluegem" />
                  <label for="bluegemTopbarcolor" class="bluegem-topbar"></label>
                </div>
                <div class="theme-colorselect m-1 me-3">
                  <input type="radio" name="topbarcolor" id="fireflyTopbarcolor" value="firefly" />
                  <label for="fireflyTopbarcolor" class="firefly-topbar"></label>
                </div>
                <div class="theme-colorselect m-1 mt-0">
                  <div class="theme-topbarcolor"></div>
                  <div class="pickr-topbarcolor"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button text-dark fs-16" type="button" data-bs-toggle="collapse"
              data-bs-target="#sidebarbgsetting" aria-expanded="true">
              Sidebar Background
            </button>
          </h2>
          <div id="sidebarbgsetting" class="accordion-collapse collapse show">
            <div class="accordion-body pb-1">
              <div class="d-flex align-items-center flex-wrap">
                <div class="theme-sidebarbg me-3 mb-3">
                  <input type="radio" name="sidebarbg" id="sidebarBg1" value="sidebarbg1" />
                  <label for="sidebarBg1" class="d-block rounded">
                    <img src="@/assets/img/theme/sidebar-bg-01.svg" alt="img" class="rounded" />
                  </label>
                </div>
                <div class="theme-sidebarbg me-3 mb-3">
                  <input type="radio" name="sidebarbg" id="sidebarBg2" value="sidebarbg2" />
                  <label for="sidebarBg2" class="d-block rounded">
                    <img src="@/assets/img/theme/sidebar-bg-02.svg" alt="img" class="rounded" />
                  </label>
                </div>
                <div class="theme-sidebarbg me-3 mb-3">
                  <input type="radio" name="sidebarbg" id="sidebarBg3" value="sidebarbg3" />
                  <label for="sidebarBg3" class="d-block rounded">
                    <img src="@/assets/img/theme/sidebar-bg-03.svg" alt="img" class="rounded" />
                  </label>
                </div>
                <div class="theme-sidebarbg me-3 mb-3">
                  <input type="radio" name="sidebarbg" id="sidebarBg4" value="sidebarbg4" />
                  <label for="sidebarBg4" class="d-block rounded">
                    <img src="@/assets/img/theme/sidebar-bg-04.svg" alt="img" class="rounded" />
                  </label>
                </div>
                <div class="theme-sidebarbg me-3 mb-3">
                  <input type="radio" name="sidebarbg" id="sidebarBg5" value="sidebarbg5" />
                  <label for="sidebarBg5" class="d-block rounded">
                    <img src="@/assets/img/theme/sidebar-bg-05.svg" alt="img" class="rounded" />
                  </label>
                </div>
                <div class="theme-sidebarbg me-3 mb-3">
                  <input type="radio" name="sidebarbg" id="sidebarBg6" value="sidebarbg6" />
                  <label for="sidebarBg6" class="d-block rounded">
                    <img src="@/assets/img/theme/sidebar-bg-06.svg" alt="img" class="rounded" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button text-dark fs-16" type="button" data-bs-toggle="collapse"
              data-bs-target="#sidebarcolor" aria-expanded="true">
              Theme Colors
            </button>
          </h2>
          <div id="sidebarcolor" class="accordion-collapse collapse show">
            <div class="accordion-body pb-2">
              <div class="d-flex align-items-center flex-wrap">
                <div class="theme-colorsset me-2 mb-2">
                  <input type="radio" name="color" id="primaryColor" value="primary" checked />
                  <label for="primaryColor" class="primary-clr"></label>
                </div>
                <div class="theme-colorsset me-2 mb-2">
                  <input type="radio" name="color" id="brightblueColor" value="brightblue" />
                  <label for="brightblueColor" class="brightblue-clr"></label>
                </div>
                <div class="theme-colorsset me-2 mb-2">
                  <input type="radio" name="color" id="lunargreenColor" value="lunargreen" />
                  <label for="lunargreenColor" class="lunargreen-clr"></label>
                </div>
                <div class="theme-colorsset me-2 mb-2">
                  <input type="radio" name="color" id="lavendarColor" value="lavendar" />
                  <label for="lavendarColor" class="lavendar-clr"></label>
                </div>
                <div class="theme-colorsset me-2 mb-2">
                  <input type="radio" name="color" id="magentaColor" value="magenta" />
                  <label for="magentaColor" class="magenta-clr"></label>
                </div>
                <div class="theme-colorsset me-2 mb-2">
                  <input type="radio" name="color" id="chromeyellowColor" value="chromeyellow" />
                  <label for="chromeyellowColor" class="chromeyellow-clr"></label>
                </div>
                <div class="theme-colorsset me-2 mb-2">
                  <input type="radio" name="color" id="lavaredColor" value="lavared" />
                  <label for="lavaredColor" class="lavared-clr"></label>
                </div>
                <div class="theme-colorsset mb-2">
                  <div class="pickr-container-primary" onchange="updateChartColor(this.value)"></div>
                  <div class="theme-container-primary"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button text-dark fs-16" type="button" data-bs-toggle="collapse"
              data-bs-target="#loadersetting" aria-expanded="true">
              Preloader
            </button>
          </h2>
          <div id="loadersetting" class="accordion-collapse collapse show">
            <div class="accordion-body">
              <div class="d-flex align-items-center">
                <div class="theme-width me-2">
                  <input type="radio" name="loader" id="enableLoader" value="enable" checked />
                  <label for="enableLoader" class="d-block rounded fs-12">With Preloader
                  </label>
                </div>
                <div class="theme-width">
                  <input type="radio" name="loader" id="disableLoader" value="disable" />
                  <label for="disableLoader" class="d-block rounded fs-12">Without Preloader
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-3 pt-0">
      <div class="row gx-3">
        <div class="col-6">
          <a href="javascript:void(0);" id="resetbutton" class="btn btn-light close-theme w-100"><i
              class="ti ti-restore me-1"></i>Reset</a>
        </div>
        <div class="col-6">
          <a href="javascript:void(0);" class="btn btn-primary w-100" data-bs-dismiss="offcanvas"><i
              class="ti ti-shopping-cart-plus me-1"></i>Buy Product</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import "@simonwep/pickr/dist/themes/classic.min.css"; // 'classic' theme
import "@simonwep/pickr/dist/themes/monolith.min.css"; // 'monolith' theme
import "@simonwep/pickr/dist/themes/nano.min.css";
import Pickr from "@simonwep/pickr";
export default {
  data() {
    return {};
  },
  mounted() {
    document
      .querySelector("html")
      .setAttribute("data-theme", localStorage.getItem("theme") || "light");
    document
      .querySelector("html")
      .setAttribute("data-sidebar", localStorage.getItem("sidebarTheme") || "light");
    document
      .querySelector("html")
      .setAttribute("data-color", localStorage.getItem("color") || "primary");
    document
      .querySelector("html")
      .setAttribute("data-topbar", localStorage.getItem("topbar") || "white");
    document
      .querySelector("html")
      .setAttribute("data-layout", localStorage.getItem("layout") || "default");
    document
      .querySelector("html")
      .setAttribute("data-topbarcolor", localStorage.getItem("topbarcolor") || "white");
    document
      .querySelector("html")
      .setAttribute("data-card", localStorage.getItem("card") || "bordered");
    document
      .querySelector("html")
      .setAttribute("data-size", localStorage.getItem("size") || "default");
    document
      .querySelector("html")
      .setAttribute("data-width", localStorage.getItem("width") || "fluid");
    document
      .querySelector("html")
      .setAttribute("data-loader", localStorage.getItem("loader") || "enable");

    const pickrContainerPrimary = document.querySelector(".pickr-container-primary");
    const themeContainerPrimary = document.querySelector(".theme-container-primary");
    const pickrContainerBackground = document.querySelector(
      ".pickr-container-background"
    );
    const themeContainerBackground = document.querySelector(
      ".theme-container-background"
    );
    const pickrtopbar = document.querySelector(".pickr-topbar");
    const themetopbar = document.querySelector(".theme-topbar");
    const pickrtopbarcolor = document.querySelector(".pickr-topbarcolor");
    const themetopbarcolor = document.querySelector(".theme-topbarcolor");

    /* for theme primary */
    const nanoThemes = [
      [
        "nano",
        {
          defaultRepresentation: "RGB",
          components: {
            preview: true,
            opacity: false,
            hue: true,

            interaction: {
              hex: false,
              rgba: true,
              hsva: false,
              input: true,
              clear: false,
              save: false,
            },
          },
        },
      ],
    ];
    const nanoButtons = [];
    let nanoPickr = null;
    for (const [theme, config] of nanoThemes) {
      const button = document.createElement("button");
      button.innerHTML = theme;
      nanoButtons.push(button);

      button.addEventListener("click", () => {
        const el = document.createElement("p");
        pickrContainerPrimary.appendChild(el);

        /* Delete previous instance */
        if (nanoPickr) {
          nanoPickr.destroyAndRemove();
        }

        /* Apply active class */
        for (const btn of nanoButtons) {
          btn.classList[btn === button ? "add" : "remove"]("active");
        }

        /* Create fresh instance */
        nanoPickr = new Pickr(
          Object.assign(
            {
              el,
              theme,
              default: "#546dfe",
            },
            config
          )
        );

        /* Set events */
        nanoPickr.on("changestop", (source, instance) => {
          let color = instance.getColor().toRGBA();
          let html = document.querySelector("html");
          html.style.setProperty(
            "--primary-rgb",
            `${Math.floor(color[0])}, ${Math.floor(color[1])}, ${Math.floor(color[2])}`
          );
          /* theme color picker */
          localStorage.setItem(
            "primaryRGB",
            `${Math.floor(color[0])}, ${Math.floor(color[1])}, ${Math.floor(color[2])}`
          );
          localStorage.removeItem("color");
          // updateColors();
        });
      });

      themeContainerPrimary.appendChild(button);
    }
    nanoButtons[0].click();

    // for theme background
    const nanoThemes1 = [
      [
        "nano",
        {
          defaultRepresentation: "RGB",
          components: {
            preview: true,
            opacity: false,
            hue: true,

            interaction: {
              hex: false,
              rgba: true,
              hsva: false,
              input: true,
              clear: false,
              save: false,
            },
          },
        },
      ],
    ];
    const nanoButtons1 = [];
    let nanoPickr1 = null;
    for (const [theme, config] of nanoThemes) {
      const button = document.createElement("button");
      button.innerHTML = theme;
      nanoButtons1.push(button);

      button.addEventListener("click", () => {
        const el = document.createElement("p");
        pickrContainerBackground.appendChild(el);

        /* Delete previous instance */
        if (nanoPickr1) {
          nanoPickr1.destroyAndRemove();
        }

        /* Apply active class */
        for (const btn of nanoButtons) {
          btn.classList[btn === button ? "add" : "remove"]("active");
        }

        /* Create fresh instance */
        nanoPickr1 = new Pickr(
          Object.assign(
            {
              el,
              theme,
              default: "#546dfe",
            },
            config
          )
        );

        /* Set events */
        nanoPickr1.on("changestop", (source, instance) => {
          let color = instance.getColor().toRGBA();
          let html = document.querySelector("html");
          html.style.setProperty(
            "--sidebar-rgb",
            `${Math.floor(color[0])}, ${Math.floor(color[1])}, ${Math.floor(color[2])}`
          );
          // updateColors();
          localStorage.setItem(
            "sidebarRGB",
            `${Math.floor(color[0])}, ${Math.floor(color[1])}, ${Math.floor(color[2])}`
          );
          localStorage.removeItem("sidebarTheme");
        });
      });
      themeContainerBackground.appendChild(button);
    }
    nanoButtons1[0].click();

    // for theme Topbar
    const nanoThemes2 = [
      [
        "nano",
        {
          defaultRepresentation: "RGB",
          components: {
            preview: true,
            opacity: false,
            hue: true,

            interaction: {
              hex: false,
              rgba: true,
              hsva: false,
              input: true,
              clear: false,
              save: false,
            },
          },
        },
      ],
    ];
    const nanoButtons2 = [];
    let nanoPickr2 = null;
    for (const [theme, config] of nanoThemes) {
      const button = document.createElement("button");
      button.innerHTML = theme;
      nanoButtons2.push(button);

      button.addEventListener("click", () => {
        const el = document.createElement("p");
        pickrtopbar.appendChild(el);

        /* Delete previous instance */
        if (nanoPickr2) {
          nanoPickr2.destroyAndRemove();
        }

        /* Apply active class */
        for (const btn of nanoButtons) {
          btn.classList[btn === button ? "add" : "remove"]("active");
        }

        /* Create fresh instance */
        nanoPickr2 = new Pickr(
          Object.assign(
            {
              el,
              theme,
              default: "#546dfe",
            },
            config
          )
        );

        /* Set events */
        nanoPickr2.on("changestop", (source, instance) => {
          let color = instance.getColor().toRGBA();
          let html = document.querySelector("html");
          html.style.setProperty(
            "--topbar-rgb",
            `${Math.floor(color[0])}, ${Math.floor(color[1])}, ${Math.floor(color[2])}`
          );
          // updateColors();
          localStorage.setItem(
            "topbarRGB",
            `${Math.floor(color[0])}, ${Math.floor(color[1])}, ${Math.floor(color[2])}`
          );
          localStorage.removeItem("topbar");
        });
      });
      themetopbar.appendChild(button);
    }
    nanoButtons2[0].click();

    /* for theme topbar overlay */
    const nanoThemes3 = [
      [
        "nano",
        {
          defaultRepresentation: "RGB",
          components: {
            preview: true,
            opacity: false,
            hue: true,

            interaction: {
              hex: false,
              rgba: true,
              hsva: false,
              input: true,
              clear: false,
              save: false,
            },
          },
        },
      ],
    ];
    const nanoButtons3 = [];
    let nanoPickr3 = null;
    for (const [theme, config] of nanoThemes) {
      const button = document.createElement("button");
      button.innerHTML = theme;
      nanoButtons3.push(button);

      button.addEventListener("click", () => {
        const el = document.createElement("p");
        pickrtopbarcolor.appendChild(el);

        /* Delete previous instance */
        if (nanoPickr3) {
          nanoPickr3.destroyAndRemove();
        }

        /* Apply active class */
        for (const btn of nanoButtons) {
          btn.classList[btn === button ? "add" : "remove"]("active");
        }

        /* Create fresh instance */
        nanoPickr3 = new Pickr(
          Object.assign(
            {
              el,
              theme,
              default: "#546dfe",
            },
            config
          )
        );

        /* Set events */
        nanoPickr3.on("changestop", (source, instance) => {
          let color = instance.getColor().toRGBA();
          let html = document.querySelector("html");
          html.style.setProperty(
            "--topbarcolor-rgb",
            `${Math.floor(color[0])}, ${Math.floor(color[1])}, ${Math.floor(color[2])}`
          );
          /* theme color picker */
          localStorage.setItem(
            "topbarcolorRGB",
            `${Math.floor(color[0])}, ${Math.floor(color[1])}, ${Math.floor(color[2])}`
          );
          localStorage.removeItem("topbarcolor");
          // updateColors();
        });
      });

      themetopbarcolor.appendChild(button);
    }
    nanoButtons3[0].click();

    function localStorageBackup() {
      // if there is a value stored, update color picker and background color
      // Used to retrive the data from local storage
      if (localStorage.primaryRGB) {
        if (document.querySelector(".theme-container-primary")) {
          document.querySelector(".theme-container-primary").value =
            localStorage.primaryRGB;
        }
        document
          .querySelector("html")
          .style.setProperty("--primary-rgb", localStorage.primaryRGB);
      }

      if (localStorage.sidebarRGB) {
        if (document.querySelector(".theme-container-background")) {
          document.querySelector(".theme-container-background").value =
            localStorage.sidebarRGB;
        }
        document
          .querySelector("html")
          .style.setProperty("--sidebar-rgb", localStorage.sidebarRGB);
      }

      if (localStorage.topbarRGB) {
        if (document.querySelector(".theme-topbar")) {
          document.querySelector(".theme-topbar").value = localStorage.topbarRGB;
        }
        document
          .querySelector("html")
          .style.setProperty("--topbar-rgb", localStorage.topbarRGB);
      }

      if (localStorage.topbarcolorRGB) {
        if (document.querySelector(".theme-topbarcolor")) {
          document.querySelector(".theme-topbarcolor").value =
            localStorage.topbarcolorRGB;
        }
        document
          .querySelector("html")
          .style.setProperty("--topbarcolor-rgb", localStorage.topbarcolorRGB);
      }
    }
    localStorageBackup();

    document.querySelectorAll('[data-color="all"]').forEach(function (el) {
      const associatedInput = el.querySelector('input[name="color"]');
      associatedInput.checked = false;
    });

    document.querySelectorAll('[data-sidebar="all"]').forEach(function (el) {
      const associatedInput = el.querySelector('input[name="sidebar"]');
      associatedInput.checked = false;
    });

    document.querySelectorAll('[data-topbar="all"]').forEach(function (el) {
      const associatedInput = el.querySelector('input[name="topbar"]');
      associatedInput.checked = false;
    });

    document.querySelectorAll('[data-topbarcolor="all"]').forEach(function (el) {
      const associatedInput = el.querySelector('input[name="topbarcolor"]');
      associatedInput.checked = false;
    });

    // Function to uncheck all radio buttons
    function uncheckDataColorRadioButtons() {
      const radioButtons = document.querySelectorAll('input[name="color"]');
      radioButtons.forEach(function (radio) {
        radio.checked = false; // Uncheck each radio button
      });
    }

    function uncheckSideBarRadioButtons() {
      const radioButtons = document.querySelectorAll('input[name="sidebar"]');
      radioButtons.forEach(function (radio) {
        radio.checked = false; // Uncheck each radio button
      });
    }

    function uncheckTopBarRadioButtons() {
      const radioButtons = document.querySelectorAll('input[name="topbar"]');
      radioButtons.forEach(function (radio) {
        radio.checked = false; // Uncheck each radio button
      });
    }

    function uncheckTopBarColorRadioButtons() {
      const radioButtons = document.querySelectorAll('input[name="topbarcolor"]');
      radioButtons.forEach(function (radio) {
        radio.checked = false; // Uncheck each radio button
      });
    }

    document.querySelectorAll(".pickr-container-primary").forEach(function (element) {
      element.addEventListener("click", function () {
        // Update the 'data-color' attribute value
        document.querySelector("html").setAttribute("data-color", "all");
        uncheckDataColorRadioButtons();
      });
    });

    document.querySelectorAll(".pickr-container-background").forEach(function (element) {
      element.addEventListener("click", function () {
        document.querySelector("html").setAttribute("data-sidebar", "all");
        uncheckSideBarRadioButtons();
      });
    });

    document.querySelectorAll(".pickr-topbar").forEach(function (element) {
      element.addEventListener("click", function () {
        document.querySelector("html").setAttribute("data-topbar", "all");
        uncheckTopBarRadioButtons();
      });
    });

    document.querySelectorAll(".pickr-topbarcolor").forEach(function (element) {
      element.addEventListener("click", function () {
        document.querySelector("html").setAttribute("data-topbarcolor", "all");
        uncheckTopBarColorRadioButtons();
      });
    });

    document.addEventListener("DOMContentLoaded", function () {
      const darkModeToggle = document.getElementById("dark-mode-toggle");
      const lightModeToggle = document.getElementById("light-mode-toggle");
      const darkMode = localStorage.getItem("darkMode");

      function enableDarkMode() {
        document.documentElement.setAttribute("data-theme", "dark");
        darkModeToggle.classList.remove("activate");
        lightModeToggle.classList.add("activate");
        localStorage.setItem("darkMode", "enabled");
      }

      function disableDarkMode() {
        document.documentElement.setAttribute("data-theme", "light");
        lightModeToggle.classList.remove("activate");
        darkModeToggle.classList.add("activate");
        localStorage.removeItem("darkMode");
      }

      // Check if darkModeToggle and lightModeToggle exist before adding event listeners
      if (darkModeToggle && lightModeToggle) {
        // Check the current mode on page load
        if (darkMode === "enabled") {
          enableDarkMode();
        } else {
          disableDarkMode();
        }

        // Add event listeners
        darkModeToggle.addEventListener("click", enableDarkMode);
        lightModeToggle.addEventListener("click", disableDarkMode);
      }

      const themeRadios = document.querySelectorAll('input[name="theme"]');
      const sidebarRadios = document.querySelectorAll('input[name="sidebar"]');
      const colorRadios = document.querySelectorAll('input[name="color"]');
      const layoutRadios = document.querySelectorAll('input[name="LayoutTheme"]');
      const topbarRadios = document.querySelectorAll('input[name="topbar"]');
      const sidebarBgRadios = document.querySelectorAll('input[name="sidebarbg"]');
      const topbarcolorRadios = document.querySelectorAll('input[name="topbarcolor"]');
      const cardRadios = document.querySelectorAll('input[name="card"]');
      const sizeRadios = document.querySelectorAll('input[name="size"]');
      const widthRadios = document.querySelectorAll('input[name="width"]');
      const loaderRadios = document.querySelectorAll('input[name="loader"]');
      const topbarbgRadios = document.querySelectorAll('input[name="topbarbg"]');
      const resetButton = document.getElementById("resetbutton");
      const sidebarBgContainer = document.getElementById("sidebarbgContainer");
      const sidebarElement = document.querySelector(".sidebar"); // Adjust this selector to match your sidebar element

      let savedSidebarTheme; // Declare savedSidebarTheme here
      let color; // Declare color here

      function setThemeAndSidebarTheme(
        theme,
        sidebarTheme,
        color,
        layout,
        topbar,
        topbarcolor,
        card,
        size,
        width,
        loader
      ) {
        // Check if the sidebar element exists
        if (!sidebarElement) {
          console.error("Sidebar element not found");
          return;
        }

        // Setting data attributes and classes
        document.documentElement.setAttribute("data-theme", theme);
        document.documentElement.setAttribute("data-sidebar", sidebarTheme);
        document.documentElement.setAttribute("data-color", color);
        document.documentElement.setAttribute("data-layout", layout);
        document.documentElement.setAttribute("data-topbar", topbar);
        document.documentElement.setAttribute("data-topbarcolor", topbarcolor);
        document.documentElement.setAttribute("data-card", card);
        document.documentElement.setAttribute("data-size", size);
        document.documentElement.setAttribute("data-width", width);
        document.documentElement.setAttribute("data-loader", loader);

        // Track mini-layout set or not
        let layout_mini = 0; // Declare layout_mini
        if (layout === "mini") {
          document.body.classList.add("mini-sidebar");
          document.body.classList.remove("menu-horizontal");
          layout_mini = 1;
        } else if (
          layout === "horizontal" ||
          layout === "horizontal-single" ||
          layout === "horizontal-overlay"
        ) {
          document.body.classList.add("menu-horizontal");
          document.body.classList.remove("mini-sidebar");
        } else {
          document.body.classList.remove("mini-sidebar", "menu-horizontal");
        }

        if (size === "compact") {
          document.body.classList.add("mini-sidebar");
          document.body.classList.remove("expand-menu");
          layout_mini = 1;
        } else if (size === "hoverview") {
          document.body.classList.add("expand-menu");
          if (layout_mini === 0) {
            // Remove only mini sidebar not set
            document.body.classList.remove("mini-sidebar");
          }
        } else {
          if (layout_mini === 0) {
            // Remove only mini sidebar not set
            document.body.classList.remove("mini-sidebar");
          }
          document.body.classList.remove("expand-menu");
        }

        if (width === "box") {
          document.body.classList.add("layout-box-mode");
          document.body.classList.add("mini-sidebar");
          layout_mini = 1;
        } else {
          if (layout_mini === 0) {
            // Remove only mini sidebar not set
            document.body.classList.remove("mini-sidebar");
          }
          document.body.classList.remove("layout-box-mode");
        }
        if (
          (width === "box" && layout === "horizontal") ||
          (width === "box" && layout === "horizontal-overlay") ||
          (width === "box" && layout === "horizontal-single") ||
          (width === "box" && layout === "without-header")
        ) {
          document.body.classList.remove("mini-sidebar");
        }

        // Saving to localStorage
        localStorage.setItem("theme", theme);
        localStorage.setItem("sidebarTheme", sidebarTheme);
        localStorage.setItem("color", color);
        localStorage.setItem("layout", layout);
        localStorage.setItem("topbar", topbar);
        localStorage.setItem("topbarcolor", topbarcolor);
        localStorage.setItem("card", card);
        localStorage.setItem("size", size);
        localStorage.setItem("width", width);
        localStorage.setItem("loader", loader);

        // Show/hide sidebar background options based on layout selection
        if (layout === "box" && sidebarBgContainer) {
          sidebarBgContainer.classList.add("show");
        } else if (sidebarBgContainer) {
          sidebarBgContainer.classList.remove("show");
        }
      }

      function handleSidebarBgChange() {
        const sidebarBg = document.querySelector('input[name="sidebarbg"]:checked')
          ? document.querySelector('input[name="sidebarbg"]:checked').value
          : null;

        if (sidebarBg) {
          document.body.setAttribute("data-sidebarbg", sidebarBg);
          localStorage.setItem("sidebarBg", sidebarBg);
        } else {
          document.body.removeAttribute("data-sidebarbg");
          localStorage.removeItem("sidebarBg");
        }
      }

      function handleTopbarBgChange() {
        const topbarbg = document.querySelector('input[name="topbarbg"]:checked')
          ? document.querySelector('input[name="topbarbg"]:checked').value
          : null;

        if (topbarbg) {
          document.body.setAttribute("data-topbarbg", topbarbg);
          localStorage.setItem("topbarbg", topbarbg);
        } else {
          document.body.removeAttribute("data-topbarbg");
          localStorage.removeItem("topbarbg");
        }
      }

      function handleInputChange() {
        const theme = document.querySelector('input[name="theme"]:checked').value;
        const sidebarTheme = document.querySelector('input[name="sidebar"]:checked')
          .value;
        color = document.querySelector('input[name="color"]:checked').value; // Initialize color here
        const layout = document.querySelector('input[name="LayoutTheme"]:checked').value;
        const topbar = document.querySelector('input[name="topbar"]:checked').value;
        const topbarcolor = document.querySelector('input[name="topbarcolor"]:checked')
          .value;
        const card = document.querySelector('input[name="card"]:checked').value;
        const size = document.querySelector('input[name="size"]:checked').value;
        const width = document.querySelector('input[name="width"]:checked').value;
        const loader = document.querySelector('input[name="loader"]:checked').value;

        setThemeAndSidebarTheme(
          theme,
          sidebarTheme,
          color,
          layout,
          topbar,
          topbarcolor,
          card,
          size,
          width,
          loader
        );
      }

      // Attach event listeners to radio buttons
      themeRadios.forEach((radio) => radio.addEventListener("change", handleInputChange));
      sidebarRadios.forEach((radio) =>
        radio.addEventListener("change", handleInputChange)
      );
      colorRadios.forEach((radio) => radio.addEventListener("change", handleInputChange));
      layoutRadios.forEach((radio) =>
        radio.addEventListener("change", handleInputChange)
      );
      topbarRadios.forEach((radio) =>
        radio.addEventListener("change", handleInputChange)
      );
      sidebarBgRadios.forEach((radio) =>
        radio.addEventListener("change", handleSidebarBgChange)
      );
      topbarcolorRadios.forEach((radio) =>
        radio.addEventListener("change", handleInputChange)
      );
      cardRadios.forEach((radio) => radio.addEventListener("change", handleInputChange));
      sizeRadios.forEach((radio) => radio.addEventListener("change", handleInputChange));
      widthRadios.forEach((radio) => radio.addEventListener("change", handleInputChange));
      loaderRadios.forEach((radio) =>
        radio.addEventListener("change", handleInputChange)
      );

      // Handle reset button
      if (resetButton) {
        resetButton.addEventListener("click", function () {
          localStorage.clear();
          location.reload();
        });
      }
    });
  },
};
</script>
