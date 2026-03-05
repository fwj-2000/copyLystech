<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs v-model:activeKey="state.activeKey" class="h-full">
          <a-tab-pane key="1" :tab="t('dict.MoldLedgerStatusEnum.8')" class="h-full">
            <ToUsedTable idKey="1"></ToUsedTable>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('dict.MoldLedgerStatusEnum.10')">
            <ToBackTable idKey="2"></ToBackTable>
          </a-tab-pane>
          <a-tab-pane key="4" :tab="t('common.doneText')">
            <DoneTable idKey="4"></DoneTable>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  // import { useRoute } from 'vue-router';
  // import { useRouteParams } from '/@/hooks/core/useRouteParams';

  import ToUsedTable from './components/ToUsedTable.vue';
  import DoneTable from './components/DoneTable.vue';
  import ToBackTable from './components/ToBackTable.vue';

  defineOptions({ name: 'warehouse-mouldBusiness-useBack' });
  const { t } = useI18n();

  interface StateType {
    activeKey: string;
  }

  const state = reactive<StateType>({
    activeKey: '1',
  });
</script>

<style lang="less" scoped>
  @import url('/src/design/page.less');
</style>
