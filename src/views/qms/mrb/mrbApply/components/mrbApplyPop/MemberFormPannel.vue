<template>
  <div class="member-pannel">
    <div class="pannel-title">{{ title }}</div>
    <div class="person-info">
      <div class="info-left">
        <div :class="['status', reviewTime ? 'active-status' : '']"></div>
        <span class="person-name mr-[10px]">{{ personName }}</span>
        <LydcTag v-if="tagStatus[result]" :theme="tagStatus[result].theme" :text="tagStatus[result].text"></LydcTag>
      </div>
      <span class="time-cost" v-if="reviewTakeTime">{{ t('component.nodeModal.table.duration') }}：{{ reviewTakeTime }}</span>
    </div>
    <div class="review-time" v-if="reviewTime">{{ t('dict.DrawingsReviewColumn.reviewTime') }}：{{ dayjs(reviewTime).format('YYYY-MM-DD HH:mm:ss') }}</div>
    <div class="review-remark" v-if="reviewRemark">{{ reviewRemark }}</div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import dayjs from 'dayjs';
  import { useI18n } from '/@/hooks/web/useI18n';

  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    personName: {
      type: String,
      default: '',
    },
    result: {
      type: Number,
      default: 0,
    },
    reviewTakeTime: {
      type: String,
      default: '',
    },
    reviewTime: {
      type: String,
      default: '',
    },
    reviewRemark: {
      type: String,
      default: '',
    },
  });

  const tagStatus = ref({
    1: {
      text: '允收',
      theme: 'blue',
    },
    2: {
      text: '挑选',
      theme: 'yellow',
    },
    3: {
      text: '退货',
      theme: 'red',
    },

    4: {
      text: '特采',
      theme: 'purple',
    },
    5: {
      text: '返工',
      theme: 'red',
    },
    6: {
      text: '报废',
      theme: 'gray',
    },
    7: {
      text: '复判',
      theme: 'red',
    },
  });

  const { t } = useI18n();
</script>

<style lang="less" scoped>
  .member-pannel {
    margin-right: 20px;
    width: 30%;
    border: 1px solid #d5d5d5;
    padding: 14px 16px 20px;

    .pannel-title {
      color: #1d2129;
      font-size: 16px;
      line-height: 22px;
      font-weight: 700;
    }

    .person-info {
      margin-left: 4px;
      margin-top: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .info-left {
        display: flex;
        align-items: center;
        flex: 1;

        .status {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 10px;
          background-color: #999;
        }

        .active-status {
          background-color: #ff7b00;
        }

        .person-name {
          color: #1d2129;
          font-size: 14px;
          line-height: 22px;
        }
      }

      .time-cost {
        color: #ff7b00;
        font-size: 14px;
        line-height: 22px;
      }
    }

    .review-time {
      color: #86909c;
      font-size: 12px;
      line-height: 22px;
      margin-left: 24px;
    }

    .review-remark {
      padding: 10px;
      margin-left: 24px;
      border-radius: 4px;
      background: #eee;
    }
  }
</style>
