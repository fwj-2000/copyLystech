<template>
  <div class="lydc-content-wrapper-content h-full">
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <a-button type="primary" @click="handleTransfer"> {{ t('common.revoke') }} </a-button>
        <a-button @click="handleExport">{{ t('common.batchExport') }}</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="getTableActions(record)" />
        </template>
      </template>
    </BasicTable>
  </div>
  <ExportModal @register="registerExportModal" />
  <NodeModal @register="registerNodeModal"></NodeModal>
  <TransferModal @register="registerTransferModal" @reload="reload" />
  <ViewPopup @register="registerViewPopup" @reload="reload" />
  <ExportMainlandFilingForm @register="registerExportMainlandFilingForm" @reload="reload" />
  <ExportOutboundFilingForm @register="registerExportOutboundFilingForm" @reload="reload" />
</template>
<script lang="ts" setup>
  import { unref } from 'vue';
  import { BasicTable, TableAction, useTable, ActionItem, BasicColumn } from '/@/components/Table';
  import { getFilingsApplyList, delFilingsApply, batchDelFilingsApply, exportTableData } from '/@/api/business/filings';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  // import formValidate from '/@/utils/formValidate';
  import { formatTableDefaultText } from '/@/utils';
  import { useMessage } from '/@/hooks/web/useMessage';
  import dayjs from 'dayjs';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useModal } from '/@/components/Modal';
  import ExportMainlandFilingForm from '../extends/CreateMainlandPop.vue';
  import ExportOutboundFilingForm from '../extends/CreateOutboundPop.vue';
  import ViewPopup from '../extends/ViewPopup.vue';
  // import { columns } from './config';
  import { getCreatedFilingsList, getCustomerList, getFactoryList, getinnermaterialnumberlist, handleApplyStatus } from '/@/api/customerSerivce/index';
  import { STATUS_OPTIONS } from '/@/components/CustomComponents/src/quality/Constant';
  import { getNodelist } from '/@/api/business/quantitation';
  import { NodeModal, TransferModal } from '/@/components/CustomComponents';
  import { engineerBatchTransfer } from '/@/api/engineering/info';

  const [registerExportModal, { openModal: openExportModal }] = useModal();

  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();

  const columns: BasicColumn[] = [
    { title: '产品内部料号', dataIndex: 'InnerMaterialNumber', width: 150 },
    {
      title: '状态',
      dataIndex: 'Status',
      width: 100,
      format: 'tag|' + JSON.stringify(STATUS_OPTIONS),
    },
    { title: '当前处理人', dataIndex: 'CurrentUser', width: 100 },
    { title: '维护语言', dataIndex: 'language', width: 100 },
    { title: '工厂', dataIndex: 'ProductArea' },
    { title: '直接客户名称', dataIndex: 'DirectCustomerName', width: 100 },
    { title: '直接客户料号', dataIndex: 'DirectCustomerMaterialNumber', width: 150 },
    { title: '终端客户料号', dataIndex: 'TerminalCustomerMaterialNumber', width: 150 },
    { title: '关务', dataIndex: 'SellCorporation', width: 100 },
    { title: '维护人', dataIndex: 'modifyUser', width: 100 },
    { title: '维护时间', dataIndex: 'modifyDate', width: 150 },

    // { title: '备案需求单号', dataIndex: 'FilingsRequirementApplyNo', width: 150 },
    // { title: '备案需求单号', dataIndex: 'FilingsApplyNo', width: 150, resizable: true },
    // { title: '来源单号', dataIndex: 'QuantitativeApplyNo', width: 150 },
    // { title: '出港备案表', dataIndex: 'SellCorporation', width: 150 },
    // { title: '客服', dataIndex: 'CustomersName', width: 200 },

    // {
    //   title: '状态',
    //   dataIndex: 'Status',
    //   sorter: true,
    //   width: 100,
    //   format: 'tag|' + JSON.stringify(STATUS_OPTIONS),
    // },
    // { title: '当前处理人', dataIndex: 'handlerName', sorter: true, width: 100 },
    // { title: '当前节点', dataIndex: 'currentNode', sorter: true, width: 100 },
    // {
    //   title: '节点记录',
    //   // dataIndex: 'status',
    //   sorter: true,
    //   dataIndex: 'nodeDetail',
    //   width: 120,
    //   customRender: ({ record }) => {
    //     return h('span', { class: 'table-a', onClick: handleNodeModal.bind(null, record) }, '查看详情');
    //   },
    // },
    // { title: '口岸', dataIndex: 'Prot', sorter: true, width: 100 },
    // { title: '出货方式', dataIndex: 'ShipmentType', sorter: true, width: 100 },
    // { title: '出货备案法人', dataIndex: 'SellCorporation', sorter: true, width: 150 },
    // { title: '备案语言', dataIndex: 'FilingsLanguage', sorter: true, width: 100 },
    // { title: '工厂', dataIndex: 'ProductArea', sorter: true, width: 100 },
    // { title: '直接客户名称', dataIndex: 'PDName', sorter: true, width: 150 },
    // { title: 'PD', dataIndex: 'PDName', sorter: true, width: 150 },
    // { title: '销售', dataIndex: 'SalesName', sorter: true, width: 200 },
    // {
    //   title: '申请备案时间',
    //   dataIndex: 'FilingsApplyTime',
    //   key: 'FilingsApplyTime',
    //   width: 150,
    //   sorter: true,
    //   format: 'date|YYYY-MM-DD HH:MM:SS',
    // },

    // { title: '备注', dataIndex: 'Remark', sorter: true, width: 150 },
    // { title: '申请人', dataIndex: 'KfApplyUserName', key: 'KfApplyUserName', width: 150, sorter: true },
    // { title: '申请部门', dataIndex: 'KfApplyDeptName', key: 'KfApplyDeptName', width: 150, sorter: true },
    // { title: '修改人', dataIndex: 'KfApplyUserName', key: 'KfApplyUserName', width: 150, sorter: true },
    // {
    //   title: '修改时间',
    //   dataIndex: 'KfApplyDate',
    //   key: 'KfApplyDate',
    //   width: 120,
    //   sorter: true,
    //   format: 'date|YYYY-MM-DD HH:MM:SS',
    // },
  ];

  const [registerTransferModal, { openModal: openTransferModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerApplyPop, { openPopup: openMenuPopup }] = usePopup();
  const [registerExportMainlandFilingForm, { openPopup: openExportMainlandFilingForm }] = usePopup();
  const [registerExportOutboundFilingForm, { openPopup: openExportOutboundFilingForm }] = usePopup();
  const [registerViewPopup, { openPopup: openView }] = usePopup();
  const [registerTable, { reload, getFetchParams, getSelectRowKeys }] = useTable({
    api: getCreatedFilingsList,
    columns,
    beforeFetch: params => {
      if (params.StartTime) {
        params.StartTime = dayjs(params.StartTime).format('YYYY-MM-DD');
      }
      if (params.EndTime) {
        params.EndTime = dayjs(params.EndTime).format('YYYY-MM-DD');
      }
      params.status = '1';
      params.Role = 1;
    },
    formConfig: {
      // baseColProps: { span: 3 },
      showActionButtonGroup: true,
      showAdvancedButton: false,
      // autoAdvancedLine: 1,
      compact: true,
      labelAlign: 'left',
      labelWidth: 70,
      actionColOptions: {
        span: 3,
      },
      schemas: [
        {
          field: 'InnerMaterialNumber',
          label: '',
          component: 'ApiSelect',
          colProps: {
            span: 3,
          },
          componentProps: {
            placeholder: '产品内部料号',
            maxlength: 50,
            submitOnPressEnter: true,
            api: getinnermaterialnumberlist,
            labelField: 'InnerMaterialNumber',
            valueField: 'InnerMaterialNumber',
            filterOption: false,
            notFoundContent: null,
            immediate: true,
            showSearch: true,
            apiSearch: {
              show: true,
              searchName: 'keyword',
            },
            resultField: 'data',
            useChangeCopy: true,
          },
        },
        {
          field: 'FactoryId',
          label: '',
          component: 'ApiSelect',
          colProps: {
            span: 3,
          },
          componentProps: {
            placeholder: '工厂',
            maxlength: 50,
            api: getFactoryList,
            nameFormat: ['Name', '/', 'Code'],
            labelField: 'Name',
            valueField: 'Code',
            filterOption: false,
            notFoundContent: null,
            immediate: true,
            showSearch: true,
            apiSearch: {
              show: true,
              searchName: 'keyword',
            },
            resultField: 'data',
            useChangeCopy: true,
            submitOnPressEnter: true,
          },
        },
        {
          field: 'DirectCustomerName',
          label: '',
          component: 'Input',
          labelWidth: 100,
          colProps: {
            span: 3,
          },
          componentProps: { placeholder: '直接客户信息', maxlength: 50 },
        },
        {
          field: 'DirectCustomerMaterialNumber',
          label: '',
          component: 'ApiSelect',
          colProps: {
            span: 3,
          },
          componentProps: {
            placeholder: '直接客户料号',
            maxlength: 50,
            api: getCustomerList,
            // nameFormat: ['name', '/', 'code'],
            labelField: 'name',
            valueField: 'code',
            filterOption: false,
            notFoundContent: null,
            immediate: true,
            showSearch: true,
            apiSearch: {
              show: true,
              searchName: 'keyword',
            },
            resultField: 'data',
            useChangeCopy: true,
            submitOnPressEnter: true,
          },
        },
        {
          field: 'TerminalCustomerCode',
          label: '',
          component: 'Input',
          labelWidth: 100,
          colProps: {
            span: 2,
          },
          componentProps: { placeholder: '终端客户料号', maxlength: 50, allowClear: false },
        },
        // {
        //   field: 'FilingsApplyNo',
        //   label: '',
        //   component: 'Input',
        //   labelWidth: 100,
        //   colProps: {
        //     span: 3,
        //   },
        //   componentProps: { placeholder: '需求单号/备案需求单号', maxlength: 50 },
        // },
        // {
        //   field: 'ApplyUserName',
        //   label: '',
        //   component: 'Input',
        //   labelWidth: 100,
        //   componentProps: { placeholder: '请输入申请人', maxlength: 50 },
        // },
        // {
        //   field: 'customer',
        //   label: '',
        //   component: 'CustomUserSelect',
        //   labelWidth: 100,
        //   colProps: {
        //     span: 2,
        //   },
        //   componentProps: { placeholder: '客服', maxlength: 50 },
        // },
        // {
        //   field: 'customer',
        //   label: '',
        //   component: 'CustomUserSelect',
        //   labelWidth: 100,
        //   colProps: {
        //     span: 2,
        //   },
        //   componentProps: { placeholder: '关务', maxlength: 50 },
        // },
        // {
        //   field: 'status',
        //   label: '',
        //   component: 'Select',
        //   labelWidth: 100,
        //   colProps: {
        //     span: 3,
        //   },
        //   componentProps: { placeholder: '出口内地备案表', maxlength: 50, options: STATUS_OPTIONS },
        // },
        // {
        //   field: 'status',
        //   label: '',
        //   component: 'Select',
        //   labelWidth: 100,
        //   colProps: {
        //     span: 3,
        //   },
        //   componentProps: { placeholder: '出港备案表', maxlength: 50, options: STATUS_OPTIONS },
        // },
        // {
        //   field: 'TerminalCustomerProjectCode',
        //   label: '',
        //   component: 'Input',
        //   labelWidth: 100,
        //   componentProps: { placeholder: '请输入终端项目代码', maxlength: 50 },
        // },
        {
          field: 'pickerVal',
          label: '',
          labelWidth: 100,
          component: 'DateRange',
          colProps: {
            span: 5,
          },
          componentProps: {
            format: 'YYYY-MM-DD',
            placeholder: ['开始时间', '结束时间'],
          },
        },
        // {
        //   field: 'seller',
        //   label: '',
        //   component: 'CustomUserSelect',
        //   labelWidth: 100,
        //   componentProps: { placeholder: '销售', maxlength: 50 },
        // },
        {
          field: 'Status',
          label: '',
          component: 'Select',
          labelWidth: 100,
          colProps: {
            span: 2,
          },
          componentProps: { placeholder: '状态', maxlength: 50, options: STATUS_OPTIONS },
        },
      ],
      fieldMapToTime: [['pickerVal', ['StartTime', 'EndTime']]],
    },
    rowKey: 'Id',
    useSearchForm: true,
    striped: true,
    ellipsis: true,
    tableSetting: {
      redo: false,
      delStatus: true,
    },
    rowSelection: { type: 'checkbox' },
    actionColumn: {
      width: 60,
      title: '操作',
      dataIndex: 'action',
    },
    canColDrag: true,
    isCanResizeParent: true,
    canResize: true,
    pagination: {
      pageSize: 50,
    },
    transformCellText: ({ text }) => formatTableDefaultText(text),
  });
  const handleViewsss = async () => {
    openView(true, {
      type: 'view',
      ids: [],
      title: t('common.detailText'),
    });
  };
  const handleView = async id => {
    console.log('handleView', id);
    openView(true, {
      type: 'view',
      ids: [id],
      title: t('common.detailText'),
    });
  };
  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        // auth: 'btn_view',
        onClick: handleView.bind(null, record.Id),
      },
      // {
      //   icon: 'icon-ym icon-ym-edit',
      //   auth: 'btn_edit',
      //   onClick: edit.bind(null, record),
      // },
      // {
      //   color: 'error',
      //   icon: 'icon-ym icon-ym-delete',
      //   auth: 'btn_remove',
      //   modelConfirm: {
      //     onOk: handleDelete.bind(null, record),
      //   },
      // },
    ];
  }
  function handleDelete(record) {
    delFilingsApply(record.Id).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }
  // function batchDelete() {
  //   const idList = getSelectRowKeys();
  //   if (!idList || idList.length === 0) {
  //     createMessage.warning(t('common.selectText'));
  //     return;
  //   }

  //   batchDelFilingsApply(idList).then(res => {
  //     createMessage.success(res.msg);
  //     reload();
  //   });
  // }

  async function batchDelete() {
    const selectKeys = getSelectRowKeys();
    if (selectKeys.length === 0) return createMessage.warning(t('common.selectText'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: '此操作将永久删除该数据, 是否继续？',
      onOk: async () => {
        try {
          const { code, msg } = await batchDelFilingsApply(selectKeys);
          if (code === 200) {
            createMessage.success(msg);
            reload();
          }
        } catch (e) {
          reload();
        }
      },
    });
  }
  const handleTransfer = async () => {
    const idList = getSelectRowKeys();
    if (!idList.length) return createMessage.warning('请选择转办内容');
    openTransferModal(true, {
      id: idList || [],
      submitCallback: handleTransferCB,
    });
  };
  const handleTransferCB = async data => {
    const { id } = unref(data);
    const r = await engineerBatchTransfer({
      ids: id,
      transferRemarks: data.remark,
      transferUserId: data.transferUser,
    });
    return r;
  };
  const handleExport = async () => {
    openExportModal(true, {
      api: exportTableData,
      listQuery: {
        ...getFetchParams(),
      },
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'dataIndex',
    });
  };
  const createExportFilingForm = async () => {
    const selectKeys = getSelectRowKeys();
    if (selectKeys.length === 0) return createMessage.warning(t('common.selectText'));
    openExportMainlandFilingForm(true, {
      ids: [''],
      title: t('views.finalFilingForm.exportMainlandFilingForm'),
    });
  };
  const createExportOutboundFilingForm = async () => {
    const selectKeys = getSelectRowKeys();
    if (selectKeys.length === 0) return createMessage.warning(t('common.selectText'));
    openExportOutboundFilingForm(true, {
      ids: [''],
      title: t('views.finalFilingForm.outboundFilingForm'),
    });
  };
  const handleOrderStatus = async status => {
    // const idList = getSelectRowKeys();
    // if (!idList || idList.length === 0) {
    //   createMessage.warning(t('common.selectText'));
    //   return;
    // }
    // batchRevokeFilingsApply(idList).then(res => {
    //   createMessage.success(res.msg);
    //   reload();
    // });
    const statusEnmu = {
      '-2': '撤回',
      '-1': '终止',
    };
    const selectKeys = getSelectRowKeys();
    if (selectKeys.length === 0) return createMessage.warning(t('common.selectText'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: `确认要整单${statusEnmu[status]}？`,
      onOk: async () => {
        try {
          const { code, msg } = await handleApplyStatus({
            Ids: selectKeys,
            Status: status,
          });
          if (code === 200) {
            createMessage.success(msg);
            reload();
          }
        } catch (e) {
          reload();
        }
      },
    });
  };
  const handleEnded = async () => {
    // const idList = getSelectRowKeys();
    // if (!idList || idList.length === 0) {
    //   createMessage.warning(t('common.selectText'));
    //   return;
    // }
    // batchEndedFilingsApply(idList).then(res => {
    //   createMessage.success(res.msg);
    //   reload();
    // });
  };
  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodelist,
      id: record.id,
    });
  }
</script>

<style lang="less" scoped>
  :deep(.lydc-content-wrapper-search-box) {
    margin-bottom: 0 !important;
  }

  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  .text-border {
    border-bottom: 1px solid #333;
    cursor: pointer;
  }

  .table-a {
    color: #ff7b00;
    cursor: pointer;
  }
</style>
