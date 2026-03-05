<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="库存处理方式" :width="900" :minHeight="500" destroy-on-close @ok="handleSave">
    <BasicForm @register="registerForm"></BasicForm>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { handleStock } from '/@/api/business/sap';
  import { message } from 'ant-design-vue';
  import { useBaseStore } from '/@/store/modules/base';
  const { t } = useI18n();
  const emit = defineEmits(['register', 'reload']);
  const state = reactive<{
    id: string;
    base: any;
  }>({
    id: '',
    base: {},
  });

  const baseStore = useBaseStore();

  const [registerForm, { getFieldsValue, updateSchema }] = useForm({
    layout: 'vertical',
    schemas: [
      {
        field: 'stockHandle',
        label: '处理方式',
        component: 'Select',
        componentProps: {
          options: [],
        },
      },
      {
        field: 'remarks',
        label: '备注',
        component: 'Textarea',
        componentProps: {
          row: 3,
          maxLength: 200,
        },
      },
    ],
  });

  const [registerModal, { closeModal }] = useModalInner(init);
  async function init(data) {
    state.base = data.base;
    const _d = await baseStore.getDictionaryData('StockHandleEnum');
    updateSchema({
      field: 'stockHandle',
      componentProps: {
        options: _d,
      },
    });
  }

  // 处理
  async function handleSave() {
    const vals = getFieldsValue();
    const _p = {
      ...state.base,
      ...vals,
    };
    const r = await handleStock(_p);
    if (r.code == 200) {
      message.success('提交成功');
      closeModal();
    }
  }
</script>
