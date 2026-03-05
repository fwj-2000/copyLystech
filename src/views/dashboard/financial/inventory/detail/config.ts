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
    label: '库存分类',
    default: '',
    key: 'dataSource',
  },
  {
    type: EFormItemType.INPUT,
    label: '厂区名称',
    default: '',
    key: 'sbuName',
  },
  {
    type: EFormItemType.INPUT,
    label: '周别',
    default: '',
    key: 'week',
  },
  {
    type: EFormItemType.INPUT,
    label: '产品类型',
    default: '',
    key: 'types',
  },
  {
    type: EFormItemType.INPUT,
    label: '是否良品',
    default: '',
    key: 'isGoodProduct',
  },
  {
    type: EFormItemType.INPUT,
    label: '料号',
    default: '',
    key: 'matnr',
  },
  {
    type: EFormItemType.INPUT,
    label: '工厂代码',
    default: '',
    key: 'werks',
  },
  {
    type: EFormItemType.INPUT,
    label: '库存地点',
    default: '',
    key: 'lgort',
  },
  {
    type: EFormItemType.INPUT,
    label: '库存地点描述',
    default: '',
    key: 'address',
  },
  {
    type: EFormItemType.INPUT,
    label: '批次',
    default: '',
    key: 'charg',
  },
  {
    type: EFormItemType.INPUT,
    label: '业务范围',
    default: '',
    key: 'gsber',
  },
  {
    type: EFormItemType.INPUT,
    label: '是否保税',
    default: '',
    key: 'isBonded',
  },
  {
    type: EFormItemType.INPUT,
    label: '产品类别',
    default: '',
    key: 'cplb',
  },
  {
    type: EFormItemType.INPUT,
    label: '类别2',
    default: '',
    key: 'lb2',
  },
  {
    type: EFormItemType.INPUT,
    label: '外部项目区分',
    default: '',
    key: 'custProjectName',
  },
  {
    type: EFormItemType.INPUT,
    label: '库龄',
    default: '',
    key: 'zdays',
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
      title: '库存分类',
      field: 'DataSource',
      width: 100,
    },
    {
      title: '厂区名称',
      field: 'SbuName',
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
      title: '料号',
      field: 'Matnr',
      width: 160,
    },
    {
      title: '工厂代码',
      field: 'Werks',
      width: 100,
    },
    {
      title: '库存地点',
      field: 'Lgort',
      width: 100,
    },
    {
      title: '库存地点描述',
      field: 'Address',
      width: 160,
    },
    {
      title: '批次',
      field: 'Charg',
      width: 100,
    },
    {
      title: '成本单价',
      field: 'Price',
      width: 100,
    },
    {
      title: '财务月结后成本单价',
      field: 'Sprice',
      width: 160,
    },
    {
      title: '收货数量',
      field: 'Menge',
      width: 100,
    },
    {
      title: '总金额',
      field: 'Zdmbtr',
      width: 100,
    },
    {
      title: '<30天数量',
      field: 'Menge0',
      width: 130,
      sortable: true,
    },
    {
      title: '<30天金额',
      field: 'Dmbtr0',
      width: 130,
      sortable: true,
    },
    {
      title: '30 - 45 数量',
      field: 'Menge1',
      width: 130,
      sortable: true,
    },
    {
      title: '30 - 45 金额',
      field: 'Dmbtr1',
      width: 130,
      sortable: true,
    },
    {
      title: '45 - 60 数量',
      field: 'Menge2',
      width: 130,
      sortable: true,
    },
    {
      title: '45 - 60 金额',
      field: 'Dmbtr2',
      width: 130,
      sortable: true,
    },
    {
      title: '60 - 90 数量',
      field: 'Menge3',
      width: 130,
      sortable: true,
    },
    {
      title: '60 - 90 金额',
      field: 'Dmbtr3',
      width: 130,
      sortable: true,
    },
    {
      title: '90 - 180 数量',
      field: 'Menge4',
      width: 130,
      sortable: true,
    },
    {
      title: '90 - 180 金额',
      field: 'Dmbtr4',
      width: 130,
      sortable: true,
    },
    {
      title: '180 - 360 数量',
      field: 'Menge5',
      width: 130,
      sortable: true,
    },
    {
      title: '180 - 360 金额',
      field: 'Dmbtr5',
      width: 130,
      sortable: true,
    },
    {
      title: '360以上 数量',
      field: 'Menge6',
      width: 130,
      sortable: true,
    },
    {
      title: '360以上 金额',
      field: 'Dmbtr6',
      width: 130,
      sortable: true,
    },
    {
      title: '业务范围',
      field: 'Gsber',
      width: 100,
    },
    {
      title: '业务范围描述',
      field: 'Source',
      width: 100,
    },
    {
      title: '是否保税',
      field: 'IsBonded',
      width: 100,
    },
    {
      title: '过账日期',
      field: 'BuDat',
      width: 100,
      formatter: ({ cellValue }) => {
        return dayjs(cellValue).format('YYYY - MM - DD');
      },
    },
    {
      title: '产品类别',
      field: 'Cplb',
      width: 100,
    },
    {
      title: '类别2',
      field: 'Lb2',
      width: 100,
    },
    {
      title: '外部项目区分',
      field: 'CustProjectName',
      width: 160,
    },
    {
      title: '库龄',
      field: 'Zdays',
      width: 100,
    },
  ];
  return columns;
};
