import { options } from '@fullcalendar/core/preact';
import { FormSchema } from '/@/components/Table';
import { useBaseStore } from '/@/store/modules/base';
import { CONDITIONAL_OPTIONS } from '../config';
import { useI18n } from '/@/hooks/web/useI18n';
const baseStore = useBaseStore();
const { t } = useI18n();
export const addSchema: FormSchema[] = [
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '名称',
      //   i18nField: 'CommonCol.autoCarryTip',
      // disabled: true,
    },
  },
  {
    field: 'errorType',
    label: '异常类型',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: () => baseStore.getDictionaryData('DemandTypeEnum'),
      placeholder: '异常类型',
      showSearch: false,
      resultField: '',
      labelField: 'fullName',
      valueField: 'enCode',
      //   onChange: (v: string) => setColumnByDemandType(v),
    },
  },
  {
    field: '',
    label: '报警联系人',
    required: true,
    component: 'CustomUserSelect',
    componentProps: { placeholder: '报警联系人' },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    required: true,
    componentProps: {
      placeholder: '请选择状态',
      //   api: () => {
      //     return baseStore.getDictionaryData('ClassesName');
      //   },
      //   labelField: 'fullName',
      //   valueField: 'enCode',
      options: CONDITIONAL_OPTIONS,
      filterOption: false,
      notFoundContent: null,
      immediate: true,
    },
  },
  {
    field: 'sendMethod',
    label: '推送方式',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      placeholder: '请选择推送方式',
      api: () => {
        return baseStore.getDictionaryData('ClassesName');
      },
      labelField: 'fullName',
      valueField: 'enCode',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
    },
  },
];

export const addTemplate = {
  enableTime: '',
  projectPhase: '',
  createTime: '',
  week: '',
};

export const addColumns: any[] = [
  {
    title: '序号',
    field: 'seq',
    type: 'seq',
    width: 50,
  },
  {
    title: '未处理时长',
    field: 'enableTime',
    // width: 160,
    editRender: {
      name: 'Input',
      props: {
        placeholder: '',
      },
    },
  },
  {
    title: '推送机制',
    field: 'projectPhase',
    // width: 160,
    editRender: {
      name: 'Input',
      props: {
        placeholder: '',
      },
    },
  },
  {
    title: '生效时间',
    field: 'createTime',
    // width: 160,
    editRender: {},
    slots: { edit: 'edit_createTime', default: 'default_createTime' },
  },
  {
    title: t('common.action'),
    width: 150,
    slots: { default: 'action' },
    fixed: 'right',
    field: 'action',
  },
];
