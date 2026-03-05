/** 关务 - 备案 */
import { useI18n } from '/@/hooks/web/useI18n';
import { getAffairsdetail } from '/@/api/business/PMTData';

export { schemas } from '../component/config';

export const api = getAffairsdetail;

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
    // 来源单号
    {
      title: t('dict.CAApplyColumn.sourceNo'),
      field: 'sourceNo',
      width: 100,
    },
    // 备案需求单号
    {
      title: t('dict.CAApplyColumn.filingsApplyNo'),
      field: 'filingsApplyNo',
      width: 120,
    },
    // 工厂
    {
      title: t('dict.CAApplyColumn.factory'),
      field: 'factoryName',
      width: 200,
    },
    // 内部项目代码
    {
      title: t('dict.CommonCol.insideProjectCode'),
      field: 'insideProjectCode',
      width: 200,
      merge: true,
    },
    // 旧版产品内部料号
    {
      title: t('dict.CommonCol.insidePartNumberOld'),
      field: 'insidePartNumberOld',
      width: 200,
    },
    // 产品线
    {
      title: t('dict.CommonCol.productLine'),
      field: 'productLineName',
      width: 100,
    },
    // 终端项目代码
    {
      title: t('dict.CommonCol.terminalProjectCode'),
      field: 'terminalCustomerProjectCode',
      width: 100,
    },
    // 终端客户料号
    {
      title: t('dict.CommonCol.terminalCustomerPartNumber'),
      field: 'terminalCustomerPartNumber',
      width: 100,
    },
    // 终端客户代码
    {
      title: t('dict.SampleApplyColumn.terminalCustomerCode'),
      field: 'terminalCustomerCode',
      width: 100,
    },
    // 终端客户全称
    {
      title: t('dict.TerminalCustomerColumn.terminalCustomerFullName'),
      field: 'terminalCustomerName',
      width: 100,
    },
    // 直接客户代码
    {
      title: t('dict.CommonCol.immediateCustomerCode'),
      field: 'immediateCustomerCode',
      width: 100,
    },
    // 直接客户简称
    {
      title: t('dict.CAApplyColumn.immediateCustomerName'),
      field: 'immediateCustomerName',
      width: 100,
    },
    // 直接客户料号
    {
      title: t('dict.CAApplyColumn.immediateCustomerPartNumber'),
      field: 'immediateCustomerPartNumber',
      width: 100,
    },
    // 客服名称
    {
      title: t('dict.CAApplyColumn.customersName'),
      field: 'customsName',
      width: 100,
    },
    // 关务
    {
      title: t('dict.CAApplyColumn.customsPersonName'),
      field: 'customsPersonName',
      width: 100,
    },
    // 状态
    // {
    //   title: t('dict.CAApplyColumn.status'),
    //   field: 'status',
    //   width: 100,
    // }
  ];
}
