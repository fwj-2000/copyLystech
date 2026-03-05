<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" showOkBtn @ok="handleSubmit" :okText="getOkTest" destroyOnClose>
    <BasicForm @register="registerForm">
      <template #OrgId>
        <lydcOrganizeCascader v-model:value="organizeIdTree" :showSearch="true" @change="onOrganizeChange" />
      </template>
    </BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, onMounted, reactive, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addProcessRoute, updateProcessRoute, ListByUserfactory } from '/@/api/productionPlan/processRoute';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useOrganizeStore } from '/@/store/modules/organize';
  import { LydcOrganizeCascader } from '/@/components/Lydc';
  import { useBaseStore } from '/@/store/modules/base';
  const { t } = useI18n();

  const baseStore = useBaseStore();

  // import { getDepartmentSelectorByAuth } from '/@/api/permission/organize';
  const organizeIdTree = ref([]);
  interface State {
    dataForm: any;
    options: any[];
  }

  const state = reactive<State>({
    dataForm: {},
    options: [],
  });

  const schemas: FormSchema[] = [
    // {
    //   field: 'orgId',
    //   label: '所属组织',
    //   component: 'TreeSelect',
    //   slot: 'OrgId',
    //   rules: [{ required: true, trigger: 'change', message: '必填' }],
    // },
    {
      field: 'version',
      label: '版本',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'orgId',
      label: '所属组织',
      component: 'ApiSelect',
      required: true,
      componentProps: {
        api: ListByUserfactory,
        placeholder: '请选择所属组织',
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'searchKey',
        },
        resultField: 'data',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        useChangeCopy: true,
        labelField: 'Name',
        valueField: 'Id',
        // nameFormat: ['name'],
        afterFetch: ({ data }) => {
          if (!state.dataForm.id) {
            setFieldsValue({ orgId: data.length && data[0].Id });
          }
        },
      },
    },
    // {
    //   field: 'routeCode',
    //   label: '工艺路线编码',
    //   component: 'Input',
    //   componentProps: { placeholder: '请输入' },
    //   rules: [{ required: true, trigger: 'blur', message: '必填' }],
    // },
    {
      field: 'routeName',
      label: '工艺路线名称',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'processRouteType',
      label: '工艺路线类型:',
      component: 'ApiSelect',
      componentProps: {
        api: () => baseStore.getDictionaryData('processRouteType'),
        placeholder: '请选择',
        resultField: 'data',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        labelField: 'fullName',
        valueField: 'enCode',
      },
      rules: [
        {
          required: true,
          message: t('common.enterProcessName'),
          trigger: 'blur',
          validator: (_rule, val) => {
            if (!val) return Promise.reject(t('common.enterProcessName'));
            return Promise.resolve();
          },
        },
      ],
    },
    {
      field: 'status',
      label: '是否启用',
      i18nField: 'CommonCol.isEnable',
      component: 'Select',
      defaultValue: 1,
      componentProps: {
        placeholder: '请选择',
        options: [
          { fullName: t('dict.enableStatus.1'), id: 1 },
          { fullName: t('dict.enableStatus.2'), id: 2 },
        ],
      },
      rules: [{ required: true, trigger: 'change', message: '必填', type: 'number' }],
      //  transferRange: ['placeholder','label'],
    },
    {
      field: 'circulationType',
      label: '流转类型:',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择流转类型',
        api: () => {
          return baseStore.getDictionaryData('ProcessRoute.Circulation');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
    },

    {
      field: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: { placeholder: '请输入', row: 3 },
    },
  ];
  const organizeStore = useOrganizeStore();
  const getTitle = computed(() => (!state.dataForm.id ? t('common.newProcessRoute') : t('common.editProcessRoute')));
  const getOkTest = computed(() => (!state.dataForm.id ? t('common.saveAndDesign') : t('common.okText')));

  const emit = defineEmits(['register', 'reload', 'saveAndDesign']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, validate, resetFields, clearValidate, updateSchema }] = useForm({
    labelWidth: 120,
    schemas: schemas,
    i18nConfig: {
      moduleCode: 'ProcessRouteColumn',
    },
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init(data) {
    resetFields();
    state.dataForm.id = data.record.id;

    if (state.dataForm.id) {
      state.dataForm = data.record;
      if (data.record?.circulationType) {
        data.record.circulationType = String(data.record?.circulationType);
      }
      if (data.record?.processRouteType) {
        data.record.processRouteType = String(data.record?.processRouteType);
      }
      setFieldsValue(data.record); //设置表单值
      organizeIdTree.value = data.record.organizeIdTree.split(',') || [];
    } else {
      organizeIdTree.value = [];
    }
    console.log(organizeIdTree);
  }

  function onOrganizeChange(val) {
    setFieldsValue({ orgId: !val || !val.length ? '' : val[val.length - 1] });
    if (!val || !val.length) return;
    clearValidate('orgId');
  }

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      id: state.dataForm.id,
      organizeIdTree: organizeIdTree.value,
    };

    const formMethod = state.dataForm.id ? updateProcessRoute : addProcessRoute;
    const saveType = state.dataForm.id ? 'update' : 'add';
    formMethod(query)
      .then(({ msg, data }) => {
        organizeIdTree.value = [];
        createMessage.success(msg);
        changeOkLoading(false); //用于修改确认按钮的loading状态
        organizeStore.resetState();
        closeModal(); //关闭弹窗
        const id = saveType === 'add' ? data : '';
        if (!state.dataForm.id) {
          emit('saveAndDesign');
        } else {
          emit('reload', id);
        }
      })
      .catch(() => {
        changeOkLoading(false);
      });
  }

  // async function getDepartmentSelectorByAuthFn() {
  //   const { code, data } = await getDepartmentSelectorByAuth();
  //   if (code === 200) {
  //     state.options = data.list
  //     console.log(data);
  //   }
  // }
  onMounted(async () => {
    console.log(await baseStore.getDictionaryData('ProcessRoute.Circulation'));
  });
</script>
