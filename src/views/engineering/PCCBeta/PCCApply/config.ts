import { useBaseStore } from '/@/store/modules/base';
import { useI18n } from '/@/hooks/web/useI18n';
import { STATUS_OPTIONS } from '/@/utils/status/index';
import { set } from 'lodash-es';
import { isNullOrUnDef } from '/@/utils/is';

const baseStore = useBaseStore();
const { t } = useI18n();
export const CURRENT_RM_NODE = 'PDTLeaderReview'; // 备注节点
// tomake表单 form
export function tomakeGetSchema() {
  return [
    {
      fieldName: 'originCode',
      label: '',
      i18nField: 'originCode',
      component: 'Input',
      componentProps: {
        placeholder: '申请单号',
      },
    },
    {
      fieldName: 'InsidePartNumber',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '产品内部料号',
      },
    },
    {
      fieldName: 'InsidePartNumberOld',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '旧版成品编码',
      },
    },
    {
      fieldName: 'ShipPattern',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '出货形态',
        api: () => baseStore.getDictionaryData('DieCutShipPattern'),
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        allowClear: true,
        immediate: true,
      },
    },
    {
      fieldName: 'Factory',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '工厂',
      },
    },
    {
      fieldName: 'ApplyUserName',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '申请人',
      },
    },
    // {
    //   fieldName: 'ImmediateCustomerCode',
    //   label: '',
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: '直接客户信息',
    //   },
    // },
    {
      fieldName: 'ProductDesc',
      label: '',
      component: 'Input',
      formItemClass: 'col-span-2',
      componentProps: {
        placeholder: '产品描述',
      },
    },
    // {
    //   fieldName: 'Status',
    //   label: '',
    //   component: 'Select',
    //   componentProps: {
    //     placeholder: '状态',
    //     fieldNames: {
    //       label: 'fullName',
    //       value: 'enCode',
    //     },
    //     options: [
    //       { fullName: t('dict.enableStatus.1'), enCode: 1 },
    //       { fullName: t('common.disableText'), enCode: 2 },
    //       { fullName: t('dict.Quotation.Status.1'), enCode: 3 },
    //     ],
    //   },
    // },
    {
      fieldName: 'ImmediateCustomerPartNumber',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '直接客户料号',
      },
    },
    {
      fieldName: 'TerminalCustomerPartNumber',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '终端客户料号',
      },
    },
  ];
}

// tomake列表columns
export function tomakeGetColumns() {
  return [
    { type: 'checkbox', field: 'checkbox', width: 50 },
    {
      title: '需求单号',
      field: 'originCode',
      width: 180,
    },
    {
      title: '需求类型',
      field: 'demandTypeName',
      width: 120,
    },
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      width: 220,
    },
    {
      title: '旧版成品编码',
      field: 'insidePartNumberOld',
      width: 220,
    },
    {
      title: '版本',
      field: 'version',
      width: 70,
      formatter: ({ cellValue }) => {
        return isNullOrUnDef(cellValue) ? '' : `T${cellValue}`;
      },
    },
    {
      title: '终端项目阶段',
      field: 'projectPhase',
      width: 120,
    },
    {
      title: '需求数量',
      field: 'peakQty',
      width: 120,
    },
    {
      title: '客户要求交期',
      field: 'customerDeliveryTime',
      width: 160,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
    {
      title: '工厂',
      field: 'factoryName',
      width: 120,
    },
    {
      title: '当前处理人',
      field: 'handlerName',
      width: 220,
    },
    {
      title: '直接客户料号',
      field: 'immediateCustomerPartNumber',
      width: 180,
    },
    {
      title: '终端客户料号',
      field: 'terminalCustomerPartNumber',
      width: 180,
    },
    {
      title: '产品描述',
      field: 'productDesc',
      width: 180,
    },
    {
      title: '备注',
      field: 'nodeRemark',
      i18nField: 'CommonCol.remark',
      key: 'pmDesc',
      width: 150,
      cellRender: {
        name: 'Remark',
        nodeCode: CURRENT_RM_NODE,
      },
    },
    {
      title: '申请人',
      field: 'applyUserName',
      width: 160,
    },
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 70,
      fixed: 'right',
    },
  ];
}

// 待提交表单 form
export function waitGetFormConfig() {
  return [
    {
      label: '',
      fieldName: 'originCode',
      component: 'Input',
      componentProps: {
        placeholder: '单号',
        submitOnPressEnter: true,
      },
    },
    {
      label: '',
      fieldName: 'insidePartNumber',
      component: 'Input',
      componentProps: {
        placeholder: '产品内部料号',
        submitOnPressEnter: true,
      },
    },
    {
      fieldName: 'insidePartNumberOld',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '旧版成品编码',
      },
    },
    {
      label: '',
      fieldName: 'factory',
      component: 'Input',
      componentProps: {
        placeholder: '工厂',
        submitOnPressEnter: true,
      },
    },
    // {
    //   label: '',
    //   fieldName: 'time',
    //   component: 'RangePicker',
    //   componentProps: {
    //     format: 'YYYY-MM-DD',
    //     submitOnPressEnter: true,
    //     placeholder: [t('component.lydc.timeRange.startPlaceholder'), t('component.lydc.timeRange.endPlaceholder')],
    //   },
    // },
    {
      label: '',
      fieldName: 'terminalCustomerPartNumber',
      component: 'Input',
      componentProps: {
        placeholder: '终端客户料号',
        submitOnPressEnter: true,
      },
    },
    {
      label: '',
      fieldName: 'immediateCustomerPartNumber',
      component: 'Input',
      componentProps: {
        placeholder: '直接客户料号',
        submitOnPressEnter: true,
      },
    },
  ];
}

