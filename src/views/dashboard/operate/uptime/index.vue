<!-- 开机率平铺页 -->
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
            showOrganizeTreeSelect: true,
            showPeriodDimension: searchFormValue.timeDimension !== TimeDimension.DAY,
            organizeKeyword: '1',
          }"></SearchForm>
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
              title: t('views.dashboard.operate.uptime'),
              trendUrl: '/dashboard/operate/uptime/detail',
              listData,
              groupValueKey: 'ParentWorkingRate',
              searchFormValue,
              popoverInfoList: POPOVER_TOOLTIP_LIST,
              getColConfig,
              chartComponent: Chart,
            }">
            <template v-slot:itemHeadRight="{ info }"> {{ t('views.dashboard.operate.uptime') }}：{{ info.WorkingRate }} </template>
          </GroupData>
        </SpinContent>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { ref, provide } from 'vue';
  import { useTilePage } from '/@/views/dashboard/operate/hooks/useTilePage';
  import { POPOVER_TOOLTIP_LIST } from '/@/views/dashboard/operate/metricsCenter/components/Uptime/config';

  import GroupData from '/@/views/dashboard/operate/components/GoupData/index.vue';
  import Chart from '/@/views/dashboard/operate/metricsCenter/components/Uptime/Chart/index.vue';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import NoPermission from '/@/views/dashboard/operate/components/NoPermission.vue';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';

  import { getMachworkingSummarydata } from '/@/api/dashbord/operate';

  import { TimeDimension } from '/@/views/dashboard/operate/types';

  defineOptions({ name: 'dashboard-operate-uptime' });

  const noPermission = ref(false);

  provide('getSearchFormValue', () => {
    return searchFormValue;
  });

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
    requestMth: getMachworkingSummarydata,
  });
</script>

<style lang="less" scoped>
  @import url('../../../../design/dashboard.less');
</style>

<style lang="less" scoped>
  // 导入混合文件
  @import (reference) '../../../../design/dashboard.less';

  :deep(.dashboard-layout-group-container) {
    .dashboard-layout-group-container();
  }
</style>
