<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicForm @register="registerForm">
          <!-- <template #formFooter>
            <a-button type="primary" class="ml-3" @click="searchFn">{{ t('common.queryText') }}</a-button>
            <a-button class="ml-3" @click="resetFn">{{ t('common.resetText') }}</a-button>
          </template> -->
        </BasicForm>
      </div>
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #nodeDetail="{ row }">
            <div class="table-a" @click="handleNodeModal(row)"> {{ t('common.viewDetails') }} </div>
          </template>
          <template #toolbar-actions>
            <a-space class="btn-block">
              <a-button @click="createFn({})" type="primary" v-auth="'btn_add'">
                {{ t('common.addText') }}
              </a-button>

              <a-button @click="reviewFn" type="primary" v-auth="'btn_review'">
                {{ t('common.reviewText') }}
              </a-button>

              <!-- 撤回 -->
              <a-button v-auth="'btn_recall'" class="mr-12px" type="primary" ghost @click="handelWithdraw">
                {{ t('common.revoke') }}
              </a-button>

              <a-button @click="executionExplanationFn" type="primary" ghost v-auth="'btn_executionExplanation'">
                {{ t('common.executionExplanation') }}
              </a-button>
              <a-button @click="executionReviewFn" type="primary" ghost v-auth="'btn_executionReview'">
                {{ t('common.executionReview') }}
              </a-button>

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
    <SubmitFormModal @register="registerSubmitFormModal" @reload="reloadFn" moduleCode="MrbApplyColumn" />
    <MrbApplyPop @register="registerMrbApplyPop" @reload="reloadFn" />
    <NodeModal @register="registerNodeModal"></NodeModal>
  </div>
</template>

