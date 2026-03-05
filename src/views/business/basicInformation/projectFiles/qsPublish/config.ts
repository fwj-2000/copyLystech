import { IS_YSE_LIST } from '/@/components/CustomComponents/src/Constant';
import { useBaseStore } from '/@/store/modules/base';
import { FLOW_STATUS, QS_STATUS } from '../components/Constant';
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
  { field: 'checkbox', type: 'checkbox', width: 45 },
  { title: '问题状态', field: 'problemStatus', cellRender: { name: 'Tag', options: QS_STATUS }, width: 100 },
  { title: '问题单号', field: 'problemReleaseNo', slots: { default: 'applyCode' }, width: 100 },
  { title: '严重性', field: 'seriousness', width: 60 },
  // { title: '分析结论', field: 'analysisConclusion' },
  { title: '部件', field: 'component', width: 100 },
  { title: '阶段', field: 'stage', width: 100 },
  { title: '图片', field: 'files', slots: { default: 'files' }, width: 100 },
  { title: '问题描述', field: 'problemDesc', width: 100 },
  { title: '是否ESI未实际发生问题', field: 'isEsiNotActuallyProblemName', width: 80 },
  { title: '是否ESI遗漏问题', field: 'isEsiOmissionProblemName', width: 80 },
  { title: '发生日期', field: 'occurDate', cellRender: { name: 'Date', format: 'YYYY-MM-DD' }, width: 100 },
  { title: '计划日期', field: 'planDate', cellRender: { name: 'Date', format: 'YYYY-MM-DD' }, width: 100 },
  { title: '责任人', field: 'dutyUserName', width: 100 },
  { title: '项目', field: 'projectUserName', width: 100 },
  { title: '备注', field: 'remarks', width: 100 },
  { title: '状态', field: 'status', cellRender: { name: 'Tag', options: FLOW_STATUS }, width: 80 },
  { title: '当前节点', field: 'currentNodeName', i18nField: 'CommonCol.currentNodeName', width: 120 },
  { title: '当前处理人', field: 'handlerName', i18nField: 'CommonCol.currentNodeUser', width: 120 },
  { title: '节点详情', field: 'nodeDetail', slots: { default: 'nodeDetail' }, i18nField: 'CommonCol.nodeDetail', width: 100 },
];

export const columnsAdd = [
  {
    title: '严重性',
    field: 'seriousness',
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      props: {
        placeholder: '严重性',
        api: () => baseStore.getDictionaryData('SeriousnessTypeEnum'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        filterOption: true,
      },
    },
    width: 150,
  },
  {
    title: '阶段',
    field: 'stage',
    width: 200,
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      props: {
        placeholder: '阶段',
        api: () => baseStore.getDictionaryData('projDocStage'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        filterOption: true,
      },
    },
  },
  {
    title: '部件',
    field: 'component',
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      props: {
        placeholder: '部件',
        api: () => baseStore.getDictionaryData('ComponentTypeEnum'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        filterOption: true,
      },
    },
    width: 150,
  },
  { field: 'files', title: '图片', slots: { default: 'files' }, width: 100 },
  {
    title: '问题描述',
    field: 'problemDesc',
    editRender: {
      name: 'Input',
      props: {
        type: 'textarea',
        rows: 2,
      },
    },
    width: 200,
  },
  {
    title: '责任人',
    field: 'dutyUserId',
    editRender: {
      name: 'CustomUserSelect',
    },
    width: 150,
  },
  {
    title: '项目',
    field: 'projectUserId',
    editRender: {
      name: 'CustomUserSelect',
    },
    width: 150,
  },
  {
    title: '发生日期',
    field: 'occurDate',
    editRender: {
      name: 'DatePicker',
      props: {
        valueFormat: 'YYYY-MM-DD',
      },
    },
    width: 120,
  },
  {
    title: '计划日期',
    field: 'planDate',
    editRender: {
      name: 'DatePicker',
      props: {
        valueFormat: 'YYYY-MM-DD',
      },
    },
    width: 120,
  },
  {
    title: '是否ESI遗漏问题',
    field: 'isEsiOmissionProblem',
    editRender: {
      name: 'ASelect',
      props: {
        options: IS_YSE_LIST,
      },
    },
    width: 150,
  },
  {
    title: '是否ESI未实际发生问题',
    field: 'isEsiNotActuallyProblem',
    editRender: {
      name: 'ASelect',
      props: {
        options: IS_YSE_LIST,
      },
    },
    width: 150,
  },
  {
    title: '备注',
    field: 'remarks',
    editRender: {
      name: 'Input',
    },
    width: 200,
  },
  {
    title: '操作',
    field: 'action',
    fixed: 'right',
    width: 120,
    slots: { default: 'action' },
  },
];
