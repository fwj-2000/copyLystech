import { useI18n } from '/@/hooks/web/useI18n';
import { getbusinessscopelist, getequipmentcodelist, getfactoryarealist, getBizScopeBulist } from '/@/api/equipment/equipmentLedger';
import dayjs from 'dayjs';

import { useBaseStore } from '/@/store/modules/base';

const { t } = useI18n();
const baseStore = useBaseStore();

export const SAPSchema = [
  {
    field: 'codeS',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      api: getbusinessscopelist,
      showSearch: true,
      apiSearch: {
        show: false,
        // searchName: 'equipmentCode',
      },
      resultField: 'data',
      labelField: 'name',
      valueField: 'code',
      immediate: true,
      placeholder: '业务范围(小厂)',
      i18nField: 'businessScopeCode',
    },
  },
  {
    field: 'equipmentCodeS',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      api: getequipmentcodelist,
      showSearch: true,
      apiSearch: {
        show: true,
        searchName: 'equipmentCode',
      },
      params: {
        pageSize: 100,
      },
      resultField: 'data',
      labelField: 'code',
      valueField: 'code',
      immediate: true,
      placeholder: '设备编码',
      mode: 'multiple',
    },
    i18nField: 'equipmentCode',
  },
  {
    field: 'equipmentSupplier',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '设备供应商',
    },
  },
  {
    field: 'equipmentManagerName',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '设备管理员',
    },
  },
  {
    field: 'isClean',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '是否清理',
    },
  },
  {
    field: 'supplierSerialNo',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '机身序列号',
    },
    i18nField: 'fuselageSerialNo',
  },
];

export const SAPColumn = [
  {
    title: '所属BG',
    field: 'bgName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    sortable: true,
    width: 120,
  },
  {
    title: '公司代码',
    field: 'companyCode',
    width: 120,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    sortable: true,
  },
  {
    title: '公司名称',
    field: 'companyName',
    width: 200,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    sortable: true,
  },
  {
    title: '业务范围',
    field: 'businessScopeCode',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    sortable: true,
    width: 120,
  },
  {
    title: '业务范围描述',
    field: 'businessScopeName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    sortable: true,
    width: 180,
  },
  {
    title: '设备编码',
    field: 'equipmentCode',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 120,
  },
  {
    title: '资产编码',
    field: 'assetCode',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 120,
  },
  {
    title: '描述',
    field: 'description',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '规格型号',
    field: 'specifications',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 120,
  },
  {
    title: '台账创建时间',
    field: 'ledgerCreatorData',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    sortable: true,
    width: 160,
  },
  {
    title: '设备入厂时间',
    field: 'equipmentEntryTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    sortable: true,
    width: 160,
  },
  {
    title: '机身序列号',
    field: 'supplierSerialNo',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    sortable: true,
    i18nField: 'fuselageSerialNo',
    width: 160,
  },
  {
    title: '是否清理',
    field: 'isClean',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    className: ({ row }) => {
      return row.isClean === '是' ? 'cell-red' : '';
    },
    sortable: true,
    width: 120,
  },
  {
    title: '清理原因',
    field: 'cleanReason',
    width: 120,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '资产资本化日期',
    field: 'assetCapitalizationDate',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    sortable: true,
    width: 180,
  },
  {
    title: '普通折旧开始日期',
    field: 'ordinaryDepreciationStartDate',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    sortable: true,
    width: 180,
  },
  {
    title: '资产分类',
    field: 'assetCategory',
    width: 120,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '资产分类描述',
    field: 'assetCategoryDescription',
    width: 180,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '原资产号',
    field: 'originalAssetCode',
    width: 120,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '计划年使用期',
    field: 'planUseYear',
    width: 140,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '数量',
    field: 'quantity',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 100,
  },
  {
    title: '成本中心',
    field: 'costCenter',
    width: 120,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '成本中心描述',
    field: 'costCenterDescription',
    width: 220,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '原值(元)',
    field: 'originalAmount',
    width: 120,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '本期折旧额(元)',
    field: 'currentPeriodDepreciation',
    width: 160,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '累计折旧(元)',
    field: 'accumulatedDepreciation',
    width: 140,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '关联方累计折旧(元)',
    field: 'relatedPartiesDepreciation',
    width: 180,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '总累计折旧(元)',
    field: 'totalDepreciation',
    width: 160,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '账面净值(元)',
    field: 'bookNetValue',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 140,
  },
  {
    title: '账面净额(元)',
    field: 'bookNetAmount',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 140,
  },
  {
    title: '减值准备(元)',
    field: 'impairmentProvision',
    width: 140,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '设备供应商',
    field: 'equipmentSupplier',
    width: 160,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '残值率',
    field: 'residualValueRate',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 100,
  },
  {
    title: 'ABC标识',
    field: 'abcMark',
    width: 100,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '对象类型',
    field: 'objectType',
    width: 120,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '设备管理员工号',
    field: 'equipmentManagerAccount',
    width: 140,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '设备管理员姓名',
    field: 'equipmentManagerName',
    width: 140,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '增值金额(元)',
    field: 'appreciationAmount',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 140,
  },
  {
    title: '财务入账日期',
    field: 'financialPostingDate',
    width: 160,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    sortable: true,
  },
  {
    title: '处理日期',
    field: 'processingDate',
    width: 140,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    sortable: true,
  },
  {
    title: '不活动日期',
    field: 'inactivityDate',
    width: 160,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    sortable: true,
  },
  {
    title: '受限类型',
    field: 'restrictionType',
    width: 140,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '受限到期日',
    field: 'restrictionExpiryDate',
    width: 160,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    sortable: true,
  },
  {
    title: '入账年份',
    field: 'postingYear',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 140,
  },
  {
    title: '剩余期间数',
    field: 'remainingPeriodsNumber',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },

  {
    title: '采购订单号(关联)',
    field: 'purchaseOrderNo',
    width: 160,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '设备铭牌出厂日期',
    field: 'nameplateManufactureDate',
    width: 180,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    sortable: true,
  },
  {
    title: '合计减值准备(元)',
    field: 'totalImpairmentProvision',
    width: 150,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '同步时间',
    field: 'syncTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    sortable: true,
    i18nField: 'CommonCol.synchronize',
    width: 160,
  },
  {
    title: '操作人',
    field: 'syncUserName',
    width: 220,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    sortable: true,
    i18nField: 'CommonCol.operator',
  },
];

