import type { VxeGridPropTypes } from 'vxe-table';
import type { VbenFormSchema } from '/@/components/VxeTable/ui-kit/form-ui/src/index';

import { useBaseStore } from '/@/store/modules/base';
import { getFactoryList } from '/@/api/basicData/factory';
import { useI18n } from '/@/hooks/web/useI18n';
import { useUserStore } from '/@/store/modules/user';
import { fileDownload } from '/@/api/basicData/processrulestemplate';
import { downloadFile, downloadByUrl } from '/@/utils/file/download';
import { debounce } from 'lodash-es';
import { useMessage } from '/@/hooks/web/useMessage';

// 扩展 BasicColumn 接口，添加 disabled 属性
// type InputTypeOptions = 'cn' | 'en' | 'number' | 'code' | 'text' | '';
// interface ExtendedBasicColumn extends BasicColumn {
//   disabled?: boolean;
//   isEdit?: boolean;
//   border?: boolean;
//   placeholder?: string;
//   inputType?: InputTypeOptions;
// }

const baseStore = useBaseStore();
const { t } = useI18n();
const userStore = useUserStore();
const { createMessage } = useMessage();

export const P_STATUS_OPTIONS = [
  { id: 0, theme: 'gray', color: '#999999', fullName: '待处理', rowKey: 'purchaseStatusName' },
  { id: 1, theme: 'green', color: '#52C41A', fullName: '已处理', rowKey: 'purchaseStatusName' },
  { id: 2, theme: 'purple', color: '#DA5BFB', fullName: '撤回', rowKey: 'purchaseStatusName' },
  { id: 3, theme: 'blue', color: '#1890FF', fullName: '比价中', rowKey: 'purchaseStatusName' },
];

export const R_STATUS_OPTIONS = [
  { id: 0, theme: 'gray', color: '#999999', fullName: '待处理', rowKey: 'auditStatusName' },
  { id: 1, theme: 'green', color: '#52C41A', fullName: '已处理', rowKey: 'auditStatusName' },
  { id: 2, theme: 'purple', color: '#DA5BFB', fullName: '撤回', rowKey: 'auditStatusName' },
  { id: 3, theme: 'yellow', color: '#FAAD14', fullName: '驳回', rowKey: 'auditStatusName' },
];

/** 状态  枚举 */
export enum STATUS_ENUM {
  未发 = '0',
  撤回 = '1',
  驳回 = '2',
  比价中 = '3',
  在制中 = '4',
  终止 = '5',
  在办 = '6',
  结案 = '7',
  冻结 = '8',
}

/** 状态 选项 */
export const STATUS_OPTIONS = [
  // 未发
  { id: STATUS_ENUM.未发, theme: 'gray', color: '#999999', fullName: t('dict.MoldApply.Status.0'), rowKey: 'statusName' },
  // 撤回
  { id: STATUS_ENUM.撤回, theme: 'purple', color: '#DA5BFB', fullName: t('dict.MoldApply.Status.1'), rowKey: 'statusName' },
  // 驳回
  { id: STATUS_ENUM.驳回, theme: 'yellow', color: '#FAAD14', fullName: t('dict.MoldApply.Status.2'), rowKey: 'statusName' },
  // 比价中
  { id: STATUS_ENUM.比价中, theme: 'blue', color: '#1890FF', fullName: t('dict.MoldApply.Status.3'), rowKey: 'statusName' },
  // 在制中
  { id: STATUS_ENUM.在制中, theme: 'blue', color: '#1890FF', fullName: t('dict.MoldApply.Status.4'), rowKey: 'statusName' },
  // 终止
  { id: STATUS_ENUM.终止, theme: 'red', color: '#FF4D4F', fullName: t('dict.MoldApply.Status.5'), rowKey: 'statusName' },
  // 在办
  { id: STATUS_ENUM.在办, theme: 'blue', color: '#1890FF', fullName: t('dict.MoldApply.Status.6'), rowKey: 'statusName' },
  // 结案
  { id: STATUS_ENUM.结案, theme: 'green', color: '#52C41A', fullName: t('dict.MoldApply.Status.7'), rowKey: 'statusName' },
  // 冻结
  { id: STATUS_ENUM.冻结, theme: 'red', color: '#FF4D4F', fullName: t('dict.MoldApply.Status.8'), rowKey: 'statusName' },
];

