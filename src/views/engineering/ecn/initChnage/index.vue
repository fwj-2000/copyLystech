<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs @change="reloadTable" v-model:activeKey="activeKey" class="h-full">
          <a-tab-pane key="1" :tab="t('common.todoText')" class="h-full">
            <Grid_Pending>
              <template #toolbar-actions>
                <a-button v-auth="'btn_edit'" type="primary" @click="handleApprove(-1, 'wait')">{{ t('dict.ECNColumn.initiateChange') }}</a-button>
                <a-button v-auth="'btn_stop'" @click="handleTerminate" type="primary" ghost>{{ t('common.cancelECN') }} </a-button>
                <a-button v-auth="'btn_transfer'" @click="handleTransfer">{{ t('dict.Flow.NodeAction.4') }} </a-button>
                <a-button v-auth="'btn_download'" @click="handleExport">{{ t('views.business.quota.export') }}</a-button>
                <ModelConfirmButton
                  v-auth="'btn_batchRemove'"
                  v-bind="{
                    modelConfirm: {
                      title: t('common.tipTitle'),
                      content: t('common.beforeDelTip'),
                      onOk: handleBatchDel.bind(null),
                    },
                  }">
                  <span>{{ t('common.batchDelText') }}</span>
                </ModelConfirmButton>
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
                <ModelConfirmButton
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
                <a-button @click="handleExportDone">{{ t('views.business.quota.export') }} </a-button>
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
    <StopModal @register="registerStopModal" @reload="reloadTable(activeKey)" />
    <TransferModal
      @register="registerTransferModal"
      @reload="
        () => {
          waitClearSelectedRowKeys(), waitReload();
        }
      " />
    <ExportModal @register="registerExportModal" />
    <NodeModal @register="registerNodeModal"></NodeModal>
  </div>
</template>

