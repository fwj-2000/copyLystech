<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs v-model:activeKey="state.activeKey" class="h-full">
          <a-tab-pane key="1" :tab="t('common.todoText')" class="h-full">
            <GridTodo>
              <template #toolbar-actions>
                <a-button v-auth="'btn_review'" type="primary" @click="addOrUpdateHandle">
                  {{ t('routes.qualityAssurance-newMateria-registation') }}
                </a-button>
                <a-button v-auth="'btn_download'" @click="handleExport">
                  {{ t('common.batchExport') }}
                </a-button>
                <a-button v-auth="'btn_transfer'" @click="handleTransfer">
                  {{ t('common.transfer') }}
                </a-button>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)">
                  {{ t('common.searchDetail') }}
                </span>
              </template>
              <template #action="{ row }">
                <TableAction outside :actions="getTableActions(row)" />
              </template>
            </GridTodo>
          </a-tab-pane>

          <a-tab-pane key="2" :tab="t('common.doneText')">
            <GridDone>
              <template #toolbar-actions>
                <a-button v-auth="'btn_sampleCollection'" @click="handleSampleCollection" type="primary">{{ t('common.materialSampleCollection') }}</a-button>
                <ModelConfirmButton
                  v-auth="'btn_recall'"
                  v-bind="{
                    modelConfirm: {
                      title: t('common.tipTitle'),
                      content: t('common.withdrawSelectedData'),
                      onOk: handleRecall.bind(null),
                    },
                  }">
                  <span>{{ t('common.revoke') }} </span>
                </ModelConfirmButton>

                <a-button v-auth="'btn_download'" @click="handleExportDone">
                  {{ t('common.batchExport') }}
                </a-button>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)">
                  {{ t('common.searchDetail') }}
                </span>
              </template>
              <template #expand="{ row }">
                <SubTable :data="row.samplesRecordOutputs" @handleReport="handleFileView" @handleHistory="handleHistory" />
              </template>
              <template #action="{ row }">
                <TableAction outside :actions="getTableActions(row)" />
              </template>
            </GridDone>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <ApplyPop @register="registerApplyPop" @refresh="reload" @reload="reload" />
    <ExportModal @register="registerExportModal" />
    <viewPopup @register="registerView" @reload="reload" />
    <FileListModal @register="registerFile"></FileListModal>
    <HistoryModal @register="registerHistoryModal" />
    <NodeModal @register="registerNodeModal"></NodeModal>
    <TransferModal @register="registerTransferModal" @reload="reload"></TransferModal>
    <!-- <RegisterModal @register="registerRegisterModal" @submit="addOrUpdateHandle"></RegisterModal> -->
    <SampleCollectionModal @register="registerSampleCollectionModal" @success="reloadDone" />
  </div>
</template>

