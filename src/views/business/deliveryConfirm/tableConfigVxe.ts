import { STATUS_OPTIONS, PRODUCTION_LIST } from '/@/components/CustomComponents/src/quality/Constant';
import { useI18n } from '/@/hooks/web/useI18n';
import dayjs from 'dayjs';
import { useBaseStore } from '/@/store/modules/base';
import { getFactoryList } from '/@/api/customerSerivce';
import { useUserStore } from '/@/store/modules/user';

const { t } = useI18n();
const baseStore = useBaseStore();

/**
 * tabs 枚举
 */
export enum TABS_ENUM {
  待处理 = '1',
  已处理 = '2',
}

export const IS_SATISFY_LIST = [
  { id: 1, fullName: t('dict.OpinionTypeEnum.Satisfy'), value: 1, label: t('dict.OpinionTypeEnum.Satisfy'), theme: 'green' },
  { id: 0, fullName: t('dict.OpinionTypeEnum.Discontent'), value: 2, label: t('dict.OpinionTypeEnum.Discontent'), theme: 'yellow' },
];

export const statusOptions = [
  { id: '0', fullName: t('status.applyStatus.waiting'), color: '#FF7B00' },
  { id: '1', fullName: t('status.applyStatus.not'), color: '#B2B2B2' },
  { id: '2', fullName: t('status.applyStatus.applied'), color: '#52C41A' },
];

export const columns: any[] = [
  {
    type: 'checkbox',
    field: 'checkbox',
  },
  { title: t('views.productionPlan.applyNo'), field: 'applyNo', sortable: true, width: 150 },
  {
    title: '需求类型',
    field: 'demandType',
    width: 150,
    i18nField: 'CommonCol.demandType',
    aqpFilter: {
      name: 'ApiSelect',
      cSharpType: 'string',
      props: {
        api: () => baseStore.getDictionaryData('DemandTypeEnum'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: '',
        },
        filterOption: false,
        placeholder: '请选择',
      },
    },
  },
  { title: t('views.productionPlan.insidePartNumber'), field: 'innerMaterialNumber', sortable: true, width: 180 },
  {
    title: '客户要求交期',
    field: 'customerDeliveryTime',
    i18nField: 'customerDeliveryDateTime',
    exportField: 'customerDeliveryDateTime',
    width: 150,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    aqpFilter: {
      name: 'DatePicker',
      format: 'YYYY-MM-DD',
      props: {
        format: 'YYYY-MM-DD',
      },
    },
  },
  {
    title: '首批交期',
    field: 'firstBatchDateTime',
    i18nField: 'firstBatchDateTime',
    width: 120,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    aqpFilter: {
      name: 'DatePicker',
      searchField: 'firstBatchDate',
      format: 'YYYY-MM-DD',
      props: {
        format: 'YYYY-MM-DD',
      },
    },
  },
  {
    title: '是否满足',
    field: 'isSatisfy',
    width: 120,
    i18nField: 'isSatisfyDesc',
    cellRender: {
      name: 'Tag',
      options: IS_SATISFY_LIST,
    },
    aqpFilter: {
      enabled: true,
      cSharpType: 'int',
      name: 'ASelect',
      props: {
        options: IS_SATISFY_LIST,
        fieldNames: {
          labelField: 'fullName',
          valueField: 'id',
        },
      },
    },
  },
  {
    title: '工厂',
    field: 'factory',
    width: 160,
    aqpFilter: {
      enabled: true,
      searchField: 'factoryName',
    },
  },
  {
    title: '终端客户料号',
    field: 'terminalCustomerPartNumber',
    width: 160,
  },
  {
    title: '直接客户料号',
    field: 'immediateCustomerPartNumber',
    width: 160,
  },
  {
    title: '状态',
    field: 'status',
    i18nField: 'CommonCol.status',
    width: 100,
    cellRender: {
      name: 'Tag',
      options: STATUS_OPTIONS,
    },
    aqpFilter: {
      enabled: true,
      cSharpType: 'int',
      name: 'ASelect',
      props: {
        options: STATUS_OPTIONS,
        fieldNames: {
          labelField: 'fullName',
          valueField: 'id',
        },
      },
    },
  },
  {
    title: '当前节点',
    field: 'currentNodeName',
    i18nField: 'CommonCol.currentNode',
    width: 160,
    aqpFilter: {
      enabled: false,
    },
  },
  {
    title: '当前处理人',
    field: 'currentProcessor',
    i18nField: 'CommonCol.currentNodeUser',
    width: 220,
    aqpFilter: {
      enabled: true,
      searchField: 'currentProcessorId',
      name: 'CustomUserSelect',
    },
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
    title: '需求数量(PCS)',
    field: 'peakQty',
    width: 160,
    aqpFilter: {
      cSharpType: 'int',
    },
  },
  {
    title: '生产类型',
    field: 'productionType',
    i18nField: 'productionTypeDesc',
    exportField: 'productionTypeDesc',
    width: 120,
    formatter: ({ cellValue }) => PRODUCTION_LIST.find(el => el.id == cellValue)?.fullName || '',
    aqpFilter: {
      enabled: true,
      cSharpType: 'int',
      name: 'ASelect',
      props: {
        options: PRODUCTION_LIST,
        fieldNames: {
          labelField: 'fullName',
          valueField: 'id',
        },
      },
    },
  },
  {
    title: '产品描述',
    field: 'productDesc',
    width: 120,
  },
  // {
  //   title: 'PD',
  //   field: 'pdName',
  //   width: 180,
  // },
  {
    title: '终端项目阶段',
    field: 'projectPhase',
    width: 160,
  },
  {
    title: '交货计划备注',
    field: 'deliveryPlanRemark',
    width: 160,
  },
  // { title: t('views.productionPlan.demandQtyPC'), field: 'DemandQty', key: 'DemandQty', width: 140, sortable: true },
  // { title: t('views.productionPlan.estimatedProductionTime'), field: 'EstimatedProductionTime', key: 'EstimatedProductionTime', width: 130, sortable: true },
  // { title: t('views.productionPlan.peakQty'), field: 'PeakQty', key: 'PeakQty', width: 120, sortable: true },
  // { title: t('views.productionPlan.currentProcessor'), field: 'CurrentProcessor', key: 'CurrentProcessor', width: 180, sortable: true },
  // 操作行
  {
    title: t('common.action'),
    width: '80',
    field: 'action',
    fixed: 'right',
    slots: {
      default: 'action',
    },
  },
];

