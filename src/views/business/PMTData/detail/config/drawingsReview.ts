/** 工程开发 - 读图 */
import { useI18n } from '/@/hooks/web/useI18n';
import dayjs from 'dayjs';
import { STATUS_OPTIONS } from '/@/utils/status/index';
import { getReportDetailList } from '/@/api/business/PMTData';
import { h } from 'vue';
import { state } from '../utils';

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
      width: 160,
    },
    {
      title: '来源类型',
      field: 'demandType',
      width: 120,
      i18nField: 'demandTypeName',
      formatter: ({ cellValue, row }) => row.demandTypeName || cellValue || '',
    },
    {
      title: '状态',
      field: 'status',
      width: 150,
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
    //   sortable: true,
    //   slots: { default: 'nodeDetail' },
    // },
    {
      title: 'PD',
      field: 'pdName',
      width: 220,
    },
    {
      title: '当前处理人',
      field: 'handlerName',
      width: 220,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      formatter: ({ row, cellValue }) => {
        if (row.status == 3) {
          return '/';
        } else {
          return cellValue;
        }
      },
    },
    {
      title: '评审结束时间',
      field: 'reviewDate',
      width: 200,
      formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : '/'),
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
      slots: { default: 'desensitizationDrawing' },
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
