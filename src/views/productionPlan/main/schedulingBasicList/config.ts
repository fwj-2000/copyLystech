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
    field: 'factoryAreaName',
    i18nField: 'factoryAreaName',
    width: '200',
  },
  {
    title: '线体',
    field: 'lineName',
    width: '160',
  },
  {
    title: '数据中心',
    field: 'dataCenterName',
    width: '160',
  },
  {
    title: '状态',
    field: 'status',
    width: '120',
    cellRender: {
      name: 'Tag',
      options: STATUS_OPTIONS,
    },
  },
  {
    title: '创建时间',
    field: 'creatorTime',
    Width: '160',
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
    Width: '160',
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
    fieldName: 'lineName',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '线体',
      allowClear: true,
    },
  },
  {
    fieldName: 'dataCenterName',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '数据中心',
      allowClear: true,
    },
  },
  // {
  //   fieldName: 'status',
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
    field: 'lineName',
    label: '线体',
    component: 'Input',
    required: true,
  },
  {
    field: 'dataCenterName',
    label: '数据中心',
    component: 'Input',
    required: true,
  },
  {
    field: 'status',
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
