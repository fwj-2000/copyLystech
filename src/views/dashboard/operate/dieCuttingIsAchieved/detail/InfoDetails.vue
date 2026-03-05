<!-- 模切达成明细 -->
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
  import { reactive } from 'vue';
  import { useRoute } from 'vue-router';
  import { BasicTable, BasicColumn } from '/@/components/Table';
  import { useInfoDetailPage } from '/@/views/dashboard/operate/hooks/useInfoDetailPage';
  import { getMqachieveDetaildata } from '/@/api/dashbord/operate';
  import { downloadMqachieveDetails } from '/@/api/dashbord/report';

  defineOptions({ name: 'dashboard-operate-dieCutting-infoDetail' });

  const route = useRoute();

  const { query: routeQuery } = route;
  const routeDate = dayjs((routeQuery?.date as string) || new Date().tz());
  const searchFormValue = reactive({
    queryTime: routeDate,
    orgCode: (routeQuery.orgCode || '') as string,
    keyword: '',
    // 这里填写搜索条件
  });

  // 展示的表格字段配置
  const showColumns: BasicColumn[] = [
    { dataIndex: 'Factory' },
    { dataIndex: 'EntDate' },
    { dataIndex: 'Fteam' },
    { dataIndex: 'FPlanNumber' },
    { dataIndex: 'FProduct' },
    { dataIndex: 'MachineNo' },
    { dataIndex: 'EmpNo' },
    { dataIndex: 'EmpName' },
    { dataIndex: 'FPlanQty' },
    { dataIndex: 'Qty' },
    { dataIndex: 'AchieveRate' },
    { dataIndex: 'FMRP' },
  ];
  const { ORG_CODE_OPTIONS, exportLoading, exportToExcel, registerTable } = useInfoDetailPage({
    api: getMqachieveDetaildata,
    downloadApi: downloadMqachieveDetails,
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
