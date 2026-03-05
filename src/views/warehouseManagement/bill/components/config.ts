import type { VxeGridPropTypes } from '/@/components/VxeTable';
import { useI18n } from '/@/hooks/web/useI18n';
import { getSupplierlist } from '/@/api/engineering/mould';
import { getFactoryList } from '/@/api/business/shippingspace';
import { getShipList } from '/@/api/common/basedata';
import { TABSKEY, TabOption } from '../type';
import { updateMoldInfo, moldToArchive, moldToScrap, moldToStock, moldToTakeDelivery } from '/@/api/warehouse/moIdBill';
import { IS_YSE_LIST } from '/@/components/CustomComponents/src/Constant';
import { useBaseStore } from '/@/store/modules/base';
import { getMoldpurposelist } from '/@/api/engineering/costCenter';
const { t } = useI18n();
const baseStore = useBaseStore();

/**
 * 清单页 - 表单配置（待处理）
 */
export function getFormConfig() {
  return [
    {
      fieldName: 'moldPartNumber',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '模具料号',
        allowClear: true,
      },
    },
    {
      fieldName: 'factory',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '工厂',
        allowClear: true,
        api: getFactoryList,
        resultField: 'data',
        labelField: 'Name',
        valueField: 'Code',
        nameFormat: ['Code', '/', 'Name'],
      },
    },
    {
      fieldName: 'manufacturer',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '厂商',
        allowClear: true,
      },
    },
    {
      fieldName: 'status',
      label: '',
      component: 'ApiSelect',
      i18nField: 'CommonCol.status',
      componentProps: {
        placeholder: '模具状态',
        allowClear: true,
        api: () => baseStore.getDictionaryData('MoldLedgerStatusEnum'),
        resultField: '',
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: false,
        filterOption: false,
      },
    },
  ];
}

export const importColumns = [
  { title: '工厂', field: 'factory' },
  { title: '模具料号', field: 'moldPartNumber', width: 150 },
  { title: '模具类型', field: 'moldTypeName', width: 100 },
  { title: '模具状态', field: 'statusName', width: 100 },
  { title: '当前仓位', field: 'shippingSpaceCode' },
  { title: '货架号', field: 'goodsShelvesNumber' },
  { title: '开模PD', field: 'moldOpeningPdName' },
  { title: '数量', field: 'existStockQty', width: 100 },
  { title: '预估寿命(KPCS)', field: 'expectedLife', width: 120 },
  { title: '维修PD/ME', field: 'repairPdMeUserName' },
  { title: '已使用寿命(KPCS)', field: 'usedAlreadyLife', width: 120 },
  { title: '备注1', field: 'remarksOne' },
  { title: '备注2', field: 'remarksTwo' },
  { title: '备注3', field: 'remarksThree' },
  { title: '备注4', field: 'remarksFour' },
  { title: '备注5', field: 'remarksFive' },
];

