import { BasicColumn, FormSchema } from '/@/components/Table';
import { useBaseStore } from '/@/store/modules/base';
import { getFactoryList } from '/@/api/basicData/factory';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
const baseStore = useBaseStore();

export const STATUS_OPTIONS = {
  0: { fullName: '/', theme: 'gray', rowKey: 'status' },
  1: { fullName: t('dict.Flow.BillStatus.1'), theme: 'gray', rowKey: 'status' },
  2: { fullName: t('dict.Flow.NodeStatus.2'), theme: 'blue', rowKey: 'status' },
  3: { fullName: t('dict.Flow.BillStatus.3'), theme: 'green', rowKey: 'status' },
  4: { fullName: t('dict.Flow.NodeAction.2'), theme: 'yellow', rowKey: 'status' },
  5: { fullName: t('dict.Flow.BillStatus.5'), theme: 'yellow', rowKey: 'status' },
  6: { fullName: t('dict.Flow.NodeAction.7'), theme: 'red', rowKey: 'status' },
};

export const DOCTYPE_OPTIONS = [
  { id: 1, fullName: '工程图纸' },
  { id: 2, fullName: '模切SOP' },
  { id: 3, fullName: '手工SOP' },
  { id: 4, fullName: '包装POP' },
];
export const SEARCH_FORM_SCHEMA: FormSchema[] = [
  {
    field: 'insidePartNumber',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      placeholder: '产品内部料号',
    },
    colProps: { span: 6 },
  },
  {
    field: 'insidePartNumberOld',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      placeholder: '旧版成品编码',
    },
    colProps: { span: 6 },
  },
  {
    field: 'status',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '状态',
      submitOnPressEnter: true,
      api: () => baseStore.getDictionaryData('Flow.BillStatus'),
      labelField: 'fullName',
      valueField: 'enCode',
    },
    colProps: { span: 6 },
  },
  {
    field: 'doctype',
    label: '',
    i18nField: 'docType',
    component: 'Select',
    componentProps: {
      placeholder: '资料类型',
      options: DOCTYPE_OPTIONS,
    },
    colProps: { span: 6 },
  },
  {
    field: 'factory',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      api: getFactoryList,
      placeholder: '工厂',
      resultField: 'data',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
      labelField: 'Name',
      valueField: 'Code',
    },
    colProps: { span: 6 },
  },
  {
    field: 'immediateCustomerPartNumber',
    label: '',
    component: 'Input',
    componentProps: { placeholder: '请输入直接客户料号' },
    colProps: { span: 6 },
  },
  {
    field: 'terminalCustomerPartNumber',
    label: '',
    component: 'Input',
    componentProps: { placeholder: '终端客户料号' },
    colProps: { span: 6 },
  },
  {
    field: 'pdName',
    label: '',
    component: 'Input',
    labelWidth: 100,
    componentProps: { placeholder: 'PD', maxlength: 50 },
    colProps: { span: 6 },
  },
  // {
  //   field: 'handlerName',
  //   label: '',
  //   component: 'Input',
  //   labelWidth: 100,
  //   componentProps: { placeholder: '当前处理人', maxlength: 50 },
  //   colProps: { span: 3 },
  // },
];
export const COLUMNS: BasicColumn[] = [
  { title: '产品内部料号', dataIndex: 'insidePartNumber', width: 240 },
  { title: '旧版成品编码', dataIndex: 'insidePartNumberOld', width: 240 },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '版本', dataIndex: 'version', width: 100 },
  { title: '资料类型', dataIndex: 'docType', width: 120 },
  { title: '资料名称', dataIndex: 'fileName', width: 360 },
  { title: '直接客户料号', dataIndex: 'immediateCustomerPartNumber' },
  { title: '终端客户料号', dataIndex: 'terminalCustomerPartNumber' },
  { title: '产品描述', dataIndex: 'productDesc' },
  { title: '工厂', dataIndex: 'factory' },
  { title: 'PD', dataIndex: 'creatorUserName', width: 220 },
  { title: '上传时间', dataIndex: 'applyDate', format: 'date|YYYY-MM-DD' },
  { title: '当前处理人', dataIndex: 'handlerName', width: 220 },
  { title: '当前节点', dataIndex: 'currentNodeName' },
  { title: '节点记录', dataIndex: 'record' },
];

export const UPLOAD_POP_COLUMNS: BasicColumn[] = [
  { title: t('dict.PCCColumn.status'), dataIndex: 'result' },
  { title: t('dict.PCCColumn.engineeringData'), dataIndex: 'fileName', width: 360 },
  { title: t('dict.MaterialDevelopMaterialConfirmColumn.insidePartNumber'), dataIndex: 'insidePartNumber', width: 260 },
  { title: t('dict.PCCColumn.docType'), dataIndex: 'docType' },
  { title: t('dict.PCCColumn.factoryName'), dataIndex: 'FactoryCode' }, // 工厂
  {
    title: t('dict.IdgeneratorRuleColumn.Version'),
    dataIndex: 'version',
  },
];
