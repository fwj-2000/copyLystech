<template>
  <InputTextArea class="lydc-textarea" v-bind="getBindValue" v-model:value="innerValue" @change="onChange">
    <template #[item]="data" v-for="item in Object.keys($slots)"><slot :name="item" v-bind="data || {}"></slot></template>
  </InputTextArea>
</template>

<script lang="ts" setup>
  import { Input } from 'ant-design-vue';
  import { computed, ref, unref, watch } from 'vue';
  import { textareaProps } from './props';
  import { useAttrs } from '/@/hooks/core/useAttrs';

  const InputTextArea = Input.TextArea;
  defineOptions({ name: 'LydcTextarea', inheritAttrs: false });
  const props = defineProps(textareaProps);
  const emit = defineEmits(['update:value', 'change']);
  const attrs = useAttrs({ excludeDefaultKeys: false });
  const innerValue = ref('');

  const getBindValue = computed(() => {
    const _attrs: any = {
      allowClear: true,
      ...unref(attrs),
      ...props,
    };
    if (_attrs.disabled) {
      _attrs.readOnly = true;
      _attrs.disabled = false;
      _attrs.allowClear = false;
    }
    return _attrs;
  });

  watch(
    () => props.value,
    val => {
      setValue(val);
    },
    { immediate: true },
  );

  function setValue(value) {
    innerValue.value = value;
  }
  function onChange(e) {
    emit('update:value', e.target.value);
    emit('change', e.target.value);
  }
</script>
<style scoped lang="less">
  // 设置teararea的可读属性样式等同于disabled样式
  textarea.ant-input.lydc-textarea[readonly] {
    color: rgb(0 0 0);
    background-color: rgb(0 0 0 / 4%);
    border-color: #d9d9d9;
    box-shadow: none;
    cursor: not-allowed;
    opacity: 1;
  }
</style>
