import { useI18n } from '/@/hooks/web/useI18n';
import type { FormSchema } from '/@/components/Form';
import type { VxeGridPropTypes } from '/@/components/VxeTable';
import { getFactoryList } from '/@/api/basicData/factory';
import { factoryFilterOption } from '../utils/index';

const { t } = useI18n();

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
    title: '工厂',
    field: 'factoryAreaName',
    i18nField: 'factoryArea',
    width: '110',
  },
  {
    title: '内部料号',
    field: 'innerMaterialCode',
    width: '170',
  },
  {
    title: '排产触发周数',
    field: 'triggerWeeks',
    width: '100',
  },
  {
    title: '排产上限周数',
    field: 'upperLimitWeeks',
    width: '100',
  },
  {
    title: '排产释放周数',
    field: 'releaseWeeks',
    width: '100',
  },
  {
    title: 'Cover周数上限',
    field: 'coverWeekUpper',
    width: '110',
  },
  {
    title: 'Cover周数下限',
    field: 'coverWeekLower',
    width: '110',
  },
  {
    title: '创建时间',
    field: 'creatorTime',
    width: '140',
    cellRender: {
      name: 'Date',
    },
  },
  {
    title: '创建人姓名',
    field: 'creatorUserName',
    width: '200',
  },
  {
    title: '修改时间',
    field: 'lastModifyTime',
    width: '140',
    cellRender: {
      name: 'Date',
    },
  },
  {
    title: '修改人姓名',
    field: 'lastModifyUserName',
    width: '200',
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
export const frmSchema = [
  {
    fieldName: 'pickerVal',
    label: '',
    component: 'RangePicker',
    componentProps: {
      placeholder: [t('component.lydc.dateRange.startPlaceholder'), t('component.lydc.dateRange.endPlaceholder')],
    },
  },
  {
    fieldName: 'factoryArea',
    label: '',
    component: 'ApiSelect',
    i18nField: 'CommonCol.factory',
    componentProps: {
      placeholder: '厂区',
      // defaultFirstOption: true,
      resultField: 'data',
      labelField: 'Name',
      valueField: 'Code',
      nameFormat: ['Code', '/', 'Name'],
      api: getFactoryList,
      showSearch: true,
      dropdownMatchSelectWidth: false,
      filterOption: factoryFilterOption,
    },
  },
  {
    fieldName: 'innerMaterialCode',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '内部料号',
      allowClear: true,
    },
  },
];

/**
 * 表单 - 表单配置
 */
export const formSchema: FormSchema[] = [
  {
    field: 'innerMaterialCode',
    label: '内部料号',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    rules: [{ required: true, trigger: 'blur', message: '必填' }],
  },
  {
    field: 'triggerWeeks',
    label: '排产触发周数',
    component: 'InputNumber',
    componentProps: { placeholder: '请输入', min: 1, step: 1, precision: 1 },
    rules: [{ required: true, trigger: 'blur', message: '必填' }],
  },
  {
    field: 'upperLimitWeeks',
    label: '排产上限周数',
    component: 'InputNumber',
    componentProps: { placeholder: '请输入', min: 1, step: 1, precision: 1 },
    rules: [{ required: true, trigger: 'blur', message: '必填' }],
  },
  {
    field: 'releaseWeeks',
    label: '排产释放周数',
    component: 'InputNumber',
    componentProps: { placeholder: '请输入', min: 1, step: 1, precision: 1 },
    rules: [{ required: true, trigger: 'blur', message: '必填' }],
  },
  {
    field: 'coverWeekUpper',
    label: 'Cover周数上限',
    component: 'InputNumber',
    componentProps: { placeholder: '请输入', min: 0, step: 1, precision: 1 },
    rules: [{ required: true, trigger: 'blur', message: '必填' }],
  },
  {
    field: 'coverWeekLower',
    label: 'Cover周数下限',
    component: 'InputNumber',
    componentProps: { placeholder: '请输入', min: 0, step: 1, precision: 1 },
    rules: [{ required: true, trigger: 'blur', message: '必填' }],
  },
];

/**
 * 导入列配置
 */
export const importColumn = [
  {
    title: '内部料号',
    dataIndex: 'innerMaterialCode',
    width: '140',
  },
  {
    title: '排产触发周数',
    dataIndex: 'triggerWeeks',
    width: '140',
  },
  {
    title: '排产上限周数',
    dataIndex: 'upperLimitWeeks',
    width: '140',
  },
  {
    title: '排产释放周数',
    dataIndex: 'releaseWeeks',
    width: '140',
  },
  {
    title: 'Cover周数上限',
    dataIndex: 'coverWeekUpper',
    width: '140',
  },
  {
    title: 'Cover周数下限',
    dataIndex: 'coverWeekLower',
    width: '140',
  },
];
