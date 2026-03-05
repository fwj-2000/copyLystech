import type { VxeGridPropTypes } from 'vxe-table';

import { useI18n } from '/@/hooks/web/useI18n';
import { getFactoryList } from '/@/api/basicData/factory';
import { useUserStore } from '/@/store/modules/user';
import { STATUS_OPTIONS, PURCHASE_STATUS_OPTIONS, CONCLUSION_OPTIONS, ITEM_TYPE_OPTIONS } from '/@/views/engineering/mouldBusiness/components/config';
import { IS_MEET_OPTIONS } from '/@/views/engineering/mouldRoom/mouldRequirementReview/config';
import { modifyTypeOptions } from '/@/views/engineering/mouldBusiness/apply/components/modifyPopConfig';
import { useBaseStore } from '/@/store/modules/base';
import { getProductType } from '/@/api/engineering/pcc';
import { getSupplierlist } from '/@/api/engineering/mould';

export { downloadMoldDrawings, STATUS_ENUM, STATUS_OPTIONS } from '/@/views/engineering/mouldBusiness/components/config';

export const MEET_OPTIONS = IS_MEET_OPTIONS;

const { t } = useI18n();
const userStore = useUserStore();
const baseStore = useBaseStore();

/** 主表列配置 */
export const COLUMNS: VxeGridPropTypes.Columns = [
  { type: 'checkbox', width: 50 },
  { type: 'seq', width: 50 },
  {
    title: '单据类型',
    field: 'itemType',
    formatter: ({ row }) => {
      return row.itemTypeName || '';
    },
    width: 100,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ASelect',
      props: {
        options: ITEM_TYPE_OPTIONS,
        fieldNames: {
          label: 'fullName',
          value: 'id',
        },
      },
    },
  },
  { title: '模具图纸', field: 'moldDrawingsName', width: 180, slots: { default: 'moldDrawings' } },
  { title: '模具申请单号', field: 'applyNo', width: 260 },
  { title: '模具料号', field: 'moldNo', width: 150 },
  {
    title: '状态',
    field: 'status',
    i18nField: 'CommonCol.status',
    width: 100,
    cellRender: {
      name: 'Tag',
      options: STATUS_OPTIONS,
    },
    filters: [{ data: '' }],
    filterRender: {
      name: 'ASelect',
      props: {
        options: STATUS_OPTIONS,
        fieldNames: {
          label: 'fullName',
          value: 'id',
        },
      },
    },
  },
  { title: '当前节点', field: 'currentNodeName', width: 100 },
  { title: '当前处理人', field: 'currentProcessorName', width: 150 },
  { title: '节点记录', field: 'nodeRecord', i18nField: 'CommonCol.nodeRecord', width: 100, slots: { default: 'nodeRecord' } },
  {
    title: 'PMC',
    field: 'designatedPmcReviewerId',
    formatter: ({ row }) => {
      return row.designatedPmcReviewerName || '';
    },
    width: 150,
    filters: [{ data: '' }],
    filterRender: {
      name: 'CustomUserSelect',
    },
  },
  {
    title: '材质',
    field: 'material',
    width: 150,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '交期回复',
    field: 'deliveryTime',
    width: 150,
    cellRender: { name: 'Date', format: 'YYYY-MM-DD' },
    filters: [{ data: '' }],
    filterRender: {
      name: 'DatePicker',
      props: {
        valueFormat: 'YYYY-MM-DD',
      },
    },
  },
  { title: '价格', field: 'quotation', width: 100 },
  {
    title: '工艺是否满足',
    field: 'isProcessMeet',
    width: 150,
    cellRender: { name: 'Tag', options: IS_MEET_OPTIONS },
    filters: [{ data: '' }],
    filterRender: {
      name: 'ASelect',
      props: {
        options: IS_MEET_OPTIONS,
        fieldNames: {
          label: 'fullName',
          value: 'id',
        },
      },
    },
  },
  {
    title: '不满足原因',
    field: 'notMeetReason',
    width: 200,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '采购状态',
    field: 'purchaseStatus',
    width: 100,
    cellRender: {
      name: 'Tag',
      options: PURCHASE_STATUS_OPTIONS,
    },
    filters: [{ data: '' }],
    filterRender: {
      name: 'ASelect',
      props: {
        options: PURCHASE_STATUS_OPTIONS,
        fieldNames: {
          label: 'fullName',
          value: 'id',
        },
      },
    },
  },
  { title: '产品内部料号', field: 'insidePartNumber', width: 150 },
  {
    title: '旧版成品编码',
    field: 'insidePartNumberOld',
    width: 150,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '工厂',
    field: 'factoryName',
    width: 150,
    formatter: ({ row }) => {
      return [row.factory, row.factoryName].filter(Boolean).join('/');
    },
  },
  {
    title: '修改类型',
    field: 'modifyType',
    width: 200,
    formatter: ({ row }) => {
      return row.modifyTypeName || '';
    },
    filters: [{ data: '' }],
    filterRender: {
      name: 'ASelect',
      props: {
        options: modifyTypeOptions,
        fieldNames: {
          label: 'label',
          value: 'value',
        },
      },
    },
  },
  { title: '修改原因', field: 'modifyReason', width: 200 },
  {
    title: '模房结论',
    field: 'moldHouseResult',
    width: 100,
    cellRender: { name: 'Tag', options: CONCLUSION_OPTIONS },
    filters: [{ data: '' }],
    filterRender: {
      name: 'ASelect',
      props: {
        options: CONCLUSION_OPTIONS,
        fieldNames: {
          label: 'fullName',
          value: 'id',
        },
      },
    },
  },
  {
    title: '采购结论',
    field: 'purchaseResult',
    width: 100,
    cellRender: { name: 'Tag', options: CONCLUSION_OPTIONS },
    filters: [{ data: '' }],
    filterRender: {
      name: 'ASelect',
      props: {
        options: CONCLUSION_OPTIONS,
        fieldNames: {
          label: 'fullName',
          value: 'id',
        },
      },
    },
  },
  {
    title: '模具类型',
    field: 'moldType',
    formatter: ({ row }) => {
      return row.moldTypeName || '';
    },
    width: 100,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      props: {
        api: () => baseStore.getDictionaryData('MoldApply.MoldType'),
        showSearch: false,
        filterOption: false,
        notFoundContent: null,
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
      },
    },
  },
  {
    title: '模具备注',
    field: 'moldRemark',
    width: 200,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '产品类型',
    field: 'productType',
    formatter: ({ row }) => {
      return row.productTypeName || '';
    },
    width: 200,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      props: {
        api: getProductType,
        params: {
          pageSize: 20,
        },
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'productCategory',
        },
        rowParams: {
          factory: 'factory',
          bussniessType: 'businessType',
        },
        resultField: 'data',
        labelField: 'productCategory',
        valueField: 'id',
        filterOption: false,
      },
    },
  },
  {
    title: '要求交期',
    field: 'requireDeliveryTime',
    width: 150,
    cellRender: { name: 'Date', format: 'YYYY-MM-DD' },
    filters: [{ data: '' }],
    filterRender: {
      name: 'DatePicker',
      props: {
        valueFormat: 'YYYY-MM-DD',
      },
    },
  },
  {
    title: '模具采购',
    field: 'purchaseUserId',
    formatter: ({ row }) => {
      return row.purchaseUserName || '';
    },
    width: 150,
    i18nField: 'moldPurchaseName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'CustomUserSelect',
    },
  },
  {
    title: '模房工程',
    field: 'designatedEngReviewerId',
    formatter: ({ row }) => {
      return row.designatedEngReviewerName || '';
    },
    width: 150,
    filters: [{ data: '' }],
    filterRender: {
      name: 'CustomUserSelect',
    },
  },
  {
    title: '申请人',
    field: 'applyUserId',
    formatter: ({ row }) => {
      return row.applyUserName || '';
    },
    width: 150,
    filters: [{ data: '' }],
    filterRender: {
      name: 'CustomUserSelect',
    },
  },
  { title: '申请时间', field: 'applyDate', width: 150, cellRender: { name: 'Date', format: 'date|YYYY-MM-DD hh:mm:ss' } },
  {
    title: '供应商',
    field: 'supplier',
    formatter: ({ row }) => {
      return [row.supplier, row.supplierName].filter(Boolean).join('/');
    },
    width: 200,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      props: {
        api: getSupplierlist,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'searchKey',
        },
        resultField: 'data',
        valueField: 'code',
        labelField: 'name',
        immediate: true,
        filterOption: false,
      },
    },
  },
  {
    title: '收货地址',
    field: 'deliveryAddress',
    width: 200,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  { title: t('common.action'), fixed: 'right', field: 'action', width: 50, slots: { default: 'action' } },
];

/** 搜素表单配置 */
export function getSchema(isTodo = false) {
  return [
    {
      fieldName: 'applyNo',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '模具申请单号',
      },
    },
    {
      fieldName: 'moldNo',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '模具料号',
      },
    },
    {
      fieldName: 'insidePartNumber',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '产品内部料号',
      },
    },
    {
      fieldName: 'currentProcessorId',
      label: '',
      i18nField: 'currentProcessorName',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: '当前处理人',
        defaultValue: isTodo ? userStore.getUserInfo?.userId : void 0,
      },
    },
    {
      fieldName: 'factory',
      label: '',
      i18nField: 'factoryName',
      component: 'ApiSelect',
      componentProps: {
        api: getFactoryList,
        placeholder: '工厂',
        resultField: 'data',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        labelField: 'Name',
        valueField: 'Code',
        nameFormat: ['Code', '/', 'Name'],
      },
    },
    {
      fieldName: 'time',
      label: '',
      component: 'RangePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
        placeholder: [t('dict.CommonCol.startTime'), t('dict.CommonCol.endTime')],
      },
    },
  ];
}
