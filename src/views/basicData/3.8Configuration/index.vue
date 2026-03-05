<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button v-auth="'btn_add'" type="primary" @click="handleAdd"> {{ t('common.add2Text') }} </a-button>
              <a-button v-auth="'btn_batchRemove'" @click="handleBatchDelete" danger> {{ t('common.batchDelText') }} </a-button>
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
  import { getConfig3_8, blukDeleteConfig3_8 } from '/@/api/basicData/3.8Configuration';
  import { useModal } from '/@/components/Modal';
  import { cloneDeep } from 'lodash-es';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import FormModal from './components/formModal.vue';

  defineOptions({ name: 'basicData-3.8Configuration' });

  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();

  const [registerFormModal, { openModal: openFormModal }] = useModal();

  const [Grid, gridApi] = useVbenVxeGrid({
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
        moduleCode: '3.8ConfigurationColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'basicData-3.8Configuration-list',
      api: getConfig3_8,
      areaConfig: {
        multiple: true, // 是否启用多区域选取功能
      },
      showIndexColumn: true,
      columns,
      i18nConfig: {
        moduleCode: '3.8ConfigurationColumn',
      },
    },
  });

  function getTableActions(record) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: handleEdit.bind(null, record),
        auth: 'btn_edit',
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: handleDelete.bind(null, record),
        },
        auth: 'btn_remove',
      },
    ];
  }

  function reload() {
    gridApi.reload();
  }

  function handleEdit(row) {
    openFormModal(true, cloneDeep(row));
  }

  function handleAdd() {
    openFormModal(true, {});
  }

  async function handleDelete(row) {
    return blukDeleteConfig3_8({ Ids: [row.id] })
      .then(res => {
        res.code === 200 && createMessage.success(res.msg || t('common.delSuccess'));
      })
      .finally(reload);
  }

  function handleBatchDelete() {
    const checkedList = gridApi.getSelectRows();
    if (checkedList.length === 0) {
      return createMessage.warning(t('common.selectDataTip'));
    }
    const ids = checkedList.map(item => item.id);
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.batchDelTip'),
      onOk: () =>
        blukDeleteConfig3_8({ Ids: ids })
          .then(res => {
            res.code === 200 && createMessage.success(res.msg || t('common.delSuccess'));
          })
          .finally(reload),
    });
  }
</script>
