import dayjs from 'dayjs';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

// 简表
export const simpleColumn = [
  // { title: '来源单号', dataIndex: 'SourceNo' },
  { title: '申请人', dataIndex: 'ApplyUserName', key: 'ApplyUserName' },
  { title: '申请部门', dataIndex: 'ApplyDeptName', key: 'ApplyDeptName' },
  {
    title: '申请日期',
    dataIndex: 'ApplyDate',
    key: 'ApplyDate',
    format: text => {
      return text ? dayjs(Number(text)).format('YYYY/MM/DD') : '-';
    },
  },
];

export const columnOption = {
  FilingsBillNo: '',
  ExportType: '',
  GoodsName: '',
  GoodsCode: '',
  DeclElements: '',
  DeclUnit: '',
  LegalUnit: '',
  Prot: '',
  OriginCountry: '',
  Region: '',
  ProjectName: '',
  CustomerMaterialNumber: '',
  ApplySpec: '',
  Weight: '',
  CustomersId: '',
  CustomersName: '',
  MaterialQuality: '',
  DirectCustomerName: '',
  UseDesc: '',
};

// 关务
export const affairColumn = [
  { title: '备案单号', dataIndex: 'FilingsBillNo', sorter: true, width: 180, compType: 'Input' },
  { title: '出口类型', dataIndex: 'ExportType', sorter: true, width: 80 },
  { title: '客户备案品名', dataIndex: 'GoodsName', sorter: true, width: 140, compType: 'Input' },
  { title: '客户商品编码', dataIndex: 'GoodsCode', sorter: true, width: 140, compType: 'Input' },
  { title: '申报要素', dataIndex: 'DeclElements', width: 140, compType: 'Input' },
  { title: '内部料号', dataIndex: 'InnerMaterialNumber', sorter: true, width: 230 },
  { title: '申报单位', dataIndex: 'DeclUnit', sorter: true, width: 140, compType: 'Input' },
  { title: '法定单位', dataIndex: 'LegalUnit', sorter: true, width: 150, compType: 'Input' },
  { title: '原产国', dataIndex: 'OriginCountry', sorter: true, width: 100, compType: 'Input' },
  { title: '地区', dataIndex: 'Region', sorter: true, width: 150, compType: 'Input' },
  { title: '项目', dataIndex: 'ProjectName', sorter: true, width: 150, compType: 'Input' },
  { title: '客户料号', dataIndex: 'CustomerMaterialNumber', width: 150, sorter: true, compType: 'Input' },
  { title: '备案规格', dataIndex: 'ApplySpec', width: 150, sorter: true, compType: 'Input' },
  { title: '单重（KG）', dataIndex: 'Weight', width: 150, sorter: true, compType: 'Input' },
  // { title: '客服', dataIndex: 'CustomersId', extraKey: 'CustomersName', width: 150, sorter: true, compType: 'UserSelect' },
  // { title: '备案人员', dataIndex: 'ApplyUserId', extraKey: 'ApplyUserName', width: 150, sorter: true, compType: 'UserSelect' },
  {
    title: '申请日期',
    dataIndex: 'ApplyDate',
    key: 'ApplyDate',
    width: 120,
    compType: 'Date',
  },
  { title: '材质成分', dataIndex: 'MaterialQuality', width: 150, sorter: true, compType: 'Input' },
  { title: '客户', dataIndex: 'DirectCustomerName', width: 150, sorter: true, compType: 'Select' },
  { title: '口岸', dataIndex: 'Prot', width: 150, sorter: true, compType: 'Select' },
  { title: '用途', dataIndex: 'UseDesc', width: 150, sorter: true, compType: 'Input' },
];

