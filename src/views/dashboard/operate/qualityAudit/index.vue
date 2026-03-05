<!-- 制程良率平铺页 -->
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
              title: t('views.dashboard.operate.qualityAudit'),
              trendUrl: '/dashboard/operate/qualityAudit/detail',
              listData,
              searchFormValue,
              popoverInfoList: POPOVER_TOOLTIP_LIST,
              chartComponent: Chart,
              getColConfig,
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

  import { POPOVER_TOOLTIP_LIST } from '/@/views/dashboard/operate/metricsCenter/components/QualityAudit/config';
  import GroupData from '/@/views/dashboard/operate/components/GoupData/index.vue';
  import Chart from '/@/views/dashboard/operate/metricsCenter/components/QualityAudit/Chart/index.vue';

  import { TimeDimension } from '/@/views/dashboard/operate/types';

  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';

  import { getQcauditSummarydata } from '/@/api/dashbord/operate';

  defineOptions({ name: 'dashboard-operate-qualityAudit' });

  const noPermission = ref(false);

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
    requestMth: getQcauditSummarydata,
  });
</script>

<style lang="less" scoped>
  @import url('../../../../design/dashboard.less');
</style>

<style lang="less" scoped>
  // 导入混合文件
  @import (reference) '../../../../design/dashboard.less';

  @itemContentHeight: 278px;
  @itemContentMinWidth: 364px;

  :deep(.dashboard-layout-group-container) {
    .dashboard-layout-group-container(@itemContentHeight, @itemContentMinWidth);
  }
</style>
