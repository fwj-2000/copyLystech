<!-- 手工数据列表 -->
<template>
  <TableLayout> </TableLayout>
  <UpdateModal @register="registerUpdatePop" @reload="handleReload" />
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { getAllColumns, formOptions } from './config';
  import { useModal } from '/@/components/Modal';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getResponsiblePerson } from '/@/api/dataAnalysis/personnel';

  import UpdateModal from './UpdateModal.vue';
  import type { VxeGridProps } from 'vxe-table';
  import { ActionItem } from '/@/components/Table';

  defineOptions({ name: 'dataAnalysis-personnel-responsible' });
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-personnel-responsible-list',
    proxyConfig: {
      autoLoad: true,
      response: {},
    },
  });
  const columns = ref(
    getAllColumns().concat([
      {
        field: 'action',
        title: '操作',
        width: 80,
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
  const [registerUpdatePop, { openModal: openUpdateModal }] = useModal();
  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions,
    },
    tableConfig: {
      columns,
      attrs,
      isFrontPagination: true,
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startDim, endDim } = getFormParams();
        const filename = `厂区负责人维护_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getResponsiblePerson,
    },
  });

  const handleReload = () => {
    api.forceUpdate();
  };

  function getTableActions(row: any): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-edit',
        onClick: () => {
          openUpdateModal(true, { row });
        },
      },
    ];
  }
</script>

<style lang="less" scoped>
  @import url('/@/views/dataAnalysis/style.less');
</style>
