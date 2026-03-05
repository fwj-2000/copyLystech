<!-- 库存计提汇总表 -->
<template>
  <TableLayout />
</template>

<script lang="ts" setup>
  import type { VxeGridProps } from 'vxe-table';

  import { reactive, ref } from 'vue';
  import { getAllColumns, formOptions } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getInventoryWipDetail } from '/@/api/dataAnalysis/financial';
  import { DATE_RANGE_ENUM } from '../config';

  defineOptions({ name: 'dataAnalysis-financial-inventory-wip-detail' });

  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-inventory-wip-detail-list',
  });
  const columns = ref(getAllColumns());
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
        const { date, type } = getFormParams();
        const filename = `WIP工单明细_${date}_${getDateRangeEnumKey(type)}`;
        return {
          filename,
        };
      },
      api: getInventoryWipDetail,
    },
  });

  function getDateRangeEnumKey(type: string) {
    let key = '';
    for (const k in DATE_RANGE_ENUM) {
      if (DATE_RANGE_ENUM[k] === type) {
        key = k;
        break;
      }
    }
    return key;
  }
</script>

<style lang="less">
  @import url('/@/views/dashboard/style.less');
</style>

<style lang="less" scoped>
  :deep(td .vxe-cell) {
    height: 32px !important;
  }
</style>
