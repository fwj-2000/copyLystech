<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <a-tabs class="bg-white" v-model:activeKey="activeKey">
          <a-tab-pane key="0" :tab="t('dict.CommonCol.materialBatch')" v-if="hasBtnP('batch_tab')">
            <handleReview ref="review" :searchKey="activeKey"></handleReview>
          </a-tab-pane>
          <a-tab-pane key="1" :tab="t('dict.CommonCol.item')" v-if="hasBtnP('item_tab')">
            <handleReview ref="review" :searchKey="activeKey"></handleReview>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import handleReview from './review.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
  import { usePermission } from '/@/hooks/web/usePermission';

  defineOptions({ name: 'productionDeal-dieCut-packagePrint' });

  const { hasBtnP } = usePermission();
  const review = ref();

  const activeKey = ref('0');

  onMounted(() => {
    if (!hasBtnP('batch_tab')) {
      activeKey.value = '1';
    }
  });
</script>
<style lang="less" scoped>
  @import url('/@/design/page.less');

  :deep(.ant-tabs-nav-list) {
    padding: 0 10px !important;
  }
</style>
