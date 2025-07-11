<template>
    <a-modal v-model:open="visible" :title="form.id ? 'Edit Budget Line' : 'Add Budget Line'" @ok="handleOk"
        @cancel="handleCancel" :confirm-loading="loading" destroyOnClose centered>
        <a-form :model="form" ref="budgetLineForm" layout="vertical" autocomplete="off">
            <a-form-item label="Budget Line Code" name="budget_line_code"
                :rules="[{ required: true, message: 'Budget Line Code is required' }]"
                :validate-status="errors.budget_line_code ? 'error' : ''"
                :help="errors.budget_line_code">
                <a-input v-model:value="form.budget_line_code" />
            </a-form-item>
            <a-form-item label="Description" name="description"
                :validate-status="errors.description ? 'error' : ''"
                :help="errors.description">
                <a-input v-model:value="form.description" />
            </a-form-item>
            <div v-if="errors.general" class="ant-form-item-explain ant-form-item-explain-error">
                {{ errors.general }}
            </div>
        </a-form>
    </a-modal>
</template>

<script>
import { ref, watch, defineComponent } from 'vue';
import { budgetLineService } from '@/services/budget-line.service';

export default defineComponent({
    name: 'BudgetLineModal',
    emits: ['saved'],
    props: {
        editData: { type: Object, default: null }
    },
    setup(props, { emit }) {
        const visible = ref(false);
        const loading = ref(false);
        const form = ref({
            id: null,
            budget_line_code: '',
            description: ''
        });
        const errors = ref({
            budget_line_code: '',
            description: '',
            general: ''
        });

        watch(
            () => props.editData,
            (newVal) => {
                if (newVal) {
                    form.value = { ...newVal };
                } else {
                    form.value = {
                        id: null,
                        budget_line_code: '',
                        description: ''
                    };
                }
                // Clear errors when form data changes
                errors.value = {
                    budget_line_code: '',
                    description: '',
                    general: ''
                };
            },
            { immediate: true }
        );

        const openModal = (data = null) => {
            if (data) form.value = { ...data };
            // Clear errors when opening modal
            errors.value = {
                budget_line_code: '',
                description: '',
                general: ''
            };
            visible.value = true;
        };
        const handleOk = async () => {
            loading.value = true;
            // Clear previous errors
            errors.value = {
                budget_line_code: '',
                description: '',
                general: ''
            };
            try {
                if (form.value.id) {
                    await budgetLineService.updateBudgetLine(form.value.id, form.value);
                } else {
                    await budgetLineService.createBudgetLine(form.value);
                }
                visible.value = false;
                emit('saved');
            } catch (e) {
                if (e.response && e.response.data && e.response.data.errors) {
                    // Handle validation errors from server
                    const serverErrors = e.response.data.errors;
                    Object.keys(serverErrors).forEach(field => {
                        if (errors.value.hasOwnProperty(field)) {
                            errors.value[field] = Array.isArray(serverErrors[field]) 
                                ? serverErrors[field][0] 
                                : serverErrors[field];
                        }
                    });
                } else {
                    // Handle general error
                    errors.value.general = e.response?.data?.message || 'An error occurred while saving the budget line';
                }
            } finally {
                loading.value = false;
            }
        };
        const handleCancel = () => {
            visible.value = false;
        };

        return {
            visible,
            loading,
            form,
            errors,
            openModal,
            handleOk,
            handleCancel
        };
    }
});
</script>
