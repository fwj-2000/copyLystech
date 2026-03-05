<!-- 性能利用率异常详情页 -->
<template>
  <a-card class="common-content-wrapper">
    <div class="head-container row flex ct-start">
      <template v-if="routeQuery.state === 'false'">
        <div class="warn-icon flex">
          <img :src="warnSvg" />
        </div>
        <p class="title">性能利用率异常</p>
        <p class="value error">{{ routeQuery.rate }}</p>
        <StateSvg style="margin-left: 4px" />
      </template>
      <template v-else>
        <p class="title">性能利用率</p>
        <p class="value">{{ routeQuery.rate }}</p>
      </template>
    </div>
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
        <a-form-item name="issuesquery">
          <a-select style="width: 84px; text-align: left" v-model:value="searchFormValue.issuesquery">
            <a-select-option v-for="(item, idx) in STATUS_OPTIONS" :key="idx" :value="item.value"> {{ item?.label || item.value }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input v-model:value="searchFormValue.keyword" placeholder="请输入关键字查询" />
        </a-form-item>
      </div>
      <a-button type="primary" :loading="exportLoading" ghost @click="exportToExcel">下载明细</a-button>
    </a-form>
    <div class="table-container">
      <BasicTable class="table-wrapper" @register="registerTable" />
    </div>
    <!-- 页面 end -->
  </a-card>
</template>

<script lang="ts" setup>
  import { reactive, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { useInfoDetailPage, Options } from '/@/views/dashboard/operate/hooks/useInfoDetailPage';
  import { BasicTable, BasicColumn } from '/@/components/Table';
  import { getOeedataMquserate, getMquserateDownloadlist } from '/@/api/dashbord/operate';

  import warnSvg from '/@/assets/svg/report/warn.svg';
  import StateSvg from '../../components/StateSvg.vue';
  import { SortOrder } from '/@/components/Table/src/types/column';
  import dayjs from 'dayjs';

  defineOptions({ name: 'dashboard-operate-oee-detail-performanceUtilizationAbnormal' });

  const route = useRoute();
  const { query: routeQuery } = route;
  const startTime = dayjs(Number.parseInt(routeQuery?.startTime as string, 10) || new Date());
  const searchFormValue = reactive({
    startTime: Number.parseInt(routeQuery?.startTime as string, 10),
    endTime: Number.parseInt(routeQuery?.endTime as string, 10),
    date: startTime,
    orgCode: (routeQuery.orgCode || '') as string,
    keyword: '',
    issuesquery: 'true',
  });

  // 状态下拉选项配置
  const STATUS_OPTIONS: Options[] = [
    { label: '全部', value: 'false' },
    { label: '异常', value: 'true' },
  ];

  const sortOptions = {
    sortDirections: ['descend', 'ascend'] as SortOrder[],
    defaultSortOrder: 'descend' as SortOrder,
    sorter: (a, b) => a.UseRate - b.UseRate,
  };

  // 展示的表格字段配置
  const showColumns: BasicColumn[] = [
    {
      dataIndex: 'Factory',
    },
    {
      dataIndex: 'EntDate',
    },
    {
      dataIndex: 'FTeam',
    },
    {
      dataIndex: 'MachineNo',
    },
    {
      dataIndex: 'IsNud',
    },
    {
      dataIndex: 'MachineType',
    },
    {
      dataIndex: 'FProduct',
    },
    {
      title: '实际产出(K)',
      dataIndex: 'ActOutput',
    },
    {
      dataIndex: 'StaUph',
    },
    {
      title: '运行时长(H)',
      dataIndex: 'RunTime',
      ...sortOptions,
    },
    {
      dataIndex: 'UseRate',
      ...sortOptions,
    },
    {
      title: '平均速度(M/Min或次/H)',
      dataIndex: 'AvgSpeed',
    },
    {
      title: '标准速度(M/Min或次/H)',
      dataIndex: 'StaSpeed',
    },
  ];

  watch(
    () => searchFormValue.date,
    () => {
      searchFormValue.startTime = dayjs(searchFormValue.date).valueOf();
      searchFormValue.endTime = dayjs(searchFormValue.date).valueOf();
    },
  );

  const { ORG_CODE_OPTIONS, exportLoading, registerTable, exportToExcel } = useInfoDetailPage({
    api: getOeedataMquserate,
    downloadApi: getMquserateDownloadlist,
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
