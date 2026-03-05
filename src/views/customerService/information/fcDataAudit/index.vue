<!-- FC数据审核 -->
<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs class="lydc-content-wrapper-tabs" style="height: 100%" destroyInactiveTabPane>
          <a-tab-pane :key="0" :tab="t('common.todoText')" style="height: 100%">
            <PendingPane ref="pendingPaneRef" @openVersionPopup="handleVersionPopup" />
          </a-tab-pane>
          <a-tab-pane :key="1" :tab="t('common.doneText')" style="height: 100%">
            <ProcessedPane @openVersionPopup="handleVersionPopup" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <DataVersionPopup @register="registerVersionPopup" @reload="handleReloadPendingPane" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import PendingPane from './PendingPane/index.vue';
  import ProcessedPane from './ProcessedPane/index.vue';
  import DataVersionPopup from './components/DataVersionPopup.vue';

  defineOptions({ name: 'customerService-information-fcDataAudit' });

  const pendingPaneRef = ref<InstanceType<typeof PendingPane>>();
  const { t } = useI18n();
  const [registerVersionPopup, { openPopup: openVersionPopup }] = usePopup(); // 数据版本详情

  // 打开查看数据版本页
  const handleVersionPopup = record => {
    openVersionPopup(true, {
      record: record,
    });
  };

  // 重载待处理页签
  const handleReloadPendingPane = () => {
    pendingPaneRef?.value?.reload();
  };
</script>

<style lang="less" scoped>
  @import url('/src/design/page.less');
</style>
