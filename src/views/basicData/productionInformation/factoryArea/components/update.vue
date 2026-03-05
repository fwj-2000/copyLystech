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
  import { updateFactoryArea, getFactoryAreaById, getBuInfoList } from '/@/api/basicData/factoryArea';
  import { useBaseStore } from '/@/store/modules/base';
  import { useI18n } from '/@/hooks/web/useI18n';

  const baseStore = useBaseStore();
  const { t } = useI18n();

  interface State {
    dataForm: any;
  }

  const state = reactive<State>({
    dataForm: {},
  });

  const schemas: FormSchema[] = [
    {
      field: 'EnCode',
      label: '编码',
      i18nField: 'enCode',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur' /** message: '必填' */ }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'FullName',
      label: '名称',
      i18nField: 'fullName',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur' /** message: '必填' */ }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'ParentId',
      label: '父级',
      i18nField: 'parent',
      component: 'Select',
      componentProps: {
        showSearch: true,
        placeholder: '请输入',
      },
      rules: [{ required: true, trigger: 'blur' /** message: '必填' */ }],
      colProps: {
        span: 12,
      },
    },
    {
      field: 'MainProcess',
      label: '主要制程',
      i18nField: 'mainProcessTitle',
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
      i18nField: 'manager',
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
      i18nField: 'sortCode',
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
      i18nField: 'status',
      defaultValue: 1,
      componentProps: {
        placeholder: '请选择',
        options: [
          { fullName: t('dict.isBonded.1'), id: 1 },
          { fullName: t('dict.isBonded.2'), id: 2 },
        ],
      },
      colProps: {
        span: 12,
      },
      rules: [{ required: true, trigger: 'change', /** message: '必填' */ type: 'number' }],
    },
    {
      field: 'Description',
      label: '说明',
      i18nField: 'description',
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

  const getTitle = computed(() => t('common.modify'));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, validate, resetFields, updateSchema, resetSchema }] = useForm({
    labelWidth: '100%',
    layout: 'vertical',
    schemas: schemas,
    i18nConfig: {
      moduleCode: 'FactoryAreaColumn',
      transferRange: ['label', 'placeholder'],
    },
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  async function init(data) {
    state.dataForm.Id = data.id;
    resetFields();
    if (data.id) {
      changeLoading(true);
      await getFactoryAreaById(state.dataForm.Id).then(res => {
        const data = res.data;
        if (data.IsDieCutFactory) {
          resetSchema(schemas);
        } else {
          resetSchema(schemas.filter(item => item.field !== 'ParentId'));
        }
        state.dataForm = data;
        setFieldsValue({
          ...data,
          code: data.Code,
        }); //设置表单值

        changeLoading(false); //用于修改Modal的loading状态
      });
    }
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

    const buInfoData = await getBuInfoList();
    const buInfoList = buInfoData.data.map(i => {
      return {
        id: i.Id,
        fullName: i.Name,
      };
    });
    updateSchema({
      field: 'ParentId',
      componentProps: {
        options: buInfoList,
      },
    });
  }
  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      id: state.dataForm.Id,
    };
    const formMethod = updateFactoryArea;
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
