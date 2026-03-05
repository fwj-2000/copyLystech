<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white p-10px">
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane :key="TABS_ENUM.BOM" tab="BOM">
            <BOM />
          </a-tab-pane>
          <a-tab-pane :key="TABS_ENUM.工艺路线" :tab="t('dict.Module.ProcessRoute')">
            <ProcessRoute />
          </a-tab-pane>
          <a-tab-pane :key="TABS_ENUM.生产版本" :tab="t('dict.CommonCol.productionVersion')">
            <ProductionVersion />
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { TABS_ENUM } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';

  import BOM from './components/BOM/index.vue';
  import ProcessRoute from './components/processRoute/index.vue';
  import ProductionVersion from './components/productionVersion/index.vue';

  defineOptions({ name: 'engineering-basicInformation-pccConversion' });

  const { t } = useI18n();
  const activeKey = ref<`${TABS_ENUM}`>(TABS_ENUM.BOM);
</script>

<style lang="less" scoped>
  :deep(.lydc-content-wrapper-content) {
    .vxe-grid {
      padding-top: 0;
    }

    .ant-tabs.ant-tabs-top,
    .ant-tabs-content.ant-tabs-content-top {
      height: 100%;
    }

    .vxe-form--wrapper .vxe-form--item:first-child .vxe-form--item-content {
      padding-left: 0;
    }
  }
</style>
