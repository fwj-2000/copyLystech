<!-- 手工数据列表 -->
<template>
  <TableLayout> </TableLayout>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { getAllColumns, formOptions } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getBudget } from '/@/api/dataAnalysis/personnel';
  import { getRowClassNameFuncByGroupKey } from '/@/views/dataAnalysis/components/BaseVxeTable/utils';

  import type { VxeGridProps } from 'vxe-table';

  defineOptions({ name: 'dataAnalysis-personnel-budget' });

  const attrs = reactive<VxeGridProps<any>>({
    rowClassName: getRowClassNameFuncByGroupKey('OrgName'),
    proxyConfig: {
      autoLoad: true,
      response: {
        list: 'data.list',
      },
    },
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
        const { startDim, endDim } = getFormParams();
        const filename = `人力预算_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: getBudget,
    },
  });
</script>

<style lang="less" scoped>
  @import url('/@/views/dataAnalysis/style.less');
</style>
