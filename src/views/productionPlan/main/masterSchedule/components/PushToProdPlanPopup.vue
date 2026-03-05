<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    v-loading="btnLoading"
    :okText="t('common.submit')"
    :title="t('dict.masterSchedule.pushToProdPlan')"
    destroyOnClose
    @ok="handleSaveFn"
    class="full-popup">
    <div class="p-10px h-full">
      <Grid>
        <template #errorMsg="{ row }">
          <LydcTag v-if="row.errorStatus == 1" theme="green" :text="row.errorMsg"></LydcTag>
          <a-tooltip v-if="row.errorStatus == 2">
            <template #title>
              <span style="font-size: 12px">{{ row.errorMsg }}</span>
            </template>
            <!-- 基础数据缺失 -->
            <a-tag class="tagCss">{{ t('tip.MPS.tip8') }}</a-tag>
          </a-tooltip>
          <LydcTag v-if="row.errorStatus == 3" theme="gray" :text="row.errorMsg"></LydcTag>
        </template>
        <template #mergeMaterialDes="{ row }">
          <div class="table-a" @click="handleMaterialDes(row)">{{ t('common.viewDetails') }}</div>
        </template>
        <template #prodLog="{ row }">
          <div class="table-a" @click="handleDetail(row, '建议排产数更新记录')">{{ t('common.viewDetails') }}</div>
        </template>
        <template #reqdLog="{ row }">
          <div class="table-a" @click="handleDetail(row, '要求排产数更新记录')">{{ t('common.viewDetails') }}</div>
        </template>
        <template #NodeRecords="{ row }">
          <span class="table-a" @click="handleNodeModal(row)">
            {{ t('common.searchDetail') }}
          </span>
        </template>
      </Grid>
      <ProdLogDetailModal @register="registerProdLogDetail"> </ProdLogDetailModal>
      <MaterialDesModal @register="registerMaterialDesModal"> </MaterialDesModal>
      <NodeModal @register="registerNodeModal"></NodeModal>
    </div>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getPushToProdPlanColumn } from '../config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { pushmpslist, pushmps } from '/@/api/mps/productionPlan/MPS';
  import { getWeekDays } from '../weekTime';
  import { useModal } from '/@/components/Modal';
  import { NodeModal } from '/@/components/CustomComponents';
  import ProdLogDetailModal from './ProdLogDetailModal.vue';
  import MaterialDesModal from './MaterialDesModal.vue';
  const { t } = useI18n();

  const emits = defineEmits(['register', 'reload']);

  const btnLoading = ref(false);

  const [registerProdLogDetail, { openModal: openProdLogDetail }] = useModal();
  const [registerMaterialDesModal, { openModal: openMaterialDesModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal(); // 节点弹窗

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const { createMessage } = useMessage();

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionPlan-main-masterSchedule-list-pushToProdPlanList',
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'MasterDemandPlanColumn',
      },
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        autoHidden: true,
      },
      position: 'modal',
      clipConfig: {
        isPater: true,
      },
    },
  });

  async function init({ ids, searchDate }) {
    changeLoading(true);
    const dataList = getPushToProdPlanColumn().map(item => {
      if (item.field === 'replyDeliveryDate') {
        return {
          ...item,
          children: getWeekDays(searchDate),
        };
      } else {
        return { ...item };
      }
    });
    gridApi.reloadColumn(dataList);
    const { data } = await pushmpslist(ids).finally(() => {
      changeLoading(false);
    });
    gridApi.reloadData(data);
  }

  const handleDetail = (row, title) => {
    openProdLogDetail(true, { ...row, title });
  };

  const handleMaterialDes = row => {
    openMaterialDesModal(true, { ...row });
  };

  // 打开节点弹窗
  const handleNodeModal = record => {
    openNodeModal(true, {
      id: record.id,
    });
  };

  // 点击提交
  async function handleSaveFn() {
    if (await gridApi.validate(true)) {
      createMessage.warning(t('dict.CommonCol.enterRequiredFields'));
      return;
    }
    const params = {
      items: gridApi.getDataSource().map(item => {
        console.log(item);
        const { sapFactoryName } = item;
        return {
          id: item.id,
          sapFactoryCode: item.sapFactoryCode,
          sapFactoryName: sapFactoryName && sapFactoryName.includes('/') ? sapFactoryName.split('/')[1] : sapFactoryName,
          triggerWeeksPPS: item.triggerWeeksPPS,
          upperWeeksPPS: item.upperWeeksPPS,
          releaseWeeksPPS: item.releaseWeeksPPS,
          requirePPSCount: item.requirePPSCount,
          suggestPPS: item.suggestPPS,
          customerId: item.customerId,
          pdId: item.pdId,
          pcId: item.pcId,
          mcId: item.mcId,
          workshopPlanId: item.workshopPlanId,
          materialPurchaseId: item.materialPurchaseId,
          monday: item.monday,
          tuesday: item.tuesday,
          wednesday: item.wednesday,
          thursday: item.thursday,
          friday: item.friday,
          saturday: item.saturday,
          sunday: item.sunday,
          remark: item.remark,
          otherRemark: item.otherRemark,
        };
      }),
    };
    changeLoading(true);
    const { code, msg } = await pushmps(params).finally(() => {
      changeLoading(false);
    });
    if (code === 200) {
      createMessage.success(msg);
      emits('reload');
      closePopup();
      return;
    }
    createMessage.error(msg);
  }
</script>
