<!-- 排名页 -->
<template>
  <div class="dashboard-page-container-new">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header flex-1">
      <SearchForm
        v-bind="{
          searchFormValue,
          showOrganizeTreeSelect: true,
          showTimeDimension: true,
          isFetchAllOrgCode: true,
        }">
        <template #timeDimension>
          <a-form-item name="timeDimension">
            <a-select v-model:value="searchFormValue.timeDimension">
              <a-select-option value="week">周</a-select-option>
              <a-select-option value="month">月</a-select-option>
            </a-select>
          </a-form-item>
        </template>
        <template #left>
          <a-form-item v-if="searchFormValue.orgCode === 'MQ'" name="orgLevel">
            <a-select v-model:value="searchFormValue.orgLevel">
              <a-select-option v-for="(key, idx) in Object.keys(EOrgLevel)" :key="idx" :value="EOrgLevel[key]">
                {{ key }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </template>
      </SearchForm>
    </div>
    <!-- 内容加载封装组件 -->
    <div class="dashboard-content-container">
      <SpinContent
        v-bind="{
          loading: loading,
          isEmptyData,
          isRequestError,
          showList: false,
        }">
        <!-- 报表表格 -->
        <div class="w-[100%] h-[100%] overflow-hidden">
          <RankItem
            v-bind="{
              dataSource: dataSource,
              showColumns: columns,
              searchFormValue,
              allColumnsOptions,
            }" />
        </div>
      </SpinContent>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRouteQuery } from '/@/views/dashboard/operate/hooks/useRouteQuery';
  import { columns, allColumnsOptions } from './config';
  import { getFaremanageAllocationdetail } from '/@/api/dashbord/report';

  import RankItem from '/@/views/dashboard/commonComponents/RankItem.vue';
  import { useSearchForm } from '/@/views/dashboard/commonHooks/useSearchForm';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import { TimeDimension } from '../../types';
  import { EOrgLevel } from '../types';

  defineOptions({ name: 'dashboard-operate-expense-ranking' });

  const dataSource = ref<any[]>([]);
  const { routeQuery } = useRouteQuery();
  // 使用维度搜索hooks
  const { loading, searchFormValue, isRequestError, isEmptyData, getDateDimParamsByDate } = useSearchForm({
    isAutoSearch: true,
    defaultSearchFormValue: {
      orgCode: '',
      orgLevel: EOrgLevel.SBU,
      timeDimension: TimeDimension.WEEK,
      ...routeQuery,
    },
    getParams: () => {
      const { startDim, endDim } = getDateDimParamsByDate();
      const { orgCode = '' } = searchFormValue;
      const res = {
        orgLevel: searchFormValue.orgLevel,
        dimension: searchFormValue.timeDimension,
        startDim,
        endDim,
        orgCode: orgCode === 'MQ' ? '' : orgCode,
      };
      return res;
    },
    searchApi: getFaremanageAllocationdetail,
    afterSearch: res => {
      dataSource.value = res;
    },
  });
</script>

<style lang="less" scoped>
  @import url('/@/design/dashboard.less');
</style>
