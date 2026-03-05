import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
import { getFactoryList } from '/@/api/basicData/factory';

const { t } = useI18n();
const baseStore = useBaseStore();

/**
 * @description 状态列表
 */
export const STATUS_OPTIONS = [
  { id: 1, fullName: t('common.enableText'), theme: 'green', rowKey: 'statusDesc' },
  { id: 2, fullName: t('common.disableText'), theme: 'red', rowKey: 'statusDesc' },
];

/**
 * 列表配置
 */
export const columns = [
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
  {
    title: '工厂',
    field: 'factoryName',
    i18nField: 'factory',
    width: '140',
  },
  {
    title: '车间',
    field: 'workshop',
    width: '120',
  },
  {
    title: '控制者',
    field: 'codeController',
    width: '120',
  },
  {
    title: '描述',
    field: 'description',
    width: '220',
  },
  {
    title: '状态',
    field: 'enabledMark',
    i18nField: 'enabledMark',
    width: '100',
    cellRender: {
      name: 'Tag',
      options: STATUS_OPTIONS,
    },
  },
  {
    title: '创建时间',
    field: 'creatorTime',
    Width: '140',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '创建人',
    field: 'creatorUserName',
    Width: '200',
  },
  {
    title: '修改时间',
    field: 'lastModifyTime',
    Width: '140',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '修改人',
    field: 'lastModifyUserName',
    Width: '200',
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
  {
    fieldName: 'factory',
    label: '',
    component: 'ApiSelect',
    i18nField: 'CommonCol.factory',
    componentProps: {
      placeholder: '工厂',
      // defaultFirstOption: true,
      api: getFactoryList,
      resultField: 'data',
      labelField: 'Name',
      valueField: 'Code',
      // nameFormat: ['Code', '/', 'Name'],
      // showSearch: true,
      // dropdownMatchSelectWidth: false,
      // filterOption: factoryFilterOption,
    },
  },
  {
    fieldName: 'workshop',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '车间',
      allowClear: true,
    },
  },
  {
    fieldName: 'codeController',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '控制者',
      allowClear: true,
    },
  },
  // {
  //   fieldName: 'enabledMark',
  //   i18nField: 'enabledMark',
  //   label: '',
  //   component: 'ApiSelect',
  //   componentProps: {
  //     api: () => baseStore.getDictionaryData('enableStatus'),
  //     resultField: 'data',
  //     labelField: 'fullName',
  //     valueField: 'enCode',
  //     placeholder: '状态',
  //     allowClear: true,
  //   },
  // },
];

/**
 * 表单 - 表单配置
 */
export const formSchema = [
  {
    field: 'factory',
    label: '工厂',
    i18nField: 'CommonCol.factory',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '厂区',
      api: getFactoryList,
      resultField: 'data',
      labelField: 'Name',
      valueField: 'Code',
      // nameFormat: ['Code', '/', 'Name'],
      // showSearch: true,
      // dropdownMatchSelectWidth: false,
      // filterOption: factoryFilterOption,
    },
    required: true,
  },
  {
    field: 'workshop',
    label: '车间',
    component: 'Input',
    required: true,
  },
  {
    field: 'codeController',
    label: '控制者',
    component: 'Input',
    required: true,
  },
  {
    field: 'enabledMark',
    i18nField: 'enabledMark',
    label: '状态',
    component: 'Select',
    defaultValue: 1,
    componentProps: {
      placeholder: '请选择',
      options: [
        { fullName: t('common.enableText'), id: 1 },
        { fullName: t('common.disableText'), id: 2 },
      ],
    },
    required: true,
  },
  {
    field: 'description',
    label: '描述',
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
  {
    title: '工厂',
    field: 'factoryArea',
    width: '160',
  },
  {
    title: '车间',
    field: 'workshop',
    width: '160',
  },
  {
    title: '控制者',
    field: 'controller',
    width: '160',
  },
  {
    title: '备注',
    field: 'remark',
    width: '220',
  },
  {
    title: '状态',
    field: 'statusName',
    width: '160',
  },
  {
    title: '创建时间',
    field: 'creatorTime',
    Width: '160',
  },
  {
    title: '创建人',
    field: 'creatorUserName',
    Width: '160',
  },
  {
    title: '修改时间',
    field: 'lastModifyTime',
    Width: '160',
  },
  {
    title: '修改人',
    field: 'lastModifyUserName',
    Width: '160',
  },
];
