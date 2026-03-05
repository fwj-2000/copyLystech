<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs class="h-full" v-model:activeKey="activeKey">
          <a-tab-pane key="0" :tab="t('common.todoText')">
            <handleList :searchKey="activeKey" ref="handleReviewRef"></handleList>
          </a-tab-pane>
          <a-tab-pane key="1" :tab="t('common.doneText')">
            <handleList :searchKey="activeKey" ref="handleReviewRef"></handleList>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <uploadPaperPopup @register="registerPaperPopup" @reload="reloadFn" />
    <AddProcessBindPopup @register="registerProcessBind" @refresh="enableWorkOrderFn"></AddProcessBindPopup>
    <detailPopup @register="registerDetailPop" @reload="reloadFn" />
  </div>
</template>
<script setup lang="ts">
  import { usePopup } from '/@/components/Popup';
  import { nextTick, provide, ref } from 'vue';
  import handleList from './list.vue';
  import detailPopup from './detailPopup.vue';
  import uploadPaperPopup from './uploadPaperPopup.vue';
  import AddProcessBindPopup from '/@/views/productionPlan/processBind/components/addPopup.vue';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useRouter } from 'vue-router';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';

  const { t } = useI18n();
  const router = useRouter();
  const { setTitle } = useTabs(router);
  setTitle(router.currentRoute.value.fullPath.includes('program') ? t('routes.engineering-mouldRoom-program') : t('routes.engineering-mouldRoom-design'));

  defineOptions({ name: 'engineering-mouldRoom-design' });

  const activeKey = ref('0');
  const handleReviewRef = ref<InstanceType<typeof handleList>>();
  const [registerDetailPop, { openPopup: openDetailPop }] = usePopup();
  const [registerProcessBind, { openPopup: openProcessBind }] = usePopup();
  const [registerPaperPopup, { openPopup: openPaperPopup }] = usePopup();

  function reloadFn() {
    if (!handleReviewRef.value) return;
    handleReviewRef.value.initFn();
    console.log('触发了刷新');
    if (!handleReviewRef.value) return;
    nextTick(() => {
      handleReviewRef.value?.initFn();
    });
  }

  function enableWorkOrderFn() {
    if (!handleReviewRef.value) return;
    handleReviewRef.value.enableWorkOrderFn();
  }

  function openDetailPopFn(data = {}) {
    openDetailPop(true, data);
  }

  function openPaperModuleFn(data = {}) {
    openPaperPopup(true, data);
  }

  function openProcessBindFn(data = {}) {
    openProcessBind(true, data);
  }

  provide('openProcessBindFn', openProcessBindFn);
  provide('openEmailModuleFn', openPaperModuleFn);
  provide('openDetailPopFn', openDetailPopFn);

  useRouteParams({ billNo: {} }, params => {
    const { billNo } = params;
    billNo && handleReviewRef.value?.setFormValue({ applyNo: billNo });
  });
</script>
<style lang="less" scoped>
  :deep(.ant-tabs-nav-list) {
    padding: 0 10px !important;
  }

  :deep(.ant-tabs-content) {
    height: 100% !important;
  }
</style>
