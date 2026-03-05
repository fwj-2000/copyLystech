<template>
  <a-card class="ly-card">
    <div v-if="!props.hideTitle" class="ly-card-header">
      <slot name="title"></slot>
    </div>
    <div class="ly-card-body">
      <slot></slot>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
  const props = defineProps({
    hideTitle: {
      type: Boolean,
      default: false,
    },
  });
</script>
<style lang="less" scoped>
  .ly-card {
    // border-radius: 10px;
    // margin-bottom: 12px;

    &-header {
      position: relative;
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 15px;
      padding-left: 8px;

      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        background: #ff7b00;
        width: 2px;
        height: 14px;
        border-radius: 2px;
      }
    }
  }
</style>
