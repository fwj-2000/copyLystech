import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
import { usePermission } from '/@/hooks/web/usePermission';

const { t } = useI18n();
export const STATUS_OPTIONS = [
  { id: false, fullName: t('dict.enableStatus.1'), value: false, label: t('dict.enableStatus.1'), theme: 'green' }, //启用
  { id: true, fullName: t('dict.enableStatus.2'), value: true, label: t('dict.enableStatus.2'), theme: 'red' }, //禁用
];
const baseStore = useBaseStore();
export const getCommonColumns = () => {
  return [
    { title: '名称', field: 'name', width: '100', i18nField: 'CommonCol.templateName' },
    { title: '物料号', field: 'productCode', i18nField: 'dict.ProcessRouteColumn.material', width: '200' },
    { title: '直接客户', field: 'immediateCustomerName', i18nField: 'CommonCol.directCustomer', width: '150' },
    { title: '编码', field: 'en_code', i18nField: 'CommonCol.encode', width: '100' },
    {
      title: '状态',
      i18nField: 'CommonCol.status',
      field: 'enable',
      width: '100',
      cellRender: {
        name: 'Tag',
        options: STATUS_OPTIONS,
      },
    },
    { title: '分类', field: 'firstCategoryName', i18nField: 'CommonCol.classification' },
    { title: '创建人', field: 'creatorUserName', i18nField: 'CommonCol.creatorUserName' },
    {
      title: '创建时间',
      field: 'creatorTime',
      cellRender: {
        name: 'Date',
      },
      i18nField: 'CommonCol.creatorTime',
    },
    {
      title: '修改时间',
      field: 'lastModifyTime',
      cellRender: {
        name: 'Date',
      },
      i18nField: 'CommonCol.updateTime',
    },
    {
      title: '修改人',
      field: 'lastModifyUserName',
      i18nField: 'CommonCol.updateUser',
    },

    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: '200',
      fixed: 'right',
    },
  ];
};
export function getPrintTemplateColumns() {
  // const { hasBtnP } = usePermission();
  const column = getCommonColumns();
  // if (hasBtnP('btn_detail')) {
  //   column.unshift({ type: 'checkbox', field: 'checkbox', width: '70' });
  //   column.push({
  //     title: '操作',
  //     field: 'action',
  //     slots: { default: 'action' },
  //     width: '80',
  //     fixed: 'right',
  //   });
  // }
  return column;
}

export function getPrintTemplateFormConfig() {
  return [
    {
      fieldName: 'name',
      label: '',
      component: 'Input',
      i18nField: 'CommonCol.templateName',
      componentProps: {
        allowClear: true,
        placeholder: '请输入模板名称',
      },
    },
    {
      fieldName: 'enCode',
      label: '',
      component: 'Input',
      i18nField: 'CommonCol.encode',
      componentProps: {
        allowClear: true,
        placeholder: '请输入模板编码',
      },
    },
    // {
    //   fieldName: 'category',
    //   label: '',
    //   component: 'ApiSelect',
    //   // i18nField: 'common.leftTreeSearchText',
    //   componentProps: {
    //     api: () => baseStore.getDictionaryData('printDev'),
    //     labelField: 'fullName',
    //     valueField: 'enCode',
    //     allowClear: true,
    //     placeholder: '分类',
    //   },
    // },
    // {
    //   fieldName: 'enable',
    //   label: '',
    //   component: 'Select',
    //   // i18nField: 'CommonCol.status',
    //   componentProps: {
    //     allowClear: true,
    //     placeholder: '状态',
    //     options: STATUS_OPTIONS,
    //   },
    // },
  ];
}
