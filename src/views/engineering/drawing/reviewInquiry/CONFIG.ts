import { DRAWING_STATUS_OPTIONS, STATUS_OPTIONS } from '/@/utils/status/index';
import dayjs from 'dayjs';
import { FormSchema } from '/@/components/Form';
import { useBaseStore } from '/@/store/modules/base';

const baseStore = useBaseStore();
export const columns = [
  {
    title: '产品内部料号',
    field: 'insidePartNumber',
    width: 200,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
  },
  {
    title: '旧版成品编码',
    field: 'insidePartNumberOld',
    width: 200,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
  },
  {
    title: '来源单号',
    field: 'originCode',
    width: 160,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
  },
  { title: '来源类型', field: 'demandTypeName', width: 120 },
  {
    title: '状态',
    field: 'status',
    width: 150,
    cellRender: {
      name: 'Tag',
      options: DRAWING_STATUS_OPTIONS,
    },
  },
  {
    title: '当前节点',
    field: 'reviewNodeName',
    width: 160,
  },
  {
    title: '节点记录',
    field: 'nodeDetail',
    width: 160,
    sortable: true,
    slots: { default: 'nodeDetail' },
  },
  {
    title: 'PD',
    field: 'creatorUserName',
    width: 220,
  },
  {
    title: '当前处理人',
    field: 'handlerName',
    width: 220,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
    formatter: ({ row, cellValue }) => {
      if (row.status == 3) {
        return '/';
      } else {
        return cellValue;
      }
    },
  },
  {
    title: '评审结束时间',
    field: 'reviewDate',
    width: 200,
    formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : '/'),
  },
  {
    title: 'DFM',
    field: 'dfm',
    width: 80,
    slots: { default: 'dfm' },
  },
  {
    title: '工程资料制作',
    field: 'makeEngineeringInfo',
    width: 120,
    slots: { default: 'makeEngineeringInfo' },
  },
  {
    title: '评审结论',
    field: 'reviewResult',
    width: 80,
    slots: { default: 'reviewResult' },
  },
  {
    title: '脱敏图纸',
    field: 'desensitizedDrawingsName',
    width: 260,
    slots: { default: 'desensitizedDrawingsName' },
  },
  {
    title: '申请人',
    field: 'originApplyUserName',
    width: 200,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
  },
  {
    title: '内部项目代码',
    field: 'insideProjectCode',
    width: 200,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
  },
  {
    title: '终端客户料号',
    field: 'terminalCustomerPartNumber',
    width: 200,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
  },
  {
    title: '产品描述',
    field: 'productDesc',
    width: 200,
  },
  {
    title: '工厂',
    field: 'factoryName',
    formatter: ({ row }) => {
      return `${row.factory}/${row.factoryName}`;
    },
    width: 160,
  },
  // {
  //   title: '备注',
  //   field: 'remark',
  //   width: 200,
  // },
  {
    title: '操作',
    field: 'action',
    width: 80,
    fixed: 'right',
    slots: { default: 'action' },
  },
];

export const schemas: FormSchema[] = [
  {
    label: '',
    field: 'originCode',
    component: 'Input',
    componentProps: {
      placeholder: '来源单号',
      submitOnPressEnter: true,
    },
  },
  {
    label: '',
    field: 'insidePartNumber',
    component: 'Input',
    componentProps: {
      placeholder: '产品内部料号',
      submitOnPressEnter: true,
    },
  },
  {
    label: '',
    field: 'insidePartNumberOld',
    component: 'Input',
    componentProps: {
      placeholder: '旧版成品编码',
      submitOnPressEnter: true,
    },
  },
  {
    label: '',
    field: 'terminalCustomerPartNumber',
    component: 'Input',
    componentProps: {
      placeholder: '终端客户料号',
      submitOnPressEnter: true,
    },
  },
  {
    label: '',
    field: 'applyUserName',
    component: 'Input',
    componentProps: {
      placeholder: 'PD',
      submitOnPressEnter: true,
    },
  },
  {
    label: '',
    field: 'handlerName',
    component: 'Input',
    componentProps: {
      placeholder: '当前处理人',
      submitOnPressEnter: true,
    },
  },
  {
    label: '',
    field: 'demandType',
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
  // {
  //   label: '',
  //   field: 'applyCode',
  //   component: 'Input',
  //   componentProps: {
  //     placeholder: '来源单号',
  //     submitOnPressEnter: true,
  //   },
  // },
  {
    label: '',
    field: 'factory',
    component: 'Input',
    componentProps: {
      placeholder: '工厂',
      submitOnPressEnter: true,
    },
  },
  {
    label: '',
    field: 'insideProjectCode',
    component: 'Input',
    componentProps: {
      placeholder: '内部项目代码',
      submitOnPressEnter: true,
    },
  },
  {
    label: '',
    field: 'status',
    component: 'Select',
    componentProps: {
      placeholder: '状态',
      submitOnPressEnter: true,
      options: DRAWING_STATUS_OPTIONS,
      fieldNames: {
        label: 'fullName',
        value: 'id',
      },
    },
  },
];
