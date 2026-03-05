/** 出货 */
import { useI18n } from '/@/hooks/web/useI18n';
import { usePartFormatter } from '../utils';
import { getCelldetail } from '/@/api/business/PMTData';

export { schemas } from '../component/config';

export const api = getCelldetail;

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
    // 客户图纸
    {
      title: t('dict.CommonCol.customerDraw'),
      field: 'customerDrawingsName',
      width: 260,
      slots: { default: 'customerDrawingsName' },
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
  ];
}
