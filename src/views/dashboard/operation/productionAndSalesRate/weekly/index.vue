<!-- 产销率报表 -->
<template>
  <div class="lydc-content-wrapper">
    <div class="dashboard-fc-page-container">
      <div class="dashboard-fc-index-container">
        <!-- 搜索条件 -->
        <SearchForm @register="register">
          <template #right>
            <a-button type="primary" @click="reloadData">查询</a-button>
          </template>
        </SearchForm>
        <!-- 报表表格 -->
        <div class="w-[100%] h-[100%] overflow-hidden vxe-table">
          <BaseVxeTable @register="registerTable">
            <template #toolbarActions>
              <a-button type="primary" @click="isModalOpen = true">
                无单价料件
                <span v-if="`${totalNo}`">({{ totalNo }})</span>
              </a-button>
            </template>
          </BaseVxeTable>
        </div>
      </div>
    </div>
    <!-- end -->
  </div>
  <a-modal v-model:open="isModalOpen" v-bind="modalAttrs">
    <template #title> </template>
    <NoUnitPriceTable :search-params="searchParams" />
  </a-modal>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { provide, reactive, ref, watch } from 'vue';
  import { useSearchForm } from '/@/views/dashboard/commonComponents/SearchForm/useSearchForm';
  import { useBaseVxeTable } from '/@/views/dashboard/commonComponents/BaseVxeTable/useBaseVxeTable';
  import { getChanxiaolv, getNofpricedetailcount } from '/@/api/dashbord/report';
  import { commonOptions, PRODAND_ORG_CODE_KEY } from '/@/views/dashboard/operation/productionAndSalesRate/config';
  import { getAllColumns } from './config';
  import { getCommonReqParams } from '/@/views/dashboard/operation/productionAndSalesRate/utils';
  import { getRowClassNameFuncByGroupKey } from '/@/views/dashboard/commonComponents/BaseVxeTable/utils';

  import SearchForm from '/@/views/dashboard/commonComponents/SearchForm/index.vue';
  import BaseVxeTable from '/@/views/dashboard/commonComponents/BaseVxeTable/index.vue';
  import NoUnitPriceTable from './NoUnitPriceTable.vue';
  import type { VxeGridProps } from 'vxe-table';
  import { EToolType } from '/@/views/dashboard/commonComponents/BaseVxeTable/types';
  import { PRODUCTION_AND_SALES_RATE_GROUP_IS_SIMPLIFY_STORAGE_KEY, extraFormOptions } from '../group/config';

  defineOptions({ name: 'dashboard-operation-productionAndSalesRate-weekly' });

  const modalAttrs = {
    width: '640px',
    bodyStyle: {
      margin: '32px -12px -12px -12px',
    },
    footer: null,
  };
  provide('getExportFilename', () => {
    const { startDim, endDim } = getCommonReqParams(searchFormValue.value);
    const filename = `产销率周报${[startDim, endDim].join('-')}`;
    return filename;
  });
  const [register, { searchFormValue, searchLoading }] = useSearchForm({
    formOptions: commonOptions.concat(extraFormOptions),
  });
  const totalNo = ref(0);
  const isModalOpen = ref(false);
  const searchParams = ref<Record<string, any>>({
    orgCode: '',
  });
  const getRowClassNameMth = getRowClassNameFuncByGroupKey('category');
  const attrs = reactive<VxeGridProps<any>>({
    rowClassName: getRowClassNameMth,
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
        list: 'data.list',
      },
    },
  });
  const columns = ref(getAllColumns());
  const [registerTable = register, { reloadData }] = useBaseVxeTable({
    searchFormValue,
    searchLoading,
    columns,
    attrs,
    immediateQuery: true,
    tools: [EToolType.EXPORT],
    getParams: () => {
      return {
        isSimplify: searchFormValue.value.isSimplify,
        ...getCommonReqParams(searchFormValue.value),
      };
    },
    api: getChanxiaolv,
  });

  watch(
    [() => searchFormValue.value.orgCode, () => searchLoading.value],
    () => {
      if (searchLoading.value) return;
      // 获取无单价物料总数
      totalNo.value = 0;
      const date = dayjs().tz();
      const dimension = `${date.year()}WK${date.week().toString().padStart(2, '0')}`;
      searchParams.value = { dimension, orgCode: searchFormValue.value.orgCode };
      getNofpricedetailcount(searchParams.value).then(res => {
        totalNo.value = res.data[0].ProductCount;
      });
      localStorage.setItem(PRODAND_ORG_CODE_KEY, searchFormValue.value.orgCode);
    },
    { deep: true, immediate: false },
  );
  // 将简化习惯保存在本地
  watch(
    () => searchFormValue.value.isSimplify,
    value => {
      localStorage.setItem(PRODUCTION_AND_SALES_RATE_GROUP_IS_SIMPLIFY_STORAGE_KEY, value);
    },
  );
</script>

<style lang="less" scoped>
  @import url('/@/views/dashboard/customerService/style.less');

  :deep(.vxe-table) {
    .text-red {
      color: red;
    }
  }
</style>
