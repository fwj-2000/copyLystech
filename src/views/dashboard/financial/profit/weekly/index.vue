<!-- 周损益 -->
<template>
  <div class="lydc-content-wrapper">
    <div class="dashboard-fc-page-container">
      <div class="dashboard-fc-index-container">
        <!-- 搜索条件 -->
        <SearchForm @register="register"> </SearchForm>
        <!-- 报表表格 -->
        <div class="w-[100%] h-[100%] overflow-hidden vxe-table">
          <BaseVxeTable @register="registerTable" />
        </div>
      </div>
    </div>
    <!-- end -->
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { useSearchForm } from '/@/views/dashboard/commonComponents/SearchForm/useSearchForm';
  import { useBaseVxeTable } from '/@/views/dashboard/commonComponents/BaseVxeTable/useBaseVxeTable';
  import { getAllColumns, commonOptions, customFieldOptions } from './config';
  import { getCommonReqParams } from '/@/views/dashboard/operation/productionAndSalesRate/utils';

  import SearchForm from '/@/views/dashboard/commonComponents/SearchForm/index.vue';
  import BaseVxeTable from '/@/views/dashboard/commonComponents/BaseVxeTable/index.vue';
  import type { VxeGridProps } from 'vxe-table';
  import { EToolType } from '/@/views/dashboard/commonComponents/BaseVxeTable/types';
  import { getProfitWeekListV2 } from '/@/api/dataAnalysis/financial';
  defineOptions({ name: 'dashboard-financial-profit-weekly' });

  const [register, { searchFormValue, searchLoading }] = useSearchForm({
    formOptions: commonOptions,
  });
  const attrs = reactive<VxeGridProps<any>>({
    rowClassName: ({ row }) => {
      const { sort } = row;
      return `${sort}`.includes('.') ? 'bg-white' : 'bg-yellow';
    },
    filterConfig: {
      remote: false,
    },
    exportConfig: {
      mode: 'current',
      modes: ['current'],
    },
    sortConfig: {
      remote: false,
    },
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      autoLoad: true,
      response: {
        list: 'data',
      },
    },
  });
  const columns = ref(getAllColumns());
  const baseColumns = ref(getAllColumns());
  const [registerTable = register] = useBaseVxeTable({
    customFieldOptions,
    searchFormValue,
    searchLoading,
    columns,
    baseColumns,
    attrs,
    tools: [EToolType.EXPORT],
    getParams: () => {
      return getCommonReqParams(searchFormValue.value);
    },
    api: getProfitWeekListV2,
    beforeQuery: () => {
      baseColumns.value = getAllColumns(searchFormValue.value.dateRange);
    },
  });
</script>

<style lang="less" scoped>
  @import url('/@/views/dashboard/customerService/style.less');

  :deep(.vxe-table) {
    .text-red {
      color: red;
    }
  }
</style>
