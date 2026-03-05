<!-- 费用目标 -->
<template>
  <TableLayout>
    <template #toolbarLeft>
      <ToolBarAction />
      <a-button type="primary" @click="syncDataAdd">{{ t('common.add') }}</a-button>
      <a-button type="primary" @click="syncDataDele">{{ t('common.batchDelText') }}</a-button>
    </template>
    <template #toolbarRight> 备注：开始元≧，结束元＜ </template>
  </TableLayout>
  <UpdateModal @register="registerUpdatePop" @reload="refreshData" />
</template>

<script lang="ts" setup>
  defineOptions({ name: 'dataAnalysis-financial-biangong-priceRange' });
  import { reactive, computed } from 'vue';
  import { getAllColumns, formOptions } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import type { VxeGridProps } from 'vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getpriceRange, delPriceRangeDel } from '/@/api/dataAnalysis/financial';
  import { useModal } from '/@/components/Modal';
  import UpdateModal from './components/UpdateModal.vue';
  import ToolBarAction from './ToolBarAction.vue';

  const [registerUpdatePop, { openModal: openUpdateModdal }] = useModal();

  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();
  const columns = getAllColumns();

  const columnsWithActions = computed(() => {
    return columns.map(col => {
      if (col.title === '操作') {
        return {
          ...col,
          params: {
            ...col.params,
            getTableActions: (row: any) => {
              return [
                {
                  icon: 'icon-ym icon-ym-edit',
                  onClick: () => {
                    const { Id, PriceStart, PriceEnd, PriceRange } = row;
                    openUpdateModdal(true, { Id, PriceStart, PriceEnd, PriceRange });
                  },
                },
              ];
            },
          },
        };
      }
      return col;
    });
  });
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-biangong-priceRange-list',
  });

  const tableConfig = reactive({
    formConfig: {
      formOptions,
    },
    tableConfig: {
      isFrontPagination: true,
      columns: columnsWithActions,
      attrs,
      getExportParams: () => {
        const filename = `区间列表`;
        return {
          filename,
        };
      },
      api: getpriceRange,
    },
  });

  const [TableLayout, api] = useTableLayout(tableConfig);

  const syncDataAdd = () => {
    openUpdateModdal(true, { Id: '' });
  };
  const refreshData = () => {
    api.forceUpdate();
  };
  async function syncDataDele() {
    const gridInstance = api.getGridInstance();
    const ids = gridInstance.getCheckboxRecords().map(item => item.Id);
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
          const { code } = await delPriceRangeDel(ids);
          if (code == 200) {
            createMessage.success(t('common.delSuccess'));
          } else {
            createMessage.error('删除失败');
          }
        } catch (e) {
          createMessage.error('删除失败');
        } finally {
          gridInstance.clearCheckboxRow();
          refreshData();
        }
      },
    });
  }
</script>

<style lang="less" scoped>
  @import url('/@/views/dataAnalysis/style.less');
</style>
