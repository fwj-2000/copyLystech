<template>
  <div class="dashboard-page-container">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header">
      <SearchForm
        v-bind="{
          searchFormValue,
          isRangePicker: true,
          showOrganizeTreeSelect: true,
          showPeriodDimension: false,
        }">
        <template #dimension>
          <a-form-item name="dimension">
            <a-select v-model:value="searchFormValue.dimension">
              <a-select-option value="day">天</a-select-option>
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
          isEmptyData,
          isRequestError,
          showList: false,
        }">
        <!-- 数据展示 -->
        <a-row :gutter="[12, 12]" class="group-container">
          <!-- 所有图表 -->
          <a-col v-for="(chart, idx) in chartInfoList" :key="idx" :xs="24" :xl="24">
            <BaseChart :info="chart.info"></BaseChart>
          </a-col>
        </a-row>
      </SpinContent>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useTrendPage, ChartQuotaInfo } from '/@/views/dashboard/operate/hooks/useTrendPage';
  import { getAttendancePercapitatrend } from '/@/api/dashbord/operate';
  import { TimeDimension } from '/@/views/dashboard/operate/types';
  import BaseChart from '/@/views/dashboard/operate/components/BaseChart/index.vue';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import dayjs from 'dayjs';
  import { useRouteQuery } from '/@/views/dashboard/operate/hooks/useRouteQuery';

  defineOptions({ name: 'dashboard-operate-manpower-percapita-detail' });

  const { routeQuery } = useRouteQuery();

  // 图表指标配置
  const chartQuotaInfoList: ChartQuotaInfo[] = [
    {
      quotaKey: 'AvgChanzhi',
      subTitle: '人均产值',
      suffix: '(万元)',
    },
    {
      quotaKey: 'IdlAvgChanzhi',
      subTitle: '人均IDL产值',
      suffix: '(万元)',
    },
    {
      quotaKey: 'DlAvgChanzhi',
      subTitle: '人均DL产值',
      suffix: '(万元)',
    },
    {
      quotaKey: 'Dl1AvgChanzhi',
      subTitle: '人均DL1产值',
      suffix: '(万元)',
    },
    {
      quotaKey: 'Dl2AvgChanzhi',
      subTitle: '人均DL2产值',
      suffix: '(万元)',
    },
    {
      quotaKey: 'ShougongAvgChanzhi',
      subTitle: '人均手工产值',
      suffix: '(万元)',
    },
    {
      quotaKey: 'MoqieAvgChanzhi',
      subTitle: '人均模切产值',
      suffix: '(万元)',
    },
    {
      quotaKey: 'AvgMoqieKaixian',
      subTitle: '人均开线数',
      suffix: '',
    },
    {
      quotaKey: 'AvgPbKaixian',
      subTitle: '人均平板开线数',
      suffix: '',
    },
    {
      quotaKey: 'AvgYdKaixian',
      subTitle: '人均圆刀开线数',
      suffix: '',
    },
  ];

  // 单厂单图表指标配置
  const { key } = routeQuery;
  const isChanzhiDefault = !['IdlAvgChanzhi', 'DlAvgChanzhi', 'Dl1AvgChanzhi', 'Dl2AvgChanzhi', 'ShougongAvgChanzhi', 'MoqieAvgChanzhi', 'AvgChanzhi'].includes(
    key,
  );
  const isKaixianDefault = !['AvgPbKaixian', 'AvgYdKaixian', 'AvgMoqieKaixian'].includes(key);
  const keys = [key, ...(isChanzhiDefault ? ['AvgChanzhi'] : []), ...(isKaixianDefault ? ['AvgMoqieKaixian'] : [])];
  const colors = ['#4B7BEC', '#58A7B9', '#46AAF2', '#EFC56C', '#E08D73', '#00A0AA', '#4BAF7F', '#884BEC'];
  const singleChartQuotaInfoList = [
    {
      lineKeys: [
        {
          key: 'IdlAvgChanzhi',
          title: '人均IDL产值',
          suffix: '(万元)',
          legendSelected: false,
        },
        {
          key: 'DlAvgChanzhi',
          title: '人均DL产值',
          suffix: '(万元)',
          legendSelected: false,
        },
        {
          key: 'Dl1AvgChanzhi',
          title: '人均DL1产值',
          suffix: '(万元)',
          legendSelected: false,
        },
        {
          key: 'Dl2AvgChanzhi',
          title: '人均DL2产值',
          suffix: '(万元)',
          legendSelected: false,
        },
        {
          key: 'ShougongAvgChanzhi',
          title: '人均手工产值',
          suffix: '(万元)',
          legendSelected: false,
        },
        {
          key: 'MoqieAvgChanzhi',
          title: '人均模切产值',
          suffix: '(万元)',
          legendSelected: false,
        },
        {
          key: 'AvgChanzhi',
          title: '人均产值',
          suffix: '(万元)',
          legendSelected: true,
        },
      ].map((item, idx) => {
        return {
          ...item,
          legendSelected: keys.includes(item.key),
          color: colors[idx],
        };
      }),
      showKeysLengend: true,
      subTitle: '人均产值',
      suffix: '(万元)',
    },
    {
      lineKeys: [
        {
          key: 'AvgPbKaixian',
          title: '人均平板开线数',
          suffix: ' ',
          legendSelected: false,
        },
        {
          key: 'AvgYdKaixian',
          title: '人均圆刀开线数',
          suffix: ' ',
          legendSelected: false,
        },
        {
          key: 'AvgMoqieKaixian',
          title: '人均开线数',
          suffix: ' ',
          legendSelected: true,
        },
      ].map((item, idx) => {
        return {
          ...item,
          legendSelected: keys.includes(item.key),
          color: colors[idx],
        };
      }),
      showKeysLengend: true,
      subTitle: '人均开线数',
      suffix: ' ',
    },
  ];
  const getParams = (_searchFormValue, queryParams) => {
    function formatDate(date) {
      return date ? dayjs(date).format('YYYY-MM-DD') : '';
    }
    const params = {
      dimension: queryParams.dimension,
      startTime: queryParams.dimension === TimeDimension.DAY ? formatDate(queryParams.startTime) : queryParams.startDim,
      endTime: queryParams.dimension === TimeDimension.DAY ? formatDate(queryParams.endTime) : queryParams.endDim,
    };
    return params;
  };

  const getFirstDayOfWeek = yearWeek => {
    // 提取年份和周数
    const year = Number.parseInt(yearWeek.slice(0, 4));
    const week = Number.parseInt(yearWeek.slice(6));
    // 获取指定年份的第一天
    let firstDayOfYear = dayjs().tz().year(year).startOf('year');
    // 获取这一天是星期几（0代表周日，6代表周六）
    let dayOfWeek = firstDayOfYear.day();
    // 计算需要向前偏移多少天才能到当周的第一天（周日）
    let daysToSubtract = dayOfWeek - 1;
    // 根据周数计算需要向后偏移多少周
    let weeksToAdd = week - 1;
    // 计算总的偏移天数
    let daysToAdd = weeksToAdd * 7;
    // 计算当周第一天的日期
    let firstDayOfWeekDate = firstDayOfYear.subtract(daysToSubtract, 'day').add(daysToAdd, 'day');
    return firstDayOfWeekDate;
  };

  // 使用趋势页hook
  const { searchFormValue, chartInfoList, loading, isRequestError, isEmptyData } = useTrendPage({
    defaultSearchFormValue: {
      orgCode: routeQuery?.orgCode || 'MQ',
      timeDimension: routeQuery?.timeDimension || TimeDimension.MONTH,
      startTime: routeQuery.date,
      endTime: routeQuery.date,
    },
    getRouteParams: (searchFormValue, dimension) => {
      const startDate = getFirstDayOfWeek(dimension);
      return {
        timeDimension: searchFormValue.timeDimension,
        startTime: startDate.format('YYYY-MM-DD'),
        endTime: dayjs(startDate).tz().add(6, 'day').format('YYYY-MM-DD'),
      };
    },
    pathInfo: {},
    chartQuotaInfoList,
    singleChartQuotaInfoList,
    requestMth: data =>
      getAttendancePercapitatrend(data).then(res => {
        const { data } = res;
        let list = data || [];
        if (data.list) {
          list = data.list;
        }
        list.forEach(item => {
          // 接口返回数据补全字段，用于 `useTrendPage` 生成趋势图的处理
          if (!item.Dimension && !item.KQDimension && !item.dimension) {
            item.Dimension = item.TimeDate;
          }
        });
        return Promise.resolve({ data: { list } });
      }),
    getParams,
  });
</script>

<style lang="less" scoped>
  @import url('/@/design/dashboard.less');
</style>
