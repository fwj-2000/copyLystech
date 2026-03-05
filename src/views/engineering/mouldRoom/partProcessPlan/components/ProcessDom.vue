<template>
  <div class="process-dom">
    <div class="route-item" v-for="(item, index) in row.planDetailList" :key="index">
      <div class="route-line">
        <div class="line-content">{{ item.processName }} {{ item.presetDuration }}</div>
        <div class="right-arrow" v-if="index !== row.planDetailList.length - 1"> → </div>
      </div>
      <div class="route-line">
        <div class="line-content">{{ dayjs(item.planStartTime).format('YYYY/MM/DD HH:mm:ss') }}</div>
        <div class="right-arrow" v-if="index !== row.planDetailList.length - 1"> → </div>
      </div>
      <!-- <div class="route-line">
        <div class="line-content">
          <div :class="['rate-block', item.goodRate === 0 ? 'gray-rate' : 'green-rate']">
            <div class="rate-left">{{ item.goodRate }}%</div>
            <div class="rate-right">{{ t('dict.CommonCol.yield') }}</div>
          </div>
        </div>
        <div class="right-arrow" v-if="index !== row.planDetailList.length - 1"> → </div>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
  import dayjs from 'dayjs';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
  const props = defineProps({
    row: {
      type: Object,
      default: () => ({}),
    },
  });

  setTimeout(() => {
    console.log('props', props);
  });
</script>
<style lang="less" scoped>
  .process-dom {
    display: flex;
    padding: 0 10px;

    .route-item {
      margin-right: 6px;

      &:last-child {
        margin-right: 0;
      }

      .route-line {
        display: flex;
        align-items: center;
        min-height: 22px;

        .line-content {
          width: 100%;
          padding-right: 4px;

          .rate-block {
            display: flex;
            width: 86px;
            border-radius: 38px;
            color: #fff;
            font-size: 12px;
            line-height: 18px;
            height: 18px;

            .rate-left {
              width: 34px;
              border-radius: 38px;
              text-align: center;
            }

            .rate-right {
              flex: 1;
              text-align: center;
            }
          }

          .blue-rate {
            background: rgb(24 144 255 / 10%);

            .rate-left {
              background: #1890ff;
            }

            .rate-right {
              color: #1890ff;
            }
          }

          .green-rate {
            background: rgb(82 196 26 / 10%);

            .rate-left {
              background: #52c41a;
            }

            .rate-right {
              color: #52c41a;
            }
          }

          .gray-rate {
            background: #e6e6e6;
            color: #1a1a1a;

            .rate-left {
              background: #e6e6e6;
            }
          }

          .red-rate {
            background: rgb(255 77 79 / 10%);

            .rate-left {
              background: #ff4d4f;
            }

            .rate-right {
              color: #ff4d4f;
            }
          }
        }
      }
    }
  }
</style>
