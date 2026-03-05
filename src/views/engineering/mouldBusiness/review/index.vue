<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <a-tabs class="bg-white" v-model:activeKey="activeKey" destroyInactiveTabPane>
          <a-tab-pane key="0" :tab="t('common.todoText')">
            <handledReview :searchKey="activeKey" ref="handledReviewRef"></handledReview>
          </a-tab-pane>
          <a-tab-pane key="1" :tab="t('common.doneText')">
            <handledReview :searchKey="activeKey" ref="handledReviewRef"></handledReview>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <DetailPopup @register="registerDetailPop" @reload="reloadFn" />
  </div>
</template>
<script setup lang="ts">
  import { usePopup } from '/@/components/Popup';
  import { provide, ref, nextTick } from 'vue';
  import handledReview from './handledReview.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';

  import DetailPopup from '../components/detailPopup/index.vue';

  const { t } = useI18n();
  defineOptions({ name: 'engineering-mouldBusiness-review' });
  provide('openDetailPopFn', openDetailPopFn);

  const [registerDetailPop, { openPopup: openDetailPop }] = usePopup();
  const activeKey = ref('0');
  const handledReviewRef = ref<InstanceType<typeof handledReview>>();

  function openDetailPopFn(data) {
    openDetailPop(true, data);
  }

  function reloadFn() {
    if (!handledReviewRef.value) return;
    nextTick(() => {
      handledReviewRef.value?.initFn();
    });
  }

  useRouteParams({ billNo: {} }, params => {
    const { billNo } = params;
    billNo && handledReviewRef.value?.setFormValue({ applyNo: billNo });
  });
</script>
<style lang="less" scoped>
  @import url('/src/design/page.less');

  :deep(.ant-tabs-nav-list) {
    padding: 0 10px !important;
  }
</style>
