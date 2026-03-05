<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button v-auth="'btn_add'" type="primary" @click="handleAdd"> {{ t('common.add2Text') }} </a-button>
              <a-button v-auth="'btn_enable'" type="primary" ghost @click="handleBatchEnable"> {{ t('common.enableText') }} </a-button>
              <a-button v-auth="'btn_disable'" type="primary" ghost @click="handleBatchdisable"> {{ t('common.disableText') }} </a-button>
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
  </div>
</template>

<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { columns, schema } from './config';
  import { getSyncSchedule, blukDeleteSyncSchedule, enableSyncSchedule, disableSyncSchedule } from '/@/api/mps/productionPlan/schedulingBasicList';
  import { useModal } from '/@/components/Modal';
  import { cloneDeep } from 'lodash-es';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import FormModal from './components/formModal.vue';

  defineOptions({ name: 'productionPlan-main-schedulingBasicList' });

  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();

  const [registerFormModal, { openModal: openFormModal }] = useModal();

  const [Grid, { reload, getSelectRowKeys }] = useVbenVxeGrid({
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
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema,
      i18nConfig: {
        moduleCode: 'MPSColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'productionPlan-main-schedulingBasicList-list',
      api: getSyncSchedule,
      columns,
      i18nConfig: {
        moduleCode: 'MPSColumn',
      },
    },
  });

  function getTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: handleEdit.bind(null, row),
        auth: 'btn_edit',
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: handleDelete.bind(null, row),
        },
        auth: 'btn_remove',
      },
    ];
  }

  async function handleBatchEnable() {
    const ids = getSelectRowKeys();
    if (ids.length === 0) {
      return createMessage.warning(t('common.selectDataTip'));
    }
    const { code, msg } = await enableSyncSchedule(ids);
    if (code == 200) {
      createMessage.success(msg);
      reload();
      return;
    }
    createMessage.error(msg);
  }

  async function handleBatchdisable() {
    const ids = getSelectRowKeys();
    if (ids.length === 0) {
      return createMessage.warning(t('common.selectDataTip'));
    }
    const { code, msg } = await disableSyncSchedule(ids);
    if (code == 200) {
      createMessage.success(msg);
      reload();
      return;
    }
    createMessage.error(msg);
  }

  function handleEdit(row) {
    openFormModal(true, { row: cloneDeep(row) });
  }

  function handleAdd() {
    openFormModal(true, {});
  }

  async function handleDelete(row) {
    return blukDeleteSyncSchedule([row.id])
      .then(res => {
        res.code === 200 && createMessage.success(res.msg || t('common.delSuccess'));
      })
      .finally(reload);
  }

  function handleBatchDelete() {
    const ids = getSelectRowKeys();
    if (ids.length === 0) {
      return createMessage.warning(t('common.selectDataTip'));
    }
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.batchDelTip'),
      onOk: () =>
        blukDeleteSyncSchedule(ids)
          .then(res => {
            res.code === 200 && createMessage.success(res.msg || t('common.delSuccess'));
          })
          .finally(reload),
    });
  }
</script>
