/** 工程开发 - PCC制作 */
import { useI18n } from '/@/hooks/web/useI18n';
import { getReportDetailList } from '/@/api/business/PMTData';
import { ENABLE_OPTIONS } from '/@/views/engineering/PCCBeta/PCCReview/config';

export { schemas } from '../component/config';

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
    // 需求单号
    {
      title: t('dict.QuotationColumn.qrApplyCode'),
      field: 'OriginCode',
      i18nField: 'originCode',
      width: 200,
    },
    {
      title: '需求类型',
      field: 'ReviewDemandType',
      i18nField: 'CommonCol.demandTypeName',
      width: 120,
    },
    {
      title: '资料类型',
      field: 'DocType',
      i18nField: 'docType',
      width: 120,
    },
    {
      title: '产品内部料号',
      field: 'InsidePartNumber',
      i18nField: 'insidePartNumber',
      width: 200,
      merge: true,
    },
    {
      title: '版本',
      field: 'Version',
      i18nField: 'version',
      formatter: ({ row }) => {
        return `T${row.Version}`;
      },
      width: 80,
    },
    {
      title: '是否启用',
      field: 'Enable',
      width: 100,
      i18nField: 'CommonCol.isEnable',
      cellRender: {
        name: 'Tag',
        options: ENABLE_OPTIONS,
      },
    },
    {
      title: 'PD',
      field: 'CreatorUserName',
      i18nField: 'creatorUserName',
      width: 200,
    },
    {
      title: 'PD Leader',
      field: 'PdLeaderName',
      i18nField: 'pdLeaderName',
      width: 200,
    },
    {
      title: '直接客户名称',
      field: 'CustomerName',
      i18nField: 'CommonCol.immediateCustomerName',
      width: 200,
    },
    {
      title: '直接客户料号',
      field: 'ImmediateCustomerPartNumber',
      i18nField: 'immediateCustomerPartNumber',
      width: 200,
    },
    {
      title: '产品描述',
      field: 'ProductDesc',
      i18nField: 'productDesc',
      width: 200,
    },
    {
      title: '终端客户料号',
      field: 'TerminalCustomerPartNumber',
      i18nField: 'terminalCustomerPartNumber',
      width: 200,
    },
    {
      title: '工厂',
      field: 'FactoryName',
      i18nField: 'CommonCol.factory',
      width: 200,
    },
    {
      title: '脱敏图纸',
      field: 'DesensitizedDrawingsName',
      i18nField: 'CommonCol.desensitizedDrawingsName',
      width: 200,
      slots: {
        default: 'desensitizationDrawing',
      },
    },
    {
      title: 'PDF',
      field: 'PdfFileName',
      width: 200,
      slots: {
        default: 'PDF',
      },
    },
  ];
}
