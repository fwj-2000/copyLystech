import { getFactoryList } from '/@/api/basicData/factory';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export const searchFormSchema = [
  {
    fieldName: 'factory',
    i18nField: 'factoryAreaName',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      placeholder: t('CommonCol.pleaseSelectFactory'),
      api: getFactoryList,
      labelField: 'Name',
      valueField: 'Code',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
      showSearch: true,
      useChangeCopy: true,
      resultField: 'data',
    },
    colProps: { span: 4 },
  },
  {
    fieldName: 'innerMaterialNumber',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      placeholder: '请输入物料编号',
    },
    colProps: { span: 4 },
  },
];

export const commonColumns = [
  { title: 'PM', dataIndex: 'pmName' },
  { title: 'PMC', dataIndex: 'pmcName' },
  { title: '大项目', dataIndex: 'maxItem' },
  { title: '小项目', dataIndex: 'minItem' },
  { title: 'A/PN', dataIndex: 'apn' },
  { title: '片/卷', dataIndex: 'type' },
  { title: 'LS PN', dataIndex: 'innerMaterialNumber' },
  { title: '是否参与运算', dataIndex: 'isOperationStr' },
  { title: '创建人', dataIndex: 'creatorUserName' },
  { title: '创建时间', dataIndex: 'CreatorTime', align: 'center', format: 'date|YYYY/MM/DD' },
  { title: '修改人', dataIndex: 'lastModifyUserName' },
  {
    title: '修改时间',
    dataIndex: 'LastModifyTime',
    align: 'center',
    format: 'date|YYYY/MM/DD',
  },
];

export const columns = [{ title: '工厂', dataIndex: 'factoryAreaName', width: 100 }, ...commonColumns];

export const importColumns = [
  { title: 'excel行号', dataIndex: 'number', width: 120, key: 'number', sorter: true, i18nField: 'CommonCol.excelLineNumber' },
  { title: '工厂', dataIndex: 'factory', width: 100 },
  ...commonColumns,
];

export const column = [
  {
    type: 'checkbox',
    field: 'checkbox',
    width: 50,
    align: 'center',
  },
  {
    type: 'seq',
    field: '序号',
    width: 50,
    align: 'center',
  },
  {
    title: '工厂',
    field: 'factoryAreaName',
    width: 160,
  },
  {
    title: 'PM',
    field: 'pmName',
    width: 160,
  },
  {
    title: 'PMC',
    field: 'pmcName',
    width: 160,
  },
  {
    title: '大项目',
    field: 'maxItem',
    width: 160,
  },
  {
    title: '小项目',
    field: 'minItem',
    width: 160,
  },
  {
    title: 'A/PN',
    field: 'apn',
    width: 160,
  },
  {
    title: '片/卷',
    field: 'type',
    width: 160,
  },
  {
    title: 'LS PN',
    field: 'innerMaterialNumber',
    width: 160,
  },
  {
    title: '是否参与运算',
    field: 'isOperationStr',
    width: 160,
  },
  {
    title: '创建人',
    field: 'creatorUserName',
    width: 160,
  },
  {
    title: '创建时间',
    field: 'CreatorTime',
    width: 160,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '修改人',
    field: 'lastModifyUserName',
    width: 160,
  },
  {
    title: '修改时间',
    field: 'LastModifyTime',
    width: 160,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: t('common.action'),
    width: '60',
    field: 'action',
    fixed: 'right',
    slots: {
      default: 'action',
    },
  },
];

export const importColumn = [
  {
    title: 'excel行号',
    field: 'number',
    width: 120,
    key: 'number',
    sorter: true,
    i18nField: 'CommonCol.excelLineNumber',
  },
  {
    title: '工厂',
    field: 'factory',
    width: 160,
  },
  {
    title: 'PM',
    field: 'pmName',
    width: 160,
  },
  {
    title: 'PMC',
    field: 'pmcName',
    width: 160,
  },
  {
    title: '大项目',
    field: 'maxItem',
    width: 160,
  },
  {
    title: '小项目',
    field: 'minItem',
    width: 160,
  },
  {
    title: 'A/PN',
    field: 'apn',
    width: 160,
  },
  {
    title: '片/卷',
    field: 'type',
    width: 160,
  },
  {
    title: 'LS PN',
    field: 'innerMaterialNumber',
    width: 160,
  },
  {
    title: '是否参与运算',
    field: 'isOperationStr',
    width: 160,
  },
  {
    title: '创建人',
    field: 'creatorUserName',
    width: 160,
  },
  {
    title: '创建时间',
    field: 'CreatorTime',
    width: 160,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '修改人',
    field: 'lastModifyUserName',
    width: 160,
  },
  {
    title: '修改时间',
    field: 'LastModifyTime',
    width: 160,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: t('common.action'),
    width: '60',
    field: 'action',
    fixed: 'right',
    slots: {
      default: 'action',
    },
  },
];
