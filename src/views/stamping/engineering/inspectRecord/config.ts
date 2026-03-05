import { useI18n } from '/@/hooks/web/useI18n';

export function getSchema() {
  return [
    {
      fieldName: 'productCode',
      label: '',
      i18nField: 'originCode',
      component: 'Input',
      componentProps: {
        placeholder: '产品内部料号',
      },
    },
    // {
    //   fieldName: 'originCode',
    //   label: '',
    //   i18nField: 'originCode',
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: '备注',
    //   },
    // },
    {
      fieldName: 'time',
      label: '',
      component: 'RangePicker',
      componentProps: {
        // placeholder: '备注',
      },
    },
  ];
}

export function getColumns() {
  const { t } = useI18n();
  return [
    { type: 'checkbox', field: 'checkbox', width: 50 },
    {
      title: '调试时间',
      field: 'faiNo',
      width: 180,
    },
    {
      title: '产品内部料号',
      field: 'faiNo',
      width: 180,
    },
    {
      title: '调试内容',
      field: 'faiNo',
      width: 180,
    },
    {
      type: 'seq',
      title: t('component.table.index'),
      width: 50,
    },
    {
      title: 'FAI1',
      field: 'faiNo',
      width: 100,
    },
    {
      title: 'FAI2',
      field: 'faiNo',
      width: 100,
    },
    {
      title: 'FAI3',
      field: 'faiNo',
      width: 100,
    },
    {
      title: 'FAI4',
      field: 'faiNo',
      width: 100,
    },
    {
      title: 'FAI5',
      field: 'faiNo',
      width: 100,
    },
    {
      title: 'FAI6',
      field: 'faiNo',
      width: 100,
    },
    {
      title: 'FAI7',
      field: 'faiNo',
      width: 100,
    },
    {
      title: 'FAI8',
      field: 'faiNo',
      width: 100,
    },
    {
      title: 'FAI9',
      field: 'faiNo',
      width: 100,
    },
    {
      title: 'FAI10',
      field: 'faiNo',
      width: 100,
    },
    {
      title: '创建人',
      field: 'faiNo',
      width: 180,
    },
    {
      title: '创建时间',
      field: 'faiNo',
      width: 180,
    },
  ];
}
