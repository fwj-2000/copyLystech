import { getCheckprojectlist } from '/@/api/productionDeal/checkProjects';
import { FormSchema } from '/@/components/Form';
import { useBaseStore } from '/@/store/modules/base';
import { useI18n } from '/@/hooks/web/useI18n';
import { getProcessList } from '/@/api/basicData/process';
import { getMachineNoList } from '/@/api/basicData/processrulestemplate';
import { getMaterialList } from '/@/api/purchase/materialBase';

const { t } = useI18n();
const baseStore = useBaseStore();

export const formSchems: FormSchema[] = [
  {
    field: 'bindType',
    label: '绑定类型',
    component: 'Input',
    slot: 'bindType',
    componentProps: { placeholder: '请选择绑定类型', maxlength: 50 },
    colProps: { span: 24 },
    rules: [
      {
        required: true,
        trigger: 'blur',
        validator: (_rule, val) => {
          // if (!val) return Promise.reject('请选择绑定类型');
          if (!val) return Promise.reject(new Error('请选择绑定类型'));
          return Promise.resolve();
        },
      },
    ],
  },
  {
    field: 'typeCode',
    label: '材料类别',
    component: 'ApiSelect',
    // slot: 'materialType',
    componentProps: {
      api: () => baseStore.getDictionaryData('TestPojectType'),
      placeholder: '请选择材料类别',
      resultField: 'data',
      labelField: 'fullName',
      valueField: 'enCode',
      filterOption: false,
      notFoundContent: null,
      defaultFirstOption: true,
      // singleDefaultFirst: true,
      immediate: true,
    },
    colProps: { span: 20 },
    rules: [
      {
        required: true,
        trigger: 'blur',
        validator: (_rule, val) => {
          // if (!val) return Promise.reject('请选择材料类型');
          if (!val) return Promise.reject(new Error('请选择材料类型'));
          return Promise.resolve();
        },
      },
    ],
  },
  {
    field: 'checkProjectCode',
    label: '检测项目',
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
    colProps: { span: 10 },
    rules: [{ required: true, trigger: 'blur', message: '' }],
  },
  {
    field: 'checkDetail',
    label: '检测清单',
    component: 'ApiSelect',
    slot: 'checkDetail',
    componentProps: {
      // api: () => baseStore.getDictionaryData('TestPojectType'),
      placeholder: '请选择检测清单',
      // showSearch: true,
      // // apiSearch: {
      // //   show: true,
      // //   searchName: 'labelName',
      // // },
      // resultField: 'data',
      // labelField: 'fullName',
      // valueField: 'enCode',
      // filterOption: false,
      // notFoundContent: null,
      // immediate: true,
    },
    colProps: { span: 10 },
    rules: [
      {
        required: false,
        trigger: 'blur',
        validator: (_rule, val) => {
          // if (!val) return Promise.reject('请输入检测清单');
          if (!val) return Promise.reject(new Error('请输入检测清单'));
          return Promise.resolve();
        },
      },
    ],
  },
  {
    field: 'materialTypeBigId',
    i18nField: 'materialAreaName',
    label: '材料归属',
    component: 'ApiSelect',
    componentProps: {
      api: getMaterialList,
      apiSearch: {
        show: false,
      },
      params: {
        isSelectRoot: 'true',
        displayArea: 'MaterialWarehouse',
      },
      resultField: 'data.list',
      labelField: 'fullName',
      valueField: 'id',
      showSearch: false,
      immediate: true,
      filterOption: false,
    },
    rules: [{ required: true, trigger: 'blur', message: '' }],
    ifShow: ({ values }) => {
      return values.bindType?.includes('1');
    },
    colProps: { span: 10 },
  },
  {
    field: 'materialTypeId',
    i18nField: 'materialClassName',
    label: '材料类型',
    component: 'Select',
    componentProps: {
      fieldNames: {
        value: 'id',
        label: 'fullName',
      },
      options: [],
    },
    rules: [{ required: true, trigger: 'blur', message: '' }],
    ifShow: ({ values }) => {
      return values.bindType?.includes('1');
    },
    colProps: { span: 10 },
  },
  // {
  //   field: 'materialType',
  //   label: '材料类型',
  //   component: 'ApiSelect',
  //   componentProps: {
  //     api: () => baseStore.getDictionaryData('CheckMaintain.MaterialType'),
  //     placeholder: '请选择材料类型',
  //     resultField: 'data',
  //     labelField: 'fullName',
  //     valueField: 'enCode',
  //     filterOption: false,
  //     notFoundContent: null,
  //     immediate: true,
  //   },
  //   colProps: { span: 10 },
  //   rules: [{ required: true, trigger: 'blur', message: '' }],
  //   ifShow: ({ values }) => {
  //     return values.bindType?.includes('1');
  //   },
  // },
  {
    field: 'innerMaterialNumber',
    label: '内部物料编号',
    component: 'Input',
    componentProps: { placeholder: '请输入内部物料编号', maxlength: 50 },
    colProps: { span: 10 },
    rules: [{ required: true, trigger: 'blur', message: '' }],
    ifShow: ({ values }) => {
      return values.bindType?.includes('2');
    },
  },

  // {
  //   field: 'checkProjectCode2',
  //   label: '内部物料编号',
  //   component: 'ApiSelect',
  //   componentProps: {
  //     api: getCheckprojectlist,
  //     placeholder: '请选择检测项目',
  //     resultField: 'data',
  //     labelField: 'name',
  //     valueField: 'code',
  //     filterOption: false,
  //     notFoundContent: null,
  //     immediate: true,
  //   },
  //   colProps: { span: 10 },
  //   rules: [{ required: true, trigger: 'blur', message: '' }],
  //   ifShow: ({ values }) => {
  //     return values.bindType?.includes('2');
  //   },
  // },
  {
    field: 'checkType',
    label: '检测类型',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('CheckMaintain.CheckType'),
      placeholder: '请选择检测类型',
      resultField: 'data',
      labelField: 'fullName',
      valueField: 'enCode',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
    },
    colProps: { span: 10 },
    rules: [{ required: true, trigger: 'blur', message: '' }],
    ifShow: ({ values }) => {
      return values.bindType?.includes('3');
    },
  },
  {
    field: 'machineNo',
    label: '机台号',
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
      // nameFormat: ['name', '(', 'code', ')'],
    },
    colProps: { span: 10 },
    rules: [{ required: true, trigger: 'blur', message: '' }],
    ifShow: ({ values }) => {
      return values.bindType?.includes('4');
    },
  },
  {
    field: 'process',
    label: '工序',
    component: 'ApiSelect',
    componentProps: {
      api: getProcessList,
      placeholder: '请选择工序',
      resultField: 'data',
      labelField: 'name',
      valueField: 'id',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
    },
    colProps: { span: 10 },
    rules: [{ required: true, trigger: 'blur', message: '' }],
    ifShow: ({ values }) => {
      return values.bindType?.includes('5');
    },
  },
  {
    field: 'status',
    label: '是否启用',
    component: 'Select',
    componentProps: {
      // defaultValue: '1',
      placeholder: '请选择是否启用',
      options: [
        { fullName: '启用', id: '1' },
        { fullName: '停用', id: '2' },
      ],
    },
    colProps: { span: 10 },
    rules: [{ required: true, trigger: 'blur', message: '' }],
    // ifShow: ({ values }) => {
    //   return true;
    // },
  },
  {
    field: 'checkWay',
    label: '检测方法',
    slot: 'checkWay',
    component: 'ApiSelect',
    // componentProps: {
    //   api: () => baseStore.getDictionaryData('CheckMaintain.CheckWay'),
    //   placeholder: '请选择检测方法',
    //   showSearch: true,
    //   // apiSearch: {
    //   //   show: true,
    //   //   searchName: 'labelName',
    //   // },
    //   resultField: 'data',
    //   labelField: 'fullName',
    //   valueField: 'enCode',
    //   filterOption: false,
    //   notFoundContent: null,
    //   immediate: true,
    // },
    colProps: { span: 10 },
    rules: [{ required: true, trigger: 'blur', message: '' }],
  },
  {
    field: 'remark',
    label: '备注',
    component: 'Textarea',
    componentProps: {
      placeholder: t('common.inputText'),
      rows: 5,
      maxlength: 200,
      autoSize: { minRows: 5, maxRows: 5 },
      showCount: true,
    },
    colProps: { span: 10 },
    rules: [{ required: false, trigger: 'blur', message: '' }],
  },
];
