import type { VxeGridPropTypes } from '/@/components/VxeTable';
import { useI18n } from '/@/hooks/web/useI18n';
import { getFactoryList } from '/@/api/basicData/factory';
import { factoryFilterOption } from '../utils/index';
import dayjs from 'dayjs';

const { t } = useI18n();

/**
 * 列表配置
 */
export const columns: VxeGridPropTypes.Columns = [
  {
    title: '年份',
    field: 'years',
    width: '50',
  },
  {
    title: '周次',
    field: 'week',
    width: '50',
  },
  {
    title: '工厂',
    field: 'factoryAreaName',
    width: '100',
  },
  {
    title: '订单编号',
    field: 'orderNo',
    width: '100',
  },
  {
    title: '订单类型',
    field: 'orderType',
    width: '100',
  },
  {
    title: '送货单号',
    field: 'deliveryOrderNo',
    width: '110',
  },
  {
    title: '内部料号',
    field: 'innerMaterialCode',
    width: '160',
  },
  {
    title: '送货日期',
    field: 'deliveryDate',
    width: '100',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  {
    title: '送货数量',
    field: 'deliveryQuantity',
    width: '80',
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
    title: '存储地点',
    field: 'storageLocation',
    width: '120',
  },
  {
    title: '客户产品名称',
    field: 'customerProductName',
    width: '110',
  },
  {
    title: '终端应用',
    field: 'terminalApp',
    width: '110',
  },
  {
    title: '项目号',
    field: 'projectNo',
    width: '70',
  },
  {
    title: '创建人姓名',
    field: 'creatorUserName',
    width: '140',
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
    fieldName: 'searchDate',
    label: '',
    component: 'WeekPicker',
    componentProps: {
      placeholder: t('dict.FcDataColumn.searchDate'),
      // valueFormat: 'YYYY-ww',
    },
    // defaultValue: getYearWeek(),
    defaultValue: dayjs(new Date()),
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
    fieldName: 'orderNo',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '订单号',
      allowClear: true,
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
    title: '订单编号',
    dataIndex: 'orderNo',
    width: '140',
  },
  {
    title: '订单类型',
    dataIndex: 'orderType',
    width: '140',
  },
  {
    title: '送货单号',
    dataIndex: 'deliveryOrderNo',
    width: '140',
  },
  {
    title: '内部料号',
    dataIndex: 'innerMaterialCode',
    width: '140',
  },
  {
    title: '送货日期',
    dataIndex: 'deliveryDate',
    width: '140',
  },
  {
    title: '送货数量',
    dataIndex: 'deliveryQuantity',
    width: '140',
  },
  {
    title: '存储地点',
    dataIndex: 'storageLocation',
    width: '140',
  },
  {
    title: '客户产品名称',
    dataIndex: 'customerProductName',
    width: '140',
  },
  {
    title: '终端应用',
    dataIndex: 'terminalApp',
    width: '140',
  },
  {
    title: '项目号',
    dataIndex: 'projectNo',
    width: '140',
  },
];
