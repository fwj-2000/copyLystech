<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button v-auth="'btn_add'" type="primary" @click="addOrUpdateHandle()">{{ t('common.add2Text') }}</a-button>
              <a-button v-auth="'btn_batchRemove'" @click="handleDeleteList()">{{ t('common.batchDelText') }}</a-button>
            </a-space>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <add @register="registerAddForm" @reload="reload" />
  </div>
</template>

<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ActionItem } from '/@/components/Table';
  import { searchFormSchema, column } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { getPositionStaff, deletePositionStaff, blukPositionStaff } from '/@/api/productionDeal/positionStaff';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { message } from 'ant-design-vue';
  import add from './components/add.vue';
  defineOptions({ name: 'productionDeal-basicInformation-positionStaff' });
  const { t } = useI18n();

  const [registerAddForm, { openModal: openFormModal }] = useModal();

  const [Grid, { reload, getSelectRowKeys }] = useVbenVxeGrid({
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
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: searchFormSchema,
      i18nConfig: {
        moduleCode: 'ApplyWorkProcessPersonnelColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'productionDeal-basicInformation-positionStaff-list',
      columns: column as any,
      api: getPositionStaff,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'ApplyWorkProcessPersonnelColumn',
      },
    },
  });
  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: addOrUpdateHandle.bind(null, record),
        tooltip: t('common.edit'),
        auth: 'btn_edit',
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          title: t('common.delText'),
          onOk: handleDelete.bind(null, record),
        },
        tooltip: t('common.delText'),
        auth: 'btn_remove',
      },
    ];
  }

  const { createMessage, createConfirm } = useMessage();

  //新增或者修改
  function addOrUpdateHandle(data = {}) {
    openFormModal(true, data);
  }

  //单个删除
  function handleDelete(record: Recordable) {
    deletePositionStaff(record.id).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

  //批量删除
  async function handleDeleteList() {
    const list = getSelectRowKeys();
    if (list?.length === 0) {
      return message.warning(t('common.selectDelDatasTip'));
    }
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.beforeDelTip'),
      onOk: async () => {
        const { code } = await blukPositionStaff(list);
        if (code == 200) {
          message.success(t('common.delSuccess'));
          reload();
        }
      },
    });
  }
</script>

<style scoped lang="less">
  .pldr {
    color: #ff7b00;
  }
</style>
