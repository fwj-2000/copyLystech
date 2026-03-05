<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center bg-white h-full">
      <div class="lydc-content-dashboard-content bg-white h-full">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button type="primary" @click="handleAdd" v-auth="'btn_add'"> {{ t('common.add2Text') }} </a-button>
              <a-button @click="batchImportFile" v-auth="'btn_upload'">{{ t('common.batchImport') }}</a-button>
              <a-button danger @click="handleDeleteList" v-auth="'btn_batchRemove'"> {{ t('common.batchDelText') }} </a-button>
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
  import { getMaterialPTHList, downloadTemplate, importSave, importPreview, blukDeleteMaterialPTH } from '/@/api/mps/productionPlan/materialPTH';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { useModal } from '/@/components/Modal';
  import { ImportModal } from '/@/components/ImportModal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { TableAction } from '/@/components/Table';
  import FormModal from './components/formModal.vue';
  import { ListByUserfactory } from '/@/api/productionPlan/processRoute';
  import { factoryFilterOption } from '../utils/index';

  defineOptions({ name: 'productionPlan-main-materialPTH' });

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
    // 内部料号
    {
      fieldName: 'innerMC',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '内部料号',
        allowClear: true,
      },
    },
    // 合并料号
    {
      fieldName: 'mergeMC',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '合并料号',
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
      i18nConfig: {
        moduleCode: 'MaterialPTHColumn',
        transferRange: ['placeholder'],
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: frmSchema,
      handleReset,
    },
    gridOptions: {
      id: 'productionPlan-main-materialPTH-list',
      showIndexColumn: true,
      columns: columns,
      api: getMaterialPTHList,
      i18nConfig: {
        moduleCode: 'MaterialPTHColumn',
      },
      beforeFetch: params => handleParams(params),
      toolbarConfig: {
        superQuery: true,
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

  function getTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: handleEdit.bind(null, row),
        auth: 'btn_edit',
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          title: t('common.delText'),
          onOk: handleDelete.bind(null, row),
        },
        auth: 'btn_remove',
      },
    ];
  }

  async function handleAdd() {
    let { factoryArea } = await getFetchParams();
    if (!factoryArea) {
      return createMessage.warning(t('dict.MPS.selectFactoryFirst'));
    }
    openFormModal(true, { factoryArea, row: {} });
  }

  async function handleEdit(row) {
    openFormModal(true, { factoryArea: row.factoryArea, row });
  }

  function handleDelete(row) {
    blukDeleteMaterialPTH([row.id]).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

  async function handleDeleteList() {
    const checkedList = await getSelectRows();
    if (checkedList.length === 0) {
      return createMessage.warning(t('common.selectDelDatasTip'));
    }
    const ids = checkedList.map(item => item.id);
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.batchDelTip'),
      onOk: () =>
        blukDeleteMaterialPTH(ids)
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
      templateApi: downloadTemplate,
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
