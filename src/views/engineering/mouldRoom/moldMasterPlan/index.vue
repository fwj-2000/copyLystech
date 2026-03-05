<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 编辑 -->
              <a-button v-auth="'btn_edit'" type="primary" @click="handleEditPlan">{{ t('dict.CommonCol.newModelPlan') }}</a-button>
              <!-- 批量导出v-auth="'btn_download'" -->
              <a-button v-auth="'btn_download'" class="mr-12px" @click="handleExport">{{ t('common.batchExport') }}</a-button>
              <!-- 批量删除 -->
              <a-button v-auth="'btn_batchRemove'" class="mr-12px" danger @click="handelDelete">{{ t('common.batchDelText') }}</a-button>
            </a-space>
          </template>
          <!-- DFM附件 -->
          <template #DfmAttaFile="{ row }">
            <div v-auth="'btn_detail'" class="table-a" @click="handleDrawView(row, 'dfmAttaName', 'dfmAttaUrl', t('dict.NewMoldColumn.DFMAttachment'))">{{
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
    <FileListModal @register="registerFile"></FileListModal>
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { defineAsyncComponent } from 'vue';
  import { moldplanBulkDelete, moldplanPage, moldplanExport } from '/@/api/engineering/mould';
  import { usePopup } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { getColumn, getFormColumn } from './config';
  import { TableAction } from '/@/components/Table';
  import { downloadByUrl } from '/@/utils/file/download';
  import { message } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import FileListModal from '/@/views/engineering/mouldRoom/components/FileListModal.vue';

  const AddPopup = defineAsyncComponent(() => import('./components/AddPopup.vue'));
  const { t } = useI18n();

  defineOptions({ name: 'engineering-mouldRoom-moldMasterPlan' });

  const [registerAdd, { openPopup: openAddPop }] = usePopup();
  const [registerFile, { openModal: openFileList }] = useModal();
  const { createConfirm } = useMessage();

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
        moduleCode: 'MoldPlanColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'engineering-mouldRoom-moldMasterPlan-list',
      columns: getColumn(),
      api: moldplanPage,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'MoldPlanColumn',
      },
    },
  });

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
    ];
  }

  // 批量导出
  const handleExport = () => {
    const list = getSelectRows();
    if (!list.length) return message.warning(t('dict.CheckDataTip'));
    if (list.length != 1) return message.warning(t('common.selectOneText'));
    if (list[0].planStatus != 1) return message.warning(t('dict.CommonCol.planExportTip'));
    moldplanExport({
      id: list[0].id,
    }).then(res => {
      if (!res.data.url) {
        message.error(res.msg);
        return;
      }
      downloadByUrl({ url: res.data.url });
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
        const res = await moldplanBulkDelete(ids);
        if (res.code === 200) {
          reload();
        }
      },
    });
  };

  // 勾选编辑
  const handleEditPlan = () => {
    const list = getSelectRows();
    if (!list.length) return message.warning(t('dict.CheckDataTip'));
    if (list.length > 1) return message.warning(t('dict.NewMoldColumn.selectOneItemTip'));
    openAddPop(true, { type: 'edit', id: list[0].id });
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
