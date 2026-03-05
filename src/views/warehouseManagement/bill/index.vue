<template>
  <div id="ProductionDealMouldBusinessMaintenanceAudit" class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane :key="tabsOptions['1'].key" :tab="tabsOptions['1'].label">
            <Table type="1" />
          </a-tab-pane>
          <a-tab-pane :key="tabsOptions['2'].key" :tab="tabsOptions['2'].label">
            <Table type="2" />
          </a-tab-pane>
          <a-tab-pane :key="tabsOptions['3'].key" :tab="tabsOptions['3'].label">
            <Table type="3" />
          </a-tab-pane>
          <a-tab-pane :key="tabsOptions['4'].key" :tab="tabsOptions['4'].label">
            <Table type="4" />
          </a-tab-pane>
          <a-tab-pane :key="tabsOptions['5'].key" :tab="tabsOptions['5'].label">
            <Table type="5" />
          </a-tab-pane>
          <a-tab-pane :key="tabsOptions['6'].key" :tab="tabsOptions['6'].label">
            <Table type="6" />
          </a-tab-pane>
          <a-tab-pane :key="tabsOptions['7'].key" :tab="tabsOptions['7'].label">
            <Table type="7" />
          </a-tab-pane>
          <a-tab-pane :key="tabsOptions['8'].key" :tab="tabsOptions['8'].label">
            <Table type="8" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, defineAsyncComponent } from 'vue';
  import { tabsOptions } from './components/config';

  defineOptions({ name: 'warehouse-mouldBusiness-bill' });

  const Table = defineAsyncComponent(() => import('./components/BillTable.vue'));

  const activeKey = ref('1');
</script>

<style lang="less" scoped>
  @import url('/src/design/page.less');
</style>
