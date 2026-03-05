import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

// 简表
export const simpleColumn = [
  { title: '申请人', dataIndex: 'ApplyUserName', key: 'ApplyUserName' },
  { title: '申请部门', dataIndex: 'ApplyDeptName', key: 'ApplyDeptName' },
  {
    title: '申请日期',
    dataIndex: 'ApplyDate',
    formatter: 'date|YYYY/MM/DD HH:mm',
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
  { title: '备案单号', dataIndex: 'FilingsBillNo', sorter: true, width: 150, compType: 'Input' },
  { title: '产品内部料号', dataIndex: 'InnerMaterialNumber', sorter: true, width: 240 },
  { title: '出口类型', dataIndex: 'ExportTypeDesc', sorter: true, width: 120 },
  { title: '客户备案品名', dataIndex: 'GoodsName', sorter: true, width: 100, compType: 'Input' },
  { title: '客户商品编码', dataIndex: 'GoodsCode', sorter: true, width: 100, compType: 'Input' },
  { title: '申报要素', dataIndex: 'DeclElements', key: 'DeclElements', width: 120, compType: 'Input' },
  { title: '申报单位', dataIndex: 'DeclUnit', sorter: true, width: 100, compType: 'Input' },
  { title: '法定单位', dataIndex: 'LegalUnit', sorter: true, width: 150, compType: 'Input' },
  { title: '原产国', dataIndex: 'OriginCountry', sorter: true, width: 100, compType: 'Input' },
  { title: '地区', dataIndex: 'Region', sorter: true, width: 150, compType: 'Input' },
  { title: '项目', dataIndex: 'ProjectName', sorter: true, width: 150, compType: 'Input' },
  { title: '客户料号', dataIndex: 'CustomerMaterialNumber', key: 'CustomerMaterialNumber', width: 150, sorter: true, compType: 'Input' },
  { title: '备案规格', dataIndex: 'ApplySpec', key: 'ApplySpec', width: 150, sorter: true, compType: 'Input' },
  { title: '单重（KG）', dataIndex: 'Weight', key: 'Weight', width: 150, sorter: true, compType: 'Input' },
  { title: '客服', dataIndex: 'CustomersName', extraKey: 'CustomersName', width: 150, sorter: true, compType: 'UserSelect' },
  { title: '备案人员', dataIndex: 'ApplyUserName', extraKey: 'ApplyUserName', width: 150, sorter: true, compType: 'UserSelect' },
  {
    title: '备案日期',
    dataIndex: 'ApplyDate',
    key: 'ApplyDate',
    width: 120,
    compType: 'Date',
  },
  { title: '材质成分', dataIndex: 'MaterialQuality', key: 'MaterialQuality', width: 150, sorter: true, compType: 'Input' },
  { title: '客户', dataIndex: 'DirectCustomerName', key: 'DirectCustomerName', width: 150, sorter: true, compType: 'Select' },
  { title: '口岸', dataIndex: 'Prot', key: 'Prot', width: 150, sorter: true, compType: 'Select' },
  { title: '用途', dataIndex: 'UseDesc', key: 'UseDesc', width: 150, sorter: true, compType: 'Input' },
];

export const descOptions = {
  column: { xs: 1, sm: 2, md: 4 },
  labelStyle: { color: '#999', fontSize: '14px' },
  contentStyle: { color: '#1A1A1A', fontSize: '14px' },
};
// 简表
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
    title: '申请人',
    dataIndex: 'ApplyUserName',
  },
  {
    title: '申请部门',
    dataIndex: 'ApplyDeptName',
  },
  {
    title: '申请备案时间',
    dataIndex: 'ApplyDate',
    format: 'date|YYYY-MM-DD HH:MM',
  },
  {
    title: '状态',
    dataIndex: 'StatusName',
  },
  {
    title: '回复状态',
    dataIndex: 'ReplyStatusDesc',
  },
];
