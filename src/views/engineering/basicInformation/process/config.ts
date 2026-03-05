import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
import { usePermission } from '/@/hooks/web/usePermission';
import { ListByUserfactory } from '/@/api/productionPlan/processRoute';

const { t } = useI18n();
export const STATUS_OPTIONS = [
  { id: 1, fullName: t('dict.enableStatus.1'), value: 1, label: t('dict.enableStatus.1'), theme: 'green' }, //启用
  { id: 2, fullName: t('dict.enableStatus.2'), value: 2, label: t('dict.enableStatus.2'), theme: 'red' }, //禁用
];
const baseStore = useBaseStore();

export const getCommonColumns = () => {
  return [
    { title: '工序编码', field: 'code', width: '100' },
    { title: '工序名称', field: 'name', minWidth: '125' },
    { title: '生产类型', field: 'typeDesc', width: '100' },
    { title: '主要制程', field: 'mainProcessDesc', width: '100' },
    { title: '工序类型', field: 'processTypeDesc', width: '100' },
    { title: '工厂', field: 'factoryAreaName', width: '120', i18nField: 'CommonCol.factoryArea' },
    { title: '组织', field: 'orgName', width: '120' },
    {
      title: '是否启用',
      i18nField: 'CommonCol.isEnable',
      field: 'status',
      width: 100,
      cellRender: {
        name: 'Tag',
        options: STATUS_OPTIONS,
      },
    },
    { title: '创建人', field: 'creatorUserName' },
    {
      title: '创建时间',
      field: 'creatorTime',
      cellRender: {
        name: 'Date',
      },
      width: '120',
    },
    { title: '修改人', field: 'lastModifyUserName', width: '160' },
    {
      title: '修改时间',
      field: 'lastModifyTime',
      cellRender: {
        name: 'Date',
      },
      width: '120',
    },
    {
      title: '备注',
      field: 'remark',
      width: '120',
    },
  ];
};
export function getProcessColumns() {
  const { hasBtnP } = usePermission();
  const column = getCommonColumns();
  if (hasBtnP('btn_detail')) {
    column.unshift({ type: 'checkbox', field: 'checkbox', width: '50' });
    column.push({
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: '70',
      fixed: 'right',
    });
  }
  return column;
}

export function getQuotaFormConfig() {
  return [
    {
      fieldName: 'code',
      label: '',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入工序编码',
      },
    },
    {
      fieldName: 'name',
      label: '',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入工序名称',
      },
    },
    {
      fieldName: 'type',
      label: '',
      component: 'ApiSelect',
      i18nField: 'CommonCol.type',
      componentProps: {
        api: () => baseStore.getDictionaryData('Process.ProduceType'),
        labelField: 'fullName',
        valueField: 'enCode',
        allowClear: true,
        placeholder: '生产类型',
      },
    },
    {
      fieldName: 'mainProcess',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择主要制程',
        api: () => baseStore.getDictionaryData('MainProcess'),
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
    },
    {
      fieldName: 'processType',
      label: '',
      component: 'ApiSelect',
      i18nField: 'CommonCol.processType',
      componentProps: {
        api: () => baseStore.getDictionaryData('Process.Type'),
        labelField: 'fullName',
        valueField: 'enCode',
        allowClear: true,
        placeholder: '工序类型',
      },
    },
    {
      fieldName: 'factoryArea',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择工厂',
        api: ListByUserfactory,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'searchKey',
        },
        resultField: 'data',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        // labelField: 'Name',
        valueField: 'Code',
        nameFormat: ['Name', '/', 'Code'],
      },
    },
    {
      fieldName: 'status',
      label: '',
      component: 'Select',
      i18nField: 'CommonCol.isEnable',
      componentProps: {
        allowClear: true,
        placeholder: '状态',
        options: STATUS_OPTIONS,
      },
    },
  ];
}
