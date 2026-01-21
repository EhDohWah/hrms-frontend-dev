<template>
  <div class="placeholder-widget text-center py-4">
    <div class="placeholder-icon mb-3">
      <i :class="iconClass"></i>
    </div>
    <h5 class="mb-2">{{ displayName }}</h5>
    <p class="text-muted mb-0">{{ description }}</p>
    <small v-if="widgetName" class="text-muted d-block mt-2">
      Component: {{ widgetName }}
    </small>
  </div>
</template>

<script>
export default {
  name: 'PlaceholderWidget',
  props: {
    widget: {
      type: Object,
      default: () => ({}),
    },
    config: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    widgetName() {
      return this.widget?.component || this.widget?.name || '';
    },
    displayName() {
      return this.widget?.display_name || this.widget?.name || 'Widget';
    },
    description() {
      return this.widget?.description || 'This widget is coming soon';
    },
    iconClass() {
      return this.widget?.icon || 'ti ti-puzzle fs-1 text-muted';
    },
  },
};
</script>

<style scoped>
.placeholder-widget {
  background-color: #f8f9fa;
  border-radius: 8px;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  opacity: 0.5;
}

.placeholder-icon i {
  font-size: 2.5rem;
}
</style>
