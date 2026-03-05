import type { VxeGridPropTypes } from '/@/components/VxeTable';

import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
import { h } from 'vue';
import { getMainProcessLabel } from '/@/views/business/salesForecast/config';

import { LydcTag } from '/@/components/Lydc/Tag';

const { t } = useI18n();
const baseStore = useBaseStore();

export enum STATUS_ENUM {
  待处理 = 1,
  已处理 = 2,
  撤回 = 3,
}

/**
 * @description 状态列表
 */
export const STATUS_OPTIONS = [
  { id: STATUS_ENUM.待处理, fullName: t('common.todoText'), theme: 'gray', rowKey: 'statusDesc' },
  // { id: '2', fullName: t('common.doneText'), theme: 'green', rowKey: 'statusDesc' },
  { id: STATUS_ENUM.撤回, fullName: t('common.revoke'), theme: 'purple', rowKey: 'statusDesc' },
];

/**
 * @description 清单页 - 筛选字段
 */
export const vxeTableFormSchema = [
  {
    fieldName: 'batchCode',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '版本',
      allowClear: true,
    },
  },
  {
    fieldName: 'mainProcess',
    label: '',
    i18nField: 'mainProcessDesc',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('MainProcess'),
      resultField: 'data',
      labelField: 'fullName',
      valueField: 'enCode',
      placeholder: '主要制程',
      style: 'width: 100%',
      allowClear: true,
    },
  },
  {
    fieldName: 'submitStatus',
    label: '',
    component: 'Select',
    componentProps: {
      placeholder: '状态',
      style: 'width: 100%',
      options: STATUS_OPTIONS.map(item => ({ ...item, value: item.id, label: item.fullName })),
      allowClear: true,
    },
  },
  {
    fieldName: 'importUser',
    label: '',
    i18nField: 'importUserName',
    component: 'Input',
    componentProps: {
      placeholder: '导入人',
      allowClear: true,
    },
  },
];

/**
 * @description 清单页 - 表格列配置
 */
