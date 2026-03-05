<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" :draggable="true" showOkBtn @ok="handleSubmit" :width="1200">
    <BasicForm @register="registerForm" />
    <div class="w-full h-400px mt-20px">
      <BasicChart :data="state.chartData"></BasicChart>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addMaterial } from '/@/api/purchase/materialBase';
  import { useBaseStore } from '/@/store/modules/base';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { schemas } from './config';
  import dayjs from 'dayjs';
  import { getLotnolist } from '../../../../../api/qms/quality';
  import BasicChart from './BasicChart.vue';
  interface State {
    chartData: any[];
  }
  const state = reactive<State>({
    chartData: [],
  });
  const emits = defineEmits(['register', 'reload', 'onSelect']);

  const { t } = useI18n();
  const baseStore = useBaseStore();
  const { createMessage } = useMessage();
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  const [registerForm, { validate, setFieldsValue }] = useForm({
    schemas,
    labelWidth: 100,
    baseColProps: { span: 6 },
    // actionColOptions: { span: 24 },
    autoSubmitOnEnter: true,
    submitFunc: handleSubmit,
  });

  const getTitle = computed(() => t('common.add1Text'));
  function init(data) {
    const reviewer: string[] = [];
    data.reviewData.forEach((item: any) => {
      reviewer.push(item.chkUserNo);
    });
    setFieldsValue({ reviewer });
  }
  //提交
  async function handleSubmit() {}
</script>
