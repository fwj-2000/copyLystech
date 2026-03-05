import { usePermission } from '/@/hooks/web/usePermission';
import { cloneDeep } from 'lodash-es';
import { useI18n } from '/@/hooks/web/useI18n';
import { getbulist, getbusinessscopelist, getfactorylist } from '/@/api/equipment/equipmentLedger';

import { useBaseStore } from '/@/store/modules/base';

const { t } = useI18n();
const baseStore = useBaseStore();

// 主页form配置
export function getFormSchema() {
  return [
    {
      field: 'buS',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        api: getbulist,
        resultField: 'data',
        labelField: 'name',
        valueField: 'code',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        placeholder: 'BU',
        mode: 'multiple',
      },
      i18nField: 'buName',
    },
    {
      field: 'codeS',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        api: getbusinessscopelist,
        resultField: 'data',
        labelField: 'name',
        valueField: 'code',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        placeholder: '业务范围描述',
        mode: 'multiple',
      },
      i18nField: 'name',
    },
    {
      field: 'pmcDri',
      label: '',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: 'PMC DRI',
      },
      i18nField: 'pmcDriName',
    },
    {
      field: 'equipmentManager',
      label: '',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: '设备管理人员',
      },
      i18nField: 'equipmentManagerName',
    },
  ];
}

// 主页表格column配置
const column = [
  {
    title: '业务范围',
    sortable: true,
    field: 'code',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '业务范围描述',
    sortable: true,
    field: 'name',
    width: 200,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '厂区简称',
    field: 'factoryShortCode',
    width: 200,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    sortable: true,
    i18nField: 'CommonCol.factoryAbbreviation',
  },
  {
    title: 'BU归属',
    field: 'buName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    sortable: true,
    width: 160,
  },
  {
    title: '厂区归属(SBU)',
    field: 'factoryAreaName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    sortable: true,
    width: 150,
  },
  {
    title: 'PMC DRI',
    field: 'pmcDriName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'CustomUserSelect',
      searchField: 'pmcDri',
    },
    sortable: true,
    width: 160,
  },
  {
    title: '设备管理员 DRI',
    field: 'equipmentManagerName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'CustomUserSelect',
      searchField: 'equipmentManager',
    },
    sortable: true,
    i18nField: 'CommonCol.DRIDeviceAdministrator',
    width: 160,
  },
  {
    title: '运营人员',
    field: 'mesOperationName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'CustomUserSelect',
      searchField: 'mesOperation',
    },
    sortable: true,
    width: 160,
  },
  {
    title: '3.8DRI',
    field: 'mesDriName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'CustomUserSelect',
      searchField: 'mesDri',
    },
    sortable: true,
    width: 160,
  },
  {
    title: '备注',
    field: 'remark',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
    sortable: true,
    i18nField: 'CommonCol.remark',
  },
  {
    title: '创建人',
    field: 'creatorUserName',
    width: 180,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    sortable: true,
  },
  {
    title: '创建时间',
    field: 'creatorTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    sortable: true,
    width: 140,
  },
  {
    title: '修改人',
    field: 'lastModifyUserName',
    width: 180,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    sortable: true,
  },
  {
    title: '修改时间',
    field: 'lastModifyTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    sortable: true,
    width: 140,
  },
];

export function getColumn(): any {
  const columnData = cloneDeep(column);
  columnData.unshift({ type: 'checkbox', field: 'checkbox', width: 70 });
  columnData.push({
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: 100,
    fixed: 'right',
  });
  return columnData;
}

export function getExportColumn() {
  return cloneDeep(column);
}

export function getAddSchema() {
  return [
    {
      fieldName: 'searchKey',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '业务范围',
      },
      i18nField: 'code',
    },
  ];
}

export const addGridColumn: any[] = [
  { field: 'checkbox', width: 50, type: 'checkbox' },
  {
    title: '序号',
    type: 'seq',
    field: 'index',
    width: 50,
    i18nField: 'number',
  },
  {
    title: '业务范围',
    // sortable: true,
    field: 'code',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 160,
  },
  {
    title: '业务范围描述',
    field: 'name',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
  },
];

export function getEditSchemas() {
  return [
    {
      field: 'code',
      label: '业务范围',
      component: 'Input',
      componentProps: {
        placeholder: '业务范围',
        disabled: true,
      },
    },
    {
      field: 'name',
      label: '业务范围描述',
      component: 'Input',
      componentProps: {
        placeholder: '业务范围描述',
        disabled: true,
      },
    },
    {
      field: 'bu',
      label: 'BU归属',
      component: 'ApiSelect',
      required: true,
      componentProps: {
        api: getbulist,
        resultField: 'data',
        labelField: 'name',
        valueField: 'code',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        placeholder: 'BU归属',
      },
      i18nField: 'buName',
    },
    {
      field: 'factoryArea',
      label: '厂区归属(SBU)',
      component: 'Select',
      required: true,
      componentProps: {
        fieldNames: {
          value: 'code',
          label: 'name',
        },
        options: [],
      },
      i18nField: 'factoryAreaName',
    },
    {
      field: 'factoryShortCode',
      label: '厂区简称',
      component: 'Input',
      required: true,
      componentProps: {
        placeholder: '厂区简称',
      },
      i18nField: 'CommonCol.factoryAbbreviation',
    },
    {
      field: 'pmcDri',
      label: 'PMC DRI',
      component: 'CustomUserSelect',
      required: true,
      componentProps: {
        placeholder: 'PMC DRI',
      },
      i18nField: 'pmcDriName',
    },
    {
      field: 'equipmentManager',
      label: '设备管理员',
      component: 'CustomUserSelect',
      required: true,
      componentProps: {
        placeholder: '设备管理员',
        multiple: true,
      },
      i18nField: 'equipmentManagerName',
    },
    {
      field: 'mesOperation',
      label: '运营人员',
      component: 'CustomUserSelect',
      required: true,
      componentProps: {
        placeholder: '运营人员',
        multiple: true,
      },
      i18nField: 'mesOperationName',
    },
    {
      field: 'mesDri',
      label: '3.8DRI',
      component: 'CustomUserSelect',
      required: true,
      componentProps: {
        placeholder: '3.8DRI',
        multiple: true,
      },
      i18nField: 'mesDriName',
    },
    {
      field: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: {
        placeholder: '备注',
      },
    },
  ];
}
