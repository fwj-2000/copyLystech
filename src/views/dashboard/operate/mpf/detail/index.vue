<!-- 损益趋势详情页 -->
<template>
  <div class="dashboard-page-container">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header">
      <SearchForm
        v-bind="{
          searchFormValue,
          isRangePicker: true,
          showOrganizeTreeSelect: true,
          showTimeDimension: false,
        }">
        <template #right>
          <a-select
            style="width: 550px"
            v-if="isSbuLevel"
            v-model:value="groupName"
            :options="groupOptions"
            mode="multiple"
            :max-tag-count="2"
            :allowClear="true"></a-select>
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
          <a-col v-for="(chart, idx) in chartInfoListCache" :key="idx" :xs="24" :xl="24">
            <BaseChart :info="chart.info"></BaseChart>
          </a-col>
        </a-row>
      </SpinContent>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, nextTick } from 'vue';
  import dayjs from 'dayjs';
  import { useTrendPage, ChartQuotaInfo } from '/@/views/dashboard/operate/hooks/useTrendPage';
  import { getPerformancetrend } from '/@/api/dashbord/report';
  import BaseChart from '/@/views/dashboard/operate/components/BaseChart/index.vue';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import { TimeDimension } from '../../types';
  import { useRouteQuery } from '/@/views/dashboard/operate/hooks/useRouteQuery';
  import type { SelectProps } from 'ant-design-vue';

  defineOptions({ name: 'dashboard-operate-mpf-detail' });

  /** --- 1. 状态定义 --- */
  const { routeQuery } = useRouteQuery();
  const groupName = ref<string[]>([]); // 选中的小组名
  const groupOptions = ref<SelectProps['options']>([]); // 下拉框选项
  const isSbuLevel = computed(() => searchFormValue.orgCode?.length === 9); // 是否为最底层工厂

  // 新增：切换状态锁
  const isSwapping = ref(false);
  /** --- 2. 配置项 (静态配置抽离，增强可读性) --- */
  const chartQuotaConfig: ChartQuotaInfo[] = [
    { quotaKey: 'oaZb', subTitle: 'OA工时占比', suffix: '%' },
    { quotaKey: 'scoreZb', subTitle: '间接分占比', suffix: '%' },
  ];

  const singleChartConfig = [
    { showKeysLengend: true, subTitle: 'OA工时占比', lineKeys: [{ key: 'oaZb', title: 'OA工时占比', color: '#FCBE3B', position: 'top', suffix: '%' }] },
    { showKeysLengend: true, subTitle: '间接分占比', lineKeys: [{ key: 'scoreZb', color: '#FF7B00', title: '间接分占比', suffix: '%' }] },
  ];

  /** --- 3. 核心 Hook 初始化 --- */
  const { searchFormValue, chartInfoList, loading, isRequestError, isEmptyData } = useTrendPage({
    defaultSearchFormValue: {
      orgCode: routeQuery?.orgCode || 'MQ',
      timeDimension: TimeDimension.MONTH,
      dateRange: [dayjs().startOf('month').subtract(6, 'month'), dayjs().endOf('month')],
    },
    chartQuotaInfoList: chartQuotaConfig,
    singleChartQuotaInfoList: singleChartConfig,
    isSpecailSyncSign: true,

    // 数据请求逻辑
    requestMth: async params => {
      // 在请求发起时，确保锁是开启的
      isSwapping.value = true;
      const { orgCode, startDim, endDim } = params;
      const query = {
        orgCode,
        startDim,
        endDim,
        types: isSbuLevel.value ? '2' : undefined,
      };

      const res = await getPerformancetrend(query);
      if (res.code === 200 && res.data) {
        updateGroupSelector(res.data);
      }
      // 请求结束，并等待 DOM 和响应式完成更新后解锁
      nextTick(() => {
        isSwapping.value = false;
      });
      return res;
    },
  });

  /** --- 4. 辅助逻辑函数 (让主逻辑更清晰) --- */

  // 更新下拉框选项并设置默认值
  const updateGroupSelector = (data: any[]) => {
    const uniqueNames = [...new Set(data.map(i => i.groupName))];

    groupOptions.value = uniqueNames.map(name => ({ label: name, value: name }));

    // 如果当前没选中任何组（比如刚切换工厂），默认勾选第一个
    if (groupName.value.length === 0 && uniqueNames.length > 0) {
      groupName.value = [uniqueNames[0]];
    }
  };

  /** --- 5. 计算属性：处理图表显示的最终数据 --- */
  const chartInfoListCache = computed(() => {
    // 1. 双重保险拦截：
    // loading 拦截接口响应过程
    // isSwapping 拦截同步逻辑切换过程
    if (loading.value || isSwapping.value) return [];

    const rawList = chartInfoList.value || [];

    // 如果列表里的 orgCode 和当前搜索框的 orgCode 不一致，坚决不渲染
    // 这是防止接口数据“由于闭包残留”导致的旧数据闪烁（根据你的 API 返回结构决定是否能用）
    // if (rawList.length > 0 && rawList[0].OrgCode !== searchFormValue.orgCode) return [];

    return rawList.map(chartItem => {
      const seriesData = chartItem.info?.options?.series;
      if (!seriesData) return chartItem;

      const processedSeries = seriesData.map(series => {
        const isSelected = groupName.value.includes(series.name);
        // 如果是底层但还没选好 groupName，为了不闪烁全部，先让数据为空
        const hasEffectiveSelection = groupName.value.length > 0;
        const shouldShow = !isSbuLevel.value || (!hasEffectiveSelection ? false : isSelected);

        return {
          ...series,
          data: shouldShow ? series.data : [],
          // 降低或关闭动画，减少旧线消失的视觉残留
          animationDuration: 100,
        };
      });

      return {
        ...chartItem,
        info: {
          ...chartItem.info,
          options: {
            ...chartItem.info.options,
            series: processedSeries,
            replaceMerge: ['series'],
          },
        },
      };
    });
  });

  /** --- 监听器 --- */
  watch(
    () => searchFormValue.orgCode,
    () => {
      // 切换瞬间：立即开启锁，并清理筛选
      isSwapping.value = true;
      groupName.value = [];
      groupOptions.value = [];
    },
    { immediate: true },
  );
</script>

<style lang="less" scoped>
  @import url('../../../../../design/dashboard.less');
</style>
