<template>
  <div class="container-fluid">
    <div class="row justify-content-center align-items-center vh-100">
      <div class="col-md-6 text-center">
        <h1 class="display-1 text-danger mb-4">401</h1>
        <h2 class="mb-4">Unauthorized Access</h2>
        <p class="mb-4">Sorry, you don't have permission to access this page.</p>
        <router-link to="/dashboard" class="btn btn-primary">
          Back to Dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UnauthorizedPage'
}
</script> 