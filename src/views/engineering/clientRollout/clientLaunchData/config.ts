import { cloneDeep } from 'lodash-es';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

// 主页form配置
export function getFormSchema() {
  return [
    {
      fieldName: 'insideProjectCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '项目',
      },
      i18nField: 'InsideProjectCode',
    },
    {
      fieldName: 'billNo',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '单号',
      },
      i18nField: 'BillNo',
    },
    {
      fieldName: 'directCustomer',
      label: '',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: '直接客户',
      },
      i18nField: 'DirectCustomer',
    },
    {
      fieldName: 'insidePartNumber',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '产品内部料号',
      },
      i18nField: 'CommonCol.insidePartNumber',
    },
  ];
}

// 主页表格column配置
const column = [
  {
    title: '单号',
    field: 'billNo',
    width: 180,
    i18nField: 'BillNo',
  },
  {
    title: '项目',
    field: 'insideProjectCode',
    width: 160,
    i18nField: 'InsideProjectCode',
  },
  {
    title: '客户产品阶段',
    field: 'customerProductStage',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 150,
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
    title: '直接客户',
    field: 'directCustomer',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
    i18nField: 'DirectCustomer',
  },
  {
    title: '旧版成品编码',
    field: 'insidePartNumberOld',
    sortable: true,
    width: 160,
    i18nField: 'InsidePartNumberOld',
  },
  {
    title: '产品内部料号',
    field: 'insidePartNumber',
    sortable: true,
    width: 160,
    i18nField: 'CommonCol.insidePartNumber',
  },
  {
    title: '工厂',
    field: 'factoryName',
    sortable: true,
    width: 160,
    i18nField: 'FactoryName',
  },
  {
    title: '终端客户料号',
    field: 'customerPartNumber',
    sortable: true,
    width: 160,
    i18nField: 'CommonCol.terminalCustomerPartNumber',
  },
  {
    title: '生产日期',
    field: 'productDate',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    width: 120,
    i18nField: 'ProductDate',
  },
  {
    title: '批次',
    field: 'lotNumber',
    sortable: true,
    width: 160,
    i18nField: 'LotNumber',
  },
  {
    title: '出货日期',
    field: 'shipmentDate',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    width: 120,
    i18nField: 'ShipmentDate',
  },
  {
    title: '出货数量',
    field: 'shipmentQty',
    sortable: true,
    width: 160,
    i18nField: 'ShipmentQty',
  },
  {
    title: 'CQE',
    field: 'cqeUserName',
    sortable: true,
    width: 160,
  },
  {
    title: 'IQC抽检数量',
    field: 'numberOfIQCSamples',
    sortable: true,
    width: 160,
    i18nField: 'NumberOfIQCSamples',
  },
  {
    title: 'IQC抽检NG数量',
    field: 'ngNumberOfIQCSamples',
    sortable: true,
    width: 160,
    i18nField: 'NgNumberOfIQCSamples',
  },
  {
    title: 'IQC异常明细',
    field: 'detailsOfIQCExceptions',
    sortable: true,
    width: 160,
    i18nField: 'DetailsOfIQCExceptions',
  },
  {
    title: 'IQC结论',
    field: 'iQCConclusionsEnum',
    sortable: true,
    width: 160,
    filterRender: {
      name: 'ASelect',
      props: {
        fieldNames: {
          label: 'fullName',
          value: 'enCode',
        },
        options: [
          { fullName: 'OK', enCode: 1 },
          { fullName: 'NG', enCode: 2 },
        ],
      },
    },
    cellRender: {
      name: 'Tag',
      options: [
        { id: 1, fullName: 'OK', theme: 'green', rowKey: 'statusDesc' },
        { id: 2, fullName: 'NG', theme: 'red', rowKey: 'statusDesc' },
      ],
    },
    i18nField: 'IQCConclusions',
  },
  {
    title: '客户上线数量',
    field: 'customerOnlineNumber',
    sortable: true,
    width: 160,
    i18nField: 'CustomerOnlineNumber',
  },
  {
    title: '客户上线NG数量',
    field: 'customerOnlineNgNumber',
    sortable: true,
    width: 160,
    i18nField: 'CustomerOnlineNgNumber',
  },
  {
    title: '上线异常明细',
    field: 'onlineDetailsOfExceptions',
    sortable: true,
    width: 160,
    i18nField: 'OnlineDetailsOfExceptions',
  },
  {
    title: '上线结论',
    field: 'onlineConclusionsEnum',
    sortable: true,
    width: 160,
    filterRender: {
      name: 'ASelect',
      props: {
        fieldNames: {
          label: 'fullName',
          value: 'enCode',
        },
        options: [
          { fullName: 'OK', enCode: 1 },
          { fullName: 'NG', enCode: 2 },
        ],
      },
    },
    cellRender: {
      name: 'Tag',
      options: [
        { id: 1, fullName: 'OK', theme: 'green', rowKey: 'statusDesc' },
        { id: 2, fullName: 'NG', theme: 'red', rowKey: 'statusDesc' },
      ],
    },
    i18nField: 'OnlineConclusions',
  },
  {
    title: '备注',
    field: 'remark',
    sortable: true,
    width: 160,
    i18nField: 'Remark',
  },
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
          { fullName: t('dict.ProgressStatusEnum.1'), enCode: 1 },
          { fullName: t('dict.ProgressStatusEnum.5'), enCode: 5 },
        ],
      },
    },
    cellRender: {
      name: 'Tag',
      options: [
        { id: 1, fullName: t('dict.ProgressStatusEnum.1'), theme: 'blue', rowKey: 'statusDesc' },
        { id: 5, fullName: t('dict.ProgressStatusEnum.5'), theme: 'green', rowKey: 'statusDesc' },
      ],
    },
    width: 120,
    i18nField: 'StatusDesc',
  },
  {
    title: '当前处理人',
    field: 'currentProcessorName',
    sortable: true,
    width: 180,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    i18nField: 'CurrentProcessorName',
  },
  {
    title: '当前节点',
    field: 'currentNodeName',
    sortable: true,
    width: 160,
    i18nField: 'CurrentNodeName',
  },
  {
    title: '节点记录',
    field: 'record',
    slots: { default: 'record' },
    width: 100,
    i18nField: 'CommonCol.nodeRecord',
  },
];

