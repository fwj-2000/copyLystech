<template>
  <div :class="prefixCls" class="toggle-current flex" v-if="config.total > 1">
    <a-button preIcon="icon-ym icon-ym-left" @click="handleChangePage('prev')" :disabled="config.currentIndex < 1"></a-button>
    <div class="state-box m-2">
      <span>{{ config.currentIndex + 1 }}</span> / {{ config.total }}
    </div>
    <a-button preIcon="icon-ym icon-ym-right" @click="handleChangePage('next')" :disabled="config.currentIndex >= config.total - 1"></a-button>
    <a-divider type="vertical" class="ml-10px"></a-divider>
  </div>
</template>
<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { useSlots, computed } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';

  const props = defineProps({
    /**
     * 当前分页配置
     * @default: {currentIndex: 0,total: 0,}
     */
    config: {
      type: Object as PropType<{
        currentIndex: number;
        total: number;
      }>,
      default: () => {
        return {
          currentIndex: 0,
          total: 0,
        };
      },
    },
  });
  const { prefixCls } = useDesign('basic-popop-page');
  //   const slots = useSlots();

  const emits = defineEmits(['change', 'toPre', 'toNext']);
  function handleChangePage(type) {
    if (type == 'prev') {
      emits('change', 'prev');
      emits('toPre');
    } else {
      emits('change', 'next');
      emits('toNext');
    }
  }
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-basic-popop-page';
</style>
