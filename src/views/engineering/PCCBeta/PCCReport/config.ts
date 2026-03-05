import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
import { ENABLE_OPTIONS } from '/@/views/engineering/PCCBeta/PCCReview/config';

const baseStore = useBaseStore();
const { t } = useI18n();

export function getUnReviewColumns(handleNodeModal: any): Array<any> {
  return [
    {
      type: 'checkbox',
      field: 'checkbox',
    },
    {
      title: '需求单号',
      field: 'originCode',
      width: 200,
    },
    {
      title: '需求类型',
      field: 'demandTypeName',
      width: 120,
      aqpFilter: {
        name: 'ApiSelect',
        cSharpType: 'string',
        searchField: 'demandType',
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
    {
      title: '资料类型',
      field: 'docType',
      width: 120,
      aqpFilter: {
        name: 'ApiSelect',
        searchField: 'docTypeEnum',
        cSharpType: 'int',
        props: {
          api: () => baseStore.getDictionaryData('EngineeringDocApply.DocType'),
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
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      width: 200,
    },
    {
      title: '旧版成品编码',
      field: 'insidePartNumberOld',
      width: 200,
    },
    {
      title: '版本',
      field: 'version',
      formatter: ({ row }) => {
        return `T${row.version}`;
      },
      width: 80,
      aqpFilter: {
        cSharpType: 'int',
      },
    },
    {
      title: '受控时间',
      field: 'effectiveDate',
      sortable: true,
      cellRender: {
        name: 'Date',
        // @ts-ignore
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      aqpFilter: {
        enabled: true,
        name: 'DatePicker',
        props: {
          format: 'YYYY-MM-DD HH:mm:ss',
        },
      },
      width: 140,
    },
    {
      title: '生产工艺',
      field: 'processName',
      width: 80,
      aqpFilter: {
        name: 'ApiSelect',
        searchField: 'process',
        cSharpType: 'int',
        props: {
          api: () => baseStore.getDictionaryData('PCC.ProcessType'),
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
    {
      title: '是否启用',
      field: 'enable',
      width: 100,
      cellRender: {
        name: 'Tag',
        cSharpType: 'bool',
        options: ENABLE_OPTIONS,
      },
    },
    // SAP是否同步PCC
    {
      title: t('dict.PCCApply.isSync'),
      field: 'syncSapTime',
      width: 150,
      formatter: ({ row }) => {
        return row.syncSapTime ? t('common.yes') : t('common.no');
      },
    },
    {
      title: '是否料头工艺',
      field: 'isStubbar',
      width: 100,
      slots: {
        default: 'materialProcess',
      },
    },
    {
      title: '是否默认BOM',
      field: 'isDefaultEnable',
      width: 100,
      formatter: ({ cellValue }) => (cellValue ? t('common.yes') : t('common.no')),
    },
    {
      title: 'PD',
      field: 'creatorUserName',
      aqpFilter: {
        enabled: true,
        searchField: 'creatorUserId',
        name: 'CustomUserSelect',
      },
      width: 200,
    },
    {
      title: 'PD Leader',
      field: 'pdLeaderName',
      aqpFilter: {
        enabled: true,
        searchField: 'pdLeaderId',
        name: 'CustomUserSelect',
      },
      width: 200,
    },
    {
      title: '直接客户名称',
      field: 'immediateCustomerName',
      i18nField: 'CommonCol.immediateCustomerName',
      width: 200,
    },
    {
      title: '直接客户料号',
      field: 'immediateCustomerPartNumber',
      width: 200,
    },
    {
      title: '产品描述',
      field: 'productDesc',
      width: 200,
    },
    {
      title: '终端客户料号',
      field: 'terminalCustomerPartNumber',
      width: 200,
    },
    {
      title: '工厂',
      field: 'factoryName',
      width: 200,
    },
    {
      title: '脱敏图纸',
      field: 'desensitizedDrawingsName',
      width: 200,
      slots: {
        default: 'desensitizationDrawing',
      },
    },
    {
      title: 'PDF',
      field: 'fileName',
      width: 200,
      aqpFilter: {
        enabled: false,
      },
      slots: {
        default: 'PDF',
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

export const schemas = [
  {
    label: '',
    fieldName: 'originCode',
    component: 'Input',
    componentProps: {
      placeholder: '单号',
      submitOnPressEnter: true,
    },
  },
  {
    label: '',
    fieldName: 'insidePartNumber',
    component: 'Input',
    componentProps: {
      placeholder: '产品内部料号',
      submitOnPressEnter: true,
    },
  },
  {
    label: '',
    fieldName: 'insidePartNumberOld',
    component: 'Input',
    componentProps: {
      placeholder: '旧版成品编码',
      submitOnPressEnter: true,
    },
  },
  {
    label: '',
    fieldName: 'factory',
    component: 'Input',
    componentProps: {
      placeholder: '工厂',
      submitOnPressEnter: true,
    },
  },
  {
    label: '',
    fieldName: 'time',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD',
      submitOnPressEnter: true,
      placeholder: [t('component.lydc.timeRange.startPlaceholder'), t('component.lydc.timeRange.endPlaceholder')],
    },
  },
  {
    label: '',
    fieldName: 'terminalCustomerPartNumber',
    component: 'Input',
    componentProps: {
      placeholder: '终端客户料号',
      submitOnPressEnter: true,
    },
  },
  {
    label: '',
    fieldName: 'immediateCustomerName',
    component: 'Input',
    i18nField: 'CommonCol.immediateCustomerName',
    componentProps: {
      placeholder: '直接客户',
      submitOnPressEnter: true,
    },
  },
  {
    label: '',
    fieldName: 'immediateCustomerPartNumber',
    component: 'Input',
    componentProps: {
      placeholder: '直接客户料号',
      submitOnPressEnter: true,
    },
  },
  {
    label: '',
    fieldName: 'docType',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '资料类型',
      submitOnPressEnter: true,
      api: () => {
        return baseStore.getDictionaryData('EngineeringDocApply.DocType', true);
      },
      labelField: 'fullName',
      valueField: 'enCode',
    },
  },
  {
    label: '',
    fieldName: 'creatorUserName',
    component: 'Input',
    componentProps: {
      placeholder: 'PD',
      submitOnPressEnter: true,
    },
  },
];
