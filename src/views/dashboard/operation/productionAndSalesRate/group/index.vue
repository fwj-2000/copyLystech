<!-- 产销率报表 -->
<template>
  <div class="lydc-content-wrapper">
    <div class="dashboard-fc-page-container">
      <div class="dashboard-fc-index-container">
        <!-- 搜索条件 -->
        <SearchForm @register="register">
          <template #right>
            <div v-for="(item, idx) in allOptions" :key="idx" class="flex">
              <div class="flex px-6px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6">
                {{ item.text }}
              </div>
              <a-form-item name="isBian">
                <a-select ref="select" v-model:value="extraFormValue[item.props]" :style="`${item.width ? `width: ${item.width}px;text-align: left` : ''}`">
                  <a-select-option v-for="option in item.options" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>
            <a-button type="primary" @click="reloadData">查询</a-button>
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
  import { isEmpty, merge, cloneDeep } from 'lodash-es';
  import { watch, provide, reactive, ref } from 'vue';
  import { useSearchForm } from '/@/views/dashboard/commonComponents/SearchForm/useSearchForm';
  import { useBaseVxeTable } from '/@/views/dashboard/commonComponents/BaseVxeTable/useBaseVxeTable';
  import { getGroupByPeriod } from '/@/api/dashbord/report';
  import { commonOptions } from '/@/views/dashboard/operation/productionAndSalesRate/config';
  import { getAllColumns, searchOptions, extraFormOptions, PRODUCTION_AND_SALES_RATE_GROUP_IS_SIMPLIFY_STORAGE_KEY } from './config';
  import { getAllOptions, getCommonReqParams } from './utils';
  import { getRowClassNameFuncByGroupKey } from '/@/views/dashboard/commonComponents/BaseVxeTable/utils';

  import SearchForm from '/@/views/dashboard/commonComponents/SearchForm/index.vue';
  import BaseVxeTable from '/@/views/dashboard/commonComponents/BaseVxeTable/index.vue';
  import type { VxeGridProps } from 'vxe-table';
  import { EToolType } from '/@/views/dashboard/commonComponents/BaseVxeTable/types';
  import { IOption } from '/@/views/dashboard/types';

  defineOptions({ name: 'dashboard-operation-productionAndSalesRate-group' });

  provide('getExportFilename', () => {
    const { startDim, endDim } = getCommonReqParams(searchFormValue.value);
    const filename = `产销率报表分组${[startDim, endDim].join('-')}`;
    return filename;
  });
  const isFirstQuery = ref(true);
  const [register, { searchFormValue, searchLoading }] = useSearchForm({
    formOptions: merge(cloneDeep(commonOptions), searchOptions).concat(extraFormOptions),
  });
  const getRowClassNameMth = getRowClassNameFuncByGroupKey('category');
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dashboard-operation-productionAndSalesRate-group-list',
    rowClassName: getRowClassNameMth,
    filterConfig: {
      remote: false,
    },
    exportConfig: {
      mode: 'current',
      modes: ['current'],
      // excludeFields: ['combine'],
      // includeFields: ['prodline', 'items'],
    },
    sortConfig: {
      remote: false,
    },
    pagerConfig: {
      enabled: false,
    },
    virtualYConfig: {
      oSize: 61, // 解决分组颜色异常跳动问题
    },
    proxyConfig: {
      autoLoad: false,
      response: {
        list: 'data.list',
      },
    },
  });
  const allOptions = ref<IOption[]>([]);
  const columns = ref(getAllColumns());
  const extraFormValue = reactive({
    prodline: '',
    period: '',
  });
  const [registerTable = register, { reloadData }] = useBaseVxeTable({
    isAutoQuery: false,
    immediateQuery: false,
    searchFormValue,
    searchLoading,
    columns,
    attrs,
    tools: [EToolType.EXPORT],
    // getExportParams,
    getParams: () => {
      const params = getCommonReqParams(searchFormValue.value);
      return {
        ...extraFormValue,
        ...params,
      };
    },
    api: getGroupByPeriod,
  });

  // 拉取项目下拉
  watch(
    [() => searchLoading.value, () => searchFormValue.value.orgCode, () => searchFormValue.value.dateRange, () => searchFormValue.value.dimension],
    () => {
      if (!searchLoading.value && !isEmpty(searchFormValue.value)) {
        setAllOptions();
      }
    },
    { immediate: true, deep: true },
  );
  // 监听产品线--改变项目下拉项
  watch(
    () => extraFormValue.prodline,
    () => {
      const { orgCode, dimension, startDim, endDim, isSimplify } = getCommonReqParams(searchFormValue.value);
      const { prodline } = extraFormValue;
      getAllOptions({ orgCode, dimension, prodline, startDim, endDim, isSimplify }).then(res => {
        const idx = allOptions.value.findIndex(item => item.props === 'period');
        if (idx !== -1) {
          const options = (res.find(item => item.props === 'period') || { options: [] })?.options;
          allOptions.value[idx].options = options;
          extraFormValue.period = ''; // 重置已选择的值
        }
      });
    },
  );
  // 将简化习惯保存在本地
  watch(
    () => searchFormValue.value.isSimplify,
    value => {
      localStorage.setItem(PRODUCTION_AND_SALES_RATE_GROUP_IS_SIMPLIFY_STORAGE_KEY, value);
    },
  );

  // 设置下拉条件
  function setAllOptions() {
    const { orgCode, dimension, startDim, endDim, isSimplify } = getCommonReqParams(searchFormValue.value);
    const { prodline } = extraFormValue;
    getAllOptions({ orgCode, dimension, prodline, startDim, endDim, isSimplify }).then(res => {
      allOptions.value = res;
      if (isFirstQuery.value) {
        reloadData({});
        isFirstQuery.value = false;
      }
    });
  }
</script>

<style lang="less" scoped>
  @import url('/@/views/dashboard/customerService/style.less');

  :deep(.vxe-table) {
    .text-red {
      color: red;
    }
  }
</style>
