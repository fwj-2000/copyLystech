import { useI18n } from '/@/hooks/web/useI18n';
import { PRODUCT_TYPE_ENUM } from '/@/views/engineering/filings/maintain/components/ApplyPopConfig';
import { getunitList } from '/@/api/common/constant';

const { t } = useI18n();

const StatusOptions = [
  { fullName: '否', id: 0 },
  { fullName: '是', id: 1 },
];

const StatusOptionsEn = [
  { fullName: 'No', id: 0 },
  { fullName: 'Yes', id: 1 },
];

/** 单位列表 */
export const unitList: Array<any> = [];
export async function loadUnitList() {
  return getunitList({ keyword: '' }).then(res => {
    const list = res.data || [];
    unitList.push(...list);
    return list;
  });
}

/** 外观列表（中文），取值字典`DieCutShipPattern` */
export const exteriorListZh: Array<any> = [
  {
    id: 'N',
    fullName: 'N',
  },
  {
    id: 'P',
    fullName: 'P',
  },
  {
    id: 'R',
    fullName: 'R',
  },
];

// FilingsLanguage 1 中英文  2 中文 3 英文
// const langList = [
//   {
//     id: 2,
//     fullName: t('common.zh'),
//   },
//   {
//     id: 3,
//     fullName: t('common.en'),
//   },
//   {
//     id: 1,
//     fullName: `${t('common.zh')}&${t('common.en')}`,
//   },
// ];
// 1 中文 2 英文
export const langOptions = [
  {
    id: 1,
    fullName: t('common.zh'),
  },
  {
    id: 2,
    fullName: t('common.en'),
  },
];

// 简表
export const descOptions = {
  column: { xs: 1, sm: 2, md: 4 },
  labelStyle: { color: '#999', fontSize: '14px' },
  contentStyle: { color: '#1A1A1A', fontSize: '14px' },
};
export const simpleColumn = [
  { title: '申请人', dataIndex: 'ApplyUserName', key: 'ApplyUserName' },
  { title: '申请部门', dataIndex: 'ApplyDeptName', key: 'ApplyDeptName' },
  {
    title: '申请日期',
    dataIndex: 'ApplyDate',
    key: 'ApplyDate',
    format: 'date|YYYY/MM/DD HH:mm',
  },
  { title: '创建人', dataIndex: 'GwApplyUserName', key: 'GwApplyUserName' },
  { title: '创建部门', dataIndex: 'GwApplyDeptName', key: 'GwApplyDeptName' },
  { title: '状态', dataIndex: 'StatusDesc', key: 'StatusDesc' },
  { title: '单据记录', dataIndex: 'GwDataRecord', key: 'GwDataRecord' },
];

export const columnOption = {
  InnerMaterialNumber: '',
  TerminalCustomerMaterialNumber: '',
  ProductArea: '',
  DirectCustomerName: '',
  FilingsLanguage: '',
  IsDeclareCustoms: 0,
  FilingsApplyTime: 0,
  Prot: '',
  ShipmentType: '',
  DutyId: '',
  DutyName: '',
};

// 产品类型
export const productDict = [
  {
    id: PRODUCT_TYPE_ENUM.胶类,
    fullName: '胶类',
  },
  {
    id: PRODUCT_TYPE_ENUM.铜箔类,
    fullName: '铜箔类',
  },
  {
    id: PRODUCT_TYPE_ENUM.其他类,
    fullName: '其他类',
  },
];

export const productDictEn = [
  {
    id: PRODUCT_TYPE_ENUM.胶类,
    fullName: 'Adhesives',
  },
  {
    id: PRODUCT_TYPE_ENUM.铜箔类,
    fullName: 'Copper Foil',
  },
  {
    id: PRODUCT_TYPE_ENUM.其他类,
    fullName: 'Others',
  },
];

