import dayjs from 'dayjs';
import Decimal from 'decimal.js';
function isExist(value: any) {
  return value !== undefined && value !== null && value !== '';
}
export const column = [
  { title: '序号', type: 'seq', field: 'index', width: 50 },
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
    width: 140,
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
    field: 'originLocation',
    width: 140,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    formatter: ({ row, cellValue }) => {
      // 如果`row.originLocationName`和`cellValue`都不存在，则显示空字符串；
      // 如果存在其中一个，则显示一个
      // 如果存在两个，则显示为`${row.originLocationName}(${cellValue})`
      if (row.originLocationName) {
        return row.originLocationName + (cellValue ? `(${cellValue})` : '');
      }
      return cellValue || '';
    },
  },
  {
    title: '人民币',
    field: 'RMB',
    children: [
      {
        field: 'priceType',
        title: '税别',
        width: 100,
        slots: {
          default: 'priceType',
        },
      },
      { field: 'supplierUnitPriceBaseCurrency', title: '单位单价', width: 100 },
      {
        field: 'deliveryTerms',
        title: '交货条件',
        width: 100,
        slots: {
          default: 'deliveryTerms',
        },
      },
      { field: 'freightBaseCurrency', title: '单位运费', width: 100 },
    ],
  },
  {
    title: '美元',
    field: 'USD',
    children: [
      {
        field: 'priceTypeOriginalCurrency',
        title: '税别',
        width: 100,
        slots: {
          default: 'priceTypeOriginalCurrency',
        },
      },
      { field: 'supplierUnitPriceOriginalCurrency', title: '单位单价', width: 100 },
      {
        field: 'deliveryTermsOriginalCurrency',
        title: '交货条件',
        width: 100,
        slots: {
          default: 'deliveryTermsOriginalCurrency',
        },
      },
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
    formatter: ({ cellValue }) => (isExist(cellValue) ? Number(Decimal(cellValue).times(Decimal(100))) + '%' : ''),
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
    formatter: ({ cellValue }) => (isExist(cellValue) ? Number(Decimal(cellValue).times(Decimal(100))) + '%' : ''),
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
    formatter: ({ cellValue }) => (isExist(cellValue) ? Number(Decimal(cellValue).times(Decimal(100))) + '%' : ''),
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
    slots: {
      default: 'quotationType',
    },
  },
  {
    title: '终端客户信息',
    field: 'terminalCustomerCode',
    width: 220,
  },
  {
    title: '产品线',
    field: 'productLineCode',
    width: 220,
  },
  {
    title: '采购方式',
    field: 'purchasingWay',
    width: 220,
    slots: {
      default: 'purchasingWay',
    },
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
    formatter: ({ cellValue }) => (cellValue ? Number(Decimal(cellValue).times(Decimal(100))) + '%' : ''),
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
    field: 'gp2',
    width: 100,
  },
  {
    title: '本位币币别',
    field: 'baseCurrency',
    width: 100,
  },
  {
    title: '原币币别',
    field: 'originalCurrency',
    width: 100,
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
