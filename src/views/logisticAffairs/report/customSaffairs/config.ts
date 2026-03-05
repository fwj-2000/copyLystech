import type Dayjs from 'dayjs';
import type { VxeGridPropTypes } from '/@/components/VxeTable';

// import { useBaseStore } from '/@/store/modules/base';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useI18n } from '/@/hooks/web/useI18n';
import { getLabelByOptions } from '/@/views/business/report/utils';
// import { getStatusOption } from '/@/views/logisticAffairs/export/filings/finalForm/components/created/config';
// import { statusOptions as finalFormStatusOptions } from '/@/views/logisticAffairs/export/filings/finalForm/config';
// import { statusOptions as customerServiceOptions } from '/@/views/customerService/filings/demand/components/created/config';
// import { AUDIT_STATUS_OPTIONS as productStatusOptions } from '/@/views/productionDeal/fillings/maintain/config'
// import { statusOptions as engineeringStatusOptions } from '/@/views/engineering/filings/maintain/config';
// import { statusOptions as logisticDemandStatusOptions  } from '/@/views/logisticAffairs/export/filings/demand/components/tableConfig';
// import { statusOptions as logisticMaintainStatusOptions  } from '/@/views/logisticAffairs/export/filings/maintain/uncreatedConfig';
// import { statusOptions as logisticMaintainAuditedStatusOptions  } from '/@/views/logisticAffairs/export/filings/maintain/auditedConfig';
// import { statusOptions as logisticMaintainWaitStatusOptions  } from '/@/views/logisticAffairs/export/filings/maintain/waitAuditConfig';
// import { getFlowStatus } from '/@/components/CustomComponents/src/warehouse/Constant';

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

export const statusOptions = [
  { id: 6, fullName: t('common.todoText'), value: 6, label: t('common.todoText'), theme: 'gray', rowKey: 'statusEnum' }, //待处理
  { id: 7, fullName: t('common.doneText'), value: 7, label: t('common.doneText'), theme: 'green', rowKey: 'statusEnum' }, //已处理
];

/** 待处理选项的值 */
export const TODO_STATUS_VALUE = 6;

