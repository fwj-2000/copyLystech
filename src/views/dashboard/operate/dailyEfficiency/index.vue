<!-- 模切每日效率 -->
<template>
  <div class="dashboard-page-container">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header flex ct-between">
      <SearchForm
        v-bind="{
          searchFormValue,
          organizeKeyword: '1',
          showOrganizeTreeSelect: true,
          showTimeDimension: false,
          isRangePicker: false,
        }">
      </SearchForm>
      <a-button type="primary" :loading="exportLoading" ghost @click="exportToExcel">导出</a-button>
    </div>
    <!-- 内容加载封装组件 -->
    <div class="dashboard-content-container">
      <SpinContent
        v-bind="{
          isEmptyData,
          isRequestError,
          showList: false,
        }">
        <!-- 报表表格 -->
        <BasicTable class="table-wrapper" @register="registerTable"> </BasicTable>
      </SpinContent>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { Ref, computed, ref, watch } from 'vue';
  import { BasicColumn, PaginationProps, useTable } from '/@/components/Table';
  import { useSearchForm } from '/@/hooks/web/useSearchForm';
  import { getMqefficiencyservice } from '/@/api/dashbord/report';
  import { saveTableDatasToExcel } from '/@/utils/file/download';

  import { ColumnsOption, DownloadColumnsOption } from './config';
  import { BasicTable } from '/@/components/Table';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import { useDebounceFn } from '@vueuse/core';

  defineOptions({ name: 'dashboard-operate-dailyEfficiency' });

  const exportLoading = ref(false);
  // 导出excel
  const exportToExcel = async () => {
    exportLoading.value = true;
    const { data = {} } =
      (await getMqefficiencyservice({
        orgCode: searchFormValue.orgCode,
        startTime: searchFormValue.date.valueOf(),
        endTime: searchFormValue.date.valueOf(),
      })) || {};
    const { list = [] } = data;
    saveTableDatasToExcel({
      columns: DownloadColumnsOption,
      tableList: list,
      fileName: '模切每日效率',
    });
    exportLoading.value = false;
  };

  // 表头配置
  const columns = ref<BasicColumn[]>(ColumnsOption);

  // 分页配置
  const paginationInfo: Ref<PaginationProps> = ref({
    current: 1,
    pageSize: 100,
    total: 0,
    pageSizeOptions: ['100', '500', '1000'],
  });

  // 使用维度搜索hooks
  const { searchFormValue, isRequestError, isEmptyData } = useSearchForm({
    defaultDate: dayjs().tz().subtract(1, 'day'),
  });

  // 搜索条件
  const searchInfo = computed(() => {
    return {
      isPage: true,
      orgCode: searchFormValue.orgCode,
      startTime: searchFormValue.date.valueOf(),
      endTime: searchFormValue.date.valueOf(),
    };
  });

  // 注册表格hook
  const [registerTable, { reload }] = useTable({
    api: getMqefficiencyservice,
    columns,
    pagination: paginationInfo,
    useSearchForm: false,
    showTableSetting: false,
    showIndexColumn: false,
    bordered: true,
    striped: true,
    searchInfo,
    fetchSetting: {
      listField: 'list.list',
      totalField: 'list.pagination.total',
    },
    immediate: false,
  });

  const reloadFn = useDebounceFn(reload, 500);
  watch(
    () => searchInfo,
    () => {
      reloadFn();
    },
    { deep: true },
  );
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

  :deep(.ant-table-container) {
    font-size: 12px;
    font-weight: 700;
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
    font-weight: 700;

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
