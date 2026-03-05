import { STATUS_OPTIONS } from '/@/utils/status';
import { mrbApplyStatusOptions } from '/@/views/qms/mrb/timeConsum/config';
import { isNullOrUnDef } from '/@/utils/is';
import { useBaseStore } from '/@/store/modules/base';

const baseStore = useBaseStore();

const NODE_EPMQPM1 = 'EPMQPM1';
const NODE_EPMQPM2 = 'EPMQPM2';
const NODE_EPMQPM3 = 'EPMQPM3';

const YES_NO_OPTIONS = [
  { label: '是', value: 1 },
  { label: '否', value: 0 },
];

const RESULT_OPTIONS = [
  { label: 'OK', value: 1 },
  { label: 'NG', value: 2 },
];

const isNode = (row, ...nodes) => nodes.includes(row.currentNode);

const setApproveFromToggle = (row, val) => {
  row.approve = val ? 0 : null;
};

const setYgaWaiverAndApproveFromToggle = (row, val) => {
  const nextValue = val ? 0 : null;
  row.ygaWaiver = nextValue;
  row.approve = nextValue;
};

export function waitGetSchema() {
  return [
    {
      fieldName: 'insidePnNew',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '产品内部料号',
      },
    },
    {
      fieldName: 'insidePnOld',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '旧版成品编码',
      },
    },
    {
      fieldName: 'wo',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '工单号',
      },
    },
    {
      fieldName: 'factoryName',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '工厂',
      },
    },
    {
      fieldName: 'sapFactory',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: 'sap工厂',
      },
    },
    {
      fieldName: 'productDesc',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '成品描述',
      },
    },
    {
      fieldName: 'creatorUserId',
      label: '',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: '创建人',
      },
    },
    {
      fieldName: 'handlerId',
      label: '',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: '处理人',
      },
    },
    {
      fieldName: 'currentNode',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        api: () => baseStore.getDictionaryData('CPKFlowNode'),
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
    },
  ];
}