<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ModelConfirmButton } from '/@/components/Button';
  import { ActionItem, BasicTable, TableAction, useTable } from '/@/components/Table';
  import { deleteEcn, deleteEcr, exportEcn, exportEcr, getEcnPageList, getNodeDetail, stopEcn, turnEcn, withdrawEcn } from '/@/api/engineering/ecn';
  import { doneGetColumns, getFormConfig, waitGetColumns, waitGetFormConfig } from '/@/views/engineering/ecn/initChnage/CONFIG';
  import { onMounted, reactive, toRefs, unref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { message } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import DetailPopup from './DetailPopup.vue';
  import { usePopup } from '/@/components/Popup';
  import { useBaseStore } from '/@/store/modules/base';
  import { formatTableDefaultText } from '/@/utils';
  import { useModal } from '/@/components/Modal';
  import { NodeModal, StopModal, TransferModal } from '/@/components/CustomComponents';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useRoute } from 'vue-router';
  import { usePermission } from '/@/hooks/web/usePermission';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { generatePdfByIds } from '/@/views/engineering/pcc/pccApply/components/print';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';

  defineOptions({ name: 'engineering-ecn-initChnage' });

  const route = useRoute();
  const { hasBtnP } = usePermission();

  const { createMessage } = useMessage();
  const baseStore = useBaseStore();
  const { t } = useI18n();

  const state = reactive({
    activeKey: '1',
    waitCacheList: [],
    doneCacheList: [],
  });
  const { activeKey } = toRefs(state);

  const [registerDetail, { openPopup: openDetail }] = usePopup();
  const [registerStopModal, { openModal: openStopModal }] = useModal();
  const [registerTransferModal, { openModal: openTransferModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();

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
  //     params.dataFilter = 1;
  //     if (params.time && params.time.length > 0) {
  //       // params.startTime = dateUtil(params.time[0]).format('YYYY-MM-DD 00:00:00');
  //       // params.endTime = dateUtil(params.time[1]).format('YYYY-MM-DD 23:59:59');
  //       params.startTime = params.time[0];
  //       params.endTime = params.time[1];
  //       delete params.time;
  //     }
  //     if (state.id) {
  //       params.id = state.id;
  //     }
  //   },
  // afterFetch: data => {
  //   data.forEach(item => {});
  //   state.waitCacheList = data;
  //   if (state.id) {
  //     const index = data.findIndex(item => item.id === route.query.id);
  //     openDetail(true, {
  //       cacheList: data,
  //       index: index,
  //       mode: 'edit',
  //     });
  //   }
  // },
  //   tableSetting: {
  //     delStatus: true,
  //   },
  //   rowSelection: { type: 'checkbox' },
  //   useSearchForm: true,
  //   formConfig: waitGetFormConfig(),
  //   transformCellText: ({ text }) => {
  //     return formatTableDefaultText(text);
  //   },
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
      schema: waitGetFormConfig(),
      i18nConfig: {
        moduleCode: 'ECNColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'engineering-ecn-initChnage-list',
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
        params.dataFilter = 1;
        if (params.time && params.time.length > 0) {
          params.startTime = params.time[0];
          params.endTime = params.time[1];
          delete params.time;
        }
        return params;
      },
      transformCellText: ({ text }) => {
        return formatTableDefaultText(text);
      },
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
      id: 'engineering-ecn-initChnage-list',
      columns: doneGetColumns,
      // toolbarConfig: {
      //   superQuery: true,
      // },
      api: getEcnPageList,
      beforeFetch: params => {
        params.dataFilter = 2;
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
      useSearchForm: true,
      transformCellText: ({ text }) => {
        return formatTableDefaultText(text);
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
  //     getSelectedRowKeys: doneGetSelectedRowKeys,
  //     clearSelectedRowKeys: doneClearSelectedRowKeys,
  //   },
  // ] = useTable({
  //   api: getEcnPageList,
  //   columns: doneGetColumns(),
  //   bordered: true,
  //   rowKey: 'id',
  //   beforeFetch: params => {
  //     params.dataFilter = 2;
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
  //   transformCellText: ({ text }) => {
  //     return formatTableDefaultText(text);
  //   },
  //   actionColumn: {
  //     width: 80,
  //     title: '操作',
  //     dataIndex: 'action',
  //   },
  //   i18nConfig: {
  //     moduleCode: 'ECNColumn',
  //   },
  // });

  function handleApprove(index: number, type: 'wait' | 'done') {
    if (type === 'wait') {
      let rows = [];
      if (index === -1) {
        rows = waitGetSelectRows();
        if (rows.length == 0) {
          return message.info('请选择数据');
        }
        const isSame = rows.every(item => item.ecrCode === rows[0].ecrCode);
        if (!isSame) {
          waitClearSelectedRowKeys();
          return message.info('请选择相同的ECR单号');
        }
      } else {
        rows = getWaitDataSource();
      }
      openDetail(true, {
        cacheList: rows.map(item => ({ ...item, disabled: { documentType: true } })),
        index: index === -1 ? 0 : index,
        mode: 'edit',
      });
      waitClearSelectedRowKeys();
    } else {
      let rows = [];
      rows = getDoneDataSource();
      openDetail(true, {
        cacheList: rows,
        index: index,
        mode: 'view',
      });
    }
  }

  async function handleExport() {
    const exportColumns = cloneDeep(waitGetColumns);
    openExportModal(true, {
      api: exportEcn,
      listQuery: {
        ...(await waitGetFetchParams()),
        dataFilter: 1,
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
      api: exportEcn,
      listQuery: {
        ...(await doneGetFetchParams()),
        dataFilter: 2,
      },
      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'ECNColumn',
      },
    });
  }
  // function batchImportFile() {
  //   openImportPopup(true, {
  //     importPreviewApi: importLaborrate,
  //     importSaveApi: saveBaseDataLaborrate,
  //     templateApi: downloadBaseDataLaborrateImportTemplate,
  //     previewColumn: importList,
  //     apiParams: {
  //       importSave: {
  //         isoperation: hasBtnP('btn_review') ? 1 : 0,
  //       },
  //     },
  //   });
  // }
  //
  // function batchImportOrExport({ key }) {
  //   const openMethod = key === 'import' ? batchImportFile : handleExport;
  //   openMethod();
  // }

  async function handleRecall() {
    const idList = doneGetSelectRowKeys() || [];
    if (idList.length) {
      return withdrawEcn(idList).then(({ code, msg }) => {
        if (code == 200) {
          message.success(msg);
        } else {
          message.error(msg);
        }
        doneReload();
      });
    }
    message.info(t('common.selectText'));
  }

  // function handleBatchDel() {
  //   const idList = waitGetSelectRowKeys() || [];
  //   if (idList.length) {
  //     deleteEcn(idList).then(({ code, msg }) => {
  //       if (code == 200) {
  //         message.success(msg);
  //       } else {
  //         message.error(msg);
  //       }
  //       waitReload();
  //     });
  //   } else {
  //     message.info(t('common.selectText'));
  //   }
  // }
  function handleBatchDel() {
    const idList = waitGetSelectRowKeys() || [];
    if (idList.length) {
      const selectedRows = waitGetSelectRows() || [];
      const hasInvalidRow = selectedRows.some(row => !row.applyCode);

      if (hasInvalidRow) {
        createMessage.warning('选中的数据中包含没有ECN单号的记录，无法删除');
        return;
      }
      deleteEcn(idList).then(({ code, msg }) => {
        if (code == 200) {
          createMessage.success(msg);
        } else {
          createMessage.error(msg);
        }
        waitReload();
      });
    } else {
      message.info(t('common.selectText'));
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
    const r = await turnEcn({
      list: id.map(item => ({
        originId: item.id,
        origin: item.origin,
      })),
      remark: data.remark,
      userId: data.transferUser,
    });
    return r;
  };

  function handleTerminate() {
    const idList = waitGetSelectRowKeys() || [];
    if (idList.length) {
      return openStopModal(true, {
        title: t('common.cancelECN'),
        api: stopEcn,
        idList,
        listParamName: 'ids',
        listParamValue: 'idList',
        afterFetch: (res: any) => {
          if (res.code !== 200) {
            return false;
          }

          // 如果返回值的res.data是个`{ [id: string]: boolean }`的对象，则表示生成pdf推送到3.8
          const obj = res.data;
          const ids = Object.keys(obj).filter(id => obj[id]);
          ids.length > 0 && generatePdfByIds(ids);
        },
      });
    }
    message.info(t('common.selectText'));
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

  function reloadTable(e) {
    const key = e || state.activeKey;
    if (key == 1) {
      waitReload();
    } else {
      doneReload();
    }
  }

  useRouteParams({ id: {} }, params => {
    if (params.id) {
      getEcnPageList({ dataFilter: 1 }).then(({ data }) => {
        const { list } = data;
        const obj = list.find(item => item.id === params.id);
        if (obj) {
          obj.documentType = true;
          openDetail(true, {
            cacheList: [obj],
            index: 0,
            mode: 'edit',
          });
        }
      });
    }
  });
</script>
<style scoped lang="less">
  @import url('/src/design/page.less');
</style>
