import { useBaseStore } from '/@/store/modules/base';
import { getPartNumberApplySearch } from '/@/api/engineering/info';
import { getListbyfactory } from '/@/api/warehouse/warehouse';
import { getMoldLedgerList } from '/@/api/warehouse/moIdBill';
import { getWorkOrderList } from '/@/api/productionDeal/moIdUse';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
const isExist = val => {
  return val !== null && val !== undefined && val !== '' && val !== 0 && val !== '0';
};

// 计算模具剩余寿命值
export const calculateRemainingLife = record => {
  const { remainingLife, expectedLife } = record;
  if (!isExist(remainingLife) || !isExist(expectedLife)) {
    return 0;
  }
  const remainingLifeValue = remainingLife / expectedLife;
  return Number.isNaN(remainingLifeValue) ? 0 : remainingLifeValue;
};

// 计算模具剩余寿命百分比
export const calculateRemainingLifePercentage = record => {
  const remainingLifeValue = isExist(record.remainingLifePercentage) ? record.remainingLifePercentage : calculateRemainingLife(record);
  return remainingLifeValue == 0 ? '0%' : `${(remainingLifeValue * 100).toFixed(2)}%`;
};
// 计算模具对应的百分比告警样式
// 剩余寿命/预估寿命  小于等于10%  红色
// 剩余寿命/预估寿命  小于等于20%  大于10%  黄色
export const calculatePercentageStyle = record => {
  const remainingLifeValue = calculateRemainingLife(record);
  if (remainingLifeValue <= 0.1) {
    return 'red';
  } else if (remainingLifeValue <= 0.2) {
    return 'yellow';
  }
  return '';
};

export const canEdit = record => {
  const { status } = record;
  const statusList = [0, 3, 4]; // 状态为1、2、3时，可以编辑
  return statusList.includes(status);
};
//  ---------------------------------生成通用处理方式
// 模具版本号变更
function handleMoidVersionChange(_, data, params) {
  // 清空序号，重选
  const {
    $grid: { setRow },
    row,
  } = params;
  setRow(row, { moldNumber: '', moldStatusName: '' });
}
// 模具序号变更
function handleMoidNumChange(_, data, params) {
  const {
    $grid: { setRow },
    row,
  } = params;
  const { statusName, moldTypeName, machinePosition, factory, remainingLife, expectedLife, shippingSpaceCode, shippingSpaceName } = data;
  setRow(row, {
    moldStatusName: statusName,
    moldTypeName: moldTypeName,
    machinePosition,
    factory,
    remainingLife,
    expectedLife,
    outShippingSpaceCode: shippingSpaceCode,
    outShippingSpaceName: shippingSpaceName,
  });
}
// 工單號变更
function handleWorkOrderChange(_, data, params) {
  const {
    $grid: { setRow },
    row,
  } = params;
  const { workshopLocation, insidePartNumber } = data;
  setRow(row, {
    workshopLocation: workshopLocation,
    insidePartNumber,
  });
}

