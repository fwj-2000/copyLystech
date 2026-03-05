<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs @change="reload" v-model:activeKey="activeKey">
          <a-tab-pane key="1" :tab="t('common.todoText')">
            <Todo_Grid>
              <template #toolbar-actions>
                <a-button type="primary" v-auth="'btn_importMetarial'" @click="handleImport">{{ t('common.importText') }}</a-button>
                <ModelConfirmButton
                  type="primary"
                  ghost
                  v-bind="{
                    modelConfirm: {
                      title: t('common.tipTitle'),
                      content: t('common.notImportTip'),
                      onOk: handleNotImport.bind(null),
                    },
                  }">
                  <span v-auth="'btn_notImportMetarial'">{{ t('common.notImport') }}</span>
                </ModelConfirmButton>
                <a-button v-auth="'btn_download'" @click="handleUnReviewExport">{{ t('common.batchExport') }} </a-button>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.viewDetails') }} </span>
              </template>
              <template #action="{ row }">
                <TableAction outside :actions="getunReviewActions(row)" />
              </template>
            </Todo_Grid>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('common.doneText')">
            <Done_Grid>
              <template #toolbar-actions>
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
                <a-button v-auth="'btn_download'" @click="handleUnReviewExport">{{ t('common.batchExport') }} </a-button>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.viewDetails') }} </span>
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
    <ExportModal @register="registerExportModal" />
    <DetailPopup @register="registerDetail" @reload="reload" />
    <RemarkModal @register="registerRemarkModal" @reload="reload"></RemarkModal>
  </div>
</template>

<script lang="ts" setup>
  import { ActionItem, TableAction } from '/@/components/Table';
  import { nextTick, onMounted, reactive, toRefs } from 'vue';
  import { columns, vxeColumns } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getNewMaterial, exportNewMaterialExcel, recallMaterial, notImportMaterial, getNodelist } from '/@/api/purchase/importMateria';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import DetailPopup from './components/DetailPopup.vue';
  import { NodeModal, RemarkModal } from '/@/components/CustomComponents';
  import { message } from 'ant-design-vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { ModelConfirmButton } from '/@/components/Button';
  import { useRoute } from 'vue-router';
  import { quanlityformConfigVxe, getQuanlityformConfigVxeDefaultUser } from '/@/components/CustomComponents/src/material/Constant';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';

  defineOptions({ name: 'purchase-newMaterial-import' });
  const { t } = useI18n();

  const [registerRemarkModal, { openModal: openRemarkModal }] = useModal();
  const [registerDetail, { openPopup: openDetail }] = usePopup();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();

  interface StateType {
    activeKey: string;
  }

  const state = reactive<StateType>({
    activeKey: '1',
  });
  const { activeKey } = toRefs(state);

  const formOptions = {
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
    i18nConfig: {
      moduleCode: 'MaterialDevelopApplyColumn',
      transferRange: ['placeholder'],
    },
    fieldMappingTime: [['pickerVal', ['startTime', 'endTime'], 'x']],
  };

  const baseGridOptions = {
    api: getNewMaterial,
    showIndexColumn: false,
    i18nConfig: {
      moduleCode: 'MaterialDevelopApplyColumn',
    },
  };

  const doneColumns = (() => {
    const baseCols = vxeColumns(handleNodeModal);
    const targetIndex = baseCols.findIndex(col => col.field === 'insidePartNumber');
    if (targetIndex !== -1) {
      baseCols.splice(targetIndex + 1, 0, {
        title: '材料内部料号',
        field: 'materialCode',
        width: 180,
      });
    }
    return baseCols;
  })();

  const [Todo_Grid, { reload: reloadTodo, getFetchParams: getFetchParamsTodo, getSelectRows: getSelectRowsTodo, getSelectRowKeys: getSelectRowKeysTodo }] =
    useVbenVxeGrid({
      formOptions: {
        ...formOptions,
        schema: getQuanlityformConfigVxeDefaultUser(),
      },
      gridOptions: {
        ...baseGridOptions,
        id: 'purchase-newMaterial-import-todo',
        columns: vxeColumns(handleNodeModal),
        beforeFetch: params => {
          params.identification = '1';
          return params;
        },
      },
    });

  const [Done_Grid, { reload: reloadDone, getFetchParams: getFetchParamsDone, getSelectRows: getSelectRowsDone, getSelectRowKeys: getSelectRowKeysDone }] =
    useVbenVxeGrid({
      formOptions,
      gridOptions: {
        ...baseGridOptions,
        id: 'purchase-newMaterial-import-done',
        columns: doneColumns,
        beforeFetch: params => {
          params.identification = '2';
          return params;
        },
      },
    });

  function reload() {
    if (state.activeKey == '1') {
      return reloadTodo();
    }
    return reloadDone();
  }
  function getFetchParams() {
    if (state.activeKey == '1') {
      return getFetchParamsTodo();
    }
    return getFetchParamsDone();
  }
  function getSelectRows() {
    if (state.activeKey == '1') {
      return getSelectRowsTodo();
    }
    return getSelectRowsDone();
  }
  function getSelectRowKeys() {
    if (state.activeKey == '1') {
      return getSelectRowKeysTodo();
    }
    return getSelectRowKeysDone();
  }

  function getunReviewActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: handleReview.bind(null, record.id),
        auth: 'btn_detail',
      },
    ];
  }
  function handleReview(id) {
    openDetail(true, {
      type: 'detailed',
      id: id,
    });
  }

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodelist,
      id: record.id,
    });
  }

  async function handleUnReviewExport() {
    openExportModal(true, {
      api: exportNewMaterialExcel,
      listQuery: {
        ...(await getFetchParams()),
        identification: state.activeKey,
      },
      exportOptions: columns(handleNodeModal),
      nameProps: 'title',
      idProps: 'dataIndex',
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
      },
    });
  }

  // 撤回
  async function handleRecall() {
    const idList = (await Promise.resolve(getSelectRowKeys())) || [];
    if (idList.length) {
      await recallMaterial(idList);
      reload();
      return;
    }
    message.info(t('common.selectText'));
  }

  // 导入
  async function handleImport() {
    const idList = (await Promise.resolve(getSelectRowKeys())) || [];
    if (idList.length) {
      return openDetail(true, {
        ids: idList,
        type: 'edit',
      });
    }
    message.info(t('common.selectText'));
  }

  //  不导入
  async function handleNotImport() {
    const idList = (await Promise.resolve(getSelectRowKeys())) || [];
    if (idList.length) {
      await notImportMaterial(idList);
      return reload();
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