// 台账汇总表
export const billColumnsSummary = [
  { type: 'checkbox', field: 'checkbox' },
  { title: '工厂', field: 'factory' },
  {
    title: '首次入库时间',
    field: 'storeDate',
    cellRender: { name: 'Date' },
    width: 120,
    filters: [{ data: '' }],
    filterRender: { name: 'DatePicker' },
  },
  { title: '模具料号', field: 'moldPartNumber', width: 150 },
  { title: '货架号', field: 'goodsShelvesNumber', width: 120, filters: [{ data: '' }], filterRender: { name: 'Input' } },
  { title: '模具状态', field: 'statusName', width: 100, aqpFilter: { cSharpType: 'int', searchField: 'status' } },
  {
    title: '模具类型',
    field: 'moldTypeName',
    width: 100,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      searchField: 'moldType',
      props: {
        api: () => baseStore.getDictionaryData('MoldApply.MoldType'),
        resultField: '',
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: false,
        filterOption: false,
      },
    },
  },
  { title: '厂商', field: 'manufacturer' },
  { title: '产品内部料号', field: 'insidePartNumber', filters: [{ data: '' }], filterRender: { name: 'Input' } },
  { title: '旧版成品编码', field: 'insidePartNumberOld', width: 180, filters: [{ data: '' }], filterRender: { name: 'Input' } },
  { title: '开模PD', field: 'moldOpeningPdName', filters: [{ data: '' }], filterRender: { name: 'CustomUserSelect', searchField: 'moldOpeningPdId' } },
  { title: '模具备注', field: 'moldRemarks', filters: [{ data: '' }], filterRender: { name: 'Input' } },
  { title: '预估寿命(KPCS)', field: 'expectedLife', width: 130, filters: [{ data: '' }], filterRender: { name: 'Input', cSharpType: 'int' } },
  { title: '已使用寿命(KPCS)', field: 'usedAlreadyLife', width: 140, filters: [{ data: '' }], filterRender: { name: 'Input', cSharpType: 'int' } },
  { title: '剩余寿命(KPCS)', field: 'remainingLife', width: 130, filters: [{ data: '' }], filterRender: { name: 'Input', cSharpType: 'int' } },
  { title: '在库时长(天)', field: 'storeDay', width: 130, filters: [{ data: '' }], filterRender: { name: 'Input', cSharpType: 'int' } },
  { title: '距今一年内被领用次数', field: 'oneYearReceiveNum', filters: [{ data: '' }], filterRender: { name: 'Input', cSharpType: 'int' } },
  { title: '距今三年内被领用次数', field: 'threeYearReceiveNum', filters: [{ data: '' }], filterRender: { name: 'Input', cSharpType: 'int' } },
  { title: '距今五年内被领用次数', field: 'fiveYearReceiveNum', filters: [{ data: '' }], filterRender: { name: 'Input', cSharpType: 'int' } },
  { title: '模具申请时间', field: 'applyDate', cellRender: { name: 'Date' } },
  { title: '模具申请单号', field: 'moldApplyNo', filters: [{ data: '' }], filterRender: { name: 'Input' } },
  { title: '模具图纸', field: 'moldDrawing', slots: { default: 'moldDrawing' } },
  { title: '维修PD/ME', field: 'repairPdMeUserName', filters: [{ data: '' }], filterRender: { name: 'CustomUserSelect', searchField: 'repairPdMeUserId' } },
  {
    title: '开模模具采购员',
    field: 'moldPurchaseUserName',
    filters: [{ data: '' }],
    filterRender: { name: 'CustomUserSelect', searchField: 'moldPurchaseUserId' },
  },
  {
    title: '维修模具采购员',
    field: 'repairPurchaseUserName',
    filters: [{ data: '' }],
    filterRender: { name: 'CustomUserSelect', searchField: 'repairPurchaseUserId' },
  },
  {
    title: '模具用途',
    field: 'moldPurposeName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      searchField: 'moldPurpose',
      props: {
        api: getMoldpurposelist,
        afterFetch: (res: any) => {
          console.log('模具用途数据', res);
        },
        resultField: 'data',
        valueField: 'id',
        labelField: 'moldPurpose',
        filterOption: false,
        immediate: true,
      },
    },
  },
  {
    title: '紧急程度',
    field: 'urgentLevelName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      searchField: 'urgentLevel',
      cSharpType: 'int',
      props: {
        api: () => baseStore.getDictionaryData('QuotationRequirements.UrgencyLevel', true),
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: '',
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
    },
  },
  { title: '成本中心', field: 'costCenter', filters: [{ data: '' }], filterRender: { name: 'Input' } },
  { title: '费用归属', field: 'costAttribution', filters: [{ data: '' }], filterRender: { name: 'Input' } },
  { title: '要求交期', field: 'requestDeliveryDate', cellRender: { name: 'Date', format: 'YYYY-MM-DD' } },
  { title: '交期回复', field: 'deliveryDateReply' },
  { title: '模具采购单号', field: 'moldPurchaseNo' },
  { title: '模具采购申请时间', field: 'creatorTime', cellRender: { name: 'Date' }, filters: [{ data: '' }], filterRender: { name: 'DatePicker' } },
  { title: '检测结果', field: 'checkOutcomeName', filters: [{ data: '' }], filterRender: { name: 'Input', cSharpType: 'int' } },
  { title: '历史检测结果', field: '1' },
  { title: 'MRB结果', field: 'mrbOutcomeName', filters: [{ data: '' }], filterRender: { name: 'Input', cSharpType: 'int' } },
  { title: '数量', field: 'existStockQty', width: 100, filters: [{ data: '' }], filterRender: { name: 'Input', cSharpType: 'int' } },
  {
    title: '是否首模',
    field: 'isFirstMoldName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Select',
      options: IS_YSE_LIST,
      cSharpType: 'int',
    },
  },
  { title: '当前仓位', field: 'shippingSpaceCode', filters: [{ data: '' }], filterRender: { name: 'Input' } },
  { title: '当前仓库地址', field: 'shippingAddress' },
  { title: '领用记录', field: 'useRecord', slots: { default: 'useRecord' }, width: 120 },
  { title: '退回记录', field: 'returnRecord', slots: { default: 'returnRecord' }, width: 120 },
  { title: '维修记录', field: 'maintenanceRecord', slots: { default: 'maintenanceRecord' }, width: 120 },
  { title: '维修次数', field: 'maintenanceNum', filters: [{ data: '' }], filterRender: { name: 'Input', cSharpType: 'int' } },
  { title: '代维修供应商', field: 'maintenanceSupplierName', filters: [{ data: '' }], filterRender: { name: 'Input' } },
  { title: '最近一次领用人', field: 'receiveUserName', filters: [{ data: '' }], filterRender: { name: 'CustomUserSelect', searchField: 'receiveUser' } },
  { title: '最近一次退模人', field: 'refundUserName', filters: [{ data: '' }], filterRender: { name: 'CustomUserSelect', searchField: 'refundUser' } },
  { title: '继续保留时长(月)', field: 'continueRetainMonth' },
  { title: '继续保留截止日期', field: 'continueRetainEndDate', cellRender: { name: 'Date', format: 'YYYY-MM-DD' } },
  { title: '直接客户代码', field: 'immediateCustomerCode' },
  {
    title: '当前处理人',
    field: 'currentProcessorName',
    filters: [{ data: '' }],
    filterRender: { name: 'CustomUserSelect', searchField: 'currentProcessorId' },
  },
  { title: '项目阶段', field: 'projectPhaseName', filters: [{ data: '' }], filterRender: { name: 'Input' } },
  { title: '备注1', field: 'remarksOne' },
  { title: '备注2', field: 'remarksTwo' },
  { title: '备注3', field: 'remarksThree' },
  { title: '备注4', field: 'remarksFour' },
  { title: '备注5', field: 'remarksFive' },
  { title: '操作日志', field: 'actionLog', slots: { default: 'actionLog' }, width: 120 },
];
// 通用提取函数
export function extractColumnsFromSummary(summaryColumns, subTableFields, customConfigs = {}) {
  const summaryMap = summaryColumns.reduce((map, column) => {
    if (column.field) map[column.field] = column;
    return map;
  }, {});

  return subTableFields.map(field => {
    const baseConfig = summaryMap[field] || { field };
    const customConfig = customConfigs[field] || {};

    return {
      ...baseConfig,
      ...customConfig,
      field,
    };
  });
}

