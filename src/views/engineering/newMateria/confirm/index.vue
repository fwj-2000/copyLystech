<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs @change="reload" v-model:activeKey="state.activeKey">
          <a-tab-pane key="1" :tab="t('common.todoText')">
            <Grid_Pending>
              <template #toolbar-actions>
                <a-button type="primary" @click="handleSubmit">{{ t('common.materialComfirm') }}</a-button>
                <a-button @click="handleExport">{{ t('common.batchExport') }} </a-button>
              </template>
              <!-- <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                  <TableAction :actions="getActions(record)" />
                </template>
              </template> -->
              <template #nodeDetail="{ row }">
                <template v-if="row.status != 0">
                  <span class="table-a" @click="handleNodeModal(row)">
                    {{ t('common.viewDetails') }}
                  </span>
                </template>
              </template>
              <template #action="{ row }">
                <TableAction outside :actions="getActions(row)" />
              </template>
            </Grid_Pending>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('common.doneText')">
            <Grid_Processed>
              <template #toolbar-actions>
                <!-- <ModelConfirmButton
                  v-bind="{
                    modelConfirm: {
                      title: t('common.tipTitle'),
                      content: t('common.withdrawSelectedData'),
                      onOk: handleRecall.bind(null),
                    },
                  }">
                  <span v-auth="'btn_recall'">{{ t('common.revoke') }}</span>
                </ModelConfirmButton> -->
                <a-button @click="handleExport">{{ t('common.batchExport') }} </a-button>
              </template>
              <!-- <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                  <TableAction :actions="getActions(record)" />
                </template>
              </template> -->
              <template #nodeDetail="{ row }">
                <template v-if="row.status != 0">
                  <span class="table-a" @click="handleNodeModal(row)">
                    {{ t('common.viewDetails') }}
                  </span>
                </template>
              </template>
              <template #action="{ row }">
                <TableAction outside :actions="getActions(row)" />
              </template>
            </Grid_Processed>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <NodeModal @register="registerNodeModal"></NodeModal>
    <ExportModal @register="registerExportModal" />
    <DetailPopup @register="registerDetail" @reload="reload"></DetailPopup>
  </div>
</template>

