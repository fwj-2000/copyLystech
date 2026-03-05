<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs @change="reload" v-model:activeKey="activeKey" class="h-full">
          <a-tab-pane key="1" :tab="t('common.todoText')" class="h-full">
            <Process_Grid>
              <template #toolbar-actions>
                <a-button v-auth="'btn_review'" type="primary" @click="handleSubmit">{{ t('common.newMateriaCheck') }}</a-button>
                <a-button v-auth="'btn_download'" @click="handleProcessExport">{{ t('common.batchExport') }} </a-button>
                <a-button v-auth="'btn_transfer'" @click="handleTransfer">{{ t('common.transfer') }} </a-button>
              </template>

              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)">{{ t('common.viewDetails') }}</span>
              </template>
              <template #expand="{ row }">
                <SubTable :data="row.samplesRecordOutputs" @handleHistory="handleHistory" @handleReport="handleFileView" />
              </template>
              <template #action="{ row }">
                <TableAction outside :actions="getActions(row)" />
              </template>
            </Process_Grid>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('common.doneText')">
            <Done_Grid>
              <template #toolbar-actions>
                <ModelConfirmButton
                  v-bind="{
                    modelConfirm: {
                      title: t('common.tipTitle'),
                      content: t('common.withdrawSelectedData'),
                      onOk: handleRecall.bind(null),
                    },
                  }">
                  <span v-auth="'btn_recall'">{{ t('common.revoke') }}</span>
                </ModelConfirmButton>
                <a-button v-auth="'btn_download'" @click="handleDoneExport">{{ t('common.batchExport') }} </a-button>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)">{{ t('common.viewDetails') }}</span>
              </template>
              <template #expand="{ row }">
                <SubTable :data="row.samplesRecordOutputs" @handleHistory="handleHistory" @handleReport="handleFileView" />
              </template>
              <template #action="{ row }">
                <TableAction outside :actions="getActions(row)" />
              </template>
            </Done_Grid>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <NodeModal @register="registerNodeModal"></NodeModal>
    <HistoryModal @register="registerHistoryModal" />
    <ExportModal @register="registerExportModal" />
    <DetailPopup @register="registerDetail" @reload="reload" @handleReport="handleFileView" />
    <viewPopup @register="registerView" @reload="reload" />
    <FileListModal @register="registerFile"></FileListModal>
    <TransferModal @register="registerTransfer" @reload="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { ActionItem, BasicTable, TableAction, useTable } from '/@/components/Table';
  import { nextTick, onMounted, reactive, toRefs } from 'vue';
  import { columns } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getNewMaterial, exportNewMaterialExcel, recallMaterial, getReports, fileDownload, transferMetariaCheck } from '/@/api/quanlity/newMetarialCheck';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import DetailPopup from './components/DetailPopup.vue';
  import { message } from 'ant-design-vue';
  import { FileListModal } from '/@/components/Upload';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { ModelConfirmButton } from '/@/components/Button';
  import { useRoute } from 'vue-router';
  import { formatTableDefaultText } from '/@/utils';
  import { getQuanlityFormConfig } from '/@/components/CustomComponents/src/material/Constant';
  import viewPopup from '/@/views/engineering/newMateria/devlop/components/addPop.vue';
  import { getNodeDetail } from '/@/api/quanlity/newMetarial';
  import HistoryModal from './components/HistoryModal.vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import SubTable from './components/SubTable.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { NodeModal } from '/@/components/CustomComponents';
  import { TransferModal } from '/@/components/CustomComponents/index';

  defineOptions({ name: 'qualityAssurance-newMateria-check' });
  const { t } = useI18n();
  const { hasBtnP } = usePermission();

  const [registerDetail, { openPopup: openDetail }] = usePopup();
  const [registerView, { openPopup: openView }] = usePopup();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerFile, { openModal: openFileList }] = useModal();
  const [registerHistoryModal, { openModal: openHistoryModal }] = useModal();
  const [registerTransfer, { openModal: openTransfer }] = useModal();

  interface StateType {
    activeKey: string;
  }

  const state = reactive<StateType>({
    activeKey: '1',
  });
  const { activeKey } = toRefs(state);

  const [
    Process_Grid,
    {
      reload: processReload,
      setLoading: processSetLoading,
      getFetchParams: processGetFetchParams,
      getSelectRows: processGetSelectRows,
      getSelectRowKeys: processGetSelectRowKeys,
      clearSelectedRowKeys: processClearSelectedRowKeys,
      setAllRowExpand: processSetAllRowExpand,
    },
  ] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: true,
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getQuanlityFormConfig(hasBtnP),
      fieldMappingTime: [['pickerVal', ['startTime', 'endTime']]],
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'qualityAssurance-newMateria-check-processGrid',
      columns: columns(),
      api: getNewMaterial,
      showIndexColumn: false,
      beforeFetch: params => {
        params.identification = state.activeKey;
        return params;
      },
      // afterFetch: processAfterFetch,
      toolbarConfig: {
        expandAll: true,
      },
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
      },
    },
  });

  // function processAfterFetch() {
  //   setTimeout(() => {
  //     processSetAllRowExpand(true);
  //   }, 300);
  // }

  const [
    Done_Grid,
    {
      reload: doneReload,
      setLoading: doneSetLoading,
      getFetchParams: doneGetFetchParams,
      getSelectRows: doneGetSelectRows,
      getSelectRowKeys: doneGetSelectRowKeys,
      clearSelectedRowKeys: doneClearSelectedRowKeys,
      setAllRowExpand: doneSetAllRowExpand,
    },
  ] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: true,
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getQuanlityFormConfig(hasBtnP),
      fieldMappingTime: [['pickerVal', ['startTime', 'endTime']]],
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'qualityAssurance-newMateria-check-doneGrid',
      columns: columns(),
      api: getNewMaterial,
      showIndexColumn: false,
      toolbarConfig: {
        expandAll: true,
      },
      beforeFetch: params => {
        params.identification = state.activeKey;
        return params;
      },
      // afterFetch: doneAfterFetch,
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
      },
    },
  });

  // function doneAfterFetch() {
  //   setTimeout(() => {
  //     doneSetAllRowExpand(true);
  //   }, 300);
  // }

  function handleFileView(record) {
    openFileList(true, {
      id: record.id,
      downloadApi: fileDownload,
      listApi: getReports,
      hideVersion: true,
      title: t('common.testReport'),
    });
  }
  function handleHistory(record) {
    openHistoryModal(true, {
      id: record.id,
    });
  }
  function reload() {
    if (state.activeKey == '1') {
      return processReload();
    }
    return doneReload();
  }
  // function getFetchParams() {
  //   if (state.activeKey == '1') {
  //     return getFetchParamsTodo();
  //   }
  //   return getFetchParamsDone();
  // }
  // function getSelectRowKeys() {
  //   if (state.activeKey == '1') {
  //     return getSelectRowKeysTodo();
  //   }
  //   return getSelectRowKeysDone();
  // }
  // function clearSelectedRowKeys() {
  //   if (state.activeKey == '1') {
  //     return clearSelectedRowKeysTodo();
  //   }
  //   return clearSelectedRowKeysDone();
  // }

  function getActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: handleReview.bind(null, record.materialDevelopApplyId),
        auth: 'btn_detail',
      },
    ];
  }
  function handleReview(id) {
    openView(true, {
      type: 'detailed',
      id: id,
    });
  }

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.id,
    });
  }

  async function handleProcessExport() {
    openExportModal(true, {
      api: exportNewMaterialExcel,
      listQuery: {
        ...(await processGetFetchParams()),
        identification: state.activeKey,
      },
      exportOptions: columns(),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
      },
    });
  }

  async function handleDoneExport() {
    openExportModal(true, {
      api: exportNewMaterialExcel,
      listQuery: {
        ...(await doneGetFetchParams()),
        identification: state.activeKey,
      },
      exportOptions: columns(),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
      },
    });
  }

  // 撤回（已办）
  async function handleRecall() {
    const idList = doneGetSelectRowKeys() || [];
    if (!idList.length) {
      return message.info(t('common.selectText'));
    }
    try {
      await recallMaterial(idList);
      message.success(t('sys.api.operationSuccess'));
      doneClearSelectedRowKeys();
      reload();
    } catch (e) {
      console.error(e);
    }
  }

  // 转办
  function handleTransfer() {
    const idList = processGetSelectRowKeys() || [];
    if (idList.length) {
      return openTransfer(true, {
        index: 0,
        ids: idList,
        api: transferMetariaCheck,
        beforeFetch: params => {
          return {
            ids: idList,
            transferUserId: params.transferUser,
            transferRemarks: params.remark,
          };
        },
      });
    }
    message.info(t('common.selectText'));
  }

  function handleSubmit() {
    const idList = processGetSelectRowKeys() || [];
    if (idList.length) {
      return openDetail(true, {
        index: 0,
        ids: idList,
      });
    }
    message.info(t('common.selectText'));
  }

  const route = useRoute();
  onMounted(() => {
    const { id, tab } = route.query as any;
    if (id && tab) {
      state.activeKey = tab;
      nextTick(() => {
        handleReview(id);
      });
    }
  });
</script>

<style scoped lang="less">
  @import url('/src/design/page.less');

  :deep(.vxe-body--row-expanded-cell) {
    padding: 0 8px;
  }
</style>
