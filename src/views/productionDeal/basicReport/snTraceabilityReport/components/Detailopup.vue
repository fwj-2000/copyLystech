<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    destroyOnClose
    :cancelText="t('common.cancel')"
    :title="t('common.detailText')"
    class="full-popup p-10px top-0">
    <template #appendToolbar>
      <a-button v-auth="'btn_download'" type="primary" ghost class="ml-12px" @click="handleExport">{{ t('common.exportText') }}</a-button>
    </template>
    <Grid class="mt-20px" style="height: calc(100% - 20px)"> </Grid>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { sntraceExportDetail } from '/@/api/productionDeal/snTraceabilityReport';
  import { detailGridColumn } from '../config';
  import { downloadByUrl } from '/@/utils/file/download';

  const { t } = useI18n();
  const emit = defineEmits(['reload', 'register']);

  const [registerPopup] = usePopupInner(init);

  const [Grid, { reloadData, getDataSource }] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionDeal-basicReport-snTraceabilityReport-detail-list',
      columns: detailGridColumn,
      pagerConfig: {
        autoHidden: false,
      },
      toolbarConfig: {
        enabled: false,
      },
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      i18nConfig: {
        moduleCode: 'SnTraceColumn',
      },
    },
  });

  const handleExport = async () => {
    sntraceExportDetail(getDataSource()).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
    });
  };

  async function init(data) {
    reloadData(data.detailList || []);
  }
</script>
<style lang="less" scoped>
  .full-popup {
    ::v-deep(.vxe-table--body-wrapper) {
      height: auto !important;
    }
  }
</style>
