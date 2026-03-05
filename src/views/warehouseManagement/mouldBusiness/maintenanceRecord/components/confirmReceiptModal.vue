<template>
  <BasicModal
    v-bind="$attrs"
    :width="900"
    :height="600"
    :title="t('common.confirmReceipt')"
    destroyOnClose
    class="batch-modal"
    :showOkBtn="true"
    :okText="t('common.submit')"
    @ok="handleSubmit"
    @register="registerModal">
    <div class="tip">{{ t('dict.mouldBusiness.confirmReceiveTip') }}</div>
    <div style="height: 500px; margin-top: 5px">
      <Grid />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { nextTick } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { confirmReceiptColumns } from './configVxe';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { confirmreceive } from '/@/api/productionDeal/mouldBusinessMaintenance';

  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';

  const emits = defineEmits(['reload']);
  const { t } = useI18n();
  const { createMessage } = useMessage();

  const [registerModal, { changeLoading, closeModal }] = useModalInner(init);

  const [Grid, gridApi] = useVbenVxeGrid({
    id: `warehouseManagement-mouldBusiness-maintenanceRecord-confirmReceipt`,
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
      columns: confirmReceiptColumns,
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
        trigger: 'click',
      },
    },
  });

  /**
   * @description 初始化修改记录
   * @param data 修改数据列表
   */
  function init(data: Array<any>) {
    nextTick(() => {
      // gridApi.reloadColumn(data.type === AUDIT_ENUM.同意 ? auditColumns.slice(0, -1) : auditColumns);
      gridApi.grid.reloadData(data || []);
    });
  }

  async function handleSubmit() {
    if (await gridApi.grid.validate(true)) {
      return createMessage.warning(t('dict.SalesSiteColumn.requiredTip'));
    }

    changeLoading(true);
    confirmreceive(gridApi.getDataSource().map(item => item.id))
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        emits('reload');
        closeModal();
      })
      .finally(() => {
        changeLoading(false);
      });
  }
</script>

<style lang="less" scoped>
  .tip {
    box-sizing: border-box;

    /* Auto layout */
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px 16px;
    margin: 0 8px;
    width: calc(100% - 16px);
    height: 42px;
    background: rgb(255 123 0 / 10%);
    border: 1px solid #ff7b00;
    border-radius: 4px;
  }
</style>
