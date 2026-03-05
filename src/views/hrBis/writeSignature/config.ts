import { FormSchema } from '/@/components/Form';
import dayjs from 'dayjs';

export function getSchemas(): FormSchema[] {
  return [
    {
      field: 'name',
      label: '员工工号/姓名',
      component: 'Input',
      dynamicDisabled: true,
      componentProps: { placeholder: '请输入您的姓名' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'sex',
      label: '员工性别',
      component: 'Select',
      dynamicDisabled: true,
      componentProps: {
        placeholder: '请选择您的性别',
        options: [
          { fullName: '男', id: '1' },
          { fullName: '女', id: '2' },
          { fullName: '保密', id: '3' },
        ],
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'birthday',
      label: '出生日期',
      component: 'DatePicker',
      dynamicDisabled: true,
      componentProps: {
        placeholder: '请选择出生日期',
        // onChange: e => {
        // 	setFieldsValue({
        // 		ValidityDateEnd: dateUtil(e).endOf('month').valueOf(),
        // 	});
        // },
      },
      rules: [{ required: true, trigger: 'change', message: '必填' }],
    },
    {
      field: 'entryDay',
      label: '入职日期',
      component: 'DatePicker',
      dynamicDisabled: true,
      componentProps: {
        placeholder: '请选择入职日期',
        // onChange: e => {
        // 	setFieldsValue({
        // 		ValidityDateEnd: dateUtil(e).endOf('month').valueOf(),
        // 	});
        // },
      },
      rules: [{ required: true, trigger: 'change', message: '必填' }],
    },
    {
      field: 'department',
      label: '部门',
      component: 'Input',
      dynamicDisabled: true,
      componentProps: { placeholder: '请输入所在部门' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'natureOfWork',
      label: '工作性质',
      component: 'Input',
      dynamicDisabled: true,
      componentProps: { placeholder: '请输入工作性质' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'previousJob',
      label: '之前从事工种',
      component: 'Input',
      componentProps: { placeholder: '请输入之前从事工种' },
      rules: [{ trigger: 'blur', message: '必填' }],
    },
    {
      field: 'technicalTitleLevel',
      label: '技术职称(等级)',
      component: 'Input',
      componentProps: { placeholder: '请输入技术职称' },
      rules: [{ trigger: 'blur', message: '必填' }],
    },
    {
      field: 'checkTrainContent',
      label: '培训内容',
      component: 'DatePicker',
      slot: 'trainContent',
    },
    {
      field: 'handSignature',
      label: '签字',
      component: 'DatePicker',
      slot: 'signature',
      componentProps: {
        placeholder: '请选择入职日期',
        className: 'form-required',
        row: 3,
        // onChange: e => {
        // 	setFieldsValue({
        // 		ValidityDateEnd: dateUtil(e).endOf('month').valueOf(),
        // 	});
        // },
      },
      // rules: [{ required: true, trigger: 'change', message: '必填' }],
    },
  ];
}

export function getMentorAuditSchemas(needSecondTrain: boolean = false): FormSchema[] {
  return [
    {
      field: 'mentorName',
      label: '导师工号/姓名',
      component: 'Input',
      dynamicDisabled: true,
      componentProps: { placeholder: '请输入您的姓名' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'employeeCheckAll',
      label: '培训员工',
      component: 'DatePicker',
      slot: 'employeeCheckAll',
      componentProps: {
        placeholder: '',
        className: 'form-required',
        row: 3,
      },
    },
    {
      field: 'auditStatus',
      component: 'Radio',
      label: '审核结果',
      colProps: {
        span: 16,
      },
      componentProps: {
        options: [
          {
            fullName: '不通过',
            id: '0',
          },
          {
            fullName: '通过',
            id: '1',
          },
        ],
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'firstRoundTrain',
      label: '1轮培训',
      component: 'DatePicker',
      slot: 'firstRoundTrain',
      componentProps: {
        placeholder: '',
        className: 'form-required',
        row: 3,
      },
    },
    {
      field: 'secondRoundTrain',
      label: '2轮培训',
      component: 'DatePicker',
      slot: 'secondRoundTrain',
      ifShow: needSecondTrain,
      componentProps: {
        placeholder: '',
        className: 'form-required',
        row: 3,
      },
    },
    {
      field: 'auditOpinion',
      label: '审批意见',
      component: 'Textarea',
      componentProps: { placeholder: '请输入审批意见' },
    },
    {
      field: 'handSignature',
      label: '签字',
      component: 'DatePicker',
      slot: 'signature',
      componentProps: {
        placeholder: '请选择入职日期',
        className: 'form-required',
        row: 3,
        // onChange: e => {
        // 	setFieldsValue({
        // 		ValidityDateEnd: dateUtil(e).endOf('month').valueOf(),
        // 	});
        // },
      },
      // rules: [{ required: true, trigger: 'change', message: '必填' }],
    },
  ];
}