//  ---------------------------------生成单据---------------------------------
const baseStore = useBaseStore();
export const generateSchema = [
  {
    label: '事务类型',
    field: 'affairsType',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: async () => {
        return {
          data: await baseStore.getDictionaryData('AffairsType'),
        };
      },
      apiSearch: {
        show: false,
      },
      resultField: 'data',
      defaultFirstOption: true,
      labelField: 'fullName',
      valueField: 'enCode',
      showSearch: false,
      immediate: true,
      filterOption: false,
      defaultOption: true,
    },
  },
  {
    label: '领料部门',
    field: 'receiveDeptName',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '领料人',
    required: true,
    field: 'receiveMoldUserIds',
    colProps: {
      span: 8,
    },
    component: 'CustomUserSelect',
    componentProps: {
      multiple: true,
      maxTagCount: 1,
    },
  },
  {
    label: '审核人',
    required: true,
    field: 'reviewUserIds',
    colProps: {
      span: 8,
    },
    component: 'CustomUserSelect',
    componentProps: {
      multiple: true,
      maxTagCount: 2,
    },
  },
  {
    label: '制单人',
    field: 'applyUserName',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '创建时间',
    field: 'applyDate',
    component: 'DatePicker',
    componentProps: {
      disabled: true,
    },
  },
];
export const generateColumn = [
  { title: '模具状态', field: 'moldStatusName' },
  { title: '模具版本', field: 'moldVersion' },
  {
    title: '模具序号',
    field: 'moldNumber',
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      props: {
        api: getMoldLedgerList,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'moldNumber',
        },
        rowParams: {
          moldVersion: 'moldVersion',
        },
        params: {
          type: 2,
        },
        resultField: 'data',
        labelField: 'moldNumber',
        valueField: 'moldNumber',
        onChange: handleMoidNumChange,
      },
    },
  },
  {
    title: '楼列位置',
    field: 'workshopLocation',
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '调出仓库',
    field: 'outShippingSpaceCode',
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      cacheField: 'outShippingSpaceName',
      props: {
        api: getListbyfactory,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'shippingSpaceName',
        },
        rowParams: {
          factoryCode: 'factory',
        },
        resultField: 'data',
        labelField: 'shippingSpaceName',
        valueField: 'shippingSpaceCode',
        nameFormat: ['shippingSpaceCode', '/', 'shippingSpaceName'],
      },
    },
  },
  {
    title: '调入仓库',
    field: 'callShippingSpaceCode',
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      cacheField: 'callShippingSpaceName',
      props: {
        api: getListbyfactory,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'shippingSpaceName',
        },
        rowParams: {
          factoryCode: 'factory',
        },
        resultField: 'data',
        labelField: 'shippingSpaceName',
        valueField: 'shippingSpaceCode',
        nameFormat: ['shippingSpaceCode', '/', 'shippingSpaceName'],
      },
    },
  },
  {
    title: '剩余寿命百分比(%)',
    field: 'remainingLifePercentage',
    hpleMessage: '剩余寿命/预估寿命',
    slots: {
      default: 'remainPer',
    },
  },
  { title: '产品内部料号', field: 'insidePartNumber' },
  { title: '模具类型', field: 'moldTypeName' },
  {
    title: '计划领用日期',
    field: 'plannedReceiveDate',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  { title: 'SAP工单号', field: 'sapWorkOrder' },
  { title: '机台位', field: 'machinePosition' },
  { title: '工厂', field: 'factory' },
  {
    title: '单位',
    field: 'unit',
    formatter: () => 'PCS',
  },
  {
    title: '数量',
    field: 'qty',
    formatter: () => 1,
  },
  { title: '领用原因', field: 'receiveReason' },
  { title: '剩余寿命(KPCS)', field: 'remainingLife', hpleMessage: '预估寿命-历次使用寿命' },
  {
    title: '备注',
    field: 'remark',
    i18nField: 'CommonCol.remark',
    editRender: { name: 'Input' },
  },
];

//  ---------------------------------新建单据---------------------------------

