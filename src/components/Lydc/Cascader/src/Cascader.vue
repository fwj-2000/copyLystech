<template>
  <Cascader v-bind="getBindValue">
    <template #[item]="data" v-for="item in Object.keys($slots)"><slot :name="item" v-bind="data || {}"></slot></template>
  </Cascader>
</template>

<script lang="ts" setup>
  import { Cascader } from 'ant-design-vue';
  import { computed, unref } from 'vue';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { baseProps } from './props';

  export interface FieldNames {
    label?: string;
    value?: string;
    children?: string;
  }

  defineOptions({ name: 'LydcCascader', inheritAttrs: false });
  const props = defineProps(baseProps);

  const attrs = useAttrs({ excludeDefaultKeys: false });

  // const getFieldNames = computed((): Required<FieldNames> => {
  // const { fieldNames } = props;
  // return {
  //   value: 'id',
  //   label: 'fullName',
  //   children: 'children',
  //   ...fieldNames,
  // };
  // });
  const getBindValue = computed(() => ({ ...unref(attrs), ...props, showCheckedStrategy: 'SHOW_CHILD' }));
  console.log(getBindValue);
</script>
