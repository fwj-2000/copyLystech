import { useI18n } from '/@/hooks/web/useI18n';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { useBaseStore } from '/@/store/modules/base';
import { useUserStore } from '/@/store/modules/user';
import { usePermission } from '/@/hooks/web/usePermission';
import { STATUS_OPTIONS } from '/@/utils/status';
import { getFactoryList } from '/@/api/engineering/sample';
import { getprojectlist } from '/@/api/business/quantitation';

const baseStore = useBaseStore();
const userStore = useUserStore();

export const CURRENT_RM_NODE = 'ApplyNode';

const { t } = useI18n();
export const QUOTA_COLUMNS: BasicColumn[] = [
  {
    title: t('views.business.quota.batchCode'),
    dataIndex: 'ApplyCode',
    width: 140,
    resizable: true,
    align: 'left',
    sorter: true,
  },
  {
    title: t('views.business.quota.internalPartNumber'),
    dataIndex: 'InsidePartNumber',
    width: 220,
    sorter: true,
  },
  {
    title: t('views.business.quota.status'),
    dataIndex: 'Status',
    width: 110,
    align: 'center',
    format: 'tag|' + JSON.stringify(STATUS_OPTIONS),
    sorter: true,
  },
  {
    title: '当前处理人',
    dataIndex: 'HandlerName',
    width: 180,
    sorter: true,
  },
  {
    title: '当前节点',
    dataIndex: 'currentNodeName',
    width: 120,
    sorter: true,
  },
  {
    title: '节点记录',
    dataIndex: 'nodeDetail',
    width: 100,
  },
  // { title: t('views.business.quota.ReviewUserName'), dataIndex: 'ReviewUserName', width: 220 },
  { title: '直接客户料号', dataIndex: 'ImmediateCustomerPartNumber', width: 140, sorter: true },

  {
    title: t('views.business.quota.terminalCustomerPartNumber'),
    dataIndex: 'TerminalCustomerPartNumber',
    width: 120,
    align: 'center',
    sorter: true,
  },
  // TODO 客户要求交期 报价用途
  {
    title: '客户要求交期',
    dataIndex: 'DeliveryDate',
    width: 140,
    format: 'date|YYYY-MM-DD',
    sorter: true,
  },
  { title: '报价用途', dataIndex: 'PurposeName', width: 140, sorter: true },
  {
    title: '工厂',
    dataIndex: 'FactoryName',
    width: 120,
    align: 'center',
    sorter: true,
  },
  {
    title: 'PDT Leader',
    dataIndex: 'ProjectLeaderName',
    width: 200,
    align: 'center',
    sorter: true,
  },
  {
    title: t('views.business.quota.productDesc'),
    dataIndex: 'ProductDesc',
    width: 320,
    align: 'left',
    sorter: true,
  },
  {
    title: '备注',
    dataIndex: 'LineRemark',
    width: 120,
    align: 'left',
    sorter: true,
  },
  {
    title: t('views.business.quota.applyUser'),
    dataIndex: 'ApplyUserName',
    width: 220,
    align: 'center',
    sorter: true,
  },
  {
    title: t('views.business.quota.applyDate'),
    dataIndex: 'ApplyDate',
    width: 150,
    align: 'center',
    format: 'date|YYYY-MM-DD',
    sorter: true,
  },
];

