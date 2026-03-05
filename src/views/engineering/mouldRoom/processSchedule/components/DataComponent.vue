<template>
  <div :class="['plan-block', `plan-block-${index}`]">
    <a-popover v-for="(item, index) in detailList" :key="index">
      <template #content>
        <DataDetail :detailInfo="item" />
      </template>
      <div class="plan-item">
        <div class="drop"></div>
        <div class="time">{{ dayjs(item.planEndTime).format('hh:mm') }}</div>
        <div class="hour">{{ item.presetDuration }}{{ item.presetDuration ? 'H' : '' }}</div>
      </div>
    </a-popover>
  </div>
</template>
<script lang="ts" setup>
  import dayjs from 'dayjs';
  import DataDetail from './DataDetail.vue';

  const props = defineProps({
    detailList: {
      type: Array,
      default: () => [] as any[],
    },
    index: {
      type: Number,
      default: 0,
    },
  });
</script>
<style lang="less" scoped>
  ::v-deep(.plan-block) {
    .plan-item {
      display: flex;
      align-items: center;
      padding: 0 4px;
      height: 22px;
      font-size: 14px;
      line-height: 22px;
      border-radius: 4px;
      background-color: #ffefe0;
      width: fit-content;
      margin-bottom: 6px;

      &:last-child {
        margin-bottom: 0;
      }

      .drop {
        width: 8px;
        height: 8px;
        background: #ff7b00;
        border-radius: 50%;
      }

      .time {
        color: #3d3d3d;
        margin: 0 6px;
      }

      .hour {
        color: #1890ff;
      }
    }
  }
</style>
