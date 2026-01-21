<script>
import { useSelectMigration } from '@/composables/useSelectMigration';

const data = [
 {
   "Indicator": "Customer Experience",
   "Expected_Value": "Intermediate",
   "Set_Value": ""
 },
 {
   "Indicator": "Marketing",
   "Expected_Value": "Advanced",
   "Set_Value": ""
 },
 {
   "Indicator": "Management",
   "Expected_Value": "Advanced",
   "Set_Value": ""
 },
 {
   "Indicator": "Administration",
   "Expected_Value": "Advanced",
   "Set_Value": ""
 },
 {
   "Indicator": "Presentation Skill",
   "Expected_Value": "Expert / Leader",
   "Set_Value": ""
 },
 {
   "Indicator": "Quality Of Work",
   "Expected_Value": "Expert / Leader",
   "Set_Value": ""
 },
 {
   "Indicator": "Efficiency",
   "Expected_Value": "Expert / Leader",
   "Set_Value": ""
 }
]

const columns = [
    {
        title: "Indicator",
        dataIndex: "Indicator",
        sorter: {
        compare: (a, b) => {
            a = a.Indicator.toLowerCase();
            b = b.Indicator.toLowerCase();
            return a > b ? -1 : b > a ? 1 : 0;
        },
        },
    },
    {
        title: "Expected Value",
        dataIndex: "Expected_Value",
        key: "Expected_Value",
        sorter: {
        compare: (a, b) => {
            a = a.Expected_Value.toLowerCase();
            b = b.Expected_Value.toLowerCase();
            return a > b ? -1 : b > a ? 1 : 0;
        },
        },
    },
    {
        title: "Set Value",
        dataIndex: "Set_Value",
        key: "Set_Value",
        sorter: {
        compare: (a, b) => {
            a = a.Set_Value.toLowerCase();
            b = b.Set_Value.toLowerCase();
            return a > b ? -1 : b > a ? 1 : 0;
        },
        },
    },
]


export default {
  setup() {
    const { filterOption, getModalPopupContainer } = useSelectMigration();
    return { filterOption, getModalPopupContainer };
  },
    data() {
        return {
            data,
            columns,
            None: ["None", "Beginner", "Intermediate", "Advanced", "Expert/Leader"],
        }
    },
}
</script>

<template>
    <a-table class="table datatable thead-light" 
        :columns="columns"  
        :data-source="data"
    >
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'Expected_Value'">
                {{record.Expected_Value}}
            </template>
            <template v-if="column.key === 'Set_Value'">
                <a-select 
                    :options="None"
                    placeholder="None"
                />
            </template>            
        </template>
    </a-table>
</template>