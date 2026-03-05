<template>
  <div id="engineeringMouldBusinessAnomalyJudgment" class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane :key="TABS_ENUM.待处理" :tab="t('common.todoText')">
            <Table ref="todoTableRef" :type="TABS_ENUM.待处理" />
          </a-tab-pane>
          <a-tab-pane :key="TABS_ENUM.已处理" :tab="t('common.doneText')">
            <Table ref="doneTableRef" :type="TABS_ENUM.已处理" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, defineAsyncComponent, nextTick } from 'vue';
  import { TABS_ENUM } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useRoute } from 'vue-router';
  // import { getDetailById } from '/@/api/productionDeal/mouldBusinessMaintenance';

  defineOptions({ name: 'engineering-mouldBusiness-anomalyJudgment' });

  const Table = defineAsyncComponent(() =>
    import('./components/dataTable.vue').then(m => {
      nextTick(openDetailPopup);
      return m.default;
    }),
  );

  const route = useRoute();

  const todoTableRef = ref<InstanceType<typeof Table>>();
  const doneTableRef = ref<InstanceType<typeof Table>>();

  const { t } = useI18n();
  const activeKey = ref<`${TABS_ENUM}`>(TABS_ENUM.待处理);

  function openDetailPopup() {
    if (route.query.id) {
      setTimeout(() => {
        activeKey.value === TABS_ENUM.待处理
          ? todoTableRef.value && todoTableRef.value.showJudgePopup([route.query.id as string])
          : doneTableRef.value && doneTableRef.value.showJudgePopup([route.query.id as string]);
      }, 500);
    }
  }
</script>

<style lang="less" scoped>
  @import url('/src/design/page.less');
</style>
