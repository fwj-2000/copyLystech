<template>
  <div class="panel">
    <div class="panel-title">
      <Subtitle :title="title" :tips="tips"></Subtitle>
      <slot name="title-suffix" />
    </div>
    <div class="panel-content">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import Subtitle from '/@/views/qms/report/abnormalReport/components/SubTitle.vue';
  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    tips: {
      type: String,
      default: '',
    },
  });
</script>
<style lang="less" scoped>
  .panel {
    border-radius: 2px;
    border: 1px solid rgb(240 240 240);
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .panel-title {
      padding: 8px 16px;
      background: linear-gradient(180deg, #ffede5 0%, #fff8f5 100%);
      border-bottom: 1px solid #f9e8e1;
      display: flex;
      justify-content: space-between;
      align-items: center;

      ::v-deep(.subtitle-container) {
        padding-bottom: 0;
      }
    }

    .panel-content {
      flex: 1;
      overflow: scroll;
    }

    ::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
      color: transparent;
      background-color: transparent;
    }
  }
</style>