export const inventorySchema = [
  {
    fieldName: 'factoryArea',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      api: getfactoryarealist,
      showSearch: true,
      alwaysLoad: true,
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
    fieldName: 'weeks',
    label: '',
    component: 'WeekPicker',
    componentProps: {
      placeholder: t('dict.FcDataColumn.searchDate'),
      // valueFormat: 'YYYY-ww',
    },
    defaultValue: dayjs(new Date()),
    i18nField: 'CommonCol.weeks',
  },
  {
    fieldName: 'equipmentType',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '设备类型',
      api: () => baseStore.getDictionaryData('equipmentType'),
      labelField: 'fullName',
      valueField: 'enCode',
      showSearch: true,
      filterOption: false,
    },
    i18nField: 'equipmentTypeName',
  },
  {
    fieldName: 'equipmentCode',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '设备编码',
    },
  },
];

export const equipmentInventoryColumn = [
  { field: 'checkbox', width: 50, type: 'checkbox' },
  {
    title: 'BU',
    sortable: true,
    field: 'buName',
    i18nField: 'buName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
      searchField: 'bu',
    },
    width: 160,
  },
  {
    title: 'SBU(小厂)',
    field: 'factoryAreaName',
    // filters: [{ data: '' }],
    // filterRender: {
    //   searchField: 'factoryAreaName',
    //   name: 'ApiSelect',
    //   props: {
    //     api: getfactoryarealist,
    //     resultField: 'data',
    //     labelField: 'name',
    //     valueField: 'code',
    //     apiSearch: {
    //       show: false,
    //     },
    //     immediate: true,
    //     showSearch: true,
    //     filterOption: false,
    //     notFoundContent: null,
    //   },
    // },
    sortable: true,
  },
  {
    title: '设备编码',
    field: 'equipmentCode',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    sortable: true,
    width: 150,
  },
  {
    title: '设备类型',
    field: 'equipmentTypeName',
    // filters: [{ data: '' }],
    // filterRender: {
    //   searchField: 'equipmentTypeName',
    //   name: 'ApiSelect',
    //   props: {
    //     api: () => baseStore.getDictionaryData('equipmentType'),
    //     labelField: 'fullName',
    //     valueField: 'enCode',
    //     immediate: true,
    //     showSearch: true,
    //     filterOption: false,
    //     notFoundContent: null,
    //   },
    //   width: 160,
    // },
    sortable: true,
    width: 160,
  },
  {
    title: '设备分类',
    field: 'equipmentCategoryName',
    filters: [{ data: '' }],
    filterRender: {
      searchField: 'equipmentCategory',
      name: 'ApiSelect',
      props: {
        api: () => baseStore.getDictionaryData('equipmentCategory'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: true,
        filterOption: false,
        notFoundContent: null,
      },
      width: 160,
    },
    sortable: true,
  },
  {
    title: '固定资产编号',
    field: 'fixedAssetCode',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '圆刀&平刀工位&型号分类',
    field: 'circularFlatWorkCategoryName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      searchField: 'circularFlatWorkCategory',
      props: {
        api: () => baseStore.getDictionaryData('CFlatWorkCategory'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: false,
        filterOption: false,
        notFoundContent: null,
      },
    },
    sortable: true,
    i18nField: 'CommonCol.circularFlatWorkCategoryName',
    width: 220,
  },
  {
    title: '实际使用型号',
    field: 'actualUseModel',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '设备型号分类',
    field: 'equipmentModelCategory',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    i18nField: 'equipmentModelCategoryName',
    width: 160,
  },
  {
    title: '固定资产名称',
    field: 'fixedAssetName',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },

  {
    title: '规格型号',
    field: 'specifications',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '机身序列号',
    field: 'fuselageSerialNo',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '设备制造商',
    field: 'equipmentVendor',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '是否老领略',
    field: 'isOldLl',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      searchField: 'isOldLl',
      props: {
        api: () => baseStore.getDictionaryData('YesOrNo'),
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
        { id: 0, fullName: t('dict.YesOrNo.0'), theme: 'red', rowKey: 'statusDesc' },
        { id: 1, fullName: t('dict.YesOrNo.1'), theme: 'green', rowKey: 'statusDesc' },
      ],
    },
    i18nField: 'isOldLlName',
    width: 160,
  },
  {
    title: '是否是拼接改装设备',
    field: 'isAssemble',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      searchField: 'isAssemble',
      props: {
        api: () => baseStore.getDictionaryData('isAssembleName'),
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
        { id: 1, fullName: t('dict.isAssembleName.1'), theme: 'green', rowKey: 'statusDesc' },
        { id: 2, fullName: t('dict.isAssembleName.2'), theme: 'red', rowKey: 'statusDesc' },
        { id: 3, fullName: t('dict.isAssembleName.3'), theme: 'blue', rowKey: 'statusDesc' },
      ],
    },
    i18nField: 'isAssembleName',
    width: 180,
  },
  {
    title: '使用状态',
    field: 'useStatusName',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      searchField: 'useStatus',
      name: 'ApiSelect',
      props: {
        api: () => baseStore.getDictionaryData('equipmentUseStatus'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: true,
        filterOption: false,
        notFoundContent: null,
      },
      width: 160,
    },
  },
  {
    title: '闲置分类',
    field: 'freeCategoryName',
    filters: [{ data: '' }],
    filterRender: {
      searchField: 'freeCategory',
      name: 'ApiSelect',
      props: {
        api: () => baseStore.getDictionaryData('freeCategory'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: true,
        filterOption: false,
        notFoundContent: null,
      },
      width: 160,
    },
    sortable: true,
  },
  // {
  //   title: '是否需要联线',
  //   field: 'isNeedConnection',
  //   // sortable: true,
  //   filters: [{ data: '' }],
  //   filterRender: {
  //     name: 'ApiSelect',
  //     searchField: 'isNeedConnection',
  //     props: {
  //       api: () => baseStore.getDictionaryData('YesOrNo'),
  //       labelField: 'fullName',
  //       valueField: 'enCode',
  //       immediate: true,
  //       showSearch: true,
  //       apiSearch: {
  //         show: true,
  //         searchName: '',
  //       },
  //       filterOption: false,
  //       notFoundContent: null,
  //     },
  //   },
  //   cellRender: {
  //     name: 'Tag',
  //     options: [
  //       { id: 0, fullName: t('dict.YesOrNo.0'), theme: 'red', rowKey: 'statusDesc' },
  //       { id: 1, fullName: t('dict.YesOrNo.1'), theme: 'green', rowKey: 'statusDesc' },
  //     ],
  //   },
  //   i18nField: 'isNeedConnectionName',
  //   width: 160,
  // },
  // {
  //   title: '联线状态',
  //   field: 'connectionStatusName',
  //   filters: [{ data: '' }],
  //   filterRender: {
  //     searchField: 'connectionStatus',
  //     name: 'ApiSelect',
  //     props: {
  //       api: () => baseStore.getDictionaryData('connectionStatus'),
  //       labelField: 'fullName',
  //       valueField: 'enCode',
  //       immediate: true,
  //       showSearch: true,
  //       filterOption: false,
  //       notFoundContent: null,
  //     },
  //     width: 160,
  //   },
  // },
  {
    title: '是否需联机',
    field: 'isNeedOnline',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      searchField: 'isNeedOnline',
      props: {
        api: () => baseStore.getDictionaryData('YesOrNo'),
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
        { id: 0, fullName: t('dict.YesOrNo.0'), theme: 'red', rowKey: 'statusDesc' },
        { id: 1, fullName: t('dict.YesOrNo.1'), theme: 'green', rowKey: 'statusDesc' },
      ],
    },
    i18nField: 'isNeedOnlineName',
    width: 160,
  },
  {
    title: '设备联机状态',
    field: 'onlineStatus',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      props: {
        api: () => baseStore.getDictionaryData('OnlineStatus'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: false,
        filterOption: false,
        notFoundContent: null,
      },
    },
    cellRender: {
      name: 'Tag',
      options: [
        { id: 1, fullName: t('dict.OnlineStatus.1'), theme: 'green', rowKey: 'statusDesc' },
        { id: 2, fullName: t('dict.OnlineStatus.2'), theme: 'red', rowKey: 'statusDesc' },
        { id: 3, fullName: t('dict.OnlineStatus.3'), theme: 'gray', rowKey: 'statusDesc' },
      ],
    },
    width: 160,
  },
  {
    title: '绑定的线体号',
    field: 'lineNumber',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    sortable: true,
    width: 160,
  },
  {
    title: '铭牌出厂日期',
    field: 'nameplateManufactureDate',
    sortable: true,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    width: 160,
  },
  {
    title: '改造日期',
    field: 'remoldDate',
    sortable: true,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    width: 140,
  },
  {
    title: '铭牌年限',
    field: 'nameplateYears',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 120,
  },
  {
    title: '铭牌年限分类',
    field: 'nameplateYearsCategoryName',
    filters: [{ data: '' }],
    filterRender: {
      searchField: 'nameplateYearsCategory',
      name: 'ApiSelect',
      props: {
        api: () => baseStore.getDictionaryData('nameplateYearsCategory'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: true,
        filterOption: false,
        notFoundContent: null,
      },
    },
    sortable: true,
    width: 160,
  },
  {
    title: '改造备注',
    field: 'remoldRemark',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '厂区备注',
    field: 'factoryAreaRemark',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '备注',
    field: 'remark',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '创建人',
    field: 'creatorUserName',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    i18nField: 'CommonCol.creatorUserName',
    width: 160,
  },
  {
    title: '创建时间',
    field: 'creatorTime',
    sortable: true,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    i18nField: 'CommonCol.creatorTime',
    width: 160,
  },
  {
    title: '修改人',
    field: 'lastModifyUserName',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    i18nField: 'CommonCol.lastModifyUserName',
    width: 160,
  },
  {
    title: '修改时间',
    field: 'lastModifyTime',
    sortable: true,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    i18nField: 'CommonCol.lastModifyTime',
    width: 160,
  },
];

