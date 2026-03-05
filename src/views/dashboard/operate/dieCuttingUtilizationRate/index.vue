<!-- 模切稼动率平铺页 -->
<template>
  <div class="dashboard-page-container flex flex-col justify-start items-start">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header">
      <SearchForm
        v-bind="{
          searchFormValue,
          isRangePicker: true,
          showOrganizeTreeSelect: true,
        }">
        <template #dimension>
          <a-form-item name="dimension">
            <a-select v-model:value="searchFormValue.dimension">
              <a-select-option value="day">天</a-select-option>
              <a-select-option value="week">周</a-select-option>
            </a-select>
          </a-form-item>
        </template>
        <template #right>
          <!-- 额外的条件 -->
          <div v-for="(item, idx) in allOptions" :key="idx" class="flex">
            <div class="flex px-6px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6">
              {{ item.label }}
            </div>
            <a-form-item :name="item.field">
              <a-select ref="select" v-model:value="searchFormValue[item.field]" :style="`${item.width ? `width: ${item.width}px;text-align: left` : ''}`">
                <a-select-option v-for="option in item.options" :key="option.value" :value="option.value">
                  {{ option.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </div>
        </template>
      </SearchForm>
    </div>
    <!-- 内容加载封装组件 -->
    <div class="dashboard-content-container h-[100%] flex-shrink-1">
      <SpinContent
        v-bind="{
          loading: loading,
          isEmptyData,
          isRequestError,
          showList: false,
        }">
        <!-- 内容组件 -->
        <Content :dataInfo="dataInfo" class="h-[calc(100%-4px)]" />
      </SpinContent>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { ref, provide } from 'vue';
  import { pick } from 'lodash-es';
  import { useSearchForm } from '/@/views/dashboard/commonHooks/useSearchForm';
  import { useRouteQuery } from '/@/views/dashboard/operate/hooks/useRouteQuery';
  import { allOptions } from './config';
  import { getDiecututilizationanalys } from '/@/api/dashbord/report';

  import Content from './Content/index.vue';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import { TimeDimension } from '/@/views/dashboard/operate/types';

  defineOptions({ name: 'dashboard-operate-dieCuttingUtilizationRate' });
  provide('getSearchFormValue', () => {
    return searchFormValue;
  });
  provide('getParams', () => {
    return getParams();
  });

  const { routeQuery } = useRouteQuery();
  const dataInfo = ref<Record<string, any>[]>([]);
  // 设置数据
  const setDataInfo = async (data: any) => {
    dataInfo.value = data;
  };
  const getParams = () => {
    const dateDim = getDateDimParamsAllDim();
    return {
      dimension: searchFormValue.timeDimension,
      ...dateDim,
      ...pick(searchFormValue, ['orgCode', 'isNud', 'isNpi']),
    };
  };
  // 使用维度搜索hooks
  const { date: defaultDate = dayjs().tz() } = routeQuery;
  const { searchFormValue, loading, isEmptyData, isRequestError, getDateDimParamsAllDim } = useSearchForm({
    isAutoSearch: true,
    defaultSearchFormValue: {
      orgCode: '',
      dateRange: [defaultDate.subtract(4, 'week'), defaultDate],
      timeDimension: TimeDimension.WEEK,
      ...pick(routeQuery, ['orgCode', 'date', 'dateRange']),
      // 条件下拉默认值
      ...allOptions.reduce((pre, cur) => {
        return {
          ...pre,
          [cur.field]: cur.default,
        };
      }, {}),
      ...pick(routeQuery, ['isNud', 'isNpi']),
    },
    getParams,
    searchApi: getDiecututilizationanalys,
    afterSearch: setDataInfo,
  });
</script>

<style lang="less" scoped>
  @import url('/@/design/dashboard.less');

  .dashboard-search-compo-header {
    min-height: auto !important;
    height: auto !important;
  }
</style>
