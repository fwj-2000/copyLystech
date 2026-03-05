<template>
  <div :class="getClass">
    {{ props.number }}
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { useSlots, computed } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';

  const props = defineProps({
    /**
     * Help text list or string
     * @default: ''
     */
    rules: {
      type: [String, Array] as PropType<string | string[]>,
      default: '',
    },
    /**
     * 文本显示数据
     * @default: ''
     */
    number: { type: Number },
  });
  const { prefixCls } = useDesign('basic-num');
  const slots = useSlots();
  const getClass = computed(() => {
    const { number } = props;
    if (number) {
      if (number < 0.1) {
      }
    }
    return [prefixCls];
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-basic-num';

  //   .@{prefix-cls} {
  //   }
</style>
