import type { VxeGridPropTypes } from '/@/components/VxeTable';

import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
import { getFactoryList } from '/@/api/business/shippingspace';
import { getShipList as getShippingspacelist } from '/@/api/common/basedata';
import { getSupplierlist } from '/@/api/engineering/mould';

const { t } = useI18n();
const baseStore = useBaseStore();

/**
 * 单据状态枚举
 */
export enum STATUS_ENUM {
  暂存 = '0',
  在办 = '1',
  终止 = '2',
  驳回 = '3',
  撤回 = '4',
  结案 = '5',
  待处理 = '6',
}

/**
 * 单据状态选项及显示标签配置
 */
export const statusOptions = [
  {
    label: t('dict.ProgressStatusEnum.0'),
    value: STATUS_ENUM.暂存,
    fullName: t('dict.ProgressStatusEnum.0'),
    id: STATUS_ENUM.暂存,
    theme: 'gray',
    rowKey: 'confirmStatus',
  },
  {
    label: t('dict.ProgressStatusEnum.1'),
    value: STATUS_ENUM.在办,
    fullName: t('dict.ProgressStatusEnum.1'),
    id: STATUS_ENUM.在办,
    theme: 'blue',
    rowKey: 'confirmStatus',
  },
  {
    label: t('dict.ProgressStatusEnum.4'),
    value: STATUS_ENUM.撤回,
    fullName: t('dict.ProgressStatusEnum.4'),
    id: STATUS_ENUM.撤回,
    theme: 'purple',
    rowKey: 'confirmStatus',
  },
  {
    label: t('dict.ProgressStatusEnum.3'),
    value: STATUS_ENUM.驳回,
    fullName: t('dict.ProgressStatusEnum.3'),
    id: STATUS_ENUM.驳回,
    theme: 'yellow',
    rowKey: 'confirmStatus',
  },
  {
    label: t('dict.ProgressStatusEnum.2'),
    value: STATUS_ENUM.终止,
    fullName: t('dict.ProgressStatusEnum.2'),
    id: STATUS_ENUM.终止,
    theme: 'red',
    rowKey: 'confirmStatus',
  },
  {
    label: t('dict.ProgressStatusEnum.5'),
    value: STATUS_ENUM.结案,
    fullName: t('dict.ProgressStatusEnum.5'),
    id: STATUS_ENUM.结案,
    theme: 'green',
    rowKey: 'confirmStatus',
  },
  {
    label: t('dict.ProgressStatusEnum.6'),
    value: STATUS_ENUM.待处理,
    fullName: t('dict.ProgressStatusEnum.6'),
    id: STATUS_ENUM.待处理,
    theme: 'gray',
    rowKey: 'confirmStatus',
  },
];

/** 允许编辑的状态 */
export const editStatuList = [STATUS_ENUM.暂存, STATUS_ENUM.撤回, STATUS_ENUM.驳回, STATUS_ENUM.待处理];

/**
 * 需求类型枚举
 */
export enum DEMAND_TYPE_ENUM {
  /** 模具维修 */
  在库维修 = '1',
  /** 模具异常 */
  生产退模 = '2',
}
/**
 * 需求类型选项
 */
export const demandTypeOptions: Array<{ label: string; value: string; fullName: string; id: string }> = [
  { label: t('dict.MoldRepairDemandType.1'), fullName: t('dict.MoldRepairDemandType.1'), value: DEMAND_TYPE_ENUM.在库维修, id: DEMAND_TYPE_ENUM.在库维修 },
  { label: t('dict.MoldRepairDemandType.2'), fullName: t('dict.MoldRepairDemandType.2'), value: DEMAND_TYPE_ENUM.生产退模, id: DEMAND_TYPE_ENUM.生产退模 },
];

/**
 * 维修类型枚举
 */
export enum REPAIR_ENUM {
  免费维修 = 1,
  付费维修 = 2,
}
/**
 * 维修类型选项
 */
export const repairOptions: Array<{ label: string; value: string; fullName: string; id: string }> = [];
const getRepairOptions = () =>
  baseStore.getDictionaryData('MoldRepairType').then((res: Array<any>) => {
    // 过滤掉  终止维修
    const _r = res
      .filter(item => item.enCode !== '3')
      .map(item => {
        return {
          ...item,
          value: +item.enCode,
          label: item.fullName,
        };
      });
    repairOptions.push(..._r);
    return _r;
  });

/**
 * 模具状态枚举
 */
export enum MOLD_STATUS_ENUM {
  在库 = '5',
  已领用 = '9',
}

