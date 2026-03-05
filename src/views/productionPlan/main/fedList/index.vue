<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content h-full">
        <a-tabs class="bg-white" v-model:activeKey="activeKey">
          <a-tab-pane key="pending" :tab="t('common.todoText')">
            <handleList :activeKey="activeKey" ref="handleReviewRef"></handleList>
          </a-tab-pane>
          <a-tab-pane key="processing" :tab="t('dict.ExceptionStatus.3')">
            <handleList
              :activeKey="activeKey"
              ref="handleReviewRef"
              @handleSendEmail="handleSendEmail"
              @handleEnterDeliveryDate="handleEnterDeliveryDate"
              @handleUpdateDeliveryDate="handleUpdateDeliveryDate">
            </handleList>
          </a-tab-pane>
          <a-tab-pane key="handled" :tab="t('common.doneText')">
            <handleList :activeKey="activeKey" ref="handleReviewRef" @handleUpdateDeliveryDate="handleUpdateDeliveryDate"></handleList>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <SendEmailPopup @register="registerSendEmail" @reload="reloadTable" @close="reloadTable" />
    <EnterDeliveryDatePopup @register="registerEnterDeliveryDate" @reload="reloadTable" @close="reloadTable" />
    <UpdateDeliveryDatePopup @register="registerUpdateDeliveryDate" @reload="reloadTable" @close="reloadTable" />
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import handleList from './list.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import SendEmailPopup from './components/SendEmailPopup.vue';
  import EnterDeliveryDatePopup from './components/EnterDeliveryDatePopup.vue';
  import UpdateDeliveryDatePopup from './components/UpdateDeliveryDatePopup.vue';

  const { t } = useI18n();

  defineOptions({ name: 'productionPlan-main-fedList' });
  const [registerSendEmail, { openPopup: openSendEmailPopUp }] = usePopup();
  const [registerEnterDeliveryDate, { openPopup: openEnterDeliveryDatePopUp }] = usePopup();
  const [registerUpdateDeliveryDate, { openPopup: openUpdateDeliveryDatePopUp }] = usePopup();

  const activeKey = ref('pending');
  const handleReviewRef = ref();

  const handleSendEmail = async data => {
    openSendEmailPopUp(true, data);
  };

  const handleEnterDeliveryDate = async data => {
    openEnterDeliveryDatePopUp(true, data);
  };

  const handleUpdateDeliveryDate = async data => {
    openUpdateDeliveryDatePopUp(true, data);
  };

  const reloadTable = () => {
    handleReviewRef.value.reload();
  };
</script>
<style lang="less" scoped>
  @import url('/src/design/page.less');
</style>
