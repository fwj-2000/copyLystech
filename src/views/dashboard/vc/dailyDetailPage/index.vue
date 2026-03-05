<!-- 费用目标 -->
<template>
  <TableLayout>
    <template #toolbarLeft>
      <a-button type="primary" :loading="exportLoading" @click="handleExport">{{ t('common.downloadTemplate') }}</a-button>
    </template>
    <template #toolbarRight>
      <a-button type="primary" @click="syncDataDele">{{ t('common.batchDelText') }}</a-button>
      <a-popconfirm @confirm="syncDataPost" type="primary" :title="t('dict.CommonCol.performSynchronousData')">
        <a-button type="primary">{{ t('dict.CommonCol.synchronizeData') }}</a-button>
      </a-popconfirm>
      <span>{{ t('dict.vc.afterUploadTips') }}</span>
    </template>
  </TableLayout>
</template>

<script lang="ts" setup>
  import { isEmpty } from 'lodash-es';
  import { reactive, ref, onMounted, watch } from 'vue';
  import { getAllColumns, formOptions, batchMenuItems } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getDailyDetailPage, getProjectParam, exportDailyDetail, postSyncData, delDailyReport } from '/@/api/dashbord/vc';
  import type { VxeGridProps } from 'vxe-table';
  import { downloadByUrl } from '/@/utils/file/download';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();

  defineOptions({ name: 'dashboard-vc-dailyDetailPage' });
  const columns = ref(getAllColumns());
  const exportLoading = ref(false);
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dashboard-vc-dailyDetailPage-list',
    proxyConfig: {
      response: {
        list: 'data.list',
        total: 'data.pagination.total',
      },
    },
  });
  const handleDailyDetailPage = async params => {
    try {
      const res = await getDailyDetailPage(params);
      const dataList = res.data?.list || [];
      const allColumns = getAllColumns();
      const updateTableColumns = () => {
        tableConfig.tableConfig.columns = dataList.length ? allColumns : allColumns.filter(item => item.field !== 'dynamicFields');
      };
      updateTableColumns();
      return res;
    } catch (error) {
      console.error('获取日报详情失败:', error);
      throw error;
    }
  };

  const tableConfig = reactive({
    formConfig: {
      formOptions,
    },
    tableConfig: {
      columns: columns.value,
      attrs,
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { timeDate, endDim } = getFormParams();
        const filename = `每日报表${endDim}`;
        return {
          filename,
        };
      },
      api: handleDailyDetailPage,
    },
    toolbarConfig: {
      batchMenuItems,
    },
  });

  const [TableLayout, api] = useTableLayout(tableConfig);

  onMounted(() => {
    const { state } = api.searchFormApi;
    // 拉取项目下拉
    watch(
      [() => state.searchLoading, () => state.searchFormValue.startDim, () => state.searchFormValue.endDim],
      () => {
        if (!state.searchLoading && !isEmpty(state.searchFormValue)) {
          getDimensionWordNoSearchparameterInfo();
        }
      },
      { immediate: true, deep: true },
    );
  });

  // 获取查询参数信息
  function getDimensionWordNoSearchparameterInfo() {
    const { state, getFormParams, setState } = api.searchFormApi;
    // const { timeDate } = getFormParams();
    getProjectParam({
      time: '',
    }).then(({ data }) => {
      const keyIdx = formOptions.findIndex(item => item.key === 'project');
      if (state.formOptions[keyIdx]) {
        const options = data.map(item => ({
          text: item,
          value: item,
        }));
        setState(`formOptions.${keyIdx}.options`, options);
      }
    });
  }

  const handleExport = async () => {
    exportLoading.value = true;
    const { getFormParams } = api.searchFormApi;
    const res = await exportDailyDetail(getFormParams());
    exportLoading.value = false;
    if (!res.data.url) return;
    downloadByUrl({ url: res.data.url });
  };
  async function syncDataPost() {
    await postSyncData();
  }

  async function syncDataDele() {
    const gridInstance = api.getGridInstance();
    const ids = gridInstance.getCheckboxRecords().map(item => item.id);
    if (!ids.length) {
      createMessage.warning(t('dict.keyProcess.project'));
      return;
    }
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.delTip'),
      onOk: async () => {
        try {
          const { code } = await delDailyReport(ids);
          if (code == 200) {
            createMessage.success(t('common.delSuccess'));
          } else {
            createMessage.error('删除失败');
          }
        } catch (e) {
          createMessage.error('删除失败');
        } finally {
          gridInstance.clearCheckboxRow();
          gridInstance.commitProxy('reload');
        }
      },
    });
  }
</script>

<style lang="less" scoped>
  @import url('/@/views/dataAnalysis/style.less');
</style>
