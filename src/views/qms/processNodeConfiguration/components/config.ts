import { FormSchema } from '/@/components/Form';

// 新增表单
export const addSchemas: FormSchema[] = [
  // {
  //   field: 'orgId',
  //   label: '组织ID',
  //   component: 'TreeSelect',
  //   slot: 'OrgId',
  //   rules: [{ required: true, trigger: 'change', message: '可选' }],
  // },

  {
    field: 'moduleCode',
    label: '模块编码',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    rules: [{ required: true, trigger: 'blur', message: '可选' }],
  },
  {
    field: 'code',
    label: '流程编码',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    rules: [{ required: true, trigger: 'blur', message: '可选' }],
  },
  {
    field: 'name',
    label: '流程名称',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    rules: [{ required: true, trigger: 'blur', message: '可选' }],
  },
  // {
  //   field: 'status',
  //   label: '流程状态',
  //   component: 'Select',
  //   defaultValue: 1,
  //   componentProps: {
  //     placeholder: '请选择',
  //     options: [
  //       { fullName: '启用', id: 1 },
  //       { fullName: '停用', id: 2 },
  //     ],
  //   },
  //   rules: [{ required: true, trigger: 'change', message: '可选', type: 'number' }],
  // },
  // {
  //   field: 'nodeDic',
  //   label: '节点字典',
  //   component: 'Input',
  //   componentProps: { placeholder: '请输入' },
  //   rules: [{ required: true, trigger: 'blur', message: '可选' }],
  // },
];
