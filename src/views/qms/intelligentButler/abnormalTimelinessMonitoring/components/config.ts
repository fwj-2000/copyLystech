import { useBaseStore } from '/@/store/modules/base';
import { useLocalStorage } from '@vueuse/core';
import { getMachinelCodeList, ListByUserfactory } from '/@/api/qms/iqc/abnormalTimelinessMonitoring';
import { getShiftType } from '/@/utils/time';
import { useI18n } from '/@/hooks/web/useI18n';
import dayjs from 'dayjs';
const { t } = useI18n();

const { value: storeData } = useLocalStorage('qms-intelligentButler-abnormalTimelinessMonitoring', { machineNo: '' });

const baseStore = useBaseStore();

export const ASTATUS_AbnormalTimelinessMonitoring = [
  { id: 1, fullName: t('dict.ExceptionStatus.1'), theme: 'gray', rowKey: 'StatusDesc' },
  { id: 2, fullName: t('dict.ExceptionStatus.2'), theme: 'gray', rowKey: 'StatusDesc' },
  { id: 3, fullName: t('dict.ExceptionStatus.3'), theme: 'blue', rowKey: 'StatusDesc' },
  { id: 4, fullName: t('dict.ExceptionStatus.4'), theme: 'purple', rowKey: 'StatusDesc' },
  { id: 5, fullName: t('dict.ExceptionStatus.5'), theme: 'green', rowKey: 'StatusDesc' },
  { id: 6, fullName: t('dict.ExceptionStatus.6'), theme: 'green', rowKey: 'StatusDesc' },
];

export const searchFormSchema = [
  {
    fieldName: 'factoryArea',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      api: ListByUserfactory,
      placeholder: '所属厂区',
      showSearch: true,
      resultField: 'data',
      filterOption: (inputValue, path) => {
        return [path].some(option => option.label.includes(inputValue));
      },
      notFoundContent: null,
      immediate: true,
      labelField: 'Name',
      valueField: 'Code',
    },
    colProps: { span: 5 },
  },
  {
    fieldName: 'innerMaterialNumber',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '请输入内部料号',
      allowClear: true,
    },
    colProps: { span: 5 },
  },
  {
    fieldName: 'workOrderNo',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '请输入工单号',
      allowClear: true,
    },
    colProps: { span: 4 },
  },
  {
    fieldName: 'machineNo',
    label: '',
    component: 'ApiSelect',
    defaultValue: storeData.machineNo,
    componentProps: {
      api: getMachinelCodeList,
      showSearch: true,
      apiSearch: {
        show: true,
        searchName: 'machineNo',
      },
      resultField: 'data',
      labelField: 'machineNo',
      valueField: 'machineNo',
      filterOption: false,
      notFoundContent: null,
      // defaultFirstOption: true,
      immediate: true,
      placeholder: t('dict.SelectMachine'),
      onChange: e => {
        const { value } = useLocalStorage('qms-intelligentButler-abnormalTimelinessMonitoring', { machineNo: e });
        value.machineNo = e;
      },
    },
  },
  {
    fieldName: 'classes',
    label: '',
    component: 'Select',
    colProps: { span: 4 },
    defaultValue: getShiftType(),
    componentProps: {
      placeholder: '班别',
      options: [
        { label: t('common.dayShift'), value: '1' },
        { label: t('common.nightShift'), value: '2' },
      ],
    },
  },
];

