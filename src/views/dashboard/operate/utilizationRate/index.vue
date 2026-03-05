<!-- AOI稼动平铺页 -->
<template>
  <div class="dashboard-page-container">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header">
      <SearchForm
        v-bind="{
          searchFormValue,
          showOrganizeTreeSelect: true,
          showPeriodDimension: searchFormValue.timeDimension !== TimeDimension.DAY,
        }">
        <template #right>
          <div class="flex">
            <a-form-item name="isBian">
              <a-select ref="select" v-model:value="searchFormValue.mark">
                <a-select-option v-for="item in AOI_MARK_OPTIONS" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
                <a-select-option v-for="item in AOI_MARK_OPTIONS" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </div>
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
            title: t('views.dashboard.operate.aoiIsInActionToday.title'),
            trendUrl: '/dashboard/operate/utilizationRate/detail',
            listData,
            searchFormValue,
            popoverInfoList: POPOVER_TOOLTIP_LIST,
            getColConfig,
            chartComponent: Chart,
          }">
        </GroupData>
      </SpinContent>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useTilePage } from '/@/views/dashboard/operate/hooks/useTilePage';
  import { POPOVER_TOOLTIP_LIST, AOI_MARK_OPTIONS, DEFAULT_AOI_MARK } from '/@/views/dashboard/operate/metricsCenter/components/UtilizationRate/config';

  import { TimeDimension } from '/@/views/dashboard/operate/types';

  import GroupData from '/@/views/dashboard/operate/components/GoupData/index.vue';
  import Chart from '/@/views/dashboard/operate/metricsCenter/components/UtilizationRate/Chart/index.vue';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import { getAoidatanewSummary } from '/@/api/dashbord/report';

  defineOptions({ name: 'dashboard-operate-utilizationRate' });

  // 覆盖布局
  const getColConfig = (group, factoryList) => {
    // 特殊适配：BU3 占据两个
    const block = group === '模切BU3' ? Math.min(2, factoryList.length) : factoryList.length;
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

  // 额外查询参数
  const getParams = searchFormValue => {
    return {
      mark: searchFormValue.mark,
    };
  };

  // 使用平铺页面hooks
  const { listData, searchFormValue, loading, isRequestError, isEmptyData, t } = useTilePage({
    defaultSearchFormValue: {
      mark: DEFAULT_AOI_MARK,
    },
    getParams,
    requestMth: getAoidatanewSummary,
  });
</script>

<style lang="less">
  @import url('../../../../design/dashboard.less');
</style>

<style lang="less" scoped>
  // 导入混合文件
  @import (reference) '../../../../design/dashboard.less';

  @itemContentHeight: 294px;

  :deep(.dashboard-layout-group-container) {
    .dashboard-layout-group-container(@itemContentHeight);
  }
</style>
