import { IS_ENABLE_LIST, IS_YSE_LIST } from '/@/components/CustomComponents/src/Constant';

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
    fieldName: 'isStat',
    component: 'Select',
    componentProps: {
      placeholder: '是否纳入统计',
      options: [
        { label: '是', value: '1' },
        { label: '否', value: '2' },
      ],
      allowClear: true,
    },
  },
];

export const columnsVxe = [
  {
    field: 'project',
    title: '项目',

    width: 80,
  },
  {
    field: 'targetYieldRate',
    title: '目标良率',
    width: 80,
    formatter: ({ cellValue }) => (cellValue ? `${cellValue}%` : ''), //0也不看
  },
  {
    field: 'isStat',
    title: '是否纳入统计',
    cellRender: {
      name: 'Tag',
      options: IS_YSE_LIST,
    },
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'VxeSelect',
    //   options: IS_YSE_LIST,
    // },
    width: 120,
  },
  {
    field: 'creatorUserId',
    title: '修改人',

    width: 100,
  },
  {
    field: 'creatorTime',
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
