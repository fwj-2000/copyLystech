<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="选择过站截止工序" showOkBtn @ok="handleSubmit" destroyOnClose>
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { tempReprintAuto } from '/@/api/productionDeal/manualAssignmentCode';
  import { alllistbyfactory } from '/@/api/engineering/mould';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ref } from 'vue';
  const { t } = useI18n();
  const selectedGxItem = ref<any>(null);
  const schemas: FormSchema[] = [
    {
      field: 'gxCode',
      label: '工序',
      component: 'ApiSelect',
      componentProps: {
        api: () => alllistbyfactory({ factoryArea: 'SU01' }),
        placeholder: '工序',
        showSearch: true,
        memoInputVal: true,
        resultField: 'data',
        filterOption: true,
        notFoundContent: null,
        immediate: true,
        useChangeCopy: true,
        labelField: 'name',
        valueField: 'code',
        onChange: (value, option) => {
          selectedGxItem.value = option;
        },
      },
      required: true,
    },
  ];

  const emit = defineEmits(['register', 'reload']);
  const { createMessage, createConfirm } = useMessage();
  const [registerForm, { validate }] = useForm({
    labelWidth: 120,
    schemas: schemas,
    layout: 'vertical',
  });
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);
  function init(data) {}
  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: `只会生成 “${selectedGxItem.value.label}” 工序之前的工序流转记录，确定一键过站吗？`,
      onOk: async () => {
        try {
          tempReprintAuto(values)
            .then(({ msg }) => {
              createMessage.success(msg);
              changeOkLoading(false); //用于修改确认按钮的loading状态
              closeModal(); //关闭弹窗
              emit('reload');
            })
            .catch(() => {
              changeOkLoading(false);
            });
        } catch (error) {
          console.log(error);
        }
      },
    });
  }
</script>