/**
 * 模具状态枚举
 */ export const moldStatusOptions: Array<{ label: string; value: string; fullName: string; id: string }> = [];
const getMoldOptions = () =>
  baseStore.getDictionaryData('MoldLedgerStatusEnum').then((res: Array<any>) => {
    moldStatusOptions.push(
      ...res.map(item => {
        return {
          ...item,
          value: item.enCode,
          label: item.fullName,
        };
      }),
    );
  });

/**
 * 原因分析枚举
 */
export enum REASON_ENUM {
  // 刀钝 = '1',
  // 崩刀（圆刀）
  '崩刀(圆刀)' = '1',
  尺寸异常 = '2',
  // 崩刀（平刀）
  '崩刀(平刀)' = '3',
  其他 = '4',
}
export const reasonOptions: Array<{ label: string; value: string; fullName: string; id: string }> = [];
const getResonOptions = () =>
  baseStore.getDictionaryData('MoldCauseAnalysis').then((res: Array<any>) => {
    reasonOptions.push(
      ...res.map(item => {
        return {
          ...item,
          value: item.enCode,
          label: item.fullName,
        };
      }),
    );
  });

/**
 * 异常类型枚举
 */
export const EXCEPTION_CATEGORY_ENUM = {
  刀钝: '1',
  崩刀: '2',
  尺寸异常: '3',
  结构错误: '4',
  顶针塌陷: '5',
  其他: '6',
};

export const exceptionCategoryOptions: Array<{ label: string; value: string; fullName: string; id: string }> = [];
const getExceptionOptions = () =>
  baseStore.getDictionaryData('MoldExceptionType').then((res: Array<any>) => {
    exceptionCategoryOptions.push(
      ...res.map(item => {
        return {
          ...item,
          value: item.enCode,
          label: item.fullName,
        };
      }),
    );
  });

/**
 * 模具处理方式枚举
 */
export enum MOLD_PROCESSING_METHOD_ENUM {
  回仓 = '1',
  报废 = '2',
  封存 = '3',
  其他 = '4',
}
export const moldProcessingMethodOptions: Array<{ label: string; value: string; fullName: string; id: string }> = [];
const getmoldProcessingMethodOptions = () =>
  baseStore.getDictionaryData('MoldDealType').then((res: Array<any>) => {
    moldProcessingMethodOptions.push(
      ...res.map(item => {
        return {
          ...item,
          value: item.enCode,
          label: item.fullName,
        };
      }),
    );
  });

/**
 * 模具类型选项
 */
export const moldTypeOptions: Array<{ label: string; value: string; fullName: string; id: string }> = [];
const getMoldTypeOptions = () =>
  baseStore.getDictionaryData('MoldApply.MoldType').then((res: Array<any>) => {
    moldTypeOptions.push(
      ...res.map(item => {
        return {
          ...item,
          value: item.enCode,
          label: item.fullName,
        };
      }),
    );
  });

/** 费用归属 选项 */
export const costAttributionOptions: Array<{ label: string; value: string; fullName: string; id: string }> = [];
const getCostAttributionOptions = () =>
  baseStore.getDictionaryData('CostAttribution').then((res: Array<any>) => {
    // 过滤掉  终止维修
    const _r = res.map(item => {
      return {
        ...item,
        value: item.enCode,
        label: item.fullName,
      };
    });
    costAttributionOptions.push(..._r);
  });

// 执行请求获取字段选项,因为字典是一次性获取全部,因为只需执行一个请求,其余字典取缓存即可
(async function () {
  await getRepairOptions().then(() => {
    getMoldOptions();
    getResonOptions();
    getExceptionOptions();
    getmoldProcessingMethodOptions();
    getMoldTypeOptions();
    getCostAttributionOptions();
  });
})();

/**
 * 校验字符串是否为 xxx(YYY) 格式
 * @param str 输入字符串
 * @returns 匹配时返回元组 [前缀, 括号内容]，否则返回原字符串
 */
export function parsePattern(str: string): [string, string] {
  // 使用正则表达式匹配 xxx(YYY) 格式
  const pattern = /^([^(]+)\(([^)]+)\)$/;
  const match = str.match(pattern);

  // 返回匹配结果或原始字符串
  return match ? [match[1], match[2]] : [str, ''];
}

/**
 * 清单页 - 搜索表单配置
 */
