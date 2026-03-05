<!-- 结单率车间维度明细 -->
<template>
  <div class="lydc-content-wrapper">
    <div class="dashboard-common-page-container">
      <div class="dashboard-common-index-container">
        <!-- 搜索条件 -->
        <SearchForm @register="register">
          <template #right>
            <a-button type="primary" @click="reloadData">查询</a-button>
          </template>
        </SearchForm>
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
  import {} from '/@/views/dashboard/customerService/config';
  import { useSearchForm } from '/@/views/dashboard/commonComponents/SearchForm/useSearchForm';
  import { useBaseVxeTable } from '/@/views/dashboard/commonComponents/BaseVxeTable/useBaseVxeTable';
  import { getAllColumns, formOptions } from './config';
  import { closeOrderRateDimens } from '/@/api/dataAnalysis/financial';

  import SearchForm from '/@/views/dashboard/commonComponents/SearchForm/index.vue';
  import BaseVxeTable from '/@/views/dashboard/commonComponents/BaseVxeTable/index.vue';
  import type { VxeGridProps } from 'vxe-table';
  import { getRowClassNameFuncByGroupKey } from '/@/views/dashboard/commonComponents/BaseVxeTable/utils';

  defineOptions({ name: 'dashboard-financial-inventory-statementRate-shop' });

  const columns = ref(getAllColumns());
  const getRowClassNameMth = getRowClassNameFuncByGroupKey('MRP');
  const attrs = reactive<VxeGridProps<any>>({
    rowClassName: getRowClassNameMth,
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      response: {
        list: 'data',
      },
    },
  });
  const [register, { searchFormValue, searchLoading, api }] = useSearchForm({
    formOptions: formOptions,
  });
  const [registerTable = register, { reloadData }] = useBaseVxeTable({
    isAutoQuery: false,
    immediateQuery: true,
    searchFormValue,
    searchLoading,
    columns,
    attrs,
    api: closeOrderRateDimens,
    getParams: api.getFormParams,
  });
</script>

<style lang="less" scoped>
  @import url('/@/views/dashboard/style.less');
</style>
/@/api/dataAnalysis/financial
