<!-- 呆滞TOP 页面 -->
<template>
  <TableLayout>
    <template #toolbarRight>
      <div style="margin-left: auto">
        <span style="margin-right: 20px">TOP合计金额：{{ totalAmount }}万元</span>
        <span style="margin-right: 20px">占比：{{ prop }}</span>
        <!-- <span style="margin-right: 20px">by账龄:{{ byLibraryAge }}</span> -->
      </div>
    </template>
  </TableLayout>
</template>

<script lang="ts" setup>
  import XEUtils from 'xe-utils';
  import { ref, reactive } from 'vue';
  import { getAllColumns, formOptions } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getDulldetatil } from '/@/api/dataAnalysis/financial';
  import type { VxeGridProps } from 'vxe-table';
  defineOptions({ name: 'dataAnalysis-financial-inventory-dullDetail' });

  const totalAmount = ref<number | string>();
  const prop = ref<number | string>();
  const byLibraryAge = ref<number | string>();
  const columns = ref(getAllColumns({ hideAmount: false }));

  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-inventory-dullDetail-list',
    proxyConfig: {
      response: {
        list: 'data.list',
      },
    },
    filterConfig: {
      remote: false,
    },
    sortConfig: {
      remote: false,
    },
    pagerConfig: {
      enabled: true,
    },
  });
  const handleDataList = async params => {
    const res = await getDulldetatil({ ...params });
    totalAmount.value = XEUtils.commafy(res.data.totalAmount, { digits: 0 });
    prop.value = `${XEUtils.commafy(res.data.prop, { digits: 2 })}%`;
    // byLibraryAge.value = XEUtils.commafy(res.data.byLibraryAge, { digits: 0 });

    const allColumns = getAllColumns(); // 单次获取列数据
    if (res.data.flag) {
      tableConfig.tableConfig.columns = allColumns;
    } else {
      const shouldKeepColumn = column =>
        !column.title?.includes('金额') ||
        column.title?.includes('在制金额') ||
        column.title?.includes('账龄金额区间') ||
        column.title?.includes('总库存金额区间');
      tableConfig.tableConfig.columns = allColumns.filter(shouldKeepColumn);
    }

    return res;
  };
  const tableConfig = reactive({
    formConfig: { formOptions },
    tableConfig: {
      columns: columns.value,
      attrs,
      isFrontPagination: true,
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startDim, endDim } = getFormParams();
        const filename = `呆滞TOP_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: handleDataList,
    },
  });
  const [TableLayout, api] = useTableLayout(tableConfig);
</script>
