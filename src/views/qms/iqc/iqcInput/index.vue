<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <div class="bg-white pb-10px">
          <ApiSelect
            class="sapFactory-select mr-12px pr-20px bg-[#f0f0f0] min-w-[140px]"
            :api="getFactoryList"
            :placeholder="t('dict.CommonCol.factoryArea')"
            v-model:value="factoryArea"
            @change="searchFn"
            :show-search="true"
            :filter-option="factoryFilterOption"
            result-field="data"
            label-field="fullName"
            value-field="enCode"
            key="id"
            :not-found-content="null"
            :immediate="true"
            :bordered="false"
            :autofocus="false"
            :dropdownMatchSelectWidth="false">
            <template #suffixIcon>
              <div class="pr-10px">
                <i class="icon-ym icon-ym-unfold pr-10px color-[#999] text-[12px] inline-block"></i>
              </div>
            </template>
          </ApiSelect>
        </div>
        <BasicForm @register="registerForm"> </BasicForm>
      </div>
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space class="btn-block">
              <a-button @click="createNewTestingFormFn" type="primary" v-auth="'btn_add'">
                {{ t('common.syncMoldTestOrder') }}
              </a-button>
              <a-button @click="syncTestingFormFn" type="primary" v-auth="'btn_syncSap'">
                {{ t('common.syncSapTestOrder') }}
              </a-button>
              <a-button @click="cancelinspectionFn" type="primary" v-auth="'btn_cancelinspection'"> {{ t('common.cancelinspection') }}</a-button>
              <a-button @click="submitforReviewFn" type="primary" ghost v-auth="'btn_review'"> {{ t('common.submitforReview') }}</a-button>
              <a-button @click="makeImmediateDecisionFn" type="primary" ghost v-auth="'btn_makeImmediate'">{{ t('common.makeImmediateDecision') }}</a-button>
              <a-button @click="exportFn" v-auth="'btn_download'"> {{ t('common.exportText') }}</a-button>
            </a-space>
          </template>

          <template #action="{ row }">
            <TableAction :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <SyncSAPPop @register="registerSyncSAPPop" @reload="reloadFn" />
    <ExportModal @register="registerExportModal" />
    <CreateTestingFormPop @register="registerCreateTestingFormPop" @reload="reloadFn" />
    <InspectionDataPop @register="registerInspectionDataPop" @reload="reloadFn" />
    <SubmitReviewModal @register="registerSubmitReviewModal" @reload="reloadFn" />
    <IqcReportModal @register="registerIqcReportModal" />
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
  import { useMessage } from '/@/hooks/web/useMessage';
  import { columns, schemas } from './config';
  import CreateTestingFormPop from './components/CreateTestingFormPop.vue';
  import SubmitReviewModal from './components/SubmitReviewModal.vue';
  import InspectionDataPop from './components/inspectionDataPop.vue';
  import { batchdecisionorder, bulkCancelIqcapply, exportExcel, getIqcapplyList, getFactoryList, getCurrentUser } from '/@/api/qms/iqc.js';
  import SyncSAPPop from './components/SyncSAPPop.vue';
  import { TableAction } from '/@/components/Table';
  import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
  import IqcReportModal from '/@/views/qms/iqc/components/IqcReportModal/index.vue';
  import { dE } from '@fullcalendar/core/internal-common';
  defineOptions({ name: 'qms-iqc-iqcInput' });
  const { createMessage, createConfirm } = useMessage();
  const { t } = useI18n();
  const factoryArea = ref();

  const [registerInspectionDataPop, { openPopup: openInspectionDataPopup }] = usePopup();
  const [registerCreateTestingFormPop, { openPopup: openCreateTestingFormPopup }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerSubmitReviewModal, { openModal: openSubmitReviewModal }] = useModal();
  const [registerIqcReportModal, { openModal: openIqcReportModal }] = useModal();
  const [registerSyncSAPPop, { openPopup: openSyncSAPPop }] = usePopup();
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
      api: params => getIqcapplyList({ ...params, ...getFieldsValue(), factoryArea: factoryArea.value }),
    },
  });

  function getTableActions(row: any) {
    return [
      {
        icon: 'icon-ym icon-ym-edit',
        onClick: handleInput.bind(null, row),
        tooltip: t('数据录入'),
        auth: 'btn_edit',
      },
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: handleEdit.bind(null, row),
        tooltip: t('common.editText'),
        auth: 'btn_edit',
      },
      {
        icon: 'icon-ym icon-ym-view',
        // label:'查看报告'
        onClick: handleView.bind(null, row),
        tooltip: t('common.view'),
        auth: 'btn_view',
      },
    ];
  }

  async function handleInput(row) {
    let result = await getCurrentUser();

    if (row.testProgress == 6 && result.data == row.creatorUserId) return openInspectionDataPopup(true, { row });

    if (row.auditUserName) return createMessage.error(t('dict.IQCApplyColumn.iqcInputTips'));

    if (result.data != row.creatorUserId) return createMessage.error(t('dict.IQCApplyColumn.iqcTestTips'));

    openInspectionDataPopup(true, { row });
  }

  function handleEdit(row: any) {
    if (row.testUserName) return createMessage.error(t('dict.IQCApplyColumn.iqcEditTips'));
    openCreateTestingFormPopup(true, { id: row.id });
  }

  function handleView(row: any) {
    const params = {
      data: row,
      title: t('common.detailText'),
      // mode: 'view',
    };
    openIqcReportModal(true, params);
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
        moduleCode: 'MrbApplyColumn',
      },
    });
  }

  const factoryFilterOption = (inputValue, path) => {
    return [path].some(option => option.label.indexOf(inputValue) > -1);
  };

  function reloadFn() {
    gridApi?.reload();
  }

  function searchFn(): Promise<void> {
    return gridApi?.query();
  }

  function resetFn(): any {
    setTimeout(() => {
      searchFn();
    }, 300);
  }

  function createNewTestingFormFn() {
    openSyncSAPPop(true, { factoryArea: factoryArea.value, type: 'diecut' });
  }

  function syncTestingFormFn() {
    openSyncSAPPop(true, { factoryArea: factoryArea.value, type: 'sap' });
  }

  async function bulkCancelIqcapplyFn(params) {
    try {
      const { code, msg } = await bulkCancelIqcapply(params);
      if (code === 200) {
        createMessage.success(msg);
        reloadFn();
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 取消检验
   */
  function cancelinspectionFn() {
    const grid = gridApi.grid;
    const selectRows = grid.getCheckboxRecords(true);
    if (!selectRows.length) return createMessage.error(t('common.selectText'));
    const errorNum: number = selectRows.filter(item => item.testProgress === 1 || item.testProgress === 6).length;
    const msg = t('dict.IQCApplyColumn.operaTips', [t('dict.IQCTestProgress.1'), t('dict.IQCTestProgress.6'), t('common.cancelinspection')]);
    if (!errorNum) return createMessage.error(msg);

    createConfirm({
      iconType: 'error',
      title: t('common.tipTitle'),
      content: t('dict.IQCApplyColumn.cancelinspectionTips'),
      onOk: () => {
        grid.removeCheckboxRow();
        bulkCancelIqcapplyFn(selectRows.map(item => item.id));
      },
    });
  }
  /**
   * 提交审核
   */
  function submitforReviewFn() {
    const grid = gridApi.grid;
    const selectRows = grid.getCheckboxRecords(true);
    if (!selectRows.length) return createMessage.error(t('common.selectText'));

    const errorNum: number = selectRows.filter(item => item.testProgress === 1).length;
    console.log(errorNum, selectRows.length);
    const msg = t('dict.IQCApplyColumn.operaTips', [t('dict.IQCTestProgress.1'), t('common.submitforReview')]);
    if (!errorNum || errorNum != selectRows.length) return createMessage.error(msg);

    openSubmitReviewModal(true, { data: selectRows });
  }

  /**
   * 立即决策
   */
  function makeImmediateDecisionFn() {
    const grid = gridApi.grid;
    const selectRows = grid.getCheckboxRecords(true);
    const ids: any[] = selectRows.map(item => item.id);
    const testNos: any[] = selectRows.map(item => item.testNo);
    if (!ids.length) return createMessage.error(t('common.selectText'));
    const errorNum: number = selectRows.filter(item => ![3].includes(item.testProgress)).length;
    const msg = t('dict.IQCApplyColumn.operaTips', [t('common.completed'), t('common.makeImmediateDecision')]);
    if (errorNum) return createMessage.error(msg);
    const content = testNos.join(', ');
    createConfirm({
      iconType: 'warning',
      title: t('确认立即决策:'),
      content: content,
      onOk: () => {
        batchdecisionorderFn(ids);
      },
    });
  }
  /**
   * 批量立即决策
   */
  async function batchdecisionorderFn(params) {
    try {
      const { code, msg } = await batchdecisionorder(params);
      if (code === 200) {
        reloadFn();
        return createMessage.success(msg);
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

  .lydc-content-wrapper {
    &-select {
      background: #fff;
      display: flex;
      align-items: flex-start;
      padding: 16px 0 0 12px;
      height: 60px;
      border: 1px solid #f0f0f0;
    }
  }

  :deep(.sapFactory-select .ant-select-selection-item) {
    color: #000;
    font-weight: bolder !important;
    font-size: 14px;
  }
</style>
