import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
import dayjs from 'dayjs';
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
    minWidth: '160',
  },
  {
    title: '项目',
    field: 'project',
    minWidth: '160',
  },
  {
    title: 'SAP工厂',
    field: 'sapFactory',
    minWidth: '160',
  },
  {
    title: '产品线',
    field: 'productLine',
    minWidth: '160',
  },
  {
    title: '新旧项目',
    field: 'newOldProjects',
    minWidth: '160',
  },
  {
    title: '是否启用',
    field: 'enabledMark',
    i18nField: 'enabledMarkName',
    minWidth: '120',
    cellRender: {
      name: 'Tag',
      options: STATUS_OPTIONS,
    },
  },
  {
    title: '创建时间',
    field: 'creatorTime',
    Width: '130',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '创建人',
    field: 'creatorUserName',
    Width: '180',
  },
  {
    title: '修改时间',
    field: 'lastModifyTime',
    Width: '130',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '修改人',
    field: 'lastModifyUserName',
    Width: '180',
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
    fieldName: 'project',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '项目',
      allowClear: true,
    },
  },
  {
    fieldName: 'sapFactory',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: 'SAP工厂',
      allowClear: true,
    },
  },
  {
    fieldName: 'productLine',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '产品线',
      allowClear: true,
    },
  },
  {
    fieldName: 'newOldProjects',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '新旧项目',
      allowClear: true,
    },
  },
  // {
  //   fieldName: 'EnabledMark',
  //   i18nField: 'EnabledMark',
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
      placeholder: '工厂',
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
    field: 'project',
    label: '项目',
    component: 'Input',
    required: true,
  },
  {
    field: 'sapFactory',
    label: 'SAP工厂',
    component: 'Input',
    required: true,
  },
  {
    field: 'productLine',
    label: '产品线',
    component: 'Input',
    required: true,
  },
  {
    field: 'newOldProjects',
    label: '新旧项目',
    component: 'Input',
    required: true,
  },
  {
    field: 'enabledMark',
    i18nField: 'enabledMarkName',
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
];

/**
 * 导入列配置
 */
export const importColumn = [
  {
    title: '工厂',
    field: 'factory',
    minWidth: '160',
  },
  {
    title: '项目',
    field: 'project',
    minWidth: '160',
  },
  {
    title: 'SAP工厂',
    field: 'sapFactory',
    minWidth: '160',
  },
  {
    title: '产品线',
    field: 'productLine',
    minWidth: '220',
  },
  {
    title: '新旧项目',
    field: 'newOldProjects',
    minWidth: '160',
  },
];

/**
 * 导出列配置
 */
export const exportColumn = [
  {
    title: '工厂',
    field: 'factory',
    minWidth: '160',
  },
  {
    title: '项目',
    field: 'project',
    minWidth: '160',
  },
  {
    title: 'SAP工厂',
    field: 'sapFactory',
    minWidth: '160',
  },
  {
    title: '产品线',
    field: 'productLine',
    minWidth: '220',
  },
  {
    title: '新旧项目',
    field: 'newOldProjects',
    minWidth: '160',
  },
  {
    title: '是否启用',
    field: 'enabledMarkName',
    Width: '160',
  },
  {
    title: '创建人',
    field: 'creatorUserName',
    Width: '160',
  },
  {
    title: '创建时间',
    field: 'creatorTime',
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