<script lang="ts" setup>
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { onMounted } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useModal } from '/@/components/Modal/index.js';
  import { BasicForm, useForm } from '/@/components/Form';
  import { usePopup } from '/@/components/Popup';
  import {
    auditExecution,
    auditMrbapply,
    bulkWithdraw,
    exportMrbapply,
    exportMrbapplyDetail,
    getMrbapply,
    mrbBulkDelete,
    submitExecutionNote,
  } from '/@/api/qms/mrb';
  import { NodeModal } from '/@/components/CustomComponents';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { columns, schemas } from './config';
  import { TableAction } from '/@/components/Table';
  import MrbApplyPop from './components/mrbApplyPop/index.vue';
  import SubmitFormModal from './components/SubmitFormModal.vue';
  import { EXECUTIONEXPLANATION_SCHEMAS, EXECUTIONREVIEW_SCHEMAS, MRBREVIEW_SCHEMAS } from './components/mrbApplyPop/config.js';
  import { downloadByUrl } from '/@/utils/file/download.js';
  import { useRouter } from 'vue-router';
  import { getauditorderdetail } from '/@/api/qms/iqc';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  const router = useRouter();

  defineOptions({ name: 'qms-mrb-mrbApply' });

  const { createMessage, createConfirm } = useMessage();
  const { t } = useI18n();

  const [registerMrbApplyPop, { openPopup: openMrbApplyPopup }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerSubmitFormModal, { openModal: openSubmitModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();

  const [registerForm, { getFieldsValue, setFieldsValue }] = useForm({
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
      rowConfig: {
        keyField: 'id',
      },
      height: '100%',
      api: params => getMrbapply({ ...params, ...getFieldsValue() }),
      i18nConfig: {
        moduleCode: 'MrbApplyColumn',
      },
    },
  });

  function getTableActions(row: any) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: handleEdit.bind(null, row),
        tooltip: t('common.editText'),
        auth: 'btn_edit',
      },
      {
        icon: 'icon-ym icon-ym-view',
        onClick: handleView.bind(null, row),
        tooltip: t('common.detailText'),
        auth: 'btn_view',
      },
      {
        icon: 'icon-ym icon-ym-delete',
        tooltip: t('common.delText'),
        modelConfirm: {
          onOk: handleDelete.bind(null, row),
        },
        auth: 'btn_remove',
      },
    ];
  }

  function handleEdit(row: any) {
    if (row.status != 0) return createMessage.error(t('dict.MrbApplyColumn.editTips'));
    createFn(row);
  }
  function handleDelete(row: any) {
    mrbBulkDeleteFn(row.id);
  }

  function handleView(row: any) {
    const params = {
      data: row,
      title: t('common.detailText'),
      mode: 'view',
    };
    openMrbApplyPopup(true, params);
  }

  async function mrbBulkDeleteFn(id) {
    try {
      const { code, msg } = await mrbBulkDelete([id]);
      if (code === 200) {
        reloadFn();
        createMessage.success(msg);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.flowBillId || record.id,
      fetchSetting: {
        listField: 'flowNodeInstanceHisList',
      },
    });
  }

  function searchFn(): Promise<void> {
    return gridApi?.query();
  }
  function reloadFn(): any {
    gridApi?.reload();
  }

  function resetFn(): any {
    // resetFields();
    setTimeout(() => {
      gridApi?.query();
    }, 300);
  }

  function createFn(data: any = {}): void {
    openMrbApplyPopup(true, {
      data,
      title: data.id ? t('common.editText') : t('common.addText'),
    });
  }

  function reviewFn() {
    const ids = beforeValidateModal();
    if (!ids) return;
    openSubmitModal(true, {
      title: 'MRB' + t('common.review'),
      submitApi: auditMrbapply,
      formSchema: MRBREVIEW_SCHEMAS,
      apiParams: {
        ids,
      },
    });
  }

  // 批量撤回
  const handelWithdraw = async () => {
    const ids = beforeValidateModal();
    if (!ids) return;
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.PerformBatchRecallTip'),
      onOk: async () => {
        const res = await bulkWithdraw(ids);
        if (res.code === 200) {
          reloadFn();
        }
      },
    });
  };

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
   * 执行情况说明
   */
  function executionExplanationFn() {
    const ids = beforeValidateModal();
    if (!ids) return;
    openSubmitModal(true, {
      formSchema: EXECUTIONEXPLANATION_SCHEMAS,
      apiParams: {
        ids,
      },
      title: t('dict.MrbApplyColumn.executionExplanationTitle'),
      submitApi: submitExecutionNote,
    });
  }

  /**
   * 执行情况审核
   */
  function executionReviewFn() {
    const ids = beforeValidateModal();
    if (!ids) return;
    openSubmitModal(true, {
      formSchema: EXECUTIONREVIEW_SCHEMAS,
      apiParams: {
        ids,
      },
      title: t('dict.MrbApplyColumn.executionExplanationTitle'),
      submitApi: auditExecution,
    });
    // openExecutionReviewModal(true, ids);
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
  async function getauditorderdataFn(params) {
    // changeLoading(true);
    try {
      const { data, code } = await getauditorderdetail(params);
      if (code === 200) {
        return data;
      }
    } catch (error) {
      console.log(error);
    } finally {
      // changeLoading(false);
    }
  }

  onMounted(async () => {
    const { query } = router.currentRoute.value;
    console.log(query, 'query');
    const mrbApplyNo = query.mrbApplyNo || '';
    setFieldsValue({ mrbApplyNo: mrbApplyNo });

    setTimeout(() => {
      gridApi.query();
    }, 300);

    if (query.lastPage === 'iqcInputReview') {
      const iqcDetail = await getauditorderdataFn({ testNo: query.testNo });
      if (iqcDetail) {
        // createFn({ id: query.id, iqcDetails: { ...iqcDetails, ...query } });
        openMrbApplyPopup(true, {
          iqcDetails: { ...iqcDetail, ...query },
          title: t('common.addText'),
        });
      }
    }
  });
</script>

<style lang="less" scoped>
  .btn-block button {
    display: flex;
    align-items: center;
  }
</style>
