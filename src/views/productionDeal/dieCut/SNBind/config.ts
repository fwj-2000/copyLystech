import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
import { IS_YSE_LIST } from '/@/components/CustomComponents/src/Constant';

export const enableStatusOptions = IS_YSE_LIST;

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
      fieldName: 'snCodes',
      label: '',
      component: 'Textarea',
      componentProps: {
        placeholder: 'SN',
        rows: 1,
      },
      i18nField: 'snCode',
    },
    {
      fieldName: 'productCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '产品编码',
      },
    },
    {
      fieldName: 'lineName',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '线体',
      },
    },
    {
      fieldName: 'lsSeq',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '镭射序号',
      },
    },
    {
      fieldName: 'lsUsed',
      label: '',
      component: 'Select',
      componentProps: {
        placeholder: '是否使用',
        options: enableStatusOptions,
      },
    },
  ];
}

export const columns = [
  { field: 'checkbox', width: 50, type: 'checkbox' },
  {
    title: '单据号',
    field: 'documentNumber',
  },
  {
    title: 'SN',
    field: 'snCode',
  },
  {
    title: '产品编码',
    field: 'productCode',
  },
  {
    title: '线体',
    field: 'lineName',
  },
  {
    title: '镭射序号',
    field: 'lsSeq',
  },
  {
    title: '是否使用',
    field: 'lsUsed',
    width: 100,
    slots: { default: 'lsUsed' },
  },
  {
    title: '热压模具',
    field: 'moldNo',
  },
  {
    title: '热压大穴',
    field: 'bigCavityNo',
  },
  {
    title: '热压小穴',
    field: 'smallCavityNo',
  },
  {
    title: '创建人',
    field: 'creatorUserName',
    width: 180,
  },
  {
    title: '创建时间',
    field: 'creatorTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    width: 150,
  },
];
