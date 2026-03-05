<!-- 客诉明细 -->
<template>
  <a-card class="common-content-wrapper">
    <!-- 表单筛选条件 -->
    <SearchForm
      class="pt-0 mt-[-12px]"
      v-bind="{
        searchFormValue,
        showOrganizeTreeSelect: true,
        showPeriodDimension: false,
        showTimeDimension: false,
        isRangePicker: true,
        organizeKeyword: '1',
      }">
      <template #right>
        <a-form-item name="type">
          <a-select style="width: 84px; text-align: left" v-model:value="searchFormValue.severity">
            <a-select-option v-for="(item, idx) in TYPE_OPTIONS" :key="idx" :value="item.value"> {{ item?.label || item.value }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-button type="primary" :loading="exportLoading" ghost @click="exportToExcel">下载明细</a-button>
      </template>
    </SearchForm>
    <!-- 数据列表 -->
    <div class="table-container">
      <BasicTable class="table-wrapper" @register="registerTable"></BasicTable>
    </div>
    <!-- end -->
  </a-card>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { useRoute } from 'vue-router';
  import { useSearchForm } from '/@/hooks/web/useSearchForm';
  import { BasicTable, BasicColumn } from '/@/components/Table';
  import { useInfoDetailPage, Options } from '/@/views/dashboard/operate/hooks/useInfoDetailPage';
  import { getCustomcomplaintDetailsdata } from '/@/api/dashbord/operate';
  import { downloadCustomcomplaintDetails } from '/@/api/dashbord/report';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';

  import { SEVERITY_TYPE } from '/@/views/dashboard/operate/metricsCenter/components/CustomerComplaints/types';

  defineOptions({ name: 'dashboard-operate-dieCutting-infoDetail' });

  const route = useRoute();

  // 类型下拉选项配置
  const TYPE_OPTIONS: Options[] = [
    { label: '全部', value: '' },
    { label: '严重', value: SEVERITY_TYPE.SEVERE },
    { label: '一般', value: SEVERITY_TYPE.NORMAL },
  ];

  const { query: routeQuery } = route;
  const routeDate = dayjs((routeQuery?.date as string) || new Date());
  const routeStartDate = dayjs((routeQuery?.startDate as string) || new Date());
  const routeType = (routeQuery?.type as string) || '';

  // 展示的表格字段配置
  const showColumns: BasicColumn[] = [
    { dataIndex: 'Factory' },
    { dataIndex: 'OccurTime' },
    { dataIndex: 'CloseTime' },
    { dataIndex: 'Customer' },
    { dataIndex: 'Severity' },
    { dataIndex: 'Causes' },
    { dataIndex: 'Emergency' },
    { dataIndex: 'Correction' },
    { dataIndex: 'Prevention' },
  ];

  // 使用维度搜索hooks
  const { searchFormValue } = useSearchForm({
    defaultDate: dayjs(routeDate).tz(),
    defaultSearchFormValue: {
      dateRange: [routeStartDate, routeDate],
      severity: routeType,
      orgCode: (routeQuery.orgCode || '') as string,
    },
  });

  const { exportLoading, exportToExcel, registerTable } = useInfoDetailPage({
    api: getCustomcomplaintDetailsdata,
    downloadApi: downloadCustomcomplaintDetails,
    showColumns,
    searchFormValue,
    getFetchParams: searchFormValue => ({
      startTime: searchFormValue.dateRange[0].unix() * 1000,
      endTime: searchFormValue.dateRange[1].unix() * 1000,
      orgCode: searchFormValue.orgCode,
      severity: searchFormValue.severity,
    }),
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