/** 采购状态 枚举 */
export enum PURCHASE_STATUS_ENUM {
  未处理 = '0',
  已处理 = '1',
  驳回 = '2',
  比价中 = '3',
  未发 = '4',
  在制中 = '5',
  暂停 = '6',
  终止 = '7',
  已制作 = '8',
}

/** 采购状态选项 */
export const PURCHASE_STATUS_OPTIONS = [
  { id: PURCHASE_STATUS_ENUM.未处理, fullName: t('dict.MoldApply.PurchaseStatus.0'), theme: 'gray' },
  { id: PURCHASE_STATUS_ENUM.已处理, fullName: t('dict.MoldApply.PurchaseStatus.1'), theme: 'green' },
  { id: PURCHASE_STATUS_ENUM.驳回, fullName: t('dict.MoldApply.PurchaseStatus.2'), theme: 'yellow' },
  { id: PURCHASE_STATUS_ENUM.比价中, fullName: t('dict.MoldApply.PurchaseStatus.3'), theme: 'blue' },
  { id: PURCHASE_STATUS_ENUM.未发, fullName: t('dict.MoldApply.PurchaseStatus.4'), theme: 'gray' },
  { id: PURCHASE_STATUS_ENUM.在制中, fullName: t('dict.MoldApply.PurchaseStatus.5'), theme: 'blue' },
  { id: PURCHASE_STATUS_ENUM.暂停, fullName: t('dict.MoldApply.PurchaseStatus.6'), theme: 'yellow' },
  { id: PURCHASE_STATUS_ENUM.终止, fullName: t('dict.MoldApply.PurchaseStatus.7'), theme: 'red' },
  { id: PURCHASE_STATUS_ENUM.已制作, fullName: t('dict.MoldApply.PurchaseStatus.8'), theme: 'green' },
];

/** 单据类型 枚举 */
export enum ITEM_TYPE_ENUM {
  新增 = '0',
  修改完成 = '1',
  修改审批 = '2',
}

/** 单据类型 选项 */
export const ITEM_TYPE_OPTIONS = [
  { id: ITEM_TYPE_ENUM.新增, fullName: t('dict.MoldApply.ItemType.0'), theme: 'blue' },
  { id: ITEM_TYPE_ENUM.修改完成, fullName: t('dict.MoldApply.ItemType.1'), theme: 'green' },
  { id: ITEM_TYPE_ENUM.修改审批, fullName: t('dict.MoldApply.ItemType.2'), theme: 'yellow' },
];

export const D_STATUS_OPTIONS = [
  { id: 0, theme: 'gray', color: '#999999', fullName: '待处理', rowKey: 'deliveryConfirmStatusName' },
  { id: 1, theme: 'green', color: '#52C41A', fullName: '已处理', rowKey: 'deliveryConfirmStatusName' },
  { id: 2, theme: 'purple', color: '#DA5BFB', fullName: '撤回', rowKey: 'deliveryConfirmStatusName' },
  { id: 3, theme: 'yellow', color: '#FAAD14', fullName: '驳回', rowKey: 'deliveryConfirmStatusName' },
];

export const D_HANDLE_STATUS_OPTIONS = [
  { id: 0, theme: 'gray', color: '#999999', fullName: '待处理', rowKey: 'handleOpinionName' },
  { id: 1, theme: 'green', color: '#52C41A', fullName: '同意', rowKey: 'handleOpinionName' },
  { id: 2, theme: 'yellow', color: '#FAAD14', fullName: '不同意', rowKey: 'handleOpinionName' },
];

export const URGENTLEVEL_STATUS_COLOR_MAP = {
  0: { color: '#000000' },
  1: { color: '#000000' },
  2: { color: '#FAAD14' },
  3: { color: '#FF4D4F' },
};

/** 模房/采购 结论 枚举 */
export enum CONCLUSION_ENUM {
  同意 = '1',
  不同意 = '2',
}

/** 模房/采购 结论 选项 */
export const CONCLUSION_OPTIONS = [
  { id: CONCLUSION_ENUM.同意, fullName: t('common.agree'), theme: 'green' },
  { id: CONCLUSION_ENUM.不同意, fullName: t('common.disagree'), theme: 'red' },
];

