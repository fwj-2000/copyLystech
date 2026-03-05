import { useBaseStore } from '/@/store/modules/base';
import { FLOW_STATUS, QS_STATUS } from '../components/Constant';
import { IS_YSE_LIST } from '/@/components/CustomComponents/src/Constant';
import dayjs from 'dayjs';
const baseStore = useBaseStore();
export const formSchema = [
  {
    label: '',
    fieldName: 'problemReleaseNo',
    i18nField: 'problemReleaseNo',
    component: 'Input',
    componentProps: {
      placeholder: '问题单号',
    },
  },
  {
    label: '',
    fieldName: 'stage',
    i18nField: 'stage',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '阶段',
      api: () => baseStore.getDictionaryData('projDocStage'),
      labelField: 'fullName',
      valueField: 'enCode',
      immediate: true,
      filterOption: true,
    },
  },
];

export const columnsVxe = [
  { field: 'checkbox', type: 'checkbox', minWidth: 45 },
  { title: '问题状态', field: 'problemStatus', cellRender: { name: 'Tag', options: QS_STATUS }, width: 80 },
  { title: '问题单号', field: 'problemReleaseNo', width: 100 },
  { title: '严重性', field: 'seriousness', width: 80 },
  { title: '部件', field: 'component', width: 100 },
  {
    title: '阶段',
    field: 'stage',
    width: 100,
  },
  { title: '图片', field: 'files', slots: { default: 'files' }, width: 100 },
  { title: '问题描述', field: 'problemDesc', width: 100 },
  { title: '是否ESI未实际发生问题', field: 'isEsiNotActuallyProblemName', width: 100 },
  { title: '是否ESI遗漏问题', field: 'isEsiOmissionProblemName', width: 100 },
  { title: '发生日期', field: 'occurDate', cellRender: { name: 'Date', format: 'YYYY-MM-DD' }, width: 120 },
  { title: '计划日期', field: 'planDate', cellRender: { name: 'Date', format: 'YYYY-MM-DD' }, width: 120 },
  { title: '责任人', field: 'dutyUserName', width: 100 },
  { title: '项目', field: 'projectUserName', width: 100 },
  { title: '备注', field: 'remarks', width: 100 },
  { title: '状态', field: 'handleStatus', i18nField: 'CommonCol.status', cellRender: { name: 'Tag', options: FLOW_STATUS }, width: 80 },
  { title: '当前节点', field: 'currentNodeName', i18nField: 'CommonCol.currentNodeName', width: 120 },
  { title: '当前处理人', field: 'handlerName', i18nField: 'CommonCol.currentNodeUser', width: 120 },
  { title: '节点详情', field: 'nodeDetail', slots: { default: 'nodeDetail' }, i18nField: 'CommonCol.nodeDetail', width: 100 },
];

export const columnsAdd = [
  { title: '分析结论', field: 'analysisConclusion', editRender: { name: 'Input' } },
  { title: '问题处理进展', field: 'problemHandleProgress', editRender: { name: 'Input' } },
  {
    title: '严重性',
    field: 'seriousnessName',
  },
  {
    title: '阶段',
    field: 'stageName',
    minWidth: 200,
  },
  {
    title: '部件',
    field: 'componentName',
  },
  { field: 'files', title: '图片', slots: { default: 'files' } },
  {
    title: '问题描述',
    field: 'problemDesc',
  },
  {
    title: '责任人',
    field: 'dutyUserName',
  },
  {
    title: '项目',
    field: 'projectUserName',
  },
  {
    title: '发生日期',
    field: 'occurDate',
    formatter: ({ cellValue }) => {
      return dayjs(cellValue).format('YYYY-MM-DD');
    },
    // cellRender: {
    //   name: 'DatePicker',
    //   format: 'YYYY-MM-DD',
    // },
  },
  {
    title: '计划日期',
    field: 'planDate',
    formatter: ({ cellValue }) => {
      return dayjs(cellValue).format('YYYY-MM-DD');
    },
    // cellRender: {
    //   name: 'DatePicker',
    //   format: 'YYYY-MM-DD',
    // },
  },
  {
    title: '是否ESI遗漏问题',
    field: 'isEsiOmissionProblemEnum',
    formatter: cellValue => {
      return cellValue == 1 ? IS_YSE_LIST[1].fullName : IS_YSE_LIST[0].fullName;
    },
    // cellRender: {
    //   name: 'ASelect',
    //   options: IS_YSE_LIST,
    // },
  },
  {
    title: '是否ESI未实际发生问题',
    field: 'isEsiNotActuallyProblemEnum',
    formatter: cellValue => {
      return cellValue == 1 ? IS_YSE_LIST[1].fullName : IS_YSE_LIST[0].fullName;
    },
  },
  {
    title: '备注',
    field: 'remarks',
  },
];
