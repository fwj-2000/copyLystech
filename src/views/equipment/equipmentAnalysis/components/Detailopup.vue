<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    destroyOnClose
    :cancelText="t('common.cancel')"
    :title="t('dict.CommonCol.equipmentDetails')"
    class="full-popup p-10px top-0">
    <template #appendToolbar>
      <a-button type="primary" v-auth="'btn_download'" ghost class="ml-12px" @click="handleExport">{{ t('common.exportText') }}</a-button>
    </template>
    <Grid class="mt-20px" style="height: calc(100% - 20px)"> </Grid>
  </BasicPopup>
  <ExportModal @register="registerExportModal" @export="exportAction" />
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { countdetailpage, exportcountdetail } from '/@/api/equipment/equipmentLedger';
  import { getDetailGridColumn } from '../config';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { downloadByUrl } from '/@/utils/file/download';

  const { t } = useI18n();
  const emit = defineEmits(['reload', 'register']);

  const [registerPopup] = usePopupInner(init);
  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();

  const searchParams = ref<any>({});

  const [Grid, { reload, getFetchParams }] = useVbenVxeGrid({
    gridOptions: {
      id: 'equipment-equipmentAnalysis-detail-list',
      columns: getDetailGridColumn(),
      api: countdetailpage,
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
        moduleCode: 'EquipmentLedgerColumn',
      },
      beforeFetch: params => {
        return {
          ...params,
          ...searchParams.value,
        };
      },
    },
  });

  const handleExport = async () => {
    openExportModal(true, {
      listQuery: {
        ...(await getFetchParams()),
        ...searchParams.value,
      },
      exportOptions: getDetailGridColumn(),
      nameProps: 'title',
      idProps: 'field',
    });
  };
  const exportAction = query => {
    exportcountdetail(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  };

  async function init(params) {
    searchParams.value = params;
    reload();
  }
</script>
<style lang="less" scoped>
  .full-popup {
    ::v-deep(.vxe-table--body-wrapper) {
      height: auto !important;
    }
  }
</style>
