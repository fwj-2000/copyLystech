<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-dashboard-content bg-white h-full">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button v-auth="'btn_download'" @click="batchImportFile">{{ t('common.batchImport') }}</a-button>
            </a-space>
          </template>
        </Grid>
      </div>
    </div>
    <ImportModal @register="registerImportPop" @refresh="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, nextTick } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { columns, importColumn } from './config';
  import { getShipmentDetails, templateDownload, importSave, importPreview } from '/@/api/mps/productionPlan/shipmentDetails';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { ImportModal } from '/@/components/ImportModal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import dayjs from 'dayjs';
  import { ListByUserfactory } from '/@/api/productionPlan/processRoute';
  import { factoryFilterOption } from '../utils/index';

  defineOptions({ name: 'productionPlan-main-shipmentDetails' });

  const { t } = useI18n();
  const { createMessage } = useMessage();

  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();

  const factoryArea = ref('');
  const firstFactoryValue = ref('');
  const frmSchema = [
    {
      fieldName: 'searchDate',
      label: '',
      component: 'WeekPicker',
      componentProps: {
        placeholder: t('dict.FcDataColumn.searchDate'),
      },
      defaultValue: dayjs(new Date()),
    },
    {
      fieldName: 'factoryArea',
      label: '',
      component: 'ApiSelect',
      i18nField: 'CommonCol.factory',
      componentProps: {
        placeholder: '厂区',
        defaultFirstOption: true,
        resultField: 'data',
        labelField: 'Name',
        valueField: 'Code',
        nameFormat: ['Code', '/', 'Name'],
        api: ListByUserfactory,
        showSearch: true,
        dropdownMatchSelectWidth: false,
        filterOption: factoryFilterOption,
        onChange: async e => {
          if (!firstFactoryValue.value) {
            firstFactoryValue.value = e;
          }
          factoryArea.value = e;
          const fields = await getFromValue();
          fields.factoryArea = e;
          setLatestSubmissionValues(fields);
          nextTick(() => {
            reload();
          });
        },
      },
    },
    {
      fieldName: 'orderNo',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '订单号',
        allowClear: true,
      },
    },
    {
      fieldName: 'innerMaterialCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '物料',
        allowClear: true,
      },
    },
  ];

  const [Grid, { reload, getFetchParams, getFromValue, resetForm, setLatestSubmissionValues, setFieldValue }] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: false,
      submitOnChange: false,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: frmSchema,
      i18nConfig: {
        moduleCode: 'ShipmentDetailsColumn',
        transferRange: ['placeholder'],
      },
      handleReset,
    },
    gridOptions: {
      id: 'productionPlan-main-shipmentDetails-list',
      showIndexColumn: true,
      columns: columns,
      api: getShipmentDetails,
      beforeFetch: params => {
        const weeksDayjs = dayjs(params.searchDate);
        return {
          ...params,
          factoryArea: factoryArea.value,
          searchDate: `${weeksDayjs.endOf('week').year()}WK${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}`,
        };
      },
      toolbarConfig: {
        superQuery: true,
      },
      i18nConfig: {
        moduleCode: 'ShipmentDetailsColumn',
      },
      proxyConfig: {
        autoLoad: false,
      },
    },
  });

  async function handleReset() {
    await resetForm();
    const fields = await getFromValue();
    setLatestSubmissionValues(fields);
    setFieldValue('factoryArea', firstFactoryValue.value);
    factoryArea.value = firstFactoryValue.value;
    reload();
  }

  async function batchImportFile() {
    let { factoryArea, searchDate } = await getFetchParams();
    if (!factoryArea) {
      return createMessage.warning(t('dict.MPS.selectFactoryFirst'));
    }

    if (!searchDate) {
      return createMessage.warning(t('dict.MPS.selectWeekFirst'));
    }

    const weeksDayjs = dayjs(searchDate);

    const params = {
      factoryArea: factoryArea,
      searchDate: `${weeksDayjs.endOf('week').year()}WK${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}`,
    };

    openImportPopup(true, {
      importPreviewApi: importPreview,
      importSaveApi: importSave,
      templateApi: templateDownload,
      previewColumn: importColumn,
      usePolling: false,
      apiParams: {
        importSave: {
          ...params,
        },
      },
    });
  }
</script>

<style scoped lang="less">
  .lydc-content-wrapper {
    &-select {
      background: #fff;
      display: flex;
      align-items: flex-start;
      padding: 16px 0 0 12px;
      height: 60px;
      border: 1px solid #f0f0f0;
    }
  }

  :deep(.process-select .ant-select-selection-item) {
    color: #000;
    font-weight: bolder !important;
    font-size: 14px;
  }
</style>
