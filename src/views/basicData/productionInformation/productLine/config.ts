import type { VxeGridPropTypes } from '/@/components/VxeTable';
import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
const { t } = useI18n();
const baseStore = useBaseStore();

export const StatusList = [
  {
    id: 1,
    fullName: t('dict.enableStatus.1'),
  },
  {
    id: 2,
    fullName: t('dict.enableStatus.2'),
  },
];

export const statusOptions = [
  { id: 1, fullName: t('common.enableText'), theme: 'green' },
  { id: 2, fullName: t('common.disableText'), theme: 'red' },
];

export function getFormConfig() {
  return [
    {
      fieldName: 'Code',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请输入编码',
        allowClear: true,
      },
      width: 100,
    },
    {
      fieldName: 'Name',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请输入名称',
        allowClear: true,
      },
    },
    {
      fieldName: 'MainProcess',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '主要制程',
        allowClear: true,
        api: () => baseStore.getDictionaryData('MainProcess'),
        resultField: '',
        labelField: 'fullName',
        valueField: 'enCode',
      },
    },
    {
      fieldName: 'Status',
      label: '',
      component: 'Select',
      i18nField: 'CommonCol.isEnable',
      componentProps: {
        options: statusOptions.map(item => ({ ...item, value: item.id, label: item.fullName })),
        placeholder: '状态',
        allowClear: true,
      },
    },
  ];
}

export function getColumn(): VxeGridPropTypes.Columns {
  return [
    {
      type: 'checkbox',
      field: 'checkbox',
      width: '50',
    },
    {
      field: 'seq',
      title: t('component.table.index'),
      type: 'seq',
      width: '50',
      align: 'center',
    },
    {
      title: '编码',
      field: 'Code',
      width: 130,
    },
    {
      title: '名称',
      field: 'Name',
      width: 180,
    },
    {
      title: '主要制程',
      field: 'MainProcess',
      width: 130,
      slots: { default: 'MainProcess' },
    },
    {
      title: '所属组织',
      field: 'OrgName',
      width: 170,
    },
    {
      title: '是否启用',
      i18nField: 'CommonCol.isEnable',
      field: 'Status',
      width: 120,
      cellRender: {
        name: 'Tag',
        options: statusOptions,
      },
    },
    {
      title: '创建人',
      field: 'CreatorUserName',
      width: 220,
    },
    {
      title: '创建时间',
      field: 'CreatorTime',
      width: 170,
      cellRender: {
        name: 'Date',
      },
    },
    {
      title: '修改人',
      field: 'LastModifyUserName',
      width: 220,
    },
    {
      title: '修改时间',
      field: 'LastModifyTime',
      width: 170,
      cellRender: {
        name: 'Date',
      },
    },
    {
      title: '操作',
      field: 'action',
      width: 80,
      fixed: 'right',
      slots: { default: 'action' },
    },
  ];
}
