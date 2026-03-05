<!-- AOI稼动明细 -->
<template>
  <a-card class="common-content-wrapper">
    <div class>
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
          <a-form-item name="status">
            <a-select style="width: 84px; text-align: left" v-model:value="searchFormValue.status">
              <a-select-option v-for="(item, idx) in STATUS_OPTIONS" :key="idx" :value="item.value"> {{ item?.label || item.value }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item name="lianjistatu">
            <a-select ref="select" v-model:value="searchFormValue.lianjistatu">
              <a-select-option v-for="item in LIANJI_STATUS_OPTIONS" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item name="mark">
            <a-select ref="select" v-model:value="searchFormValue.mark">
              <a-select-option v-for="item in AOI_MARK_OPTIONS" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-input v-model:value="searchFormValue.keyword" placeholder="请输入关键字查询" />
          </a-form-item>
          <a-button type="primary" :loading="exportLoading" ghost @click="exportToExcel">下载明细</a-button>
        </template>
      </SearchForm>
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
  import { useRoute } from 'vue-router';
  import { BasicTable, BasicColumn } from '/@/components/Table';
  import { useInfoDetailPage, Options } from '/@/views/dashboard/operate/hooks/useInfoDetailPage';
  import { getAoidatanewDetails, downloadAoidatanewDetails } from '/@/api/dashbord/report';
  import { AOI_MARK_OPTIONS, DEFAULT_AOI_MARK } from '/@/views/dashboard/operate/metricsCenter/components/UtilizationRate/config';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';

  import { PowerOnStatus } from '/@/views/dashboard/operate/types';
  import { useSearchForm } from '/@/hooks/web/useSearchForm';

  defineOptions({ name: 'dashboard-operate-utilizationRate-infoDetail' });

  const route = useRoute();

  // 状态下拉选项配置
  const STATUS_OPTIONS: Options[] = [
    { label: '全部', value: '' },
    { label: '未开机', value: PowerOnStatus.OFF },
    { label: '开机', value: PowerOnStatus.ON },
  ];
  // 联机状态下拉选项配置
  const LIANJI_STATUS_OPTIONS: Options[] = [
    { label: '全部', value: '' },
    { label: '未联机', value: PowerOnStatus.OFF },
    { label: '已联机', value: PowerOnStatus.ON },
  ];

  const { query: routeQuery } = route;
  const routeDate = dayjs((routeQuery?.date as string) || new Date());
  // 展示的表格字段配置
  const showColumns: BasicColumn[] = [
    { dataIndex: 'Mnumber' },
    { dataIndex: 'EndDate' },
    { dataIndex: 'FTeam' },
    { dataIndex: 'FProduct' },
    { dataIndex: 'KaijiTypes' },
    { dataIndex: 'LianjiTypes' },
    { dataIndex: 'AOIMark' },
    { dataIndex: 'Wastime' },
    { dataIndex: 'Speed' },
    { dataIndex: 'Jiadonglv' },
    { dataIndex: 'GQty' },
    { dataIndex: 'BQty' },
    { dataIndex: 'Lianglv' },
    { dataIndex: 'FMRP' },
  ];

  // 使用维度搜索hooks
  const { searchFormValue } = useSearchForm({
    defaultDate: dayjs(routeDate),
    defaultSearchFormValue: {
      orgCode: (routeQuery.orgCode || '') as string,
      keyword: '',
      status: routeQuery.status || '',
      mark: routeQuery?.mark || DEFAULT_AOI_MARK,
      lianjistatu: routeQuery?.lianjistatu || '',
    },
  });

  const { exportLoading, registerTable, exportToExcel } = useInfoDetailPage({
    api: getAoidatanewDetails,
    downloadApi: downloadAoidatanewDetails,
    showColumns,
    searchFormValue,
    getFetchParams: searchFormValue => ({
      queryTime: searchFormValue.date.unix() * 1000,
      orgCode: searchFormValue.orgCode,
      keyword: searchFormValue.keyword,
      status: searchFormValue.status || '',
      mark: searchFormValue.mark || DEFAULT_AOI_MARK,
      lianjistatu: searchFormValue.lianjistatu || '',
    }),
    fetchSetting: {
      listField: 'list.list',
      totalField: 'list.pagination.Total',
    },
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
