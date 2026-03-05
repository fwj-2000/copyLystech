<!-- 每日即时库存 -->
<template>
  <div class="dashboard-page-container flex flex-col">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header flex ct-between">
      <SearchForm
        v-bind="{
          searchFormValue,
          showOrganizeTreeSelect: true,
          organizeKeyword: '1',
          showTimeDimension: false,
          getOrganizationApi: getSyOrganization,
        }">
        <template #right>
          <a-button type="primary" :loading="exportLoading" ghost @click="handleExport">导出</a-button>
          <a-button type="primary" @click="save" class="ml-10px">保存</a-button>
        </template>
      </SearchForm>
    </div>
    <!-- 内容加载封装组件 -->
    <div class="dashboard-content-container h-[100%] flex-shrink-1 p-[16px]">
      <Grid>
        <template #Remark="{ row }">
          <a-textarea v-model:value="row.Remark" :auto-size="{ minRows: 1, maxRows: 1 }" placeholder="请输入备注" allow-clear />
        </template>
      </Grid>
    </div>

    <ExportModal @register="registerExportModal" @export="exportAction" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import dayjs from 'dayjs';
  import { useSearchForm } from '/@/hooks/web/useSearchForm';
  import { column, getExportColumn } from './config';
  import { getkucuntbquerylist, kucuntbexportdata, addorupdateremark } from '/@/api/dashbord/report';
  import { getSyOrganization } from '/@/api/dashbord/operate';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { downloadByUrl } from '/@/utils/file/download';
  import { useModal } from '/@/components/Modal';

  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import ExportModal from '/@/components/ExportModal/index.vue';

  defineOptions({ name: 'dashboard-operate-dailyInventory' });

  const exportLoading = ref(false);

  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      columns: column,
      api: getkucuntbquerylist,
      pagerConfig: {
        autoHidden: false,
      },
      beforeFetch: params => {
        return {
          ...params,
          entDate: searchFormValue.date.format('YYYY-MM-DD'),
          orgCode: searchFormValue.orgCode === 'MQ' ? '' : searchFormValue.orgCode,
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

  const handleExport = () => {
    const exportColumns = getExportColumn();
    openExportModal(true, {
      listQuery: {
        entDate: searchFormValue.date.format('YYYY-MM-DD'),
        orgCode: searchFormValue.orgCode === 'MQ' ? '' : searchFormValue.orgCode,
        ...gridApi.getFetchParams(),
      },
      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
    });
  };

  const getTableData = () => {
    const proxyInfo = gridApi.grid?.getProxyInfo();
    if (proxyInfo && proxyInfo.pager) {
      proxyInfo.pager.currentPage = 1;
    }
    return gridApi.query();
  };
  // 使用维度搜索hooks
  const defaultDate = dayjs().tz();
  const { searchFormValue } = useSearchForm({
    defaultDate,
    isTrendData: true,
    isRangePicker: true,
    defaultSearchFormValue: {
      // orgCode: 'MQ1001001',
      orgCode: '',
    },
    searchReqMth: getTableData,
  });

  const save = async () => {
    const tableList = gridApi.grid.getFullData();
    const saveParam = tableList.map(item => {
      return {
        unionstr: item.Unionstr,
        remark: item.Remark,
      };
    });
    await addorupdateremark(saveParam);
    getTableData();
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
