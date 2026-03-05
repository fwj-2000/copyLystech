<template>
  <div id="outsizeTab" class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs v-model:activeKey="activeKey" class="h-full">
          <a-tab-pane key="1" :tab="t('common.todoText')">
            <PaneItem type="1"></PaneItem>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('common.doneText')">
            <PaneItem type="2"></PaneItem>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <DetailPopup @register="registerDetail" />
    <ViewPopup @register="registerView" />
    <ImportModal @register="registerImportPop" />
    <QuanlityPopup @register="registerQuantity" />
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, provide, reactive, toRefs } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useRoute } from 'vue-router';
  import PaneItem from './components/PaneItem.vue';
  import { usePopup } from '/@/components/Popup';
  import ViewPopup from './components/ViewPopup.vue';
  import DetailPopup from './components/DetailPopupVxe.vue';
  import { ImportModal } from '/@/components/ImportModal';
  import QuanlityPopup from '/@/views/engineering/data/produce/componentsBom/DetailPopup.vue';

  defineOptions({ name: 'materialRequirement-deliveryDate' });
  provide('openDetailPopFn', openDetailPopFn);
  provide('openViewPopFn', openViewPopFn);
  provide('openImportPopFn', openImportPopFn);
  provide('openPdDetailFn', openPdDetailFn);
  const { t } = useI18n();

  interface IStateType {
    activeKey: string;
  }

  const state = reactive<IStateType>({
    activeKey: '1',
  });
  const { activeKey } = toRefs(state);
  const route = useRoute();
  const [registerDetail, { openPopup: openDetailPop }] = usePopup();
  const [registerView, { openPopup: openViewPop }] = usePopup();
  const [registerImportPop, { openPopup: openImportPop }] = usePopup();

  // function reloadFn() {
  //   if (!deliveryPriceConfrimRef.value) return;
  //   nextTick(() => {
  //     deliveryPriceConfrimRef.value.initFn();
  //   });
  // }

  function openDetailPopFn(data = {}) {
    openDetailPop(true, data);
  }
  function openViewPopFn(data = {}) {
    openViewPop(true, data);
  }

  function openImportPopFn(data = {}) {
    openImportPop(true, data);
  }

  const [registerQuantity, { openPopup: openQuanlityPopup }] = usePopup();
  /** 打开`量试订单评审` */
  function openPdDetailFn(data) {
    const { engineeringInformationId } = data;
    openQuanlityPopup(true, {
      index: 0,
      type: 'view',
      ids: [engineeringInformationId],
      cacheList: [{ id: engineeringInformationId }],
    });
  }

  onMounted(() => {
    const { id, tab } = route.query as any;
    if (id && tab) {
      state.activeKey = tab;
    }
  });
</script>
<style lang="less" scoped>
  :deep(.ant-tabs-nav-list) {
    padding: 0 10px !important;
  }

  :deep .ant-tabs-content {
    height: 100%;
  }
</style>
