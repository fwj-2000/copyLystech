<template>
  <TableLayout v-show="visible" class="biangong-table-layout">
    <template #toolbarRight>
      <a-space>
        <a-button type="primary" @click="handleAdd()">{{ t('common.add') }}</a-button>
        <a-button type="primary" @click="syncDataDele">{{ t('common.batchDelText') }}</a-button>
      </a-space>
    </template>
  </TableLayout>
  <ApplyPop v-show="!visible" @register="registerApplyPop" @reload="api.forceUpdate()" @handleCloseFlag="handleCloseFlag" />
  <UpdateModal @register="registerUpdatePop" @reload="api.forceUpdate()" />
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import type { VxeGridProps } from 'vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';

  import { getStandardDayMainte, delStandardDayMainte } from '/@/api/dataAnalysis/warehouseKanban';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ActionItem } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import UpdateModal from './components/UpdateModal.vue';
  import ApplyPop from './components/ApplyPopupVxe.vue';
  import { usePopup } from '/@/components/Popup';

  import { getAllColumns, formOptions } from './config';
  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();
  const [registerUpdatePop, { openModal: openUpdateModal }] = useModal();
  const [registerApplyPop, { openPopup: openApplyPopup, getVisible }] = usePopup();
  const visible = ref(true);
  defineOptions({ name: 'warehouseKanban-positionComparisonTable' });
  const columns = ref(
    getAllColumns().concat([
      {
        field: 'action',
        title: '操作',
        width: 80,
        align: 'center',
        fixed: 'right',
        slots: {
          default: 'action',
        },
        params: {
          getTableActions,
        },
      },
    ]),
  );
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-warehouseKanban-standMainteDayPage-list',
    proxyConfig: {
      response: {
        total: 'data.pagination.total',
        list: 'data.list',
      },
    },
  });

  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions,
    },
    tableConfig: {
      columns,
      attrs,
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startDim, endDim } = getFormParams();
        const filename = `${t('routes.warehouseKanban-positionComparisonTable')}-${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getStandardDayMainte,
    },
  });
  async function syncDataDele() {
    const gridInstance = api.getGridInstance();
    const ids = gridInstance.getCheckboxRecords().map(item => item.id);
    if (!ids.length) {
      createMessage.warning(t('dict.keyProcess.project'));
      return;
    }
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.delTip'),
      onOk: async () => {
        try {
          const { code } = await delStandardDayMainte(ids);
          if (code == 200) {
            createMessage.success(t('common.delSuccess'));
          } else {
            createMessage.error('删除失败');
          }
        } catch (e) {
          createMessage.error('删除失败');
        } finally {
          gridInstance.clearCheckboxRow();
          gridInstance.commitProxy('reload');
        }
      },
    });
  }

  function handleAdd(id = '') {
    visible.value = false;
    openApplyPopup(true, { id });
  }
  function handleCloseFlag(val: boolean) {
    visible.value = true;
  }
  function getTableActions(row: any): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-edit',
        onClick: () => {
          openUpdateModal(true, { ...row });
        },
      },
    ];
  }
</script>

<style lang="less" scoped></style>
