<template>
  <div class="lydc-content-wrapper" id="productionDealFillingsMaintainBox">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <a-tabs class="bg-white" v-model:activeKey="activeKey" destroyInactiveTabPane>
          <a-tab-pane :key="TAB_ENUM.待处理" :tab="t('common.todoText')">
            <DataTable :type="TAB_ENUM.待处理" ref="dataTableRef" />
          </a-tab-pane>
          <a-tab-pane :key="TAB_ENUM.已处理" :tab="t('common.doneText')">
            <DataTable :type="TAB_ENUM.已处理" ref="dataTableRef" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';
  import { TAB_ENUM } from './config';

  import DataTable from './dataTable.vue';

  defineOptions({ name: 'productionDeal-fillings-maintain' });

  const activeKey = ref<TAB_ENUM>(TAB_ENUM.待处理);
  const dataTableRef = ref<InstanceType<typeof DataTable>>();
  const { t } = useI18n();

  useRouteParams({ id: {}, status: {} }, params => {
    dataTableRef.value?.handleRouteParams(params);
  });
</script>

<style lang="less" scoped>
  @import url('/src/design/page.less');

  :deep(.ant-tabs-nav-list) {
    padding: 0 10px !important;
  }
</style>
