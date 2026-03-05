import { getQuantityStatus, getStatus } from '/@/components/CustomComponents/src/material/Constant';
import { useI18n } from '/@/hooks/web/useI18n';
import type { ColumnWithI18n } from '/@/effects/plugins/vxe-table/types';

const { t } = useI18n();

const isClaimEnumSTATUS = [
  { id: 0, fullName: t('common.no'), theme: 'gray' }, //草稿
  { id: 1, fullName: t('common.yes'), theme: 'green' }, //在办
];

const engineeringVerifySTATUS = [
  { id: 10, fullName: t('comon.reSendSample'), theme: 'blue' }, //重新送样
  { id: 11, fullName: t('common.importText'), theme: 'green' }, //导入
  { id: 12, fullName: t('common.ending'), theme: 'red' }, //结束
];

export const columns = (): ColumnWithI18n[] => {
  return [
    {
      type: 'expand',
      width: 50,
      slots: { content: 'expand' },
    },
    {
      type: 'checkbox',
      field: 'checkbox',
      width: 50,
    },
    {
      title: '需求单号',
      field: 'applyNumber',
      width: 160,
    },
    {
      title: '状态',
      field: 'engineeringStatus',
      width: 100,
      cellRender: {
        name: 'Tag',
        options: getStatus('engineeringStatusDesc'),
      },
    },
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      width: 200,
    },
    { title: '旧版成品编码', field: 'insideNumberOld', width: 170 },
    {
      title: '材料流水编码',
      field: 'materialNumber',
      width: 200,
    },
    {
      title: '材料描述',
      field: 'materialDesc',
      width: 200,
    },
    {
      title: '申请人',
      field: 'applyUserName',
      width: 140,
    },
    {
      title: '工厂',
      field: 'factoryName',
      width: 140,
    },
    {
      title: '开发采购',
      field: 'purchaseUserName',
      width: 230,
    },
    {
      title: '当前处理人',
      field: 'currentProcessor',
      width: 230,
    },
    {
      title: '当前节点',
      field: 'currentNodeName',
      width: 160,
    },
    {
      title: '节点记录',
      field: 'nodeDetail',
      width: 160,
      slots: { default: 'nodeDetail' },
    },
    {
      title: '操作',
      field: 'action',
      width: 80,
      fixed: 'right',
      slots: { default: 'action' },
    },
  ];
};

export const subColumns = (): ColumnWithI18n[] => {
  return [
    {
      title: '送样记录',
      field: 'number',
      i18nField: 'sendSamplesNumber',
      formatter: ({ cellValue }) => {
        return t('common.numberSort', [cellValue]);
      },
      width: 100,
    },
    { title: 'SQE', field: 'sqeUserName', width: 180 },
    { title: '宽幅mm*长度m', field: 'incomingSpecifications', width: 130 },
    { title: '卷数（R)', field: 'qty', width: 130 },
    { title: 'IQC', field: 'iqcCheckUserName', width: 180 },
    {
      title: '检验结果',
      field: 'status',
      cellRender: {
        name: 'Tag',
        options: getQuantityStatus('statusDesc'),
      },
      width: 130,
    },
    {
      title: '检验报告',
      field: 'testReportName',
      width: 130,
      slots: { default: 'reportDetail' },
    },
    { title: '实测数据', field: 'fieldTest', width: 150 },
    { title: '检验备注', field: 'remarks', i18nField: 'remarksCheck', width: 150 },
    {
      title: 'IQC检验记录',
      field: 'iqcTestReportId',
      width: 130,
      slots: {
        default: 'iqcTestReportId',
      },
    },
    {
      title: '是否领取',
      field: 'isClaimEnum',
      cellRender: {
        name: 'Tag',
        options: isClaimEnumSTATUS,
      },
      width: 100,
    },
    { title: '领取人', field: 'claimUserName', width: 180 },
    {
      title: '领取日期',
      field: 'claimDate',
      width: 180,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
    { title: '备注', field: 'claimRemarks', width: 150 },
    {
      title: '检验结果判定',
      field: 'engineeringCheckStatus',
      cellRender: {
        name: 'Tag',
        options: getQuantityStatus('engineeringCheckStatusDesc'),
      },
      width: 130,
    },
    { title: '备注(验证结果判定)', field: 'engineeringCheckRemarks', width: 150 },
    {
      title: '验证结果',
      field: 'engineeringVerifyStatus',
      cellRender: {
        name: 'Tag',
        options: engineeringVerifySTATUS,
      },
      width: 130,
    },
    { title: '备注(验证结果)', field: 'engineeringVerifyRemarks', width: 150 },
    {
      title: '采购结论',
      field: 'purchaseVerifyStatus',
      cellRender: {
        name: 'Tag',
        options: getQuantityStatus('purchaseVerifyStatusDesc'),
      },
      width: 130,
    },
  ];
};