// 工程
export const engieeColumn: any[] = [
  {
    title: '产品内部料号',
    dataIndex: 'InnerMaterialNumber',
    width: 240,
    maxLength: 24,
  },
  {
    title: '终端客户料号',
    dataIndex: 'TerminalCustomerMaterialNumber',
    width: 160,
  },
  {
    title: '直接客户名称',
    dataIndex: 'DirectCustomerName',
    width: 160,
  },
  {
    title: '生产厂区',
    dataIndex: 'ProductAreaName',
    width: 160,
  },
  { title: '直接客户料号', dataIndex: 'DirectCustomerMaterialNumber', width: 200 },
  { title: 'PM', dataIndex: 'PmName', width: 160 },
  { title: 'PD', dataIndex: 'DutyName', width: 160 },
  { title: '外观', dataIndex: 'Exterior', width: 120 },
  { title: '产品主要颜色', dataIndex: 'ProductColor', width: 120 },
  { title: '产品类型', dataIndex: 'ProductType', width: 120 },
  { title: '规格尺寸', dataIndex: 'SpecSize', width: 120 },
  { title: '厚度', dataIndex: 'Thickness', width: 120 },
  { title: '包装方式', dataIndex: 'PackType', width: 120 },
  { title: '包装数量', dataIndex: 'PackNumber', width: 120 },
  { title: '主材材质/成份比例', dataIndex: 'MaterialQuality', width: 120 },
  { title: '用途', dataIndex: 'UseDesc', width: 120 },
  { title: '功能原理', dataIndex: 'FunctionalPrinciple', width: 120 },
  {
    title: '是否单面自粘',
    dataIndex: 'IsSelfPaste',
    width: 120,
    customRender: ({ text }) => {
      if (text == null) {
        return '-';
      }
      return text == 1 ? t('common.yes') : t('common.no');
    },
  },
  {
    title: '是否单一主材',
    dataIndex: 'IsSingleMaterial',
    width: 120,
    customRender: ({ text }) => {
      if (text == null) {
        return '-';
      }
      return text == 1 ? t('common.yes') : t('common.no');
    },
  },
  {
    title: '单一主材原材料号',
    dataIndex: 'SingleMaterialNumber',
    width: 140,
    customRender: ({ text }) => {
      if (text == null) {
        return '-';
      }
      return text == 1 ? t('common.yes') : t('common.no');
    },
  },
  {
    title: '是否保密料号',
    dataIndex: 'IsSecrecyMaterial',
    width: 120,
    customRender: ({ text }) => {
      if (text == null) {
        return '-';
      }
      return text == 1 ? t('common.yes') : t('common.no');
    },
  },
  { title: '保密料号单重', dataIndex: 'SecrecyMaterialWeight', width: 120 },
  { title: '重量单位', dataIndex: 'WeightUnit', width: 120 },
];

// 生产
export const productionColumn: any[] = [
  {
    title: '产品内部料号',
    dataIndex: 'InnerMaterialNumber',
    width: 240,
  },
  {
    title: '终端客户料号',
    dataIndex: 'TerminalCustomerMaterialNumber',
    width: 160,
  },
  {
    title: '直接客户名称',
    dataIndex: 'DirectCustomerName',
    width: 160,
    compType: 'Select',
    mode: 'customer',
    optionsName: 'customerList',
    placeholder: t('common.inputText'),
  },
  { title: '直接客户料号', dataIndex: 'DirectCustomerMaterialNumber', width: 200 },
  {
    title: '称重时间',
    dataIndex: 'WeighTime',
    width: 160,
    format: 'date|YYYY-MM-DD',
  },
  {
    title: '称重负责人',
    dataIndex: 'WeighPersonName',
    width: 160,
  },
  { title: '纯产品单重（KG）', dataIndex: 'ProductWeight', width: 120 },
  { title: '纯产品总重量（G）', dataIndex: 'ProductTotalWeight', width: 120 },
  { title: '纯产品称重数量（PCS）', dataIndex: 'ProductQty', width: 160 },
  { title: '带衬背称重数量（PCS）', dataIndex: 'BackProductQty', width: 120 },
  { title: '带衬背总重量（KG）', dataIndex: 'BackProductTotalWeight', width: 120 },
  { title: '带衬背单重（KG）', dataIndex: 'BackProductWeight', width: 120 },
  { title: '废料单重（KG）', dataIndex: 'WasteWeight', width: 120 },
  { title: '关务领料人', dataIndex: 'CustomsPickingName', width: 120 },
  { title: '关务领料数量', dataIndex: 'PickingQty', width: 120 },
  { title: '关务领料时间', dataIndex: 'CustomsPickingTime', width: 120, format: 'date|YYYY-MM-DD' },
  { title: '样品条数（条）', dataIndex: 'SampleRowNumber', width: 120 },
  { title: '样品份数（份）', dataIndex: 'SampleCopiesNumber', width: 120 },
  { title: '生产备注', dataIndex: 'ProduceRmk', width: 120 },
];
export const productionImgCol: any[] = [
  {
    title: '纯产品称重图片',
    dataIndex: 'ProductWeightPicture',
    width: 140,
    compType: 'img',
  },
  {
    title: '带衬背称重图片',
    dataIndex: 'BackProductWeightPicture',
    width: 140,
    compType: 'img',
  },
  {
    title: '产品实物图片',
    dataIndex: 'ProductPicture',
    width: 140,
    compType: 'img',
  },
];

