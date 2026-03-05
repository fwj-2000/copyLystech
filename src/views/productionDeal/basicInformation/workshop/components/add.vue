<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" showOkBtn @ok="handleSubmit" width="500px">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addWorkshop, updateWorkshop, getWorkshopById } from '/@/api/productionDeal/workshop';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isEmpty } from '/@/utils/is';
  import { getFactoryList } from '/@/api/customerSerivce';

  interface State {
    dataForm: any;
  }

  const { t } = useI18n();

  const state = reactive<State>({
    dataForm: {},
  });

  const schemas: FormSchema[] = [
    {
      field: 'FactoryArea',
      label: '所属厂区',
      i18nField: 'FactoryAreaName',
      component: 'Select',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'change', message: '必填' }],
    },
    {
      field: 'Code',
      label: '车间代码',
      component: 'Input',
      componentProps: { placeholder: t('dict.CommonCol.fromSys'), disabled: true },
      // rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'Name',
      label: '车间名称',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    // {
    //   field: 'Location',
    //   label: '物理位置',
    //   component: 'Input',
    //   componentProps: { placeholder: '请输入' },
    // },
    {
      field: 'WorkCenter',
      label: '工作中心',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
    },
    // {
    //   field: 'Controller',
    //   label: '控制者',
    //   component: 'Input',
    //   componentProps: { placeholder: '请输入' },
    // },
    // {
    //   field: 'Description',
    //   label: '描述',
    //   component: 'Input',
    //   componentProps: { placeholder: '请输入' },
    // },
    {
      field: 'Status',
      label: '是否启用',
      component: 'Select',
      defaultValue: 1,
      componentProps: {
        placeholder: '请选择',
        options: [
          { fullName: t('common.enableText'), id: 1 },
          { fullName: t('common.disableText'), id: 2 },
        ],
      },
      rules: [{ required: true, trigger: 'change', message: '必填', type: 'number' }],
      i18nField: 'StatusName',
    },
    {
      field: 'Remark',
      label: '备注',
      component: 'Textarea',
      componentProps: { placeholder: '请输入' },
    },
  ];

  const getTitle = computed(() => (state.dataForm.Id ? t('common.editText') : t('common.addText')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, validate, resetFields, updateSchema }] = useForm({
    // labelWidth: 140,
    layout: 'vertical',
    schemas: schemas,
    i18nConfig: {
      moduleCode: 'WorkshopColumn',
      transferRange: ['placeholder', 'label'],
    },
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init(data) {
    updateSchema({ field: 'FactoryArea', componentProps: { disabled: false } });
    resetFields();
    state.dataForm.Id = data.id;

    getFactoryList({}).then(({ code: factoryCode, data: factoryList }) => {
      if (factoryCode === 200) {
        updateSchema({
          field: 'FactoryArea',
          componentProps: {
            options: factoryList,
            fieldNames: { value: 'Code', label: 'Name' },
          },
        });
      }
    });

    if (state.dataForm.Id) {
      updateSchema({ field: 'FactoryArea', componentProps: { disabled: true } });
      changeLoading(true);
      getWorkshopById(state.dataForm.Id).then(res => {
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

  // transformSchemas(schemas, 'WorkshopColumn', { OrgId: 'OrgName', FactoryArea: 'FactoryAreaName' });

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      id: state.dataForm.Id,
    };
    const formMethod = state.dataForm.Id ? updateWorkshop : addWorkshop;
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
