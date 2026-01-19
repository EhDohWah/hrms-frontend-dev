<template>
  <div class="my-auto mb-2">
    <h2 class="mb-1">{{ title }}</h2>
    <nav>
      <ol class="breadcrumb mb-0">
        <li class="breadcrumb-item">
          <router-link to="/dashboard/"><i class="ti ti-smart-home"></i></router-link>
        </li>
        <li class="breadcrumb-item">{{ text }}</li>
        <li class="breadcrumb-item active" aria-current="page">{{ text1 }}</li>
      </ol>
    </nav>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    title: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      default: "",
    },
    text1: {
      type: String,
      default: "",
    },
  },
};
</script>
