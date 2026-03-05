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
            <a-form-item>
              <a-input v-model:value="extraFormValue.keyword" placeholder="请输入合并料号" allowClear />
            </a-form-item>
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
  import { getChanxiaolvDetail } from '/@/api/dashbord/report';
  import { commonOptions } from '/@/views/dashboard/operation/productionAndSalesRate/config';
  import { getAllColumns, searchOptions } from './config';
  import { getAllOptions } from '/@/views/dashboard/operation/productionAndSalesRate/group/detail/utils';
  import { getCommonReqParams } from '/@/views/dashboard/operation/productionAndSalesRate/utils';
  import { useRouteParams } from '/@/views/dashboard/commonHooks/useRouteParams';

  import SearchForm from '/@/views/dashboard/commonComponents/SearchForm/index.vue';
  import BaseVxeTable from '/@/views/dashboard/commonComponents/BaseVxeTable/index.vue';
  import type { VxeGridProps } from 'vxe-table';
  import { EToolType } from '/@/views/dashboard/commonComponents/BaseVxeTable/types';
  import { IOption } from '/@/views/dashboard/types';
  import { buildBitUUID } from '/@/utils/uuid';

  defineOptions({ name: 'dashboard-operation-productionAndSalesRate-detail' });

  provide('getExportFilename', () => {
    const { startDim, endDim } = getCommonReqParams(searchFormValue.value);
    const filename = `产销率明细${[startDim, endDim].join('-')}`;
    return filename;
  });
  const isFirstQuery = ref(true);
  const { getParams } = useRouteParams();
  const [register, { searchFormValue, searchLoading }] = useSearchForm({
    formOptions: merge(cloneDeep(commonOptions), searchOptions),
  });
  const attrs = reactive<VxeGridProps<any>>({
    treeConfig: {
      expandAll: true,
      transform: false,
      childrenField: 'children',
    },
    filterConfig: {
      remote: false,
    },
    sortConfig: {
      remote: false,
    },
    proxyConfig: {
      autoLoad: true,
      response: {
        result: 'data.list.list',
        total: 'data.list.pagination.total',
      },
    },
  });
  const allOptions = ref<IOption[]>([]);
  const columns = ref(getAllColumns());
  const { prodline, item, period } = getParams();
  const extraFormValue = reactive({
    prodline,
    item,
    period,
    keyword: '',
  });
  const [registerTable = register, { reloadData }] = useBaseVxeTable({
    isAutoQuery: false,
    immediateQuery: false,
    searchFormValue,
    searchLoading,
    columns,
    attrs,
    tools: [EToolType.EXPORT],
    getParams: () => {
      const params = getCommonReqParams(searchFormValue.value);
      return {
        ...params,
        ...extraFormValue,
      };
    },
    api: async params => {
      const res = await getChanxiaolvDetail(params);
      res.data.list.list = res.data.list.list.map(item => ({
        ...item,
        id: buildBitUUID(),
      }));
      return res;
    },
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
      const { orgCode, dimension, startDim, endDim } = getCommonReqParams(searchFormValue.value);
      const { prodline } = extraFormValue;
      getAllOptions({ orgCode, dimension, prodline, startDim, endDim }).then(res => {
        const idx = allOptions.value.findIndex(item => item.props === 'item');
        if (idx !== -1) {
          const options = (res.find(item => item.props === 'item') || { options: [] })?.options;
          allOptions.value[idx].options = options;
          extraFormValue.item = ''; // 重置已选择的值
        }

        const periodidx = allOptions.value.findIndex(item => item.props === 'period');
        if (idx !== -1) {
          const options = (res.find(item => item.props === 'period') || { options: [] })?.options;
          allOptions.value[periodidx].options = options;
          extraFormValue.period = ''; // 重置已选择的值
        }
      });
    },
  );

  watch(
    () => extraFormValue.period,
    () => {
      const { orgCode, dimension, startDim, endDim } = getCommonReqParams(searchFormValue.value);
      const { prodline, period } = extraFormValue;
      getAllOptions({ orgCode, dimension, prodline, startDim, endDim, period }).then(res => {
        const idx = allOptions.value.findIndex(item => item.props === 'item');
        if (idx !== -1) {
          const options = (res.find(item => item.props === 'item') || { options: [] })?.options;
          allOptions.value[idx].options = options;
          extraFormValue.item = ''; // 重置已选择的值
        }
      });
    },
  );
  // 设置下拉条件
  function setAllOptions() {
    const { orgCode, dimension, startDim, endDim } = getCommonReqParams(searchFormValue.value);
    const { prodline, period, item } = extraFormValue;
    getAllOptions({ orgCode, dimension, prodline, period, item, startDim, endDim }).then(res => {
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
</style>
