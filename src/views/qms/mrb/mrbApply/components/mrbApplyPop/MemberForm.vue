<template>
  <Subtitle :title="t('dict.MrbApplyFlowNode.MrbMemberReviewTitle') + ':'" />
  <BasicForm v-show="modeType !== 'view'" @register="registerForm"> </BasicForm>

  <div class="member-form mb-20px" v-show="modeType === 'view'">
    <MemberFormPannel
      :title="t('dict.MrbApplyFlowNode.SqeReview')"
      :personName="memberData.sqeUserName"
      :result="Number(memberData.sqeResult)"
      :reviewTakeTime="memberData.sqeReviewTakeTime"
      :reviewTime="memberData.sqeReviewTime"
      :reviewRemark="memberData.sqeReviewRemark" />
    <MemberFormPannel
      :title="t('dict.MrbApplyColumn.pdUserName')"
      :personName="memberData.pdUserName"
      :result="Number(memberData.pdResult)"
      :reviewTakeTime="memberData.pdReviewTakeTime"
      :reviewTime="memberData.pdReviewTime"
      :reviewRemark="memberData.pdReviewRemark" />

    <MemberFormPannel
      :title="t('dict.MrbApplyColumn.purchaseUserName')"
      :personName="memberData.purchaseUserName"
      :result="Number(memberData.purchaseResult)"
      :reviewTakeTime="memberData.purchaseReviewTakeTime"
      :reviewTime="memberData.purchaseReviewTime"
      :reviewRemark="memberData.purchaseReviewRemark" />
  </div>
</template>
<script setup lang="ts">
  import { Subtitle } from '/@/components/Subtitle';
  import MemberFormPannel from './MemberFormPannel.vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { ref, onMounted } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { MEMBER_FORMCONFIG } from './config';

  const { t } = useI18n();
  const modeType = ref('');
  const memberData = ref<any>({});
  const [registerForm, formApi] = useForm(MEMBER_FORMCONFIG);
  function initFn({ memberInfo, tableData, mode }) {
    modeType.value = mode;
    if (mode == 'view') {
      // formApi.setProps({
      //   disabled: true,
      // });

      memberData.value = memberInfo;
    } else {
      formApi.setFieldsValue(tableData);
    }
  }

  onMounted(() => {});

  async function getParamsFn(type) {
    const validateFlag = await formApi.validate();
    if (!validateFlag && type) return false;
    return formApi.getFieldsValue();
  }

  defineExpose({
    getParamsFn,
    initFn,
    formApi,
  });
</script>

<style lang="less" scoped>
  .member-form {
    display: flex;
  }
</style>
