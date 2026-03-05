<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 审批v-auth="'btn_approve'" -->
              <a-button type="primary" @click="handleAgree" v-if="activeKey === 'pending'">同意</a-button>
              <a-button type="primary" ghost @click="handleReject" v-if="activeKey === 'pending'">驳回</a-button>
              <!-- 批量导出v-auth="'btn_download'" -->
              <a-button class="mr-12px" block @click="handleExport">{{ t('common.batchExport') }}</a-button>
            </a-space>
          </template>
          <template #AttachmentList="{ row }">
            <!-- v-auth="'btn_detail'" -->
            <div class="table-a" @click="handleDrawView(row, 'attachmentName', 'attachmentUrl', t('common.attachment'))">{{ t('common.viewDetails') }} </div>
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
    <RejectModal @register="registerRejectModal" @reload="reload" />
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ref, computed } from 'vue';
  import { getRepairmoldpage, repairmoldExport } from '/@/api/engineering/mould';
  import { ModalComponent } from '/@/views/basicData/encodingSettings/types';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { PreviewModal } from '/@/components/Upload';
  import { getColumn, formSchema, getExportColumn } from './config';
  import { TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { RejectModal } from '/@/components/CustomComponents';
  import { downloadByUrl } from '/@/utils/file/download';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { message } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { rejectMaterial } from '/@/api/purchase/newMateria';
  import FileListModal from '/@/views/engineering/mouldRoom/components/FileListModal.vue';

  const { t } = useI18n();
  const { hasBtnP } = usePermission();
  const emit = defineEmits(['handleDetail']);
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
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  const [registerFile, { openModal: openFileList }] = useModal();

  const { createMessage, createConfirm } = useMessage();
  const [Grid, { reload, getSelectRows, getSelectRowKeys, getFetchParams, setFieldValue }] = useVbenVxeGrid({
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
      schema: formSchema,
      // i18nConfig: {
      //   moduleCode: 'RepairMoldColumn',
      //   transferRange: ['placeholder'],
      // },
    },
    gridOptions: {
      id: props.activeKey === 'pending' ? 'engineering-mouldRoom-repairMoldApproval-list-wait' : 'engineering-mouldRoom-repairMoldApproval-list-done',
      columns: getColumn(),
      api: getRepairmoldpage,
      showIndexColumn: true,
      beforeFetch: params => {
        return {
          ...params,
          status: status.value,
        };
      },
      // i18nConfig: {
      //   moduleCode: 'RepairMoldColumn',
      // },
    },
  });

  // 操作
  function getTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleDetail.bind(null, row, 'details'),
        // auth: 'btn_edit',
      },
    ];
  }

  //新增或者修改
  async function handleDetail(record, type) {
    emit('handleDetail', { type, record });
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

  // 同意
  const handleAgree = async () => {
    const ids = getSelectRowKeys();
    if (!ids.length) return message.warning(t('dict.CheckDataTip'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.agreenOperationText'),
      onOk: async () => {
        // 获取勾选的数据
        // const res = await repairmoldDelete(ids);
        // if (res.code === 200) {
        //   reload();
        // }
      },
    });
  };

  //  驳回
  async function handleReject() {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      return openRejectModal(true, {
        api: rejectMaterial,
        ids: idList,
      });
    }
    createMessage.info(t('common.selectText'));
  }

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