export const BASIC_SEARCH_FORM_SCHEMA: Array<VbenFormSchema> = [
  {
    fieldName: 'applyNo',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      placeholder: '模具申请单号',
      allowClear: true,
    },
  },
  {
    fieldName: 'moldNo',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      placeholder: '模具料号',
      allowClear: true,
    },
  },
  {
    fieldName: 'insidePartNumber',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      placeholder: '产品内部料号',
      allowClear: true,
    },
  },
  {
    fieldName: 'moldPurchaseId',
    label: '',
    component: 'CustomUserSelect',
    defaultValue: '',
    componentProps: {
      placeholder: '模具采购',
      allowClear: true,
    },
  },
  {
    fieldName: 'factory',
    label: '',
    component: 'ApiSelect',
    i18nField: 'factoryName',
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
      allowClear: true,
    },
  },
];

export function SEARCH_FORM_SCHEMA(): Array<VbenFormSchema> {
  const list = [
    ...BASIC_SEARCH_FORM_SCHEMA,
    {
      fieldName: 'status',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        allowClear: true,
        api: async () => {
          return await baseStore.getDictionaryData('MoldApply.Status');
        },
        afterFetch: (res: any) => {
          if (!Array.isArray(res)) {
            return res;
          }
          const excludeStatus = new Set([STATUS_ENUM.在制中, STATUS_ENUM.比价中, STATUS_ENUM.未发]);
          return res.filter(item => !excludeStatus.has(item.enCode));
        },
        placeholder: '状态',
        showSearch: false,
        resultField: '',
        fieldNames: {
          value: 'enCode',
          label: 'fullName',
        },
      },
    },
    {
      fieldName: 'applyDate',
      label: '',
      component: 'RangePicker',
      componentProps: {
        placeholder: [t('dict.CommonCol.startTime'), t('dict.CommonCol.endTime')],
      },
    },
  ];

  list.splice(3, 0, {
    fieldName: 'applyUserId',
    label: '',
    i18nField: 'applyUserName',
    component: 'CustomUserSelect',
    componentProps: {
      placeholder: '申请人',
      defaultValue: userStore.getUserInfo?.userId,
      allowClear: true,
    },
  });

  return list;
}

export function P_SEARCH_FORM_SCHEMA(isTodo = false): Array<VbenFormSchema> {
  const baseSchema = [...BASIC_SEARCH_FORM_SCHEMA];
  const mouldPurchaseIndex = baseSchema.findIndex(item => item.fieldName === 'moldPurchaseId');
  if (mouldPurchaseIndex !== -1) {
    baseSchema.splice(
      mouldPurchaseIndex,
      0,
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
        fieldName: 'applyUserId',
        label: '',
        i18nField: 'applyUserName',
        component: 'CustomUserSelect',
        componentProps: {
          placeholder: '申请人',
        },
      },
    );
  }

  const list = [
    ...baseSchema,
    {
      fieldName: 'purchaseStatus',
      i18nField: 'status',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        api: async () => {
          return await baseStore.getDictionaryData('MoldApply.Status');
        },
        afterFetch: (res: any) => {
          if (!Array.isArray(res)) {
            return res;
          }
          const excludeStatus = new Set([STATUS_ENUM.在制中, STATUS_ENUM.比价中, STATUS_ENUM.未发]);
          return res.filter(item => !excludeStatus.has(item.enCode));
        },
        placeholder: '状态',
        showSearch: false,
        resultField: '',
        fieldNames: {
          value: 'enCode',
          label: 'fullName',
        },
      },
    },
  ];

  // 【已处理】页面新增【采购处理时间】
  if (!isTodo) {
    list.push({
      fieldName: 'purchaseDate',
      label: '',
      component: 'RangePicker',
      componentProps: {
        placeholder: [t('dict.MoldApply.purchaseStartDate'), t('dict.MoldApply.purchaseEndDate')],
      },
    });
  }

  return list;
}

export function R_SEARCH_FORM_SCHEMA(isTodo = false): Array<VbenFormSchema> {
  return [
    {
      fieldName: 'applyNo',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '模具申请单号',
        allowClear: true,
      },
    },
    {
      fieldName: 'moldNo',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '模具料号',
        allowClear: true,
      },
    },
    {
      fieldName: 'insidePartNumber',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '产品内部料号',
        allowClear: true,
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
        allowClear: true,
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
        allowClear: true,
      },
    },
    {
      fieldName: 'applyUserId',
      label: '',
      i18nField: 'applyUserName',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: '申请人',
        allowClear: true,
      },
    },
    {
      fieldName: 'applyDate',
      label: '',
      component: 'RangePicker',
      componentProps: {
        placeholder: [t('dict.CommonCol.startTime'), t('dict.CommonCol.endTime')],
      },
    },
  ];
}

