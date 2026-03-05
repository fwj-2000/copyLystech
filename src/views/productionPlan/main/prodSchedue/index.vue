<template>
  <div id="ProductionPlanMain" class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <!-- <a-button type="primary" v-auth="'btn_edit'">{{ t('common.updateText') }}</a-button>
            <a-button type="primary" ghost v-auth="'btn_pushDeliveryDate'">{{ t('下推非程交期') }}</a-button>
            <a-button type="primary" ghost v-auth="'btn_pushOrderAdd'" @click="openPushWorkOrderList">
              {{ t('dict.AddWorkOrderColumn.pushWorkOrderList') }}
            </a-button>
            <a-button type="primary" ghost v-auth="'btn_batchGenerate'" @click="handleCreateWorkOrder">{{ t('批量生成工单号') }}</a-button> -->
            <a-button type="primary" ghost v-auth="'btn_syncProd'" @click="handleSyncProdData">{{ t('dict.MPS.syncProdData') }}</a-button>
            <a-button type="primary" ghost v-auth="'btn_match'" @click="handleMatch">{{ t('dict.MPS.startMatchComfirm') }}</a-button>
          </template>
        </Grid>
      </div>
    </div>
    <MatchConfirmPop @register="reactiveMatchPopup" @reload="reload" />
    <PushWorkOrderListPop @register="registerPushWorkOrderListPop" @reload="reload"></PushWorkOrderListPop>
    <SyncProdDataModal @register="registerSyncProdDataModal" @reload="reload"></SyncProdDataModal>
  </div>
</template>
<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import { getColumns, getFormSchema } from './config';
  import MatchConfirmPop from './components/MatchConfirm.vue';
  import PushWorkOrderListPop from './components/PushWorkOrderListPop.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import dayjs from 'dayjs';
  import { getProdSchedule } from '/@/api/mps/productionPlan/prodSchedue';
  import SyncProdDataModal from './components/SyncProdDataModal.vue';

  const { createMessage } = useMessage();

  defineOptions({ name: 'productionPlan-main-prodSchedue' });
  const { t } = useI18n();
  const [Grid, { reload, getSelectRows, getFetchParams }] = useVbenVxeGrid({
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
      api: getProdSchedule,
      columns: getColumns(),
      i18nConfig: {
        moduleCode: 'MoldLedgerColumn',
      },
      showIndexColumn: true,
      beforeFetch: params => {
        const weeksDayjs = dayjs(params.searchDate);
        return {
          ...params,
          searchDate: `${weeksDayjs.endOf('week').year()}WK${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}`,
        };
      },
    },
  });

  const [registerPushWorkOrderListPop, { openPopup: openPushWorkOrderPop }] = usePopup();
  const [reactiveMatchPopup, { openPopup: openMatchPopup }] = usePopup(); // 匹配确认单弹窗
  const [registerSyncProdDataModal, { openModal: openSyncProdDataModal }] = useModal();

  function handleMatch() {
    // 打开匹配弹窗
    openMatchPopup(true, {});
  }

  async function handleSyncProdData() {
    const { searchDate } = await getFetchParams();
    const years = dayjs(searchDate).endOf('week').year();
    const week = dayjs(searchDate).endOf('week').week();
    openSyncProdDataModal(true, { years, week });
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
    if (!rows.length) return createMessage.info('common.selectText');
    // 校验数据是否为同个工厂的
    console.log('create work order');
  };
</script>
