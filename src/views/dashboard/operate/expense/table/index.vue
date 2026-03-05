<!-- 离职率分析 -->
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
        <div class="w-[100%] h-[100%] overflow-hidden vxe-table">
          <BaseVxeTable @register="registerTable">
            <template #toolbarActions>
              <ToolBarAction />
              <p class="flex center font-bold">单位（万元，%） </p>
            </template>
          </BaseVxeTable>
        </div>
      </div>
    </div>
    <!-- end -->
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, provide } from 'vue';
  import { getAllColumns, commonOptions } from './config';
  import { getCommonReqParams } from './utils';
  import { useSearchForm } from '/@/views/dashboard/commonComponents/SearchForm/useSearchForm';
  import { useBaseVxeTable } from '/@/views/dashboard/commonComponents/BaseVxeTable/useBaseVxeTable';
  import { getfeeattrdetailv2 } from '/@/api/dashbord/fare';

  import ToolBarAction from './ToolBarAction.vue';
  import SearchForm from '/@/views/dashboard/commonComponents/SearchForm/index.vue';
  import BaseVxeTable from '/@/views/dashboard/commonComponents/BaseVxeTable/index.vue';
  import type { VxeGridProps } from 'vxe-table';
  defineOptions({ name: 'dashboard-operate-expense-table' });

  provide('getExportFilename', () => {
    const { startDim, endDim } = getCommonReqParams(searchFormValue.value);
    const filename = `费用明细${[startDim, endDim].join('-')}`;
    return filename;
  });
  const attrs = reactive<VxeGridProps<any>>({
    proxyConfig: {
      response: {
        list: 'data.List',
      },
    },
    filterConfig: {
      remote: false,
    },
    sortConfig: {
      remote: false,
    },
    pagerConfig: {
      enabled: false,
    },
    exportConfig: {
      mode: 'current',
      modes: ['current'],
    },
    footerData: [],
    rowStyle: ({ row }) => {
      if (row.SourecType === '1') {
        return { background: '#ff7b001A' };
      }
    },
  });
  const columns = ref(getAllColumns());

  const [register, { searchFormValue, searchLoading }] = useSearchForm({
    formOptions: commonOptions,
  });

  const [registerTable = register, { reloadData }] = useBaseVxeTable({
    isAutoQuery: false,
    immediateQuery: true,
    footerFiled: 'data.Total',
    searchFormValue,
    searchLoading,
    columns,
    attrs,
    debounceMs: 2000,
    getParams: () => {
      return getCommonReqParams(searchFormValue.value);
    },
    api: getfeeattrdetailv2,
  });
</script>

<style lang="less" scoped>
  @import url('/@/views/dashboard/style.less');
</style>
