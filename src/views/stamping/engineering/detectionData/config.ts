import { getAllProduct } from '/@/api/engineering/detectionData';
export function getDDSchema() {
  return [
    {
      fieldName: 'productCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '产品内部料号',
      },
    },
    // {
    //   fieldName: 'operation',
    //   label: '',
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: '调试内容',
    //   },
    // },
    // {
    //   fieldName: 'time',
    //   label: '',
    //   component: 'RangePicker',
    //   componentProps: {
    //     // placeholder: '备注',
    //   },
    // },
  ];
}

export function getSchema(state) {
  return [
    {
      fieldName: 'productId',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        style: 'width: 100%',
        placeholder: '产品内部料号',
        api: getAllProduct,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'productCode',
        },
        nameFormat: ['productCode', '（', 'version', '）'],
        valueField: 'id',
        resultField: 'data.list',
        filterOption: false,
        onChange: (_, data) => {
          state.tempProductCode = data.productCode;
        },
      },
    },
    {
      fieldName: 'worningThreshold',
      label: '',
      component: 'InputNumber',
      // defaultValue: 5.0,
      componentProps: {
        placeholder: '实测数据偏差告警阈值',
        formatter: value => (value ? `${value}%` : null),
        parser: value => value.replace('%', ''),
        precision: 2,
        step: 0.01,
      },
    },
    {
      fieldName: 'operation',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '调试内容',
      },
    },
    {
      fieldName: 'time',
      label: '',
      component: 'RangePicker',
      componentProps: {},
    },
  ];
}

export function getImportColumns() {
  return [
    {
      title: '产品内部料号',
      field: 'productCode',
      width: 180,
    },
    {
      title: 'FAI',
      field: 'faiNo',
      width: 180,
    },
    {
      title: 'spc',
      field: 'spc',
      width: 120,
    },
    {
      title: 'DETAIL',
      field: 'detail',
      width: 120,
    },
    {
      title: 'DIMENSION',
      field: 'dimension',
      width: 120,
    },
    {
      title: 'TOLERANCE+',
      field: 'tolPlus',
      width: 120,
    },
    {
      title: 'TOLERANCE-',
      field: 'tolMinus',
      width: 120,
    },
    {
      title: 'INSTRUMENT',
      field: 'instrumentName',
      width: 120,
    },
    {
      title: 'RESOLUTION',
      field: 'resolution',
      width: 120,
    },
    {
      title: 'USL',
      field: 'usl',
      width: 120,
    },
    {
      title: 'LSL',
      field: 'lsl',
      width: 120,
    },
    // {
    //   title: '备注',
    //   field: 'remark',
    //   width: 120,
    // },
    {
      title: '是否启用',
      field: 'isEnabled',
      width: 120,
    },
    {
      title: '创建人',
      field: 'creatorUserName',
      width: 120,
    },
    {
      title: '创建时间',
      field: 'creatorTime',
      width: 120,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
    {
      title: '备注',
      field: 'remark',
      width: 120,
    },
    // {
    //   field: 'action',
    //   slots: { default: 'action' },
    //   width: 60,
    //   title: '操作',
    //   fixed: 'right',
    // },
  ];
}

export function getColumns() {
  return [
    { type: 'checkbox', field: 'checkbox', width: 50 },
    {
      title: 'FAI',
      field: 'faiNo',
      width: 110,
    },
    // {
    //   title: 'spc',
    //   field: 'spc',
    //   width: 110,
    // },
    {
      title: 'DETAIL',
      field: 'detail',
      width: 110,
    },
    {
      title: 'DIMENSION',
      field: 'dimension',
      width: 110,
    },
    {
      title: 'TOLERANCE+',
      field: 'tolPlus',
      width: 110,
    },
    {
      title: 'TOLERANCE-',
      field: 'tolMinus',
      width: 110,
    },
    {
      title: 'INSTRUMENT',
      field: 'instrumentName',
      width: 110,
    },
    {
      title: 'RESOLUTION',
      field: 'resolution',
      width: 110,
    },
    {
      title: 'USL',
      field: 'usl',
      width: 110,
    },
    {
      title: 'LSL',
      field: 'lsl',
      width: 110,
    },
    // {
    //   title: '是否启用',
    //   field: 'isEnabled',
    //   width: 120,
    // },
    {
      title: '创建人',
      field: 'creatorUserName',
      width: 120,
    },
    {
      title: '创建时间',
      field: 'creatorTime',
      width: 120,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
  ];
}

export function getEditSchema() {
  return [
    {
      fieldName: 'productCode',
      label: '产品内部料号',
      component: 'Input',
      className: 'required',
      componentProps: {
        placeholder: '产品内部料号',
      },
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: {
        placeholder: '备注',
      },
    },
    {
      fieldName: 'organizationName',
      label: '组织名称',
      component: 'Input',
      className: 'required',
      componentProps: {
        placeholder: '组织名称',
        disabled: true,
      },
    },
    {
      fieldName: 'userAccount',
      label: '创建人',
      component: 'Input',
      componentProps: {
        placeholder: '创建人',
        disabled: true,
      },
    },
  ];
}

export function getEditColumns() {
  return [
    {
      title: 'FAI',
      field: 'faiNo',
      width: 180,
      editRender: {
        name: 'Input',
        props: {
          placeholder: 'FAI',
        },
      },
    },
    {
      title: 'SPC',
      field: 'spc',
      width: 180,
      editRender: {
        name: 'Input',
        props: {
          placeholder: 'SPC',
        },
      },
    },
    {
      title: 'DETAIL',
      field: 'detail',
      width: 180,
      editRender: {
        name: 'Input',
        props: {
          placeholder: 'DETAIL',
        },
      },
    },
    {
      title: 'DIMENSION',
      field: 'dimension',
      width: 180,
      editRender: {
        name: 'Input',
        props: {
          placeholder: 'DIMENSION',
        },
      },
    },
    {
      title: 'TOLERANCE+',
      field: 'tolPlus',
      width: 180,
      editRender: {
        name: 'Input',
        props: {
          placeholder: 'TOLERANCE+',
        },
      },
    },
    {
      title: 'TOLERANCE-',
      field: 'tolMinus',
      width: 180,
      editRender: {
        name: 'Input',
        props: {
          placeholder: 'TOLERANCE-',
        },
      },
    },
    {
      title: 'INSTRUMENT',
      field: 'instrumentName',
      width: 180,
      editRender: {
        name: 'Input',
        props: {
          placeholder: 'INSTRUMENT',
        },
      },
    },
    {
      title: 'RESOLUTION',
      field: 'resolution',
      width: 180,
      editRender: {
        name: 'Input',
        props: {
          placeholder: 'RESOLUTION',
        },
      },
    },
    {
      title: 'USL',
      field: 'usl',
      width: 180,
      editRender: {
        name: 'Input',
        props: {
          placeholder: 'USL',
        },
      },
    },
    {
      title: 'LSL',
      field: 'lsl',
      width: 180,
      editRender: {
        name: 'Input',
        props: {
          placeholder: 'LSL',
        },
      },
    },
    {
      title: '状态',
      field: 'isEnabled',
      width: 180,
      editRender: {
        name: 'ASelect',
        props: {
          options: [
            { label: '启用', value: '1' },
            { label: '禁用', value: '0' },
          ],
        },
      },
    },
    {
      field: 'action',
      slots: { default: 'action' },
      width: 100,
      title: '操作',
      fixed: 'right',
    },
  ];
}
