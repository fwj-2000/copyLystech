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
    width: '90',
  },
  {
    title: 'Site',
    field: 'site',
    showOverflow: 'tooltip',
    width: '60',
  },
  {
    title: '是否保税',
    field: 'isBonded',
    i18nField: 'isBondedDes',
    width: '75',
    cellRender: {
      name: 'Tag',
      options: ISBONDOPS,
    },
  },
  {
    title: '终端客户产品',
    field: 'customerProduct',
    showOverflow: 'tooltip',
    width: '100',
  },
  {
    title: '客户料号',
    field: 'customerMaterialCode',
    showOverflow: 'tooltip',
    width: '110',
  },
  {
    title: '外部料号',
    field: 'outerMaterialCode',
    showOverflow: 'tooltip',
    width: '120',
  },
  {
    title: '内部料号',
    field: 'innerMaterialCode',
    showOverflow: 'tooltip',
    width: '160',
  },
  {
    title: '出库数量',
    field: 'outStockCount',
    showOverflow: 'tooltip',
    width: '75',
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '良品数量',
    field: 'goodProductCount',
    showOverflow: 'tooltip',
    width: '75',
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '不良品数量',
    field: 'badProductCount',
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
    width: '80',
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '责任客服',
    field: 'customerService',
    showOverflow: 'tooltip',
    width: '90',
  },
  {
    title: '库位',
    field: 'location',
    width: '70',
  },
  {
    title: '库位描述',
    field: 'locationDes',
    width: '80',
  },
  {
    title: '创建人姓名',
    field: 'creatorUserName',
    showOverflow: 'tooltip',
    width: '140',
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
    title: 'Site',
    dataIndex: 'site',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: '是否保税',
    field: 'isBonded',
  },

  {
    title: '终端客户产品',
    dataIndex: 'customerProduct',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: '客户料号',
    dataIndex: 'customerMaterialCode',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: '外部料号',
    dataIndex: 'outerMaterialCode',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: '内部料号',
    dataIndex: 'innerMaterialCode',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: '产地',
    dataIndex: 'origin',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: '出库数量',
    dataIndex: 'outStockCount',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: '良品数量',
    dataIndex: 'goodProductCount',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: '不良品数量',
    dataIndex: 'badProductCount',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: '责任客服',
    dataIndex: 'customerService',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: '库位',
    field: 'location',
    width: '140',
  },
  {
    title: '库位描述',
    field: 'locationDes',
    width: '140',
  },
];
