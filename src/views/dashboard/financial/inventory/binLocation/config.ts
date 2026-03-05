import type { VxeGridPropTypes } from 'vxe-table';
import { EFormItemType, TFormItemOption } from '/@/views/dashboard/commonComponents/SearchForm/types';

// 表单配置
export const allFormOptions: TFormItemOption[] = [
  {
    type: EFormItemType.INPUT,
    default: '',
    key: 'werks',
    label: '工厂代码',
    attrs: {
      placeholder: '请输入工厂代码',
    },
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    key: 'lgort',
    label: '库位代码',
    attrs: {
      placeholder: '请输入库位代码',
    },
  },
];

// 表格字段配置
export const getAllColumns = (): VxeGridPropTypes.Columns => {
  const columns = [
    {
      field: 'Werks',
      title: '工厂代码',
      width: '80',
    },
    {
      field: 'FactoryName',
      title: '工厂描述',
      width: '200',
    },
    {
      field: 'Lgort',
      title: '库存地点',
      width: '80',
    },
    {
      field: 'Lgobe',
      title: '库存地点描述',
      width: '200',
    },
    {
      field: 'Isbonded',
      title: '是否保税',
      width: '100',
    },
    {
      field: 'Types',
      title: '物料类型',
      width: '100',
    },
    {
      field: 'Isgoodproduct',
      title: '库存分类',
      width: '100',
    },
  ];
  return columns;
};
