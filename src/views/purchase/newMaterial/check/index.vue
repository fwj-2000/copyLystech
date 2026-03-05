<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs @change="reload" v-model:activeKey="activeKey">
          <a-tab-pane key="1" :tab="t('common.ngTodo')">
            <Todo_Grid>
              <template #toolbar-actions>
                <a-button v-auth="'btn_recommand'" type="primary" @click="handleRecommend">{{ t('common.reRecommend') }}</a-button>
                <ModelConfirmButton
                  v-bind="{
                    modelConfirm: {
                      title: t('common.tipTitle'),
                      content: t('common.reSendSampleTip'),
                      onOk: handleResample.bind(null),
                    },
                  }">
                  <span v-auth="'btn_sample'">{{ t('comon.reSendSample') }}</span>
                </ModelConfirmButton>
                <a-button v-auth="'btn_back'" type="primary" @click="handleBackEngineering">{{ t('common.backEngineer') }}</a-button>
                <a-button v-auth="'btn_download'" @click="handleUnReviewExport">{{ t('common.batchExport') }} </a-button>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)">{{ t('common.viewDetails') }}</span>
              </template>
              <template #expand="{ row }">
                <SubTable :data="row.samplesRecordOutputs" @handleHistory="handleHistory" @handleReport="handleFileView" />
              </template>
              <template #action="{ row }">
                <TableAction outside :actions="getunReviewActions(row)" />
              </template>
            </Todo_Grid>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('common.ngDone')">
            <Check_Grid>
              <template #toolbar-actions>
                <!-- <ModelConfirmButton
                  v-auth="'btn_recall'"
                  v-bind="{
                    modelConfirm: {
                      title: t('common.tipTitle'),
                      content: t('common.withdrawSelectedData'),
                      onOk: handleRecall.bind(null),
                    },
                  }">
                  <span>{{ t('common.revoke') }} </span>
                </ModelConfirmButton> -->
                <a-button v-auth="'btn_download'" @click="handleUnReviewExport">{{ t('common.batchExport') }} </a-button>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)">{{ t('common.viewDetails') }}</span>
              </template>
              <template #expand="{ row }">
                <SubTable :data="row.samplesRecordOutputs" @handleReport="handleFileView" />
              </template>
              <template #action="{ row }">
                <TableAction outside :actions="getunReviewActions(row)" />
              </template>
            </Check_Grid>
          </a-tab-pane>
          <!-- <a-tab-pane key="3" :tab="t('common.checkOk')">
            <Done_Grid>
              <template #toolbar-actions>
                <a-button v-auth="'btn_download'" @click="handleUnReviewExport">{{ t('common.batchExport') }} </a-button>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)">{{ t('common.viewDetails') }}</span>
              </template>
              <template #expand="{ row }">
                <SubTable :data="row.samplesRecordOutputs" @handleReport="handleFileView" />
              </template>
              <template #action="{ row }">
                <TableAction outside :actions="getunReviewActions(row)" />
              </template>
            </Done_Grid>
          </a-tab-pane> -->
        </a-tabs>
      </div>
    </div>
    <NodeModal @register="registerNodeModal"></NodeModal>
    <ExportModal @register="registerExportModal" />
    <DetailPopup @register="registerDetail" @reload="reload" />
    <viewPopup @register="registerView" @reload="reload" />
    <RemarkModal @register="registerRemarkModal" @reload="reload"></RemarkModal>
    <HistoryModal @register="registerHistoryModal" />

    <FileListModal @register="registerFile" />
  </div>
</template>

