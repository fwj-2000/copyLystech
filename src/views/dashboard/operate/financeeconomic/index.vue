<!-- 边贡平铺页 -->
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
        <template #right>
          <div class="flex">
            <div class="flex px-6px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6">是否纳入边贡</div>
            <a-form-item name="isBian">
              <a-select ref="select" v-model:value="searchFormValue.isBian" :dropdownMatchSelectWidth="false">
                <a-select-option v-for="item in IS_INCLUDE_OPTIONS" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <div class="flex">
            <div class="flex px-6px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6">工单类型</div>
            <a-form-item name="isBian">
              <a-select ref="select" v-model:value="searchFormValue.orderType">
                <a-select-option v-for="item in orderTypeOptions" :key="item" :value="item">{{ item }}</a-select-option>
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
          isRequestError,
          isEmptyData,
          showList: false,
        }">
        <!-- 数据展示 -->
        <GroupData
          v-bind="{
            title: t('views.dashboard.operate.financeeconomic.title'),
            trendUrl: '/dashboard/operate/financeeconomic/detail',
            listData,
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
  import { ref, provide, unref } from 'vue';
  import { useTilePage } from '/@/views/dashboard/operate/hooks/useTilePage';
  import { POPOVER_TOOLTIP_LIST, IS_INCLUDE_OPTIONS, DEFAULT_IS_INCLUDE } from '/@/views/dashboard/operate/metricsCenter/components/Financeeconomic/config';

  import GroupData from '/@/views/dashboard/operate/components/GoupData/index.vue';
  import Chart from '/@/views/dashboard/operate/metricsCenter/components/Financeeconomic/Chart/index.vue';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import { getFinanceeconomicSummarydata, getFinanceeconomicOrdertype } from '/@/api/dashbord/operate';
  import { isEmpty } from 'lodash-es';

  defineOptions({ name: 'dashboard-operate-financeeconomic' });

  provide('getSearchFormValue', () => {
    return searchFormValue;
  });
  const orderTypeOptions = ref([]);
  // 覆盖布局
  // const getColConfig = (group, factoryList) => {
  //   if (!listData.value.map(item => (item as any).ParentOrgName).includes('模切BU3')) {
  //     return {};
  //   }
  //   // 特殊适配：BU3 占据两个
  //   const block = group === '模切BU5' ? Math.min(2, factoryList.length) : factoryList.length;
  //   const lgConfig = {
  //     1: 12,
  //     2: 24,
  //     3: 24,
  //   };
  //   return {
  //     xs: 24,
  //     sm: block * 12,
  //     md: block * 12,
  //     lg: lgConfig[block],
  //     xl: block * 6,
  //   };
  // };
  const getParams = searchFormValue => {
    if (isEmpty(unref(orderTypeOptions))) {
      getFinanceeconomicOrdertype(searchFormValue).then(res => {
        orderTypeOptions.value = res?.data?.list;
      });
    }
    return {
      // 其他参数
      isBian: searchFormValue.isBian,
      orderType: searchFormValue.orderType,
    };
  };

  // 使用平铺页面hooks
  const { listData, searchFormValue, loading, isRequestError, isEmptyData, t } = useTilePage({
    defaultSearchFormValue: {
      isBian: DEFAULT_IS_INCLUDE,
      orderType: 'ALL',
    },
    requestMth: getFinanceeconomicSummarydata,
    getParams,
  });
</script>

<style lang="less" scoped>
  @import url('/@/design/dashboard.less');
</style>

<style lang="less" scoped>
  // 导入混合文件
  @import (reference) '/@/design/dashboard.less';

  @itemContentHeight: 268px;
  @itemContentMinWidth: 348px;

  :deep(.dashboard-layout-group-container) {
    .dashboard-layout-group-container(@itemContentHeight, @itemContentMinWidth);
  }
</style>
