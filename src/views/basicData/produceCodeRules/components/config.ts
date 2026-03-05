import { useI18n } from '/@/hooks/web/useI18n';
import { getInnerMaterialNumberList, getNameList } from '/@/api/basicData/moduleRules';

import { useBaseStore } from '/@/store/modules/base';

const { t } = useI18n();
const baseStore = useBaseStore();

// 主页form配置
export function getFormSchema() {
  return [
    // {
    //   field: 'ModuleEnCode',
    //   label: '',
    //   component: 'ApiSelect',
    //   componentProps: {
    //     placeholder: '业务模块',
    //     api: () => {
    //       return baseStore.getDictionaryData('Module');
    //     },
    //     labelField: 'fullName',
    //     valueField: 'enCode',
    //     filterOption: false,
    //     notFoundContent: null,
    //     immediate: true,
    //   },
    // },
    {
      field: 'IDField',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '内部料号',
      },
      i18nField: 'CommonCol.innerMaterialCode',
    },
    {
      field: 'RuleName',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '规则名称',
      },
    },
  ];
}

export function columns() {
  return [
    // {
    //   title: '模块编码',
    //   field: 'ModuleEnCode',
    //   width: 180,
    // },
    // {
    //   title: '模块名称',
    //   field: 'ModuleFullName',
    //   width: 200,
    // },
    {
      title: '内部料号',
      field: 'IDField',
      width: 300,
    },
    {
      title: '规则名称',
      field: 'RuleName',
      width: 300,
    },
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 100,
      fixed: 'right',
    },
  ];
}

export const addColumn: any[] = [
  // {
  //   title: '业务模块',
  //   field: 'ModuleEnCode',
  //   minWidth: 180,
  //   editRender: {
  //     name: 'ApiSelect',
  //     props: {
  //       api: () => baseStore.getDictionaryData('Module'),
  //       labelField: 'fullName',
  //       valueField: 'enCode',
  //       immediate: true,
  //       showSearch: true,
  //       onChange(_: any, option: any, { row }) {
  //         row.ModuleFullName = option?.label || '';
  //       },
  //       require:true,
  //     },

  //   },
  // },
  {
    title: '内部料号',
    field: 'IDField',
    i18nField: 'CommonCol.innerMaterialCode',
    width: 300,
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      props: {
        api: getInnerMaterialNumberList,
        params: {
          pageSize: 20,
        },
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'searchKey',
        },
        resultField: 'data',
        labelField: 'code',
        valueField: 'code',
        filterOption: false,
        notFoundContent: null,
        memoInputVal: true,
        memoInputVagueVal: true,
      },
    },
  },
  {
    title: '规则名称',
    field: 'RuleName',
    width: 300,
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      props: {
        api: getNameList,
        params: {
          Type: '4',
          pageSize: 20,
        },
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'Name',
        },
        resultField: 'data',
        labelField: 'Name',
        valueField: 'Name',
        filterOption: false,
        notFoundContent: null,
      },
    },
  },
  // {
  //   title: '模块名称',
  //   field: 'ModuleFullName',
  //   minWidth: 200,
  // },
  {
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: 100,
    fixed: 'right',
  },
];

export const editRules = {
  //ModuleEnCode: [{ required: true, message: t('common.required') }],
  IDField: [{ required: true, message: t('common.required') }],
  RuleName: [{ required: true, message: t('common.required') }],
};
