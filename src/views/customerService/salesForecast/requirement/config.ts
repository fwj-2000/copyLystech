import type { VxeGridPropTypes } from '/@/components/VxeTable';

import { useI18n } from '/@/hooks/web/useI18n';

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
  待处理 = 1,
  已处理 = 2,
  撤回 = 3,
  驳回 = 4,
}

export const STATUS_OPTIONS = [
  { id: STATUS_ENUM.待处理, fullName: t('common.todoText'), theme: 'gray', rowKey: 'statusDesc' },
  // { id: STATUS_ENUM.已处理, fullName: t('common.doneText'), theme: 'green', rowKey: 'statusDesc' },
  { id: STATUS_ENUM.撤回, fullName: t('common.revoke'), theme: 'purple', rowKey: 'statusDesc' },
  { id: STATUS_ENUM.驳回, fullName: t('common.rejectText'), theme: 'purple', rowKey: 'statusDesc' },
];

/**
 * @description 详情表格列 - 配置
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
  // 历史出货数量
  {
    title: t('dict.SalesForecastColumn.historyShippedQty'),
    field: 'historyShippedQty',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 总需求数量
  {
    title: t('dict.SalesForecastColumn.totalRequiredQty'),
    field: 'totalRequiredQty',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 总待产数量
  {
    title: t('dict.SalesForecastColumn.totalWaitedQty'),
    field: 'totalWaitedQty',
    showOverflow: 'tooltip',
    width: '120',
  },
];
