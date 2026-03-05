<template>
  <BasicModal
    v-bind="$attrs"
    :width="900"
    :height="600"
    :title="t('dict.mouldBusiness.modifyMaintenanceSupplier')"
    destroyOnClose
    class="batch-modal"
    :showOkBtn="true"
    :okText="t('common.submit')"
    @ok="handleSubmit"
    @register="registerModal">
    <div style="height: 500px">
      <Grid>
        <!-- <template #supplierSelect="{ row, column }">
          <LydcSelect
            v-model:value="row[column.field]"
            :fieldNames="{ label: 'label', value: 'value' }"
            :placeholder="t('common.inputText')"
            showSearch
            allowClear
            :options="supplierList" />
        </template> -->
      </Grid>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { nextTick } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { modifySupplierColumns, modifySupplierEditRules } from './configVxe';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { repairagent } from '/@/api/productionDeal/mouldBusinessMaintenance';
  import { pick } from 'lodash-es';

  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';

  const emits = defineEmits(['reload']);
  const { t } = useI18n();
  const { createMessage } = useMessage();

  const [registerModal, { changeLoading, closeModal }] = useModalInner(init);

  const [Grid, gridApi] = useVbenVxeGrid({
    id: `warehouseManagement-mouldBusiness-maintenanceRecord-modifySupplier`,
    formOptions: undefined,
    gridOptions: {
      // @ts-ignore
      treeConfig: false,
      mouseConfig: {
        area: true,
      },
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      columns: modifySupplierColumns,
      keyboardConfig: {
        isBack: false,
      },
      pagerConfig: {
        enabled: false,
        autoHidden: false,
      },
      toolbarConfig: {
        refresh: false,
        custom: false,
      },
      editConfig: {
        enabled: true,
        trigger: 'dblclick',
        mode: 'row',
      },
      editRules: modifySupplierEditRules,
      clipConfig: {
        isPaste: true,
        // afterPasteMethod: handleAfterPaster,
      },
      i18nConfig: {
        moduleCode: 'MoldRepairApplyColumn',
      },
    },
  });

  /**
   * @description 初始化修改记录
   * @param data 修改数据列表
   */
  function init(data: Array<any>) {
    // initSupplierList();
    nextTick(() => {
      gridApi.grid.reloadData(data || []);
    });
  }

  async function handleSubmit() {
    if (await gridApi.grid.validate(true)) {
      return createMessage.warning(t('dict.SalesSiteColumn.requiredTip'));
    }

    changeLoading(true);
    const data = gridApi.getDataSource().map(item => pick(item, ['id', 'repairSupplier']));
    repairagent(data)
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        emits('reload');
        closeModal();
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  // const supplierList = reactive<Array<any>>([]);
  // function initSupplierList() {
  //   if (supplierList.length > 0) {
  //     return false;
  //   }
  //   getSupplierlist({ searchKey: '' }).then(res => {
  //     supplierList.push(
  //       ...res.data.map((item: any) => ({
  //         ...item,
  //         label: item.name,
  //         value: item.name,
  //       })),
  //     );
  //   });
  // }

  // function handleAfterPaster({ targetAreas, pasteCells }) {
  //   if (targetAreas.length === 0) {
  //     return false;
  //   }
  //   const { cols, rows } = targetAreas[0];

  //   // 当黏贴只有一行有数据时，将粘贴的数据填充到每一行
  //   const pasteCellData = [...pasteCells];
  //   if (pasteCellData.length === 1 && rows.length > 1) {
  //     const target = pasteCells[0];
  //     pasteCellData.length = 0;
  //     for (let i = 0; i < rows.length; i++) {
  //       pasteCellData.push(target);
  //     }
  //   }

  //   // 供应商复制处理
  //   handleAfterSupplier(cols, rows, pasteCellData);
  // }

  // function handleAfterSupplier(cols, rows, pasteCells) {
  //   const targetIndex = cols.findIndex((item: any) => item.field === 'repairSupplier');
  //   if (targetIndex == -1) return false;

  //   const dataList = rows.map((item, index) => {
  //     const targetValue = pasteCells?.[index]?.[targetIndex] || '';
  //     const target = supplierList.find(unit => unit.name === targetValue);
  //     return Object.assign(item, {
  //       repairSupplier: target?.id || '',
  //     });
  //   });
  //   if (dataList.length == 0) return false;
  //   nextTick(() => {
  //     gridApi.grid.setRow(dataList);
  //   });
  // }
</script>
