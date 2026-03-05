<!-- 运营周报首页 -->
<template>
  <div class="dashboard-page-container">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header flex ct-between">
      <SearchForm
        v-bind="{
          searchFormValue,
          showOrganizeTreeSelect: true,
          showTimeDimension: true,
          isRangePicker: true,
          showPeriodDimension: searchFormValue.timeDimension !== TimeDimension.DAY,
          organizeKeyword: '1',
        }">
        <template #right>
          <a-form-item v-if="searchFormConfig.showModuleCodeSelect" name="moduleCode">
            <a-select v-model:value="searchFormValue.moduleCode">
              <a-select-option v-for="(item, idx) in searchFormConfig.options" :key="idx" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-item>
        </template>
      </SearchForm>
      <a-button type="primary" :loading="exportLoading" ghost @click="exportToExcel">导出</a-button>
    </div>
    <!-- 内容加载封装组件 -->
    <div class="dashboard-content-container">
      <SpinContent
        v-bind="{
          loading: loading,
          isEmptyData,
          isRequestError,
          showList: false,
        }">
        <!-- 报表表格 -->
        <BasicTable v-if="!loading" class="table-wrapper" @register="registerTable" :rowClassName="rowClassName">
          <template v-slot:bodyCell="{ column, record }">
            <!-- 管理模块跳转 -->
            <template v-if="getIsLink(column, record, searchFormValue)">
              <div :class="[{ 'flex justify-end items-center': column?.getHasAnalysis && column?.getHasAnalysis(record) }]">
                <span
                  class="text-hover"
                  :style="column.cssStyle"
                  @click="
                    goPage(
                      column.getRouteInfo({
                        dataIndex: column.dataIndex,
                        record,
                        searchFormValue,
                      }),
                    )
                  ">
                  {{ record[column.dataIndex] }}
                </span>
                <template v-if="column?.getHasAnalysis && column?.getHasAnalysis(record)">
                  <a-popover placement="right">
                    <template #content>
                      <AnalysisPopover :column="column" :record="record" :searchFormValue="searchFormValue" />
                    </template>
                    <img class="text-hover" :src="vectorSvg" style="margin: 0 0 1px 4px" @click="handleGetProblemdetail({ column, record })" />
                  </a-popover>
                </template>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'Analysis'">
              <a-tooltip color="rgba(0,0,0,.95)" placement="left">
                <template #title>{{ record[column.dataIndex] && record[column.dataIndex].replace(/\s+/g, '') }}</template>
                <span :style="column.cssStyle">
                  {{ record[column.dataIndex] && record[column.dataIndex].replace(/\s+/g, '') }}
                </span>
              </a-tooltip>
            </template>
            <template v-else>
              <span :style="column.cssStyle">
                {{ record[column.dataIndex] && record[column.dataIndex].replace(/\s+/g, '') }}
              </span>
            </template>
          </template>
        </BasicTable>
      </SpinContent>
    </div>
  </div>
  <!-- 分析详细表格 -->
  <a-modal v-model:open="analysisDetailVisible" v-bind="modelOptions" width="100%" wrapClassName="full-modal">
    <AnalysisDetail :searchInfo="detailSearchInfo"></AnalysisDetail>
  </a-modal>
</template>

