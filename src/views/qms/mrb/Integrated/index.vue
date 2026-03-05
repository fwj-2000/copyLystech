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
              <a-button @click="exportApprovalDetailsFn" v-auth="'btn_exportApprovalDetails'">
                {{ t('common.exportApprovalDetails') }}
              </a-button>
              <a-button @click="exportFn" v-auth="'btn_download'"> {{ t('common.exportText') }}</a-button>
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
    <MrbApplyPop @register="registerMrbApplyPop" @reload="reloadFn" />
  </div>
</template>

<script lang="ts" setup>
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { ref, onMounted } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useModal } from '/@/components/Modal/index.js';
  import { BasicForm, useForm } from '/@/components/Form';
  import { usePopup } from '/@/components/Popup';
  import { commitMrbapply, exportMrbapply, exportMrbapplyDetail, integratedQuery, mrbBulkDelete } from '/@/api/qms/mrb';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { columns, schemas } from './config';
  import { TableAction } from '/@/components/Table';
  import { downloadByUrl } from '/@/utils/file/download.js';
  import MrbApplyPop from '/@/views/qms/mrb/mrbApply/components/mrbApplyPop/index.vue';
  import IqcReportModal from '/@/views/qms/iqc/components/IqcReportModal/index.vue';
  import { cloneDeep } from 'lodash-es';
  defineOptions({ name: 'qms-mrb-Integrated' });

  const { createMessage, createConfirm } = useMessage();
  const { t } = useI18n();

  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerMrbApplyPop, { openPopup: openMrbApplyPopup }] = usePopup();

  const [registerIqcReportModal, { openModal: openIqcReportModal }] = useModal();

  const [registerForm, { getFieldsValue, resetFields }] = useForm({
    // baseColProps: { span: 4 },
    // schemas,
    // i18nConfig: {
    //   moduleCode: 'MrbApplyColumn',
    //   transferRange: ['placeholder'],
    // },

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
      api: params => integratedQuery({ ...params, ...getFieldsValue() }),
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
      {
        icon: 'icon-ym icon-ym-view',
        onClick: handleViewmrbApply.bind(null, row),
        tooltip: t('common.detailText'),
        auth: 'btn_view',
      },
    ];
  }

  function handleViewmrbApply(row: any) {
    const params = {
      data: row,
      title: t('common.detailText'),
      mode: 'view',
    };
    openMrbApplyPopup(true, params);
  }

  function handleView(row: any) {
    const params = {
      data: cloneDeep(row),
      title: t('common.detailText'),
    };
    params.data.id = row.relationNo;
    openIqcReportModal(true, params);
  }

  async function commitMrbapplyFn(id) {
    try {
      const { code, msg } = await commitMrbapply(id);
      if (code === 200) {
        reloadFn();
        createMessage.success(msg);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function searchFn(): Promise<void> {
    return gridApi?.query();
  }
  function reloadFn() {
    gridApi?.reload();
  }

  function resetFn(): any {
    setTimeout(() => {
      searchFn();
    }, 300);
  }

  function exportFn(): void {
    openExportModal(true, {
      api: exportMrbapply,
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
  function beforeValidateModal(): string[] | false {
    const grid = gridApi.grid;
    const selectRows = grid.getCheckboxRecords(true);
    if (!selectRows.length) {
      createMessage.error(t('common.selectText'));
      return false;
    }
    const ids = selectRows.map(item => item.id);
    return ids;
  }

  /**
   * 导出审批详情
   */
  function exportApprovalDetailsFn() {
    const ids = beforeValidateModal();
    if (!ids) return;
    exportMrbapplyDetailFn({ id: ids[0] });
  }
  async function exportMrbapplyDetailFn(params) {
    try {
      const { data, code, msg } = await exportMrbapplyDetail(params);
      if (code === 200) {
        downloadByUrl({ url: data.url, fileName: data.name });
        createMessage.success(msg);
      } else {
        createMessage.error(msg);
      }
    } catch (error) {
      console.log(error);
    }
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
