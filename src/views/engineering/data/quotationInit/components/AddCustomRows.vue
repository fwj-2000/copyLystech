<template>
  <div class="basic-content-wrap mb-1">
    <div class="mr-2">添加行</div>
    <InputNumber v-model:value="rowNum" class="ipt-number" :min="1" />
    <a-button type="primary" ghost class="ml-1" @click="emit('submit', rowNum)">添加</a-button>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watchEffect } from 'vue';
  import InputNumber from '/@/components/Lydc/InputNumber/src/InputNumber.vue';

  defineOptions({ name: 'AddCustomRows', inheritAttrs: false });

  const rowNum = ref<number>(1);

  const props = defineProps({
    defaultValue: {
      type: Number,
      default: 1,
    },
  });
  watchEffect(() => {
    rowNum.value = props.defaultValue;
  });
  const emit = defineEmits(['submit']);
</script>
<style lang="less" scoped>
  .basic-content-wrap {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  :deep(.ant-input-number, .ant-input-number-group-wrapper) {
    width: 70px !important;
  }
</style>
