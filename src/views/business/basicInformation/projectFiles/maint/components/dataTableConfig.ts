import { IS_ENABLE_LIST, FLOWSTATE_LIST } from '/@/components/CustomComponents/src/Constant';
import { getFactorysList } from '/@/api/business/quantitation';
import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
const { t } = useI18n();
const baseStore = useBaseStore();
export const formSchema = [
  {
    label: '',
    fieldName: 'applyCode',
    i18nField: 'applyCode',
    component: 'Input',
    componentProps: {
      placeholder: '项目资料单号',
    },
  },
  {
    label: '',
    fieldName: 'insidePartNumber',
    i18nField: 'insidePartNumber',
    component: 'Input',
    componentProps: {
      placeholder: '产品内部料号',
    },
  },
  {
    label: '',
    fieldName: 'factoryCode',
    i18nField: 'factory',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '工厂',
      api: getFactorysList,
      showSearch: true,
      apiSearch: {
        show: true,
        searchName: 'factoryCode',
      },
      resultField: 'data',
      labelField: 'Name',
      valueField: 'Code',
      immediate: true,
      nameFormat: ['Name', '/', 'Code'],
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
  {
    label: '',
    fieldName: 'fileType',
    i18nField: 'fileType',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '文件类型',
      filterOption: true,
      showSearch: true,
      labelField: 'fullName',
      valueField: 'enCode',
      optionFilterProp: 'label',
    },
  },
];

export const columnsVxe = [
  { field: 'checkbox', minWidth: 50, type: 'checkbox' },
  { field: 'applyCode', title: '项目资料单号', /* slots: { default: 'applyCode' }, */ minWidth: 200 },
  {
    title: '产品内部料号',
    field: 'insidePartNumber',
    minWidth: 200,
  },
  {
    title: '内部项目代码',
    field: 'insideProjectCode',
    minWidth: 200,
  },
  {
    title: '工厂',
    field: 'factory',
    minWidth: 200,
  },
  {
    title: '阶段',
    field: 'stageName',
    minWidth: 200,
  },
  {
    title: '文件类型',
    field: 'fileTypeName',
    minWidth: 200,
  },
  { field: 'files', title: '附件', slots: { default: 'files' } },
  {
    field: 'version',
    title: '版本',
    width: 120,
    formatter: ({ cellValue }) => {
      return `T${cellValue}`;
    },
  },
  {
    title: '是否启用',
    field: 'enable',
    i18nField: 'CommonCol.isEnable',
    minWidth: 150,
    cellRender: {
      name: 'Tag',
      options: IS_ENABLE_LIST,
    },
    filters: [{ data: '' }],
    filterRender: {
      name: 'VxeSelect',
      options: IS_ENABLE_LIST,
    },
  },
  { field: 'status', title: '状态', i18nField: 'CommonCol.status', cellRender: { name: 'Tag', options: FLOWSTATE_LIST } },
  { field: 'currentNodeName', title: '当前节点', i18nField: 'CommonCol.currentNodeName' },
  { field: 'handlerName', title: '当前处理人', i18nField: 'CommonCol.currentNodeUser' },
  { field: 'nodeDetail', title: '节点详情', slots: { default: 'nodeDetail' }, i18nField: 'CommonCol.nodeDetail' },
  {
    title: '上传人',
    field: 'creatorUserName',
    minWidth: 180,
  },
  {
    field: 'creatorTime',
    title: '上传时间',
    cellRender: {
      name: 'Date',
    },
  },
];
