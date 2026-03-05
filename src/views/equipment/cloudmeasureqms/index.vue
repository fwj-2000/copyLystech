<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_add'" type="primary" @click="addOrUpdateHandle()">{{ t('common.add') }}</a-button>
            <a-button v-auth="'btn_batchRemove'" danger @click="handleDeleteList()">{{ t('common.batchDelText') }}</a-button>
          </template>
          <template #action="{ row }">
            <TableAction :outside="true" :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <add @register="registerForm" @reload="reload" />
  </div>
</template>

<script setup lang="ts">
  import { ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { getQMS, deleteQMS, blukDeleteQMS } from '/@/api/equipment/cloudmeasureqms';
  import { columns, getQuotaFormConfig } from './config';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { message } from 'ant-design-vue';
  import add from './components/add.vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  const { t } = useI18n();

  defineOptions({ name: 'equipment-cloudmeasureqms-index' });
  const [registerForm, { openModal: openFormModal }] = useModal();
  const [Grid, { getSelectRowKeys, clearSelectedRowKeys, reload }] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: getQuotaFormConfig(),
    },
    gridOptions: {
      id: 'equipment-cloudmeasureqms',
      columns: columns as any,
      showIndexColumn: true,
      showFooter: false,
      api: getQMS,
      rowConfig: {
        keyField: 'id',
        isCurrent: false, // 完全禁用行高亮
      },
      columnConfig: {
        isCurrent: true, // 启用列高亮
      },
      currentColumnConfig: {
        isFollowSelected: true, // 高亮跟随选中
      },
    },
  });
  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: addOrUpdateHandle.bind(null, record),
        auth: 'btn_edit',
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          title: t('common.delText'),
          onOk: handleDelete.bind(null, record),
          iconType: 'delete',
        },
        auth: 'btn_remove',
      },
    ];
  }

  const { createMessage, createConfirm } = useMessage();

  //新增或者修改
  function addOrUpdateHandle(record = {}) {
    openFormModal(true, record);
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deleteQMS(record.id).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

  // 批量删除
  async function handleDeleteList() {
    const list = getSelectRowKeys() ?? [];

    if (list.length === 0) {
      clearSelectedRowKeys();
      return message.warning(t('common.selectDelDatasTip'));
    }

    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.delTip'),
      onOk: () => {
        void (async () => {
          try {
            const { code } = await blukDeleteQMS(list);
            if (code === 200) {
              message.success(t('common.delSuccess'));
            }
          } finally {
            clearSelectedRowKeys();
            reload();
          }
        })();
      },
    });
  }
</script>
