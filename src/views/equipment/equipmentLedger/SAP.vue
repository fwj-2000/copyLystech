<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicForm @register="registerForm" @submit="handleSearch" @reset="handleReset" />
      </div>

      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 同步SAP  -->
              <a-button v-auth="'btn_synchronizeSAP'" type="primary" @click="synchronizeSAP">{{ t('common.syncSap') }}</a-button>
              <!-- 批量导出 -->
              <a-button v-auth="'btn_download'" class="mr-12px" block @click="handleExport">{{ t('common.batchExport') }}</a-button>
            </a-space>
          </template>
        </Grid>
      </div>
    </div>
    <ExportModal @register="registerExportModal" @export="exportAction" />
    <SynchronizeSAPModal @register="registerSynchronizeSAP" @reload="reload"></SynchronizeSAPModal>
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { onMounted } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { SAPSchema, SAPColumn } from './config';
  import { useModal } from '/@/components/Modal';
  import { downloadByUrl } from '/@/utils/file/download';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import SynchronizeSAPModal from './components/SynchronizeSAPModal.vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { getEquipmentledgerPage, equipmentledgerExport } from '/@/api/equipment/equipmentLedger';

  const { t } = useI18n();
  const { hasBtnP } = usePermission();

  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const [registerSynchronizeSAP, { openModal: openSynchronizeSAPModal }] = useModal();

  const [registerForm, { getFieldsValue, clearValidate }] = useForm({
    baseColProps: { span: 3 },
    showActionButtonGroup: true,
    showAdvancedButton: false,
    compact: true,
    autoAdvancedLine: 1,
    actionColOptions: {
      span: 4,
    },
    schemas: SAPSchema,
    i18nConfig: {
      moduleCode: 'EquipmentLedgerColumn',
      transferRange: ['placeholder'],
    },
  });

  const [Grid, { reload, getFetchParams, reloadColumn }] = useVbenVxeGrid({
    gridOptions: {
      id: 'equipment-equipmentLedger-SAP-list',
      columns: [],
      api: getEquipmentledgerPage,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'EquipmentLedgerColumn',
      },
      beforeFetch: params => {
        return {
          ...params,
          ...getFieldsValue(),
          equipmentCodeS: getFieldsValue().equipmentCodeS && getFieldsValue().equipmentCodeS.join(','),
        };
      },
    },
  });

  function handleSearch() {
    reload();
  }

  function handleReset() {
    clearValidate();
    reload();
  }

  // 同步SAP
  const synchronizeSAP = () => {
    openSynchronizeSAPModal(true, { handleType: 'add' });
  };

  // 批量导出
  const handleExport = async () => {
    let exportColumn: any = [];
    if (hasBtnP('column_price')) {
      exportColumn = SAPColumn;
    } else {
      const amountField = [
        'originalAmount',
        'currentPeriodDepreciation',
        'accumulatedDepreciation',
        'relatedPartiesDepreciation',
        'totalDepreciation',
        'bookNetValue',
        'bookNetAmount',
        'impairmentProvision',
        'appreciationAmount',
        'totalImpairmentProvision',
      ];
      exportColumn = SAPColumn.filter(item => !amountField.includes(item.field));
    }
    openExportModal(true, {
      listQuery: {
        ...(await getFetchParams()),
        ...getFieldsValue(),
        equipmentCodeS: getFieldsValue().equipmentCodeS && getFieldsValue().equipmentCodeS.join(','),
      },
      exportOptions: exportColumn,
      nameProps: 'title',
      idProps: 'field',
    });
  };
  const exportAction = query => {
    equipmentledgerExport(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  };

  onMounted(() => {
    if (hasBtnP('column_price')) {
      reloadColumn(SAPColumn);
    } else {
      const amountField = [
        'originalAmount',
        'currentPeriodDepreciation',
        'accumulatedDepreciation',
        'relatedPartiesDepreciation',
        'totalDepreciation',
        'bookNetValue',
        'bookNetAmount',
        'impairmentProvision',
        'appreciationAmount',
        'totalImpairmentProvision',
      ];
      reloadColumn(SAPColumn.filter(item => !amountField.includes(item.field)));
    }
    reload();
  });
</script>

<style lang="less" scoped>
  .lydc-content-wrapper {
    position: absolute;

    ::v-deep(.cell-red) {
      color: red;
    }
  }

  .btn-wrapper {
    margin-top: 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .left-btn {
    display: flex;

    button {
      margin-right: 16px;
    }

    // 选择第二个按钮
    button:nth-child(2) {
      border: #ff7b00 solid 1px;
      color: #ff7b00;
    }
  }
</style>
