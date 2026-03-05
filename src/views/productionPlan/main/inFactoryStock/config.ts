import type { VxeGridPropTypes } from '/@/components/VxeTable';
import { useI18n } from '/@/hooks/web/useI18n';
import { factoryFilterOption } from '../utils/index';
import { ISBONDOPS } from '../utils/constant';
import { ListByUserfactory } from '/@/api/productionPlan/processRoute';

const { t } = useI18n();

/**
 * 列表配置
 */
export const columns: VxeGridPropTypes.Columns = [
  {
    title: '批次号',
    field: 'lotNo',
    width: '120',
  },
  {
    title: '工厂',
    field: 'factoryAreaName',
    width: '90',
  },
  {
    title: 'SAP工厂',
    field: 'factoryCode',
    width: '90',
  },
  {
    title: '物料',
    field: 'materialCode',
    width: '160',
  },
  {
    title: '宽度',
    field: 'width',
    width: '60',
  },
  {
    title: '是否保税',
    field: 'isBonded',
    width: 75,
    i18nField: 'isBondedDes',
    cellRender: {
      name: 'Tag',
      options: ISBONDOPS,
    },
  },
  {
    title: '物料描述',
    field: 'materialDes',
    width: '120',
  },
  {
    title: '非限制使用的库存',
    field: 'unrestrictedStock',
    width: '120',
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '已冻结数量',
    field: 'haveFreezeQuantity',
    width: '85',
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '未冻结数量',
    field: 'notHaveFreezeQuantity',
    width: '85',
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: 'SAP计量单位',
    field: 'sapUnit',
    width: '100',
  },
  {
    title: '计量单位',
    field: 'unit',
    width: '75',
  },
  {
    title: '计量单位名称',
    field: 'unitName',
    width: '100',
  },
  {
    title: '库位',
    field: 'location',
    width: '50',
  },
  {
    title: '库位描述',
    field: 'locationDes',
    width: '90',
  },
  {
    title: '产品状态描述',
    field: 'stockStatusDes',
    width: '100',
  },
  {
    title: '创建时间',
    field: 'creatorTime',
    width: '120',
    cellRender: {
      name: 'Date',
    },
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
      defaultFirstOption: true,
      resultField: 'data',
      labelField: 'Name',
      valueField: 'Code',
      nameFormat: ['Code', '/', 'Name'],
      api: ListByUserfactory,
      showSearch: true,
      dropdownMatchSelectWidth: false,
      filterOption: factoryFilterOption,
    },
  },
  {
    fieldName: 'materialCode',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '物料',
      allowClear: true,
    },
  },
];

/**
 * 导入列配置
 */
export const importColumn = [
  {
    title: '工厂',
    dataIndex: 'factoryCode',
    width: '140',
  },
  {
    title: '是否保税',
    field: 'isBonded',
    width: '140',
  },
  {
    title: '物料',
    dataIndex: 'materialCode',
    width: '140',
  },
  {
    title: '物料描述',
    dataIndex: 'materialDes',
    width: '140',
  },
  {
    title: '批次号',
    dataIndex: 'lotNo',
    width: '140',
  },
  {
    title: '非限制使用的库存',
    dataIndex: 'unrestrictedStock',
    width: '140',
  },
  {
    title: '基本计量单位',
    dataIndex: 'sapUnit',
    width: '140',
  },
  {
    title: '库位',
    dataIndex: 'location',
    width: '140',
  },
  {
    title: '库位描述',
    dataIndex: 'locationDes',
    width: '140',
  },
  {
    title: '产品状态',
    dataIndex: 'stockStatus',
    width: '140',
  },
];
