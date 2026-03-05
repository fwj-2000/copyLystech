<template>
  <!--  <div class="lydc-content-wrapper">-->
  <!--    <div class="lydc-content-wrapper-center">-->
  <!--      <div class="lydc-content-wrapper-content" :v-loading="loading">-->
  <div class="">
    <div class="">
      <div class="" :v-loading="loading">
        <a-card style="border-radius: 8px 8px 0 0">
          <SearchForm @searchAction="handleSearch" />
          <a-row :gutter="10">
            <a-col :span="15">
              <ChartDisplay :options="options" />
            </a-col>
            <a-col :span="9">
              <ProductionTable :columns="productColumns" :data="productData" />
            </a-col>
          </a-row>
          <a-row :span="24">
            <div class="bottom-table">
              <a-tabs v-model:activeKey="activeKey">
                <a-tab-pane key="1" tab="时间稼动率">
                  <EfficiencyTable :columns="timeEfficiencyColumns" :data="timeEfficiencyData" />
                </a-tab-pane>
                <a-tab-pane key="2" tab="时间稼动明细" force-render>
                  <DetailTable :columns="detailColumns" :data="detailData" />
                </a-tab-pane>
              </a-tabs>
            </div>
          </a-row>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, onBeforeUnmount } from 'vue';
  import SearchForm from './components/searchForm.vue';
  import ChartDisplay from './components/chartDisplay.vue';
  import ProductionTable from './components/productTable.vue';
  import EfficiencyTable from './components/efficiencyTable.vue'
  import DetailTable from './components/detailTable.vue'

  const loading = ref<boolean>(true);
  const activeKey = ref<string>('1');

  const handleSearch = (e: any) => {
    // 子传父接收
    console.log(e);
  };

  const productColumns = [
    {
      title: '项目',
      dataIndex: 'name',
      align: 'center',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: '计划',
      dataIndex: 'age',
      align: 'center',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: '实际',
      dataIndex: 'address',
      align: 'center',
      sorter: (a, b) => a.age - b.age,
    },
  ];

  const productData = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
    {
      key: '4',
      name: 'Ben Kang',
      age: 15,
      address: 'Sidney No. 1 Lake Park',
    },
  ];

  const timeEfficiencyColumns = [
    {
      title: '项目',
      dataIndex: 'project',
      key: 'project',
      // align: 'center',
      sorter: (a, b) => a.averageRate - b.averageRate,
    },
    {
      title: '平均稽动率',
      dataIndex: 'averageRate',
      key: 'averageRate',
      // align: 'center',
      sorter: (a, b) => a.averageRate - b.averageRate,
    },
    {
      title: '0-30%',
      dataIndex: 'range1',
      key: 'range1',
      // align: 'center',
      sorter: (a, b) => a.averageRate - b.averageRate,
    },
    {
      title: '30-60%',
      dataIndex: 'range2',
      key: 'range2',
      // align: 'center',
      sorter: (a, b) => a.averageRate - b.averageRate,
    },
    {
      title: '60-80%',
      dataIndex: 'range3',
      key: 'range3',
      // align: 'center',
      sorter: (a, b) => a.averageRate - b.averageRate,
    },
    {
      title: '80%以上',
      dataIndex: 'range4',
      key: 'range4',
      // align: 'center',
      sorter: (a, b) => a.averageRate - b.averageRate,
    },
  ];

  const timeEfficiencyData = [
    {
      key: '1',
      project: 'NUD-NPI',
      subText: '区间计划数/总计划数',
      averageRate: '24.5%',
      detail: '2142/3481',
      range1: '24.5%',
      range2: '35%',
      range3: '65%',
      range4: '86%',
    },
    {
      key: '2',
      project: 'NUD-NPI',
      subText: '区间计划数/总计划数',
      averageRate: '24.5%',
      detail: '2142/3481',
      range1: '24.5%',
      range2: '35%',
      range3: '65%',
      range4: '86%',
    },
    {
      key: '3',
      project: 'NUD-NPI',
      subText: '区间计划数/总计划数',
      averageRate: '24.5%',
      detail: '2142/3481',
      range1: '24.5%',
      range2: '35%',
      range3: '65%',
      range4: '86%',
    },
    {
      key: '4',
      project: 'NUD-NPI',
      subText: '区间计划数/总计划数',
      averageRate: '24.5%',
      detail: '2142/3481',
      range1: '24.5%',
      range2: '35%',
      range3: '65%',
      range4: '86%',
    },
  ];

  const detailColumns = [
    { title: '厂区', dataIndex: 'factory', key: 'factory', width: 90, fixed: 'left' },
    { title: '机台', dataIndex: 'machine', key: 'machine', width: 60, fixed: 'left' },
    { title: 'NUD(专线)', dataIndex: 'nud', key: 'nud', width: 100, fixed: 'left' },
    { title: 'NPI', dataIndex: 'npi', key: 'npi', fixed: 'left', width: 100 },
    {
      title: '稼动率(%)',
      fixed: 'left',
      children: [
        { title: '2024WK14', dataIndex: 'wk14', key: 'wk14', width: 105 },
        { title: '2024WK15', dataIndex: 'wk15', key: 'wk15', width: 105 },
        { title: '2024WK16', dataIndex: 'wk16', key: 'wk16', width: 105 },
        { title: '2024WK17', dataIndex: 'wk17', key: 'wk17', width: 105 },
        { title: '2024WK18', dataIndex: 'wk18', key: 'wk18', width: 105 },
        { title: '2024WK19', dataIndex: 'wk19', key: 'wk19', width: 105 },
        { title: '2024WK16', dataIndex: 'wk16', key: 'wk16', width: 105 },
        { title: '2024WK17', dataIndex: 'wk17', key: 'wk17', width: 105 },
        { title: '2024WK18', dataIndex: 'wk18', key: 'wk18', width: 105 },
        { title: '2024WK19', dataIndex: 'wk19', key: 'wk19', width: 105 },
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
    { title: '停机时长(min)', dataIndex: 'downtime', key: 'downtime', fixed: 'right', width: 125 },
    { title: '未达标原因', dataIndex: 'reason', key: 'reason', fixed: 'right', width: 110 },
  ];

  const detailData = [
    {
      key: '1',
      factory: '平湖一厂',
      machine: 'AM01',
      nud: '是',
      npi: '是',
      wk14: '6.5',
      wk15: '21.0',
      wk16: '12.4',
      wk17: '16.9',
      wk18: '12.5',
      wk19: '12.5',
      total: '14.1',
      downtime: '123223.1',
      reason: '原因1',
    },
    {
      key: '2',
      factory: '平湖一厂',
      machine: 'AM01',
      nud: '是',
      npi: '是',
      wk14: '6.5',
      wk15: '21.0',
      wk16: '12.4',
      wk17: '16.9',
      wk18: '12.5',
      wk19: '12.5',
      total: '14.1',
      downtime: '123223.1',
      reason: '原因2',
    },
    {
      key: '3',
      factory: '平湖一厂',
      machine: 'AM01',
      nud: '是',
      npi: '是',
      wk14: '6.5',
      wk15: '21.0',
      wk16: '12.4',
      wk17: '16.9',
      wk18: '12.5',
      wk19: '12.5',
      total: '14.1',
      downtime: '123223.1',
      reason: '原因3',
    },
    {
      key: '4',
      factory: '平湖一厂',
      machine: 'AM01',
      nud: '是',
      npi: '是',
      wk14: '6.5',
      wk15: '21.0',
      wk16: '12.4',
      wk17: '16.9',
      wk18: '12.5',
      wk19: '12.5',
      total: '14.1',
      downtime: '123223.1',
      reason: '原因4',
    },
  ];

  const options = {
    title: {
      text: '时间稼动率趋势',
      textStyle: {
        fontSize: '14',
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      top: 30,
      left: 0,
      data: ['平湖一厂', '平湖二厂', '平湖三厂', '平湖五厂', '平湖六厂', '平湖七厂', '平湖九厂', '成都模切', '东台模切', '苏州模切', '郑州模切', '越南模切'],
      icon: 'roundRect',
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 10,
      itemStyle: {
        borderRadius: 5,
      },
      textStyle: {
        fontSize: 12,
        // 必须，不然会出宽度不一致的bug
        backgroundColor: 'transparent',
        width: 72,
      },
      verticalAlign: 'center',
    },
    grid: {
      left: 5,
      right: '5%',
      containLabel: true,
      top: 90,
      bottom: 40,
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
    yAxis: {
      type: 'value',
      max: 100,
      axisLabel: {
        formatter: '{value}%',
        color: 'rgba(140, 140, 140, 1)',
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
    series: [
      {
        name: '平湖一厂',
        type: 'line',
        data: [20, 70, 30, 50, 80, 70],
        color: '#EA651A',
        symbolSize: 6.5,
        smooth: true,
      },
      {
        name: '平湖二厂',
        type: 'line',
        data: [15, 25, 75, 55, 65, 75],
        color: '#EAAA2D',
        symbolSize: 6.5,
        smooth: true,
      },
      {
        name: '平湖三厂',
        type: 'line',
        data: [0, 30, 60, 0, 30, 80],
        color: '#D3CC1B',
        symbolSize: 6.5,
        smooth: true,
      },
      {
        name: '平湖五厂',
        type: 'line',
        data: [34, 21, 13, 25, 80, 85],
        color: '#A7EC16',
        symbolSize: 6.5,
        smooth: true,
      },
      {
        name: '平湖六厂',
        type: 'line',
        data: [10, 60, 25, 70, 85, 80],
        color: '#1CE949',
        symbolSize: 6.5,
        smooth: true,
      },
      {
        name: '平湖七厂',
        type: 'line',
        data: [20, 25, 30, 35, 40, 45],
        color: '#1EE4B5',
        smooth: true,
      },
      {
        name: '平湖九厂',
        type: 'line',
        data: [15, 20, 25, 30, 35, 40],
        color: '#18D5E1',
        smooth: true,
      },
      {
        name: '成都模切',
        type: 'line',
        data: [10, 35, 11, 22, 71, 91],
        color: '#1BA8E4',
        symbolSize: 6.5,
        smooth: true,
      },
      {
        name: '东台模切',
        type: 'line',
        data: [10, 15, 20, 25, 30, 40],
        color: '#1975E2',
        smooth: true,
      },
      {
        name: '苏州模切',
        type: 'line',
        data: [20, 25, 30, 35, 40, 50],
        color: '#1E4AE4',
        smooth: true,
      },
      {
        name: '郑州模切',
        type: 'line',
        data: [25, 30, 15, 20, 20, 10],
        color: '#741CE3',
        symbolSize: 6.5,
        smooth: true,
      },
      {
        name: '越南模切',
        type: 'line',
        data: [10, 15, 20, 25, 30, 35],
        color: '#9217DE',
        smooth: true,
      },
    ],
  };

  async function getOptions() {
    // const res = await baseStore.getDictionaryData('WorkFlowCategory');
    // getForm().updateSchema({ field: 'flowCategory', componentProps: { options: res } });
    // getFlowEngineList();
  }

  onMounted(() => {
    getOptions();
  });
</script>

<style lang="less" scoped>
  .bottom-table {
    width: 100%;
  }
</style>
