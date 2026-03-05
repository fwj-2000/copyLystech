import type Dayjs from 'dayjs';
import type { VxeGridPropTypes } from '/@/components/VxeTable';

// import { useBaseStore } from '/@/store/modules/base';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useI18n } from '/@/hooks/web/useI18n';
import { getYesOrNoLabel, getStatusLabel, getProductTypeLabel } from '../utils';

// const baseStore = useBaseStore();
const { t } = useI18n();
dayjs.extend(duration);

const columnFilterInput = {
  filters: [{ data: '' }],
  filterRender: { name: 'Input' },
};

// const columnFilterDatePicker = {
//   filters: [{ data: '', key: 'index' }],
//   filterRender: { name: 'DatePicker', props: { valueFormat: 'YYYY-MM-DD' } },
// };

// function createColumnFilterSelect(dictCode: string, options: Array<{ label: string; value: any }> = []) {
//   return {
//     filters: [{ data: '' }],
//     filterRender: {
//       name: dictCode ? 'ApiSelect' : 'ASelect',
//       props: {
//         api: () => baseStore.getDictionaryData(dictCode),
//         labelField: 'fullName',
//         valueField: 'enCode',
//         immediate: true,
//         options,
//       },
//     },
//   };
// }

/**
 * 计算两个时间之间相差的天数、小时数、分钟数和秒数
 * @param startTime 开始时间字符串
 * @param endTime 结束时间字符串
 * @returns 格式化的字符串，例如 "1天2小时3分4秒"
 */
export function calculateTimeDifference(startTime: Dayjs.ConfigType, endTime: Dayjs.ConfigType): string {
  const start = dayjs(startTime).tz();
  const end = dayjs(endTime).tz();

  if (!startTime || !endTime || !(start.isValid() && end.isValid())) {
    return '';
  }

  const duration = dayjs.duration(end.diff(start));
  return `${Math.floor(duration.asDays())}天${duration.hours()}小时${duration.minutes()}分${duration.seconds()}秒`;
}

