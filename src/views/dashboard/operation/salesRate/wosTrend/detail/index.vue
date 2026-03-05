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
            <a-form-item :name="item.props">
              <a-select ref="select" v-model:value="searchFormValue[item.props]" :style="`${item.width ? `width: ${item.width}px;text-align: left` : ''}`">
                <a-select-option v-for="option in item.options" :key="option.value" :value="option.value">
                  {{ option.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <a-radio-group v-model:value="searchFormValue.categoryType" button-style="solid">
            <a-radio-button value="cpType">成品状态</a-radio-button>
            <a-radio-button value="zzType">+在制状态</a-radio-button>
          </a-radio-group>
          <div class="flex ml-12px">
            <div class="flex px-6px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6"> 状态 </div>
            <a-form-item name="status">
              <a-select ref="select" v-model:value="searchFormValue.status" style="width: 100px; text-align: left">
                <a-select-option v-for="option in statusOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </a-select-option>
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
  import { ref, watch, provide, onMounted } from 'vue';
  import { useTableSearch } from '/@/views/dashboard/hooks/useTableSearch';
  import { useRouteQuery } from '/@/views/dashboard/operate/hooks/useRouteQuery';

  import { columnsOptions, defaultOptionValue } from './config';
  import { getAllOptions } from '../../config';
  import { BasicTable } from '/@/components/Table';
  import TableCell from '/@/views/dashboard/operation/components/TableCell.vue';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { getWostrendDetail, getWostrendDetailState } from '/@/api/dashbord/report';
  import { TimeDimension } from '/@/views/dashboard/operate/types';
  import { IOption } from '/@/views/dashboard/types';
  import { saveTableDatasToExcelProvider } from '/@/utils/file/download';

  defineOptions({ name: 'dashboard-operation-salesRate-wosTrend-detail' });

  const tableRef = ref<Nullable<HTMLElement>>(null);
  const allOptions = ref<IOption[]>([]);
  const { routeQuery } = useRouteQuery();
  const statusOptions = ref<{ label: string; value: string }[]>([]);
  onMounted(() => {
    getWostrendDetailState().then(res => {
      statusOptions.value = [{ label: '全部', value: '' }];
      if (res.code === 200) {
        const options = res.data.map(item => {
          return {
            value: item,
            label: item,
          };
        });
        statusOptions.value.push(...options);
      }
    });
  });
  const getParams = () => {
    const dateDim = getDateDimParamsByDate();
    const params = {
      orgCode: searchFormValue.orgCode,
      dimension: searchFormValue.timeDimension,
      [searchFormValue.categoryType]: searchFormValue.status,
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
    defaultDate: dayjs().subtract(1, 'day'),
    isTrendData: false,
    isRangePicker: true,
    isPagination: true,
    isAutoSearch: false,
    colorGroupProps: 'fproduct',
    showPeriodDimension: true,
    defaultSearchFormValue: {
      timeDimension: TimeDimension.WEEK,
      dateRange: [dayjs().subtract(5, 'week'), dayjs()],
      categoryType: 'cpType',
      ...routeQuery,
    },
    getParams,
    searchApi: getWostrendDetail,
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
    saveTableDatasToExcelProvider({
      columns: columns.value,
      tableList: dataSource.value,
      fileName: 'WOS趋势明细',
      isRowSpan: false,
      isTreeData: true,
      childrenKey: 'children',
    });
    exportLoading.value = false;
  };
</script>

<style lang="less" scoped>
  @import url('/@/design/dashboard.less');
  @import url('/@/views/dashboard/operation/salesRate/table.less');

  .table-style(
    @borderColor: #aaa,
    @containerFontSize: 12px,
    @headFontSize: 12px,
    @bodyFontSize: 12px,
    @tdPadding: 3px 6px,
  );
</style>
