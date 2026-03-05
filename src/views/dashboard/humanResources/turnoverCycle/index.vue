<!-- 离职周期分析 -->
<template>
  <div class="lydc-content-wrapper">
    <div class="dashboard-common-page-container">
      <div class="dashboard-common-index-container">
        <!-- 搜索条件 -->
        <SearchForm @register="register">
          <template #right>
            <a-button type="primary" :loading="exportLoading" ghost @click="handleExport">导出</a-button>
          </template>
        </SearchForm>
        <div class="w-[100%] h-[100%] overflow-hidden">
          <!-- 报表表格 -->
          <BaseVxeTable class="vxe-table" @register="registerTable" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { omit, merge } from 'lodash-es';
  import { getAllColumns } from './config';
  import { commonOptions } from '/@/views/dashboard/humanResources/config';
  import { useSearchForm } from '/@/views/dashboard/commonComponents/SearchForm/useSearchForm';
  import { useBaseVxeTable } from '/@/views/dashboard/commonComponents/BaseVxeTable/useBaseVxeTable';
  import { getresignationcycle, exportResignationCycle } from '/@/api/dashbord/hr';

  import SearchForm from '/@/views/dashboard/commonComponents/SearchForm/index.vue';
  import BaseVxeTable from '/@/views/dashboard/commonComponents/BaseVxeTable/index.vue';
  import type { VxeGridProps } from 'vxe-table';
  import { getCommonReqParams } from '../utils';
  import { downloadByUrl } from '/@/utils/file/download';

  defineOptions({ name: 'dashboard-humanResources-turnoverCycle' });

  const exportLoading = ref(false);
  const attrs = reactive<VxeGridProps<any>>({
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

  const [registerTable = register] = useBaseVxeTable({
    searchFormValue,
    searchLoading,
    columns,
    attrs,
    getParams: () => {
      return getCommonReqParams(searchFormValue.value);
    },
    api: getresignationcycle,
    afterQuery: (res: any) => {
      columns.value = getColumns(res.data);
      const tableList = res.data
        .map(item => {
          return {
            ...item,
            ...item.List.reduce((obj, item) => {
              const weekKey = item.WeekKey;
              item.Values.forEach(valueItem => {
                const key = `${weekKey}${valueItem.keys}`;
                obj[key] = valueItem.values;
              });
              return obj;
            }, {}),
          };
        })
        .map(item => {
          return omit(item, ['children', 'List']);
        });
      return merge(res, {
        data: tableList,
      });
    },
  });

  function getColumns(data: any) {
    const transformedList = data[0].List.map(item => ({
      title: item.WeekKey,
      field: item.WeekKey,
      children: item.Values.map(valueItem => ({
        title: valueItem.keys,
        field: item.WeekKey + valueItem.keys,
        width: 90,
        sortable: true,
      })),
    }));
    return [...getAllColumns(), ...transformedList];
  }

  const handleExport = () => {
    exportLoading.value = true;
    exportResignationCycle(getCommonReqParams(searchFormValue.value)).then(res => {
      exportLoading.value = false;
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
    });
  };
</script>

<style lang="less">
  @import url('/@/views/dashboard/style.less');
</style>
