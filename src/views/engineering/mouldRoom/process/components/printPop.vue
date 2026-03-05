<template>
  <BasicPopup v-bind="$attrs" @register="registerPopup" title="" destroyOnClose class="full-popup">
    <template #insertToolbar>
      <a-button @click="printFn" class="signs print">{{ t('common.printText') }}</a-button>
    </template>
    <div class="print-content h-full">
      <div ref="printRefs">
        <PrintComponent v-for="(item, index) in printComponentInfoList" style="page: process" :key="index" :printComponentInfo="item"></PrintComponent>
      </div>
    </div>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { ref, nextTick } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useVueToPrint } from 'vue-to-print';
  import { getprocessprintlist } from '/@/api/engineering/mould';
  import PrintComponent from './PrintComponent.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';

  defineOptions({ name: 'print-pop' });
  const emits = defineEmits(['refresh']);
  const { t } = useI18n();

  const printRefs = ref();

  const printComponentInfoList = ref<any[]>([]);

  const { createConfirm } = useMessage();
  const [registerPopup, { changeLoading }] = usePopupInner(init);

  const renderPrintTemplate = async isPrintLabel => {
    const { data } = await getprocessprintlist({
      partRelationIds: partRelationIds.value,
      isPrintLabel,
    });
    printComponentInfoList.value = data;
  };

  const partRelationIds = ref<string[]>([]);
  async function init(record) {
    partRelationIds.value = record;
    changeLoading(true);
    await renderPrintTemplate(0);
    changeLoading(false);
  }

  const printFn = () => {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.CommonCol.processPrintTip'),
      onOk: async () => {
        await renderPrintTemplate(1);
        setTimeout(() => {
          handlePrint();
          emits('refresh');
        }, 500);
      },
    });
  };

  // const handlePrint = async () => {
  //   for (let i = 0; i < printRefs.value.length; i++) {
  //     await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒
  //     printRefs.value[i].handlePrint();
  //   }
  // };

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

  @page process {
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