<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ActionItem, TableAction } from '/@/components/Table';
  import { reactive, nextTick } from 'vue';
  import { getUnReviewFormConfig } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep } from 'lodash-es';
  import { getNewMaterial, exportNewMaterialExcel } from '/@/api/engineering/newMateriaConfirm';
  import { getNodelist } from '/@/api/engineering/newMateria';
  import { getStatus } from '/@/components/CustomComponents/src/material/Constant';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import DetailPopup from './components/DetailPopup.vue';
  import { NodeModal } from '/@/components/CustomComponents';
  import { useMessage } from '/@/hooks/web/useMessage';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';
  import { ColumnWithI18n } from '/@/effects/plugins/vxe-table/types';

  defineOptions({ name: 'engineering-newMateria-confirm' });
  const { t } = useI18n();
  const { createMessage } = useMessage();

  const [registerDetail, { openPopup: openDetail }] = usePopup();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();

  interface StateType {
    activeKey: string;
  }

  const state = reactive<StateType>({
    activeKey: '1',
  });
  const columns = [
    { type: 'checkbox', field: 'checkbox', width: 50, minWidth: '' },
    { title: '需求单号', field: 'applyNumber', width: 160, minWidth: '' },
    { title: '产品内部料号', field: 'insidePartNumber', width: 200, minWidth: '' },
    { title: '旧版成品编码', field: 'insideNumberOld', width: 200 },
    { title: '终端项目代码', field: 'terminalProject', width: 200 },
    { title: '工厂', field: 'factoryName', width: 160, minWidth: '' },
    {
      title: '状态',
      field: 'status',
      width: 100,
      cellRender: {
        name: 'Tag',
        options: getStatus('statusDesc'),
      },
      minWidth: '',
    },
    { title: '当前处理人', field: 'currentProcessor', width: 230, minWidth: '' },
    { title: '当前节点', field: 'currentNodeName', width: 160, minWidth: '' },
    {
      title: '节点记录',
      field: 'nodeDetail',
      width: 100,
      minWidth: '',
      // customRender: ({ record }) => {
      //   if (record.status == 0) return '/';
      //   return h('span', { class: 'table-a', onClick: handleNodeModal.bind(null, record) }, t('common.viewDetails'));
      // },
      slots: { default: 'nodeDetail' },
    },
    { title: '开发采购', field: 'purchaseUserName', width: 230, minWidth: '' },
    // { title: '开发类型', field: 'developmentType', width: 160, minWidth: '' },
    // { title: '材料归属', field: 'materialAreaName', width: 160, minWidth: '' },
    { title: '材料描述', field: 'materialDesc', width: 160, minWidth: '' },
    { title: '申请人', field: 'applyUserName', width: 230, minWidth: '' },
    {
      title: '申请时间',
      field: 'applyDateTime',
      width: 160,
      minWidth: '',
      cellRender: {
        name: 'Date',
      },
    },
    { title: '操作', field: 'action', slots: { default: 'action' }, width: 50, fixed: 'right', minWidth: '' },
  ];

  // const tableConfig: any = {
  //   api: getNewMaterial,
  //   bordered: true,
  //   beforeFetch: params => {
  //     params.identification = state.activeKey;
  //     return params;
  //   },
  //   rowKey: 'id',
  //   rowSelection: { type: 'checkbox' },
  //   useSearchForm: true,
  //   tableSetting: { delStatus: true },
  //   actionColumn: {
  //     width: 80,
  //     title: '操作',
  //     dataIndex: 'action',
  //   },
  //   i18nConfig: {
  //     moduleCode: 'MaterialDevelopApplyColumn',
  //   },
  // };
  // const [
  //   registerTodo,
  //   { reload: reloadTodo, getFetchParams: getFetchParamsTodo, getSelectRowKeys: getSelectRowKeysTodo, clearSelectedRowKeys: clearSelectedRowKeysTodo },
  // ] = useTable({
  //   ...tableConfig,
  //   columns,
  //   formConfig: getUnReviewFormConfig(),
  // });
  // const [
  //   registerDone,
  //   { reload: reloadDone, getFetchParams: getFetchParamsDone, getSelectRowKeys: getSelectRowKeysDone, clearSelectedRowKeys: clearSelectedRowKeysDone },
  // ] = useTable({
  //   ...tableConfig,
  //   columns: columnDone,
  //   formConfig: getUnReviewFormConfig(),
  // });

  const [Grid_Pending, gridApi_Pending] = useVbenVxeGrid({
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
      schema: getUnReviewFormConfig(),
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'engineering-newMateria-confirm-Pendinglist',
      columns: columns,
      // toolbarConfig: {
      //   superQuery: true,
      // },
      api: getNewMaterial,
      showIndexColumn: true,
      bordered: true,
      useSearchForm: true,
      beforeFetch: params => {
        params.identification = state.activeKey;
        return params;
      },
      tableSetting: {
        delStatus: true,
      },
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
      },
    },
  });

  const {
    reload: reloadTodo,
    getFetchParams: getFetchParamsTodo,
    getSelectRowKeys: getSelectRowKeysTodo,
    clearSelectedRowKeys: clearSelectedRowKeysTodo,
  } = gridApi_Pending;

  const [Grid_Processed, gridApi_Processed] = useVbenVxeGrid({
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
      schema: getUnReviewFormConfig(),
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'engineering-newMateria-confirm-Processedlist',
      columns: columns,
      // toolbarConfig: {
      //   superQuery: true,
      // },
      api: getNewMaterial,
      showIndexColumn: true,
      bordered: true,
      useSearchForm: true,
      beforeFetch: params => {
        params.identification = state.activeKey;
        return params;
      },
      tableSetting: {
        delStatus: true,
      },
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
      },
    },
  });

  const {
    reload: reloadDone,
    getFetchParams: getFetchParamsDone,
    getSelectRowKeys: getSelectRowKeysDone,
    clearSelectedRowKeys: clearSelectedRowKeysDone,
  } = gridApi_Processed;

  function reload() {
    clearSelectedRowKeys();
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
  function getSelectRowKeys() {
    if (state.activeKey == '1') {
      return getSelectRowKeysTodo();
    }
    return getSelectRowKeysDone();
  }
  function clearSelectedRowKeys() {
    if (state.activeKey == '1') {
      return clearSelectedRowKeysTodo();
    }
    return clearSelectedRowKeysDone();
  }

  function getActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: handleDetail.bind(null, record.id),
        auth: 'btn_detail',
      },
    ];
  }
  function handleDetail(id) {
    return openDetail(true, {
      ids: [id],
      type: 'view',
    });
  }

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodelist,
      id: record.materialDevelopApplyId,
      fetchSetting: {
        listField: 'mianBillFlow.flowNodeInstanceHisList',
      },
    });
  }
  function handleExport() {
    const exportColumns = cloneDeep(columns);
    openExportModal(true, {
      api: exportNewMaterialExcel,
      listQuery: {
        ...getFetchParams(),
        identification: state.activeKey,
      },
      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
      },
    });
  }

  function handleSubmit() {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      return openDetail(true, {
        index: 0,
        ids: idList,
      });
    }
    createMessage.info(t('common.selectText'));
  }

  useRouteParams({ id: {}, tab: {} }, params => {
    const { id, tab } = params;
    if (id && tab) {
      state.activeKey = tab;
      nextTick(() => {
        handleDetail(id);
      });
    } else if (id) {
      handleDetail(id);
    }
  });
</script>

<style scoped lang="less">
  @import url('/src/design/page.less');
</style>
