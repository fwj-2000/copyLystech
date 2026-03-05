<!-- 滚动对比趋势页 -->
<template>
  <div class="lydc-content-wrapper">
    <div class="dashboard-fc-page-container">
      <div class="dashboard-fc-index-container">
        <!-- 搜索条件 -->
        <SearchForm @register="register"></SearchForm>
        <div v-show="!searchLoading" class="w-[100%] h-[100%] flex-shrink-1">
          <div class="w-[100%] h-[264px] flex gap-row-2 p-2">
            <div class="w-[100%] flex-shrink-1 h-[100%]">
              <TrendChart :searchFormValue="searchFormValue" :searchLoading="searchLoading" />
            </div>
            <div v-if="searchFormValue.dimension !== ETimeDimension.WEEK" class="w-[363px] flex-shrink-0 h-[100%]">
              <RankInfo :searchFormValue="searchFormValue" :searchLoading="searchLoading" />
            </div>
          </div>
          <!-- 报表表格 -->
          <div class="w-[100%] h-[calc(100%-284px)] overflow-hidden vxe-table">
            <BaseVxeTable @register="registerTable" />
          </div>
        </div>
      </div>
    </div>
    <!-- end -->
  </div>
</template>

<script lang="ts" setup>
  import { merge } from 'lodash-es';
  import { reactive, ref, provide } from 'vue';
  import { commonOptions } from '/@/views/dashboard/customerService/config';
  import { useSearchForm } from '/@/views/dashboard/commonComponents/SearchForm/useSearchForm';
  import { useBaseVxeTable } from '/@/views/dashboard/commonComponents/BaseVxeTable/useBaseVxeTable';
  import { getfcaccuracydetaillist } from '/@/api/dashbord/fc';
  import { getAllColumns } from './config';
  import { getCommonReqParams, removeWeekMonthYear, getMetricNameByDimension } from '/@/views/dashboard/customerService/utils';

  import SearchForm from '/@/views/dashboard/commonComponents/SearchForm/index.vue';
  import BaseVxeTable from '/@/views/dashboard/commonComponents/BaseVxeTable/index.vue';
  import TrendChart from './TrendChart.vue';
  import RankInfo from './RankInfo/index.vue';
  import { ETimeDimension } from '/@/views/dashboard/customerService/types';
  import type { VxeGridProps } from 'vxe-table';
  import { EToolType } from '/@/views/dashboard/commonComponents/BaseVxeTable/types';

  defineOptions({ name: 'dashboard-customerService-accuracy-customer' });

  provide('getExportFilename', () => {
    const { dimension, timeIndex } = getCommonReqParams(searchFormValue.value);
    const metricName = getMetricNameByDimension({ dimension, value: timeIndex });
    const filename = `客服-${metricName}`;
    return filename;
  });
  const [register, { searchFormValue, searchLoading }] = useSearchForm({
    formOptions: commonOptions,
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
      return getCommonReqParams(searchFormValue.value);
    },
    api: getfcaccuracydetaillist,
    afterQuery: (res: any) => {
      const { list = [] } = (res.data as any) ?? {};
      const dataList = removeWeekMonthYear(list);
      const { Current: currentNum = 0 } = dataList?.[0] ?? [];
      const { dimension } = searchFormValue.value;
      columns.value = getAllColumns({ currentNum, dimension });
      return merge(res, {
        data: {
          list: dataList,
        },
      });
    },
  });
</script>

<style lang="less">
  @import url('/@/views/dashboard/customerService/style.less');
</style>

<style lang="less" scoped>
  :deep(.vxe-table) {
    .last-predict-header {
      background-color: #d4e0fb;
    }
  }
</style>