export const COLUMNS: VxeGridPropTypes.Columns = [
  { type: 'expand', width: 50, slots: { content: 'expandedRowRender' } },
  { type: 'checkbox', width: 50 },
  { type: 'seq', width: 50 },
  { title: '模具图纸', field: 'moldDrawingsName', minWidth: 180, slots: { default: 'moldDrawings' } },
  { title: '模具申请单号', field: 'applyNo', width: 260 },
  // { title: '产品内部料号', field: 'insidePartNumber', width: 260 },
  // { title: '脱敏图纸', field: 'drawingshistory' },
  // { title: '旧版成品编码', field: 'insidePartNumberOld' },
  // { title: '工厂', field: 'factoryName' },
  { title: '申请人', field: 'applyUserName', width: 260 },
  { title: '申请时间', field: 'applyDate', width: 260, cellRender: { name: 'Date', format: 'date|YYYY-MM-DD hh:mm:ss' } },
  { title: t('common.action'), fixed: 'right', field: 'action', width: 50, slots: { default: 'action' } },
];

export const APPLY_DETAIL_COLUMNS: VxeGridPropTypes.Columns = [
  // {
  //   title: '模具图纸',
  //   field: 'moldDrawingsId',
  //   width: 300,
  //   slots: {
  //     default: 'moldDrawingsId'
  //   }
  // },
  { title: '模具申请单号', field: 'applyNo', width: 150 },
  { title: '模具编号', field: 'moldNo', width: 150 },
  { title: '产品内部料号', field: 'insidePartNumber', width: 180 },
  { title: '内部项目代码', field: 'insideProjectCode', width: 100 },
  { title: '直接客户代码', field: 'immediateCustomerCode', width: 100 },
  { title: '直接客户简称', field: 'immediateCustomerName', i18nField: 'CommonCol.immediateCustomerName', width: 240 },
  { title: '模具类型', field: 'moldTypeName', i18nField: 'CommonCol.mouldType', width: 80 },
  { title: '模具备注', field: 'moldRemark', width: 180 },
  { title: '模具用途', field: 'moldUse', width: 100 },
  { title: '预估寿命(KPCS)', field: 'estimateLifespan', width: 100 },
  { title: '项目阶段', field: 'projectPhaseName', width: 100 },
  { title: '主材厚度(MM)', field: 'mainMaterialThickness', width: 100 },
  { title: '工厂', field: 'factoryName', i18nField: 'CommonCol.factoryName', width: 100 },
  { title: '业务类型', field: 'businessTypeName', i18nField: 'CommonCol.businessType', width: 80 },
  {
    title: '是否保税',
    field: 'isBonded',
    i18nField: 'CommonCol.isBonded',
    width: 80,
    formatter: ({ cellValue }) => {
      if (typeof cellValue === 'boolean') {
        return cellValue ? t('common.yes') : t('common.no');
      }
      return '';
    },
  },
  {
    title: 'SAP工厂代码',
    field: 'sapFactoryName',
    i18nField: 'sapFactory',
    width: 120,
    formatter: ({ row }) => [row.sapFactory, row.sapFactoryName].filter(Boolean).join('/'),
  },
  {
    title: '仓位编码',
    field: 'shippingSpaceName',
    i18nField: 'shippingSpaceCode',
    width: 120,
    formatter: ({ row }) => [row.shippingSpaceCode, row.shippingSpaceName].filter(Boolean).join('/'),
  },
  { title: '产品类型', field: 'productTypeName', width: 120 },
  { title: '要求交期', field: 'requireDeliveryTime', width: 100, cellRender: { name: 'Date', format: 'YYYY-MM-DD' } },
  { title: '紧急程度', field: 'urgentLevelName', i18nField: 'CommonCol.urgentLevel', width: 80 },
  { title: '模具采购', field: 'moldPurchaseName', i18nField: 'moldPurchaseId', width: 180 },
  { title: '销售', field: 'salespersonName', width: 180 },
  { title: '成本中心', field: 'costCenter', width: 260 },
  { title: '费用归属', field: 'costAttribution', width: 80 },
  { title: '数量', field: 'quantity', width: 80 },
  { title: '申请人', field: 'applyUserName', width: 180 },
  { title: '申请时间', field: 'applyDate', width: 180, cellRender: { name: 'Date', format: 'date|YYYY-MM-DD hh:mm:ss' } },
];

