import type { VxeGridPropTypes } from '/@/components/VxeTable';

import { useI18n } from '/@/hooks/web/useI18n';
import { statusOptions } from '../config';
import {
  repairOptions,
  REASON_ENUM,
  EXCEPTION_CATEGORY_ENUM,
  demandTypeOptions,
  DEMAND_TYPE_ENUM,
  renderCustomText,
  renderMultiplePerson,
  formatPercentage,
} from '/@/views/productionDeal/mouldBusiness/maintenance/config';
import { useBaseStore } from '/@/store/modules/base';
import { getSupplierlist } from '/@/api/engineering/mould';
import { getFactoryList } from '/@/api/business/shippingspace';
import { getShipList as getShippingspacelist } from '/@/api/common/basedata';

export { DEMAND_TYPE_ENUM };

const { t } = useI18n();
const baseStore = useBaseStore();

/**
 * 清单页 - 表单配置
 */
export function getFormConfig() {
  return [
    {
      fieldName: 'moldRepairApplyNo',
      routeField: 'billNo',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '单号',
        allowClear: true,
      },
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
      fieldName: 'moldType',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '模具类型',
        api: () => baseStore.getDictionaryData('MoldApply.MoldType'),
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
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
    //   fieldName: 'reviewStatus',
    //   label: '',
    //   component: 'Select',
    //   i18nField: 'CommonCol.status',
    //   componentProps: {
    //     placeholder: '状态',
    //     options: statusOptions,
    //     allowClear: true,
    //   },
    // },
  ];
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
      i18nField: 'CommonCol.status',
      sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'ASelect', props: { options: statusOptions, style: { width: '120px' } } },
      width: 200,
      formatter: ({ cellValue }) => cellValue,
      cellRender: {
        name: 'Tag',
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
      width: 200,
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
        props: {
          options: demandTypeOptions,
          style: { width: '200px' },
        },
      },
      width: 200,
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
      width: 200,
    },
    {
      title: '模具料号',
      field: 'moldNo',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 200,
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
      width: 200,
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
      width: 200,
    },
    {
      title: '供应商',
      field: 'supplier',
      formatter: ({ cellValue, row }) => row.supplierName || cellValue || '',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'ApiSelect',
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
      field: 'repairSupplier',
      formatter: ({ cellValue, row }) => row.repairSupplierName || cellValue || '',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'ApiSelect',
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
      filterRender: { name: 'DateRange' },
      width: 200,
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
      width: 200,
      cellRender: {
        name: 'Date',
        // @ts-ignore
        format: 'YYYY-MM-DD',
      },
    },
    {
      title: '费用归属',
      field: 'costAttribution',
      formatter: ({ cellValue, row }) => row.costAttributionName || cellValue || '',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'ApiSelect',
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
      width: 200,
    },
    {
      title: '维修次数',
      field: 'repairCount',
      sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 200,
      aqpFilter: { cSharpType: 'int' },
    },
    {
      title: '预估寿命(KPCS)',
      field: 'estimateLifespan',
      sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 200,
    },
    {
      title: '已使用寿命(KPCS)',
      field: 'usedLifespan',
      sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 200,
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
      filterRender: { name: 'ASelect', props: { options: repairOptions, style: { width: '200px' } } },
      width: 200,
    },
    // {
    //   title: '维修类型变更日志',
    //   field: 'repairChangeLog',
    //   // sortable: true,
    //   // filters: [{ data: '' }],
    //   // filterRender: { name: 'Input' },
    //   width: 200,
    //   slots: {
    //     default: 'repairChangeLog',
    //   },
    // },
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
      width: 200,
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
      width: 200,
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
      width: 200,
      cellRender: {
        name: 'Date',
        // @ts-ignore
        format: 'YYYY-MM-DD',
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
      width: 200,
      aqpFilter: { cSharpType: 'int' },
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
      width: '180',
      cellRender: {
        name: 'Date',
        // @ts-ignore
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
  ];
}

/**
 * 审核弹窗 - 审核类型枚举
 */
export enum AUDIT_ENUM {
  同意 = '1',
  驳回 = '2',
}

/**
 * 审核弹窗 - 表格列配置
 */
export const auditColumns: VxeGridPropTypes.Columns = [
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
  },
  {
    title: '模具料号',
    field: 'moldNo',
  },
  {
    title: '模具类型',
    field: 'moldType',
    formatter: ({ cellValue, row }) => row.moldTypeName || cellValue || '',
  },
  {
    title: '驳回意见',
    field: 'rejectReason',
    editRender: {
      enabled: true,
      name: 'Input',
    },
  },
];

/**
 * 审核弹窗 - 表格编辑校验规则
 */
export const auditColumnsEditRules = {
  rejectReason: [{ required: true, message: t('common.required') }],
};
