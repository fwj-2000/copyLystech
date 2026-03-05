<template>
  <div id="businessFcRequirement" class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane :key="TABS_ENUM.草稿" :tab="t('common.draft')">
            <Draft />
          </a-tab-pane>
          <a-tab-pane :key="TABS_ENUM.已提交" :tab="t('common.submitted')">
            <Submited />
          </a-tab-pane>
          <a-tab-pane :key="TABS_ENUM.已转化" :tab="t('common.converted')">
            <Transformed />
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, defineAsyncComponent } from 'vue';
  import { TABS_ENUM } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';

  defineOptions({ name: 'business-salesForecast-requirement' });

  const Draft = defineAsyncComponent(() => import('./components/draft/index.vue'));
  const Submited = defineAsyncComponent(() => import('./components/submited/index.vue'));
  const Transformed = defineAsyncComponent(() => import('./components/transformed/index.vue'));

  const { t } = useI18n();
  const activeKey = ref<`${TABS_ENUM}`>(TABS_ENUM.草稿);
</script>

<style lang="less" scoped>
  @import url('/src/design/page.less');

  :deep(.lydc-basic-popup-header) {
    padding-left: 12px;
  }
</style>
