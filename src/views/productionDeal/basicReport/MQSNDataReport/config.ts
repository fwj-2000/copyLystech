import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

// 主页form配置
export function getFormSchema() {
  return [
    {
      fieldName: 'serialNumbers',
      label: '',
      component: 'Textarea',
      componentProps: {
        placeholder: '单层SN',
        maxlength: 850,
        rows: 1,
        // autoSize: { minRows: 1, maxRows: 1 }
      },
      i18nField: 'serialNumber',
    },
    {
      fieldName: 'productCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '产品料号',
      },
    },
    {
      fieldName: 'cuttingId',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '分切唯一码',
      },
    },
  ];
}

export const columns = [
  {
    title: '单层SN',
    field: 'serialNumber',
    width: 160,
  },
  {
    title: '层次',
    field: 'moldLayers',
    width: 80,
  },
  {
    title: '产品料号',
    field: 'productCode',
    width: 160,
  },
  {
    title: '分切唯一码',
    field: 'cuttingId',
    width: 160,
  },
  {
    title: '子层次',
    field: 'moldLayersSub',
    width: 160,
  },
  {
    title: '创建人',
    field: 'creatorUserName',
    sortable: true,
    width: 200,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '创建时间',
    field: 'creatorTime',
    filters: [{ data: '' }],
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    width: 150,
  },
  {
    title: '修改人',
    field: 'lastModifyUserName',
    sortable: true,
    width: 200,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '修改时间',
    field: 'lastModifyTime',
    filters: [{ data: '' }],
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    width: 150,
  },
];
