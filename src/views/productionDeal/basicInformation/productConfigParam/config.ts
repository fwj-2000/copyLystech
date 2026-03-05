import { useBaseStore } from '/@/store/modules/base';
import { useI18n } from '/@/hooks/web/useI18n';
import { ListByUserfactory } from '/@/api/productionPlan/processRoute';
import { getEnablePartNumberApply } from '/@/api/basicData/productCodeApply';

const baseStore = useBaseStore();
const { t } = useI18n();
export const searchFormSchema = [
  {
    fieldName: 'mainProcess',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '主要制程',
      api: () => baseStore.getDictionaryData('MainProcess'),
      labelField: 'fullName',
      valueField: 'enCode',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
    },
    i18nField: 'mainProcessName',
  },
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
    fieldName: 'codeName',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      placeholder: '编码名称',
    },
  },
  {
    fieldName: 'innerMaterialNumber',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      placeholder: '内部料号',
    },
    i18nField: 'innerMaterial',
  },
];

// 主页表格column配置
export const column = [
  { type: 'checkbox', field: 'checkbox', width: 70 },
  {
    title: '主要制程',
    field: 'mainProcessName',
  },
  {
    title: '工厂',
    field: 'factoryAreaName',
  },
  {
    title: '内部料号',
    field: 'innerMaterialNumber',
    i18nField: 'innerMaterial',
  },
  {
    title: '编码',
    field: 'code',
  },
  {
    title: '编码名称',
    field: 'codeName',
  },
  {
    title: '值',
    field: 'value',
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
    field: 'mainProcess',
    label: '主要制程',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '主要制程',
      api: () => baseStore.getDictionaryData('MainProcess'),
      labelField: 'fullName',
      valueField: 'enCode',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
    },
    i18nField: 'mainProcessName',
    required: true,
    colProps: { span: 12 },
  },
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
    i18nField: 'factoryAreaName',
    colProps: { span: 12 },
  },
  {
    field: 'innerMaterialNumber',
    label: '内部料号',
    component: 'ApiSelect',
    required: true,
    colProps: { span: 12 },
    componentProps: {
      api: getEnablePartNumberApply,
      placeholder: '请选择内部料号',
      showSearch: true,
      memoInputVal: true,
      memoInputVagueVal: true,
      apiSearch: {
        show: true,
        searchName: 'keyword',
      },
      resultField: 'data.list',
      labelField: 'InsidePartNumber',
      valueField: 'InsidePartNumber',
      filterOption: true,
      notFoundContent: null,

      immediate: true,
    },
    i18nField: 'innerMaterial',
  },
  {
    field: 'code',
    label: '编码',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '编码',
      api: () => baseStore.getDictionaryData('ProductionConfigParamCode'),
      labelField: 'fullName',
      valueField: 'enCode',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
    },
    required: true,
    colProps: { span: 12 },
  },
  {
    field: 'value',
    label: '值',
    component: 'Input',
    required: true,
    colProps: { span: 12 },
  },
];
