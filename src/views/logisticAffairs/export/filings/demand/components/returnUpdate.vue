<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :minHeight="300" :title="state.title" showOkBtn @ok="handleSubmit" destroy-on-close>
    <BasicForm class="w-full" @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';

  import { BasicForm, useForm } from '/@/components/Form';

  const { t } = useI18n();
  const state = reactive<{
    title: string;
    api: Function;
    beforeFetch: (params: any) => {};
  }>({
    title: t('dict.FilingsApplyDataStatusEnum.4'),
    api: () => Promise.resolve(),
    beforeFetch: () => ({}),
  });
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init(data) {
    changeLoading(true);
    state.beforeFetch = data.beforeFetch;
    setTimeout(() => {
      setFieldsValue({ engineering: 0, engineeringRemarks: '', produce: 0, produceRemarks: '' });
      state.api = data.api;
      changeLoading(false);
    });
  }

  // 初始信息
  const [registerForm, { getFieldsValue, updateSchema, setFieldsValue }] = useForm({
    layout: 'horizontal',
    schemas: [
      {
        field: 'engineering',
        label: t('dict.CommonCol.pdId'),
        component: 'Switch',
        componentProps: {
          onChange: checked => {
            updateSchema({
              field: 'engineeringRemarks',
              componentProps: {
                disabled: !checked,
              },
            });
          },
        },
      },
      {
        field: 'engineeringRemarks',
        label: t('common.backReson'),
        component: 'Textarea',
        componentProps: {
          disabled: true,
        },
      },
      {
        field: 'produce',
        label: t('dict.ProjectMembersTypeEnum.ProducePerson'),
        component: 'Switch',
        componentProps: {
          onChange: checked => {
            updateSchema({
              field: 'produceRemarks',
              componentProps: {
                disabled: !checked,
              },
            });
          },
        },
      },
      {
        field: 'produceRemarks',
        label: t('common.backReson'),
        component: 'Textarea',
        componentProps: {
          disabled: true,
        },
      },
    ],
  });

  // 通过api去调用
  async function handleSubmitByApi() {
    try {
      const formData = getFieldsValue();

      if (!formData.engineering && !formData.produce) {
        return createMessage.warning(t('sys.validate.arrayRequiredPrefix'));
      }

      let params: any = {};
      if (formData.engineering) {
        params.engineering = formData.engineering;
        params.engineeringRemarks = formData.engineeringRemarks;
      }

      if (formData.produce) {
        params.produce = formData.produce;
        params.produceRemarks = formData.produceRemarks;
      }

      if (state.beforeFetch) {
        params = state.beforeFetch(params);
      }

      changeOkLoading(true);
      const r = await state?.api(params);
      if (r.code !== 200) return createMessage.warning(r.msg || t('sys.api.operationFailed'));
      changeOkLoading(false);
      closeModal();
      return emit('reload');
    } catch (e) {
      changeOkLoading(false);
      throw e;
    }
  }

  // 提交数据
  async function handleSubmit() {
    // 适配其他组件风格，当有api和beforeFetch时，不使用submitCallback
    if (state.api) {
      handleSubmitByApi();
    }
  }
</script>
