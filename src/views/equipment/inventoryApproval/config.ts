import { cloneDeep } from 'lodash-es';
import { useI18n } from '/@/hooks/web/useI18n';
import { getfactoryarealist } from '/@/api/equipment/equipmentLedger';

import { useBaseStore } from '/@/store/modules/base';

const { t } = useI18n();
const baseStore = useBaseStore();

// 主页form配置
export function getFormSchema() {
  return [
    {
      field: 'batchNo',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '版本号',
      },
      i18nField: 'CommonCol.version',
    },
    {
      field: 'weeks',
      label: '',
      component: 'WeekPicker',
      componentProps: {
        placeholder: t('dict.FcDataColumn.searchDate'),
        // valueFormat: 'YYYY-ww',
      },
      i18nField: 'CommonCol.weeks',
    },
    {
      field: 'factoryArea',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        api: getfactoryarealist,
        showSearch: true,
        apiSearch: {
          show: false,
          // searchName: 'equipmentCode',
        },
        resultField: 'data',
        labelField: 'name',
        valueField: 'code',
        immediate: true,
        placeholder: 'SBU(小厂)',
      },
      i18nField: 'factoryAreaName',
    },
    {
      field: 'equipmentManager',
      label: '',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: '申请人',
      },
      i18nField: 'CommonCol.applyUserName',
    },
  ];
}

// 主页表格column配置
const column = [
  {
    title: '版本',
    // sortable: true,
    field: 'batchNo',
    width: 180,
    slots: { default: 'batchNo' },
    i18nField: 'CommonCol.version',
  },
  {
    title: '周数',
    field: 'dataWeeks',
    width: 160,
    i18nField: 'CommonCol.weeks',
  },
  {
    title: 'SBU(小厂)',
    field: 'factoryAreaName',
    width: 160,
    // i18nField: 'CommonCol.oldMoldNo',
  },
  {
    title: '状态',
    field: 'status',
    // sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      searchField: 'status',
      props: {
        api: () => baseStore.getDictionaryData('equipmentLedgerStatus'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: '',
        },
        filterOption: false,
        notFoundContent: null,
      },
    },
    cellRender: {
      name: 'Tag',
      options: [
        // 草稿
        { id: 0, fullName: t('dict.equipmentLedgerStatus.0'), theme: 'yellow', rowKey: 'statusDesc' },
        // 审批中
        { id: 1, fullName: t('dict.equipmentLedgerStatus.1'), theme: 'blue', rowKey: 'statusDesc' },
        // 已审批
        { id: 2, fullName: t('dict.equipmentLedgerStatus.2'), theme: 'green', rowKey: 'statusDesc' },
        // 废弃中
        { id: 3, fullName: t('dict.equipmentLedgerStatus.3'), theme: 'gray', rowKey: 'statusDesc' },
        // 已废弃
        { id: 4, fullName: t('dict.equipmentLedgerStatus.4'), theme: 'red', rowKey: 'statusDesc' },
        // 驳回
        { id: 5, fullName: t('dict.equipmentLedgerStatus.5'), theme: 'red', rowKey: 'statusDesc' },
        // 撤回
        { id: 6, fullName: t('dict.equipmentLedgerStatus.6'), theme: 'purple', rowKey: 'statusDesc' },
      ],
    },
    width: 120,
    i18nField: 'CommonCol.status',
  },
  {
    title: '当前处理人',
    field: 'currentProcessorName',
    // sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'CustomUserSelect',
      searchField: 'currentProcessor',
    },
    width: 160,
    i18nField: 'CommonCol.currentProcessorName',
  },
  {
    title: '当前节点',
    field: 'currentNodeName',
    // sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      searchField: 'currentNode',
      props: {
        api: () => baseStore.getDictionaryData('EquipmentLedgerFlowNode'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: '',
        },
        filterOption: false,
        notFoundContent: null,
      },
    },
    i18nField: 'CommonCol.currentNodeName',
    width: 160,
  },
  {
    title: '节点记录',
    field: 'record',
    slots: { default: 'record' },
    width: 100,
    i18nField: 'CommonCol.nodeRecord',
  },
  {
    title: '申请人',
    field: 'equipmentManagerName',
    // sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'CustomUserSelect',
      searchField: 'equipmentManager',
    },
    i18nField: 'CommonCol.applyUserName',
    width: 160,
  },
  {
    title: '申请时间',
    field: 'creatorTime',
    // sortable: true,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    i18nField: 'CommonCol.applyTime',
    width: 160,
  },
  {
    title: '预对标分析报表',
    field: 'pdUserName',
    slots: { default: 'analysisReport' },
    i18nField: 'CommonCol.preBenchmarkeReport',
    width: 160,
  },
  {
    title: 'NG原因分析',
    field: 'NGReasonAnalysis',
    width: 160,
  },
];

export function getColumn(): any {
  const columnData = cloneDeep(column);
  columnData.unshift({ type: 'checkbox', field: 'checkbox', width: 70 });
  return columnData;
}
