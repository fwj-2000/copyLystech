<!-- 每日即时库存 -->
<template>
  <div class="dashboard-page-container flex flex-col">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header flex ct-between">
      <SearchForm
        v-bind="{
          searchFormValue,
          showOrganizeTreeSelect: true,
          showTimeDimension: false,
          getOrganizationApi: getSyOrganization,
        }">
        <template #right>
          <a-form-item name="producNo">
            <a-input v-model:value="searchFormValue.producNo" style="min-width: 88px; text-align: left" placeholder="料号"> </a-input>
          </a-form-item>
          <!--          <a-button type="primary" :loading="exportLoading" ghost @click="handleExport">导出</a-button>-->
          <!--          <a-button type="primary" @click="save" class="ml-10px">保存</a-button>-->
        </template>
      </SearchForm>
    </div>
    <!-- 内容加载封装组件 -->
    <div class="dashboard-content-container h-[100%] flex-shrink-1 p-[16px]">
      <Grid>
        <template #toolbar-actions>
          <a-button :loading="batchExportLoading" @click="handleBatchExport">{{ t('common.batchExport') }}</a-button>
        </template>
        <template #Remark="{ row }">
          <a-textarea v-model:value="row.Remark" :auto-size="{ minRows: 1, maxRows: 1 }" placeholder="请输入备注" allow-clear />
        </template>
      </Grid>
    </div>

    <ExportModal @register="registerExportModal" @export="exportAction" />
  </div>
</template>

<script lang="ts" setup>
  import { provide, ref } from 'vue';
  import dayjs from 'dayjs';
  import { useSearchForm } from '/@/hooks/web/useSearchForm';
  import { column, getExportColumn } from './config';
  import { getkucuntbquerylist, kucuntbexportdata, addorupdateremark, getkucuntbquerydetails } from '/@/api/dashbord/report';
  import { getSyOrganization } from '/@/api/dashbord/operate';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { downloadByUrl } from '/@/utils/file/download';
  import { useModal } from '/@/components/Modal';

  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { dateUtil } from '/@/utils/dateUtil';
  import { isFunction } from 'lodash-es';
  import { useI18n } from '/@/hooks/web/useI18n';

  defineOptions({ name: 'dashboard-operate-dailyInventoryIncludedInTransit' });
  const { t } = useI18n();

  const exportLoading = ref(false);

  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const batchExportLoading = ref(false);

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'dashboard-operate-dailyInventoryIncludedInTransit-list',
      columns: column,
      api: getkucuntbquerydetails,
      pagerConfig: {
        autoHidden: false,
      },
      // type: 'xlsx',
      exportConfig: {
        type: '',
      },
      beforeFetch: params => {
        console.log(params);
        return {
          ...params,
          // ...searchFormValue,
          producNo: searchFormValue.producNo,
          orgCode: searchFormValue.orgCode,
          entDate: dateUtil(searchFormValue.date).format('YYYY-MM-DD'),
        };
      },
    },
  });
  function exportAction(query) {
    kucuntbexportdata(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  }

  const getTableData = () => {
    const proxyInfo = gridApi.grid?.getProxyInfo();
    if (proxyInfo && proxyInfo.pager) {
      proxyInfo.pager.currentPage = 1;
    }
    delete searchFormValue.dateRange;
    delete searchFormValue.period;
    delete searchFormValue.timeDimension;
    console.log(searchFormValue, 'searchFormValuesearchFormValuesearchFormValuesearchFormValue');
    return gridApi.query({
      ...searchFormValue,

      date: null,
    });
  };
  // 使用维度搜索hooks
  const defaultDate = dayjs().tz();
  const { searchFormValue } = useSearchForm({
    defaultSearchFormValue: {
      // orgCode: 'MQ1001001',
      orgCode: 'MQ',
      // dateRange: [dayjs().tz().subtract(5, 'week'), dayjs().tz().subtract(1, 'week')],
    },
    searchReqMth: getTableData,
  });

  // 批量导出
  const handleBatchExport = async () => {
    const { grid } = gridApi;
    // const params = props.tableConfig?.getExportParams?.() ?? {};
    const params = {
      filename: `每日库存_${dateUtil().format('YYYY-MM-DD')}`,
    };
    if (grid) {
      grid.openExport({
        // grid.exportData({
        ...params,
        type: 'xlsx',
        isTitle: true,
        useStyle: true,
        sheetMethod: ({ worksheet }) => {
          worksheet.eachRow(excelRow => {
            excelRow.eachCell(excelCell => {
              excelCell.numFmt = '@';
            });
          });
        },
      });
    }
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
  @import url('/@/design/dashboard.less');

  @borderColor: #ccc;

  .dashboard-content-container {
    height: calc(100% - 60px);

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
