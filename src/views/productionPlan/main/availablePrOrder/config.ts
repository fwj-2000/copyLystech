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
    title: '工厂',
    field: 'factoryAreaName',
    showOverflow: 'tooltip',
    width: '110',
  },
  {
    title: '内部料号',
    field: 'innerMaterialCode',
    showOverflow: 'tooltip',
    width: '170',
  },
  {
    title: 'PR单号',
    field: 'prOrderNo',
    showOverflow: 'tooltip',
    width: '120',
  },
  {
    title: 'PO单号',
    field: 'poOrderNo',
    showOverflow: 'tooltip',
    width: '120',
  },
  {
    title: '总数量',
    field: 'totalQuantity',
    showOverflow: 'tooltip',
    width: '90',
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '单位',
    field: 'unit',
    showOverflow: 'tooltip',
    width: '80',
  },
  {
    title: '是否已下PO单',
    field: 'isPlacePoOrder',
    showOverflow: 'tooltip',
    width: '140',
  },
  {
    title: '已冻结数量',
    field: 'haveFreezeQuantity',
    showOverflow: 'tooltip',
    width: '100',
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '未冻结数量',
    field: 'notHaveFreezeQuantity',
    showOverflow: 'tooltip',
    width: '100',
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '采购员',
    field: 'purchaser',
    showOverflow: 'tooltip',
    width: '120',
  },
  {
    title: 'PO单日期',
    field: 'poOrderDate',
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
    title: '创建时间',
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
    submitOnChange: true,
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
 * 导入列配置
 */
export const importColumn = [
  {
    title: '物料编码',
    dataIndex: 'innerMaterialCode',
    showOverflow: 'tooltip',
    width: '160',
  },
  {
    title: 'PR单号',
    dataIndex: 'prOrderNo',
    showOverflow: 'tooltip',
    width: '160',
  },
  {
    title: '对应的PO单号',
    dataIndex: 'poOrderNo',
    showOverflow: 'tooltip',
    width: '160',
  },
  {
    title: '总数量',
    dataIndex: 'totalQuantity',
    showOverflow: 'tooltip',
    width: '160',
  },
  {
    title: '单位',
    dataIndex: 'unit',
    showOverflow: 'tooltip',
    width: '160',
  },
  {
    title: '是否已下PO单',
    dataIndex: 'isPlacePoOrder',
    showOverflow: 'tooltip',
    width: '160',
  },
  {
    title: '采购员',
    dataIndex: 'purchaser',
    showOverflow: 'tooltip',
    width: '160',
  },
  {
    title: 'PO单日期',
    dataIndex: 'poOrderDate',
    showOverflow: 'tooltip',
    width: '160',
  },
];
