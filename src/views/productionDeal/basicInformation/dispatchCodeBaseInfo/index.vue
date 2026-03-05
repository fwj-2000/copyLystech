<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicForm @register="registerForm" @submit="reload" @reset="reload" />
      </div>
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button type="primary" preIcon="icon-ym icon-ym-btn-add" @click="addOrUpdateHandle()"> {{ t('common.add2Text') }} </a-button>
              <a-button @click="handleDeleteList()"> {{ t('common.batchDelText') }} </a-button>
              <a-dropdown>
                <template #overlay>
                  <a-menu @click="batchImportOrExport">
                    <a-menu-item key="import">{{ t('common.batchImport') }}</a-menu-item>
                    <a-menu-item key="export">{{ t('common.batchExport') }}</a-menu-item>
                  </a-menu>
                </template>
                <a-button>{{ t('common.batchImportOrExport') }}</a-button>
              </a-dropdown>
            </a-space>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <add @register="registerAddForm" @reload="reload" />
    <ExportModal @register="registerExportModal" />
    <BatchUpload @register="registerBatchImportPop" @reload="reload" />
  </div>
</template>

<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ActionItem } from '/@/components/Table';
  import { getColumn, column } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import {
    getDispatchCodeBaseInfo,
    deleteDispatchCodeBaseInfo,
    blukDeleteDispatchCodeBaseInfo,
    exportDispatchCodeBaseInfoExcel,
  } from '/@/api/productionDeal/dispatchCodeBaseInfo';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  import { usePopup } from '/@/components/Popup';
  import add from './components/add.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import BatchUpload from './components/importPop.vue';
  import { BasicForm, useForm } from '/@/components/Form';

  const { t } = useI18n();

  interface State {
    packingType: any[];
  }

  const state = reactive<State>({
    packingType: [],
  });

  const [registerAddForm, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerBatchImportPop, { openPopup: openImportPopup }] = usePopup();

  const searchFormSchema = [
    {
      field: 'InnerMaterialCode',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: t(['common.inputPlaceholder', 'dict.DispatchCodeBaseInfoColumn.InnerMaterialCode']), //'请输入内部料号',
      },
      colProps: { span: 4 },
    },
    {
      field: 'pickerVal',
      label: '',
      component: 'DateRange',
      componentProps: {
        format: 'YYYY-MM-DD',
        // placeholder: ['打印开始时间', '打印结束时间'],
        // width: '400px',
      },

      colProps: { span: 4 },
    },
  ];

  const [registerForm, { getFieldsValue }] = useForm({
    baseColProps: { span: 4 },
    showActionButtonGroup: true,
    showAdvancedButton: false,
    compact: true,
    autoAdvancedLine: 1,
    actionColOptions: {
      span: 4,
    },
    i18nConfig: {
      moduleCode: 'DispatchCodeBaseInfoColumn',
      transferRange: ['placeholder'],
    },
    schemas: searchFormSchema,
    fieldMapToTime: [['pickerVal', ['StartTime', 'EndTime']]],
  });

  const [Grid, { reload, getFetchParams, getSelectRowKeys }] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionDeal-dispatchCodeBaseInfo-list',
      columns: getColumn(),
      api: getDispatchCodeBaseInfo,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'DispatchCodeBaseInfoColumn',
      },
    },
  });
  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: addOrUpdateHandle.bind(null, record.Id),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          title: t('common.delText'),
          onOk: handleDelete.bind(null, record),
        },
      },
    ];
  }

  const { createMessage, createConfirm } = useMessage();

  //新增或者修改
  function addOrUpdateHandle(id = '') {
    openFormModal(true, { id, packingType: state.packingType });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deleteDispatchCodeBaseInfo(record.Id).then(res => {
      createMessage.success(res.msg);
      reload();
      console.log('test');
    });
  }

  //批量删除
  async function handleDeleteList() {
    const list = getSelectRowKeys();
    if (list?.length === 0) {
      return message.warning(t('common.selectDelDatasTip'));
    } else {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('common.beforeDelTip'),
        onOk: async () => {
          try {
            const { code } = await blukDeleteDispatchCodeBaseInfo(list);
            if (code == 200) {
              message.warning(t('common.delSuccess'));
            }
            reload();
          } catch (e) {
            console.log(e);
            reload();
          }
        },
      });
    }
  }

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? handleImport : handleExport;
    openMethod();
  }

  //导入
  function handleImport() {
    openImportPopup(true, {
      title: t('common.add'),
      isDevPlatform: false,
    });
  }

  //导出
  function handleExport() {
    const listQuery = {
      ...getFetchParams(),
    };
    openExportModal(true, {
      api: exportDispatchCodeBaseInfoExcel,
      listQuery,
      exportOptions: column,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'DispatchCodeBaseInfoColumn',
      },
    });
  }

  onMounted(async () => {
    reload();
  });
</script>

<style scoped lang="less">
  .pldr {
    color: #ff7b00;
  }
</style>
