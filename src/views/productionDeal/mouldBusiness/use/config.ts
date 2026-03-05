import { getFactory } from '/@/api/engineering/newMateria';
import { getFlowStatus } from '/@/components/CustomComponents/src/warehouse/Constant';
import { getMoldLedgerList } from '/@/api/warehouse/moIdBill';
import { useBaseStore } from '/@/store/modules/base';

export const schemaList = [
  {
    fieldName: 'insidePartNumber',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '产品内部料号',
    },
  },
  {
    fieldName: 'moldVersion',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '模具版本',
      api: getMoldLedgerList,
      showSearch: true,
      params: {
        type: 1,
        page: 20,
      },
      apiSearch: {
        show: false,
      },
      resultField: 'data',
      labelField: 'moldVersion',
      valueField: 'moldVersion',
    },
  },
  {
    fieldName: 'sapWorkOrder',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: 'SAP工单号',
    },
  },
  {
    fieldName: 'factory',
    i18nField: 'CommonCol.factory',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '工厂',
      api: getFactory,
      showSearch: true,
      apiSearch: {
        show: true,
        searchName: 'factoryCode',
      },
      resultField: 'data',
      valueField: 'Code',
      labelField: 'Name',
      immediate: true,
      nameFormat: ['Code', '/', 'Name'],
    },
  },
];

