import type { VxeGridPropTypes } from '/@/components/VxeTable';

import { useI18n } from '/@/hooks/web/useI18n';
import { statusOptions } from '../config';
import {
  repairOptions,
  // moldProcessingMethodOptions,
  REASON_ENUM,
  renderCustomText,
  renderMultiplePerson,
  demandTypeOptions,
} from '/@/views/productionDeal/mouldBusiness/maintenance/config';
import { getSupplierlist } from '/@/api/engineering/mould';
import { useBaseStore } from '/@/store/modules/base';
import { getFactoryList } from '/@/api/business/shippingspace';

const { t } = useI18n();
const baseStore = useBaseStore();

/**
 * 清单页 - 表单配置（待处理）
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
      fieldName: 'demandType',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '需求类型',
        api: () => baseStore.getDictionaryData('MoldRepairDemandType'),
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
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
      fieldName: 'currentProcessorId',
      label: '',
      component: 'CustomUserSelect',
      i18nField: 'CommonCol.currentNodeUser',
      componentProps: {
        placeholder: '当前处理人',
        allowClear: true,
      },
    },
    {
      fieldName: 'status',
      label: '',
      component: 'Select',
      i18nField: 'CommonCol.status',
      componentProps: {
        placeholder: '状态',
        options: statusOptions,
        allowClear: true,
      },
    },
  ];
}

/**
 * 清单页 = 表格列配置
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
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 200,
      slots: {
        default: 'moldRepairApplyNo',
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
      title: '模具料号',
      field: 'moldNo',
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
      title: '收货厂址',
      field: 'deliveryAddress',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
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
      title: '工程/生技',
      field: 'engineeringTechnician',
      formatter: ({ cellValue, row }) => row.engineeringTechnicianName || cellValue || '',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
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
    //   title: '变更维修类型',
    //   field: 'changeRepairTypeName',
    //   // sortable: true,
    //   filters: [{ data: '' }],
    //   filterRender: { name: 'ASelect', props: { options: repairOptions } },
    //   width: 200,
    // },
    // {
    //   title: '变更原因',
    //   field: 'changeRepairTypeReason',
    //   // sortable: true,
    //   // filters: [{ data: '' }],
    //   // filterRender: { name: 'ASelect', props: { options: repairOptions } },
    //   width: 200,
    // },
    // {
    //   title: '模具处理方式',
    //   field: 'dealType',
    //   formatter: ({ cellValue, row }) => row.dealTypeName || cellValue || '',
    //   // sortable: true,
    //   filters: [{ data: '' }],
    //   filterRender: { name: 'ASelect', props: { options: moldProcessingMethodOptions } },
    //   width: 200,
    // },
    // {
    //   title: '变更附件',
    //   field: 'changeRepairTypeFile',
    //   // sortable: true,
    //   // filters: [{ data: '' }],
    //   // filterRender: { name: 'ASelect', props: { options: moldProcessingMethodOptions } },
    //   width: 200,
    // },
    {
      title: '维修类型变更日志',
      field: 'repairChangeLog',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 200,
      slots: {
        default: 'repairChangeLog',
      },
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
      title: '产品内部料号',
      field: 'insidePartNumber',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
      width: 200,
    },
    {
      title: '内部项目代码',
      field: 'insideProjectCode',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
      width: 200,
    },
    {
      title: '直接客户代码',
      field: 'immediateCustomerName',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
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
      title: '备注',
      field: 'remark',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 200,
    },
    {
      title: '状态',
      field: 'warehouserConfirmStatus',
      i18nField: 'status',
      sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 200,
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
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
      width: 200,
    },
    {
      title: '当前节点',
      field: 'currentNodeName',
      i18nField: 'CommonCol.currentNode',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'CustomUserSelect' },
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
      title: '刀模在库类型',
      field: 'inStoreTypeName',
      width: 200,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
    },
    {
      title: '下单日期',
      field: 'orderDate',
      width: 200,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'DatePicker' },
      cellRender: {
        name: 'Date',
        // @ts-ignore
        format: 'YYYY-MM-DD',
      },
    },
    {
      title: '接收时间',
      field: 'receiveDate',
      width: 200,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'DatePicker' },
      cellRender: {
        name: 'Date',
        // @ts-ignore
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      title: '要求交期',
      field: 'requireDeliveryDate',
      width: 200,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'DatePicker' },
      cellRender: {
        name: 'Date',
        // @ts-ignore
        format: 'YYYY-MM-DD',
      },
    },
    {
      title: '返厂时间',
      field: 'returnFactoryTime',
      width: 200,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'DatePicker' },
      cellRender: {
        name: 'Date',
        // @ts-ignore
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      title: '入库日期',
      field: 'inboundDate',
      width: 200,
      sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'DateRange' },
      cellRender: {
        name: 'Date',
        // @ts-ignore
        format: 'YYYY-MM-DD',
      },
    },
    {
      title: '数量',
      field: 'quantity',
      width: 200,
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'DatePicker' },
    },
    {
      title: '原因分析',
      field: 'causeAnalysis',
      formatter: ({ cellValue, row }) => renderCustomText(cellValue, row, 'causeAnalysisName', 'otherCauseAnalysis', REASON_ENUM.其他),
      width: 400,
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'DatePicker' },
    },
  ];
}

/**
 * 确认接收弹窗 - 表格列配置
 */
export const confirmReceiptColumns: VxeGridPropTypes.Columns = [
  {
    field: 'seq',
    title: t('component.table.index'),
    type: 'seq',
    width: '50',
    align: 'center',
  },
  {
    title: '模具料号',
    field: 'moldNo',
    minWidth: 200,
  },
  {
    title: '货架号',
    field: 'goodsShelvesNumber',
    width: 200,
  },
  {
    title: '模具类型',
    field: 'moldType',
    formatter: ({ cellValue, row }) => row.moldTypeName || cellValue || '',
    width: 200,
  },
];

/**
 * 修改代维修供应商
 */
export const modifySupplierColumns: VxeGridPropTypes.Columns = [
  {
    field: 'seq',
    title: t('component.table.index'),
    type: 'seq',
    width: '50',
    align: 'center',
  },
  {
    title: '模具料号',
    field: 'moldNo',
    width: 200,
  },
  {
    title: '供应商',
    field: 'supplier',
    formatter: ({ cellValue, row }) => row.supplierName || cellValue || '',
    width: 200,
  },
  {
    title: '代维修供应商',
    field: 'repairSupplier',
    minWidth: 200,
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      // @ts-ignore
      cacheField: 'repairSupplierName',
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
        nameFormat: ['name', '/', 'code'],
        onChange: (value: string, _: any, { row }: any) => {
          if (!value) {
            row.supplierName = '';
          }
        },
      },
    },
  },
];

export const modifySupplierEditRules = {
  repairSupplier: [{ required: true, message: t('common.required') }],
};
