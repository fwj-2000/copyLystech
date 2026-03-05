import { useBaseStore } from '/@/store/modules/base';
import { useI18n } from '/@/hooks/web/useI18n';
// import { format } from 'path';
const { t } = useI18n();
const baseStore = useBaseStore();
const RECEIVE_STATUS_OPTIONS = [
  { id: 0, fullName: '未收货', theme: 'gray', rowKey: 'receiveStatusName' },
  { id: 1, fullName: '已收货', theme: 'green', rowKey: 'receiveStatusName' },
];
const SEND_STATUS_OPTIONS = [
  { id: 0, fullName: '未发料', theme: 'gray', rowKey: 'sendStatusName' },
  { id: 1, fullName: '已发料', theme: 'green', rowKey: 'sendStatusName' },
];
export const formConfig = [
  {
    fieldName: 'bindType',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('CheckMaintain.BindType'),
      placeholder: t('dict.CommonCol.detectionType'),
      showSearch: true,
      apiSearch: {
        show: true,
        searchName: 'labelName',
      },
      resultField: 'data',
      labelField: 'fullName',
      valueField: 'enCode',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
    },
  },
  // {
  //   field: 'checkProjectCode',
  //   label: '',
  //   component: 'Input',
  //   componentProps: {
  //     api: getCheckprojectlist,
  //     placeholder: '请选择内部料号',
  //   },
  //   colProps: { span: 4 },
  // },
  {
    fieldName: 'classes',
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
  {
    fieldName: 'pickerVal',
    label: '',
    labelWidth: 100,
    component: 'RangePicker',
  },
];

export const columns = [
  { type: 'checkbox', field: 'checkbox', width: '50' },
  { title: '检测类型', field: 'checkTypeName' },
  { title: '机台编号', field: 'machineNo' },
  // {
  //   title: '内部料号',
  //   dataIndex: 'checkDetailName',
  // },
  { title: '工单编码', field: 'workOrderNo' },
  { title: '模具编码', field: 'mouldNo' },
  { title: t('dict.CommonCol.productionConditionResults'), field: 'checkResult' },
  {
    title: '检验日期',
    field: 'checkDate',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  { title: '班次', field: 'classesName' },
  { title: '录入人', field: 'creatorUserName' },
  {
    title: '录入时间',
    field: 'creatorTime',
    cellRender: {
      name: 'Date',
    },
  },
  { title: '备注', field: 'remark' },
  {
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: '100',
    fixed: 'right',
  },
];
