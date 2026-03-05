<!-- 费用平铺页 -->
<template>
  <div class="dashboard-page-container">
    <NoPermission v-if="noPermission"></NoPermission>
    <template v-else>
      <!-- 表单筛选条件 -->
      <div class="dashboard-search-compo-header">
        <SearchForm
          v-bind="{
            searchFormValue,
            showOrganizeTreeSelect: true,
            showPeriodDimension: false,
            isRangePicker: false,
          }">
          <template #timeDimension>
            <a-form-item name="timeDimension">
              <a-select v-model:value="searchFormValue.timeDimension">
                <a-select-option value="week">周</a-select-option>
                <a-select-option value="month">月</a-select-option>
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
          <!-- 数据展示 -->
          <GroupData
            v-bind="{
              title: '费用',
              trendUrl: '/dashboard/operate/expense/detail',
              listData,
              searchFormValue,
              chartComponent: Chart,
            }">
          </GroupData>
        </SpinContent>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useTilePage } from '/@/views/dashboard/operate/hooks/useTilePage';

  import GroupData from '/@/views/dashboard/operate/components/GoupData/index.vue';
  import Chart from '/@/views/dashboard/operate/metricsCenter/components/Expenses/Chart/index.vue';

  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';

  import { getFaremanageAllocationsummary } from '/@/api/dashbord/report';
  import { isArray } from '/@/utils/is';
  import { pick } from 'lodash-es';
  import { TimeDimension } from '../types';

  defineOptions({ name: 'dashboard-operate-expense' });

  const noPermission = ref(false);

  // 使用平铺页面hooks
  const { listData, searchFormValue, loading, isRequestError, isEmptyData, getIndexQueryParams } = useTilePage({
    defaultSearchFormValue: {
      timeDimension: TimeDimension.WEEK,
    },
    requestMth: getFaremanageAllocationsummary,
    getFullParams: searchFormValue => {
      const { condition } = getIndexQueryParams();
      return {
        orgLevel: 4,
        dimension: searchFormValue.timeDimension,
        startDim: condition,
        endDim: condition,
        ...pick(searchFormValue, ['orgCode']),
      };
    },
    formatData: data => {
      return data.map(item => {
        return Object.keys(item).reduce((pre, key) => {
          if (isArray(item[key])) {
            return {
              ...pre,
              ...item[key].reduce(
                (p, c) => ({
                  ...p,
                  [c.keys]: c.values,
                }),
                {},
              ),
            };
          }
          return {
            ...pre,
            [key]: item[key],
          };
        }, {});
      });
    },
  });
</script>

<style lang="less" scoped>
  @import url('../../../../design/dashboard.less');
</style>

<style lang="less" scoped>
  // 导入混合文件
  @import (reference) '../../../../design/dashboard.less';

  @itemContentHeight: 288px;
  @itemContentMinWidth: 364px;

  :deep(.dashboard-layout-group-container) {
    .dashboard-layout-group-container(@itemContentHeight, @itemContentMinWidth);
  }
</style>
