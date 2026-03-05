<template>
  <BasicPopup v-bind="$attrs" @register="registerPopup" title="" destroyOnClose class="full-popup">
    <template #insertToolbar>
      <a-button @click="printFn" class="signs print">{{ t('common.printText') }}</a-button>
    </template>
    <div class="print-content h-full">
      <div ref="printRefs" class="print-refs">
        <PrintComponent :printComponentInfo="printComponentInfoList"></PrintComponent>
      </div>
    </div>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { ref, nextTick } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useVueToPrint } from 'vue-to-print';
  import PrintComponent from './PrintComponent.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  defineOptions({ name: 'print-pop' });
  const { t } = useI18n();

  const printRefs = ref();

  const printComponentInfoList = ref<any>({});

  const [registerPopup, { changeLoading }] = usePopupInner(init);

  function init(dataList) {
    printComponentInfoList.value = dataList;
  }

  const printFn = async () => {
    nextTick(() => {
      handlePrint();
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
