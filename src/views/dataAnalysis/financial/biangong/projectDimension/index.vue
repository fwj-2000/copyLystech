<!-- 订单号维度 -->
<template>
  <TableLayout class="biangong-table-layout" />
</template>

<script lang="ts" setup>
  import type { VxeGridProps } from 'vxe-table';

  import { reactive, ref } from 'vue';
  import { getAllColumns, formOptions, filterOptions } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getDimensionOtherData } from '/@/api/dataAnalysis/financial';

  defineOptions({ name: 'dataAnalysis-financial-biangong-projectDimension' });

  const attrs = reactive<VxeGridProps<any>>({
    proxyConfig: {
      autoLoad: true,
      response: {
        list: 'data.list',
        total: 'data.pagination.total',
      },
    },
  });
  const columns = ref(getAllColumns());
  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions,
      filterOptions,
    },
    tableConfig: {
      columns,
      attrs,
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startDim, endDim } = getFormParams();
        const filename = `大项目维度_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: (params: any) => getDimensionOtherData({ ...params, dimension: 'project' }),
    },
  });
</script>

<style lang="less">
  @import url('/@/views/dashboard/style.less');
</style>
