import { cloneDeep } from 'lodash-es';
import { useI18n } from '/@/hooks/web/useI18n';
import { getFactoryList } from '/@/api/basicData/productCodeApply';
import dayjs from 'dayjs';
import { tipCont } from '../utils/constant';
import XEUtils from 'xe-utils';
import { useBaseStore } from '/@/store/modules/base';
import { getSapFactoryList } from '/@/api/purchase/supplierInformation';
const { t } = useI18n();
const baseStore = useBaseStore();

const moldNoversionFormat = list => {
  if (!Array.isArray(list) || list.length == 0) return '';
  return list.map(item => item.code).join(' , ');
};

// 主页form配置
export function getFormSchema() {
  return [
    {
      fieldName: 'searchDate',
      label: '',
      component: 'WeekPicker',
      componentProps: {
        placeholder: t('dict.FcDataColumn.searchDate'),
        // valueFormat: 'YYYY-ww',
      },
      // defaultValue: getYearWeek(),
      defaultValue: dayjs(new Date()),
    },
    {
      fieldName: 'innerMaterialCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '产品内部料号',
      },
    },
    {
      fieldName: 'factoryArea',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        api: getFactoryList,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        immediate: true,
        resultField: 'data',
        labelField: 'Name',
        valueField: 'Code',
        nameFormat: ['Code', '/', 'Name'],
        placeholder: t('dict.CommonCol.factoryName'),
      },
    },
    {
      fieldName: 'project',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '项目名称',
      },
    },
  ];
}

