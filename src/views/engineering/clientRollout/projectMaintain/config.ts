import { useI18n } from '/@/hooks/web/useI18n';

import { useBaseStore } from '/@/store/modules/base';
import { getFactoryList } from '/@/api/basicData/productCodeApply';
import { getProductStage } from '/@/api/engineering/clientRollout';
import { cloneDeep } from 'lodash-es';

const { t } = useI18n();
const baseStore = useBaseStore();

// 主页form配置
export function getFormSchema() {
  return [
    {
      fieldName: 'factory',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '工厂',
        allowClear: true,
      },
      i18nField: 'FactoryName',
    },
    {
      fieldName: 'insideProjectCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '内部项目代码',
        allowClear: true,
      },
      i18nField: 'InsideProjectCode',
    },
    {
      fieldName: 'pdUserId',
      label: '',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: '创建人',
      },
      i18nField: 'CommonCol.creatorUserName',
    },
    {
      fieldName: 'pdUserId',
      label: '',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: '修改人',
      },
      i18nField: 'CommonCol.updateUser',
    },
  ];
}

// 主页表格column配置
export const columns = [
  { field: 'checkbox', width: 50, type: 'checkbox' },
  {
    title: '状态',
    field: 'status',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ASelect',
      props: {
        fieldNames: {
          label: 'fullName',
          value: 'enCode',
        },
        options: [
          { fullName: t('dict.FilingsApplyDataStatusEnum.0'), enCode: '0' },
          { fullName: t('dict.FilingsApplyDataStatusEnum.1'), enCode: '1' },
        ],
      },
    },
    cellRender: {
      name: 'Tag',
      options: [
        { id: 0, fullName: t('dict.FilingsApplyDataStatusEnum.0'), theme: 'gray', rowKey: 'statusDesc' },
        { id: 1, fullName: t('dict.FilingsApplyDataStatusEnum.1'), theme: 'green', rowKey: 'statusDesc' },
      ],
    },
    width: 120,
    i18nField: 'Status',
  },
  {
    title: '终端项目代码',
    field: 'terminalCustomerProjectCode',
    width: 180,
    i18nField: 'CommonCol.terminalProjectCode',
  },
  {
    title: '上一代终端项目代码',
    field: 'parentProjectCode',
    width: 180,
    i18nField: 'CommonCol.previousTerminalProjectCode',
  },
  {
    title: '终端客户',
    field: 'terminalCustomerName',
    width: 180,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    // i18nField: 'CommonCol.previousTerminalProjectCode',
  },
  {
    title: '产品线',
    field: 'productLineName',
    width: 180,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    // i18nField: 'CommonCol.previousTerminalProjectCode',
  },
  {
    title: '产品内部料号',
    field: 'insidePartNumber',
    width: 160,
    i18nField: 'CommonCol.insidePartNumber',
  },
  {
    title: '内部项目代码',
    field: 'insideProjectCode',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 150,
    i18nField: 'InsideProjectCode',
  },
  {
    title: '工厂',
    field: 'factoryName',
    sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 160,
    i18nField: 'FactoryName',
  },
  {
    title: '客户产品阶段',
    field: 'customerProductStage',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
    i18nField: 'CustomerProductStage',
  },
  {
    title: '内部产品阶段',
    field: 'internalProductStage',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
    i18nField: 'InternalProductStage',
  },
  {
    title: '直接客户代码',
    field: 'directCustomerCode',
    sortable: true,
    width: 120,
    i18nField: 'CommonCol.immediateCustomerCode',
  },
  {
    title: '直接客户名称',
    field: 'directCustomerName',
    sortable: true,
    width: 200,
    i18nField: 'CommonCol.immediateCustomerName',
  },
  {
    title: '阶段开始日期',
    field: 'stageBeginDate',
    sortable: true,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    width: 160,
    i18nField: 'StageBeginDate',
  },
  {
    title: '阶段结束日期',
    field: 'stageEndDate',
    sortable: true,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    width: 160,
    i18nField: 'StageEndDate',
  },

  {
    title: '维护人',
    field: 'maintainersUserName',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
    i18nField: 'MaintainersUserName',
  },
  {
    title: '维护时间',
    field: 'maintenanceTime',
    sortable: true,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    width: 160,
    i18nField: 'MaintenanceTime',
  },
  {
    title: '阶段变更记录',
    field: 'stageChangeLog',
    width: 160,
    slots: {
      default: 'stageChangeLog',
    },
    i18nField: 'CommonCol.phaseChangeRecord',
  },
  {
    title: '主要制程',
    field: 'mainProcess',
    width: 160,
    i18nField: 'MainProcess',
  },
];

export function getExportColumn() {
  return cloneDeep(columns).toSpliced(0, 1);
}

