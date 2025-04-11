// components/ReportRow.vue
<template>
    <tr>
        <td>
            <div class="d-flex align-items-center">
                <div class="me-3 flex-shrink-0">
                    <div class="d-flex align-items-center justify-content-center rounded-circle" :style="iconStyle">
                        <i :class="`ti ti-${report.icon}`" class="fs-3 text-white"></i>
                    </div>
                </div>
                <div>
                    <h6 class="mb-0">{{ report.name }}</h6>
                    <p class="text-muted fs-12 mb-0">{{ report.description }}</p>
                </div>
            </div>
        </td>
        <td>
            <slot name="input"></slot>
        </td>
        <td class="text-end">
            <div class="d-flex justify-content-end">
                <a class="btn btn-sm btn-primary me-2" @click="$emit('preview')">
                    <i class="ti ti-eye me-1"></i> Preview
                </a>
                <a-dropdown :trigger="['click']">
                    <a-button type="default" size="small">
                        <i class="ti ti-file-export me-1"></i> Export <i class="ti ti-arrow-down"></i>
                    </a-button>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item @click="$emit('export-pdf')">
                                <i class="ti ti-file-type-pdf me-1"></i> PDF
                            </a-menu-item>
                            <a-menu-item @click="$emit('export-excel')">
                                <i class="ti ti-file-type-xls me-1"></i> Excel
                            </a-menu-item>
                            <a-menu-item @click="$emit('export-csv')">
                                <i class="ti ti-file me-1"></i> CSV
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>
        </td>
    </tr>
</template>

<script>
export default {
    name: 'ReportRow',
    props: {
        report: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            iconStyle: {
                backgroundColor: '#4e73df',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }
        };
    }
};
</script>