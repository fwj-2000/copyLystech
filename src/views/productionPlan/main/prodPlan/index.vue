<template>
  <div id="ProductionPlanMain" class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button type="primary" v-auth="'btn_edit'" @click="handleUpdate">{{ t('common.updateText') }}</a-button>
            <a-button type="primary" ghost v-auth="'btn_pushDeliveryDate'" @click="handleSche">{{ t('下推排程交期') }}</a-button>
            <a-button type="primary" ghost v-auth="'btn_pushOrderAdd'" @click="openPushWorkOrderList">
              {{ t('dict.AddWorkOrderColumn.pushWorkOrderList') }}
            </a-button>
            <a-button type="primary" ghost v-auth="'btn_batchGenerate'" @click="handleCreateWorkOrder">{{ t('批量生成工单号') }}</a-button>
            <a-button type="primary" ghost v-auth="'btn_match'" @click="handleMatch">{{ t('发起匹配确认单') }}</a-button>
            <a-button v-auth="'btn_download'">
              {{ t('common.batchExport') }}
            </a-button>
          </template>
        </Grid>
      </div>
    </div>
    <ExportModal />
    <MatchConfirmPop @register="reactiveMatchPopup" @reload="reload" />
    <PushWorkOrderListPop @register="registerPushWorkOrderListPop" @reload="reload"></PushWorkOrderListPop>
    <CreateWorkNoModal @register="registerCreateWorkNoModal" @reload="reload"></CreateWorkNoModal>
    <UpdatePopup @register="registerUpdatePopup" @reload="reload"></UpdatePopup>
    <SchePopup @register="registerSchePopup" @reload="reload"></SchePopup>
  </div>
</template>
<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import { getColumns, getFormSchema } from './config';
  import MatchConfirmPop from './components/MatchModal.vue';
  import PushWorkOrderListPop from './components/PushWorkOrderListPop.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import CreateWorkNoModal from './components/CreateWorkNoModal.vue';
  import UpdatePopup from './components/updatePopup.vue';
  import SchePopup from './components/schePopup.vue';
  import { getMasterProductionPlan } from '/@/api/mps/productionPlan/prodPlan';

  const { createMessage } = useMessage();

  defineOptions({ name: 'productionPlan-main-prodPlan' });
  const { t } = useI18n();
  const [Grid, { reload, getSelectRows }] = useVbenVxeGrid({
    formOptions: {
      showCollapseButton: false,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: getFormSchema(),
      // i18nConfig: {
      //   moduleCode: 'MoldLedgerColumn',
      //   transferRange: ['placeholder'],
      // },
    },
    gridOptions: {
      id: 'productionPlan-main-prodPlan-list',
      api: getMasterProductionPlan,
      columns: getColumns(),
      i18nConfig: {
        // moduleCode: 'MoldLedgerColumn',
      },
      showIndexColumn: true,
    },
  });

  const [registerPushWorkOrderListPop, { openPopup: openPushWorkOrderPop }] = usePopup();
  const [reactiveMatchPopup, { openPopup: openMatchPopup }] = usePopup(); // 匹配确认单弹窗
  const [registerCreateWorkNoModal, { openModal: openCreateWorkNoModal }] = useModal();
  const [registerUpdatePopup, { openPopup: openUpdatePopup }] = usePopup();
  const [registerSchePopup, { openPopup: openSchePopup }] = usePopup();

  function handleMatch() {
    // 打开匹配弹窗
    openMatchPopup(true, {});
  }

  const openPushWorkOrderList = () => {
    const rows = getSelectRows();
    if (!rows.length) return createMessage.warning(t('common.selectText'));
    // const { id } = rows[0];
    openPushWorkOrderPop(true, {});
  };

  // 批量生成工单号
  const handleCreateWorkOrder = () => {
    const rows = getSelectRows();
    if (!rows.length) return createMessage.info(t('common.selectText'));
    // 校验数据是否为同个工厂的
    console.log('create work order');
    openCreateWorkNoModal(true, {});
  };

  // 修改
  const handleUpdate = () => {
    const rows = getSelectRows();
    if (!rows.length) return createMessage.info(t('common.selectText'));
    // 校验数据是否为同个工厂的
    console.log('update work order');
    openUpdatePopup(true, {});
  };

  // 下推排程交期
  const handleSche = () => {
    const rows = getSelectRows();
    if (!rows.length) return createMessage.info(t('common.selectText'));
    const ids = rows.map(item => item.id);
    openSchePopup(true, { ids });
  };
</script>
