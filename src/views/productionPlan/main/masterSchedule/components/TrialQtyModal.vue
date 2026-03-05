<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('dict.masterSchedule.trialSuggestPPSCount')" showOkBtn @ok="handleSubmit" width="400px">
    <BasicForm @register="registerForm"> </BasicForm>
    <div class="relative pt-10px">
      <a-spin :spinning="calLoading"> {{ t('dict.masterSchedule.calculatedValue') }}：{{ calcVal }} </a-spin>
    </div>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { debounce } from 'lodash-es';
  import { updateweekspps, getWeeksppsDetail, calcweekspps } from '/@/api/mps/productionPlan/MPS';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { notMatchNum } from '../../utils';
  import { toFixed } from 'ant-design-vue/es/input-number/src/utils/MiniDecimal';
  const calcVal = ref('');
  const calLoading = ref(false);

  const schemas: FormSchema[] = [
    {
      field: 'triggerWeeksPPS',
      // i18nField: 'CommonCol.isOutsource',
      label: '排产触发周数',
      component: 'InputNumber',
      required: true,
      componentProps: {
        setp: 1,
        min: 1,
        precision: 1,
        onChange: () => {
          debounceInputChange();
        },
      },
    },
    {
      field: 'upperWeeksPPS',
      // i18nField: 'CommonCol.isProvideMaterials',
      label: '排产上限周数',
      component: 'InputNumber',
      required: true,
      componentProps: {
        setp: 1,
        min: 1,
        precision: 1,
        onChange: () => {
          debounceInputChange();
        },
      },
    },
    {
      field: 'releaseWeeksPPS',
      label: '排产释放周数',
      component: 'InputNumber',
      required: true,
      componentProps: {
        setp: 1,
        min: 1,
        precision: 1,
        onChange: () => {
          debounceInputChange();
        },
      },
    },
  ];

  const emit = defineEmits(['register', 'added', 'reload']);
  const { createMessage, createConfirm } = useMessage();
  const { t } = useI18n();
  const [registerForm, { setFieldsValue, validate, resetFields, getFieldsValue }] = useForm({
    labelWidth: 180,
    schemas: schemas,
    layout: 'vertical',
    i18nConfig: {
      moduleCode: 'MasterDemandPlanColumn',
      transferRange: ['label', 'placeholder'],
    },
  });

  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  const handleCalculate = async () => {
    calLoading.value = true;
    const { triggerWeeksPPS, upperWeeksPPS, releaseWeeksPPS } = getFieldsValue();
    // 当数据为非整数时，四舍五入
    const _triggerWeeksPPS = toFixed(triggerWeeksPPS + '', '', 0);
    const _upperWeeksPPS = toFixed(upperWeeksPPS + '', '', 0);
    const _releaseWeeksPPS = toFixed(releaseWeeksPPS + '', '', 0);
    const params = {
      triggerWeeksPPS: _triggerWeeksPPS,
      upperWeeksPPS: _upperWeeksPPS,
      releaseWeeksPPS: _releaseWeeksPPS,
    };
    setFieldsValue(params);
    // 校验排产数量
    const notMatch = notMatchNum({
      triggerWeeks: _triggerWeeksPPS,
      upperLimitWeeks: _upperWeeksPPS,
      releaseWeeks: _releaseWeeksPPS,
    });
    if (notMatch) {
      calLoading.value = false;
      return createMessage.error(notMatch);
    }
    if (triggerWeeksPPS && upperWeeksPPS) {
      // 计算
      try {
        const { data } = await calcweekspps({
          id: state.value.id,
          ...params,
        });
        if (data || data == 0) {
          calcVal.value = data.toLocaleString(); // 加上千分符
        }
      } finally {
        calLoading.value = false;
      }
    }
    calLoading.value = false;
  };

  const debounceInputChange = debounce(handleCalculate, 1000);

  const state = ref({ id: '', suggestPPSCount: '' });

  async function init({ id }) {
    changeLoading(true);
    resetFields();
    const { data } = await getWeeksppsDetail({ id });
    if (data.triggerWeeksPPS && data.upperWeeksPPS) {
      setFieldsValue({ triggerWeeksPPS: data.triggerWeeksPPS, upperWeeksPPS: data.upperWeeksPPS, releaseWeeksPPS: data.releaseWeeksPPS });
    }
    state.value = { id, suggestPPSCount: data.suggestPPSCount };
    setTimeout(() => {
      if (data.triggerWeeksPPS && data.upperWeeksPPS) {
        debounceInputChange();
      }
    }, 200);
    changeLoading(false);
  }

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    // 校验排产数量
    const notMatch = notMatchNum({
      triggerWeeks: values.triggerWeeksPPS,
      upperLimitWeeks: values.upperWeeksPPS,
      releaseWeeks: values.releaseWeeksPPS,
    });
    if (notMatch) return createMessage.error(notMatch);
    createConfirm({
      iconType: 'info',
      content: t('tip.MPS.tip13'), // 确认把相关周数更新到该行料号及对应的排产周次表中？
      onOk: async () => {
        changeOkLoading(true);
        const res = await updateweekspps({
          ...values,
          ...state.value,
        }).finally(() => {
          changeOkLoading(false);
        });
        createMessage.success(res.msg);
        closeModal();
        emit('reload');
      },
    });
  }
</script>
