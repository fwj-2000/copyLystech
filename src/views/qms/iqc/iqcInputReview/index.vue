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
          <template #toolbar-actions>
            <a-space class="btn-block">
              <a-button @click="submitforReviewFn" type="primary" ghost v-auth="'btn_review'"> {{ t('common.batchReview') }}</a-button>
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
    <SubmitFormModal @register="registerSubmitFormModal" @reload="reloadFn" moduleCode="IQCApplyColumn" />
    <!-- <SubmitReviewModal @register="registerSubmitReviewModal" @reload="reloadFn" /> -->
  </div>
</template>

<script lang="ts" setup>
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { onMounted, reactive } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useModal } from '/@/components/Modal/index.js';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { columns, getReviewSchemas, schemas, UNREVIEW_SCHEMAS } from './config';
  import SubmitFormModal from '/@/views/qms/mrb/mrbApply/components/SubmitFormModal.vue';
  import { antiaudit, auditorder, exportExcel, getauditorderdata } from '/@/api/qms/iqc.js';
  import { TableAction } from '/@/components/Table';
  import { useRouter } from 'vue-router';
  defineOptions({ name: 'qms-iqc-iqcInputReview' });

  const router = useRouter();
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const state = reactive({
    activeId: '',
  });
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  // const [registerSubmitReviewModal, { openModal: openSubmitReviewModal }] = useModal();
  const [registerSubmitFormModal, { openModal: openSubmitModal }] = useModal();

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
      moduleCode: 'IQCApplyColumn',
      transferRange: ['placeholder'],
    },
    schemas,
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      columns,
      virtualXConfig: {
        enabled: true,
        gt: 0,
      },
      virtualYConfig: {
        enabled: false,
        gt: 0,
      },
      i18nConfig: {
        moduleCode: 'IQCApplyColumn',
      },
      api: params => getauditorderdata({ ...params, ...getFieldsValue() }),
    },
  });

  function getTableActions(row: any) {
    return [
      {
        icon: 'ym-diecut ym-diecut-Union-5',
        onClick: handleReview.bind(null, row),
        tooltip: t('common.submitforReview'),
        auth: 'btn_review',
      },
      {
        icon: 'ym-diecut ym-diecut-Union-7',
        onClick: handleUnView.bind(null, row),
        tooltip: t('common.cancelAudit'),
        auth: 'btn_remove',
      },
    ];
  }

  function submitforReviewFn() {
    const ids = beforeValidateModal();
    const grid = gridApi.grid;
    const selectRows = grid.getCheckboxRecords(true);
    let mrbDisabled = false;
    let isAllOk = true;
    const errorArr: any = []; // 错误信息数组
    const testNos = selectRows.map(item => {
      if (item.testResult !== 'NG') {
        mrbDisabled = true;
      }
      if (item.testResult === 'NG') {
        isAllOk = false;
      }
      if (![7, 2].includes(item.testProgress)) {
        errorArr.push(item.testNo);
      }
      return item.testNo;
    });
    if (errorArr.length) {
      const msg = t('dict.IQCApplyColumn.iqcReviewTips', [errorArr[0]]);
      createMessage.error(msg);
      return;
    }

    if (!ids) return;

    openSubmitModal(true, {
      formSchema: getReviewSchemas(mrbDisabled),
      title: t('common.batchReview'),
      submitApi: auditorder,
      defaultValues: { testNo: testNos.join(',') },
      apiParams: {
        applyIds: ids,
      },
      isAllOk,
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

  function handleReview(row) {
    state.activeId = row.id;
    let mrbDisabled = false;
    let isAllOk = true;

    if (row.testResult !== 'NG') {
      mrbDisabled = true;
    }

    if (row.testResult === 'NG') {
      isAllOk = false;
    }

    // 审核中，退回重审
    if (![7, 2].includes(row.testProgress)) {
      const msg = t('dict.IQCApplyColumn.iqcReviewTips', [row.testNo]);
      createMessage.error(msg);
      return;
    }

    openSubmitModal(true, {
      formSchema: getReviewSchemas(mrbDisabled),
      title: t('common.review'),
      submitApi: auditorder,
      defaultValues: { testNo: row.testNo },
      apiParams: {
        applyIds: [row.id],
      },
      isAllOk,
    });

    // createConfirm({
    //   iconType: 'delete',
    //   title: t('common.tipTitle'),
    //   content: t('common.delTip'),
    //   onOk: () => {
    //     return Promise.resolve();
    //     /* 处理确定逻辑 */
    //   },
    //   onCancel: () => {
    //     return Promise.reject();
    //     /* 处理取消逻辑 */
    //   },
    // });
  }
  function handleUnView(row: any) {
    if (![3, 5].includes(row.testProgress)) {
      const msg = t('dict.IQCApplyColumn.iqcUnReviewTips', [row.testNo]);
      createMessage.error(msg);
      return;
    }
    openSubmitModal(true, {
      formSchema: UNREVIEW_SCHEMAS,
      title: t('common.cancelAudit'),
      submitApi: antiaudit,
      defaultValues: { testNo: row.testNo },
      apiParams: {
        applyId: row.id,
        antiAuditUserId: row.antiAuditUserId,
      },
    });
  }

  async function exportFn() {
    const query = await getFieldsValue();
    openExportModal(true, {
      listQuery: { ...query },
      api: exportExcel,
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'IQCApplyColumn',
      },
    });
  }

  function reloadFn({ form }) {
    // 如果选择了mrb
    if (form.auditType == '3') {
      router.push({ path: '/qms/mrb/mrbApply', query: { lastPage: 'iqcInputReview', id: state.activeId, ...form } });
    } else {
      gridApi?.reload();
    }
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
