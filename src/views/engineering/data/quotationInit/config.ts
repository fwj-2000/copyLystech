import { getNodeRemark } from '/@/adapter/utils';
import { BasicColumn, FormProps } from '/@/components/Table';
import { STATUS_OPTIONS } from '/@/utils/status/index';

export function getDoneColumns(): BasicColumn[] {
  return [
    {
      title: '单号',
      dataIndex: 'qrApplyCode',
      sorter: true,
      width: 150,
    },
    {
      title: '产品内部料号',
      dataIndex: 'insidePartNumber',
      sorter: true,
      width: 220,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 150,
      format: 'tag|' + JSON.stringify(STATUS_OPTIONS),
    },
    {
      title: '终端项目代码',
      dataIndex: 'terminalCustomerProjectCode',
      sorter: true,
      width: 150,
    },
    {
      title: '终端客户信息',
      dataIndex: 'terminalCustomerCode',
      sorter: true,
      width: 150,
      customRender: ({ record }) => {
        // return record.terminalCustomerCode + '|' + ;
        return `${record.terminalCustomerName || ''}(${record.terminalCustomerCode})`;
      },
    },
    {
      title: '工厂',
      dataIndex: 'factory',
      sorter: true,
      width: 150,
    },
    {
      title: '产品描述',
      dataIndex: 'productDesc',
      sorter: true,
      width: 150,
    },
    {
      title: '报价用途',
      dataIndex: 'purpose',
      sorter: true,
      width: 150,
    },
    {
      title: '当前处理人',
      dataIndex: 'handlerName',
      width: 220,
    },
    {
      title: '当前节点',
      dataIndex: 'currentNodeName',
      width: 220,
    },
    {
      title: '节点记录',
      dataIndex: 'nodeDetail',
      width: 220,
    },
    {
      title: '备注',
      dataIndex: 'nodeRemark',
      i18nField: 'CommonCol.remark',
      width: 150,
      format: (value, record) => {
        return getNodeRemark(value, 'PDTLeaderReview');
      },
      // cellRender: {
      //   name: 'Remark',
      //   nodeCode: 'PDTLeaderReview',
      // },
    },
    {
      title: '申请人',
      dataIndex: 'qrApplyUserName',
      sorter: true,
      width: 150,
    },
    {
      title: '报价工程',
      dataIndex: 'quotationEngineerName',
      // customRender: ({ record }) => {
      //   return record.members?.find(item => item?.configType === 'PDPerson')?.memberName;
      // },
      sorter: true,
      width: 210,
    },
  ];
}

export function getFormConfig(): Partial<FormProps> {
  return {
    schemas: [
      {
        field: 'qrApplyCode',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '报价需求单号',
        },
      },
      {
        field: 'insidePartNumber',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '产品内部料号',
        },
      },
      {
        field: 'qrApplyUserName',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '申请人',
        },
      },
      {
        field: 'quotationEngineerName',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '工程报价',
        },
      },
    ],
    i18nConfig: {
      moduleCode: 'QuotationColumn',
      transferRange: ['placeholder'],
    },
  };
}

export function getUndoColumns(): BasicColumn[] {
  return [
    {
      title: '单号',
      dataIndex: 'qrApplyCode',
      sorter: true,
      width: 150,
    },
    {
      title: '产品内部料号',
      dataIndex: 'insidePartNumber',
      sorter: true,
      width: 220,
    },
    {
      title: '终端项目代码',
      dataIndex: 'terminalCustomerProjectCode',
      sorter: true,
      width: 150,
    },
    {
      title: '终端客户信息',
      dataIndex: 'terminalCustomerCode',
      sorter: true,
      width: 150,
      customRender: ({ record }) => {
        return `${record.terminalCustomerName || ''}(${record.terminalCustomerCode})`;
      },
    },
    {
      title: '工厂',
      dataIndex: 'factory',
      sorter: true,
      width: 150,
    },
    {
      title: '产品描述',
      dataIndex: 'productDesc',
      sorter: true,
      width: 150,
    },
    {
      title: '报价用途',
      dataIndex: 'purpose',
      sorter: true,
      width: 150,
    },
    // {
    //   title: '当前处理人',
    //   dataIndex: 'handlerName',
    //   width: 220,
    // },
    // {
    //   title: "当前节点",
    //   dataIndex: "currentNodeName",
    //   width: 220
    // },
    // {
    //   title: "节点记录",
    //   dataIndex: "nodeDetail",
    //   width: 220
    // },
    {
      title: '申请人',
      dataIndex: 'qrApplyUserName',
      sorter: true,
      width: 150,
    },
    {
      title: '报价工程',
      dataIndex: 'quotationEngineerName',
      // customRender: ({ record }) => {
      //   return record.members?.find(item => item?.configType === 'PDPerson')?.memberName;
      // },
      sorter: true,
      width: 210,
    },
  ];
}
export function waitGetColumns(): BasicColumn[] {
  return [
    {
      title: '单号',
      dataIndex: 'qrApplyCode',
      sorter: true,
      width: 150,
    },
    {
      title: '产品内部料号',
      dataIndex: 'insidePartNumber',
      sorter: true,
      width: 220,
    },
    {
      title: '终端项目代码',
      dataIndex: 'terminalCustomerProjectCode',
      sorter: true,
      width: 150,
    },
    {
      title: '终端客户信息',
      dataIndex: 'terminalCustomerCode',
      sorter: true,
      width: 150,
      customRender: ({ record }) => {
        return `${record.terminalCustomerName || ''}(${record.terminalCustomerCode})`;
      },
    },
    {
      title: '工厂',
      dataIndex: 'factory',
      sorter: true,
      width: 150,
    },
    {
      title: '产品描述',
      dataIndex: 'productDesc',
      sorter: true,
      width: 150,
    },
    {
      title: '报价用途',
      dataIndex: 'purpose',
      sorter: true,
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      format: 'tag|' + JSON.stringify(STATUS_OPTIONS),
    },
    {
      title: '当前处理人',
      dataIndex: 'handlerName',
      width: 220,
    },
    {
      title: '当前节点',
      dataIndex: 'currentNodeName',
      width: 220,
    },
    {
      title: '节点记录',
      dataIndex: 'nodeDetail',
      width: 220,
    },
    {
      title: '申请人',
      dataIndex: 'qrApplyUserName',
      sorter: true,
      width: 150,
    },
    {
      title: '报价工程',
      dataIndex: 'quotationEngineerName',
      // customRender: ({ record }) => {
      //   return record.members?.find(item => item?.configType === 'PDPerson')?.memberName;
      // },
      sorter: true,
      width: 210,
    },
    {
      title: '备注',
      dataIndex: 'nodeRemark',
      i18nField: 'CommonCol.remark',
      width: 150,
      format: (value, record) => {
        return getNodeRemark(value, 'PDTLeaderReview');
      },
      // cellRender: {
      //   name: 'Remark',
      //   nodeCode: 'PDTLeaderReview',
      // },
    },
  ];
}