const _vxeTableColumns: VxeGridPropTypes.Columns = [
  // {
  //   field: 'checkbox',
  //   type: 'checkbox',
  //   width: '50',
  //   align: 'center',
  // },
  {
    field: 'seq',
    title: t('component.table.index'),
    type: 'seq',
    width: '50',
    align: 'center',
  },
  {
    field: 'applyNo',
    showOverflow: 'tooltip',
    width: '120',
    ...columnFilterInput,
  },
  {
    title: t('dict.CommonCol.status'),
    field: 'statusName', // status
    width: 100,
  },
  // {
  //   field: 'demandType',
  //   showOverflow: 'tooltip',
  //   width: '120',
  // },
  {
    field: 'applyUserName',
    showOverflow: 'tooltip',
    width: '120',
    ...columnFilterInput,
  },
  {
    field: 'applyDate',
    i18nField: 'applyDatetime',
    showOverflow: 'tooltip',
    width: '120',
    // formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).tz().format('YYYY-MM-DD HH:mm:ss') : ''),
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  {
    field: 'insidePartNumber',
    showOverflow: 'tooltip',
    width: '120',
    ...columnFilterInput,
  },
  {
    field: 'factory',
    showOverflow: 'tooltip',
    width: '120',
    ...columnFilterInput,
  },
  {
    field: 'terminalCustomerProjectCode',
    showOverflow: 'tooltip',
    width: '120',
  },
  {
    field: 'demandQty',
    showOverflow: 'tooltip',
    width: '120',
  },
  {
    field: 'customerDeliveryTime',
    i18nField: 'customerDeliverytime',
    showOverflow: 'tooltip',
    width: '120',
    // formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).tz().format('YYYY-MM-DD HH:mm:ss') : ''),
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    field: 'projectPhase',
    showOverflow: 'tooltip',
    width: '120',
    ...columnFilterInput,
  },
  {
    field: 'isDeclareCustoms',
    showOverflow: 'tooltip',
    width: '120',
    formatter: ({ cellValue, row }) => getYesOrNoLabel(row.isDeclareCustomsEnum, cellValue),
  },
  {
    field: 'immediateCustomerPartNumber',
    showOverflow: 'tooltip',
    width: '120',
    ...columnFilterInput,
  },
  {
    field: 'immediateCustomerName',
    showOverflow: 'tooltip',
    width: '120',
    ...columnFilterInput,
  },
  {
    field: 'terminalCustomerPartNumber',
    showOverflow: 'tooltip',
    width: '120',
    ...columnFilterInput,
  },
  {
    field: 'productDesc',
    showOverflow: 'tooltip',
    width: '120',
  },
  {
    field: 'productionType',
    showOverflow: 'tooltip',
    width: '120',
    formatter: ({ cellValue, row }) => getProductTypeLabel(row.productionTypeEnum, cellValue),
  },
  {
    field: 'pdName',
    showOverflow: 'tooltip',
    width: '120',
  },
  {
    field: 'sampleGroupLeaderPersonName',
    showOverflow: 'tooltip',
    width: '120',
  },
  {
    field: 'epmStatus',
    showOverflow: 'tooltip',
    width: '120',
    formatter: ({ cellValue, row }) => getStatusLabel(row.epmStatusEnum, cellValue),
  },
  {
    field: 'epmDate',
    showOverflow: 'tooltip',
    i18nField: 'epmDateTime',
    width: '120',
    // formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).tz().format('YYYY-MM-DD HH:mm:ss') : ''),
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    field: 'epmUserName',
    showOverflow: 'tooltip',
    width: '120',
  },
  {
    field: 'epmHandlerDuration',
    showOverflow: 'tooltip',
    width: '120',
  },
  {
    field: 'pccHandlerStaus',
    showOverflow: 'tooltip',
    width: '120',
    formatter: ({ cellValue, row }) => getStatusLabel(row.pccHandlerStausEnum, cellValue),
  },
  {
    field: 'pccHandlerDate',
    i18nField: 'pccHandlerDateTime',
    showOverflow: 'tooltip',
    width: '120',
    // formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).tz().format('YYYY-MM-DD HH:mm:ss') : ''),
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    field: 'pccHandlerUserName',
    showOverflow: 'tooltip',
    width: '120',
  },
  {
    field: 'pccId',
    showOverflow: 'tooltip',
    width: '120',
    slots: {
      default: 'PccId',
    },
  },
  {
    field: 'pccHandlerDuration',
    showOverflow: 'tooltip',
    width: '120',
  },
  {
    field: 'pdLeaderHandlerStaus',
    showOverflow: 'tooltip',
    width: '120',
    formatter: ({ cellValue, row }) => getStatusLabel(row.pdLeaderHandlerStausEnum, cellValue),
  },
  {
    field: 'pdLeaderHandlerDate',
    i18nField: 'pdLeaderHandlerDateTime',
    showOverflow: 'tooltip',
    width: '120',
    // formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).tz().format('YYYY-MM-DD HH:mm:ss') : ''),
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    field: 'pdLeaderHandlerUserName',
    showOverflow: 'tooltip',
    width: '120',
  },
  {
    field: 'pdLeaderHandlerDuration',
    showOverflow: 'tooltip',
    width: '120',
  },
  {
    field: 'pdLeaderInfoId',
    showOverflow: 'tooltip',
    width: '120',
    slots: {
      default: 'pdLeaderInfoId',
    },
  },
  {
    field: 'sampleDeliveryReplyStatus',
    showOverflow: 'tooltip',
    width: '120',
    formatter: ({ cellValue, row }) => getStatusLabel(row.sampleDeliveryReplyStatusEnum, cellValue),
  },
  {
    field: 'sampleDeliveryReplyDate',
    i18nField: 'sampleDeliveryReplyDateTime',
    showOverflow: 'tooltip',
    width: '120',
    // formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).tz().format('YYYY-MM-DD HH:mm:ss') : ''),
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    field: 'sampleDeliveryReplyUserName',
    showOverflow: 'tooltip',
    width: '120',
  },
  {
    field: 'sampleDeliveryReplyHandlerDuration',
    showOverflow: 'tooltip',
    width: '120',
  },
  {
    field: 'sampleDeliveryReplyId',
    showOverflow: 'tooltip',
    width: '120',
    slots: {
      default: 'sampleDeliveryReplyId',
    },
  },
  {
    field: 'deliveryConfirmStatus',
    showOverflow: 'tooltip',
    width: '120',
    formatter: ({ cellValue, row }) => getStatusLabel(row.deliveryConfirmStatusEnum, cellValue),
  },
  {
    field: 'deliveryConfirmApplyDate',
    i18nField: 'deliveryConfirmApplyDateTime',
    showOverflow: 'tooltip',
    width: '120',
    // formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).tz().format('YYYY-MM-DD HH:mm:ss') : ''),
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    field: 'deliveryConfirmUserName',
    showOverflow: 'tooltip',
    width: '120',
  },
  {
    field: 'deliveryConfirmHandlerDuration',
    showOverflow: 'tooltip',
    width: '120',
  },
  {
    field: 'deliveryConfirmId',
    showOverflow: 'tooltip',
    width: '120',
    slots: {
      default: 'deliveryConfirmId',
    },
  },
  {
    field: 'confirmOpinion',
    showOverflow: 'tooltip',
    width: '120',
    slots: {
      default: 'confirmOpinion',
    },
  },
];

export const vxeTableColumns = _vxeTableColumns.map(item => {
  if (item.type) {
    return item;
  }
  return {
    ...item,
    title: t(`dict.BusinessSamplesReportColumn.${item.i18nField || item.field}`),
  };
});