// { title: '单据记录', dataIndex: 'DataRecord', compType: 'Input' },
export const fieldCol = [
  { title: '申请类型', dataIndex: 'applyType', compType: 'Input' },
  { title: '工厂别', dataIndex: 'factory', compType: 'Input' },
  { title: '检疫代码', dataIndex: 'quarantineCode', compType: 'Input' },
  { title: '原产地1', dataIndex: 'originRegion', compType: 'Input' },
  { title: '原产地2', dataIndex: 'originRegion2', compType: 'Input' },
  { title: '原产地3', dataIndex: 'originRegion3', compType: 'Input' },
  { title: '计重数量', dataIndex: 'weightQuantity', compType: 'Input' },
  { title: '供应商代码', dataIndex: 'supplierCode', compType: 'Input' },
  { title: '供应商名称', dataIndex: 'supplierName', compType: 'Input' },
  { title: '制造商', dataIndex: 'manufacturer', compType: 'Input' },
  { title: '申报要素序号', dataIndex: 'declElementsNumber', compType: 'Input' },
  { title: '申报要素项目', dataIndex: 'declElementsItem', compType: 'Input' },
  { title: '申报要素值', dataIndex: 'declElementsValue', compType: 'Input' },
  // { title: '申报要素序号', dataIndex: 'declElementsNumber1', compType: 'Input' },
  // { title: '申报要素项目', dataIndex: 'declElementsItem1', compType: 'Input' },
  // { title: '申报要素值', dataIndex: 'declElementsValue1', compType: 'Input' },
  // { title: '申报要素序号', dataIndex: 'declElementsNumber2', compType: 'Input' },
  // { title: '申报要素项目', dataIndex: 'declElementsItem2', compType: 'Input' },
  // { title: '申报要素值', dataIndex: 'declElementsValue2', compType: 'Input' },
  // { title: '申报要素序号', dataIndex: 'declElementsNumber3', compType: 'Input' },
  // { title: '申报要素项目', dataIndex: 'declElementsItem3', compType: 'Input' },
  // { title: '申报要素值', dataIndex: 'declElementsValue3', compType: 'Input' },
  // { title: '申报要素序号', dataIndex: 'declElementsNumber4', compType: 'Input' },
  // { title: '申报要素项目', dataIndex: 'declElementsItem4', compType: 'Input' },
  // { title: '申报要素值', dataIndex: 'declElementsValue4', compType: 'Input' },
  // { title: '申报要素序号', dataIndex: 'declElementsNumber5', compType: 'Input' },
  // { title: '申报要素项目', dataIndex: 'declElementsItem5', compType: 'Input' },
  // { title: '申报要素值', dataIndex: 'declElementsValue5', compType: 'Input' },
  // { title: '申报要素序号', dataIndex: 'declElementsNumber6', compType: 'Input' },
  // { title: '申报要素项目', dataIndex: 'declElementsItem6', compType: 'Input' },
  // { title: '申报要素值', dataIndex: 'declElementsValue6', compType: 'Input' },
  // { title: '申报要素序号', dataIndex: 'declElementsNumber7', compType: 'Input' },
  // { title: '申报要素项目', dataIndex: 'declElementsItem7', compType: 'Input' },
  // { title: '申报要素值', dataIndex: 'declElementsValue7', compType: 'Input' },
  // { title: '申报要素序号', dataIndex: 'declElementsNumber8', compType: 'Input' },
  // { title: '申报要素项目', dataIndex: 'declElementsItem8', compType: 'Input' },
  // { title: '申报要素值', dataIndex: 'declElementsValue8', compType: 'Input' },
  // { title: '申报要素序号', dataIndex: 'declElementsNumber9', compType: 'Input' },
  // { title: '申报要素项目', dataIndex: 'declElementsItem9', compType: 'Input' },
  // { title: '申报要素值', dataIndex: 'declElementsValue9', compType: 'Input' },
  // { title: '申报要素序号', dataIndex: 'declElementsNumber10', compType: 'Input' },
  // { title: '申报要素项目', dataIndex: 'declElementsItem10', compType: 'Input' },
  // { title: '申报要素值', dataIndex: 'declElementsValue10', compType: 'Input' },
  // { title: '申报要素序号', dataIndex: 'declElementsNumber11', compType: 'Input' },
  // { title: '申报要素项目', dataIndex: 'declElementsItem11', compType: 'Input' },
  // { title: '申报要素值', dataIndex: 'declElementsValue11', compType: 'Input' },
  // { title: '申报要素序号', dataIndex: 'declElementsNumber12', compType: 'Input' },
  // { title: '申报要素项目', dataIndex: 'declElementsItem12', compType: 'Input' },
  // { title: '申报要素值', dataIndex: 'declElementsValue12', compType: 'Input' },
  // { title: '申报要素序号', dataIndex: 'declElementsNumber13', compType: 'Input' },
  // { title: '申报要素项目', dataIndex: 'declElementsItem13', compType: 'Input' },
  // { title: '申报要素值', dataIndex: 'declElementsValue13', compType: 'Input' },
  { title: '是否有磁性', dataIndex: 'isMagnetic', compType: 'Input' },
  { title: '产品别', dataIndex: 'product', compType: 'Input' },
  { title: '规格', dataIndex: 'specifications', compType: 'Input' },
  { title: '项号', dataIndex: 'itemNo', compType: 'Input' },
  { title: '申报要素附加信息', dataIndex: 'declElementsAttach', compType: 'Input' },
  { title: '使用阶段', dataIndex: 'usageStage', compType: 'Input' },
  { title: '结构组成', dataIndex: 'structuralComposition', compType: 'Input' },
  { title: '功能', dataIndex: 'functional', compType: 'Input' },
  { title: '原理', dataIndex: 'principle', compType: 'Input' },
  { title: '分机', dataIndex: 'extensions', compType: 'Input' },
  { title: '状态描述', dataIndex: 'statusDesc', compType: 'Input' },
  { title: '企业代码', dataIndex: 'enterpriseCode', compType: 'Input' },
  { title: '账册', dataIndex: 'accountBook', compType: 'Input' },
  { title: '旧机种类似料号', dataIndex: 'oldSimilarMaterialNumber', compType: 'Input' },
  { title: '供应商CIQ', dataIndex: 'supplierCiq', compType: 'Input' },
  { title: '厂商出货模式', dataIndex: 'shippingMode', compType: 'Input' },
  { title: '参考单价', dataIndex: 'price', compType: 'Input' },
  { title: '币别', dataIndex: 'currency', compType: 'Input' },
  { title: '品牌', dataIndex: 'brand', compType: 'Input' },
  { title: '品牌类型', dataIndex: 'brandType', compType: 'Input' },
  { title: '供应商材料编码', dataIndex: 'modelNo', compType: 'Input' },
  { title: 'OEmPN', dataIndex: 'oempn', compType: 'Input' },
  { title: '配件', dataIndex: 'parts', compType: 'Input' },
  { title: '序号', dataIndex: 'serialNo', compType: 'Input' },
  { title: '采购员', dataIndex: 'buyer', compType: 'Input' },
  { title: '商品名称（越南语）', dataIndex: 'goodsNameVietnamese', compType: 'Input' },
  { title: '用途(越南语)', dataIndex: 'useDescVietnamese', compType: 'Input' },
  { title: '材质(越南语)', dataIndex: 'materialQualityVietnamese', compType: 'Input' },
  { title: '功率', dataIndex: 'powers', compType: 'Input' },
  { title: '设备额定电压Rated voltage of product/电压', dataIndex: 'voltage', compType: 'Input' },
  { title: '申报要素（越南语）', dataIndex: 'declElementsVietnamese', compType: 'Input' },
  { title: '产品实物图片', dataIndex: 'productPicture', compType: 'img' },
  { title: '标签图片', dataIndex: 'labelPicture', compType: 'img' },
  { title: '建料号责任工程师', dataIndex: 'engineerDri', compType: 'Input' },
  { title: '对应机种专案', dataIndex: 'whichModels', compType: 'Input' },
  { title: '料号用途', dataIndex: 'materialNumberUse', compType: 'Input' },
  { title: '是否随成品一起出货', dataIndex: 'isFinishProductShipment', compType: 'Input' },
  { title: '是否成品BOM料', dataIndex: 'isFinishProductBom', compType: 'Input' },
  { title: '替代料号', dataIndex: 'replaceMaterialNumber', compType: 'Input' },
  { title: '商品名称（中文）', dataIndex: 'goodsNameCn', compType: 'Input' },
  { title: '商品名称（英文）', dataIndex: 'goodsNameEn', compType: 'Input' },
  { title: 'BG', dataIndex: 'bg', compType: 'Input' },
  { title: '项目代码', dataIndex: 'projectCode', compType: 'Input' },
  { title: '指定归类人员', dataIndex: 'approvalUserZd', compType: 'Input' },
  { title: '成分(中文)', dataIndex: 'component', compType: 'Input' },
  { title: '成分(越文)', dataIndex: 'componentVietnamese', compType: 'Input' },
  { title: '是否替代料', dataIndex: 'isReplaceMaterial', compType: 'Input' },
  { title: '组成部件(中文)', dataIndex: 'componentParts', compType: 'Input' },
  { title: '组成部件(越文)', dataIndex: 'componentPartsVietnamese', compType: 'Input' },
  { title: 'ERP单位', dataIndex: 'erpUnit', compType: 'Input' },
  { title: '单位换算关系', dataIndex: 'unitConvertRelation', compType: 'Input' },
  { title: '规格型号数量', dataIndex: 'specificationsNumber', compType: 'Input' },
  { title: '规格型号单位', dataIndex: 'specificationsUnit', compType: 'Input' },
  { title: '功能(越南语)', dataIndex: 'functionalVietnamese', compType: 'Input' },
  { title: '原理(越南语)', dataIndex: 'principleVietnamese', compType: 'Input' },
  { title: '是否用电', dataIndex: 'isUserElectric', compType: 'Input' },
  { title: '包装规格', dataIndex: 'packSpecifications', compType: 'Input' },
  { title: '单价(USD)', dataIndex: 'priceUsd', compType: 'Input' },
  { title: '机种', dataIndex: 'machineType', compType: 'Input' },
  { title: '工程', dataIndex: 'engineering', compType: 'Input' },
  { title: '关务部门', dataIndex: 'customsDepartment', compType: 'Input' },
  { title: '加工工艺', dataIndex: 'processTechnology', compType: 'Input' },
  { title: '技术参数', dataIndex: 'technicalParameter', compType: 'Input' },
];
// { title: '带衬背单重(KG)', dataIndex: 'BackProductWeight' },
// { title: '纯产品单重(KG)', dataIndex: 'ProductWeight' },
// { title: '终端客户料号', dataIndex: 'TerminalCustomerMaterialNumber' },
// { title: '废料单重(KG)', dataIndex: 'WasteWeight' },
// { title: '产品描述', dataIndex: 'ProductDesc' },

