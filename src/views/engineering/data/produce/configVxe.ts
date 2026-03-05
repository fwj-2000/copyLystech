import { STATUS_OPTIONS } from '/@/components/CustomComponents/src/quality/Constant';

export function getUnReviewColumns() {
  return [
    {
      field: 'checkbox',
      type: 'checkbox',
      width: 50,
    },
    {
      title: '单号',
      field: 'applyNo',
      width: 120,
    },
    {
      title: '产品内部料号',
      field: 'innerMaterialNumber',
      width: 180,
    },
    {
      title: '旧版成品编码',
      field: 'insidePartNumberOld',
      width: 160,
    },
    {
      title: '状态',
      field: 'status',
      width: 100,
      cellRender: {
        name: 'Tag',
        options: STATUS_OPTIONS,
      },
    },
    {
      title: '当前节点',
      field: 'currentNodeName',
      width: 160,
    },
    {
      title: '当前处理人',
      field: 'currentProcessor',
      width: 220,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
    },
    {
      title: '节点记录',
      field: 'nodeDetail',
      width: 120,
      slots: {
        default: 'nodeDetail',
      },
    },
    {
      title: '直接客户名称',
      field: 'immediateCustomerName',
      width: 140,
    },
    {
      title: '工厂',
      field: 'factory',
      width: 160,
    },
    {
      title: 'PD',
      field: 'pdName',
      width: 180,
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
      title: '客户项目阶段',
      field: 'projectPhase',
      width: 160,
    },
    {
      title: '需求数量(PCS)',
      field: 'peakQty',
      width: 160,
    },
    {
      title: '备注',
      field: 'nodeRemark',
      i18nField: 'CommonCol.remark',
      width: 150,
      cellRender: {
        name: 'Remark',
        nodeCode: 'PDTLeaderReview',
      },
    },
    {
      title: '申请人',
      field: 'applyUserName',
      width: 220,
    },
    {
      title: '申请时间',
      field: 'applyDate',
      cellRender: {
        name: 'Date',
      },
    },
    {
      title: '操作',
      field: 'action',
      width: 80,
      fixed: 'right',
      slots: {
        default: 'action',
      },
    },
  ];
}

export function getUnReviewFormSchema() {
  return [
    {
      label: '',
      fieldName: 'applyNo',
      component: 'Input',
      componentProps: {
        placeholder: '单号',
      },
    },
    {
      label: '',
      fieldName: 'innerMaterialNumber',
      component: 'Input',
      componentProps: {
        placeholder: '产品内部料号',
      },
    },
    {
      label: '',
      fieldName: 'insidePartNumberOld',
      component: 'Input',
      componentProps: {
        placeholder: '旧版成品编码',
      },
    },
    {
      label: '',
      fieldName: 'terminalCustomerPartNumber',
      component: 'Input',
      componentProps: {
        placeholder: '终端客户料号',
      },
    },
    // {
    //   label: '',
    //   fieldName: 'factory',
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: '工厂',
    //   },
    // },
    {
      label: '',
      fieldName: 'insideProjectCode',
      component: 'Input',
      componentProps: {
        placeholder: '内部项目代码',
      },
    },
  ];
}