// ================= 子表配置 =================

// 1. 台账默认列
export const billColumns = extractColumnsFromSummary(billColumnsSummary, [
  'checkbox',
  'factory',
  'storeDate',
  'moldPartNumber',
  'statusName',
  'currentProcessorName',
  'shippingAddress',
  'insidePartNumber',
  'insidePartNumberOld',
  'moldOpeningPdName',
  'moldTypeName',
  'moldRemarks',
  'manufacturer',
  'usedAlreadyLife',
  'remainingLife',
  'costAttribution',
  'existStockQty',
  'shippingSpaceCode',
  'goodsShelvesNumber',
  'repairPdMeUserName',
  'maintenanceNum',
  'storeDay',
  'oneYearReceiveNum',
  'threeYearReceiveNum',
  'fiveYearReceiveNum',
  'useRecord',
  'returnRecord',
  'maintenanceRecord',
  'maintenanceSupplierName',
  'immediateCustomerCode',
  'projectPhaseName',
  'remarksOne',
  'remarksTwo',
  'remarksThree',
  'remarksFour',
  'remarksFive',
  'actionLog',
]);

// 2. 台账待处理
export const billColumnsTodo = extractColumnsFromSummary(billColumnsSummary, [
  'checkbox',
  'moldPurchaseNo',
  'factory',
  'moldPartNumber',
  'statusName',
  'currentProcessorName',
  'moldOpeningPdName',
  'moldTypeName',
  'manufacturer',
  'costAttribution',
  'existStockQty',
  'insidePartNumber',
  'insidePartNumberOld',
  'repairPdMeUserName',
  'usedAlreadyLife',
  'remainingLife',
  'immediateCustomerCode',
  'projectPhaseName',
  'remarksOne',
  'remarksTwo',
  'remarksThree',
  'remarksFour',
  'remarksFive',
  'actionLog',
]);

