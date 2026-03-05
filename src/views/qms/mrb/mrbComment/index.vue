<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicForm @register="registerForm">
          <!-- <template #formFooter>
            <a-button type="primary" class="ml-3 mb-10px" @click="searchFn">{{ t('common.queryText') }}</a-button>
            <a-button class="ml-3" @click="resetFn">{{ t('common.resetText') }}</a-button>
          </template> -->
        </BasicForm>
      </div>
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space class="btn-block">
              <a-button @click="exportFn">
                <template #icon>
                  <VerticalAlignBottomOutlined />
                </template>
                {{ t('common.exportText') }}</a-button
              >
            </a-space>
          </template>
          <template #action="{ row }">
            <TableAction :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <ExportModal @register="registerExportModal" />
    <IqcReportModal @register="registerIqcReportModal" />
  </div>
</template>

<script lang="ts" setup>
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { onMounted } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useModal } from '/@/components/Modal/index.js';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { exportReviewComments, getReviewComments } from '/@/api/qms/mrb';
  import { VerticalAlignBottomOutlined } from '@ant-design/icons-vue';
  import { columns, schemas } from './config';
  import { TableAction } from '/@/components/Table';
  import IqcReportModal from '/@/views/qms/iqc/components/IqcReportModal/index.vue';
  import { cloneDeep } from 'lodash-es';

  defineOptions({ name: 'qms-mrb-mrbComment' });

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const [registerIqcReportModal, { openModal: openIqcReportModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();

  const [registerForm, { getFieldsValue }] = useForm({
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
      moduleCode: 'MrbApplyColumn',
      transferRange: ['placeholder'],
    },
    schemas,
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      columns,
      virtualXConfig: {
        enabled: false,
      },
      virtualYConfig: {
        enabled: false,
      },
      rowConfig: {
        keyField: 'id',
      },
      height: '100%',
      api: params => getReviewComments({ ...params, ...getFieldsValue() }),
      i18nConfig: {
        moduleCode: 'MrbApplyColumn',
      },
    },
  });

  function getTableActions(row: any) {
    return [
      {
        // icon: 'icon-ym icon-ym-view',
        label: t('common.iqcReport'),
        onClick: handleView.bind(null, row),
        tooltip: t('common.iqcReport'),
        auth: 'btn_view',
      },
    ];
  }

  function handleView(row: any) {
    const params = {
      data: cloneDeep(row),
      title: t('common.detailText'),
    };

    if (!row.relationNo) return createMessage.error(t('dict.MrbApplyColumn.iqcReportTips'));

    params.data.id = row.relationNo;
    openIqcReportModal(true, params);
  }

  function searchFn(): Promise<void> {
    return gridApi?.query();
  }

  function resetFn(): any {
    // resetFields();
    setTimeout(() => {
      gridApi?.query();
    }, 300);
  }

  function exportFn(): void {
    openExportModal(true, {
      api: exportReviewComments,
      listQuery: {
        ...getFieldsValue(),
      },
      nameProps: 'title',
      idProps: 'field',
      exportOptions: columns,
      i18nConfig: {
        moduleCode: 'MrbApplyColumn',
      },
    });
  }
  onMounted(() => {
    gridApi.query();
  });
</script>

<style lang="less" scoped>
  .btn-block button {
    display: flex;
    align-items: center;
  }
</style>
