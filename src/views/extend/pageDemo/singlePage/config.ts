import type { VxeGridPropTypes } from 'vxe-table';
import type { FormSchema as VxeFormSchema } from '/@/components/VxeTable/ui-kit/form-ui/src/types';

import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
import { useUserStore } from '/@/store/modules/user';
import { STATUS_OPTIONS } from '/@/utils/status';

const baseStore = useBaseStore();
const userStore = useUserStore();

export const CURRENT_RM_NODE = 'ApplyNode';

const { t } = useI18n();

export const tableColumns: VxeGridPropTypes.Columns = [
  { type: 'checkbox', field: 'checkbox', width: 50 },
  {
    title: '申请单号',
    field: 'ApplyCode',
    width: 140,
    sortable: true,
  },
  {
    title: '产品内部料号',
    field: 'InsidePartNumber',
    width: 220,
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
        options: STATUS_OPTIONS,
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
    sortable: true,
  },
  {
    title: '终端客户料号',
    field: 'TerminalCustomerPartNumber',
    width: 160,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    sortable: true,
  },
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
    sortable: true,
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
  {
    title: '备注',
    field: 'nodeRemark',
    i18nField: 'CommonCol.remark',
    width: 150,
    // 节点备注
    cellRender: {
      name: 'Remark',
      nodeCode: CURRENT_RM_NODE,
    },
  },
  {
    title: '申请人',
    field: 'ApplyUserName',
    width: 220,
    sortable: true,
  },
  {
    title: '申请时间',
    field: 'ApplyDate',
    width: 150,
    cellRender: {
      name: 'Date',
    },
    sortable: true,
  },
  {
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: 80,
    fixed: 'right',
  },
];

export function getQuotaFormConfig(): VxeFormSchema[] {
  return [
    {
      fieldName: 'RequireDate',
      label: '',
      component: 'DatePicker',
      componentProps: {
        placeholder: '客户要求交期',
      },
    },
    {
      fieldName: 'ApplyUserId',
      label: '',
      component: 'CustomUserSelect',
      componentProps: {
        defaultValue: userStore.getUserInfo.userId,
        placeholder: '申请人',
      },
    },
    {
      fieldName: 'ApplyCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '申请单号',
      },
    },
    {
      fieldName: 'InsidePartNumber',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '产品内部料号',
      },
    },
  ];
}