export const getCommonColumns = () => {
  return [
    {
      title: t('views.business.quota.batchCode'),
      field: 'ApplyCode',
      width: 140,
      // filters: [{ data: '' }],
      // filterRender: {
      //   name: 'Input',
      // },
      sortable: true,
    },
    {
      title: t('views.business.quota.internalPartNumber'),
      field: 'InsidePartNumber',
      width: 220,
      // filters: [{ data: '' }],
      // filterRender: {
      //   name: 'Input',
      // },
      sortable: true,
    },
    {
      title: '状态',
      field: 'Status',
      sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'ASelect',
        cSharpType: 'int',
        props: {
          fieldNames: {
            label: 'fullName',
            value: 'enCode',
          },
          options: STATUS_OPTIONS.map(item => ({ fullName: item.fullName, enCode: item.id, id: item.id })),
        },
      },
      cellRender: {
        name: 'Tag',
        options: STATUS_OPTIONS,
      },
      width: 120,
    },
    {
      title: '当前处理人',
      field: 'HandlerName',
      width: 180,
      sortable: true,
    },
    {
      title: '当前节点',
      field: 'currentNodeName',
      width: 120,
      aqpFilter: {
        enabled: false,
      },
    },
    {
      title: '节点记录',
      field: 'nodeDetail',
      slots: { default: 'nodeDetail' },
      width: 100,
    },
    {
      title: '直接客户料号',
      field: 'ImmediateCustomerPartNumber',
      width: 140,
      filters: [{ data: '' }],
      filterRender: {
        name: 'Input',
      },
      sorter: true,
    },
    {
      title: t('views.business.quota.terminalCustomerPartNumber'),
      field: 'TerminalCustomerPartNumber',
      width: 160,
      filters: [{ data: '' }],
      filterRender: {
        name: 'Input',
      },
      sortable: true,
    },
    // TODO 客户要求交期 报价用途
    {
      title: '客户要求交期',
      field: 'DeliveryDate',
      width: 140,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
      sortable: true,
    },
    {
      title: '报价用途',
      field: 'PurposeName',
      width: 140,
      filters: [{ data: '' }],
      filterRender: {
        name: 'ApiSelect',
        props: {
          api: () => baseStore.getDictionaryData('QuotationRequirements.Purpose'),
          labelField: 'fullName',
          valueField: 'enCode',
          filterOption: false,
        },
      },
      sorter: true,
    },
    {
      title: '工厂',
      field: 'FactoryName',
      width: 120,
      sortable: true,
    },
    {
      title: 'PDT Leader',
      field: 'ProjectLeaderName',
      filters: [{ data: '' }],
      filterRender: {
        name: 'Input',
      },
      width: 200,
      sortable: true,
    },
    {
      title: t('views.business.quota.productDesc'),
      field: 'ProductDesc',
      width: 320,
      filters: [{ data: '' }],
      filterRender: {
        name: 'Input',
      },
      sortable: true,
    },
    // {
    //   title: '备注',
    //   field: 'LineRemark',
    //   width: 120,
    //   sortable: true,
    // },
    {
      title: '备注',
      field: 'nodeRemark',
      i18nField: 'CommonCol.remark',
      width: 150,
      cellRender: {
        name: 'Remark',
        nodeCode: CURRENT_RM_NODE,
      },
    },
    {
      title: t('views.business.quota.applyUser'),
      field: 'ApplyUserName',
      width: 220,
      sortable: true,
    },
    {
      title: t('views.business.quota.applyDate'),
      field: 'ApplyDate',
      width: 150,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
      sortable: true,
    },
  ];
};
export function getQuotaColumns() {
  const { hasBtnP } = usePermission();
  const column = getCommonColumns();
  if (hasBtnP('btn_detail')) {
    column.unshift({ type: 'checkbox', field: 'checkbox', width: 45 });
    column.push({
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 80,
      fixed: 'right',
    });
  }
  return column;
}

export const QUOTA_FORM_CONFIG: any = {
  schemas: [
    {
      field: 'ApplyCode',
      label: t('views.business.quota.batchCode'),
      component: 'Input',
      componentProps: {
        placeholder: t('views.business.quota.inputBatchCode'),
        submitOnPressEnter: true,
      },
      width: 100,
    },
    {
      field: 'InsidePartNumber',
      label: t('views.business.quota.internalPartNumber'),
      component: 'Input',
      componentProps: {
        placeholder: t('views.business.quota.inputInternalPartNumber'),
      },
    },
    {
      field: 'ProjectLeaderName',
      label: 'PDT Leader',
      component: 'Input',
      componentProps: {
        placeholder: 'PDT Leader',
      },
    },
    {
      field: 'RequireDate',
      label: t('views.business.quota.requireDate'),
      component: 'DatePicker',
      componentProps: {
        placeholder: t('views.business.quota.pleaseSelectDemandDate'),
      },
    },
  ],
};
export function getQuotaFormConfig() {
  return [
    {
      fieldName: 'RequireDate',
      label: '',
      component: 'DatePicker',
      componentProps: {
        placeholder: t('views.business.quota.requireDate'),
      },
    },
    {
      fieldName: 'ApplyUserId',
      label: '',
      component: 'CustomUserSelect',
      componentProps: {
        defaultValue: userStore.getUserInfo.userId,
        placeholder: t('dict.CommonCol.applyUser'),
      },
    },
    {
      fieldName: 'ApplyCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: t('dict.CommonCol.applyNo'),
      },
    },
    {
      fieldName: 'InsidePartNumber',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: t('dict.CommonCol.insidePartNumber'),
      },
    },
    {
      fieldName: 'factory',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        api: getFactoryList,
        allowClear: true,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'factoryCode',
        },
        resultField: 'data',
        labelField: 'Name',
        valueField: 'Code',
        nameFormat: ['Code', '/', 'Name'],
        filterOption: false,
        immediate: true,
        placeholder: t('dict.CommonCol.factoryName'),
      },
    },
  ];
}

