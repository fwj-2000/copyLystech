<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" :draggable="true" showOkBtn @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addFactoryArea } from '/@/api/basicData/factoryArea';
  import { useBaseStore } from '/@/store/modules/base';
  import { isEmpty } from '/@/utils/is';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  const baseStore = useBaseStore();

  interface State {
    dataForm: any;
  }

  const state = reactive<State>({
    dataForm: {
      parentId: '',
      parentCategory: '',
      parentOrganizeIdTree: '',
    },
  });

  const schemas: FormSchema[] = [
    {
      field: 'Parent',
      label: '父级',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'EnCode',
      label: '编码',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'FullName',
      label: '名称',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'MainProcess',
      label: '主要制程',
      component: 'Select',
      componentProps: {
        showSearch: true,
        placeholder: '请输入',
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'ManagerId',
      label: '责任人',
      component: 'UserSelect',
      componentProps: {
        multiple: false,
        fieldNames: { value: 'fullname' },
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'SortCode',
      label: '排序',
      defaultValue: 0,
      component: 'InputNumber',
      componentProps: { min: 0, max: 999999 },
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
      field: 'description',
      label: '说明',
      component: 'Textarea',
      componentProps: { placeholder: '请输入' },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'code',
      label: '3.8工厂编码',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      colProps: {
        span: 12,
      },
    },
  ];

  const getTitle = computed(() => t('common.addText'));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, validate, resetFields, updateSchema }] = useForm({
    labelWidth: 100,
    schemas: schemas,
    layout: 'vertical',
  });
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  function init(data) {
    resetFields();

    baseStore.getDictionaryData('MainProcess').then(res => {
      let result = res as any[];
      for (let i = 0; i < result.length; i++) {
        result[i].enCode = Number(result[i].enCode);
      }
      updateSchema([
        {
          field: 'MainProcess',
          componentProps: {
            options: res,
            fieldNames: { value: 'enCode' },
          },
        },
      ]);
    });

    const value = {
      Parent: data.fullName + '/' + data.enCode,
    };
    setFieldsValue(value);
    state.dataForm.parentId = data.id;
    state.dataForm.parentCategory = data.category;
    state.dataForm.parentOrganizeIdTree = data.organizeIdTree;
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

  transformSchemas(schemas, 'FactoryAreaColumn', { OrgId: 'OrgName' });

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      parentId: state.dataForm.parentId,
      parentCategory: state.dataForm.parentCategory,
      parentOrganizeIdTree: state.dataForm.parentOrganizeIdTree,
    };
    const formMethod = addFactoryArea;
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
