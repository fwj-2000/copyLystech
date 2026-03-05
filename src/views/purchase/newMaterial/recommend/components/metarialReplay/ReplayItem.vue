<template>
  <div class="enigeer-item">
    <div style="font-weight: bold; margin-bottom: 10px">{{ t('dict.MaterialDevelopmentApplySonNode.EngineeringReview') }}：</div>
    <BasicForm @register="registerForm"></BasicForm>
  </div>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { IS_SATISFY_LIST } from '/@/components/CustomComponents/src/material/Constant';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();

  const props = defineProps({
    recommendType: {
      type: Number,
      default: 1,
    },
  });

  const state = reactive({
    values: {},
  });

  // 不满足的schema
  const rejectSchema: FormSchema[] = [
    {
      field: 'conclusionRemarks',
      label: t('common.notReason'),
      labelWidth: 120,
      component: 'Textarea',
      required: true,
      componentProps: {
        rows: 1,
        maxlength: 200,
      },
      colProps: {
        span: 15,
      },
    },
  ];
  // 通用
  const commonSchema: FormSchema[] = [
    {
      field: props.recommendType == 2 ? 'status' : 'conclusionStatus',
      label: t('common.result'),
      labelWidth: 55,
      component: 'Radio',
      required: true,
      componentProps: {
        options: props.recommendType == '2' ? IS_SATISFY_LIST : IS_SATISFY_LIST.filter(item => item.id != 2),
        onchange: (e, data) => {
          const t = e.srcElement || e.target;
          if (t.value == 2) {
            resetSchema(commonSchema.concat(rejectSchema));
          } else {
            resetSchema(commonSchema);
          }
          // sqe节点变更到采购送样那边处理
          // else {
          // 供应商才需要走SQE
          // if (props.recommendType == 2) {
          //   resetSchema(commonSchema.concat(sqeSchema));
          //   nextTick(() => {
          //     setFieldsValue({
          //       qualityDesensitizationUserId: state.values.qualityDesensitizationUserId,
          //     });
          //   });
          // }
          // }
        },
      },
      colProps: {
        span: 9,
      },
    },
  ];

  const [registerForm, { getFieldsValue, setFieldsValue, resetSchema }] = useForm({
    layout: 'horizontal',
    schemas: commonSchema,
  });

  const beforeGetFieldsValue = () => {
    const params = {
      ...getFieldsValue(),
    };
    // if (!params.qualityDesensitizationUserId) {
    //   delete params.qualityDesensitizationUserId;
    // }
    return params;
  };

  const beforeSetFieldsValue = value => {
    console.log(value);
    setFieldsValue(value);
    state.values = value;
  };

  defineExpose({
    getFieldsValue: beforeGetFieldsValue,
    setFieldsValue: beforeSetFieldsValue,
  });
</script>
<style lang="less" scoped>
  .enigeer-item {
    border-radius: 4px;
    border: 1px solid #dbdbdb;
    background: #fff;
    padding: 8px;
  }
</style>
