import { getQuantityStatus } from '/@/components/CustomComponents/src/material/Constant';
import { h } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
import type { ColumnWithI18n } from '/@/effects/plugins/vxe-table/types';

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
    { type: 'checkbox', field: 'checkbox', width: 50 },
    { title: '需求单号', field: 'applyNumber', width: 150 },
    { title: '产品内部料号', field: 'insidePartNumber', width: 200 },
    { title: '旧版成品编码', field: 'insideNumberOld', width: 150 },
    { title: '材料流水编码', field: 'materialNumber', width: 150 },
    { title: '工厂', field: 'factoryName', width: 130 },
    { title: '材料描述', field: 'materialDesc', width: 180 },
    // { title: '供应商名称', field: 'supplierName' },
    // { title: '供应商材料编码', field: 'manufacturerMaterialsCode' },
    // { title: '被替/备选料号', field: 'alternativeMaterialNumber' },
    // { title: '被替/备选料供应商', field: 'alternativeSupplierName' },
    { title: 'PD', field: 'applyUserName', width: 200, i18nField: 'pd' },
    { title: '开发采购', field: 'purchaseUserName', width: 200 },
    // {
    //   title: '处理时间',
    //   field: 'creatorTime',
    //   i18nField: 'CommonCol.handleTime',
    //   cellRender: {
    //     name: 'Date',
    //     format: 'YYYY-MM-DD HH:mm',
    //   },
    //   width: 200,
    // },
    {
      title: '当前处理人',
      field: 'currentProcessor',
      width: 200,
    },
    {
      title: '当前节点',
      field: 'currentNodeName',
      width: 160,
    },
    {
      title: '节点记录',
      field: 'nodeDetail',
      slots: { default: 'nodeDetail' },
      width: 160,
      // customRender: ({ record }) => {
      //   if (record.status == 0) return '/';
      //   return h('span', { class: 'table-a', onClick: handleNodeModal.bind(null, record) }, t('common.viewDetails'));
      // },
    },
    { title: '申请人', field: 'applyUserName', width: 230, minWidth: '' },
    {
      title: '申请时间',
      field: 'applyDate',
      width: 160,
      minWidth: '',
      cellRender: {
        name: 'Date',
      },
    },
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 70,
      fixed: 'right',
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
      field: 'history',
      width: 130,
      slots: { default: 'historyDetail' },
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

export const testStatus = [
  { value: 3, label: 'OK' },
  { value: 2, label: 'NG' },
];

export const addColumns = (handleReport?: CallableFunction): ColumnWithI18n[] => {
  return [
    {
      title: '材料流水编码',
      field: 'materialNumber',
      formatter: ({ cellValue }) => {
        return cellValue || t('common.fromSys');
      },
    },
    {
      title: '检验记录',
      field: 'sendSamplesRecord',
      formatter: ({ cellValue }) => {
        return t('common.numberSort', [cellValue]);
      },
      width: 100,
    },
    { title: '产品内部料号', field: 'insidePartNumber', width: 200 },
    {
      title: '旧版成品编码',
      field: 'insideNumberOld',
      width: 220,
    },
    {
      title: '检验结果',
      field: 'testReportStatus',
      editRender: {
        name: 'ASelect',
        props: {
          options: testStatus,
        },
      },
      // editComponent: 'Select',
      // editComponentProps: {
      //   options: testStatus,
      // },
    },
    {
      title: '检验报告',
      field: 'testReportName',
      width: 200,
      slots: { default: 'reportDetail' },
      // customRender: ({ record }) => {
      //   return record.testReportId
      //     ? h(
      //         'div',
      //         {
      //           class: 'table-a',
      //           onClick: () => {
      //             handleReport && handleReport(record);
      //           },
      //         },
      //         t('common.viewDetails'),
      //       )
      //     : '/';
      // },
    },
    {
      title: '实测数据',
      field: 'fieldTest',
      editRender: {
        name: 'Input',
      },
    },
    {
      title: '检验备注',
      field: 'testReportRemarks',
      i18nField: 'remarksCheck',
      editRender: {
        name: 'Input',
      },
    },
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 120,
      fixed: 'right',
    },
  ];
};