// 3. 台账待入库
export const billColumnsWait = extractColumnsFromSummary(billColumnsSummary, [
  'checkbox',
  'moldPurchaseNo',
  'factory',
  'moldPartNumber',
  'statusName',
  'currentProcessorName',
  'insidePartNumber',
  'insidePartNumberOld',
  'moldOpeningPdName',
  'moldTypeName',
  'manufacturer',
  'costAttribution',
  'existStockQty',
  'moldRemarks',
  'repairPdMeUserName',
  'immediateCustomerCode',
  'projectPhaseName',
  'remarksOne',
  'remarksTwo',
  'remarksThree',
  'remarksFour',
  'remarksFive',
  'actionLog',
]);

// 4. 台账在库
export const billColumnsIn = extractColumnsFromSummary(billColumnsSummary, [
  'checkbox',
  'storeDate',
  'factory',
  'moldPartNumber',
  'statusName',
  'goodsShelvesNumber',
  'insidePartNumber',
  'insidePartNumberOld',
  'currentProcessorName',
  'moldOpeningPdName',
  'moldTypeName',
  'manufacturer',
  'expectedLife',
  'usedAlreadyLife',
  'remainingLife',
  'existStockQty',
  'shippingSpaceCode',
  'moldRemarks',
  'repairPdMeUserName',
  'costAttribution',
  'storeDay',
  'oneYearReceiveNum',
  'threeYearReceiveNum',
  'fiveYearReceiveNum',
  'useRecord',
  'returnRecord',
  'maintenanceRecord',
  'maintenanceNum',
  'maintenanceSupplierName',
  'immediateCustomerCode',
  'projectPhaseName',
  'remarksOne',
  'remarksTwo',
  'remarksThree',
  'remarksFour',
  'remarksFive',
  'actionLog',
]);

// 5. 台账封存
export const billColumnsClose = extractColumnsFromSummary(billColumnsSummary, [
  'checkbox',
  'storeDate',
  'factory',
  'moldPartNumber',
  'statusName',
  'moldTypeName',
  'manufacturer',
  'shippingSpaceCode',
  'insidePartNumber',
  'insidePartNumberOld',
  'currentProcessorName',
  'goodsShelvesNumber',
  'moldRemarks',
  'expectedLife',
  'usedAlreadyLife',
  'remainingLife',
  'costAttribution',
  'existStockQty',
  'immediateCustomerCode',
  'projectPhaseName',
  'remarksOne',
  'remarksTwo',
  'remarksThree',
  'remarksFour',
  'remarksFive',
  'actionLog',
]);

// 6. 台账报废
export const billColumnsScrap = extractColumnsFromSummary(billColumnsSummary, [
  'checkbox',
  'storeDate',
  'factory',
  'moldPartNumber',
  'statusName',
  'moldTypeName',
  'manufacturer',
  'shippingSpaceCode',
  'insidePartNumber',
  'insidePartNumberOld',
  'currentProcessorName',
  'goodsShelvesNumber',
  'moldRemarks',
  'expectedLife',
  'usedAlreadyLife',
  'remainingLife',
  'costAttribution',
  'existStockQty',
  'continueRetainMonth',
  'continueRetainEndDate',
  'immediateCustomerCode',
  'projectPhaseName',
  'remarksOne',
  'remarksTwo',
  'remarksThree',
  'remarksFour',
  'remarksFive',
  'actionLog',
]);

// 7. 台账终止
export const billColumnsTerminate = extractColumnsFromSummary(billColumnsSummary, [
  'checkbox',
  'factory',
  'moldPartNumber',
  'insidePartNumber',
  'insidePartNumberOld',
  'statusName',
  'moldTypeName',
  'manufacturer',
  'currentProcessorName',
  'moldRemarks',
  'costAttribution',
  'existStockQty',
  'immediateCustomerCode',
  'projectPhaseName',
  'remarksOne',
  'remarksTwo',
  'remarksThree',
  'remarksFour',
  'remarksFive',
  'actionLog',
]);

