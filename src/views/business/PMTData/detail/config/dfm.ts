/** 工程开发 - DFM制作 */
import { useI18n } from '/@/hooks/web/useI18n';
import { STATUS_OPTIONS } from '/@/utils/status/index';
import { getReportDetailList } from '/@/api/business/PMTData';
import { state } from '../utils';
import { h } from 'vue';

import { Tag } from 'ant-design-vue';

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
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      width: 200,
      merge: true,
    },
    {
      title: '来源单号',
      field: 'originCode',
      width: 180,
    },
    {
      title: '来源类型',
      field: 'demandType',
      i18nField: 'demandTypeName',
      width: 120,
      formatter: ({ cellValue, row }) => row.demandTypeName || cellValue || '',
    },
    {
      title: '状态',
      field: 'status',
      width: 120,
      cellRender: {
        name: 'Tag',
        options: STATUS_OPTIONS,
      },
    },
    // {
    //   title: '当前节点',
    //   field: 'reviewNodeName',
    //   width: 160,
    // },
    // {
    //   title: '节点记录',
    //   field: 'nodeDetail',
    //   width: 160,
    //   sorter: true,
    //   slots: {
    //     default: 'nodeDetail',
    //   },
    // },
    {
      title: '评审结束时间',
      field: 'reviewDate',
      width: 200,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      title: 'DFM',
      field: 'dfm',
      width: 80,
      slots: {
        default: ({ row }) => h(Tag, {}, state.DFMList.find(item => item.enCode == row.dfm)?.fullName),
      },
    },
    {
      title: '工程资料制作',
      field: 'makeEngineeringInfo',
      width: 120,
      slots: {
        default: ({ row }) => h(Tag, {}, state.MakeEngineeringInfoList.find(item => item.enCode == row.makeEngineeringInfo)?.fullName),
      },
    },
    {
      title: '评审结论',
      field: 'reviewResult',
      width: 80,
      slots: {
        default: ({ row }) => h(Tag, {}, state.reviewResultList.find(item => item.enCode == row.reviewResult)?.fullName),
      },
    },
    {
      title: '脱敏图纸',
      field: 'desensitizedDrawingsName',
      width: 260,
      slots: {
        default: 'desensitizationDrawing',
      },
    },
    {
      title: '当前处理人',
      field: 'handlerName',
      width: 200,
    },
    {
      title: '申请人',
      field: 'applyUserName',
      width: 200,
    },
    {
      title: '内部项目代码',
      field: 'insideProjectCode',
      width: 200,
    },
    {
      title: '终端客户料号',
      field: 'terminalCustomerPartNumber',
      width: 200,
    },
    {
      title: '产品描述',
      field: 'productDesc',
      width: 200,
    },
    {
      title: '工厂',
      field: 'factoryName',
      i18nField: 'factory',
      width: 200,
    },
    {
      title: '备注',
      field: 'remark',
      width: 200,
    },
  ];
}
