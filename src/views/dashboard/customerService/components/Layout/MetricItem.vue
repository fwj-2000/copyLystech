<!-- 单个指标内容封装 -->
<template>
  <div class="metric-item-wrapper">
    <div class="metric-item-title">
      <slot name="title">
        <div class="font-bold text-hover" @click="emits('click-title')">{{ props.title }}</div>
      </slot>
    </div>
    <div class="metric-item-content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
  });
  const emits = defineEmits(['click-title']);
</script>

<style lang="less" scoped>
  @import url('/@/views/dashboard/customerService/style.less');
</style>
