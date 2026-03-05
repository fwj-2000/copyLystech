<!-- 维度分组 -->
<template>
  <div class="dashboard-page-container flex flex-col">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header flex ct-between">
      <SearchForm
        v-bind="{
          searchFormValue,
          showOrganizeTreeSelect: true,
          isRangePicker: true,
          organizeKeyword: '',
          getOrganizationApi: getSyOrganization,
        }">
        <template #timeDimension>
          <a-form-item name="timeDimension">
            <a-select v-model:value="searchFormValue.timeDimension">
              <a-select-option value="week">周</a-select-option>
              <a-select-option value="month">月</a-select-option>
              <a-select-option value="quarter">季度</a-select-option>
              <a-select-option value="year">年</a-select-option>
            </a-select>
          </a-form-item>
        </template>
        <template #right>
          <div class="flex">
            <div class="flex px-6px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6">纳入边贡</div>
            <a-form-item name="isBian">
              <a-select ref="select" v-model:value="searchFormValue.isBian">
                <a-select-option v-for="item in isBainOptions" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <div class="flex">
            <div class="flex px-6px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6">维度</div>
            <a-form-item name="dimensionType">
              <a-select mode="multiple" v-model:value="searchFormValue.dimensionType" style="min-width: 124px">
                <a-select-option v-for="item in dimensionTypeOptions" :key="item" :value="item.value">{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <div class="flex">
            <div class="flex px-6px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6">工单类型</div>
            <a-form-item name="workNoType">
              <a-select mode="multiple" v-model:value="searchFormValue.workNoType" style="min-width: 84px">
                <a-select-option v-for="item in workNoTypeOptions" :key="item" :value="item.value">{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <a-button type="primary" :loading="exportLoading" ghost @click="exportToExcel">导出</a-button>
        </template>
      </SearchForm>
    </div>
    <!-- 内容加载封装组件 -->
    <div class="dashboard-content-container h-[100%] flex-shrink-1 p-[16px]">
      <SpinContent
        v-bind="{
          loading,
          isEmptyData,
          isRequestError,
          showList: false,
        }">
        <!-- 报表表格 -->
        <BaseVxeTable
          ref="tableRef"
          v-bind="{
            showPagination: true,
            dataSource: dataSource,
            showColumns: columns,
            searchFormValue,
            allColumnsOptions,
            rowStyle: getRowStyle,
            cellStyle: getCellStyle,
          }" />
      </SpinContent>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { ref, unref } from 'vue';
  import { useSearchForm } from '/@/hooks/web/useSearchForm';
  import { useRouteQuery } from '/@/views/dashboard/operate/hooks/useRouteQuery';
  import { allColumnsOptions, columns } from './config';
  import { getDimension, getDimensionWordNoSearchparameter, getDimensionDimensionTypeparameter } from '/@/api/dashbord/report';
  import { getSyOrganization } from '/@/api/dashbord/operate';
  import { isEmpty } from 'lodash-es';

  import { DEFAULT_WORK_NO_TYPE, DEFAULT_DIMENSION_TYPE, DEFAULT_IS_BAIN, isBainOptions } from '../config';
  import BaseVxeTable from '/@/views/dashboard/operate/components/BaseVxeTable/index.vue';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import { TimeDimension } from '/@/views/dashboard/operate/types';
  import { saveVxeTableDatasToExcelByExceljs } from '/@/utils/file/download';

  defineOptions({ name: 'dashboard-operate-biangongDimension-grouping' });

  const tableRef = ref<InstanceType<typeof BaseVxeTable>>();
  const workNoTypeOptions = ref<any[]>([]);
  const exportLoading = ref(false);
  const { routeQuery } = useRouteQuery();
  // 导出excel
  const exportToExcel = async () => {
    exportLoading.value = true;
    saveVxeTableDatasToExcelByExceljs({
      columns: tableRef.value?.columns,
      tableList: dataSource.value,
      fileName: `维度分组`,
    });
    exportLoading.value = false;
  };
  const dimensionTypeOptions = ref<any[]>([]);
  const dataSource = ref<any[]>([]);

  // 单元格样式设置
  const getCellStyle = ({ column, row }) => {
    const { field } = column;
    const percentageValue = row[field];
    return {
      ...(percentageValue < 0 ? { color: 'red' } : {}),
    };
  };

  // 行样式设置
  const getRowStyle = ({ row }) => {
    const { metric } = row;
    return {
      ...(['损失额', '差异'].includes(metric) ? { 'background-color': '#fff2e6' } : {}),
    };
  };

  const getTableData = (queryParams, searchFormValue) => {
    const { orgCode } = searchFormValue;
    let orgCodeParams: {
      orgCode?: string;
      bu?: string;
    } = {
      orgCode: '',
      bu: '',
    };
    if (orgCode === 'MQ') {
      orgCodeParams['orgCode'] = '';
    } else if (orgCode.length < 9) {
      orgCodeParams['bu'] = searchFormValue.orgCode;
    } else {
      orgCodeParams['orgCode'] = searchFormValue.orgCode;
    }
    return new Promise((resolve, reject) => {
      getDimension({
        ...orgCodeParams,
        // orgCode: searchFormValue.orgCode,
        // // bu: 'MQ1001',
        isBian: searchFormValue.isBian,
        dimensionType: searchFormValue.dimensionType.join(';'),
        workNoType: searchFormValue.workNoType.join(';'),
        dimension: searchFormValue.timeDimension,
        startDim: queryParams.startDim,
        endDim: queryParams.endDim,
      })
        .then(res => {
          const { data: list = [] } = res;
          resolve({ data: { list } });
          if (isEmpty(list)) return;
          const dataList = list.map(item => {
            return {
              ...item,
              ...item.dimesionType.reduce(
                (pre, cur) => ({
                  ...pre,
                  [cur.keys]: cur.values,
                }),
                {},
              ),
              ...item.vList.reduce(
                (pre, cur) => ({
                  ...pre,
                  [cur.keys]: cur.values,
                }),
                {},
              ),
            };
          });
          // 后台返回字段可能不全，额外处理下
          dataSource.value = dataList.map(item => {
            return {
              ...unref(columns).reduce((pre, cur) => {
                const key = cur?.children ? (cur?.children[0]?.field as string) : (cur.field as string);
                return {
                  ...pre,
                  [key]: item[key as string] || '',
                };
              }, {}),
              ...item,
            };
          });
        })
        .catch(res => {
          reject(res);
        });
    });
  };
  // 使用维度搜索hooks
  const defaultDate = dayjs().tz().subtract(1, 'week');
  const { loading, searchFormValue, isRequestError, isEmptyData } = useSearchForm({
    defaultDate,
    isTrendData: true,
    isRangePicker: true,
    defaultSearchFormValue: {
      orgCode: 'MQ1001001',
      workNoType: DEFAULT_WORK_NO_TYPE,
      dimensionType: DEFAULT_DIMENSION_TYPE,
      isBian: DEFAULT_IS_BAIN,
      dateRange: [dayjs(defaultDate).tz().subtract(3, 'week'), dayjs(defaultDate).tz()],
      timeDimension: TimeDimension.WEEK,
      ...routeQuery,
      ...(routeQuery?.dimensionType ? { dimensionType: routeQuery?.dimensionType.split(';') } : {}),
    },
    searchReqMth: getTableData,
  });

  // 获取查询参数信息
  const getDimensionWordNoSearchparameterInfo = () => {
    let [startDate = dayjs().tz(), endDate = dayjs().tz()] = searchFormValue.dateRange || [];
    getDimensionWordNoSearchparameter({
      sbu: searchFormValue.orgCode,
      weekStart: `${startDate.year()}WK${startDate.week().toString().padStart(2, '0')}`,
      weekEnd: `${endDate.year()}WK${endDate.week().toString().padStart(2, '0')}`,
    }).then(({ data }) => {
      workNoTypeOptions.value = data.map(item => ({
        label: item,
        value: item,
      }));
    });
  };

  // 维度类型参数信息
  const getDimensionDimensionTypeparameterInfo = () => {
    getDimensionDimensionTypeparameter({}).then(({ data }) => {
      dimensionTypeOptions.value = Object.entries(data).map(([key, value]) => ({
        label: value,
        value: key,
      }));
    });
  };

  getDimensionWordNoSearchparameterInfo();
  getDimensionDimensionTypeparameterInfo();
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
  @import url('/@/design/dashboard.less');

  @borderColor: #ccc;

  .dashboard-content-container {
    :deep(.ant-spin-container) {
      min-height: 60vh;
    }

    .empty-wrapper {
      min-height: 60vh;
    }
  }

  :deep(.ant-table-container) {
    font-size: 12px;
  }

  :deep(.ant-table-thead > tr) {
    & > th {
      font-weight: 700;
      white-space: pre-wrap;

      /* 允许换行 */
      word-break: break-word;

      /* 自动断词 */
      text-align: center !important;
      // border-color: @borderColor !important;
    }
  }

  :deep(.ant-table-tbody > tr) {
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
