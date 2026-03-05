import { BasicColumn, FormProps } from '/@/components/Table';
import { useBaseStore } from '/@/store/modules/base';
import { useI18n } from '/@/hooks/web/useI18n';
import { getFactoryList } from '/@/api/basicData/factory';
const { t } = useI18n();
const baseStore = useBaseStore();

export const STATUS_OPTIONS = [
  { id: 0, theme: 'gray', rowKey: 'statusDesc' },
  { id: 1, fullName: t('common.enableText'), theme: 'blue', rowKey: 'statusDesc' },
  { id: 2, fullName: t('common.disableText'), theme: 'red', rowKey: 'statusDesc' },
  { id: 3, fullName: t('common.rejectText'), theme: 'yellow', rowKey: 'statusDesc' },
  { id: 4, fullName: t('common.revoke'), theme: 'purple', rowKey: 'statusDesc' },
  { id: 5, fullName: t('common.endding'), theme: 'green', rowKey: 'statusDesc' },
  { id: 6, fullName: t('common.todoText'), theme: 'gray', rowKey: 'statusDesc' },
  { id: 7, fullName: t('common.doneText'), theme: 'green', rowKey: 'statusDesc' },
  { id: 8, fullName: t('common.delText'), theme: 'gray', rowKey: 'statusDesc' },
  { id: 9, fullName: t('common.submitTodo'), theme: 'gray', rowKey: 'statusDesc' },
  { id: 10, fullName: t('common.submitted'), theme: 'green', rowKey: 'statusDesc' },
  { id: 11, fullName: t('common.agree'), theme: 'green', rowKey: 'statusDesc' },
  { id: 12, fullName: t('common.disagree'), theme: 'yellow', rowKey: 'statusDesc' },
  { id: 13, fullName: t('status.applyStatus.waiting'), theme: 'blue', rowKey: 'statusDesc' },
];

export function getColumns() {
  return [
    { type: 'checkbox', field: 'checkbox', width: 50 },
    {
      title: '主要制程',
      field: 'mainProcess',
    },
    {
      title: '工厂',
      field: 'factoryName',
    },
    {
      title: '工厂模具代码',
      field: 'moldCode',
    },
    {
      title: '模具用途',
      field: 'moldPurpose',
    },
    {
      title: '业务类型',
      field: 'businessTypeDesc',
      i18nField: 'CommonCol.businessType',
    },
    {
      title: '费用归属',
      field: 'department',
    },
    {
      title: '成本中心',
      field: 'costCenter',
    },
    {
      title: '成本中心代码',
      field: 'costCenterCode',
    },
    {
      title: '是否启用',
      field: 'status',
      cellRender: {
        name: 'Tag',
        options: STATUS_OPTIONS,
      },
    },
    {
      title: '维护人',
      field: 'creatorUserName',
    },
    {
      title: '维护时间',
      field: 'creatorTime',
      cellRender: {
        name: 'Date',
      },
    },
    {
      title: '修改人',
      field: 'lastModifyUserName',
    },
    {
      title: '修改时间',
      field: 'lastModifyTime',
      cellRender: {
        name: 'Date',
      },
    },
    { title: '操作', field: 'action', slots: { default: 'action' }, width: 50, fixed: 'right' },
  ];
}

export const editColumns = [
  {
    title: '序号',
    type: 'seq',
    field: 'index',
    width: 50,
  },
  {
    title: '业务类型',
    field: 'businessType',
    formatter: 'ApiSelect',
    minWidth: 180,
    editRender: {
      name: 'ApiSelect',
      cacheField: 'businessTypeDesc',
      props: {
        api: () => {
          return baseStore.getDictionaryData('SapFactoryMaterial', true);
        },
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
      },
    },
  },

  {
    title: '费用归属',
    field: 'department',
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      props: {
        api: () => {
          return baseStore.getDictionaryData('CostAttribution', true);
        },
        labelField: 'fullName',
        valueField: 'fullName',
        immediate: true,
      },
    },
  },

  {
    title: '成本中心',
    field: 'costCenter',
    editRender: {
      name: 'Input',
    },
    width: 320,
  },
  {
    title: '成本中心代码',
    field: 'costCenterCode',
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '主要制程',
    field: 'mainProcess',
  },
  {
    title: '工厂',
    field: 'factoryName',
  },
  {
    title: '工厂模具代码',
    field: 'moldCode',
  },
  {
    title: '模具用途',
    field: 'moldPurpose',
  },
  {
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: 100,
    fixed: 'right',
  },
];

export function getFormConfig() {
  return [
    {
      fieldName: 'mainProcess',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        api: () => baseStore.getDictionaryData('MainProcess'),
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        placeholder: t('dict.SalesSiteColumn.recordTable.mainProcessDesc'),
        style: 'width: 100%',
        allowClear: true,
      },
    },
    {
      fieldName: 'factory',
      label: '',
      component: 'ApiSelect',
      i18nField: 'factoryName',
      componentProps: {
        placeholder: '工厂',
        allowClear: true,
        api: getFactoryList,
        showSearch: true,
        apiSearch: {
          show: true,
        },
        resultField: 'data',
        labelField: 'Name',
        valueField: 'Code',
        nameFormat: ['Code', '/', 'Name'],
        filterOption: (keyword, data) => {
          if (data.label.includes(keyword)) {
            return true;
          }
        },
      },
    },
    {
      label: '',
      fieldName: 'moldCode',
      component: 'Input',
      componentProps: {
        placeholder: '工厂模具代码',
        submitOnPressEnter: true,
      },
    },
    {
      label: '',
      fieldName: 'moldPurpose',
      component: 'Input',
      componentProps: {
        placeholder: '模具用途',
        submitOnPressEnter: true,
      },
    },
    {
      label: '',
      fieldName: 'costCenter',
      component: 'Input',
      componentProps: {
        placeholder: '成本中心',
        submitOnPressEnter: true,
      },
    },
    {
      label: '',
      fieldName: 'costCenterCode',
      component: 'Input',
      componentProps: {
        placeholder: '成本中心代码',
        submitOnPressEnter: true,
      },
    },
    {
      label: '',
      fieldName: 'status',
      component: 'Select',
      componentProps: {
        placeholder: '是否启用',
        fieldNames: { label: 'fullName', value: 'id' },
        options: [
          {
            fullName: '启用',
            id: '1',
          },
          {
            fullName: '禁用',
            id: '2',
          },
        ],
      },
    },
  ];
}
export const addSchema = [
  {
    fieldName: 'businessType',
    label: '',
    i18nField: 'CommonCol.businessType',
    component: 'ApiSelect',
    componentProps: {
      api: () => {
        return baseStore.getDictionaryData('SapFactoryMaterial');
      },
      labelField: 'fullName',
      valueField: 'enCode',
      immediate: true,
    },
  },
  {
    fieldName: 'department',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      api: () => {
        return baseStore.getDictionaryData('CostAttribution');
      },
      labelField: 'fullName',
      valueField: 'fullName',
      immediate: true,
      placeholder: '费用归属',
      submitOnPressEnter: true,
    },
  },
  {
    fieldName: 'costCenter',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '成本中心',
      submitOnPressEnter: true,
    },
  },
  {
    fieldName: 'costCenterCode',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '成本中心代码',
      submitOnPressEnter: true,
    },
  },
  {
    fieldName: 'factoryName',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '工厂',
      submitOnPressEnter: true,
    },
  },
  {
    fieldName: 'moldCode',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '工厂模具代码',
      submitOnPressEnter: true,
    },
  },
  {
    fieldName: 'moldPurpose',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '模具用途',
      submitOnPressEnter: true,
    },
  },
];
