<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content h-full">
        <a-tabs class="bg-white" v-model:activeKey="activeKey">
          <a-tab-pane key="part" :tab="t('dict.CommonCol.partsPlan')">
            <PartSchedule :activeKey="activeKey" ref="partRef" @machiningPlan="handleMachiningPlan" @batchImportFile="batchImportFile"></PartSchedule>
          </a-tab-pane>
          <a-tab-pane key="electrode" :tab="t('dict.CommonCol.electrodePlan')">
            <ElectrodeSchedule :activeKey="activeKey" ref="electrodeRef" @machiningPlan="handleMachiningPlan"></ElectrodeSchedule>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <AddPopup @register="registerAdd" @reload="reloadTable" />
    <ImportModal @register="registerImportPop" @refresh="reloadTable" @close="reloadTable"></ImportModal>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import ElectrodeSchedule from './components/ElectrodeSchedule.vue';
  import PartSchedule from './components/PartSchedule.vue';
  import AddPopup from './components/AddPopup.vue';
  import { ImportModal } from '/@/components/ImportModal';

  const { t } = useI18n();

  defineOptions({ name: 'engineering-mouldRoom-partProcessPlan' });

  const [registerAdd, { openPopup: openAddPop }] = usePopup();
  const [registerImportPop, { openPopup: openImportPopup }] = usePopup();
  const activeKey = ref('part');
  const partRef = ref();
  const electrodeRef = ref();

  const reloadTable = () => {
    activeKey.value === 'part' ? partRef.value.reload() : electrodeRef.value.reload();
  };

  const handleMachiningPlan = data => {
    openAddPop(true, data);
  };

  const batchImportFile = data => {
    openImportPopup(true, data);
  };
</script>
<style lang="less" scoped>
  @import url('/src/design/page.less');
</style>
