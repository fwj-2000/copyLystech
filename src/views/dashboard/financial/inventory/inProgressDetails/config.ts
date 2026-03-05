import dayjs from 'dayjs';
import { getOrganization } from '/@/api/dashbord/operate';
import { getFieldValue } from '/@/views/dashboard/commonComponents/SearchForm/utils';

import { EFormItemType, TFormItemOption } from '/@/views/dashboard/commonComponents/SearchForm/types';
import { BaseVxeTableTypes } from '/@/views/dashboard/commonComponents/BaseVxeTable/types';

// 过滤条件配置
export const filterOptions: TFormItemOption[] = [
  {
    type: EFormItemType.INPUT,
    label: '公司',
    default: '',
    key: 'company',
  },
  {
    type: EFormItemType.INPUT,
    label: '公司代码',
    default: '',
    key: 'companyCode',
  },
  {
    type: EFormItemType.INPUT,
    label: '厂区名称',
    default: '',
    key: 'factoryName',
  },
  {
    type: EFormItemType.INPUT,
    label: '工厂代码',
    default: '',
    key: 'werks',
  },
  {
    type: EFormItemType.INPUT,
    label: '工单号',
    default: '',
    key: 'aufnr',
  },
  {
    type: EFormItemType.INPUT,
    label: '工单类型',
    default: '',
    key: 'auart',
  },
  {
    type: EFormItemType.INPUT,
    label: '工单状态',
    default: '',
    key: 'stats',
  },
  {
    type: EFormItemType.INPUT,
    label: '物料编码',
    default: '',
    key: 'matnr',
  },
  {
    type: EFormItemType.INPUT,
    label: '物料描述',
    default: '',
    key: 'maktx',
  },
  {
    type: EFormItemType.INPUT,
    label: 'BOM组件物料描述',
    default: '',
    key: 'idktx',
  },
  {
    type: EFormItemType.INPUT,
    label: 'MRP控制者',
    default: '',
    key: 'dispo',
  },
  {
    type: EFormItemType.INPUT,
    label: '控制者描述',
    default: '',
    key: 'dsnam',
  },
  {
    type: EFormItemType.INPUT,
    label: '下达日期',
    default: '',
    key: 'idat2a',
  },
  {
    type: EFormItemType.INPUT,
    label: '预留编号',
    default: '',
    key: 'rsnum',
  },
  {
    type: EFormItemType.INPUT,
    label: '预留项目',
    default: '',
    key: 'rspos',
  },
  {
    type: EFormItemType.INPUT,
    label: '创建日期',
    default: '',
    key: 'erdat',
  },
  {
    type: EFormItemType.INPUT,
    label: '首次领料日期',
    default: '',
    key: 'ziDate',
  },
  {
    type: EFormItemType.INPUT,
    label: '组件物料工厂',
    default: '',
    key: 'idwrk',
  },
  {
    type: EFormItemType.INPUT,
    label: '组件物料编码',
    default: '',
    key: 'idnrk',
  },
  {
    type: EFormItemType.INPUT,
    label: '业务范围',
    default: '',
    key: 'abtei',
  },
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
      // 将结果处理成下拉菜单的属性
      const handleList = list.map(item => {
        // const idValue = item.id || item.ID;
        return {
          id: getFieldValue(item, 'id'),
          parentId: getFieldValue(item, 'parent_Id'),
          value: getFieldValue(item, 'org_Code'),
          text: getFieldValue(item, 'org_Name'),
        };
      });
      // 转换成树形结构数据
      return handleList;
    },
  },
  {
    type: EFormItemType.DATE_PICKER,
    default: dayjs().subtract(1, 'day'),
    key: 'date',
    getParam: value => {
      return { buDat: value.format('YYYY-MM-DD') };
    },
  },
];

// 表格字段配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    { title: '序号', type: 'seq', field: 'index', width: 50 },
    {
      title: '公司',
      field: 'Company',
      width: 220,
    },
    {
      title: '公司代码',
      field: 'CompanyCode',
      width: 100,
    },
    {
      title: '厂区名称',
      field: 'FactoryName',
      width: 100,
    },
    {
      title: '周别',
      field: 'Week',
      width: 100,
    },
    {
      title: '产品类型',
      field: 'Types',
      width: 100,
    },
    {
      title: '是否良品',
      field: 'IsGoodProduct',
      width: 100,
    },
    {
      title: '工厂代码',
      field: 'Werks',
      width: 100,
    },
    {
      title: '工单号',
      field: 'Aufnr',
      width: 160,
    },
    {
      title: '工单类型',
      field: 'Auart',
      width: 100,
    },
    {
      title: '工单状态',
      field: 'Stats',
      width: 100,
    },
    {
      title: '物料编码',
      field: 'Matnr',
      width: 160,
    },
    {
      title: '物料描述',
      field: 'Maktx',
      width: 180,
    },
    {
      title: 'BOM组件物料描述',
      field: 'Idktx',
      width: 180,
    },
    {
      title: '总订单数量',
      field: 'Gamng',
      width: 120,
    },
    {
      title: '收货数量',
      field: 'Wemng',
      width: 100,
    },
    {
      title: 'MRP控制者',
      field: 'Dispo',
      width: 160,
    },
    {
      title: '控制者描述',
      field: 'Dsnam',
      width: 160,
    },
    {
      title: '下达日期',
      field: 'Idat2a',
      width: 100,
      formatter: ({ cellValue }) => {
        return dayjs(cellValue).format('YYYY-MM-DD');
      },
    },
    {
      title: '预留编号',
      field: 'Rsnum',
      width: 160,
    },
    {
      title: '预留项目',
      field: 'Rspos',
      width: 100,
    },
    {
      title: '创建日期',
      field: 'Erdat',
      width: 100,
      formatter: ({ cellValue }) => {
        return dayjs(cellValue).format('YYYY-MM-DD');
      },
    },
    {
      title: '首次领料日期',
      field: 'ZiDate',
      width: 160,
      formatter: ({ cellValue }) => {
        return dayjs(cellValue).format('YYYY-MM-DD');
      },
    },
    {
      title: '组件物料工厂',
      field: 'Idwrk',
      width: 160,
    },
    {
      title: '组件物料编码',
      field: 'Idnrk',
      width: 160,
    },
    {
      title: '组件物料需求数量',
      field: 'Bdmng',
      width: 160,
    },
    {
      title: '组件物料发料数量',
      field: 'Enmng',
      width: 160,
    },
    {
      title: '组件物料在制数量',
      field: 'Qty',
      width: 160,
    },
    {
      title: '计量单位',
      field: 'Meins',
      width: 100,
    },
    {
      title: '价格',
      field: 'Gpreis',
      width: 100,
    },
    {
      title: '币别',
      field: 'Waers',
      width: 100,
    },
    {
      title: '业务范围',
      field: 'Abtei',
      width: 100,
    },
    {
      title: '处理日期',
      field: 'EtlDate',
      width: 100,
      formatter: ({ cellValue }) => {
        return dayjs(cellValue).format('YYYY-MM-DD');
      },
    },
  ];
  return columns;
};