// 生产
export const productionFormConfig: any[] = [
  {
    label: '带衬背数量(PCS): ',
    field: 'backProductQty',
    component: 'Input',
    componentProps: {
      placeholder: '',
      disabled: true,
    },
  },
  {
    label: '带衬背总重量（KG）:',
    field: 'backProductTotalWeight',
    component: 'Input',
    componentProps: {
      placeholder: '',
      disabled: true,
    },
  },
  {
    label: '带衬背单重（KG）:',
    field: 'backProductWeight',
    component: 'Input',
    componentProps: {
      placeholder: '',
      disabled: true,
    },
  },
  {
    label: '纯产品数量(PCS):',
    field: 'productQty',
    component: 'Input',
    componentProps: {
      placeholder: '',
      disabled: true,
    },
  },
  {
    label: '纯产品总重量（G）:',
    field: 'productTotalWeight',
    component: 'Input',
    componentProps: {
      placeholder: '',
      disabled: true,
    },
  },
  {
    label: '纯产品单重（KG）:',
    field: 'productWeight',
    component: 'Input',
    componentProps: {
      placeholder: '',
      disabled: true,
    },
  },
  {
    label: '废料单重（KG）:',
    field: 'wasteWeight',
    component: 'Input',
    componentProps: {
      placeholder: '',
      disabled: true,
    },
  },
  {
    label: '备注:',
    field: 'produceRmk',
    component: 'Textarea',
    colProps: { span: 16 },
    componentProps: {
      placeholder: '',
      rows: 1,
      disabled: true,
      // showCount: true,
      // maxlength: 200,
    },
  },
];

