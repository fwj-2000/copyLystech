import type { VxeGridPropTypes } from 'vxe-table';

import dayjs from 'dayjs';
// import { useBaseStore } from '/@/store/modules/base';
import { STATUS_OPTIONS, ENABLE_OPTIONS } from '/@/utils/status/index';
import { useI18n } from '/@/hooks/web/useI18n';

// const baseStore = useBaseStore();
const { t } = useI18n();

export const rowData = {
  insideCode: '',
  materialType: '',
  materialTypeFromManufacturer: '',
  materialDesc: '',
  manufacturer: '',
  supplier: '',
  originCountry: '',
  taxes: 0,

  // -------------------
  quotationType: '',
  terminalCustomerCode: '',
  productLineCode: '',
  purchaseWay: '',
  purchasingUnit: '',
  materialLength: '',
  materialWidth: '',
  materialThickness: '',
  materialArea: '',
  // baseCurrency: true,
  baseCurrencyChecked: true,
  // originalCurrency: true,
  originalCurrencyChecked: false,
  priceType: 2,
  supplierUnitPriceBaseCurrency: '',
  deliveryTerms: '',
  freightBaseCurrency: '',
  priceTypeOriginalCurrency: 0,
  supplierUnitPriceOriginalCurrency: '',
  deliveryTermsOriginalCurrency: '',
  freightOriginalCurrency: '',
  exchangeRate: '',
  tariff: '',
  priceOc2bcUntaxedPriceUnit: '',
  usdRmbGap: '',
  benchmarkCurrency: '',
  reservedBuffer: '',
  suggestedPurchaseCurrency: '',
  generalTradePricePriceUnit: '',
  bondedPricePriceUnit: '',
  proportionOfPriceReduction: '',
  supplierToCustomerPrice: '',
  gap1: '',
  supplierToCompetitorPrice: '',
  gp2: '',
  moq: '',
  lt: '',
  effectiveDate: '',
  expirationDate: '',
  actualPurchasePrice: '',
  applyUserId: '',
  baseCurrency: 'CNY',
  originalCurrency: 'USD',
  remark: '',

  onEdit: true,
  editable: true,
  disabled: {
    insideCode: true,
    materialType: true,
    materialTypeFromManufacturer: true,
    materialDesc: true,
    supplier: true,
  },
};