// 主页表格column配置
const column: any = [
  {
    title: '校验信息',
    field: 'errorStatus',
    i18nField: 'errorMsg',
    width: 120,
    showOverflow: false,
    slots: { default: 'errorMsg' },
    aqpFilter: {
      enable: false,
    },
  },
  {
    title: '工厂',
    field: 'factoryAreaName',
    width: 100,
    sortable: true,
    sortBy: 'factoryArea',
    aqpFilter: {
      enable: true,
      name: 'ApiSelect',
      searchField: 'factoryArea',
      props: {
        api: getFactoryList,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        immediate: true,
        resultField: 'data',
        labelField: 'Name',
        valueField: 'Code',
        nameFormat: ['Code', '/', 'Name'],
      },
    },
  },
  {
    title: 'SAP工厂',
    field: 'sapFactoryCode',
    width: 100,
    sortable: true,
    formatter: ({ cellValue, row }) => {
      const sapFactoryName = row.sapFactoryName ? `/${row.sapFactoryName}` : '';
      return cellValue ? `${cellValue}${sapFactoryName}` : '';
    },
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    aqpFilter: {
      enable: true,
      name: 'ApiSelect',
      searchField: 'sapFactoryCode',
      props: {
        api: getSapFactoryList,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        immediate: true,
        resultField: 'data',
        labelField: 'name',
        valueField: 'code',
        nameFormat: ['code', '/', 'name'],
      },
    },
  },
  {
    title: '周数',
    field: 'week',
    sortable: true,
    width: 60,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    aqpFilter: {
      enable: true,
      name: 'InputNumber',
    },
  },
  {
    title: '产品内部料号',
    field: 'innerMaterialCode',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 170,
  },
  {
    title: '合并料号',
    field: 'mergeMaterialCode',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 150,
  },
  {
    title: '合并料号分配说明',
    field: 'mergeMaterialDes',
    width: 130,
    slots: { default: 'mergeMaterialDes' },
  },
  {
    title: '交付风险等级',
    field: 'riskLevel',
    i18nField: 'riskLevelDes',
    sortable: true,
    cellRender: {
      name: 'Tag',
      options: [
        { id: 1, theme: 'blue', rowKey: 'riskLevelDes' },
        { id: 2, theme: 'yellow', rowKey: 'riskLevelDes' },
        { id: 3, theme: 'red', rowKey: 'riskLevelDes' },
      ],
    },
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      searchField: 'riskLevel',
      cSharpType: 'int',
      props: {
        api: () => baseStore.getDictionaryData('riskLevel'),
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
    width: 150,
    titleSuffix: {
      content: tipCont.riskLevel,
    },
  },
  {
    title: '出货计划',
    field: 'deliverySchedule',
    children: [
      {
        title: '当周',
        field: 'currentWeek',
        width: 60,
        cellRender: {
          name: 'Number',
        },
        // sortable: true,
        // filters: [{ data: '' }],
        // filterRender: {
        //   name: 'Input',
        // },
      },
      {
        title: '当周需求修正',
        field: 'currentWeekDemandUpdate',
        width: 90,
        i18nField: 'currentWeekDemandUpdate',
        cellRender: {
          name: 'Number',
        },
        // sortable: true,
        // filters: [{ data: '' }],
        // filterRender: {
        //   name: 'Input',
        // },
      },
      {
        title: '4周',
        field: 'fourWeek',
        width: 60,
        slots: { default: 'fourWeek' },
        // cellRender: {
        //   name: 'Number',
        // },
        // sortable: true,
        // filters: [{ data: '' }],
        // filterRender: {
        //   name: 'Input',
        // },
      },
      {
        title: 'FC备注',
        field: 'fcRemark',
        width: 80,
      },
    ],
  },
  {
    title: '成品/VMI',
    field: 'finishedProduct',
    children: [
      {
        title: '成品库存',
        field: 'originalStockCost',
        i18nField: 'stockCost',
        width: 80,
        cellRender: {
          name: 'Number',
        },
        // sortable: true,
        // filters: [{ data: '' }],
        // filterRender: {
        //   name: 'Input',
        // },
      },
      {
        title: 'VMI库存',
        field: 'stockWMI',
        width: 70,
        cellRender: {
          name: 'Number',
        },
        // sortable: true,
        // filters: [{ data: '' }],
        // filterRender: {
        //   name: 'Input',
        // },
      },
    ],
  },
  {
    title: 'WIP',
    field: 'WIP',
    children: [
      {
        title: '待模切',
        field: 'waitDiecut',
        width: 60,
        cellRender: {
          name: 'Number',
        },
        // sortable: true,
        // filters: [{ data: '' }],
        // filterRender: {
        //   name: 'Input',
        // },
      },
      {
        title: '待手工',
        field: 'waitManual',
        width: 60,
        cellRender: {
          name: 'Number',
        },
        // sortable: true,
        // filters: [{ data: '' }],
        // filterRender: {
        //   name: 'Input',
        // },
      },
      {
        title: '待入库',
        field: 'waitInStore',
        width: 60,
        cellRender: {
          name: 'Number',
        },
        // sortable: true,
        // filters: [{ data: '' }],
        // filterRender: {
        //   name: 'Input',
        // },
      },
      {
        title: '合计',
        field: 'originalInProduction',
        i18nField: 'inProduction',
        width: 60,
        cellRender: {
          name: 'Number',
        },
        // sortable: true,
        // filters: [{ data: '' }],
        // filterRender: {
        //   name: 'Input',
        // },
      },
    ],
  },
  {
    title: '在途',
    field: 'originalInTransit',
    i18nField: 'inTransit',
    width: 60,
    cellRender: {
      name: 'Number',
    },
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
  },
  {
    title: 'COVER周数',
    field: 'cover',
    children: [
      {
        title: '库存',
        titleSuffix: {
          content: tipCont.cover,
        },
        field: 'stock',
        width: 60, // 标准版: 80
        // slots: { default: 'stock' },
        formatter: ({ row }) => row.stockTips || XEUtils.commafy(row.stock),
        // sortable: true,
        // filters: [{ data: '' }],
        // filterRender: {
        //   name: 'Input',
        // },
        aqpFilter: {
          name: 'InputNumber',
        },
      },
      {
        title: '库存+(在制/在途)',
        titleSuffix: {
          content: tipCont.stockInProduction,
        },
        field: 'stockInProduction',
        width: 140,
        formatter: ({ row }) => row.stockInProductionTips || XEUtils.commafy(row.stockInProduction),
        // sortable: true,
        // filters: [{ data: '' }],
        // filterRender: {
        //   name: 'Input',
        // },
        aqpFilter: {
          name: 'InputNumber',
        },
      },
    ],
  },
  {
    title: '建议排产数',
    field: 'suggestPPSCount',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 120,
    titleSuffix: {
      content: tipCont.suggestPPSCount,
    },
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '要求排产数',
    field: 'requirePPSCount',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 100,
    titleSuffix: {
      content: tipCont.requirePPSCount,
    },
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '排产触发周数',
    field: 'triggerWeeksPPS',
    sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 130,
    titleSuffix: {
      content: tipCont.triggerWeeksPPS,
    },
    aqpFilter: {
      name: 'InputNumber',
    },
  },
  {
    title: '排产上限周数',
    field: 'upperWeeksPPS',
    sortable: true,
    width: 130,
    titleSuffix: {
      content: tipCont.upperWeeksPPS,
    },
    aqpFilter: {
      name: 'InputNumber',
    },
  },
  {
    title: '排产释放周数',
    field: 'releaseWeeksPPS',
    sortable: true,
    width: 130,
    titleSuffix: {
      content: tipCont.releaseWeeksPPS,
    },
    aqpFilter: {
      name: 'InputNumber',
    },
  },
  {
    title: '后四需求/前四出货的增幅',
    field: 'lastFourDemand',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 190,
    titleSuffix: {
      content: tipCont.lastFourDemand,
    },
    slots: { default: 'lastFourDemand' },
    aqpFilter: {
      name: 'InputNumber',
    },
  },
  {
    title: '排产建议',
    field: 'suggestPPS',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 120,
    titleSuffix: {
      content: tipCont.suggestPPS,
    },
  },
  {
    title: '要求供应商交期',
    field: 'requireSupplierDelivery',
    sortable: true,
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 170,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    titleSuffix: {
      content: tipCont.requireSupplierDelivery,
    },
  },
  {
    title: '供应商交期',
    field: 'supplierDelivery',
    sortable: true,
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 140,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    titleSuffix: {
      content: tipCont.supplierDelivery,
    },
  },
  {
    title: '供应商备注',
    field: 'supplierRemark',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 140,
    titleSuffix: {
      content: tipCont.supplierRemark,
    },
  },
  {
    title: '模具信息',
    field: 'moldInfo',
    children: [
      {
        title: '套数',
        field: 'setCount',
        width: 40,
        // sortable: true,
        // filters: [{ data: '' }],
        // filterRender: {
        //   name: 'Input',
        // },
        aqpFilter: {
          name: 'InputNumber',
        },
      },
      {
        title: '模具版本号',
        field: 'moldNoversion',
        width: 80,
        formatter: ({ row }) => {
          return moldNoversionFormat(row.moldNoversionList);
        },
        // filters: [{ data: '' }],
        // filterRender: {
        //   name: 'Input',
        // },
      },
    ],
  },
  {
    title: '排程交期',
    field: 'schedulingDelivery',
    sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 130,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    titleSuffix: {
      content: tipCont.schedulingDelivery,
    },
  },
  {
    title: '排程备注',
    field: 'schedulingRemark',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 120,
  },
  {
    title: '回复交期',
    field: 'replyDeliveryDate',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 120,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  {
    title: '客户确认交期',
    field: 'confirmDelivery',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 140,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  {
    title: '推送状态',
    field: 'isPushMrp',
    minWidth: 100,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      searchField: 'isPushMrp',
      cSharpType: 'int',
      props: {
        api: () => baseStore.getDictionaryData('isPushed'),
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
        { id: 3, fullName: t('dict.isPushed.3'), theme: 'green' },
        { id: 2, fullName: t('dict.isPushed.2'), theme: 'red' },
        { id: 1, fullName: t('dict.isPushed.1'), theme: 'gray' },
      ],
    },
  },
  {
    title: 'FC单号',
    field: 'fcVersionNo',
    sortable: true,
    width: 100,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '年份',
    field: 'years',
    sortable: true,
    width: 60,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    aqpFilter: {
      name: 'InputNumber',
    },
  },
  {
    title: '状态',
    field: 'masterDemandPlanStatus',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      cSharpType: 'int',
      searchField: 'masterDemandPlanStatus',
      props: {
        api: () => baseStore.getDictionaryData('masterDemandPlanStatus'),
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
      cSharpType: 'int',
      options: [
        { id: 1, fullName: t('dict.masterDemandPlanStatus.1'), theme: 'gray', rowKey: 'statusDesc' },
        { id: 2, fullName: t('dict.masterDemandPlanStatus.2'), theme: 'green', rowKey: 'statusDesc' },
        { id: 3, fullName: t('dict.masterDemandPlanStatus.3'), theme: 'green', rowKey: 'statusDesc' },
        { id: 4, fullName: t('dict.masterDemandPlanStatus.4'), theme: 'green', rowKey: 'statusDesc' },
        { id: 5, fullName: t('dict.masterDemandPlanStatus.5'), theme: 'green', rowKey: 'statusDesc' },
        { id: 6, fullName: t('dict.masterDemandPlanStatus.6'), theme: 'green', rowKey: 'statusDesc' },
      ],
    },
    width: 80,
  },
  {
    title: '通知客服',
    field: 'notifyCustomer',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      searchField: 'notifyCustomer',
      props: {
        api: () => baseStore.getDictionaryData('isNotifyCustomer'),
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
        { id: 1, fullName: t('dict.isNotifyCustomer.1'), theme: 'red', rowKey: 'statusDesc' },
        { id: 2, fullName: t('dict.isNotifyCustomer.2'), theme: 'green', rowKey: 'statusDesc' },
      ],
    },
    width: 120,
    i18nField: 'notifyCustomerDes',
  },
  {
    title: '需求类型',
    field: 'demandType',
    i18nField: 'demandTypeDes',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      searchField: 'demandType',
      cSharpType: 'int',
      props: {
        api: () => baseStore.getDictionaryData('demandType'),
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
        { id: 1, fullName: t('dict.demandType.1'), theme: 'blue', rowKey: 'statusDesc' },
        { id: 2, fullName: t('dict.demandType.2'), theme: 'green', rowKey: 'statusDesc' },
      ],
    },
    width: 120,
  },
  {
    title: '生产类型',
    field: 'productionType',
    i18nField: 'productionTypeDes',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      searchField: 'productionType',
      cSharpType: 'int',
      props: {
        api: () => baseStore.getDictionaryData('ProductionType'),
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
        { id: 1, fullName: t('dict.ProductionType.1'), theme: 'blue', rowKey: 'statusDesc' },
        { id: 2, fullName: t('dict.ProductionType.2'), theme: 'green', rowKey: 'statusDesc' },
        { id: 3, fullName: t('dict.ProductionType.3'), theme: 'green', rowKey: 'statusDesc' },
      ],
    },
    width: 120,
  },
  {
    title: '旧料号',
    field: 'pnOld',
    sortable: true,
    width: 160,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '是否保税',
    field: 'isBonded',
    sortable: true,
    i18nField: 'isBondedDes',
    cellRender: {
      name: 'Tag',
      options: [
        { id: 2, fullName: t('dict.Bool.2'), theme: 'red', rowKey: 'statusDesc' },
        { id: 1, fullName: t('dict.Bool.1'), theme: 'green', rowKey: 'statusDesc' },
      ],
    },
    filters: [{ data: '' }],
    filterRender: {
      name: 'ASelect',
      cSharpType: 'int',
      props: {
        options: [
          { id: 2, fullName: t('dict.Bool.2'), theme: 'red', rowKey: 'statusDesc' },
          { id: 1, fullName: t('dict.Bool.1'), theme: 'green', rowKey: 'statusDesc' },
        ],
      },
    },
    width: 110,
  },
  {
    title: '币别',
    field: 'currency',
    sortable: true,
    width: 80,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '终端客户料号',
    field: 'terminalCMC',
    sortable: true,
    width: 130,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '产品线',
    field: 'productLine',
    sortable: true,
    width: 100,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '项目',
    field: 'project',
    sortable: true,
    width: 80,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '建议排产数更新记录',
    field: 'prodLog',
    slots: { default: 'prodLog' },
    width: 150,
    titleSuffix: {
      content: tipCont.prodLog,
    },
  },
  {
    title: '要求排产数更新记录',
    field: 'reqdLog',
    slots: { default: 'reqdLog' },
    width: 160,
    titleSuffix: {
      content: tipCont.reqdLog,
    },
  },
  {
    title: '客服',
    field: 'customerName',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 140,
  },
  {
    title: 'PD',
    field: 'pdName',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 140,
  },
  {
    title: 'PC',
    field: 'pcName',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 140,
  },
  {
    title: 'MC',
    field: 'mcName',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 140,
  },
  {
    title: '车间计划',
    field: 'workshopPlanName',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 120,
  },
  {
    title: '物料采购',
    field: 'materialPurchaseName',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 120,
  },
  {
    title: '其他信息',
    field: 'otherRemark',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 120,
  },
];

