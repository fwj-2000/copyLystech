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
          <a-select style="text-align: left; width: 98px" v-model:value="searchFormValue.type">
            <a-select-option v-for="(item, idx) in TYPE_OPTIONS" :key="idx" :value="item.value"> {{ item?.label || item.value }}</a-select-option>
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
  import { getQcauditProblemDetail } from '/@/api/dashbord/operate';

  defineOptions({ name: 'dashboard-operate-qualityAudit-problemDetail' });

  const route = useRoute();
  const { query: routeQuery } = route;
  const routeDate = dayjs((routeQuery?.date as string) || new Date());
  const searchFormValue = reactive({
    queryTime: routeDate.valueOf(),
    orgCode: (routeQuery.orgCode || '') as string,
    date: routeDate,
    keyword: '',
    type: (routeQuery.type || '') as string,
  });

  // 问题类型选项配置
  const TYPE_OPTIONS: Options[] = [
    { label: '全部', value: '' },
    { label: '常规问题', value: '常规问题' },
    { label: '低级问题', value: '低级问题' },
  ];

  // 展示的表格字段配置
  const showColumns: BasicColumn[] = [
    { dataIndex: 'Factory' },
    { dataIndex: 'EntDate' },
    { dataIndex: 'Project' },
    { dataIndex: 'FProduct' },
    { dataIndex: 'MRP' },
    { dataIndex: 'FClass' },
    { dataIndex: 'LiableUnit' },
    { dataIndex: 'LiablePerson' },
    { dataIndex: 'Fname' },
    { dataIndex: 'Floor' },
    { dataIndex: 'Fstate' },
    { dataIndex: 'Process' },
    { dataIndex: 'Category' },
    { dataIndex: 'ProblemType' },
    { dataIndex: 'Describe' },
    { dataIndex: 'Analysis' },
    { dataIndex: 'CompleteTime' },
  ];

  watch(
    () => searchFormValue.date,
    () => {
      searchFormValue.queryTime = dayjs(searchFormValue.date).tz().valueOf();
    },
  );

  const { ORG_CODE_OPTIONS, exportLoading, exportToExcel, registerTable } = useInfoDetailPage2({
    api: getQcauditProblemDetail,
    downloadApi: getQcauditProblemDetail,
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
