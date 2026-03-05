<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_add'" type="primary" @click="handleAddFn">{{ t('common.add') }}</a-button>
            <a-button v-auth="'btn_sendMaterial'" type="primary" ghost @click="handleSendMaterial">{{ t('common.sendMaterial') }} </a-button>
            <a-button v-auth="'btn_submit'" type="primary" ghost @click="handleConfrimFn">{{ t('common.confirmreceipt') }}</a-button>
            <a-button v-auth="'btn_batchRemove'" danger @click="handleDelete">{{ t('common.batchDelText') }}</a-button>
          </template>
          <template #FilingsApplyNo="{ row }">
            <span class="table-a" @click="goDetail(row)">{{ row.FilingsApplyNo }}</span>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <confrimModal @register="registerConfrimModal" @reload="reload" />
    <DetailPop @register="registerDetailPop"></DetailPop>
    <AddPop @register="registerAddPop" @reload="reload"></AddPop>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { gridColumns, gridFormOptions } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import DetailPop from './components/DetailPop.vue';
  import AddPop from './components/AddPop.vue';
  import { useModal } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
  import confrimModal from './components/confrimModal.vue';
  import { bulkDelete, bulkSend, deleteOutsourcemanage, getOutsourcemanage } from '/@/api/purchase/outsourcemanage';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { cloneDeep } from 'lodash-es';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';

  defineOptions({ name: 'purchase-outsourcingManagement' });

  const [registerDetailPop, { openPopup: openDetailPop }] = usePopup();
  const [registerAddPop, { openPopup: openAddPop }] = usePopup();
  const [registerConfrimModal, { openModal: openConfrimModal }] = useModal();
  const { t } = useI18n();
  const { createConfirm } = useMessage();

  const actionColumn = {
    title: t('common.action'),
    field: 'action',
    width: 100,
    fixed: 'right',
    slots: {
      default: 'action',
    },
  };

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: gridFormOptions,
    gridOptions: {
      id: 'purchase-outsourcingManagement-list',
      api: getOutsourcemanage,
      columns: [...gridColumns, actionColumn],
      rowConfig: {
        keyField: 'id',
      },
      toolbarConfig: {
        delStatus: true,
      },
      pagerConfig: {
        pageSize: 100,
        autoHidden: false,
      },
      showOverflow: true,
      stripe: true,
      border: 'full',
      i18nConfig: {
        moduleCode: 'OutsourceManageColumn',
      },
    },
  });

  const { reload, getSelectRowKeys, getSelectRows, clearSelectedRowKeys } = gridApi;

  function handleAddFn() {
    openAddPop(true, {
      title: t('common.add'),
    });
  }

  function handleConfrimFn() {
    const receiveTable = getSelectRows().filter(item => item.sendStatus === 1 && item.receiveStatus === 0);
    openConfrimModal(true, { receiveTable });
  }

  async function handleSendMaterial() {
    const ids = getSelectRowKeys();
    if (ids && ids.length === 0) {
      return message.warning(t('common.checkOperationText'));
    }
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.toSendMaterials'),
      onOk: async () => {
        try {
          const { code, msg } = await bulkSend(ids);
          if (code === 200) {
            message.success(msg);
            clearSelectedRowKeys();
            return reload();
          }
          message.error(msg);
        } catch (error) {
          console.error('🚀 ~ index.vue:118 ~ handleSendMaterial ~ error:', error);
          throw new Error('handleSendMaterial is error ');
        }
      },
      onCancel: () => {},
    });
  }

  function deleteFn({ id }) {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.sureToDeleteText'),
      onOk: async () => {
        try {
          const { code, msg } = await deleteOutsourcemanage(id);
          if (code === 200) {
            message.success(msg);
            clearSelectedRowKeys();
            return reload();
          }
          message.error(msg);
        } catch (error) {
          console.error('🚀 ~ index.vue:140 ~ deleteFn ~ error:', error);
          throw new Error('handleSendMaterial is error ');
        }
      },
      onCancel: () => {},
    });
  }

  function goEdit(record) {
    openAddPop(true, {
      title: t('common.editText'),
      data: cloneDeep(record),
    });
  }
  function goDetail(record) {
    openDetailPop(true, {
      title: t('dict.CommonCol.outsourcingDetails'),
      data: [record],
    });
  }

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-edit',
        onClick: goEdit.bind(null, record),
        auth: 'btn_edit',
      },
      {
        icon: 'icon-ym icon-ym-view',
        onClick: goDetail.bind(null, record),
        auth: 'btn_detail',
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
      return message.warning(t('common.deleteObjectText'));
    }
    try {
      const { code, msg } = await bulkDelete(ids);
      if (code === 200) {
        message.success(msg);
        clearSelectedRowKeys();
        return reload();
      }
      message.error(msg);
    } catch (error) {
      console.error('🚀 ~ index.vue:195 ~ handleDelete ~ error:', error);
      throw new Error('handleSendMaterial is error ');
    }
  }

  onMounted(() => {
    // reload();
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
