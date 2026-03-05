<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <a-tabs class="bg-white" v-model:activeKey="activeKey" destroyInactiveTabPane>
          <a-tab-pane key="0" :tab="t('common.todoText')">
            <HandleProcurement :searchKey="activeKey" ref="handleProcurementRef"></HandleProcurement>
          </a-tab-pane>
          <a-tab-pane key="1" :tab="t('common.doneText')">
            <HandleProcurement :searchKey="activeKey" ref="handleProcurementRef"></HandleProcurement>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <SendEmailPopup @register="registerEmailPopup" @reload="reloadFn" />
    <DetailPopup @register="registerDetailPop" @reload="reloadFn" />
  </div>
</template>
<script setup lang="ts">
  import { usePopup } from '/@/components/Popup';
  import { nextTick, provide, ref } from 'vue';
  import SendEmailPopup from '../components/sendEmailPopup.vue';
  import HandleProcurement from './handleProcurement.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import DetailPopup from '../components/detailPopup/index.vue';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';

  defineOptions({ name: 'engineering-mouldBusiness-procurement' });
  provide('openDetailPopFn', openDetailPopFn);

  const { t } = useI18n();
  const activeKey = ref('0');
  const handleProcurementRef = ref<InstanceType<typeof HandleProcurement>>();
  const [registerDetailPop, { openPopup: openDetailPop }] = usePopup();

  const [registerEmailPopup, { openPopup: openEmailPopup }] = usePopup();

  function reloadFn() {
    console.log('触发了刷新');
    if (!handleProcurementRef.value) return;
    nextTick(() => {
      handleProcurementRef.value?.initFn();
    });
  }

  function openDetailPopFn(data = {}) {
    openDetailPop(true, data);
  }

  function openEmailModuleFn(data = {}) {
    openEmailPopup(true, data);
  }

  provide('openEmailModuleFn', openEmailModuleFn);
  provide('openDetailPopFn', openDetailPopFn);

  useRouteParams({ billNo: {}, tab: {} }, params => {
    const { billNo, tab } = params;
    activeKey.value = tab === '1' ? '1' : '0';
    nextTick(() => {
      billNo && handleProcurementRef.value?.setFormValue({ applyNo: billNo });
    });
  });
</script>

<style lang="less" scoped>
  @import url('/src/design/page.less');

  :deep(.ant-tabs-nav-list) {
    padding: 0 10px !important;
  }
</style>
