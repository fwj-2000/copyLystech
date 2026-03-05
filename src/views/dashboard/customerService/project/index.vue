<!-- 项目二阶页面 -->
<template>
  <div class="lydc-content-wrapper">
    <div class="dashboard-fc-page-container">
      <div class="dashboard-fc-index-container">
        <!-- 搜索条件 -->
        <SearchForm @register="register">
          <template #right>
            <div class="flex">
              <!-- 文本 -->
              <div class="flex pl-6px pr-9px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6">项目</div>
              <!-- 表单 -->
              <div class="ml-[-3px]">
                <a-select
                  v-model:value="searchFormValue.projectName"
                  v-bind="{
                    ...commonMultiSelectAttrs,
                    dropdownMatchSelectWidth: true,
                  }">
                  <a-select-option v-for="(option, oidx) in projectOptions" :key="oidx" :value="option.value" :title="option.label">
                    {{ option.label }}
                  </a-select-option>
                  <template #notFoundContent>
                    <a-spin class="flex center w-[48px] h-[48px]" v-if="isFetchProjectOptions" />
                    <lydc-empty v-else />
                  </template>
                </a-select>
              </div>
            </div>
          </template>
        </SearchForm>
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
  import { merge, pick } from 'lodash-es';
  import { reactive, ref, provide, watch } from 'vue';
  import { commonOptions } from '/@/views/dashboard/customerService/config';
  import { useSearchForm } from '/@/views/dashboard/commonComponents/SearchForm/useSearchForm';
  import { useBaseVxeTable } from '/@/views/dashboard/commonComponents/BaseVxeTable/useBaseVxeTable';
  import { getfcproductcategorydetaillist, getprojectbind } from '/@/api/dashbord/fc';
  import { getAllColumns } from './config';
  import { getCommonReqParams, removeWeekMonthYear, getMetricNameByDimension } from '/@/views/dashboard/customerService/utils';
  import { commonMultiSelectAttrs } from '/@/views/dashboard/commonComponents/SearchForm/config';

  import SearchForm from '/@/views/dashboard/commonComponents/SearchForm/index.vue';
  import BaseVxeTable from '/@/views/dashboard/commonComponents/BaseVxeTable/index.vue';
  import type { VxeGridProps } from 'vxe-table';
  import { EToolType } from '/@/views/dashboard/commonComponents/BaseVxeTable/types';

  defineOptions({ name: 'dashboard-customerService-project' });

  const [register, { searchFormValue, searchLoading }] = useSearchForm({
    formOptions: commonOptions,
  });

  provide('getExportFilename', () => {
    const { dimension, timeIndex } = getCommonReqParams(searchFormValue.value);
    const metricName = getMetricNameByDimension({ dimension, value: timeIndex });
    const filename = `项目-${metricName}`;
    return filename;
  });
  const isFetchProjectOptions = ref(true);
  const projectOptions = ref<any[]>([]);
  const attrs = reactive<VxeGridProps<any>>({});
  const columns = ref(getAllColumns());
  const [registerTable = register] = useBaseVxeTable({
    immediateQuery: false,
    tools: [EToolType.EXPORT],
    searchFormValue,
    searchLoading,
    columns,
    debounceMs: 1000,
    attrs,
    getParams: () => {
      return {
        projectName: searchFormValue.value.projectName?.join(';'),
        ...getCommonReqParams(searchFormValue.value),
      };
    },
    api: getfcproductcategorydetaillist,
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

  watch(
    [() => searchFormValue.value.date, () => searchFormValue.value.dimension, () => searchFormValue.value.customerPerson],
    () => {
      getProjectOptions();
    },
    {
      immediate: false,
    },
  );

  async function getProjectOptions() {
    projectOptions.value = [];
    isFetchProjectOptions.value = true;
    const params = pick(getCommonReqParams(searchFormValue.value), ['dimension', 'timeIndex', 'customerPerson', 'yearIndex']);
    const { data = [] } = await getprojectbind(params);
    const filters = data.map(item => ({
      value: item.id,
      label: item.value,
    }));
    isFetchProjectOptions.value = false;
    projectOptions.value = filters;
  }
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
