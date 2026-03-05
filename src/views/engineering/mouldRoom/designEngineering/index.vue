<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <a-tabs class="bg-white" v-model:activeKey="activeKey">
          <a-tab-pane key="0" :tab="t('dict.newMoldStatus.1')">
            <handleReview
              ref="review"
              :searchKey="activeKey"
              @openImportPopFn="batchImportFile"
              @openDetailPopFn="openDetailPopFn"
              @openApplyPopFn="openApplyPopFn"></handleReview>
          </a-tab-pane>
          <a-tab-pane key="1" :tab="t('dict.newMoldStatus.2')">
            <handleReview ref="review" :searchKey="activeKey" @openDetailPopFn="openDetailPopFn" @openApplyPopFn="openApplyPopFn"></handleReview>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <DetailPopup @register="registerDetailPop" @reload="handleRefresh" />
    <ApplyPopup @register="registerApply" @reload="handleRefresh" @close="handleRefresh" />
    <ImportModal @register="registerImportPop" @refresh="handleRefresh" @close="handleRefresh"></ImportModal>
  </div>
</template>
<script setup lang="ts">
  import { ref, nextTick } from 'vue';
  import handleReview from './review.vue';
  import { moldbomGetTemplateDownload, moldbomImportExcel, moldbomSaveBatchData } from '/@/api/engineering/mould';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { ImportModal } from '/@/components/ImportModal';
  import { getColumn, formSchemas, importColumns } from '../moldBOM/config';
  import DetailPopup from './DetailPopup.vue';
  import ApplyPopup from '/@/views/engineering/mouldRoom/moldBOM/components/ApplyPopup.vue';

  const { t } = useI18n();

  defineOptions({ name: 'engineering-mouldRoom-designEngineering' });

  const [registerDetailPop, { openPopup: openDetailPop }] = usePopup();
  const [registerApply, { openPopup: openApplyPop }] = usePopup();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  const review = ref();

  const openDetailPopFn = (record, type) => {
    openDetailPop(true, { ...record, dataSourceType: type });
  };

  const openApplyPopFn = (record, type) => {
    openApplyPop(true, { type: type, record: record });
  };
  function batchImportFile(rows) {
    openImportPopup(true, {
      importPreviewApi: moldbomImportExcel,
      importSaveApi: moldbomSaveBatchData,
      templateApi: moldbomGetTemplateDownload,
      version: '2',
      templateUrl: '/api/Information/moldbom/download/importtemplate',
      previewColumn: importColumns,
      usePolling: false,
      pollingParams: {
        interval: 5000,
      },
      apiParams: {
        importSave: {
          detailId: rows[0].id,
        },
        importPreview: {
          detailId: rows[0].id,
        },
      },
    });
  }
  const handleRefreshByCheckbox = () => {
    review.value.refreshByCheckbox();
  };

  const handleRefresh = () => {
    review.value.refresh();
  };

  const activeKey = ref('0');
</script>
<style lang="less" scoped>
  :deep(.ant-tabs-nav-list) {
    padding: 0 10px !important;
  }
</style>
