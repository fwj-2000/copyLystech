import type { VxeGridPropTypes } from '/@/components/VxeTable';
import { useI18n } from '/@/hooks/web/useI18n';
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
    showOverflow: 'tooltip',
    width: '90',
  },
  {
    title: '内部料号',
    field: 'innerMC',
    showOverflow: 'tooltip',
    width: '170',
  },
  {
    title: '内七码',
    field: 'innerSixCode',
    showOverflow: 'tooltip',
    width: '70',
  },
  {
    title: 'APN',
    field: 'apn',
    showOverflow: 'tooltip',
    width: '70',
  },
  {
    title: 'APN类型',
    field: 'apnType',
    showOverflow: 'tooltip',
    width: '90',
  },
  {
    title: '所属项目',
    field: 'belongToProject',
    showOverflow: 'tooltip',
    width: '110',
  },
  {
    title: '厂区',
    field: 'factory',
    showOverflow: 'tooltip',
    width: '90',
  },
  {
    title: '相似件',
    field: 'similarity',
    showOverflow: 'tooltip',
    width: '150',
  },
  {
    title: '合并料号',
    field: 'mergeMC',
    showOverflow: 'tooltip',
    width: '170',
  },
  {
    title: '创建时间',
    field: 'creatorTime',
    showOverflow: 'tooltip',
    width: '120',
    cellRender: {
      name: 'Date',
    },
  },
  {
    title: '创建人姓名',
    field: 'creatorUserName',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: '修改时间',
    field: 'lastModifyTime',
    showOverflow: 'tooltip',
    width: '120',
    cellRender: {
      name: 'Date',
    },
  },
  {
    title: '修改人姓名',
    field: 'lastModifyUserName',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: t('common.action'),
    field: 'action',
    slots: { default: 'action' },
    width: '80',
    fixed: 'right',
  },
];

/**
 * 列表 - 查询表单
 */
export const frmSchema = () => [
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
  // 内部料号
  {
    fieldName: 'innerMC',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '内部料号',
      allowClear: true,
    },
  },
  // 合并料号
  {
    fieldName: 'mergeMC',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '合并料号',
      allowClear: true,
    },
  },
];

/**
 * 表单 - 表单配置
 */
export const formSchema = [
  {
    field: 'innerMC',
    label: '内部料号',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    colProps: {
      span: 12,
    },
  },
  {
    field: 'innerSixCode',
    label: '内七码',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    colProps: {
      span: 12,
    },
  },
  {
    field: 'apn',
    label: 'APN',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    // rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    colProps: {
      span: 12,
    },
  },
  {
    field: 'apnType',
    label: 'APN类型',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    // rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    colProps: {
      span: 12,
    },
  },
  {
    field: 'belongToProject',
    label: '所属项目',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    colProps: {
      span: 12,
    },
  },
  {
    field: 'factory',
    label: '厂区',
    component: 'Input',
    rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    colProps: {
      span: 12,
    },
  },
  {
    field: 'similarity',
    label: '相似件',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    // rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    colProps: {
      span: 12,
    },
  },
  {
    field: 'mergeMC',
    label: '合并料号',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
    colProps: {
      span: 12,
    },
  },
];

/**
 * 导入列配置
 */
export const importColumn = [
  {
    title: '内部料号',
    dataIndex: 'innerMC',
    showOverflow: 'tooltip',
    width: '200',
  },
  {
    title: '内七码',
    dataIndex: 'innerSixCode',
    showOverflow: 'tooltip',
    width: '200',
  },
  {
    title: 'APN',
    dataIndex: 'apn',
    showOverflow: 'tooltip',
    width: '200',
  },
  {
    title: 'APN类型',
    dataIndex: 'apnType',
    showOverflow: 'tooltip',
    width: '160',
  },
  {
    title: '所属项目',
    dataIndex: 'belongToProject',
    showOverflow: 'tooltip',
    width: '200',
  },
  {
    title: '厂区',
    dataIndex: 'factory',
    showOverflow: 'tooltip',
    width: '200',
  },
  {
    title: '相似件',
    dataIndex: 'similarity',
    showOverflow: 'tooltip',
    width: '200',
  },
  {
    title: '合并料号',
    dataIndex: 'mergeMC',
    showOverflow: 'tooltip',
    width: '200',
  },
];
