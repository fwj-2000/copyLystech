<template>
  <BasicModal
    v-bind="$attrs"
    :width="900"
    :height="600"
    :title="t('dict.SalesSiteColumn.recordModalTitle')"
    destroyOnClose
    class="batch-modal"
    :showOkBtn="false"
    @register="registerModal">
    <BasicTable :style="{ minHeight: '400px' }" @register="registerSubTable"></BasicTable>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive, toRaw } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  import { formatTableDefaultText } from '/@/utils';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getSalesShipPatternModifyLogs } from '/@/api/business/materialRatio';
  import { omit } from 'lodash-es';
  import Decimal from 'decimal.js';

  const { t } = useI18n();
  const emit = defineEmits(['reload']);

  const state = reactive({
    terminalCustomerPartNumber: '',
    mainProcess: '',
  });

  const [registerModal] = useModalInner(init);
  function init(record: any) {
    state.terminalCustomerPartNumber = record.terminalCustomerPartNumber;
    state.mainProcess = record.mainProcess || 1;
  }

  const [registerSubTable] = useTable({
    api: getSalesShipPatternModifyLogs,
    columns: [
      { title: '主要制程', dataIndex: 'mainProcessDesc' },
      { title: '终端客户料号', dataIndex: 'terminalCustomerPartNumber' },
      { title: 'Site', dataIndex: 'site' },
      { title: '直接客户', dataIndex: 'immediateCustomerName' },
      { title: '片卷料形态', dataIndex: 'shipPatternDesc' },
      { title: '修改前数值', dataIndex: 'originData', format: formatRatioValue },
      { title: '修改后数值', dataIndex: 'modifyData', format: formatRatioValue },
      { title: '修改人', dataIndex: 'modifyUserName' },
      { title: '修改时间', dataIndex: 'modifyDateTime', format: 'date|YYYY-MM-DD HH:mm' },
    ],
    useSearchForm: false,
    rowKey: 'id',
    striped: true,
    ellipsis: true,
    showTableSetting: false,
    isCanResizeParent: true,
    canResize: true,
    scroll: {
      y: 400,
    },
    resizeHeightOffset: 20,
    showIndexColumn: false,
    transformCellText: ({ text }) => formatTableDefaultText(text),
    beforeFetch: () => toRaw(state),
    afterFetch: data => {
      if (!Array.isArray(data) || !data.length) {
        return [];
      }
      return data.flatMap((item: any) => {
        const logs = item.Logs || [];
        const content = omit(item, ['Logs']);

        if (Array.isArray(logs) && logs.length) {
          return logs.map(log => ({
            ...log,
            ...content,
          }));
        } else {
          return [content];
        }
      });
    },
    i18nConfig: {
      moduleCode: 'SalesShipPattern.recordTable',
    },
  });

  function formatRatioValue(value: number | string | undefined) {
    return value === undefined || Number.isNaN(+value) ? '/' : `${Decimal.mul(+value, 100)}%`;
  }
</script>
