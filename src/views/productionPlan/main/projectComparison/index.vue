<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-dashboard-content bg-white h-full">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button type="primary" @click="handleAdd"> {{ t('common.add2Text') }} </a-button>
              <a-button @click="batchImportFile">{{ t('common.batchImport') }}</a-button>
              <a-button danger @click="handleDeleteList()"> {{ t('common.batchDelText') }} </a-button>
            </a-space>
          </template>

          <template #action="{ row }">
            <TableAction :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <FormModal @register="registerFormModal" @reload="reload" />
    <ImportModal @register="registerImportPop" @refresh="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, watch } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { columns, frmSchema, importColumn } from './config';
  import {
    getProjectComparison,
    deleteProjectComparison,
    blukDeleteProjectComparison,
    templateDownload,
    importPreview,
    importSave,
  } from '/@/api/mps/productionPlan/projectComparison';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { useModal } from '/@/components/Modal';
  import { ImportModal } from '/@/components/ImportModal';
  import FormModal from './components/formModal.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ActionItem, TableAction } from '/@/components/Table';

  defineOptions({ name: 'productionPlan-main-projectComparison' });

  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();
  const [registerFormModal, { openModal: openFormModal }] = useModal();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: false,
      // change即做查询
      submitOnChange: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: frmSchema(),
      i18nConfig: {
        moduleCode: 'ProjectComparisonColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'productionPlan-main-ProjectComparisonColumn-list',
      showIndexColumn: true,
      columns: columns,
      api: getProjectComparison,
      proxyConfig: {
        autoLoad: false,
      },
      beforeFetch: params => handleParams(params),
      toolbarConfig: {
        superQuery: true,
      },
      i18nConfig: {
        moduleCode: 'ProjectComparisonColumn',
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

  function getTableActions(row): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: handleEdit.bind(null, row),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          title: t('common.delText'),
          onOk: handleDelete.bind(null, row),
        },
      },
    ];
  }

  async function handleAdd() {
    let { factoryArea } = await gridApi.getFetchParams();
    if (!factoryArea) {
      return createMessage.warning(t('dict.MPS.selectFactoryFirst'));
    }
    openFormModal(true, { factoryArea });
  }

  async function handleEdit(record: Recordable) {
    openFormModal(true, { factoryArea: record.factoryArea, id: record.id });
  }

  function handleDelete(record: Recordable) {
    deleteProjectComparison(record.id).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

  function handleDeleteList() {
    const checkedList = gridApi!.grid.getCheckboxRecords();
    if (checkedList.length === 0) {
      return createMessage.warning(t('common.selectDelDatasTip'));
    }
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.batchDelTip'),
      onOk: () =>
        blukDeleteProjectComparison(checkedList.map(item => item.id))
          .then(res => {
            createMessage.success(res.msg || t('common.delSuccess'));
          })
          .finally(reload),
    });
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
