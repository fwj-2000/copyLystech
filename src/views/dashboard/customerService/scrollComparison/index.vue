<!-- 滚动对比二阶 -->
<template>
  <div class="lydc-content-wrapper">
    <div class="dashboard-fc-page-container">
      <div class="dashboard-fc-index-container">
        <!-- 搜索条件 -->
        <SearchForm @register="register"></SearchForm>
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
  import { reactive, ref, provide } from 'vue';
  import { commonOptions } from '/@/views/dashboard/customerService/config';
  import { useSearchForm } from '/@/views/dashboard/commonComponents/SearchForm/useSearchForm';
  import { useBaseVxeTable } from '/@/views/dashboard/commonComponents/BaseVxeTable/useBaseVxeTable';
  import { getfcrollvsdetaillist } from '/@/api/dashbord/fc';
  import { getAllColumns } from './config';
  import { getCommonReqParams, getMetricNameByDimension } from '/@/views/dashboard/customerService/utils';

  import SearchForm from '/@/views/dashboard/commonComponents/SearchForm/index.vue';
  import BaseVxeTable from '/@/views/dashboard/commonComponents/BaseVxeTable/index.vue';
  import type { VxeGridProps } from 'vxe-table';
  import { EToolType } from '/@/views/dashboard/commonComponents/BaseVxeTable/types';

  defineOptions({ name: 'dashboard-customerService-scrollComparison' });

  const [register, { searchFormValue, searchLoading }] = useSearchForm({
    formOptions: commonOptions.filter(item => item.key !== 'dimension'),
  });

  provide('getExportFilename', () => {
    const { dimension, timeIndex } = getCommonReqParams(searchFormValue.value);
    const metricName = getMetricNameByDimension({ dimension, value: timeIndex });
    const filename = `滚动对比-${metricName}`;
    return filename;
  });
  const attrs = reactive<VxeGridProps<any>>({});
  const columns = ref(getAllColumns());
  const [registerTable = register] = useBaseVxeTable({
    tools: [EToolType.EXPORT],
    searchFormValue,
    searchLoading,
    columns,
    attrs,
    getParams: () => {
      return {
        ...getCommonReqParams(searchFormValue.value),
        dimension: 'week',
      };
    },
    api: getfcrollvsdetaillist,
    afterQuery: (res: any) => {
      const { list = [] } = (res.data as any) ?? {};
      const { CurrentWeek: currentWeek = 2 } = list[0] ?? [];
      columns.value = getAllColumns({ currentWeek });
      return res;
    },
  });
</script>

<style lang="less" scoped>
  @import url('/@/views/dashboard/customerService/style.less');

  :deep(.vxe-table) {
    .amount-header {
      background-color: #fcf5ed;
    }

    .quantity-header {
      background-color: #d4e0fb;
    }
  }
</style>
