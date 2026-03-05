<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content h-full">
        <a-tabs class="bg-white" v-model:activeKey="activeKey">
          <a-tab-pane key="pending" :tab="t('common.todoText')">
            <handleList :activeKey="activeKey" ref="handleReviewRef" @handleDetail="handleDetail"></handleList>
          </a-tab-pane>
          <a-tab-pane key="handled" :tab="t('common.doneText')">
            <handleList :activeKey="activeKey" ref="handleReviewRef" @handleDetail="handleDetail"></handleList>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <DetailsModal @register="registerDetailsModal" @reload="reloadTable"></DetailsModal>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import handleList from './list.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import DetailsModal from '../abnormalTimelinessMonitoring/components/add.vue';

  const { t } = useI18n();

  defineOptions({ name: 'qms-intelligentButler-abnormalWorkOrder' });

  const [registerDetailsModal, { openPopup: openDetailsModal }] = usePopup();
  const activeKey = ref('pending');
  const handleReviewRef = ref();

  const handleDetail = data => {
    openDetailsModal(true, data);
  };

  const reloadTable = () => {
    handleReviewRef.value.reload();
  };
</script>
<style lang="less" scoped>
  @import url('/src/design/page.less');
</style>