// 新增模块
export const addSchema = [
  {
    label: '事务类型',
    field: 'affairsType',
    required: true,
    component: 'ApiSelect',
    componentProps: {
      api: async () => {
        return {
          data: await baseStore.getDictionaryData('AffairsType'),
        };
      },
      apiSearch: {
        show: false,
      },
      defaultFirstOption: true,
      resultField: 'data',
      labelField: 'fullName',
      valueField: 'enCode',
      showSearch: false,
      immediate: true,
      filterOption: false,
      defaultOption: true,
    },
  },
  {
    label: '领料部门',
    field: 'receiveDeptName',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '领料人',
    field: 'receiveMoldUserIds',
    colProps: {
      span: 8,
    },
    component: 'CustomUserSelect',
    componentProps: {
      multiple: true,
      maxTagCount: 1,
    },
    required: true,
  },
  {
    label: '审核人',
    required: true,
    field: 'reviewUserIds',
    colProps: {
      span: 8,
    },
    component: 'CustomUserSelect',
    componentProps: {
      multiple: true,
      maxTagCount: 2,
    },
  },
  {
    label: '制单人',
    field: 'applyUserName',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '创建时间',
    field: 'applyDate',
    component: 'DatePicker',
    componentProps: {
      disabled: true,
    },
  },
];
export const addColumn = [
  { title: '模具状态', field: 'moldStatusName' },
  {
    title: '模具版本',
    field: 'moldVersion',
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      props: {
        api: getMoldLedgerList,
        showSearch: true,
        params: {
          type: 1,
          page: 20,
        },
        apiSearch: {
          show: true,
          searchName: 'moldVersion',
        },
        resultField: 'data',
        labelField: 'moldVersion',
        valueField: 'moldVersion',
        onChange: handleMoidVersionChange,
      },
    },
  },
  {
    title: '模具序号',
    field: 'moldNumber',
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      props: {
        api: getMoldLedgerList,
        showSearch: true,
        rowParams: {
          moldVersion: 'moldVersion',
        },
        params: {
          type: 2,
        },
        apiSearch: {
          show: true,
          searchName: 'moldNumber',
        },
        resultField: 'data',
        labelField: 'moldNumber',
        valueField: 'moldNumber',
        alwaysLoad: true,
        onChange: handleMoidNumChange,
      },
    },
  },
  {
    title: '产品内部料号',
    field: 'insidePartNumber',
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      props: {
        api: getPartNumberApplySearch,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'insidePartNumber',
        },
        params: {
          pageSize: 30,
        },
        rowParams: {
          factoryCode: 'factory',
        },
        resultField: 'data',
        labelField: 'insidePartNumber',
        valueField: 'insidePartNumber',
      },
    },
  },
  { title: '模具类型', field: 'moldTypeName' },
  {
    title: '计划领用日期',
    field: 'plannedReceiveDate',
    editRender: {
      name: 'DatePicker',
      props: {
        valueFormat: 'YYYY-MM-DD',
      },
    },
  },
  {
    title: 'SAP工单号',
    field: 'sapWorkOrder',
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      cacheField: 'sapWorkOrder',
      props: {
        api: getWorkOrderList,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'sapWorkOrder',
        },
        resultField: 'data',
        labelField: 'sapWorkOrder',
        valueField: 'sapWorkOrder',
        immediate: false,
        onChange: handleWorkOrderChange,
      },
    },
  },
  // 樓列位置 workshopLocation
  {
    title: '楼列位置',
    field: 'workshopLocation',
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '调出仓库',
    field: 'outShippingSpaceCode',
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      cacheField: 'outShippingSpaceName',
      props: {
        api: getListbyfactory,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'shippingSpaceName',
        },
        rowParams: {
          factoryCode: 'factory',
        },
        resultField: 'data',
        labelField: 'shippingSpaceName',
        valueField: 'shippingSpaceCode',
        nameFormat: ['shippingSpaceCode', '/', 'shippingSpaceName'],
        immediate: false,
      },
    },
  },
  {
    title: '调入仓库',
    field: 'callShippingSpaceCode',
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      cacheField: 'callShippingSpaceName',
      props: {
        api: getListbyfactory,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'shippingSpaceName',
        },
        rowParams: {
          factoryCode: 'factory',
        },
        immediate: false,
        resultField: 'data',
        labelField: 'shippingSpaceName',
        valueField: 'shippingSpaceCode',
        nameFormat: ['shippingSpaceCode', '/', 'shippingSpaceName'],
      },
    },
  },
  { title: '工厂', field: 'factory' },
  { title: '机台位', field: 'machinePosition' },
  {
    title: '单位',
    field: 'unit',
    formatter: () => {
      return 'PCS';
    },
  },
  {
    title: '数量',
    field: 'qty',
    formatter: () => {
      return 1;
    },
  },
  {
    title: '剩余寿命(KPCS)',
    field: 'remainingLife',
    titlePrefix: {
      content: '预估寿命-历次使用寿命',
    },
  },
  {
    title: '剩余寿命百分比',
    field: 'remainingLifePercentage',
    titlePrefix: {
      content: '剩余寿命/预估寿命',
    },
    slots: {
      default: 'remainPer',
    },
  },
  { title: '领用原因', field: 'receiveReason', editRender: { name: 'Input' } },
  { title: '临时单号', field: 'temporaryOrder', editRender: { name: 'Input' } },
  {
    title: '备注',
    field: 'remark',
    i18nField: 'CommonCol.remark',
    editRender: { name: 'Input' },
  },
  {
    field: 'action',
    title: '操作',
    width: 120,
    fixed: 'right',
    slots: {
      default: 'action',
    },
  },
];

/**
 * 新增页面 - 表格列校验规则
 */
export const editRules = {
  moldVersion: [{ required: true, message: t('common.required') }],
  insidePartNumber: [{ required: true, message: t('common.required') }],
  moldNumber: [{ required: true, message: t('common.required') }],
  plannedReceiveDate: [{ required: true, message: t('common.required') }],
  outShippingSpaceCode: [{ required: true, message: t('common.required') }],
  callShippingSpaceCode: [{ required: true, message: t('common.required') }],
  receiveReason: [{ required: true, message: t('common.required') }],
  sapWorkOrder: [{ required: true, message: t('common.required') }],
  workshopLocation: [{ required: true, message: t('common.required') }],
};
