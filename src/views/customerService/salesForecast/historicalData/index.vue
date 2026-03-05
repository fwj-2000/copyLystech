<template>
  <div id="customerServiceFcHistoricalData" class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane :key="TABS_ENUM.用户导入" :tab="t('dict.SalesForecastHistory.userImport')">
            <Import />
          </a-tab-pane>
          <a-tab-pane :key="TABS_ENUM.系统整合" :tab="t('dict.SalesForecastHistory.systemIntegration')">
            <Intergration />
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

  defineOptions({ name: 'customerService-salesForecast-historicalData' });

  const Import = defineAsyncComponent(() => import('./components/import/index.vue'));
  const Intergration = defineAsyncComponent(() => import('./components/integration/index.vue'));

  const { t } = useI18n();

  const activeKey = ref<`${TABS_ENUM}`>(TABS_ENUM.用户导入);
</script>

<style lang="less" scoped>
  @import url('/@/design/page.less');
</style>