export const PROCUREMENT_COLUMNS: any[] = [
  { title: '成本中心', dataIndex: 'costCenter', disabled: true, isEdit: true, inputType: '', placeholder: '费用归属', width: '260px' },
  { title: '供应商', dataIndex: 'supplier', disabled: true, isEdit: true, inputType: '', width: '260px', placeholder: '供应商' },
  {
    title: '供应商联系人',
    dataIndex: 'designatedEngReviewerId',
    i18nField: 'CommonCol.supplierContact',
    isEdit: true,
    inputType: '',
    placeholder: '联系人',
    width: '260px',
  },
  { title: '收货厂址', dataIndex: 'deliveryAddress', disabled: true, isEdit: true, inputType: '', width: '320px', placeholder: '收货厂址' },
  { title: '下单日期', dataIndex: 'applyDate', disabled: true, isEdit: true, inputType: '', placeholder: '下单日期', format: 'date|YYYY-MM-DD' },
  { title: '要求交期', dataIndex: 'requireDeliveryTime', disabled: true, isEdit: true, inputType: '', placeholder: '选择日期', format: 'date|YYYY-MM-DD' },
  { title: '回复交期', dataIndex: 'replyDeliveryTime', disabled: true, isEdit: true, inputType: '', placeholder: '选择日期', format: 'date|YYYY-MM-DD' },
  { title: '产品类型', dataIndex: 'productTypeName', disabled: true, isEdit: true, inputType: '', placeholder: '产品类型' },
  { title: '模具编号', dataIndex: 'moldNo', disabled: true, isEdit: true, inputType: 'code', width: '260px', placeholder: '模具编号' },
  { title: '模具备注', dataIndex: 'moldRemark', disabled: true, isEdit: true, inputType: '', placeholder: '模具备注' },
  { title: '数量', dataIndex: 'quantity', disabled: true, isEdit: true, inputType: '', placeholder: '数量' },
  { title: '模具用途', dataIndex: 'moldUseName', disabled: true, isEdit: true, inputType: '', placeholder: '模具用途' },
  { title: '申请人', dataIndex: 'applyUserName', disabled: true, isEdit: true, inputType: '', placeholder: '申请人' },
  { title: '备注', dataIndex: 'remark', i18nField: 'CommonCol.remark', disabled: true, isEdit: true, inputType: '', placeholder: '备注' },
];

export const COMPARE_PRICES_COLUMNS: any[] = [
  { title: '要求交期', dataIndex: 'requireDeliveryTime', disabled: true, isEdit: true, inputType: '', placeholder: '选择日期', format: 'date|YYYY-MM-DD' },
  { title: '产品类型', dataIndex: 'productTypeName', disabled: true, isEdit: true, inputType: '', placeholder: '默认自动带入' },
  { title: '模具编号', dataIndex: 'moldNo', disabled: true, isEdit: true, inputType: 'code', width: 200, placeholder: '模具编号' },
  { title: '模具备注', dataIndex: 'moldRemark', disabled: true, isEdit: true, inputType: '', placeholder: '模具备注' },
  // { title: '费用归属', dataIndex: 'costAttribution', disabled: true, isEdit: true, inputType: '', width: 260, placeholder: '费用归属' },
  { title: '数量', dataIndex: 'quantity', disabled: true, isEdit: true, inputType: '', placeholder: '数量' },
  { title: '模具用途', dataIndex: 'moldUseName', disabled: true, isEdit: true, inputType: '', placeholder: '模具用途' },
  // { title: '收货厂址', dataIndex: 'deliveryAddress', disabled: true, isEdit: true, inputType: '', width: 260, placeholder: '收货厂址' },
  { title: '工程负责人', dataIndex: 'applyUserName', disabled: true, isEdit: true, inputType: '', placeholder: '工程负责人' },
  // { title: '供应商', dataIndex: 'supplier', disabled: true, isEdit: true, inputType: '', width: 260, placeholder: '供应商' },
  { title: '备注', dataIndex: 'remark', i18nField: 'CommonCol.remark', disabled: true, isEdit: true, inputType: '', placeholder: '备注' },
  { title: '回复交期', dataIndex: 'replyDeliveryTime', disabled: true, isEdit: true, inputType: '', placeholder: '选择日期', format: 'date|YYYY-MM-DD' },
  {
    title: '供应商报价',
    dataIndex: 'CommonCol.supplierPrices',
    disabled: true,
    isEdit: true,
    inputType: '',
    placeholder: '供应商报价',
    format: 'date|YYYY-MM-DD',
  },
];

