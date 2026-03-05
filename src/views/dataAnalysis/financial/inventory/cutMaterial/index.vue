<!-- 分切料头列表 -->
<template>
  <TableLayout> </TableLayout>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { getAllColumns, formOptions, filterOptions } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getCutMaterialHead } from '/@/api/dataAnalysis/financial';
  import Decimal from 'decimal.js';

  import type { VxeGridProps } from 'vxe-table';

  defineOptions({ name: 'dataAnalysis-financial-inventory-cutMaterial' });

  const attrs = reactive<VxeGridProps<any>>({
    proxyConfig: {
      response: {
        list: 'data.list',
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
      isFrontPagination: true,
      footerFiled: 'data.total',
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startDim, endDim } = getFormParams();
        const filename = `分切料头_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: params =>
        getCutMaterialHead(params).then(res => {
          const data = res?.data || {};

          // 计算尾行合计数据
          const fieldList = ['Env', ...(data?.[0]?.List || []).map((item: any) => item.keys)];
          const total = { Factory: 'total', Drop: 0, Env: 0 };
          fieldList.forEach((field: any) => {
            const isEnv = field === 'Env';
            const count = data.reduce((sum: Decimal, cur: any) => {
              const value = isEnv ? cur.Env : cur.List.find((cur: any) => cur.keys === field)?.values;
              sum = Decimal.add(sum, Number.isNaN(value) ? 0 : value);
              return sum;
            }, new Decimal(0));
            total[isEnv ? 'Env' : `List_${field}`] = count.toNumber();
          });
          total.Drop = Decimal.div(total.Env, total[`List_${fieldList[fieldList.length - 1]}`]).toNumber();
          res.data = { list: data, total };
          return res;
        }),
    },
  });
</script>

<style lang="less" scoped>
  @import url('/@/views/dataAnalysis/style.less');
</style>
