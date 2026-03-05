<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <BasicTable @register="registerTable">
          <template #tableTitle>
            <a-button v-auth="'btn_apply'" type="primary" @click="handleApply">申请</a-button>
            <a-button v-auth="'btn_review'" @click="handleAudit">{{ t('common.audit') }}</a-button>
            <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }}</a-button>
            <a-button v-auth="'btn_upload'" @click="handleImport">{{ t('common.batchImport') }}</a-button>
            <ModelConfirmButton
              a-auth="'btn_batchRemove'"
              v-bind="{
                modelConfirm: {
                  onOk: batchDelete.bind(null),
                },
              }">
              <span>{{ t('common.batchDelText') }}</span>
            </ModelConfirmButton>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
  </div>

  <ExportModal @register="registerExportModal" />
  <ApplyPop @register="registerApplyPop" @refresh="reload"></ApplyPop>
  <ImportModal @register="registerImportPop" @refresh="reload"></ImportModal>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue';
  import { BasicTable, TableAction, useTable, ActionItem } from '/@/components/Table';
  import { columns, formConfig } from './config';
  import { dataConfig } from './components/config';
  import { getList, exportExcel, blukDelete, getTypeList, importPreview, importSave, template } from '/@/api/engineering/sample';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { formatTableDefaultText } from '/@/utils';
  import { ModelConfirmButton } from '/@/components/Button';

  import ExportModal from '/@/components/ExportModal/index.vue';
  import { ImportModal } from '/@/components/ImportModal';
  import ApplyPop from './components/ApplyPop.vue';
  import { useModal } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  defineOptions({ name: 'engineering-sampleApply' });

  const [registerApplyPop, { openPopup: openMenuPopup }] = usePopup();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();

  const { t } = useI18n();

  const [registerTable, { reload, getFetchParams, getSelectRowKeys, getForm }] = useTable({
    api: getList,
    columns,
    useSearchForm: true,
    striped: true,
    ellipsis: true,
    rowSelection: { type: 'checkbox' },
    clickToRowSelect: false,
    actionColumn: {
      width: 100,
      title: t('common.action'),
      dataIndex: 'action',
    },
    isCanResizeParent: true,
    canResize: true,
    pagination: {
      pageSize: 100,
    },
    formConfig: formConfig,
    transformCellText: ({ text }) => formatTableDefaultText(text),
  });

  function handleApply() {
    openMenuPopup(true, {
      type: 'add',
      title: t('common.add'),
    });
  }
  function goDetail(record) {
    const { id } = record;
    openMenuPopup(true, {
      id: id,
      type: 'view',
      title: t('common.view'),
    });
  }

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        auth: 'btn_detail',
        onClick: goDetail.bind(null, record),
      },
    ];
  }
  const handleExport = async () => {
    openExportModal(true, {
      api: exportExcel,
      listQuery: {
        ...getFetchParams(),
      },
      nameProps: 'title',
      idProps: 'dataIndex',
    });
  };

  const { hasBtnP } = usePermission();
  const handleImport = async () => {
    openImportPopup(true, {
      importPreviewApi: importPreview,
      importSaveApi: importSave,
      templateApi: template,
      previewColumn: dataConfig,
      apiParams: {
        importSave: {
          isoperation: hasBtnP('btn_review') ? 1 : 0,
        },
      },
    });
  };

  function batchDelete() {
    const idList = getSelectRowKeys();
    if (!idList || idList.length === 0) {
      message.warning(t('common.selectText'));
      return;
    }

    blukDelete(idList).then(res => {
      message.success(res.msg);
      reload();
    });
  }

  function handleAudit() {
    const idList = getSelectRowKeys();
    if (!idList || idList.length === 0) {
      message.warning(t('common.selectText'));
      return;
    }
    openMenuPopup(true, {
      ids: idList,
      id: idList[0],
      type: 'audit',
    });
  }

  // 获取状态值
  async function getStatusList() {
    const r = await getTypeList(['sampleApplyStatus']);
    if (r.code == 200) {
      // 更新
      r.data.forEach(el => {
        if (el.typeName == 'sampleApplyStatus') {
          const _list: any = [];
          for (let k in el.typeList) {
            _list.push({
              id: k,
              fullName: el.typeList[k],
            });
          }
          getForm().updateSchema({
            field: 'status',
            componentProps: { options: _list },
          });
        }
      });
    }
  }

  onMounted(() => {
    getStatusList();
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
</style>
<style lang="less">
  .news-dot {
    position: relative;

    &::before {
      content: '';
      position: absolute;
      right: -8px;
      top: 0;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #52c41a;
    }
  }
</style>