export function getFormConfig() {
  return [
    {
      fieldName: 'insidePartNumber',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '产品内部料号',
        allowClear: true,
      },
      width: 100,
    },
    {
      fieldName: 'moldNo',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '模具料号',
        allowClear: true,
      },
    },
    {
      fieldName: 'sapWorkOrderNo',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: 'SAP工单号',
        allowClear: true,
      },
    },
    {
      fieldName: 'currentProcessorId',
      label: '',
      component: 'CustomUserSelect',
      i18nField: 'CommonCol.currentNodeUser',
      componentProps: {
        placeholder: '当前处理人',
        allowClear: true,
      },
    },
    // {
    //   fieldName: 'status',
    //   label: '',
    //   component: 'Select',
    //   componentProps: {
    //     placeholder: '状态',
    //     allowClear: true,
    //     options: statusOptions,
    //   },
    // },
  ];
}

/**
 * 渲染可以自定义内容的字典及其文本
 * @param cellValue 取值字段
 * @param row 行数据
 * @param nameField 名称字段
 * @param otherField 自定义内容字段
 * @param otherEnumValue `其他`的枚举值
 * @returns
 */
export function renderCustomText(cellValue: string | number, row: any, nameField: string, otherField: string, otherEnumValue: string | number) {
  return cellValue === otherEnumValue && row[otherField] ? `${row[otherField]}` : row[nameField] || '';
}

