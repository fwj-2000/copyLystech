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
  import { addMaterial } from '/@/api/purchase/materialBase';
  import { useBaseStore } from '/@/store/modules/base';
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
      field: 'parent',
      label: '父级',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      field: 'enCode',
      label: '编码',
      component: 'Input',
      required: true,
    },
    {
      field: 'fullName',
      label: '名称',
      component: 'Input',
      required: true,
    },
    {
      field: 'sortCode',
      label: '排序',
      defaultValue: 0,
      component: 'InputNumber',
      componentProps: { min: 0, max: 999999 },
    },
    {
      field: 'status',
      label: '是否启用',
      component: 'Select',
      defaultValue: 1,
      componentProps: {
        options: [
          { fullName: t('common.enableText'), id: 1 },
          { fullName: t('common.disableText'), id: 2 },
        ],
      },
      rules: [{ required: true, trigger: 'change', message: '必填', type: 'number' }],
    },
    {
      field: 'type',
      label: '所属类型',
      component: 'ApiSelect',
      componentProps: {
        api: async () => {
          return await baseStore.getDictionaryData('MaterialAreaTypeEnum');
        },
        apiSearch: {
          show: false,
        },
        resultField: '',
        labelField: 'fullName',
        valueField: 'enCode',
        showSearch: false,
        immediate: true,
        filterOption: false,
        notFoundContent: null,
      },
    },
    {
      field: 'middleCategoriesCode',
      label: '材料中类编码',
      component: 'Input',
    },
    {
      field: 'subclassNameEn',
      label: '材料小类英文',
      component: 'Input',
    },
    {
      field: 'subclassCode',
      label: '材料小类编码',
      component: 'Input',
    },
    {
      field: 'displayArea',
      label: '显示区域',
      component: 'Checkbox',
      componentProps: {},
      required: true,
    },
    {
      field: 'description',
      label: '说明',
      component: 'Textarea',
    },
  ];

  const getTitle = computed(() => t('common.add1Text'));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, validate, resetFields, updateSchema }] = useForm({
    labelWidth: 100,
    schemas: schemas,
    i18nConfig: {
      moduleCode: 'MateriaLibraryColumn',
    },
  });
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  function init(data) {
    console.log(data);
    resetFields();
    baseStore.getDictionaryData('DisplayAreaEnum').then(res => {
      updateSchema([
        {
          field: 'displayArea',
          defaultValue: res.map(el => el.enCode),
          componentProps: {
            options: res,
            fieldNames: { value: 'enCode' },
          },
        },
      ]);
    });
    if (data.id) {
      const value = {
        parent: data.fullName + '/' + data.enCode,
      };
      setFieldsValue(value);
      state.dataForm.parentId = data.id;
      state.dataForm.parentCategory = data.category;
      state.dataForm.parentOrganizeIdTree = data.organizeIdTree;
    } else {
      state.dataForm.parentId = '-1';
      setFieldsValue({ parent: '' });
    }
    updateSchema([
      {
        field: 'type',
        componentProps: {
          disabled: !data.id,
        },
      },
    ]);
  }
  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      displayArea: values.displayArea.join(','),
      parentId: state.dataForm.parentId,
      parentCategory: state.dataForm.parentCategory,
      parentOrganizeIdTree: state.dataForm.parentOrganizeIdTree,
    };
    const formMethod = addMaterial;
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
