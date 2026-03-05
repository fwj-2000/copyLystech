import { commonMiniTextOption, commonTextOption, commonDateTimeOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { TFormItemOption, EFormItemType } from '/@/views/dataAnalysis/components/BaseSearchForm/types';

import { commonOrgCodeSelectFormOptions } from '/@/views/dataAnalysis/warehouseKanban/config';
export const formOptions: TFormItemOption[] = [
  commonOrgCodeSelectFormOptions,
  // {
  //   type: EFormItemType.INPUT,
  //   default: '',
  //   label: '',
  //   attrs: {
  //     placeholder: '请输入工厂',
  //   },
  //   key: 'factory',
  // },
  // {
  //   type: EFormItemType.INPUT,
  //   default: '',
  //   label: '',
  //   attrs: {
  //     placeholder: '请输入库存地点',
  //   },
  //   key: 'lgort',
  // },
  // {
  //   type: EFormItemType.INPUT,
  //   default: '',
  //   label: '',
  //   attrs: {
  //     placeholder: '请输入库存地点描述',
  //   },
  //   key: 'lgobe',
  // },
];

export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    { type: 'checkbox', width: 60 },

    {
      ...commonTextOption,
      title: '厂区',
      field: 'factory',
    },
    {
      ...commonTextOption,
      title: '标准天数',
      field: 'days',
    },
    {
      ...commonMiniTextOption,
      width: 180,
      title: '创建人',
      field: 'creatorUserId',
    },
    {
      ...commonDateTimeOption,
      title: '创建时间',
      field: 'creatorTime',
    },
  ];
  return columns;
};
export const columnsAdd = [
  { field: 'files', title: '图片', slots: { default: 'files' } },
  {
    title: '问题描述',
    field: 'problemDesc',
    editRender: {
      name: 'Input',
      props: {
        type: 'textarea',
        rows: 2,
      },
    },
  },
  {
    title: '责任人',
    field: 'dutyUserId',
    editRender: {
      name: 'CustomUserSelect',
    },
  },
  {
    title: '项目',
    field: 'projectUserId',
    editRender: {
      name: 'CustomUserSelect',
    },
  },
  {
    title: '发生日期',
    field: 'occurDate',
    editRender: {
      name: 'DatePicker',
      props: {
        valueFormat: 'YYYY-MM-DD',
      },
    },
  },
  {
    title: '计划日期',
    field: 'planDate',
    editRender: {
      name: 'DatePicker',
      props: {
        valueFormat: 'YYYY-MM-DD',
      },
    },
  },

  {
    title: '备注',
    field: 'remarks',
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '操作',
    field: 'action',
    fixed: 'right',
    width: 120,
    slots: { default: 'action' },
  },
];
