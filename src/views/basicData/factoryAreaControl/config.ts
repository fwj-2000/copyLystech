import type { VxeGridPropTypes } from '/@/components/VxeTable';
import type { FormSchema } from '/@/components/Form';

import { useI18n } from '/@/hooks/web/useI18n';
import { getFactoryList } from '/@/api/engineering/sample';

const { t } = useI18n();

/**
 * @description 状态列表
 */
export const STATUS_OPTIONS = [
  { id: true, theme: 'green', fullName: t('dict.Bool.1'), rowKey: 'statusName' },
  { id: false, theme: 'red', fullName: t('dict.Bool.2'), rowKey: 'statusName' },
];

/**
 * 列表配置
 */
export const columns: VxeGridPropTypes.Columns = [
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
  // 工厂名称
  {
    title: t('dict.CommonCol.factoryName'),
    field: 'factoryName',
    showOverflow: 'tooltip',
    formatter: ({ cellValue, row }) => cellValue || row.factory || '',
    width: '160',
  },
  // 是否合并关务工程与生产资料
  {
    title: t('dict.FactoryAreaControl.isCustomsAffairsEAP'),
    field: 'isCustomsAffairsEAP',
    showOverflow: 'tooltip',
    width: '160',
    cellRender: {
      name: 'Tag',
      options: STATUS_OPTIONS,
    },
  },
  // 是否推送模具申请pr单
  {
    title: t('dict.FactoryAreaControl.isSendMoldApplyPr'),
    field: 'isSendMoldApplyPr',
    showOverflow: 'tooltip',
    width: '160',
    cellRender: {
      name: 'Tag',
      options: STATUS_OPTIONS,
    },
  },
  // 是否推送模具申请po单
  {
    title: t('dict.FactoryAreaControl.isSendMoldApplyPo'),
    field: 'isSendMoldApplyPo',
    showOverflow: 'tooltip',
    width: '160',
    cellRender: {
      name: 'Tag',
      options: STATUS_OPTIONS,
    },
  },
  // 模具申请价格控制
  {
    title: t('dict.FactoryAreaControl.moldApplyPriceControl'),
    field: 'moldApplyPriceControl',
    showOverflow: 'tooltip',
    width: '160',
  },
  // 设计工程工单号前缀
  {
    title: t('dict.FactoryAreaControl.designEngineeringWorkNoPrefix'),
    field: 'designEngineeringWorkNoPrefix',
    showOverflow: 'tooltip',
    width: '160',
  },
  // 创建时间
  {
    title: t('dict.OriginCountryColumn.creatorTime'),
    field: 'creatorTime',
    showOverflow: 'tooltip',
    width: '160',
    cellRender: {
      name: 'Date',
      // @ts-ignore
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  // 创建人姓名
  {
    title: t('dict.OriginCountryColumn.creatorUserName'),
    field: 'creatorUserName',
    showOverflow: 'tooltip',
    width: '220',
  },
  // 修改时间
  {
    title: t('dict.OriginCountryColumn.lastModifyTime'),
    field: 'lastModifyTime',
    showOverflow: 'tooltip',
    width: '160',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  // 修改人姓名
  {
    title: t('dict.OriginCountryColumn.lastModifyUserName'),
    field: 'lastModifyUserName',
    showOverflow: 'tooltip',
    width: '220',
  },
  {
    title: t('common.action'),
    field: 'action',
    slots: { default: 'action' },
    width: 50,
    fixed: 'right',
  },
];

/**
 * 列表 - 查询表单
 */
export const schema = [
  // 工厂
  {
    fieldName: 'factory',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      api: getFactoryList,
      allowClear: true,
      showSearch: true,
      apiSearch: {
        show: true,
        searchName: 'factoryCode',
      },
      resultField: 'data',
      labelField: 'Name',
      valueField: 'Code',
      nameFormat: ['Code', '/', 'Name'],
      filterOption: false,
      immediate: true,
      placeholder: t('dict.CommonCol.factoryName'),
    },
  },
  // 是否合并关务工程与生产资料
  {
    fieldName: 'isCustomsAffairsEAP',
    label: '',
    component: 'Select',
    componentProps: {
      allowClear: true,
      options: STATUS_OPTIONS,
      fieldNames: { label: 'fullName', value: 'id' },
      placeholder: t('dict.FactoryAreaControl.isCustomsAffairsEAP'),
    },
  },
];

// TODO: 表单中，`select`的选项的`value`为布尔值的`false`有问题，待排查，先使用转换为字符串的方案
/** 表单选项 */
const FORM_STATUS_OPTIONS = STATUS_OPTIONS.map(item => ({ ...item, id: `${item.id}` }));

/**
 * 表单 - 表单配置
 */
export const formSchema: FormSchema[] = [
  // 工厂
  {
    field: 'factory',
    label: t('dict.CommonCol.factoryName'),
    component: 'ApiSelect',
    componentProps: {
      api: getFactoryList,
      showSearch: true,
      apiSearch: {
        show: true,
        searchName: 'keyword',
      },
      resultField: 'data',
      labelField: 'Name',
      valueField: 'Code',
      nameFormat: ['Code', '/', 'Name'],
      filterOption: false,
      immediate: true,
    },
    rules: [{ required: true, trigger: 'blur' }],
  },
  // 是否合并关务工程与生产资料
  {
    field: 'isCustomsAffairsEAP',
    label: t('dict.FactoryAreaControl.isCustomsAffairsEAP'),
    component: 'Select',
    componentProps: {
      options: FORM_STATUS_OPTIONS,
      fieldNames: { label: 'fullName', value: 'id' },
    },
    // rules: [{ required: true, trigger: 'blur' }],
  },
  // 是否推送模具申请pr单
  {
    field: 'isSendMoldApplyPr',
    label: t('dict.FactoryAreaControl.isSendMoldApplyPr'),
    component: 'Select',
    componentProps: {
      options: FORM_STATUS_OPTIONS,
      fieldNames: { label: 'fullName', value: 'id' },
    },
    // rules: [{ required: true, trigger: 'blur' }],
  },
  // 是否推送模具申请po单
  {
    field: 'isSendMoldApplyPo',
    label: t('dict.FactoryAreaControl.isSendMoldApplyPo'),
    component: 'Select',
    componentProps: {
      options: FORM_STATUS_OPTIONS,
      fieldNames: { label: 'fullName', value: 'id' },
    },
    // rules: [{ required: true, trigger: 'blur' }],
  },
  // 模具申请价格控制
  {
    field: 'moldApplyPriceControl',
    label: t('dict.FactoryAreaControl.moldApplyPriceControl'),
    component: 'Input',
    // rules: [{ required: true, trigger: 'blur' }],
  },
  // 设计工程工单号前缀
  {
    field: 'designEngineeringWorkNoPrefix',
    label: t('dict.FactoryAreaControl.designEngineeringWorkNoPrefix'),
    component: 'Input',
    // rules: [{ required: true, trigger: 'blur' }],
  },
];
