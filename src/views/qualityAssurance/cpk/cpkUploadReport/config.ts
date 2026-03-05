import { STATUS_OPTIONS } from '/@/utils/status/index';
import { useBaseStore } from '/@/store/modules/base';

const baseStore = useBaseStore();

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
        placeholder: '产品描述',
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
    // {
    // 	title: '审批单号',
    // 	field: 'applyCode',
    // 	width: 180,
    // },
    {
      title: '内部料号',
      field: 'insidePnNew',
    },
    {
      title: '旧版成品编码',
      field: 'insidePnOld',
    },
    {
      title: '工单号',
      field: 'wo',
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
      title: '工厂',
      field: 'factory',
      width: 180,
      formatter: ({ row }) => {
        return `${row.factoryName}(${row.factory})`;
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
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 55,
      fixed: 'right',
    },
  ];
}
export function doneGetColumns() {
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
      title: '工厂',
      field: 'factory',
      width: 180,
      formatter: ({ row }) => {
        return `${row.factoryName}(${row.factory})`;
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

export function getUploadReportColumn() {
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
      title: '技术员',
      field: 'technician',
      minWidth: 160,
      editRender: {
        cacheField: 'technicianName',
        name: 'CustomUserSelect',
        props: {
          multiple: true,
        },
      },
    },
    {
      title: 'QE',
      field: 'qe',
      minWidth: 160,
      editRender: {
        cacheField: 'qeName',
        name: 'CustomUserSelect',
        props: {
          multiple: true,
        },
      },
    },
    {
      title: 'PD',
      field: 'pd',
      minWidth: 160,
      editRender: {
        cacheField: 'pdName',
        name: 'CustomUserSelect',
        props: {
          multiple: true,
        },
      },
    },
    {
      title: 'EPM/QPM',
      field: 'epmQpm',
      minWidth: 160,
      editRender: {
        cacheField: 'epmQpmName',
        name: 'CustomUserSelect',
        props: {
          multiple: true,
        },
      },
    },
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 55,
      fixed: 'right',
    },
  ];
}

export function getAttachmentColumns() {
  return [
    {
      title: '工单号',
      field: 'wo',
      minWidth: 160,
    },
    {
      title: '内部料号',
      field: 'insidePN',
      minWidth: 160,
    },
    {
      title: '附件',
      field: 'attachment',
      slots: { default: 'attachment' },
      minWidth: 160,
    },
    {
      title: '上传人',
      field: 'creatorUserName',
      minWidth: 160,
    },
    {
      title: '上传时间',
      field: 'creatorTime',
      minWidth: 160,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD HH:mm:ss', // 日期格式
      },
    },
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 100,
    },
  ];
}
