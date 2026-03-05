<!-- 分布明细表格 -->
<template>
  <!-- 报表表格 -->
  <div class="w-[100%] h-[60vh] overflow-hidden vxe-table">
    <BaseVxeTable @register="register" />
  </div>
</template>

<script lang="ts" setup>
  import { merge } from 'lodash-es';
  import { ref, reactive, computed, provide } from 'vue';
  import { getAllColumns } from '/@/views/dashboard/customerService/scrollComparison/config';
  import { useBaseVxeTable } from '/@/views/dashboard/commonComponents/BaseVxeTable/useBaseVxeTable';
  import { getfcrollvschangedetaillist } from '/@/api/dashbord/fc';
  import { removeWeekMonthYear, getMetricNameByDimension } from '/@/views/dashboard/customerService/utils';

  import BaseVxeTable from '/@/views/dashboard/commonComponents/BaseVxeTable/index.vue';
  import type { VxeGridProps } from 'vxe-table';
  import { EToolType } from '/@/views/dashboard/commonComponents/BaseVxeTable/types';

  const props = defineProps({
    searchParams: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
  });

  const searchParams = computed(() => {
    return props.searchParams;
  });

  const attrs = reactive<VxeGridProps<any>>({});
  const columns = ref(getAllColumns());

  provide('getExportFilename', () => {
    const { dimension, timeIndex } = searchParams.value;
    const metricName = getMetricNameByDimension({ dimension, value: timeIndex });
    const filename = `滚动对比-${metricName}`;
    return filename;
  });
  const [register] = useBaseVxeTable({
    tools: [EToolType.EXPORT],
    immediateQuery: true,
    searchFormValue: searchParams,
    columns,
    attrs,
    getParams: () => {
      return searchParams.value;
    },
    api: getfcrollvschangedetaillist,
    afterQuery: (res: any) => {
      const { list = [] } = (res.data as any) ?? {};
      const dataList = removeWeekMonthYear(list);
      const currentWeek = dataList[0].Current;
      columns.value = getAllColumns({ currentWeek });
      return merge(res, {
        data: {
          list: dataList,
        },
      });
    },
  });
</script>
