<template>
  <BasicModal destroyOnClose v-bind="$attrs" :width="900" :height="600" @register="registerModal" :title="title" :draggable="true" showOkBtn @ok="handleSave">
    <div style="height: 550px">
      <Grid />
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { reactive, computed, nextTick } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getPartNumberApply, assignDrawings } from '/@/api/basicData/productCodeApply';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { BasicModal, useModalInner } from '/@/components/Modal';

  const { t } = useI18n();
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  const emits = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();

  interface State {
    /** 父料号 */
    insidePartNumber: string;
    /** 父料号`Id` */
    parentId: string;
    /** 终端客户料号 */
    terminalCustomerPartNumber: string;
    /** 终端料号版本 */
    terminalCustomerPartVersion: string;
  }

  const state = reactive<State>({
    insidePartNumber: '',
    parentId: '',
    terminalCustomerPartNumber: '',
    terminalCustomerPartVersion: '',
  });

  const title = computed(() => `${state.insidePartNumber ?? ''}${t('dict.PartNumberApply.assignDrawings')}`);

  const columns: Array<any> = [
    { type: 'checkbox', field: 'checkbox', width: 50 },
    {
      title: '产品内部料号',
      field: 'InsidePartNumber',
      width: 220,
    },
    {
      title: '终端客户料号',
      field: 'TerminalCustomerPartNumber',
      width: 120,
    },
    {
      title: '终端料号版本	',
      field: 'TerminalCustomerPartVersion',
      sortable: true,
      width: 120,
    },
    {
      title: '工厂',
      field: 'FactoryName',
      i18nField: 'Factory',
      width: 110,
    },
    {
      title: '产品描述',
      field: 'ProductDesc',
      width: 220,
    },
  ];

  const [Grid, gridApi] = useVbenVxeGrid({
    showSearchForm: false,
    gridOptions: {
      id: 'basicData-productCodeApply-assignDrawings-list',
      columns,
      api: getPartNumberApply,
      beforeFetch: (params: any) => {
        return {
          ...params,
          NeedParent: true,
          TerminalCustomerPartNumber: state.terminalCustomerPartNumber,
          TerminalCustomerPartVersion: state.terminalCustomerPartVersion,
        };
      },
      rowConfig: {
        keyField: 'Id',
      },
      checkboxConfig: {
        checkMethod: ({ row }) => {
          // 只能勾选非父料号的数据
          return row.Id !== state.parentId;
        },
      },
      toolbarConfig: {
        enabled: false,
      },
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'PartNumberApplyColumn',
      },
    },
  });

  function init(data: State) {
    Object.assign(state, data);
    initTableData();
  }

  function initTableData() {
    nextTick(() => {
      gridApi.reload();
    });
  }

  function handleSave() {
    const selectedIds = gridApi.getSelectRowKeys();
    if (selectedIds.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    }
    changeOkLoading(true);
    changeLoading(true);
    assignDrawings({ parentId: state.parentId, subIds: selectedIds })
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        emits('reload');
        closeModal();
      })
      .catch(() => {})
      .finally(() => {
        // changeOkLoading(false);
        changeOkLoading(false);
        changeLoading(false);
      });
  }
</script>

<style lang="less" scoped>
  :deep(.lydc-basic-modal .ant-modal .ant-modal-body > .scrollbar) {
    padding: 0;
  }
</style>
