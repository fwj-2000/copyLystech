<template>
  <div id="LogisticAffairsExportFilingsDemand" class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs v-model:activeKey="activeKey" destroyInactiveTabPane>
          <a-tab-pane :key="TABS_ENUM.待处理" :tab="t('common.todoText')">
            <DataTable :type="TABS_ENUM.待处理" />
          </a-tab-pane>
          <a-tab-pane :key="TABS_ENUM.已处理" :tab="t('common.doneText')">
            <DataTable :type="TABS_ENUM.已处理" />
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
  import DataTable from './components/dataTable.vue';

  defineOptions({ name: 'logisticAffairs-export-filings-demand' });

  const { t } = useI18n();
  const activeKey = ref<`${TABS_ENUM}`>(TABS_ENUM.待处理);
</script>

<style lang="less" scoped>
  @import url('/src/design/page.less');

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
