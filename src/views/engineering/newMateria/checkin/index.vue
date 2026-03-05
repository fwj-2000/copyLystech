<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs @change="reload" v-model:activeKey="activeKey" class="h-full">
          <a-tab-pane key="1" :tab="t('common.todoText')" class="h-full">
            <Todo_Grid>
              <template #toolbar-actions>
                <a-button v-auth="'btn_review'" type="primary" @click="handleSubmit">{{ t('dict.common.checkResult') }}</a-button>
                <a-button v-auth="'btn_stop'" @click="handleStop">{{ t('common.stopText') }}</a-button>
                <a-button v-auth="'btn_download'" @click="handleUnReviewExport">{{ t('common.batchExport') }} </a-button>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)">{{ t('common.searchDetail') }}</span>
              </template>
              <template #expand="{ row }">
                <SubTable :data="row.samplesRecordOutputs" @handleHistory="handleHistory" @handleReport="handleFileView" />
              </template>
              <template #action="{ row }">
                <TableAction outside :actions="getunReviewActions(row)" />
              </template>
            </Todo_Grid>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('common.toCheck')" class="h-full">
            <Check_Grid>
              <template #toolbar-actions>
                <a-button v-auth="'btn_review'" type="primary" @click="handleDeal">{{ t('common.deal') }}</a-button>
                <ModelConfirmButton
                  v-bind="{
                    modelConfirm: {
                      title: t('common.tipTitle'),
                      content: t('common.withdrawSelectedData'),
                      onOk: handleRecall.bind(null, '2'),
                    },
                  }">
                  <span v-auth="'btn_recall'">{{ t('common.revoke') }}</span>
                </ModelConfirmButton>
                <a-button v-auth="'btn_download'" @click="handleUnReviewExport">{{ t('common.batchExport') }} </a-button>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)">{{ t('common.searchDetail') }}</span>
              </template>
              <template #expand="{ row }">
                <SubTable :data="row.samplesRecordOutputs" @handleHistory="handleHistory" @handleReport="handleFileView" />
              </template>
              <template #action="{ row }">
                <TableAction outside :actions="getunReviewActions(row)" />
              </template>
            </Check_Grid>
          </a-tab-pane>
          <a-tab-pane key="3" :tab="t('common.doneText')" class="h-full">
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
                <a-button v-auth="'btn_download'" @click="handleUnReviewExport">{{ t('common.batchExport') }} </a-button>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)">{{ t('common.searchDetail') }}</span>
              </template>
              <template #expand="{ row }">
                <SubTable :data="row.samplesRecordOutputs" @handleHistory="handleHistory" @handleReport="handleFileView" />
              </template>
              <template #action="{ row }">
                <TableAction outside :actions="getunReviewActions(row)" />
              </template>
            </Done_Grid>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <NodeModal @register="registerNodeModal"></NodeModal>
    <HistoryModal @register="registerHistoryModal" />
    <ExportModal @register="registerExportModal" />
    <Modal @register="registerModal" @reload="reload" />
    <DealModal @register="registerDealModal" @reload="reload"></DealModal>
    <DetailPopup @register="registerDetail" @reload="reload" />
    <viewPopup @register="registerView" @reload="reload" />
    <FileListModal @register="registerFile"></FileListModal>
    <RemarkModal @register="registerRemarkModal" @reload="reload"></RemarkModal>
  </div>
</template>

