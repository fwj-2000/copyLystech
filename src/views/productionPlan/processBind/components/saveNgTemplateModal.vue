<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="t('common.saveTemplate')"
    showOkBtn
    @ok="handleSubmit"
    @cancel="handleCloseFn"
    destroyOnClose
    wrapClassName="chooseModal">
    <BasicForm @register="registerForm">
      <template #OrgId>
        <lydcOrganizeCascader v-model:value="organizeIdTree" :showSearch="true" @change="onOrganizeChange" />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { LydcOrganizeCascader } from '/@/components/Lydc';
  import { reactive, ref, nextTick } from 'vue';
  import { saveNgroute } from '/@/api/productionDeal/processroutebind';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const organizeIdTree = ref([]);
  const state = reactive({
    data: [] as any,
  });
  const [registerModal, { closeModal }] = useModalInner(init);
  const searchFormSchema: FormSchema[] = [
    {
      field: 'orgId',
      label: '所属组织：',
      component: 'TreeSelect',
      slot: 'OrgId',
      rules: [{ required: true, trigger: 'change', message: '必填' }],
    },
    {
      field: 'routeName',
      label: '工艺路线名称：',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
  ];

  const [registerForm, { validate, setFieldsValue, getFieldsValue, clearValidate }] = useForm({
    schemas: searchFormSchema,
    labelWidth: 120,
    autoSubmitOnEnter: true,
  });

  function onOrganizeChange(val) {
    setFieldsValue({ orgId: !val || !val.length ? '' : val[val.length - 1] });
    if (!val || !val.length) return;
    clearValidate('orgId');
  }

  async function saveNgTemplateFn() {
    const { isUpdateNgRoute, ngRouteId, ngRouteNodeList } = state.data;
    const params = {
      ...getFieldsValue(),
      isUpdateNgRoute,
      ngRouteId,
      ngRouteNodeList,
    };
    console.log(params);

    try {
      const { code, msg } = await saveNgroute(params);
      if (code === 200) {
        return createMessage.success(msg);
      }
      createMessage.error(msg);
    } catch (error) {
      console.error(error);
    }
  }
  async function handleSubmit() {
    const _validate = await validate();
    if (!_validate) return;
    saveNgTemplateFn();
    closeModal();
  }
  function handleCloseFn() {
    closeModal();
  }
  function init({ data }) {
    state.data = data;
  }
</script>
