<!-- 运营分析页 -->
<template>
  <div class="dashboard-page-container">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header flex ct-between">
      <SearchForm
        v-bind="{
          searchFormValue,
          organizeKeyword: '1',
          showOrganizeTreeSelect: true,
          isRangePicker: true,
          showTimeDimension: true,
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
          <a-form-item name="period">
            <a-select v-model:value="searchFormValue.period">
              <a-select-option value="2">全部</a-select-option>
              <a-select-option value="1">工作日</a-select-option>
              <a-select-option value="0">非工作日</a-select-option>
            </a-select>
          </a-form-item>
        </template>
      </SearchForm>
    </div>
    <!-- 内容组件 -->
    <div class="dashboard-content-container">
      <!-- 指标表格&趋势  -->
      <MetricWidget v-bind="{ searchFormValue }" v-model:metricKeyList="metricKeyList" />
      <!-- 环比&排名组件 -->
      <RateAndRank class="mt-12px" v-bind="{ searchFormValue, metricKeyList }" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { ref, provide } from 'vue';
  import { useSearchForm } from '/@/views/dashboard/hooks/useSearchForm';

  import MetricWidget from './MetricWidget/index.vue';
  import RateAndRank from './RateAndRank/index.vue';
  import { TimeDimension } from '/@/views/dashboard/operate/types';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { IMetricKey } from './types';

  const metricKeyList = ref<IMetricKey[]>([]);

  // 使用维度搜索hooks
  const { searchFormValue, getDateDimParams } = useSearchForm({
    defaultSearchFormValue: {
      orgCode: 'MQ',
      dateRange: [dayjs().tz().subtract(5, 'week'), dayjs().tz().subtract(1, 'week')],
      timeDimension: TimeDimension.WEEK,
    },
  });

  // 更新报表的指标key值列表

  // 供子组件获取通用的请求参数
  provide('getCommonParams', () => {
    return {
      orgCode: searchFormValue.orgCode,
      dimension: searchFormValue.timeDimension,
      period: searchFormValue.period,
      ...getDateDimParams(),
    };
  });
</script>

<style lang="less" scoped>
  @import url('/@/design/dashboard.less');
</style>
