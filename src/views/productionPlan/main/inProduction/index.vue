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
  import { getInProduction, templateDownload, importSave, importPreview } from '/@/api/mps/productionPlan/inProduction';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { ImportModal } from '/@/components/ImportModal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ListByUserfactory } from '/@/api/productionPlan/processRoute';
  import { factoryFilterOption } from '../utils/index';

  defineOptions({ name: 'productionPlan-main-inProduction' });

  const { t } = useI18n();
  const { createMessage } = useMessage();

  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();

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
        moduleCode: 'InProductionColumn',
        transferRange: ['placeholder'],
      },
      handleReset,
    },
    gridOptions: {
      id: 'productionPlan-main-inProduction-list',
      showIndexColumn: true,
      columns: columns,
      api: getInProduction,
      beforeFetch: params => handleParams(params),
      toolbarConfig: {
        superQuery: true,
      },
      i18nConfig: {
        moduleCode: 'InProductionColumn',
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
