<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicForm @register="registerForm" @submit="handleSubmit" @reset="handleReset" />
      </div>
      <div class="lydc-content-wrapper-content bg-white" ref="manualRef">
        <!-- <div class="p-16px">
          <div class=".text-16px font-semibold">手工良率趋势</div>
          <div class="pt-10px">平湖一厂</div>
        </div> -->
        <div ref="chartRef" :style="{ height: `${state.chartHeight}px`, width }"></div>
        <div class="p-16px">
          <div class=".text-14px pb-12px font-semibold">手工良率明细表</div>
          <BasicTable @register="registerTable">
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key?.startsWith('wk')">
                <!-- <div @click="() => {console.log(column.key, index, record)}">=》</div> -->
                <span class="text-border" :key="index" v-if="isWeek" @click="openDetailModal(column, record, index)">
                  {{ record.projectName || '-' }}
                </span>
                <span>{{ record.projectName || '-' }}</span>
              </template>
            </template>
          </BasicTable>
        </div>
      </div>
    </div>
    <InfoModal :open="state.visible" :detailInfo="state.detailData" @close="close"></InfoModal>
  </div>
</template>
<script lang="ts">
  import { basicProps } from './props';
</script>
<script lang="ts" setup>
  import { reactive, ref, Ref, nextTick, onMounted, computed } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useECharts } from '/@/hooks/web/useECharts';
  import { BasicTable, BasicColumn, useTable } from '/@/components/Table';
  import { getTableList } from '/@/api/extend/table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useBaseStore } from '/@/store/modules/base';
  import InfoModal from './components/Modal.vue';
  import * as echarts from 'echarts';
  import {
    // fetchManualYield,
    fetchManualYieldWeekly,
  } from '/@/api/dashbord/production';

  defineOptions({ name: 'production-manualYield' });
  defineProps({ ...basicProps });

  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

  interface State {
    activeKey: string;
    keyword: string;
    startTime: number;
    endTime: number;
    industryTypeList: any[];
    visible: Boolean;
    detailData: any;
    chartHeight: number;
  }

  const state = reactive<State>({
    activeKey: '1',
    keyword: '',
    startTime: 0,
    endTime: 0,
    industryTypeList: [],
    visible: false,
    detailData: {},
    chartHeight: 0,
  });

  const { t } = useI18n();
  const baseStore = useBaseStore();
  const manualRef = ref(null) as any;

  const [registerForm, { getFieldsValue }] = useForm({
    baseColProps: { span: 5 },
    showActionButtonGroup: true,
    showAdvancedButton: false,
    compact: true,
    labelAlign: 'left',
    labelWidth: 60,
    schemas: [
      {
        field: 'orgCode',
        label: t('views.dashboard.production.manaulYield.factory'),
        labelWidth: 50,
        component: 'Select',
        componentProps: {
          placeholder: t('common.chooseText'),
          submitOnPressEnter: true,
        },
      },
      {
        field: 'SearchType',
        label: t('views.dashboard.production.manaulYield.timeDimension'),
        labelWidth: 80,
        component: 'Select',
        componentProps: {
          options: [
            { id: 'day', fullName: '天' },
            { id: 'week', fullName: '周' },
          ],
          placeholder: t('common.chooseText'),
          submitOnPressEnter: true,
        },
      },
      {
        field: 'Is985',
        label: '985',
        labelWidth: 60,
        component: 'Select',
        componentProps: {
          options: [
            { id: true, fullName: '是' },
            { id: false, fullName: '否' },
          ],
          placeholder: t('common.chooseText'),
          submitOnPressEnter: true,
        },
      },
      {
        field: 'pickerVal',
        label: t('views.dashboard.production.manaulYield.selectTime'),
        labelWidth: 70,
        component: 'DateRange',
      },
    ],
    fieldMapToTime: [['pickerVal', ['startTime', 'endTime']]],
  });

  const isWeek = computed(() => {
    const values = getFieldsValue();
    return !(values?.timeRange == 1);
  });

  onMounted(() => {
    init();
    setOptions({
      title: {
        text: '手工良率趋势',
        left: 12,
        top: 12,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          lineStyle: {
            width: 1,
            color: '#ff7b00',
          },
        },
      },
      dataZoom: [
        {
          type: 'inside',
        },
        {
          type: 'slider',
          dataBackground: {
            areaStyle: {
              color: 'rgba(0,0,0,0.03)',
            },
          },
          selectedDataBackground: {
            areaStyle: {
              color: 'rgba(0,0,0,0.1)',
            },
            lineStyle: {
              color: 'rgba(0,0,0,0.1)',
            },
          },
          borderColor: '#FFF',
          fillerColor: 'rgba(33,33,33, 0.01)',
          moveHandleStyle: {
            opacity: 0,
          },
          handleIcon:
            'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEISURBVHgB7ZfNDYJAEIWHpQCWnwI8kXDTSmxBO9BO6IAWtBL1RMLJO//cAWcxHhQTngkJMdmXbLKZfZlvH1xmiRaSgRrjOF4ZhhEJIdZ938vPc66deB2DILgj/SCwgpqmebFtWzqOQwx/O++6juq6pjRNK95vELggQJw09DxP8hpBhyZc40uR67qSLxghPVHw1rKsSZ+UUn3yNQGCwINRTFs57cAnQDD4pSRJoNrs4LmkwRqswRqswRqswX8I9n0fqs0C5mFPja2TvrZtCRWa+FqW5aSpaRo1ZZ4JEATmJPuiKCoF/5Zc1fI8pyzLKgYfkJ4/PWF4xA15ux01ef6KG0N36BNmMT0A12ZlPEm02ecAAAAASUVORK5CYII=',
          handleStyle: {
            borderWidth: 0,
          },
        },
      ],
      xAxis: {
        type: 'category',
        data: ['2024WK14', '2024WK15', '2024WK16', '2024WK17', '2024WK18', '2024WK19'],
        axisLine: {
          lineStyle: {
            color: 'rgba(217, 217, 217, 1)',
          },
        },
        axisLabel: {
          color: 'rgba(140, 140, 140, 1)',
        },
      },
      yAxis: [
        {
          type: 'value',
          max: 100,
          axisLabel: {
            formatter: '{value} %',
          },
          splitNumber: 5,
          axisTick: {
            show: false,
          },
          splitArea: {
            show: true,
            areaStyle: {
              color: ['#fff', '#fff'],
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed', // 设置为虚线
              color: '#ccc', // 可以自定义虚线的颜色
              width: 1, // 可以自定义虚线的宽度
            },
          },
        },
      ],
      grid: { left: 20, right: '2%', top: 80, bottom: 50, containLabel: true },
      series: [
        {
          name: '平湖一厂',
          smooth: true,
          data: [33, 45, 98, 75, 88, 36, 66, 59],
          type: 'line',
          areaStyle: {
            opacity: 0.3,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#ff7b00',
              },
              {
                offset: 1,
                color: '#fff',
              },
            ]),
          },
          color: '#ff7b00',
          label: {
            show: true, // 显示标签
            position: 'top', // 标签位置
            offset: [0, -4],
            formatter: option => `${option.value || 0}%`, // 标签格式器，{c} 表示数据值
            // formatter: '{c}%' // 标签格式器，{c} 表示数据值
          },
        },
      ],
      legend: {
        top: 45,
        left: 16,
        data: ['平湖一厂'],
        icon: 'roundRect',
        itemWidth: 8,
        itemHeight: 8,
        itemGap: 10,
        itemStyle: {},
        textStyle: {
          fontSize: 12,
          // 必须，不然会出宽度不一致的bug
          backgroundColor: 'transparent',
          width: 72,
        },
      },
    });
  });

  const columns: BasicColumn[] = [
    { title: t('views.dashboard.production.manaulYield.factory'), dataIndex: 'projectName', fixed: 'left', sorter: true, width: 200 },
    { title: t('views.dashboard.production.manaulYield.materialNumber'), dataIndex: 'projectCode', fixed: 'left', sorter: true, width: 160 },
    {
      title: '985项目',
      dataIndex: 'projectType',
      fixed: 'left',
      width: 120,
      customRender: ({ record }) => {
        let item = state.industryTypeList.filter(o => o.id == record.projectType)[0];
        return item && item.fullName ? item.fullName : '';
      },
    },
    {
      title: '稼动率(%)',
      align: 'center',
      children: [
        { title: '2024WK14', dataIndex: 'wk14', key: 'wk14', width: 105 },
        { title: '2024WK15', dataIndex: 'wk15', key: 'wk15', width: 105 },
        { title: '2024WK16', dataIndex: 'wk16', key: 'wk16', width: 105 },
        { title: '2024WK17', dataIndex: 'wk17', key: 'wk17', width: 105 },
        { title: '2024WK18', dataIndex: 'wk18', key: 'wk18', width: 105 },
        { title: '2024WK19', dataIndex: 'wk19', key: 'wk19', width: 105 },
      ],
    },
    {
      title: 'Total(%)',
      dataIndex: 'total',
      key: 'total',
      fixed: 'right',
      className: 'shadow-end',
      width: 85,
    },
    { title: '不良品数(PCS)', dataIndex: 'downtime', key: 'downtime', fixed: 'right', width: 125 },
    { title: '未达标原因', dataIndex: 'reason', key: 'reason', fixed: 'right', width: 110 },
  ];
  const [registerTable, { reload }] = useTable({
    api: getTableList,
    columns,
    useSearchForm: false,
    showTableSetting: false,
    bordered: true,
    pagination: false,
    striped: true,
    formConfig: {
      schemas: [
        {
          field: 'keyword',
          label: t('common.keyword'),
          component: 'Input',
          componentProps: {
            placeholder: t('common.enterKeyword'),
            submitOnPressEnter: true,
          },
        },
      ],
    },
    transformCellText: ({ text }) => {
      if (`${text}` == 'null' || `${text}` == 'undefined') return '-';
      return text.length || typeof text === 'number' ? text : ['-'];
    },
  });

  function handleSubmit(values) {
    state.keyword = values?.keyword || '';
    state.startTime = values?.startTime || 0;
    state.endTime = values?.endTime || 0;
    handleSearch();
  }
  function handleReset() {
    state.keyword = '';
    state.startTime = 0;
    state.endTime = 0;
    handleSearch();
  }
  function handleSearch() {
    nextTick(() => {
      reload();
      console.log('handleSearch');
    });
  }
  async function init() {
    state.industryTypeList = (await baseStore.getDictionaryData('IndustryType')) as any[];
    nextTick(() => {
      const height = (manualRef.value?.offsetHeight || 700) / 2;
      state.chartHeight = height > 200 ? height : 200;
    });
  }
  async function getCompletionYieldWeekly(params = {}) {
    const rs = await fetchManualYieldWeekly(params);
    return rs;
  }
  async function openDetailModal(column, record, index) {
    const rs = await getCompletionYieldWeekly();
    console.log(rs, 'rs');
    console.log(column, record, index, 'column, record, index');
    state.visible = true;
    state.detailData = record;
    console.log(state, 'state.detailData');
  }
  function close() {
    state.visible = false;
  }
</script>

<style lang="less" scoped>
  .text-border {
    border-bottom: 1px solid #333;
    cursor: pointer;
  }
</style>
