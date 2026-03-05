<template>
  <InputNumber v-if="props.inputType === 'number'" v-model:value="innerValue" v-bind="$attrs" @input="handleInput" @change="handleChange" />
  <Input v-else v-model:value="innerValue" v-bind="$attrs" @input="handleInput" @change="handleChange" />
</template>

<script lang="ts" setup>
  import { Input } from 'ant-design-vue';
  import { InputNumber } from 'ant-design-vue';
  import { ref, watch, nextTick, defineProps, defineEmits } from 'vue';
  import { useDebounceFn } from '@vueuse/core';

  const debouncedEmit = useDebounceFn(value => {
    emit('update:value', value);
  }, 300);

  defineOptions({ name: 'whInput', inheritAttrs: false });
  const props = defineProps({
    inputType: {
      type: String,
      default: 'text',
      validator: (value: string) => ['cn', 'en', 'number', 'code', 'text', ''].includes(value),
    },
    value: String,
  });
  const emit = defineEmits(['update:value', 'change']);
  const innerValue = ref('');
  let isInputEvent = false;
  watch(
    () => props.value,
    val => {
      if (val !== innerValue.value) {
        nextTick(() => {
          if (!val) return;
          innerValue.value = val;
        });
      }
    },
    { immediate: true },
  );

  function handleInput(event) {
    isInputEvent = true;
    let value = event.target ? event.target.value : event;
    let filteredValue = value;
    switch (props.inputType) {
      case 'cn':
        filteredValue = value.replace(/[^\u4e00-\u9fa5]/g, '');
        break;
      case 'en':
        filteredValue = value.replace(/[^a-zA-Z]/g, '');
        break;
      case 'number':
        filteredValue = value.replace(/\D/g, '');
        break;
      case 'code':
        filteredValue = value.replace(/[^a-zA-Z0-9-]/g, '');
        break;
      default:
        // 如果没有指定类型，不进行过滤
        break;
    }

    if (filteredValue !== innerValue.value) {
      innerValue.value = filteredValue;
    }
    debouncedEmit(filteredValue);
  }

  function handleChange(event) {
    const value = props.inputType === 'number' ? event : event.target.value;
    if (isInputEvent === false) {
      debouncedEmit(value);
    }
    // debouncedEmit(value);
    isInputEvent = false;
    emit('change', value);
  }
</script>
