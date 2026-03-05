import { BasicColumn, FormProps, FormSchema } from '/@/components/Table';
import { STATUS_OPTIONS } from '/@/components/CustomComponents/src/quality/Constant';
import dayjs from 'dayjs';

export function getColumnsTodo(): BasicColumn[] {
  return [
    {
      title: '量试需求单号',
      dataIndex: 'applyNo',
      width: 200,
    },
    {
      title: '产品内部料号',
      dataIndex: 'innerMaterialNumber',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      format: 'tag|' + JSON.stringify(STATUS_OPTIONS),
    },
    {
      title: '当前节点',
      dataIndex: 'currentNode',
      width: 160,
    },
    {
      title: '当前处理人',
      dataIndex: 'currentProcessor',
      width: 220,
    },
    {
      title: '节点记录',
      dataIndex: 'nodeDetail',
      width: 120,
    },
    {
      title: '量试数量(PCS)',
      dataIndex: 'peakQty',
      width: 160,
    },
    {
      title: '排产数量(PCS)',
      dataIndex: 'peakQty',
      width: 160,
    },
    {
      title: '客户要求交期',
      dataIndex: 'customerDeliveryTime',
      width: 120,
      format: 'date|YYYY-MM-DD',
    },
    {
      title: '预估材料交期',
      dataIndex: 'estimatedMaterialsTime',
      width: 120,
      format: 'date|YYYY-MM-DD',
    },
    {
      title: '备注(材料交期)',
      dataIndex: 'mcRemark',
      width: 120,
    },
    {
      title: 'PD',
      dataIndex: 'pdName',
      width: 180,
    },
    {
      title: '直接客户料号',
      dataIndex: 'immediateCustomerPartNumber',
      width: 160,
    },
    {
      title: '终端客户料号',
      dataIndex: 'terminalCustomerPartNumber',
      width: 160,
    },
    {
      title: '终端项目阶段',
      dataIndex: 'projectPhase',
      width: 160,
    },
    {
      title: '工厂',
      dataIndex: 'factory',
      width: 160,
    },
    {
      title: '申请人',
      dataIndex: 'applyUserName',
      width: 220,
    },
    {
      title: '申请时间',
      dataIndex: 'applyDate',
      format: 'date|YYYY-MM-DD',
    },
  ];
}

