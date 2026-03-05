<template>
  <div id="MouldBusinessTemp" class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane :key="tabsOptions['9'].key" :tab="tabsOptions['9'].label">
            <Table type="9" />
          </a-tab-pane>
          <a-tab-pane :key="tabsOptions['10'].key" :tab="tabsOptions['10'].label">
            <tempDelivery />
          </a-tab-pane>
          <a-tab-pane key="11" :tab="t('common.tempOrder')">
            <tempUseBackTable />
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, defineAsyncComponent } from 'vue';
  import { tabsOptions } from '../bill/components/config';
  import { useI18n } from '/@/hooks/web/useI18n';

  defineOptions({ name: 'warehouse-mouldBusiness-temp' });

  const Table = defineAsyncComponent(() => import('../bill/components/BillTable.vue'));
  const tempDelivery = defineAsyncComponent(() => import('./components/tempGoods/TempGoodsTable.vue'));
  const tempUseBackTable = defineAsyncComponent(() => import('./components/useback/UseBackTable.vue'));

  const { t } = useI18n();
  const activeKey = ref('9');
</script>

<style lang="less" scoped>
  @import url('/src/design/page.less');
</style>
