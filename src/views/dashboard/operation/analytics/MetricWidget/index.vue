<!-- 指标组件（包含表格和趋势 -->
<template>
  <div>
    <TableWidget
      v-bind="{
        dataList,
        currentYear,
        lastYear,
      }" />
    <!-- 趋势 -->
    <MetricTrend
      class="mt-12px"
      v-bind="{
        dataList,
        weekList,
        currentYear,
        lastYear,
      }" />
  </div>
</template>

<script lang="ts" setup>
  import dayjs, { Dayjs } from 'dayjs';
  import { computed, ref, watch, inject } from 'vue';
  import { getDatacollection } from '/@/api/dashbord/report';

  import TableWidget from './TableWidget.vue';
  import MetricTrend from './MetricTrend.vue';

  interface IProps {
    searchFormValue: Record<string, any>;
  }
  const props = withDefaults(defineProps<IProps>(), {});
  const getCommonParams = inject('getCommonParams', () => ({}));

  const emits = defineEmits(['update:metricKeyList']);

  const dataList = ref<any[]>([]);

  const currentYear = computed(() => {
    return dayjs(props.searchFormValue.dateRange[0]).tz().format('YYYY');
  });
  const lastYear = computed(() => {
    return dayjs(props.searchFormValue.dateRange[0]).tz().subtract(1, 'year').format('YYYY');
  });
  const weekList = computed(() => {
    const startDate = props.searchFormValue.dateRange[0] as Dayjs;
    const endDate = props.searchFormValue.dateRange[1] as Dayjs;
    const diffWeeks = endDate.endOf('week').diff(startDate.startOf('week'), 'week');
    return Array.from({ length: diffWeeks + 1 }).map((_, idx) => {
      const res = `WK${startDate.add(idx, 'week').week()}`;
      return res;
    });
  });

  watch(
    () => props.searchFormValue,
    () => {
      // 重新查询数据
      const params = getCommonParams();
      getDatacollection(params).then(res => {
        const { data } = res;
        dataList.value = data.list;
        // 更新指标的key值列表
        emits(
          'update:metricKeyList',
          data.list.map(item => ({
            field: item.field,
            name: item.metric,
          })),
        );
      });
    },
    { deep: true, immediate: true },
  );
</script>
