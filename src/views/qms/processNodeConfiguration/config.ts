import type { VxeGridPropTypes } from '/@/components/VxeTable';

import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
import { FormSchema } from '/@/components/Form';

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
  { id: STATUS_ENUM.启用, theme: 'green', fullName: t('common.enableText'), rowKey: 'statusName' },
  { id: STATUS_ENUM.禁用, theme: 'red', fullName: t('common.disableText'), rowKey: 'statusName' },
];
export const columns: VxeGridPropTypes.Columns = [
  {
    field: 'checkbox',
    type: 'checkbox',
    width: '50',
    align: 'center',
    fixed: 'left',
  },
  {
    field: 'seq',
    title: t('component.table.index'),
    type: 'seq',
    width: '50',
    align: 'center',
  },
  {
    title: '模块编号',
    field: 'moduleCode',
    minWidth: '150',
  },
  {
    title: '流程编码',
    field: 'code',
    minWidth: '150',
  },
  {
    title: '流程名称',
    field: 'name',
    minWidth: '150',
  },
  {
    title: '节点字典',
    field: 'nodeDic',
    minWidth: '150',
  },
  {
    title: '版本',
    field: 'version',
    minWidth: '150',
  },
  {
    title: '是否启用',
    field: 'status',
    minWidth: '150',
    cellRender: {
      name: 'Tag',
      options: STATUS_OPTIONS,
    },
  },
  // {
  //   title: '主要制程',
  //   field: 'mainProcess',
  //   minWidth: '150',
  // },
  // {
  //   title: '公司',
  //   field: 'orgId',
  //   minWidth: '150',
  // },
  {
    title: '创建人',
    field: 'creatorUserName',
    minWidth: '150',
  },
  {
    title: '创建时间',
    field: 'creatorTime',
    minWidth: '150',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '修改人',
    field: 'modifierUserName',
    minWidth: '150',
  },
  {
    title: '修改时间',
    field: 'modifyTime',
    minWidth: '150',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: t('common.action'),
    width: '180',
    field: 'action',
    fixed: 'right',
    slots: {
      default: 'action',
    },
  },
];

export const schemas: FormSchema[] = [
  {
    field: 'name',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '模块名称',
      allowClear: true,
    },
  },
  {
    field: 'code',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '模块编码',
      allowClear: true,
    },
  },
  {
    field: 'templateName',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '模版名称',
      allowClear: true,
    },
  },
  {
    field: 'version',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '版本',
      allowClear: true,
    },
  },
  // {
  //   field: 'language',
  //   label: '',
  //   component: 'Input',
  //   componentProps: {
  //     placeholder: '语言',
  //     allowClear: true,
  //   },
  // },
  {
    field: 'creatorUserId',
    label: '',
    component: 'CustomUserSelect',
    componentProps: {
      placeholder: '申请人',
      allowClear: true,
    },
  },
  {
    field: 'status',
    label: '',
    component: 'Select',
    componentProps: {
      placeholder: '状态',
      options: STATUS_OPTIONS,
    },
  },
  // {
  //   field: 'nodeDic',
  //   label: '节点字典',
  //   component: 'Input',
  //   componentProps: { placeholder: '请输入' },
  //   rules: [{ required: true, trigger: 'blur', message: '可选' }],
  // },
];