const handleCols = [
  {
    title: '状态',
    field: 'status',
    i18nField: 'CommonCol.status',
    width: 120,
    filters: [{ data: '' }],
    filterRender: {
      searchField: 'status',
      cSharpType: 'int',
      name: 'VxeSelect',
      options: getFlowStatus(),
    },
    cellRender: {
      name: 'Tag',
      options: getFlowStatus(),
    },
  },
  {
    title: '当前处理人',
    field: 'currentProcessorNames',
    width: 230,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
      // searchField:'currentProcessorIds',
      // name: 'CustomUserSelect',
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
];

// 通用表格配置
export const columns = () => {
  return [
    { type: 'checkbox', field: 'checkbox' },
    { title: '产品内部料号', field: 'insidePartNumber', width: 200, sortable: true },
    { title: '模具版本', field: 'moldVersion', sortable: true, width: 120 },
    { title: '计划数量', field: 'plannedQty', sortable: true, width: 100 },
    { title: '计划领用日期', field: 'plannedReceiveDate', sortable: true, cellRender: { name: 'Date', format: 'YYYY-MM-DD' }, width: 150 },
    { title: 'SAP工单号', field: 'sapWorkOrder', sortable: true, width: 120 },
    { title: '领料部门', field: 'receiveDeptName', sortable: true, width: 150 },
    { title: '工厂', field: 'factory', sortable: true },
    { title: '调出仓库', field: 'outShippingSpaceCode', sortable: true },
    { title: '事务类型', field: 'affairsType', sortable: true, width: 120 },
  ];
};
// 待处理
export const columnsToHandle = () => {
  const _cols: any = columns();
  _cols.splice(1, 0, {
    title: '物料需求单号',
    field: 'materialDemandNo',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 150,
  });
  return _cols;
};

// 待提交
export const columnsToSubmit = () => {
  // 调用columns函数，获取列的数组
  const _cols: any = columns();
  // 在数组的第二个位置插入一个对象，该对象包含物料需求单号、模具领用单号、模具序号等字段
  _cols.splice(
    1,
    0,
    {
      title: '物料需求单号',
      field: 'materialDemandNo',
      filters: [{ data: '' }],
      filterRender: {
        name: 'Input',
      },
      sortable: true,
      width: 150,
    },
    {
      title: '模具领用单号',
      field: 'moldReceiveApplyNo',
      sortable: true,
      slots: { default: 'moldReceiveApplyNo' },
      width: 150,
      aqpFilter: {
        enabled: true,
      },
    },
  );
  const colsList = [
    {
      title: '模具序号',
      field: 'moldNumber',
      sortable: true,
      width: 120,
    },
    {
      title: '数量',
      field: 'qty',
      width: 80,
    },
    {
      title: '楼列位置',
      field: 'workshopLocation',
      editRender: {
        name: 'Input',
      },
    },
    {
      title: '备注',
      field: 'remark',
      i18nField: 'CommonCol.remark',
      width: 120,
    },
  ];
  _cols.splice(5, 0, ...colsList);
  // 在倒数第三个位置，插入handleCols
  _cols.splice(3, 0, ...handleCols);
  return _cols.concat([{ title: '操作', field: 'action', width: 60, fixed: 'right', slots: { default: 'action' } }]);
};

// 已提交
export const columnsDone = () => {
  return [
    { type: 'checkbox', field: 'checkbox', width: 50 },
    { title: '模具领用单号', field: 'moldReceiveApplyNo', sortable: true, width: 120 },
    { title: '临时单号', field: 'temporaryOrder', width: 120 },
    ...handleCols,
    { title: '产品内部料号', field: 'insidePartNumber', width: 200, sortable: true },
    { title: '模具料号', field: 'moldPartNumber', sortable: true },
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
          filterOption: true,
          showSearch: true,
        },
      },
    },
    { title: '领料人', field: 'receiveMoldUserNames', minWidth: 350 },
    { title: '机台位', field: 'machinePosition', width: 120 },
    { title: '审核人', field: 'reviewUserNames', sortable: true },
    { title: '剩余寿命（KPCS）', field: 'remainingLife', aqpFilter: { cSharpType: 'int' } },
    {
      title: '剩余寿命百分比',
      field: 'remainingLifePercentage',
      formatter: ({ cellValue }) => `${cellValue * 100 || 0}%`,
      aqpFilter: { cSharpType: 'int' },
    },
    { title: 'SAP工单号', field: 'sapWorkOrder', sortable: true, width: 120 },
    { title: '工厂', field: 'factory', sortable: true },
    { title: '领料部门', field: 'receiveDeptName', sortable: true },
    { title: '事务类型', field: 'affairsType', sortable: true, width: 120 },
    { title: '仓管员', field: 'warehouseKeeperNames', sortable: true },
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
      width: 80,
    },
    {
      title: '数量',
      field: 'qty',
      width: 80,
      aqpFilter: { cSharpType: 'int' },
    },
    { title: '计划领用日期', field: 'plannedReceiveDate', sortable: true, cellRender: { name: 'Date', format: 'YYYY-MM-DD' }, width: 150 },
    { title: '实际领用时间', field: 'actualReceiveDate', sortable: true, cellRender: { name: 'Date' }, width: 120 },
    { title: '领用原因', field: 'receiveReason', sortable: true, width: 120 },
    { title: '领退状态', field: 'rrStatusName', sortable: true, width: 120 },
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
      sortable: true,
    },
    {
      title: '创建时间',
      field: 'applyDate',
      filters: [{ data: '' }],
      filterRender: {
        name: 'Input',
      },
      cellRender: {
        name: 'Date',
      },
    },
    { title: '物料凭证', field: 'materialVoucher', sortable: true, width: 120 },
  ];
};

export const printColumn = [
  { title: '模具领用单号', field: 'moldReceiveApplyNo', width: 120 },
  { title: '模具料号', field: 'moldPartNumber', width: 120 },
  { title: '模具类型', field: 'moldType', width: 100 },
  {
    title: '单位',
    field: 'unit',
    width: 80,
  },
  {
    title: '数量',
    field: 'qty',
    width: 80,
  },
  // { title: '货架号', field: 'goodsShelvesNumber' },
  // { title: '本次使用寿命(KPCS)', field: 'expectedLife' },
  { title: '调入仓库', field: 'callShippingSpaceCode' },
  { title: '调出仓库', field: 'outShippingSpaceCode' },
  { title: '单据类型', field: 'moldReceiveApplyType', width: 120 },
];
