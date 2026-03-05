<!-- 边贡平铺页 -->
<template>
  <div class="dashboard-page-container">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header">
      <SearchForm
        v-bind="{
          searchFormValue,
          showTimeDimension: false,
          showOrganizeTreeSelect: true,
        }">
        <!-- <template #right>
          <a-form-item name="dimension">
            <a-select v-model:value="searchFormValue.dimension">
              <a-select-option value="cz">产值</a-select-option>
              <a-select-option value="xz">销值</a-select-option>
            </a-select>
          </a-form-item>
        </template> -->
      </SearchForm>
    </div>
    <!-- 内容加载封装组件 -->
    <div class="dashboard-content-container">
      <SpinContent
        v-bind="{
          loading: loading,
          isRequestError,
          isEmptyData,
          showList: false,
        }">
        <!-- 数据展示 -->
        <GroupData
          v-bind="{
            title: '',
            trendUrl: '/dashboard/operate/mpf/detail',
            listData,
            extraInfo: { currentMonth },
            searchFormValue,
            popoverInfoList: POPOVER_TOOLTIP_LIST,
            chartComponent: Chart,
            // getColConfig,
          }">
        </GroupData>
      </SpinContent>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, provide } from 'vue';
  import { useTilePage } from '/@/views/dashboard/operate/hooks/useTilePage';
  import { POPOVER_TOOLTIP_LIST } from '/@/views/dashboard/operate/metricsCenter/components/ModularPerformance/config';

  import GroupData from '/@/views/dashboard/operate/components/GoupData/index.vue';
  import Chart from '/@/views/dashboard/operate/metricsCenter/components/ModularPerformance/Chart/index.vue';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import { getPerformancesummary } from '/@/api/dashbord/operate';
  import dayjs from 'dayjs';
  defineOptions({ name: 'dashboard-operate-mpf' });
  import { TimeDimension } from '../types';

  provide('getSearchFormValue', () => {
    return searchFormValue;
  });

  // 覆盖布局
  // const getColConfig = (group, factoryList) => {
  //   if (!listData.value.map(item => (item as any).ParentOrgName).includes('模切BU3')) {
  //     return {};
  //   }
  //   const lgConfig = {
  //     1: 12,
  //     2: 24,
  //     3: 24,
  //   };
  //   // 特殊适配：BU5 占据两个
  //   const block = ['模切BU1', '模切BU5'].includes(group) ? Math.min(2, factoryList.length) : factoryList.length;
  //   return {
  //     xs: 24,
  //     sm: block * 12,
  //     md: block * 12,
  //     lg: lgConfig[block],
  //     xl: block * 6,
  //   };
  // };

  const getParams = searchFormValue => {
    return {
      month: searchFormValue.date.format('YYYY-MM'),
      orgCode: searchFormValue.orgCode,
    };
  };

  // 使用平铺页面hooks
  const { listData, searchFormValue, loading, isRequestError, isEmptyData } = useTilePage({
    defaultSearchFormValue: {
      timeDimension: TimeDimension.MONTH,
      // startDate: dayjs('2025-12-01'),
      dateRange: [dayjs('2025-12-01'), dayjs('2025-12-01')],
    },
    requestMth: async searchFormValue => {
      return await getPerformancesummary(getParams(searchFormValue));
    },
  });

  const currentMonth = computed(() => {
    const { date } = searchFormValue;
    return date.format('M');
  });
</script>

<style lang="less" scoped>
  @import url('../../../../design/dashboard.less');
</style>

<style lang="less" scoped>
  // 导入混合文件
  @import (reference) '../../../../design/dashboard.less';

  @itemContentHeight: 268px;
  @itemContentMinWidth: 288px;

  :deep(.dashboard-layout-group-container) {
    .dashboard-layout-group-container(@itemContentHeight, @itemContentMinWidth);
  }
</style>