// 工程
export const updateEngineerFormConfig = (lang = 1) => {
  const optionList = lang == 1 ? StatusOptions : StatusOptionsEn; // 1中文 2英文
  const productionList = lang == 1 ? productDict : productDictEn; // 1中文 2英文
  const exteriorList = exteriorListZh;
  return [
    {
      label: '外观:',
      field: 'exterior',
      component: 'Select',
      componentProps: {
        placeholder: '',
        disabled: true,
        showArrow: false,
        options: exteriorList,
      },
    },
    {
      label: '品名:',
      field: 'goodsName',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      label: '产品主要颜色:',
      field: 'productColor',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      label: '产品类型:',
      field: 'productType',
      component: 'Select',
      componentProps: {
        placeholder: '',
        disabled: true,
        showArrow: false,
        options: productionList,
      },
    },
    {
      label: '最小包装方式:',
      field: 'minPackingMode',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      label: '最小包装数量:',
      field: 'minPackingQty',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      label: '金属箔厚度(mm):',
      field: 'thickness',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      label: '规格尺寸(MM):',
      field: 'specSize',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    // {
    //   label: '单位:',
    //   field: 'sizeUnit',
    //   component: 'Select',
    //   componentProps: {
    //     disabled: true,
    //     showArrow: false,
    //     options: unitList,
    //     fieldNames: { label: 'Name', value: 'Code' },
    //   },
    // },
    {
      label: '产品结构:',
      field: 'productMix',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
        rows: 1,
        autoSize: true,
      },
      colProps: { span: 24 },
    },
    {
      label: '主材材质/成份比例:',
      field: 'materialQuality',
      component: 'Textarea',
      componentProps: {
        placeholder: '',
        disabled: true,
        rows: 1,
        autoSize: true,
      },
      colProps: { span: 24 },
    },
    {
      label: '用途:',
      field: 'purpose',
      component: 'Textarea',
      componentProps: {
        placeholder: '',
        disabled: true,
        rows: 1,
        autoSize: true,
      },
      colProps: { span: 24 },
    },
    {
      label: '功能原理:',
      field: 'functionalPrinciple',
      component: 'Textarea',
      componentProps: {
        placeholder: '',
        disabled: true,
        rows: 1,
        autoSize: true,
      },
      colProps: { span: 24 },
    },
    {
      label: '是否单面自粘:',
      field: 'isSelfPaste',
      component: 'Select',
      componentProps: {
        placeholder: '',
        disabled: true,
        showArrow: false,
        options: optionList,
      },
    },
    {
      label: '是否为保密料号:',
      field: 'isSecrecyMaterial',
      component: 'Select',
      componentProps: {
        placeholder: '',
        disabled: true,
        showArrow: false,
        options: optionList,
      },
    },
    {
      label: '保密料号单重:',
      field: 'secrecyMaterialWeight',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    // {
    //   label: '重量单位:',
    //   field: 'weightUnit',
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: '',
    //     disabled: true,
    //   },
    // },
    {
      label: '是否设变:',
      field: 'isSetChange',
      component: 'Select',
      componentProps: {
        placeholder: '',
        disabled: true,
        showArrow: false,
        options: optionList,
      },
    },
    {
      label: '主材材料八码:',
      field: 'shortMaterialCodes',
      component: 'Input',
      slot: 'shortMaterialCodes',
      colProps: { span: 24 },
    },
    {
      label: '原厂商型号',
      field: 'singleMaterialNumbers',
      i18nField: 'singleMaterialNumber',
      colProps: { span: 24 },
      component: 'Input',
      slot: 'singleMaterialNumbers',
    },
    {
      label: '备注:',
      field: 'engineeringRmk',
      component: 'Textarea',
      colProps: { span: 24 },
      componentProps: {
        placeholder: '',
        rows: 2,
        disabled: true,
        // showCount: true,
        // maxlength: 200,
      },
    },
  ] as any[];
};

export const imageTableColumn: any[] = [
  {
    title: t('common.imageName'),
    dataIndex: 'fileName',
  },
  {
    title: t('component.upload.time'),
    dataIndex: 'uploadDate',
    width: 80,
    format: 'date|YYYY-MM-DD HH:mm:ss',
  },
  {
    title: t('component.upload.user'),
    dataIndex: 'uploadUserName',
    width: 100,
  },
];

export const filingApplyColumn: any[] = [
  { title: '备案需求单号', dataIndex: 'FilingsApplyNo', width: 200 },
  { title: '产品内部料号', dataIndex: 'InnerMaterialNumber', width: 240 },
  { title: '生产厂区', dataIndex: 'ProductAreaName', width: 160 },
  { title: '出货方式', dataIndex: 'ShipmentTypeDesc', width: 160 },
  { title: '出货备案法人', dataIndex: 'SellCorporation', width: 160 },
  { title: '备案语言', dataIndex: 'FilingsLanguageDesc', width: 160 },
  { title: '直接客户料号', dataIndex: 'DirectCustomerMaterialNumber', width: 160 },
  { title: '终端客户料号', dataIndex: 'TerminalCustomerMaterialNumber', width: 160 },
  { title: '直接客户名称', dataIndex: 'DirectCustomerName', width: 160 },
  { title: '申请备案时间', dataIndex: 'FilingsApplyTime', width: 160 },
  { title: 'PD', dataIndex: 'DutyName', width: 160 },
  { title: '生产维护人', dataIndex: 'ScApplyUserName', width: 160 },
  { title: '外观', dataIndex: 'Exterior', width: 160 },
  { title: '品名', dataIndex: 'GoodsName', width: 160 },
  { title: '产品主要颜色', dataIndex: 'ProductColor', width: 160 },
  { title: '产品类型', dataIndex: 'ProductType', width: 160 },
  { title: '最小包装方式', dataIndex: 'MinPackingMode', width: 160 },
  { title: '最小包装数量', dataIndex: 'MinPackingQty', width: 160 },
  { title: '金属箔厚度(mm)', dataIndex: 'Thickness', width: 160 },
  { title: '规格尺寸(MM)', dataIndex: 'SpecSize', width: 160 },
  { title: '单位', dataIndex: 'SizeUnit', width: 160 },
  { title: '主材材质/成份比例', dataIndex: 'MaterialQuality', width: 160 },
  { title: '用途', dataIndex: 'UseDesc', width: 160 },
  { title: '功能原理', dataIndex: 'FunctionalPrinciple', width: 160 },
  { title: '是否单面自粘', dataIndex: 'IsSelfPaste', width: 160 },
  { title: '是否单一主材', dataIndex: 'IsSingleMaterial', width: 160 },
  { title: '单一主材原材料号', dataIndex: 'SingleMaterialNumber', width: 160 },
  { title: '是否为保密料号', dataIndex: 'IsSecrecyMaterial', width: 160 },
  { title: '保密料号单重', dataIndex: 'SecrecyMaterialWeight', width: 160 },
  { title: '重量单位', dataIndex: 'WeightUnit', width: 160 },
  { title: '是否设变', dataIndex: 'IsSetChange', width: 160 },
  { title: '工程备注', dataIndex: 'EngineeringRmk', width: 160 },
  { title: '带衬背数量', dataIndex: 'BackProductQty', width: 160 },
  { title: '带衬背总重量', dataIndex: 'BackProductTotalWeight', width: 160 },
  { title: '带衬背单重', dataIndex: 'BackProductWeight', width: 160 },
  { title: '纯产品数量', dataIndex: 'ProductQty', width: 160 },
  { title: '纯产品总重量', dataIndex: 'ProductTotalWeight', width: 160 },
  { title: '纯产品单重', dataIndex: 'ProductWeight', width: 160 },
  { title: '废料单重', dataIndex: 'WasteWeight', width: 160 },
  { title: '生产备注', dataIndex: 'ProduceRmk', width: 160 },
];
