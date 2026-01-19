<script>
export default {
    mounted() {
        this.updateBodyClass();
    },
    watch: {
        // Watch for route changes
        $route() {
            this.updateBodyClass();
        }
    },
    methods: {
        updateBodyClass() {
            if (this.$route.path.includes("/error-500")) {
                document.body.classList.add("bg-linear-gradiant");
            } else {
                document.body.classList.remove("bg-linear-gradiant");
            }
        }
    }
};
</script>

<template>
    <div class="container">
        <div class="vh-100 d-flex align-items-center">
            <div class="row justify-content-center align-items-center">
                <div class="col-md-4 d-flex justify-content-center align-items-center">
                    <div>
                        <div class="mb-5">
                            <img src="@/assets/img/logo.svg" alt="logo" class="img-fluid">
                        </div>
                        <div>
                            <h1 class="mb-3">Oops, something went wrong</h1>
                            <p class="fs-16">Server Error 500. We apologise and are fixing the problem. Please try again at a  later stage</p>
                            <div class="d-flex">
                                <router-link to="/dashboard/" class="btn btn-primary d-flex align-items-center "><i class="ti ti-arrow-left me-2"></i>Back to Dashboard</router-link>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-8 d-flex justify-content-end align-items-center">
                    <div class="error-images">
                        <img src="@/assets/img/bg/error-500.svg" alt="image" class="img-fluid">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>