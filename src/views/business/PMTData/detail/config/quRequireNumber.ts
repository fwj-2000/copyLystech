/** 报价管理 */
import { useI18n } from '/@/hooks/web/useI18n';
import { getQuotationdetail } from '/@/api/business/PMTData';

export { schemas } from '../component/config';

export const api = getQuotationdetail;

const { t } = useI18n();

export function getColumns(): Array<any> {
  return [
    {
      field: 'seq',
      title: t('component.table.index'),
      type: 'seq',
      width: '50',
      align: 'center',
    },
    // 申请单号
    {
      title: t('dict.CommonCol.applyCode'),
      field: 'applyCode',
      width: 100,
    },
    // 申请人
    {
      title: t('dict.CommonCol.applyUserName'),
      field: 'applyUserName',
      width: 100,
    },
    // 申请部门
    {
      title: t('dict.CAApplyColumn.applyDeptName'),
      field: 'applyDeptName',
      width: 100,
    },
    // 申请日期
    {
      title: t('dict.MaterialDevelopImport.applyDateTime'),
      field: 'applyDate',
      width: 120,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
    // 终端客户代码
    {
      title: t('dict.SalesSiteColumn.terminalCustomerCode'),
      field: 'terminalCustomerCode',
      width: 120,
    },
    // 终端客户项目代码
    {
      title: t('dict.PartNumberApplyColumn.TerminalCustomerProjectCode'),
      field: 'terminalCustomerProjectCode',
      width: 120,
    },
    // 终端客户项目阶段
    {
      title: t('dict.QuotationRequirementsColumn.TerminalCustomerProjectStage'),
      field: 'terminalCustomerProjectStage',
      width: 120,
    },
    // 终端客户料号
    {
      title: t('dict.CommonCol.terminalCustomerPartNumber'),
      field: 'terminalCustomerPartNumber',
      width: 120,
    },
    // 需求时间
    {
      title: t('dict.QuantitativeApplyColumn.requireDateTime'),
      field: 'requireDate',
      width: 120,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
    // 紧急程度
    {
      title: t('dict.CommonCol.urgentLevel'),
      field: 'urgencyLevel',
      formatter: ({ row }) => row.urgencyLevelName || row.urgencyLevel || '',
      width: 120,
      aqpFilter: { cSharpType: 'int' },
    },
    // 预计量产日期
    {
      title: t('dict.QuotationRequirementsColumn.ExpectedProductionDate'),
      field: 'expectedProductionDate',
      width: 120,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
    // 峰值数量（KPCS)
    {
      title: t('dict.PMTData.peakQty'),
      field: 'peakQty',
      width: 120,
    },
    // 峰值月份
    {
      title: t('dict.PMTData.peakMonth'),
      field: 'peakMonth',
      width: 120,
    },
    // 招标壳厂数量
    {
      title: t('dict.QuotationRequirementsColumn.TenderFactoryQty'),
      field: 'tenderFactoryQty',
      width: 120,
    },
    // 量产周期（月）
    {
      title: t('dict.QuotationRequirementsColumn.ProductionCycle'),
      field: 'productionCycle',
      width: 120,
    },
    // 内部料号
    {
      title: t('dict.CommonCol.insidePartNumber'),
      field: 'insidePartNumber',
      width: 100,
    },
    // 项目总量（KPCS)
    {
      title: t('dict.PMTData.totalQty'),
      field: 'totalQty',
      width: 100,
    },
    // 单位用量
    {
      title: t('dict.QuotationRequirementsColumn.UnitQty'),
      field: 'unitQty',
      width: 100,
    },
    // 产品描述
    {
      title: t('dict.CommonCol.productDesc'),
      field: 'productDesc',
      width: 200,
    },
    // 审核人姓名
    {
      title: t('dict.DrawingsReviewReqColumn.reviewUserName'),
      field: 'reviewUserName',
      width: 260,
    },
    // 脱敏图纸
    {
      title: t('dict.CommonCol.desensitizedDrawingsName'),
      field: 'desensitizedDrawingsName',
      width: 260,
      slots: { default: 'desensitizedDrawingsName' },
    },
    // 工程图纸
    {
      title: t('dict.MouldRoomColumn.prjDrawingsName'),
      field: 'engineeringDrawingsName',
      width: 260,
      slots: { default: 'engineeringDrawingsName' },
    },
    // remark
    {
      title: t('dict.CommonCol.remark'),
      field: 'remark',
      width: 120,
    },
  ];
}
