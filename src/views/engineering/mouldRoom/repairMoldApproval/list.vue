<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 审批 -->
              <a-button v-auth="'btn_approve'" type="primary" @click="handleAudit" v-if="activeKey === 'pending'">{{ t('common.approval') }}</a-button>
              <!-- 撤回 -->
              <a-button v-auth="'btn_recall'" class="mr-12px" type="primary" ghost @click="handelWithdraw">{{ t('common.revoke') }}</a-button>
              <!-- 批量导出 -->
              <a-button v-auth="'btn_download'" class="mr-12px" block @click="handleExport">{{ t('common.batchExport') }}</a-button>
            </a-space>
          </template>
          <template #AttachmentList="{ row }">
            <div class="table-a" v-auth="'btn_detail'" @click="handleDrawView(row, 'attachmentName', 'attachmentUrl', t('common.attachment'))"
              >{{ t('common.viewDetails') }}
            </div>
          </template>
          <template #record="{ row }">
            <div v-auth="'btn_detail'" class="table-a" @click="handleNodeModal(row)">{{ t('common.viewDetails') }} </div>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <PreviewModal ref="filePreviewRef" />
    <ExportModal @register="registerExportModal" @export="exportAction" />
    <FileListModal @register="registerFile"></FileListModal>
    <NodeModal @register="registerNodeModal"></NodeModal>
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ref, computed } from 'vue';
  import { getRepairmoldpage, repairmoldExport, repairmoldWithdraw } from '/@/api/engineering/mould';
  import { ModalComponent } from '/@/views/basicData/encodingSettings/types';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { PreviewModal } from '/@/components/Upload';
  import { getColumn, getFormSchema, getExportColumn } from './config';
  import { TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { downloadByUrl } from '/@/utils/file/download';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { message } from 'ant-design-vue';
  import FileListModal from '/@/views/engineering/mouldRoom/components/FileListModal.vue';
  import { NodeModal } from '/@/components/CustomComponents';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { t } = useI18n();
  const { hasBtnP } = usePermission();
  const { createConfirm } = useMessage();
  const emit = defineEmits(['handleAudit']);
  const props = defineProps({
    activeKey: {
      type: String,
      default: 'pending',
    },
  });
  const status = computed(() => {
    return props.activeKey === 'pending' ? 1 : 2;
  });

  const filePreviewRef = ref<ModalComponent | null>(null);
  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const [registerFile, { openModal: openFileList }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();

  const [Grid, { reload, getSelectRows, getFetchParams }] = useVbenVxeGrid({
    formOptions: {
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
      schema: getFormSchema(),
      i18nConfig: {
        moduleCode: 'RepairMoldColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: props.activeKey === 'pending' ? 'engineering-mouldRoom-repairMoldApproval-list-wait' : 'engineering-mouldRoom-repairMoldApproval-list-done',
      columns: getColumn(),
      api: getRepairmoldpage,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'RepairMoldColumn',
      },

      beforeFetch: params => {
        return {
          ...params,
          status: status.value,
        };
      },
    },
  });

  // 查看节点记录
  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.flowBillId || record.id,
      fetchSetting: {
        listField: 'flowNodeInstanceHisList',
      },
    });
  }

  // 批量撤回
  const handelWithdraw = async () => {
    const list = getSelectRows();
    if (!list.length) return message.warning(t('dict.CheckDataTip'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.PerformBatchRecallTip'),
      onOk: async () => {
        const ids = list.map(item => item.id);
        const res = await repairmoldWithdraw(ids);
        if (res.code === 200) {
          reload();
        }
      },
    });
  };

  // 操作
  function getTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: handleEdit.bind(null, row),
        auth: 'btn_edit',
      },
    ];
  }

  function handleDrawView(record, name, url, title, operation?) {
    // 需要操作（增、删）的情况下需要传递id、operation、params
    const column = [
      {
        // 文件名称
        title: t('common.fileName'),
        field: 'fileName',
        slots: { default: 'File' },
      },
      {
        // 操作
        title: t('component.table.action'),
        field: 'action',
        slots: { default: 'action' },
        width: 100,
        fixed: 'right',
      },
    ];
    let list: { fileName: string; fileUrl: string }[] = [];
    if (record[name]) {
      const names = record[name].split(',');
      const urls = record[url].split(',');
      list = names.map((name, index) => ({
        fileName: name,
        fileUrl: urls[index],
      }));
    }
    openFileList(true, {
      column,
      list,
      title,
      operation: operation && record.designIssueStatus !== 1,
      params: { fileName: name, fileUrl: url, id: record.id },
    });
  }

  // 审核
  const handleAudit = async () => {
    // 多条审批
    const list = getSelectRows();
    if (!list.length) return message.warning(t('dict.CheckDataTip'));
    const ids = list.map(item => item.id);
    emit('handleAudit', { handleType: ids.length > 1 ? 'bulk' : 'single', ids: ids, activeKey: props.activeKey });
    // openApplyPop(true, { handleType: ids.length > 1 ? 'bulk' : 'single', ids: ids, activeKey: props.activeKey });
  };

  // 批量导出
  const handleExport = () => {
    const exportColumns = getExportColumn();
    openExportModal(true, {
      listQuery: {
        ...getFetchParams(),
        status: status.value,
      },
      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
    });
  };
  const exportAction = query => {
    repairmoldExport(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  };

  // 编辑
  const handleEdit = row => {
    // 单条审批
    emit('handleAudit', { handleType: 'single', ids: [row.id], activeKey: props.activeKey });
    // openApplyPop(true, { handleType: 'single', ids: [row.id], activeKey: props.activeKey });
  };

  defineExpose({ reload });
</script>

<style lang="less" scoped>
  .lydc-content-wrapper {
    position: absolute;
  }

  .btn-wrapper {
    margin-top: 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .left-btn {
    display: flex;

    button {
      margin-right: 16px;
    }

    // 选择第二个按钮
    button:nth-child(2) {
      border: #ff7b00 solid 1px;
      color: #ff7b00;
    }
  }

  //:deep(.lydc-basic-table-action button i) {
  //  font-size: 20px;
  //}
</style>
