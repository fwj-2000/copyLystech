<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content h-full">
        <a-tabs class="bg-white" v-model:activeKey="activeKey">
          <a-tab-pane key="pending" :tab="t('common.todoText')">
            <handleList :activeKey="activeKey" ref="handleReviewRef" @handleAdd="handleAdd"></handleList>
          </a-tab-pane>
          <a-tab-pane key="processing" :tab="t('dict.ExceptionStatus.3')">
            <handleList :activeKey="activeKey" ref="handleReviewRef" @handleAdd="handleAdd"></handleList>
          </a-tab-pane>
          <a-tab-pane key="handled" :tab="t('common.doneText')">
            <handleList :activeKey="activeKey" ref="handleReviewRef"></handleList>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <ApplyPopup @register="registerApply" @reload="reloadTable" @close="reloadTable" />
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import handleList from './list.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import ApplyPopup from './components/ApplyPopup.vue';

  const { t } = useI18n();

  defineOptions({ name: 'productionPlan-main-PRList' });
  const [registerApply, { openPopup: openApplyPop }] = usePopup();

  const activeKey = ref('pending');
  const handleReviewRef = ref();

  const handleAdd = async data => {
    openApplyPop(true, data);
  };

  const reloadTable = () => {
    handleReviewRef.value.reloadTable();
  };
</script>
<style lang="less" scoped>
  @import url('/src/design/page.less');
</style>
