import { ListByUserfactory } from '/@/api/productionPlan/processRoute';
import { alllistbyfactory } from '/@/api/engineering/mould';

export const searchFormSchema = [
  {
    fieldName: 'factoryArea',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      api: ListByUserfactory,
      placeholder: '所属厂区',
      showSearch: true,
      resultField: 'data',
      filterOption: (inputValue, path) => {
        return [path].some(option => option.label.includes(inputValue));
      },
      notFoundContent: null,
      immediate: true,
      labelField: 'Name',
      valueField: 'Code',
    },
  },
  {
    fieldName: 'processCodes',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      api: alllistbyfactory,
      showSearch: true,
      resultField: 'data',
      labelField: 'name',
      valueField: 'code',
      immediate: true,
      placeholder: '工序代码',
      filterOption: (input, option) => {
        return option.label.toLowerCase().includes(input.toLowerCase());
      },
    },
  },
  {
    fieldName: 'name',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '线体类型名称',
    },
  },
];

// 主页表格column配置
export const column = [
  { type: 'checkbox', field: 'checkbox', width: 70 },
  {
    title: '工厂',
    field: 'factoryAreaName',
    i18nField: 'factoryArea',
  },
  {
    title: '工序名称',
    field: 'processNames',
  },
  {
    title: '工序代码',
    field: 'processCodes',
  },
  {
    title: '线体类型名称',
    field: 'name',
  },
  {
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: 100,
    fixed: 'right',
  },
];

export const addSchemas = [
  {
    field: 'factoryArea',
    label: '所属厂区',
    component: 'ApiSelect',
    componentProps: {
      api: ListByUserfactory,
      placeholder: '所属厂区',
      showSearch: true,
      resultField: 'data',
      filterOption: (inputValue, path) => {
        return [path].some(option => option.label.includes(inputValue));
      },
      notFoundContent: null,
      immediate: true,
      labelField: 'Name',
      valueField: 'Code',
    },
    required: true,
  },
  {
    field: 'processCodes',
    label: '工序代码',
    component: 'Select',
    componentProps: {
      options: [],
      fieldNames: { label: 'name', value: 'code' },
      mode: 'multiple',
    },
    required: true,
  },
  {
    field: 'name',
    label: '类型名称',
    component: 'Input',
    required: true,
  },
];
