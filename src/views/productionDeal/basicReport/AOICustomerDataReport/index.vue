<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <a-tabs class="bg-white" v-model:activeKey="activeKey">
          <a-tab-pane key="0" :tab="t('common.submitTodo')">
            <handleReview :searchKey="activeKey" ref="handleReviewRef"></handleReview>
          </a-tab-pane>
          <a-tab-pane key="1" :tab="t('common.pending')">
            <handleReview :searchKey="activeKey" ref="handleReviewRef"></handleReview>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('dict.CommonCol.toBeSent')">
            <handleReview :searchKey="activeKey" ref="handleReviewRef"></handleReview>
          </a-tab-pane>
          <a-tab-pane key="3" :tab="t('common.sent')">
            <handleReview :searchKey="activeKey" ref="handleReviewRef"></handleReview>
          </a-tab-pane>
          <a-tab-pane key="4" :tab="t('dict.CommonCol.all')">
            <handleReview :searchKey="activeKey" ref="handleReviewRef"></handleReview>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import handleReview from './review.vue';

  const { t } = useI18n();

  defineOptions({ name: 'productionDeal-basicReport-AOICustomerDataReport' });

  const activeKey = ref('0');
  const handleReviewRef = ref();
</script>
<style lang="less" scoped>
  @import url('/src/design/page.less');

  ::v-deep(textarea) {
    resize: none; /* 禁止拖动改变大小 */
  }
</style>
