<script setup>
  import { nextTick } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  const emit = defineEmits(['calcDowntimeOneHour']);

  const [
    registerTechnologyTableForm,
    { setFieldsValue: setTechnologyTableFieldsValue, getFieldsValue: getTechnologyTableFieldsValue, setProps: setTechnologyTableFieldsProps },
  ] = useForm({
    schemas: getTechnologyTableFormSchema(),
    layout: 'horizontal',
    baseColProps: {
      span: 8,
    },
    labelAlign: 'right',
    i18nConfig: {
      moduleCode: 'PCCApplyColumn',
      transferRange: ['placeholder', 'label'],
    },
  });

  function getTechnologyTableFormSchema() {
    return [
      {
        field: 'singleRefuelingDuration',
        label: '单次换料时长(MIN/次)',
        className: 'form-required',
        component: 'InputNumber',
        componentProps: {
          step: 0.1,
          precision: 1,
          onChange: async () => {
            await nextTick();
            emit('calcDowntimeOneHour');
          },
        },
        labelWidth: 164,
      },
      // 1H停机时长
      // (60*主工序速度*小时数)
      // /
      // (
      //  (
      //      1/(
      //          (1/材料1长度)+...+  (1/材料n长度)
      //      )
      //  )+(主工序速度*小时数)
      // )
      {
        field: 'downtimeOneHour',
        label: '1H停机时长(MIN)',
        component: 'Input',
        helpMessage: [t('dict.PCCApplyColumn.downtimeOneHour'), t('dict.PCCApplyColumn.downtimeOneHourTip2')],
        componentProps: { placeholder: t('common.systemCalculation'), disabled: true },
        labelWidth: 140,
      },
      {
        field: 'utilizationRate',
        label: '设备稼动率',
        component: 'InputNumber',
        helpMessage: [t('dict.PCCApplyColumn.utilizationRate'), t('dict.PCCApplyColumn.utilizationRateTip2')],
        componentProps: {
          placeholder: t('common.systemCalculation'),
          disabled: true,
          rate: true,
        },
        labelWidth: 130,
      },
    ];
  }
  function setDisabled(disabled) {
    setTechnologyTableFieldsProps({
      disabled,
    });
  }

  defineExpose({
    setTechnologyTableFieldsValue,
    getTechnologyTableFieldsValue,
    setDisabled,
  });
</script>

<template>
  <a-card class="pcc-technology-table-form" id="processFlow">
    <BasicForm @register="registerTechnologyTableForm"></BasicForm>
  </a-card>
</template>

<style scoped lang="less">
  .pcc-technology-table-form {
    :deep(.ant-card-body) {
      padding: 10px 6px 0;
    }
  }
</style>
