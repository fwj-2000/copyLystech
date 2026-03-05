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
  import { ref, nextTick } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { columns, importColumn } from './config';
  import {
    getProductionWeeks,
    deleteProductionWeeks,
    blukDeleteProductionWeeks,
    templateDownload,
    importPreview,
    importSave,
  } from '/@/api/mps/productionPlan/productionWeeks';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { useModal } from '/@/components/Modal';
  import { ImportModal } from '/@/components/ImportModal';
  import FormModal from './components/formModal.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ActionItem, TableAction } from '/@/components/Table';
  import { ListByUserfactory } from '/@/api/productionPlan/processRoute';
  import { factoryFilterOption } from '../utils/index';

  defineOptions({ name: 'productionPlan-main-productionWeeks' });

  const { t } = useI18n();

  const { createMessage, createConfirm } = useMessage();
  const [registerFormModal, { openModal: openFormModal }] = useModal();
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
      fieldName: 'innerMaterialCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '内部料号',
        allowClear: true,
      },
    },
  ];

  const [Grid, { reload, getFetchParams, getSelectRows, getFromValue, resetForm, setLatestSubmissionValues, setFieldValue }] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: false,
      // change即做查询
      submitOnChange: false,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: frmSchema,
      i18nConfig: {
        moduleCode: 'ProductionWeeksColumn',
        transferRange: ['placeholder'],
      },
      handleReset,
    },
    gridOptions: {
      id: 'productionPlan-main-productionWeeks-list',
      showIndexColumn: true,
      columns: columns,
      api: getProductionWeeks,
      beforeFetch: params => handleParams(params),
      // toolbarConfig: {
      //   superQuery: true,
      // },
      i18nConfig: {
        moduleCode: 'ProductionWeeksColumn',
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
    let { factoryArea } = await getFetchParams();
    if (!factoryArea) {
      return createMessage.warning(t('dict.MPS.selectFactoryFirst'));
    }
    openFormModal(true, { factoryArea });
  }

  function handleEdit(record: Recordable) {
    openFormModal(true, { factoryArea: record.factoryArea, id: record.id });
  }

  function handleDelete(record: Recordable) {
    deleteProductionWeeks(record.id).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

  async function handleDeleteList() {
    // const checkedList = gridApi!.grid.getCheckboxRecords();
    const checkedList = await getSelectRows();
    if (checkedList.length === 0) {
      return createMessage.warning(t('common.selectDelDatasTip'));
    }
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.batchDelTip'),
      onOk: () =>
        blukDeleteProductionWeeks(checkedList.map(item => item.id))
          .then(res => {
            createMessage.success(res.msg || t('common.delSuccess'));
          })
          .finally(() => {
            reload();
          }),
    });
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