export const DELIVERY_PRICE_COLUMNS_UNHANDLE_NEW: any[] = [
  {
    type: 'checkbox',
    field: 'checkbox',
    width: 50,
  },
  { title: 'PO单号', field: 'poNo', width: 140 },
  {
    title: '模具图纸',
    field: 'moldDrawingsName',
    slots: { default: 'moldDrawingsName' },
    width: 160,
  },
  { title: '模具编号', field: 'moldNo', width: 140 },
  {
    title: '要求交期',
    field: 'requireDeliveryTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    width: 140,
  },
  {
    title: '交货日期',
    field: 'deliveryTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    width: 140,
  },
  {
    title: '价格（人民币）',
    field: 'quotation',
    width: 120,
  },
  {
    title: '状态',
    field: 'deliveryConfirmStatus',
    cellRender: {
      name: 'Tag',
      options: D_STATUS_OPTIONS,
    },
    width: 100,
  },
  { title: '当前处理人', field: 'currentProcessorName', width: 140 },
  { title: '当前节点', field: 'currentNodeName', width: 140 },
  { title: '节点记录', field: 'nodeRecord', width: 140, slots: { default: 'nodeRecord' } },
  { title: '工厂', field: 'factoryName', width: 140 },
  { title: '产品内部料号', field: 'insidePartNumber', width: 140 },
  { title: '模具类型', field: 'moldTypeName', width: 140 },
  { title: '模具备注', field: 'moldRemark', width: 140 },
  {
    title: '紧急程度',
    field: 'urgentLevelName',
    width: 140,
  },
  { title: '预估寿命(K)', field: 'estimateLifespan', width: 140 },
  { title: '模具用途', field: 'moldUseName', width: 140 },
  { title: '费用归属', field: 'costAttribution', width: 140 },
  { title: '成本中心', field: 'costCenter', width: 140 },
  {
    title: t('common.action'),
    width: '80',
    field: 'action',
    fixed: 'right',
    slots: {
      default: 'action',
    },
  },
];

