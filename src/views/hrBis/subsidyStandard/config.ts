import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
import { IS_YSE_LIST } from '../config';
// 表单配置
export const getHrTrainFormConfig = () => {
  return [
    {
      fieldName: 'position',
      label: '',
      labelWidth: 100,
      component: 'Input',
      componentProps: {
        allowClear: true,
      },
    },
  ];
};

export const getHrTrainPageColumns = () => {
  const column = [
    { type: 'checkbox', field: 'checkbox', width: 50 },
    {
      field: 'CreatorUserId',
      title: '创建人姓名',
    },
    {
      field: 'CreatorTime',
      title: '创建时间',
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      field: 'Position',
      title: '岗位',
    },
    {
      field: 'Standard',
      title: '补贴标准',
      editRender: {
        name: 'Input',
      },
    },
    {
      field: 'SpecialWorkShopStr',
      title: '是否特殊车间',
      editRender: {
        name: 'ASelect',
        props: {
          options: IS_YSE_LIST,
          onChange: (_value: string, option: any, { row }) => {
            row.SpecialWorkShop = option.value * 1;
          },
        },
      },
    },
  ];

  return column;
};
export const uploadButtonList = [
  {
    api: '/api/report/netroomsubsidy/importStandard',
    buttonText: t('common.importText'),
    type: 'default',
  },
];
