import { BasicColumn, FormProps } from '/@/components/Table';
import { useUserStore } from '/@/store/modules/user';
import { useBaseStore } from '/@/store/modules/base';
import { useI18n } from '/@/hooks/web/useI18n';
import { DRAWING_STATUS_OPTIONS, STATUS_OPTIONS } from '/@/utils/status/index';
import { useI18n } from '/@/hooks/web/useI18n';

const baseStore = useBaseStore();
const { t } = useI18n();

export function originGetColumns() {
  return [
    { field: 'checkbox', width: 50, type: 'checkbox' },
    { title: '序号', type: 'seq', field: 'index', width: 50 },
    { title: '来源单号', field: 'originCode', width: 180 },
    { title: '来源类型', field: 'demandTypeName', width: 120 },
    { title: '产品内部料号', field: 'insidePartNumber', width: 220 },
    { title: '旧版成品编码', field: 'insidePartNumberOld', width: 220 },
    { title: '当前处理人', field: 'handlerName', width: 180 },
    {
      title: '脱敏图纸',
      field: 'desensitizedDrawingsName',
      slots: { default: 'desensitizedDrawingsName' },
    },
    {
      title: '备注',
      field: 'nodeRemark',
      i18nField: 'CommonCol.remark',
      cellRender: {
        name: 'Remark',
        nodeCode: 'PDTLeaderReview',
      },
    },
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 100,
      fixed: 'right',
    },
  ];
}

export const columns = [
  { field: 'checkbox', width: 50, type: 'checkbox' },
  {
    title: '单号',
    field: 'originCode',
    width: 180,
  },
  {
    title: '需求类型',
    field: 'demandTypeName',
    width: 180,
  },
  {
    title: '产品内部料号',
    field: 'insidePartNumber',
    width: 180,
  },
  {
    title: '旧版成品编码',
    field: 'insidePartNumberOld',
    width: 180,
  },
  // {
  //   title: '图纸评审记录',
  //   field: 'openDetail',
  //   slots: { default: 'openDetail' },
  //   width: 180,
  // },
  {
    title: '脱敏图纸',
    field: 'desensitizedDrawingsName',
    slots: { default: 'desensitizedDrawingsName' },
    width: 260,
  },
  {
    title: '备注',
    field: 'nodeRemark',
    i18nField: 'CommonCol.remark',
    cellRender: {
      name: 'Remark',
      nodeCode: 'PDTLeaderReview',
    },
  },
  {
    title: '状态',
    field: 'status',
    cellRender: {
      name: 'Tag',
      options: DRAWING_STATUS_OPTIONS,
    },
    width: 120,
  },
  {
    title: '当前处理人',
    field: 'handlerName',
    width: 180,
  },
  {
    title: '当前节点',
    field: 'reviewNodeName',
    width: 180,
  },
  {
    title: '节点详情',
    field: 'nodeDetail',
    slots: { default: 'nodeDetail' },
    width: 120,
    sorter: true,
  },
  {
    title: '申请人',
    field: 'originApplyUserName',
    width: 180,
  },
  {
    title: '终端客户料号',
    field: 'terminalCustomerPartNumber',
    width: 120,
  },
  {
    title: '产品描述',
    field: 'productDesc',
    width: 180,
  },
  {
    title: '工厂',
    field: 'factoryName',
    formatter: ({ row }) => {
      return `${row.factory}/${row.factoryName}`;
    },
    width: 160,
  },
  {
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: 70,
    fixed: 'right',
  },
];

const userStore = useUserStore();
export function getPendingFormSchema(): any {
  return [
    {
      label: '',
      fieldName: 'originCode',
      component: 'Input',
      componentProps: {
        placeholder: '单号',
      },
    },
    {
      label: '',
      fieldName: 'originType',
      i18nField: 'CommonCol.demandType',
      component: 'ApiSelect',
      componentProps: {
        placeholder: t('dict.CommonCol.demandType'),
        submitOnPressEnter: true,
        api: () => baseStore.getDictionaryData('DrawingsReview.OriginType'),
        labelField: 'fullName',
        valueField: 'enCode',
      },
    },
    {
      label: '',
      fieldName: 'handlerId',
      i18nField: 'CommonCol.currentNodeUser',
      component: 'CustomUserSelect',
      componentProps: {
        defaultValue: userStore.userInfo?.userId,
        placeholder: '当前处理人',
      },
    },
    // {
    //   label: '',
    //   field: 'status',
    //   component: 'Select',
    //   defaultValue: '2',
    //   componentProps: {
    //     placeholder: '状态',
    //     submitOnPressEnter: true,
    //     options: [
    //       { id: '2', fullName: '处理中' },
    //       { id: '3', fullName: '已处理' },
    //     ],
    //   },
    // },
    {
      label: '',
      fieldName: 'insidePartNumber',
      component: 'Input',
      componentProps: {
        placeholder: '产品内部料号',
      },
    },
    {
      label: '',
      fieldName: 'insidePartNumberOld',
      component: 'Input',
      componentProps: {
        placeholder: '旧版成品编码',
      },
    },
    {
      label: '',
      fieldName: 'terminalCustomerPartNumber',
      component: 'Input',
      componentProps: {
        placeholder: '终端客户料号',
      },
    },
    // {
    //   label: '',
    //   field: 'demandTypeName',
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: '来源类型',
    //     submitOnPressEnter: true,
    //   },
    // },
    {
      label: '',
      fieldName: 'insideProjectCode',
      component: 'Input',
      componentProps: {
        placeholder: '内部项目代码',
      },
    },
  ];
}

export function waitFormConfigSchema(): any {
  return [
    {
      label: '',
      fieldName: 'originCode',
      component: 'Input',
      componentProps: {
        placeholder: '单号',
      },
    },
    {
      label: '',
      fieldName: 'originType',
      i18nField: 'CommonCol.demandType',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '需求类型',
        submitOnPressEnter: true,
        api: () => baseStore.getDictionaryData('DrawingsReview.OriginType'),
        labelField: 'fullName',
        valueField: 'enCode',
      },
    },
    {
      label: '',
      fieldName: 'handlerId',
      i18nField: 'CommonCol.currentNodeUser',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: '当前处理人',
      },
    },
    {
      label: '',
      fieldName: 'insidePartNumber',
      component: 'Input',
      componentProps: {
        placeholder: '产品内部料号',
      },
    },
    {
      label: '',
      fieldName: 'insidePartNumberOld',
      component: 'Input',
      componentProps: {
        placeholder: '旧版成品编码',
      },
    },
    // {
    //   label: '',
    //   fieldName: 'demandType',
    //   i18nField: 'demandTypeName',
    //   component: 'ApiSelect',
    //   componentProps: {
    //     placeholder: '需求类型',
    //     submitOnPressEnter: true,
    //     api: () => baseStore.getDictionaryData('DemandTypeEnum'),
    //     labelField: 'fullName',
    //     valueField: 'enCode',
    //   },
    // },
    {
      label: '',
      fieldName: 'terminalCustomerPartNumber',
      component: 'Input',
      componentProps: {
        placeholder: '终端客户料号',
      },
    },
    {
      label: '',
      fieldName: 'insideProjectCode',
      component: 'Input',
      componentProps: {
        placeholder: '内部项目代码',
      },
    },
  ];
}