export const columns = [
  { field: 'checkbox', width: 50, type: 'checkbox' },
  { title: '异常单据号', field: 'orderNo' },
  { title: '工单号', field: 'workOrderNo' },
  { title: '内部料号', field: 'innerMaterialNumber' },
  {
    title: '状态',
    field: 'status',
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      props: {
        api: () => baseStore.getDictionaryData('ExceptionStatus'),
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
    cellRender: {
      name: 'Tag',
      options: ASTATUS_AbnormalTimelinessMonitoring,
    },
  },
  { title: '异常类型', field: 'exceptionTypeName' },
  { title: '异常描述', field: 'problemDescription' },
  {
    title: '生产日期',
    field: 'fBizDate',
    formatter: ({ cellValue }) => {
      return cellValue ? dayjs(cellValue).format('YYYY-MM-DD') : '';
    },
  },
  { title: '厂区物理位置', field: 'factoryAddress' },
  { title: '班别', field: 'classesDes' },
  { title: '机台号', field: 'machineNo' },
  { title: '当前处理人', field: 'currentName' },
  {
    title: '节点记录',
    field: 'record',
    slots: { default: 'record' },
    width: 100,
    i18nField: 'CommonCol.nodeRecord',
  },
  {
    title: '上传时间',
    field: 'createTime',
    formatter: ({ cellValue }) => {
      return cellValue ? dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : '';
    },
  },
  {
    title: '上报时间',
    field: 'reportTime',
    formatter: ({ cellValue }) => {
      return cellValue ? dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : '';
    },
    i18nField: 'CommonCol.reportTime',
  },
  {
    title: '上报人',
    field: 'createUserName',
    i18nField: 'CommonCol.reportPerson',
  },
  {
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: 100,
    fixed: 'right',
  },
];

export const abnormalForm = [
  {
    field: 'exceptionType',
    label: '异常类型',
    required: true,
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('ExceptionType'),
      labelField: 'fullName',
      valueField: 'enCode',
      showSearch: true,
      filterOption: false,
    },
    colProps: { span: 6 },
    i18nField: 'exceptionTypeName',
  },
  {
    field: 'problemDescription',
    label: '问题描述',
    component: 'Input',
    componentProps: {
      placeholder: '请输入异常描述',
      //i18nField: 'CommonCol.fromSys',
    },
    rules: [{ required: true, message: '', trigger: 'blur' }],
    colProps: { span: 6 },
  },
  // {
  //   label: '责任单位',
  //   field: 'businessUnit',
  //   component: 'ApiSelect',
  //   componentProps: {
  //     api: getbusinessunit,
  //     resultField: 'data',
  //     labelField: 'fullName',
  //     valueField: 'fullName',
  //     showSearch: true,
  //     apiSearch: {
  //       show: true,
  //       searchName: 'value',
  //     },
  //     memoInputVal: true,
  //     memoInputVagueVal: true,
  //     immediate: true,
  //   },
  //   rules: [{ required: true, trigger: 'blur', message: '必选' }],
  //   colProps: { span: 6 },
  // },
  {
    field: 'introducerUserId',
    label: '异常处理人',
    component: 'CustomUserSelect',
    componentProps: {
      // multiple: true,
      // disabled: true,
    },
    i18nField: 'CommonCol.exceptionHandler',
    rules: [{ required: true, message: '', trigger: 'change' }],
    colProps: {
      span: 6,
    },
  },
  // {
  //   field: 'abnormalRemark',
  //   label: '问题备注',
  //   labelWidth: 200,
  //   component: 'Input',
  //   componentProps: {
  //     placeholder: '请输入问题备注',
  //     //i18nField: 'CommonCol.fromSys',
  //   },
  //   colProps: { span: 6 },
  // },
];

export const processResultSchema = [
  {
    field: 'causeAnalysis',
    label: '原因分析',
    component: 'Input',
    componentProps: {},
    colProps: {
      span: 6,
    },
    required: true,
  },
  {
    field: 'treatmentScheme',
    label: '处理方案',
    component: 'Input',
    componentProps: {},
    colProps: {
      span: 6,
    },
    required: true,
  },
  // {
  //   field: 'isSolve',
  //   label: '是否已解决',
  //   component: 'Select',
  //   defaultValue: 1,
  //   componentProps: {
  //     placeholder: '请选择',
  //     options: [
  //       { fullName: '是', id: 1 },
  //       { fullName: '否', id: 2 },
  //     ],
  //   },
  //   colProps: {
  //     span: 6,
  //   },
  //   required: true,
  // },
  {
    field: 'processingCompletelRemark',
    label: '备注',
    component: 'Input',
    componentProps: {
      placeholder: '备注',
    },
    colProps: { span: 6 },
  },
];

export const processResultColumn = [
  { title: '原因分析', field: 'causeAnalysis' },
  { title: '处理方案', field: 'treatmentScheme' },
  { title: '是否解决', field: 'isSolveDes' },
  { title: '备注', field: 'processingCompletelRemark' },
  {
    title: '处理人',
    field: 'createUserName',
  },
  {
    title: '处理时间',
    field: 'createTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
];
