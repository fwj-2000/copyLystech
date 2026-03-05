import { h } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { STATUS_OPTIONS } from '/@/components/CustomComponents/src/quality/Constant';
import { useUserStore } from '/@/store/modules/user';
import { useBaseStore } from '/@/store/modules/base';
const { t } = useI18n();
export const CURRENTNODE = 'PDTLeaderReview'; // 当前节点

export const PRODUCTION_TYPE_LIST = [
  { id: '1', fullName: t('status.productionType.self') },
  { id: '2', fullName: t('status.productionType.out') },
];

export const CONDITIONAL_OPTIONS = [
  { id: 1, fullName: t('status.yes') },
  { id: 0, fullName: t('status.no') },
];

// 审批状态
export const REVIEW_STATUS_OPTIONS = [
  { id: 1, fullName: t('status.reviewStatus.notReviewed'), color: '#B2B2B2' },
  { id: 2, fullName: t('status.reviewStatus.reviewing'), color: '#FF7B00' },
  { id: 3, fullName: t('status.reviewStatus.reviewed'), color: '#52C41A' },
  // { id: 4, fullName: '已废弃', color: '#FF4D4F' },
];
export const REVIEW_STATUS_EUMN = {
  1: t('status.reviewStatus.notReviewed'),
  2: t('status.reviewStatus.reviewing'),
  3: t('status.reviewStatus.reviewed'),
  // 4: t('status.reviewStatus.deprecated'),
};

export const BASIC_INFO_COLUMNS = [
  { title: t('views.quantitation.applyUserName'), dataIndex: 'ApplyUserName', key: 'ApplyUserName', width: 110, sorter: true },
  { title: t('views.quantitation.applyDeptName'), dataIndex: 'ApplyDeptName', key: 'ApplyDeptName', width: 110, sorter: true },
  { title: t('views.quantitation.applyDate'), dataIndex: 'ApplyDate', key: 'ApplyDate', width: 110, sorter: true },
  { title: t('views.quantitation.applyNo'), dataIndex: 'ApplyNo', key: 'ApplyNo', width: 110, sorter: true },
  { title: t('views.quantitation.innerMaterialNumber'), dataIndex: 'InnerMaterialNumber', sorter: true, width: 200 },
  { title: t('views.quantitation.projectPhase'), dataIndex: 'ProjectPhase', key: 'ProjectPhase', width: 120, sorter: true },
  {
    title: t('views.quantitation.terminalCustomerPartNumber'),
    dataIndex: 'TerminalCustomerPartNumber',
    key: 'TerminalCustomerPartNumber',
    width: 120,
    sorter: true,
  },
  { title: t('views.quantitation.peakQty'), dataIndex: 'PeakQty', key: 'PeakQty', width: 125, sorter: true },
  { title: t('views.quantitation.customerDeliveryTime'), dataIndex: 'CustomerDeliveryTime', key: 'CustomerDeliveryTime', width: 140, sorter: true },
  { title: t('views.quantitation.isDeclareCustoms'), dataIndex: 'IsDeclareCustoms', key: 'IsDeclareCustoms', width: 110, sorter: true },
  {
    title: t('views.quantitation.EPMStatus'),
    dataIndex: 'EPMStatus',
    sorter: true,
    width: 160,
    ellipsis: true,
    customRender: ({ record }) => {
      const tempArr = REVIEW_STATUS_OPTIONS.filter(o => o.id == record.EPMStatus) || [];
      const color = tempArr.length > 0 ? tempArr[0].color : '';
      return h('span', { style: { color } }, tempArr.length > 0 ? tempArr[0].fullName : '');
    },
  },
  { title: 'EPM', dataIndex: 'EPM', key: 'EPM', width: 110, sorter: true },
];

/**
 * @param isOut 是否外购，如果是外购，显示`产品描述`列
 */
