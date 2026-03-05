<!-- 稽核问题点明细明细 -->
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
          <a-date-picker v-model:value="searchFormValue.date"></a-date-picker>
        </a-form-item>
        <a-form-item name="type">
          <a-select style="text-align: left; width: 98px" v-model:value="searchFormValue.result">
            <a-select-option v-for="(item, idx) in RESULT_OPTIONS" :key="idx" :value="item.value"> {{ item?.label || item.value }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input v-model:value="searchFormValue.keyword" placeholder="请输入关键字查询" />
        </a-form-item>
      </div>
      <a-button type="primary" :loading="exportLoading" ghost @click="exportToExcel">下载明细</a-button>
    </a-form>
    <!-- 数据列表 -->
    <div class="table-container">
      <BasicTable class="table-wrapper" @register="registerTable"></BasicTable>
    </div>
    <!-- end -->
  </a-card>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { reactive, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { BasicTable, BasicColumn } from '/@/components/Table';
  import { useInfoDetailPage2, Options } from '/@/views/dashboard/operate/hooks/useInfoDetailPage2';
  import { getQcauditFqcDetail } from '/@/api/dashbord/operate';

  defineOptions({ name: 'dashboard-operate-qualityAudit-fqcDetail' });

  const route = useRoute();
  const { query: routeQuery } = route;
  const routeDate = dayjs((routeQuery?.date as string) || new Date());
  const searchFormValue = reactive({
    queryTime: routeDate.valueOf(),
    orgCode: (routeQuery.orgCode || '') as string,
    date: routeDate,
    keyword: '',
    result: '',
  });

  // 问题类型选项配置
  const RESULT_OPTIONS: Options[] = [
    { label: '全部', value: '' },
    { label: 'OK', value: 'OK' },
    { label: 'NG', value: 'NG' },
  ];

  // 展示的表格字段配置
  const showColumns: BasicColumn[] = [
    { dataIndex: 'Factory' },
    { dataIndex: 'EntDate' },
    { dataIndex: 'Result', title: '判断结果' },
    { dataIndex: 'FPassinreviewno' },
    { dataIndex: 'FManuOrder' },
    { dataIndex: 'FProduct' },
    { dataIndex: 'FProductLot' },
    { dataIndex: 'Floor' },
    { dataIndex: 'FClass' },
    { dataIndex: 'FProductiongroup' },
    { dataIndex: 'CheckerNo' },
    { dataIndex: 'CheckerName' },
    { dataIndex: 'FName' },
    { dataIndex: 'MQOperator' },
    { dataIndex: 'AOIOperator' },
    { dataIndex: 'Qty', title: '批量(PCS)' },
    { dataIndex: 'AQL' },
    { dataIndex: 'SampleQty' },
    { dataIndex: 'BigFname' },
    { dataIndex: 'SmallFname' },
    { dataIndex: 'BadQty' },
    { dataIndex: 'FQAconfirm' },
    { dataIndex: 'CreateTime' },
  ];

  watch(
    () => searchFormValue.date,
    () => {
      searchFormValue.queryTime = dayjs(searchFormValue.date).valueOf();
    },
  );

  const { ORG_CODE_OPTIONS, exportLoading, exportToExcel, registerTable } = useInfoDetailPage2({
    api: getQcauditFqcDetail,
    downloadApi: getQcauditFqcDetail,
    showColumns,
    searchFormValue,
  });
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
</style>
