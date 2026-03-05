<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <a-tabs class="bg-white" v-model:activeKey="activeKey" destroyInactiveTabPane>
          <a-tab-pane key="0" :tab="t('dict.CommonCol.ToBePrinted')">
            <handleLabelPrinting :searchKey="activeKey" ref="handleLabelPrintingRef"></handleLabelPrinting>
          </a-tab-pane>
          <a-tab-pane key="1" :tab="t('dict.CommonCol.Printed')">
            <handleLabelPrinting :searchKey="activeKey" ref="handleLabelPrintingRef"></handleLabelPrinting>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <DetailPopup @register="registerDetail" @reload="reloadFn" />
    <LabelPrintingPopup @register="registerLabelPrinting" @reload="reloadFn" />
  </div>
</template>
<script setup lang="ts">
  import { usePopup } from '/@/components/Popup';
  import { nextTick, provide, ref } from 'vue';
  import handleLabelPrinting from './handleLabelPrinting.vue';
  import DetailPopup from '/@/views/engineering/PCCBeta/components/DetailPopup.vue';
  import LabelPrintingPopup from './components/LabelPrintingPopup.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  defineOptions({ name: 'engineering-sampleGroupBusiness-labelPrinting' });
  provide('openDetailPopFn', openDetailPopFn);
  provide('openLabelPrintingFn', openLabelPrintingFn);

  const { t } = useI18n();
  const activeKey = ref('0');
  const handleLabelPrintingRef = ref();
  const [registerDetail, { openPopup: openDetail }] = usePopup();
  const [registerLabelPrinting, { openPopup: openLabelPrinting }] = usePopup();

  function reloadFn(ref) {
    if (!handleLabelPrintingRef.value) return;
    nextTick(() => {
      handleLabelPrintingRef.value.initFn();
    });
  }

  function openDetailPopFn(data = {}) {
    openDetail(true, data);
  }

  function openLabelPrintingFn(data = {}) {
    openLabelPrinting(true, data);
  }
</script>
<style lang="less" scoped>
  :deep(.ant-tabs-nav-list) {
    padding: 0 10px !important;
  }

  :deep(.ant-tabs) {
    height: 100% !important;
  }

  :deep(.ant-tabs-content) {
    height: 100% !important;
  }
</style>
