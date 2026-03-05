<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('dict.CommonCol.roughGrindingReport')" :showOkBtn="false" width="800px">
    <a-tabs class="bg-white" v-model:activeKey="activeKey" @change="getTableData">
      <a-tab-pane key="start" :tab="t('common.startProduction')">
        <startList :activeKey="activeKey" :state="state" ref="startListRef"></startList>
      </a-tab-pane>
      <a-tab-pane key="report" :tab="t('dict.Process.Type.2')">
        <reportList :activeKey="activeKey" :state="state" ref="reportListRef"></reportList>
      </a-tab-pane>
      <a-tab-pane key="transferOut" :tab="t('dict.CommonCol.transferOut')">
        <transferOutList :activeKey="activeKey" :state="state" ref="transferOutListRef"></transferOutList>
      </a-tab-pane>
      <a-tab-pane key="receiveMaterial" :tab="t('common.receiveMaterials')">
        <receiveMaterialList :activeKey="activeKey" :state="state" ref="receiveMaterialListRef"></receiveMaterialList>
      </a-tab-pane>
    </a-tabs>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import startList from './startList.vue';
  import reportList from './reportList.vue';
  import transferOutList from './transferOutList.vue';
  import receiveMaterialList from './receiveMaterialList.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  const activeKey = ref('start');

  const [registerModal] = useModalInner(init);

  const state = ref({
    workOrderNo: '',
    nodeId: '',
  });

  const startListRef = ref();
  const reportListRef = ref();
  const transferOutListRef = ref();
  const receiveMaterialListRef = ref();

  const getTableData = () => {
    nextTick(() => {
      switch (activeKey.value) {
        case 'start': {
          startListRef.value.reloadTable();
          break;
        }
        case 'report': {
          reportListRef.value.reloadTable();
          break;
        }
        case 'transferOut': {
          transferOutListRef.value.reloadTable();
          break;
        }
        case 'receiveMaterial': {
          receiveMaterialListRef.value.reload();
          break;
        }
      }
    });
  };

  async function init({ workOrderNo, nodeId }) {
    state.value = { workOrderNo, nodeId };
    getTableData();
  }
</script>
