<!-- 模切达成平铺页 -->
<template>
  <div class="dashboard-page-container">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header">
      <SearchForm v-bind="{
        searchFormValue,
        showOrganizeTreeSelect: true,
        showPeriodDimension: searchFormValue.timeDimension !== TimeDimension.DAY,
      }"></SearchForm>
    </div>
    <!-- 内容加载封装组件 -->
    <div class="dashboard-content-container">
      <SpinContent v-bind="{
        loading: loading,
        isEmptyData,
        isRequestError,
        showList: false,
      }">
        <!-- 数据展示 -->
        <GroupData v-bind="{
          title: t('views.dashboard.operate.dieCutToday.title'),
          trendUrl: '/dashboard/operate/dieCutting/detail',
          listData,
          searchFormValue,
          popoverInfoList: POPOVER_TOOLTIP_LIST,
          chartComponent: Chart,
          formatModelMth: (item) => ({
            BatchAchievementRate: item.BatchAchieveRate,
            QuantityAchievementRate: item.QtyAchieveRate,
          }),
          getColConfig,
        }">
        </GroupData>
      </SpinContent>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useTilePage } from '/@/views/dashboard/operate/hooks/useTilePage';
import { POPOVER_TOOLTIP_LIST } from '/@/views/dashboard/operate/metricsCenter/components/DieCutToday/config';

import { TimeDimension } from '/@/views/dashboard/operate/types';

import Chart from '/@/views/dashboard/operate/metricsCenter/components/DieCutToday/Chart.vue';
import GroupData from '/@/views/dashboard/operate/components/GoupData/index.vue';
import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
import { getMqachieveSummarydata } from '/@/api/dashbord/operate';

defineOptions({ name: 'dashboard-operate-dieCutting' });

// 覆盖布局
const getColConfig = (group, factoryList) => {
  // 特殊适配：BU3 占据两个
  const block = group === '模切BU3' ? 2 : factoryList.length;
  const lgConfig = {
    1: 12,
    2: 24,
    3: 24,
  };
  return {
    xs: 24,
    sm: block * 12,
    md: block * 12,
    lg: lgConfig[block],
    xl: block * 6,
  };
};

// 使用平铺页面hooks
const { listData, searchFormValue, loading, isRequestError, isEmptyData, t } = useTilePage({
  requestMth: getMqachieveSummarydata,
});
</script>

<style lang="less" scoped>
@import url('../../../../design/dashboard.less');
</style>

<style lang="less" scoped>
// 导入混合文件
@import (reference) '../../../../design/dashboard.less';

:deep(.dashboard-layout-group-container) {
  .dashboard-layout-group-container()
}
</style>