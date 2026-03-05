<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" showOkBtn @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addClasses, updateClasses, getClassesById } from '/@/api/productionDeal/classes';
  import { isEmpty } from '/@/utils/is';
  import { useI18n } from '/@/hooks/web/useI18n';

  interface State {
    dataForm: any;
    StartTime: string;
    EndTime: string;
  }

  const state = reactive<State>({
    dataForm: {},
    StartTime: '',
    EndTime: '',
  });

  const { t } = useI18n();

  const schemas: FormSchema[] = [
    {
      field: 'Code',
      label: '班次编码',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'Name',
      label: '班次名称',
      component: 'Select',
      componentProps: {
        showSearch: true,
        placeholder: '请选择',
      },
      rules: [{ required: true, trigger: 'change', message: '必填' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'OnWorkTimeOne',
      label: '上班时间1',
      component: 'TimePicker',
      componentProps: { placeholder: '请选择', format: 'HH:mm' },
      required: true,
      colProps: {
        span: 12,
      },
    },
    {
      field: 'OffWorkTimeOne',
      label: '下班时间1',
      component: 'TimePicker',
      componentProps: { placeholder: '请选择', format: 'HH:mm' },
      required: true,
      colProps: {
        span: 12,
      },
    },
    {
      field: 'OnWorkTimeTwo',
      label: '上班时间2',
      component: 'TimePicker',
      componentProps: { placeholder: '请选择', format: 'HH:mm' },
      required: true,
      colProps: {
        span: 12,
      },
    },
    {
      field: 'OffWorkTimeTwo',
      label: '下班时间2',
      component: 'TimePicker',
      componentProps: { placeholder: '请选择', format: 'HH:mm' },
      required: true,
      colProps: {
        span: 12,
      },
    },
    {
      field: 'OverTimeOnWorkTime',
      label: '加班上班时间',
      labelWidth: '120',
      component: 'TimePicker',
      componentProps: { placeholder: '请选择', format: 'HH:mm' },
      required: true,
      colProps: {
        span: 12,
      },
    },
    {
      field: 'OverTimeOffWorkTime',
      label: '加班下班时间',
      labelWidth: '120',
      component: 'TimePicker',
      componentProps: { placeholder: '请选择', format: 'HH:mm' },
      required: true,
      colProps: {
        span: 12,
      },
    },
    {
      field: 'ClassesTimeSlots',
      label: '班次时间段',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择',
        format: 'HH:mm',
      },
      rules: [{ required: true, trigger: 'change', message: '必填' }],
      component: 'TimeRange',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'Status',
      label: '是否启用',
      component: 'Select',
      defaultValue: 1,
      componentProps: {
        placeholder: '请选择',
        options: [
          { fullName: t('common.valid'), id: 1 },
          { fullName: t('common.invalid'), id: 2 },
        ],
      },
      rules: [{ required: true, trigger: 'change', message: '必填', type: 'number' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'Remark',
      label: '备注',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      colProps: {
        span: 12,
      },
    },
  ];

  const getTitle = computed(() => (state.dataForm.Id ? t('common.editText') : t('common.addText')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, validate, resetFields, updateSchema }] = useForm({
    labelWidth: 120,
    schemas: schemas,
    layout: 'vertical',
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init(data) {
    resetFields();
    state.dataForm.Id = data.id;

    if (data.typeOption)
      updateSchema([
        {
          field: 'Name',
          componentProps: {
            options: data.typeOption,
            fieldNames: { value: 'enCode' },
          },
        },
      ]);

    if (state.dataForm.Id) {
      changeLoading(true);
      getClassesById(state.dataForm.Id).then(res => {
        const data = res.data;
        state.dataForm = data;
        setFieldsValue(data); //设置表单值
        changeLoading(false); //用于修改Modal的loading状态
      });
    }
  }

  function transformSchemas(cols: FormSchema[], businessCode: string, reWrite: object) {
    cols.forEach(col => {
      // 翻译label
      let key = `dict.${businessCode}.${reWrite[col.field] ? reWrite[col.field] : col.field}`;
      let tranTitle = t(key);
      col.label = isEmpty(tranTitle) ? col.label : tranTitle;
      // 翻译componentProps
      if (col.componentProps) {
        if (col.componentProps.disabled) {
          col.componentProps.placeholder = t('common.nonEditable');
          return;
        }
        let key = `common.${['TreeSelect', 'Select'].includes(col.component) ? t('selectPlaceholder') : t('inputPlaceholder')}`;
        let tranPlaceholder = t(key);
        col.componentProps.placeholder = isEmpty(tranPlaceholder) ? col.componentProps.placeholder : tranPlaceholder;
      }
      // 翻译rules
      if (col.rules) {
        col.rules.forEach(rule => {
          //必填
          if (rule.required) {
            let key = `common.required`;
            let tranRule = t(key);
            rule.message = isEmpty(tranRule) ? rule.message : tranRule;
          }
        });
      }
    });
  }

  transformSchemas(schemas, 'ClassesColumn', { OrgId: 'OrgName' });

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      id: state.dataForm.Id,
    };
    const formMethod = state.dataForm.Id ? updateClasses : addClasses;
    formMethod(query)
      .then(res => {
        createMessage.success(res.msg);
        changeOkLoading(false); //用于修改确认按钮的loading状态
        closeModal(); //关闭弹窗
        emit('reload');
      })
      .catch(() => {
        changeOkLoading(false);
      });
  }
</script>
