import dayjs from 'dayjs';
import { getOrganization } from '/@/api/dashbord/operate';
import { getFieldValue } from '/@/views/dashboard/commonComponents/SearchForm/utils';
import { EFormItemType, TFormItemOption } from '/@/views/dashboard/commonComponents/SearchForm/types';
import { BaseVxeTableTypes } from '/@/views/dashboard/commonComponents/BaseVxeTable/types';

// 过滤条件配置
export const filterOptions: TFormItemOption[] = [
  { type: EFormItemType.INPUT, label: '厂区', default: '', key: 'orgName' },
  { type: EFormItemType.INPUT, label: '公司代码', default: '', key: 'bukrs' },
  { type: EFormItemType.INPUT, label: '公司名称', default: '', key: 'butxt' },
  { type: EFormItemType.INPUT, label: '订单号', default: '', key: 'aufnr' },
  { type: EFormItemType.INPUT, label: '截止关单日期', default: '', key: 'pBudat' },
  { type: EFormItemType.INPUT, label: '实际下达日期', default: '', key: 'ftrmi' },
  { type: EFormItemType.INPUT, label: '工厂', default: '', key: 'werks' },
  { type: EFormItemType.INPUT, label: '月份', default: '', key: 'zMonth' },
  { type: EFormItemType.INPUT, label: '销售凭证类型', default: '', key: 'auart' },
  { type: EFormItemType.INPUT, label: '短文本', default: '', key: 'txt' },
  { type: EFormItemType.INPUT, label: '对象状态', default: '', key: 'status' },
  { type: EFormItemType.INPUT, label: '物料编号', default: '', key: 'matnr' },
  { type: EFormItemType.INPUT, label: '物料描述', default: '', key: 'maktx' },
  { type: EFormItemType.INPUT, label: '计划下达日期', default: '', key: 'ftrms' },
  { type: EFormItemType.INPUT, label: '总订单数量', default: '', key: 'gamng' },
  { type: EFormItemType.INPUT, label: '基本计量单位', default: '', key: 'gmein' },
  { type: EFormItemType.INPUT, label: '实际开始日期', default: '', key: 'gstri' },
  { type: EFormItemType.INPUT, label: '技术完成日期', default: '', key: 'idat2' },
  { type: EFormItemType.INPUT, label: '对订单的MRP控制者', default: '', key: 'dispo' },
  { type: EFormItemType.INPUT, label: '控制者名称', default: '', key: 'dsnam' },
  { type: EFormItemType.INPUT, label: '首次领料日期', default: '', key: 'zidate' },
  { type: EFormItemType.INPUT, label: '业务范围', default: '', key: 'gsber' },
  { type: EFormItemType.INPUT, label: '业务部门描述', default: '', key: 'gtext' },
];

// 表单配置
export const formOptions: TFormItemOption[] = [
  {
    type: EFormItemType.TREE_SELECT,
    default: '',
    isOverrideDefault: true,
    key: 'orgCode',
    options: [],
    getOptions: async (params = {}) => {
      const { data } = await getOrganization(params);
      const list = data.list ?? data;
      const handleList = list.map(item => {
        return {
          id: getFieldValue(item, 'id'),
          parentId: getFieldValue(item, 'parent_Id'),
          value: getFieldValue(item, 'org_Code'),
          text: getFieldValue(item, 'org_Name'),
        };
      });
      return handleList;
    },
  },
  {
    type: EFormItemType.DATE_PICKER,
    default: dayjs().subtract(1, 'day'),
    key: 'date',
    getParam: value => {
      return { DatasourceTime: value.format('YYYY-MM-DD') };
    },
  },
];

// 表格字段配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    { title: '厂区', field: 'OrgName', width: 100 },
    { title: '公司代码', field: 'Bukrs', width: 100 },
    { title: '公司名称', field: 'Butxt', width: 150 },
    { title: '订单号', field: 'Aufnr', width: 120 },
    {
      title: '截止关单日期',
      field: 'PBudat',
      width: 120,
      formatter: ({ cellValue }) => {
        return dayjs(cellValue).format('YYYY-MM-DD');
      },
    },
    {
      title: '实际下达日期',
      field: 'Ftrmi',
      width: 120,
      formatter: ({ cellValue }) => {
        return dayjs(cellValue).format('YYYY-MM-DD');
      },
    },
    { title: '工厂', field: 'Werks', width: 100 },
    { title: '月份', field: 'ZMonth', width: 80 },
    { title: '销售凭证类型', field: 'Auart', width: 100 },
    { title: '短文本', field: 'Txt', width: 120 },
    { title: '对象状态', field: 'Status', width: 100 },
    { title: '物料编号', field: 'Matnr', width: 120 },
    { title: '物料描述', field: 'Maktx', width: 150 },
    {
      title: '计划下达日期',
      field: 'Ftrms',
      width: 120,
      formatter: ({ cellValue }) => {
        return dayjs(cellValue).format('YYYY-MM-DD');
      },
    },
    { title: '总订单数量', field: 'Gamng', width: 120 },
    { title: '基本计量单位', field: 'Gmein', width: 100 },
    {
      title: '实际开始日期',
      field: 'Gstri',
      width: 120,
      formatter: ({ cellValue }) => {
        return dayjs(cellValue).format('YYYY-MM-DD');
      },
    },
    {
      title: '技术完成日期',
      field: 'Idat2',
      width: 120,
      formatter: ({ cellValue }) => {
        return dayjs(cellValue).format('YYYY-MM-DD');
      },
    },
    { title: '对订单的MRP控制者', field: 'Dispo', width: 120 },
    { title: '控制者名称', field: 'Dsnam', width: 120 },
    {
      title: '首次领料日期',
      field: 'Zidate',
      width: 120,
      formatter: ({ cellValue }) => {
        return dayjs(cellValue).format('YYYY-MM-DD');
      },
    },
    { title: '业务范围', field: 'Gsber', width: 100 },
    { title: '业务部门描述', field: 'Gtext', width: 120 },
  ];
  return columns;
};
