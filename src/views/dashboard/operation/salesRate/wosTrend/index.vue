<!-- WOS趋势 -->
<template>
  <div class="dashboard-page-container">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header">
      <SearchForm
        ref="searchFormRef"
        v-bind="{
          searchFormValue,
          organizeKeyword: '1',
          showOrganizeTreeSelect: true,
          showTimeDimension: false,
          isRangePicker: true,
        }">
        <template #right>
          <div v-for="(item, idx) in allOptions" :key="idx" class="flex">
            <div class="flex px-6px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6">
              {{ item.text }}
            </div>
            <a-form-item name="isBian">
              <a-select
                ref="select"
                v-model:value="searchFormValue[item.props]"
                :style="`${item.width ? `min-width: ${item.width}px;text-align: left` : ''}`"
                :dropdownMatchSelectWidth="false">
                <a-select-option v-for="option in item.options" :key="option.value" :value="option.value">
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
  import { ref, provide, onMounted, watch } from 'vue';
  import { useTableSearch } from '/@/views/dashboard/hooks/useTableSearch';
  import { columnsOptions } from './config';
  import { getAllOptions, defaultOptionValue } from '../config';

  import { BasicTable } from '/@/components/Table';
  import TableCell from '/@/views/dashboard/operation/components/TableCell.vue';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { getWostrend } from '/@/api/dashbord/report';
  import { TimeDimension } from '/@/views/dashboard/operate/types';
  import { IOption } from '/@/views/dashboard/types';
  import { useRouteParams } from '/@/views/dashboard/commonHooks/useRouteParams';
  import { PRODAND_ORG_CODE_KEY } from '/@/views/dashboard/operation/productionAndSalesRate/config';
  import { saveTableDatasToExcel } from '/@/utils/file/download';

  defineOptions({ name: 'dashboard-operation-salesRate-wosTrend' });

  const searchFormRef = ref<InstanceType<typeof SearchForm>>();
  const tableRef = ref<Nullable<HTMLElement>>(null);
  const allOptions = ref<IOption[]>([]);
  const { dateRange, ...res } = useRouteParams().getParams();

  const getParams = () => {
    const dateDim = getDateDimParams();
    return {
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
      ...res,
    };
  };

  // 使用维度搜索表格hooks
  const { loading, searchFormValue, getDateDimParams, registerTable, dataSource, columns } = useTableSearch({
    tableRef,
    columnsOptions,
    defaultDate: dayjs().subtract(1, 'day'),
    isTrendData: false,
    isRangePicker: true,
    isPagination: true,
    requestHasPagination: false,
    showPeriodDimension: true,
    colorGroupProps: 'category',
    defaultSearchFormValue: {
      // orgCode: 'MQ',
      // timeDimension: TimeDimension.WEEK,
      // dateRange: [dayjs().subtract(5, 'week'), dayjs()],
      orgCode: res.orgCode || localStorage.getItem(PRODAND_ORG_CODE_KEY),
      timeDimension: res.dimension ?? TimeDimension.WEEK,
      dateRange: dateRange ?? [dayjs().tz().subtract(5, 'week'), dayjs().tz()],
      prodline: res.prodline ?? '',
      item: res.item ?? '',
      newOldProject: res.newOldProject ?? '',
    },
    getParams,
    searchApi: getWostrend,
  });

  provide('searchFormValue', searchFormValue);

  onMounted(() => {
    provide('getOrganizeMapInfo', () => searchFormRef.value?.organizeMapInfo);
  });

  // 设置下拉条件
  const setAllOptions = params => {
    const dateDim = getDateDimParams();
    getAllOptions({
      orgCode: localStorage.getItem(PRODAND_ORG_CODE_KEY) || searchFormValue.orgCode,
      dimension: searchFormValue.timeDimension,
      prodline: searchFormValue.prodline,
      ...dateDim,
      ...params,
    }).then(res => {
      allOptions.value = res;
    });
  };
  setAllOptions({ prodline: '' });
  // 监听产品线--改变项目下拉项
  watch([() => searchFormValue.prodline, () => searchFormValue.orgCode, () => searchFormValue.timeDimension, () => searchFormValue.dateRange], () => {
    localStorage.setItem(PRODAND_ORG_CODE_KEY, searchFormValue.orgCode ?? '');
    const dateDim = getDateDimParams();
    searchFormValue.item = defaultOptionValue.item;
    setAllOptions({
      orgCode: searchFormValue.orgCode,
      dimension: searchFormValue.timeDimension,
      prodline: searchFormValue.prodline,
      period: searchFormValue.newOldProject,
      ...dateDim,
    });
  });
  watch([() => searchFormValue.newOldProject], () => {
    const dateDim = getDateDimParams();
    getAllOptions({
      orgCode: localStorage.getItem(PRODAND_ORG_CODE_KEY) || searchFormValue.orgCode,
      dimension: searchFormValue.timeDimension,
      prodline: searchFormValue.prodline,
      period: searchFormValue.newOldProject,
      ...dateDim,
    }).then(res => {
      const idx = allOptions.value.findIndex(item => item.props === 'item');
      if (idx !== -1) {
        const options = (res.find(item => item.props === 'item') || { options: [] })?.options;
        allOptions.value[idx].options = options;
      }
    });
  });
  const exportLoading = ref(false);
  const exportToExcel = () => {
    exportLoading.value = true;
    saveTableDatasToExcel({
      columns: columns.value,
      tableList: dataSource.value,
      fileName: 'WOS趋势',
    });
    exportLoading.value = false;
  };
</script>

<style lang="less" scoped>
  @import url('/@/design/dashboard.less');
  @import url('/@/views/dashboard/operation/salesRate/table.less');

  .table-style(@borderColor: #aaa);
</style>