<script lang="ts" setup>
  import { ActionItem, TableAction } from '/@/components/Table';
  import { nextTick, onMounted, reactive, toRefs } from 'vue';
  import { columns } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getNewMaterial, exportNewMaterialExcel, recallMaterial, stopMaterial, recallMaterialToDo } from '/@/api/engineering/newMateriaCheckin';
  import { useModal } from '/@/components/Modal';
  import Modal from './components/Modal.vue';
  import DealModal from './components/DealModal.vue';
  import { usePopup } from '/@/components/Popup';
  import DetailPopup from '/@/views/engineering/newMateria/devlop/components/addPop.vue';
  import { NodeModal, RemarkModal } from '/@/components/CustomComponents';
  import { useMessage } from '/@/hooks/web/useMessage';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { getNodeDetail } from '/@/api/quanlity/newMetarial';
  import { ModelConfirmButton } from '/@/components/Button';
  import { useRoute } from 'vue-router';
  import viewPopup from '/@/views/engineering/newMateria/devlop/components/addPop.vue';
  import { getQuanlityformConfigVxe } from '/@/components/CustomComponents/src/material/Constant';
  import { fileDownload, getReports } from '/@/api/quanlity/newMetarialCheck';
  import { FileListModal } from '/@/components/Upload';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import SubTable from './components/SubTable.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import HistoryModal from '../../../qualityAssurance/newMateria/check/components/HistoryModal.vue';

  defineOptions({ name: 'engineering-newMateria-checkin' });
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const { hasBtnP } = usePermission();

  const [registerModal, { openModal }] = useModal();
  const [registerDealModal, { openModal: openDealModal }] = useModal();
  const [registerDetail, { openPopup: openDetail }] = usePopup();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerView, { openPopup: openView }] = usePopup();
  const [registerFile, { openModal: openFileList }] = useModal();
  const [registerRemarkModal, { openModal: openRemarkModal }] = useModal();
  const [registerHistoryModal, { openModal: openHistoryModal }] = useModal();

  interface StateType {
    activeKey: string;
  }

  const state = reactive<StateType>({
    activeKey: '1',
  });
  const { activeKey } = toRefs(state);

  const baseFormOptions = {
    collapsed: true,
    showCollapseButton: true,
    submitOnChange: false,
    submitOnEnter: true,
    commonConfig: {
      componentProps: {},
      labelClass: 'w-0',
    },
    wrapperClass: 'grid grid-cols-5 gap-4',
    schema: getQuanlityformConfigVxe(hasBtnP),
    fieldMappingTime: [['pickerVal', ['startTime', 'endTime']]],
    i18nConfig: {
      moduleCode: 'MaterialDevelopApplyColumn',
      transferRange: ['placeholder'],
    },
  };

  const baseGridOptions = {
    border: true,
    showIndexColumn: false,
    api: getNewMaterial,
    toolbarConfig: {
      expandAll: true,
    },
    i18nConfig: {
      moduleCode: 'MaterialDevelopApplyColumn',
    },
  };

  const [
    Todo_Grid,
    {
      reload: todoReload,
      getFetchParams: todoGetFetchParams,
      getSelectRowKeys: todoGetSelectRowKeys,
      clearSelectedRowKeys: todoClearSelectedRowKeys,
      setAllRowExpand: todoSetAllRowExpand,
    },
  ] = useVbenVxeGrid({
    formOptions: { ...baseFormOptions },
    gridOptions: {
      ...baseGridOptions,
      id: 'engineering-newMateria-checkin-todoGrid',
      columns: columns(),
      beforeFetch: params => {
        params.identification = '1';
        return params;
      },
      afterFetch: () => {
        setTimeout(() => {
          todoSetAllRowExpand(true);
        }, 300);
      },
    },
  });

  const [
    Check_Grid,
    {
      reload: checkReload,
      getFetchParams: checkGetFetchParams,
      getSelectRowKeys: checkGetSelectRowKeys,
      clearSelectedRowKeys: checkClearSelectedRowKeys,
      setAllRowExpand: checkSetAllRowExpand,
    },
  ] = useVbenVxeGrid({
    formOptions: { ...baseFormOptions },
    gridOptions: {
      ...baseGridOptions,
      id: 'engineering-newMateria-checkin-checkGrid',
      columns: columns(),
      beforeFetch: params => {
        params.identification = '2';
        return params;
      },
      afterFetch: () => {
        setTimeout(() => {
          checkSetAllRowExpand(true);
        }, 300);
      },
    },
  });

  const [
    Done_Grid,
    {
      reload: doneReload,
      getFetchParams: doneGetFetchParams,
      getSelectRowKeys: doneGetSelectRowKeys,
      clearSelectedRowKeys: doneClearSelectedRowKeys,
      setAllRowExpand: doneSetAllRowExpand,
    },
  ] = useVbenVxeGrid({
    formOptions: { ...baseFormOptions },
    gridOptions: {
      ...baseGridOptions,
      id: 'engineering-newMateria-checkin-doneGrid',
      columns: columns(),
      beforeFetch: params => {
        params.identification = '3';
        return params;
      },
      afterFetch: () => {
        setTimeout(() => {
          doneSetAllRowExpand(true);
        }, 300);
      },
    },
  });

  function getunReviewActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: handleReview.bind(null, record.materialDevelopApplyId),
        // auth: 'btn_detail',
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

  async function reload() {
    if (state.activeKey === '1') {
      return todoReload();
    }
    if (state.activeKey === '2') {
      return checkReload();
    }
    return doneReload();
  }

  async function getFetchParams() {
    if (state.activeKey === '1') {
      return (await todoGetFetchParams()) || {};
    }
    if (state.activeKey === '2') {
      return (await checkGetFetchParams()) || {};
    }
    return (await doneGetFetchParams()) || {};
  }

  async function getSelectRowKeys() {
    if (state.activeKey === '1') {
      return (await Promise.resolve(todoGetSelectRowKeys())) || [];
    }
    if (state.activeKey === '2') {
      return (await Promise.resolve(checkGetSelectRowKeys())) || [];
    }
    return (await Promise.resolve(doneGetSelectRowKeys())) || [];
  }

  async function clearSelectedRowKeys() {
    if (state.activeKey === '1') {
      return Promise.resolve(todoClearSelectedRowKeys());
    }
    if (state.activeKey === '2') {
      return Promise.resolve(checkClearSelectedRowKeys());
    }
    return Promise.resolve(doneClearSelectedRowKeys());
  }

  async function handleUnReviewExport() {
    openExportModal(true, {
      api: exportNewMaterialExcel,
      listQuery: {
        ...(await getFetchParams()),
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

  async function handleSelectData(method) {
    const idList = (await getSelectRowKeys()) || [];
    if (idList.length) {
      const r = await method(idList);
      if (r.code == 200) {
        createMessage.success(t('sys.api.operationSuccess'));
        await refreshTable();
      }
    } else {
      createMessage.info(t('common.selectText'));
    }
  }

  // 撤回
  async function handleRecall(type) {
    await handleSelectData(type == 2 ? recallMaterialToDo : recallMaterial);
  }

  async function handleSubmit() {
    const idList = (await getSelectRowKeys()) || [];
    if (idList.length) {
      return openModal(true, {
        index: 0,
        ids: idList,
      });
    }
    createMessage.info(t('common.selectText'));
  }

  // 终止
  async function handleStop() {
    const idList = (await getSelectRowKeys()) || [];
    if (!idList.length) {
      return createMessage.info(t('common.selectText'));
    }
    openRemarkModal(true, {
      api: stopMaterial,
      type: 'stop',
      title: t('common.stopText'),
      required: true,
      beforeFetch: params => {
        return {
          ids: idList,
          terminationRemarks: params.remarks,
        };
      },
    });
  }

  async function refreshTable() {
    await reload();
    await clearSelectedRowKeys();
  }

  // handleDeal
  async function handleDeal() {
    const idList = (await getSelectRowKeys()) || [];
    if (idList.length) {
      return openDealModal(true, {
        index: 0,
        ids: idList,
      });
    }
    createMessage.info(t('common.selectText'));
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
