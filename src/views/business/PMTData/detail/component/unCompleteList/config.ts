// 未完成 - 通用详情
import { useI18n } from '/@/hooks/web/useI18n';
import { getReportDetailList } from '/@/api/business/PMTData';

export { schemas } from '../config';

export const api = getReportDetailList;

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
    // 内部项目代码
    {
      title: t('dict.CommonCol.insideProjectCode'),
      field: 'insideProjectCode',
      width: 200,
      merge: true,
    },
    // 产品线
    {
      title: t('dict.CommonCol.productLine'),
      field: 'productLineName',
      width: 120,
    },
    // 产品内部编码
    {
      title: t('dict.CommonCol.insidePartNumber'),
      field: 'insidePartNumber',
      width: 200,
    },
    // 旧版产品内部料号
    {
      title: t('dict.CommonCol.insidePartNumberOld'),
      field: 'insidePartNumberOld',
      width: 200,
    },
    // 产品描述
    {
      title: t('dict.CommonCol.productDesc'),
      field: 'productDesc',
      width: 200,
    },
    // 直接客户简称
    {
      title: t('dict.QuantitativeReportColumn.immediateCustomerName'),
      field: 'immediateCustomerName',
      width: 120,
    },
    // 直接客户料号
    {
      title: t('dict.CommonCol.immediateCustomerPartNumber'),
      field: 'ImmediateCustomerPartNumber',
      width: 200,
    },
    // 直接客户项目代码
    {
      title: t('dict.ProjectColumn.ImmediateCustomerProjectCode'),
      field: 'immediateCustomerProjectCode',
      width: 200,
    },
    // 直接客户料号版本
    {
      title: t('dict.PartNumberApplyColumn.ImmediateCustomerPartVersion'),
      field: 'ImmediateCustomerPartVersion',
      width: 200,
    },
    // 终端客户版本
    {
      title: t('dict.PartNumberApplyColumn.TerminalCustomerVersion'),
      field: 'terminalCustomerPartVersion',
      width: 200,
    },
    // 终端项目代码
    {
      title: t('dict.CommonCol.terminalProjectCode'),
      field: 'terminalCustomerProjectCode',
      width: 200,
    },
  ];
}