export function getFormConfigTodo(): Partial<FormProps> {
  return {
    baseColProps: {
      span: 4,
    },
    schemas: [
      {
        label: '',
        field: 'applyNo',
        component: 'Input',
        componentProps: {
          placeholder: '量试需求单号',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        field: 'innerMaterialNumber',
        component: 'Input',
        componentProps: {
          placeholder: '产品内部料号',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        field: 'terminalCustomerPartNumber',
        component: 'Input',
        componentProps: {
          placeholder: '终端客户料号',
          submitOnPressEnter: true,
        },
      },
    ],
  };
}

export function getColumns(): BasicColumn[] {
  return [
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      format: 'tag|' + JSON.stringify(STATUS_OPTIONS),
    },
    {
      title: '销售意见',
      dataIndex: 'pmDesc',
      width: 100,
    },
    {
      title: '产品内部料号',
      dataIndex: 'innerMaterialNumber',
      editRow: false,
      width: 200,
    },
    {
      title: '量试数量(PCS)',
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
      title: '速度',
      dataIndex: 'speed',
      width: 120,
    },
    {
      title: '单位',
      dataIndex: 'speedUnit',
      width: 200,
    },
    {
      title: '不良率(%)',
      dataIndex: 'defectiveRate',
      width: 100,
    },
    {
      title: '产能',
      dataIndex: 'capacity',
      width: 120,
    },
    {
      title: '单位',
      dataIndex: 'capacityUnit',
      width: 200,
    },
    {
      title: '主工序',
      dataIndex: 'processLevelDesc',
      width: 100,
    },
  ];
}

export const baseFormConfig: any = [
  {
    label: '产品内部料号：',
    field: 'InnerMaterialNumber',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '工厂：',
    field: 'Factory',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '出货备案法人：',
    field: 'SellCorporation',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '备案语言：',
    field: 'FilingsLanguageDesc',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '口岸：',
    field: 'Prot',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '出货方式：',
    field: 'ShipmentType',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: 'PD：',
    field: 'PDName',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '客服：',
    field: 'CustomersName',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '直接客户料号：',
    field: 'DirectCustomerMaterialNumber',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '终端客户料号：',
    field: 'TerminalCustomerMaterialNumber',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '直接客户名称：',
    field: 'DirectCustomerName',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  // {
  //   label: '量试需求单号',
  //   field: 'applyNo',
  //   component: 'Input',
  //   componentProps: {
  //     placeholder: '量试需求单号',
  //     disabled: true,
  //   },
  // },
  // {
  //   label: '排产数量',
  //   field: 'demandQty',
  //   component: 'Input',
  //   componentProps: {
  //     placeholder: '排产数量',
  //     disabled: true,
  //   },
  // },
  // {
  //   label: '产品描述',
  //   field: 'productDesc',
  //   component: 'Input',
  //   componentProps: {
  //     placeholder: '产品描述',
  //     disabled: true,
  //   },
  // },
  // {
  //   label: '预估材料交期',
  //   field: 'estimatedMaterialsTime',
  //   component: 'DatePicker',
  //   componentProps: {
  //     placeholder: '预估材料交期',
  //     disabled: true,
  //   },
  // },
  // {
  //   label: '备注(材料交期)',
  //   field: 'mcRemark',
  //   component: 'Input',
  //   componentProps: {
  //     placeholder: '备注(材料交期)',
  //     disabled: true,
  //   },
  // },
];

export const outboundFormConfig: any = [
  {
    label: '产品内部料号：',
    field: 'InnerMaterialNumber',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '工厂：',
    field: 'Factory',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '出货备案法人：',
    field: 'SellCorporation',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '备案语言：',
    field: 'FilingsLanguageDesc',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '口岸：',
    field: 'Prot',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '出货方式：',
    field: 'ShipmentType',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: 'PD：',
    field: 'PDName',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '客服：',
    field: 'CustomersName',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '直接客户料号：',
    field: 'DirectCustomerMaterialNumber',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '终端客户料号：',
    field: 'TerminalCustomerMaterialNumber',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '直接客户名称：',
    field: 'DirectCustomerName',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  // {
  //   label: '量试需求单号',
  //   field: 'applyNo',
  //   component: 'Input',
  //   componentProps: {
  //     placeholder: '量试需求单号',
  //     disabled: true,
  //   },
  // },
  // {
  //   label: '排产数量',
  //   field: 'demandQty',
  //   component: 'Input',
  //   componentProps: {
  //     placeholder: '排产数量',
  //     disabled: true,
  //   },
  // },
  // {
  //   label: '产品描述',
  //   field: 'productDesc',
  //   component: 'Input',
  //   componentProps: {
  //     placeholder: '产品描述',
  //     disabled: true,
  //   },
  // },
  // {
  //   label: '预估材料交期',
  //   field: 'estimatedMaterialsTime',
  //   component: 'DatePicker',
  //   componentProps: {
  //     placeholder: '预估材料交期',
  //     disabled: true,
  //   },
  // },
  // {
  //   label: '备注(材料交期)',
  //   field: 'mcRemark',
  //   component: 'Input',
  //   componentProps: {
  //     placeholder: '备注(材料交期)',
  //     disabled: true,
  //   },
  // },
];
// 设置动态表头相关信息
export function setDynamicTitle(
  sourceList,
  ops?: {
    editable?: boolean;
    planType: '1' | '2';
    dynamicPrefix: string;
  },
) {
  const dynamicKeys = {}; // 配置字段
  let _list: any = [];
  if (ops?.planType == '1') {
    _list = [
      ...getColumns(),
      {
        title: '交付计划',
        dataIndex: 'diecuttingPlanRemark',
        width: 220,
        editRow: true,
      },
    ];
  } else {
    _list = (sourceList || []).map(item => {
      const _time = dayjs(item.deliveryPlanTime).format('YYYY/MM/DD');
      dynamicKeys[ops?.dynamicPrefix + _time] = '';
      const _item: any = {
        title: _time,
        dataIndex: ops?.dynamicPrefix + _time,
        editComponent: 'InputNumber',
        editComponentProps: {
          allowClear: true,
          min: 0,
        },
      };
      // 编辑模式下，对人员变动二次处理
      if (ops && ops.editable) {
        _item.editRow = true;
      }
      return _item;
    });
    _list = [
      ...getColumns(),
      {
        title: '交付合计(PCS)',
        dataIndex: 'deliveryPlanQty',
        width: 140,
      },
      {
        title: '交付计划',
        dataIndex: 'diecuttingPlanRemark',
      },
      ..._list,
    ];
  }

  _list.push({
    title: '备注',
    dataIndex: 'deliveryPlanRemark',
    editRow: true,
    editComponent: 'Input',
    width: 140,
  });

  return {
    dynamicKeys,
    column: _list,
  };
}

export function getColumns1(): BasicColumn[] {
  return [
    {
      title: '是否同意',
      dataIndex: 'handleStatus',
      editRow: true,
      width: 180,
      format: 'tag|' + JSON.stringify('status'),
      editComponent: 'Select',
      editComponentProps: {
        options: status,
        fieldNames: {
          value: 'id',
          label: 'fullName',
        },
      },
    },
    {
      title: '处理意见',
      dataIndex: 'handleOpinion',
      editRow: true,
      width: 180,
      editComponent: 'Input',
    },
    {
      title: '产品内部料号',
      dataIndex: 'innerMaterialNumber',
      width: 200,
    },
    {
      title: '量试数量(PCS)',
      dataIndex: 'peakQty',
      width: 120,
    },
    {
      title: '交付合计(PCS)',
      dataIndex: 'deliveryPlanQty',
      width: 140,
    },
  ];
}
