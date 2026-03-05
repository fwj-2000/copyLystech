<template>
  <div>
    <slot name="insertFooter"></slot>
    <a-button v-bind="cancelButtonProps" @click="handleCancel" v-if="showCancelBtn">
      {{ cancelText || t('common.cancelText') }}
    </a-button>
    <slot name="centerFooter"></slot>
    <a-button :type="okType" @click="handleOk" :loading="confirmLoading" v-bind="okButtonProps" v-if="showOkBtn">
      {{ okText || t('common.submitText') }}
    </a-button>
    <slot name="appendFooter"></slot>
  </div>
</template>
<script lang="ts" setup>
  import { basicProps } from '../props';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDebounceFn, useThrottleFn } from '@vueuse/core';

  const { t } = useI18n();

  defineOptions({ name: 'BasicModalFooter' });

  const props = defineProps(basicProps);

  const emit = defineEmits(['ok', 'cancel']);
  // 设置默认等待时间
  const wait = props.debounceConfig?.wait ?? 300;
  const handleOk = props.debounceConfig ? useDebounceFn(Ok, wait) : useThrottleFn(Ok, wait);

  function Ok(e: Event) {
    emit('ok', e);
  }

  function handleCancel(e: Event) {
    emit('cancel', e);
  }
</script>
