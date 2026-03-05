import type { VxeGridPropTypes } from '/@/components/VxeTable';

import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
import { h } from 'vue';
import { getMainProcessLabel } from '/@/views/business/salesForecast/config';

import { LydcTag } from '/@/components/Lydc/Tag';

const { t } = useI18n();
const baseStore = useBaseStore();

export enum STATUS_ENUM {
  草稿 = 1,
  撤回 = 2,
  已保存 = 3,
}

export const STATUS_OPTIONS = [
  { id: STATUS_ENUM.草稿, fullName: t('common.draft'), theme: 'gray', rowKey: 'statusDesc' },
  { id: STATUS_ENUM.撤回, fullName: t('common.revoke'), theme: 'purple', rowKey: 'statusDesc' },
  // { id: STATUS_ENUM.已保存, fullName: t('common.saved'), theme: 'green', rowKey: 'statusDesc' }
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
    component: 'ApiSelect',
    i18nField: 'mainProcessDesc',
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
    fieldName: 'drawingStatus',
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
    field: 'drawingStatus',
    showOverflow: 'tooltip',
    width: '120',
    slots: {
      default: ({ row }) => {
        const { theme, fullName } = STATUS_OPTIONS.find(item => item.id === row.drawingStatus) || {};
        return h(LydcTag, { theme: theme }, () => row.statusDesc || fullName || row.drawingStatus);
      },
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
    showOverflow: 'tooltip',
    // formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).tz().format('YYYY-MM-DD HH:mm:ss') : ''),
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
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
 * @description 批量导入 - 列配置
 */
export const importColumns: VxeGridPropTypes.Columns = [
  // 数据状态
  {
    title: t('component.basicTable.dataStatus'),
    field: 'errorMsg',
    showOverflow: 'tooltip',
    width: '160',
    slots: {
      default: ({ row }) => {
        const value = row.errorMsg;
        return h('span', { style: `color: ${value ? '#ff4d4f' : '#52c41a'}` }, value || t('common.normalText'));
      },
    },
  },
  // 版本
  {
    title: t('dict.SalesForecastColumn.batchCode'),
    field: 'batchCode',
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
  // 操作行
  {
    title: t('common.action'),
    width: '60',
    field: 'action',
    fixed: 'right',
    slots: {
      default: 'action',
    },
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
    width: '180',
  },
  // 主要制程
  {
    title: t('dict.SalesForecastColumn.mainProcessDesc'),
    field: 'mainProcess',
    showOverflow: 'tooltip',
    width: '180',
    formatter: ({ row, cellValue }) => getMainProcessLabel(row.mainProcess, cellValue),
    editRender: {
      name: 'AApiSelect',
      // @ts-ignore
      field: 'mainProcess',
      enabled: true,
      immediate: true,
      props: {
        api: () =>
          baseStore.getDictionaryData('MainProcess').then((list: Array<any>) => {
            return list.map(item => ({ ...item, enCode: +item.enCode }));
          }),
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        // placeholder: '主要制程',
        style: 'width: 100%',
        immediate: true,
      },
    },
  },
  // Category
  {
    title: 'Category',
    field: 'importCategory',
    showOverflow: 'tooltip',
    width: '180',
    editRender: {
      enabled: true,
      name: 'AInput',
      props: {
        placeholder: 'Category',
        style: 'width: 100%',
      },
    },
  },
  // Ship To
  {
    title: 'ShipTo',
    field: 'importShipTo',
    showOverflow: 'tooltip',
    width: '180',
    editRender: { name: 'AInput', enabled: true, props: { placeholder: 'ShipTo', style: 'width: 100%' } },
  },
  // Module
  {
    title: 'Module',
    field: 'importModule',
    showOverflow: 'tooltip',
    width: '180',
    editRender: { name: 'AInput', enabled: true, props: { placeholder: 'Module', style: 'width: 100%' } },
  },
  // Type
  {
    title: 'Type',
    field: 'importType',
    showOverflow: 'tooltip',
    width: '180',
    editRender: { name: 'AInput', enabled: true, props: { placeholder: 'Type', style: 'width: 100%' } },
  },
  // Golden
  {
    title: 'Golden',
    field: 'importGolden',
    showOverflow: 'tooltip',
    width: '180',
    editRender: { name: 'AInput', enabled: true, props: { placeholder: 'Golden', style: 'width: 100%' } },
  },
  // Program
  {
    title: 'Program',
    field: 'importProgram',
    showOverflow: 'tooltip',
    width: '180',
    editRender: { name: 'AInput', enabled: true, props: { placeholder: 'Program', style: 'width: 100%' } },
  },
  // POR/ALT
  {
    title: 'POR/ALT',
    field: 'importPOR_ALT',
    showOverflow: 'tooltip',
    width: '180',
    editRender: { name: 'AInput', enabled: true, props: { placeholder: 'POR/ALT', style: 'width: 100%' } },
  },
  // Part Number
  {
    title: 'PartNumber',
    field: 'importPartNumber',
    showOverflow: 'tooltip',
    width: '130',
    editRender: { name: 'AInput', enabled: true, props: { placeholder: 'PartNumber', style: 'width: 100%' } },
  },
  // Description
  {
    title: 'Description',
    field: 'importDescription',
    showOverflow: 'tooltip',
    width: '220',
    editRender: { name: 'AInput', enabled: true, props: { placeholder: 'Description', style: 'width: 100%' } },
  },
  // Config
  {
    title: 'Config',
    field: 'importConfig',
    showOverflow: 'tooltip',
    width: '180',
    editRender: { name: 'AInput', enabled: true, props: { placeholder: 'Config', style: 'width: 100%' } },
  },
  // K/NK
  {
    title: 'K/NK',
    field: 'importK_NK',
    showOverflow: 'tooltip',
    width: '180',
    editRender: { name: 'AInput', enabled: true, props: { placeholder: 'K/NK', style: 'width: 100%' } },
  },
  // Usage
  {
    title: 'Usage',
    field: 'importUsage',
    showOverflow: 'tooltip',
    width: '180',
    editRender: { name: 'AInput', enabled: true, props: { placeholder: 'Usage', style: 'width: 100%' } },
  },
];
