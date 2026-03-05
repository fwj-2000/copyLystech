<!-- 基础表单组件 -->
<template>
  <a-form>
    <template v-if="isGutter">
      <a-row :gutter="[12, 12]" class="w-[100%]">
        <a-col :span="4" class="flex" v-for="(item, idx) in props.formOptions" :key="idx">
          <FormItem
            class="w-[100%]"
            v-bind="{
              searchFormValue: props.searchFormValue,
              commonAttrs: props.commonAttrs,
              option: item,
            }" />
        </a-col>
      </a-row>
    </template>
    <template v-else>
      <FormItem
        v-for="(item, idx) in props.formOptions"
        :key="idx"
        v-bind="{
          searchFormValue: props.searchFormValue,
          commonAttrs: props.commonAttrs,
          option: item,
        }" />
    </template>
    <slot name="right"></slot>
  </a-form>
</template>

<script lang="ts" setup>
  import FormItem from './FormItem.vue';
  import { TFormItemOption } from '../types';

  interface IProps {
    searchFormValue: Record<string, any>;
    commonAttrs?: Record<string, any>;
    formOptions: TFormItemOption[];
    isGutter?: boolean;
  }
  const props = withDefaults(defineProps<IProps>(), {
    formOptions: () => [],
    searchFormValue: () => ({}),
    commonAttrs: () => ({}),
    isGutter: false,
  });
</script>
