<!-- 交易模式二阶页面 -->
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
  import { merge } from 'lodash-es';
  import { reactive, ref, provide } from 'vue';
  import { commonOptions } from '/@/views/dashboard/customerService/config';
  import { useSearchForm } from '/@/views/dashboard/commonComponents/SearchForm/useSearchForm';
  import { useBaseVxeTable } from '/@/views/dashboard/commonComponents/BaseVxeTable/useBaseVxeTable';
  import { getfccurrencyandcustomerdetaillist } from '/@/api/dashbord/fc';
  import { getAllColumns } from './config';
  import { getCommonReqParams, removeWeekMonthYear, getMetricNameByDimension } from '/@/views/dashboard/customerService/utils';

  import SearchForm from '/@/views/dashboard/commonComponents/SearchForm/index.vue';
  import BaseVxeTable from '/@/views/dashboard/commonComponents/BaseVxeTable/index.vue';
  import type { VxeGridProps } from 'vxe-table';
  import { EToolType } from '/@/views/dashboard/commonComponents/BaseVxeTable/types';

  defineOptions({ name: 'dashboard-customerService-tradingMode' });

  const attrs = reactive<VxeGridProps<any>>({});
  const columns = ref(getAllColumns());
  const [register, { searchFormValue, searchLoading }] = useSearchForm({
    formOptions: commonOptions,
  });

  provide('getExportFilename', () => {
    const { dimension, timeIndex } = getCommonReqParams(searchFormValue.value);
    const metricName = getMetricNameByDimension({ dimension, value: timeIndex });
    const filename = `交易模式-${metricName}`;
    return filename;
  });
  const [registerTable = register] = useBaseVxeTable({
    tools: [EToolType.EXPORT],
    searchFormValue,
    searchLoading,
    columns,
    attrs,
    getParams: () => {
      return getCommonReqParams(searchFormValue.value);
    },
    api: getfccurrencyandcustomerdetaillist,
    afterQuery: (res: any) => {
      const { list = [] } = (res.data as any) ?? {};
      const dataList = removeWeekMonthYear(list);
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
