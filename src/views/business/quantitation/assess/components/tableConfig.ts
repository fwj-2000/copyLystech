import { h } from 'vue';
import { dateUtil } from '/@/utils/dateUtil';
import { useI18n } from '/@/hooks/web/useI18n';
import { PRODUCTION_LIST } from '/@/components/CustomComponents/src/quality/Constant';
const { t } = useI18n();

export const selfCommonVxeCol = [
  { title: '单号', field: 'applyNo', width: 160 },
  { title: '需求类型', field: 'demandTypeName', i18nField: 'CommonCol.demandType', width: 150 },
  { title: '产品内部料号', field: 'innerMaterialNumber', width: 200 },
  { title: '旧版成品编码', field: 'insidePartNumberOld', width: 200 },
  {
    title: '生产类型',
    field: 'productionType',
    i18nField: 'productionTypeDesc',
    width: 160,
    formatter: ({ cellValue }) => {
      return PRODUCTION_LIST.find(el => el.id == cellValue)?.fullName;
    },
  },
  {
    title: '备注',
    field: 'pmDesc',
    i18nField: 'CommonCol.remark',
    width: 200,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '下一节点处理人(PD)',
    field: 'pdPersonId',
    width: 160,
    i18nField: 'CommonCol.nextHandler',
    i18nParams: ['PD'],
    formatter: ({ row }) => row.pdName,
    editRender: {
      name: 'CustomUserSelect',
      cacheField: 'pdName',
      // props: {
      //   onChange: (id, _, { row }) => {
      //     row.pdPersonId = id;
      //   },
      // },
    },
  },
];

export const outCommonVxeCol = [
  {
    title: '单号',
    field: 'applyNo',
    width: 160,
  },
  { title: '需求类型', field: 'demandTypeName', i18nField: 'CommonCol.demandType', width: 150 },
  {
    title: '产品内部料号',
    field: 'innerMaterialNumber',
    width: 200,
  },
  {
    title: '旧版成品编码',
    field: 'insidePartNumberOld',
    width: 200,
  },
  { title: '产品描述', field: 'productDesc', width: 220 },
  {
    title: '生产类型',
    field: 'productionType',
    width: 160,
    i18nField: 'productionTypeDesc',
    formatter: ({ cellValue }) => {
      return PRODUCTION_LIST.find(el => el.id == cellValue)?.fullName;
    },
  },
  {
    title: '备注',
    field: 'pmDesc',
    i18nField: 'CommonCol.remark',
    width: 200,
    editRender: {
      name: 'Input',
    },
  },
];

export const commonQuotaVxeCols = [
  { title: '终端客户料号', field: 'terminalCustomerPartNumber', width: 160 },
  { title: '直接客户料号', field: 'immediateCustomerPartNumber', width: 200 },
  { title: '终端项目阶段', field: 'projectPhase', width: 160 },
  { title: '需求数量(PCS)', field: 'peakQty', width: 160 },
  {
    title: '客户要求交期',
    field: 'customerDeliveryTime',
    i18nField: 'customerDeliveryDateTime',
    width: 160,
    cellRender: { name: 'Date', format: 'YYYY-MM-DD' },
  },
];

export const commonPriceVxeCols = [
  { title: '终端客户料号', field: 'terminalCustomerPartNumber', width: 160 },
  { title: '直接客户料号', field: 'immediateCustomerPartNumber', width: 200 },
  { title: '报价用途', field: 'purposeDesc', width: 160 },
  { title: '紧急程度', field: 'urgencyLevelDesc', width: 200 },
  { title: '项目总量(W)', field: 'totalQty', width: 160 },
  {
    title: '客户要求交期',
    field: 'customerDeliveryTime',
    i18nField: 'customerDeliveryDateTime',
    width: 160,
    cellRender: { name: 'Date', format: 'YYYY-MM-DD' },
  },
];

export const SampleVxeCols = [
  { title: '需求数量(PCS)', field: 'peakQty', width: 160 },
  {
    title: '客户要求交期',
    field: 'customerDeliveryTime',
    i18nField: 'customerDeliveryDateTime',
    width: 160,
    cellRender: { name: 'Date', format: 'YYYY-MM-DD' },
  },
];

export const selfQuotaVxeCols = [...selfCommonVxeCol, ...commonQuotaVxeCols];

export const selfPriceVxeCols = [...selfCommonVxeCol, ...commonPriceVxeCols];

export const selfSampleVxeCols = [
  ...selfCommonVxeCol,
  {
    title: '样品组人员',
    field: 'sampleGroupLeaderPersonId',
    width: 160,
    formatter: ({ row }) => row.sampleGroupLeaderPersonName,
    editRender: {
      name: 'CustomUserSelect',
      // cacheField: 'sampleGroupLeaderPersonName',
    },
  },
  ...SampleVxeCols,
];

