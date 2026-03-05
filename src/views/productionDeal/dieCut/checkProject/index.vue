<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <a-tabs class="bg-white" v-model:activeKey="activeKey">
          <a-tab-pane key="0" :tab="t('dict.CommonCol.checkProject')">
            <checkProject ref="review" :searchKey="activeKey"></checkProject>
          </a-tab-pane>
          <a-tab-pane key="1" :tab="t('dict.CommonCol.check')">
            <check ref="review" :searchKey="activeKey"></check>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import checkProject from './checkProject.vue';
  import check from './check.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
  import { usePermission } from '/@/hooks/web/usePermission';

  defineOptions({ name: 'productionDeal-dieCut-checkProject' });

  const { hasBtnP } = usePermission();
  const review = ref();

  const activeKey = ref('0');
</script>
<style lang="less" scoped>
  @import url('/@/design/page.less');

  :deep(.ant-tabs-nav-list) {
    padding: 0 10px !important;
  }
</style>
