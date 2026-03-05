import { FormSchema } from '/@/components/Form';
import { useBaseStore } from '/@/store/modules/base';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
export const STATUS_OPTIONS = [
  { id: '1', fullName: t('dict.YesOrNo.1'), theme: 'green' }, // ok
  { id: '2', fullName: t('dict.YesOrNo.0'), theme: 'red' }, // ng
];

const baseStore = useBaseStore();

// 基础信息
export const BASICINFO_SCHEMAS: FormSchema[] = [
  {
    field: 'classes',
    label: '班次',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '请选择班次',
      api: () => {
        return baseStore.getDictionaryData('ClassesName');
      },
      labelField: 'fullName',
      valueField: 'enCode',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
    },
    rules: [{ required: true, trigger: 'blur', message: '必填' }],
  },
  // { field: 'customerName', component: 'Input', label: '客户名称' },

  // {
  //   label: '最终计数数量',
  //   field: 'totalCount', // 原typed
  //   component: 'InputNumber',
  //   componentProps: {
  //     min: 0,
  //   },
  //   rules: [{ required: true, trigger: 'change', message: '必填' }],
  // },
  // {
  //   field: 'meteringUnit', // 原typef
  //   label: '计量单位',
  //   component: 'ApiSelect',
  //   componentProps: {
  //     api: getunitList,
  //     searchKey: 'InnerMaterialNumber',
  //     placeholder: '请选择',
  //     showSearch: false,
  //     resultField: 'data',
  //     valueField: 'Name',
  //     labelField: 'Name',
  //     filterOption: false,
  //     immediate: true,
  //     disabled: false,
  //   },
  //   rules: [{ required: true, trigger: 'change', message: '必填' }],
  // },
  // {
  //   field: 'inBatchesTest',
  //   component: 'Radio',
  //   componentProps: {
  //     options: STATUS_OPTIONS,
  //   },
  //   label: '分批检验',
  //   rules: [{ required: true, trigger: 'change', message: '必填' }],
  // },
  {
    label: '检验数量',
    field: 'testCount', // 原typed
    defaultValue: 1, // 默认1
    component: 'InputNumber',
    componentProps: {
      min: 0,
    },
    //ifShow: ({ model }) => model.inBatchesTest === '1',
    rules: [{ required: true, trigger: 'change', message: '必填' }],
  },
];
