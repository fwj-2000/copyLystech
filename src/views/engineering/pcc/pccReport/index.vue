<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white p-10px">
        <BasicTable @register="reviewRegisterTable">
          <template #tableTitle>
            <a-button v-auth="'btn_download'" @click="handleUnReviewExport">{{ t('views.business.quota.export') }} </a-button>
          </template>
          <template #bodyCell="{ column, index, text }">
            <template v-if="column.key === 'action'">
              <TableAction :actions="getReviewActions(index)" />
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
    <DetailPopup @register="registerDetail" @close="reviewReload" @reload="reviewReload" />
    <NodeModal @register="registerNodeModal"></NodeModal>
  </div>
</template>

<script lang="ts" setup>
  import { ActionItem, BasicTable, TableAction, useTable } from '/@/components/Table';
  import { exportExcelTomake, getPccApplyPage, getPccReportList } from '/@/api/engineering/pcc';
  import dayjs from 'dayjs';
  import { getUnReviewFormConfig } from '/@/views/engineering/pcc/pccApply/CONFIG';
  import { STATUS_OPTIONS } from '/@/utils/status/index';
  import { formatTableDefaultText } from '/@/utils';
  import { h, reactive } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep } from 'lodash-es';
  import { useModal } from '/@/components/Modal';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { NodeModal } from '/@/components/CustomComponents';
  import { usePopup } from '/@/components/Popup';
  import { usePermission } from '/@/hooks/web/usePermission';
  import DetailPopup from '/@/views/engineering/pcc/pccApply/components/DetailPopup.vue';

  defineOptions({ name: 'engineering-pcc-pccReport' });

  const { t } = useI18n();
  const { hasBtnP } = usePermission();

  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerDetail, { openPopup: openDetail }] = usePopup();

  const state = reactive<StateType>({
    cacheReviewData: [],
  });

  const [
    reviewRegisterTable,
    {
      reload: reviewReload,
      getFetchParams: reviewFetchParams,
      getSelectRows: getReviewSelectRows,
      getSelectRowKeys: getReviewSelectRowKeys,
      clearSelectedRowKeys: clearReviewSelectRow,
    },
  ] = useTable({
    api: getPccReportList,
    columns: getUnReviewColumns(),
    bordered: true,

    beforeFetch: params => {
      // params.dataFilter = 2;
      params.status = 3;
      if (params.time && params.time.length > 0) {
        params.startTime = dayjs(params.time[0]).format('YYYY-MM-DD');
        params.endTime = dayjs(params.time[1]).format('YYYY-MM-DD');
        delete params.time;
      }
      return params;
    },
    afterFetch: data => {
      state.cacheReviewData = data;
    },
    rowKey: 'id',
    rowSelection: { type: 'checkbox' },
    useSearchForm: true,
    // immediate: false,
    formConfig: getUnReviewFormConfig(),
    actionColumn: {
      width: 80,
      title: '操作',
      dataIndex: 'action',
    },
    transformCellText: ({ text }) => {
      return formatTableDefaultText(text);
    },
    i18nConfig: {
      moduleCode: 'PCCApplyColumn',
    },
  });

  function getUnReviewColumns() {
    return [
      {
        title: '需求单号',
        dataIndex: 'originCode',
        width: 200,
      },
      {
        title: '需求类型',
        dataIndex: 'demandTypeName',
        width: 120,
      },
      {
        title: '产品内部料号',
        dataIndex: 'insidePartNumber',
        width: 200,
      },
      {
        title: '版本',
        dataIndex: 'version',
        customRender: ({ record }) => {
          return `T${record.version}`;
        },
        width: 80,
      },
      {
        title: '状态',
        dataIndex: 'status',
        format: 'tag|' + JSON.stringify(STATUS_OPTIONS),
      },
      {
        title: '当前节点',
        dataIndex: 'currentNodeName',
        width: 200,
      },
      {
        title: '当前处理人',
        dataIndex: 'handlerName',
        width: 200,
      },
      {
        title: '节点详情',
        dataIndex: 'nodeDetail',
        width: 120,
        customRender: ({ record }) => {
          return h('span', { class: 'table-a', onClick: handleNodeModal.bind(null, record) }, t('common.viewDetails'));
        },
      },
      {
        title: '直接客户料号',
        dataIndex: 'immediateCustomerPartNumber',
        width: 200,
      },
      {
        title: '终端客户料号',
        dataIndex: 'terminalCustomerPartNumber',
        width: 200,
      },
      {
        title: '工厂',
        dataIndex: 'factoryName',
        width: 200,
      },
    ];
  }

  function handleUnReviewExport() {
    const exportColumns = cloneDeep(getUnReviewColumns());
    openExportModal(true, {
      api: exportExcelTomake,
      listQuery: {
        dataFilter: 3,
        ...unReviewFetchParams(),
      },

      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'dataIndex',
    });
  }

  function getReviewActions(index): ActionItem[] {
    return [
      // {
      //   icon: 'ym-custom ym-custom-backup-restore',
      //   onClick: handleRevocation.bind(null, index),
      //   // auth: 'btn_detail',
      // },
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleApprove.bind(null, 'reviewed', index),
      },
    ];
  }

  function handleApprove(type, index) {
    const hasP = hasBtnP('btn_edit');
    if (type == 'reviewed') {
      openDetail(true, {
        index: index,
        mode: 'view',
        cacheList: state.cacheReviewData,
      });
    }
    // else if (type == 'submitted' && index == -1) {
    //   const rows = getSelectRowsTobe();
    //   if (rows.length <= 0) {
    //     return createMessage.warning('请选择要评审的数据');
    //   }
    // }
    // if (type === 'unReview') {
    //   params.cacheList = state.cacheUnReviewData;
    //   if (index == -1) {
    //     params.index = 0;
    //     const rows = getUnReviewSelectRows();
    //     if (rows.length !== 0) {
    //       params.cacheList = rows;
    //     }
    //   }
    // } else if (type === 'review') {
    //   params.cacheList = state.cacheReviewData;
    //   if (index == -1) {
    //     params.index = 0;
    //     const rows = getSelectRows();
    //     if (rows.length !== 0) {
    //       params.cacheList = rows;
    //     }
    //     params.sign = 'detail';
    //   }
    // }
    // if (params.cacheList.length === 0) return createMessage.warning('当前列表没有待处理图纸');
    // console.log(params);
    // openDrawingDetail(true, params);
  }

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.flowBillId || record.id,
      fetchSetting: {
        listField: 'flowNodeInstanceHisList',
      },
    });
  }
</script>
