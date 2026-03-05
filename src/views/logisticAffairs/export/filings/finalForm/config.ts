import { useI18n } from '/@/hooks/web/useI18n';
// import { getFactoryList } from '/@/api/engineering/sample';
// import { useBaseStore } from '/@/store/modules/base';

const { t } = useI18n();
// const baseStore = useBaseStore();

export enum FILING_TYPE_ENUM {
  出口内地备案表 = '1',
  出港备案表 = '2',
}

export const statusOptions = [
  { id: 9, fullName: t('dict.FilingsApplyStatusEnum.9'), theme: 'gray' },
  { id: 11, fullName: t('dict.FilingsApplyStatusEnum.11'), theme: 'green' },
];

export function getFormConfig() {
  return [
    {
      fieldName: 'filingsApplyNo',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '需求单号/备案需求单号', allowClear: true },
    },
    {
      fieldName: 'insidePartNumber',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '产品内部料号', allowClear: true },
    },
    {
      fieldName: 'immediateCustomerPartNumber',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '直接客户料号', allowClear: true },
    },
    {
      fieldName: 'terminalCustomerPartNumber',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '终端客户料号', allowClear: true },
    },
    {
      fieldName: 'customersId',
      label: '',
      component: 'CustomUserSelect',
      i18nField: 'customersName',
      componentProps: { placeholder: '客服', allowClear: true },
    },
    {
      fieldName: 'customsPersonId',
      label: '',
      component: 'CustomUserSelect',
      i18nField: 'customsPersonName',
      componentProps: { placeholder: '关务', allowClear: true },
    },
    {
      fieldName: 'exportStatus',
      label: '',
      component: 'Select',
      componentProps: {
        placeholder: '出口内地备案表',
        options: statusOptions,
        allowClear: true,
        fieldNames: { label: 'fullName', value: 'id' },
      },
    },
    {
      fieldName: 'departureStatus',
      label: '',
      component: 'Select',
      componentProps: {
        placeholder: '出港备案表',
        allowClear: true,
        options: statusOptions,
        fieldNames: { label: 'fullName', value: 'id' },
      },
    },
  ];
}

export function getColumns() {
  return [
    {
      type: 'checkbox',
      field: 'checkbox',
    },
    {
      field: 'seq',
      title: t('component.table.index'),
      type: 'seq',
      width: '50',
      align: 'center',
    },
    {
      title: '来源单号',
      field: 'sourceNo',
      width: 150,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
    },
    {
      title: '备案需求单号',
      field: 'filingsApplyNo',
      width: 200,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
    },
    { title: '产品内部料号', field: 'insidePartNumber', width: 240 },
    {
      title: '出口内地备案表',
      field: 'exportStatus',
      i18nField: 'status',
      width: 160,
      sortable: true,
      cellRender: {
        name: 'Tag',
        options: statusOptions,
      },
    },
    {
      title: '出港备案表',
      field: 'departureStatus',
      i18nField: 'status',
      width: 160,
      sortable: true,
      cellRender: {
        name: 'Tag',
        options: statusOptions,
      },
    },
    {
      title: '关务',
      field: 'customsPersonId',
      i18nField: 'customsPersonName',
      formatter: ({ cellValue, row }) => row.customsPersonName || cellValue || '',
      width: 200,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
    },
    {
      title: '直接客户信息',
      field: 'immediateCustomerName',
      width: 150,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
    },
    {
      title: '直接客户料号',
      field: 'immediateCustomerPartNumber',
      width: 150,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
    },
    {
      title: '终端客户料号',
      field: 'terminalCustomerPartNumber',
      width: 150,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
    },
    {
      title: '客服',
      field: 'customersId',
      formatter: ({ cellValue, row }) => row.customersName || cellValue || '',
      i18nField: 'customersName',
      width: 200,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
    },
    {
      title: t('common.action'),
      width: 50,
      slots: { default: 'action' },
      fixed: 'right',
      field: 'action',
    },
  ];
}

