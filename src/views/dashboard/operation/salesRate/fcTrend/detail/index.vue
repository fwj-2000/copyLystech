<!-- 产销率报表 -->
<template>
  <div class="dashboard-page-container">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header">
      <SearchForm
        v-bind="{
          searchFormValue,
          organizeKeyword: '1',
          showOrganizeTreeSelect: true,
          showTimeDimension: false,
          isRangePicker: false,
        }">
        <template #right>
          <div v-for="(item, idx) in allOptions" :key="idx" class="flex">
            <div class="flex px-6px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6">
              {{ item.text }}
            </div>
            <a-form-item name="isBian">
              <a-select ref="select" v-model:value="searchFormValue[item.props]" :style="`${item.width ? `width: ${item.width}px;text-align: left` : ''}`">
                <a-select-option v-for="option in item.options" :key="option.value" :value="option.value" :title="option.label">
                  {{ option.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <div class="flex">
            <div class="flex px-6px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6"> 4周变化幅度超30% </div>
            <a-form-item name="isBian">
              <a-select ref="select" v-model:value="searchFormValue.rangeUp30" :dropdownMatchSelectWidth="false">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="true">是</a-select-option>
                <a-select-option value="false">否</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <a-button type="primary" :loading="exportLoading" ghost @click="exportToExcel">导出</a-button>
        </template>
      </SearchForm>
    </div>
    <!-- 内容加载封装组件 -->
    <div class="dashboard-content-container">
      <div ref="tableRef">
        <!-- 报表表格 -->
        <BasicTable v-loading="loading" class="table-wrapper" @register="registerTable">
          <template v-slot:headerCell="{ column, $index }">
            {{ column.customTitle }}
            <BasicHelp v-if="column.children" :text="helpMessage[column.customTitle]" />
          </template>
          <template v-slot:bodyCell="{ column, record }">
            <TableCell :column="column" :record="record"></TableCell>
          </template>
        </BasicTable>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { ref, watch, provide } from 'vue';
  import { useTableSearch } from '/@/views/dashboard/hooks/useTableSearch';
  import { useRouteQuery } from '/@/views/dashboard/operate/hooks/useRouteQuery';

  import { columnsOptions, defaultOptionValue } from './config';
  import { getAllOptions } from '../../config';
  import { BasicTable } from '/@/components/Table';
  import TableCell from '/@/views/dashboard/operation/components/TableCell.vue';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { getFctrendDetail } from '/@/api/dashbord/report';
  import { TimeDimension } from '/@/views/dashboard/operate/types';
  import { IOption } from '/@/views/dashboard/types';
  import BasicHelp from '/@/components/Basic/src/BasicHelp.vue';
  import { saveTableDatasToExcel } from '/@/utils/file/download';
  defineOptions({ name: 'dashboard-operation-salesRate-fcTrend-detail' });
  const helpMessage = {
    '20周需求整体对比': '(上周实际 + 本周前19周总预测) / 上周20周总预测 - 1',
    '4周需求对比': '(上周实际 + 本周前4周总预测) / 上周5周总预测 - 1',
  };
  const tableRef = ref<Nullable<HTMLElement>>(null);
  const allOptions = ref<IOption[]>([]);
  const { routeQuery } = useRouteQuery();

  const getParams = () => {
    const dateDim = getDateDimParamsByDate();
    const params = {
      rangeUp30: searchFormValue.rangeUp30,
      orgCode: searchFormValue.orgCode,
      dimension: searchFormValue.timeDimension,
      ...dateDim,
      ...Object.keys(defaultOptionValue).reduce(
        (pre, cur) => ({
          ...pre,
          [cur]: searchFormValue[cur] || '',
        }),
        {},
      ),
    };
    return params;
  };

  // 使用维度搜索表格hooks
  const { loading, searchFormValue, getDateDimParamsByDate, registerTable, handleSearchDebounce, dataSource, columns } = useTableSearch({
    // tableRef,
    columnsOptions,
    defaultDate: dayjs().tz().subtract(1, 'day'),
    isTrendData: false,
    isRangePicker: true,
    isPagination: true,
    isAutoSearch: false,
    colorGroupProps: 'fproduct',
    showPeriodDimension: true,
    defaultSearchFormValue: {
      timeDimension: TimeDimension.WEEK,
      dateRange: [dayjs().tz().subtract(5, 'week'), dayjs().tz()],
      rangeUp30: '',
      ...routeQuery,
    },
    getParams,
    searchApi: getFctrendDetail,
  });

  provide('searchFormValue', searchFormValue);
  provide('getDateDimParams', getDateDimParamsByDate);
  // 设置下拉条件
  const setAllOptions = params => {
    const dateDim = getDateDimParamsByDate();
    getAllOptions({
      orgCode: searchFormValue.orgCode,
      dimension: searchFormValue.timeDimension,
      prodline: searchFormValue.prodline,
      notAll: true,
      ...dateDim,
      ...params,
    }).then(res => {
      allOptions.value = res;
    });
  };
  setAllOptions({ prodline: '' });
  // 监听产品线--改变项目下拉项
  watch([() => searchFormValue.prodline, () => searchFormValue.orgCode, () => searchFormValue.timeDimension, () => searchFormValue.dateRange], () => {
    const dateDim = getDateDimParamsByDate();
    searchFormValue.item = defaultOptionValue.item;
    setAllOptions({
      orgCode: searchFormValue.orgCode,
      dimension: searchFormValue.timeDimension,
      prodline: searchFormValue.prodline,
      ...dateDim,
    });
  });

  // 监听其它项--自动查询
  watch(
    () => searchFormValue,
    () => {
      handleSearchDebounce();
    },
    {
      deep: true,
      immediate: true,
    },
  );
  const exportLoading = ref(false);
  const exportToExcel = () => {
    exportLoading.value = true;
    // 添加类型注解来修复TypeScript问题
    const resCol = columns.value.reduce((pre: any[], cur: any) => {
      if (cur.children) {
        return [...pre, ...cur.children];
      }
      return [...pre, cur];
    }, [] as any[]);
    console.log('🚀 ~ exportToExcel ~ resCol:', resCol);
    console.log('🚀 ~ exportToExcel ~ columns:', columns.value);
    saveTableDatasToExcel({
      columns: resCol,
      tableList: dataSource.value,
      fileName: 'FC趋势明细',
    });
    exportLoading.value = false;
  };
</script>

<style lang="less" scoped>
  @import url('/@/design/dashboard.less');
  @import url('/@/views/dashboard/operation/salesRate/table.less');

  .dashboard-page-container .dashboard-content-container {
    width: 100%;
    padding: 0 24px;
  }
  .table-style(
    @borderColor: #aaa,
    @containerFontSize: 12px,
    @headFontSize: 12px,
    @bodyFontSize: 12px,
    @tdPadding: 3px 6px,
  );
</style>
