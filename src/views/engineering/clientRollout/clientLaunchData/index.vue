<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content h-full">
        <a-tabs class="bg-white" v-model:activeKey="activeKey">
          <a-tab-pane key="pending" :tab="t('common.todoText')">
            <handleList :activeKey="activeKey" ref="handleReviewRef" @entryFn="entryFn"></handleList>
          </a-tab-pane>
          <a-tab-pane key="handled" :tab="t('dict.CommonCol.processed')">
            <handleList :activeKey="activeKey" ref="handleReviewRef" @entryFn="entryFn"></handleList>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <EntryPopup @register="registerEntryPopup" @reload="refreshTable"></EntryPopup>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import handleList from './list.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import EntryPopup from './components/EntryPopup.vue';

  const { t } = useI18n();

  defineOptions({ name: 'engineering-clientRollout-clientLaunchData' });

  const [registerEntryPopup, { openPopup: openEntryPopup }] = usePopup();

  const activeKey = ref('pending');
  const handleReviewRef = ref();

  const entryFn = (type, list) => {
    openEntryPopup(true, { type, list });
  };

  const refreshTable = () => {
    handleReviewRef.value.reload();
  };
</script>
<style lang="less" scoped>
  @import url('/src/design/page.less');
</style>
