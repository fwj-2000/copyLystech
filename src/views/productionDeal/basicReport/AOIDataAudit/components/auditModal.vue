<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('dict.CommonCol.agree')" showOkBtn @ok="handleSubmit" width="500px">
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { approver } from '/@/api/productionDeal/AOIDataAudit';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getAOICustomerReportMemberConfig } from '/@/api/productionDeal/AOIDataAudit';

  const { t } = useI18n();
  const schemas: FormSchema[] = [
    // 下一个处理人
    {
      field: 'nextHandlerId',
      label: t('dict.CommonCol.nextProcessor'),
      component: 'CustomUserSelect',
      required: true,
      colProps: { span: 24 },
    },
    // 备注
    {
      field: 'remark',
      label: t('dict.CommonCol.remark'),
      component: 'Textarea',
      colProps: { span: 24 },
    },
  ];

  const emit = defineEmits(['register', 'added', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, validate, resetFields, getFieldsValue, updateSchema }] = useForm({
    labelWidth: 180,
    schemas: schemas,
    layout: 'vertical',
    // i18nConfig: {
    //   moduleCode: 'MoldApplyColumn',
    //   transferRange: ['label', 'placeholder'],
    // },
  });
  const state = reactive<{ ids: string[] }>({
    ids: [],
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  async function init(data) {
    changeLoading(true);
    state.ids = [data.id];
    resetFields();
    const res = await getAOICustomerReportMemberConfig({ configType: data.currentProcessorNode }).finally(() => changeLoading(false));
    const memberIds = res.data?.memberIds || [];
    updateSchema({
      field: 'nextHandlerId',
      ifShow: !!memberIds.length,
    });
    if (!memberIds.length) return;
    setFieldsValue({
      nextHandlerId: memberIds[0],
    });
  }

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const params = {
      ...getFieldsValue(),
      ...state,
    };
    const res = await approver(params).finally(() => {
      changeOkLoading(false);
    });
    createMessage.success(res.msg);
    changeOkLoading(false); //用于修改确认按钮的loading状态
    closeModal(); //关闭弹窗
    emit('reload');
  }
</script>
