import { getFlowStatus } from '/@/components/CustomComponents/src/warehouse/Constant';
import { schemaList } from '/@/views/productionDeal/mouldBusiness/use/config';
import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
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

export const columns = [
  { type: 'checkbox', field: 'checkbox' },
  { title: '模具领用单号', field: 'moldReceiveApplyNo' },
  {
    title: '状态',
    field: 'status',
    i18nField: 'CommonCol.status',
    width: 100,
    cellRender: {
      name: 'Tag',
      cSharpType: 'int',
      options: getFlowStatus('status'),
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
  { title: '模具料号', field: 'moldPartNumber' },
  {
    title: '模具状态',
    field: 'moldStatusName',
    sortable: true,
    aqpFilter: {
      name: 'ApiSelect',
      cSharpType: 'int',
      searchField: 'moldStatus',
      props: {
        api: () => useBaseStore().getDictionaryData('MoldLedgerStatusEnum'),
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: true,
      },
    },
  },
  { title: '货架号', field: 'goodsShelvesNumber', sortable: true },
  { title: 'SAP工单号', field: 'sapWorkOrder', sortable: true },
  { title: '领料人', field: 'receiveMoldUserNames', minWidth: 350 },
  { title: '机台位', field: 'machinePosition' },
  { title: '审核人', field: 'reviewUserNames', sortable: true },
  { title: '剩余寿命(KPCS)', field: 'remainingLife', aqpFilter: { cSharpType: 'int' } },
  { title: '剩余寿命百分比', field: 'remainingLifePercentage', formatter: ({ cellValue }) => `${cellValue * 100 || 0}%`, aqpFilter: { cSharpType: 'int' } },
  { title: '工厂', field: 'factory', sortable: true },
  { title: '仓管员', field: 'warehouseKeeperNames', sortable: true },
  { title: '事务类型', field: 'affairsType', sortable: true },
  { title: '物料需求单号', field: 'materialDemandNo', sortable: true },
  { title: '调出仓库', field: 'outShippingSpaceCode', sortable: true },
  { title: '调入仓库', field: 'callShippingSpaceCode', sortable: true },
  {
    title: '楼列位置',
    field: 'workshopLocation',
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '单位',
    field: 'unit',
  },
  {
    title: '数量',
    field: 'qty',
    aqpFilter: { cSharpType: 'int' },
  },
  { title: '计划领用日期', field: 'plannedReceiveDate', sortable: true, cellRender: { name: 'Date' } },
  { title: '实际领用时间', field: 'actualReceiveDate', sortable: true, cellRender: { name: 'Date' } },
  { title: '领用原因', field: 'receiveReason', sortable: true },
  { title: '领退状态', field: 'rrStatusName', sortable: true },
  { title: '计划数量', field: 'plannedQty', sortable: true, aqpFilter: { cSharpType: 'int' } },
  {
    title: '备注',
    field: 'remark',
    i18nField: 'CommonCol.remark',
    width: 120,
  },
  {
    title: '制单人',
    field: 'applyUserName',
    width: 230,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '创建时间',
    field: 'applyDate',
    filters: [{ data: '' }],
    filterRender: {
      name: 'DatePicker',
      props: {
        valueFormat: 'YYYY-MM-DD',
      },
    },
    cellRender: {
      name: 'Date',
    },
  },
  { title: '物料凭证', field: 'materialVoucher', sortable: true },
];

export const agreeColumn = [
  { title: '模具领用单号', field: 'moldReceiveApplyNo' },
  { title: '模具料号', field: 'moldPartNumber' },
  { title: '模具类型', field: 'moldTypeName' },
];

export const printColumn = [
  { title: '模具领用单号', field: 'moldReceiveApplyNo' },
  { title: '模具料号', field: 'moldPartNumber' },
  { title: '模具类型', field: 'moldTypeName' },
  {
    title: '单位',
    field: 'unit',
  },
  {
    title: '数量',
    field: 'qty',
  },
  { title: '货架号', field: 'goodsShelvesNumber' },
  { title: '本次使用寿命(KPCS)', field: 'expectedLife' },
  { title: '调入仓库', field: 'callShippingSpaceCode' },
  { title: '调出仓库', field: 'outShippingSpaceCode' },
];