export const schemas = (tab: TABS_ENUM) => {
  const userId = useUserStore().getUserInfo?.userId;
  return [
    {
      fieldName: 'applyNo', //单号
      component: 'Input',
      labelWidth: 100,
      componentProps: {
        placeholder: t('views.productionPlan.applyNo'),
        maxlength: 50,
      },
    },
    {
      fieldName: 'innerMaterialNumber', //产品内部料号
      component: 'Input',
      componentProps: { placeholder: t('views.productionPlan.insidePartNumber'), maxlength: 50 },
    },
    {
      fieldName: 'currentProcessorId',
      component: 'CustomUserSelect',
      labelWidth: 100,
      componentProps: {
        // 待处理默认当前人，已处理不默认
        defaultValue: tab === TABS_ENUM.待处理 ? userId : undefined,
        placeholder: t('views.productionPlan.currentProcessor'),
        allowClear: true,
      },
    },
    {
      fieldName: 'factoryName',
      i18nField: 'CommonCol.factory',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '工厂',
        api: getFactoryList,
        resultField: 'data',
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'factory',
        },
        valueField: 'Id',
        immediate: false,
        filterOption: false,
        nameFormat: ['Code', '/', 'Name'],
      },
    },
    {
      fieldName: 'demandType',
      i18nField: 'dict.CommonCol.demandType',
      component: 'ApiSelect',
      componentProps: {
        api: () => baseStore.getDictionaryData('DemandTypeEnum'),
        allowClear: true,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: '',
        },
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        placeholder: t('dict.CommonCol.demandType'),
        filterOption: false, // 禁止默认搜索
      },
    },
    {
      fieldName: 'applyTime',
      labelWidth: 100,
      component: 'RangePicker',
      componentProps: {
        placeholder: [t('views.productionPlan.applyDate') + t('common.startTime'), t('views.productionPlan.applyDate') + t('common.endTime')],
        valueFormat: 'YYYY-MM-DD',
      },
    },
    // {
    //   fieldName: 'confirmStatus',
    //   i18nField: 'CommonCol.status',
    //   component: 'Select',
    //   componentProps: {
    //     placeholder: t('common.chooseText') + t('views.productionPlan.status'),
    //     submitOnPressEnter: true,
    //     options: statusOptions,
    //     fieldNames: { label: 'fullName', value: 'id' },
    //   },
    // },
  ];
};

export const tabelConfig: any = {
  formOptions: {
    collapsed: true,
    // 是否在字段值改变时提交表单
    submitOnChange: false,
    showCollapseButton: true,
    // 按下回车时是否提交表单
    submitOnEnter: true,
    commonConfig: {
      componentProps: {},
      labelClass: 'w-0',
    },
    wrapperClass: 'grid grid-cols-5 gap-4',
    schema: schemas,
    // i18nConfig: {
    //   moduleCode: 'QuantitativeDeliveryConfirmColumn',
    //   transferRange: ['placeholder'],
    // },
  },
  gridOptions: {
    columns,
    showIndexColumn: true,
    pagerConfig: {
      autoHidden: false,
      pageSize: 100,
    },
    i18nConfig: {
      moduleCode: 'QuantitativeDeliveryConfirmColumn',
    },
    beforeFetch: formatRequestParams,
  },
};

/**
 * 处理请求的参数
 * @param params
 * @returns
 */
export function formatRequestParams(params: any) {
  console.warn('🚀 ~ formatRequestParams ~ params:', params);
  if (Array.isArray(params.applyTime) && params.applyTime.length > 0) {
    params.startTime = convertDateToCNTimestamp(params.applyTime[0]);
    params.endTime = convertDateToCNTimestamp(params.applyTime[1]);
    delete params.applyTime;
  }
  delete params.applyTime;
  return params;
}

/**
 * 将 YYYY-MM-DD 格式日期转换为毫秒时间戳
 * @param dateStr 格式为 YYYY-MM-DD 的日期字符串
 * @returns 对应的毫秒数
 */
export function convertDateToCNTimestamp(dateStr: string): number {
  return dayjs(dateStr).startOf('day').valueOf();
}
