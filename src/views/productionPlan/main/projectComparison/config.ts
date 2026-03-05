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
    showOverflow: 'tooltip',
    width: '110',
  },
  {
    title: '内六码',
    field: 'sixCode',
    showOverflow: 'tooltip',
    width: '90',
  },
  {
    title: 'APN',
    field: 'apn',
    showOverflow: 'tooltip',
    width: '110',
  },
  {
    title: '子项目',
    field: 'childProject',
    showOverflow: 'tooltip',
    width: '100',
  },
  {
    title: '归属项目PMC',
    field: 'targetProjectPMC',
    showOverflow: 'tooltip',
    width: '110',
  },
  {
    title: '归属项目PDT',
    field: 'targetProjectPDT',
    showOverflow: 'tooltip',
    width: '110',
  },
  {
    title: '销售',
    field: 'sales',
    showOverflow: 'tooltip',
    width: '100',
  },
  {
    title: 'PM',
    field: 'pm',
    showOverflow: 'tooltip',
    width: '100',
  },
  {
    title: '项目归类',
    field: 'projectClassify',
    showOverflow: 'tooltip',
    width: '110',
  },
  {
    title: '是否属于高份额',
    field: 'isHighShare',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: '备库方案',
    field: 'reservePlan',
    showOverflow: 'tooltip',
    width: '120',
  },
  {
    title: '生命周期',
    field: 'lifeCycle',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: '创建时间',
    field: 'creatorTime',
    showOverflow: 'tooltip',
    width: '140',
    cellRender: {
      name: 'Date',
    },
  },
  {
    title: '创建人姓名',
    field: 'creatorUserName',
    showOverflow: 'tooltip',
    width: '200',
  },
  {
    title: '修改时间',
    field: 'lastModifyTime',
    showOverflow: 'tooltip',
    width: '140',
    cellRender: {
      name: 'Date',
    },
  },
  {
    title: '修改人姓名',
    field: 'lastModifyUserName',
    showOverflow: 'tooltip',
    width: '200',
  },
  {
    title: t('common.action'),
    field: 'action',
    slots: { default: 'action' },
    width: 100,
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
  // 物料
  {
    fieldName: 'childProject',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '子项目',
      allowClear: true,
    },
  },
];

/**
 * 表单 - 表单配置
 */
export const formSchema: FormSchema[] = [
  {
    field: 'sixCode',
    label: '内6码',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    rules: [{ required: true, trigger: 'blur', message: '必填' }],
    colProps: {
      span: 12,
    },
  },
  {
    field: 'apn',
    label: 'APN',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    colProps: {
      span: 12,
    },
  },
  {
    field: 'childProject',
    label: '子项目',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    colProps: {
      span: 12,
    },
  },
  {
    field: 'targetProjectPMC',
    label: '归属项目PMC',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    rules: [{ required: true, trigger: 'blur', message: '必填' }],
    colProps: {
      span: 12,
    },
  },
  {
    field: 'targetProjectPDT',
    label: '归属项目PDT',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    rules: [{ required: true, trigger: 'blur', message: '必填' }],
    colProps: {
      span: 12,
    },
  },
  {
    field: 'sales',
    label: '销售',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    colProps: {
      span: 12,
    },
  },
  {
    field: 'pm',
    label: 'PM',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    colProps: {
      span: 12,
    },
  },
  {
    field: 'projectClassify',
    label: '项目归类',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    colProps: {
      span: 12,
    },
  },
  {
    field: 'isHighShare',
    label: '是否属于高份额',
    component: 'Input',
    // defaultValue: 1,
    componentProps: { placeholder: '请输入' },
    colProps: {
      span: 12,
    },
  },
  {
    field: 'reservePlan',
    label: '备库方案',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    colProps: {
      span: 12,
    },
  },
  {
    field: 'lifeCycle',
    label: '生命周期',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    colProps: {
      span: 12,
    },
  },
  {
    field: 'remark',
    label: '备注',
    component: 'Input',
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
    title: '内6码',
    dataIndex: 'sixCode',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: 'APN',
    dataIndex: 'apn',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: '子项目',
    dataIndex: 'childProject',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: '归属项目PMC',
    dataIndex: 'targetProjectPMC',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: '归属项目PDT',
    dataIndex: 'targetProjectPDT',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: '销售',
    dataIndex: 'sales',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: 'PM',
    dataIndex: 'pm',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: '项目归类',
    dataIndex: 'projectClassify',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: '是否属于高份额',
    dataIndex: 'isHighShare',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: '备库方案',
    dataIndex: 'reservePlan',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: '生命周期',
    dataIndex: 'lifeCycle',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    showOverflow: 'tooltip',
    width: '140',
  },
];
