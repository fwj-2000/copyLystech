import type { VxeGridPropTypes } from '/@/components/VxeTable';
import { useI18n } from '/@/hooks/web/useI18n';
import { ISBONDOPS } from '../utils/constant';
import { getFactoryList } from '/@/api/basicData/factory';
import { factoryFilterOption } from '../utils/index';

const { t } = useI18n();

/**
 * 列表配置
 */
export const columns: VxeGridPropTypes.Columns = [
  {
    title: '工厂',
    field: 'factoryAreaName',
    showOverflow: 'tooltip',
    width: '110',
  },
  {
    title: '物料编码',
    field: 'materialCode',
    showOverflow: 'tooltip',
    width: '170',
  },
  {
    title: '是否保税',
    field: 'isBonded',
    i18nField: 'isBondedDes',
    width: '80',
    cellRender: {
      name: 'Tag',
      options: ISBONDOPS,
    },
  },
  {
    title: '待入库数',
    field: 'waitInStoreNumber',
    showOverflow: 'tooltip',
    width: '80',
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '待手工数',
    field: 'waitManualNumber',
    showOverflow: 'tooltip',
    width: '80',
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '待模切数',
    field: 'waitDieCutNumber',
    showOverflow: 'tooltip',
    width: '80',
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '在制数',
    field: 'inProductionNumber',
    showOverflow: 'tooltip',
    width: '80',
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '已冻结数量',
    field: 'haveFreezeQuantity',
    showOverflow: 'tooltip',
    width: '80',
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '未冻结数量',
    field: 'notHaveFreezeQuantity',
    showOverflow: 'tooltip',
    width: '90',
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '车间',
    field: 'workshop',
    showOverflow: 'tooltip',
    width: '80',
  },
  {
    title: '库位',
    field: 'location',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: '库位描述',
    field: 'locationDes',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: '创建人姓名',
    field: 'creatorUserName',
    showOverflow: 'tooltip',
    width: '200',
  },
  {
    title: '创建人时间',
    field: 'creatorTime',
    showOverflow: 'tooltip',
    width: '140',
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
    title: '是否保税',
    field: 'isBonded',
    width: '140',
  },
  {
    title: '物料编码',
    dataIndex: 'materialCode',
    showOverflow: 'tooltip',
    width: '240',
  },
  {
    title: '待入库数',
    dataIndex: 'waitInStoreNumber',
    showOverflow: 'tooltip',
    width: '200',
  },
  {
    title: '待手工数',
    dataIndex: 'waitManualNumber',
    showOverflow: 'tooltip',
    width: '200',
  },
  {
    title: '待模切数',
    dataIndex: 'waitDieCutNumber',
    showOverflow: 'tooltip',
    width: '200',
  },
  {
    title: '在制数',
    dataIndex: 'inProductionNumber',
    showOverflow: 'tooltip',
    width: '200',
  },
  {
    title: '车间',
    dataIndex: 'workshop',
    showOverflow: 'tooltip',
    width: '240',
  },
  {
    title: '库位',
    dataIndex: 'location',
    showOverflow: 'tooltip',
    width: '240',
  },
  {
    title: '库位描述',
    dataIndex: 'locationDes',
    showOverflow: 'tooltip',
    width: '240',
  },
];
