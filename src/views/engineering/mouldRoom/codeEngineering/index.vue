<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <a-tabs class="bg-white" v-model:activeKey="activeKey">
          <a-tab-pane key="0" :tab="t('dict.newMoldStatus.1')">
            <handleReview :searchKey="activeKey" ref="handleReviewRef"></handleReview>
          </a-tab-pane>
          <a-tab-pane key="1" :tab="t('dict.newMoldStatus.2')">
            <handleReview :searchKey="activeKey" ref="handleReviewRef"></handleReview>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <detailPopup @register="registerDetailPop" />
    <AddProcessBindPopup @register="registerProcessBind" @refresh="enableWorkOrderFn"></AddProcessBindPopup>
    <PrintPop @register="registerPrintPop" />
  </div>
</template>
<script setup lang="ts">
  import { usePopup } from '/@/components/Popup';
  import { provide, ref } from 'vue';
  import handleReview from './review.vue';
  import detailPopup from './detailPopup.vue';
  import AddProcessBindPopup from '/@/views/productionPlan/processBind/components/processMaintenance/addPopup.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import PrintPop from './components/printPop.vue';

  const { t } = useI18n();

  defineOptions({ name: 'engineering-mouldRoom-codeEngineering' });
  provide('openDetailPopFn', openDetailPopFn);

  const activeKey = ref('0');
  const handleReviewRef = ref();
  const [registerDetailPop, { openPopup: openDetailPop }] = usePopup();
  const [registerProcessBind, { openPopup: openProcessBind }] = usePopup();
  const [registerPrintPop, { openPopup: openPrintPop }] = usePopup();

  function enableWorkOrderFn() {
    if (!handleReviewRef.value) return;
    handleReviewRef.value.enableWorkOrderFn();
  }

  function openDetailPopFn(data = {}) {
    openDetailPop(true, data);
  }

  function openProcessBindFn(data = {}) {
    openProcessBind(true, data);
  }

  function openPrintPopFn(data = {}) {
    openPrintPop(true, data);
  }

  provide('openProcessBindFn', openProcessBindFn);
  provide('openDetailPopFn', openDetailPopFn);
  provide('openPrintPopFn', openPrintPopFn);
</script>
<style lang="less" scoped>
  :deep(.ant-tabs-nav-list) {
    padding: 0 10px !important;
  }
</style>
