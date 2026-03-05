<template>
  <div class="opera-block mb-10px">
    <a-button v-if="customerComplaintList.length" @click="exportFn">{{ t('common.batchExport') }}</a-button>
  </div>
  <div class="efficiency-achievement">
    <!-- 工时达成看板 -->
    <div class="no-data" v-if="!customerComplaintList.length">
      <img src="/@/assets/svg/noData.svg" alt="" class="no-data-img" />
      <span class="no-data-text">暂无数据</span>
    </div>
    <div class="quality-card" v-else>
      <div class="card-item" v-for="(item, index) in customerComplaintList" :key="index">
        <a-image :src="`data:image/png;base64,${item.imageFile}`" class="w-[100%] h-[140px] item-icon" alt="" />
        <div class="item-desc">
          <div class="desc">
            <div class="desc-label">{{ t('dict.AbnormalTimelinessMonitoringColumn.exceptionTypeName') }}：</div>
            <div class="desc-content">{{ item.exceptionType }}</div>
          </div>
          <div class="desc">
            <div class="desc-label">{{ t('dict.AbnormalTimelinessMonitoringColumn.causeAnalysis') }}：</div>
            <div class="desc-content">{{ item.problemDescription }}</div>
          </div>
          <div class="desc">
            <div class="desc-label">{{ t('dict.AbnormalTimelinessMonitoringColumn.abnormalTime') }}：</div>
            <div class="desc-content">{{ item.createTime ? dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss') : '/' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { watch } from 'vue';
  import { qualityCustomerComplaintReport } from '/@/api/qms/iqc/abnormalTimelinessMonitoring';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { downloadByUrl } from '/@/utils/file/download';
  import dayjs from 'dayjs';
  const { t } = useI18n();
  const props = defineProps({
    customerComplaintList: {
      type: Array as PropType<{ imageFile: string; exceptionType: string; problemDescription: string; createTime: string }[]>,
      default: () => [],
    },
    searchInfo: {
      type: Object as PropType<{ innerMaterialCode: string }>,
      default: () => ({}),
    },
  });

  watch(
    () => props.customerComplaintList,
    () => {
      console.log('props.customerComplaintList', props.customerComplaintList);
    },
  );
  function exportFn() {
    qualityCustomerComplaintReport({ innerMaterialCode: props.searchInfo.innerMaterialCode }).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
    });
  }
</script>
<style lang="less" scoped>
  .efficiency-achievement {
    display: flex;
    height: 550px;
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
        width: calc((100% - 42px) / 4);
        border-radius: 4px;
        box-shadow: 0 0 9.025px 0 rgb(0 0 0 / 16%);
        margin-top: 14px;
        margin-right: 14px;

        &:nth-child(4n) {
          margin-right: 0;
        }

        &:nth-child(1),
        &:nth-child(2),
        &:nth-child(3),
        &:nth-child(4) {
          margin-top: 0;
        }

        ::v-deep(.ant-image) {
          border-radius: 4px 4px 0 0;
          width: 100%;
          height: 150px;

          .item-icon {
            border-radius: 4px 4px 0 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .item-desc {
          padding: 14px;

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
            }
          }
        }
      }
    }
  }
</style>