export function waitGetColumns() {
  return [
    { type: 'checkbox', field: 'checkbox', width: 70 },
    {
      title: '审批单号',
      field: 'applyCode',
      width: 180,
    },
    {
      title: '内部料号',
      field: 'insidePnNew',
    },
    {
      title: '旧版成品编码',
      field: 'insidePnOld',
      width: 220,
    },
    {
      title: '工单号',
      field: 'wo',
    },
    {
      title: '附件',
      field: 'attachment',
      minWidth: 160,
      slots: { default: 'attachment' },
    },
    {
      title: '工厂',
      field: 'factory',
      width: 180,
      formatter: ({ row }) => {
        return `${row.factoryName}(${row.factory})`;
      },
    },
    {
      title: '是否选择risk ship',
      field: 'riskShip',
      formatter: ({ cellValue }) => {
        if (typeof cellValue !== 'boolean') return null;
        if (cellValue) return '是';
        return '否';
      },
    },
    {
      title: '是否需要YGA/Waiver',
      field: 'ygaWaiver',
      formatter: ({ cellValue }) => {
        if (typeof cellValue !== 'boolean') return null;
        if (cellValue) return '是';
        return '否';
      },
      // formatter: ({ cellValue }) => {
      //   if(isNullOrUnDef(cellValue)) return null
      //   if (cellValue == 2) return 'NG';
      //   return 'OK';
      // },
    },
    {
      title: 'YGA/Waiver结果',
      field: 'ygaWaiverR',
      formatter: ({ cellValue }) => {
        if (isNullOrUnDef(cellValue)) return null;
        if (cellValue == 2) return 'NG';
        return 'OK';
      },
    },
    {
      title: '是否等待客户approve',
      field: 'approve',
      formatter: ({ cellValue }) => {
        if (typeof cellValue !== 'boolean') return null;
        if (cellValue) return '是';
        return '否';
      },
    },
    {
      title: '客户approve结果',
      field: 'approveR',
      formatter: ({ cellValue }) => {
        if (isNullOrUnDef(cellValue)) return null;
        if (cellValue == 2) return 'NG';
        return 'OK';
      },
    },
    {
      title: '创建人',
      field: 'creatorUserName',
    },
    {
      title: '创建时间',
      field: 'creatorTime',
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
    {
      title: '状态',
      field: 'status',
      cellRender: {
        name: 'Tag',
        options: STATUS_OPTIONS,
      },
    },
    {
      title: '当前处理人',
      field: 'handlerName',
    },
    {
      title: '当前节点',
      field: 'currentNodeName',
    },
    {
      title: '节点记录',
      field: 'nodeDetail',
      slots: { default: 'nodeDetail' },
      i18nField: 'CommonCol.nodeDetail',
    },
    {
      title: '技术员',
      field: 'technicianName',
    },
    {
      title: 'QE',
      field: 'qeName',
    },
    {
      title: 'PD',
      field: 'pdName',
    },
    {
      title: 'EPM/QPM',
      field: 'epmQpmName',
    },
    {
      title: '成品描述',
      field: 'productDesc',
      width: 320,
    },
  ];
}

export function getReviewColumn() {
  return [
    {
      title: '审批单号',
      field: 'applyCode',
      minWidth: 160,
    },
    {
      title: '内部料号',
      field: 'insidePnNew',
      minWidth: 220,
    },
    {
      title: '旧版成品编码',
      field: 'insidePnOld',
      width: 220,
    },
    {
      title: '工单号',
      field: 'wo',
      minWidth: 160,
    },
    {
      title: '附件',
      field: 'attachment',
      minWidth: 160,
      slots: { default: 'attachment' },
    },
    {
      title: '是否选择risk ship',
      field: 'riskShip',
      minWidth: 160,
      editRender: {
        name: 'ASelect',
        props: {
          dynamicDisabled: row => isNode(row, NODE_EPMQPM3),
          options: YES_NO_OPTIONS,
          onChange: (val, _, { row }) => {
            if (isNode(row, NODE_EPMQPM1)) {
              setYgaWaiverAndApproveFromToggle(row, val);
            }
          },
        },
      },
    },
    {
      title: '是否需要YGA/Waiver',
      field: 'ygaWaiver',
      minWidth: 160,
      editRender: {
        name: 'ASelect',
        props: {
          dynamicDisabled: row => isNode(row, NODE_EPMQPM2) || (isNode(row, NODE_EPMQPM1) && row.riskShip),
          onChange: (val, _, { row }) => {
            if (isNode(row, NODE_EPMQPM1, NODE_EPMQPM3)) {
              setApproveFromToggle(row, val);
            }
          },
          options: YES_NO_OPTIONS,
        },
      },
    },
    {
      title: '是否等待客户approve',
      field: 'approve',
      minWidth: 160,
      editRender: {
        name: 'ASelect',
        props: {
          dynamicDisabled: row =>
            isNode(row, NODE_EPMQPM2) || (isNode(row, NODE_EPMQPM1) && (row.riskShip || row.ygaWaiver)) || (isNode(row, NODE_EPMQPM3) && row.ygaWaiver),
          options: YES_NO_OPTIONS,
        },
      },
    },
    {
      title: 'YGA/Waiver结果',
      field: 'ygaWaiverR',
      minWidth: 160,
      editRender: {
        name: 'ASelect',
        props: {
          dynamicDisabled: row =>
            (isNode(row, NODE_EPMQPM1) && (row.riskShip || !row.ygaWaiver)) ||
            (isNode(row, NODE_EPMQPM2) && row.approve) ||
            (isNode(row, NODE_EPMQPM3) && !row.ygaWaiver),
          options: RESULT_OPTIONS,
        },
      },
    },
    {
      title: '客户Approve结果',
      field: 'approveR',
      minWidth: 160,
      editRender: {
        name: 'ASelect',
        props: {
          dynamicDisabled: row => (isNode(row, NODE_EPMQPM1) && (row.riskShip || !row.approve)) || (isNode(row, NODE_EPMQPM2, NODE_EPMQPM3) && !row.approve),
          options: RESULT_OPTIONS,
        },
      },
    },
    {
      title: '仓库',
      field: 'wh',
      minWidth: 220,
      editRender: {
        cacheField: 'whName',
        name: 'CustomUserSelect',
        props: {
          multiple: true,
        },
      },
    },
    {
      title: '备注',
      field: 'auditRemark',
      minWidth: 160,
      editRender: {
        name: 'Input',
      },
    },
  ];
}