// 8. 台账其他
export const billColumnsOther = extractColumnsFromSummary(billColumnsSummary, [
  'checkbox',
  'factory',
  'moldPartNumber',
  'statusName',
  'moldTypeName',
  'manufacturer',
  'shippingSpaceCode',
  'receiveUserName',
  'refundUserName',
  'maintenanceRecord',
  'maintenanceSupplierName',
  'maintenanceNum',
  'useRecord',
  'returnRecord',
  'currentProcessorName',
  'insidePartNumber',
  'insidePartNumberOld',
  'moldRemarks',
  'expectedLife',
  'usedAlreadyLife',
  'remainingLife',
  'costAttribution',
  'existStockQty',
  'immediateCustomerCode',
  'projectPhaseName',
  'remarksOne',
  'remarksTwo',
  'remarksThree',
  'remarksFour',
  'remarksFive',
  'actionLog',
]);

// 台账临时收货
export const billColumnsTemporary = [
  { type: 'checkbox', field: 'checkbox' },
  { title: '工厂', field: 'factory' },
  { title: '模具料号', field: 'moldPartNumber' },
  { title: '模具状态', field: 'statusName', width: 100 },
  { title: '模具类型', field: 'moldTypeName', width: 100 },
  { title: '厂商', field: 'manufacturer' },
  { title: '当前仓位', field: 'shippingSpaceCode' },
  { title: '收货处理人', field: 'receiverName' },
  { title: '产品内部料号', field: 'insidePartNumber' },
  { title: '检测报告', field: 'inspectionReport' },
  { title: '数量', field: 'existStockQty', width: 100 },
  { title: '模具备注', field: 'moldRemarks' },
  { title: '直接客户代码', field: 'immediateCustomerCode' },
  { title: '项目阶段', field: 'projectPhaseName' },
  { title: '备注1', field: 'remarksOne' },
  { title: '备注2', field: 'remarksTwo' },
  { title: '备注3', field: 'remarksThree' },
  { title: '备注4', field: 'remarksFour' },
  { title: '备注5', field: 'remarksFive' },
];

/**
 * @description tabs类型选项
 * @param {TABSKEY} key
 * */
export const tabsOptions: Record<TABSKEY, TabOption> = {
  '1': {
    key: '1',
    label: t('component.table.settingDensDefault'),
    columns: billColumns,
    id: 'default',
  },
  '2': {
    key: '2',
    label: t('common.toGet'),
    columns: billColumnsTodo,
    id: 'todo',
  },
  '3': {
    key: '3',
    label: t('common.toShip'),
    columns: billColumnsWait,
    id: 'toStore',
  },
  '4': {
    key: '4',
    label: t('dict.MoldLedgerStatusEnum.5'),
    columns: billColumnsIn,
    id: 'inStore',
  },
  '5': {
    key: '5',
    label: t('dict.MoldLedgerStatusEnum.14'),
    columns: billColumnsClose,
    id: 'close',
  },
  '6': {
    key: '6',
    label: t('dict.executionResult.6'),
    columns: billColumnsScrap,
    id: 'scrap',
  },
  '7': {
    key: '7',
    label: t('common.stopText'),
    columns: billColumnsTerminate,
    id: 'terminate',
  },
  '8': {
    key: '8',
    label: t('common.otherText'),
    columns: billColumnsOther,
    id: 'other',
  },
  '9': {
    key: '9',
    label: t('common.sum'),
    columns: billColumnsSummary,
    id: 'sum',
  },
  '10': {
    key: '10',
    label: t('dict.MoldLedgerStatusEnum.16'),
    columns: billColumnsTemporary,
    id: 'temp',
  },
};

/**
 * 修改代维修供应商
 */
export const modifySupplierColumns: VxeGridPropTypes.Columns = [
  {
    title: '模具料号',
    field: 'moldPartNumber',
    width: 200,
  },
  {
    title: '代维修供应商',
    field: 'maintenanceSupplierId',
    minWidth: 200,
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      // @ts-ignore
      cacheField: 'maintenanceSupplierName',
      props: {
        api: getSupplierlist,
        apiSearch: {
          show: true,
          keyword: 'supplierName',
        },
        labelField: 'name',
        valueField: 'code',
        showSearch: true,
        resultField: 'data',
        nameFormat: ['code', '/', 'name'],
        onChange: (value: string, _: any, { row }: any) => {
          if (!value) {
            row.maintenanceSupplierName = '';
          }
        },
      },
    },
  },
];

