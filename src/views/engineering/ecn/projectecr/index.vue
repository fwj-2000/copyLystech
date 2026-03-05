<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs @change="reloadTable" v-model:activeKey="activeKey" class="h-full">
          <a-tab-pane key="1" :tab="t('common.todoText')" class="h-full">
            <Grid_Pending>
              <template #toolbar-actions>
                <a-button v-auth="'btn_approve'" @click="handleApprove(-1, 'wait')" type="primary">{{ t('common.audit') }} </a-button>
                <a-button v-auth="'btn_download'" @click="handleExport">{{ t('views.business.quota.export') }}</a-button>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.viewDetails') }} </span>
              </template>
              <template #action="{ rowIndex }">
                <TableAction outside :actions="waitGetActions(rowIndex)" />
              </template>
            </Grid_Pending>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('common.doneText')">
            <Grid_Processed>
              <template #toolbar-actions>
                <!--                <a-button @click="handleApprove(-1)" type="primary">新增 </a-button>-->
                <ModelConfirmButton
                  v-auth="'btn_recall'"
                  v-bind="{
                    modelConfirm: {
                      title: t('common.tipTitle'),
                      content: t('common.withdrawSelectedData'),
                      onOk: handleRecall.bind(null),
                    },
                    type: 'primary',
                  }">
                  <span>{{ t('common.revoke') }}</span>
                </ModelConfirmButton>
                <a-button v-auth="'btn_stop'" @click="handleTerminate" type="primary" ghost>{{ t('common.stopText') }} </a-button>
                <a-button v-auth="'btn_download'" @click="handleExportDone">{{ t('views.business.quota.export') }}</a-button>
                <!--                <ModelConfirmButton-->
                <!--                  v-bind="{-->
                <!--                    modelConfirm: {-->
                <!--                      title: t('common.tipTitle'),-->
                <!--                      content: '确认要删除？',-->
                <!--                      onOk: handleBatchDel.bind(null),-->
                <!--                    },-->
                <!--                  }">-->
                <!--                  <span>批量删除</span>-->
                <!--                </ModelConfirmButton>-->
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.viewDetails') }} </span>
              </template>
              <template #action="{ rowIndex }">
                <TableAction outside :actions="doneGetActions(rowIndex)" />
              </template>
            </Grid_Processed>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <DetailPopup @register="registerDetail" @reload="reloadTable(activeKey)" />
    <NodeModal @register="registerNodeModal"></NodeModal>
    <ExportModal @register="registerExportModal" />
    <StopModal @register="registerStopModal" @reload="reloadTable(activeKey)" />
  </div>
</template>

