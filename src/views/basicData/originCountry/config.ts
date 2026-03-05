import type { VxeGridPropTypes } from '/@/components/VxeTable';
import type { FormSchema } from '/@/components/Form';

import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
import dayjs from 'dayjs';
import { h } from 'vue';

import { LydcTag } from '/@/components/Lydc/Tag';

const { t } = useI18n();
const baseStore = useBaseStore();

/**
 * 状态.
 */
export enum STATUS_ENUM {
  启用 = '1',
  禁用 = '2',
}

/**
 * @description 状态列表
 */
export const STATUS_OPTIONS = [
  { id: STATUS_ENUM.启用, theme: 'green', rowKey: 'statusName' },
  { id: STATUS_ENUM.禁用, theme: 'red', rowKey: 'statusName' },
];

/**
 * 列表配置
 */
export const columns: VxeGridPropTypes.Columns = [
  {
    field: 'checkbox',
    type: 'checkbox',
    width: '50',
    align: 'center',
  },
  {
    field: 'seq',
    title: t('component.table.index'),
    type: 'seq',
    width: '50',
    align: 'center',
  },
  // 代码
  {
    title: t('dict.OriginCountryColumn.code'),
    field: 'code',
    showOverflow: 'tooltip',
    minWidth: '160',
  },
  // 名称
  {
    title: t('dict.OriginCountryColumn.name'),
    field: 'name',
    showOverflow: 'tooltip',
    minWidth: '160',
  },
  // 简称
  {
    title: t('dict.OriginCountryColumn.shortName'),
    field: 'shortName',
    showOverflow: 'tooltip',
    minWidth: '160',
  },
  // 组织
  // {
  //   title: '组织',
  //   field: 'orgName',
  //   showOverflow: 'tooltip',
  //   minWidth: '160',
  // },
  // 状态
  {
    title: t('dict.OriginCountryColumn.status'),
    field: 'statusName',
    showOverflow: 'tooltip',
    minWidth: '160',
    slots: {
      default: ({ row }) => {
        const { theme } = STATUS_OPTIONS.find(item => +item.id === +row.status) || {};
        return h(LydcTag, { theme: theme }, () => row.statusName || row.status);
      },
    },
  },
  // 备注
  {
    title: t('dict.OriginCountryColumn.remark'),
    field: 'remark',
    showOverflow: 'tooltip',
    minWidth: '220',
  },
  // 创建时间
  {
    title: t('dict.OriginCountryColumn.creatorTime'),
    field: 'creatorTime',
    showOverflow: 'tooltip',
    minWidth: '160',
    // formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).tz().format('YYYY-MM-DD HH:mm:ss') : ''),
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  // 创建人姓名
  {
    title: t('dict.OriginCountryColumn.creatorUserName'),
    field: 'creatorUserName',
    showOverflow: 'tooltip',
    minWidth: '220',
  },
  // 修改时间
  {
    title: t('dict.OriginCountryColumn.lastModifyTime'),
    field: 'lastModifyTime',
    showOverflow: 'tooltip',
    minWidth: '160',
    // formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).tz().format('YYYY-MM-DD HH:mm:ss') : ''),
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  // 修改人姓名
  {
    title: t('dict.OriginCountryColumn.lastModifyUserName'),
    field: 'lastModifyUserName',
    showOverflow: 'tooltip',
    minWidth: '220',
  },
  {
    title: t('common.action'),
    field: 'action',
    slots: { default: 'action' },
    width: 80,
    fixed: 'right',
  },
];

/**
 * 列表 - 查询表单
 */
export const schema = [
  // 代码
  {
    fieldName: 'code',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: t('dict.OriginCountryColumn.code'),
      allowClear: true,
    },
  },
  // 名称
  {
    fieldName: 'name',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: t('dict.OriginCountryColumn.name'),
      allowClear: true,
    },
  },
  // 简称
  {
    fieldName: 'shortName',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: t('dict.OriginCountryColumn.shortName'),
      allowClear: true,
    },
  },
  // 状态
  {
    fieldName: 'status',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('enableStatus'),
      resultField: 'data',
      labelField: 'fullName',
      valueField: 'enCode',
      placeholder: t('dict.OriginCountryColumn.status'),
      allowClear: true,
    },
  },
  // {
  //   fieldName: 'orgId',
  //   label: '',
  //   component: 'OrganizeSelect',
  //   componentProps: { placeholder: '组织名称', allowClear: true },
  // },
];

/**
 * 表单 - 表单配置
 */
export const formSchema: FormSchema[] = [
  // 代码
  {
    field: 'code',
    label: t('dict.OriginCountryColumn.code'),
    component: 'Input',
    rules: [{ required: true, trigger: 'blur' }],
  },
  // 名称
  {
    field: 'name',
    label: t('dict.OriginCountryColumn.name'),
    component: 'Input',
    rules: [{ required: true, trigger: 'blur' }],
  },
  // 简称
  {
    field: 'shortName',
    label: t('dict.OriginCountryColumn.shortName'),
    component: 'Input',
    rules: [{ required: true, trigger: 'blur' }],
  },
  // {
  //   field: 'orgId',
  //   label: '组织名称',
  //   component: 'OrganizeSelect',
  //   slot: 'orgId',
  //   // componentProps: { placeholder: '请选择', maxlength: 50 },
  //   rules: [{ required: true, trigger: 'blur' }],
  // },
  // 状态
  {
    field: 'status',
    label: t('dict.OriginCountryColumn.status'),
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('enableStatus'),
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
  // 备注
  {
    field: 'remark',
    label: t('dict.OriginCountryColumn.remark'),
    component: 'Textarea',
    componentProps: {
      row: 3,
      maxLength: 200,
    },
  },
];

/**
 * 导入列配置
 */
export const importColumn = [
  // 代码
  {
    title: t('dict.OriginCountryColumn.code'),
    dataIndex: 'code',
    showOverflow: 'tooltip',
    minWidth: '160',
  },
  // 名称
  {
    title: t('dict.OriginCountryColumn.name'),
    dataIndex: 'name',
    showOverflow: 'tooltip',
    minWidth: '160',
  },
  // 简称
  {
    title: t('dict.OriginCountryColumn.shortName'),
    dataIndex: 'shortName',
    showOverflow: 'tooltip',
    minWidth: '160',
  },
  // 备注
  {
    title: t('dict.OriginCountryColumn.remark'),
    dataIndex: 'remark',
    showOverflow: 'tooltip',
    minWidth: '220',
  },
];
