import { getActionLogList, getMoldReceiveHistory, getMoldRefundHistory, getMoldRepairHistory } from '/@/api/warehouse/moIdBill';
import { BILLACTIONVIEW } from '../type';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
// 操作记录
export const actionLogColumn = [
  { title: '变更类型', field: 'operateType' },
  { title: '变更前', field: 'updateFront' },
  { title: '变更后', field: 'updateAfter' },
  { title: '操作人', field: 'operateUserName' },
  { title: '操作日期', field: 'operateDate', cellRender: { name: 'Date' } },
];

// 入库历史
export const receiveHistoryColumn = [];

// 检测报告
export const checkReportColumn = [
  { title: '检测时间', field: 'checkDate' },
  { title: '检测人', field: 'checkUserName' },
  { title: '检测结果', field: 'checkResult' },
  { title: '检测报告', field: 'checkReport' },
];

// 领用记录
export const billColumnsUseRecord = [
  { title: '模具领用单号', field: 'moldReceiveApplyNo' },
  { title: '工厂', field: 'factory' },
  { title: '领科人', field: 'receiveMoldUserNames' },
  { title: '实际领用时间', field: 'actualReceiveDate', cellRender: { name: 'Date' } },
];

// 台账退回记录
export const billColumnsReturnRecord = [
  { title: '退模单号', field: 'moldRefundApplyNo' },
  { title: '异常通知单号', field: 'moldRepairApplyNo' },
  { title: '工厂', field: 'factory' },
  { title: '退料人', field: 'refundMoldUserNames' },
  { title: '实际退时间', field: 'actualRefundDate', cellRender: { name: 'Date' } },
];
// 维修记录
export const billColumnsRepairRecord = [
  { title: '维修单号', field: 'moldRepairApplyNo' },
  { title: '工厂', field: 'factory' },
  { title: '维修人', field: 'repairMoldUserNames' },
  { title: '实际维修时间', field: 'actualRepairDate', cellRender: { name: 'Date' } },
];

// 弹框配置
export const configViewModal: Record<BILLACTIONVIEW, any> = {
  actionLog: {
    columns: actionLogColumn,
    id: 'actionLog',
    detailApi: getActionLogList,
    title: t('dict.CommonCol.actionLog'),
  },
  //   checkReport: {
  //     columns: checkReportColumn,
  //     id: 'checkReport',
  //     detailApi: getCheckReportList,
  //     title: t('common.editReplaceSupplier'),
  //   },
  useRecord: {
    columns: billColumnsUseRecord,
    id: 'useRecord',
    detailApi: getMoldReceiveHistory,
    title: t('dict.CommonCol.useRecord'),
  },
  returnRecord: {
    columns: billColumnsReturnRecord,
    id: 'returnRecord',
    detailApi: getMoldRefundHistory,
    title: t('dict.CommonCol.returnRecord'),
  },
  repairRecord: {
    columns: billColumnsRepairRecord,
    id: 'repairRecord',
    detailApi: getMoldRepairHistory,
    title: t('dict.CommonCol.repairRecord'),
  },
};
