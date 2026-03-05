<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}-left`">
      <span @click="handleClose" v-if="showBackIcon" class="mr-10px">
        <!-- <ArrowLeftOutlined :class="`${prefixCls}__back`" /> -->
        <a-button :icon="h(ArrowLeftOutlined)" class="flex align-center">
          {{ t('common.back') }}
        </a-button>
      </span>
      <slot name="title" v-if="$slots.title"></slot>
      <BasicTitle :helpMessage="helpMessage" v-if="!$slots.title">
        {{ title }}
      </BasicTitle>
    </div>
    <div :class="`${prefixCls}__toolbar`">
      <slot name="insertToolbar"></slot>
      <a-button v-bind="cancelButtonProps" @click="handleClose" class="my-12px" v-if="showCancelBtn">
        {{ cancelText }}
      </a-button>
      <a-button
        :type="continueType"
        @click="handleContinue"
        :loading="continueLoading"
        :disabled="confirmLoading"
        class="ml-12px my-12px"
        v-bind="continueButtonProps"
        v-if="showContinueBtn">
        {{ continueText }}
      </a-button>
      <slot name="centerToolbar"></slot>
      <a-button
        :type="okType"
        @click="handleOk"
        v-bind="okButtonProps"
        class="ml-12px mr-12px"
        :loading="confirmLoading"
        :disabled="okButtonProps?.disabled || continueLoading"
        v-if="showOkBtn">
        {{ okText }}
      </a-button>
      <slot name="appendToolbar"></slot>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, h } from 'vue';
  import { BasicTitle } from '/@/components/Basic';
  import { ArrowLeftOutlined } from '@ant-design/icons-vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { headerProps } from '../props';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDebounceFn, useThrottleFn } from '@vueuse/core';

  const { t } = useI18n();

  export default defineComponent({
    name: 'BasicPopupHeader',
    inheritAttrs: false,
    components: { BasicTitle, ArrowLeftOutlined },
    props: {
      ...headerProps,
    },
    emits: ['close', 'ok', 'continue'],
    setup(_, { emit }) {
      const { prefixCls } = useDesign('basic-popup-header');
      // 设置默认等待时间
      const wait = _.debounceConfig?.wait ?? 300;
      const handleOk = _.debounceConfig ? useDebounceFn(Ok, wait) : useThrottleFn(Ok, wait);
      function Ok() {
        emit('ok');
      }
      function handleContinue(e: Event) {
        emit('continue', e);
      }
      function handleClose() {
        emit('close');
      }

      return { prefixCls, handleOk, handleContinue, handleClose, t, h, ArrowLeftOutlined };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-basic-popup-header';
  @footer-height: 60px;
  .@{prefix-cls} {
    flex-shrink: 0;
    display: flex;
    height: 56px;
    align-items: center;
    justify-content: space-between;
    padding: 0 0 0 12px;
    border-bottom: 1px solid @border-color-base;
    box-sizing: border-box;

    &-left {
      display: flex;
      align-items: center;
    }

    &__back {
      padding-right: 16px;
      cursor: pointer;

      &:hover {
        color: @primary-color;
      }
    }

    &__toolbar {
      display: flex;
      align-items: center;
    }
  }
</style>