<script lang="ts" setup>
  import { useRoute, useRouter } from 'vue-router';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useGo } from '/@/hooks/web/usePage';
  import { BasicTable } from '/@/components/Table';
  import { useReportPage } from '/@/views/dashboard/operate/hooks/useReportPage';
  import { PAGE_CONFIG_INFO, ALL_MODULE_CODE_OPTIONS } from './config';
  import { EManagementModules } from './type';
  import { objectToQueryParams } from '/@/views/dashboard/operate/metricsCenter/utils';
  import { saveTableDatasToExcel } from '/@/utils/file/download';

  import vectorSvg from '/@/assets/svg/report/vector_primary.svg';
  import AnalysisPopover from './AnalysisPopover.vue';
  import AnalysisDetail from './AnalysisDetail.vue';
  import { TimeDimension } from '/@/views/dashboard/operate/types';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import { computed, onActivated, ref, reactive } from 'vue';
  import { pickBy } from 'lodash-es';
  import dayjs, { Dayjs } from 'dayjs';
  import { ETableCellSlotType } from '../ranking/type';

  defineOptions({ name: 'dashboard-operate-report' });

  const go = useGo();
  const route = useRoute();
  const router = useRouter();
  const exportLoading = ref(false);
  const { setTitle } = useTabs(router);
  const analysisDetailVisible = ref(false);
  const detailSearchInfo = reactive<Record<string, any>>({});
  const modelOptions = ref<any>({
    footer: null,
    title: '分析明细',
  });
  const { query: routeQuery = {} } = route;
  const pageName = (routeQuery?.name || EManagementModules.ALL) as string;

  const { columnsOptions, api, title, defaultSearchFormValue = {} } = PAGE_CONFIG_INFO[pageName] || PAGE_CONFIG_INFO[EManagementModules.ALL];
  setTitle(`${title}`);

  const getIsLink = (column, record, searchFormValue) => {
    const { path = '' } =
      (column?.getRouteInfo &&
        column?.getRouteInfo({
          dataIndex: column.dataIndex,
          record,
          searchFormValue,
        })) ||
      {};
    return path && column?.type === ETableCellSlotType.LINK && column?.getIsLink(record, searchFormValue);
  };

  const getSafeDate = (dateStr: string, defaultDate: Dayjs): Dayjs => {
    if (!dateStr) return defaultDate;
    const date = dayjs(dateStr).tz();
    return date.isValid() ? date : defaultDate;
  };
  const date: Dayjs = getSafeDate(routeQuery?.date as string, dayjs().tz().subtract(1, 'day'));
  const startDate: Dayjs = getSafeDate(routeQuery?.startDate as string, date.subtract(6, 'day'));

  // 获取topx分析详细
  const handleGetProblemdetail = ({ column, record }) => {
    detailSearchInfo.value = {
      startTime: dayjs(column.dataIndex).tz().valueOf(),
      endTime: dayjs(column.dataIndex).tz().valueOf(),
      target: record.category,
      metric: record.metric,
      orgCode: searchFormValue.orgCode,
    };
    analysisDetailVisible.value = true;
  };

  // 条件搜索配置
  const searchFormConfig = computed(() => {
    return {
      showModuleCodeSelect: [EManagementModules.PERSONNEL, EManagementModules.EQUIPMENT, EManagementModules.TICKETS, EManagementModules.OUTPUT].includes(
        pageName as EManagementModules,
      ),
      options: ALL_MODULE_CODE_OPTIONS[pageName],
    };
  });

  // 导出excel
  const exportToExcel = () => {
    exportLoading.value = true;
    saveTableDatasToExcel({
      columns: columns.value.reduce((pre, cur) => {
        if (cur.children) {
          return [...pre, ...cur.children];
        }
        return [...pre, cur];
      }, []),
      tableList: dataSource.value,
      fileName: '运营日报',
    });
    exportLoading.value = false;
  };

  // 从路由移除的多余参数
  const keysToRemove = ['name', 'date', 'startDate'];
  // 使用维度搜索hooks
  const { registerTable, columns, dataSource, loading, searchFormValue, isRequestError, isEmptyData } = useReportPage({
    columnsOptions,
    defaultSearchFormValue: {
      dateRange: [startDate, date],
      ...defaultSearchFormValue,
      ...pickBy(routeQuery, (_, key) => !keysToRemove.includes(key)),
    },
    requestMth: api,
  });

  // 打开新标签页
  const goPage = ({ path = '/dashboard/operate/report', query }) => {
    if (path.includes('paramsId')) {
      go(path);
      return;
    }
    // 构造路由参数
    const url = `${path}?${objectToQueryParams({
      orgCode: searchFormValue.orgCode,
      ...query,
    })}`;
    go(url);
  };

  // 重新激活页面
  onActivated(() => {
    setTitle(`${title}`);
  });

  const rowClassName = record => {
    return Object.values(record).includes('汇总') ? 'hightlignt-row' : '';
  };
</script>

<style lang="less">
  .table-wrapper {
    .hightlignt-row {
      td {
        background-color: #fff2e6;
      }
    }
  }
</style>

<style lang="less" scoped>
  @import url('../../../../design/dashboard.less');

  @borderColor: #ccc;

  .dashboard-content-container {
    padding: 0 !important;

    :deep(.ant-spin-container) {
      min-height: 60vh;
    }

    .empty-wrapper {
      min-height: 60vh;
    }
  }

  :deep(.ant-table-thead > tr) {
    & > th {
      white-space: pre-wrap;

      /* 允许换行 */
      word-break: break-word;

      /* 自动断词 */
      text-align: left;
      // border-color: @borderColor !important;
    }
  }

  :deep(.ant-table-tbody > tr) {
    font-weight: 500;

    &:first-child {
      & > td {
        padding: 0 !important;
      }
    }

    & > td {
      white-space: pre-wrap;

      /* 允许换行 */
      word-break: break-word;

      /* 自动断词 */
      border-color: @borderColor !important;
      padding: 4px 8px !important;
    }
  }
</style>
