import { STATUS_OPTIONS } from '/@/utils/status/index';
import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';

const { t } = useI18n();

const baseStore = useBaseStore();

/**
 * 清单页 - 未处理表格列
 */
export function getUnReviewColumns(): Array<any> {
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
      title: '状态',
      field: 'status',
      width: 100,
      cellRender: {
        name: 'Tag',
        options: STATUS_OPTIONS,
      },
    },
    {
      title: '需求类型',
      field: 'demandTypeName',
      i18nField: 'CommonCol.demandTypeName',
      width: 110,
    },
    {
      title: '版本',
      field: 'version',
      formatter: ({ row }) => {
        if (typeof row?.version === 'number') {
          return `T${row.version}`;
        } else {
          return '/';
        }
      },
      width: 80,
    },
    {
      title: '资料类型',
      field: 'docType',
      width: 100,
    },
    {
      title: '资料名称',
      field: 'fileName',
      slots: { default: 'fileName' },
      width: 220,
    },
    {
      title: '直接客户名称',
      field: 'immediateCustomerCode',
      i18nField: 'CommonCol.immediateCustomerName',
      width: 160,
    },
    {
      title: '直接客户料号',
      field: 'immediateCustomerPartNumber',
      width: 180,
    },
    {
      title: '终端客户料号',
      field: 'terminalCustomerPartNumber',
      width: 180,
    },
    {
      title: '工厂',
      field: 'factoryName',
      i18nField: 'CommonCol.factory',
      width: 120,
    },
    {
      title: '产品描述',
      field: 'productDesc',
      width: 120,
    },
    {
      title: 'PD',
      field: 'creatorUserName',
      width: 160,
    },
    {
      title: '当前处理人',
      field: 'handlerName',
      width: 160,
    },
    {
      title: '当前节点',
      field: 'currentNodeName',
      width: 100,
    },
    {
      title: '节点记录',
      field: 'nodeDetail',
      i18nField: 'CommonCol.nodeDetail',
      slots: { default: 'nodeDetail' },
      width: 100,
    },
    {
      title: '备注',
      field: 'nodeRemark',
      cellRender: {
        name: 'Remark',
        nodeCode: 'PDTLeaderReview',
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

/**
 * 未处理表格搜索
 */
export const unReviewSchemas = [
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
    fieldName: 'immediateCustomerCode',
    component: 'Input',
    componentProps: {
      placeholder: '直接客户名称',
      submitOnPressEnter: true,
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
    fieldName: 'creatorUserName',
    component: 'Input',
    componentProps: {
      placeholder: 'PD',
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
    fieldName: 'docType',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '资料类型',
      api: () => {
        return baseStore.getDictionaryData('EngineeringDocApply.DocType');
      },
      labelField: 'fullName',
      valueField: 'enCode',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
    },
  },
  {
    label: '',
    fieldName: 'status',
    component: 'Select',
    componentProps: {
      placeholder: '请选择状态',
      options: STATUS_OPTIONS,
      fieldNames: { label: 'fullName', value: 'id' },
    },
  },
];

/**
 * 已处理表格搜索
 */
export const reviewSchemas = [
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
    fieldName: 'immediateCustomerPartNumber',
    component: 'Input',
    componentProps: {
      placeholder: '直接客户料号',
      submitOnPressEnter: true,
    },
  },
];
