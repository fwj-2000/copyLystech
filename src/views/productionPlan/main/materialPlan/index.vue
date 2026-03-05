<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content h-full">
        <a-tabs class="bg-white" destroyInactiveTabPane v-model:activeKey="activeKey" @change="handleTabChange">
          <a-tab-pane key="masterList" :tab="t('common.sum')">
            <handleList
              :activeKey="activeKey"
              :weeks="currentWeek"
              ref="masterListRef"
              @handleEdit="handleEdit"
              @changeWeek="handleChangeWeek"
              @handleReleasePR="handleReleasePR"></handleList>
          </a-tab-pane>
          <a-tab-pane key="pending" :tab="t('common.todoText')">
            <handleList
              :activeKey="activeKey"
              :weeks="currentWeek"
              ref="pendingRef"
              @changeWeek="handleChangeWeek"
              @handleEdit="handleEdit"
              @handleReleasePR="handleReleasePR"></handleList>
          </a-tab-pane>
          <a-tab-pane key="processing" :tab="t('dict.Flow.NodeStatus.2')">
            <handleList :activeKey="activeKey" :weeks="currentWeek" ref="processingRef" @changeWeek="handleChangeWeek"></handleList>
          </a-tab-pane>
          <a-tab-pane key="handled" :tab="t('common.doneText')">
            <handleList :activeKey="activeKey" :weeks="currentWeek" ref="handledRef" @changeWeek="handleChangeWeek"></handleList>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <ApplyPopup @register="registerApply" :activeKey="activeKey" @reload="reloadCurrentTable" />
    <ReleasePRPopup @register="registerReleasePR" @reload="reloadCurrentTable" />
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import dayjs from 'dayjs';
  import handleList from './list.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import ApplyPopup from './components/ApplyPopup.vue';
  import ReleasePRPopup from './components/ReleasePRPopup.vue';

  const { t } = useI18n();

  defineOptions({ name: 'productionPlan-main-materialPlan' });
  const [registerApply, { openPopup: openApplyPop }] = usePopup();
  const [registerReleasePR, { openPopup: openReleasePRPop }] = usePopup();

  const activeKey = ref('masterList');
  const currentWeek = ref(dayjs(new Date()));
  // 使用独立的 ref 引用每个 tab 的组件实例
  const masterListRef = ref();
  const pendingRef = ref();
  const processingRef = ref();
  const handledRef = ref();

  // 获取当前激活的组件实例
  const getCurrentRef = () => {
    switch (activeKey.value) {
      case 'masterList':
        return masterListRef.value;
      case 'pending':
        return pendingRef.value;
      case 'processing':
        return processingRef.value;
      case 'handled':
        return handledRef.value;
      default:
        return null;
    }
  };

  // tab 切换时的处理
  const handleTabChange = () => {
    // 如果需要，可以触发对应 tab 的特定逻辑
    const currentRef = getCurrentRef();
    if (currentRef && currentRef.onTabActivated) {
      currentRef.onTabActivated();
    }
  };

  // 重新加载当前表格
  const reloadCurrentTable = () => {
    const currentRef = getCurrentRef();
    if (currentRef && currentRef.refreshTable) {
      currentRef.refreshTable();
    }
  };

  //  获取所有组件实例（用于批量操作）
  // const getAllRefs = () => {
  //   return [masterListRef.value, pendingRef.value, processingRef.value, handledRef.value].filter(Boolean);
  // };
  // 重新加载所有表格（如全局刷新）
  // const reloadAllTables = () => {
  //   getAllRefs().forEach(ref => {
  //     if (ref && ref.refreshTable) {
  //       ref.refreshTable();
  //     }
  //   });
  // };

  const handleChangeWeek = (week: any) => {
    currentWeek.value = week || dayjs(new Date());
  };

  const handleEdit = async data => {
    openApplyPop(true, data);
  };

  const handleReleasePR = data => {
    openReleasePRPop(true, data);
  };
</script>
<style lang="less" scoped>
  @import url('/src/design/page.less');
</style>
