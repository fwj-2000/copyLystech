<!-- 运营报表 -->
<template>
  <a-card :v-loading="loading" style="height: 86vh">
    <SearchForm @searchAction="handleSearch"/>
    <a-row :gutter="10"  style="margin-top: 20px">
      <a-col :span="7">
        <PieChart :options="pieOptions" />
      </a-col>

      <a-col :span="17">
        <CategoryChart :options="categoryOptions" />
      </a-col>
    </a-row>
    <Table :data="dataSource" :columns="columns" />
  </a-card>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref, UnwrapRef } from 'vue';
  import SearchForm from "./components/searchForm.vue"
  import PieChart from './components/pieChart.vue'
  import CategoryChart from './components/categoryChart.vue'
  import Table from './components/table.vue'

  const loading = ref<boolean>(true);

  const handleSearch = (e: any) => {
    // 子传父接收
    console.log(e);
  };

  const columns = [
    {
      title: '厂区',
      dataIndex: 'factory',
      key: 'factory',
    },
    {
      title: '机台',
      dataIndex: 'machine',
      key: 'machine',
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '班次',
      dataIndex: 'shift',
      key: 'shift',
    },
    {
      title: '工单',
      dataIndex: 'workOrder',
      key: 'workOrder',
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'MUD(专线)',
      dataIndex: 'mud',
      key: 'mud',
    },
    {
      title: 'NPI',
      dataIndex: 'npi',
      key: 'npi',
    },
    {
      title: '计划运行',
      dataIndex: 'plannedRun',
      key: 'plannedRun',
    },
    {
      title: '实际运行',
      dataIndex: 'actualRun',
      key: 'actualRun',
    },
    {
      title: '计划调机',
      dataIndex: 'plannedAdjustment',
      key: 'plannedAdjustment',
    },
  ]

  const dataSource = [
    {
      key: '1',
      factory: '1',
      machine: 'IPEF',
      date: 'IPEF',
      shift: 'IPEF',
      workOrder: 'D9X-1P',
      productName: 'D9X-1P',
      mud: 'D9X-1P',
      npi: 'D9X-1P',
      plannedRun: 'D9X-1P',
      actualRun: 'D9X-1P',
      plannedAdjustment: 'D9X-1P',
    },
    {
      key: '2',
      factory: '1',
      machine: 'IPEF',
      date: 'IPEF',
      shift: 'IPEF',
      workOrder: 'D9X-1P',
      productName: 'D9X-1P',
      mud: 'D9X-1P',
      npi: 'D9X-1P',
      plannedRun: 'D9X-1P',
      actualRun: 'D9X-1P',
      plannedAdjustment: 'D9X-1P',
    },
    {
      key: '3',
      factory: '1',
      machine: 'IPEF',
      date: 'IPEF',
      shift: 'IPEF',
      workOrder: 'D9X-1P',
      productName: 'D9X-1P',
      mud: 'D9X-1P',
      npi: 'D9X-1P',
      plannedRun: 'D9X-1P',
      actualRun: 'D9X-1P',
      plannedAdjustment: 'D9X-1P',
    },
    {
      key: '4',
      factory: '1',
      machine: 'IPEF',
      date: 'IPEF',
      shift: 'IPEF',
      workOrder: 'D9X-1P',
      productName: 'D9X-1P',
      mud: 'D9X-1P',
      npi: 'D9X-1P',
      plannedRun: 'D9X-1P',
      actualRun: 'D9X-1P',
      plannedAdjustment: 'D9X-1P',
    },
  ]

  const pieOptions = {
    title: {
      text: '停机占比',
      left: 0,
      // top: -10,
    },
    // top: -120,
    grid: {
      // left: 28,
      // bottom: 40,
      // right: 48,
      // top: 60,
    },

    legend: {
      show: true,
      orient: 'vertical',
      left: 0,
      top: 'center',
      height: '60%',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 14, // 设置图例项之间的间隔
      icon: 'roundRect',
      itemStyle: {
        borderRadius: 5,
      },
      // data: [
      //   '设备维修', '用餐休息', '品质异常', '中途休息', '自动化调机', '其他停机', '换模具', '未知原因',
      //   '待料', '异常停机', '待首件', '短时停机', '换班', '换料', '等待停机', '模切调机'
      // ]
    },
    tooltip: {
      // trigger: 'item',
      show: true,
      align: 'center',
      type: 'scroll',
      padding: [5, 12, 5, 18],
    },
    color: [
      '#E9183E',
      '#E31B63',
      '#DE1C9C',
      '#DC18E0',
      '#9217DE',
      '#741CE3',
      '#1E4AE4',
      '#1BA8E4',
      '#18D5E1',
      '#1EE4B5',
      '#1CE949',
      '#A7EC16',
      '#E4DC1D',
      '#EAAA2D',
      '#EA651A',
      '#477bff',
      '#c7d7ff',
      '#47d1cb',
      '#c7f1ef',
      '#6f47ff',
      '#d3c7ff',
      '#ffcb47',
      '#ff477b',
      '#ffc7d7',
      '#59dbff',
      '#cdf4ff',
      '#cb47ff',
      '#efc7ff',
      '#ff884d',
      '#ffdbc9',
      '#00897b',
      '#b2dbd7',
      '#ff8ccb',
      '#ffdcef',
    ],
    dataZoom: {
      bottom: 8,
      height: 20,
      show: false,
    },
    series: [
      {
        name: '',
        type: 'pie',
        roseType: 'area',
        radius: ['1%', '80%'],
        center: ['50%', '60%'],
        right: -150,
        label: {
          show: false,
        },
        data: [
          { value: 1, name: '用餐休息' },
          { value: 1, name: '品质异常' },
          { value: 1, name: '中途休息' },
          { value: 2, name: '自动化调机' },
          { value: 2, name: '其他停机' },
          { value: 3, name: '换模具' },
          { value: 4, name: '未知原因' },
          { value: 5, name: '待料' },
          { value: 10, name: '异常停机' },
          { value: 10, name: '待首件' },
          { value: 10, name: '短时停机' },
          { value: 11, name: '换班' },
          { value: 11, name: '换料' },
          { value: 13, name: '等待停机' },
          { value: 13, name: '模切调机' },
        ],
      },
    ],
  };

  const categoryOptions = {
    title: {
      text: '停机时长(min)',
      left: 'left',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // Use axis to trigger tooltip
        type: 'shadow', // 'shadow' as default; can also be 'line' or 'shadow'
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#F0F0F0'
          }
        },
        axisLabel: {
          color: '#8C8C8C'
        },
        alignTicks: true,
        // splitLine: {
        //   show: true
        // },
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        },
      }
    ],
    //  yAxis.splitLine.lineStyle. type = 'solid'
    yAxis: {
      type: 'category',
      axisLabel: {
        color: 'rgba(0,0,0,0.6)'
      },
      axisLine: {
        lineStyle: {
          color: '#D9D9D9',
        },
      },

      data: [
        '模切调机',
        '换料',
        '短暂停机',
        '异常停机',
        '未知原因',
        '其他停机',
        '中途休息',
        '用餐休息',
        '等待停机',
        '换班',
        '待首件',
        '待料',
        '换模具',
        '自动化调机',
        '质量异常',
        '设备维修',
      ],
    },
    // color: ['#EA651A', '#E7A11A', '#DCD41C', '#A7EC16', '#1CE949'],
    series: [
      {
        type: 'bar',
        data: [
          {
            value: 5000,
            itemStyle: {
              color: '#fde9d3',
              borderRadius: [0, 20, 20, 0]
            },
          },
          {
            value: 7000,
            itemStyle: {
              color: '#fde5ca',
              borderRadius: [0, 20, 20, 0]
            },
          },
          {
            value: 9000,
            itemStyle: {
              color: '#fde0c0',
              borderRadius: [0, 20, 20, 0]
            },
          },
          {
            value: 11000,
            itemStyle: {
              color: '#fddcb7',
              borderRadius: [0, 20, 20, 0]
            },
          },
          {
            value: 13000,
            itemStyle: {
              color: '#fdd8af',
              borderRadius: [0, 20, 20, 0]
            },
          },
          {
            value: 15000,
            itemStyle: {
              color: '#fdd3a4',
              borderRadius: [0, 20, 20, 0]
            },
          },
          {
            value: 17000,
            itemStyle: {
              color: '#fecf9b',
              borderRadius: [0, 20, 20, 0]
            },
          },
          {
            value: 18000,
            itemStyle: {
              color: '#fecf9b',
              borderRadius: [0, 20, 20, 0]
            },
          },
          {
            value: 20000,
            itemStyle: {
              color: '#fecc95',
              borderRadius: [0, 20, 20, 0]
            },
          },
          {
            value: 21000,
            itemStyle: {
              color: '#fec78c',
              borderRadius: [0, 20, 20, 0]
            },
          },
          {
            value: 23000,
            itemStyle: {
              color: '#fec381',
              borderRadius: [0, 20, 20, 0]
            },
          },
          {
            value: 25000,
            itemStyle: {
              color: '#febe77',
              borderRadius: [0, 20, 20, 0]
            },
          },
          {
            value: 27000,
            itemStyle: {
              color: '#ffb666',
              borderRadius: [0, 20, 20, 0]
            },
          },
          {
            value: 30000,
            itemStyle: {
              color: '#feb15c',
              borderRadius: [0, 20, 20, 0]
            },
          },
          {
            value: 35000,
            itemStyle: {
              color: '#ffad54',
              borderRadius: [0, 20, 20, 0]
            },
          },
          {
            value: 40000,
            itemStyle: {
              color: '#ffa849',
              borderRadius: [0, 20, 20, 0]
            },
          },

        ],
      },
    ],
  };

</script>

<style lang="less" scoped>

</style>