export const equipmentInventoryColumnExport = [
  { field: 'checkbox', width: 50, type: 'checkbox' },
  {
    title: 'BU',
    field: 'buName',
    i18nField: 'buName',
    width: 160,
  },
  {
    title: 'SBU(小厂)',
    field: 'factoryAreaName',
  },
  {
    title: '设备编码',
    field: 'equipmentCode',
    width: 150,
  },
  {
    title: '设备类型',
    field: 'equipmentTypeName',
  },
  {
    title: '设备分类',
    field: 'equipmentCategoryName',
  },
  {
    title: '固定资产编号',
    field: 'fixedAssetCode',
    width: 160,
  },
  {
    title: '圆刀&平刀工位&型号分类',
    field: 'circularFlatWorkCategoryName',
    i18nField: 'CommonCol.circularFlatWorkCategoryName',
    width: 220,
  },
  {
    title: '实际使用型号',
    field: 'actualUseModel',
    width: 160,
  },
  {
    title: '设备型号分类',
    field: 'equipmentModelCategory',
    width: 160,
  },
  {
    title: '固定资产名称',
    field: 'fixedAssetName',
    width: 160,
  },

  {
    title: '规格型号',
    field: 'specifications',
    width: 160,
  },
  {
    title: '机身序列号',
    field: 'fuselageSerialNo',
    width: 160,
  },
  {
    title: '设备制造商',
    field: 'equipmentVendor',
    width: 160,
  },
  {
    title: '是否老领略',
    field: 'isOldLlName',
    i18nField: 'isOldLlName',
    width: 160,
  },
  {
    title: '是否是拼接改装设备',
    field: 'isAssembleName',
    i18nField: 'isAssembleName',
    width: 180,
  },
  {
    title: '使用状态',
    field: 'useStatusName',
  },
  {
    title: '闲置分类',
    field: 'freeCategoryName',
  },
  {
    title: '是否需联机',
    field: 'isNeedOnlineName',
    width: 160,
  },
  {
    title: '设备联机状态',
    field: 'onlineStatus',
    width: 160,
  },
  {
    title: '绑定的线体号',
    field: 'lineNumber',
    width: 160,
  },
  {
    title: '铭牌出厂日期',
    field: 'nameplateManufactureDate',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    width: 160,
  },
  {
    title: '改造日期',
    field: 'remoldDate',
    width: 160,
  },
  {
    title: '铭牌年限',
    field: 'nameplateYears',
    width: 160,
  },
  {
    title: '铭牌年限分类',
    field: 'nameplateYearsCategoryName',
    width: 160,
  },
  {
    title: '改造备注',
    field: 'remoldRemark',
    width: 160,
  },
  {
    title: '厂区备注',
    field: 'factoryAreaRemark',
    width: 160,
  },
  {
    title: '备注',
    field: 'remark',
    width: 160,
  },
  {
    title: '创建人',
    field: 'creatorUserName',
    i18nField: 'CommonCol.creatorUserName',
    width: 160,
  },
  {
    title: '创建时间',
    field: 'creatorTime',
    sortable: true,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    i18nField: 'CommonCol.creatorTime',
    width: 160,
  },
  {
    title: '修改人',
    field: 'lastModifyUserName',
    i18nField: 'CommonCol.lastModifyUserName',
    width: 160,
  },
  {
    title: '修改时间',
    field: 'lastModifyTime',
    sortable: true,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    i18nField: 'CommonCol.lastModifyTime',
    width: 160,
  },
];