const _vxeTableColumns: Array<VxeGridPropTypes.Column & { i18nField?: string }> = [
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
  // 备案需求单号
  {
    field: 'filingsApplyNo',
    showOverflow: 'tooltip',
    width: '160',
    ...columnFilterInput,
  },
  // 来源单号
  {
    field: 'quantitativeApplyNo',
    showOverflow: 'tooltip',
    width: '160',
    ...columnFilterInput,
  },
  // 产品内部料号
  {
    field: 'innerMaterialNumber',
    showOverflow: 'tooltip',
    width: '200',
    ...columnFilterInput,
  },
  // 生产工厂
  {
    field: 'productArea',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 出货备案法人
  {
    field: 'sellCorporation',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 备案语言
  {
    field: 'filingsLanguage',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 申请备案时间
  {
    field: 'filingsApplyTime',
    showOverflow: 'tooltip',
    width: '120',
    cellRender: {
      name: 'Date',
      // @ts-ignore
      format: 'YYYY-MM-DD HH:mm',
    },
  },
  // 直接客户名称
  {
    field: 'directCustomerName',
    showOverflow: 'tooltip',
    width: '120',
    ...columnFilterInput,
  },
  // 直接客户料号
  {
    field: 'directCustomerMaterialNumber',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 口岸
  {
    field: 'prot',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 出货方式
  {
    field: 'shipmentType',
    showOverflow: 'tooltip',
    width: '120',
    formatter: ({ cellValue, row }) =>
      getLabelByOptions(row.shipmentTypeEnum, cellValue, [
        { label: t('common.declarationByOrder'), value: 1 },
        { label: t('common.centralizedDeclaration'), value: 2 },
      ]),
  },
  // 终端客户料号
  {
    field: 'terminalCustomerMaterialNumber',
    showOverflow: 'tooltip',
    width: '120',
    ...columnFilterInput,
  },
  // 客服
  {
    field: 'customersName',
    showOverflow: 'tooltip',
    width: '120',
  },
  // PD责任人
  {
    field: 'pdPersonName',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 关务责任人
  {
    field: 'customsName',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 销售人员
  {
    field: 'salesName',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 状态
  {
    field: 'statusEnum',
    showOverflow: 'tooltip',
    i18nField: 'status',
    width: '120',
    cellRender: {
      name: 'Tag',
      options: statusOptions,
    },
    filters: [{ data: '' }],
    filterRender: { name: 'ASelect', props: { options: statusOptions, style: { width: '120px' } } },
  },
  // 生产处理人
  {
    field: 'pUserName',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 生产处理日期
  {
    field: 'pHandlerTime',
    showOverflow: 'tooltip',
    width: '120',
    cellRender: {
      name: 'Date',
      // @ts-ignore
      format: 'YYYY-MM-DD',
    },
  },
  // 生产处理状态
  {
    field: 'produceHandlerStausEnum',
    i18nField: 'produceStaus',
    showOverflow: 'tooltip',
    width: '120',
    cellRender: {
      name: 'Tag',
      options: statusOptions,
    },
    filters: [{ data: '' }],
    filterRender: { name: 'ASelect', props: { options: statusOptions } },
  },
  // 生产处理详情
  {
    field: 'produceId',
    showOverflow: 'tooltip',
    width: '120',
    slots: {
      default: 'produceId',
    },
  },
  // 工程处理人
  {
    field: 'eUserName',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 工程处理日期
  {
    field: 'eHandlerTime',
    showOverflow: 'tooltip',
    width: '120',
    cellRender: {
      name: 'Date',
      // @ts-ignore
      format: 'YYYY-MM-DD',
    },
  },
  // 工程处理状态
  {
    field: 'engineeringHandlerStausEnum',
    showOverflow: 'tooltip',
    i18nField: 'eHandlerStaus',
    width: '120',
    cellRender: {
      name: 'Tag',
      options: statusOptions,
    },
    filters: [{ data: '' }],
    filterRender: { name: 'ASelect', props: { options: statusOptions } },
  },
  // 工程处理详情
  {
    field: 'engineeringId',
    showOverflow: 'tooltip',
    width: '120',
    slots: {
      default: 'engineeringId',
    },
  },
  // 资料审核处理人
  {
    field: 'rUserName',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 资料审核处理日期
  {
    field: 'rHandlerTime',
    showOverflow: 'tooltip',
    width: '120',
    cellRender: {
      name: 'Date',
      // @ts-ignore
      format: 'YYYY-MM-DD',
    },
  },
  // 资料审核处理状态
  {
    field: 'reviewHandlerStausEnum',
    showOverflow: 'tooltip',
    i18nField: 'rHandlerStaus',
    width: '120',
    cellRender: {
      name: 'Tag',
      options: statusOptions,
    },
    // filters: [{ data: '' }],
    // filterRender: { name: 'ASelect', props: { options: statusOptions } },
  },
  // 资料审核处理时长
  {
    field: 'rDuration',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 资料审核处理详情
  {
    field: 'reviewId',
    showOverflow: 'tooltip',
    width: '120',
    slots: {
      default: 'reviewId',
    },
  },
  // 备案资料制作处理人
  {
    field: 'fbUserName',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 备案资料制作处理日期
  {
    field: 'fbHandlerTime',
    showOverflow: 'tooltip',
    width: '120',
    cellRender: {
      name: 'Date',
      // @ts-ignore
      format: 'YYYY-MM-DD',
    },
  },
  // 备案资料制作处理状态
  {
    field: 'fbHandlerStausEnum',
    showOverflow: 'tooltip',
    i18nField: 'fbHandlerStaus',
    width: '120',
    cellRender: {
      name: 'Tag',
      options: statusOptions,
    },
    // filters: [{ data: '' }],
    // filterRender: { name: 'ASelect', props: { options: statusOptions } },
  },
  // 备案资料制作处理时长
  {
    field: 'fbDuration',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 备案资料制作处理详情
  {
    field: 'fbId',
    showOverflow: 'tooltip',
    width: '120',
    slots: {
      default: 'fbId',
    },
  },
  // 备案资料制作审核处理人
  {
    field: 'fbrUserName',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 备案资料制作审核处理日期
  {
    field: 'fbrHandlerDate',
    showOverflow: 'tooltip',
    width: '120',
    cellRender: {
      name: 'Date',
      // @ts-ignore
      format: 'YYYY-MM-DD',
    },
  },
  // 备案资料制作审核处理状态
  {
    field: 'fbReviewHandlerStausEnum',
    i18nField: 'fbrHandlerStaus',
    showOverflow: 'tooltip',
    width: '120',
    cellRender: {
      name: 'Tag',
      options: statusOptions,
    },
    // filters: [{ data: '' }],
    // filterRender: { name: 'ASelect', props: { options: statusOptions } },
  },
  // 备案资料制作审核处理时长
  {
    field: 'fbrDuration',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 出口内地备案表制作人
  {
    field: 'exportUserName',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 出口内地备案表制作日期
  {
    field: 'exportMakeDate',
    showOverflow: 'tooltip',
    width: '120',
    cellRender: {
      name: 'Date',
      // @ts-ignore
      format: 'YYYY-MM-DD',
    },
  },
  // 出口内地备案表制作状态
  {
    field: 'exportStatusEnum',
    showOverflow: 'tooltip',
    width: '120',
    i18nField: 'exportStatus',
    cellRender: {
      name: 'Tag',
      options: statusOptions,
    },
    // filters: [{ data: '' }],
    // filterRender: { name: 'ASelect', props: { options: statusOptions } },
  },
  // 出口内地备案表制作处理时长
  {
    field: 'exportDuration',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 出港备案表制作人
  {
    field: 'dUserName',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 出港备案表制作日期
  {
    field: 'departureDate',
    showOverflow: 'tooltip',
    width: '120',
    cellRender: {
      name: 'Date',
      // @ts-ignore
      format: 'YYYY-MM-DD',
    },
  },
  // 出港备案表制作状态
  {
    field: 'departureStatusEnum',
    i18nField: 'dStatus',
    showOverflow: 'tooltip',
    width: '120',
    cellRender: {
      name: 'Tag',
      options: statusOptions,
    },
    // filters: [{ data: '' }],
    // filterRender: { name: 'ASelect', props: { options: statusOptions } },
  },
  // 出港备案表制作处理时长
  {
    field: 'dDuration',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 终版备案详情
  {
    field: 'effId',
    showOverflow: 'tooltip',
    width: '120',
    slots: {
      default: 'effId',
    },
  },
];

export const getVxeTableColumns = () =>
  _vxeTableColumns.map(item => {
    if (item.type) {
      return item;
    }
    return {
      ...item,
      // @ts-ignore
      title: t(`dict.CustomsAffairsReportColumn.${item.i18nField || item.field}`),
    };
  });
