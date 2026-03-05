import { useBaseStore } from '/@/store/modules/base';
import { FormSchema } from '/@/components/Form';
import { IS_YSE_LIST } from '/@/components/CustomComponents/src/Constant';
const baseStore = useBaseStore();

// 审核信息
export const reviewForm = (): {
  baseColProps: any;
  labelWidth: string;
  layout: 'vertical' | 'inline' | 'horizontal' | undefined;
  schemas: FormSchema[];
} => {
  return {
    baseColProps: {
      span: 10,
    },
    labelWidth: '100%',
    layout: 'vertical',
    schemas: [
      {
        label: '问题所属领域',
        field: 'problemDomain',
        required: true,
        component: 'ApiSelect',
        componentProps: {
          api: () => baseStore.getDictionaryData('ProblemDomainTypeEnum'),
          resultField: '',
          labelField: 'fullName',
          valueField: 'enCode',
        },
        colProps: {
          span: 4,
        },
      },
      { label: '落实SOP', field: 'sop', required: true, component: 'Textarea', componentProps: { rows: 1, max: 200 } },
      { label: '落实SIP', field: 'sip', required: true, component: 'Textarea', componentProps: { rows: 1, max: 200 } },
    ],
  };
};

// 处理信息
export const handleForm = (): {
  baseColProps: any;
  labelWidth: string;
  layout: 'vertical' | 'inline' | 'horizontal' | undefined;
  schemas: FormSchema[];
} => {
  return {
    baseColProps: {
      span: 12,
    },
    labelWidth: '100%',
    layout: 'vertical',
    schemas: [
      { label: '分析结论', field: 'analysisConclusion', required: true, component: 'Textarea', componentProps: { rows: 1, max: 200 } },
      { label: '问题处理进展', field: 'problemHandleProgress', required: true, component: 'Textarea', componentProps: { rows: 1, max: 200 } },
    ],
  };
};

// 问题信息
export const qsInfoForm = (): {
  baseColProps: any;
  labelWidth: string;
  layout: 'vertical' | 'inline' | 'horizontal' | undefined;
  schemas: FormSchema[];
} => {
  return {
    layout: 'vertical',
    labelWidth: '100%',
    baseColProps: {
      span: 4,
    },
    schemas: [
      { label: '问题状态', field: 'problemStatus', component: 'Input' },
      { label: '严重性', field: 'seriousnessName', component: 'Input' },
      { label: '阶段', field: 'stageName', component: 'Input' },
      { label: '部件', field: 'componentName', component: 'Input' },
      { label: '发生日期', field: 'occurDate', component: 'DatePicker' },
      { label: '计划日期', field: 'planDate', component: 'DatePicker' },
      { label: '是否ESI未实际发生问题', field: 'isEsiNotActuallyProblemEnum', component: 'Select', componentProps: { options: IS_YSE_LIST } },
      {
        label: '是否ESI遗漏问题',
        field: 'isEsiOmissionProblemEnum',
        component: 'Select',
        componentProps: {
          options: IS_YSE_LIST,
        },
      },
      { label: '责任人', field: 'dutyUserName', component: 'Input' },
      { label: '项目', field: 'projectUserName', component: 'Input' },
      { label: '创建人', field: 'creatorUserName', component: 'Input' },
      { label: '创建时间', field: 'creatorTime', component: 'DatePicker', componentProps: { valueFormat: 'YYYY-MM-DD' } },
      { label: '问题描述', field: 'problemDesc', component: 'Textarea', componentProps: { type: 'textarea', rows: 2, autoSize: true }, colProps: { span: 12 } },
      { label: '备注', field: 'remarks', component: 'Textarea', componentProps: { type: 'textarea', rows: 2, autoSize: true }, colProps: { span: 12 } },
    ],
  };
};
