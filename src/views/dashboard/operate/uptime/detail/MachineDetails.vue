<!-- 人员出勤明细 -->
<template>
  <a-card class="common-content-wrapper">
    <!-- 表单筛选条件 -->
    <a-form ref="formRef" class="search-wrapper flex ct-between" :model="searchFormValue">
      <div class="flex ct-start">
        <a-form-item name="orgCode">
          <a-select style="width: 184px; text-align: left" v-model:value="searchFormValue.orgCode">
            <a-select-option v-for="(item, idx) in ORG_CODE_OPTIONS" :key="idx" :value="item.value"> {{ item?.label || item.value }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="date">
          <a-date-picker v-model:value="searchFormValue.queryTime"></a-date-picker>
        </a-form-item>
        <a-form-item name="type">
          <a-select style="width: 84px; text-align: left" v-model:value="searchFormValue.type">
            <a-select-option v-for="(item, idx) in TYPE_OPTIONS" :key="idx" :value="item.value"> {{ item?.label || item.value }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="status">
          <a-select style="width: 84px; text-align: left" v-model:value="searchFormValue.status">
            <a-select-option v-for="(item, idx) in STATUS_OPTIONS" :key="idx" :value="item.value"> {{ item?.label || item.value }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="isonline">
          <a-select style="width: 84px; text-align: left" v-model:value="searchFormValue.isonline">
            <a-select-option v-for="(item, idx) in IS_ONLINE_OPTIONS" :key="idx" :value="item.value"> {{ item?.label || item.value }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input v-model:value="searchFormValue.keyword" placeholder="请输入关键字查询" />
        </a-form-item>
      </div>
      <a-button type="primary" :loading="exportLoading" ghost @click="exportToExcel">下载明细</a-button>
    </a-form>
    <!-- 数据占比 -->
    <div class="w-[100%] h-[116px] bx-shadow mb-8px" v-loading="loading">
      <div class="w-[100%] h-[100%] p-8px flex gap-6px justify-start">
        <div v-for="(item, idx) in cirqueInfoList" :key="idx" class="data-item w-[25%] h-[100%]">
          <CirqueRate :info="cirqueInfo" :optionInfo="item"></CirqueRate>
        </div>
      </div>
    </div>
    <!-- 数据列表 -->
    <div class="table-container">
      <BasicTable class="table-wrapper" @register="registerTable"></BasicTable>
    </div>
    <!-- end -->
  </a-card>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { reactive, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { EIsONline, MachineDetailsSearchFormValueType, PowerOnStatus } from '../../types';
  import CirqueRate from './CirqueRate.vue';
  import { BasicTable, BasicColumn } from '/@/components/Table';
  import { getMachworkingDetaildata } from '/@/api/dashbord/operate';
  import { downloadMachworkingDetails, getworkingdetaillist } from '/@/api/dashbord/report';
  import { useInfoDetailPage, Options } from '/@/views/dashboard/operate/hooks/useInfoDetailPage';

  defineOptions({ name: 'dashboard-operate-uptime-machineDetails' });

  const route = useRoute();

  // 状态下拉选项配置
  const STATUS_OPTIONS: Options[] = [
    { label: '全部', value: PowerOnStatus.ALL },
    { label: '未开机', value: PowerOnStatus.OFF },
    { label: '开机', value: PowerOnStatus.ON },
  ];

  // 是否联机下拉选项配置
  const IS_ONLINE_OPTIONS: Options[] = [
    { label: '全部', value: EIsONline.ALL },
    { label: '未联机', value: EIsONline.NOT_ONLINE },
    { label: '联机', value: EIsONline.ONLINE },
  ];

  // 类型下拉选项配置
  const TYPE_OPTIONS: Options[] = [
    { label: '全部', value: '' },
    { label: '平板', value: '平板' },
    { label: '圆刀', value: '圆刀' },
  ];

  const { query: routeQuery } = route;
  const routeDate = dayjs((routeQuery?.date as string) || new Date());
  const routeType = (routeQuery?.type as string) || '';
  const searchFormValue = reactive<MachineDetailsSearchFormValueType>({
    queryTime: routeDate,
    type: routeType,
    status: (routeQuery.status || '') as string,
    orgCode: (routeQuery.orgCode || '') as string,
    isonline: (routeQuery.isonline || '') as string,
    keyword: '',
  });
  const loading = ref(false);
  const cirqueInfo = ref({});
  const cirqueInfoList = [
    {
      title: '主辅占比',
      values: [
        { label: '主类', valueKey: 'MainClassifyCount', rateKey: 'MainClassifyRate' },
        { label: '辅类', valueKey: 'FuClassifyCount', rateKey: 'FuClassifyRate' },
      ],
    },
    {
      title: '使用状态',
      values: [
        { label: '常用', valueKey: 'CommonUseStateCount', rateKey: 'CommonUseStateRate' },
        { label: '闲置', valueKey: 'IdleUseStateCount', rateKey: 'IdleUseStateRate' },
        { label: '非常用', valueKey: 'NoCommonUseStateCount', rateKey: 'NoCommonUseStateRate' },
      ],
    },
    {
      title: '开机状态',
      values: [
        { label: '已开机', valueKey: 'WorkingStateCount', rateKey: 'WorkingStateRate' },
        { label: '未开机', valueKey: 'NoWorkingStateCount', rateKey: 'NoWorkingStateRate' },
      ],
    },
    {
      title: '联机状态',
      values: [
        { label: '已联机', valueKey: 'OnlineStateCount', rateKey: 'OnlineStateRate' },
        { label: '未联机', valueKey: 'NoOnlineStateCount', rateKey: 'NoOnlineStateRate' },
      ],
    },
  ];

  // 展示的表格字段配置
  const showColumns: BasicColumn[] = [
    { dataIndex: 'Factory' },
    { dataIndex: 'EntDate' },
    { dataIndex: 'MachineNo' },
    { width: 74, title: '机台类型', dataIndex: 'MachineType' },
    { width: 74, dataIndex: 'IsNUD' },
    { dataIndex: 'MachineDetails' },
    { dataIndex: 'MachineNum' },
    { width: 74, dataIndex: 'Classify' },
    { width: 74, dataIndex: 'UseState' },
    { dataIndex: 'Floor' },
    { dataIndex: 'IsWorking' },
    { dataIndex: 'IsOnline' },
    { dataIndex: 'Runtime' },
    { dataIndex: 'DRuntime' },
    { dataIndex: 'NRuntime' },
  ];

  const { ORG_CODE_OPTIONS, exportLoading, registerTable, exportToExcel } = useInfoDetailPage({
    api: getMachworkingDetaildata,
    downloadApi: downloadMachworkingDetails,
    showColumns,
    searchFormValue,
    resizeHeightOffset: 48,
  });

  watch(
    [() => searchFormValue.orgCode, () => searchFormValue.type, () => searchFormValue.queryTime],
    () => {
      loading.value = true;
      const type = searchFormValue.type;
      cirqueInfo.value = {};
      getworkingdetaillist({
        orgCode: searchFormValue.orgCode,
        queryTime: searchFormValue.queryTime.valueOf(),
        type,
      })
        .then(res => {
          cirqueInfo.value = res.data;
        })
        .finally(() => {
          loading.value = false;
        });
    },
    { deep: true, immediate: true },
  );
</script>

<style lang="less" scoped>
  .common-content-wrapper {
    height: 100%;

    .chart-container {
      height: 380px;
      width: 100%;

      .chart-wrapper {
        min-width: 100%;
        height: 100%;
      }
    }

    .table-container {
      width: 100%;
    }

    .empty-wrapper {
      height: 60vh;
    }

    .search-wrapper {
      position: relative;
      z-index: 2;
      width: 100%;
      margin-bottom: 12px;
      text-align: right;
      margin-top: -12px;

      :deep(.ant-form-item) {
        margin: 0 12px 0 0;
      }
    }
  }

  .bx-shadow {
    box-shadow: 0 -1px 15px 0 rgb(0 0 0 / 5%), 0 6px 15px 0 rgb(0 0 0 / 5%);
  }

  :deep(.ant-table-wrapper) {
    padding: 0 !important;
  }
</style>
