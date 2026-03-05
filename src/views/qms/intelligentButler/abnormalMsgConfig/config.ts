import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { STATUS_OPTIONS } from '/@/components/CustomComponents/src/quality/Constant';
const { t } = useI18n();
import { useBaseStore } from '/@/store/modules/base';
import { getInnerPartNumber } from '/@/api/engineering/newMateria';
import { getMachineNoList } from '/@/api/basicData/processrulestemplate';
const baseStore = useBaseStore();
// 条件选项
export const CONDITIONAL_OPTIONS = [
  { id: 1, fullName: t('common.enableText') },
  { id: 0, fullName: t('common.disableText') },
];

export const schemas: FormSchema[] = [
  {
    field: 'workOrderNo',
    label: '',
    component: 'Input',
    componentProps: { placeholder: '工单号', maxlength: 50 },
  },
  {
    field: 'insidePartNumber',
    label: '',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      placeholder: '产品内部料号',
      api: getInnerPartNumber,
      showSearch: true,
      resultField: 'data',
      searchKey: 'innerMaterialNumber',
      valueField: 'InsidePartNumber',
      labelField: 'InsidePartNumber',
      alwaysLoad: true,
    },
  },
  {
    field: 'machineNo',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      api: getMachineNoList,
      placeholder: '请选择机台号',
      showSearch: true,
      apiSearch: {
        show: true,
        searchName: 'keyword',
      },
      resultField: 'data',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
      useChangeCopy: true,
      labelField: 'name',
      valueField: 'code',
      nameFormat: ['name', '(', 'code', ')'],
    },
  },
  {
    field: 'classes',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '请选择班次',
      api: () => {
        return baseStore.getDictionaryData('ClassesName');
      },
      labelField: 'fullName',
      valueField: 'enCode',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
    },
  },
];

export const columnsVxe = [
  // { type: 'expand', field: 'expand', minWidth: 40, slots: { content: 'expand_content' } },
  { field: 'checkbox', minWidth: 50, type: 'checkbox' },
  // {
  //   title: '序号',
  //   type: 'seq',
  //   minWidth: 50,
  // },
  {
    title: '名称',
    field: 'applyNo',
    minWidth: 140,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '异常类型',
    field: 'demandType',
    minWidth: 150,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
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
        notFoundContent: null,
      },
    },
  },
  {
    title: '规则描述',
    field: 'innerMaterialNumber',
    width: 180,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '状态',
    field: 'status',
    width: 100,
    cellRender: {
      name: 'Tag',
      options: STATUS_OPTIONS,
    },
    sortable: true,
  },
  {
    title: '推送方式',
    field: 'insideProjectCode',
    minWidth: 150,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '报警联系人',
    field: 'terminalCustomerProjectCode',
    minWidth: 140,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '创建人',
    field: 'currentProcessor',
    width: 160,
    sortable: true,
  },
  {
    title: '创建时间',
    field: 'currentNodeName',
    i18nField: 'CommonCol.currentNode',
    width: 160,
    sortable: true,
  },
  {
    title: '修改时间',
    field: 'nodeDetail',
    i18nField: 'CommonCol.nodeDetail',
    width: 160,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '操作',
    field: 'action',
    width: 50,
    fixed: 'right',
    slots: { default: 'action' },
  },
];

export const columns: BasicColumn[] = [
  { title: '单号', dataIndex: 'applyNo', sorter: true },
  { title: '需求类型', dataIndex: 'demandType', width: 150, sorter: true },
  {
    title: '内部项目代码',
    dataIndex: 'insideProjectCode',
    width: 110,
    sorter: true,
  },
  {
    title: '终端项目代码',
    dataIndex: 'terminalCustomerProjectCode',
    width: 110,
    sorter: true,
  },
  { title: '申请人', dataIndex: 'applyUserName', key: 'applyUserName', width: 180, sorter: true },
  { title: '申请部门', dataIndex: 'applyDeptName', key: 'applyDeptName', width: 150, sorter: true },
  {
    title: '申请时间',
    dataIndex: 'applyDate',
    key: 'applyDate',
    width: 150,
    sorter: true,
    format: 'date|YYYY/MM/DD HH:MM',
  },
  { title: '修改人', dataIndex: 'lastModifyUserName', key: 'lastModifyUserName', width: 110, sorter: true },
  {
    title: '修改时间',
    dataIndex: 'lastModifyTime',
    key: 'lastModifyTime',
    width: 50,
    sorter: true,
    format: 'date|YYYY-MM-DD HH:MM',
  },
];

export const subColumns: BasicColumn[] = [
  { title: '产品内部料号', dataIndex: 'innerMaterialNumber', width: 180 },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    format: 'tag|' + JSON.stringify(STATUS_OPTIONS),
  },
  {
    title: '当前处理人',
    dataIndex: 'currentProcessor',
    width: 160,
  },
  {
    title: '当前节点',
    dataIndex: 'currentNodeName',
    width: 160,
  },
  {
    title: '节点记录',
    dataIndex: 'nodeDetail',
    width: 160,
  },
  {
    title: '终端客户料号',
    dataIndex: 'terminalCustomerPartNumber',
    width: 120,
  },
  {
    title: '直接客户料号',
    dataIndex: 'immediateCustomerPartNumber',
    width: 120,
  },
  {
    title: '直接客户简称',
    dataIndex: 'immediateCustomerName',
    width: 150,
  },
  {
    title: '终端项目阶段',
    dataIndex: 'projectPhase',
    key: 'projectPhase',
    className: 'shadow-end',
    width: 120,
  },
  { title: '需求数量(PCS)', dataIndex: 'peakQty', key: 'peakQty', width: 150 },
  {
    title: '客户要求交期',
    dataIndex: 'customerDeliveryTime',
    key: 'customerDeliveryTime',
    width: 140,
    format: 'date|YYYY-MM-DD',
  },
  // {
  //   title: '报关',
  //   dataIndex: 'isDeclareCustoms',
  //   key: 'isDeclareCustoms',
  //   width: 110,
  //   customRender: ({ record }) => {
  //     let item = CONDITIONAL_OPTIONS.filter(o => o.id == record.isDeclareCustoms)[0];
  //     return item && item.fullName ? item.fullName : '';
  //   },
  // },
  {
    title: '工厂',
    dataIndex: 'factory',
    width: 200,
  },
  { title: '产品描述', dataIndex: 'productDesc', key: 'productDesc', width: 300 },
  { title: '备注', dataIndex: 'pmDesc', key: 'pmDesc', width: 100 },
  // { title: '脱敏图纸', dataIndex: 'desensitizedDrawingsName', key: 'desensitizedDrawingsName', width: 300 },
  // { title: 'EPM', dataIndex: 'epm', key: 'epm', width: 150 },
  // { title: 'PD', dataIndex: 'pdName', key: 'pd', width: 150 },
  // { title: 'PD Leader', dataIndex: 'pdLeaderName', key: 'pdLeaderName', width: 150 },
];

export const subColumnsVxe = [];

// 转换form表单的字段国际化
export function formatI18nForm(list) {
  return list.map(el => {
    el.label = t('dict.' + 'QuantitativeApplyColumn.' + el.field);
    return el;
  });
}
