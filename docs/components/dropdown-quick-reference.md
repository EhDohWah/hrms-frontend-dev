# Ant Design Vue Dropdown - Quick Reference

## Essential Template
```html
<a-select
    v-model:value="selectedValue"
    placeholder="Select Option"
    :options="options"
    :get-popup-container="(triggerNode) => triggerNode.parentNode"
    :dropdown-style="{ zIndex: 9999 }"
    allow-clear
    style="width: 100%"
>
    <template #suffixIcon>
        <i class="ti ti-icon-name"></i>
    </template>
</a-select>
```

## Critical CSS (Always Include)
```css
<style scoped>
:deep(.ant-select-dropdown) {
    z-index: 9999 !important;
    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05) !important;
}

:deep(.d-flex) {
    position: relative;
    overflow: visible;
}

:deep(.ant-select) {
    position: relative;
}
</style>
```

## Data Structure
```javascript
computed: {
    options() {
        return this.rawData.map(item => ({
            label: item.name || item.title || item.value,
            value: item.id || item.value
        }));
    }
}
```

## Must-Have Props
- ✅ `v-model:value="selectedValue"`
- ✅ `:options="options"`
- ✅ `:get-popup-container="(triggerNode) => triggerNode.parentNode"`
- ✅ `:dropdown-style="{ zIndex: 9999 }"`

## Common Icons
- Sites: `ti ti-building`
- Departments: `ti ti-users`
- Status: `ti ti-flag`
- Categories: `ti ti-tag`
- Locations: `ti ti-map-pin`
