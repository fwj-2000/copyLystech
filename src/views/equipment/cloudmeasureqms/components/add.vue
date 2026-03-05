<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" showOkBtn @ok="handleSubmit" destroyOnClose>
    <BasicForm @register="registerForm">
      <!-- <template #orgId>
        <lydcOrganizeSelect :disabled="!hasBtnP('btn_edit')" placeholder="请选择" />
      </template> -->
    </BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getQMSById, addQMS, updateQMS } from '/@/api/equipment/cloudmeasureqms';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
  interface State {
    dataForm: any;
    factoryList: any[];
  }

  const state = reactive<State>({
    dataForm: {
      id: '',
    },
    factoryList: [],
  });

  const schemas: FormSchema[] = [
    {
      field: 'factoryName',
      label: '工厂',
      component: 'Input',
      required: true,
      componentProps: {
        placeholder: '请输入工厂',
      },
    },
    {
      field: 'name',
      label: '名称',
      component: 'Input',
      componentProps: { placeholder: '请输入名称' },
      required: true,
    },
    // {
    //   field: 'orgId',
    //   label: '组织',
    //   component: 'OrganizeSelect',
    //   slot: 'orgId',
    //   i18nField: 'OrgName',
    //   componentProps: { placeholder: '请选择组织', maxlength: 50 },
    //   rules: [{ required: true, trigger: 'blur' }],
    // },
    {
      field: 'account',
      label: t('dict.CommonCol.account'), //'账号',
      component: 'Input',
      componentProps: { placeholder: '请输入账号' },
      required: true,
    },
    {
      field: 'password',
      label: '密码',
      component: 'Input',
      componentProps: { placeholder: '请输入密码' },
      required: true,
    },
  ];

  const getTitle = computed(() => (state.dataForm.id ? t('common.editText') : t('common.addText')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, validate, resetFields }] = useForm({
    labelWidth: 120,
    schemas: schemas,
    layout: 'vertical',
  });
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);
  function init(data) {
    state.dataForm = data;
    if (data.id) {
      getQMSById(data.id).then(({ code, data }) => {
        if (code === 200) {
          state.dataForm = data;
          resetFields();
          setFieldsValue(data);
        }
      });
    }
  }

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      id: state.dataForm.id,
    };
    const formMethod = state.dataForm.id ? updateQMS : addQMS;
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
