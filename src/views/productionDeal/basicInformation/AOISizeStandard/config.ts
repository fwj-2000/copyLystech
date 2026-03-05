import { ListByUserfactory } from '/@/api/productionPlan/processRoute';
import { getInnermaterialnumberlist } from '/@/api/basicData/processrulestemplate';

export const searchFormSchema = [
  {
    fieldName: 'factory',
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
      memoInputVal: true,
      memoInputVagueVal: true,
      notFoundContent: null,
      immediate: true,
      labelField: 'Name',
      valueField: 'Code',
    },
    i18nField: 'factoryName',
  },
  {
    fieldName: 'productCode',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      placeholder: '产品编码',
    },
  },
  {
    fieldName: 'sizeName',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      placeholder: '尺寸名',
    },
  },
];

// 主页表格column配置
export const column = [
  { type: 'checkbox', field: 'checkbox', width: 70 },
  {
    title: '工厂',
    field: 'factoryName',
    width: 160,
  },
  {
    title: '产品编码',
    field: 'productCode',
    width: 160,
  },
  {
    title: '尺寸名',
    field: 'sizeName',
    width: 160,
  },
  {
    title: '标准值',
    field: 'standardValue',
    width: 120,
  },
  {
    title: '上公差',
    field: 'upperTolerance',
    width: 120,
  },
  {
    title: '下公差',
    field: 'lowerTolerance',
    width: 120,
  },
  {
    title: '上限值',
    field: 'upperLimit',
    width: 120,
  },
  {
    title: '下限值',
    field: 'lowerLimit',
    width: 120,
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
    field: 'factory',
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
    i18nField: 'factoryName',
    colProps: { span: 12 },
  },
  {
    field: 'productCode',
    label: '产品编码',
    component: 'ApiSelect',
    componentProps: {
      api: getInnermaterialnumberlist,
      placeholder: '请选择产品编码',
      showSearch: true,
      apiSearch: {
        show: true,
        searchName: 'searchKey',
      },
      memoInputVal: true,
      resultField: 'data',
      filterOption: true,
      notFoundContent: null,
      immediate: true,
      useChangeCopy: true,
      labelField: 'code',
      valueField: 'code',
    },
    required: true,
    colProps: { span: 12 },
  },
  {
    field: 'sizeName',
    label: '尺寸名',
    component: 'Input',
    required: true,
    colProps: { span: 12 },
  },
  {
    field: 'standardValue',
    label: '标准值',
    component: 'Input',
    required: true,
    colProps: { span: 12 },
  },
  {
    field: 'upperTolerance',
    label: '上公差',
    component: 'Input',
    required: true,
    colProps: { span: 12 },
  },
  {
    field: 'lowerTolerance',
    label: '下公差',
    component: 'Input',
    required: true,
    colProps: { span: 12 },
  },
];
