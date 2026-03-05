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
  import { getSalesSiteProjectListByCondition } from '/@/api/business/siteRatio';

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
    api: params => getSalesSiteProjectListByCondition({ ...params, mainProcess: state.mainProcess || MAIN_PROCESS_ENUM.模切 }),
    columns: [
      { title: t('dict.SalesSiteColumn.terminalCustomerProjectCode'), dataIndex: 'terminalCustomerProjectCode' },
      { title: t('dict.SalesSiteColumn.terminalCustomerCode'), dataIndex: 'terminalCustomerCode' },
      { title: t('dict.SalesSiteColumn.terminalFullName'), dataIndex: 'terminalFullName' },
      { title: t('dict.SalesSiteColumn.insideProjectCode'), dataIndex: 'insideProjectCode' },
    ],
    useSearchForm: true,
    formConfig: {
      baseColProps: {
        span: 8,
      },
      schemas: [
        {
          field: 'terminalCustomerProjectCode',
          label: '',
          component: 'Input',
          labelWidth: 100,
          componentProps: { placeholder: t('dict.SalesSiteColumn.terminalCustomerProjectCode'), maxlength: 50 },
        },
        {
          field: 'terminalCustomerCode',
          label: '',
          component: 'Input',
          labelWidth: 100,
          componentProps: { placeholder: t('dict.SalesSiteColumn.terminalCustomerCode'), maxlength: 50 },
        },
        {
          field: 'terminalFullName',
          label: '',
          component: 'Input',
          labelWidth: 100,
          componentProps: { placeholder: t('dict.SalesSiteColumn.terminalFullName'), maxlength: 50 },
        },
      ],
    },
    rowKey: 'terminalCustomerProjectCode',
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
