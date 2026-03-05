<!-- 产销率报表 -->
<template>
  <div class="dashboard-page-container">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header">
      <SearchForm
        ref="searchFormRef"
        v-bind="{
          searchFormValue,
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
  import { ref, provide, onMounted } from 'vue';
  import { useTableSearch } from '/@/views/dashboard/hooks/useTableSearch';
  import { useRoute } from 'vue-router';
  import { allDefaultOption, getAllOptions, getColumnsOptions } from './config';
  import { EModuleCode } from '../config';

  import { BasicTable } from '/@/components/Table';
  import TableCell from '/@/views/dashboard/operation/components/TableCell.vue';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { getMCWeeklyDetails } from '/@/api/dashbord/report';
  import { TimeDimension } from '/@/views/dashboard/operate/types';
  import { IColumnOptions, IOption } from '/@/views/dashboard/types';

  defineOptions({ name: 'dashboard-operation-mcWeekly-detail' });

  const route = useRoute();
  const { query: routeQuery = {} } = route;
  const { moduleCode = EModuleCode.STORAGE } = routeQuery as Record<string, any>;

  const searchFormRef = ref<InstanceType<typeof SearchForm>>();
  const tableRef = ref<Nullable<HTMLElement>>(null);
  const allOptions = ref<IOption[]>([]);
  const columnsOptions = ref<IColumnOptions[]>(getColumnsOptions(moduleCode));

  const getParams = () => {
    const dateDim = getDateDimParams();
    return {
      orgCode: searchFormValue.orgCode,
      moduleCode: searchFormValue.moduleCode,
      ...allOptions.value.reduce(
        (pre, cur) => ({
          ...pre,
          [cur.props]: searchFormValue[cur.props] || allDefaultOption[cur.props] || cur.default || '',
        }),
        {},
      ),
      ...dateDim,
    };
  };

  // 使用维度搜索表格hooks
  const { loading, searchFormValue, getDateDimParams, registerTable } = useTableSearch({
    tableRef,
    columnsOptions: columnsOptions.value,
    defaultDate: dayjs().tz().subtract(1, 'day'),
    isTrendData: false,
    isRangePicker: true,
    isPagination: true,
    showPeriodDimension: true,
    colorGroupProps: 'matnr',
    defaultSearchFormValue: {
      timeDimension: TimeDimension.DAY,
      ...allDefaultOption,
      ...routeQuery,
    },
    getParams,
    searchApi: getMCWeeklyDetails,
  });

  // 设置下拉条件
  const setAllOptions = () => {
    const dateDim = getDateDimParams();
    getAllOptions({
      orgCode: searchFormValue.orgCode,
      moduleCode: searchFormValue.moduleCode,
      ...dateDim,
    }).then(res => {
      allOptions.value = res;
      // 默认选择第一个选项
      // res.forEach(item => {
      //   if (item.options.length) {
      //     searchFormValue[item.props] = item?.default || '';
      //   }
      // });
      // console.log('allOptions: ', allOptions);
    });
  };
  setAllOptions();

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
