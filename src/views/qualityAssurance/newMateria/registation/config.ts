import { BasicColumn } from '/@/components/Table';
import { getQuantityStatus, getStatus } from '/@/components/CustomComponents/src/material/Constant';
import { h } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { formatFooterData } from '/@/views/dataAnalysis/components/BaseVxeTable/utils';

const { t } = useI18n();

const isClaimEnumSTATUS = [
  { id: 0, fullName: t('common.no'), theme: 'gray' }, //否
  { id: 1, fullName: t('common.yes'), theme: 'green' }, //是
];

const engineeringVerifySTATUS = [
  { id: 10, fullName: t('comon.reSendSample'), theme: 'blue' }, //重新送样
  { id: 11, fullName: t('common.importText'), theme: 'green' }, //导入
  { id: 12, fullName: t('common.ending'), theme: 'red' }, //结束
];

export const commonColumns = [
  { title: '需求单号', field: 'applyNumber', width: 180 },
  { title: '产品内部料号', field: 'insidePartNumber', width: 200 },
  { title: '旧版成品编码', field: 'insideNumberOld', width: 150 },
  { title: '材料流水编码', field: 'materialNumber', width: 120 },
  { title: '工厂', field: 'factoryName', i18nField: 'CommonCol.factory' },
  { title: '材料描述', field: 'materialDesc', width: 220 },
  { title: '供应商名称', field: 'supplierName' },
  { title: '供应商材料编码', field: 'manufacturerMaterialsCode' },
  { title: '被替/备选料号', field: 'alternativeMaterialNumber' },
  { title: '被替/备选料供应商', field: 'alternativeSupplierName' },
  { title: 'PD', field: 'applyUserName', width: 230, i18nField: 'CommonCol.pd' },
  { title: '开发采购', field: 'purchaseUserName', width: 230 },
  { title: '申请人', field: 'applyUserName', width: 230, minWidth: '' },
  {
    title: '申请时间',
    field: 'applyDate',
    width: 160,
    cellRender: {
      name: 'Date',
    },
  },
];
export const columns = handleNodeModal => {
  return [
    ...commonColumns,
    {
      title: '处理时间',
      field: 'creatorTime',
      i18nField: 'CommonCol.handleTime',
      cellRender: {
        name: 'Date',
      },
    },
    {
      title: '当前处理人',
      field: 'currentProcessor',
      width: 230,
    },
    {
      title: '当前节点',
      field: 'currentNodeName',
      i18nField: 'CommonCol.currentNode',
      width: 160,
    },
    {
      title: '节点记录',
      field: 'nodeDetail',
      i18nField: 'CommonCol.nodeDetail',
      width: 160,
      // customRender: ({ record }) => {
      //   if (record.status == 0) return '/';
      //   return h('span', { class: 'table-a', onClick: handleNodeModal.bind(null, record) }, t('common.viewDetails'));
      // },
      slots: { default: 'nodeDetail' },
    },
  ];
};
export const columnVxe = [
  { field: 'checkbox', type: 'checkbox', width: 50 },
  { title: '需求单号', field: 'applyNumber', width: 150 },
  { title: '产品内部料号', field: 'insidePartNumber', width: 200 },
  { title: '旧版成品编码', field: 'insideNumberOld', width: 150 },
  { title: '材料流水编码', field: 'materialNumber', width: 120 },
  { title: '工厂', field: 'factoryName', width: 120 },
  {
    title: '状态',
    field: 'status',
    width: 100,
    cellRender: {
      name: 'Tag',
      options: getStatus('statusDesc'),
    },
  },
  { title: '材料描述', field: 'materialDesc', width: 220 },
  { title: '供应商名称', field: 'supplierName', width: 200 },
  { title: '供应商材料编码', field: 'manufacturerMaterialsCode', width: 180 },
  { title: '被替/备选料号', field: 'alternativeMaterialNumber', width: 180 },
  { title: '被替/备选料供应商', field: 'alternativeSupplierName', width: 180 },
  { title: 'PD', field: 'applyUserName', i18nField: 'CommonCol.pd', width: 230 },
  { title: '开发采购', field: 'purchaseUserName', width: 230 },
  // { title: '处理时间', field: 'creatorTime', i18nField: 'CommonCol.handleTime', cellRender: { name: 'Date' }, width: 160 },
  {
    title: '当前处理人',
    field: 'currentProcessor',
    i18nField: 'CommonCol.currentNodeUser',
    width: 230,
  },
  {
    title: '当前节点',
    field: 'currentNodeName',
    i18nField: 'CommonCol.currentNode',
    width: 120,
  },
  {
    title: '节点记录',
    field: 'nodeDetail',
    i18nField: 'CommonCol.nodeDetail',
    width: 120,
    slots: {
      default: 'nodeDetail',
    },
  },
  { title: '申请人', field: 'applyUserName', width: 230, minWidth: '' },
  {
    title: '申请时间',
    field: 'applyDateTime',
    width: 160,
    minWidth: '',
    cellRender: {
      name: 'Date',
    },
  },
];

export const subColumns = (handleReport?: CallableFunction) => {
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
      field: 'testReportId',
      i18nField: 'testReportName',
      width: 130,
      slots: {
        default: ({ row }: any) => {
          return row.testReportId ? h('span', { class: 'table-a', onClick: () => handleReport?.(row) }, t('common.viewDetails')) : '/';
        },
      },
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
    { title: '领取卷数', field: 'claimQty', width: 180 },
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

export const addColumns = [
  {
    title: '材料流水编码',
    field: 'materialNumber',
    formatter: ({ cellValue }) => {
      return cellValue || t('common.fromSys');
    },
    width: 150,
  },
  {
    title: '送样记录',
    field: 'sendSamplesNumber',
    formatter: data => {
      return t('common.numberSort', [data.cellValue]);
    },
    width: 100,
  },
  { title: '产品内部料号', field: 'insidePartNumber', width: 180 },
  {
    title: '旧版成品编码',
    field: 'insideNumberOld',
    width: 220,
  },
  { title: '供应商名称', field: 'supplierName', width: 180 },
  { title: '供应商材料编码', field: 'manufacturerMaterialsCode', width: 180 },
  { title: '宽幅mm*长度m', field: 'incomingSpecifications', editRender: { name: 'Input' }, width: 150 },
  { title: '卷数（R)', field: 'qty', editRender: { name: 'InputNumber' }, width: 150 },
  {
    title: '下一节点处理人(IQC)',
    field: 'iqcUserId',
    editRender: { name: 'CustomUserSelect' },
    i18nField: 'CommonCol.nextHandler',
    i18nParams: ['IQC'],
    width: 180,
  },
  { title: '被替/备选料号', field: 'alternativeMaterialNumber', width: 180 },
  { title: '被替/备选料供应商', field: 'alternativeSupplierName', width: 180 },
  {
    title: t('common.action'),
    field: 'action',
    slots: { default: 'action' },
    width: 50,
    fixed: 'right',
  },
];
