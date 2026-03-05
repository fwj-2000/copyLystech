import { useBaseStore } from '/@/store/modules/base';
import { getCheckprojectlist } from '/@/api/productionDeal/checkProjects';
const baseStore = useBaseStore();

export const formConfig = [
  {
    fieldName: 'bindType',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('CheckMaintain.BindType'),
      placeholder: '请选择绑定类型',
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
  {
    fieldName: 'checkProjectCode',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      api: getCheckprojectlist,
      placeholder: '请选择检测项目',
      resultField: 'data',
      labelField: 'name',
      valueField: 'code',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
    },
  },
  {
    fieldName: 'pickerVal',
    label: '',
    labelWidth: 70,
    component: 'RangePicker',
  },
];

export const columns = [
  { type: 'checkbox', field: 'checkbox', width: '50' },
  { title: '材料类别', field: 'typeName' },
  { title: '绑定类型', field: 'bindTypeName' },
  { title: '材料归属', field: 'materialTypeBigName' },
  { title: '材料类型', field: 'materialTypeName' },
  { title: '绑定选项', field: 'bindValue' },
  { title: '检测项目名称', field: 'checkProjectName' },
  {
    title: '检测清单名称',
    field: 'checkDetailName',
  },
  { title: '是否启用', field: 'statusName', width: 100 },
  { title: '创建人', field: 'creatorUserName', width: 200 },
  {
    title: '创建时间',
    field: 'creatorTime',
    cellRender: {
      name: 'Date',
    },
  },
  {
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: '100',
    fixed: 'right',
  },
];
