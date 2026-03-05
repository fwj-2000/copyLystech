<!--
 * @Author: zengjianyu zeng.jian.yu@lingyiitech.com
 * @Date: 2025-01-17 13:31:16
 * @LastEditors: zengjianyu zeng.jian.yu@lingyiitech.com
 * @LastEditTime: 2025-02-10 08:47:40
 * @FilePath: \lydc.server.web\src\views\business\basicInformation\materialRatio\components\batchAddModal.vue
 * @Description: 新增页面 - 批量选择终端客户料号弹窗
-->
<template>
  <BasicModal
    v-bind="$attrs"
    :width="900"
    :height="600"
    :title="t('common.batchImport')"
    destroyOnClose
    class="batch-modal"
    @register="registerModal"
    @ok="handleSubmit">
    <BasicTable :style="{ minHeight: '400px' }" @register="registerSubTable"></BasicTable>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  import { formatTableDefaultText } from '/@/utils';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { MAIN_PROCESS_ENUM } from '/@/views/business/salesForecast/config';
  import { getSalesShipPatternProjectListByCondition } from '/@/api/business/materialRatio';

  const { t } = useI18n();
  const emit = defineEmits(['reload']);

  const [registerModal, { closeModal }] = useModalInner(init);

  const state = reactive({
    mainProcess: '',
  });
  function init(data: any) {
    state.mainProcess = data.mainProcess;
  }
  const [registerSubTable, { getSelectRows }] = useTable({
    api: params => getSalesShipPatternProjectListByCondition({ ...params, mainProcess: state.mainProcess || MAIN_PROCESS_ENUM.模切 }),
    columns: [
      { title: t('dict.SalesSiteColumn.terminalCustomerPartNumber'), dataIndex: 'terminalCustomerPartNumber' },
      { title: t('dict.SalesSiteColumn.terminalCustomerCode'), dataIndex: 'terminalCustomerCode' },
      { title: t('dict.SalesSiteColumn.terminalCustomerProjectCode'), dataIndex: 'terminalCustomerProjectCode' },
      { title: t('dict.SalesSiteColumn.immediateCustomerName'), dataIndex: 'immediateCustomerName' },
    ],
    useSearchForm: true,
    formConfig: {
      baseColProps: {
        span: 8,
      },
      schemas: [
        {
          field: 'terminalCustomerPartNumber',
          label: '',
          component: 'Input',
          labelWidth: 100,
          componentProps: { placeholder: t('dict.SalesSiteColumn.terminalCustomerPartNumber'), maxlength: 50 },
        },
        {
          field: 'terminalCustomerCode',
          label: '',
          component: 'Input',
          labelWidth: 100,
          componentProps: { placeholder: t('dict.SalesSiteColumn.terminalCustomerCode'), maxlength: 50 },
        },
        {
          field: 'terminalCustomerProjectCode',
          label: '',
          component: 'Input',
          labelWidth: 100,
          componentProps: { placeholder: t('dict.SalesSiteColumn.terminalCustomerProjectCode'), maxlength: 50 },
        },
        {
          field: 'immediateCustomerName',
          label: '',
          component: 'Input',
          labelWidth: 100,
          componentProps: { placeholder: t('dict.SalesSiteColumn.immediateCustomerName'), maxlength: 50 },
        },
      ],
    },
    rowKey: 'terminalCustomerPartNumber',
    striped: true,
    ellipsis: true,
    showTableSetting: false,
    isCanResizeParent: true,
    canResize: true,
    scroll: {
      y: 400,
    },
    rowSelection: { type: 'checkbox' },
    resizeHeightOffset: 20,
    showIndexColumn: false,
    transformCellText: ({ text }) => formatTableDefaultText(text),
  });

  function handleSubmit() {
    closeModal();
    emit('reload', getSelectRows());
  }
</script>
