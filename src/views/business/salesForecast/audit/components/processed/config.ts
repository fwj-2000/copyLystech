import type { VxeGridPropTypes } from '/@/components/VxeTable';

import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
import { STATUS_OPTIONS } from '../../config';
import { h } from 'vue';
import { getMainProcessLabel } from '/@/views/business/salesForecast/config';

import { LydcTag } from '/@/components/Lydc/Tag';

const { t } = useI18n();
const baseStore = useBaseStore();

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
  // {
  //   fieldName: 'status',
  //   label: '',
  //   component: 'Select',
  //   componentProps: {
  //     placeholder: '状态',
  //     style: 'width: 100%',
  //     options: STATUS_OPTIONS.map(item => ({ ...item, value: item.id, label: item.fullName })),
  //     allowClear: true,
  //   },
  // },
  {
    fieldName: 'insidePartNumber',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '产品内部料号',
      allowClear: true,
    },
  },
  {
    fieldName: 'importUserName',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '导入人',
      allowClear: true,
    },
  },
];

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
  // 审核结论
  {
    title: '审核结论',
    field: 'reviewStatusDesc',
    // @ts-ignore
    i18nField: 'auditConclusion',
    showOverflow: 'tooltip',
    width: '120',
    slots: {
      default: ({ row }) => {
        if (!row.reviewStatusDesc) return '';
        const { theme, fullName } = STATUS_OPTIONS.find(item => item.id === row.reviewStatus) || {};
        return h(LydcTag, { theme: theme }, () => fullName || row.reviewStatusDesc || row.auditResult);
      },
    },
  },
  // 状态
  // {
  //   title: '状态',
  //   field: 'status',
  //   showOverflow: 'tooltip',
  //   width: '120',
  //   slots: {
  //     default: ({ row }) => {
  //       const { theme, fullName } = STATUS_OPTIONS.find(item => item.id === row.Status) || {};
  //       return h(LydcTag, { theme: theme }, () => row.statusDesc || fullName || row.Status);
  //     },
  //   },
  // },
  // 当前处理人
  {
    title: '当前处理人',
    field: 'handlerName',
    showOverflow: 'tooltip',
    width: '120',
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
  // 出货比例
  {
    title: '出货比例',
    field: 'sitePercent',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 片卷料比例
  {
    title: '片卷料比例',
    field: 'shipPatternPercent',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 产品内部料号
  {
    title: '产品内部料号',
    field: 'insidePartNumber',
    showOverflow: 'tooltip',
    width: '160',
  },
  // 总需求数量
  {
    title: '总需求数量',
    field: 'totalRequiredQty',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 历史出货数量
  {
    title: '历史出货数量',
    field: 'historyShippedQty',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 总待产数量
  {
    title: '总待产数量',
    field: 'totalWaitedQty',
    showOverflow: 'tooltip',
    width: '120',
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
