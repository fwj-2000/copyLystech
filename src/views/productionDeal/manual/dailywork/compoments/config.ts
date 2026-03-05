import { muliteDeleteProcessroutebind } from '/@/api/productionDeal/processroutebind';
import { FormSchema } from '/@/components/Form';
import { useBaseStore } from '/@/store/modules/base';
import { getlistbycheckproject } from '/@/api/productionDeal/badCode';
import { reactive, toRefs } from 'vue';
import { getWorkshopList } from '/@/api/productionDeal/workshop';
import { getCheckprojectlist } from '/@/api/productionDeal/checkProjects';
import { result } from 'lodash-es';

const baseStore = useBaseStore();

const state = reactive({
  tableData: [],
  checkProjectsNameOption: [],
});
export function useFqc() {
  const FqcCheckFormSchema: any[] = [
    {
      field: 'ercode',
      label: '二维码信息:',
      component: 'Input',
      componentProps: {
        placeholder: '请选择',
      },
      slot: 'ercode',
      rules: [
        {
          required: true,
          message: '请输入',
          trigger: 'blur',
        },
      ],
      colProps: { span: 6 },
    },
    // {
    //   field: 'ercode',
    //   label: '二维码信息',
    //   component: 'Input',
    //   componentProps: {
    //     suffixIcon: 'icon-ym icon-ym-scanCode1',
    //     placeholder: '请输入或扫描标签',
    //     onkeydown: e => {
    //       workOrderNoKeydown(e);
    //     },
    //     onChange: e => {
    //       getDiecutquantityDetailFn(e);
    //     },
    //   },
    // },
    {
      field: 'classes',
      label: '班次',
      component: 'ApiSelect',
      componentProps: {
        disabled: true,
        placeholder: '自动带入',
        api: () => {
          return baseStore.getDictionaryData('ClassesName');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 6 },
    },
    {
      field: 'productionDate',
      label: '生产日期',
      component: 'DatePicker',
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      componentProps: { disabled: true, placeholder: '自动带入' },
      colProps: { span: 6 },
    },
    {
      field: 'produceWorkshopName',
      label: '生产车间',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择生产车间',
        api: getWorkshopList,
        resultField: 'data',
        labelField: 'Name',
        valueField: 'Code',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 6 },
    },
    {
      field: 'produceType',
      label: '生产类型',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择',
        api: () => {
          return baseStore.getDictionaryData('FQC.ProduceType');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 6 },
    },
    {
      field: 'customer',
      label: '客户:',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      rules: [
        {
          required: true,
          message: '请输入',
          trigger: 'blur',
        },
      ],
      colProps: { span: 6 },
    },
    {
      field: 'produceTeam',
      label: '生产组:',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      rules: [
        {
          required: true,
          message: '请输入',
          trigger: 'blur',
        },
      ],
      colProps: { span: 6 },
    },
    {
      field: 'checkProjectCode',
      label: '检验大类',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择',
        api: getCheckprojectlist,
        resultField: 'data',
        labelField: 'name',
        valueField: 'code',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        onChange: val => {
          console.log('检验大类变更');
          getTableBycheckProject(val);
        },
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 6 },
    },
    {
      field: 'checkDocumentNumber',
      label: '被检单据号:',
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: '自动带入',
      },
      rules: [
        {
          required: true,
          message: '请输入',
          trigger: 'blur',
        },
      ],
      colProps: { span: 6 },
    },
    {
      field: 'checkQuantity',
      label: '送检数量:',
      component: 'InputNumber',
      componentProps: {
        disabled: true,
        placeholder: '自动带入',
      },
      rules: [
        {
          required: true,
          message: '请输入',
          trigger: 'blur',
        },
      ],
      colProps: { span: 6 },
    },

    {
      field: 'checkProject',
      label: '检验类型',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择',
        api: () => {
          return baseStore.getDictionaryData('FQC.CheckType');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 6 },
    },
    {
      field: 'workOrderNo',
      label: '工单编号:',
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: '自动带入',
      },
      rules: [
        {
          required: true,
          message: '请输入',
          trigger: 'blur',
        },
      ],
      colProps: { span: 6 },
    },

    {
      field: 'goodQuantity',
      label: '良品数量:',
      component: 'InputNumber',
      componentProps: {
        disabled: true,
        placeholder: '自动带入',
      },
      rules: [
        {
          required: true,
          message: '请输入',
          trigger: 'blur',
        },
      ],
      colProps: { span: 6 },
    },
    {
      field: 'badQuantity',
      label: '不良品数量:',
      component: 'InputNumber',
      componentProps: {
        disabled: true,
        placeholder: '自动带入',
      },
      rules: [
        {
          required: true,
          message: '请输入',
          trigger: 'blur',
        },
      ],
      colProps: { span: 6 },
    },
    {
      field: 'aql',
      label: 'AQL',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择',
        api: () => {
          return baseStore.getDictionaryData('FQC.AQL');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 6 },
    },
    {
      field: 'process',
      label: '被检工序号:',
      component: 'Input',
      componentProps: {
        placeholder: '请选择',
      },
      rules: [
        {
          required: true,
          message: '请输入',
          trigger: 'blur',
        },
      ],
      colProps: { span: 6 },
    },
    {
      field: 'samplingQuantity',
      label: '抽样数:',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
      },
      rules: [
        {
          required: true,
          message: '请输入',
          trigger: 'blur',
        },
      ],
      colProps: { span: 6 },
    },
    {
      field: 'productCode',
      label: '产品料号:',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
      },
      rules: [
        {
          required: true,
          message: '请输入',
          trigger: 'blur',
        },
      ],
      colProps: { span: 6 },
    },
    {
      field: 'productBatchNo',
      label: '产品批次号:',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
      },
      rules: [
        {
          required: true,
          message: '请输入',
          trigger: 'blur',
        },
      ],
      colProps: { span: 6 },
    },
    {
      field: 'qaConfirm',
      label: 'QA确认',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择',
        api: () => {
          return baseStore.getDictionaryData('FQC.QAConfirm');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 6 },
    },
    {
      field: 'checkedPerson',
      label: '被检验人  ',
      component: 'CustomUserSelect',
      componentProps: {
        // placeholder: '请选择',
        // api: () => {
        //   return baseStore.getDictionaryData('FQC.checkedPerson');
        // },
        // labelField: 'fullName',
        // valueField: 'enCode',
        // filterOption: false,
        // notFoundContent: null,
        immediate: true,
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 6 },
    },
    {
      field: 'goodProductsRate',
      label: '良品率:',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
      },
      rules: [
        {
          required: true,
          message: '请输入',
          trigger: 'blur',
        },
      ],
      colProps: { span: 6 },
    },
    {
      field: 'productStatusName',
      label: '产品状态',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择',
        api: () => {
          return baseStore.getDictionaryData('FQC.ProductStatus');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 6 },
    },
    {
      field: 'checkerWorkNo',
      label: '检验人工号:',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: '请输入',
      },
      rules: [
        {
          required: true,
          message: '请输入',
          trigger: 'blur',
        },
      ],
      colProps: { span: 6 },
    },
    {
      field: 'badProductsRate',
      label: '不良品率:',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
      },
      rules: [
        {
          required: true,
          message: '请输入',
          trigger: 'blur',
        },
      ],
      colProps: { span: 6 },
    },
    {
      field: 'checkProjectsName',
      label: '检验项',
      component: 'ApiSelect',
      componentProps: {
        mode: 'multiple',
        maxTagTextLength: 14,
        maxTagPlaceholder: '....',
        maxTagCount: 3,
        placeholder: '请选择',
        api: () => {
          return baseStore.getDictionaryData('FQC.CheckProject');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      rules: [
        {
          required: true,
          message: '请选择检验项',
          trigger: 'blur',
          validator: (_rule, val) => {
            if (!val || !val.length) return Promise.reject('请选择检验项');
            return Promise.resolve();
          },
        },
      ],
      colProps: { span: 6 },
    },
    {
      field: 'handleResult',
      label: '处理结论',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择',
        api: () => {
          return baseStore.getDictionaryData('FQC.HandleResult');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 6 },
    },
    {
      field: 'remark',
      label: '备注:',
      component: 'Input',
      componentProps: {
        placeholder: '请输入内容',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        maxlength: 200,
        showCount: true,
        // rows:6
      },
      colProps: {
        span: 6,
      },
    },
  ];

  async function getTableBycheckProject(val) {
    try {
      const { data, code } = await getlistbycheckproject({ checkProjectCode: val });
      if (code === 200) {
        console.log(data);
        state.tableData = data;
        // state.checkProjectsNameOption = data;
        // FqcCheckFormSchema.forEach(r => {
        //   if (r.field == 'checkProjectsName') {
        //     console.log('1123');
        //     r.componentProps.options = data;
        //   }
        // });
        // console.log(FqcCheckFormSchema);
      }
      return val;
    } catch (error) {
      return '';
    }
  }
  return {
    FqcCheckFormSchema,
    ...toRefs(state),
  };
}
