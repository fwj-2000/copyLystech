<!-- 手工数据列表 -->
<template>
  <TableLayout> </TableLayout>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { customFieldOptions } from '../report/config';
  import { formOptions, getAllColumns, endWeekStr } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { useRouteParams } from '/@/views/dataAnalysis/hooks/useRouteParams';
  import { getProfitandlosMetricdetail } from '/@/api/dataAnalysis/financial';

  import type { VxeGridProps } from 'vxe-table';

  defineOptions({ name: 'dataAnalysis-financial-profit-detail' });
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-profit-detail-grid',
  });
  const columns = ref(getAllColumns());
  const { getParams } = useRouteParams();
  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions,
    },
    tableConfig: {
      columns,
      attrs,
      customFieldOptions,
      isFrontPagination: true,
      beforeQuery() {
        const { state } = api.searchFormApi;
        const { dimension, dateRange } = state.searchFormValue;
        columns.value = getAllColumns({
          dimension,
          dateRange,
        });
      },
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startDim, endDim } = getFormParams();
        const filename = `损益指标明细报表_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      getQueryExtraParams: () => {
        const { metric = '', timeDimension = '', isExpandSBU = 0, predictType = 0 } = getParams();
        return { metric, timeDimension, isExpandSBU, predictType };
      },
      api: async params => {
        const { timeDimension, dimension, ...res } = params;
        console.log('🚀 ~ params:', params);
        const timeDimensions = {
          dimension: dimension === 'week' ? dimension : timeDimension,
          // [timeDimension === 'week' ? 'dimension' : 'timeDimension']: timeDimension,
        };
        let result = await getProfitandlosMetricdetail({ ...res, ...timeDimensions });
        return result;
      },
      formatFrontData: data => {
        return data.map(item => {
          const { id, analysis, ...rest } = item;
          return {
            ...rest,
            actualChainThisPropor2: rest.actualChainThisPropor,
            actualChainThis2: rest.actualChainThis,
            code: id ?? '',
          };
        });
      },
    },
  });
</script>

<style lang="less" scoped>
  @import url('/@/views/dataAnalysis/style.less');
</style>
