<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <a-tabs class="bg-white" v-model:activeKey="activeKey" destroyInactiveTabPane>
          <a-tab-pane key="0" :tab="t('common.todoText')">
            <handleRequireDelivery :searchKey="activeKey" ref="handleRequireDeliveryRef"></handleRequireDelivery>
          </a-tab-pane>
          <a-tab-pane key="1" :tab="t('common.doneText')">
            <handleRequireDelivery :searchKey="activeKey" ref="handleRequireDeliveryRef"></handleRequireDelivery>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <DetailPopup @register="registerDetail" @reload="reloadFn" />
    <deliveryDateResponsePopup @register="registerDeliveryDateResponse" @reload="reloadFn" />
  </div>
</template>
<script setup lang="ts">
  import { usePopup } from '/@/components/Popup';
  import { nextTick, provide, ref } from 'vue';
  import handleRequireDelivery from './handleRequireDelivery.vue';
  import DetailPopup from '/@/views/engineering/PCCBeta/components/DetailPopup.vue';
  import deliveryDateResponsePopup from './components/deliveryDateResponsePopup.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  defineOptions({ name: 'engineering-sampleGroupBusiness-requireDelivery' });
  provide('openDetailPopFn', openDetailPopFn);
  provide('openDeliveryDateResponseFn', openDeliveryDateResponseFn);

  const { t } = useI18n();
  const activeKey = ref('0');
  const handleRequireDeliveryRef = ref();
  const [registerDetail, { openPopup: openDetail }] = usePopup();
  const [registerDeliveryDateResponse, { openPopup: openDeliveryDateResponse }] = usePopup();

  function reloadFn(ref) {
    if (!handleRequireDeliveryRef.value) return;
    console.log('刷新ing...............');
    nextTick(() => {
      handleRequireDeliveryRef.value.initFn();
    });
  }

  function openDetailPopFn(data = {}) {
    openDetail(true, data);
  }

  function openDeliveryDateResponseFn(data = {}) {
    openDeliveryDateResponse(true, data);
  }
</script>
<style lang="less" scoped>
  :deep(.ant-tabs-nav-list) {
    // padding: 0 10px !important;
    padding-left: 20px;
  }

  :deep(.lydc-content-wrapper-content) {
    .vxe-grid {
      padding-top: 0;
    }

    .ant-tabs.ant-tabs-top,
    .ant-tabs-content.ant-tabs-content-top {
      height: 100%;
    }

    .vxe-form--wrapper .vxe-form--item:first-child .vxe-form--item-content {
      padding-left: 0;
    }
  }
</style>
