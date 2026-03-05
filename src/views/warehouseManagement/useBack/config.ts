import { getFlowStatus } from '/@/components/CustomComponents/src/warehouse/Constant';
import { schemaList } from '/@/views/productionDeal/mouldBusiness/use/config';
import { useI18n } from '/@/hooks/web/useI18n';
import { cloneDeep } from 'lodash-es';
const { t } = useI18n();
export const schemaLists = [
  ...schemaList,
  {
    fieldName: 'status',
    label: '',
    component: 'Select',
    componentProps: {
      placeholder: '状态',
      options: getFlowStatus(),
    },
  },
];
const useColumns = [
  { title: '实际领用时间', field: 'actualReceiveDateTime', sortable: true, cellRender: { name: 'Date' }, width: 120 },
  { title: '领料人', field: 'receiveMoldUserNames', width: 200 },
  { title: '领料部门', field: 'receiveDeptName', sortable: true, width: 120 },
  { title: '确认发放仓管员', field: 'confirmGrantUserName', sortable: true, width: 150 },
  { title: '确认发放日期', field: 'confirmGrantDate', sortable: true, width: 120 },
  { title: '模具领用单号', field: 'moldReceiveApplyNo', sortable: true, width: 120 },
  {
    title: '楼列位置',
    field: 'workshopLocation',
    editRender: {
      name: 'Input',
    },
    width: 120,
  },
  {
    title: '备注',
    field: 'remark',
    i18nField: 'CommonCol.remark',
    width: 120,
  },
];
const backColumns = [
  { title: '退模单号', field: 'moldRefundApplyNo', sortable: true, width: 120 },
  { title: '退料人', field: 'refundMoldUserNames', sortable: true, width: 150 },
  { title: '实际退回时间', field: 'confirmReturnDate', sortable: true, width: 120, cellRender: { name: 'Date' } },
  { title: '本次使用寿命(KPCS)', field: 'thisUseLife', sortable: true, width: 150, aqpFilter: { cSharpType: 'int' } },
  { title: '确认归还仓管员', field: 'confirmReturnUserName', sortable: true, width: 150 },
];

export const commonColumns = [
  { type: 'checkbox', field: 'checkbox' },
  {
    title: '状态',
    field: 'statusEnum',
    i18nField: 'CommonCol.status',
    width: 100,
    cellRender: {
      name: 'Tag',
      cSharpType: 'int',
      searchField: 'status',
      options: getFlowStatus(),
    },
  },
  { title: '领退状态', field: 'receiveRefundStatus', sortable: true, width: 120, aqpFilter: { cSharpType: 'int', searchField: 'receiveRefundStatusEnum' } },
  { title: '模具料号', field: 'moldPartNumber', sortable: true, width: 120 },
  { title: '货架号', field: 'goodsShelvesNumber', sortable: true, width: 120 },
  { title: '工厂', field: 'factory', sortable: true, width: 120 },
  // { title: '备注', field: 'remarks', sortable: true },
  {
    title: '当前处理人',
    field: 'currentProcessorNames',
    width: 180,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  { title: '当前节点', field: 'currentNodeName', width: 120 },
  {
    title: '节点记录',
    field: 'nodeDetail',
    width: 120,
    slots: {
      default: 'nodeDetail',
    },
  },
];

// 待领用的表头
export const toUseColumns = () => {
  const _columns = cloneDeep(commonColumns);
  _columns.splice(3, 0, ...useColumns);
  return _columns;
};
// 待退还的表头
export const toBackColumns = () => {
  const _columns = cloneDeep(commonColumns);
  const insertColumns = cloneDeep(useColumns.concat(backColumns));
  _columns.splice(3, 0, ...insertColumns);
  return _columns;
};
export const agreeColumn = [
  { title: '模具料号', field: 'moldPartNumber', sortable: true },
  { title: '货架号', field: 'goodsShelvesNumber', sortable: true },
  { title: '模具类型', field: 'moldTypeName' },
];
