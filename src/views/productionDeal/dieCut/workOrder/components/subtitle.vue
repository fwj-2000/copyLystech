<template>
  <div class="subtitle-container">
    <div class="title">
      <span :style="{ backgroundColor: `${props.color}` }"></span>
      {{ props.title }}
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#FF7B00',
    },
  });
</script>

<style lang="less" scoped>
  .subtitle-container {
    padding-bottom: 16px;

    .title {
      color: #1a1a1a;
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 22px; /* 157.143% */
      display: flex;
      align-items: center;

      span {
        display: inline-block;
        width: 2px;
        height: 14px;
        background-color: #ff7b00;
        border-radius: 2px;
        margin-right: 8px;
      }
    }
  }
</style>
