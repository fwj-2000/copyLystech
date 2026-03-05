import type { VxeGridPropTypes } from '/@/components/VxeTable';

import { useI18n } from '/@/hooks/web/useI18n';
import { getMainProcessLabel } from '/@/views/business/salesForecast/config';

const { t } = useI18n();

/**
 * @description tabs类型枚举
 */
export enum TABS_ENUM {
  待处理 = '0',
  已处理 = '1',
}

/**
 * @description 状态枚举
 */
export enum STATUS_ENUM {
  审核中 = 1,
  同意 = 2,
}

export const STATUS_OPTIONS = [
  { id: STATUS_ENUM.审核中, fullName: t('common.auditing'), theme: 'blue', rowKey: 'statusDesc' },
  { id: STATUS_ENUM.同意, fullName: t('common.agree'), theme: 'green', rowKey: 'statusDesc' },
];

/**
 * @description 详情页 - 列配置
 */
export const detailColumns: VxeGridPropTypes.Columns = [
  {
    field: 'seq',
    title: t('component.table.index'),
    type: 'seq',
    fixed: 'left',
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
  // 客服
  {
    title: t('dict.SalesForecastColumn.customerPerson'),
    field: 'customerPerson',
    showOverflow: 'tooltip',
    width: '220',
  },
  // 旧产品内部料号
  {
    title: t('dict.SalesForecastHistoryColumn.oldInsidePartNumber'),
    field: 'oldInsidePartNumber',
    showOverflow: 'tooltip',
    width: '160',
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
  },
  // 总需求数量
  {
    title: t('dict.SalesForecastColumn.total'),
    field: 'totalRequiredQty',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 历史出货数量
  {
    title: t('dict.SalesForecastColumn.historyAmount'),
    field: 'historyShippedQty',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 总待产数量
  {
    title: t('dict.SalesForecastColumn.diffAmount'),
    field: 'totalWaitedQty',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 备注
  {
    title: t('dict.SalesForecastColumn.remark'),
    field: 'remark',
    showOverflow: 'tooltip',
    width: '260',
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
