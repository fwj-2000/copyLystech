<!-- 子组件：BatchModal.vue -->
<template>
  <BasicModal v-bind="$attrs" :width="700" :title="t('hrBis.ImportConditions')" destroyOnClose class="batch-modal" @register="registerModal" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import dayjs from 'dayjs';

  const { t } = useI18n();

  // 1. 定义「handleSubmit 事件的参数类型」（核心：明确参数结构）
  // 导出这个类型，让父组件能引入使用
  export interface BatchModalSubmitData {
    month: string; // 格式化后的 YYYY-MM 字符串
    durIng: number | string; // 0（月中）/ 1（月末）
    supRegMonth?: string; // 补提月，可选参数
  }

  // 2. 定义「所有 emit 事件的类型映射」（替代原字符串数组）
  type BatchModalEmits = {
    (e: 'reload'): void; // reload 无参数
    (e: 'handleSubmit', data: BatchModalSubmitData): void; // handleSubmit 接收 BatchModalSubmitData 类型参数
  };

  // 定义组件props
  interface IProps {
    showSupRegMonth?: boolean; // 是否显示补提月字段
  }

  const props = withDefaults(defineProps<IProps>(), {
    showSupRegMonth: false,
  });

  // 3. 用强类型初始化 defineEmits
  const emit = defineEmits<BatchModalEmits>();

  const [registerModal, { closeModal, changeLoading }] = useModalInner(init);

  function init() {
    // 可选：给 init 加参数类型，这里暂用 any
    changeLoading(true);
    resetFields();
    changeLoading(false);
  }

  const schemas: FormSchema[] = [
    {
      label: '发放月份',
      i18nField: 'IssuanceMonth',
      field: 'month',
      component: 'DatePicker',
      componentProps: { format: 'YYYY-MM' },
      required: true,
    },
    {
      label: '发放期间',
      i18nField: 'IssuancePeriod',
      field: 'durIng',
      component: 'Select',
      componentProps: {
        options: [
          { title: t('hrBis.monthMid'), value: '0' },
          { title: t('hrBis.monthEnd'), value: '1' },
        ],
        fieldNames: { label: 'title', value: 'value' },
      },
      required: true,
    },
    {
      label: '补提月',
      field: 'supRegMonth',
      component: 'DatePicker',
      componentProps: { format: 'YYYY-MM' },
      required: true,
      ifShow: () => props.showSupRegMonth, // 根据props控制显示
    },
  ];

  const [registerForm, { validate, resetFields }] = useForm({
    layout: 'vertical',
    labelWidth: 400,
    schemas: schemas,
    i18nConfig: {
      moduleCode: 'hrBisColumn',
      transferRange: ['label'], //placeholder
    },
  });

  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    // const { month, ...res } = getFieldsValue();
    // // console.log('🚀 ~ getFieldsValue:', getFieldsValue());
    const formattedData: BatchModalSubmitData = {
      month: dayjs(values.month).format('YYYY-MM'),
      durIng: values.durIng, // 这里会自动校验：values.durIng 必须是 number，否则 TS 报错
      supRegMonth: dayjs(values.supRegMonth).format('YYYY-MM'),
    };
    if (!props.showSupRegMonth) {
      delete formattedData.supRegMonth;
    }

    changeLoading(true);
    emit('handleSubmit', formattedData); // 传参严格符合类型，子组件先做一层校验
    closeModal();
    changeLoading(false);
  }
</script>