<script lang="ts" setup>
  import { ActionItem, TableAction } from '/@/components/Table';
  import { nextTick, reactive, toRefs } from 'vue';
  import { columns, todoColumns, checkColumns } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getNewMaterial, exportNewMaterialExcel, recallMaterial, sampleMaterial, rejectMaterial } from '/@/api/purchase/newMateriaCheckin';
  import { getReports, fileDownload } from '/@/api/quanlity/newMetarialCheck';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import DetailPopup from './components/DetailPopup.vue';
  import { NodeModal, RemarkModal } from '/@/components/CustomComponents';
  import { message } from 'ant-design-vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { getNodeDetail } from '/@/api/quanlity/newMetarial';
  import { ModelConfirmButton } from '/@/components/Button';
  import viewPopup from '/@/views/engineering/newMateria/devlop/components/addPop.vue';
  import { quanlityformConfigVxe } from '/@/components/CustomComponents/src/material/Constant';
  import { FileListModal } from '/@/components/Upload';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import SubTable from './components/SubTable.vue';
  import HistoryModal from '../../../qualityAssurance/newMateria/check/components/HistoryModal.vue';

  defineOptions({ name: 'purchase-newMaterial-check' });
  const { t } = useI18n();

  const [registerRemarkModal, { openModal: openRemarkModal }] = useModal();
  const [registerDetail, { openPopup: openDetail }] = usePopup();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerView, { openPopup: openView }] = usePopup();
  const [registerFile, { openModal: openFileList }] = useModal();
  const [registerHistoryModal, { openModal: openHistoryModal }] = useModal();

  interface StateType {
    activeKey: string;
  }

  const state = reactive<StateType>({
    activeKey: '1',
  });
  const { activeKey } = toRefs(state);

  function createFormOptions() {
    return {
      collapsed: true,
      showCollapseButton: true,
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: [...quanlityformConfigVxe],
      fieldMappingTime: [['pickerVal', ['startTime', 'endTime']]],
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
        transferRange: ['placeholder'],
      },
    };
  }

  const baseGridOptions = {
    border: true,
    showIndexColumn: false,
    api: getNewMaterial,
    toolbarConfig: {
      expandAll: true,
      defaultExpand: true,
    },
    i18nConfig: {
      moduleCode: 'MaterialDevelopApplyColumn',
    },
  } as const;

  const [Todo_Grid, { reload: todoReload, getFetchParams: todoGetFetchParams, getSelectRows: todoGetSelectRows, getSelectRowKeys: todoGetSelectRowKeys }] =
    useVbenVxeGrid({
      formOptions: createFormOptions(),
      gridOptions: {
        ...baseGridOptions,
        id: 'purchase-newMaterial-check-todoGrid',
        columns: todoColumns(),
        beforeFetch: params => {
          params.identification = '1';
          return params;
        },
      },
    });

  const [Check_Grid, { reload: checkReload, getFetchParams: checkGetFetchParams, getSelectRows: checkGetSelectRows, getSelectRowKeys: checkGetSelectRowKeys }] =
    useVbenVxeGrid({
      formOptions: createFormOptions(),
      gridOptions: {
        ...baseGridOptions,
        id: 'purchase-newMaterial-check-checkGrid',
        columns: checkColumns(),
        beforeFetch: params => {
          params.identification = '2';
          return params;
        },
      },
    });

  function getunReviewActions(record): ActionItem[] {
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

  function handleHistory(record) {
    openHistoryModal(true, {
      id: record.id,
    });
  }

  function handleFileView(record: any) {
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
    // return doneReload();
  }

  async function getFetchParams() {
    if (state.activeKey === '1') {
      return (await todoGetFetchParams()) || {};
    }
    if (state.activeKey === '2') {
      return (await checkGetFetchParams()) || {};
    }
    // return (await doneGetFetchParams()) || {};
  }

  async function getSelectRows() {
    if (state.activeKey === '1') {
      return (await Promise.resolve(todoGetSelectRows())) || [];
    }
    if (state.activeKey === '2') {
      return (await Promise.resolve(checkGetSelectRows())) || [];
    }
    // return (await Promise.resolve(doneGetSelectRows())) || [];
  }

  async function getSelectRowKeys() {
    if (state.activeKey === '1') {
      return (await Promise.resolve(todoGetSelectRowKeys())) || [];
    }
    if (state.activeKey === '2') {
      return (await Promise.resolve(checkGetSelectRowKeys())) || [];
    }
    // return (await Promise.resolve(doneGetSelectRowKeys())) || [];
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

  // Recall selected records
  async function handleRecall() {
    const idList = (await getSelectRowKeys()) || [];
    if (idList.length) {
      const r = await recallMaterial(idList);
      if (r.code == 200) {
        message.success(t('sys.api.operationSuccess'));
        await reload();
      }
    }
    message.info(t('common.selectText'));
  }

  // Resubmit sample
  async function handleResample() {
    const idList = (await getSelectRowKeys()) || [];
    if (!idList.length) {
      return message.info(t('common.selectText'));
    }
    const r = await sampleMaterial(idList);
    if (r.code == 200) {
      message.success(t('sys.api.operationSuccess'));
      await reload();
    }
  }

  // Recommend again
  async function handleRecommend() {
    const rows = (await getSelectRows()) || [];
    if (rows.length) {
      return openDetail(true, {
        ids: rows.map(el => el.materialDevelopApplyId),
        qualityDesensitizationId: rows.map(el => el.id),
      });
    }
    message.info(t('common.selectText'));
  }

  // Back to engineering
  async function handleBackEngineering() {
    const idList = (await getSelectRowKeys()) || [];
    if (idList.length) {
      return openRemarkModal(true, {
        api: rejectMaterial,
        title: t('common.backEngineer'),
        content: t('common.backReson'),
        ids: idList,
        required: true,
        beforeFetch: params => {
          return {
            ids: idList,
            returnEngineeringRemarks: params.remarks,
          };
        },
      });
    }
    message.info(t('common.selectText'));
  }

  useRouteParams({ id: {}, tab: {} }, params => {
    const { id, tab } = params;
    if (id && tab) {
      state.activeKey = tab;
      nextTick(() => {
        handleReview(id);
      });
    } else if (id) {
      getNewMaterial({ id }).then(res => {
        if (res.data?.list?.length) {
          openDetail(true, {
            ids: [res.data.list[0].materialDevelopApplyId],
            qualityDesensitizationId: [id],
          });
        }
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
