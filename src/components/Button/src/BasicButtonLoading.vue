<template>
  <Button v-bind="getBindValue" :class="getButtonClass" :loading="innerLoading" @click="handleClick">
    <template #icon v-if="$slots.icon || preIcon">
      <slot name="icon">
        <i :class="[preIcon, 'button-preIcon']"></i>
      </slot>
    </template>
    <template #default="data">
      <slot v-bind="data || {}"></slot>
      <i :class="[postIcon, 'button-postIcon']" v-if="postIcon"></i>
    </template>
  </Button>
</template>

<script lang="ts" setup>
  import { computed, unref, ref } from 'vue';
  import { Button } from 'ant-design-vue';
  import { buttonProps } from './props';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { useButtonLoadingScope } from '../../Lydc/Button/src/useButtonLoadingScope';

  defineOptions({
    name: 'LYDCButton',
    inheritAttrs: false,
  });

  const props = defineProps({
    ...buttonProps,
    scope: {
      type: String,
    },
    followScope: {
      type: Boolean,
      default: false,
    },
  });
  const { isDisabled, start, end } = useButtonLoadingScope({
    scope: props.scope,
    follow: props.followScope,
  });
  const attrs = useAttrs({ excludeDefaultKeys: false });

  const innerLoading = ref(false);

  const getButtonClass = computed(() => {
    const { color, disabled } = props;
    return [
      {
        [`ant-btn-${color}`]: !!color,
        [`is-disabled`]: disabled,
      },
    ];
  });

  const getBindValue = computed(() => {
    const { onClick, disabled, ...rest } = props as any;
    return {
      ...unref(attrs),
      ...rest,
      loading: innerLoading.value,
      disabled: disabled || isDisabled.value,
    };
  });

  async function handleClick(e: MouseEvent) {
    if (innerLoading.value) return;

    const fn = props.onClick;
    if (!fn) return;

    try {
      const result = fn(e);
      if (result && typeof result.then === 'function') {
        innerLoading.value = true;
        start();
        await result;
      }
    } finally {
      innerLoading.value = false;
      end();
    }
  }
</script>

<style lang="less" scoped>
  .ant-btn {
    .button-preIcon,
    .button-postIcon,
    i {
      font-size: 14px;
    }

    :deep(.button-preIcon + span),
    :deep(i + span) {
      margin-left: 5px;
    }

    .button-postIcon {
      margin-left: 5px;
    }
  }
</style>
