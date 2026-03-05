<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content h-full">
        <a-tabs class="bg-white" v-model:activeKey="activeKey">
          <a-tab-pane key="SAP" :tab="t('dict.CommonCol.SAPLedger')">
            <SAP :activeKey="activeKey" ref="handleReviewRef"></SAP>
          </a-tab-pane>
          <a-tab-pane key="equipmentInventory" :tab="t('dict.CommonCol.equipmentInventoryDetails')">
            <equipmentInventory :activeKey="activeKey" ref="handleReviewRef" :state="state" @handleImport="handleImport"></equipmentInventory>
          </a-tab-pane>
          <a-tab-pane key="ledgerInventory" :tab="t('dict.CommonCol.ledgerInventoryDetails')">
            <ledgerInventory :activeKey="activeKey" ref="handleReviewRef" :state="state"></ledgerInventory>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <ImportModal @register="registerImportPop" @reload="reloadTable" />
  </div>
</template>
<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import SAP from './SAP.vue';
  import equipmentInventory from './equipmentInventory.vue';
  import ledgerInventory from './ledgerInventory.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { ImportModal } from '/@/components/ImportModal';
  import { importColumn } from './config';
  import { useRoute } from 'vue-router';
  import dayjs from 'dayjs';
  import {
    equipmentledgerImport,
    equipmentledgerImportSave,
    importtemplate,
    importtask,
    importtaskdata,
    importtaskcancel,
    importtaskread,
  } from '/@/api/equipment/equipmentLedger';

  const { t } = useI18n();

  defineOptions({ name: 'equipment-equipmentLedger' });

  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();

  const activeKey = ref('SAP');
  const handleReviewRef = ref();

  const importParams = ref({
    factoryArea: '',
    weeks: '',
  });

  const handleImport = data => {
    const weeksDayjs = dayjs(data.weeks);
    const weeks = `${weeksDayjs.endOf('week').year()}-${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}`;
    importParams.value = { ...data, weeks };
    openImportPopup(true, {
      importPreviewApi: equipmentledgerImport,
      importSaveApi: equipmentledgerImportSave,
      templateApi: importtemplate,
      version: '2',
      templateUrl: '/api/Production/equipmentledger/download/importtemplate',
      previewColumn: importColumn,
      usePolling: true,
      pollingParams: {
        interval: 5000,
        getTaskStatus: importtask,
        getTaskDataList: importtaskdata,
        cancelTask: importtaskcancel,
        taskRead: importtaskread,
      },
      apiParams: {
        importSave: { ...data, weeks },
        importPreview: { ...data, weeks },
      },
    });
  };

  const reloadTable = () => {
    handleReviewRef.value.reloadTable(importParams.value);
  };
  const route = useRoute();
  const state = ref({
    weeks: '',
    factoryArea: '',
  });
  onMounted(() => {
    const { type, weeks, factoryArea } = route.query as any;
    if (type) {
      activeKey.value = type;
      state.value = { weeks, factoryArea };
    }
  });
</script>
<style lang="less" scoped>
  @import url('/src/design/page.less');
</style>