// 调整仓位
export const billColumnShip = [
  { title: '模具料号', field: 'moldPartNumber' },
  { title: '工厂', field: 'factory' },
  {
    title: '当前仓位',
    formatter: 'ApiSelect',
    field: 'shippingSpaceCode',
    editRender: {
      name: 'ApiSelect',
      props: {
        placeholder: '仓位',
        api: getShipList,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'shippingSpace',
        },
        rowParams: {
          factoryCode: 'factoryCode',
        },
        resultField: 'data',
        labelField: 'shippingSpaceName',
        valueField: 'shippingSpaceCode',
        nameFormat: ['shippingSpaceCode', '/', 'shippingSpaceName'],
        filterOption: false,
      },
    },
  },
];
// 修改货架号
export const billColumnsShelf = [
  { title: '模具料号', field: 'moldPartNumber' },
  { title: '货架号', field: 'goodsShelvesNumber', editRender: { name: 'input' } },
];
// 修改预估寿命
export const billColumnsRemainLife = [
  { title: '模具料号', field: 'moldPartNumber' },
  { title: '预估寿命(KPCS)', field: 'expectedLife', editRender: { name: 'input' } },
];

// 备注修改
export const billColumnsRemark = [
  { title: '模具料号', field: 'moldPartNumber' },
  { title: '备注1', field: 'remarksOne', editRender: { name: 'Textarea', props: { maxlength: 200, autoSize: true } } },
  { title: '备注2', field: 'remarksTwo', editRender: { name: 'Textarea', props: { maxlength: 200, autoSize: true } } },
  { title: '备注3', field: 'remarksThree', editRender: { name: 'Textarea', props: { maxlength: 200, autoSize: true } } },
  { title: '备注4', field: 'remarksFour', editRender: { name: 'Textarea', props: { maxlength: 200, autoSize: true } } },
  { title: '备注5', field: 'remarksFive', editRender: { name: 'Textarea', props: { maxlength: 200, autoSize: true } } },
];
// 更新
export const billColumnsCover = [{ title: '模具料号', field: 'moldPartNumber' }];

// 弹框配置
export const configModal = {
  editSupllier: {
    columns: modifySupplierColumns,
    id: 'editSupllier',
    picks: ['id', 'maintenanceSupplierId'],
    submitApi: updateMoldInfo,
    title: t('common.editReplaceSupplier'),
  },
  editShelvesNum: {
    columns: billColumnsShelf,
    id: 'editShelvesNum',
    picks: ['id', 'goodsShelvesNumber'],
    submitApi: updateMoldInfo,
    title: t('common.editShelvesNum'),
  },
  // 转在库
  editShip: {
    columns: billColumnShip,
    id: 'editShip',
    picks: ['id', 'shippingSpaceCode'],
    submitApi: updateMoldInfo,
    title: t('common.editShip'),
  },
  editRemark: {
    columns: billColumnsRemark,
    id: 'editRemark',
    picks: ['id', 'remarksOne', 'remarksTwo', 'remarksThree', 'remarksFour', 'remarksFive'],
    submitApi: updateMoldInfo,
    title: t('common.editRm'),
  },
  editRemainLife: {
    columns: billColumnsRemainLife,
    id: 'editRemainLife',
    picks: ['id', 'expectedLife'],
    submitApi: updateMoldInfo,
    title: t('common.editExptLife'),
  },
  toStore: {
    columns: billColumnsCover,
    id: 'editCover',
    picks: ['id'],
    submitApi: moldToArchive,
    beforeSubmitFetch: (data: any) => {
      return data.map((item: any) => {
        return item.id;
      });
    },
    title: t('common.toStore'),
  },
  toScrap: {
    columns: billColumnsCover,
    id: 'editCover',
    picks: ['id'],
    submitApi: moldToScrap,
    beforeSubmitFetch: (data: any) => {
      return data.map((item: any) => {
        return item.id;
      });
    },
    title: t('common.toscrap'),
  },
  toGeted: {
    columns: billColumnsCover,
    id: 'editCover',
    picks: ['id'],
    submitApi: moldToTakeDelivery,
    beforeSubmitFetch: (data: any) => {
      return data.map((item: any) => {
        return item.id;
      });
    },
    title: t('common.toGeted'),
  },
  toInShip: {
    columns: billColumnShip,
    id: 'editShip',
    picks: ['id', 'shippingSpaceCode'],
    submitApi: moldToStock,
    title: t('common.toInShip'),
  },
};
