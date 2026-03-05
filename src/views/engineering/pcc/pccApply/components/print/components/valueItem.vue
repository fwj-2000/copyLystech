<template>
  <!--	<span class="value-item">{{ props.value || '/' }}</span>-->
  <div class="value-item" v-html="value"></div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { getSafeContent } from '/@/utils/editor';

  const props = defineProps({
    value: {
      type: [String, Number],
      default: '/',
    },
  });

  const value = computed(() => {
    if (!props.value) return '/';
    return getSafeContent(`${props.value}`);
  });
</script>

<style scoped lang="less">
  .value-item {
    //display: flex;
    //align-items: center;
    padding: 4px 8px;
    width: 100%;
    height: max-content;
    background: #f7f7f7;
    border-radius: 4px;
    line-height: 14px;
  }
</style>
