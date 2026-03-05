<template>
  <div id="businessFcConfirm" class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane :key="TABS_ENUM.待确认" :tab="t('common.unconfirmed')">
            <Unconfirmed />
          </a-tab-pane>
          <a-tab-pane :key="TABS_ENUM.已确认" :tab="t('common.confirmed')">
            <Confirmed />
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

  defineOptions({ name: 'business-salesForecast-confirm' });

  const Unconfirmed = defineAsyncComponent(() => import('./components/unconfirmed/index.vue'));
  const Confirmed = defineAsyncComponent(() => import('./components/confirmed/index.vue'));

  const activeKey = ref<`${TABS_ENUM}`>(TABS_ENUM.待确认);
  const { t } = useI18n();
</script>
<style lang="less" scoped>
  @import url('/src/design/page.less');

  :deep(.lydc-basic-popup-header) {
    padding-left: 12px;
  }
</style>
