import type { VxeGridPropTypes } from '/@/components/VxeTable';

import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

/**
 * @description tabs类型枚举
 */
export enum TABS_ENUM {
  待确认 = '0',
  已确认 = '1',
}

/**
 * @description 状态枚举
 */
export enum STATUS_ENUM {
  待确认 = 1,
  已确认 = 2,
  撤回 = 3,
  驳回 = 4,
}

export const STATUS_OPTIONS = [
  { id: STATUS_ENUM.待确认, fullName: t('common.unconfirmed'), theme: 'gray', rowKey: 'statusDesc' },
  // { id: STATUS_ENUM.已确认, fullName: '已确认', theme: 'green', rowKey: 'statusDesc' },
  { id: STATUS_ENUM.撤回, fullName: t('common.revoke'), theme: 'purple', rowKey: 'statusDesc' },
  { id: STATUS_ENUM.驳回, fullName: t('common.rejectText'), theme: 'yellow', rowKey: 'statusDesc' },
];

const columnFilterInput = {
  filters: [{ data: '' }],
  filterRender: { name: 'Input' },
};

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
  // 客服
  {
    title: t('dict.SalesForecastColumn.customerPerson'),
    field: 'nextHandlerId',
    showOverflow: 'tooltip',
    width: '260',
    editRender: {
      name: 'CustomUserSelect',
      cacheField: 'nextHandler',
      enabled: true,
    },
  },
  // 产品内部料号
  {
    title: t('dict.SalesForecastColumn.insidePartNumber'),
    field: 'insidePartNumber',
    showOverflow: 'tooltip',
    width: '180',
    ...columnFilterInput,
  },
  // Category
  {
    title: 'Category',
    field: 'importCategory',
    showOverflow: 'tooltip',
    width: '120',
    ...columnFilterInput,
  },
  // Ship To
  {
    title: 'ShipTo',
    field: 'importShipTo',
    showOverflow: 'tooltip',
    width: '120',
    ...columnFilterInput,
  },
  // Module
  {
    title: 'Module',
    field: 'importModule',
    showOverflow: 'tooltip',
    width: '120',
    ...columnFilterInput,
  },
  // Type
  {
    title: 'Type',
    field: 'importType',
    showOverflow: 'tooltip',
    width: '120',
    ...columnFilterInput,
  },
  // Golden
  {
    title: 'Golden',
    field: 'importGolden',
    showOverflow: 'tooltip',
    width: '120',
    ...columnFilterInput,
  },
  // Program
  {
    title: 'Program',
    field: 'importProgram',
    showOverflow: 'tooltip',
    width: '120',
    ...columnFilterInput,
  },
  // POR/ALT
  {
    title: 'POR/ALT',
    field: 'importPOR_ALT',
    showOverflow: 'tooltip',
    width: '120',
    ...columnFilterInput,
  },
  // Part Number
  {
    title: 'PartNumber',
    field: 'importPartNumber',
    showOverflow: 'tooltip',
    width: '120',
    ...columnFilterInput,
  },
  // Description
  {
    title: 'Description',
    field: 'importDescription',
    showOverflow: 'tooltip',
    width: '220',
    ...columnFilterInput,
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
  // 备注
  {
    title: t('dict.SalesForecastColumn.remark'),
    field: 'remark',
    showOverflow: 'tooltip',
    width: '220',
    editRender: { name: 'AInput', enabled: true },
  },
];

/**
 * @description 详情页 - 操作列配置
 */
export const actionColumns: VxeGridPropTypes.Columns = [
  {
    field: 'action',
    title: t('common.action'),
    fixed: 'right',
    width: '80',
    slots: {
      default: 'action',
    },
  },
];
