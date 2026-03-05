import { useBaseStore } from '/@/store/modules/base';
import { BasicForm, useForm, FormSchema, FormProps } from '/@/components/Form';
import type { DynamicProps } from '/#/utils';
import { useI18n } from '/@/hooks/web/useI18n';
type Props = Partial<DynamicProps<FormProps>>;
const { t } = useI18n();
const baseStore = useBaseStore();

export const BASICINFO_SCHEMAS: FormSchema[] = [
  {
    field: 'sapCode',
    label: '供应商SAP代码',
    component: 'Input',
    componentProps: {},
    rules: [{ required: true, message: '', trigger: 'blur' }],
  },
  {
    field: 'name',
    label: '供应商名称',
    component: 'Input',
    componentProps: {},
    rules: [{ required: true, message: '', trigger: 'blur' }],
  },
  {
    field: 'supplierType',
    label: '供应商类别',
    component: 'ApiSelect',
    componentProps: {
      api: async () => {
        return await baseStore.getDictionaryData('SupplierTypeEnum');
      },
      resultField: 'data',
      labelField: 'fullName',
      valueField: 'enCode',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
    },
    rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
  },
  {
    field: 'shortName',
    label: '供应商简称',
    component: 'Input',
    componentProps: {},
    rules: [{ required: true, message: '', trigger: 'blur' }],
  },
  {
    field: 'status',
    label: '是否启用',
    component: 'Select',
    componentProps: {
      placeholder: '请输入',
      maxlength: 50,
      options: [
        { fullName: t('common.disableText'), id: '2' },
        { fullName: t('dict.enableStatus.1'), id: '1' },
      ],
      fieldNames: {
        label: 'fullName',
        value: 'id',
      },
    },
    rules: [{ required: true, trigger: 'change', message: t('common.required') }],
    colProps: {
      span: 6,
    },
  },
  {
    field: 'orgId',
    label: '组织名称',
    component: 'OrganizeSelect',
    slot: 'orgId',
    componentProps: { placeholder: t('common.chooseText'), maxlength: 50 },
    rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
  },
  {
    field: 'remark',
    label: '备注',
    component: 'Input',
    componentProps: { placeholder: '请输入', maxlength: 200 },
  },
  {
    field: 'creatorUserName',
    label: '创建人',
    component: 'CustomUserSelect',
    componentProps: { placeholder: '请输入', disabled: true },
  },
];

// export const BASICINFO_FORMCONFIG: Props = {
//   labelWidth: 120,
//   baseColProps: { span: 6 },
//   actionColOptions: { span: 24 },
//   autoSubmitOnEnter: true,
//   layout: 'vertical',
//   // fieldMapToTime: [['checkDate', ['StartTime', 'EndTime']]],
//   schemas: BASICINFO_SCHEMAS,
// };
