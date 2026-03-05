import { useI18n } from '/@/hooks/web/useI18n';
import { STATUS_OPTIONS } from '/@/utils/status/index';
import { h } from 'vue';
import { useBaseStore } from '/@/store/modules/base';

const { t } = useI18n();
const baseStore = useBaseStore();

export const CURRENT_RM_NODE = 'PDTLeaderReview'; // 备注节点

export const ENABLE_OPTIONS = [
  { id: true, fullName: t('dict.enableStatus.1'), theme: 'green', rowKey: 'enableName' },
  { id: false, fullName: t('dict.enableStatus.2'), theme: 'red', rowKey: 'enableName' },
];

export function getUnReviewColumns(handleNodeModal: any): Array<any> {
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
      field: 'originCode',
      width: 200,
      formatter: ({ cellValue }) => {
        return cellValue;
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
        // 资料类型不为`PCC（5）`，或者需求类型为商务样品需求和工程样品需求都不会同步SAP的，此项显示为否
        if (+row.docTypeEnum !== 5 || row.demandType === 'BusinessSamples' || row.demandType === 'EngineeringSamples') {
          return t('common.no');
        }

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
      title: '修改记录',
      field: 'record',
      width: 100,
      i18nField: 'CommonCol.modifyRecord',
      slots: {
        default: 'record',
      },
    },
    {
      title: '状态',
      field: 'status',
      width: 100,
      cellRender: {
        name: 'Tag',
        cSharpType: 'int',
        options: STATUS_OPTIONS,
      },
    },
    {
      title: '当前节点',
      field: 'currentNodeName',
      width: 200,
      aqpFilter: {
        enabled: false,
      },
    },
    {
      title: '当前处理人',
      field: 'handlerName',
      width: 200,
      aqpFilter: {
        enabled: true,
        searchField: 'handlerId',
        name: 'CustomUserSelect',
      },
    },
    {
      title: '节点详情',
      field: 'nodeDetail',
      width: 120,
      slots: {
        default: ({ row }) => h('span', { class: 'table-a', onClick: handleNodeModal.bind(null, row) }, t('common.searchDetail')),
      },
    },
    {
      title: 'PD',
      field: 'creatorUserName',
      width: 200,
      aqpFilter: {
        enabled: true,
        searchField: 'creatorUserId',
        name: 'CustomUserSelect',
      },
    },
    {
      title: '直接客户料号',
      field: 'immediateCustomerPartNumber',
      width: 200,
    },
    {
      title: '终端客户料号',
      field: 'terminalCustomerPartNumber',
      width: 200,
    },
    {
      title: '备注',
      field: 'nodeRemark',
      i18nField: 'CommonCol.remark',
      key: 'pmDesc',
      width: 150,
      cellRender: {
        name: 'Remark',
        nodeCode: CURRENT_RM_NODE,
      },
      aqpFilter: {
        enabled: false,
      },
    },
    {
      title: '工厂',
      field: 'factoryName',
      width: 200,
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
    fieldName: 'demandType',
    component: 'ApiSelect',
    i18nField: 'demandTypeName',
    componentProps: {
      placeholder: '需求类型',
      submitOnPressEnter: true,
      api: () => baseStore.getDictionaryData('DemandTypeEnum'),
      labelField: 'fullName',
      valueField: 'enCode',
    },
  },
  {
    label: '',
    fieldName: 'time',
    component: 'RangePicker',
    componentProps: {
      // format: 'YYYY-MM-DD',
      submitOnPressEnter: true,
      placeholder: [t('component.lydc.dateRange.startPlaceholder'), t('component.lydc.dateRange.endPlaceholder')],
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
    fieldName: 'immediateCustomerPartNumber',
    component: 'Input',
    componentProps: {
      placeholder: '直接客户料号',
      submitOnPressEnter: true,
    },
  },
  {
    label: '',
    fieldName: 'handlerName',
    component: 'Input',
    componentProps: {
      placeholder: '当前处理人',
      submitOnPressEnter: true,
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
  {
    label: '',
    fieldName: 'docType',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '资料类型',
      submitOnPressEnter: true,
      api: () => baseStore.getDictionaryData('EngineeringDocApply.DocType'),
      labelField: 'fullName',
      valueField: 'enCode',
    },
  },
  // {
  //   label: '',
  //   fieldName: 'insideProjectCode',
  //   component: 'Input',
  //   componentProps: {
  //     placeholder: 'PD',
  //     submitOnPressEnter: true,
  //   },
  // },
];
