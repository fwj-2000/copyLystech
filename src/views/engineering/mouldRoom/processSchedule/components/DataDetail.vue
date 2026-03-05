<template>
  <div class="detail-block">
    <div class="flex-row">
      <div class="row-name">{{ t('dict.ProcessScheduleColumn.workOrderNo') }}</div>
      <div class="row-value">{{ detailInfo.workOrderNo }}</div>
    </div>
    <div class="flex-row">
      <div class="row-name">{{ t('dict.ProcessScheduleColumn.moldNo') }}</div>
      <div class="row-value">{{ detailInfo.moldNo }}</div>
    </div>
    <div class="flex-row">
      <div class="row-name">{{ t('dict.ProcessScheduleColumn.partNo') }}</div>
      <div class="row-value">{{ detailInfo.partNo }}</div>
    </div>
    <div class="flex-row">
      <div class="row-name">{{ t('dict.ProcessScheduleColumn.status') }}</div>
      <div class="row-value">
        <LydcTag theme="gray" :text="t('dict.planProgress.0')" v-if="detailInfo.status === 0"></LydcTag>
        <LydcTag theme="blue" :text="t('dict.planProgress.1')" v-if="detailInfo.status === 1"></LydcTag>
        <LydcTag theme="green" :text="t('dict.planProgress.2')" v-if="detailInfo.status === 2"></LydcTag>
      </div>
    </div>
    <div class="flex-row">
      <div class="row-name">{{ t('dict.ProcessScheduleColumn.quantity') }}</div>
      <div class="row-value">{{ detailInfo.quantity }}</div>
    </div>
    <div class="flex-row">
      <div class="row-name">{{ t('dict.ProcessScheduleColumn.presetDuration') }}</div>
      <div class="row-value">{{ detailInfo.presetDuration }}H</div>
    </div>
    <div class="flex-row">
      <div class="row-name">{{ t('dict.ProcessScheduleColumn.planStartTime') }}</div>
      <div class="row-value">{{ detailInfo.planStartTime ? dayjs(detailInfo.planStartTime).format('YYYY-MM-DD HH:mm:ss') : '' }}</div>
    </div>
    <div class="flex-row">
      <div class="row-name">{{ t('dict.ProcessScheduleColumn.planEndTime') }}</div>
      <div class="row-value">{{ detailInfo.planEndTime ? dayjs(detailInfo.planEndTime).format('YYYY-MM-DD HH:mm:ss') : '' }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
  const props = defineProps({
    detailInfo: {
      type: Object,
      default: () => ({}),
    },
  });
</script>
<style lang="less" scoped>
  .detail-block {
    width: 230px;

    .flex-row {
      display: flex;
      align-items: center;
      font-size: 14px;
      line-height: 22px;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }

      .row-name {
        width: 100px;
        color: rgb(26 26 26 / 70%);
      }

      .row-value {
        flex: 1;
        color: #1a1a1a;
      }
    }
  }
</style>
