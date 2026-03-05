<!-- oee平铺页 -->
<template>
  <div class="dashboard-page-container">
    <NoPermission v-if="noPermission"></NoPermission>
    <template v-else>
      <!-- 表单筛选条件 -->
      <div class="dashboard-search-compo-header">
        <SearchForm
          v-model:noPermission="noPermission"
          v-bind="{
            showOrganizeTreeSelect: true,
            searchFormValue,
            showTimeDimension: true,
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
          <!-- 数据展示 -->
          <GroupData
            v-bind="{
              title: t('views.dashboard.operate.oee.title'),
              trendUrl: '/dashboard/operate/oee/detail',
              listData,
              groupValueKey: 'ParentOEE',
              searchFormValue,
              getColConfig,
              popoverInfoList: POPOVER_TOOLTIP_LIST,
            }">
            <!-- 替换默认的单个数据项 -->
            <template v-slot:groupItemData="{ groupInfo }">
              <TimeMoves
                v-for="(info, idx) in groupInfo.factoryList"
                :key="idx"
                class="item-content-wrapper"
                :info="info"
                :searchFormValue="searchFormValue"></TimeMoves>
            </template>
          </GroupData>
        </SpinContent>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { provide, ref } from 'vue';
  import { useTilePage } from '/@/views/dashboard/operate/hooks/useTilePage';
  import { POPOVER_TOOLTIP_LIST } from '/@/views/dashboard/operate/metricsCenter/components/Oee/config';

  import GroupData from '/@/views/dashboard/operate/components/GoupData/index.vue';
  import TimeMoves from '/@/views/dashboard/operate/oee/components/TimeMoves.vue';
  import { getOeedata } from '/@/api/dashbord/operate';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import NoPermission from '/@/views/dashboard/operate/components/NoPermission.vue';
  import { TimeDimension } from '/@/views/dashboard/operate/types';

  defineOptions({ name: 'dashboard-operate-oee' });

  // 使用 provide 注入数据
  provide('getSearchFormValue', () => searchFormValue);

  const noPermission = ref(false);
  // 使用平铺页面hooks
  const { listData, searchFormValue, loading, isRequestError, isEmptyData, t } = useTilePage({
    requestMth: getOeedata,
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
</script>

<style lang="less" scoped>
  @import url('../../../../design/dashboard.less');
</style>

<style lang="less" scoped>
  // 导入混合文件
  @import (reference) '../../../../design/dashboard.less';

  @itemContentHeight: 230px;

  :deep(.dashboard-layout-group-container) {
    .dashboard-layout-group-container(@itemContentHeight);
  }
</style>
