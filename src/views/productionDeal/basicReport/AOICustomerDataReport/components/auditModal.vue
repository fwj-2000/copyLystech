<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('common.audit')" :minHeight="100" showOkBtn @ok="handleSubmit" width="400px">
    <!-- <div class="mb-[10px]">当前审批批次总计{{ state.ids.length }}条SN，其中{{ state.okCount }}条OK，{{ state.ngCount }}条NG</div> -->
    <div class="mb-[10px]">{{ t('dict.CommonCol.auditStatistics', [state.ids.length, state.okCount, state.ngCount]) }}</div>
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getapprover, addapprover } from '/@/api/productionDeal/AOICustomerDataReport';
  import { getAOICustomerReportMemberConfig } from '/@/api/productionDeal/AOIDataAudit';

  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const schemas: FormSchema[] = [
    // 审核人员
    {
      field: 'nextHandlerId',
      label: t('dict.CommonCol.reviewer'),
      component: 'CustomUserSelect',
      colProps: { span: 24 },
      required: true,
    },
  ];

  const state = reactive({
    ids: [],
    ngCount: 0,
    okCount: 0,
  });

  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, validate, resetFields, getFieldsValue }] = useForm({
    labelWidth: 180,
    schemas: schemas,
    layout: 'vertical',
  });

  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);
  async function init(params) {
    changeLoading(true);
    resetFields();
    const { data } = await getapprover(params).finally(() => changeLoading(false));
    state.ids = data.ids || [];
    state.ngCount = data.ngCount || 0;
    state.okCount = data.okCount || 0;
    const res = await getAOICustomerReportMemberConfig({});
    const memberIds = res.data?.memberIds || [];
    if (!memberIds.length) return;
    setFieldsValue({
      nextHandlerId: memberIds[0],
    });
  }

  //提交
  async function handleSubmit() {
    if (state.ids.length === 0) return createMessage.warning(t('dict.CommonCol.approvalNotFilteredData'));
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const params = {
      ...getFieldsValue(),
      ids: state.ids,
    };
    const res = await addapprover(params).finally(() => {
      changeOkLoading(false);
    });
    createMessage.success(res.msg);
    changeOkLoading(false); //用于修改确认按钮的loading状态
    closeModal(); //关闭弹窗
    emit('reload');
  }
</script>
