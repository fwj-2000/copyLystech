<template>
  <div ref="printRef" class="print-content" style="page-break-after: always">
    <div class="productCode">{{ printComponentInfo.productCode }}</div>
    <div class="w-150px">
      <lydc-qrcode :width="150" :staticText="printComponentInfo.billNumber" class="ml-20px" v-if="printComponentInfo.billNumber" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useUserStore } from '/@/store/modules/user';
  import { useVueToPrint } from 'vue-to-print';

  const { t } = useI18n();
  const userStore = useUserStore();

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
  .print-content {
    width: 300px;
    height: 230px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 6px;
    margin-bottom: 10px;
    background-color: #fff;

    .content-left {
      flex: 1;

      .print-mask {
        font-size: 14px;
        line-height: 22px;
      }
    }
  }
</style>
