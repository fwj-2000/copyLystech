<!-- 产销率报表 -->
<template>
  <div class="dashboard-page-container">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header justify-between">
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
              <a-select ref="select" v-model:value="searchFormValue[item.props]" :style="`${item.width ? `width: ${item.width}px;text-align: left` : ''}`">
                <a-select-option v-for="option in item.options" :key="option.value" :value="option.value">
                  {{ option.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <a-button type="primary" :loading="exportLoading" ghost @click="exportToExcel">全部导出</a-button>
        </template>
        <template #timeDimension>
          <a-form-item name="timeDimension">
            <a-select v-model:value="searchFormValue.timeDimension">
              <a-select-option value="week">周</a-select-option>
              <a-select-option value="month">月</a-select-option>
            </a-select>
          </a-form-item>
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
  import { saveTableDatasToExcelByExceljs } from '/@/utils/file/download';

  import { columnsOptions, defaultOptionValue } from './config';
  import { getAllOptions } from '../config';
  import { BasicTable } from '/@/components/Table';
  import TableCell from '/@/views/dashboard/operation/components/TableCell.vue';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { getChanxiaolvGroup } from '/@/api/dashbord/report';
  import { IOption } from '/@/views/dashboard/types';
  import { isEmpty } from 'lodash-es';

  defineOptions({ name: 'dashboard-operation-salesRate-group' });

  const tableRef = ref<Nullable<HTMLElement>>(null);
  const searchFormRef = ref<InstanceType<typeof SearchForm>>();
  const allOptions = ref<IOption[]>([]);
  const exportLoading = ref(false);

  const getParams = () => {
    const dateDim = getDateDimParams();
    const params = {
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
  const { dataSource, columns, loading, searchFormValue, getDateDimParams, registerTable, handleSearchDebounce } = useTableSearch({
    tableRef,
    columnsOptions,
    defaultDate: dayjs().tz().subtract(1, 'day'),
    isTrendData: false,
    isRangePicker: true,
    isPagination: true,
    requestHasPagination: false,
    fetchSetting: {},
    isAutoSearch: true,
    colorGroupProps: 'category',
    showPeriodDimension: true,
    defaultSearchFormValue: {
      dateRange: [dayjs().tz().subtract(4, 'week'), dayjs().tz().add(4, 'week')],
      ...(defaultOptionValue || {}),
    },
    getParams,
    searchApi: getChanxiaolvGroup,
  });

  // 导出excel
  const exportToExcel = () => {
    exportLoading.value = true;
    const dateDim = getDateDimParams();
    saveTableDatasToExcelByExceljs({
      columns: columns.value.reduce((pre, cur) => {
        if (cur.children) {
          return [...pre, ...cur.children];
        }
        return [...pre, cur];
      }, []),
      tableList: dataSource.value,
      fileName: `产销率报表分组${Object.values(dateDim).join('-')}`,
    });
    exportLoading.value = false;
  };

  // 设置下拉条件
  const setAllOptions = () => {
    const dateDim = getDateDimParams();
    getAllOptions({
      orgCode: searchFormValue.orgCode,
      dimension: searchFormValue.timeDimension,
      prodline: searchFormValue.prodline,
      ...dateDim,
    }).then(res => {
      allOptions.value = res;
    });
  };
  setAllOptions();
  // 监听产品线--改变项目下拉项
  watch(
    () => searchFormValue.prodline,
    () => {
      const dateDim = getDateDimParams();
      getAllOptions({
        orgCode: searchFormValue.orgCode,
        dimension: searchFormValue.timeDimension,
        prodline: searchFormValue.prodline,
        ...dateDim,
      }).then(res => {
        const idx = allOptions.value.findIndex(item => item.props === 'item');
        if (idx !== -1) {
          const options = (res.find(item => item.props === 'item') || { options: [] })?.options;
          allOptions.value[idx].options = options;
          if (isEmpty(options)) {
            handleSearchDebounce();
          }
          searchFormValue.item = options[1].value;
        }
      });
    },
  );

  // 监听其它项--自动查询
  watch([() => searchFormValue.item, () => searchFormValue.timeDimension, () => searchFormValue.dateRange, () => searchFormValue.orgCode], () => {
    handleSearchDebounce();
  });
  provide('searchFormValue', searchFormValue);

  onMounted(() => {
    provide('getOrganizeMapInfo', () => searchFormRef.value?.organizeMapInfo);
  });
</script>

<style lang="less" scoped>
  @import url('/@/design/dashboard.less');
  @import url('/@/views/dashboard/operation/salesRate/table.less');

  .table-style(@borderColor: #aaa);
</style>
