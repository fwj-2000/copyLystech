<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white p-10px">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 新增 -->
              <a-button v-auth="'btn_add'" type="primary" @click="handleAdd">{{ t('common.add2Text') }} </a-button>
              <!-- 批量撤回 -->
              <a-button type="primary" v-auth="'btn_recall'" ghost class="mr-12px" @click="handleWithdraw">{{ t('dict.FilingsApplyStatusEnum.5') }}</a-button>
              <!-- 批量导出 -->
              <a-button v-auth="'btn_download'" class="mr-12px" @click="handleExport">{{ t('common.batchExport') }}</a-button>
              <!-- 批量删除 -->
              <a-button v-auth="'btn_batchRemove'" class="mr-12px" danger @click="handelDelete">{{ t('common.batchDelText') }}</a-button>
            </a-space>
          </template>

          <!-- 状态 -->
          <template #IssueNumber="{ row }">
            <Lydc-tag v-if="row.status === 0" theme="gray">{{ t('dict.newMoldStatus.0') }}</Lydc-tag>
            <Lydc-tag v-else-if="row.status === 1" theme="gray">{{ t('dict.newMoldStatus.1') }}</Lydc-tag>
            <Lydc-tag v-else-if="row.status === 2 && row.issueNumber === 1" theme="green">{{ t('dict.newMoldStatus.2') }}</Lydc-tag>
            <Lydc-tag v-else theme="blue">{{ $t('dict.newMoldStatus.3', [row.issueNumber]) }}</Lydc-tag>
          </template>
          <!-- DFM附件 -->
          <template #DfmAttaFile="{ row }">
            <div class="table-a" v-auth="'btn_detail'" @click="handleDrawView(row, 'dfmAttaName', 'dfmAttaUrl', t('dict.NewMoldColumn.DFMAttachment'))">{{
              t('common.viewDetails')
            }}</div>
          </template>
          <!-- 客户图纸 -->
          <template #CustomerFile="{ row }">
            <div
              v-auth="'btn_detail'"
              class="table-a"
              @click="handleDrawView(row, 'customerDrawAttaName', 'customerDrawAttaUrl', t('dict.PartNumberApplyDrawingsType.CustomerDrawings'))"
              >{{ t('common.viewDetails') }}</div
            >
          </template>
          <!-- 报价单附件 -->
          <template #QuotationFile="{ row }">
            <div
              v-auth="'btn_detail'"
              class="table-a"
              @click="handleDrawView(row, 'quotationAttaName', 'quotationAttaUrl', t('dict.NewMoldColumn.quotationAttachment'))"
              >{{ t('common.viewDetails') }}</div
            >
          </template>
          <!-- 模块分析附件 -->
          <template #MfaFile="{ row }">
            <div v-auth="'btn_detail'" class="table-a" @click="handleDrawView(row, 'mfaAttaName', 'mfaAttaUrl', t('dict.NewMoldColumn.moldFlowAttachment'))">{{
              t('common.viewDetails')
            }}</div>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <AddPopup @register="registerAdd" @reload="reload" />
    <PreviewModal ref="filePreviewRef" />
    <ExportModal @register="registerExportModal" @export="exportAction" />
    <FileListModal @register="registerFile"></FileListModal>
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ref } from 'vue';
  import { getNewmoldpage, newmoldExport, newmoldDelete, newmoldWithdraw, newmoldIssue } from '/@/api/engineering/mould';
  import { usePopup } from '/@/components/Popup';
  import { ModalComponent } from '/@/views/basicData/encodingSettings/types';
  import { useI18n } from '/@/hooks/web/useI18n';
  import AddPopup from './components/AddPopup.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useModal } from '/@/components/Modal';
  import { PreviewModal } from '/@/components/Upload';
  import { getColumn, getFormColumn, getExportColumn } from './config';
  import { TableAction } from '/@/components/Table';
  import { downloadByUrl } from '/@/utils/file/download';
  import { message } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import FileListModal from '/@/views/engineering/mouldRoom/components/FileListModal.vue';

  const { t } = useI18n();

  defineOptions({ name: 'engineering-mouldRoom-newMold' });

  const [registerAdd, { openPopup: openAddPop }] = usePopup();
  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const [registerFile, { openModal: openFileList }] = useModal();
  const { createConfirm } = useMessage();

  const filePreviewRef = ref<ModalComponent | null>(null);

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
      schema: getFormColumn(),
      i18nConfig: {
        moduleCode: 'NewMoldColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'engineering-mouldRoom-newMold-list',
      columns: getColumn(),
      api: getNewmoldpage,
      showIndexColumn: true,
      beforeFetch: params => handleParams(params),
      i18nConfig: {
        moduleCode: 'NewMoldColumn',
      },
    },
  });

  // 处理参数
  function handleParams(params) {
    if (params.pickerVal) {
      params.creatorTimeStart = params.pickerVal[0];
      params.creatorTimeEnd = params.pickerVal[1];
      delete params.pickerVal;
    }
    return params;
  }

  function handleDrawView(record, name, url, title, operation?) {
    // 需要操作（增、删）的情况下需要传递id、operation、params
    const column = [
      {
        title: t('common.fileName'),
        field: 'fileName',
        slots: { default: 'File' },
      },
      {
        title: t('component.nodeModal.table.action'),
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

  function getTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: handleEdit.bind(null, row),
        auth: 'btn_edit',
      },
      {
        icon: 'icon-ym icon-ym-btn-download',
        onClick: designissueFn.bind(null, row),
        auth: 'btn_issue',
        tooltip: t('dict.CommonCol.issue'),
      },
    ];
  }

  const designissueFn = async record => {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.CommonCol.confirmIssueTip'),
      onOk: async () => {
        const { code } = await newmoldIssue(record.id);
        if (code === 200) {
          message.success(t('dict.CommonCol.issueSuccess'));
          reload();
        }
      },
    });
  };

  // 批量导出
  const handleExport = () => {
    const exportColumns = getExportColumn();
    openExportModal(true, {
      listQuery: {
        ...getFetchParams(),
      },
      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
    });
  };
  const exportAction = query => {
    newmoldExport(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  };

  // 批量撤回
  const handleWithdraw = async () => {
    const list = getSelectRows();
    if (!list.length) return message.warning(t('dict.CheckDataTip'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.PerformBatchRecallTip'),
      onOk: async () => {
        // 获取勾选的数据
        const ids = list.map(item => item.id);
        const res = await newmoldWithdraw(ids);
        if (res.code === 200) {
          reload();
        }
      },
    });
  };

  // 批量删除
  const handelDelete = async () => {
    const list = getSelectRows();
    if (!list.length) return message.warning(t('dict.CheckDataTip'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.PerformBatchDeletionTip'),
      onOk: async () => {
        // 获取勾选的数据
        const ids = list.map(item => item.id);
        const res = await newmoldDelete(ids);
        if (res.code === 200) {
          reload();
        }
      },
    });
  };

  // 新增
  const handleAdd = () => {
    openAddPop(true, { type: 'add' });
  };

  // 编辑
  const handleEdit = (row: any) => {
    openAddPop(true, { type: 'edit', id: row.id });
  };
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
</style>
