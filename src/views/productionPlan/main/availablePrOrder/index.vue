<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-dashboard-content bg-white h-full">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button @click="batchImportFile">{{ t('common.batchImport') }}</a-button>
            </a-space>
          </template>
        </Grid>
      </div>
    </div>
    <ImportModal @register="registerImportPop" @refresh="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { columns, frmSchema, importColumn } from './config';
  import { getAvailablePrOrder, templateDownload, importSave, importPreview } from '/@/api/mps/productionPlan/availablePrOrder';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { ImportModal } from '/@/components/ImportModal';
  import { useMessage } from '/@/hooks/web/useMessage';

  defineOptions({ name: 'productionPlan-main-availablePrOrder' });

  const { t } = useI18n();
  const { createMessage } = useMessage();

  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: false,
      submitOnChange: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: frmSchema(),
      i18nConfig: {
        moduleCode: 'AvailablePrOrderColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'productionPlan-main-availablePrOrder-list',
      showIndexColumn: true,
      columns: columns,
      api: getAvailablePrOrder,
      beforeFetch: params => handleParams(params),
      toolbarConfig: {
        superQuery: true,
      },
      proxyConfig: {
        autoLoad: false,
      },
      i18nConfig: {
        moduleCode: 'AvailablePrOrderColumn',
      },
    },
  });

  function handleParams(params) {
    if (params.pickerVal) {
      params.StartTime = params.pickerVal[0];
      params.EndTime = params.pickerVal[1];
      delete params.pickerVal;
    }

    return params;
  }

  async function batchImportFile() {
    let { factoryArea } = await gridApi.getFetchParams();
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
  function reload() {
    gridApi.reload();
  }

  onMounted(() => {
    reload();
  });
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
