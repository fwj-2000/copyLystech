<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_add'" type="primary" @click="addOrUpdateHandle()"> {{ t('common.add2Text') }}</a-button>
            <a-button v-auth="'btn_batchRemove'" @click="handleDeleteList()"> {{ t('common.batchDelText') }} </a-button>
            <vShowDropdown>
              <template #overlay>
                <button @click="batchImportOrExport({ key: 'import' })" v-auth="'btn_upload'">{{ t('common.batchImport') }} </button>
                <button @click="batchImportOrExport({ key: 'export' })" v-auth="'btn_download'">{{ t('common.batchExport') }} </button>
              </template>
              <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
            </vShowDropdown>
          </template>
          <template #action="{ row }">
            <TableAction outsize :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <add @register="registerForm" @reload="reload" />
    <ImportModal @register="registerImportPop" @refresh="reload" />
    <ExportModal @register="registerExportModal" />
  </div>
</template>

<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { getDownstream, deleteDownstream, exportDownstream, importDownstream, saveImportData, downloadDownstream } from '/@/api/business/dataVerify';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { message } from 'ant-design-vue';
  import add from './components/add.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  import { ImportModal } from '/@/components/ImportModal';
  import { usePermission } from '/@/hooks/web/usePermission';

  const { createConfirm } = useMessage();

  const { t } = useI18n();
  const { hasBtnP } = usePermission();

  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();

  defineOptions({ name: 'business-dataVerify-item' });

  const columns = [
    { type: 'checkbox', field: 'checkbox', width: 50 },
    { title: 'Category', field: 'category' },
    { title: 'Downstream', field: 'downstream' },
    { title: 'Downstream Site Name', field: 'downstreamSiteName' },
    { title: '操作', field: 'action', slots: { default: 'action' }, width: 70, fixed: 'right' },
  ];

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: false,
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: [
        {
          fieldName: 'category',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: 'category',
          },
        },
        {
          fieldName: 'downstream',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: 'downstream',
          },
        },
        {
          fieldName: 'downstreamSiteName',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: 'downstreamSiteName',
          },
        },
      ],
    },
    gridOptions: {
      id: 'business-dataVerify-item-list',
      columns: columns,
      api: getDownstream,
      showIndexColumn: true,
    },
  });
  const { reload, getSelectRowKeys, clearSelectedRowKeys } = gridApi;

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: addOrUpdateHandle.bind(null, record),
      },
    ];
  }

  //新增或者修改
  function addOrUpdateHandle(item = {}) {
    openFormModal(true, { ...item });
  }

  //批量删除
  async function handleDeleteList() {
    const list = getSelectRowKeys();
    if (list?.length === 0) {
      clearSelectedRowKeys();
      return message.warning(t('common.selectDelDatasTip'));
    } else {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('common.beforeDelTip'),
        onOk: async () => {
          try {
            const { code } = await deleteDownstream(list);
            if (code == 200) {
              clearSelectedRowKeys();
              message.success(t('common.delSuccess'));
            }
            reload();
          } catch (e) {
            clearSelectedRowKeys();
            reload();
          }
        },
      });
    }
  }

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? batchImportFile : handleExport;
    openMethod();
  }

  function batchImportFile() {
    openImportPopup(true, {
      importPreviewApi: importDownstream,
      importSaveApi: saveImportData,
      templateApi: downloadDownstream,
      previewColumn: columns,
      usePolling: false,
    });
  }

  async function handleExport() {
    const params = await gridApi.getFetchParams();
    openExportModal(true, {
      listQuery: params,
      api: exportDownstream,
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'field',
    });
  }
</script>