export const inventoryAddSchemas = [
  {
    field: 'factoryArea',
    label: 'SBU(小厂)',
    component: 'ApiSelect',
    required: true,
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
  },
  {
    field: 'equipmentCode',
    label: '设备编码',
    component: 'Input',
    componentProps: {
      placeholder: '设备编码',
    },
  },
  {
    field: 'equipmentType',
    label: '设备类型',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('equipmentType'),
      labelField: 'fullName',
      valueField: 'enCode',
      showSearch: true,
      filterOption: false,
    },
  },
  {
    field: 'equipmentCategory',
    label: '设备分类',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('equipmentCategory'),
      labelField: 'fullName',
      valueField: 'enCode',
      showSearch: true,
      filterOption: false,
    },
  },
  {
    field: 'fixedAssetCode',
    label: '固定资产编号',
    component: 'Input',
    componentProps: {
      placeholder: '固定资产编号',
    },
  },
  {
    field: 'equipmentModelCategory',
    label: '设备型号分类',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('equipmentModelCategory'),
      labelField: 'fullName',
      valueField: 'enCode',
      showSearch: true,
      filterOption: false,
    },
  },
  {
    field: 'fixedAssetName',
    label: '固定资产名称',
    component: 'Input',
    componentProps: {
      placeholder: '固定资产编号',
    },
  },
  {
    field: 'specifications',
    label: '规格型号',
    component: 'Input',
    componentProps: {
      placeholder: '规格型号',
    },
  },
  {
    field: 'fuselageSerialNo',
    label: '机身序列号',
    component: 'Input',
    componentProps: {
      placeholder: '机身序列号',
    },
  },
  {
    field: 'equipmentVendor',
    label: '设备制造商',
    component: 'Input',
    componentProps: {
      placeholder: '设备制造商',
    },
  },
  {
    field: 'isOldLl',
    label: '是否老领略',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('YesOrNo'),
      labelField: 'fullName',
      valueField: 'enCode',
      showSearch: true,
      filterOption: false,
    },
  },
  {
    field: 'isAssemble',
    label: '是否是拼接改装设备',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('isAssembleName'),
      labelField: 'fullName',
      valueField: 'enCode',
      showSearch: true,
      filterOption: false,
    },
  },
  {
    field: 'useStatus',
    label: '使用状态',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('equipmentUseStatus'),
      labelField: 'fullName',
      valueField: 'enCode',
      showSearch: true,
      filterOption: false,
    },
  },
  {
    field: 'freeReasons',
    label: '闲置原因',
    component: 'Input',
    componentProps: {
      placeholder: '闲置原因',
    },
  },
  {
    field: 'freeCategory',
    label: '闲置分类',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('freeCategory'),
      labelField: 'fullName',
      valueField: 'enCode',
      showSearch: true,
      filterOption: false,
    },
  },
  {
    field: 'isNeedConnection',
    label: '是否需要联线',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('YesOrNo'),
      labelField: 'fullName',
      valueField: 'enCode',
      showSearch: true,
      filterOption: false,
    },
  },
  {
    field: 'connectionStatus',
    label: '联线状态',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('connectionStatus'),
      labelField: 'fullName',
      valueField: 'enCode',
      showSearch: true,
      filterOption: false,
    },
  },
  {
    field: 'nameplateManufactureDate',
    label: '铭牌出厂日期',
    component: 'DatePicker',
    componentProps: {
      placeholder: '铭牌出厂日期',
    },
  },
  {
    field: 'nameplateYears',
    label: '铭牌年限',
    component: 'Input',
    componentProps: {
      placeholder: '铭牌年限',
    },
  },
  {
    field: 'nameplateYearsCategory',
    label: '铭牌年限分类',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('nameplateYearsCategory'),
      labelField: 'fullName',
      valueField: 'enCode',
      showSearch: true,
      filterOption: false,
    },
  },
  {
    field: 'factoryAreaRemark',
    label: '厂区备注',
    component: 'Input',
    componentProps: {
      placeholder: '厂区备注',
    },
  },
  {
    field: 'remark',
    label: '备注',
    component: 'Input',
    componentProps: {
      placeholder: '备注',
    },
  },
];