export const vxeColumns = (handleNodeModal, isOut: boolean = false) => {
  const list = [
    { title: '单号', field: 'applyNo', key: 'applyNo', width: 150, sortable: true },
    { title: '需求类型', field: 'demandTypeName', i18nField: 'CommonCol.demandType', width: 150 },
    { title: '产品内部料号', field: 'innerMaterialNumber', sortable: true, width: 200 },
    { title: '旧版成品编码', field: 'insidePartNumberOld', sortable: true, width: 200 },
    { title: '产品描述', field: 'productDesc', sortable: true, width: 200 },
    {
      title: '状态',
      field: 'epmStatus',
      i18nField: 'CommonCol.status',
      sortable: true,
      width: 100,
      cellRender: {
        name: 'Tag',
        options: STATUS_OPTIONS,
      },
    },
    {
      title: '当前节点',
      field: 'currentNodeName',
      i18nField: 'CommonCol.currentNode',
      width: 160,
      sortable: true,
    },
    {
      title: '当前处理人',
      field: 'currentProcessor',
      i18nField: 'CommonCol.currentNodeUser',
      width: 160,
      sortable: true,
    },
    {
      title: '节点详情',
      field: 'nodeDetail',
      i18nField: 'CommonCol.nodeDetail',
      width: 120,
      slots: {
        default: ({ row }) => h('span', { class: 'table-a', onClick: handleNodeModal.bind(null, row) }, t('common.viewDetails')),
      },
    },
    {
      title: '需求数量(PCS)',
      field: 'peakQty',
      key: 'peakQty',
      width: 160,
      sortable: true,
      // customRender: ({ text }) => {
      //   return text == 0 ? '/' : text;
      // },
      formatter: ({ cellValue }) => (cellValue === 0 ? '/' : cellValue),
    },
    { title: '项目总量(W)', field: 'totalQty', width: 160 },
    { title: '报价用途', field: 'purposeDesc', key: 'purposeDesc', width: 160, sortable: true },
    {
      title: '客户要求交期',
      field: 'customerDeliveryTime',
      i18nField: 'customerDeliveryDateTime',
      key: 'customerDeliveryTime',
      width: 140,
      sortable: true,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
    {
      title: '直接客户',
      field: 'immediateCustomerName',
      width: 200,
      filters: [{ data: '' }],
      filterRender: {
        name: 'Input',
        searchField: 'immediateCustomer',
      },
    },
    {
      title: '直接客户料号',
      field: 'immediateCustomerPartNumber',
      key: 'immediateCustomerPartNumber',
      width: 120,
      sortable: true,
    },
    {
      title: '终端客户料号',
      field: 'terminalCustomerPartNumber',
      width: 120,
      sortable: true,
    },
    { title: '申请人', field: 'applyUserName', i18nField: 'CommonCol.applyUser', key: 'applyUserName', width: 150, sortable: true },
    { title: '申请部门', field: 'applyDeptName', key: 'applyDeptName', width: 150, sortable: true },
    {
      title: '申请时间',
      field: 'applyDate',
      i18nField: 'CommonCol.applyTime',
      key: 'applyDate',
      width: 150,
      sortable: true,
      cellRender: {
        name: 'Date',
      },
    },
    {
      title: '备注',
      field: 'nodeRemark',
      i18nField: 'CommonCol.remark',
      key: 'pmDesc',
      width: 150,
      cellRender: {
        name: 'Remark',
        nodeCode: CURRENTNODE,
      },
    },
  ];
  // // 如果是外购，在`产品内部料号`添加`产品描述`列
  // isOut && list.splice(3, 0, { title: '产品描述', field: 'productDesc', sortable: true, width: 200 });
  // // 在产品内部料号后面新增 旧版内部料号
  // list.splice(3, 0, { title: '旧版成品编码', field: 'insidePartNumberOld', sortable: true, width: 200 });
  return list;
};

/**
 * @param isTodo  是否是待办，已处理不显示默认当前处理人
 * */
export const formSachema = (isTodo: boolean = false) => {
  const defaultUser = isTodo ? useUserStore().getUserInfo.userId : undefined;
  const baseStore = useBaseStore();
  return [
    {
      fieldName: 'applyNo',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '单号', maxlength: 50, allowClear: true },
    },
    {
      fieldName: 'innerMaterialNumber',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '产品内部料号', maxlength: 50, allowClear: true },
    },
    {
      fieldName: 'currentProcessorId',
      label: '',
      component: 'CustomUserSelect',
      i18nField: 'CommonCol.currentNodeUser',
      componentProps: {
        defaultValue: defaultUser,
        placeholder: '当前处理人',
        allowClear: true,
      },
    },
    {
      fieldName: 'insidePartNumberOld',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '旧版成品编码', maxlength: 50, allowClear: true },
    },
    {
      fieldName: 'epmStatus',
      i18nField: 'CommonCol.status',
      label: '',
      component: 'Select',
      componentProps: {
        placeholder: '选择状态',
        submitOnPressEnter: true,
        // 状态选项只有 `待处理(6)`、`已处理(7)`、 `撤回(4)`、`驳回(3)`、 `终止(2)`
        options: STATUS_OPTIONS.filter(item => [2, 3, 4, 6, 7].includes(+item.id)),
        fieldNames: { value: 'id', label: 'fullName', allowClear: true },
      },
    },
    {
      fieldName: 'demandType',
      i18nField: 'CommonCol.demandType',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        api: async () => baseStore.getDictionaryData('DemandTypeEnum'),
        placeholder: '需求类型',
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        allowClear: true,
      },
    },
    {
      fieldName: 'immediateCustomerPartNumber',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '直接客户料号', maxlength: 50, allowClear: true },
    },
    {
      fieldName: 'terminalCustomerProjectCode',
      i18nField: 'CommonCol.terminalCustomerProjectCode',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '终端客户料号', maxlength: 50, allowClear: true },
    },
  ];
};
