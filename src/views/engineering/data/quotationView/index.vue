<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white p-10px">
        <BasicTable @register="unReviewRegisterTable">
          <template #tableTitle>
            <!--            <a-button v-auth="'btn_batchRemove'" @click="handleDel">批量删除</a-button>-->
            <a-button v-auth="'btn_download'" @click="handleUnReviewExport">{{ t('views.business.quota.export') }} </a-button>
          </template>
          <template #bodyCell="{ text, column, record, index }">
            <template v-if="column.key === 'nodeDetail'">
              <span class="table-a" @click="handleNodeModal(record)"> {{ t('common.viewDetails') }} </span>
            </template>
            <template v-if="column.key === 'action'">
              <TableAction :actions="getunReviewActions(index, record)" />
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
    <ApplyPopup @close="reloadTable(activeKey)" @reload="reloadTable(activeKey)" @register="registerApplyPopup" />
    <NodeModal @register="registerNodeModal"></NodeModal>
    <ExportModal @register="registerExportModal" />
  </div>
</template>

<script lang="ts" setup>
  import { ActionItem, BasicTable, TableAction, useTable } from '/@/components/Table';
  import { onMounted, reactive, toRefs } from 'vue';
  import { bulkDeletePcc, exportExcelTomake, getEngineeringDocApplyHistory, getPccApplyPage, getPccList } from '/@/api/engineering/pcc';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep } from 'lodash-es';
  import { usePopup } from '/@/components/Popup';
  import { useBaseStore } from '/@/store/modules/base';
  import { message } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getQuotationMadeList } from '/@/api/engineering/quotatios';
  import { getDoneColumns, getFormConfig, getUndoColumns } from '/@/views/engineering/data/quotationInit/config';
  import ApplyPopup from '/@/views/engineering/data/quotationInit/components/ApplyPopup.vue';
  import Template from '/@/views/engineering/pcc/pccApply/components/Template.vue';
  import { NodeModal } from '/@/components/CustomComponents';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { useModal } from '/@/components/Modal';
  import ExportModal from '/@/components/ExportModal/index.vue';

  const baseStore = useBaseStore();

  defineOptions({ name: 'engineering-data-quotationView' });
  const { t } = useI18n();

  const { createMessage } = useMessage();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerApplyPopup, { openPopup: openApplyPopup }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();

  onMounted(() => {
    getTypeOptions();
  });
  interface StateType {
    activeKey: string;
  }

  const STATUS_OPTIONS = [
    { id: 1, fullName: '待提交', theme: 'gray', rowKey: 'statusDesc' },
    { id: 2, fullName: '在办', theme: 'blue', rowKey: 'statusDesc' },
    { id: 3, fullName: '已处理', theme: 'green', rowKey: 'statusDesc' },
    { id: 4, fullName: '撤回', theme: 'purple', rowKey: 'statusDesc' },
    { id: 5, fullName: '驳回 ', theme: 'yellow', rowKey: 'statusDesc' },
  ];

  const state = reactive<StateType>({
    activeKey: '1',
    cacheUnReviewData: [],
    cacheReviewData: [],
    statusList: [],
  });
  const { activeKey, statusList } = toRefs(state);

  const [
    unReviewRegisterTable,
    {
      reload: unReviewReload,
      getFetchParams: unReviewFetchParams,
      getSelectRows: getUnReviewSelectRows,
      getSelectRowKeys: getUnReviewSelectRowKeys,
      clearSelectedRowKeys: clearUnReviewSelectRow,
    },
  ] = useTable({
    api: getQuotationMadeList,
    columns: getDoneColumns(),
    bordered: true,
    beforeFetch: params => {
      if (params.time && params.time.length > 0) {
        params.startTime = dayjs(params.time[0]).format('YYYY-MM-DD');
        params.endTime = dayjs(params.time[1]).format('YYYY-MM-DD');
        delete params.time;
      }
    },
    afterFetch: data => {
      state.cacheUnReviewData = data;
    },
    rowKey: 'id',
    rowSelection: { type: 'checkbox' },
    useSearchForm: true,
    // immediate: false,
    formConfig: getFormConfig(),
    actionColumn: {
      width: 80,
      title: '操作',
      dataIndex: 'action',
    },
    i18nConfig: {
      moduleCode: 'QuotationColumn',
    },
  });

  function reloadTable(e) {
    unReviewReload();
  }

  function getunReviewActions(index, record): ActionItem[] {
    return [
      // {
      //   icon: 'icon-ym icon-ym-turn',
      //   onClick: handleTurn.bind(null, "unReview", index)
      //   // auth: 'btn_detail',
      // },
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleApprove.bind(null, 'unReview', index, record),
        // auth: 'btn_detail',
      },
      // {
      //   icon: 'icon-ym icon-ym-delete',
      //   modelConfirm: {
      //     onOk: onDelete.bind(null, index),
      //   },
      //   auth: 'btn_remove',
      // },
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

  function onDelete(key: string | number) {
    const id = state.cacheUnReviewData[key]?.id;
    bulkDeletePcc([id]).then(({ code, msg }) => {
      if (code === 200) {
        message.success(msg);
      }
      reloadTable(state.activeKey);
    });
  }

  function handleDel() {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.delTip'),
      onOk: async () => {
        const selectedRowKeys = getUnReviewSelectRowKeys();
        if (selectedRowKeys?.length === 0) return message.error(t('views.business.quota.inputDeleteLine'));

        const { code, msg } = await bulkDeletePcc(selectedRowKeys);
        if (code === 200) {
          clearUnReviewSelectRow();
          reloadTable(state.activeKey);
          return message.success(msg);
        }
      },
    });
  }

  function getReviewActions(index): ActionItem[] {
    return [
      // {
      //   icon: 'ym-custom ym-custom-backup-restore',
      //   onClick: handleRevocation.bind(null, index),
      //   auth: 'btn_detail',
      // },
      // {
      //   icon: 'icon-ym icon-ym-btn-preview',
      //   onClick: handleDetail.bind(null, 'submitted', index),
      //   auth: 'btn_detail',
      // },
    ];
  }

  function handleTurn(type, index) {}

  function handleApprove(type, index, record) {
    const { tag } = record;
    openApplyPopup(true, {
      cacheList: state.cacheUnReviewData,
      mode: 'view',
      index,
    });
  }

  function handleUnReviewExport() {
    const exportColumns = cloneDeep(getUndoColumns());
    openExportModal(true, {
      api: exportExcelTomake,
      listQuery: {
        dataFilter: 3,
        ...unReviewFetchParams(),
      },

      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'dataIndex',
      i18nConfig: {
        moduleCode: 'QuotationColumn',
      },
    });
  }

  function handleSubmit(rows) {
    openDetail(true, {
      index: 0,
      cacheList: rows,
    });
    closeModal();
  }

  async function getTypeOptions() {
    state.statusList = await baseStore.getDictionaryData('DrawingsReview.Status');
    console.log(state.statusList);
  }
</script>
