<!-- 四阶明细页 -->
<template>
  <div class="min-h-40vh">
    <BaseVxeTable
      v-bind="{
        dataSource: dataSource,
        showColumns: columns,
        allColumnsOptions: allDetailColumnsOptions,
      }" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, inject, watch } from 'vue';
  import { omit } from 'lodash-es';
  import { getDiecututilizationanalysdetail } from '/@/api/dashbord/report';
  import XEUtils from 'xe-utils';
  import BaseVxeTable from '/@/views/dashboard/operate/components/BaseVxeTable/index.vue';

  const props = withDefaults(
    defineProps<{
      queryInfo: any; // 弹窗组件默认传递的查询条件
    }>(),
    {
      queryInfo: {},
    },
  );

  const getParams = inject('getParams', () => ({}));
  const getDimensionTypeOptions = inject('getDimensionTypeOptions', () => []);
  const params = getParams();
  const dimensionTypeOptions: any[] = getDimensionTypeOptions();
  const dataSource = ref<any[]>([]);
  const allDetailColumnsOptions = {
    factory: {
      title: '厂区',
      width: 120,
      align: 'center',
      filterMultiple: true,
    },
    weeks: {
      title: '周数',
      width: 120,
      align: 'center',
      filterMultiple: true,
    },
    flocAtion: {
      title: '车间',
      width: 120,
      align: 'center',
      filterMultiple: true,
    },
    machineNo: {
      title: '机台号',
      width: 120,
      align: 'center',
      filterMultiple: true,
    },
    isnpi: {
      title: '是否Npi',
      width: 120,
      align: 'center',
      filterMultiple: true,
      formatter({ cellValue }) {
        return cellValue == 'true' ? '是' : '否'; // 必须用==
      },
    },
    isnud: {
      title: '是否Nud',
      width: 120,
      align: 'center',
      filterMultiple: true,
      formatter({ cellValue }) {
        return cellValue == 'true' ? '是' : '否';
      },
    },
    reason: {
      title: '原因分析',
      width: 120,
      align: 'center',
      filterMultiple: true,
    },
    entDate: {
      title: '生产日期',
      width: 120,
      align: 'center',
      filterMultiple: true,
    },
    fplanNumber: {
      title: '计划编号',
      width: 180,
      align: 'center',
      filterMultiple: true,
    },
    fmanuOrder: {
      title: '工单',
      width: 120,
      align: 'center',
      filterMultiple: true,
    },
    machineType: {
      title: '机台类型',
      width: 120,
      align: 'center',
      filterMultiple: true,
    },
    fmrp: {
      title: 'MRP控制者',
      width: 120,
      align: 'center',
      filterMultiple: true,
    },
    runTime: {
      title: '运行时长',
      width: 120,
      align: 'center',
      filterMultiple: true,
    },
    downTimes: {
      title: '停机时长',
      width: 120,
      align: 'center',
      filterMultiple: true,
    },
    utilizationRate: {
      title: '稼动率%',
      width: 120,
      align: 'center',
      sortable: true,
      formatter({ cellValue }) {
        return `${XEUtils.toFixed(Number(cellValue), 2)}%`;
      },
    },
  };

  const columns = [
    {
      field: 'seq',
      type: 'seq',
      width: 70,
      align: 'center',
    },
    { field: 'weeks' },
    { field: 'factory' },
    { field: 'flocAtion' },
    { field: 'machineNo' },
    { field: 'isnpi' },
    { field: 'isnud' },
    { field: 'reason' },
    { field: 'entDate' },
    { field: 'fplanNumber' },
    { field: 'fmanuOrder' },
    { field: 'machineType' },
    { field: 'fmrp' },
    { field: 'runTime' },
    { field: 'downTimes' },
    { field: 'utilizationRate' },
  ];

  watch(
    [() => props.queryInfo, () => props.queryInfo.dimensionType],
    () => {
      // 获取四阶数据
      const dimensionType = props.queryInfo.dimensionType || [];
      const query = {
        ...dimensionType.reduce((pre, cur) => {
          const key = (dimensionTypeOptions.find(item => item.label === cur.keys) || { value: '' }).value;
          return { ...pre, [key]: cur.values };
        }, {}),
        ...omit(params, ['dimensionType']),
      };
      getDiecututilizationanalysdetail(query).then(res => {
        dataSource.value = res.data;
      });
    },
    {
      immediate: true,
      deep: true,
    },
  );
</script>
