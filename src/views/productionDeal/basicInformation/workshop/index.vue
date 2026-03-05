<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button type="primary" @click="addOrUpdateHandle()"> {{ t('common.add2Text') }} </a-button>
              <!-- <a-dropdown>
                <template #overlay>
                  <a-menu @click="batchImportOrExport">
                    <a-menu-item key="import">{{ t('common.batchImport') }} </a-menu-item>
                    <a-menu-item key="export">{{ t('common.batchExport') }}</a-menu-item>
                  </a-menu>
                </template>
                <a-button>{{ t('common.batchImportOrExport') }}</a-button>
              </a-dropdown> -->
              <a-button @click="handleExport">{{ t('common.batchExport') }}</a-button>
              <a-button danger @click="handleDeleteList()"> {{ t('common.batchDelText') }}</a-button>
            </a-space>
          </template>
          <template #action="{ row }">
            <TableAction :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <add @register="registerForm" @reload="reload" />
    <ExportModal @register="registerExportModal" />
    <!-- <ImportModal @register="registerImportModal" @reload="reload" /> -->
    <ImportModal @register="registerImportPop" @refresh="reload" />
  </div>
</template>

<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  // import { BasicTable, useTable, BasicColumn, FormSchema, ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import {
    getWorkshop,
    deleteWorkshop,
    blukDeleteWorkshop,
    exportWorkshopExcel,
    templateDownload,
    importWorkshopPreview,
    importWorkshopData,
  } from '/@/api/productionDeal/workshop';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { columns, searchFormSchema } from './config';
  import { omit } from 'lodash-es';
  import { reactive, onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  import { useBaseStore } from '/@/store/modules/base';
  import add from './components/add.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  // import ImportModal from './components/ImportModal.vue';
  import { usePopup } from '/@/components/Popup';
  import { ImportModal } from '/@/components/ImportModal';

  defineOptions({ name: 'productionDeal-basicInformation-workshop' });

  const { t } = useI18n();
  const baseStore = useBaseStore();

  interface State {
    typeOption: any[];
  }

  const state = reactive<State>({
    typeOption: [],
  });

  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  // const [registerImportModal, { openModal: openImportModal }] = useModal();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();

  const [Grid, { reload, getFetchParams, getSelectRowKeys, getSelectRows }] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: searchFormSchema,
      i18nConfig: {
        moduleCode: 'WorkshopColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'productionDeal-basicInformation-workshop-list',
      columns: columns,
      api: getWorkshop,
      beforeFetch: (params: any) => {
        const query = {
          ...omit(params, 'pickerVal'),
          startTime: params?.pickerVal?.[0] || '',
          endTime: params?.pickerVal?.[1] || '',
        };
        return query;
      },
      pagerConfig: {
        autoHidden: false,
      },
      i18nConfig: {
        moduleCode: 'WorkshopColumn',
      },
    },
  });

  function getTableActions(record) {
    return [
      {
        icon: 'ym-diecut ym-diecut-edit-1',
        onClick: addOrUpdateHandle.bind(null, record.Id),
        tooltip: t('common.editText'),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          title: t('common.delText'),
          onOk: handleDelete.bind(null, record),
        },
        tooltip: t('common.delText'),
      },
    ];
  }

  const { createMessage, createConfirm } = useMessage();

  //新增或者修改
  function addOrUpdateHandle(id = '') {
    openFormModal(true, { id, typeOption: state.typeOption });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deleteWorkshop(record.Id).then(res => {
      createMessage.success(res.msg);
      reload();
      console.log('test');
    });
  }

  //批量删除
  async function handleDeleteList() {
    const selectRows = getSelectRows();
    const selectKeys = selectRows.map(item => item.Id);
    if (selectKeys.length === 0) {
      return createMessage.error(t('common.selectText'));
    } else {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('common.beforeDelTip'),
        onOk: async () => {
          try {
            const { code } = await blukDeleteWorkshop(selectKeys);
            if (code == 200) {
              // getRowSelection().selectedRowKeys = [];
              message.success(t('common.delSuccess'));
            }
            reload();
          } catch (e) {
            // getRowSelection().selectedRowKeys = [];
            reload();
            throw e;
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
    // openImportModal(true, {});
    openImportPopup(true, {
      importPreviewApi: importWorkshopPreview,
      importSaveApi: importWorkshopData,
      templateApi: templateDownload,
      previewColumn: columns,
      usePolling: false,
      pollingParams: {
        interval: 0,
      },
      i18nConfig: {
        moduleCode: 'WorkshopColumn',
      },
    });
  }

  //导出
  async function handleExport() {
    const listQuery = {
      ...(await getFetchParams()),
    };
    openExportModal(true, {
      api: exportWorkshopExcel,
      listQuery,
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'WorkshopColumn',
      },
    });
  }

  onMounted(async () => {
    // baseStore.getDictionaryData('ClassesName').then(res => {
    //   console.log('==========res', res);
    //   state.typeOption = res as any[];
    // getForm().updateSchema({
    //   field: 'Name',
    //   componentProps: {
    //     options: res,
    //     fieldNames: { value: 'enCode' },
    //   },
    // });
    // });
  });
</script>

<style scoped lang="less">
  .pldr {
    color: #ff7b00;
  }
</style>