export function getColumn(activeKey): any {
  let columnData = cloneDeep(column);
  if (activeKey === 'PR') {
    const nodeList = [
      {
        title: '当前处理人',
        field: 'handlePerson',
        // sortable: true,
        // filters: [{ data: '' }],
        // filterRender: {
        //   name: 'Input',
        // },
        width: 150,
      },
      {
        title: '当前节点',
        field: 'currentNode',
        // sortable: true,
        // filters: [{ data: '' }],
        // filterRender: {
        //   name: 'Input',
        // },
        width: 120,
      },
      {
        title: '节点记录',
        field: 'nodeLog',
        // sortable: true,
        // filters: [{ data: '' }],
        // filterRender: {
        //   name: 'Input',
        // },
        width: 120,
        slots: { default: 'NodeRecords' },
      },
    ];
    columnData.splice(17, 0, ...nodeList);
  }
  columnData.unshift({ type: 'checkbox', field: 'checkbox', width: 40 });
  return columnData;
}

export const getEditColumn = () => {
  return [
    {
      title: '是否要推送物料需求',
      field: 'toPushMrp',
      width: 130,
      slots: { default: 'toPushMrp' },
      // cellRender: {
      //   name: 'Tag',
      //   options: [
      //     { id: 0, fullName: t('dict.YesOrNo.0'), theme: 'red', rowKey: 'statusDesc' },
      //     { id: 1, fullName: t('dict.YesOrNo.1'), theme: 'green', rowKey: 'statusDesc' },
      //   ],
      // },
    },
    {
      title: '产品内部料号',
      field: 'innerMaterialCode',
      width: 150,
    },
    {
      title: 'SAP工厂',
      field: 'sapFactoryCode',
      width: 100,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'sapFactoryName',
        props: {
          api: getSapFactoryList,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          rowParams: {
            factoryCode: 'factoryArea',
            isBonded: 'isBonded',
          },
          beforeFetch: params => {
            // 转换isBoned格式
            if (params.isBonded) {
              params.isBonded = params.isBonded == 1;
            }
            return params;
          },
          afterFetch: res => {
            // 对data中的list，进行去重,如果有相同code的，直接splice
            const list = res.data;
            const codeMap = {};
            list.forEach(item => {
              if (codeMap[item.code]) {
                list.splice(list.indexOf(item), 1);
              } else {
                codeMap[item.code] = item;
              }
            });
            res.data = list;
            return res;
          },
          filterOptions: false,
          resultField: 'data',
          labelField: 'name',
          valueField: 'code',
          nameFormat: ['code', '/', 'name'],
        },
      },
    },
    {
      title: '产品线',
      field: 'productLine',
      width: 100,
    },
    {
      title: '项目',
      field: 'project',
      width: 100,
      // i18nField: 'CommonCol.oldMoldNo',
    },
    {
      title: '合并料号',
      field: 'mergeMaterialCode',
      width: 140,
    },
    {
      title: '交付风险等级',
      field: 'riskLevel',
      cellRender: {
        name: 'Tag',
        cSharpType: 'int',
        options: [
          { id: 1, theme: 'blue', rowKey: 'riskLevelDes' },
          { id: 2, theme: 'yellow', rowKey: 'riskLevelDes' },
          { id: 3, theme: 'red', rowKey: 'riskLevelDes' },
        ],
      },
      width: 110,
    },
    {
      title: '终端客户料号',
      field: 'terminalCMC',
      width: 140,
    },
    {
      title: '排产触发周数',
      field: 'triggerWeeksPPS',
      width: 110,
      // editRender: {
      //   name: 'Input', // input编辑模式
      // },
    },
    {
      title: '排产上限周数',
      field: 'upperWeeksPPS',
      width: 110,
      // editRender: {
      //   name: 'InputNumber', // input编辑模式
      // },
    },
    {
      title: '排产释放周数',
      field: 'releaseWeeksPPS',
      // sortable: true,
      width: 110,
    },
    {
      title: '首次建议排产数',
      field: 'suggestPPSCount',
      width: 120,
      cellRender: {
        name: 'Number',
      },
    },
    {
      title: '要求排产数',
      field: 'requirePPSCount',
      editRender: {
        name: 'InputNumber', // input编辑模式
        props: {
          min: 0,
          thousands: true,
          // onChange: async (_value, { $grid, data, row }) => {
          //   // 获取可用PO单列表
          //   const debounceFunc = debounce(async row => {
          //     const { data } = await getTopushmrp({ id: row.id, requirePPSCount: row.requirePPSCount });
          //     row.toPushMrp = data == true ? (row.toPushMrp = 1) : (row.toPushMrp = 0);
          //     // $grid.refreshColumn();
          //   }, 300);
          //   debounceFunc(row);
          // },
        },
      },
      width: 120,
    },
    {
      title: '排产建议',
      field: 'suggestPPS',
      width: 160,
      editRender: {
        name: 'Input', // input编辑模式
      },
      titleSuffix: {
        content: tipCont.triggerWeeksPPS,
      },
    },
    {
      title: '后四需求/前四出货的增幅',
      field: 'lastFourDemand',
      width: 200,
      slots: { default: 'lastFourDemand' },
      titleSuffix: {
        content: tipCont.triggerWeeksPPS,
      },
    },
    {
      title: '出货计划',
      field: 'deliverySchedule',
      children: [
        {
          title: '当周',
          field: 'currentWeek',
          width: 80,
          cellRender: {
            name: 'Number',
          },
        },
        {
          title: '当周需求修正',
          field: 'currentWeekDemandUpdate',
          width: 120,
          cellRender: {
            name: 'Number',
          },
        },
        {
          title: '4周',
          field: 'fourWeek',
          width: 80,
          cellRender: {
            name: 'Number',
          },
        },
      ],
    },
    {
      title: '成品/VMI',
      field: 'finishedProduct',
      children: [
        {
          title: '成品库存',
          field: 'originalStockCost',
          i18nField: 'stockCost',
          width: 80,
          cellRender: {
            name: 'Number',
          },
        },
        {
          title: 'VMI库存',
          field: 'stockWMI',
          width: 80,
          cellRender: {
            name: 'Number',
          },
        },
      ],
    },

    {
      title: 'WIP',
      field: 'WIP',
      children: [
        {
          title: '待模切',
          field: 'waitDiecut',
          width: 80,
          cellRender: {
            name: 'Number',
          },
        },
        {
          title: '待手工',
          field: 'waitManual',
          width: 80,
          cellRender: {
            name: 'Number',
          },
        },
        {
          title: '待入库',
          field: 'waitInStore',
          width: 80,
          cellRender: {
            name: 'Number',
          },
        },
        {
          title: '合计',
          field: 'originalInProduction',
          i18nField: 'inProduction',
          width: 80,
          cellRender: {
            name: 'Number',
          },
        },
      ],
    },
    {
      title: 'COVER周数',
      field: 'cover',
      children: [
        {
          title: '库存',
          field: 'stock',
          width: 100,
          formatter: ({ row }) => row.stockTips || XEUtils.commafy(row.stock),
          titleSuffix: {
            content: tipCont.cover,
          },
        },
        {
          title: '库存+在制',
          field: 'stockInProduction',
          width: 100,
          formatter: ({ row }) => row.stockInProductionTips || XEUtils.commafy(row.stockInProduction),
          titleSuffix: {
            content: tipCont.stockInProduction,
          },
        },
      ],
    },
    // {
    //   title: 'COVER周数(按合并料号计算)',
    //   field: 'coverTotal',
    //   children: [
    //     {
    //       title: '库存',
    //       field: 'stockMerge',
    //       width: 100,
    //     },
    //     {
    //       title: '库存+在制',
    //       field: 'stockInProductionMerge',
    //       width: 120,
    //     },
    //   ],
    // },
    {
      title: '客服',
      field: 'customerId',
      i18nField: 'customerName',
      width: 180,
      editRender: {
        cacheField: 'customerName',
        name: 'CustomUserSelect',
      },
    },
    {
      title: 'PD',
      field: 'pdId',
      i18nField: 'pdName',
      width: 180,
      editRender: {
        cacheField: 'pdName',
        name: 'CustomUserSelect',
      },
    },
    {
      title: 'PC',
      field: 'pcId',
      i18nField: 'pcName',
      width: 180,
      editRender: {
        cacheField: 'pcName',
        name: 'CustomUserSelect',
      },
    },
    {
      title: 'MC',
      field: 'mcId',
      i18nField: 'mcName',
      width: 180,
      editRender: {
        cacheField: 'mcName',
        name: 'CustomUserSelect',
      },
    },
    {
      title: '车间计划',
      field: 'workshopPlanId',
      i18nField: 'workshopPlanName',
      width: 180,
      editRender: {
        cacheField: 'workshopPlanName',
        name: 'CustomUserSelect',
      },
    },
    {
      title: '物料采购',
      field: 'materialPurchaseId',
      i18nField: 'materialPurchaseName',
      width: 180,
      editRender: {
        cacheField: 'materialPurchaseName',
        name: 'CustomUserSelect',
      },
    },
    {
      title: '模具信息',
      field: 'moldInfo',
      children: [
        {
          title: '套数',
          field: 'setCount',
          width: 80,
        },
        {
          title: '模具版本号',
          field: 'moldNoversion',
          width: 120,
          formatter: ({ row }) => {
            return moldNoversionFormat(row.moldNoversionList);
          },
        },
      ],
    },
    {
      title: '要求供应商交期',
      field: 'requireSupplierDelivery',
      sortable: true,
      width: 180,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
      titleSuffix: {
        content: tipCont.requireSupplierDelivery,
      },
    },
    {
      title: '供应商交期',
      field: 'supplierDelivery',
      width: 140,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
      titleSuffix: {
        content: tipCont.supplierDelivery,
      },
    },
    {
      title: '供应商备注',
      field: 'supplierRemark',
      width: 140,
      titleSuffix: {
        content: tipCont.triggerWeeksPPS,
      },
    },
    {
      title: '排程交期',
      field: 'schedulingDelivery',
      width: 120,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
      titleSuffix: {
        content: tipCont.triggerWeeksPPS,
      },
    },
    {
      title: '回复交期',
      field: 'replyDeliveryDate',
      width: 120,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
    {
      title: '客户确认交期',
      field: 'confirmDelivery',
      width: 160,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
    {
      title: '其他信息',
      field: 'otherRemark',
      width: 120,
      editRender: {
        name: 'Input', // input编辑模式
      },
    },
  ];
};

export const editRules = {
  // triggerWeeksPPS: [{ required: true, message: t('common.required') }],
  // upperWeeksPPS: [{ required: true, message: t('common.required') }],
  requirePPSCount: [{ required: true, message: t('common.required') }],
  customerId: [{ required: true, message: t('common.required') }],
  pdId: [{ required: true, message: t('common.required') }],
  workshopPlanId: [{ required: true, message: t('common.required') }],
  materialPurchaseId: [
    {
      validator: ({ row, cellValue }) => {
        // 自制非必填，外购必填
        const isOut = row.productionType === 2 && !cellValue;
        return isOut ? new Error(t('common.required')) : Promise.resolve();
      },
    },
  ],
};

export const getPushToProdPlanColumn = () => {
  let columnData = cloneDeep(column);
  return columnData;
};
