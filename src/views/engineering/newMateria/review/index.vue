<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs @change="reload" v-model:activeKey="state.activeKey">
          <a-tab-pane key="1" :tab="t('common.todoText')">
            <Grid_Pending>
              <template #toolbar-actions>
                <a-button type="primary" v-auth="'btn_review'" @click="handleReview">{{ t('common.audit') }}</a-button>
                <a-button v-auth="'btn_reject'" type="primary" @click="handleReject" ghost>{{ t('common.rejectText') }}</a-button>
                <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }}</a-button>
              </template>
              <!-- <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'action'">
                  <TableAction :actions="getTableActions(record)" />
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
                <TableAction outside :actions="getTableActions(row)" />
              </template>
            </Grid_Pending>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('common.doneText')">
            <Grid_Processed>
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
                <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }}</a-button>
              </template>
              <!-- <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'action'">
                  <TableAction :actions="getTableActions(record)" />
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
                <TableAction outside :actions="getTableActions(row)" />
              </template>
            </Grid_Processed>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <addPop @register="registerAddPop" @reload="reload"></addPop>
    <ExportModal @register="registerExportModal" />
    <NodeModal @register="registerNodeModal"></NodeModal>
    <RejectModal @register="registerRejectModal" @reload="reload" />
  </div>
</template>

