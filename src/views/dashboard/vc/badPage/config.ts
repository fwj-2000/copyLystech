// import { IS_ENABLE_LIST, IS_YSE_LIST } from '/@/components/CustomComponents/src/Constant';

export const formSchema = [
  {
    label: '',
    fieldName: 'project',
    component: 'Input',
    componentProps: {
      placeholder: '项目',
    },
  },
  {
    label: '',
    fieldName: 'badItem',
    component: 'Input',
    componentProps: {
      placeholder: '不良项',
    },
  },
];

export const columnsVxe = [
  { field: 'checkbox', width: 50, type: 'checkbox' },
  {
    field: 'Project',
    title: '项目',
    width: 100,
  },
  {
    field: 'BadItem',
    title: '不良项',

    width: 100,
  },

  {
    field: 'CreatorUserId',
    title: '创建人',

    width: 100,
  },
  {
    field: 'CreatorTime',
    title: '创建时间',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm',
    },

    width: 120,
  },

  {
    field: 'LastModifyUserId',
    title: '修改人',

    width: 100,
  },
  {
    field: 'LastModifyTime',
    title: '修改时间',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm',
    },

    width: 120,
  },

  {
    title: '操作',
    field: 'action',
    width: 80,
    fixed: 'right',
    slots: { default: 'action' },
  },
];
export const uploadButtonList = [
  {
    api: '/api/report/heatdissi/importBad',
    buttonText: '导入',
  },
];
