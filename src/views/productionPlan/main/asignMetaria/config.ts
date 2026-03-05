import { FLOWSTATE_LIST } from '/@/components/CustomComponents/src/Constant';
import { useI18n } from '/@/hooks/web/useI18n';
import { cloneDeep } from 'lodash-es';

const { t } = useI18n();

export const formSchema = [
  {
    fieldName: 'applyCode',
    i18nField: 'CommonCol.applyCode',
    component: 'Input',
    componentProps: {
      placeholder: t('common.pleaseEnter'),
    },
    colProps: { span: 8 },
  },
  {
    fieldName: 'status',
    component: 'Select',
    componentProps: {
      options: FLOWSTATE_LIST,
      placeholder: t('common.pleaseSelect'),
    },
    colProps: { span: 8 },
  },
  {
    fieldName: 'fCode',
    component: 'Input',
    i18nField: 'CommonCol.insidePartNumber',
    componentProps: {
      placeholder: '产品内部料号',
    },
    colProps: { span: 8 },
  },
];

export const columns = [
  {
    type: 'expand',
    width: 45,
    align: 'center',
    slots: { content: 'expand' },
  },
  {
    type: 'checkbox',
    field: 'checkbox',
    width: 50,
  },
  { title: '单号', field: 'applyCode', i18nField: 'CommonCol.applyCode' },
  {
    title: '状态',
    field: 'status',
    width: 140,
    cellRender: {
      name: 'Tag',
      options: FLOWSTATE_LIST,
    },
  },
  {
    title: '当前处理人',
    field: 'handlerName',
    width: 160,
  },
  {
    title: '当前节点',
    field: 'currentNodeName',
    width: 160,
  },
  {
    title: '节点记录',
    field: 'nodeDetail',
    width: 160,
    slots: { default: 'nodeDetail' },
  },
  {
    title: '内部料号',
    field: 'mCode',
    width: 180,
  },
  { title: '产品内部料号', field: 'fCode', width: 200 },
  {
    title: '旧版内部料号',
    field: 'pnOld',
    width: 180,
  },
  {
    title: '调配前申请数量',
    field: 'pQtyBefore',
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '调配前已占用数量',
    field: 'oQtyBefore',
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '调配后申请数量',
    field: 'pQtyAfter',
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '调配后占用数量',
    field: 'oQtyAfter',
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '创建时间',
    field: 'creatorTime',
    i18nField: 'lastModifyTime',
    cellRender: {
      name: 'Date',
    },
  },
  {
    title: '创建人',
    field: 'creatorUserName',
    i18nField: 'CommonCol.creator',
    width: 160,
  },
];

export const doneColumns = cloneDeep(columns);
doneColumns.splice(
  5,
  0,
  {
    title: '库存转移状态',
    field: 'transferStatus',
    width: 120,
  },
  {
    title: '库存转移信息',
    field: 'transferResult',
    width: 120,
  },
);

export const subColumns = [
  {
    title: '内部料号',
    field: 'mCode',
    minWidth: 180,
  },
  {
    title: '对应产品内部料号',
    field: 'fCode',
    minWidth: 180,
  },
  {
    title: '旧版内部料号',
    field: 'pnOld',
    width: 180,
  },
  // {
  //   title: '对应PC',
  //   field: 'pcName',
  //   width: 120,
  // },
  // {
  //   title: '对应MC',
  //   field: 'mcName',
  //   width: 120,
  // },
  {
    title: '调配前申请数量',
    field: 'pQtyBefore',
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '调配前已占用数量',
    field: 'oQtyBefore',
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '调配后申请数量',
    field: 'pQtyAfter',
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '调配后占用数量',
    field: 'oQtyAfter',
    cellRender: {
      name: 'Number',
    },
  },
];
