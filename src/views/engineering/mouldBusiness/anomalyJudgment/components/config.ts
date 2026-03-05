import type { VxeGridPropTypes } from '/@/components/VxeTable';

import { useI18n } from '/@/hooks/web/useI18n';
import { statusOptions } from '../config';
import { useBaseStore } from '/@/store/modules/base';
import { EXCEPTION_CATEGORY_ENUM, renderCustomText, renderMultiplePerson, formatPercentage } from '/@/views/productionDeal/mouldBusiness/maintenance/config';
import { getFactoryList } from '/@/api/business/shippingspace';

const { t } = useI18n();
const baseStore = useBaseStore();

/**
 * 清单页 - 表单配置
 */
export function getFormConfig() {
  return [
    {
      fieldName: 'moldRepairApplyNo',
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
    //   fieldName: 'engTechJudgeStatus',
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
      title: '状态',
      field: 'engTechJudgeStatus',
      sortable: true,
      i18nField: 'CommonCol.status',
      filters: [{ data: '' }],
      filterRender: { name: 'ASelect', props: { options: statusOptions, style: { width: '120px' } } },
      width: 160,
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
      title: '需求类型',
      field: 'demandType',
      formatter: ({ cellValue, row }) => row.demandTypeName || cellValue || '',
      filters: [{ data: '' }],
      filterRender: {
        name: 'ApiSelect',
        props: {
          api: () => baseStore.getDictionaryData('MoldRepairDemandType'),
          resultField: 'data',
          labelField: 'fullName',
          valueField: 'enCode',
          allowClear: true,
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
      title: 'SAP工单号',
      field: 'sapWorkOrderNo',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
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
      title: '发生时间',
      field: 'occurrenceTime',
      sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 200,
      cellRender: {
        name: 'Date',
        // @ts-ignore
        format: 'YYYY-MM-dd HH:mm',
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
      title: '生产数量(KPCS)',
      field: 'productionQuantity',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 200,
      aqpFilter: { cSharpType: 'int' },
    },
    {
      title: '不良数(KPCS)',
      field: 'defectiveCountKpcs',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 200,
      aqpFilter: { cSharpType: 'int' },
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
      sortable: true,
      // filters: [{ data: '' }],
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
      width: '120',
      cellRender: {
        name: 'Date',
      },
    },
    // 操作行
    {
      title: t('common.action'),
      width: '60',
      field: 'action',
      fixed: 'right',
      slots: {
        default: 'action',
      },
    },
  ];
}
