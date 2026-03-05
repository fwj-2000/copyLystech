<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content h-full">
        <a-tabs class="bg-white" v-model:activeKey="activeKey">
          <a-tab-pane key="pending" :tab="t('dict.CommonCol.toBePushed')">
            <handleList :activeKey="activeKey" ref="handleReviewRef" @maintainCQE="maintainCQEFn"></handleList>
          </a-tab-pane>
          <a-tab-pane key="handled" :tab="t('dict.CommonCol.alreadyPushed')">
            <handleList :activeKey="activeKey" @maintainCQE="maintainCQEFn" ref="handleReviewRef"></handleList>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <MaintainCQEPopup @register="registerMaintainCQE" @reload="refreshTable"></MaintainCQEPopup>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import handleList from './list.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import MaintainCQEPopup from './components/MaintainCQEPopup.vue';

  const { t } = useI18n();

  defineOptions({ name: 'engineering-clientRollout-shipmentData' });

  const [registerMaintainCQE, { openPopup: openMaintainCQE }] = usePopup();

  const activeKey = ref('pending');
  const handleReviewRef = ref();

  const maintainCQEFn = (type, list) => {
    openMaintainCQE(true, { type, list });
  };

  const refreshTable = () => {
    handleReviewRef.value.reload();
  };
</script>
<style lang="less" scoped>
  @import url('/src/design/page.less');
</style>
