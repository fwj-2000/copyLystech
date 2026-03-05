import { IS_ENABLE_LIST } from '/@/components/CustomComponents/src/Constant';
import { getFactorysList } from '/@/api/business/quantitation';
export const formSchema = [
  {
    label: '',
    fieldName: 'insidePartNumber',
    component: 'Input',
    componentProps: {
      placeholder: '产品内部料号',
    },
  },
  {
    label: '',
    fieldName: 'factoryCode',
    i18nField: 'factory',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '工厂',
      api: getFactorysList,
      showSearch: true,
      apiSearch: {
        show: true,
        searchName: 'factoryCode',
      },
      resultField: 'data',
      labelField: 'Name',
      valueField: 'Code',
      immediate: true,
      nameFormat: ['Name', '/', 'Code'],
    },
  },
];

export const columnsVxe = [
  // { field: 'checkbox', minWidth: 50, type: 'checkbox' },
  {
    title: '产品内部料号',
    field: 'insidePartNumber',
    minWidth: 200,
  },
  {
    title: '内部项目代码',
    field: 'insideProjectCode',
    minWidth: 200,
  },
  {
    title: '工厂',
    field: 'factory',
    minWidth: 200,
  },
];
