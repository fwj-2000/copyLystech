import { STATUS_OPTIONS } from '/@/components/CustomComponents/src/quality/Constant';
import { useI18n } from '/@/hooks/web/useI18n';

export function getColumns(): Array<any> {
  return [
    // 勾选框
    {
      type: 'checkbox',
      field: 'checkbox',
      width: 50,
    },
    {
      title: '是否同意',
      field: 'status',
      width: 120,
      i18nField: 'isAgree',
      cellRender: {
        name: 'Tag',
        cSharpType: 'int',
        options: STATUS_OPTIONS,
      },
    },
    {
      title: '原因',
      field: 'handleOpinion',
      width: 200,
      editRender: {
        name: 'Input',
      },
    },
    {
      title: '产品内部料号',
      field: 'innerMaterialNumber',
      width: 200,
    },
    {
      title: '需求类型',
      field: 'demandTypeName',
      i18nField: 'CommonCol.demandType',
      width: 200,
    },
    {
      title: '需求数量(PCS)',
      field: 'peakQty',
      width: 130,
      aqpFilter: {
        cSharpType: 'int',
      },
    },
    {
      title: '客户要求交期',
      field: 'customerDeliveryTime',
      i18nField: 'customerDeliveryDateTime',
      width: 120,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
    { title: '客户要求', field: 'pmDesc', width: 120 },
  ];
}

export const handleQuotaCols = cols => {
  return [
    ...getColumns(),
    {
      title: '交付合计(PCS)',
      field: 'deliveryPlanQty',
      width: 140,
      aqpFilter: { cSharpType: 'int' },
    },
    ...cols,
    {
      title: '备注',
      i18nField: 'CommonCol.remark',
      field: 'deliveryPlanRemark',
      width: 120,
    },
  ];
};

export const sampleCols = [
  ...getColumns(),
  {
    title: '预估交期',
    field: 'estimatedMaterialsTime',
    i18nField: 'estimatedMaterialsDateTime',
    width: 120,
    cellRender: {
      name: 'Date',
      format: 'YYYY/MM/DD',
    },
  },
  {
    title: '备注',
    field: 'remark',
    width: 120,
  },
];
