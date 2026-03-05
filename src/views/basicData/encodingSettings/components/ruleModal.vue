<template>
  <BasicModal
    :title="t('common.editText')"
    :draggable="true"
    v-bind="$attrs"
    canFullscreen
    @register="registerModal"
    showOkBtn
    @ok="handleConfirm"
    destroy-on-close>
    <BasicForm @register="registerForm">
      <template #orgId>
        <lydcOrganizeSelect
          :disabled="sign === 'view'"
          v-model:value="organizeIdTree"
          :placeholder="t('common.selectPlaceholder')"
          @change="onOrganizeChange" />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { defineEmits, defineProps, reactive, ref, toValue, unref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { postIdGeneratorRule, putIdGeneratorRule } from '/@/api/basicData/encodingSettings';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useBaseStore } from '/@/store/modules/base';
  import { useMessage } from '/@/hooks/web/useMessage';

  const emits = defineEmits(['getTable', 'register']);
  // { typeOption, pageState, sign }
  const props = defineProps(['typeOption', 'pageState', 'sign', 'Id']);
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);
  const Id = ref('');

  const { t } = useI18n();

  interface FormState {
    Name: string;
    Type: string | null;
    OrgId: string;
    Version: string;
    Description: string;
  }

  const rules = {
    Name: [{ required: true }],
    Type: [{ required: true }],
    OrgId: [{ required: true }],
    Version: [{ required: true }],
    Description: [{ required: true }],
  };
  const formRef = ref(null);
  const organizeIdTree = ref([]);
  const baseStore = useBaseStore();

  const visible = ref<boolean>(false);

  const [registerForm, { setFieldsValue, clearValidate, validate, resetFields, updateSchema, getFieldsValue, setProps }] = useForm({
    schemas: getSchemas(),
    layout: 'vertical',
    labelWidth: 320,
    i18nConfig: {
      moduleCode: 'IdgeneratorRuleColumn',
      transferRange: ['placeholder', 'label'],
    },
  });
  const { createMessage, createConfirm } = useMessage();

  const state = reactive<State>({
    sign: 'edit',
  });

  function getSchemas(): FormSchema[] {
    return [
      {
        field: 'Name',
        label: '规则名称',
        component: 'Input',
        componentProps: { placeholder: '请输入规则名称', maxlength: 50 },
        rules: [{ required: true, trigger: 'blur' }],
      },
      {
        field: 'Type',
        label: '规则类型',
        component: 'Select',
        componentProps: { placeholder: '请选择主要制程', maxlength: 50 },
        rules: [{ required: true, trigger: 'blur' }],
      },
      {
        field: 'orgId',
        label: '组织',
        component: 'OrganizeSelect',
        slot: 'orgId',
        i18nField: 'OrgName',
        componentProps: { placeholder: '请选择组织', maxlength: 50 },
        rules: [{ required: true, trigger: 'blur' }],
      },
      {
        field: 'Description',
        label: '描述',
        component: 'Textarea',
        componentProps: { placeholder: '请输入描述', maxlength: 50 },
        rules: [{ required: true, trigger: 'blur' }],
      },
    ];
  }

  const resetForm = () => {
    toValue(formRef).resetFields();
  };

  function onOrganizeChange(val) {
    setFieldsValue({ orgId: !val || !val.length ? '' : val[val.length - 1] });
    if (!val || !val.length) return;
    clearValidate('orgId');
  }

  const clearForm = () => {
    unref(formRef).clearValidate();
  };
  const setVisible = (e: boolean) => {
    visible.value = e;
  };

  const formState = reactive<FormState>({
    Name: '',
    Type: null,
    OrgId: '',
    Version: '',
    Description: '',
  });
  const setFormData = record => {
    const { typeOption } = props;
    const { Name, OrgId, Version, Description } = record;
    const Type = typeOption.find(item => item.sortCode === record.Type)?.enCode ?? null;

    Object.assign(formState, { Name, Type, OrgId, Version, Description });
  };

  function init(data) {
    organizeIdTree.value = [];
    changeLoading(true);
    resetFields();
    getTypeOptions();
    Id.value = data.Id;

    if (Id.value) {
      setFieldsValue({
        orgId: data.OrganizeIdTree,
        ...data,
      });
      organizeIdTree.value = data.OrganizeIdTree.split(',');
    }
    state.sign = data.sign;
    if (data.sign === 'view') {
      setProps({
        disabled: true,
      });
    }
    changeLoading(false);
  }

  const getTypeOptions = () => {
    baseStore.getDictionaryData('IDGeneratorRuleType').then(res => {
      const typeOption = Array.isArray(res) ? res : [res];
      console.log(typeOption);
      updateSchema({
        field: 'Type',
        componentProps: {
          options: typeOption,
          fieldNames: { value: 'enCode' },
        },
      });
    });
  };

  const handleConfirm = async () => {
    console.log(getFieldsValue());
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      Id: Id.value,
    };
    const formMethod = Id.value ? putIdGeneratorRule : postIdGeneratorRule;
    formMethod(query)
      .then(res => {
        createMessage.success(res.msg);
        changeOkLoading(false);
        closeModal();
        console.log(5555);
        emits('reload');
      })
      .catch(() => {
        changeOkLoading(false);
      });
    // const {
    //   pageState: { pageSize, current },
    //   sign,
    //   Id,
    // } = props;
    // console.log(props);
    // let res;
    // formVal.validate().then(async val => {
    //   console.log(sign);
    //   // 表单校验通过
    //   if (toValue(sign) === 'add') {
    //     res = await postIdGeneratorRule(val);
    //   } else {
    //     console.log(Id);
    //     const idVal = toValue(Id);
    //     console.log(idVal);
    //     val.id = idVal;
    //     res = await putIdGeneratorRule(idVal, val);
    //   }
    //
    //   const { code, msg } = res;
    //   if (code === 200) {
    //     message.success(msg);
    //   }
    //   visible.value = false;
    //   emits('getTable', {
    //     pageSize,
    //     currentPage: current,
    //   });
    // });
  };

  defineExpose({
    resetForm,
    setVisible,
    setFormData,
  });
</script>

<style lang="less" scoped>
  //  modal样式start

  .title-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 20px;

    .modal-title {
      color: #1a1a1a;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: 24px; /* 150% */
    }
  }

  .form-wrapper {
    padding: 20px 36px;
  }

  // form表单校验*符号样式左边转到右边
  :deep(.ant-form-item-label > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::before) {
    display: inline-block;
    margin-right: 0;
    color: #ff4d4f;
    font-size: 14px;
    line-height: 1;
    content: '';
  }

  :deep(.ant-form-item-label > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::after) {
    display: inline-block;
    margin-right: 4px;
    color: #ff4d4f;
    font-size: 14px;
    line-height: 1;
    content: '*';
  }
</style>
