<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicForm @register="registerForm" @submit="handleSubmit" @reset="handleReset" />
      </div>
      <div class="lydc-content-wrapper-content bg-white">
        <div class="!h-full">
          <Grid>
            <template #toolbar-actions>
              <a-space>
                <a-button type="primary" @click="addOrUpdateHandle()" v-if="hasBtnP('btn_dispatchWork') && status === 0">{{
                  t('common.dispatchWork')
                }}</a-button>
                <a-button type="primary" ghost @click="goOffDutyPersonnel()" v-if="hasBtnP('btn_offStaff') && status === 0">{{
                  t('dict.OffDutyPersonnelColumn')
                }}</a-button>
                <vShowDropdown v-if="status === 0">
                  <template #overlay>
                    <button @click="batchImportOrExport({ key: 'import' })" v-if="hasBtnP('btn_upload')">{{ t('common.batchImport') }} </button>
                    <button @click="batchImportOrExport({ key: 'export' })" v-if="hasBtnP('btn_download')">{{ t('common.batchExport') }} </button>
                  </template>
                  <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
                </vShowDropdown>
                <a-button v-if="hasBtnP('btn_download') && status === 1" @click="batchImportOrExport({ key: 'batchExport' })">{{
                  t('common.batchExport')
                }}</a-button>
                <!-- 批量删除 -->
                <a-button v-if="hasBtnP('btn_batchRemove') && status === 0" danger @click="handelDelete">{{ t('common.batchDelText') }}</a-button>
              </a-space>
            </template>
            <template #action="{ row }">
              <TableAction outside :actions="getTableActions(row)" />
            </template>
          </Grid>
        </div>
      </div>
    </div>
    <ExportModal @register="registerExportModal" />
    <!-- 派工 -->
    <teleport to="#personnelArrangementOptimiz">
      <DispatchWorkPop @register="registerDispatchWorkPop" @reload="reload"></DispatchWorkPop>
    </teleport>
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { nextTick, onMounted } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { TableAction } from '/@/components/Table';
  import { thousandsFormat } from '/@/utils/lydc';
  import { useRouter } from 'vue-router';
  import {
    getPageList,
    bathDelete,
    getTemplateDownload,
    importExcel,
    saveBatchData,
    getImportTask,
    getImportTaskData,
    cancelImportTask,
    importTaskRead,
    optimalscheduleExport,
  } from '/@/api/qms/personnelArrangementOptimiz';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { columnsVxe, schemas, importColumns } from './config';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import DispatchWorkPop from './DispatchWorkPop/index.vue';
  import vShowDropdown from '/@/components/VShowDropdown/src/vShowDropdown.vue';
  import { useLocaleStoreWithOut } from '/@/store/modules/locale';
  defineOptions({ name: 'qms-IntelligentBitler-abnormalMsgConfig' });
  const props = withDefaults(
    defineProps<{
      status?: string | number;
    }>(),
    {
      status: 0,
    },
  );
  const { t } = useI18n();
  const { hasBtnP } = usePermission();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerDispatchWorkPop, { openPopup: openDispatchWorkPopup }] = usePopup();
  const emit = defineEmits(['batchImportFile']);
  const router = useRouter();
  const { createConfirm, createMessage } = useMessage();
  const locale = useLocaleStoreWithOut().getLocale || '';

  const [registerForm, { getFieldsValue }] = useForm({
    baseColProps: { span: 4 },
    showActionButtonGroup: true,
    showAdvancedButton: false,
    compact: true,
    autoAdvancedLine: 1,
    actionColOptions: {
      span: 4,
    },
    i18nConfig: {
      moduleCode: 'OptimalScheduleColumn',
      transferRange: ['placeholder'],
    },
    schemas,
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: props.status === 0 ? 'qms-intelligentButler-personnelArrangementOptimiz-todoList' : 'qms-intelligentButler-personnelArrangementOptimiz-doneList',
      showIndexColumn: true,
      columns:
        props.status === 0
          ? columnsVxe.filter(item => item.field !== 'machineOperatorName' && item.field !== 'action')
          : columnsVxe.filter(item => item.field !== 'checkbox'),
      api: getPageList,
      beforeFetch: params => {
        return {
          ...params,
          status: props.status,
          ...getFieldsValue(),
        };
      },
      proxyConfig: {
        response: {
          result: 'data.pageData.list',
          total: 'data.pageData.pagination.total',
        },
      },
      i18nConfig: {
        moduleCode: 'OptimalScheduleColumn',
      },
      footerCellClassName: 'vxe-foot-data-cell',
      afterFetch: data => {
        const { machineCount, productCount, setupTimeMinuteCount, workOrderQuantityCount, planQuantityCount, planWorkHourCount } = data.summaryData;
        gridApi.setState({
          gridOptions: {
            footerData: [
              {
                machineNo: machineCount,
                productCode: productCount,
                setupTimeMinute: setupTimeMinuteCount,
                workOrderQuantity: workOrderQuantityCount ? thousandsFormat(workOrderQuantityCount) : 0,
                planQuantity: planQuantityCount ? thousandsFormat(planQuantityCount) : 0,
                planWorkHour: planWorkHourCount,
              },
            ],
          },
        });
      },
    },
  });
  const { reload, clearSelectedRowKeys, getFetchParams, getSelectRows } = gridApi;

  function openDispatchWorkPopupFn() {
    openDispatchWorkPopup(true, { factoryArea: getFieldsValue().factoryArea });
  }

  function addOrUpdateHandle() {
    openDispatchWorkPopupFn();
  }

  function goOffDutyPersonnel() {
    router.push('/productionDeal/basicInformation/offDutyPersonnel');
  }

  function batchImportOrExport({ key }) {
    const openMethod = key === 'import' ? batchImportFile : batchExport;
    openMethod();
  }

  function batchImportFile() {
    const factoryArea = getFieldsValue().factoryArea;
    emit('batchImportFile', {
      importPreviewApi: importExcel,
      importSaveApi: saveBatchData,
      templateApi: getTemplateDownload,
      version: '2',
      templateUrl: '/api/Production/OptimalSchedule/download/importtemplate?factoryArea=' + factoryArea + '&lang=' + locale,
      previewColumn: importColumns,
      usePolling: true,
      pollingParams: {
        interval: 5000,
        getTaskStatus: getImportTask,
        getTaskDataList: getImportTaskData,
        cancelTask: cancelImportTask,
        taskRead: importTaskRead,
      },
      apiParams: {
        importSave: { factoryArea: factoryArea },
        importPreview: { factoryArea: factoryArea },
      },
    });
  }

  const batchExport = async () => {
    openExportModal(true, {
      api: optimalscheduleExport,
      listQuery: {
        ...getFetchParams(),
      },
      nameProps: 'title',
      idProps: 'field',
      exportOptions: columnsVxe,
      i18nConfig: {
        moduleCode: 'OptimalScheduleColumn',
      },
    });
  };

  // 批量删除
  const handelDelete = async () => {
    const list = getSelectRows();
    if (!list.length) return createMessage.warning(t('dict.CheckDataTip'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.PerformBatchDeletionTip'),
      onOk: async () => {
        // 获取勾选的数据
        const ids = list.map(item => item.id);
        const res = await bathDelete(ids);
        if (res.code === 200) {
          createMessage.success(res.msg);
          reload();
        }
      },
    });
  };

  // 详情
  const handleDetail = (row: any) => {
    openDispatchWorkPopup(true, { type: 'detail', row });
  };

  function getTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: handleDetail.bind(null, row),
        tooltip: t('common.detailText'),
        // auth: 'btn_edit',
      },
    ];
  }

  function handleSubmit() {
    handleSearch();
  }
  function handleReset() {
    clearSelectedRowKeys();
    handleSearch();
  }
  function handleSearch() {
    clearSelectedRowKeys();
    nextTick(() => {
      reload();
    });
  }

  onMounted(() => {
    reload();
  });

  defineExpose({ reload });
</script>

<style lang="less" scoped>
  :deep(.vxe-table) {
    .vxe-foot-data-cell {
      font-weight: bold;
      color: #000;
      background-color: rgb(255 123 0 / 20%);
    }
  }
</style>
