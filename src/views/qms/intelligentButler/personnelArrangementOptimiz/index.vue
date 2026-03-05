<template>
  <a-tabs class="bg-white !h-full" id="personnelArrangementOptimiz" v-model:activeKey="activeKey" destroyInactiveTabPane>
    <a-tab-pane key="0" :tab="t('common.todoText')">
      <Personnel ref="personnelRef" :status="0" @batchImportFile="batchImportFile"></Personnel>
    </a-tab-pane>
    <a-tab-pane key="1" :tab="t('common.doneText')">
      <Personnel ref="personnelRef" :status="1"></Personnel>
    </a-tab-pane>
  </a-tabs>
  <ImportModal @register="registerImportPop" @refresh="reloadTable" @close="reloadTable"></ImportModal>
</template>
<script setup lang="ts">
  import { defineAsyncComponent, ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { ImportModal } from '/@/components/ImportModal';
  defineOptions({ name: 'qms-intelligentButler-personnelArrangementOptimiz' });

  const Personnel = defineAsyncComponent(() => import('./component/Personnel.vue'));
  const { t } = useI18n();
  const activeKey = ref('0');
  const personnelRef = ref();

  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();

  function batchImportFile(data) {
    openImportPopup(true, data);
  }

  function reloadTable() {
    personnelRef.value.reload();
  }
</script>
<style lang="less" scoped>
  :deep(.ant-tabs-nav-list) {
    padding: 0 10px !important;
  }

  :deep .ant-tabs-content {
    height: 100%;
  }
</style>
