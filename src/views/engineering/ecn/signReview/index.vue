<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs @change="reloadTable" v-model:activeKey="activeKey">
          <a-tab-pane key="1" :tab="t('common.todoText')">
            <Grid_Pending>
              <template #toolbar-actions>
                <a-button v-auth="'btn_edit'" @click="handleApprove(-1, 'wait')" type="primary">{{ t('dict.ECN.FlowNode.coSignature') }} </a-button>
                <a-button v-auth="'btn_transfer'" @click="handleTransfer">{{ t('dict.Flow.NodeAction.4') }} </a-button>
                <a-button v-auth="'btn_download'" @click="handleExport">{{ t('views.business.quota.export') }}</a-button>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.viewDetails') }} </span>
              </template>
              <template #action="{ rowIndex }">
                <TableAction outside :actions="waitGetActions(rowIndex)" />
              </template>
              <!-- <template #bodyCell="{ column, index, record }">
                <template v-if="column.key === 'nodeDetail'">
                  <span class="table-a" @click="handleNodeModal(record)"> {{ t('common.viewDetails') }} </span>
                </template>
                <template v-else-if="column.key === 'action'">
                  <TableAction :actions="waitGetActions(index)" />
                </template>
              </template> -->
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
                    ghost: true,
                    type: 'primary',
                  }">
                  <span>{{ t('common.revoke') }}</span>
                </ModelConfirmButton>
                <a-button v-auth="'btn_download'" @click="handleExportDone">{{ t('views.business.quota.export') }}</a-button>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.viewDetails') }} </span>
              </template>
              <template #action="{ rowIndex }">
                <TableAction outside :actions="doneGetActions(rowIndex)" />
              </template>
              <!-- <template #bodyCell="{ column, index, record }">
                <template v-if="column.key === 'nodeDetail'">
                  <span class="table-a" @click="handleNodeModal(record)"> {{ t('common.viewDetails') }} </span>
                </template>
                <template v-else-if="column.key === 'action'">
                  <TableAction :actions="doneGetActions(index)" />
                </template>
              </template> -->
            </Grid_Processed>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <NodeModal @register="registerNodeModal" @reload="reloadTable(activeKey)"></NodeModal>
    <DetailPopup @register="registerDetail" @reload="reloadTable(activeKey)" />
    <ExportModal @register="registerExportModal" />
    <TransferModal
      @register="registerTransferModal"
      @reload="
        () => {
          waitClearSelectedRowKeys(), waitReload();
        }
      " />
  </div>
</template>

