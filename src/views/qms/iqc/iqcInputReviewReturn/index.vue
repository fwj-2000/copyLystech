<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicForm @register="registerForm"> </BasicForm>
      </div>
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #action="{ row }">
            <TableAction :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <!-- <ExportModal @register="registerExportModal" /> -->
    <IqcReportModal @register="registerIqcReportModal" />
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useModal } from '/@/components/Modal/index.js';
  import { BasicForm, useForm } from '/@/components/Form';
  import { columns, schemas } from './config.js';
  import { getantiauditdata } from '/@/api/qms/iqc.js';
  import { TableAction } from '/@/components/Table/index.js';
  import IqcReportModal from '/@/views/qms/iqc/components/IqcReportModal/index.vue';
  defineOptions({ name: 'qms-iqc-iqcInputReviewReturn' });
  const { t } = useI18n();
  const [registerIqcReportModal, { openModal: openIqcReportModal }] = useModal();
  const [registerForm, { getFieldsValue, resetFields, updateSchema }] = useForm({
    baseColProps: { span: 4 },
    showActionButtonGroup: true,
    showAdvancedButton: true,
    showResetButton: true,
    showSubmitButton: true,
    autoSubmitOnEnter: true,
    autoAdvancedLine: 1,
    submitFunc: () => searchFn(),
    resetFunc: resetFn,
    i18nConfig: {
      moduleCode: 'IQCAntiAuditColumn',
      transferRange: ['placeholder'],
    },
    schemas,
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      columns,
      api: () => getantiauditdata({ ...getFieldsValue() }),
      i18nConfig: {
        moduleCode: 'IQCAntiAuditColumn',
      },
    },
  });

  function getTableActions(row: any) {
    return [
      {
        icon: 'icon-ym icon-ym-report-icon-page-preview',
        onClick: handleView.bind(null, row),
        tooltip: t('common.viewReport'),
        // auth: 'btn_edit',
      },
    ];
  }
  function handleView(row: any) {
    const params = {
      data: { ...row, id: row.applyId },
      title: t('common.detailText'),
    };
    openIqcReportModal(true, params);
  }

  function searchFn(): Promise<void> {
    return gridApi?.query();
  }

  function resetFn(): any {
    setTimeout(() => {
      searchFn();
    }, 300);
  }

  onMounted(() => {
    gridApi.query();
  });
</script>
