<template>
  <div class="big-title">
    <p class="line-flag"></p>
    <p>{{ props.title }}</p>
  </div>
</template>

<script lang="ts" setup>
  import { defineProps } from 'vue';
  const props = defineProps({
    title: { type: String, default: '' },
  });
</script>

<style lang="less" scoped>
  .big-title {
    color: #000;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 14px;
    display: flex;
    align-items: center;
    padding: 19px 0 0 38px;

    .line-flag {
      width: 4px;
      height: 12px;
      background: #000;
      margin-right: 6px;
    }
  }
</style>
