<template>
  <div class="lydc-content-wrapper h-[100%]">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_add'" type="primary" @click="addOrUpdateHandle()">{{ t('common.add') }}</a-button>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
  </div>
  <editCheck @register="registerForm" @reload="GridApi.reload" />
  <checkModal @register="registerCheckModal" @reload="GridApi.reload" />
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import editCheck from './components/editCheck.vue';
  import checkModal from './components/checkModal.vue';
  import { getCheckt, deleteCheck } from '/@/api/productionDeal/checkProject';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { schemaCheck, columnCheck } from './config';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();
  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerCheckModal, { openModal: openCheckModal }] = useModal();
  const { t } = useI18n();

  const [Grid, GridApi] = useVbenVxeGrid({
    formOptions: {
      showCollapseButton: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: schemaCheck,
    },
    gridOptions: {
      id: 'productionDeal-dieCut-checkProject-check',
      columns: columnCheck as any,
      api: getCheckt,
      showIndexColumn: true,
    },
  });

  // 操作
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
          onOk: onDelete.bind(null, record.id),
        },
        auth: 'btn_remove',
        tooltip: t('common.delText'),
      },
      {
        icon: 'icon-ym icon-ym-extend-paper-plane',
        onClick: check.bind(null, record),
        tooltip: t('dict.CommonCol.check'),
        auth: 'check',
      },
    ];
  }
  //新增或者修改
  function addOrUpdateHandle(record = {}) {
    openFormModal(true, record);
  }
  async function check(record) {
    openCheckModal(true, record);
  }
  async function onDelete(id) {
    const { code, msg } = await deleteCheck(id);
    if (code === 200) {
      createMessage.success(msg);
      GridApi.reload();
    }
  }
</script>
