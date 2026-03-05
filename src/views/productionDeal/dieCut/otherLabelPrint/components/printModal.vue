<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="type === 'copy' ? t('common.copyText') : t('common.printText')"
    showOkBtn
    @ok="handleSubmit"
    width="600px">
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
  <designindex v-show="false" ref="designindexPrint" />
</template>
<script setup lang="ts">
  import { ref, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { printFormSchema } from '../config';
  import designindex from '/@/views/system/printTemplate/components/LydcPrintDesign/src/designIndex.vue';
  import { otherLabelPrint, getPrintTemplateDetail } from '/@/api/productionDeal/otherLabelPrint';

  import { useI18n } from '/@/hooks/web/useI18n';

  const translateInput = ref('');
  interface designindexPrintType {
    clickTemplate: (data: any) => void;
    previewPrint: (data: any) => void;
  }
  const designindexPrint = ref<designindexPrintType>();
  const emit = defineEmits(['register', 'added', 'reload']);
  const { t } = useI18n();

  const type = ref('');

  const [registerForm, { validate, resetFields, updateSchema, setFieldsValue }] = useForm({
    labelWidth: 180,
    schemas: printFormSchema,
    layout: 'vertical',
    baseColProps: { span: 12 },
    i18nConfig: {
      moduleCode: 'OtherLabelPrintColumn',
      transferRange: ['label', 'placeholder'],
    },
  });

  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);
  async function init({ handleType, row }) {
    type.value = handleType;
    translateInput.value = '';
    await nextTick();
    resetFields();
    updateSchema({
      field: 'templateId',
      componentProps: {
        onChange: (e, { label }) => {
          templateName.value = label;
        },
      },
    });
    // });
    if (handleType === 'copy') {
      setFieldsValue(row);
      templateName.value = row.templateName;
    }
  }

  const templateName = ref('');

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);

    const { data } = await otherLabelPrint({ ...values, templateName: templateName.value }).finally(() => {
      changeOkLoading(false);
    });
    getPrintTemplateDetail(values.templateId).then(res => {
      emit('reload');
      closeModal();
      if (designindexPrint.value && designindexPrint.value.clickTemplate) {
        designindexPrint.value.clickTemplate(res.data);
        designindexPrint.value.previewPrint([values]);
      }
    });
  }
</script>

<style lang="less" scoped>
  :deep(.icon-ym-scanCode) {
    color: #ff7b00 !important;
  }
</style>
