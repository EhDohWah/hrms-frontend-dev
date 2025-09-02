<template>
    <a-modal v-model:open="visible" :title="form.id ? 'Edit Budget Line' : 'Add Budget Line'" @ok="handleOk"
        @cancel="handleCancel" :confirm-loading="loading" destroyOnClose centered>
        <a-form :model="form" ref="budgetLineForm" layout="vertical" autocomplete="off">
            <a-form-item label="Budget Line Code" name="budget_line_code" :rules="[
                { required: true, message: 'Budget Line Code is required' },
                { max: 255, message: 'Budget Line Code must not exceed 255 characters' }
            ]" :validate-status="errors.budget_line_code ? 'error' : ''" :help="errors.budget_line_code">
                <a-input v-model:value="form.budget_line_code" placeholder="Enter budget line code (e.g., BL001)" />
            </a-form-item>
            <a-form-item label="Description" name="description" :rules="[
                { required: true, message: 'Description is required' },
                { max: 255, message: 'Description must not exceed 255 characters' }
            ]" :validate-status="errors.description ? 'error' : ''" :help="errors.description">
                <a-input v-model:value="form.description" placeholder="Enter description" />
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
        const budgetLineForm = ref();

        const handleOk = async () => {
            // Clear previous errors
            errors.value = {
                budget_line_code: '',
                description: '',
                general: ''
            };

            // Basic manual validation check
            if (!form.value.budget_line_code || !form.value.budget_line_code.trim()) {
                errors.value.budget_line_code = 'Budget Line Code is required';
                return;
            }

            if (!form.value.description || !form.value.description.trim()) {
                errors.value.description = 'Description is required';
                return;
            }

            // Try client-side validation, but don't block if it fails
            try {
                if (budgetLineForm.value) {
                    await budgetLineForm.value.validateFields();
                }
            } catch (validationError) {
                console.log('Client-side validation failed:', validationError);
                // Continue anyway - the manual validation above should catch basic issues
            }

            loading.value = true;

            try {
                let response;

                if (form.value.id) {
                    response = await budgetLineService.updateBudgetLine(form.value.id, form.value);
                } else {
                    response = await budgetLineService.createBudgetLine(form.value);
                }

                visible.value = false;
                emit('saved');

                // Show success message with response message if available
                const operation = form.value.id ? 'updated' : 'created';
                const message = response?.message || `Budget line ${operation} successfully`;
                // Note: We could emit a success event to parent to show the message
                // For now, the parent component will handle the success message via refresh

            } catch (error) {
                console.error('Error saving budget line:', error);

                // Handle BaseService structured errors
                if (error.status) {
                    switch (error.status) {
                        case 422:
                            // Validation errors - extract field-specific errors
                            if (error.errors && typeof error.errors === 'object') {
                                Object.keys(error.errors).forEach(field => {
                                    if (errors.value.hasOwnProperty(field)) {
                                        const fieldErrors = error.errors[field];
                                        errors.value[field] = Array.isArray(fieldErrors)
                                            ? fieldErrors[0]
                                            : fieldErrors;
                                    }
                                });

                                // If no field-specific errors were set, show general message
                                if (!errors.value.budget_line_code && !errors.value.description) {
                                    errors.value.general = error.message || 'Please check the form data and try again.';
                                }
                            } else {
                                errors.value.general = error.message || 'Validation failed. Please check your input.';
                            }
                            break;

                        case 401:
                            errors.value.general = 'Authentication required. Please log in again.';
                            break;

                        case 403:
                            errors.value.general = 'You do not have permission to perform this action.';
                            break;

                        case 404:
                            if (form.value.id) {
                                errors.value.general = 'Budget line not found. It may have been deleted by another user.';
                            } else {
                                errors.value.general = 'Resource not found.';
                            }
                            break;

                        case 500:
                            errors.value.general = 'Server error occurred. Please try again later.';
                            break;

                        default:
                            errors.value.general = error.message || 'An unexpected error occurred while saving the budget line.';
                    }
                } else if (error.response) {
                    // Legacy error handling for non-BaseService errors
                    if (error.response.data && error.response.data.errors) {
                        const serverErrors = error.response.data.errors;
                        Object.keys(serverErrors).forEach(field => {
                            if (errors.value.hasOwnProperty(field)) {
                                errors.value[field] = Array.isArray(serverErrors[field])
                                    ? serverErrors[field][0]
                                    : serverErrors[field];
                            }
                        });
                    } else {
                        errors.value.general = error.response.data?.message || 'An error occurred while saving the budget line.';
                    }
                } else {
                    // Network or unknown errors
                    errors.value.general = 'Network error. Please check your connection and try again.';
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
            budgetLineForm,
            openModal,
            handleOk,
            handleCancel
        };
    }
});
</script>
