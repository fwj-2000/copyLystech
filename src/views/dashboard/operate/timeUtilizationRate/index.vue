<!-- 产值平铺页 -->
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
            showPeriodDimension: searchFormValue.timeDimension !== TimeDimension.DAY,
            organizeKeyword: '1',
          }">
          <template #right>
            <a-form-item name="range">
              <div class="flex">
                <div class="flex px-6px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6">含NPI</div>
                <a-select ref="select" v-model:value="searchFormValue.isContain">
                  <a-select-option v-for="item in isContainOptions" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
                </a-select>
              </div>
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
              title: t('views.dashboard.operate.oee.timeUtilizationRate'),
              trendUrl: '/dashboard/operate/timeUtilizationRate/detail',
              listData,
              searchFormValue,
              popoverInfoList: POPOVER_TOOLTIP_LIST,
              chartComponent: Chart,
              getColConfig,
            }">
            <template v-slot:itemHeadRight="{ info }">
              <span class="value mr-16px">{{ info.Moqiejiadonglv }}</span>
            </template>
          </GroupData>
        </SpinContent>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { ref, provide } from 'vue';
  import { useTilePage } from '/@/views/dashboard/operate/hooks/useTilePage';

  import {
    POPOVER_TOOLTIP_LIST,
    DEFAULT_IS_CONTAIN,
    isContainOptions,
  } from '/@/views/dashboard/operate/metricsCenter/components/TimeUtilizationRate/chart/config';
  import GroupData from '/@/views/dashboard/operate/components/GoupData/index.vue';
  import Chart from '/@/views/dashboard/operate/metricsCenter/components/TimeUtilizationRate/chart/index.vue';

  import { TimeDimension } from '/@/views/dashboard/operate/types';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import NoPermission from '/@/views/dashboard/operate/components/NoPermission.vue';

  import { getUtilizationrateSummaryData } from '/@/api/dashbord/report';

  defineOptions({ name: 'dashboard-operate-timeUtilizationRate' });

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
    defaultSearchFormValue: {
      isContain: DEFAULT_IS_CONTAIN,
    },
    getParams: searchFormValue => {
      return {
        isContain: searchFormValue.isContain,
      };
    },
    requestMth: getUtilizationrateSummaryData,
  });
</script>

<style lang="less" scoped>
  @import url('../../../../design/dashboard.less');
</style>

<style lang="less" scoped>
  // 导入混合文件
  @import (reference) '../../../../design/dashboard.less';

  @itemContentHeight: 274px;

  :deep(.dashboard-layout-group-container) {
    .dashboard-layout-group-container(@itemContentHeight);
  }
</style>
sixYards
