<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content h-full">
        <a-tabs class="bg-white" v-model:activeKey="activeKey">
          <a-tab-pane key="pending" :tab="t('common.todoText')">
            <handleList :activeKey="activeKey" ref="handleReviewRef" @handleAudit="handleAudit"></handleList>
          </a-tab-pane>
          <a-tab-pane key="handled" :tab="t('common.doneText')">
            <handleList :activeKey="activeKey" ref="handleReviewRef" @handleAudit="handleAudit"></handleList>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <ApplyPopup @register="registerApply" @reload="reloadTable" @close="reloadTable" />
  </div>
</template>
<script setup lang="ts">
  import { onMounted } from 'vue';
  import { ref } from 'vue';
  import handleList from './list.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import ApplyPopup from './components/ApplyPopup.vue';
  import { useRoute } from 'vue-router';
  import { getRepairmoldDetail } from '/@/api/engineering/mould';

  const { t } = useI18n();
  const route = useRoute();

  defineOptions({ name: 'engineering-mouldRoom-repairMoldApproval' });

  const [registerApply, { openPopup: openApplyPop }] = usePopup();
  const activeKey = ref('pending');
  const handleReviewRef = ref();

  const handleAudit = data => {
    openApplyPop(true, data);
  };

  const reloadTable = () => {
    handleReviewRef.value.reload();
  };

  onMounted(async () => {
    if (route.query.id) {
      const { data } = await getRepairmoldDetail(route.query.id);
      if (data.status == 2) {
        activeKey.value = 'handled';
      }
      openApplyPop(true, { handleType: 'single', ids: [route.query.id], activeKey: activeKey });
    }
  });
</script>
<style lang="less" scoped>
  @import url('/src/design/page.less');
</style>
