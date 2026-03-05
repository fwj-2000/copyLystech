import { getFlowStatus } from '/@/components/CustomComponents/src/warehouse/Constant';
import { getMoldNumberList } from '/@/api/warehouse/moIdBill';
import { getReceiveMoldPartNumberList } from '/@/api/productionDeal/moIdUseBack';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export const tempColums = [
  { type: 'checkbox', field: 'checkbox' },
  { title: '临时单号', field: 'temporaryOrder', sortable: true, width: 120 },
  { title: '临时单据类型', field: 'orderType', sortable: true, width: 120 },
  {
    title: '状态',
    field: 'statusEnum',
    i18nField: 'CommonCol.status',
    width: 100,
    cellRender: {
      name: 'Tag',
      options: getFlowStatus(),
    },
  },
  { title: '模具料号', field: 'moldPartNumber', sortable: true, width: 150 },
  { title: '领料人', field: 'receiveMoldUserNames', minWidth: 200 },
  { title: '领料部门', field: 'receiveDeptName', sortable: true, width: 120 },
  { title: '确认发放仓管员', field: 'confirmGrantUserName', sortable: true, width: 200 },
  { title: '实际领用时间', field: 'actualReceiveDate', sortable: true, width: 120 },
  { title: '领退状态', field: 'receiveRefundStatus', sortable: true, width: 120, aqpFilter: { cSharpType: 'int', searchField: 'receiveRefundStatusEnum' } },
  { title: '实际退回时间', field: 'confirmReturnDate', sortable: true, width: 120 },
  { title: '退料人', field: 'refundMoldUserNames', sortable: true, width: 200 },
  { title: '本次使用寿命(KPCS)', field: 'thisUseLife', sortable: true, width: 150, aqpFilter: { cSharpType: 'int' } },
  { title: '确认归还仓管员', field: 'confirmReturnUserName', sortable: true, width: 200 },
];

export const applyTempUseColumn: any[] = [
  {
    title: '临时单号',
    field: 'temporaryOrder',
    formatter: ({ cellValue }) => {
      return cellValue || t('common.fromSys');
    },
  },
  {
    field: 'moldPartNumber',
    title: '模具料号',
    editRender: {
      name: 'ApiSelect',
      props: {
        placeholder: '模具料号',
        api: getMoldNumberList,
        showSearch: true,
        params: {
          type: 1,
          page: 20,
        },
        apiSearch: {
          show: false,
          keyword: 'moldPartNumber',
        },
        resultField: 'data',
        labelField: 'moldPartNumber',
        valueField: 'moldPartNumber',
      },
    },
  },
  {
    title: '领料人',
    field: 'receiveMoldUserIds',
    i18nField: 'receiveMoldUserNames',
    minWidth: 280,
    editRender: {
      cacheField: 'receiveMoldUserNames',
      name: 'CustomUserSelect',
    },
  },
  {
    title: '确认发放仓管员',
    field: 'confirmGrantUserId',
    i18nField: 'confirmGrantUserName',
    minWidth: 280,
    editRender: {
      cacheField: 'confirmGrantUserName',
      name: 'CustomUserSelect',
    },
  },
  {
    field: 'action',
    width: 100,
    fixed: 'right',
    slots: {
      default: 'action',
    },
  },
];
export const applyTempBackColumn: any[] = [
  {
    title: '临时单号',
    field: 'temporaryOrder',
    formatter: ({ cellValue }) => {
      return cellValue || t('common.fromSys');
    },
  },
  {
    field: 'moldPartNumber',
    title: '模具料号',
    editRender: {
      name: 'ApiSelect',
      props: {
        placeholder: '模具料号',
        api: getReceiveMoldPartNumberList,
        showSearch: true,
        params: {
          page: 20,
        },
        apiSearch: {
          show: false,
          keyword: 'moldPartNumber',
        },
        resultField: 'data',
        labelField: 'moldPartNumber',
        valueField: 'moldPartNumber',
      },
    },
  },
  {
    title: '退料人',
    field: 'refundMoldUserIds',
    i18nField: 'refundMoldUserNames',
    minWidth: 280,
    editRender: {
      cacheField: 'refundMoldUserNames',
      name: 'CustomUserSelect',
    },
  },
  {
    title: '确认归还仓管员',
    field: 'confirmReturnUserId',
    i18nField: 'confirmReturnUserName',
    minWidth: 280,
    editRender: {
      cacheField: 'confirmReturnUserName',
      name: 'CustomUserSelect',
    },
  },
  {
    field: 'action',
    width: 100,
    fixed: 'right',
    slots: {
      default: 'action',
    },
  },
];

// 核销领用
export const writeoffUseColumn = [
  { title: '单据类型', field: 'orderType', sortable: true },
  { title: '临时单号', field: 'moldReceiveApplyNo', sortable: true },
  { title: '模具料号', field: 'moldPartNumber', sortable: true },
  // { title: '模具状态', field: 'moldStatus', sortable: true },
  { title: '领退状态', field: 'receiveRefundStatus', sortable: true, aqpFilter: { cSharpType: 'int', searchField: 'receiveRefundStatusEnum' } },
  { title: '实际退回时间', field: 'confirmReturnDate', sortable: true },
  { title: '退料人', field: 'refundMoldUserNames', sortable: true },
  { title: '本次使用寿命(KPCS)', field: 'thisUseLife', sortable: true, aqpFilter: { cSharpType: 'int' } },
  { title: '确认归还仓管员', field: 'confirmReturnUserName', sortable: true, aqpFilter: { cSharpType: 'int' } },
  {
    title: '制单人',
    field: 'applyUserName',
    width: 230,
  },
  {
    title: '创建时间',
    field: 'applyDate',
    cellRender: {
      name: 'Date',
    },
  },
];

// 核销退用
export const writeoffBackColumn = [
  { title: '单据类型', field: 'orderType', sortable: true },
  { title: '临时单号', field: 'moldRefundApplyNo', sortable: true },
  { title: '模具料号', field: 'moldPartNumber', sortable: true },
  // { title: '模具状态', field: 'moldStatus', sortable: true },
  { title: '领退状态', field: 'receiveRefundStatus', sortable: true, aqpFilter: { cSharpType: 'int', searchField: 'receiveRefundStatusEnum' } },
  { title: '实际领用时间', field: 'actualReceiveDate', sortable: true },
  { title: '领料人', field: 'receiveMoldUserNames', minWidth: 350 },
  { title: '领料部门', field: 'receiveDeptName', sortable: true },
  { title: '确认发放仓管员', field: 'confirmGrantUserName', sortable: true },
  {
    title: '制单人',
    field: 'applyUserName',
    width: 230,
  },
  {
    title: '创建时间',
    field: 'applyDate',
    cellRender: {
      name: 'Date',
    },
  },
];

export const schemaLists = [
  {
    fieldName: 'moldPartNumber',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '模具料号',
    },
  },
  {
    fieldName: 'moldRefundApplyNo',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '临时单号',
    },
  },
];