export const MaintainColumn = [
  {
    title: '工厂',
    field: 'factoryCode',
    width: 240,
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      cacheField: 'factoryName',
      props: {
        api: getFactoryList,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data',
        labelField: 'Name',
        valueField: 'Code',
        immediate: true,
      },
    },
    i18nField: 'FactoryName',
  },
  {
    title: '客户产品阶段',
    field: 'customerProductStage',
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      props: {
        api: getProductStage,
        showSearch: false,
        apiSearch: {
          show: true,
          searchName: 'insidePartNumber',
        },
        rowParams: {
          insidePartNumber: 'insidePartNumber',
        },
        resultField: 'data',
        labelField: 'customerProductStage',
        valueField: 'customerProductStage',
        immediate: true,
      },
    },
    width: 160,
    i18nField: 'CustomerProductStage',
  },
  {
    title: '内部产品阶段',
    field: 'internalProductStage',
    editRender: {
      name: 'ApiSelect',
      props: {
        api: getProductStage,
        showSearch: false,
        apiSearch: {
          show: true,
          searchName: 'insidePartNumber',
        },
        rowParams: {
          insidePartNumber: 'insidePartNumber',
        },
        resultField: 'data',
        labelField: 'internalProductStage',
        valueField: 'internalProductStage',
        immediate: true,
      },
    },
    i18nField: 'InternalProductStage',
    width: 160,
  },
  {
    title: '阶段开始日期',
    field: 'stageBeginDate',
    editRender: {
      name: 'DatePicker',
      props: {
        format: 'YYYY-MM-DD',
      },
    },
    width: 160,
    i18nField: 'StageBeginDate',
  },
  {
    title: '阶段结束日期',
    field: 'stageEndDate',
    editRender: {
      name: 'DatePicker',
      props: {
        format: 'YYYY-MM-DD',
      },
    },
    width: 160,
    i18nField: 'StageEndDate',
  },
  {
    title: '主要制程',
    field: 'mainProcess',
    width: 160,
    i18nField: 'MainProcess',
  },
  {
    title: '产品内部料号',
    field: 'insidePartNumber',
    width: 160,
    i18nField: 'CommonCol.insidePartNumber',
  },
  {
    title: '内部项目代码',
    field: 'insideProjectCode',
    width: 160,
    i18nField: 'InsideProjectCode',
  },
  {
    title: '终端项目代码',
    field: 'terminalCustomerProjectCode',
    width: 150,
    i18nField: 'CommonCol.terminalProjectCode',
  },
  {
    title: '上一代终端项目代码',
    field: 'parentProjectCode',
    width: 160,
    i18nField: 'CommonCol.previousTerminalProjectCode',
  },
  {
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: 100,
    fixed: 'right',
  },
];

export const StageChangeLogColumn = [
  {
    title: '产品内部料号',
    field: 'insidePartNumber',
    width: 160,
    i18nField: 'CommonCol.insidePartNumber',
  },
  {
    title: '客户产品阶段',
    field: 'customerProductStage',
    width: 160,
    i18nField: 'CustomerProductStage',
  },
  {
    title: '内部产品阶段',
    field: 'internalProductStage',
    width: 150,
    i18nField: 'InternalProductStage',
  },
  {
    title: '阶段开始日期',
    field: 'stageBeginDate',
    width: 160,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    i18nField: 'StageBeginDate',
  },
  {
    title: '阶段结束日期',
    field: 'stageEndDate',
    width: 160,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    i18nField: 'StageEndDate',
  },
  {
    title: '操作人',
    field: 'operatorName',
    width: 160,
    i18nField: 'CommonCol.operator',
  },
  {
    title: '操作时间',
    field: 'operatingTime',
    width: 160,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    i18nField: 'CommonCol.operatingTime',
  },
];

export const TransitionStageColumn = [
  {
    title: '终端项目代码',
    field: 'terminalCustomerProjectCode',
    width: 160,
    i18nField: 'CommonCol.terminalProjectCode',
  },
  {
    title: '内部项目代码',
    field: 'insideProjectCode',
    width: 160,
    i18nField: 'InsideProjectCode',
  },
  {
    title: '产品内部料号',
    field: 'insidePartNumber',
    i18nField: 'CommonCol.insidePartNumber',
    width: 160,
  },
  {
    title: '客户产品阶段',
    field: 'customerProductStage',
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      props: {
        api: getProductStage,
        showSearch: false,
        apiSearch: {
          show: true,
          searchName: 'insidePartNumber',
        },
        rowParams: {
          insidePartNumber: 'insidePartNumber',
        },
        resultField: 'data',
        labelField: 'customerProductStage',
        valueField: 'customerProductStage',
        immediate: true,
      },
    },
    width: 160,
    i18nField: 'CustomerProductStage',
  },
  {
    title: '内部产品阶段',
    field: 'internalProductStage',
    editRender: {
      name: 'ApiSelect',
      props: {
        api: getProductStage,
        showSearch: false,
        apiSearch: {
          show: true,
          searchName: 'insidePartNumber',
        },
        rowParams: {
          insidePartNumber: 'insidePartNumber',
        },
        resultField: 'data',
        labelField: 'internalProductStage',
        valueField: 'internalProductStage',
        immediate: true,
      },
    },
    i18nField: 'InternalProductStage',
    width: 160,
  },
  {
    title: '阶段开始日期',
    field: 'stageBeginDate',
    editRender: {
      name: 'DatePicker',
      props: {
        // valueFormat: 'YYYY-MM-DD',
        format: 'YYYY-MM-DD',
      },
    },
    width: 160,
    i18nField: 'StageBeginDate',
  },
  {
    title: '阶段结束日期',
    field: 'stageEndDate',
    editRender: {
      name: 'DatePicker',
      props: {
        // valueFormat: 'YYYY-MM-DD',
        format: 'YYYY-MM-DD',
      },
    },
    width: 160,
    i18nField: 'StageEndDate',
  },
];
