<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_add'" type="primary" @click="addOrUpdateHandle()"> {{ t('common.add2Text') }}</a-button>
            <!-- <a-button v-auth="'btn_download'" type="primary" ghost @click="handleExport">{{ t('common.exportText') }} </a-button>
            <a-button v-auth="'btn_upload'" type="primary" ghost @click="handleImport">{{ t('common.importText') }}</a-button> -->
            <vShowDropdown>
              <template #overlay>
                <button @click="batchImportOrExport({ key: 'import' })" v-if="hasBtnP('btn_upload')">{{ t('common.batchImport') }} </button>
                <button @click="batchImportOrExport({ key: 'export' })" v-if="hasBtnP('btn_download')">{{ t('common.batchExport') }} </button>
              </template>
              <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
            </vShowDropdown>
            <a-button v-auth="'btn_batchRemove'" danger @click="handleDeleteList()"> {{ t('common.batchDelText') }} </a-button>
          </template>
          <!-- <template #status="{ row }">
            <a-tag :color="row.status === 1 ? 'success' : 'error'">{{ row.status === 1 ? t('common.enableText') : t('common.disableText') }}</a-tag>
          </template> -->
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <add @register="registerPopup" @reload="reload" />
    <ExportModal @register="registerExportModal" />
    <ImportModal @register="registerBatchImportPop" @reload="reload" />
  </div>
</template>

<script setup lang="ts">
  import { ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { getList, del, blukDelete, exportExcel, enable, disable, importPreview, importSave, template } from '/@/api/business/shippingspace';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePopup } from '/@/components/Popup';
  import { reactive } from 'vue';
  import { message } from 'ant-design-vue';
  import add from './components/add.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { ImportModal } from '/@/components/ImportModal';
  import { mainCoulumnVxe, columnsVxe, getDcitOptions } from './config';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { omit } from 'lodash-es';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  import { usePermission } from '/@/hooks/web/usePermission';

  const { hasBtnP } = usePermission();
  // const { ImportModal } = defineAsyncComponent(() => {
  //   return import('/@/components/ImportModal');
  // });

  defineOptions({ name: 'basicData-shippingSpace' });

  const { t } = useI18n();

  interface State {
    industryTypeList: any[];
  }

  const state = reactive<State>({
    industryTypeList: [],
  });

  const [registerPopup, { openPopup }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerBatchImportPop, { openPopup: openImportPopup }] = usePopup();

  const searchFormSchemaVxe: Array<any> = [
    {
      fieldName: 'shippingSpaceCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请输入仓位编号',
      },
      // colProps: { span: 6 },
    },
    {
      fieldName: 'shippingSpaceName',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请输入仓位名称',
      },
      // colProps: { span: 6 },
    },
    {
      fieldName: 'factoryCode',
      i18nField: 'CommonCol.factoryCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请输入工厂代码',
      },
      // colProps: { span: 6 },
    },
    {
      fieldName: 'factoryName',
      i18nField: 'CommonCol.factoryName',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请输入工厂名称',
      },
      // colProps: { span: 6 },
    },
  ];

  const [Grid, gridApi] = useVbenVxeGrid({
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
      schema: searchFormSchemaVxe,
      i18nConfig: {
        moduleCode: 'ShippingSpaceColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'basicData-shippingSpace-list',
      columns: columnsVxe as any,
      showIndexColumn: true,
      api: getList,
      pagerConfig: {
        autoHidden: false,
      },
      i18nConfig: {
        moduleCode: 'ShippingSpaceColumn',
      },
    },
  });

  const { reload, getSelectRowKeys, getFetchParams, clearSelectedRowKeys } = gridApi;

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: addOrUpdateHandle.bind(null, record.id),
        auth: 'btn_detail',
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          title: t('common.delText'),
          onOk: handleDelete.bind(null, record),
        },
        auth: 'btn_remove',
      },
      {
        label: record.status == 1 ? t('common.disableText') : t('common.enableText'),
        modelConfirm: {
          title: record.status == 1 ? t('common.disableText') : t('common.enableText'),
          content: t('common.enableTip', [record.status == 1 ? t('common.disableText') : t('common.enableText')]),
          onOk: handleEnableDis.bind(null, record),
        },
        auth: 'btn_enabled',
      },
    ];
  }

  const { createMessage, createConfirm } = useMessage();

  //新增或者修改
  async function addOrUpdateHandle(id = '') {
    await getDcitOptions();
    openPopup(true, { id, industryTypeList: state.industryTypeList, type: id ? 'edit' : 'add' });
  }

  //单个删除
  function handleDelete(record: Recordable) {
    del(record.id).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

  //批量删除
  async function handleDeleteList() {
    const list = getSelectRowKeys();
    if (list?.length === 0) {
      return message.warning(t('common.selectText'));
    } else {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('common.selectText'),
        onOk: async () => {
          try {
            const { code } = await blukDelete(list);
            if (code == 200) {
              clearSelectedRowKeys();
              message.warning(t('sys.api.operationSuccess'));
            }
          } finally {
            clearSelectedRowKeys();
            reload();
          }
        },
      });
    }
  }

  // 启用
  async function handleEnableDis(record) {
    let r;
    const { id } = record;
    if (record.status == 1) {
      r = await disable(id);
    } else {
      r = await enable(id);
    }
    if (r.code == 200) {
      message.success(t('sys.api.operationSuccess'));
      reload();
    }
  }

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? handleImport : handleExport;
    openMethod();
  }

  //导入
  function handleImport() {
    openImportPopup(true, {
      importPreviewApi: importPreview,
      importSaveApi: importSave,
      templateApi: template,
      previewColumn: mainCoulumnVxe,
      usePolling: false,
      i18nConfig: {
        moduleCode: 'ShippingSpaceColumn',
      },
    });
  }
  //导出
  async function handleExport() {
    const params = await getFetchParams();

    openExportModal(true, {
      api: exportExcel,
      listQuery: params,
      exportOptions: columnsVxe,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'ShippingSpaceColumn',
      },
    });
  }
</script>

<style scoped lang="less">
  .pldr {
    color: #ff7b00;
  }

  .lydc-content-wrapper-content {
    background-color: #fff;
  }
</style>
