<!-- 出勤率平铺页 -->
<template>
  <div class="dashboard-page-container">
    <NoPermission v-if="noPermission"></NoPermission>
    <template v-else>
      <!-- 表单筛选条件 -->
      <div class="dashboard-search-compo-header">
        <SearchForm v-model:noPermission="noPermission" v-bind="{
          searchFormValue,
          organizeKeyword: '',
          showOrganizeTreeSelect: true,
          showPeriodDimension: searchFormValue.timeDimension !== TimeDimension.DAY,
        }">
        </SearchForm>
      </div>
      <!-- 内容加载封装组件 -->
      <div class="dashboard-content-container">
        <SpinContent v-bind="{
          loading: loading,
          isEmptyData,
          isRequestError,
          showList: false,
        }">
          <!-- 单个工厂展示 -->
          <a-row v-if="isSingleInfo" :gutter="[12, 12]" class="group-container">
            <a-col v-bind="singleOptions">
              <SingleItem :info="listData[0]" :searchFormValue="searchFormValue">
              </SingleItem>
            </a-col>
          </a-row>
          <!-- 数据展示 -->
          <GroupData v-else v-bind="{
            title: t('views.dashboard.operate.attendanceRate.title'),
            trendUrl: '/dashboard/operate/attendanceRate/detail',
            listData,
            searchFormValue,
            popoverInfoList: POPOVER_TOOLTIP_LIST,
            getColConfig,
            chartComponent: Chart,
          }">
            <template v-slot:groupHeadLeft="{ info }">
              <span v-if="info.ParentAllZZNum" class="value mr-16px">总在职人数: {{ info.ParentAllZZNum }}</span>
              <span v-if="info.ParentAllCQRate" class="value">
                {{ t('views.dashboard.operate.attendanceRate.title') }}: {{ info.ParentAllCQRate }}</span>
            </template>
            <template v-slot:itemHeadRight="{ info }">
              {{ t('views.dashboard.operate.attendanceRate.title') }}: {{ info.AllCQRate }}
            </template>
          </GroupData>
        </SpinContent>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { getAttendanceSummarydata } from '/@/api/dashbord/operate';
import { useTilePage } from '/@/views/dashboard/operate/hooks/useTilePage';
import { POPOVER_TOOLTIP_LIST } from '/@/views/dashboard/operate/metricsCenter/components/Attendance/config';

import { TimeDimension } from '/@/views/dashboard/operate/types';

import GroupData from '/@/views/dashboard/operate/components/GoupData/index.vue';
import Chart from '/@/views/dashboard/operate/attendanceRate/components/ItemData/Item.vue';
import SingleItem from './components/ItemData/Single.vue';
import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
import NoPermission from '/@/views/dashboard/operate/components/NoPermission.vue';
import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';

defineOptions({ name: 'dashboard-operate-attendanceRate' });

// 单个工厂组件响应式配置
const singleOptions = { xs: 24, sm: 24, md: 12, lg: 8, xl: 8 };

const noPermission = ref(false);

// 覆盖布局
const getColConfig = (group, factoryList) => {
  // 特殊适配：BU3 占据两个
  const block = group === '模切BU2' ? 2 : factoryList.length;
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

const isSingleInfo = computed(() => {
  return listData.value.length === 1;
})

// 使用平铺页面hooks
const { listData, searchFormValue, loading, isRequestError, isEmptyData, t } = useTilePage({
  requestMth: getAttendanceSummarydata,
});
</script>

<style lang="less">
@import url('../../../../design/dashboard.less');
</style>

<style lang="less" scoped>
// 导入混合文件
@import (reference) '../../../../design/dashboard.less';

:deep(.dashboard-layout-group-container) {
  .dashboard-layout-group-container();
}
</style>