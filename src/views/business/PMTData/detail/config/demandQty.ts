/** 需求管理 - 交付数量(k) */
import { useI18n } from '/@/hooks/web/useI18n';
import { usePartFormatter } from '../utils';
import { getRequiredetailList } from '/@/api/business/PMTData';

export { schemas } from '../component/config';

export const api = getRequiredetailList;

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
    // 直接客户简称
    {
      title: t('dict.QuantitativeReportColumn.immediateCustomerName'),
      field: 'immediateCustomerName',
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
    // 终端客户版本
    {
      title: t('dict.PartNumberApplyColumn.TerminalCustomerVersion'),
      field: 'terminalCustomerPartVersion',
      width: 200,
    },
    // 直接客户料号
    {
      title: t('dict.CommonCol.immediateCustomerPartNumber'),
      field: 'ImmediateCustomerPartNumber',
      width: 200,
    },
    // 终端项目代码
    {
      title: t('dict.CommonCol.terminalProjectCode'),
      field: 'terminalCustomerProjectCode',
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
    // 计划交付数量（取计划-模切计划-交货计划中的交付合计数量）
    {
      title: t('dict.PMTData.plannedDeliveryQuantity'),
      field: 'demandQty',
      width: 200,
    },
  ];
}