export const descOptions = {
  column: { xs: 1, sm: 2, md: 4 },
  labelStyle: { color: '#999', fontSize: '14px' },
  contentStyle: { color: '#1A1A1A', fontSize: '14px' },
};

export const simpleDesc = [
  {
    title: '备案单号',
    dataIndex: 'FilingsBillNo',
  },
  {
    title: '备案需求单号',
    dataIndex: 'FilingsApplyNo',
  },
  {
    title: '备案人',
    dataIndex: 'ApplyUserName',
  },
  {
    title: '备案部门',
    dataIndex: 'ApplyDeptName',
  },
  {
    title: '备案时间',
    dataIndex: 'ApplyDate',
    format: 'date|YYYY-MM-DD HH:MM',
  },
  {
    title: '状态',
    dataIndex: 'StatusName',
  },
  {
    title: '单据记录',
    dataIndex: 'DataRecord',
  },
  {
    title: '客户回复',
    dataIndex: 'ReplyStatusDesc',
  },
  {
    title: '审核意见',
    dataIndex: 'AuditRemark',
  },
];

export const getBaseFormConfig: any = bool => {
  console.log(bool, 'bool');
  return [
    {
      label: '产品内部料号：',
      field: 'InnerMaterialNumber',
      component: 'Input',
      componentProps: {
        placeholder: '/',
        disabled: bool,
      },
    },
    {
      label: '项目名称',
      field: 'ProjectName',
      component: 'Input',
      componentProps: {
        placeholder: '/',
        disabled: bool,
      },
    },
    {
      label: '客户料号',
      field: 'CustomerMaterialNumber',
      component: 'Input',
      componentProps: {
        placeholder: '/',
        disabled: bool,
      },
    },
    {
      label: '客户备案品名',
      field: 'GoodsName',
      component: 'Input',
      componentProps: {
        placeholder: '/',
        disabled: bool,
      },
    },
    {
      label: '规格尺寸',
      field: 'SpecDimensions',
      component: 'Input',
      componentProps: {
        placeholder: '/',
        disabled: bool,
      },
    },
    {
      label: '客户商品编码',
      field: 'GoodsCode',
      component: 'Input',
      componentProps: {
        placeholder: '/',
        disabled: bool,
      },
    },
    {
      label: '客户备案单重(KG)',
      field: 'Weight',
      component: 'Input',
      componentProps: {
        placeholder: '/',
        disabled: bool,
      },
    },
    {
      label: '申报要素',
      field: 'DeclElements',
      component: 'Input',
      componentProps: {
        placeholder: '/',
        disabled: bool,
      },
    },
    {
      label: '客户',
      field: 'DirectCustomerName',
      component: 'Input',
      componentProps: {
        placeholder: '/',
        disabled: bool,
      },
    },
    {
      label: '口岸',
      field: 'Prot',
      component: 'Input',
      componentProps: {
        placeholder: '/',
        disabled: bool,
      },
    },
    {
      label: '申报单位',
      field: 'DeclUnit',
      component: 'Input',
      componentProps: {
        placeholder: '/',
        disabled: bool,
      },
    },
    {
      label: '法定单位',
      field: 'LegalUnit',
      component: 'Input',
      componentProps: {
        placeholder: '/',
        disabled: bool,
      },
    },
    {
      label: '客服',
      field: 'CustomersName',
      component: 'Input',
      componentProps: {
        placeholder: '/',
        disabled: bool,
      },
    },
    {
      label: '材质成分',
      field: 'MaterialQuality',
      component: 'Input',
      componentProps: {
        placeholder: '/',
        disabled: bool,
      },
    },
    {
      label: '原产国',
      field: 'OriginCountry',
      component: 'Input',
      componentProps: {
        placeholder: '/',
        disabled: bool,
      },
    },
    {
      label: '境内货源地',
      field: 'GoodDomesticSource',
      component: 'Input',
      componentProps: {
        placeholder: '/',
        disabled: bool,
      },
    },
    {
      label: '备案人',
      field: 'ApplyUserName',
      component: 'Input',
      componentProps: {
        placeholder: '/',
        disabled: bool,
      },
    },
    {
      label: '备案时间',
      field: 'ApplyDate',
      component: 'DatePicker',
      componentProps: {
        placeholder: '/',
        disabled: bool,
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      label: '备注',
      field: 'Remark',
      component: 'Textarea',
      colProps: { span: 8 },
      componentProps: {
        placeholder: '/',
        rows: 1,
        showCount: true,
        maxlength: 200,
        disabled: bool,
        autoSize: { minRows: 2, maxRows: 5 },
      },
    },
  ];
};

export const outboundFormConfig: any = [
  {
    label: '产品内部料号：',
    field: 'InnerMaterialNumber',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '品名',
    field: 'GoodsName',
    component: 'Input',
    componentProps: {
      placeholder: '/',
    },
  },
  {
    label: '商编',
    field: 'GoodsCode',
    component: 'Input',
    componentProps: {
      placeholder: '/',
    },
  },
  {
    label: 'CIQ代码',
    field: 'CIQCode',
    component: 'Input',
    componentProps: {
      placeholder: '/',
    },
  },
  {
    label: '单重(KG)',
    field: 'Weight',
    component: 'Input',
    componentProps: {
      placeholder: '/',
    },
  },
  {
    label: '申报要素',
    field: 'DeclElements',
    component: 'Input',
    componentProps: {
      placeholder: '/',
    },
  },
  {
    label: '备案规格(MM)',
    field: 'DeclElements',
    component: 'Input',
    componentProps: {
      placeholder: '/',
    },
  },
  {
    label: '成分材质',
    field: 'MaterialQuality',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '用途',
    field: 'UseDesc',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '申报单位',
    field: 'DeclUnit',
    component: 'Input',
    componentProps: {
      placeholder: '/',
    },
  },
  {
    label: '法定单位',
    field: 'LegalUnit',
    component: 'Input',
    componentProps: {
      placeholder: '/',
    },
  },
  {
    label: '原产国',
    field: 'OriginCountry',
    component: 'Input',
    componentProps: {
      placeholder: '/',
    },
  },
  {
    label: '地区',
    field: 'Region',
    component: 'Input',
    componentProps: {
      placeholder: '/',
    },
  },
  {
    label: '客服',
    field: 'CustomersName',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '备案人',
    field: 'ApplyUserName',
    component: 'Input',
    componentProps: {
      placeholder: '/',
      disabled: true,
    },
  },
  {
    label: '备案时间',
    field: 'ApplyDate',
    component: 'DatePicker',
    componentProps: {
      placeholder: '/',
      disabled: true,
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    label: '备注',
    field: 'Remark',
    component: 'Textarea',
    colProps: { span: 16 },
    componentProps: {
      placeholder: '/',
      rows: 1,
      showCount: true,
      maxlength: 200,
    },
  },
];
