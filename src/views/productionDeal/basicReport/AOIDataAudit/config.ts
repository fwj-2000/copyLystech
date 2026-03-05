// 主页form配置
export function getFormSchema() {
  return [
    {
      fieldName: 'documentNumber',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '单据号',
      },
    },
    {
      fieldName: 'currentProcessorId',
      label: '',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: '当前处理人',
      },
    },
  ];
}

export const columns = [
  { field: 'checkbox', width: 50, type: 'checkbox' },
  {
    title: '单据号',
    field: 'documentNumber',
    width: 180,
  },
  {
    title: '状态',
    field: 'status',
    width: 120,
    cellRender: {
      name: 'Tag',
      options: [
        { id: 1, fullName: '待提交', theme: 'gray', rowKey: 'statusDesc' },
        { id: 2, fullName: '审核中', theme: 'blue', rowKey: 'statusDesc' },
        { id: 3, fullName: '审核失败', theme: 'red', rowKey: 'statusDesc' },
        { id: 4, fullName: '待发送', theme: 'gray', rowKey: 'statusDesc' },
        { id: 5, fullName: '发送中', theme: 'blue', rowKey: 'statusDesc' },
        { id: 6, fullName: '发送失败', theme: 'red', rowKey: 'statusDesc' },
        { id: 7, fullName: '发送成功', theme: 'green', rowKey: 'statusDesc' },
      ],
    },
  },
  {
    title: '当前处理人',
    field: 'currentProcessorName',
    // width: 160,
  },
  {
    title: '节点记录',
    field: 'nodeDetail',
    width: 160,
    slots: {
      default: 'nodeDetail',
    },
  },
  {
    title: '总数量',
    field: 'totalCount',
    width: 120,
  },
  //
  {
    title: '当前审批节点',
    field: 'currentProcessorNode',
    // width: 160,
  },
  {
    title: '良率',
    field: 'yieldRate',
    width: 120,
  },
  {
    title: 'OK数量',
    field: 'okCount',
    width: 120,
  },
  {
    title: 'NG数量',
    field: 'ngCount',
    width: 120,
  },
  {
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: '60',
    fixed: 'right',
  },
];
