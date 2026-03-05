import { FormSchema } from '/@/components/Form';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export const packagingTestsFromSchemas: FormSchema[] = [
  {
    field: 'qualifiedSupplier',
    component: 'Radio',
    defaultValue: '1',
    componentProps: {
      options: [
        { id: '1', fullName: t('dict.Bool.1') },
        { id: '2', fullName: t('dict.Bool.2') },
      ],
    },
    rules: [{ required: true, trigger: 'change', message: '必填' }],
    label: '是否合格供应商',
  },
  { field: 'supplierCode', component: 'Input', label: '供应商编码' },
  {
    field: 'quantityEqual',
    component: 'Radio',
    defaultValue: '1',
    componentProps: {
      options: [
        { id: '1', fullName: t('dict.Bool.1') },
        { id: '2', fullName: t('dict.Bool.2') },
      ],
    },
    rules: [{ required: true, trigger: 'change', message: '必填' }],
    label: '来料数量是否与验收单一致',
  },
  { field: 'quantityRemark', component: 'Input', label: '数量方面备注' },
  {
    field: 'packageQualified',
    component: 'Radio',
    defaultValue: '1',
    componentProps: {
      options: [
        { id: '1', fullName: t('dict.Bool.1') },
        { id: '2', fullName: t('dict.Bool.2') },
      ],
    },
    rules: [{ required: true, trigger: 'change', message: '必填' }],
    label: '包装是否符合要求',
  },
  { field: 'packageRemark', component: 'Input', label: '包装方面备注' },
  {
    field: 'attachmentList',
    label: '附件列表',
    component: 'Input',
    slot: 'file',
    // rules: [{ required: false, message: '', trigger: 'blur' }],
    colProps: { span: 24 },
  },
];
