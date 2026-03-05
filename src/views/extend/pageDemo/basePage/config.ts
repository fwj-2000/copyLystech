import type { VxeGridPropTypes } from '/@/components/VxeTable';
import type { FormSchema } from '/@/components/Form';
import type { FormSchema as VxeFormSchema } from '/@/components/VxeTable/ui-kit/form-ui/src/types';

import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';

const { t } = useI18n();
const baseStore = useBaseStore();

/**
 * 状态.
 */
export enum STATUS_ENUM {
  启用 = 1,
  禁用 = 2,
}

/**
 * @description 状态列表
 */
export const STATUS_OPTIONS = [
  { id: STATUS_ENUM.启用, fullName: t('dict.enableStatus.1'), theme: 'green' },
  { id: STATUS_ENUM.禁用, fullName: t('dict.enableStatus.2'), theme: 'red' },
];

/** 列表 - 列配置 */
export const columns: VxeGridPropTypes.Columns = [
  {
    field: 'checkbox',
    type: 'checkbox',
    width: 50,
    align: 'center',
  },
  {
    title: '代码',
    field: 'code',
    width: 100,
  },
  {
    title: '名称',
    field: 'name',
    minWidth: 100,
  },
  {
    title: '简称',
    field: 'shortName',
    width: 160,
  },
  {
    title: '状态',
    field: 'status',
    i18nField: 'statusName',
    width: 80,
    cellRender: {
      name: 'Tag',
      options: STATUS_OPTIONS,
    },
  },
  {
    title: '备注',
    field: 'remark',
    width: 200,
  },
  {
    title: '创建时间',
    field: 'creatorTime',
    width: 160,
    cellRender: {
      name: 'Date',
    },
  },
  {
    title: '创建人姓名',
    field: 'creatorUserName',
    width: 220,
  },
  {
    title: '修改时间',
    field: 'lastModifyTime',
    width: 160,
    cellRender: {
      name: 'Date',
    },
  },
  {
    title: '修改人姓名',
    field: 'lastModifyUserName',
    width: '220',
  },
  // 操作栏
  {
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: 80,
    fixed: 'right',
  },
];

/** 列表 - 查询表单 */
export const schema: VxeFormSchema[] = [
  {
    fieldName: 'code',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '代码',
      allowClear: true,
    },
  },
  {
    fieldName: 'name',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '名称',
      allowClear: true,
    },
  },
  {
    fieldName: 'shortName',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '简称',
      allowClear: true,
    },
  },
  {
    fieldName: 'status',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('enableStatus'),
      resultField: 'data',
      labelField: 'fullName',
      valueField: 'enCode',
      placeholder: '状态',
      allowClear: true,
    },
  },
];

/** 表单 - 表单配置 */
export const formSchema: FormSchema[] = [
  {
    field: 'code',
    label: '代码',
    component: 'Input',
    rules: [{ required: true, trigger: 'blur' }],
  },
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    rules: [{ required: true, trigger: 'blur' }],
  },
  {
    field: 'shortName',
    label: '简称',
    component: 'Input',
    rules: [{ required: true, trigger: 'blur' }],
  },
  {
    field: 'status',
    label: '状态',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('enableStatus', true),
      disabled: false,
      showSearch: false,
      resultField: 'data',
      labelField: 'fullName',
      valueField: 'enCode',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
    },
    rules: [
      {
        required: true,
        trigger: 'blur',
      },
    ],
  },
  {
    field: 'remark',
    label: '备注',
    component: 'Textarea',
    componentProps: {
      row: 3,
      maxLength: 200,
    },
  },
];

/** 导入列配置 */
export const importColumn: VxeGridPropTypes.Columns = [
  {
    title: '代码',
    field: 'code',
    width: '160',
  },
  {
    title: '名称',
    field: 'name',
    width: '160',
  },
  {
    title: '简称',
    field: 'shortName',
    width: '160',
  },
  {
    title: '备注',
    field: 'remark',
  },
];