<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ActionItem, BasicTable, FetchSetting, TableAction, useTable } from '/@/components/Table';
  import { doneGetColumns, getFormConfig, waitGetColumns } from '/@/views/engineering/ecn/projectecr/CONFIG';
  import { deleteEcr, exportEcr, getEcrPageList, getNodeDetail, stopEcr, withdrawEcr } from '/@/api/engineering/ecn';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { reactive, toRefs } from 'vue';
  import DetailPopup from './components/DetailPopup.vue';
  import { usePopup } from '/@/components/Popup';
  import { NodeModal, StopModal } from '/@/components/CustomComponents';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useModal } from '/@/components/Modal';
  import { ModelConfirmButton } from '/@/components/Button';
  import { message } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';

  defineOptions({ name: 'engineering-ecn-projectecr' });

  const { t } = useI18n();
  const state = reactive({
    waitCacheList: [],
    doneCacheList: [],
    activeKey: '1',
  });
  const { activeKey } = toRefs(state);

  const [registerDetail, { openPopup: openDetail }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerStopModal, { openModal: openStopModal }] = useModal();

  function reloadTable(e) {
    console.log(e);
    if (e == 1) {
      waitReload();
    } else {
      doneReload();
    }
  }
  // const [
  //   registerWaiting,
  //   {
  //     getFetchParams: waitGetFetchParams,
  //     reload: waitReload,
  //     getSelectRowKeys: waitGetSelectRowKeys,
  //     getSelectRows: waitGetSelectRows,
  //     setSelectedRowKeys: waitSetSelectedRowKeys, //没用到
  //     clearSelectedRowKeys: waitClearSelectedRowKeys,
  //   },
  // ] = useTable({
  //   api: getEcrPageList,
  //   columns: waitGetColumns(),
  //   bordered: true,
  //   rowKey: 'id',
  //   beforeFetch: params => {
  //     params.dataFilter = 3;
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
  //     title: t('component.table.action'),
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
      id: 'engineering-ecn-projectecr-list',
      columns: waitGetColumns,
      // toolbarConfig: {
      //   superQuery: true,
      // },
      api: getEcrPageList,
      showIndexColumn: true,
      bordered: true,
      i18nConfig: {
        moduleCode: 'ECNColumn',
      },
      beforeFetch: params => {
        params.dataFilter = 3;
        if (params.time && params.time.length > 0) {
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
      id: 'engineering-ecn-projectecr-list',
      columns: doneGetColumns,
      // toolbarConfig: {
      //   superQuery: true,
      // },
      api: getEcrPageList,
      showIndexColumn: true,
      bordered: true,
      i18nConfig: {
        moduleCode: 'ECNColumn',
      },
      beforeFetch: params => {
        params.dataFilter = 4;
        if (params.time && params.time.length > 0) {
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

  // const [
  //   registerDone,
  //   {
  //     getFetchParams: doneGetFetchParams,
  //     reload: doneReload,
  //     getSelectRowKeys: doneGetSelectRowKeys,
  //     getSelectRows: doneGetSelectRows,
  //     clearSelectedRowKeys: doneClearSelectedRowKeys,
  //   },
  // ] = useTable({
  //   api: getEcrPageList,
  //   columns: doneGetColumns(),
  //   bordered: true,
  //   rowKey: 'id',
  //   beforeFetch: params => {
  //     params.dataFilter = 4;
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
  //     title: t('component.table.action'),
  //     dataIndex: 'action',
  //   },
  //   i18nConfig: {
  //     moduleCode: 'ECNColumn',
  //   },
  // });

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

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.id,
      fetchSetting: {
        listField: 'flowNodeInstanceHisList',
      },
    });
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
        cacheList: rows,
        index: index === -1 ? 0 : index,
        mode: 'edit',
      });
      waitClearSelectedRowKeys();
    } else {
      let rows = [];
      // rows = waitGetSelectRows();
      // if (rows.length == 0) {
      //   message.info(t("common.selectText"));
      //   return;
      // }
      rows = getDoneDataSource();
      openDetail(true, {
        cacheList: rows,
        index: index,
        mode: 'view',
      });
    }
  }

  async function handleRecall() {
    const idList = doneGetSelectRowKeys() || [];
    if (idList.length) {
      return withdrawEcr(idList);
    }
    message.info(t('common.selectText'));
  }

  async function handleExport() {
    const exportColumns = cloneDeep(waitGetColumns);
    openExportModal(true, {
      api: exportEcr,
      listQuery: {
        ...(await waitGetFetchParams()),
        dataFilter: 3,
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
    const exportColumns = cloneDeep(doneGetColumns);
    openExportModal(true, {
      api: exportEcr,
      listQuery: {
        ...(await doneGetFetchParams()),
        dataFilter: 4,
      },
      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'ECNColumn',
      },
    });
  }

  function handleBatchDel() {
    const idList = waitGetSelectRowKeys() || [];
    if (idList.length) {
      deleteEcr(idList).then(({ code, msg }) => {
        if (code == 200) {
          message.success(msg);
        } else {
          message.error(msg);
        }
        waitReload();
      });
    } else {
      message.info(t('common.selectText'));
    }
  }

  function handleTerminate() {
    const idList = doneGetSelectRowKeys() || [];
    if (idList.length) {
      return openStopModal(true, {
        api: stopEcr,
        beforeFetch: params => {
          params.ids = idList;
          return params;
        },
      });
    }
    message.info(t('common.selectText'));
  }

  useRouteParams({ billNo: {} }, params => {
    if (!params.billNo) return;
    getEcrPageList({
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