export const doneGetFormConfig = waitGetFormConfig;

// 待提交columns
export function waitGetColumns() {
  return [
    { type: 'checkbox', field: 'checkbox', width: 70 },
    {
      title: '需求单号',
      field: 'originCode',
      width: 200,
    },
    {
      title: '需求类型',
      field: 'demandTypeName',
      width: 120,
      formatter: ({ cellValue }) => {
        return isNullOrUnDef(cellValue) ? '/' : cellValue;
      },
    },
    {
      title: '版本',
      field: 'version',
      width: 120,
      formatter: ({ cellValue, column, row }) => {
        const { field } = column;
        column.copyDataRow = field;
        let value;
        if (isNullOrUnDef(cellValue)) {
          value = '/';
        } else {
          value = `T${cellValue}`;
        }
        set(row, `copyData.${column.field}`, value);
        return value;
      },
    },
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      width: 200,
    },
    {
      title: '旧版成品编码',
      field: 'insidePartNumberOld',
      width: 220,
    },
    {
      title: '终端项目阶段',
      field: 'projectPhase',
      width: 120,
    },
    {
      title: '需求数量',
      field: 'peakQty',
      width: 120,
    },
    {
      title: '客户要求交期',
      field: 'customerDeliveryTime',
      width: 160,
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
      width: 120,
    },
    {
      title: '当前节点',
      field: 'CURRENT_RM_NODEName',
      width: 200,
    },
    {
      title: '当前处理人',
      field: 'handlerName',
      width: 200,
    },
    {
      title: '节点详情',
      field: 'nodeDetail',
      width: 160,
      slots: {
        default: 'nodeDetail',
      },
    },
    {
      title: '直接客户料号',
      field: 'immediateCustomerProjectCode',
      width: 200,
    },
    {
      title: '终端客户料号',
      field: 'terminalCustomerPartNumber',
      width: 200,
    },
    {
      title: '工厂',
      field: 'factoryName',
      width: 200,
      formatter: ({ row }) => {
        return `${row.factory}/${row.factoryName}`;
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
        nodeCode: CURRENT_RM_NODE,
      },
    },
    {
      title: '申请人',
      field: 'applyUserName',
      width: 160,
    },
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 70,
      fixed: 'right',
    },
  ];
}

// 已提交columns
export function doneGetColumns() {
  return [
    { type: 'checkbox', field: 'checkbox', width: 70 },
    {
      title: '需求单号',
      field: 'originCode',
      width: 200,
    },
    {
      title: '需求类型',
      field: 'demandTypeName',
      width: 120,
      formatter: ({ cellValue }) => {
        return isNullOrUnDef(cellValue) ? '/' : cellValue;
      },
    },
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      width: 200,
    },
    {
      title: '旧版成品编码',
      field: 'insidePartNumberOld',
      width: 220,
    },
    {
      title: '版本',
      field: 'version',
      width: 120,
      formatter: ({ cellValue, column, row }) => {
        const { field } = column;
        column.copyDataRow = field;
        let value;
        if (isNullOrUnDef(cellValue)) {
          value = '/';
        } else {
          value = `T${cellValue}`;
        }
        set(row, `copyData.${column.field}`, value);
        return value;
      },
    },
    {
      title: '终端项目阶段',
      field: 'projectPhase',
      width: 120,
    },
    {
      title: '需求数量',
      field: 'peakQty',
      width: 120,
    },
    {
      title: '客户要求交期',
      field: 'customerDeliveryTime',
      width: 160,
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
      width: 120,
    },
    {
      title: '当前节点',
      field: 'currentNodeName',
      width: 200,
    },
    {
      title: '当前处理人',
      field: 'handlerName',
      width: 200,
    },
    {
      title: '节点详情',
      field: 'nodeDetail',
      width: 160,
      slots: {
        default: 'nodeDetail',
      },
    },
    {
      title: '直接客户料号',
      field: 'immediateCustomerProjectCode',
      width: 200,
    },
    {
      title: '终端客户料号',
      field: 'terminalCustomerPartNumber',
      width: 200,
    },
    {
      title: '工厂',
      field: 'factoryName',
      width: 200,
      formatter: ({ row }) => {
        return `${row.factory}/${row.factoryName}`;
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
        nodeCode: CURRENT_RM_NODE,
      },
    },
    {
      title: '申请人',
      field: 'applyUserName',
      width: 160,
    },
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 100,
      fixed: 'right',
    },
  ];
}
