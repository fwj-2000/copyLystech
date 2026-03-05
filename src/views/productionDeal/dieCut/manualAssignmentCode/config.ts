function getProductCode(a) {
  return new Promise((resolve, reject) => {
    const list = [
      { id: '880-TGW605-08-00', fullName: '880-TGW605-08-00' },
      { id: '880-TGW606-08-00', fullName: '880-TGW606-08-00' },
    ];

    // 根据 searchKey 匹配
    let result: any = [];
    if (a.searchKey) {
      result = list.filter(item => item.fullName.includes(a.searchKey));
    } else {
      result = list;
    }

    // 如果找不到返回空数组
    resolve({
      data: result,
    });
  });
}
// 主页form配置
export function getFormSchema() {
  return [
    {
      fieldName: 'productCode',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        api: getProductCode,
        placeholder: '产品',
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'searchKey',
        },
        memoInputVal: true,
        resultField: 'data',
        filterOption: true,
        notFoundContent: null,
        immediate: true,
        useChangeCopy: true,
        labelField: 'fullName',
        valueField: 'id',
      },
      required: true,
    },
    {
      fieldName: 'date',
      label: '',
      component: 'RangePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
      },
    },
    {
      fieldName: 'qty',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '数量',
        submitOnPressEnter: true,
      },
    },
    {
      fieldName: 'status',
      label: '',
      component: 'Select',
      componentProps: {
        placeholder: '打印状态',
        options: [
          { id: 0, fullName: '未打印' },
          { id: 1, fullName: '已打印' },
        ],
        fieldNames: { label: 'fullName', value: 'id' },
      },
    },
    {
      fieldName: 'mark',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '标记状态',
        submitOnPressEnter: true,
      },
    },
  ];
}
export function getFormSchemaMQ() {
  return [
    {
      fieldName: 'cuttingId',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '分切标签唯一码',
      },
    },
    {
      fieldName: 'date',
      label: '',
      component: 'RangePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
      },
    },
    {
      fieldName: 'productCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '产品编码',
        submitOnPressEnter: true,
      },
    },
  ];
}

export const columns = [
  {
    title: 'SN',
    field: 'sn',
  },
  {
    title: '产品',
    field: 'productCode',
  },
  {
    title: '日期',
    field: 'realTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  {
    title: '创建人',
    field: 'creatorUserName',
    width: 180,
  },
  {
    title: '创建时间',
    field: 'createTime',
    cellRender: {
      name: 'Date',
    },
  },
  {
    title: '打印状态',
    field: 'status',
    cellRender: {
      name: 'Tag',
      options: [
        {
          id: 0,
          fullName: '未打印',
          theme: 'red',
        },
        {
          id: 1,
          fullName: '已打印',
          theme: 'green',
        },
      ],
    },
  },
  {
    title: '标记状态',
    field: 'mark',
    minWidth: 70,
  },
];
export const columnsMQ = [
  {
    title: '分切标签ID',
    field: 'cuttingId',
  },
  {
    title: '模具层数',
    field: 'moldLayers',
  },
  {
    title: 'SN',
    field: 'serialNumber',
  },
  {
    title: '计数',
    field: 'qty',
    width: 180,
  },

  {
    title: '产品料号',
    field: 'productCode',
  },
  {
    title: '创建时间',
    field: 'createTime',
    cellRender: {
      name: 'Date',
    },
  },
];
