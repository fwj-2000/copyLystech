<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-content bg-white h-full">
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_syncSAP'" type="primary" ghost @click="handleSyncSAP">{{ t('common.syncSap') }}</a-button>
            <a-button v-auth="'btn_download'" @click="batchImportFile">{{ t('common.batchImport') }}</a-button>
            <a-button v-auth="'btn_clearAllBase'" danger ghost @click="handleClear">{{ t('common.clearBaseData') }}</a-button>
          </template>
        </Grid>
      </div>
    </div>
    <ImportModal @register="registerImportPop" @refresh="reload" />
    <SAPDataModal @register="registerSAPDataPop" @refresh="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, nextTick } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { columns, importColumn } from './config';
  import { getInFactoryStock, templateDownload, importSave, importPreview, clearBaseData } from '/@/api/mps/productionPlan/inFactoryStock';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { useModal } from '/@/components/Modal';
  import { ImportModal } from '/@/components/ImportModal';
  import { ListByUserfactory } from '/@/api/productionPlan/processRoute';
  import { factoryFilterOption } from '../utils/index';
  import SAPDataModal from './components/SAPDataModal.vue';

  defineOptions({ name: 'productionPlan-main-inFactoryStock' });

  const { createMessage, createConfirm } = useMessage();
  const { t } = useI18n();

  const factoryArea = ref('');
  const firstFactoryValue = ref('');
  const frmSchema = [
    {
      fieldName: 'pickerVal',
      label: '',
      component: 'RangePicker',
      componentProps: {
        placeholder: [t('component.lydc.dateRange.startPlaceholder'), t('component.lydc.dateRange.endPlaceholder')],
      },
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
      fieldName: 'materialCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '物料',
        allowClear: true,
      },
    },
  ];

  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  const [registerSAPDataPop, { openModal: openSAPDataModal }] = useModal();
  const [Grid, { reload, getFetchParams, getFromValue, resetForm, setLatestSubmissionValues, setFieldValue }] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: false,
      // change即做查询false
      submitOnChange: false,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: frmSchema,
      i18nConfig: {
        moduleCode: 'InFactoryStockColumn',
        transferRange: ['placeholder'],
      },
      handleReset,
    },
    gridOptions: {
      id: 'productionPlan-main-inFactoryStock-list',
      showIndexColumn: true,
      columns: columns,
      api: getInFactoryStock,
      beforeFetch: params => handleParams(params),
      toolbarConfig: {
        superQuery: true,
      },
      i18nConfig: {
        moduleCode: 'InFactoryStockColumn',
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

  function handleParams(params) {
    if (params.pickerVal) {
      params.StartTime = params.pickerVal[0];
      params.EndTime = params.pickerVal[1];
      delete params.pickerVal;
    }
    params.factoryArea = factoryArea.value;
    return params;
  }

  async function batchImportFile() {
    let { factoryArea } = await getFetchParams();
    if (!factoryArea) {
      return createMessage.warning(t('dict.MPS.selectFactoryFirst'));
    }
    const params = {
      factoryArea: factoryArea,
    };
    openImportPopup(true, {
      importPreviewApi: importPreview,
      importSaveApi: importSave,
      templateApi: templateDownload,
      previewColumn: importColumn,
      usePolling: false,
      apiParams: {
        importSave: params,
      },
    });
  }
  // 清除基础表数据
  function handleClear() {
    createConfirm({
      title: '确认清除基础表数据吗？',
      iconType: 'warning',
      onOk: () =>
        clearBaseData()
          .then(res => {
            createMessage.success(res.msg || t('common.delSuccess'));
          })
          .finally(() => {
            reload();
          }),
    });
  }

  async function handleSyncSAP() {
    let { factoryArea } = await getFetchParams();
    if (!factoryArea) {
      return createMessage.warning(t('dict.MPS.selectFactoryFirst'));
    }
    openSAPDataModal(true, {
      factoryArea: factoryArea,
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
