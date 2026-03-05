<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_add'" type="primary" @click="handleAddFn">{{ t('common.add') }}</a-button>
            <vShowDropdown>
              <template #overlay>
                <button @click="batchImportOrExport({ key: 'import' })" v-auth="'btn_upload'">{{ t('common.batchImport') }} </button>
                <button @click="batchImportOrExport({ key: 'export' })" v-auth="'btn_download'">{{ t('common.batchExport') }} </button>
              </template>
              <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
            </vShowDropdown>
            <a-button v-auth="'btn_batchRemove'" @click="handleDelete">{{ t('common.batchDelText') }}</a-button>
          </template>
          <template #Status="{ rowIndex, row }">
            <a-tag :color="row.Status === 1 ? 'success' : 'error'">{{ row.Status === 1 ? t('common.valid') : t('common.invalid') }}</a-tag>
          </template>
          <template #action="{ rowIndex, row }">
            <TableAction :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <ImportModal @register="registerImportModal" @reload="reload" />
    <ExportModal @register="registerExportModal" />
    <AddPop @register="registerAddPop" @reload="reload"></AddPop>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { columns, formConfig } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import AddPop from './components/AddPop.vue';
  import { useModal } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import {
    getCheckmaintain,
    deleteCheckmaintain,
    blukDeleteCheckmaintain,
    exportCheckmaintainExcel,
    templateDownload,
    importCheckmaintainData,
    importCheckmaintainPreview,
  } from '/@/api/productionDeal/checkmaintain';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { dateUtil } from '/@/utils/dateUtil';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  defineOptions({ name: 'productionDeal-mouldBusiness-inspectionMnt' });
  const { t } = useI18n();
  const { hasBtnP } = usePermission();
  const { createMessage, createConfirm } = useMessage();
  import { ImportModal } from '/@/components/ImportModal';
  const [registerImportModal, { openPopup: openImportPopup }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [Grid, { getSelectRowKeys, clearSelectedRowKeys, setLoading, reload, setFieldValue, getFetchParams }] = useVbenVxeGrid({
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
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: formConfig,
    },
    gridOptions: {
      id: 'productionDeal-mouldBusiness-inspectionMnt',
      columns: columns,
      showIndexColumn: true,
      showFooter: false,
      api: getCheckmaintain,
      columnConfig: {
        isCurrent: true, // 启用列高亮
      },
      currentColumnConfig: {
        isFollowSelected: true, // 高亮跟随选中
      },
      beforeFetch: params => {
        const _params = {
          ...params,
        };
        if (params.pickerVal && params.pickerVal.length > 0) {
          _params.StartTime = dateUtil(params.pickerVal[0]).valueOf();
          _params.EndTime = dateUtil(params.pickerVal[1]).valueOf();
          delete _params.pickerVal;
        }
        return _params;
      },
    },
  });
  const [registerAddPop, { openPopup: openAddPop }] = usePopup();

  function handleAddFn() {
    openAddPop(true, {
      title: '新增',
    });
  }

  function deleteFn({ id }) {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: `确定删除数据吗?`,
      onOk: async () => {
        try {
          const { code, msg } = await deleteCheckmaintain(id);
          if (code === 200) {
            message.success('操作成功');
            clearSelectedRowKeys();
            return reload();
          }
          message.error(msg);
        } catch (error) {
          throw new Error('handleSendMaterial is error ');
        }
      },
      onCancel: () => {},
    });
  }

  function goEdit(record) {
    openAddPop(true, {
      title: '编辑',
      data: record,
    });
  }
  // function goDetail(record) {}

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-edit',
        onClick: goEdit.bind(null, record),
        auth: 'btn_edit',
      },
      {
        icon: 'icon-ym icon-ym-delete',
        onClick: deleteFn.bind(null, record),
        auth: 'btn_remove',
      },
    ];
  }

  async function handleDelete() {
    const ids = getSelectRowKeys();
    if (ids && ids.length === 0) {
      return message.warning('请选择要删除的对象!');
    }
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: `确定删除数据吗?`,
      onOk: async () => {
        try {
          const { code, msg } = await blukDeleteCheckmaintain(ids);
          if (code === 200) {
            message.success('操作成功');
            clearSelectedRowKeys();
            return reload();
          }
          message.error(msg);
        } catch (error) {
          throw new Error('handleSendMaterial is error ');
        }
      },
      onCancel: () => {},
    });
  }

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? handleImport : handleExport;
    openMethod();
  }
  //导入
  function handleImport() {
    openImportPopup(true, {
      // title: t('common.add'),
      // isDevPlatform: false,
      importPreviewApi: importCheckmaintainPreview,
      importSaveApi: importCheckmaintainData,
      templateApi: templateDownload,
      previewColumn: columns,
    });
  }
  //导出
  function handleExport() {
    openExportModal(true, {
      api: exportCheckmaintainExcel,
      listQuery: {
        ...getFetchParams(),
      },
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'dataIndex',
    });
  }

  onMounted(() => {
    reload();
  });
</script>

<style lang="less" scoped>
  :deep(.lydc-content-wrapper-search-box) {
    margin-bottom: 0 !important;
  }

  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  .text-border {
    border-bottom: 1px solid #333;
    cursor: pointer;
  }

  .table-a {
    color: #ff7b00;
    cursor: pointer;
  }
</style>