export const DELIVERY_PRICE_COLUMNS_HANDLE_NEW: any[] = [
  {
    type: 'checkbox',
    field: 'checkbox',
    width: 50,
  },
  {
    title: '模具图纸',
    field: 'moldDrawingsName',
    slots: { default: 'moldDrawingsName' },
    width: 180,
  },
  { title: '模具编号', field: 'moldNo', width: 140 },
  {
    title: '要求交期',
    field: 'requireDeliveryTime',
    width: 140,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  {
    title: '交货日期',
    field: 'deliveryTime',
    width: 140,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  {
    title: '价格（人民币）',
    field: 'quotation',
    width: 140,
  },
  {
    title: '处理意见',
    field: 'handleOpinion',
    cellRender: {
      name: 'Tag',
      options: D_HANDLE_STATUS_OPTIONS,
    },
    width: 100,
  },
  { title: '当前处理人', field: 'currentProcessorName', width: 140 },
  { title: '当前节点', field: 'currentNodeName', width: 140 },
  { title: '节点记录', field: 'nodeRecord', width: 140, slots: { default: 'nodeRecord' } },
  { title: '工厂', field: 'factoryName', width: 140 },
  { title: '产品内部料号', field: 'insidePartNumber', width: 140 },
  { title: '模具类型', field: 'moldTypeName', width: 140 },
  { title: '模具备注', field: 'moldRemark', width: 140 },
  {
    title: '紧急程度',
    field: 'urgentLevelName',
    width: 140,
  },
  { title: '预估寿命(K)', field: 'estimateLifespan', width: 140 },
  { title: '模具用途', field: 'moldUseName', width: 140 },
  { title: '费用归属', field: 'costAttribution', width: 140 },
  { title: '成本中心', field: 'costCenter', width: 140 },
  {
    title: t('common.action'),
    width: '80',
    field: 'action',
    fixed: 'right',
    slots: {
      default: 'action',
    },
  },
];

export const DELIVERY_PRICE_COLUMNS_DETAILS_NEW: any[] = [
  {
    type: 'checkbox',
    field: 'checkbox',
    width: 50,
  },
  {
    title: '处理意见',
    field: 'handleOpinion',
    cellRender: {
      name: 'Tag',
      options: D_HANDLE_STATUS_OPTIONS,
    },
    width: 120,
  },
  { title: '原因', field: 'handleReason', i18nField: 'reason', width: 140, slots: { default: 'handleReason' } },
  { title: 'PO单号', field: 'poNo', width: 140 },
  {
    title: '模具图纸',
    field: 'moldDrawingsName',
    slots: { default: 'moldDrawingsName' },
    width: 180,
  },
  { title: '模具编号', field: 'moldNo', width: 140 },
  {
    title: '要求交期',
    field: 'requireDeliveryTime',
    width: 140,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  {
    title: '交货日期',
    field: 'deliveryTime',
    width: 140,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  {
    title: '价格（人民币）',
    field: 'quotation',
    width: 140,
  },
  { title: '模具类型', field: 'moldTypeName', width: 140 },
  { title: '模具备注', field: 'moldRemark', width: 140 },
  {
    title: '紧急程度',
    field: 'urgentLevelName',
    width: 140,
  },

  { title: '预估寿命(K)', field: 'estimateLifespan', width: 140 },
  { title: '模具用途', field: 'moldUseName', width: 140 },
  { title: '费用归属', field: 'costAttribution', width: 140 },
  { title: '成本中心', field: 'costCenter', width: 140 },
];

export const DELIVERY_PRICE_FORM_SCHEMA_NEW = [
  {
    fieldName: 'poNo',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      placeholder: 'PO单号',
    },
    colProps: { span: 3 },
  },
  {
    fieldName: 'moldNo',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      placeholder: '模具编号',
    },
    colProps: { span: 3 },
  },
  {
    fieldName: 'insidePartNumber',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      placeholder: '产品内部料号',
    },
    colProps: { span: 4 },
  },
  {
    fieldName: 'moldType',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('MoldApply.MoldType'),
      placeholder: '模具类型',
      resultField: 'data',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
      labelField: 'fullName',
      valueField: 'enCode',
    },
    colProps: { span: 3 },
  },
  {
    fieldName: 'moldUse',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('MoldApply.MoldUse'),
      placeholder: '模具用途',
      resultField: 'data',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
      labelField: 'fullName',
      valueField: 'fullName',
    },
    colProps: { span: 3 },
  },
  {
    fieldName: 'factory',
    label: '',
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
    },
    colProps: { span: 3 },
  },
  {
    fieldName: 'deliveryConfirmStatus',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('MoldDeliveryConfirmStatus'),
      placeholder: '选择状态',
      resultField: 'data',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
      labelField: 'fullName',
      valueField: 'enCode',
    },
    colProps: { span: 3 },
  },
];

/**
 * 下载新版模具图纸
 * @param list 图纸列表
 * @param list.filePath 图纸文件路径
 * @param list.fileName 图纸文件名
 */
export function downloadDrawings(list: Array<{ filePath: string; fileName: string }>) {
  // 参数校验
  if (!Array.isArray(list) || !list?.length) {
    return Promise.resolve(false);
  }

  // 下载间隔时间(ms)
  const DOWNLOAD_INTERVAL = 800;

  return list.reduce(async (promiseChain, item) => {
    return promiseChain.then(() => {
      return new Promise<void>(resolve => {
        // 确保item存在且包含必要属性
        if (item?.filePath && item?.fileName) {
          downloadFile({ url: item.filePath, fileName: item.fileName });
        }

        // 设置下载间隔
        setTimeout(resolve, DOWNLOAD_INTERVAL);
      });
    });
  }, Promise.resolve()); // 初始Promise
}

/**
 * 下载旧版模具图纸
 * @param ids 图纸ID列表
 * @returns
 */
