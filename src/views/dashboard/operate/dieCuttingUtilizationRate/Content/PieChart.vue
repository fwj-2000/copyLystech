<!-- 稼动率柱形图 -->
<template>
  <div class="absolute top-0 left-0 z-2 flex justify-between flex-center pt-6px text-[15px] font-bold">
    <div>
      停机原因分析
      <a-select ref="select" v-model:value="sectionVal" style="min-width: 94px; text-align: left" size="small">
        <a-select-option v-for="option in sectionValOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </a-select-option>
      </a-select>
    </div>
    <a-button type="primary" size="small" class="ml-6px" ghost @click="exportToExcel">
      <span class="text-11px">导出数据</span>
    </a-button>
  </div>
  <div class="w-[100%] h-[100%] flex-1">
    <!-- 数据为空展示 -->
    <emptyData v-if="isEmptyData" style="min-height: auto !important"></emptyData>
    <div v-else class="w-[100%] h-[100%] flex center">
      <!-- 分析表格 -->
      <div class="w-[calc(100%-440px)]" style="height: calc(100% - 60px); margin-top: 20px">
        <BaseVxeTable
          ref="tableRef"
          v-bind="{
            dataSource: dataSourceFormat,
            showColumns: columns,
            allColumnsOptions,
          }"></BaseVxeTable
      ></div>
      <Chart :options="options" height="100%" style="height: 100%; width: 440px" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch, inject, computed } from 'vue';
  import { merge, cloneDeep, isEmpty } from 'lodash-es';
  import { sectionValOptions, ringPieOptions, columns, allColumnsOptions } from './config';

  import BaseVxeTable from '/@/views/dashboard/operate/components/BaseVxeTable/index.vue';
  import { Chart } from '/@/components/Chart';
  import emptyData from '/@/views/dashboard/operate/components/emptyData.vue';
  import type { EChartsOption } from 'echarts';
  import { getDiecututilizationanalyssection } from '/@/api/dashbord/report';
  import { saveVxeTableDatasToExcelByExceljs } from '/@/utils/file/download';

  const getParams = inject('getParams', () => ({}));

  interface IProps {
    metricKey: string;
    dataInfo: Record<string, any>[];
  }
  const props = withDefaults(defineProps<IProps>(), {
    metricKey: '综合',
  });
  const tableRef = ref<InstanceType<typeof BaseVxeTable>>();
  const options = ref<EChartsOption>({});
  const sectionVal = ref<string>('');
  const isEmptyData = ref(false);
  const dataSource = ref<Record<string, any>[]>([]);

  const dataSourceFormat = computed(() => {
    const sum = dataSource.value.reduce((prev, next) => prev + next.values, 0);
    return dataSource.value.map(item => ({
      ...item,
      rate: (item.values / sum) * 100,
    }));
  });

  const exportToExcel = () => {
    const params = getParams();
    const { startDim = '', endDim = '' } = params as any;
    const tableList = tableRef.value?.gridRef?.getData();
    const sectionLabel = (sectionValOptions.find(item => item.value === sectionVal.value) || { label: '' }).label;
    saveVxeTableDatasToExcelByExceljs({
      columns: tableRef.value?.columns,
      tableList,
      fileName: `${props.metricKey}${sectionLabel}停机原因分析${startDim}-${endDim}`,
    });
  };

  const setChartOptions = data => {
    const seriesData = data
      .filter(item => item.keys)
      .map(item => ({
        value: item.values,
        name: item.keys,
      }));
    if (isEmpty(seriesData)) {
      isEmptyData.value = true;
      return;
    }
    const handleOptions = {
      series: [
        {
          data: seriesData,
        },
      ],
    };
    options.value = merge(cloneDeep(ringPieOptions), handleOptions);
  };

  watch(
    () => sectionVal.value,
    () => {
      // 获取新的数据
      getDiecututilizationanalyssection({
        ...getParams(),
        metricKey: props.metricKey,
        sectionVal: sectionVal.value,
      }).then(res => {
        dataSource.value = res.data;
        setChartOptions(res.data);
      });
    },
    { immediate: false },
  );
  // 监听组件数据变化，重绘图表
  watch(
    () => props.dataInfo,
    () => {
      dataSource.value = props.dataInfo;
      setChartOptions(props.dataInfo);
    },
    { deep: true, immediate: true },
  );
</script>
