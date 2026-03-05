<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white p-10px">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button type="primary" v-auth="'btn_add'" @click="handleAdd"> {{ t('common.add2Text') }} </a-button>
              <vShowDropdown>
                <template #overlay>
                  <button @click="batchImportOrExport({ key: 'import' })" v-if="hasBtnP('btn_upload')">{{ t('common.batchImport') }} </button>
                  <button @click="batchImportOrExport({ key: 'export' })" v-if="hasBtnP('btn_download')">{{ t('common.batchExport') }} </button>
                </template>
                <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
              </vShowDropdown>
              <a-button v-auth="'btn_batchRemove'" danger @click="handleBatchDelete"> {{ t('common.batchDelText') }} </a-button>
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
    <ExportModal @register="registerExportModal" />
  </div>
</template>

<script lang="ts" setup>
  import type { OrigincountryItem } from '/@/api/basicData/originCountry';

  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { columns, schema, importColumn } from './config';
  import {
    getOrigincountryList,
    deleteOriginCountry,
    bulkDeleteOriginCountry,
    exportExcel,
    downloadTemplate,
    saveImportData,
    importPreview,
  } from '/@/api/basicData/originCountry';
  import { useModal } from '/@/components/Modal';
  import { cloneDeep } from 'lodash-es';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePopup } from '/@/components/Popup';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import FormModal from './components/formModal.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { ImportModal } from '/@/components/ImportModal';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  defineOptions({ name: 'basicData-originCountry' });

  const { hasBtnP } = usePermission();
  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();

  const [registerFormModal, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: false,
      showCollapseButton: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema,
    },
    gridOptions: {
      id: 'basicData-originCountry-list',
      columns,
      // @ts-ignore
      api: (params: any) => getOrigincountryList({ ...params, currentPage: params.currentPage || params.page }),
      keyboardConfig: {
        isBack: false,
      },
      pagerConfig: {
        autoHidden: false,
      },
    },
  });

  function getTableActions(record: OrigincountryItem) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: handleEdit.bind(null, record),
        auth: 'btn_edit',
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          // title: '删除',
          onOk: handleDelete.bind(null, record),
        },
        auth: 'btn_remove',
      },
    ];
  }

  function reload() {
    gridApi.reload();
  }

  function handleEdit(row: OrigincountryItem) {
    openFormModal(true, cloneDeep(row));
  }

  function handleAdd() {
    openFormModal(true, {});
  }

  async function handleDelete(row: OrigincountryItem) {
    return deleteOriginCountry(row.id as string)
      .then(res => {
        res.code === 200 && createMessage.success(res.msg || t('common.delSuccess'));
      })
      .finally(reload);
  }

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? batchImportFile : handleExport;
    openMethod();
  }

  function batchImportFile() {
    openImportPopup(true, {
      importPreviewApi: importPreview,
      importSaveApi: saveImportData,
      templateApi: downloadTemplate,
      previewColumn: importColumn,
      usePolling: false,
      apiParams: {
        importSave: {
          isoperation: hasBtnP('btn_upload') ? 1 : 0,
        },
      },
    });
  }

  async function handleExport() {
    const params = await gridApi.getFetchParams();

    openExportModal(true, {
      listQuery: params,
      api: exportExcel,
      exportOptions: columns.slice(2).map(item => {
        return {
          ...item,
          title: item.title,
          dataIndex: item.field,
        };
      }),
      nameProps: 'title',
      idProps: 'field',
    });
  }

  function handleBatchDelete() {
    const checkedList = gridApi!.grid.getCheckboxRecords();
    if (checkedList.length === 0) {
      return createMessage.warning(t('common.selectDelDatasTip'));
    }
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.batchDelTip'),
      onOk: () =>
        bulkDeleteOriginCountry(checkedList.map(item => item.id))
          .then(res => {
            res.code === 200 && createMessage.success(res.msg || t('common.delSuccess'));
          })
          .finally(reload),
    });
  }
</script>
