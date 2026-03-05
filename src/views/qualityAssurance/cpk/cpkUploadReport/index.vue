<script setup lang="ts">
  import { reactive, toRefs } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { doneGetColumns, waitGetColumns, waitGetSchema } from './config';
  import { getCpkData, postCpkDetail, postCpkExportExcel } from '/@/api/qualityAssurance/cpk';
  import UploadReport from './components/UploadReport.vue';
  import { usePopup } from '/@/components/Popup';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { useModal } from '/@/components/Modal';
  import { isEmpty } from '/@/utils/is';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { TableAction } from '/@/components/Table';
  import { NodeModal } from '/@/components/CustomComponents';
  import AttachList from '/@/views/qualityAssurance/cpk/cpkUploadReport/components/AttachList.vue';
  import Revocation from '/@/views/qualityAssurance/cpk/cpkUploadReport/components/Revocation.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { usePermission } from '/@/hooks/web/usePermission';

  const { t } = useI18n();
  const { hasBtnP } = usePermission();

  defineOptions({ name: 'qualityAssurance-cpk-cpkUploadReport' });

  const [registerUploadPopup, { openPopup: openUploadPopup }] = usePopup();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerAttach, { openModal: openAttachModal }] = useModal();
  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();

  const { createMessage } = useMessage();

  const state = reactive<Record<string, any>>({
    activeKey: '1',
    waitCacheList: [],
    doneCacheList: [],
    index: 0,
  });

  const { activeKey } = toRefs(state);

  const [
    Wait,
    {
      reload: waitReload,
      getSelectRowKeys: waitGetSelectRowKeys,
      setLoading: waitSetLoading,
      clearSelectedRowKeys: waitClearSelectedRowKeys,
      getSelectRows: waitGetSelectRows,
      getFetchParams: waitGetFetchParams,
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
      schema: waitGetSchema(),
      wrapperClass: 'grid grid-cols-5 gap-4',
      i18nConfig: {
        moduleCode: 'CPKColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'qualityAssurance-cpk-cpkIdentification-list-wait',
      columns: waitGetColumns(),
      api: getCpkData,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'CPKColumn',
      },
      rowConfig: {
        keyField: 'woId',
      },
      beforeFetch: params => {
        return {
          ...params,
          dataFilter: 1,
        };
      },
      afterFetch: data => {
        state.waitCacheList = data.list;
      },
    },
  });

  const [
    Done,
    {
      reload: doneReload,
      getSelectRowKeys: doneGetSelectRowKeys,
      setLoading: doneSetLoading,
      clearSelectedRowKeys: doneClearSelectedRowKeys,
      getSelectRows: doneGetSelectRows,
      getFetchParams: doneGetFetchParams,
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
      schema: waitGetSchema(),
      wrapperClass: 'grid grid-cols-5 gap-4',
      i18nConfig: {
        moduleCode: 'CPKColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'qualityAssurance-cpk-cpkIdentification-list-done',
      columns: doneGetColumns(),
      api: getCpkData,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'CPKColumn',
      },
      rowConfig: {
        keyField: 'woId',
      },
      beforeFetch: params => {
        return {
          ...params,
          dataFilter: 2,
        };
      },
      afterFetch: data => {
        state.doneCacheList = data.list;
      },
    },
  });

  function reloadTable() {
    if (state.activeKey == 1) {
      waitReload();
    } else if (state.activeKey == 2) {
      doneReload();
    }
  }

  function handleUpload() {
    const rows = waitGetSelectRows();
    if (isEmpty(rows)) return createMessage.warning(t('common.selectText'));
    openUploadPopup(true, rows);
  }

  // 节点详情
  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.id,
    });
  }

  function handleAttachmentModal(row) {
    postCpkDetail([row.id]).then(({ code, data }) => {
      if (code !== 200) return;
      openAttachModal(true, data);
    });
  }

  function handleRevocation() {
    const rows = doneGetSelectRows();
    if (isEmpty(rows)) return createMessage.warning(t('common.selectText'));
    openFormModal(true, {
      id: rows.map(item => item.id),
    });
  }

  //导出
  async function handleExport(dataFilter) {
    openExportModal(true, {
      api: postCpkExportExcel,
      listQuery: {
        ...(dataFilter == 1 ? await waitGetFetchParams() : await doneGetFetchParams()),
        dataFilter,
      },
      exportOptions: dataFilter == 1 ? waitGetColumns() : doneGetColumns(),
      nameProps: 'title',
      idProps: 'field',
    });
  }

  function getTableActions(row, index) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleDetail.bind(null, row, index),
      },
    ];
  }
  function handleDetail(row, index) {
    openUploadPopup(true, [row]);
  }
</script>

<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs @change="reloadTable" v-model:activeKey="activeKey" class="h-full">
          <a-tab-pane key="1" :tab="t('common.todoText')" class="h-full">
            <Wait>
              <template #toolbar-actions>
                <a-space>
                  <a-button v-if="hasBtnP('btn_uploadReport')" type="primary" @click="handleUpload('enabled')">
                    {{ t('dict.Cpk.uploadCpkReport') }}
                  </a-button>
                  <a-button v-if="hasBtnP('btn_download')" @click="handleExport('1')">{{ t('common.batchExport') }} </a-button>
                </a-space>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
              <template #action="{ row, rowIndex }">
                <TableAction outside :actions="getTableActions(row, rowIndex)" />
              </template>
            </Wait>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('common.doneText')" class="h-full">
            <Done>
              <template #toolbar-actions>
                <a-space>
                  <a-button v-if="hasBtnP('btn_recall')" type="primary" @click="handleRevocation">撤回</a-button>
                  <a-button v-if="hasBtnP('btn_download')" @click="handleExport('2')">{{ t('common.batchExport') }} </a-button>
                </a-space>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
              <template #attachment="{ row }">
                <span class="table-a" @dblclick="handleAttachmentModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
            </Done>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <UploadReport @register="registerUploadPopup" @reload="reloadTable" @close="reloadTable" />
    <NodeModal @register="registerNodeModal" />
    <AttachList @register="registerAttach" @refresh="reloadTable" />
    <Revocation @register="registerForm" @reload="reloadTable" />
    <ExportModal @register="registerExportModal" />
  </div>
</template>

<style scoped lang="less">
  @import url('/src/design/page.less');
</style>
