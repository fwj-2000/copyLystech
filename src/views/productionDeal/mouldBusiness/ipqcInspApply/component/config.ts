import { getProcessList } from '/@/api/basicData/process';
import { useBaseStore } from '/@/store/modules/base';
import { BasicForm, useForm, FormSchema, FormProps } from '/@/components/Form';
import type { DynamicProps } from '/#/utils';
import { getMachineNoList } from '/@/api/basicData/processrulestemplate';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
type Props = Partial<DynamicProps<FormProps>>;

const baseStore = useBaseStore();

const BASICINFO_SCHEMAS: FormSchema[] = [
  {
    field: 'checkType',
    label: '检测类型',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('CheckMaintain.CheckType'),
      placeholder: '请选择检测类型',
      showSearch: true,
      apiSearch: {
        show: true,
        searchName: 'labelName',
      },
      resultField: 'data',
      labelField: 'fullName',
      valueField: 'enCode',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
    },
    rules: [{ required: true, message: '', trigger: 'blur' }],
    colProps: {
      span: 6,
    },
  },
  {
    field: 'transformTag',
    label: '流转标签',
    component: 'Input',
    componentProps: {
      suffixIcon: 'icon-ym icon-ym-scanCode1',
      placeholder: '请输入或扫描标签',
      onkeydown: e => {},
      onChange: e => {},
    },
    rules: [{ required: false, message: '', trigger: 'blur' }],
  },
  // {
  //   field: 'machineNo',
  //   label: '机台号',
  //   component: 'ApiSelect',
  //   componentProps: {
  //     disabled: true,
  //     api: getMachineNoList,
  //     placeholder: '自动带入',
  //     showSearch: false,
  //     resultField: 'data',
  //     filterOption: false,
  //     notFoundContent: null,
  //     immediate: true,
  //     useChangeCopy: true,
  //     labelField: 'name',
  //     valueField: 'code',
  //     nameFormat: ['name', '(', 'code', ')'],
  //   },
  //   rules: [{ required: true, message: '', trigger: 'blur' }],
  //   colProps: {
  //     span: 6,
  //   },
  // },

  // {
  //   field: 'machineNo',
  //   label: '机台编号',
  //   component: 'Input',
  //   componentProps: {
  //     disabled: true,
  //     placeholder: '自动带入',
  //   },
  //   rules: [{ required: true, message: '', trigger: 'blur' }],

  //   colProps: { span: 6 },
  // },
  {
    field: 'mouldNo',
    label: '模具料号',
    component: 'Input',
    componentProps: {
      disabled: true,
      placeholder: '自动带入',
    },
    rules: [{ required: true, message: '', trigger: 'blur' }],

    colProps: { span: 6 },
  },
  {
    field: 'workOrderNo',
    label: '工单编码',
    component: 'Input',
    componentProps: {
      disabled: true,
      placeholder: '自动带入',
    },
    rules: [{ required: true, message: '', trigger: 'blur' }],

    colProps: { span: 6 },
  },
  // {
  //   field: 'process',
  //   label: '工序',
  //   component: 'ApiSelect',
  //   componentProps: {
  //     api: getProcessList,
  //     placeholder: '请选择工序',
  //     resultField: 'data',
  //     labelField: 'name',
  //     valueField: 'code',
  //     filterOption: false,
  //     notFoundContent: null,
  //     immediate: true,
  //   },
  //   colProps: { span: 6 },
  //   rules: [{ required: true, trigger: 'blur', message: '' }],
  // },
  {
    field: 'checkDate',
    label: '检验日期',
    component: 'DatePicker',
    componentProps: {
      placeholder: '请选择检验日期',
    },
    colProps: { span: 6 },
    rules: [{ required: true, message: '', trigger: 'blur' }],
  },
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
    rules: [{ required: true, message: '', trigger: 'blur' }],
    colProps: { span: 6 },
  },
  {
    field: 'teethQuantity',
    label: '齿数',
    component: 'InputNumber',
    componentProps: {
      min: 0,
      disabled: false,
      placeholder: '请输入齿数',
    },
    rules: [{ required: true, message: '', trigger: 'blur' }],
    colProps: { span: 6 },
  },
  {
    field: 'hardness',
    label: '硬度（HRC）',
    component: 'InputNumber',
    componentProps: {
      min: 0,
      disabled: false,
      placeholder: '请输入硬度（HRC）',
    },
    rules: [{ required: true, message: '', trigger: 'blur' }],
    colProps: { span: 6 },
  },
  {
    field: 'moldType',
    label: '模具类型',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '请选择类型',
      api: () => {
        return baseStore.getDictionaryData('IpqcMoldType');
      },
      labelField: 'fullName',
      valueField: 'enCode',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
    },
    colProps: { span: 6 },
    rules: [{ required: true, trigger: 'blur', message: '' }],
  },
  {
    field: 'dieCutType',
    label: '模切类型',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '请选择类型',
      api: () => {
        return baseStore.getDictionaryData('IpqcDieCutType');
      },
      labelField: 'fullName',
      valueField: 'enCode',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
    },
    colProps: { span: 6 },
    rules: [{ required: true, trigger: 'blur', message: '' }],
  },
];

const FINALRESULT_SCHEMAS: FormSchema[] = [
  {
    label: t('dict.CommonCol.detectionResult'),
    field: 'checkResult',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '请选择检测结果',
      showSearch: false,
      resultField: 'data',
      valueField: 'enCode',
      labelField: 'fullName',
      filterOption: false,
      immediate: true,
      api: () => baseStore.getDictionaryData('ProcessRules.DecideResult'),
    },
    rules: [{ required: true, trigger: 'blur' }],
    colProps: { span: 6 },
  },
  {
    field: 'remark',
    label: '备注',
    component: 'Input',
    componentProps: {
      maxlength: 200,
      showCount: true,
    },
    colProps: { span: 16 },
  },
];

export const BASICINFO_FORMCONFIG: Props = {
  labelWidth: 180,
  baseColProps: { span: 6 },
  actionColOptions: { span: 24 },
  autoSubmitOnEnter: true,
  layout: 'vertical',
  // fieldMapToTime: [['checkDate', ['StartTime', 'EndTime']]],
  schemas: BASICINFO_SCHEMAS,
};

export const FINALRESULT_FORMCONFIG: Props = {
  labelWidth: 140,
  baseColProps: { span: 6 },
  actionColOptions: { span: 24 },
  autoSubmitOnEnter: true,
  // layout: 'vertical',
  // fieldMapToTime: [['checkDate', ['StartTime', 'EndTime']]],
  schemas: FINALRESULT_SCHEMAS,
};