async function downloadOldDrawings(ids: Array<string>) {
  if (!Array.isArray(ids) || !ids?.length) {
    return false;
  }

  // 下载间隔时间(ms)
  const DOWNLOAD_INTERVAL = 800;

  return ids.reduce(async (promiseChain, id) => {
    return promiseChain.then(async () => {
      // 处理当前ID的下载
      await fileDownload(id)
        .then(({ data }) => {
          data && downloadByUrl({ url: data.url, fileName: data.name });
        })
        .catch(e => {
          console.error('🚀 ~ config.ts:845 ~ processQueue ~ e:', e);
        });

      // 设置下载间隔
      return new Promise(resolve => {
        setTimeout(resolve, DOWNLOAD_INTERVAL);
      });
    });
  }, Promise.resolve()); // 初始Promise
}

/**
 * 下载模具图纸
 * @param rows 行数据
 * @param rows.moldDrawings 新版图纸列表
 * @param rows.moldDrawings.filePath 图纸文件路径
 * @param rows.moldDrawings.fileName 图纸文件名
 * @param rows.moldDrawingsId 旧版图纸ID
 * @returns
 */
export async function downloadMoldDrawings(rows: Array<{ moldDrawings?: Array<{ filePath: string; fileName: string }>; moldDrawingsId?: string }>) {
  if (!Array.isArray(rows) || !rows?.length) {
    return false;
  }

  // 区分新旧数据使用的图纸 新数据使用`moldDrawings`字段，旧数据使用`moldDrawingsId`字段
  const { moldDrawings, moldDrawingsIds } = rows.reduce<{ moldDrawings: Array<{ filePath: string; fileName: string }>; moldDrawingsIds: Array<string> }>(
    (pre, cur) => {
      if (Array.isArray(cur.moldDrawings) && cur.moldDrawings?.length) {
        pre.moldDrawings.push(...cur.moldDrawings);
      } else if (cur.moldDrawingsId) {
        pre.moldDrawingsIds.push(cur.moldDrawingsId);
      }
      return pre;
    },
    { moldDrawings: [], moldDrawingsIds: [] },
  );

  // 新数据图纸下载
  if (moldDrawings.length > 0) {
    await downloadDrawings(moldDrawings);
  }

  // 兼容旧数据图纸下载
  if (moldDrawingsIds.length > 0) {
    await downloadOldDrawings(moldDrawingsIds);
  }
}

/** 模具实物状态 枚举 */
export enum MOLD_PHYSICAL_STATUS {
  /** 模具未制作(无实物回仓) */
  无实物回仓 = '2',
  /** 模具已制作(模具成品/半成品回仓) */
  有实物回仓 = '1',
}

/** 确认修改模具物理状态 选项 */
export const confirmModifyOptions = [
  // 模具未制作(无实物回仓)
  { label: t('dict.MoldApply.noMoldPhysical'), value: MOLD_PHYSICAL_STATUS.无实物回仓 },
  // 模具已制作(模具成品/半成品回仓)
  { label: t('dict.MoldApply.hasMoldPhysical'), value: MOLD_PHYSICAL_STATUS.有实物回仓 },
];

/**
 * 判断文件列表(`Array<{ fileSize: number }>`)中文件大小总和是否超过是指定的大小，默认10M
 * @param list 文件列表，fileSize 单位字节
 * @param maxSize 最大文件大小，默认10M
 * @returns
 */
export function isFileSizeExceeded(list: Array<{ fileSize: number }>, maxSize = 10 * 1024 * 1024) {
  if (!Array.isArray(list) || list.length === 0) {
    return false;
  }

  return list.reduce((pre, cur) => pre + (cur.fileSize ?? 0), 0) > maxSize;
}

/** 防抖提示，提示文件名称禁止带有【？、&、=、/】等特殊符号 */
const showArrachmentTip = debounce(() => {
  createMessage.warning(t('common.attachmentTip'));
}, 200);
/**
 * 文件上传检测：检查文件名称是否带有【？、&、=、/】等特殊符号
 * @param _file
 * @param fileList
 * @returns
 */
export function beforeFileUpload(_file: File, fileList: Array<File>) {
  // 检查文件名称是否带有【？、&、=、/】等特殊符号
  const invalidChars = /[?&=/]/;
  for (const file of fileList) {
    if (invalidChars.test(file.name)) {
      showArrachmentTip();
      return false;
    }
  }
  return true;
}

/**
 * 是否禁止编辑
 */
export function isDisableEdit({ row, column }) {
  const { editRender } = column;
  return (
    !editRender ||
    editRender.enabled === false ||
    editRender.props?.disabled ||
    (typeof editRender.props?.dynamicDisabled === 'function' && editRender.props?.dynamicDisabled(row))
  );
}
