<template>
  <BasicPopup v-bind="$attrs" @register="registerPopup" title="" destroyOnClose class="full-popup">
    <template #insertToolbar>
      <a-button @click="handlePrint" class="signs print">{{ t('common.printText') }}</a-button>
    </template>
    <Grid>
      <template #toolbar-actions>
        <a-space>
          <LydcInput v-model:value="billNumber" :placeholder="t('dict.CommonCol.documentNumber')" @Keydown="handlerInputKeydown" />
        </a-space>
      </template>
    </Grid>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { geTemplabelList } from '/@/api/basicData/moduleRules';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { message } from 'ant-design-vue';

  defineOptions({ name: 'print-pop' });
  const { t } = useI18n();
  const emit = defineEmits(['handleReprint']);

  const productCode = ref('');
  const billNumber = ref('');

  const columns = [
    { field: 'checkbox', width: 50, type: 'checkbox' },
    {
      title: t('dict.CommonCol.documentNumber'),
      field: 'billNumber',
      width: 300,
      filters: [{ data: '' }],
      filterRender: {
        name: 'Input',
      },
    },
  ];

  const [registerPopup, { closePopup }] = usePopupInner(init);

  const [Grid, { reload, getSelectRows }] = useVbenVxeGrid({
    gridOptions: {
      id: 'basicData-produceCodeRules-ptintList',
      columns,
      api: geTemplabelList,
      showIndexColumn: true,
      beforeFetch: params => {
        return {
          ...params,
          productCode: productCode.value,
          billNumber: billNumber.value,
        };
      },
      rowConfig: {
        keyField: 'billNumber',
      },
    },
  });

  function init(data) {
    productCode.value = data.IDField;
    billNumber.value = '';
    reload();
  }
  const handlerInputKeydown = (e: any) => {
    if (e.keyCode !== 13) return;
    reload();
    billNumber.value = '';
  };

  const handlePrint = () => {
    const rows = getSelectRows();
    if (!rows.length) return message.error(t('dict.CheckDataTip'));
    emit('handleReprint', rows);
    closePopup();
  };
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
