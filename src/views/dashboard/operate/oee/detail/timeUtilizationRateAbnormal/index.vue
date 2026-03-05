<!-- 时间稼动率异常详情页 -->
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
        organizeKeyword: '1',
      }">
      <template #right>
        <a-form-item name="range">
          <div class="flex">
            <div class="flex px-6px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6">区间范围</div>
            <a-select ref="select" v-model:value="searchFormValue.range" style="width: 84px; text-align: left">
              <a-select-option value="0">全部</a-select-option>
              <a-select-option value="1">低于30%</a-select-option>
              <a-select-option value="2">30%-60%</a-select-option>
              <a-select-option value="3">60%-80%</a-select-option>
              <a-select-option value="4">高于80%</a-select-option>
            </a-select>
          </div>
        </a-form-item>
        <a-form-item name="isNPI">
          <div class="flex">
            <div class="flex px-6px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6">NPI</div>
            <a-select ref="select" v-model:value="searchFormValue.isNPI">
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="true">NPI</a-select-option>
              <a-select-option value="false">MP</a-select-option>
            </a-select>
          </div>
        </a-form-item>
        <a-form-item name="isNUD">
          <div class="flex">
            <div class="flex px-6px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6">NUD</div>
            <a-select ref="select" v-model:value="searchFormValue.isNUD">
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="true">NUD</a-select-option>
              <a-select-option value="false">非NUD</a-select-option>
            </a-select>
          </div>
        </a-form-item>
        <a-form-item name="machineType">
          <div class="flex">
            <div class="flex px-6px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6">机台类型</div>
            <a-select ref="select" v-model:value="searchFormValue.machineType">
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="平板">平板</a-select-option>
              <a-select-option value="圆刀">圆刀</a-select-option>
            </a-select>
          </div>
        </a-form-item>
        <a-form-item>
          <a-input v-model:value="searchFormValue.keyword" placeholder="请输入关键字查询" />
        </a-form-item>
        <a-button type="primary" :loading="exportLoading" ghost @click="exportToExcel">下载明细</a-button>
      </template>
    </SearchForm>
    <!-- 停机异常原因图表 -->
    <chart :searchFormValue="searchFormValue"></chart>
    <!-- 表格 -->
    <div class="table-container">
      <BasicTable class="table-wrapper" @register="registerTable" />
    </div>
    <!-- 页面 end -->
  </a-card>
</template>

<script lang="ts" setup>
  import { useRoute } from 'vue-router';
  import { useSearchForm } from '/@/hooks/web/useSearchForm';
  import { useInfoDetailPage } from '/@/views/dashboard/operate/hooks/useInfoDetailPage';
  import { BasicTable, BasicColumn } from '/@/components/Table';
  import { getUtilizationrate, getUtilizationrateDownloadlist } from '/@/api/dashbord/operate';
  import dayjs from 'dayjs';

  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';

  import chart from './chart/index.vue';

  defineOptions({ name: 'dashboard-operate-oee-detail-timeUtilizationRateAbnormal' });

  const route = useRoute();
  const { query: routeQuery } = route;
  const startTime = dayjs(Number.parseInt(routeQuery?.endTime as string, 10) || new Date());

  // 展示的表格字段配置
  const showColumns: BasicColumn[] = [
    {
      dataIndex: 'Factory',
      width: 80,
    },
    {
      dataIndex: 'EntDate',
      width: 100,
    },
    {
      dataIndex: 'FTeam',
      width: 80,
    },
    {
      dataIndex: 'MachineNo',
      width: 80,
    },
    {
      dataIndex: 'MachineType',
      width: 80,
    },
    {
      dataIndex: 'IsNud',
      width: 80,
    },
    {
      dataIndex: 'FPlanNumber',
    },
    {
      dataIndex: 'FManuorder',
    },
    {
      dataIndex: 'FProduct',
    },
    {
      dataIndex: 'IsNpi',
      width: 80,
    },
    {
      dataIndex: 'RunTime',
      width: 120,
    },
    {
      dataIndex: 'DownTime',
      width: 120,
    },
    {
      dataIndex: 'UtilizationRate',
      width: 80,
    },
    {
      dataIndex: 'FMRP',
      width: 120,
    },
  ];

  // 使用维度搜索hooks
  const { searchFormValue } = useSearchForm({
    defaultDate: dayjs(startTime),
    defaultSearchFormValue: {
      startTime: Number.parseInt(routeQuery?.startTime as string, 10),
      endTime: Number.parseInt(routeQuery?.endTime as string, 10),
      date: startTime,
      orgCode: (routeQuery.orgCode || '') as string,
      keyword: '',
      range: (routeQuery.range || '0') as string,
      isNPI: (routeQuery.isNPI || '') as string,
      isNUD: (routeQuery.isNUD || '') as string,
      machineType: (routeQuery.machineType || '') as string,
    },
  });

  const { exportLoading, registerTable, exportToExcel } = useInfoDetailPage({
    api: getUtilizationrate,
    downloadApi: getUtilizationrateDownloadlist,
    showColumns,
    searchFormValue,
    getFetchParams: searchFormValue => ({
      startTime: searchFormValue.date.unix() * 1000,
      endTime: searchFormValue.date.unix() * 1000,
      date: startTime,
      orgCode: searchFormValue.orgCode,
      keyword: searchFormValue.keyword,
      range: searchFormValue.range || '',
      isNPI: searchFormValue.isNPI,
      isNUD: searchFormValue.isNUD,
      machineType: searchFormValue.machineType,
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

<style lang="less" scoped>
  .head-container {
    margin-bottom: 24px;

    .warn-icon {
      width: 24px;
      height: 24px;
      border-radius: 5px;
      background: rgb(255 0 0 / 17%);

      img {
        width: 20px;
        height: 20px;
      }
    }

    .title {
      color: #1a1a1a;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: 28px;
      letter-spacing: -0.32px;
      margin: 0 11px 0 8px;
    }

    .value {
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: 28px;
      letter-spacing: -0.32px;

      &.error {
        color: #ff1417;
      }
    }
  }
</style>
