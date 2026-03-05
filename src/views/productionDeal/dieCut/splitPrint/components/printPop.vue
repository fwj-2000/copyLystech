<template>
  <BasicPopup v-bind="$attrs" @register="registerPopup" title="" destroyOnClose class="full-popup">
    <template #insertToolbar>
      <a-button @click="printFn" class="signs print">{{ t('common.printText') }}</a-button>
    </template>
    <div class="print-content h-full" ref="printRefs">
      <div class="print-refs" v-for="(item, index) in printComponentInfoList" :key="index">
        <PrintComponent :printComponentInfo="item" :typeValue="typeValue"></PrintComponent>
      </div>
    </div>
  </BasicPopup>
  <designindex v-show="false" ref="designindexPrint" />
</template>
<script lang="ts" setup>
  import { ref, nextTick } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useVueToPrint } from 'vue-to-print';
  import PrintComponent from './PrintComponent.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import designindex from '/@/views/system/printTemplate/components/LydcPrintDesign/src/designIndex.vue';
  import { getPrintTemplateDetail } from '/@/api/productionDeal/packagePrint';
  import dayjs from 'dayjs';
  defineOptions({ name: 'print-pop' });
  const { t } = useI18n();

  const printRefs = ref();

  const printComponentInfoList = ref<any[]>([]);

  const [registerPopup] = usePopupInner(init);
  const typeValue = ref('');
  interface designindexPrintType {
    clickTemplate: (data: any) => void;
    previewPrint: (data: any) => void;
  }
  const designindexPrint = ref<designindexPrintType>();
  function init(dataList) {
    printComponentInfoList.value = dataList.row;
    typeValue.value = dataList.type;
  }

  const printFn = async () => {
    // nextTick(() => {
    //   handlePrint();
    // });
    printComponentInfoList.value.forEach(item => {
      item.operatorIdName = item.operatorIdName.slice(-8);
      item.rawMatProDate = dayjs(item.rawMatProDate).format('YYYY-MM-DD');
      item.rawMatEffDate = dayjs(item.rawMatEffDate).format('YYYY-MM-DD');
      item.nowDate = dayjs(new Date()).format('YYYY-MM-DD');
    });
    console.log(printComponentInfoList.value, '111arr');

    getPrintTemplateDetail('754218485667594181').then(res => {
      if (designindexPrint.value && designindexPrint.value.clickTemplate) {
        designindexPrint.value.clickTemplate(res.data);
        designindexPrint.value.previewPrint(printComponentInfoList.value);
      }
    });
  };

  const { handlePrint } = useVueToPrint({
    content: () => printRefs.value,
    documentTitle: '',
    removeAfterPrint: true,
    pageStyle: `
      body {
        min-width: 210mm !important; /* 适配A4宽度 */
      }
    `,
  });
</script>
<style lang="less">
  @media all {
    .page-break {
      display: block;
    }
  }

  @media print {
    /* 隐藏所有滚动条 */
    ::-webkit-scrollbar {
      display: none !important;
    }

    html,
    body,
    .print-wrap {
      height: auto !important;
      overflow: visible !important;
      -webkit-print-color-adjust: exact;
    }

    .page-break {
      margin-top: 3rem;
      display: block;
      page-break-before: always;
      break-before: page;
    }
  }

  @page {
    @bottom-left {
      content: '';
    }
    @top-left {
      content: '';
    }
    @top-right {
      content: '';
    }
    // size: a4 portrait;
    size: landscape; // 设置横向打印
  }

  .print-content {
    background: @app-main-background;
    // background: @component-background;

    overflow: auto;
    position: relative;
    padding: 0;
  }
</style>
