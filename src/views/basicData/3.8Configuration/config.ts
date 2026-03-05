import { useI18n } from '/@/hooks/web/useI18n';
import { getFactoryList } from '/@/api/basicData/factory';

const { t } = useI18n();

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
    title: '工厂',
    field: 'factoryAreaName',
    minWidth: '160',
  },
  {
    title: '3.8配置ID',
    field: 'configId',
    minWidth: '160',
  },
  {
    title: '钉钉链接',
    field: 'dingLink',
    minWidth: '160',
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
    fieldName: 'factoryArea',
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
    fieldName: 'configId',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '3.8配置ID',
      allowClear: true,
    },
  },
  // {
  //   fieldName: 'dingLink',
  //   label: '',
  //   component: 'Input',
  //   componentProps: {
  //     placeholder: '钉钉链接',
  //     allowClear: true,
  //   },
  // },
];

/**
 * 表单 - 表单配置
 */
export const formSchema = [
  {
    field: 'factoryArea',
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
    field: 'configId',
    label: '3.8配置ID',
    component: 'Input',
    required: true,
  },
  {
    field: 'dingLink',
    label: '钉钉链接',
    component: 'Input',
  },
];
