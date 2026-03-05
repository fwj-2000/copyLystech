<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" :draggable="true" showOkBtn @ok="handleSubmit">
    <div class="pl-24px pb-12px">
      正在对
      {{ state.reviewData.join(', ') }}
      进行提交审核操作
    </div>
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { submitaudit } from '/@/api/qms/iqc';
  interface State {
    reviewData: any[];
    applyId: string[];
  }
  const { createMessage } = useMessage();
  const state = reactive<State>({
    reviewData: [],
    applyId: [],
  });
  const emits = defineEmits(['register', 'reload', 'onSelect']);
  const applyId = ref([]);
  const { t } = useI18n();
  const [registerModal, { closeModal, changeLoading }] = useModalInner(init);

  // 其他基础信息
  const schema: FormSchema[] = [
    {
      field: 'verifyUserId',
      component: 'CustomUserSelect',
      label: '审核人',
      componentProps: {
        allowClear: true,
        immediate: false,
        showSearch: true,
        // fieldNames: {},
        // maxTagTextLength: 14,
        // maxTagPlaceholder: '...',
        // maxTagCount: 8,
        // multiple: true,
      },
      colProps: {
        span: 14,
      },
    },
  ];
  const [registerForm, { validate, getFieldsValue, setFieldsValue }] = useForm({
    schemas: schema,
    // baseColProps: { span: 8 },
    // actionColOptions: { span: 24 },
    autoSubmitOnEnter: true,
    submitFunc: handleSubmit,
  });

  const getTitle = computed(() => t('common.add1Text'));
  function init({ data }) {
    const reviewer: string[] = [];
    data.forEach((item: any) => {
      state.applyId.push(item.id);
      reviewer.push(item.testNo);
    });
    state.reviewData = reviewer;
  }
  async function submitauditFn() {
    changeLoading(true);
    try {
      const { code, msg } = await submitaudit({
        ...getFieldsValue(),
        applyIds: state.applyId,
      });
      if (code === 200) {
        createMessage.success(msg);
        closeModal();
        emits('reload');
      }
    } catch (error) {
      console.log(error);
    } finally {
      changeLoading(false);
    }
  }
  //提交
  async function handleSubmit() {
    const flag = await validate();
    if (!flag) return;
    submitauditFn();
  }
</script>