// 获取并缓存`采购方式`字典，用于列表回显
// const PurchaseWayDictList: any[] = [];
// baseStore.getDictionaryData('PurchaseQuotation.PurchaseWay').then((res: any[]) => {
//   PurchaseWayDictList.push(...res);
// });
export function getColumns(): VxeGridPropTypes.Columns {
  return [
    {
      type: 'expand',
      width: 50,
      slots: { content: 'expandedRowRender' },
    },
    {
      type: 'checkbox',
      width: 50,
    },
    {
      type: 'seq',
      width: 50,
    },
    {
      title: '报价单号',
      field: 'applyCode',
      sortable: true,
      width: 150,
      slots: {
        default: 'applyCode',
      },
    },
    {
      title: '物料料号',
      field: 'insideCode',
      sortable: true,
      width: 180,
    },
    {
      title: '物料分类',
      field: 'materialAreaName',
      sortable: true,
      width: 150,
      formatter: ({ cellValue }) => {
        if (!cellValue) return '';
        const [_, material] = cellValue.split('/');
        return material || cellValue;
        // return target?.fullName || text;
      },
    },
    {
      title: '状态',
      field: 'status',
      // format: 'tag|' + JSON.stringify(STATUS_OPTIONS),
      width: 100,
      cellRender: {
        name: 'Tag',
        options: STATUS_OPTIONS,
      },
    },
    // 价格状态
    {
      title: t('dict.PurchaseQuotationColumn.priceStatusDesc'),
      field: 'priceStatus',
      // format: 'tag|' + JSON.stringify(ENABLE_OPTIONS),
      width: 100,
      cellRender: {
        name: 'Tag',
        options: ENABLE_OPTIONS,
      },
    },
    {
      title: '当前节点',
      field: 'currentNodeName',
      sortable: true,
      width: 120,
    },
    {
      title: '当前处理人',
      field: 'handlerName',
      sortable: true,
      width: 220,
    },
    {
      title: '节点记录',
      field: 'nodeDetail',
      sortable: true,
      width: 100,
      slots: {
        default: 'nodeDetail',
      },
    },
    {
      title: '供应商简称',
      field: 'supplierName',
      sortable: true,
      width: 120,
    },
    {
      title: '厂商型号',
      field: 'materialTypeFromManufacturer',
      sortable: true,
      width: 100,
    },
    {
      title: '物料描述',
      field: 'materialName',
      sortable: true,
      width: 100,
    },
    {
      title: '终端客户信息',
      field: 'terminalCustomerName',
      sortable: true,
      width: 120,
    },
    {
      title: '产品线',
      field: 'productLineCode',
      sortable: true,
      width: 100,
    },
    // {
    //   title: '采购方式',
    //   field: 'purchasingWay',
    //   sortable: true,
    //   width: 100,
    //   // format: 'dict|PurchaseQuotation.PurchaseWay'
    //   formatter: ({ cellValue }) => {
    //     if (!cellValue) return '';
    //     const target = PurchaseWayDictList.find(item => item.enCode.toString() === cellValue.toString());
    //     return target?.fullName || cellValue;
    //   },
    // },
    {
      title: '生效日期',
      field: 'effectiveDate',
      sortable: true,
      width: 150,
      // format: 'date|YYYY-MM-DD',
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
    {
      title: '失效日期',
      field: 'expirationDate',
      sortable: true,
      // format: 'date|YYYY-MM-DD',
      width: 150,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
    {
      title: '创建人',
      field: 'applyUserName',
      sortable: true,
      width: 220,
    },
    // 创建时间
    {
      title: '创建时间',
      field: 'creatorTime',
      sortable: true,
      // format: 'date|YYYY-MM-DD',
      width: 150,
      i18nField: 'CommonCol.creatorTime',
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    // {
    //   title: '报价类型',
    //   field: 'quotationType',
    //   sortable: true,
    //   // format: "dict|PurchaseQuotation.QuotationType",
    //   width: 150,
    //   slots: {
    //     default: 'quotationType',
    //   },
    // },
    {
      title: '备注',
      field: 'remark',
      sortable: true,
      width: 240,
    },
    // {
    //   title: '创建时间',
    //   field: 'creatorTime',
    //   sortable: true,
    //   format: 'date|YYYY-MM-DD',
    //   width: 150,
    // },
    {
      title: '修改人',
      field: 'lastModifyUserName',
      sortable: true,
      width: 220,
    },
    {
      title: '修改时间',
      field: 'lastModifyTime',
      sortable: true,
      // format: 'date|YYYY-MM-DD',
      width: 150,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      title: t('common.action'),
      field: 'action',
      fixed: 'right',
      width: 100,
      slots: {
        default: 'action',
      },
    },
  ];
}

export const column = [
  { title: '序号', type: 'seq', field: 'index', width: 50 },
  // {
  //   title: '报价单号',
  //   field: 'OrgName',
  //   width: 140,
  //   sortable: true,
  //   filters: [{ data: '' }],
  //   filterRender: {
  //     name: 'Input',
  //     searchField: 'orgName',
  //   },
  //   children: [
  //     { field: 'name', title: '姓名' },
  //     { field: 'age', title: '年龄' },
  //   ],
  // },
  {
    title: '报价单号',
    field: 'applyCode',
    width: 140,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '物料料号',
    field: 'insideCode',
    width: 200,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '物料归属',
    field: 'materialAreaName',
    width: 140,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '原厂商型号',
    field: 'materialTypeFromManufacturer',
    width: 180,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    sortable: true,
  },

  {
    title: '物料描述',
    field: 'materialName',
    width: 180,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '供应商简称',
    field: 'supplierShortName',
    width: 140,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '原产国',
    field: 'originLocationName',
    width: 140,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '人民币',
    field: 'RMB',
    children: [
      { field: 'priceType', title: '税别', width: 100 },
      { field: 'supplierUnitPriceBaseCurrency', title: '单位单价', width: 100 },
      { field: 'deliveryTerms', title: '交货条件', width: 100 },
      { field: 'freightBaseCurrency', title: '单位运费', width: 100 },
    ],
  },
  {
    title: '美元',
    field: 'USD',
    children: [
      { field: 'priceTypeOriginalCurrency', title: '税别', width: 100 },
      { field: 'supplierUnitPriceOriginalCurrency', title: '单位单价', width: 100 },
      { field: 'deliveryTermsOriginalCurrency', title: '交货条件', width: 100 },
      { field: 'freightOriginalCurrency', title: '单位运费', width: 100 },
    ],
  },
  {
    title: '报价当月汇率',
    field: 'exchangeRate',
    width: 120,
    sortable: true,
  },
  {
    title: '关税(%)',
    field: 'tariff',
    width: 120,
    sortable: true,
  },
  {
    title: '美元转人民币到厂价(单位单价)',
    field: 'priceOc2bcUntaxedPriceUnit',
    width: 240,
    sortable: true,
  },
  {
    title: '美元VS人民币Gap(%)',
    field: 'usdRmbGap',
    width: 180,
    sortable: true,
  },
  {
    title: '基准币别',
    field: 'benchmarkCurrency',
    width: 160,
    sortable: true,
  },
  {
    title: '预留Buffer(%)',
    field: 'reservedBuffer',
    width: 220,
  },
  {
    title: '建议采购币别',
    field: 'suggestedPurchaseCurrency',
    width: 220,
  },
  {
    title: '报价类型',
    field: 'quotationType',
    width: 220,
  },
  {
    title: '终端客户信息',
    field: 'terminalCustomerName',
    width: 220,
  },
  {
    title: '产品线',
    field: 'productLineName',
    width: 220,
  },
  {
    title: '采购方式',
    field: 'purchasingWay',
    width: 220,
  },
  {
    title: '采购单位',
    field: 'purchasingUnit',
    width: 220,
  },
  {
    title: '宽度(MM)',
    field: 'materialWidth',
    width: 100,
  },
  {
    title: '长度(M)',
    field: 'materialLength',
    width: 100,
  },
  {
    title: '厚度(MM)',
    field: 'materialThickness',
    width: 100,
  },
  {
    title: '面积(M2)',
    field: 'materialArea',
    width: 160,
  },
  {
    title: '一般贸易价(单价单位)',
    field: 'generalTradePricePriceUnit',
    width: 180,
  },

  {
    title: '保税价(单价单位)',
    field: 'bondedPricePriceUnit',
    width: 160,
  },
  {
    title: '本次降价比例(%)',
    field: 'proportionOfPriceReduction',
    width: 160,
  },
  {
    title: 'To终端价',
    field: 'supplierToCustomerPrice',
    width: 150,
  },
  {
    title: 'To终端Gap',
    field: 'gap1',
    width: 100,
  },
  {
    title: 'To友商价',
    field: 'supplierToCompetitorPrice',
    width: 100,
  },
  {
    title: 'To友商价Gap',
    field: 'gap2',
    width: 100,
  },
  {
    title: '本位币币别',
    field: 'baseCurrency',
    width: 100,
    formatter: ({ cellValue, row }) => (row.baseCurrencyChecked ? cellValue : ''),
  },
  {
    title: '原币币别',
    field: 'originalCurrency',
    width: 100,
    formatter: ({ cellValue, row }) => (row.originalCurrencyChecked ? cellValue : ''),
  },
  {
    title: 'MOQ',
    field: 'moq',
    width: 100,
  },
  {
    title: 'L/T(天)',
    field: 'lt',
    width: 100,
  },
  {
    title: '生效日期',
    field: 'effectiveDate',
    width: 100,
    formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).tz().format('YYYY-MM-DD') : ''),
  },
  {
    title: '失效日期',
    field: 'expirationDate',
    width: 100,
    formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).tz().format('YYYY-MM-DD') : ''),
  },
  {
    title: '备注',
    field: 'remark',
    width: 220,
  },
];
