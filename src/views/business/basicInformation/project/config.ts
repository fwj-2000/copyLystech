import type { VxeGridPropTypes } from '/@/components/VxeTable';
import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
import { getProductLineCode } from '/@/api/basicData/productLine';
const { t } = useI18n();
const baseStore = useBaseStore();

export const editRules = {
  customerProductStage: [{ required: true, message: t('common.required') }],
  internalProductStage: [{ required: true, message: t('common.required') }],
  productLineCode: [{ required: true, message: t('common.required') }],
};

export const statusOptions = [
  { id: 1, fullName: t('common.enableText'), theme: 'green' },
  { id: 2, fullName: t('common.disableText'), theme: 'red' },
];

export function getFormConfig() {
  return [
    {
      fieldName: 'MainProcess',
      label: '',
      component: 'ApiSelect',
      defaultValue: '1',
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
      fieldName: 'ProductLineCode',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        placeholder: t('dict.PartNumberApplyColumn.ProductLineCode'),
        allowClear: true,
        api: params => {
          return getProductLineCode(' ', params.mainProcess);
        },
        params: {
          mainProcess: '1',
        },
        labelField: 'Name',
        valueField: 'Code',
        resultField: 'data',
        nameFormat: ['Code', '-', 'Name'],
        immediate: true,
        alwaysLoad: true,
      },
    },
    {
      fieldName: 'InsideProjectCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: t(['common.inputPlaceholder', 'dict.ProjectColumn.InsideProjectCode']),
        allowClear: true,
      },
      width: 100,
    },
    {
      fieldName: 'TerminalCustomerProjectCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: t(['common.inputPlaceholder', 'dict.ProjectColumn.TerminalCustomerProjectCode']),
        allowClear: true,
      },
    },
    {
      fieldName: 'Status',
      label: '',
      component: 'Select',
      i18nField: 'CommonCol.isEnable',
      componentProps: {
        options: [
          { label: t('common.enableText'), value: 1 },
          { label: t('common.disableText'), value: 2 },
        ],
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
    },
    {
      field: 'seq',
      title: t('component.table.index'),
      type: 'seq',
      width: '50',
      align: 'center',
    },
    {
      title: '主要制程',
      field: 'MainProcess',
      width: 120,
      slots: { default: 'MainProcess' },
    },
    {
      title: '产品线代码',
      field: 'ProductLineCode',
      width: 120,
    },
    {
      title: '产品线名称',
      field: 'ProductLineName',
      width: 160,
    },
    {
      title: '内部项目代码',
      field: 'InsideProjectCode',
      width: 120,
    },
    {
      title: '上一代终端项目代码',
      field: 'ParentProjectCode',
      width: 160,
    },
    {
      title: '终端项目代码',
      field: 'TerminalCustomerProjectCode',
      width: 170,
    },
    {
      title: '旧版项目代码',
      field: 'OldInsideProjectCode',
      width: 170,
    },
    {
      title: '终端客户代码',
      field: 'TerminalCustomerCode',
      width: 170,
    },
    {
      title: '终端客户名称',
      field: 'TerminalCustomerName',
      width: 170,
    },
    {
      title: '所属组织',
      field: 'OrgName',
      width: 160,
    },
    {
      title: '是否启用',
      field: 'Status',
      i18nField: 'CommonCol.isEnable',
      width: 120,
      cellRender: {
        name: 'Tag',
        options: statusOptions,
      },
    },
    {
      title: '备注',
      field: 'Remark',
      width: 100,
    },
    {
      title: '创建人',
      field: 'CreatorUserName',
      width: 200,
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
      width: 200,
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