export const importSchemas = [
  {
    field: 'factoryArea',
    label: '',
    component: 'ApiSelect',
    required: true,
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
    field: 'weeks',
    label: '',
    component: 'WeekPicker',
    required: true,
    componentProps: {
      placeholder: t('dict.FcDataColumn.searchDate'),
      // valueFormat: 'YYYY-ww',
    },
    i18nField: 'CommonCol.weeks',
  },
];

export const importColumn = [
  // {
  //   title: 'BU',
  //   dataIndex: 'documentNumber',
  //   showOverflow: 'tooltip',
  //   width: 160,
  // },
  {
    title: 'SBU(小厂)',
    dataIndex: 'factoryAreaName',
    showOverflow: 'tooltip',
  },
  {
    title: '设备编码',
    dataIndex: 'equipmentCode',
    showOverflow: 'tooltip',
    width: 150,
  },
  {
    title: '设备类型',
    dataIndex: 'equipmentTypeName',
    showOverflow: 'tooltip',
    width: 160,
  },
  {
    title: '设备分类',
    dataIndex: 'equipmentCategoryName',
    showOverflow: 'tooltip',
    width: 160,
  },
  {
    title: '固定资产编号',
    dataIndex: 'fixedAssetCode',
    showOverflow: 'tooltip',
    width: 160,
  },
  {
    title: '圆刀&平刀工位&型号分类',
    dataIndex: 'circularFlatWorkCategoryName',
    i18nField: 'CommonCol.circularFlatWorkCategoryName',
    width: 220,
  },
  {
    title: '实际使用型号',
    dataIndex: 'actualUseModel',
    showOverflow: 'tooltip',
    width: 160,
  },
  {
    title: '设备型号分类',
    dataIndex: 'equipmentModelCategoryName',
    showOverflow: 'tooltip',
    width: 160,
  },
  {
    title: '固定资产名称',
    dataIndex: 'fixedAssetName',
    showOverflow: 'tooltip',
    width: 160,
  },

  {
    title: '规格型号',
    dataIndex: 'specifications',
    showOverflow: 'tooltip',
    width: 160,
  },
  {
    title: '机身序列号',
    dataIndex: 'fuselageSerialNo',
    showOverflow: 'tooltip',
    width: 160,
  },
  {
    title: '设备制造商',
    dataIndex: 'equipmentVendor',
    showOverflow: 'tooltip',
    width: 160,
  },
  // {
  //   title: '是否是老领略',
  //   dataIndex: 'documentNumber',
  //   showOverflow: 'tooltip',
  //   width: 160,
  // },
  {
    title: '使用状态',
    dataIndex: 'useStatusName',
    showOverflow: 'tooltip',
    width: 160,
  },
  {
    title: '闲置分类',
    dataIndex: 'freeCategoryName',
    showOverflow: 'tooltip',
    width: 160,
  },
  // {
  //   title: '闲置原因',
  //   dataIndex: 'documentNumber',
  //   showOverflow: 'tooltip',
  //   width: 160,
  // },

  // {
  //   title: '联线状态',
  //   dataIndex: 'connectionStatusName',
  //   showOverflow: 'tooltip',
  //   width: 160,
  // },
  {
    title: '是否是拼接改装设备',
    dataIndex: 'isAssembleName',
    width: 200,
  },
  // {
  //   title: '工位备注',
  //   field: 'productName',
  //   // sortable: true,
  //   filters: [{ data: '' }],
  //   filterRender: {
  //     name: 'Input',
  //   },
  //   width: 160,
  // },
  {
    title: '铭牌出厂日期',
    dataIndex: 'nameplateManufactureDate',
    showOverflow: 'tooltip',
    format: 'date|YYYY-MM-DD',
    width: 160,
  },
  {
    title: '改造日期',
    dataIndex: 'remoldDate',
    showOverflow: 'tooltip',
    format: 'date|YYYY-MM-DD',
    width: 160,
  },
  {
    title: '铭牌年限',
    dataIndex: 'nameplateYears',
    showOverflow: 'tooltip',
    width: 160,
  },
  {
    title: '铭牌年限分类',
    dataIndex: 'nameplateYearsCategoryName',
    showOverflow: 'tooltip',
    width: 160,
  },
  {
    title: '改造备注',
    dataIndex: 'remoldRemark',
    showOverflow: 'tooltip',
    width: 160,
  },
  {
    title: '厂区备注',
    dataIndex: 'factoryAreaRemark',
    showOverflow: 'tooltip',
    width: 160,
  },
  // {
  //   title: '数据周期',
  //   dataIndex: 'documentNumber',
  //   showOverflow: 'tooltip',
  //   width: 160,
  // },
  {
    title: '备注',
    dataIndex: 'remark',
    showOverflow: 'tooltip',
    width: 160,
  },
  // {
  //   title: '创建人',
  //   dataIndex: 'creatorUserName',
  //   showOverflow: 'tooltip',
  //   width: 160,
  // },
  // {
  //   title: '创建时间',
  //   dataIndex: 'creatorTime',
  //   showOverflow: 'tooltip',
  //   format: 'date|YYYY-MM-DD HH:mm:ss',
  //   width: 160,
  // },
  // {
  //   title: '修改人',
  //   dataIndex: 'lastModifyUserName',
  //   showOverflow: 'tooltip',
  //   width: 160,
  // },
  // {
  //   title: '修改时间',
  //   dataIndex: 'lastModifyTime',
  //   showOverflow: 'tooltip',
  //   format: 'date|YYYY-MM-DD HH:mm:ss',
  //   width: 160,
  // },
];