export const vxeTableColumns: VxeGridPropTypes.Columns = [
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
  // 版本
  {
    title: '版本',
    field: 'batchCode',
    showOverflow: 'tooltip',
    width: '160',
    slots: {
      default: 'batchCode',
    },
  },
  // 需求类型
  {
    title: t('dict.SampleLabelPrintColumn.demandTypeName'),
    field: 'demandType',
    showOverflow: 'tooltip',
    width: '120',
    formatter: ({ cellValue }) => (cellValue === '客户需求' ? t('common.requireInfo') : cellValue),
  },
  // 主要制程
  {
    title: '主要制程',
    field: 'mainProcessDesc',
    showOverflow: 'tooltip',
    width: '120',
    formatter: ({ row, cellValue }) => getMainProcessLabel(row.mainProcess, cellValue),
  },
  // 状态
  {
    title: '状态',
    field: 'submitStatus',
    showOverflow: 'tooltip',
    width: '120',
    slots: {
      default: ({ row }) => {
        const { theme, fullName } = STATUS_OPTIONS.find(item => item.id === row.submitStatus) || {};
        return h(LydcTag, { theme: theme }, () => row.statusDesc || fullName || row.submitStatus);
      },
    },
  },
  // 当前节点
  {
    title: '当前节点',
    field: 'currentNodeName',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 节点记录
  {
    title: '节点记录',
    field: 'currentNode',
    showOverflow: 'tooltip',
    width: '120',
    slots: {
      default: 'currentNode',
    },
  },
  // 导入人
  {
    title: '导入人',
    field: 'importUserName',
    showOverflow: 'tooltip',
    width: '220',
  },
  // 导入时间
  {
    title: '导入时间',
    field: 'importDate',
    // formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).tz().format('YYYY-MM-DD HH:mm:ss') : ''),
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    showOverflow: 'tooltip',
    width: '160',
  },
  // Category
  {
    title: 'Category',
    field: 'importCategory',
    showOverflow: 'tooltip',
    width: '120',
  },
  // Ship To
  {
    title: 'ShipTo',
    field: 'importShipTo',
    showOverflow: 'tooltip',
    width: '120',
  },
  // Module
  {
    title: 'Module',
    field: 'importModule',
    showOverflow: 'tooltip',
    width: '120',
  },
  // Type
  {
    title: 'Type',
    field: 'importType',
    showOverflow: 'tooltip',
    width: '120',
  },
  // Golden
  {
    title: 'Golden',
    field: 'importGolden',
    showOverflow: 'tooltip',
    width: '120',
  },
  // Program
  {
    title: 'Program',
    field: 'importProgram',
    showOverflow: 'tooltip',
    width: '120',
  },
  // POR/ALT
  {
    title: 'POR/ALT',
    field: 'importPOR_ALT',
    showOverflow: 'tooltip',
    width: '120',
  },
  // Part Number
  {
    title: 'PartNumber',
    field: 'importPartNumber',
    showOverflow: 'tooltip',
    width: '120',
  },
  // Description
  {
    title: 'Description',
    field: 'importDescription',
    showOverflow: 'tooltip',
    width: '220',
  },
  // Config
  {
    title: 'Config',
    field: 'importConfig',
    showOverflow: 'tooltip',
    width: '120',
  },
  // K/NK
  {
    title: 'K/NK',
    field: 'importK_NK',
    showOverflow: 'tooltip',
    width: '120',
  },
  // Usage
  {
    title: 'Usage',
    field: 'importUsage',
    showOverflow: 'tooltip',
    width: '120',
  },
];

/**
 * @description 详情页 - 列配置
 */
export const detailColumns: VxeGridPropTypes.Columns = [
  {
    field: 'seq',
    title: t('component.table.index'),
    type: 'seq',
    width: '50',
    align: 'center',
  },
  // 版本
  {
    title: t('dict.SalesForecastColumn.batchCode'),
    field: 'batchCode',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 主要制程
  {
    title: t('dict.SalesForecastColumn.mainProcessDesc'),
    field: 'mainProcessDesc',
    showOverflow: 'tooltip',
    width: '120',
    formatter: ({ row, cellValue }) => getMainProcessLabel(row.mainProcess, cellValue),
  },
  // 产品内部料号
  {
    title: t('dict.SalesForecastColumn.insidePartNumber'),
    field: 'insidePartNumber',
    showOverflow: 'tooltip',
    width: '160',
  },
  // 出货比例
  {
    title: t('dict.SalesForecastColumn.sitePersent'),
    field: 'sitePercent',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 片卷料比例
  {
    title: t('dict.SalesForecastColumn.shipPatternPercent'),
    field: 'shipPatternPercent',
    showOverflow: 'tooltip',
    width: '120',
    formatter: ({ cellValue }: { cellValue: string }) => {
      if (!cellValue) return '';
      return cellValue.endsWith('%') ? cellValue : `${cellValue}%`;
    },
    editRender: {
      enabled: false,
      name: 'AInputNumber',
      props: {
        min: 0,
        max: 100,
        precision: 2,
        stringMode: true,
        formatter: (value: string) => `${value}%`,
      },
    },
  },
  // Category
  {
    title: 'Category',
    field: 'importCategory',
    showOverflow: 'tooltip',
    width: '120',
  },
  // Ship To
  {
    title: 'ShipTo',
    field: 'importShipTo',
    showOverflow: 'tooltip',
    width: '120',
  },
  // Module
  {
    title: 'Module',
    field: 'importModule',
    showOverflow: 'tooltip',
    width: '120',
  },
  // Type
  {
    title: 'Type',
    field: 'importType',
    showOverflow: 'tooltip',
    width: '120',
  },
  // Golden
  {
    title: 'Golden',
    field: 'importGolden',
    showOverflow: 'tooltip',
    width: '120',
  },
  // Program
  {
    title: 'Program',
    field: 'importProgram',
    showOverflow: 'tooltip',
    width: '120',
  },
  // POR/ALT
  {
    title: 'POR/ALT',
    field: 'importPOR_ALT',
    showOverflow: 'tooltip',
    width: '120',
  },
  // Part Number
  {
    title: 'PartNumber',
    field: 'importPartNumber',
    showOverflow: 'tooltip',
    width: '120',
  },
  // Description
  {
    title: 'Description',
    field: 'importDescription',
    showOverflow: 'tooltip',
    width: '220',
  },
  // Config
  {
    title: 'Config',
    field: 'importConfig',
    showOverflow: 'tooltip',
    width: '120',
  },
  // K/NK
  {
    title: 'K/NK',
    field: 'importK_NK',
    showOverflow: 'tooltip',
    width: '120',
  },
  // Usage
  {
    title: 'Usage',
    field: 'importUsage',
    showOverflow: 'tooltip',
    width: '120',
  },
];

/**
 * @description 详情页 - 数据转换进度枚举
 */
export enum DETAIL_PROCESS_ENUM {
  未处理 = '1',
  转化出货比例 = '2',
  转化片卷料 = '3',
}
