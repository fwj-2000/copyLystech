import type { VxeGridPropTypes } from 'vxe-table';

import { useI18n } from '/@/hooks/web/useI18n';
import { getFactoryList } from '/@/api/basicData/factory';
import { useUserStore } from '/@/store/modules/user';
import { STATUS_OPTIONS, PURCHASE_STATUS_OPTIONS, CONCLUSION_OPTIONS } from '/@/views/engineering/mouldBusiness/components/config';

export { downloadMoldDrawings, STATUS_ENUM, STATUS_OPTIONS } from '/@/views/engineering/mouldBusiness/components/config';

const { t } = useI18n();
const userStore = useUserStore();

/** 是否满足 枚举 */
export enum IS_MEET_ENUM {
  满足 = '1',
  不满足 = '0',
}

/** 是否满足 选项 */
export const IS_MEET_OPTIONS = [
  { id: IS_MEET_ENUM.满足, fullName: t('dict.OpinionTypeEnum.Satisfy'), theme: 'green' },
  { id: IS_MEET_ENUM.不满足, fullName: t('dict.OpinionTypeEnum.Discontent'), theme: 'red' },
];

/** 主表列配置 */
export const COLUMNS: VxeGridPropTypes.Columns = [
  { type: 'expand', width: 50, slots: { content: 'expandedRowRender' } },
  { type: 'checkbox', width: 50 },
  { type: 'seq', width: 50 },
  { title: '模具图纸', field: 'moldDrawingsName', minWidth: 180, slots: { default: 'moldDrawings' } },
  { title: '模具申请单号', field: 'applyNo', width: 260 },
  { title: '申请人', field: 'applyUserName', i18nField: 'CommonCol.applyUser', width: 260 },
  { title: '申请时间', field: 'applyDate', width: 260, cellRender: { name: 'Date', format: 'date|YYYY-MM-DD hh:mm:ss' } },
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

/** 待处理 - 展开子表列配置 */
export const SUB_TODO_COLUMNS: VxeGridPropTypes.Columns = [
  { type: 'checkbox', width: 50 },
  { title: '单据类型', field: 'itemTypeName', i18nField: 'itemType', width: 80 },
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
  },
  {
    title: '采购状态',
    field: 'purchaseStatus',
    width: 100,
    cellRender: {
      name: 'Tag',
      options: PURCHASE_STATUS_OPTIONS,
    },
  },
  { title: '当前节点', field: 'currentNodeName', width: 100 },
  { title: '当前处理人', field: 'currentProcessorName', width: 150 },
  { title: '节点记录', field: 'nodeRecord', width: 100, i18nField: 'CommonCol.nodeRecord', slots: { default: 'nodeRecord' } },
  { title: '产品内部料号', field: 'insidePartNumber', width: 150 },
  { title: '旧版成品编码', field: 'insidePartNumberOld', width: 150 },
  {
    title: '工厂',
    field: 'factoryName',
    width: 150,
    formatter: ({ row }) => {
      return [row.factory, row.factoryName].filter(Boolean).join('/');
    },
  },
  { title: '修改类型', field: 'modifyTypeName', width: 200, i18nField: 'modifyType', className: 'text-red-500' },
  { title: '修改原因', field: 'modifyReason', width: 200, className: 'text-red-500' },
  { title: '交期回复', field: 'deliveryTime', width: 100, cellRender: { name: 'Date', format: 'YYYY-MM-DD' } },
  { title: '价格', field: 'quotation', width: 100 },
  { title: '模房结论', field: 'moldHouseResult', width: 100, cellRender: { name: 'Tag', options: CONCLUSION_OPTIONS } },
  { title: '采购结论', field: 'purchaseResult', width: 100, cellRender: { name: 'Tag', options: CONCLUSION_OPTIONS } },
  {
    title: '模具实物状态',
    field: 'moldPhysicalStatusName',
    i18nField: 'moldPhysicalStatus',
    width: 200,
  },
  { title: '采购类型', field: 'purchaseTypeName', i18nField: 'purchaseType', width: 100 },
  { title: 'PR单号', field: 'prNo', width: 150 },
  { title: '模具类型', field: 'moldTypeName', width: 100 },
  { title: '模具备注', field: 'moldRemark', width: 200 },
  { title: '产品类型', field: 'productTypeName', width: 200 },
  { title: '要求交期', field: 'requireDeliveryTime', width: 100, cellRender: { name: 'Date', format: 'YYYY-MM-DD' } },
  { title: '模具采购', field: 'purchaseUserName', width: 150, i18nField: 'moldPurchaseName' },
  { title: '供应商', field: 'supplierName', i18nField: 'supplier', width: 200 },
  { title: '收货地址', field: 'deliveryAddress', width: 200 },
];

/** 已处理 - 展开子表列配置 */
export const SUB_DONE_COLUMNS: VxeGridPropTypes.Columns = [
  ...SUB_TODO_COLUMNS,
  {
    title: 'PMC',
    field: 'designatedPmcReviewerName',
    width: 150,
  },
  {
    title: '材质',
    field: 'material',
    width: 150,
  },
  {
    title: '工艺是否满足',
    field: 'isProcessMeet',
    width: 100,
    cellRender: { name: 'Tag', options: IS_MEET_OPTIONS },
  },
  {
    title: '不满足原因',
    field: 'notMeetReason',
    width: 200,
  },
];
