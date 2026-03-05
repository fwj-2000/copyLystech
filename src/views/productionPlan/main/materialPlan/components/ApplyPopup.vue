<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    v-loading="btnLoading"
    :okText="t('common.submit')"
    :title="t('common.updateText')"
    destroyOnClose
    @ok="handleSaveFn"
    class="full-popup">
    <Grid class="mt-10px" style="height: calc(100% - 10px)">
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
  import { getEditColumn, editRules } from '../config';
  import { TableAction } from '/@/components/Table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { materialTotalDetail, materialPartUpdateplan } from '/@/api/mps/productionPlan/materialPlan';
  import { getWeekDays } from '/@/views/productionPlan/main/materialPlan/weekTime';
  const { t } = useI18n();

  const emits = defineEmits(['register', 'reload']);

  const btnLoading = ref(false);

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const { createMessage } = useMessage();

  const props = defineProps({
    activeKey: {
      type: String,
      default: '',
    },
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'pruductionPlan-main-materialPlan-ApplyPopupList',
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'MaterialDemandPlanColumn',
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
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: {
      //   name: 'Input',
      // },
      width: 120,
    });
    const dataList = getEditColumn(props.activeKey).map(item => {
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
    const { data } = await materialTotalDetail(ids);
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
        projectStage: item.projectStage,
        costCategory: item.costCategory,
        purchaseCycle: item.purchaseCycle,
        moq: item.moq,
        nWeekDemand: item.nWeekDemand,
        purchaseQuantity: item.purchaseQuantity,
        requireSupplierDelivery: item.requireSupplierDelivery,
        purchaseReason: item.purchaseReason,
        purchaseLogic: item.purchaseLogic,
        supplierId: item.supplierId,
        type: item.type,
        vmi: item.vmi,
        remark: item.remark,
      };
    });
    changeLoading(true);
    const { code, msg } = await materialPartUpdateplan({ Items: dataList }).finally(() => {
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
