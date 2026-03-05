<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('common.transfer')" showOkBtn @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { flowtransfer } from '/@/api/productionDeal/AOIDataAudit';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
  interface State {
    id: '';
  }

  const state = reactive<State>({
    id: '',
  });

  const schemas: FormSchema[] = [
    {
      // 转办人
      field: 'nextHandlerId',
      label: t('dict.CommonCol.transferPerson'),
      component: 'CustomUserSelect',
      componentProps: {
        multiple: false,
      },
    },
    {
      field: 'remark',
      label: t('dict.CommonCol.remark'),
      component: 'Textarea',
      componentProps: { placeholder: '请输入', rows: 3 },
    },
  ];

  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { validate }] = useForm({
    labelWidth: 80,
    schemas: schemas,
  });
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  function init(data) {
    state.id = data;
  }
  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      id: state.id,
    };
    flowtransfer(query)
      .then(res => {
        createMessage.success(res.msg);
        changeOkLoading(false); //用于修改确认按钮的loading状态
        closeModal(); //关闭弹窗
        emit('reload');
      })
      .catch(() => {
        changeOkLoading(false);
      });
  }
</script>