export const EntryColumn = [
  {
    title: '项目',
    field: 'insideProjectCode',
    width: 160,
    i18nField: 'InsideProjectCode',
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
    title: '直接客户',
    field: 'directCustomer',
    width: 160,
    i18nField: 'DirectCustomer',
  },
  {
    title: '旧版成品编码',
    field: 'insidePartNumberOld',
    width: 160,
    i18nField: 'InsidePartNumberOld',
  },
  {
    title: '产品内部料号',
    field: 'insidePartNumber',
    width: 160,
    i18nField: 'CommonCol.insidePartNumber',
  },
  {
    title: '工厂',
    field: 'factoryName',
    width: 160,
    i18nField: 'FactoryName',
  },
  {
    title: '终端客户料号',
    field: 'customerPartNumber',
    width: 160,
    i18nField: 'CommonCol.terminalCustomerPartNumber',
  },
  {
    title: 'IQC抽检数量',
    field: 'numberOfIQCSamples',
    editRender: {
      name: 'InputNumber',
    },
    width: 160,
    i18nField: 'NumberOfIQCSamples',
  },
  {
    title: 'IQC抽检NG数量',
    field: 'ngNumberOfIQCSamples',
    editRender: {
      name: 'InputNumber',
    },
    width: 160,
    i18nField: 'NgNumberOfIQCSamples',
  },
  {
    title: 'IQC异常明细',
    field: 'detailsOfIQCExceptions',
    editRender: {
      name: 'Input',
    },
    width: 160,
    i18nField: 'DetailsOfIQCExceptions',
  },
  {
    title: 'IQC结论',
    field: 'iQCConclusionsEnum',
    editRender: {
      name: 'ASelect',
      cacheField: 'iQCConclusions',
      props: {
        fieldNames: {
          label: 'fullName',
          value: 'enCode',
        },
        options: [
          { fullName: 'OK', enCode: 1 },
          { fullName: 'NG', enCode: 2 },
        ],
      },
    },
    i18nField: 'IQCConclusions',
    width: 160,
  },
  {
    title: '客户上线数量',
    field: 'customerOnlineNumber',
    editRender: {
      name: 'InputNumber',
    },
    width: 160,
    i18nField: 'CustomerOnlineNumber',
  },
  {
    title: '客户上线NG数量',
    field: 'customerOnlineNgNumber',
    editRender: {
      name: 'InputNumber',
    },
    width: 160,
    i18nField: 'CustomerOnlineNgNumber',
  },
  {
    title: '上线异常明细',
    field: 'onlineDetailsOfExceptions',
    editRender: {
      name: 'Input',
    },
    width: 160,
    i18nField: 'OnlineDetailsOfExceptions',
  },
  {
    title: '上线结论',
    field: 'onlineConclusionsEnum',
    editRender: {
      name: 'ASelect',
      cacheField: 'onlineConclusions',
      props: {
        fieldNames: {
          label: 'fullName',
          value: 'enCode',
        },
        options: [
          { fullName: 'OK', enCode: 1 },
          { fullName: 'NG', enCode: 2 },
        ],
      },
    },
    i18nField: 'OnlineConclusions',
    width: 160,
  },
  {
    title: '备注',
    field: 'remark',
    editRender: {
      name: 'Input',
    },
    width: 300,
    i18nField: 'Remark',
  },
  {
    title: '生产日期',
    field: 'productDate',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    width: 120,
    i18nField: 'ProductDate',
  },
  {
    title: '批次',
    field: 'lotNumber',
    width: 160,
    i18nField: 'LotNumber',
  },
  {
    title: '出货日期',
    field: 'shipmentDate',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    width: 120,
    i18nField: 'ShipmentDate',
  },
  {
    title: '出货数量',
    field: 'shipmentQty',
    sortable: true,
    width: 160,
    i18nField: 'ShipmentQty',
  },
  {
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: 100,
    fixed: 'right',
  },
];

export const editRules = {
  numberOfIQCSamples: [{ required: true, message: t('common.required') }],
  ngNumberOfIQCSamples: [{ required: true, message: t('common.required') }],
  iQCConclusionsEnum: [{ required: true, message: t('common.required') }],
  customerOnlineNumber: [{ required: true, message: t('common.required') }],
  customerOnlineNgNumber: [{ required: true, message: t('common.required') }],
  onlineConclusionsEnum: [{ required: true, message: t('common.required') }],
};

export function getColumn(): any {
  const columnData = cloneDeep(column);
  columnData.unshift({ type: 'checkbox', field: 'checkbox', width: 70 });
  return columnData;
}

export function getExportColumn() {
  return cloneDeep(column).toSpliced(0, 1);
}
