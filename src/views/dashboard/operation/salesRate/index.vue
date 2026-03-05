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
          <div class="font-bold mr-12px">数据同步延后一天，周一请参考上周周结库存、WOS、DOS</div>
          <a-button type="primary" :loading="exportLoading" ghost @click="exportToExcel">全部导出</a-button>
          <a-button class="ml-12px" type="primary" @click="open = true"
            >无单价料件
            <span v-if="`${totalNo}`">({{ totalNo }})</span>
          </a-button>
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
  <!-- 无单价料件弹窗 -->
  <a-modal
    v-bind="{
      footer: null,
      draggable: false,
    }"
    centered
    v-model:visible="open"
    width="680px"
    bodyStyle="height: 50vh">
    <template #title>
      <div class="flex justify-start">
        <span>当前周无单价料件</span>
        <a-button type="primary" class="ml-12px" :loading="exportNoLoading" ghost @click="exportNo">导出</a-button>
      </div>
    </template>
    <div class="h-[100%]">
      <NoUnitPriceParts ref="noUnitPricePartsRef" :searchFormValue="searchFormValue"></NoUnitPriceParts>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { ref, provide, onMounted, watch } from 'vue';
  import { useTableSearch } from '/@/views/dashboard/hooks/useTableSearch';
  import { columnsOptions } from './config';
  import { saveTableDatasToExcelByExceljs } from '/@/utils/file/download';

  import NoUnitPriceParts from './NoUnitPriceParts.vue';
  import { BasicTable } from '/@/components/Table';
  import TableCell from '/@/views/dashboard/operation/components/TableCell.vue';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { getChanxiaolv, getNofpricedetailcount } from '/@/api/dashbord/report';
  import { TimeDimension } from '../../operate/types';

  defineOptions({ name: 'dashboard-operation-salesRate' });

  const searchFormRef = ref<InstanceType<typeof SearchForm>>();
  const tableRef = ref<Nullable<HTMLElement>>(null);
  const noUnitPricePartsRef = ref<InstanceType<typeof NoUnitPriceParts>>();
  const exportLoading = ref(false);
  const exportNoLoading = ref(false);
  const open = ref(false);
  const totalNo = ref(0);

  const getParams = () => {
    const dateDim = getDateDimParams();
    return {
      orgCode: searchFormValue.orgCode,
      dimension: searchFormValue.timeDimension,
      ...dateDim,
    };
  };
  const date = dayjs().tz();
  const dimension = `${date.year()}WK${date.week().toString().padStart(2, '0')}`;

  // 使用维度搜索表格hooks
  const { dataSource, columns, loading, searchFormValue, getDateDimParams, registerTable, handleSearchDebounce } = useTableSearch({
    tableRef,
    columnsOptions,
    defaultDate: dayjs().tz().subtract(1, 'day'),
    isAutoSearch: false,
    isTrendData: false,
    isRangePicker: true,
    isPagination: false,
    showPeriodDimension: true,
    colorGroupProps: 'category',
    defaultSearchFormValue: {
      orgCode: 'MQ1001001',
      timeDimension: TimeDimension.WEEK,
      dateRange: [dayjs().tz().subtract(4, 'week'), dayjs().tz().add(4, 'week')],
    },
    getParams,
    searchApi: getChanxiaolv,
  });

  // 获取无单价物料总数
  getNofpricedetailcount({ dimension, orgCode: searchFormValue.orgCode }).then(res => {
    totalNo.value = res.data[0].ProductCount;
  });
  const exportNo = () => {
    exportNoLoading.value = true;
    noUnitPricePartsRef.value?.exportNo();
    exportNoLoading.value = false;
  };

  watch(
    () => searchFormValue,
    () => {
      if (!searchFormValue.orgCode) return;
      handleSearchDebounce();
    },
    { deep: true, immediate: true },
  );

  watch(
    () => searchFormValue.orgCode,
    () => {
      // 获取无单价物料总数
      totalNo.value = 0;
      getNofpricedetailcount({ dimension, orgCode: searchFormValue.orgCode }).then(res => {
        totalNo.value = res.data[0].ProductCount;
      });
    },
    { deep: true, immediate: true },
  );

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
      fileName: `产销率周报${Object.values(dateDim).join('-')}`,
    });
    exportLoading.value = false;
  };

  provide('searchFormValue', searchFormValue);

  onMounted(() => {
    provide('getOrganizeMapInfo', () => searchFormRef.value?.organizeMapInfo);
  });
</script>

<style lang="less" scoped>
  @import url('/@/design/dashboard.less');
  @import url('/@/views/dashboard/operation/salesRate/table.less');

  .table-style(@borderColor: #aaa);

  :deep(.lydc-basic-modal .ant-modal .ant-modal-body > .scrollbar) {
    padding: 0 !important;
  }
</style>
