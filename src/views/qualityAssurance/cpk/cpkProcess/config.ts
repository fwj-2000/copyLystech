import { STATUS_OPTIONS } from '/@/utils/status';
// import { mrbApplyStatusOptions } from '/@/views/qms/mrb/timeConsum/config';
import { isNullOrUnDef } from '/@/utils/is';
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
      title: '仓位',
      field: 'location',
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
      title: '附件',
      field: 'attachment',
      minWidth: 160,
      slots: { default: 'attachment' },
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
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 100,
      fixed: 'right',
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
      field: 'insidePN',
      minWidth: 160,
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
          dynamicDisabled: row => {},
          options: [
            { label: '是', value: 1 },
            { label: '否', value: 0 },
          ],
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
          dynamicDisabled: row => {
            return !row.riskShip;
          },
          options: [
            { label: '是', value: 1 },
            { label: '否', value: 0 },
          ],
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
          options: [
            { label: 'OK', value: 1 },
            { label: 'NG', value: 2 },
          ],
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
          options: [
            { label: '是', value: 1 },
            { label: '否', value: 0 },
          ],
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
          options: [
            { label: 'OK', value: 1 },
            { label: 'NG', value: 2 },
          ],
        },
      },
    },
    {
      title: '备注',
      field: 'remark',
      minWidth: 160,
      editRender: {
        name: 'Input',
      },
    },
  ];
}

export function getPushRecords() {
  return [
    {
      title: '推送标识',
      field: 'tag',
      width: 180,
    },
    {
      title: '推送内容',
      field: 'inputText',
    },
    {
      title: '推送结果',
      field: 'outputText',
    },
    {
      title: '状态',
      field: 'status',
    },
    {
      title: '推送结果消息',
      field: 'msg',
    },
    {
      title: '推送次数',
      field: 'times',
    },
    {
      title: '推送时间',
      field: 'creatorTime',
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
  ];
}
