<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content h-full">
        <a-tabs class="bg-white" destroyInactiveTabPane v-model:activeKey="activeKey">
          <a-tab-pane key="handled" :tab="t('common.sum')">
            <handleList :activeKey="activeKey" :weeks="currentWeek" ref="handledRef" @handleEdit="handleEdit" @changeWeek="handleChangeWeek"></handleList>
          </a-tab-pane>
          <a-tab-pane key="pending" :tab="t('common.todoText')">
            <handleList :activeKey="activeKey" :weeks="currentWeek" ref="pendingRef" @handleEdit="handleEdit" @changeWeek="handleChangeWeek"></handleList>
          </a-tab-pane>
          <a-tab-pane key="PR" :tab="t('dict.masterDemandPlanStatus.3')">
            <handleList :activeKey="activeKey" :weeks="currentWeek" ref="PRRef" @handleEdit="handleEdit" @changeWeek="handleChangeWeek"></handleList>
          </a-tab-pane>
          <a-tab-pane key="PO" :tab="t('dict.masterDemandPlanStatus.2')">
            <handleList
              :activeKey="activeKey"
              ref="PORef"
              :weeks="currentWeek"
              @handleEdit="handleEdit"
              @handlePushToProdPlan="handlePushToProdPlan"
              @changeWeek="handleChangeWeek"></handleList>
          </a-tab-pane>
          <a-tab-pane key="scheduled" :tab="t('dict.masterDemandPlanStatus.4')">
            <handleList :activeKey="activeKey" :weeks="currentWeek" ref="scheduledRef" @handleEdit="handleEdit" @changeWeek="handleChangeWeek"></handleList>
          </a-tab-pane>
          <a-tab-pane key="replied" :tab="t('dict.masterDemandPlanStatus.5')">
            <handleList :activeKey="activeKey" :weeks="currentWeek" ref="repliedRef" @handleEdit="handleEdit" @changeWeek="handleChangeWeek"></handleList>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <ApplyPopup @register="registerApply" @reload="reloadCurrentTable" />
    <PushToProdPlanPopup @register="registerPushToProdPlan" @reload="reloadCurrentTable" />
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import dayjs from 'dayjs';
  import handleList from './list.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import ApplyPopup from './components/ApplyPopup.vue';
  import PushToProdPlanPopup from './components/PushToProdPlanPopup.vue';

  const { t } = useI18n();

  defineOptions({ name: 'productionPlan-main-masterSchedule' });
  const [registerApply, { openPopup: openApplyPop }] = usePopup();
  const [registerPushToProdPlan, { openPopup: openPushToProdPlanPop }] = usePopup();

  const activeKey = ref('pending');
  const currentWeek = ref(dayjs(new Date()));

  // 使用独立的 ref 引用每个 tab 的组件实例
  const handledRef = ref();
  const pendingRef = ref();
  const PRRef = ref();
  const PORef = ref();
  const scheduledRef = ref();
  const repliedRef = ref();
  // 获取当前激活的组件实例
  const getCurrentRef = () => {
    switch (activeKey.value) {
      case 'handled':
        return handledRef.value;
      case 'pending':
        return pendingRef.value;
      case 'PR':
        return PRRef.value;
      case 'PO':
        return PORef.value;
      case 'scheduled':
        return scheduledRef.value;
      case 'replied':
        return repliedRef.value;
      default:
        return null;
    }
  };

  // 当周次变化时
  const handleChangeWeek = week => {
    currentWeek.value = week || dayjs(new Date());
  };

  const handleEdit = async data => {
    openApplyPop(true, data);
  };

  // 下推主生产计划
  const handlePushToProdPlan = async data => {
    openPushToProdPlanPop(true, data);
  };

  // 重新加载当前表格
  const reloadCurrentTable = () => {
    const currentRef = getCurrentRef();
    if (currentRef && currentRef.refreshTable) {
      currentRef.refreshTable();
    }
  };
</script>
<style lang="less" scoped>
  @import url('/src/design/page.less');
</style>