<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { BasicTable, useTable, BasicColumn, FormSchema, ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { getNewMaterial, reviewMaterial, exportNewMaterialExcel, recallMaterial, rejectMaterial } from '/@/api/engineering/newMateriaReview';
  import { getNodelist, getFactory } from '/@/api/engineering/newMateria';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import { ModelConfirmButton } from '/@/components/Button';
  import { onMounted, h, reactive, nextTick } from 'vue';
  import { message } from 'ant-design-vue';
  import { getStatus } from '/@/components/CustomComponents/src/material/Constant';
  import { getSearchFormSchema } from '/@/views/engineering/newMateria/review/config';
  import addPop from '/@/views/engineering/newMateria/devlop/components/addPop.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { NodeModal, RejectModal } from '/@/components/CustomComponents';
  import { useRoute } from 'vue-router';
  import { formatTableDefaultText } from '/@/utils';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';

  defineOptions({ name: 'engineering-newMateria-review' });

  const { t } = useI18n();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerAddPop, { openPopup: openAddPop }] = usePopup();
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();

  const state = reactive({
    activeKey: '1',
  });

  const columns = [
    { type: 'checkbox', field: 'checkbox', width: 50 },
    { title: '需求单号', field: 'applyNumber', width: 160, minWidth: '' },
    { title: '产品内部料号', field: 'insidePartNumber', width: 200 },
    { title: '旧版成品编码', field: 'insideNumberOld', width: 200 },
    { title: '终端项目代码', field: 'terminalProject', width: 200 },
    { title: '工厂', field: 'factoryName', width: 160, minWidth: '' },
    {
      title: '状态',
      field: 'engineeringStatus',
      width: 100,
      cellRender: {
        name: 'Tag',
        options: getStatus('engineeringStatusDesc'),
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
      //   return h('span', { class: 'table-a', onClick: handleNodeModal.bind(null, record) }, '查看详情');
      // },
      slots: { default: 'nodeDetail' },
    },
    { title: '开发采购', field: 'purchaseUserName', width: 230, minWidth: '' },
    { title: '材料描述', field: 'materialDesc', width: 160, minWidth: '' },
    { title: '申请人', field: 'applyUserName', width: 230, minWidth: '' },
    {
      title: '申请时间',
      field: 'applyDateTime',
      cellRender: {
        name: 'Date',
      },
      width: 160,
      minWidth: '',
    },
    // { title: '修改人', field: 'lastModifyUserName', width: 230, visible: false, minWidth: '' },
    // {
    //   width: 160,
    //   title: '修改时间',
    //   field: 'lastModifyTime',
    //   cellRender: {
    //     name: 'Date',
    //   },
    //   minWidth: '',
    //   visible: false,
    // },
    { title: '操作', field: 'action', slots: { default: 'action' }, width: 50, fixed: 'right' },
  ];

  // const tableConfig: any = {
  //   api: getNewMaterial,
  //   columns,
  //   rowKey: 'id',
  //   formConfig: {
  //     labelWidth: 100,
  //     schemas: searchFormSchema,
  //     baseColProps: {
  //       span: 4,
  //     },
  //     autoAdvancedLine: 1,
  //     i18nConfig: {
  //       moduleCode: 'MaterialDevelopApplyColumn',
  //       transferRange: ['placeholder'],
  //     },
  //   },
  //   useSearchForm: true,
  //   tableSetting: {
  //     delStatus: true,
  //   },
  //   beforeFetch: params => {
  //     params.identification = state.activeKey;
  //     return params;
  //   },
  //   rowSelection: { type: 'checkbox' },
  //   actionColumn: {
  //     width: 80,
  //     title: '操作',
  //     dataIndex: 'action',
  //   },
  //   transformCellText: ({ text }) => formatTableDefaultText(text),
  //   i18nConfig: {
  //     moduleCode: 'MaterialDevelopApplyColumn',
  //   },
  // };

  // const [
  //   registerTodo,
  //   { reload: reloadTodo, getFetchParams: getFetchParamsTodo, getSelectRowKeys: getSelectRowKeysTodo, clearSelectedRowKeys: clearSelectedRowKeysTodo },
  // ] = useTable({
  //   ...tableConfig,
  // });
  // const [
  //   registerDone,
  //   { reload: reloadDone, getFetchParams: getFetchParamsDone, getSelectRowKeys: getSelectRowKeysDone, clearSelectedRowKeys: clearSelectedRowKeysDone },
  // ] = useTable({
  //   ...tableConfig,
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
      schema: getSearchFormSchema(),
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'engineering-newMateria-review-Pendinglist',
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
      transformCellText: ({ text }) => formatTableDefaultText(text),
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
      schema: getSearchFormSchema(),
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'engineering-newMateria-review-Processedlist',
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
      transformCellText: ({ text }) => formatTableDefaultText(text),
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

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: handleDetail.bind(null, record.id),
        auth: 'btn_detail',
      },
    ];
  }

  //新增或者修改
  function handleDetail(id) {
    openAddPop(true, {
      type: 'view',
      id: id,
      source: 'engineering',
    });
  }

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodelist,
      id: record.id,
      fetchSetting: {
        listField: 'mianBillFlow.flowNodeInstanceHisList',
      },
    });
  }

  async function handleReview() {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      openAddPop(true, {
        type: 'review',
        ids: idList,
        source: 'engineering',
      });
      // const r = await reviewMaterial({
      //   id: idList[0],
      // });
      // reload();
      // clearSelectedRowKeys();
      // message.success(t('sys.api.operationSuccess'));
    } else {
      message.info(t('common.selectText'));
    }
  }
  //导出
  function handleExport() {
    openExportModal(true, {
      api: exportNewMaterialExcel,
      listQuery: {
        ...getFetchParams(),
        identification: state.activeKey,
      },
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
      },
    });
  }

  async function handleSelectData(method) {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      const r = await method(idList);
      if (r.code == 200) {
        message.success(t('sys.api.operationSuccess'));
        clearSelectedRowKeys();
        reload();
      }
    } else {
      message.info(t('common.selectText'));
    }
  }

  //  驳回
  async function handleReject() {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      openRejectModal(true, {
        api: rejectMaterial,
        ids: idList,
      });
    } else {
      message.info(t('common.selectText'));
    }
  }

  // 撤回
  async function handleRecall() {
    handleSelectData(recallMaterial);
  }

  useRouteParams({ id: {}, tab: {} }, params => {
    const { id, tab } = params;
    if (id && tab) {
      state.activeKey = tab;
      nextTick(() => {
        openAddPop(true, {
          type: 'review',
          ids: [id],
          source: 'engineering',
        });
      });
    } else if (id) {
      openAddPop(true, {
        type: 'review',
        ids: [id],
        source: 'engineering',
      });
    }
  });
</script>

<style scoped lang="less">
  @import url('/src/design/page.less');
</style>
