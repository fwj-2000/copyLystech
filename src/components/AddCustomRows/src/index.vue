<template>
  <div class="basic-content-wrap">
    <div class="mr-2">{{ t('common.addText2') }}</div>
    <InputNumber v-model:value="rowNum" :min="1" @keydown.enter="emit('submit', rowNum)" class="ipt-number mr-2" />
    <a-button type="primary" ghost @click="emit('submit', rowNum)">{{ t('common.add1Text') }}</a-button>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watchEffect } from 'vue';
  import InputNumber from '/@/components/Lydc/InputNumber/src/InputNumber.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  // 自定义添加行 组件
  defineOptions({ name: 'AddCustomRows', inheritAttrs: false });

  const rowNum = ref<number>(1);

  const props = defineProps({
    lable: {
      type: String,
      default: '',
    },
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
    //margin-right: 3px;
  }

  :deep(.ant-input-number, .ant-input-number-group-wrapper) {
    width: 70px !important;
  }
</style>