export const outQuotaVxeCols = ({ handleStock, handleDraw, handleDrawView }) => {
  return [
    {
      title: '下一节点处理人(主计划)',
      field: 'quantitativePlanUserId',
      i18nField: 'CommonCol.nextHandler',
      i18nParams: [t('common.MC')],
      formatter: ({ row }) => row.quantitativePlanUserName,
      editRender: {
        name: 'CustomUserSelect',
      },
    },
    // {
    //   title: '库存处理',
    //   field: 'isHaveStock',
    //   i18nField: 'isHaveStockDesc',
    //   width: 160,
    //   slots: {
    //     default: ({ row }) => h('span', { class: 'table-a', onClick: handleStock.bind(null, row) }, row.isHaveStockDesc),
    //   },
    // },   后续有需求可以取消注释
    {
      title: '工程图纸',
      field: 'engineeringDrawingsName',
      slots: {
        default: ({ row }) => h('span', { class: 'table-a', onClick: handleDraw.bind(null, row) }, t('common.viewDetails')),
      },
    },
    {
      title: '脱敏图纸',
      field: 'DesensitizedDrawingsName',
      i18nField: 'drawing',
      width: 160,
      slots: {
        default: ({ row }) => h('span', { class: 'table-a', onClick: handleDrawView.bind(null, row) }, t('common.viewDetails')),
      },
    },
    ...commonQuotaVxeCols,
  ];
};

export const outPriceVxeCols = ({ handleDraw, handleDrawView }) => {
  return [
    {
      title: '下一节点处理人(采购员)',
      field: 'purchaserId',
      i18nField: 'CommonCol.nextHandler',
      i18nParams: [t('common.purchaser')],
      formatter: ({ row }) => row.purchaserName,
      editRender: {
        name: 'CustomUserSelect',
      },
    },
    {
      title: '工程图纸',
      field: 'engineeringDrawingsName',
      width: 160,
      slots: {
        default: ({ row }) => h('span', { class: 'table-a', onClick: handleDraw.bind(null, row) }, t('common.viewDetails')),
      },
    },
    {
      title: '脱敏图纸',
      field: 'DesensitizedDrawingsName',
      i18nField: 'drawing',
      width: 160,
      slots: {
        default: ({ row }) => h('span', { class: 'table-a', onClick: handleDrawView.bind(null, row) }, t('common.viewDetails')),
      },
    },
    ...commonPriceVxeCols,
  ];
};

export const outSampleVxeCols = () => {
  return [
    // 下一节点处理人(商务)
    {
      title: '下一节点处理人(商务)',
      field: 'applyUserName',
      i18nField: 'CommonCol.nextHandler',
      i18nParams: [t('common.business')],
      width: 190,
    },
    {
      title: '样品组人员',
      field: 'sampleGroupLeaderPersonId',
      formatter: ({ row }) => row.sampleGroupLeaderPersonName,
      editRender: {
        name: 'CustomUserSelect',
      },
    },
    { title: '需求数量(PCS)', field: 'peakQty', width: 160 },
    {
      title: '客户要求交期',
      field: 'customerDeliveryTime',
      i18nField: 'customerDeliveryDateTime',
      width: 160,
      cellRender: { name: 'Date', format: 'YYYY-MM-DD' },
    },
    {
      title: '外购交期',
      field: 'deliveryTime',
      formatter: ({ row }) => (row.deliveryTime ? dateUtil(row.deliveryTime).format('YYYY-MM-DD') : ''),
      editRender: {
        name: 'DatePicker',
        props: {
          valueFormat: 'YYYY-MM-DD',
          format: 'YYYY-MM-DD',
        },
      },
      width: 160,
    },
  ];
};

export const drawDemandVxe = [
  {
    title: '单号',
    field: 'applyNo',
    width: 160,
  },
  { title: '需求类型', field: 'demandTypeName', i18nField: 'CommonCol.demandType', width: 150 },
  {
    title: '产品内部料号',
    field: 'innerMaterialNumber',
    width: 200,
  },
  {
    title: '旧版成品编码',
    field: 'insidePartNumberOld',
    width: 200,
  },
  // { title: '产品描述', field: 'productDesc', width: 220 },
  {
    title: '生产类型',
    field: 'productionType',
    i18nField: 'productionTypeDesc',
    width: 160,
    formatter: ({ cellValue }) => {
      return PRODUCTION_LIST.find(el => el.id == cellValue)?.fullName;
    },
  },
  {
    title: '客户要求交期',
    field: 'customerDeliveryTime',
    i18nField: 'customerDeliveryDateTime',
    width: 160,
    cellRender: { name: 'Date', format: 'YYYY-MM-DD' },
  },
  {
    title: 'PD',
    field: 'pdPersonId',
    i18nField: 'CommonCol.pd',
    width: 180,
    formatter: ({ row }) => row.pdName,
    editRender: {
      cacheField: 'pdName',
      name: 'CustomUserSelect',
    },
  },
  {
    title: '备注',
    field: 'pmDesc',
    i18nField: 'CommonCol.remark',
    minWidth: 220,
    editRender: {
      name: 'Input',
    },
  },
];
