<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicForm @register="registerForm" @submit="handleSearch" @reset="handleReset" />
      </div>

      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 新增 -->
              <a-button type="primary" v-auth="'btn_add'" @click="handleAdd">{{ t('common.add2Text') }} </a-button>
              <!-- 批量删除 -->
              <a-button v-auth="'btn_batchRemove'" class="mr-12px" danger @click="handelDelete">{{ t('common.batchDelText') }}</a-button>
              <!-- 修改 -->
              <a-button type="primary" v-auth="'btn_edit'" ghost @click="handleEdit">{{ t('dict.CommonCol.modify') }}</a-button>
              <!-- 批量导出 -->
              <a-button v-auth="'btn_download'" class="mr-12px" @click="handleExport">{{ t('common.batchExport') }}</a-button>
            </a-space>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <ExportModal @register="registerExportModal" @export="exportAction" />
    <AddModal @register="registerAdd" @reload="reload"></AddModal>
    <EditModal @register="registerEdit" @reload="reload"></EditModal>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getBusinessscopePage, businessscopeBulkDelete, businessscopeExport } from '/@/api/equipment/equipmentLedger';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { getColumn, getFormSchema, getExportColumn } from './config';
  import { TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { downloadByUrl } from '/@/utils/file/download';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { message } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import AddModal from './components/AddModal.vue';
  import EditModal from './components/EditModal.vue';
  import { BasicForm, useForm } from '/@/components/Form';

  const { t } = useI18n();
  const { hasBtnP } = usePermission();
  defineOptions({ name: 'equipment-scopeMaintenance' });
  const { createConfirm } = useMessage();
  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const [registerAdd, { openModal: openAddModal }] = useModal();
  const [registerEdit, { openModal: openEditModal }] = useModal();

  const [registerForm, { getFieldsValue, clearValidate }] = useForm({
    baseColProps: { span: 5 },
    showActionButtonGroup: true,
    showAdvancedButton: false,
    compact: true,
    autoAdvancedLine: 1,
    actionColOptions: {
      span: 4,
    },
    schemas: getFormSchema(),
    i18nConfig: {
      moduleCode: 'BusinessScopeColumn',
      transferRange: ['placeholder'],
    },
  });

  const [Grid, { reload, getSelectRows, getFetchParams, getSelectRowKeys }] = useVbenVxeGrid({
    gridOptions: {
      id: 'equipment-scopeMaintenance-list',
      columns: getColumn(),
      api: getBusinessscopePage,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'BusinessScopeColumn',
      },
      beforeFetch: params => {
        return {
          ...params,
          ...getFieldsValue(),
          buS: getFieldsValue().buS && getFieldsValue().buS.join(','),
          codeS: getFieldsValue().codeS && getFieldsValue().codeS.join(','),
        };
      },
    },
  });

  // 操作
  function getTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: handleSingleEdit.bind(null, row),
        tooltip: t('common.editText'),
        auth: 'btn_edit',
      },
    ];
  }

  function handleSearch() {
    reload();
  }

  function handleReset() {
    clearValidate();
    reload();
  }

  function handleSingleEdit(row) {
    openEditModal(true, { row });
  }

  // 新增
  const handleAdd = () => {
    openAddModal(true, {});
  };

  // 批量导出
  const handleExport = async () => {
    const formValue = getFieldsValue();
    const exportColumns = getExportColumn();
    openExportModal(true, {
      listQuery: {
        ...formValue,
        ...(await getFetchParams()),
        buS: formValue.buS && formValue.buS.join(','),
        codeS: formValue.codeS && formValue.codeS.join(','),
      },
      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
    });
  };
  const exportAction = query => {
    businessscopeExport(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  };

  // 批量删除
  const handelDelete = async () => {
    const ids = getSelectRowKeys();
    if (!ids.length) return message.warning(t('dict.CheckDataTip'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.PerformBatchDeletionTip'),
      onOk: async () => {
        // 获取勾选的数据
        const res = await businessscopeBulkDelete(ids);
        if (res.code === 200) {
          message.success(res.msg);
          reload();
        }
      },
    });
  };

  // 编辑
  const handleEdit = () => {
    const rows = getSelectRows();
    if (!rows.length) return message.warning(t('dict.CheckDataTip'));
    if (rows.length > 1) return message.warning(t('dict.CommonCol.selectedOneData'));
    openEditModal(true, { row: rows[0] });
  };

  onMounted(() => {
    reload();
  });
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
