<!-- 出勤率平铺页 -->
<template>
  <div class="dashboard-page-container">
    <NoPermission v-if="noPermission"></NoPermission>
    <template v-else>
      <!-- 表单筛选条件 -->
      <div class="dashboard-search-compo-header">
        <SearchForm
          v-model:noPermission="noPermission"
          v-bind="{
            searchFormValue,
            organizeKeyword: '',
            showOrganizeTreeSelect: true,
            showPeriodDimension: searchFormValue.timeDimension !== TimeDimension.DAY,
          }">
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
          <GroupData
            v-bind="{
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
              <span v-if="info.ParentAllCQRate" class="value"> {{ t('views.dashboard.operate.attendanceRate.title') }}: {{ info.ParentAllCQRate }}</span>
            </template>
            <template v-slot:itemHeadLeft="{ info }">
              <div class="text-[12px]">
                <span class="ml-8px"> 在职: {{ info.AllZZNum }} </span>
                <span class="ml-8px"> {{ t('views.dashboard.operate.attendanceRate.title') }}: {{ info.AllCQRate }} </span>
              </div>
            </template>
          </GroupData>
        </SpinContent>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { ref, provide } from 'vue';
  import { getAttendanceSummarydata } from '/@/api/dashbord/operate';
  import { useTilePage } from '/@/views/dashboard/operate/hooks/useTilePage';
  import { POPOVER_TOOLTIP_LIST } from '/@/views/dashboard/operate/metricsCenter/components/Attendance/config';

  import { TimeDimension } from '/@/views/dashboard/operate/types';

  import GroupData from '/@/views/dashboard/operate/components/GoupData/index.vue';
  import Chart from '/@/views/dashboard/operate/metricsCenter/components/Manpower/SingleItem.vue';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import NoPermission from '/@/views/dashboard/operate/components/NoPermission.vue';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';

  defineOptions({ name: 'dashboard-operate-manpower' });

  provide('getSearchFormValue', () => {
    return searchFormValue;
  });

  const noPermission = ref(false);

  // 覆盖布局
  const getColConfig = (_, factoryList) => {
    const block = factoryList.length;
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
      xl: block * 8,
    };
  };

  // 使用平铺页面hooks
  const { listData, searchFormValue, loading, isRequestError, isEmptyData, t } = useTilePage({
    requestMth: getAttendanceSummarydata,
  });
</script>

<style lang="less">
  @import url('/@/design/dashboard.less');
</style>

<style lang="less" scoped>
  @itemContentHeight: 268px;
  @itemContentMinWidth: 468px;
  // 导入混合文件
  @import (reference) '/@/design/dashboard.less';

  :deep(.dashboard-layout-group-container) {
    .dashboard-layout-group-container(@itemContentHeight, @itemContentMinWidth);
  }
</style>
