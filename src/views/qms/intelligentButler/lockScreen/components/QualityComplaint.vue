<template>
  <div class="quality-complaint">
    <!-- 工时达成看板 -->
    <div class="no-data" v-if="!customerComplaintList.length">
      <img src="/@/assets/svg/noData.svg" alt="" class="no-data-img" />
      <span class="no-data-text">暂无数据</span>
    </div>
    <div class="quality-card" v-else>
      <div class="card-item" v-for="(item, index) in customerComplaintList" :key="index">
        <a-image :src="lydc" class="w-[100%] h-[140px] item-icon" alt="" />
        <div class="item-desc">
          <div class="desc">
            <div class="desc-label">{{ t('dict.AbnormalTimelinessMonitoringColumn.exceptionType') }}：</div>
            <div class="desc-content">1111112322321111</div>
          </div>
          <div class="desc">
            <div class="desc-label">{{ t('dict.AbnormalTimelinessMonitoringColumn.causeAnalysis') }}：</div>
            <div class="desc-content">222222222</div>
          </div>
          <div class="desc">
            <div class="desc-label">{{ t('dict.AbnormalTimelinessMonitoringColumn.abnormalTime') }}：</div>
            <!-- <div class="desc-content">{{ item.createTime ? dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss') : '/' }}</div> -->
            <div class="desc-content">22233222222222223333</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import lydc from '/@/assets/images/lydc.png';
  const { t } = useI18n();

  const customerComplaintList = ref([1, 1, 1, 1, 1, 1, 1, 11]);
  const props = defineProps({
    utilizationAchievementInfo: {
      type: Object,
      default: () => ({}),
    },
    chartData: {
      type: Object,
      default: () => ({
        xAxisData: [],
        seriesData: [],
      }),
    },
    activeKey: {
      type: String,
      default: '',
    },
  });

  onMounted(() => {});
</script>
<style lang="less" scoped>
  .quality-complaint {
    padding: 12px;
    display: flex;
    height: 100%;
    overflow: scroll;

    .no-data {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      .no-data-img {
        width: 96px;
        margin: 100px 0 10px;
      }
    }

    .quality-card {
      width: 100%;
      display: flex;
      flex-wrap: wrap;

      .card-item {
        height: fit-content;
        width: calc((100% - 36px) / 3);
        border-radius: 4px;
        box-shadow: 0 0 9.025px 0 rgb(0 0 0 / 16%);
        margin-top: 12px;
        margin-right: 12px;

        &:nth-child(3n) {
          margin-right: 0;
        }

        &:nth-child(1),
        &:nth-child(2),
        &:nth-child(3) {
          margin-top: 0;
        }

        ::v-deep(.ant-image) {
          border-radius: 4px 4px 0 0;
          width: 100%;
          height: 120px;

          .item-icon {
            border-radius: 4px 4px 0 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .item-desc {
          padding: 6px;

          .desc {
            display: flex;
            font-size: 14px;
            line-height: 20px;
            margin-top: 4px;

            .desc-label {
              color: rgb(26 26 26 / 70%);
            }

            .desc-content {
              color: #1a1a1a;
              flex: 1;
              word-break: break-all;
            }
          }
        }
      }
    }
  }
</style>
