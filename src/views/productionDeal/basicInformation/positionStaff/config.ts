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
    i18nField: 'factoryAreaName',
  },
  {
    fieldName: 'processCode',
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
    fieldName: 'operateUserId',
    label: '',
    component: 'CustomUserSelect',
    componentProps: {
      placeholder: '操作人',
    },
    i18nField: 'operateUserName',
  },
];

// 主页表格column配置
export const column = [
  { type: 'checkbox', field: 'checkbox', width: 70 },
  {
    title: '工厂',
    field: 'factoryAreaName',
  },
  {
    title: '工序名称',
    field: 'processName',
  },
  {
    title: '工序代码',
    field: 'processCode',
  },
  {
    title: '操作人',
    field: 'operateUserName',
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
    i18nField: 'factoryAreaName',
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
    i18nField: 'processCode',
    required: true,
  },
  {
    field: 'operateUserIds',
    label: '操作人',
    component: 'CustomUserSelect',
    componentProps: {
      placeholder: '操作人',
      multiple: true,
    },
    i18nField: 'operateUserName',
    required: true,
  },
];
