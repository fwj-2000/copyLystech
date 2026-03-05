import { getStatus } from '/@/components/CustomComponents/src/material/Constant';
import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
const { t } = useI18n();

export const columns = [
  { type: 'checkbox', field: 'checkbox' },
  { title: '模具领用单号', field: 'moldReceiveApplyNo', width: 150 },
  {
    title: '状态',
    field: 'reviewStatus',
    i18nField: 'CommonCol.status',
    width: 100,
    cellRender: {
      name: 'Tag',
      options: getStatus('handleStatusDesc'),
    },
  },
  {
    title: '当前处理人',
    field: 'currentProcessorNames',
    width: 230,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  { title: '当前节点', field: 'currentNodeName' },
  {
    title: '节点记录',
    field: 'nodeDetail',
    width: 120,
    slots: {
      default: 'nodeDetail',
    },
  },
  { title: '产品内部料号', field: 'insidePartNumber', width: 200 },
  { title: '模具类型', field: 'moldTypeName', sortable: true, width: 100 },
  {
    title: '模具状态',
    field: 'moldStatusName',
    sortable: true,
    width: 100,
    aqpFilter: {
      name: 'ApiSelect',
      cSharpType: 'int',
      searchField: 'moldStatus',
      props: {
        api: () => useBaseStore().getDictionaryData('MoldLedgerStatusEnum'),
        resultField: '',
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: false,
      },
    },
  },
  { title: '模具料号', field: 'moldPartNumber', width: 150 },
  { title: '数量', field: 'qty', width: 80, aqpFilter: { cSharpType: 'int' } },
  { title: '申领原因', field: 'receiveReason', width: 150 },
  { title: '计划领用日期', field: 'plannedReceiveDate', sortable: true, cellRender: { name: 'Date', format: 'YYYY-MM-DD' }, width: 150 },
  { title: 'SAP工单号', field: 'sapWorkOrder', sortable: true, width: 120 },
  { title: '领料部门', field: 'receiveDeptName', sortable: true },
  { title: '工厂', field: 'factory', sortable: true, width: 100 },
  { title: '调出仓库', field: 'outShippingSpaceCode', sortable: true, width: 150 },
  {
    title: '楼列位置',
    field: 'workshopLocation',
    editRender: {
      name: 'Input',
    },
    width: 120,
  },
  { title: '事务类型', field: 'affairsType', sortable: true, width: 150 },
  { title: '仓管员', field: 'warehouseKeeperNames', sortable: true },
  { title: '物料需求单号', field: 'materialDemandNo', sortable: true },
  { title: '实际领用时间', field: 'actualReceiveDate', sortable: true, cellRender: { name: 'Date' }, width: 120 },
  { title: '领退状态', field: 'rrStatusName', sortable: true, width: 100 },
  { title: '物料凭证', field: 'materialVoucher', sortable: true, width: 100 },
  // { title: '计划数量', field: 'plannedQty', sortable: true, width: 100 },
  { title: '审核人', field: 'reviewUserNames', sortable: true },
  { title: '审核时间', field: 'reviewDate', sortable: true, cellRender: { name: 'Date' }, width: 120 },
  {
    title: '备注',
    field: 'remark',
    i18nField: 'CommonCol.remark',
    width: 120,
  },
  {
    title: '制单人',
    field: 'applyUserName',
    width: 180,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '创建时间',
    field: 'applyDate',
    width: 120,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    cellRender: {
      name: 'Date',
    },
  },
];

export const agreeColumn = [
  { title: '模具领用单号', field: 'moldReceiveApplyNo' },
  { title: '模具料号', field: 'moldPartNumber' },
  { title: '模具类型', field: 'moldTypeName' },
];
