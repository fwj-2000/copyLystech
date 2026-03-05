<!-- 库存在制报表 -->
<template>
  <div class="lydc-content-wrapper">
    <div class="dashboard-common-page-container">
      <div class="dashboard-common-index-container">
        <!-- 搜索条件 -->
        <SearchForm @register="register">
          <template #right>
            <a-button v-for="(item, idx) in jumpButtonOptions" :key="idx" type="primary" @click="go(item.getPathUrl())">
              {{ item.text }}
            </a-button>
          </template>
        </SearchForm>
        <div class="w-[100%] h-[100%] overflow-hidden">
          <BaseVxeTable class="vxe-table" @register="registerTable" />
        </div>
      </div>
    </div>
    <!-- end -->
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { commonOptions, getAllColumns, jumpButtonOptions } from './config';
  import { useSearchForm } from '/@/views/dashboard/commonComponents/SearchForm/useSearchForm';
  import { useBaseVxeTable } from '/@/views/dashboard/commonComponents/BaseVxeTable/useBaseVxeTable';
  import { useGo } from '/@/hooks/web/usePage';
  import { getCommonReqParams, getRowStyle } from './utils';
  import { getRowClassNameFuncByGroupKey } from '/@/views/dashboard/commonComponents/BaseVxeTable/utils';

  import SearchForm from '/@/views/dashboard/commonComponents/SearchForm/index.vue';
  import BaseVxeTable from '/@/views/dashboard/commonComponents/BaseVxeTable/index.vue';
  import type { VxeGridProps } from 'vxe-table';
  import { getInventorySummary } from '/@/api/dataAnalysis/financial';

  defineOptions({ name: 'dashboard-financial-inventory' });

  const go = useGo();
  const getRowClassName = getRowClassNameFuncByGroupKey('Title1');
  const attrs = reactive<VxeGridProps<any>>({
    rowClassName: getRowClassName,
    filterConfig: {
      remote: false,
    },
    sortConfig: {
      remote: false,
    },
    pagerConfig: {
      enabled: false,
    },
    footerData: [],
    rowStyle: getRowStyle,
  });
  const columns = ref(getAllColumns());

  const [register, { searchFormValue, searchLoading }] = useSearchForm({
    formOptions: commonOptions,
  });

  const [registerTable = register] = useBaseVxeTable({
    searchFormValue,
    searchLoading,
    columns,
    attrs,
    getParams: () => {
      return getCommonReqParams(searchFormValue.value);
    },
    api: getInventorySummary,
  });
</script>

<style lang="less">
  @import url('/@/views/dashboard/style.less');
</style>
/@/api/dataAnalysis/financial