/** 导入列配置 */
export const importColumnsMap = {
  [FILING_TYPE_ENUM.出口内地备案表]: [
    // 'goodsName', // 客户备案品名
    // 'specSize', // 规格尺寸(MM)
    // 'goodsCode',  // 客户商品编码
    // 'weight', // 客户备案单重(KG)
    // 'declElements', // 申报要素
    // 'insidePartNumber', // 产品内部料号
    // 'accountType', // 账册类型
    // 'declUnit', // 申报单位
    // 'legalUnit', // 法定单位
    // 'remark', // 备注
    // 'materialQuality', // 材质成分
    // 'originCountry', // 原产国
    // 'goodDomesticSource', // 境内货源地
    {
      field: 'cProductName',
      i18nField: 'goodsName',
      title: '客户备案品名',
      width: 120,
    },
    {
      field: 'specSize',
      title: '规格尺寸(MM)',
      width: 120,
    },
    {
      field: 'cProductCode',
      i18nField: 'goodsCode',
      title: '客户商品编码',
      width: 120,
    },
    {
      field: 'cWeight',
      i18nField: 'weight',
      title: '客户备案单重(KG)',
      width: 120,
    },
    {
      field: 'elements',
      i18nField: 'declElements',
      title: '申报要素',
      width: 200,
    },
    {
      field: 'partNumber',
      i18nField: 'insidePartNumber',
      title: '产品内部料号',
      width: 120,
    },
    {
      field: 'accountType',
      title: '账册类型',
      width: 120,
    },
    {
      field: 'dUnit',
      i18nField: 'declUnit',
      title: '申报单位',
      width: 120,
    },
    {
      field: 'legalUnit',
      i18nField: 'legalUnit',
      title: '法定单位',
      width: 120,
    },
    {
      field: 'inlandRemarks',
      i18nField: 'remark',
      title: '备注',
      width: 200,
    },
    {
      field: 'material',
      i18nField: 'materialQuality',
      title: '材质成分',
      width: 200,
    },
    {
      field: 'originCountry',
      i18nField: 'originCountry',
      title: '原产国',
      width: 120,
    },
    {
      field: 'goodSource',
      i18nField: 'goodDomesticSource',
      title: '境内货源地',
      width: 120,
    },
  ],
  [FILING_TYPE_ENUM.出港备案表]: [
    // 'insidePartNumber', // 产品内部料号
    // 'goodsName', // 品名
    // 'goodsCode', // 客户商品编码
    // 'weight', // 单重(KG)
    // 'declElements', // 申报要素
    // 'specSize', // 规格尺寸(MM)
    // 'materialQuality', // 材质成分
    // 'purpose', // 用途
    // 'declUnit', // 申报单位
    // 'legalUnit', // 法定单位
    // 'originCountry', // 原产国
    // 'area', // 地区
    {
      field: 'partNumber',
      i18nField: 'insidePartNumber',
      title: '产品内部料号',
      width: 120,
    },
    {
      field: 'productName',
      i18nField: 'goodsName',
      title: '品名',
      width: 120,
    },
    {
      field: 'productCode',
      i18nField: 'goodsCode',
      title: '客户商品编码',
      width: 120,
    },
    {
      field: 'weight',
      i18nField: 'weight',
      title: '单重(KG)',
      width: 120,
    },
    {
      field: 'elements',
      i18nField: 'declElements',
      title: '申报要素',
      width: 120,
    },
    {
      field: 'spec',
      i18nField: 'specSize',
      title: '规格尺寸(MM)',
      width: 120,
    },
    {
      field: 'materials',
      i18nField: 'materialQuality',
      title: '材质成分',
      width: 120,
    },
    {
      field: 'purpose',
      i18nField: 'purpose',
      title: '用途',
      width: 120,
    },
    {
      field: 'dUnit',
      i18nField: 'declUnit',
      title: '申报单位',
      width: 120,
    },
    {
      field: 'legalUnit',
      i18nField: 'legalUnit',
      title: '法定单位',
      width: 120,
    },
    {
      field: 'originCountry',
      i18nField: 'originCountry',
      title: '原产国',
      width: 120,
    },
    {
      field: 'area',
      i18nField: 'area',
      title: '地区',
      width: 120,
    },
  ],
};
