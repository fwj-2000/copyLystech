import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

export const detailcols = [
  {
    field: 'expand',
    type: 'expand',
    width: 50,
    slots: {
      content: 'expand',
    },
  },
  {
    title: '单号',
    field: 'applyNo',
    width: 150,
  },
  {
    title: '产品内部料号',
    field: 'innerMaterialNumber',
    editRow: false,
    width: 180,
  },
  {
    title: '特殊备注',
    field: 'engineeringRemarks',
    width: 200,
    showOverflow: 'ellipsis',
    slots: {
      default: 'engineeringRemarks',
    },
  },
  // 生产工艺
  {
    title: t('dict.PCCColumn.process'),
    field: 'process',
    width: 200,
    formatter: ({ row }) => row.processName || row.process || '',
  },
  {
    title: 'PD',
    field: 'pdName',
    i18nField: 'CommonCol.pd',
    editRow: false,
    width: 200,
  },
  // 下一节点处理人(模切计划)
  {
    title: '下一节点处理人(模切计划)',
    field: 'diecuttingPlanUserId',
    i18nField: 'CommonCol.nextHandler',
    i18nParams: [t('common.mcPlan')],
    width: 220,
    editRender: {
      name: 'CustomUserSelect',
      cacheField: 'diecuttingPlanUserName',
    },
  },
  {
    title: '直接客户料号',
    field: 'immediateCustomerPartNumber',
    editRow: false,
    width: 120,
  },
  {
    title: '终端客户料号',
    field: 'terminalCustomerPartNumber',
    editRow: false,
    width: 120,
  },
  {
    title: '工厂',
    field: 'factory',
    editRow: false,
    width: 200,
  },
  {
    title: '需求数量(PCS)',
    field: 'peakQty',
    editRow: false,
    editDynamicDisabled: false,
    width: 120,
  },
  {
    title: '排产数量(PCS)',
    field: 'demandQty',
    width: 140,
  },
  {
    title: '要求材料回厂时间',
    field: 'requirementRegression',
    width: 150,
    format: 'date|YYYY-MM-DD',
  },
  {
    title: '预估材料交期',
    field: 'estimatedMaterialsTime',
    editRender: {
      name: 'DatePicker',
      props: {
        valueFormat: 'YYYY-MM-DD',
        format: 'YYYY-MM-DD',
      },
    },
    width: 140,
  },
  {
    title: '备注(材料交期)',
    field: 'mcRemark',
    editRender: {
      name: 'Textarea',
      props: {
        autoSize: true,
      },
    },
    width: 800,
  },
  {
    title: '产品描述',
    field: 'productDesc',
    editRow: false,
    width: 200,
  },
];
