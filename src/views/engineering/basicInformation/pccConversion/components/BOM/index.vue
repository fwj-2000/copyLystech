<template>
  <div v-loading="loading" class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_syncToSap'" type="primary" @click="handleSyncToSap">{{ t('common.syncSap') }}</a-button>
            <a-button v-auth="'btn_download'" @click="() => handleExport(1)">{{ t('common.batchExport') }}</a-button>
            <a-button v-auth="'btn_zhengzhouDownload'" @click="() => handleExport(2)">{{ t('dict.bomtosap.zhengzhouExport') }}</a-button>
          </template>
        </Grid>
      </div>
    </div>
    <ExportModal @register="registerExportModal" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { omit } from 'lodash-es';
  import { getBomtosap, exportExcel, syncToSAP } from '/@/api/engineering/pccConversion';
  import { getFormConfig, getColumn } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { downloadFiles } from '../../config';
  import { useMessage } from '/@/hooks/web/useMessage';

  import ExportModal from '/@/components/ExportModal/index.vue';

  const [registerExportModal, { openModal: openExportModal }] = useModal();

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const loading = ref(false);

  const [Grid, gridApi] = useVbenVxeGrid({
    showSearchForm: false,
    formOptions: {
      collapsed: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: true,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getFormConfig(),
      // i18nConfig: {
      //   moduleCode: 'SampleApplyColumn',
      //   transferRange: ['placeholder'],
      // },
    },
    gridOptions: {
      id: 'engineering-basicInformation-pccConversion-bom',
      columns: getColumn(),
      api: getBomtosap,
      beforeFetch: (params: any) => {
        return { ...params, bomVersion: params.optionalBOM };
      },
      pagerConfig: {
        autoHidden: false,
      },
      toolbarConfig: {
        superQuery: true,
      },
      // i18nConfig: {
      //   moduleCode: 'SampleApplyColumn',
      // },
    },
  });

  // const { getFetchParams } = gridApi;

  // 导出
  const handleExport = async (exporType: number) => {
    const filters = gridApi.grid.getCheckedFilters();
    const params = {};
    filters.forEach(item => {
      params[item.field] = item.datas[0];
    });
    const { pager } = gridApi.grid.getProxyInfo()!;

    openExportModal(true, {
      api: exportExcel,
      listQuery: { ...params, ...omit(pager, 'total'), exporType },
      selectIds: gridApi.getSelectRowKeys(),
      // exportOptions: getColumn()
      //   .slice(2)
      //   .filter(item => item.field),
      nameProps: 'title',
      idProps: 'field',
      customDownload: downloadFiles,
      // i18nConfig: {
      //   moduleCode: 'SampleApplyColumn',
      // },
    });
  };

  /**
   * 同步到SAP
   */
  async function handleSyncToSap() {
    const ids = gridApi.getSelectRowKeys();

    if (ids.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    }

    // gridApi.setLoading(true);
    loading.value = true;
    return syncToSAP({ selectIds: ids.join(',') })
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
      })
      .finally(() => {
        setTimeout(() => {
          loading.value = false;
          gridApi.query();
        }, 500);
        // gridApi.setLoading(false);
      });
  }
</script>

<style lang="less" scoped>
  :deep(.ant-spin-dot.ant-spin-dot-spin) {
    height: 24px;
    width: 24px;
  }
</style>
