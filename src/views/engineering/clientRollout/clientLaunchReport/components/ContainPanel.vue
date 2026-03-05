<template>
  <div class="container">
    <div class="container-title">{{ title }}</div>
    <div class="container-number">{{ number }}</div>
    <div class="analysis">
      <span class="yesterday">{{ t('dict.CommonCol.yesterdayAllDay') }}</span>
      <span class="number">{{ analysisNumber }}</span>
      <img v-if="analysisNumber" :src="analysisNumber.toString().includes('-') ? declineIcon : increaseIcon" class="sign" alt="" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { useI18n } from '/@/hooks/web/useI18n';
  import increaseIcon from '/@/assets/svg/report/increase.svg';
  import declineIcon from '/@/assets/svg/report/decline.svg';

  const { t } = useI18n();

  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    number: {
      tupe: String,
      default: '',
    },
    analysisNumber: {
      tupe: String,
      default: '',
    },
  });
</script>
<style lang="less" scoped>
  .container {
    width: 170px;
    padding: 12px 22px;
    border-radius: 4px;
    margin-right: 20px;
    font-size: 14px;
    line-height: 20px;

    .container-title {
      color: #1d2129;
    }

    .container-number {
      color: #1d2129;
      font-size: 20px;
      font-weight: 500;
      margin: 8px 0 12px;
    }

    .analysis {
      display: flex;
      align-items: center;

      .yesterday {
        color: #999;
      }

      .number {
        color: #1a1a1a;
        margin: 0 4px;
      }

      .sign {
        width: 10px;
        height: 10px;
      }
    }
  }
</style>
