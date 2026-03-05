<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    v-loading="btnLoading"
    :okText="t('common.submit')"
    :title="t('common.pushPR')"
    destroyOnClose
    @ok="handleSaveFn"
    class="full-popup">
    <Grid class="m-10px" style="height: calc(100% - 20px)">
      <template #action="{ row }">
        <TableAction outside :actions="getTableActions(row)" />
      </template>
    </Grid>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { releasePRColumn, editRules } from '../config';
  import { TableAction } from '/@/components/Table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getWeekDays } from '/@/views/productionPlan/main/materialPlan/weekTime';
  import { materialPartDetail, materialPartPushprorder } from '/@/api/mps/productionPlan/materialPlan';
  const { t } = useI18n();

  const emits = defineEmits(['register', 'reload']);

  const btnLoading = ref(false);

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const { createMessage } = useMessage();

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'pruductionPlan-main-materialPlan-ReleasePRPopupList',
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'MaterialDemandPlanColumn',
      },
      toolbarConfig: {
        enabled: true,
        refresh: false,
      },
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      // mouseConfig: {
      //   area: true, // 是否开启区域选取
      // },
      areaConfig: {
        multiple: true, // 是否启用多区域选取功能
      },
      pagerConfig: {
        autoHidden: true,
      },
      position: 'modal',
      editRules,
    },
  });

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
    const weeks = getWeekDays(searchDate);
    weeks.unshift({
      title: '备库存',
      field: 'reserveStock',
      width: 120,
    });
    const dataList = releasePRColumn.map(item => {
      if (item.field === 'time') {
        return {
          ...item,
          children: weeks,
        };
      } else {
        return { ...item };
      }
    });
    gridApi.reloadColumn(dataList);
    const { data } = await materialPartDetail(ids);
    gridApi.reloadData(data);
    changeLoading(false);
  }

  // 点击提交
  async function handleSaveFn() {
    if (await gridApi.validate(true)) {
      createMessage.warning(t('dict.CommonCol.enterRequiredFields'));
      return;
    }
    const dataList = gridApi.getDataSource().map(item => {
      return {
        id: item.id,
        isOpen: item.isOpen == '1' ? 'Yes' : 'No',
        planUseDate: item.planUseDate,
        onlyMaterialDes: item.onlyMaterialDes,
        projectStage: item.projectStage,
        costCategory: item.costCategory,
        purchaseCycle: item.purchaseCycle,
        moq: item.moq,
        nWeekDemand: item.nWeekDemand,
        purchaseQuantity: item.purchaseQuantity,
        customerRequireDelivery: item.customerRequireDelivery,
        requireSupplierDelivery: item.requireSupplierDelivery,
        purchaseReason: item.purchaseReason,
        purchaseLogic: item.purchaseLogic,
        supplierId: item.supplierId,
        supplierName: item.supplierName,
        vmi: item.vmi,
        type: item.type,
        purchaser: item.purchaser,
        pmcSupervisor: item.pmcSupervisor,
        pmcManager: item.pmcManager,
        opsManager: item.opsManager,
        opsDirector: item.opsDirector,
        remark: item.remark,
      };
    });
    changeLoading(true);
    const { code, msg } = await materialPartPushprorder({ Items: dataList }).finally(() => {
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