function parseArray(value: string | Array<any>) {
  if (Array.isArray(value)) {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
}

/**
 * 渲染多选人员的值
 * @param cellValue
 * @param row
 * @param nameField
 */
export function renderMultiplePerson(cellValue: string, row: any, nameField: string) {
  let textList: any[] = [];

  if (row[nameField]) {
    textList = parseArray(row[nameField]);
  } else if (cellValue) {
    textList = parseArray(cellValue);
  }

  return Array.isArray(textList) ? textList.join(',') : textList;
}

/** 格式化百分比 */
export function formatPercentage(value: string | number) {
  return `${value || 0}%`;
}

/**
 * 清单页 - 表格列配置
 */
export function getColumn(): Array<VxeGridPropTypes.Column & Partial<Record<'i18nField', string>>> {
  return [
    {
      type: 'checkbox',
      field: 'checkbox',
    },
    {
      field: 'seq',
      title: t('component.table.index'),
      type: 'seq',
      width: '50',
      align: 'center',
    },
    {
      title: '单号',
      field: 'moldRepairApplyNo',
      sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
      width: 200,
      slots: {
        default: 'moldRepairApplyNo',
      },
    },
    {
      title: '状态',
      field: 'status',
      sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'ASelect', props: { options: statusOptions, style: { width: '120px' } } },
      width: 120,
      cellRender: {
        name: 'Tag',
        cSharType: 'int',
        options: statusOptions,
      },
    },
    {
      title: '当前处理人',
      field: 'currentProcessorName',
      i18nField: 'CommonCol.currentNodeUser',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'CustomUserSelect' },
      width: 200,
    },
    {
      title: '当前节点',
      field: 'currentNodeName',
      i18nField: 'CommonCol.currentNode',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 200,
    },
    {
      title: '节点记录',
      field: 'nodeDetail',
      i18nField: 'CommonCol.nodeDetail',
      width: 120,
      slots: {
        default: 'nodeDetail',
      },
    },
    {
      title: '需求类型',
      field: 'demandType',
      formatter: ({ cellValue, row }) => row.demandTypeName || cellValue || '',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'ASelect',
        cSharpType: 'int',
        props: {
          options: demandTypeOptions,
          style: { width: '200px' },
        },
      },
      width: 120,
    },
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 200,
    },
    {
      title: 'SAP工单号',
      field: 'sapWorkOrderNo',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 120,
    },
    {
      title: '模具料号',
      field: 'moldNo',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 150,
    },
    {
      title: '模具类型',
      field: 'moldType',
      formatter: ({ cellValue, row }) => row.moldTypeName || cellValue || '',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'ApiSelect',
        props: {
          api: () => baseStore.getDictionaryData('MoldApply.MoldType'),
          resultField: 'data',
          labelField: 'fullName',
          valueField: 'enCode',
          immediate: true,
          showSearch: false,
          filterOption: false,
          notFoundContent: null,
          style: { width: '200px' },
        },
      },
      width: 120,
    },
    {
      title: '模具状态',
      field: 'moldStatus',
      i18nField: 'moldStatus',
      formatter: ({ cellValue, row }) => row.moldStatusName || cellValue || '',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'ApiSelect',
        cSharpType: 'int',
        props: {
          api: () => baseStore.getDictionaryData('MoldLedgerStatusEnum'),
          resultField: 'data',
          labelField: 'fullName',
          valueField: 'enCode',
          immediate: true,
          showSearch: false,
          filterOption: false,
          notFoundContent: null,
          style: { width: '200px' },
        },
      },
      width: 120,
    },
    {
      title: '供应商',
      field: 'supplierName',
      filters: [{ data: '' }],
      filterRender: {
        name: 'ApiSelect',
        searchField: 'supplier',
        props: {
          api: getSupplierlist,
          apiSearch: {
            show: true,
            searchName: 'searchKey',
          },
          showSearch: true,
          filterOption: false,
          resultField: 'data',
          labelField: 'name',
          valueField: 'code',
          immediate: true,
          alwaysLoad: true,
          style: { width: '200px' },
        },
      },
      width: 200,
    },
    {
      title: '代维修供应商',
      field: 'repairSupplierName',
      filters: [{ data: '' }],
      filterRender: {
        name: 'ApiSelect',
        searchField: 'repairSupplier',
        props: {
          api: getSupplierlist,
          apiSearch: {
            show: true,
            searchName: 'searchKey',
          },
          showSearch: true,
          filterOption: false,
          resultField: 'data',
          labelField: 'name',
          valueField: 'code',
          immediate: true,
          alwaysLoad: true,
          style: { width: '200px' },
        },
      },
      width: 200,
    },
    {
      title: '入库日期',
      field: 'inboundDate',
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'DateRange',
      },
      width: 150,
      cellRender: {
        name: 'Date',
        // @ts-ignore
        format: 'YYYY-MM-DD',
      },
    },
    {
      title: '需求返厂日期',
      field: 'demandReturnDate',
      sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'DateRange' },
      width: 150,
      cellRender: {
        name: 'Date',
        // @ts-ignore
        format: 'YYYY-MM-DD',
      },
    },
    {
      title: '费用归属',
      field: 'costAttributionName',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'ApiSelect',
        searchField: 'costAttribution',
        props: {
          api: () => baseStore.getDictionaryData('CostAttribution'),
          resultField: 'data',
          labelField: 'fullName',
          valueField: 'enCode',
          immediate: true,
          showSearch: false,
          filterOption: false,
          notFoundContent: null,
          style: { width: '200px' },
        },
      },
      width: 120,
    },
    {
      title: '维修次数',
      field: 'repairCount',
      sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 120,
      aqpFilter: { cSharpType: 'int' },
    },
    {
      title: '预估寿命(KPCS)',
      field: 'estimateLifespan',
      sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 150,
      aqpFilter: { cSharpType: 'int' },
    },
    {
      title: '已使用寿命(KPCS)',
      field: 'usedLifespan',
      sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 150,
      aqpFilter: { cSharpType: 'int' },
    },
    {
      title: '原因分析',
      field: 'causeAnalysis',
      formatter: ({ cellValue, row }) => renderCustomText(cellValue, row, 'causeAnalysisName', 'otherCauseAnalysis', REASON_ENUM.其他),
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 200,
    },
    {
      title: '维修内容(改善对策)',
      field: 'repairContent',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 200,
    },
    {
      title: '维修类型',
      field: 'repairType',
      formatter: ({ cellValue, row }) => row.repairTypeName || cellValue || '',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'ApiSelect',
        cSharpType: 'int',
        props: {
          api: getRepairOptions,
          resultField: '',
          labelField: 'fullName',
          valueField: 'enCode',
          style: { width: '200px' },
        },
      },
      width: 120,
    },
    {
      title: '维修类型变更日志',
      field: 'repairChangeLog',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 120,
      slots: {
        default: 'repairChangeLog',
      },
    },
    {
      title: '图纸',
      field: 'drawingsName',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 200,
      slots: {
        default: 'drawingsName',
      },
    },
    // {
    //   title: '审核人',
    //   field: 'reviewUserName',
    //   // sortable: true,
    //   filters: [{ data: '' }],
    //   filterRender: { name: 'Input' },
    //   width: 200,
    // },
    // {
    //   title: '审核意见',
    //   field: 'reviewComment',
    //   // sortable: true,
    //   // filters: [{ data: '' }],
    //   // filterRender: { name: 'Input' },
    //   width: 200,
    // },
    {
      title: '异常类别',
      field: 'exceptionCategory',
      formatter: ({ cellValue, row }) => renderCustomText(cellValue, row, 'exceptionCategoryName', 'otherExceptionCategory', EXCEPTION_CATEGORY_ENUM.其他),
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 120,
    },
    {
      title: '问题描述',
      field: 'issueDescription',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 200,
    },
    {
      title: '工厂',
      field: 'factory',
      formatter: ({ cellValue, row }) => row.factoryName || cellValue || '',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'ApiSelect',
        props: {
          api: getFactoryList,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'factoryCode',
          },
          params: {
            pageSize: 20,
          },
          resultField: 'data',
          labelField: 'Name',
          valueField: 'Code',
          filterOption: false,
          notFoundContent: null,
          style: { width: '200px' },
        },
      },
      width: 120,
    },
    {
      title: '调入仓库',
      field: 'inShippingSpaceCode',
      formatter: ({ cellValue, row }) => row.inShippingSpaceName || cellValue || '',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'ApiSelect',
        props: {
          api: getShippingspacelist,
          resultField: 'data.list',
          labelField: 'shippingSpaceName',
          valueField: 'shippingSpaceCode',
          immediate: true,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'shippingSpace',
          },
          filterOption: false,
          notFoundContent: null,
          style: { width: '200px' },
        },
      },
      width: 200,
    },
    {
      title: '调出仓库',
      field: 'outShippingSpaceCode',
      formatter: ({ cellValue, row }) => row.outShippingSpaceName || cellValue || '',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'ApiSelect',
        props: {
          api: getShippingspacelist,
          resultField: 'data.list',
          labelField: 'shippingSpaceName',
          valueField: 'shippingSpaceCode',
          immediate: true,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'shippingSpace',
          },
          filterOption: false,
          notFoundContent: null,
          style: { width: '200px' },
        },
      },
      width: 200,
    },
    {
      title: '发生时间',
      field: 'occurrenceTime',
      sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 120,
      cellRender: {
        name: 'Date',
      },
    },
    {
      title: '检验文件',
      field: 'inspectionDocument',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 200,
    },
    {
      title: '本次使用寿命(KPCS)',
      field: 'currentUsedLife',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 200,
      aqpFilter: {
        cSharpType: 'int',
      },
    },
    {
      title: '不良率',
      field: 'defectRate',
      sortable: true,
      formatter: ({ cellValue }) => formatPercentage(cellValue),
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 120,
      aqpFilter: {
        cSharpType: 'int',
      },
    },
    {
      title: '生产人员',
      field: 'productionStaff',
      formatter: ({ cellValue, row }) => renderMultiplePerson(cellValue, row, 'productionStaffName'),
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'CustomUserSelect', props: { style: { width: '200px' } } },
      width: 200,
    },
    {
      title: '组长',
      field: 'teamLeader',
      formatter: ({ cellValue, row }) => renderMultiplePerson(cellValue, row, 'teamLeaderName'),
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'CustomUserSelect', props: { style: { width: '200px' } } },
      width: 200,
    },
    {
      title: '主管',
      field: 'supervisor',
      formatter: ({ cellValue, row }) => renderMultiplePerson(cellValue, row, 'supervisorName'),
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'CustomUserSelect', props: { style: { width: '200px' } } },
      width: 200,
    },
    {
      title: '工程/生技',
      field: 'engineeringTechnician',
      formatter: ({ cellValue, row }) => row.engineeringTechnicianName || cellValue || '',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'CustomUserSelect', props: { style: { width: '200px' } } },
      width: 200,
    },
    {
      title: '模具采购员',
      field: 'moldPurchaser',
      formatter: ({ cellValue, row }) => row.moldPurchaserName || cellValue || '',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'CustomUserSelect', props: { style: { width: '200px' } } },
      width: 200,
    },
    {
      title: '仓管员',
      field: 'warehouseManager',
      formatter: ({ cellValue, row }) => renderMultiplePerson(cellValue, row, 'warehouseManagerName'),
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'CustomUserSelect', props: { style: { width: '200px' } } },
      width: 200,
    },
    {
      title: '退料人',
      field: 'materialReturner',
      formatter: ({ cellValue, row }) => renderMultiplePerson(cellValue, row, 'materialReturnerName'),
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'CustomUserSelect', props: { style: { width: '200px' } } },
      width: 200,
    },
    {
      title: '制单人',
      field: 'documentPreparer',
      formatter: ({ cellValue, row }) => row.documentPreparerName || cellValue || '',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'CustomUserSelect', props: { style: { width: '200px' } } },
      width: 200,
    },
    {
      title: '申请部门',
      field: 'requestingDepartment',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
      width: 200,
    },
    // 创建时间
    {
      title: '创建时间',
      field: 'creatorTime',
      showOverflow: 'tooltip',
      sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'DateRange' },
      width: 120,
      cellRender: {
        name: 'Date',
      },
    },
  ];
}
