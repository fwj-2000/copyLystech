<!-- 模切稼动率三阶页面 -->
<template>
  <div class="dashboard-page-container flex flex-col justify-start">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header flex ct-between">
      <SearchForm
        v-bind="{
          searchFormValue,
          showOrganizeTreeSelect: true,
          isRangePicker: true,
          isFetchAllOrgCode: true,
        }">
        <template #timeDimension>
          <a-form-item name="timeDimension">
            <a-select v-model:value="searchFormValue.timeDimension">
              <a-select-option value="day">天</a-select-option>
              <a-select-option value="week">周</a-select-option>
              <a-select-option value="month">月</a-select-option>
            </a-select>
          </a-form-item>
        </template>
        <template #right>
          <!-- 额外的条件 -->
          <div v-for="(item, idx) in allOptions" :key="idx" class="flex">
            <div class="flex px-6px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6">
              {{ item.label }}
            </div>
            <a-form-item :name="item.field">
              <a-select
                ref="select"
                v-model:value="searchFormValue[item.field]"
                :style="`${item.width ? `min-width: ${item.width}px;text-align: left` : ''}`"
                v-bind="item.$attrs">
                <a-select-option v-for="option in item.options" :key="option.value" :value="option.value">
                  {{ option.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </div>
        </template>
      </SearchForm>
    </div>
    <!-- 内容加载封装组件 -->
    <div class="dashboard-content-container relative h-[105%]">
      <div v-if="achievementRate" class="absolute right-14px top-[-6px] z-3100 w-[128px] h-[128px]">
        <RateSvg :rate="achievementRate"></RateSvg>
      </div>
      <!-- 报表表格 -->
      <BaseVxeTable
        ref="tableRef"
        v-bind="{
          dataSource: dataSource,
          showColumns: columns,
          searchFormValue,
          allColumnsOptions,
        }" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { provide, ref } from 'vue';
  import { pick } from 'lodash-es';
  import { useSearchForm } from '/@/views/dashboard/commonHooks/useSearchForm';
  import { useRouteQuery } from '/@/views/dashboard/operate/hooks/useRouteQuery';
  import { allColumnsOptions, columns } from './config';

  import BaseVxeTable from '/@/views/dashboard/operate/components/BaseVxeTable/index.vue';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { TimeDimension } from '/@/views/dashboard/operate/types';
  import { getDiecututilizationdetail } from '/@/api/dashbord/report';
  import { getAllOptions, staticAllOptions } from './config';
  import RateSvg from './RateSvg.vue';

  defineOptions({ name: 'dashboard-operate-dieCuttingUtilizationRate-detail' });
  provide('getSearchFormValue', () => {
    return searchFormValue;
  });
  provide('getParams', () => {
    return getParams();
  });
  provide('getDimensionTypeOptions', () => {
    return (allOptions.value.find(item => item.field === 'dimensionType') ?? { options: [] }).options;
  });

  const tableRef = ref<InstanceType<typeof BaseVxeTable>>();
  const dataSource = ref<any[]>([]);
  const allOptions = ref<any[]>(staticAllOptions);
  const achievementRate = ref<string>('');

  // 查询参数
  const getParams = () => {
    const dateDim = getDateDimParamsAllDim();
    return {
      dimension: searchFormValue.timeDimension,
      ...dateDim,
      ...pick(searchFormValue, ['orgCode']),
      // 获取下拉条件
      ...allOptions.value.reduce((pre, cur) => {
        const { mode = '' } = cur.$attrs as any;
        if (mode === 'multiple') {
          return {
            ...pre,
            [cur.field]: searchFormValue[cur.field].join(';'),
          };
        }
        return {
          ...pre,
          [cur.field]: searchFormValue[cur.field],
        };
      }, {}),
    };
  };

  // 填充数据
  const setDataInfo = (data: any) => {
    achievementRate.value = `${data.achievementRate.toFixed(1)}%`;
    // 配置下拉参数
    const dataList = data.result.map(item => {
      return {
        ...item,
        ...item.dimesionType.reduce(
          (pre, cur) => ({
            ...pre,
            [cur.keys]: cur.values,
          }),
          {},
        ),
      };
    });
    dataSource.value = dataList;
  };

  const { routeQuery } = useRouteQuery();
  const { date: defaultDate = dayjs().tz() } = routeQuery;
  const { searchFormValue, getDateDimParamsAllDim } = useSearchForm({
    isAutoSearch: true,
    defaultSearchFormValue: {
      orgCode: 'MQ1001001',
      dateRange: [defaultDate.subtract(4, 'week'), defaultDate],
      timeDimension: TimeDimension.WEEK,
      // 条件下拉默认值
      ...allOptions.value.reduce((pre, cur) => {
        return {
          ...pre,
          [cur.field]: cur.default,
        };
      }, {}),
      // 从路由取数据
      ...pick(routeQuery, ['orgCode', 'date', 'sectionVal', 'metricKey']),
    },
    getParams,
    searchApi: getDiecututilizationdetail,
    beforeSearch: async () => {
      allOptions.value = await getAllOptions({});
    },
    afterSearch: setDataInfo,
  });
</script>

<style lang="less">
  .table-wrapper {
    .hightlignt-row {
      td {
        background-color: #fff2e6;
      }
    }
  }
</style>

<style lang="less" scoped>
  @import url('/@/design/dashboard.less');

  @borderColor: #ccc;

  .dashboard-content-container {
    :deep(.ant-spin-container) {
      min-height: 60vh;
    }

    .empty-wrapper {
      min-height: 60vh;
    }
  }
</style>
