/** 客户使用 - IQC */
import { useI18n } from '/@/hooks/web/useI18n';
import { usePartFormatter } from '../utils';
import { getOnlineusedetail } from '/@/api/business/PMTData';

export { schemas } from '../component/config';

const { t } = useI18n();

export const api = getOnlineusedetail;

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
    // 工厂
    {
      title: t('dict.CommonCol.factoryName'),
      field: 'factoryName',
      width: 100,
    },
    // 内部料号
    {
      title: t('dict.CommonCol.insidePartNumber'),
      field: 'insidePartNumber',
      width: 100,
      merge: true,
    },
    // 是否沿用件
    {
      title: t('dict.PMTData.continueUsing'),
      field: 'usePart',
      width: 200,
      formatter: ({ cellValue }) => usePartFormatter(cellValue),
    },
    // 产品描述
    {
      title: t('dict.CommonCol.productDesc'),
      field: 'productDesc',
      width: 200,
    },
    // 内部项目代码
    {
      title: t('dict.CommonCol.insideProjectCode'),
      field: 'insideProjectCode',
      width: 100,
    },
    // 旧版产品内部料号
    {
      title: t('dict.CommonCol.insidePartNumberOld'),
      field: 'insidePartNumberOld',
      width: 200,
    },
    // 直接客户代码
    {
      title: t('dict.CommonCol.immediateCustomerCode'),
      field: 'immediateCustomerCode',
      width: 120,
    },
    // 直接客户名称
    {
      title: t('dict.CommonCol.immediateCustomerName'),
      field: 'immediateCustomerName',
      width: 120,
    },
    // 直接客户版本号
    {
      title: t('dict.PartNumberApplyColumn.ImmediateCustomerVersion'),
      field: 'immediateCustomerVersion',
      width: 120,
    },
    // 直接客户项目代码
    {
      title: t('dict.ProjectColumn.ImmediateCustomerProjectCode'),
      field: 'immediateCustomerProjectCode',
      width: 120,
    },
    // 直接客户料号
    {
      title: t('dict.CommonCol.immediateCustomerPartNumber'),
      field: 'immediateCustomerPartNumber',
      width: 120,
    },
    // 直接客户料件版本号
    {
      title: t('dict.DrawingsReviewReqColumn.immediateCustomerPartVersion'),
      field: 'immediateCustomerPartVersion',
      width: 200,
    },
    // 终端客户代码
    {
      title: t('dict.SalesSiteColumn.terminalCustomerCode'),
      field: 'terminalCustomerCode',
      width: 120,
    },
    // 终端客户名称
    {
      title: t('dict.SalesSiteColumn.terminalFullName'),
      field: 'terminalCustomerName',
      width: 120,
    },
    // 终端客户版本号
    {
      title: t('dict.PartNumberApplyColumn.TerminalCustomerVersion'),
      field: 'terminalCustomerVersion',
      width: 120,
    },
    // 终端客户项目代码
    {
      title: t('dict.PartNumberApplyColumn.TerminalCustomerProjectCode'),
      field: 'terminalCustomerProjectCode',
      width: 120,
    },
    // 终端客户料号
    {
      title: t('dict.CommonCol.terminalCustomerPartNumber'),
      field: 'terminalCustomerPartNumber',
      width: 120,
    },
    // 终端客户料件版本号
    {
      title: t('dict.DrawingsReviewColumn.terminalCustomerPartVersion'),
      field: 'terminalCustomerPartVersion',
      width: 120,
    },
    // 交货单号
    {
      title: t('dict.SFCHistory.deliveryNoteNo'),
      field: 'sapVbeln',
      width: 120,
    },
    // 交货单行号
    {
      title: t('dict.SFCHistory.deliveryLineNo'),
      field: 'sapPosnrCf',
      width: 120,
    },
    // 单号
    {
      title: t('dict.NpiShipmentOnlineColumn.BillNo'),
      field: 'billNo',
      width: 120,
    },
    // 客户产品阶段
    {
      title: t('dict.NpiProjectStageColumn.CustomerProductStage'),
      field: 'customerProductStage',
      width: 120,
    },
    // 内部产品阶段
    {
      title: t('dict.NpiProjectStageColumn.InternalProductStage'),
      field: 'internalProductStage',
      width: 120,
    },
    // Sap客户代码
    {
      title: t('dict.PMTData.sapCustomerCode'),
      field: 'sapCustomerCode',
      width: 120,
    },
    // 客户料号
    {
      title: t('dict.VMIStockColumn.customerMaterialCode'),
      field: 'customerPartNumber',
      width: 120,
    },
    // 生产日期
    {
      title: t('dict.CommonCol.materialProductionDate'),
      field: 'productDate',
      width: 120,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
    // 批次号
    {
      title: t('dict.IQCApplyColumn.lotNo'),
      field: 'lotNumber',
      width: 120,
    },
    // 出货日期
    {
      title: t('dict.NpiShipmentOnlineColumn.ShipmentDate'),
      field: 'shipmentDate',
      width: 120,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
    // 出货数量
    {
      title: t('dict.NpiShipmentOnlineColumn.ShipmentQty'),
      field: 'shipmentQty',
      width: 120,
    },
    // IQC 抽检数量
    {
      title: t('dict.NpiShipmentOnlineColumn.NumberOfIQCSamples'),
      field: 'numberOfIqcSamples',
      width: 120,
    },
    // IQC 抽检NG数量
    {
      title: t('dict.NpiShipmentOnlineColumn.NgNumberOfIQCSamples'),
      field: 'ngNumberOfIqcSamples',
      width: 120,
    },
    // IQC异常明细
    {
      title: t('dict.NpiShipmentOnlineColumn.DetailsOfIQCExceptions'),
      field: 'detailsOfIqcExceptions',
      width: 120,
    },
    // IQC结论
    {
      title: t('dict.NpiShipmentOnlineColumn.IQCConclusions'),
      field: 'iqcConclusions',
      width: 120,
    },
    // 客户上线数量
    {
      title: t('dict.NpiShipmentOnlineColumn.CustomerOnlineNumber'),
      field: 'customerOnlineNumber',
      width: 120,
    },
    // 客户上线NG数量
    {
      title: t('dict.NpiShipmentOnlineColumn.CustomerOnlineNgNumber'),
      field: 'customerOnlineNgNumber',
      width: 120,
    },
    // 上线异常明细
    {
      title: t('dict.NpiShipmentOnlineColumn.OnlineDetailsOfExceptions'),
      field: 'onlineDetailsOfExceptions',
      width: 120,
    },
    // 上线结论
    {
      title: t('dict.NpiShipmentOnlineColumn.OnlineConclusions'),
      field: 'onlineConclusions',
      width: 120,
    },
    // 备注
    {
      title: t('dict.CommonCol.remark'),
      field: 'remark',
      width: 120,
    },
  ];
}
