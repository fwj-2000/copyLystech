<!-- 手工良率明细 -->
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
        <a-form-item name="status">
          <a-select style="text-align: left" v-model:value="searchFormValue.Is985">
            <a-select-option v-for="(item, idx) in STATUS_OPTIONS" :key="idx" :value="item.value"> {{ item?.label || item.value }}</a-select-option>
          </a-select>
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
  import { useInfoDetailPage, Options } from '/@/views/dashboard/operate/hooks/useInfoDetailPage';
  import { getHandyieldYield, downloadHandyieldMqyield } from '/@/api/dashbord/report';

  defineOptions({ name: 'dashboard-operate-processYield-handInfoDetail' });

  const route = useRoute();
  const { query: routeQuery } = route;
  const routeDate = dayjs((routeQuery?.date as string) || new Date());
  const searchFormValue = reactive({
    startTime: routeDate.valueOf(),
    endTime: routeDate.valueOf(),
    orgCode: (routeQuery.orgCode || '') as string,
    date: routeDate,
    Is985: '',
  });

  // 状态下拉选项配置
  const STATUS_OPTIONS: Options[] = [
    { label: '全部', value: '' },
    { label: '985项目', value: 'true' },
    { label: '非985项目', value: 'false' },
  ];

  // 展示的表格字段配置
  const showColumns: BasicColumn[] = [
    { dataIndex: 'Factory' },
    { dataIndex: 'EntDate' },
    { dataIndex: 'ProdNo' },
    { dataIndex: 'Is985' },
    { dataIndex: 'GoodQty' },
    { dataIndex: 'BadQty' },
    { dataIndex: 'Yield' },
  ];

  watch(
    () => searchFormValue.date,
    () => {
      searchFormValue.startTime = dayjs(searchFormValue.date).tz().valueOf();
      searchFormValue.endTime = dayjs(searchFormValue.date).tz().valueOf();
    },
  );

  const { ORG_CODE_OPTIONS, exportLoading, exportToExcel, registerTable } = useInfoDetailPage({
    api: getHandyieldYield,
    downloadApi: downloadHandyieldMqyield,
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
