<!-- 库存在制报表 -->
<template>
  <div class="lydc-content-wrapper">
    <div class="dashboard-common-page-container">
      <div class="dashboard-common-index-container">
        <!-- 搜索条件 -->
        <SearchForm @register="register" />
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
  import { merge } from 'lodash-es';
  import dayjs from 'dayjs';
  import { commonOptions } from '../config';
  import { getAllColumns } from './config';
  import { useSearchForm } from '/@/views/dashboard/commonComponents/SearchForm/useSearchForm';
  import { useBaseVxeTable } from '/@/views/dashboard/commonComponents/BaseVxeTable/useBaseVxeTable';
  import { getCommonReqParams } from '../utils';
  import { getRowClassNameFuncByGroupKey } from '/@/views/dashboard/commonComponents/BaseVxeTable/utils';

  import SearchForm from '/@/views/dashboard/commonComponents/SearchForm/index.vue';
  import BaseVxeTable from '/@/views/dashboard/commonComponents/BaseVxeTable/index.vue';
  import type { VxeGridProps } from 'vxe-table';
  import { getInventoryMakingindex } from '/@/api/dataAnalysis/financial';

  defineOptions({ name: 'dashboard-financial-inventory-wip' });

  const getRowClassName = getRowClassNameFuncByGroupKey('FactoryName');
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
  });
  const columns = ref(getAllColumns());

  const [register, { searchFormValue, searchLoading }] = useSearchForm({
    formOptions: merge(commonOptions, [
      {
        default: '',
        isOverrideDefault: true,
      },
      {},
      {
        default: [dayjs().subtract(14, 'day'), dayjs().subtract(7, 'day')],
      },
    ]),
  });

  const [registerTable = register] = useBaseVxeTable({
    searchFormValue,
    searchLoading,
    columns,
    attrs,
    getParams: () => {
      return getCommonReqParams(searchFormValue.value);
    },
    api: getInventoryMakingindex,
    afterQuery: res => {
      const sortOrder = [
        'Total',
        '平湖一厂',
        '平湖二厂',
        '平湖三厂',
        '平湖五厂',
        '平湖六厂',
        '平湖七厂',
        '平湖九厂',
        '东台模切制二厂',
        '东台模切制三厂',
        '成都模切',
        '东台模切',
        '苏州模切',
        '郑州模切',
        '越南模切',
      ];
      const dataList = (res?.data ?? [])
        .sort((a, b) => {
          const indexA = sortOrder.indexOf(a.FactoryName);
          const indexB = sortOrder.indexOf(b.FactoryName);
          return indexA - indexB;
        })
        .reduce((pre, cur) => {
          return pre.concat(cur.List);
        }, []);
      return merge(res, {
        data: dataList,
      });
    },
  });
</script>

<style lang="less">
  @import url('/@/views/dashboard/style.less');
</style>
/@/api/dataAnalysis/financial
