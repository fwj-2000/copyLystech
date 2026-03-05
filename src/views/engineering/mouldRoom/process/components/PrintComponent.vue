<template>
  <div ref="printRef" class="tem_list" style="page-break-after: always">
    <div class="print-header">
      <img src="/@/assets/images/lylogo2.png" class="logo" alt="Logo" />
      <div class="title">
        <div class="mr-6px">{{ t('dict.CommonCol.lydc') }}</div>
        <div>{{ t('dict.CommonCol.moldProcessCard') }}</div>
      </div>
    </div>
    <div class="print-top mb-10px pr-50px">
      <div class="mold-info mt-6px mb-6px">
        <div class="info-item">{{ t('dict.CommonCol.deliveryLevel') }}：{{ t('dict.CommonCol.urgent') }}</div>
        <div class="info-item">{{ t('dict.CommonCol.OrderNo') }}：{{ printComponentInfo.workOrderNo }}</div>
        <div class="info-item">{{ t('dict.MoldApplyColumn.factoryMoldNo') }}：{{ printComponentInfo.factoryMoldNo }}</div>
        <div class="info-item">{{ t('dict.CommonCol.orderDate') }}：{{ dayjs(printComponentInfo.orderDate).format('YYYY-MM-DD') }}</div>

        <div class="info-item">{{ t('dict.CommonCol.processingType') }}：{{ printComponentInfo.workOrderType }}</div>
        <div class="info-item">{{ t('dict.CommonCol.materialQuality') }}：{{ printComponentInfo.partMaterial }}</div>
        <div class="info-item">{{ t('dict.CommonCol.moldNo') }}：{{ printComponentInfo.moldNo }}</div>
        <div class="info-item">
          {{ t('dict.MoldApplyColumn.deliveryTime') }}：{{
            printComponentInfo.t0DeliveryDate ? dayjs(printComponentInfo.t0DeliveryDate).format('YYYY-MM-DD') : ''
          }}
        </div>

        <div class="info-item">{{ t('dict.CommonCol.partQuantity') }}：{{ printComponentInfo.partQuantity }}</div>
        <div class="info-item">{{ t('dict.CommonCol.partName') }}：{{ printComponentInfo.partName }}</div>
        <div class="info-item">{{ t('dict.CommonCol.partNo') }}： {{ printComponentInfo.partNo }}</div>
        <div class="info-item">{{ t('dict.CommonCol.version') }}：{{ printComponentInfo.bomVersion }}</div>
      </div>
      <div class="w-[100px] h-[100px]">
        <!-- <lydc-qrcode :staticText="printComponentInfo.qrCode" class="ml-20px" v-if="printComponentInfo.qrCode" /> -->
        <vue-qr style="width: 100px; height: 100px" :text="printComponentInfo.qrCode" :margin="0"></vue-qr>
      </div>
    </div>

    <div class="education-card" v-if="printComponentInfo.routeList && printComponentInfo.routeList.length">
      <table>
        <!-- 表头 -->
        <thead>
          <tr>
            <th style="width: 4%">{{ t('dict.CommonCol.order') }}</th>
            <th>{{ t('dict.CommonCol.process') }}</th>
            <th style="width: 7%">{{ t('dict.CommonCol.estimatedWorkHours') }}</th>
            <th style="width: 40%">{{ t('dict.CommonCol.processRequirements') }}</th>
            <th style="width: 10%">{{ t('dict.CommonCol.expectedStartTime') }}</th>
            <th style="width: 10%">{{ t('dict.CommonCol.expectedEndDate') }}</th>
            <th style="width: 10%">{{ t('dict.CommonCol.processor') }}</th>
            <th style="width: 10%">{{ t('dict.CommonCol.remark') }}</th>
          </tr>
        </thead>
        <!-- 表格内容 -->
        <tbody>
          <tr v-for="(item, index) in printComponentInfo.routeList" :key="index">
            <td style="width: 4%">{{ index + 1 }}</td>
            <td>{{ item.processName }}</td>
            <td style="width: 7%">{{ item.presetDuration }}</td>
            <td style="width: 40%" class="process-demand">{{ item.processDemand }}</td>
            <td style="width: 10%">{{ item.startTime }}</td>
            <td style="width: 10%">{{ item.endTime }}</td>
            <td style="width: 10%">{{ item.person }}</td>
            <td style="width: 10%">{{ item.remark }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="print-person mt-12px">
      <span class="mr-12px">{{ t('dict.CommonCol.printPerson') }}：{{ userInfo.userName }}</span>
      <span>{{ t('dict.CommonCol.date') }}：{{ dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import dayjs from 'dayjs';
  import { useUserStore } from '/@/store/modules/user';
  import { useVueToPrint } from 'vue-to-print';
  import vueQr from 'vue-qr/src/packages/vue-qr.vue';

  const { t } = useI18n();
  const userStore = useUserStore();
  const userInfo = userStore.getUserInfo;

  const props = defineProps({
    printComponentInfo: {
      type: Object,
      default: () => ({}),
    },
  });

  const printRef = ref();
  const { handlePrint } = useVueToPrint({
    content: () => printRef.value,
    documentTitle: '',
    removeAfterPrint: true,
    pageStyle: `
      body {
        min-width: 210mm !important; /* 适配A4宽度 */
      }
    `,
  });
  defineExpose({ handlePrint });
</script>
<style lang="less" scoped>
  .tem_list {
    width: 1000px;
    margin: 0 auto;
    background: @component-background;
    position: relative;
    padding: 8px 20px 15px;
    font-size: 14px;
    margin-bottom: 10px;
  }

  .print-header {
    display: flex;
    align-items: center;
    justify-content: center;

    .logo {
      width: 40px;
      margin-right: 6px;
    }

    .title {
      font-weight: 700;
      text-align: center;
      line-height: 26px;
      font-size: 22px;
      display: flex;
      align-items: center;
    }
  }

  .print-top {
    display: flex;

    .mold-info {
      display: flex;
      flex-wrap: wrap;
      // width: 80%;
      flex: 1;

      .info-item {
        width: 25%;
        padding: 2px 0;
        font-size: 14px;
      }
    }
  }

  .education-card {
    width: 950px;
    margin: 0 auto;
  }

  .education-card table {
    width: 100%;
    border-collapse: collapse;
  }

  .process-demand {
    word-break: break-all;
  }

  .education-card th,
  td {
    border: 1px solid #000;
    padding: 4px;
    text-align: center;
    font-size: 12px;
    line-height: 14px;
  }

  .print-person {
    display: flex;
    justify-content: flex-end;
    font-size: 13px;
  }
</style>