<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ActionItem, BasicTable, TableAction, useTable } from '/@/components/Table';
  import { ModelConfirmButton } from '/@/components/Button';
  import { exportEcn, exportEcr, getEcnPageList, getEcrPageList, getNodeDetail, withdrawEcn, turnEcn, turnEcnV2 } from '/@/api/engineering/ecn';
  import { getFormConfig, waitGetColumns } from './CONFIG';
  import { message } from 'ant-design-vue';
  import { usePopup } from '/@/components/Popup';
  import { useModal } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { reactive, toRefs, unref } from 'vue';
  import { NodeModal, TransferModal } from '/@/components/CustomComponents';
  import DetailPopup from './components/DetailPopup.vue';
  import { cloneDeep } from 'lodash-es';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';
  import { useMessage } from '/@/hooks/web/useMessage';
  defineOptions({ name: 'engineering-ecn-signReview' });

  const { createMessage } = useMessage();

  const [registerDetail, { openPopup: openDetail }] = usePopup();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerTransferModal, { openModal: openTransferModal }] = useModal();

  const { t } = useI18n();
  const state = reactive({
    waitCacheList: [],
    doneCacheList: [],
    activeKey: '1',
  });

  const { activeKey } = toRefs(state);

  // const [
  //   registerWaiting,
  //   {
  //     getFetchParams: waitGetFetchParams,
  //     reload: waitReload,
  //     getSelectRowKeys: waitGetSelectRowKeys,
  //     getSelectRows: waitGetSelectRows,
  //     setSelectedRowKeys: waitSetSelectedRowKeys,
  //     clearSelectedRowKeys: waitClearSelectedRowKeys,
  //   },
  // ] = useTable({
  //   api: getEcnPageList,
  //   columns: waitGetColumns(),
  //   bordered: true,
  //   rowKey: 'id',
  //   beforeFetch: params => {
  //     params.dataFilter = 3;
  //     params.pageTag = 3;
  //     if (params.time && params.time.length > 0) {
  //       // params.startTime = dateUtil(params.time[0]).format('YYYY-MM-DD 00:00:00');
  //       // params.endTime = dateUtil(params.time[1]).format('YYYY-MM-DD 23:59:59');
  //       params.startTime = params.time[0];
  //       params.endTime = params.time[1];
  //       delete params.time;
  //     }
  //   },
  //   afterFetch: data => {
  //     state.waitCacheList = data;
  //   },
  //   tableSetting: {
  //     delStatus: true,
  //   },
  //   rowSelection: { type: 'checkbox' },
  //   useSearchForm: true,
  //   formConfig: getFormConfig(),
  //   actionColumn: {
  //     width: 80,
  //     title: t('common.action'),
  //     dataIndex: 'action',
  //   },
  //   i18nConfig: {
  //     moduleCode: 'ECNColumn',
  //   },
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
      schema: getFormConfig(),
      i18nConfig: {
        moduleCode: 'ECNColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'engineering-ecn-signReview-list',
      columns: waitGetColumns,
      // toolbarConfig: {
      //   superQuery: true,
      // },
      api: getEcnPageList,
      useSearchForm: true,
      showIndexColumn: true,
      bordered: true,
      i18nConfig: {
        moduleCode: 'ECNColumn',
      },
      beforeFetch: params => {
        params.dataFilter = 3;
        params.pageTag = 3;
        if (params.time && params.time.length > 0) {
          // params.startTime = dateUtil(params.time[0]).format('YYYY-MM-DD 00:00:00');
          // params.endTime = dateUtil(params.time[1]).format('YYYY-MM-DD 23:59:59');
          params.startTime = params.time[0];
          params.endTime = params.time[1];
          delete params.time;
        }
        return params;
      },
      // afterFetch: data => {
      //   state.waitCacheList = data;
      // },
      tableSetting: {
        delStatus: true,
      },
    },
  });

  const {
    reload: waitReload, // 表格重载方法
    getFetchParams: waitGetFetchParams, // 获取查询参数
    getSelectRowKeys: waitGetSelectRowKeys, // 获取选中行的 key
    getSelectRows: waitGetSelectRows, // 获取选中的行数据
    clearSelectedRowKeys: waitClearSelectedRowKeys, // 清空选中行
    getDataSource: getWaitDataSource,
  } = gridApi_Pending;

  // const [
  //   registerDone,
  //   {
  //     getFetchParams: doneGetFetchParams,
  //     reload: doneReload,
  //     getSelectRowKeys: doneGetSelectRowKeys,
  //     getSelectRows: doneGetSelectRows,
  //     getSelectedRowKeys: doneGetSelectedRowKeys,
  //     clearSelectedRowKeys: doneClearSelectedRowKeys,
  //   },
  // ] = useTable({
  //   api: getEcnPageList,
  //   columns: waitGetColumns(),
  //   bordered: true,
  //   rowKey: 'id',
  //   beforeFetch: params => {
  //     params.dataFilter = 4;
  //     params.pageTag = 3;
  //     if (params.time && params.time.length > 0) {
  //       // params.startTime = dateUtil(params.time[0]).format('YYYY-MM-DD 00:00:00');
  //       // params.endTime = dateUtil(params.time[1]).format('YYYY-MM-DD 23:59:59');
  //       params.startTime = params.time[0];
  //       params.endTime = params.time[1];
  //       delete params.time;
  //     }
  //   },
  //   afterFetch: data => {
  //     state.doneCacheList = data;
  //   },
  //   tableSetting: {
  //     delStatus: true,
  //   },
  //   rowSelection: { type: 'checkbox' },
  //   useSearchForm: true,
  //   formConfig: getFormConfig(),
  //   actionColumn: {
  //     width: 80,
  //     title: t('common.action'),
  //     dataIndex: 'action',
  //   },
  //   i18nConfig: {
  //     moduleCode: 'ECNColumn',
  //   },
  // });

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
      schema: getFormConfig(),
      i18nConfig: {
        moduleCode: 'ECNColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'engineering-ecn-signReview-list',
      api: getEcnPageList,
      columns: waitGetColumns,
      useSearchForm: true,
      // toolbarConfig: {
      //   superQuery: true,
      // },
      beforeFetch: params => {
        params.dataFilter = 4;
        params.pageTag = 3;
        if (params.time && params.time.length > 0) {
          // params.startTime = dateUtil(params.time[0]).format('YYYY-MM-DD 00:00:00');
          // params.endTime = dateUtil(params.time[1]).format('YYYY-MM-DD 23:59:59');
          params.startTime = params.time[0];
          params.endTime = params.time[1];
          delete params.time;
        }
        return params;
      },
      // afterFetch: data => {
      //   state.doneCacheList = data;
      // },
      tableSetting: {
        delStatus: true,
      },
    },
  });

  const {
    reload: doneReload, // 表格重载方法
    getFetchParams: doneGetFetchParams, // 获取查询参数
    getSelectRowKeys: doneGetSelectRowKeys, // 获取选中行的 key
    getSelectRows: doneGetSelectRows, // 获取选中的行数据
    clearSelectedRowKeys: doneClearSelectedRowKeys, // 清空选中行
    getDataSource: getDoneDataSource,
  } = gridApi_Processed;

  function reloadTable(e) {
    console.log(e);
    if (e == 1) {
      waitReload();
    } else {
      doneReload();
    }
  }

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.id,
      fetchSetting: {
        listField: 'flowNodeInstanceHisList',
      },
    });
  }

  function waitGetActions(index: number): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleApprove.bind(null, index, 'wait'),
        // auth: 'btn_detail',
      },
    ];
  }

  function doneGetActions(index: number): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleApprove.bind(null, index, 'done'),
        // auth: 'btn_detail',
      },
    ];
  }

  function handleApprove(index: number, type: 'wait' | 'done') {
    if (type === 'wait') {
      let rows = [];
      if (index === -1) {
        rows = waitGetSelectRows();
      } else {
        rows = getWaitDataSource();
      }
      if (rows.length == 0) {
        message.info(t('common.selectText'));
        return;
      }
      openDetail(true, {
        dataFilter: 3,
        cacheList: rows,
        index: index === -1 ? 0 : index,
        mode: 'edit',
      });
      waitClearSelectedRowKeys();
    } else {
      let rows = [];
      rows = getDoneDataSource();
      openDetail(true, {
        dataFilter: 4,
        cacheList: rows,
        index: index,
        mode: 'view',
      });
    }
  }

  function handleTransfer(id = '') {
    const idList = waitGetSelectRows();
    if (!idList.length) return createMessage.warning('请选择转办内容');
    openTransferModal(true, {
      id: idList || [],
      submitCallback: handleTransferCB,
    });
  }

  const handleTransferCB = async data => {
    console.log(data);
    const { id } = unref(data);
    const r = await turnEcnV2({
      ids: id.map(item => item.id),
      transferRemarks: data.remark,
      transferUserId: data.transferUser,
    });
    return r;
  };

  async function handleRecall() {
    const idList = doneGetSelectRowKeys() || [];
    if (idList.length) {
      return withdrawEcn(idList)
        .then(({ code, msg }) => {
          if (code == 200) {
            message.success(msg);
          } else {
            message.error(msg);
          }
        })
        .finally(() => {
          reloadTable();
        });
    }
    message.info(t('common.selectText'));
  }

  async function handleExport() {
    const exportColumns = cloneDeep(waitGetColumns);
    openExportModal(true, {
      api: exportEcn,
      listQuery: {
        ...(await waitGetFetchParams()),
        dataFilter: 3,
        pageTag: 3,
      },
      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'ECNColumn',
      },
    });
  }

  async function handleExportDone() {
    const exportColumns = cloneDeep(waitGetColumns);
    openExportModal(true, {
      api: exportEcn,
      listQuery: {
        ...(await doneGetFetchParams()),
        dataFilter: 4,
        pageTag: 3,
      },
      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'ECNColumn',
      },
    });
  }

  useRouteParams({ billNo: {} }, params => {
    if (!params.billNo) return;
    getEcnPageList({
      applyCode: params.billNo,
    }).then(res => {
      if (res.data?.list && res.data.list.length > 0) {
        openDetail(true, {
          cacheList: res.data.list,
          index: 0,
          mode: 'edit',
        });
      }
    });
  });
</script>
<style scoped lang="less">
  @import url('/src/design/page.less');
</style>
