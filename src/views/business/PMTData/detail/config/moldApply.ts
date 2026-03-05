/** 材料/模具请购 - 模具完成率 */
import { useI18n } from '/@/hooks/web/useI18n';
import { h } from 'vue';
import { getReportDetailList } from '/@/api/business/PMTData';

export { schemas } from '../component/config';

export const api = getReportDetailList;

const { t } = useI18n();

export const URGENTLEVEL_STATUS_COLOR_MAP = {
  0: { color: '#000000' },
  1: { color: '#000000' },
  2: { color: '#FAAD14' },
  3: { color: '#FF4D4F' },
};

export const P_STATUS_OPTIONS = [
  { id: 0, theme: 'gray', color: '#999999', fullName: '待处理', rowKey: 'purchaseStatusName' },
  { id: 1, theme: 'green', color: '#52C41A', fullName: '已处理', rowKey: 'purchaseStatusName' },
  { id: 2, theme: 'purple', color: '#DA5BFB', fullName: '撤回', rowKey: 'purchaseStatusName' },
  { id: 3, theme: 'blue', color: '#1890FF', fullName: '比价中', rowKey: 'purchaseStatusName' },
];

export function getColumns(): Array<any> {
  return [
    {
      field: 'seq',
      title: t('component.table.index'),
      type: 'seq',
      width: '50',
      align: 'center',
    },
    // 父级项（合并）
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      width: 200,
      merge: true,
    },
    {
      title: '模具图纸',
      field: 'moldDrawingsName',
      width: 200,
      slots: {
        default: 'moldDrawingsName',
      },
    },
    {
      title: '工厂',
      field: 'factoryName',
      width: 200,
    },
    {
      title: '申请人',
      field: 'applyUserName',
      width: 200,
    },
    {
      title: '申请时间',
      field: 'applyDate',
      width: 200,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD hh:mm',
      },
    },
    {
      title: '模具采购',
      field: 'moldPurchaseName',
      width: 200,
    },
    {
      title: '脱敏图纸',
      field: 'drawingshistory',
      width: 200,
      slots: {
        default: 'drawingsHistory',
      },
    },
    // 子级项
    {
      title: '模具编号',
      field: 'moldNo',
      width: 200,
    },
    // {
    //   title: 'PO单号',
    //   field: 'poNo',
    //   width: 200,
    // },
    // {
    //   title: '收货厂址',
    //   field: 'deliveryAddress',
    //   width: 200,
    // },
    // {
    //   title: '供应商',
    //   field: 'supplier',
    //   width: 200,
    // },
    // {
    //   title: '联系人',
    //   field: 'designatedEngReviewerName',
    //   width: 200,
    // },
    // {
    //   title: '状态',
    //   field: 'statusName',
    //   width: 200,
    //   cellRender: {
    //     name: 'Tag',
    //     options: P_STATUS_OPTIONS,
    //   },
    // },
    // {
    //   title: '模具类型',
    //   field: 'moldTypeName',
    //   width: 200,
    // },
    {
      title: '模具备注',
      field: 'moldRemark',
      width: 200,
    },
    {
      title: '紧急程度',
      field: 'urgentLevelName',
      width: 200,
      slots: {
        default: ({ row }) => {
          const _color = URGENTLEVEL_STATUS_COLOR_MAP[row.urgentLevel].color;
          return h('span', { style: { color: _color } }, row.urgentLevelName);
        },
      },
      aqpFilter: { cSharpType: 'int' },
    },
    {
      title: '预估寿命(K)',
      field: 'estimateLifespan',
      width: 200,
      aqpFilter: { cSharpType: 'int' },
    },
    {
      title: '模具用途',
      field: 'moldUseName',
      width: 200,
    },
    {
      title: '费用归属',
      field: 'costAttribution',
      width: 200,
    },
    // {
    //   title: '要求交期',
    //   field: 'requireDeliveryTime',
    //   width: 200,
    //   cellRender: {
    //     name: 'Date',
    //     format: 'YYYY-MM-DD',
    //   },
    // },
    // {
    //   title: '交期回复',
    //   field: 'replyDeliveryTime',
    //   width: 200,
    //   cellRender: {
    //     name: 'Date',
    //     format: 'YYYY-MM-DD',
    //   },
    // },
    // {
    //   title: '当前处理人',
    //   field: 'currentProcessorName',
    //   width: 200,
    // },
    // {
    //   title: '当前节点',
    //   field: 'currentNodeName',
    //   width: 200,
    // },
    // {
    //   title: '节点记录',
    //   field: 'nodeRecord',
    //   width: 200,
    //   slots: {
    //     default: 'NodeRecord',
    //   },
    // },
    // {
    //   title: '处理时间',
    //   field: 'currentProcessorDate',
    //   width: 200,
    //   cellRender: {
    //     name: 'Date',
    //     format: 'YYYY-MM-DD',
    //   },
    // },
  ];
}
