<!-- 手工数据列表 -->
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
  import { useSearchForm } from '/@/views/dashboard/commonComponents/SearchForm/useSearchForm';
  import { useBaseVxeTable } from '/@/views/dashboard/commonComponents/BaseVxeTable/useBaseVxeTable';
  import { getCommonReqParams, getAllColumns, allOptions } from './config';

  import SearchForm from '/@/views/dashboard/commonComponents/SearchForm/index.vue';
  import BaseVxeTable from '/@/views/dashboard/commonComponents/BaseVxeTable/index.vue';
  import type { VxeGridProps } from 'vxe-table';
  import { EToolType } from '/@/views/dashboard/commonComponents/BaseVxeTable/types';
  import { getProfitandlosManualdatapage } from '/@/api/dashbord/report';

  defineOptions({ name: 'dashboard-operate-profitkpi-manualData' });

  const [register, { searchFormValue, searchLoading }] = useSearchForm({
    formOptions: allOptions,
  });

  provide('getExportFilename', () => {
    const { startTime, endTime } = getCommonReqParams(searchFormValue.value);
    const filename = `手工数据_${startTime}-${endTime}`;
    return filename;
  });
  const attrs = reactive<VxeGridProps<any>>({
    proxyConfig: {
      autoLoad: true,
      response: {
        total: 'data.pagination.total',
      },
    },
  });
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
    api: getProfitandlosManualdatapage,
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
