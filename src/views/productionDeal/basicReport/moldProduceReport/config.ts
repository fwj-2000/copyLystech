import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

// 主页form配置
export function getFormSchema() {
  return [
    {
      fieldName: 'moldNo',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '模具编号',
      },
    },
    {
      fieldName: 'factoryMoldNo',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '厂内模号',
      },
    },
    {
      fieldName: 'orderDate',
      label: '',
      component: 'RangePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
        placeholder: [t('dict.CommonCol.startTime'), t('dict.CommonCol.endTime')],
      },
    },
    {
      fieldName: 'deliveryDate',
      label: '',
      component: 'RangePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
        placeholder: ['交货日期开始', '交货日期结束'],
      },
    },
  ];
}

export const columns = [
  {
    title: '模具编号',
    field: 'moldNo',
    width: 120,
    slots: {
      default: 'moldNoDetail',
    },
  },
  {
    title: '厂内模号',
    field: 'factoryMoldNo',
    width: 100,
  },
  {
    title: '版本号',
    field: 'bomVersion',
    width: 80,
  },
  {
    title: '累计工时（H）',
    field: 'sumWorkHours',
    width: 100,
  },
  {
    title: '零件数量',
    field: 'partQuantity',
    width: 80,
  },
  {
    title: '待完工零件数量',
    field: 'outstandQty',
    width: 120,
  },
  {
    title: '已完工零件数量',
    field: 'successQty',
    width: 120,
  },
  {
    title: '订单日期',
    field: 'orderDate',
    width: 100,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  {
    title: '交货日期',
    field: 'deliveryDate',
    width: 100,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  {
    title: '各工段耗时',
    field: 'processWorkHours',
  },
];
