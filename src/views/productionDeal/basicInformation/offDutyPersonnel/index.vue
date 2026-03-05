<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 新增 -->
              <a-button v-auth="'btn_add'" type="primary" @click="handleAdd">{{ t('common.add2Text') }} </a-button>
              <!-- 批量导出v-auth="'btn_download'" -->
              <!-- <a-button class="mr-12px" @click="handleExport">{{ t('common.batchExport') }}</a-button> -->
              <!-- 批量删除 -->
              <a-button v-auth="'btn_batchRemove'" class="mr-12px" danger @click="handelDelete">{{ t('common.batchDelText') }}</a-button>
            </a-space>
          </template>

          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <!-- <ExportModal @register="registerExportModal" @export="exportAction" /> -->
    <AddModal @register="registeAddModal" @reload="reload" />
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getColumn, getFormSchema, getExportColumn } from './config';
  import { TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  // import { downloadByUrl } from '/@/utils/file/download';
  import { getTakeleavePage, blukDelete } from '/@/api/productionDeal/offDutyPersonnel';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { message } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import AddModal from './components/AddModal.vue';

  const { t } = useI18n();
  defineOptions({ name: 'productionDeal-basicInformation-offDutyPersonnel' });
  const { createConfirm } = useMessage();
  // const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const [registeAddModal, { openModal: openAddModal }] = useModal();

  const [Grid, { reload, getSelectRows, getFetchParams, getSelectRowKeys }] = useVbenVxeGrid({
    formOptions: {
      showCollapseButton: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getFormSchema(),
      i18nConfig: {
        moduleCode: 'OffDutyPersonnelColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'productionDeal-basicInformation-offDutyPersonnel-list',
      columns: getColumn(),
      api: getTakeleavePage,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'OffDutyPersonnelColumn',
      },
    },
  });

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

  // 新增
  const handleAdd = () => {
    openAddModal(true, { handleType: 'add' });
  };

  // 批量导出
  // const handleExport = () => {
  //   const exportColumns = getExportColumn();
  //   openExportModal(true, {
  //     listQuery: {
  //       ...getFetchParams(),
  //     },
  //     exportOptions: exportColumns,
  //     nameProps: 'title',
  //     idProps: 'field',
  //   });
  // };

  // const exportAction = query => {
  //   repairmoldExport(query).then(res => {
  //     if (!res.data.url) return;
  //     downloadByUrl({ url: res.data.url });
  //     closeModal();
  //   });
  // };

  // 批量删除
  const handelDelete = async () => {
    const ids = getSelectRowKeys();
    if (!ids.length) return message.warning(t('dict.CheckDataTip'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.PerformBatchDeletionTip'),
      onOk: async () => {
        const res = await blukDelete(ids);
        if (res.code === 200) {
          reload();
        }
      },
    });
  };

  // 编辑
  const handleEdit = row => {
    openAddModal(true, { handleType: 'edit', row });
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

  //:deep(.lydc-basic-table-action button i) {
  //  font-size: 20px;
  //}
</style>