<script lang="ts" setup>
  import { reactive, onMounted, ref, nextTick } from 'vue';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { getNewMaterial, recallMaterial, getNodeDetail, transfer, sampleCollection, exportMaterialExcel } from '/@/api/quanlity/newMetarial';
  import { fileDownload, getReports } from '/@/api/quanlity/newMetarialCheck';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import ApplyPop from './components/ApplyPopup.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { columns, subColumns, columnVxe } from './config';
  import { useModal } from '/@/components/Modal';
  import { useRoute } from 'vue-router';
  import { message } from 'ant-design-vue';
  import { FileListModal } from '/@/components/Upload';
  // import RegisterModal from './components/RegisterModal.vue';
  import viewPopup from '/@/views/engineering/newMateria/devlop/components/addPop.vue';
  import { quanlityformConfigVxe } from '/@/components/CustomComponents/src/material/Constant';
  import { NodeModal, TransferModal } from '/@/components/CustomComponents';
  import { ModelConfirmButton } from '/@/components/Button';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import SubTable from './components/SubTable.vue';
  import SampleCollectionModal from './SampleCollectionModal.vue';
  import HistoryModal from '../check/components/HistoryModal.vue';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';

  const route = useRoute();

  const { t } = useI18n();
  defineOptions({ name: 'qualityAssurance-newMateria-registation' });

  interface SampleRecord {
    id: string;
    isClaimEnum: number; // 核心字段：是否已领取（'0'=未领取，'1'=已领取）
    claimRemarks: string;
    number: number;
    qty: number;
    creatorUserId: string;
    creatorUserName: string;
  }

  interface RowData {
    id: string;
    materialNumber: string;
    samplesRecordOutputs: SampleRecord[];
    materialDevelopApplyId: string;
  }

  const [registerView, { openPopup: openView }] = usePopup();
  const [registerHistoryModal, { openModal: openHistoryModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerFile, { openModal: openFileList }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerApplyPop, { openPopup: openApplyPopup }] = usePopup();
  const [registerTransferModal, { openModal: openTransferModal }] = useModal();
  const [registerSampleCollectionModal, { openModal: openSampleCollectionModal }] = useModal();
  // const [registerRegisterModal, { openModal: openRegisterModal, closeModal: closeRegisterModal }] = useModal();

  interface State {
    Status: string;
    StartTime: string;
    EndTime: string;
    activeKey: string;
  }
  const state = reactive<State>({
    Status: '',
    StartTime: '',
    EndTime: '',
    activeKey: '1',
  });

  const doneCacheList = ref<any[]>([]);

  const formOptions = {
    schema: quanlityformConfigVxe,
    commonConfig: {
      labelClass: 'w-0',
    },
    wrapperClass: 'grid grid-cols-5 gap-1',
    fieldMappingTime: [['pickerVal', ['startTime', 'endTime']]],
    i18nConfig: {
      moduleCode: 'MaterialDevelopApplyColumn',
      transferRange: ['placeholder'],
    },
  };

  function normalizePicker(params) {
    if (params.pickerVal) {
      params.startTime = params.pickerVal[0];
      params.endTime = params.pickerVal[1];
    }
    return params;
  }

  const actionColumn = {
    title: '操作',
    field: 'action',
    width: 70,
    fixed: 'right',
    slots: { default: 'action' },
  };

  const todoColumns = [...columnVxe, actionColumn];
  const doneColumns = [
    columnVxe[0],
    {
      type: 'expand',
      width: 46,
      slots: { content: 'expand' },
    },
    {
      type: 'seq',
      width: 60,
      title: '序号',
    },
    ...columnVxe.slice(1),
    actionColumn,
  ];

  const [GridTodo, { reload: reloadTodo, getFetchParams: getFetchParamsTodo, getSelectRowKeys }] = useVbenVxeGrid({
    formOptions,
    gridOptions: {
      id: 'qualityAssurance-newMateria-registation',
      api: getNewMaterial,
      beforeFetch: params => {
        params.identification = '1';
        return normalizePicker(params);
      },
      columns: todoColumns,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
      },
    },
  });

  const [
    GridDone,
    {
      reload: reloadDone,
      getFetchParams: getFetchParamsDone,
      getSelectRowKeys: getSelectRowKeysDone,
      clearSelectedRowKeys: clearSelectedRowKeysDone,
      setAllRowExpand: setAllRowExpandDone,
    },
  ] = useVbenVxeGrid({
    formOptions,
    gridOptions: {
      id: 'qualityAssurance-newMateria-registation-done',
      api: getNewMaterial,
      beforeFetch: params => {
        params.identification = '2';
        return normalizePicker(params);
      },
      columns: doneColumns,
      toolbarConfig: {
        expandAll: true,
      },
      // afterFetch: () => {
      //   requestAnimationFrame(() => {
      //     setAllRowExpandDone?.(true);
      //   });
      // },
      afterFetch: (data: any) => {
        if (Array.isArray(data?.list)) {
          doneCacheList.value = data.list;
        } else if (Array.isArray(data)) {
          doneCacheList.value = data;
        } else {
          doneCacheList.value = [];
        }
      },
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
      },
    },
  });

  async function addOrUpdateHandle() {
    const idList = (await Promise.resolve(getSelectRowKeys())) || [];
    if (idList.length) {
      return openApplyPopup(true, { ids: idList, title: t('common.add'), type: 'add' });
    }
    message.info(t('common.selectText'));
  }

  // 撤回
  async function handleRecall() {
    const idList = (await Promise.resolve(getSelectRowKeysDone())) || [];
    if (idList.length) {
      const r = await recallMaterial(idList);
      if (r.code == 200) {
        message.success(t('sys.api.operationSuccess'));
        clearSelectedRowKeysDone?.();
        await reloadDone();
      }
    } else {
      message.info(t('common.selectText'));
    }
  }

  async function handleSampleCollection() {
    const idList = (await Promise.resolve(getSelectRowKeysDone())) || [];
    if (!idList.length) {
      message.info(t('common.selectText'));
      return;
    }
    const selectedRows = doneCacheList.value.filter(row => idList.includes(row.id));

    if (!selectedRows.length) {
      message.error('未找到选中数据，请刷新后重试');
      return;
    }

    // 检查是否有样品记录
    const hasSample = selectedRows.some((row: any) => Array.isArray(row.samplesRecordOutputs) && row.samplesRecordOutputs.length);
    if (!hasSample) {
      message.info('选中数据中暂无样品记录');
      return;
    }

    // 过滤：仅保留 isClaimEnum === '0' 的送样记录（未领取）
    const validData: RowData[] = [];
    selectedRows.forEach((row: RowData) => {
      const outputs = row.samplesRecordOutputs || [];
      const validOutputs = outputs.filter((item: SampleRecord) => {
        return item.isClaimEnum === 0;
      });
      if (validOutputs.length) {
        validData.push({
          ...row,
          samplesRecordOutputs: validOutputs,
        });
      }
    });

    // 无未领取记录 → 提示并终止，不打开弹窗
    if (validData.length === 0) {
      message.warning('所选单据的样品已领取');
      return;
    }

    // 有未领取记录 → 打开弹窗
    openSampleCollectionModal(true, { rows: validData });
  }

  // 转办
  async function handleTransfer() {
    const idList = (await Promise.resolve(getSelectRowKeys())) || [];
    if (idList.length) {
      return openTransferModal(true, {
        id: idList || [],
        api: transfer,
        beforeFetch: params => {
          return {
            ids: params.id,
            transferUserId: params.transferUser,
            transferRemarks: params.remark,
          };
        },
      });
    }
  }

  function handleHistory(record) {
    openHistoryModal(true, {
      id: record.id,
    });
  }

  function handleFileView(record) {
    openFileList(true, {
      id: record.id,
      downloadApi: fileDownload,
      listApi: getReports,
      title: t('dict.MaterialDevelopApplyColumn.testReportName'),
    });
  }

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.id,
    });
  }

  const handleExport = async () => {
    openExportModal(true, {
      api: exportMaterialExcel,
      listQuery: {
        ...(await getActiveFetchParams()),
        identification: state.activeKey,
      },
      nameProps: 'title',
      idProps: 'field',
      exportOptions: columns(handleNodeModal),
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
      },
    });
  };

  const handleExportDone = async () => {
    openExportModal(true, {
      api: exportMaterialExcel,
      listQuery: {
        ...(await getActiveFetchParams()),
        identification: state.activeKey,
      },
      nameProps: 'title',
      idProps: 'field',
      exportOptions: columns(handleNodeModal).concat(subColumns()),
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
      },
    });
  };

  function goDetail(id = '') {
    openView(true, { id: id, title: t('common.detailText'), type: 'detailed' });
  }
  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: goDetail.bind(null, record.materialDevelopApplyId),
        auth: 'btn_detail',
      },
    ];
  }
  onMounted(() => {
    reloadTodo();
    reloadDone();
  });

  async function getActiveFetchParams() {
    if (state.activeKey === '1') {
      return (await getFetchParamsTodo()) || {};
    }
    return (await getFetchParamsDone()) || {};
  }

  function reload() {
    if (state.activeKey === '1') {
      reloadTodo();
    } else {
      reloadDone();
    }
  }

  useRouteParams({ id: {}, tab: {} }, params => {
    const { id, tab } = params;
    // 没有 id 就不用处理了
    if (!id) return;
    // 有 tab 就先切到对应 tab（比如 1：待办，2：已办）
    if (tab) {
      state.activeKey = tab;
    }
    nextTick(() => {
      openApplyPopup(true, {
        ids: [id],
      });
    });
  });
</script>

<style lang="less" scoped>
  @import url('/src/design/page.less');
</style>
