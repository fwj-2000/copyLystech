<template>
  <div ref="printRef" class="print-content" :style="{ width: typeValue === 'small' ? '480px' : '560px' }">
    <div class="content-left">
      <div class="print-mask">{{ t('dict.CommonCol.material') }}：{{ printComponentInfo.splitMatCode }}</div>
      <div class="print-mask">{{ t('dict.CommonCol.materialBatch') }}：{{ printComponentInfo.rawMatBatch }}</div>
      <div class="print-mask">{{ t('dict.CommonCol.materialSpecs') }}：{{ printComponentInfo.splitMatSpecs }}</div>
      <div class="print-mask">{{ t('dict.CommonCol.productName') }}：{{ printComponentInfo.productCode }}</div>
      <div class="print-mask">{{ t('dict.CommonCol.operator') }}：{{ printComponentInfo.operatorIdName.slice(-8) }}</div>
      <div class="print-mask">{{ t('dict.CommonCol.produceDate') }}：{{ dayjs(printComponentInfo.rawMatProDate).format('YYYY-MM-DD') }}</div>
      <div class="print-mask">{{ t('dict.CommonCol.materialEffectiveDate') }}：{{ dayjs(printComponentInfo.rawMatEffDate).format('YYYY-MM-DD') }}</div>
      <div class="print-mask">{{ t('dict.CommonCol.printDate') }}：{{ dayjs(new Date()).format('YYYY-MM-DD') }}</div>
    </div>
    <div class="w-[200px] h-[200px] flex flex-col justify-center items-center">
      <div class="mb-4px label-type">{{ printComponentInfo.labelType === 1 ? t('dict.splitPrintLabelType.1') : t('dict.splitPrintLabelType.2') }}</div>
      <!-- <lydc-qrcode width="200" :staticText="printComponentInfo.qrCode" class="ml-20px" v-if="printComponentInfo.qrCode" /> -->
      <vue-qr style="width: 170px; height: 170px" :size="300" :margin="0" :text="printComponentInfo.qrCode"></vue-qr>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVueToPrint } from 'vue-to-print';
  import dayjs from 'dayjs';
  import vueQr from 'vue-qr/src/packages/vue-qr.vue';
  const { t } = useI18n();

  defineProps({
    printComponentInfo: {
      type: Object,
      default: () => ({}),
    },
    typeValue: {
      type: String,
      default: 'small',
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
  .print-content {
    height: 226px;
    overflow: hidden;
    display: flex;
    align-items: center;
    padding: 6px 4px 6px 30px;
    background-color: #fff;
    margin-bottom: 15px;

    .content-left {
      flex: 1;

      .print-mask {
        font-size: 18px;
        line-height: 25px;
      }
    }

    .label-type {
      border: 1px solid #000;
      border-radius: 50%;
      padding: 4px 12px;
      font-size: 16px;
    }
  }
</style>
