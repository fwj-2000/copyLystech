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
    width: '100',
  },
  {
    title: '内部料号',
    field: 'innerMaterialCode',
    showOverflow: 'tooltip',
    width: '160',
  },
  {
    title: 'PO单号',
    field: 'poOrderNo',
    showOverflow: 'tooltip',
    width: '120',
  },
  {
    title: '是否保税',
    field: 'isBonded',
    width: '75',
    i18nField: 'isBondedDes',
    cellRender: {
      name: 'Tag',
      options: ISBONDOPS,
    },
  },
  {
    title: '总数量',
    field: 'totalQuantity',
    showOverflow: 'tooltip',
    width: '60',
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '单位',
    field: 'unit',
    showOverflow: 'tooltip',
    width: '50',
  },
  {
    // 已进料部分
    title: t('dict.InTransitColumn.incomingPortion'),
    field: 'inMaterial',
    children: [
      {
        title: t('dict.InTransitColumn.inMaterialQuantity'),
        field: 'inMaterialQuantity',
        width: 110,
        cellRender: {
          name: 'Number',
        },
      },
      {
        title: t('dict.InTransitColumn.inFrozenQuantity'),
        field: 'inFrozenQuantity',
        width: 110,
        cellRender: {
          name: 'Number',
        },
      },
      {
        title: t('dict.InTransitColumn.inUnfrozenQuantity'),
        field: 'inUnfrozenQuantity',
        width: 120,
        cellRender: {
          name: 'Number',
        },
      },
    ],
  },
  {
    //未进料部分
    title: t('dict.InTransitColumn.unfedPortion'),
    field: 'unMaterial',
    children: [
      {
        title: t('dict.InTransitColumn.unfedQuantity'),
        field: 'unfedQuantity',
        width: 90,
        cellRender: {
          name: 'Number',
        },
      },
      {
        title: t('dict.InTransitColumn.unFrozenQuantity'),
        field: 'unFrozenQuantity',
        width: 110,
        cellRender: {
          name: 'Number',
        },
      },
      {
        title: t('dict.InTransitColumn.unUnfrozenQuantity'),
        field: 'unUnfrozenQuantity',
        width: 120,
        cellRender: {
          name: 'Number',
        },
      },
    ],
  },
  {
    title: '供应商',
    field: 'supplier',
    showOverflow: 'tooltip',
    width: '110',
  },
  {
    title: '采购员',
    field: 'purchaser',
    showOverflow: 'tooltip',
    width: '90',
  },
  {
    title: 'PO单日期',
    field: 'poOrderDate',
    showOverflow: 'tooltip',
    width: '110',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  {
    title: '库位',
    field: 'location',
    width: '100',
  },
  {
    title: '库位描述',
    field: 'locationDes',
    width: '100',
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
    title: '创建姓名',
    field: 'creatorUserName',
    showOverflow: 'tooltip',
    width: '140',
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
  // 内部料号
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
 * 导入列配置
 */
export const importColumn = [
  {
    title: '是否保税',
    field: 'isBonded',
  },
  {
    title: '物料编码',
    dataIndex: 'innerMaterialCode',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: 'PO单号',
    dataIndex: 'poOrderNo',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: '总数量',
    dataIndex: 'totalQuantity',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: '单位',
    dataIndex: 'unit',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: '累计已进料数量',
    dataIndex: 'inMaterialQuantity',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: '供应商',
    dataIndex: 'supplier',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: '采购员',
    dataIndex: 'purchaser',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: 'PO单日期',
    dataIndex: 'poOrderDate',
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
