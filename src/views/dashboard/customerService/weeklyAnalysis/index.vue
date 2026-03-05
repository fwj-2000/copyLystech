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
  import { getfccurrentdetaillist } from '/@/api/dashbord/fc';
  import { getAllColumns } from './config';
  import { getCommonReqParams, removeWeekMonthYear } from '/@/views/dashboard/customerService/utils';

  import SearchForm from '/@/views/dashboard/commonComponents/SearchForm/index.vue';
  import BaseVxeTable from '/@/views/dashboard/commonComponents/BaseVxeTable/index.vue';
  import type { VxeGridProps } from 'vxe-table';
  import { EToolType } from '/@/views/dashboard/commonComponents/BaseVxeTable/types';

  defineOptions({ name: 'dashboard-customerService-weeklyAnalysis' });

  const [register, { searchFormValue, searchLoading }] = useSearchForm({
    formOptions: commonOptions,
  });

  provide('getExportFilename', () => {
    const { timeIndex } = getCommonReqParams(searchFormValue.value);
    const filename = `FC当周分析-WK${timeIndex}`;
    return filename;
  });
  const attrs = reactive<VxeGridProps<any>>({});
  const columns = ref(getAllColumns());
  const [registerTable = register] = useBaseVxeTable({
    searchFormValue,
    searchLoading,
    columns,
    attrs,
    tools: [EToolType.EXPORT],
    getParams: () => {
      return getCommonReqParams(searchFormValue.value);
    },
    api: getfccurrentdetaillist,
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