export const searchFormSchema: FormSchema[] = [
  {
    field: 'Purpose',
    label: '报价用途',
    required: true,
    // rules: [{ required: true, trigger: 'blur', message: '请选择报价用途' }],
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('QuotationRequirements.Purpose', true),
      showSearch: true,
      apiSearch: {
        show: true,
        searchName: '',
      },
      labelField: 'fullName',
      valueField: 'enCode',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
    },
  },
  {
    field: 'insideProjectCode',
    label: '内部项目代码',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: getprojectlist,
      placeholder: '输入大写字母查询',
      i18nField: 'CommonCol.higherCodeTip',
      showSearch: true,
      apiSearch: {
        show: true,
        searchName: 'code',
      },
      params: {
        pageSize: 100,
      },
      immediate: false,
      resultField: 'data',
      labelField: 'InsideProjectCode',
      valueField: 'InsideProjectCode',
      // onChange: (value, data) => {
      //   setFieldsValue({
      //     terminalCustomerProjectCode: data.TerminalCustomerProjectCode,
      //   });
      // },
    },
  },
  {
    field: 'DeliveryDate',
    label: '客户要求交期',
    required: true,
    component: 'DatePicker',
    componentProps: {
      // placeholder: '请选择',
      // showTime: true,
      disabledDate: current => {
        return current && current.valueOf() < Date.now();
      },
    },
  },
  {
    field: 'UrgencyLevel',
    label: '紧急程度',
    required: true,
    defaultValue: 1,
    // rules: [{ required: true, trigger: 'blur', message: '请选择报价用途' }],
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('QuotationRequirements.UrgencyLevel', true),
      showSearch: true,
      apiSearch: {
        show: true,
        searchName: '',
      },
      labelField: 'fullName',
      valueField: 'enCode',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
    },
  },
  // {
  //   field: 'TotalQty',
  //   label: '项目总量(W)',
  //   rules: [{ required: true, trigger: 'blur' }],
  //   component: 'InputNumber',
  //   componentProps: {
  //     placeholder: '项目总量',
  //   },
  // },
  {
    field: 'ProductionCycle',
    label: '量产周期(月)',
    component: 'InputNumber',
    required: true,
    componentProps: {
      placeholder: '请输入量产周期',
      min: 0,
      step: 1,
      precision: 0,
    },
  },
  {
    field: 'TenderFactoryQty',
    label: '招标模切厂家数',
    component: 'InputNumber',
    componentProps: {
      placeholder: '请输入招标模切厂家数',
      min: 0,
      step: 1,
      precision: 0,
    },
  },
];

export function getViewFromSchema(): FormSchema[] {
  return [
    // {
    //   field: 'TotalQty',
    //   label: '项目总量(W)',
    //   rules: [{ required: true, trigger: 'blur', message: '请输入项目总量' }],
    //   component: 'InputNumber',
    //   componentProps: {
    //     placeholder: '请输入项目总量',
    //   },
    // },
    {
      field: 'ProductionCycle',
      label: '量产周期(月)',
      component: 'InputNumber',
      required: true,
      componentProps: {
        placeholder: '请输入量产周期',
        min: 0,
        step: 1,
        precision: 0,
      },
    },
    {
      field: 'UrgencyLevel',
      label: '紧急程度',
      required: true,
      defaultValue: 1,
      // rules: [{ required: true, trigger: 'blur', message: '请选择报价用途' }],
      component: 'ApiSelect',
      componentProps: {
        api: () => baseStore.getDictionaryData('QuotationRequirements.UrgencyLevel', true),
        placeholder: '请选择紧急程度',
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: '',
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
    },
    {
      field: 'TenderFactoryQty',
      label: '招标模切厂家数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入招标模切厂家数',
        min: 0,
        step: 1,
        precision: 0,
      },
    },
  ];
}

export const QUOTA_TABLE_ROW_DATA = {
  InsidePartNumber: '',
  Factory: '',
  UnitQty: '1',
  LineRemark: '',
  ProjectLeader: '',
  IsBonded: 'false',
  CostUnit: 'PCS',
  TerminalCustomerPartNumber: '',
  ImmediateCustomerPartNumber: '',
  ProductDesc: '',
  onEdit: true,
  editable: true,
  disabled: {
    TerminalCustomerPartNumber: true,
    ImmediateCustomerPartNumber: true,
    ProductDesc: true,
  },
};
