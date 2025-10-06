<template>
    <div class="accommodation-selector">
        <div class="row">
            <div v-for="option in options" :key="option.value" :class="getColumnClass()">
                <div class="form-check mb-2">
                    <input class="form-check-input" type="radio" :name="radioName" :id="`accommodation_${option.value}`"
                        :value="option.value" :checked="selectedOption === option.value" @change="onOptionChange" />
                    <label class="form-check-label" :for="`accommodation_${option.value}`">
                        {{ option.label }}
                    </label>
                </div>
            </div>
        </div>

        <!-- Custom input for "Other" option -->
        <div v-if="selectedOption === 'other'" class="mt-2">
            <input v-model="customValue" type="text" class="form-control"
                placeholder="Please specify accommodation type..." @input="onCustomValueChange" maxlength="200" />
        </div>
    </div>
</template>

<script>
import { ref, computed, watch } from 'vue';

export default {
    name: 'AccommodationSelector',
    props: {
        modelValue: {
            type: String,
            default: ''
        },
        customText: {
            type: String,
            default: ''
        },
        options: {
            type: Array,
            default: () => [
                { value: 'smru_arrangement', label: 'SMRU arrangement' },
                { value: 'self_arrangement', label: 'Self arrangement' },
                { value: 'other', label: 'Other please specify' }
            ]
        },
        radioName: {
            type: String,
            default: 'accommodation'
        }
    },
    emits: ['update:modelValue', 'custom-value'],
    setup(props, { emit }) {
        const customValue = ref('');

        // Determine if current value is a predefined option or custom
        const selectedOption = computed(() => {
            if (!props.modelValue) return '';
            // The modelValue should be either a predefined option or 'other'
            return props.modelValue;
        });

        // Initialize custom value with prop
        customValue.value = props.customText || '';

        // Watch for custom text prop changes
        watch(() => props.customText, (newValue) => {
            customValue.value = newValue || '';
        });

        // Calculate column class based on number of options
        const getColumnClass = () => {
            const optionCount = props.options.length;
            if (optionCount <= 2) return 'col-md-6';
            if (optionCount <= 4) return 'col-md-6 col-lg-3';
            return 'col-md-6 col-lg-4';
        };

        const onOptionChange = (e) => {
            const newValue = e.target.value;

            if (newValue === 'other') {
                // When "other" is selected, emit 'other' to trigger the text field
                emit('update:modelValue', 'other');
                // Also emit the custom value event
                emit('custom-value', customValue.value || '');
            } else {
                // When predefined option is selected, clear custom value and emit the option
                customValue.value = '';
                emit('update:modelValue', newValue);
            }
        };

        const onCustomValueChange = (e) => {
            const newCustomValue = e.target.value;
            customValue.value = newCustomValue;
            emit('custom-value', newCustomValue);
        };

        return {
            selectedOption,
            customValue,
            getColumnClass,
            onOptionChange,
            onCustomValueChange
        };
    }
};
</script>

<style scoped>
.accommodation-selector .form-check {
    display: flex;
    align-items: center;
    min-height: 32px;
}

.accommodation-selector .form-check-input {
    margin-right: 8px;
}

.accommodation-selector .form-check-label {
    margin-bottom: 0;
    cursor: pointer;
    font-size: 14px;
}

.accommodation-selector .form-control {
    font-size: 14px;
}
</style>
