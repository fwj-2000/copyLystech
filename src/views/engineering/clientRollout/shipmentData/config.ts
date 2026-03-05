import { cloneDeep } from 'lodash-es';
import { useI18n } from '/@/hooks/web/useI18n';
import { getProductStage, getCqeUserInfo, getProductStageList } from '/@/api/engineering/clientRollout';
import { getFactoryList } from '/@/api/basicData/productCodeApply';
import { getprojectlist, getQuantitationApplyDetailByMaterial } from '/@/api/business/quantitation';
import { nextTick } from 'vue';

const { t } = useI18n();

// 主页form配置
export function getFormSchema() {
  return [
    // {
    //   fieldName: 'factory',
    //   label: '',
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: '工厂',
    //     allowClear: true,
    //   },
    //   i18nField: 'FactoryName',
    // },
    {
      fieldName: 'factory',
      label: '',
      component: 'ApiSelect',
      componentProps: {
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
      i18nField: 'CommonCol.factoryName',
    },
    {
      fieldName: 'insideProjectCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '项目',
        allowClear: true,
      },
      i18nField: 'InsideProjectCode',
    },
    {
      fieldName: 'billNo',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '单号',
        allowClear: true,
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
        allowClear: true,
      },
      i18nField: 'CommonCol.insidePartNumber',
    },
    {
      fieldName: 'shipmentDate',
      label: '',
      component: 'DatePicker',
      componentProps: {
        placeholder: '出货日期',
        allowClear: true,
      },
      i18nField: 'ShipmentDate',
    },
  ];
}

// 主页表格column配置
const column = [
  {
    title: '单号',
    field: 'billNo',
    width: 140,
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

const getQuantitationApplyDetailByMaterialFn = async params => {
  let paramsObj = {
    ...params,
    insideProjectCode: params.insideProjectCode,
  };
  if (params.isMemorize) {
    delete paramsObj.insideProjectCode;
  }
  const res = await getQuantitationApplyDetailByMaterial(paramsObj);
  return res;
};

export const getCQEColumn = type => {
  return [
    {
      title: 'CQE',
      field: 'cqeUserId',
      width: 180,
      formatter: 'ApiSelect',
      editRender: {
        name: 'CustomUserSelect',
        cacheField: 'cqeUserName',
        props: {
          disabled: type === 'edit',
        },
      },
    },
    {
      title: '项目',
      field: 'insideProjectCode',
      width: 160,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        props: {
          api: getprojectlist,
          showSearch: true,
          memoInputVal: true,
          memoInputVagueVal: true,
          apiSearch: {
            show: true,
            searchName: 'code',
          },
          params: {
            pageSize: 100,
          },
          resultField: 'data',
          labelField: 'InsideProjectCode',
          valueField: 'InsideProjectCode',
          immediate: false,
          onChange: (_, data, { row }) => {
            row.insidePartNumber = '';
            row.insidePartNumberName = '';
            row.isMemorize = data.isMemorize || false;
          },
        },
      },
      i18nField: 'InsideProjectCode',
    },
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      width: 260,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        props: {
          api: getQuantitationApplyDetailByMaterialFn,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'insidePartNumber',
          },
          rowParams: {
            insideProjectCode: 'insideProjectCode',
            isMemorize: 'isMemorize',
          },
          resultField: 'data',
          labelField: 'InsidePartNumber',
          valueField: 'InsidePartNumber',
          immediate: false,
          onChange: async (_, data, { row }) => {
            const res = await getCqeUserInfo({ insidePartNumber: row.insidePartNumber });
            const productStageListRes = await getProductStageList({ insidePartNumber: row.insidePartNumber });
            const customerProductStage = productStageListRes.data?.[0]?.customerProductStage;
            const internalProductStage = productStageListRes.data?.[0]?.internalProductStage;
            row.customerProductStage = customerProductStage;
            row.internalProductStage = internalProductStage;
            const { InsideProjectCode, Factory, FactoryFullName } = data;
            row.insideProjectCode = InsideProjectCode;
            row.factoryCode = Factory;
            nextTick(() => {
              row.cqeUserId = res.data?.[0]?.userId;
              row.insideProjectCodeName = InsideProjectCode;
              row.factoryName = FactoryFullName;
              row.cqeUserName = res.data?.[0]?.userName;
            });
          },
        },
      },
      i18nField: 'CommonCol.insidePartNumber',
    },
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
          nameFormat: ['Code', '/', 'Name'],
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
          showSearch: true,
          memoInputVal: true,
          memoInputVagueVal: true,
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
          showSearch: true,
          memoInputVal: true,
          memoInputVagueVal: true,
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
      width: 160,
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
      title: '终端客户料号',
      field: 'customerPartNumber',
      width: 160,
      i18nField: 'CommonCol.terminalCustomerPartNumber',
    },
    {
      title: '生产日期',
      field: 'productDate',
      editRender: {
        name: 'DatePicker',
        props: {
          format: 'YYYY-MM-DD',
          valueFormat: 'YYYY-MM-DD',
        },
      },
      width: 140,
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
};

export const editRules = {
  cqeUserId: [{ required: true, message: t('common.required') }],
  insideProjectCode: [{ required: true, message: t('common.required') }],
  // insidePartNumber: [{ required: true, message: t('common.required') }],
  factoryCode: [{ required: true, message: t('common.required') }],
  customerProductStage: [{ required: true, message: t('common.required') }],
  internalProductStage: [{ required: true, message: t('common.required') }],
  // productDate: [{ required: true, message: t('common.required') }],
};

export function getColumn(activeKey): any {
  const filterHandled = ['cqeUserName'];
  const filterPending = ['status', 'currentProcessorName', 'currentNodeName', 'record'];
  const columnList =
    activeKey === 'pending' ? column.filter(item => !filterPending.includes(item.field)) : column.filter(item => !filterHandled.includes(item.field));
  const columnData = cloneDeep(columnList);
  columnData.unshift({ type: 'checkbox', field: 'checkbox', width: 70 });
  return columnData;
}

export function getExportColumn() {
  return cloneDeep(column).toSpliced(0, 1);
}
