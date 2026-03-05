<!-- 客诉平铺页 -->
<template>
  <div class="dashboard-page-container">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header">
      <SearchForm
        v-bind="{
          searchFormValue,
          showOrganizeTreeSelect: true,
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
          isRequestError,
          isEmptyData,
          showList: false,
        }">
        <!-- 数据展示 -->
        <template #empty>
          <EmptyComplain v-show="!loading && isEmptyData"></EmptyComplain>
        </template>
        <GroupData
          v-bind="{
            title: t('views.dashboard.operate.customerComplaints.title'),
            trendUrl: '/dashboard/operate/customerComplaints/detail',
            listData,
            searchFormValue,
            popoverInfoList: POPOVER_TOOLTIP_LIST,
            chartComponent: Chart,
          }">
        </GroupData>
      </SpinContent>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { provide } from 'vue';
  import { useTilePage } from '/@/views/dashboard/operate/hooks/useTilePage';
  import { POPOVER_TOOLTIP_LIST } from '/@/views/dashboard/operate/metricsCenter/components/CustomerComplaints/config';

  import EmptyComplain from '/@/views/dashboard/operate/components/EmptyComplain.vue';
  import GroupData from '/@/views/dashboard/operate/components/GoupData/index.vue';
  import Chart from '/@/views/dashboard/operate/metricsCenter/components/CustomerComplaints/Chart/index.vue';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import { getCustomcomplaintSummarydata } from '/@/api/dashbord/operate';

  defineOptions({ name: 'dashboard-operate-customerComplaints' });

  provide('getSearchFormValue', () => {
    return searchFormValue;
  });

  // 使用平铺页面hooks
  const { listData, searchFormValue, loading, isRequestError, isEmptyData, t } = useTilePage({
    requestMth: getCustomcomplaintSummarydata,
  });
</script>

<style lang="less" scoped>
  @import url('../../../../design/dashboard.less');
</style>

<style lang="less" scoped>
  // 导入混合文件
  @import (reference) '../../../../design/dashboard.less';

  @itemContentHeight: 260px;

  :deep(.dashboard-layout-group-container) {
    .dashboard-layout-group-container(@itemContentHeight);
  }
</style>
