<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    v-loading="btnLoading"
    :okText="t('common.submit')"
    :title="t('dict.CommonCol.modify')"
    destroyOnClose
    @ok="handleSaveFn"
    class="full-popup">
    <div class="p-10px h-full">
      <Grid>
        <template #toPushMrp="{ row }">
          <LydcTag
            v-if="row.isFirstCalc == 1 || (row.isFirstCalc == 0 && row.requirePPSCountOld != row.requirePPSCount)"
            theme="green"
            :text="t('dict.YesOrNo.1')"></LydcTag>
          <LydcTag v-else theme="red" :text="t('dict.YesOrNo.0')"></LydcTag>
        </template>
        <template #lastFourDemand="{ row }">
          <div>{{ lastFourDemandFormat(row) }}</div>
        </template>
        <template #action="{ row }">
          <TableAction outside :actions="getTableActions(row)" />
        </template>
      </Grid>
    </div>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getEditColumn, editRules } from '../config';
  import { TableAction } from '/@/components/Table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getMasterdemandplanDetail, updateplan } from '/@/api/mps/productionPlan/MPS';
  import { getWeekDays } from '../weekTime';
  const { t } = useI18n();

  const emits = defineEmits(['register', 'reload']);

  const btnLoading = ref(false);

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const { createMessage } = useMessage();

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionPlan-main-masterSchedule-list-edit',
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'MasterDemandPlanColumn',
      },
      toolbarConfig: {
        enabled: false,
      },
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      pagerConfig: {
        autoHidden: true,
      },
      editRules,
      position: 'modal',
      clipConfig: {
        isPater: true,
      },
    },
  });

  const lastFourDemandFormat = row => {
    return row.lastFourDemandTips || (row.lastFourDemand ? row.lastFourDemand.toFixed(3) : '');
  };

  // 操作
  function getTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-clearn',
        onClick: handleDelete.bind(null, row),
      },
    ];
  }

  const handleDelete = row => {
    gridApi.remove(row);
  };

  async function init({ ids, searchDate }) {
    changeLoading(true);
    const dataList = getEditColumn().map(item => {
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
    const { data } = await getMasterdemandplanDetail(ids).finally(() => {
      changeLoading(false);
    });
    const dataFormat = data.map(item => ({
      ...item,
      requirePPSCountOld: item.requirePPSCount,
    }));
    gridApi.reloadData(dataFormat);
  }

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
    const { code, msg } = await updateplan(params).finally(() => {
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
