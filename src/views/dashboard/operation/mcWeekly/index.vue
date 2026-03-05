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
          <a-form-item name="mcType">
            <a-select ref="select" v-model:value="searchFormValue.mcType" style="width: 88px; text-align: left">
              <a-select-option v-for="option in productTypeOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
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
  import { ref, provide, onMounted } from 'vue';
  import { useTableSearch } from '/@/views/dashboard/hooks/useTableSearch';
  import { columnsOptions, productTypeOptions, DEFAULT_PRODUCT_TYPE } from './config';

  import { BasicTable } from '/@/components/Table';
  import TableCell from '/@/views/dashboard/operation/components/TableCell.vue';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { getMCWeekly } from '/@/api/dashbord/report';
  import { TimeDimension } from '../../operate/types';

  defineOptions({ name: 'dashboard-operation-mcWeekly' });

  const searchFormRef = ref<InstanceType<typeof SearchForm>>();
  const tableRef = ref<Nullable<HTMLElement>>(null);

  const getParams = () => {
    const dateDim = getDateDimParams();
    return {
      orgCode: searchFormValue.orgCode,
      dimension: searchFormValue.timeDimension,
      mcType: searchFormValue.mcType,
      ...dateDim,
    };
  };

  // 使用维度搜索表格hooks
  const { loading, searchFormValue, getDateDimParams, registerTable } = useTableSearch({
    tableRef,
    columnsOptions,
    defaultDate: dayjs().tz().subtract(1, 'day'),
    isTrendData: false,
    isRangePicker: true,
    isPagination: false,
    showPeriodDimension: true,
    colorGroupProps: 'category',
    defaultSearchFormValue: {
      orgCode: 'MQ',
      mcType: DEFAULT_PRODUCT_TYPE,
      timeDimension: TimeDimension.WEEK,
      dateRange: [dayjs().tz().subtract(7, 'week'), dayjs().tz()],
    },
    getParams,
    searchApi: getMCWeekly,
  });

  provide('searchFormValue', searchFormValue);

  onMounted(() => {
    provide('getOrganizeMapInfo', () => searchFormRef.value?.organizeMapInfo);
  });
</script>

<style lang="less" scoped>
  @import url('../../../../design/dashboard.less');
  @import url('/@/views/dashboard/operation/salesRate/table.less');

  .table-style(@borderColor: #aaa);
</style>