export const ledgerInventorySchema = [
  {
    field: 'bu',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      api: getBizScopeBulist,
      resultField: 'data',
      labelField: 'name',
      valueField: 'code',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
      placeholder: 'BU',
    },
    i18nField: 'buName',
  },
  {
    field: 'factoryArea',
    label: '',
    component: 'Select',
    componentProps: {
      fieldNames: {
        value: 'code',
        label: 'name',
      },
      options: [],
      placeholder: 'SBU(小厂)',
    },
    i18nField: 'factoryAreaName',
  },
  {
    field: 'type',
    component: 'Select',
    label: '',
    componentProps: {
      options: [
        { id: 0, fullName: t('dict.CommonCol.all') },
        { id: 1, fullName: t('common.audited') },
      ],
      placeholder: '状态',
    },
    i18nField: 'CommonCol.status',
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
    field: 'abcMark',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: 'ABC标识',
    },
  },
  {
    field: 'equipmentManager',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '设备管理员',
    },
    i18nField: 'equipmentManagerName',
  },
  {
    field: 'equipmentCode',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '设备编码',
    },
  },
];

export const ledgerInventoryColumn = [
  {
    title: '对标结果',
    field: 'benchmarkingResults',
    titleSuffix: {
      content: t('dict.CommonCol.benchmarkingResults'),
    },
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      props: {
        api: () => {
          return baseStore.getDictionaryData('benchmarkingResults');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: true,
        filterOption: false,
        notFoundContent: null,
      },
    },
    cellRender: {
      name: 'Tag',
      options: [
        { id: 1, fullName: 'OK', theme: 'green', rowKey: 'statusDesc' },
        { id: 2, fullName: 'NG1', theme: 'red', rowKey: 'statusDesc' },
        { id: 3, fullName: 'NG2', theme: 'red', rowKey: 'statusDesc' },
        { id: 4, fullName: 'NG3', theme: 'gray', rowKey: 'statusDesc' },
        { id: 5, fullName: 'NG4', theme: 'gray', rowKey: 'statusDesc' },
        { id: 6, fullName: 'NG5', theme: 'red', rowKey: 'statusDesc' },
      ],
    },
    sortable: true,
    width: 160,
    i18nField: 'benchmarkingResult',
  },
  {
    title: '设备编码(SAP台账)',
    field: 'equipmentCodeSap',
    i18nField: 'CommonCol.SAPLedgerEquipmentCode',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    sortable: true,
    width: 180,
    headerClassName: 'header-orange',
    className: ({ row }) => {
      return row.equipmentCodeSap !== row.equipmentCode ? 'cell-red' : '';
    },
  },
  {
    title: 'BU',
    sortable: true,
    field: 'buName',
    i18nField: 'buName',
    width: 160,
    headerClassName: 'header-orange',
  },
  {
    title: 'SBU(小厂)',
    field: 'factoryName',
    i18nField: 'factoryAreaName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    sortable: true,
    width: 200,
    headerClassName: 'header-orange',
  },
  {
    title: '固定资产编码',
    field: 'assetCode',
    i18nField: 'CommonCol.fixedAssetCode',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    sortable: true,
    width: 150,
    headerClassName: 'header-orange',
  },
  {
    title: '固定资产名称',
    field: 'description',
    i18nField: 'fixedAssetName',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
    headerClassName: 'header-orange',
  },
  {
    title: '规格型号',
    field: 'specificationsSap',
    i18nField: 'specifications',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    sortable: true,
    width: 150,
    headerClassName: 'header-orange',
  },
  {
    title: '机身序列号',
    field: 'serialNoSap',
    i18nField: 'fuselageSerialNo',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    sortable: true,
    width: 150,
    headerClassName: 'header-orange',
  },
  {
    title: 'ABC标识',
    field: 'abcMark',
    sortable: true,
    width: 160,
    headerClassName: 'header-orange',
  },
  {
    title: '对象类型',
    field: 'objectType',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    sortable: true,
    width: 120,
    headerClassName: 'header-orange',
  },
  {
    title: '是否清理',
    field: 'isClean',
    sortable: true,
    headerClassName: 'header-orange',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    className: ({ row }) => {
      return row.isClean === '是' ? 'cell-red' : '';
    },
    width: 120,
  },
  {
    title: '清理原因',
    field: 'cleanReason',
    width: 120,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    headerClassName: 'header-orange',
  },
  {
    title: '用户状态',
    field: 'userStatusName',
    width: 120,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    headerClassName: 'header-orange',
  },
  {
    title: '不活动日期',
    field: 'inactivityDate',
    width: 160,
    sortable: true,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    headerClassName: 'header-orange',
  },
  {
    title: '设备铭牌出厂日期',
    field: 'nameplateManufactureDateSap',
    sortable: true,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    width: 160,
    headerClassName: 'header-orange',
  },
  {
    title: '铭牌年限',
    field: 'nameplateYearsCategoryNameSap',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
    headerClassName: 'header-orange',
  },
  {
    title: '受限类型',
    field: 'restrictionType',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
    headerClassName: 'header-orange',
  },
  {
    title: '受限日期',
    field: 'restrictionExpiryDate',
    sortable: true,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    width: 160,
    headerClassName: 'header-orange',
  },
  {
    title: '购置日期',
    field: 'purchaseDate',
    sortable: true,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    width: 160,
    headerClassName: 'header-orange',
  },
  {
    title: '设备管理员工号',
    field: 'equipmentManagerAccount',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
    headerClassName: 'header-orange',
  },
  {
    title: '设备管理员姓名',
    field: 'equipmentManagerName',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
    headerClassName: 'header-orange',
  },
  {
    title: '设备编码(设备盘点导入)',
    field: 'equipmentCode',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
      searchField: 'equipmentCodeImport',
    },
    width: 200,
    i18nField: 'CommonCol.inventoryEquipmentCode',
    className: ({ row }) => {
      return row.equipmentCodeSap !== row.equipmentCode ? 'cell-red' : '';
    },
  },
  {
    title: 'SBU(小厂)',
    field: 'factoryAreaName',
    filters: [{ data: '' }],
    filterRender: {
      searchField: 'factoryArea',
      name: 'ApiSelect',
      props: {
        api: getfactoryarealist,
        resultField: 'data',
        labelField: 'name',
        valueField: 'code',
        apiSearch: {
          show: false,
        },
        immediate: true,
        showSearch: true,
        filterOption: false,
        notFoundContent: null,
      },
    },
    sortable: true,
    width: 200,
  },
  {
    title: '设备类型',
    field: 'equipmentTypeName',
    filters: [{ data: '' }],
    filterRender: {
      searchField: 'equipmentType',
      name: 'ApiSelect',
      props: {
        api: () => baseStore.getDictionaryData('equipmentType'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: true,
        filterOption: false,
        notFoundContent: null,
      },
    },
    width: 160,
    sortable: true,
  },
  {
    title: '设备分类',
    field: 'equipmentCategoryName',
    filters: [{ data: '' }],
    filterRender: {
      searchField: 'equipmentCategory',
      name: 'ApiSelect',
      props: {
        api: () => baseStore.getDictionaryData('equipmentCategory'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: true,
        filterOption: false,
        notFoundContent: null,
      },
    },
    width: 160,
    sortable: true,
  },
  {
    title: '固定资产编号',
    field: 'fixedAssetCode',
    width: 160,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    sortable: true,
  },
  {
    title: '固定资产名称',
    field: 'fixedAssetName',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '圆刀&平刀工位&型号分类',
    field: 'circularFlatWorkCategoryName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      searchField: 'circularFlatWorkCategory',
      props: {
        api: () => baseStore.getDictionaryData('CFlatWorkCategory'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: false,
        filterOption: false,
        notFoundContent: null,
      },
    },
    sortable: true,
    i18nField: 'CommonCol.circularFlatWorkCategoryName',
    width: 220,
  },
  {
    title: '实际使用型号',
    field: 'actualUseModel',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '设备型号分类',
    field: 'equipmentModelCategory',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '规格型号',
    field: 'specifications',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '机身序列号',
    field: 'fuselageSerialNo',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '设备制造商',
    field: 'equipmentVendor',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '使用状态',
    field: 'useStatusName',
    filters: [{ data: '' }],
    filterRender: {
      searchField: 'useStatus',
      name: 'ApiSelect',
      props: {
        api: () => baseStore.getDictionaryData('equipmentUseStatus'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: true,
        filterOption: false,
        notFoundContent: null,
      },
    },
    width: 160,
    sortable: true,
  },
  {
    title: '累计闲置时间（天）',
    field: 'sumIdleTime',
    width: 130,
  },
  {
    title: '是否老领略',
    field: 'isOldLl',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      searchField: 'isOldLl',
      props: {
        api: () => baseStore.getDictionaryData('YesOrNo'),
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
        { id: 0, fullName: t('dict.YesOrNo.0'), theme: 'red', rowKey: 'statusDesc' },
        { id: 1, fullName: t('dict.YesOrNo.1'), theme: 'green', rowKey: 'statusDesc' },
      ],
    },
    i18nField: 'isOldLlName',
    width: 160,
  },
  // {
  //   title: '联线状态',
  //   field: 'connectionStatusName',
  //   filters: [{ data: '' }],
  //   filterRender: {
  //     searchField: 'connectionStatus',
  //     name: 'ApiSelect',
  //     props: {
  //       api: () => baseStore.getDictionaryData('connectionStatus'),
  //       labelField: 'fullName',
  //       valueField: 'enCode',
  //       immediate: true,
  //       showSearch: true,
  //       filterOption: false,
  //       notFoundContent: null,
  //     },
  //     width: 160,
  //   },
  // },
  // {
  //   title: '是否是拼接改装设备',
  //   field: 'isAssembleName',
  //   // sortable: true,
  //   filters: [{ data: '' }],
  //   filterRender: {
  //     name: 'Input',
  //   },
  //   width: 200,
  // },
  {
    title: '是否是拼接改装设备',
    field: 'isAssemble',
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      props: {
        api: () => {
          return baseStore.getDictionaryData('isAssembleName');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: true,
        filterOption: false,
        notFoundContent: null,
      },
    },
    cellRender: {
      name: 'Tag',
      options: [
        { id: 1, fullName: t('dict.isAssembleName.1'), theme: 'green', rowKey: 'statusDesc' },
        { id: 2, fullName: t('dict.isAssembleName.2'), theme: 'red', rowKey: 'statusDesc' },
        { id: 3, fullName: t('dict.isAssembleName.3'), theme: 'blue', rowKey: 'statusDesc' },
      ],
    },
    sortable: true,
    width: 200,
  },
  // {
  //   title: '工位备注',
  //   field: 'productName',
  //   // sortable: true,
  //   filters: [{ data: '' }],
  //   filterRender: {
  //     name: 'Input',
  //   },
  //   width: 160,
  // },
  {
    title: '闲置分类',
    field: 'freeCategoryName',
    filters: [{ data: '' }],
    filterRender: {
      searchField: 'freeCategory',
      name: 'ApiSelect',
      props: {
        api: () => baseStore.getDictionaryData('freeCategory'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: true,
        filterOption: false,
        notFoundContent: null,
      },
    },
    width: 160,
    sortable: true,
  },
  {
    title: '是否需联机',
    field: 'isNeedOnline',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      searchField: 'isNeedOnline',
      props: {
        api: () => baseStore.getDictionaryData('YesOrNo'),
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
        { id: 0, fullName: t('dict.YesOrNo.0'), theme: 'red', rowKey: 'statusDesc' },
        { id: 1, fullName: t('dict.YesOrNo.1'), theme: 'green', rowKey: 'statusDesc' },
      ],
    },
    i18nField: 'isNeedOnlineName',
    width: 160,
  },
  {
    title: '设备联机状态',
    field: 'onlineStatus',
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      props: {
        api: () => baseStore.getDictionaryData('OnlineStatus'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: false,
        filterOption: false,
        notFoundContent: null,
      },
    },
    cellRender: {
      name: 'Tag',
      options: [
        { id: 1, fullName: t('dict.OnlineStatus.1'), theme: 'green', rowKey: 'statusDesc' },
        { id: 2, fullName: t('dict.OnlineStatus.2'), theme: 'red', rowKey: 'statusDesc' },
        { id: 3, fullName: t('dict.OnlineStatus.3'), theme: 'gray', rowKey: 'statusDesc' },
      ],
    },
    width: 160,
    sortable: true,
  },
  {
    title: '绑定的线体号',
    field: 'lineNumber',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
    sortable: true,
  },
  {
    title: '铭牌出厂日期',
    field: 'nameplateManufactureDate',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    sortable: true,
    width: 160,
  },
  {
    title: '铭牌年限',
    field: 'nameplateYears',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '铭牌年限分类',
    field: 'nameplateYearsCategoryName',
    filters: [{ data: '' }],
    filterRender: {
      searchField: 'nameplateYearsCategory',
      name: 'ApiSelect',
      props: {
        api: () => baseStore.getDictionaryData('nameplateYearsCategory'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: true,
        filterOption: false,
        notFoundContent: null,
      },
    },
    width: 160,
    sortable: true,
  },
  {
    title: '厂区备注',
    field: 'factoryAreaRemark',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
];

export const ledgerInventoryColumnExport = [
  {
    title: '对标结果',
    field: 'benchmarkingResult',
    width: 160,
    i18nField: 'benchmarkingResult',
  },
  {
    title: '设备编码(SAP台账)',
    field: 'equipmentCodeSap',
    i18nField: 'CommonCol.SAPLedgerEquipmentCode',
    width: 180,
  },
  {
    title: 'BU',
    field: 'buName',
    i18nField: 'buName',
    width: 160,
  },
  {
    title: 'SBU(小厂)',
    field: 'factoryName',
    i18nField: 'factoryAreaName',
    width: 200,
  },
  {
    title: '固定资产编码',
    field: 'assetCode',
    i18nField: 'CommonCol.fixedAssetCode',
    width: 150,
  },
  {
    title: '固定资产名称',
    field: 'description',
    i18nField: 'fixedAssetName',
    width: 160,
  },
  {
    title: '规格型号',
    field: 'specificationsSap',
    i18nField: 'specifications',
    width: 160,
  },
  {
    title: '机身序列号',
    field: 'serialNoSap',
    i18nField: 'fuselageSerialNo',
    width: 160,
  },
  {
    title: 'ABC标识',
    field: 'abcMark',
    width: 160,
  },
  {
    title: '对象类型',
    field: 'objectType',
    width: 160,
  },
  {
    title: '是否清理',
    field: 'isClean',
    width: 120,
  },
  {
    title: '清理原因',
    field: 'cleanReason',
    width: 120,
  },
  {
    title: '用户状态',
    field: 'userStatusName',
    width: 120,
  },
  {
    title: '不活动日期',
    field: 'inactivityDate',
    width: 120,
  },
  {
    title: '设备铭牌出厂日期',
    field: 'nameplateManufactureDateSap',
    width: 160,
  },
  {
    title: '铭牌年限',
    field: 'nameplateYearsCategoryNameSap',
    width: 160,
  },
  {
    title: '受限类型',
    field: 'restrictionType',
    width: 160,
  },
  {
    title: '受限日期',
    field: 'restrictionExpiryDate',
    width: 160,
  },
  {
    title: '购置日期',
    field: 'purchaseDate',
    width: 160,
  },
  {
    title: '设备管理员工号',
    field: 'equipmentManagerAccount',
    width: 160,
  },
  {
    title: '设备管理员姓名',
    field: 'equipmentManagerName',
    width: 160,
  },
  {
    title: '设备编码(设备盘点导入)',
    field: 'equipmentCode',
    width: 200,
    i18nField: 'CommonCol.inventoryEquipmentCode',
  },
  {
    title: 'SBU(小厂)',
    field: 'factoryAreaName',
    width: 200,
  },
  {
    title: '设备类型',
    field: 'equipmentTypeName',
    width: 160,
  },
  {
    title: '设备分类',
    field: 'equipmentCategoryName',
    width: 160,
  },
  {
    title: '固定资产编号',
    field: 'fixedAssetCode',
    width: 160,
  },
  {
    title: '固定资产名称',
    field: 'fixedAssetName',
    width: 160,
  },
  {
    title: '圆刀&平刀工位&型号分类',
    field: 'circularFlatWorkCategoryName',
    i18nField: 'CommonCol.circularFlatWorkCategoryName',
    width: 220,
  },
  {
    title: '实际使用型号',
    field: 'actualUseModel',
    width: 160,
  },
  {
    title: '设备型号分类',
    field: 'equipmentModelCategory',
    width: 160,
  },
  {
    title: '规格型号',
    field: 'specifications',
    width: 160,
  },
  {
    title: '机身序列号',
    field: 'fuselageSerialNo',
    width: 160,
  },
  {
    title: '设备制造商',
    field: 'equipmentVendor',
    width: 160,
  },
  {
    title: '使用状态',
    field: 'useStatusName',
    width: 160,
  },
  {
    title: '累计闲置时间（天）',
    field: 'sumIdleTime',
    width: 130,
  },
  {
    title: '是否老领略',
    field: 'isOldLlName',
    width: 160,
  },
  {
    title: '是否是拼接改装设备',
    field: 'isAssemble',
    width: 200,
  },
  {
    title: '闲置分类',
    field: 'freeCategoryName',
    width: 160,
  },
  {
    title: '是否需联机',
    field: 'isNeedOnlineName',
    width: 160,
  },
  {
    title: '设备联机状态',
    field: 'onlineStatus',
    width: 160,
  },
  {
    title: '绑定的线体号',
    field: 'lineNumber',
    width: 160,
  },
  {
    title: '铭牌出厂日期',
    field: 'nameplateManufactureDate',
    width: 160,
  },
  {
    title: '铭牌年限',
    field: 'nameplateYears',
    width: 160,
  },
  {
    title: '铭牌年限分类',
    field: 'nameplateYearsCategoryName',
    width: 160,
  },
  {
    title: '厂区备注',
    field: 'factoryAreaRemark',
    width: 160,
  },
];
