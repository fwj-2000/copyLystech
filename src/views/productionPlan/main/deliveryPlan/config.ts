import { BasicColumn } from '/@/components/Table';
import { STATUS_OPTIONS, PRODUCTION_LIST } from '/@/components/CustomComponents/src/quality/Constant';
import dayjs from 'dayjs';
import { useI18n } from '/@/hooks/web/useI18n';
import { useUserStore } from '/@/store/modules/user';
import { getNodeRemarkValue } from '/@/views/productionPlan/main/quantitation/config';

const { t } = useI18n();

export function getColumnsTodo() {
  return [
    {
      type: 'checkbox',
      field: 'checkbox',
      width: 50,
    },
    {
      title: '单号',
      field: 'applyNo',
      width: 200,
    },
    {
      title: '产品内部料号',
      field: 'innerMaterialNumber',
      width: 200,
    },
    {
      title: '特殊备注',
      field: 'engineeringRemarks',
      width: 200,
      showOverflow: 'ellipsis',
      slots: {
        default: 'engineeringRemarks',
      },
    },
    {
      title: '量试订单评审',
      field: 'pdReview',
      slots: {
        default: 'pdReview',
      },
      width: 120,
    },
    {
      title: '生产类型',
      field: 'productionType',
      i18nField: 'productionTypeDesc',
      width: 150,
      formatter: ({ cellValue }) => PRODUCTION_LIST.find(el => el.id == cellValue)?.fullName,
    },
    {
      title: '状态',
      field: 'status',
      width: 140,
      i18nField: 'CommonCol.status',
      // format: 'tag|' + JSON.stringify(STATUS_OPTIONS),
      cellRender: {
        name: 'Tag',
        options: STATUS_OPTIONS,
      },
    },
    {
      title: '当前处理人',
      i18nField: 'CommonCol.currentNodeUser',
      field: 'currentProcessor',
      width: 220,
    },
    {
      title: '交付计划',
      field: 'diecuttingPlanRemark',
      width: 150,
    },
    {
      title: '备注',
      field: 'remark',
      i18nField: 'diecuttingRemark',
      width: 200,
    },
    {
      title: '客户要求交期',
      field: 'customerDeliveryTime',
      i18nField: 'customerDeliveryDateTime',
      width: 130,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
    {
      title: '预估材料交期',
      field: 'estimatedMaterialsTime',
      i18nField: 'estimatedMaterialsDateTime',
      width: 130,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
    {
      title: '备注(材料交期)',
      field: 'mcRemark',
      width: 130,
    },
    {
      title: '需求数量(PCS)',
      field: 'peakQty',
      width: 160,
    },
    {
      title: '排产数量(PCS)',
      field: 'demandQty',
      width: 160,
    },
    {
      title: 'PD',
      field: 'pdName',
      i18nField: 'pd',
      width: 180,
    },
    { title: '需求类型', field: 'demandType', width: 180, i18nField: 'CommonCol.demandType' },
    {
      title: '当前节点',
      i18nField: 'CommonCol.currentNode',
      field: 'currentNodeName',
      width: 160,
    },
    {
      title: '节点记录',
      i18nField: 'CommonCol.nodeDetail',
      field: 'nodeDetail',
      width: 120,
      slots: {
        default: 'nodeDetail',
      },
    },
    {
      title: '直接客户料号',
      field: 'immediateCustomerPartNumber',
      width: 160,
    },
    {
      title: '终端客户料号',
      field: 'terminalCustomerPartNumber',
      width: 160,
    },
    {
      title: '终端项目阶段',
      field: 'projectPhase',
      width: 160,
    },
    {
      title: '工厂',
      field: 'factory',
      width: 160,
    },
    {
      title: '产品描述',
      field: 'productDesc',
      width: 160,
    },
    {
      title: '申请人',
      field: 'applyUserName',
      i18nField: 'CommonCol.applyUser',
      width: 220,
    },
    {
      title: '申请时间',
      field: 'applyDate',
      i18nField: 'CommonCol.applyTime',
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
      width: 200,
    },
    // 操作行
    {
      title: t('common.action'),
      width: 60,
      field: 'action',
      fixed: 'right',
      slots: {
        default: 'action',
      },
    },
  ];
}

export function getFormConfigTodo() {
  return {
    collapsed: true,
    // 是否在字段值改变时提交表单
    submitOnChange: false,
    showCollapseButton: false,
    // 按下回车时是否提交表单
    submitOnEnter: true,
    commonConfig: {
      componentProps: {},
      labelClass: 'w-0',
    },
    wrapperClass: 'grid grid-cols-5 gap-4',
    i18nConfig: {
      moduleCode: 'QuantitativeDiecuttingPlanColumn',
      transferRange: ['placeholder'],
    },
    baseColProps: {
      span: 4,
    },
    schema: [
      {
        label: '',
        fieldName: 'applyNo',
        component: 'Input',
        componentProps: {
          placeholder: '单号',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        fieldName: 'innerMaterialNumber',
        component: 'Input',
        componentProps: {
          placeholder: '产品内部料号',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        fieldName: 'terminalCustomerPartNumber',
        i18nfield: 'CommonCol.terminalCustomerPartNumber',
        component: 'Input',
        componentProps: {
          placeholder: '终端客户料号',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        fieldName: 'currentProcessorId',
        i18nField: 'CommonCol.currentNodeUser',
        component: 'CustomUserSelect',
        componentProps: {
          defaultValue: useUserStore().getUserInfo.userId,
          placeholder: '当前处理人',
          submitOnPressEnter: true,
        },
      },
    ],
  };
}

export function getColumnsDone() {
  return [
    {
      type: 'checkbox',
      field: 'checkbox',
      width: 50,
    },
    {
      title: '单号',
      field: 'applyNo',
      width: 200,
    },
    {
      title: '产品内部料号',
      field: 'innerMaterialNumber',
      width: 200,
    },
    {
      title: '特殊备注',
      field: 'engineeringRemarks',
      width: 200,
      showOverflow: 'ellipsis',
      slots: {
        default: 'engineeringRemarks',
      },
    },
    {
      title: '量试订单评审',
      field: 'pdReview',
      slots: {
        default: 'pdReview',
      },
      width: 120,
    },
    {
      title: '生产类型',
      field: 'productionType',
      i18nField: 'productionTypeDesc',
      width: 150,
      formatter: ({ cellValue }) => PRODUCTION_LIST.find(el => el.id == cellValue)?.fullName,
    },
    {
      title: '状态',
      field: 'status',
      width: 140,
      i18nField: 'CommonCol.status',
      cellRender: {
        name: 'Tag',
        options: STATUS_OPTIONS,
      },
    },
    {
      title: '当前处理人',
      i18nField: 'CommonCol.currentNodeUser',
      field: 'currentProcessor',
      width: 220,
    },
    // diecuttingPlanRemark
    {
      title: '交付计划',
      field: 'diecuttingPlanRemark',
      // i18nField: 'diecuttingPlanRemark',
      width: 150,
    },
    // {
    //   title: '备注',
    //   field: 'deliveryPlanRemark',
    //   width: 150,
    // },
    {
      title: '备注(模切计划)',
      field: 'diecuttingRemark',
      width: 150,
    },
    {
      title: '备注(交货计划)',
      field: 'deliveryPlanRemark',
      width: 150,
    },
    {
      title: '需求备注',
      field: 'PDTLeaderReview',
      width: 150,
      formatter: ({ row }) => getNodeRemarkValue(row, 'PDTLeaderReview'),
    },
    {
      title: '客户要求交期',
      field: 'customerDeliveryTime',
      i18nField: 'customerDeliveryDateTime',
      width: 130,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
    {
      title: '预估材料交期',
      field: 'estimatedMaterialsTime',
      i18nField: 'estimatedMaterialsDateTime',
      width: 130,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
    {
      title: '备注(材料交期)',
      field: 'mcRemark',
      width: 130,
    },
    {
      title: '需求数量(PCS)',
      field: 'peakQty',
      width: 160,
    },
    {
      title: '排产数量(PCS)',
      field: 'demandQty',
      width: 160,
    },
    {
      title: 'PD',
      field: 'pdName',
      i18nField: 'pd',
      width: 180,
    },
    { title: '需求类型', field: 'demandType', width: 180, i18nField: 'CommonCol.demandType' },
    {
      title: '当前节点',
      i18nField: 'CommonCol.currentNode',
      field: 'currentNodeName',
      width: 160,
    },
    {
      title: '节点记录',
      i18nField: 'CommonCol.nodeDetail',
      field: 'nodeDetail',
      width: 120,
      slots: {
        default: 'nodeDetail',
      },
    },
    {
      title: '直接客户料号',
      field: 'immediateCustomerPartNumber',
      width: 160,
    },
    {
      title: '终端客户料号',
      field: 'terminalCustomerPartNumber',
      width: 160,
    },
    {
      title: '终端项目阶段',
      field: 'projectPhase',
      width: 160,
    },
    {
      title: '工厂',
      field: 'factory',
      width: 160,
    },
    {
      title: '产品描述',
      field: 'productDesc',
      width: 160,
    },
    {
      title: '申请人',
      field: 'applyUserName',
      i18nField: 'CommonCol.applyUser',
      width: 220,
    },
    {
      title: '申请时间',
      field: 'applyDate',
      i18nField: 'CommonCol.applyTime',
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
      width: 220,
    },
    // 操作行
    {
      title: t('common.action'),
      width: 60,
      field: 'action',
      fixed: 'right',
      slots: {
        default: 'action',
      },
    },
  ];
}

export function getColumns(): BasicColumn[] {
  return [
    {
      title: '产品内部料号',
      dataIndex: 'innerMaterialNumber',
      editRow: false,
      width: 200,
    },
    {
      title: '需求数量(PCS)',
      dataIndex: 'peakQty',
      editRow: false,
      editDynamicDisabled: false,
      width: 120,
    },
  ];
}

export function getSubColumns(): BasicColumn[] {
  return [
    {
      title: '产品内部料号',
      dataIndex: 'innerMaterialNumber',
      width: 180,
    },
    {
      title: '半成品料号',
      dataIndex: 'semiFinishedProductsPart',
      width: 120,
    },
    {
      title: '工序代码',
      dataIndex: 'processCode',
      width: 180,
    },
    {
      title: '工序名称',
      dataIndex: 'processName',
      width: 200,
    },
    {
      title: '调机时间(H)',
      dataIndex: 'lineAdjustmentTime',
      width: 100,
    },
    {
      title: '不良率(%)',
      dataIndex: 'defectiveRate',
      width: 100,
      format: text => {
        return (text || 0) + '%';
      },
    },
    {
      title: '产能',
      dataIndex: 'capacity',
      width: 120,
    },
  ];
}

export const baseFormConfig: any = [
  {
    label: '单号',
    field: 'applyNo',
    component: 'Input',
    componentProps: {
      placeholder: '单号',
      disabled: true,
    },
  },
  {
    label: '工厂',
    field: 'factory',
    component: 'Input',
    componentProps: {
      placeholder: '工厂',
      disabled: true,
    },
  },
  {
    label: '产品内部料号',
    field: 'innerMaterialNumber',
    component: 'Input',
    componentProps: {
      placeholder: '产品内部料号',
      disabled: true,
    },
  },
  {
    label: '排产数量(PCS)',
    field: 'demandQty',
    component: 'Input',
    componentProps: {
      placeholder: '排产数量',
      disabled: true,
    },
  },
  {
    label: '产品描述',
    field: 'productDesc',
    component: 'Input',
    componentProps: {
      placeholder: '产品描述',
      disabled: true,
    },
  },
  {
    label: '直接客户料号',
    field: 'immediateCustomerPartNumber',
    component: 'Input',
    componentProps: {
      placeholder: '直接客户料号',
      disabled: true,
    },
  },
  {
    label: '终端客户料号',
    field: 'terminalCustomerPartNumber',
    component: 'Input',
    componentProps: {
      placeholder: '终端客户料号',
      disabled: true,
    },
  },
];

// 设置d动态表单字段信息
export function setDynamicFields(
  sourceList,
  ops?: {
    editable?: boolean;
    planType: '1' | '2';
    dynamicPrefix: string;
  },
) {
  let _list: any = [];
  if (ops?.planType == '1') {
    _list = [
      ...baseFormConfig,
      {
        label: '交付计划',
        field: 'diecuttingPlanRemark',
        component: 'Input',
      },
      {
        label: '备注',
        field: 'remark',
        i18nField: 'CommonCol.remark',
        component: 'Input',
      },
    ];
  } else {
    _list = (sourceList || []).map(item => {
      const _time = dayjs(item.deliveryPlanTime).format('YYYY/MM/DD');
      const _item: any = {
        label: _time + ' (PCS)',
        field: ops?.dynamicPrefix + _time,
        component: 'InputNumber',
        i18nField: 'DISABLED',
      };
      // 编辑模式下，对人员变动二次处理
      if (ops?.editable) {
        _item.editRow = true;
      }
      return _item;
    });
    _list = [
      ...baseFormConfig,
      {
        label: '交付合计(PCS)',
        field: 'deliveryPlanQty',
        component: 'Input',
      },
      {
        label: '交付计划',
        field: 'deliveryPlan',
        i18nField: 'diecuttingPlanRemark',
        component: 'Input',
      },
      {
        label: '备注(模切计划)',
        field: 'deliveryPlanRemark',
        i18nField: 'CommonCol.remark',
        component: 'Input',
      },
      ..._list,
      // {
      //   label: '备注',
      //   field: 'deliveryPlanRemark',
      //   i18nField: 'CommonCol.remark',
      //   component: 'Input',
      // },
    ];
  }

  return _list;
}
