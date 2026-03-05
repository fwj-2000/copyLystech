<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white p-10px pt-20px">
        <BasicForm @register="registerForm">
          <template #formFooter>
            <div class="flex items-baseline">
              <div class="flex justify-end">
                <a-button type="primary" class="ml-3" @click="searchFn">{{ t('common.queryText') }}</a-button>
                <a-button class="ml-3" @click="resetFn">{{ t('common.resetText') }}</a-button>
                <a-button type="success" class="ml-3" @click="chartFn">{{ t('图表') }}</a-button>
              </div>
            </div>
          </template>
        </BasicForm>
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button @click="exportFn" ghost type="warning">{{ t('common.exportText') }}</a-button>
            </a-space>
          </template>

          <template #action="{ row }">
            <TableAction :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <ChartViewModal @register="registerChartViewModal" />
    <ExportModal @register="registerExportModal" />

    <!-- <CreateTestingFormPop @register="registerCreateTestingFormPop" /> -->
    <!-- <SubmitReviewModal @register="registerSubmitReviewModal" /> -->
    <!-- <MakeImmediateDecisionModal @register="registerMakeImmediateDecisionModal" /> -->
  </div>
</template>

<script lang="ts" setup>
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { ref, nextTick, computed, unref, onMounted } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useModal } from '/@/components/Modal/index.js';
  import { BasicForm, useForm } from '/@/components/Form';
  import { usePopup } from '/@/components/Popup';
  import { createPreInspectionForm, getIqcmasterdatalist, getLotNoListByIqcchkno } from '../../../../api/qms/quality.js';
  import { useUserStore } from '/@/store/modules/user.js';
  import { useMessage } from '/@/hooks/web/useMessage';
  // import CreateTestingFormPop from './components/CreateTestingFormPop.vue';
  import { columns, schemas } from './config.js';
  // import SubmitReviewModal from './components/SubmitReviewModal.vue';
  // import MakeImmediateDecisionModal from './components/MakeImmediateDecisionModal.vue';
  import ChartViewModal from './components/ChartViewModal.vue';
  import dayjs from 'dayjs';

  defineOptions({ name: 'qms-iqc-iqcInput' });
  const userStore = useUserStore();
  const { createMessage, createConfirm } = useMessage();
  const { hasBtnP } = usePermission();
  const { t } = useI18n();
  const beLongType = ref('1');
  const [registerCreateTestingFormPop, { openPopup: openCreateTestingFormPopup }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerSubmitReviewModal, { openModal: openSubmitReviewModal }] = useModal();
  const [registerMakeImmediateDecisionModal, { openModal: openMakeImmediateDecisionModal }] = useModal();
  const [registerChartViewModal, { openModal: openChartViewModal }] = useModal();
  const [registerForm, { getFieldsValue, resetFields, updateSchema }] = useForm({
    labelWidth: '100px',
    baseColProps: { span: 4 },
    showResetButton: true,
    showSubmitButton: true,
    autoSubmitOnEnter: true,
    // i18nConfig: {
    //   moduleCode: 'ProjectMembersGroupColumn',
    //   transferRange: ['placeholder'],
    // },
    schemas,
  });
  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      columns,
      api: () => getIqcmasterdatalist({ ...getFieldsValue(), creatorId: beLongType.value === '1' ? unref(getUserInfo).userId : '' }),
    },
  });

  const getUserInfo = computed(() => userStore.getUserInfo || {});

  function getTableActions(row: any) {
    return [
      {
        title: t('common.audit'),
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: handleAudit.bind(null, row),
        tooltip: t('common.editText'),
        // auth: 'btn_edit',
      },
      {
        title: t('common.cancelAudit'),
        icon: 'icon-ym icon-ym-btn-view',
        onClick: handleCancelAudit.bind(null, row),
        tooltip: t('common.viewText'),
        // auth: 'btn_edit',
      },
      // {
      //   color: 'error',
      //   icon: 'icon-ym icon-ym-delete',
      //   tooltip: t('common.delText'),
      //   modelConfirm: {
      //     onOk: handleDelete.bind(null, row),
      //   },
      // },
    ];
  }

  function handleAudit(row: any) {
    console.log(row);
  }

  function handleCancelAudit(row: any) {
    console.log(row);
  }

  function handleDelete() {
    createConfirm({
      iconType: 'delete',
      title: t('common.tipTitle'),
      content: t('common.delTip'),
      onOk: () => {
        return Promise.resolve();
        /* 处理确定逻辑 */
      },
      onCancel: () => {
        return Promise.reject();
        /* 处理取消逻辑 */
      },
    });
  }

  async function handleExport() {
    // const query = await getQueryParams();
    // openExportModal(true, {
    //   listQuery: { ...query },
    //   //   api: exportExcel,
    //   exportOptions: columns,
    //   nameProps: 'title',
    //   idProps: 'field',
    // });
  }

  // /**
  //  * @description: 获取查询参数
  //  */
  // async function getQueryParams() {
  //   const params = await gridApi.getFetchParams();
  //   const { pager } = gridApi.grid.getProxyInfo()!;
  //   return {
  //     ...params,
  //     ...omit(pager, 'total'),
  //   };
  // }

  function searchFn() {
    gridApi?.query();
  }
  function resetFn() {
    resetFields();
    setTimeout(() => {
      gridApi?.query();
    }, 300);
  }

  function chartFn() {
    console.log('图表');
    openChartViewModal(true, {});
  }

  /**
   * 提交审核
   */
  function batchReviewFn() {
    const grid = gridApi.grid;
    const selectRows = grid.getCheckboxRecords(true);
    if (!selectRows.length) return createMessage.error(t('common.selectText'));
    const errorNum: number = selectRows.filter(item => item.status === 1).length;
    if (errorNum) return createMessage.error(t('只有进度状态等于【检测中】的记录才可以执行【提交审核】操作!'));
    openSubmitReviewModal(true, { selectRows });
  }

  /**
   * 导出
   */
  function exportFn() {}
  onMounted(() => {
    gridApi.query();
  });
</script>

<style lang="less" scoped>
  //   :deep(.lydc-content-wrapper-content) {
  //     .vxe-grid {
  //       padding-top: 0;
  //     }

  //     .vxe-form--wrapper .vxe-form--item:first-child .vxe-form--item-content {
  //       padding-left: 0;
  //     }
  //   }
</style>
