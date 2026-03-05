<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="t('dict.CommonCol.customerPrint')"
    destroy-on-close
    showOkBtn
    @ok="handleSubmit"
    width="400px"
    :minHeight="150">
    <div class="mb-12px">
      <div class="w-[100px] mb-8px">{{ t('dict.CommonCol.scanQRCode') }}</div>
      <LydcInput
        class="w-[100%]"
        :suffixIcon="'icon-ym icon-ym-scanCode'"
        v-model:value="translateInput"
        :placeholder="t('dict.CommonCol.scanQRCode')"
        @Keydown="handlerInputKeydown" />
    </div>
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
  <designindex v-show="false" ref="designindexPrint" />
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { printCustomerSNFormSchema } from '../config';
  import designindex from '/@/views/system/printTemplate/components/LydcPrintDesign/src/designIndex.vue';
  import { getCustomerLabel, getAllPrintTemplate, getPrintTemplateDetail } from '/@/api/productionDeal/packagePrint';
  import { useI18n } from '/@/hooks/web/useI18n';

  const translateInput = ref('');
  interface DesignindexPrintType {
    clickTemplate: (data: any) => void;
    previewPrint: (data: any) => void;
  }

  const designindexPrint = ref<DesignindexPrintType>();
  const emit = defineEmits(['register', 'added', 'reload']);
  const { t } = useI18n();
  const [registerForm, { validate, updateSchema, resetFields, setFieldsValue }] = useForm({
    labelWidth: 100,
    layout: 'vertical',
    schemas: printCustomerSNFormSchema,
    baseColProps: { span: 24 },
    i18nConfig: {
      moduleCode: 'PackLabelPrintColumn',
      transferRange: ['label', 'placeholder'],
    },
  });

  const [registerModal, { closeModal, changeLoading }] = useModalInner(init);
  async function init() {
    translateInput.value = '';
    resetFields();
  }

  const code = ref('');
  const handlerInputKeydown = async (e: any) => {
    if (e.keyCode !== 13) return;
    const val = e.target._value;
    code.value = val;
    resetFields();
    handlerInputChangeFn(val);
  };

  const printDetail = ref<any>({});

  const handlerInputChangeFn = async (code: string) => {
    changeLoading(true);
    translateInput.value = '';
    const { data } = await getCustomerLabel({ code }).catch(() => {
      changeLoading(false);
    });
    printDetail.value = data;
    setFieldsValue({ innerMaterialCode: data.innerMaterialCode });
    const res = await getAllPrintTemplate({
      firstCategoryCode: 'PackagingLabel',
      productCode: data.innerMaterialCode,
      secondCategoryCode: data.codeType,
    }).finally(() => {
      changeLoading(false);
    });
    const newRes =
      res.data.map(item => {
        return {
          fullName: item.name,
          enCode: item.id,
        };
      }) || [];
    updateSchema({
      field: 'labelTemplateId',
      componentProps: {
        options: newRes,
        fieldNames: { value: 'enCode' },
      },
    });
    if (newRes.length === 1) {
      setFieldsValue({
        labelTemplateId: newRes[0]?.enCode,
      });
    }
  };

  //提交

  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    getPrintTemplateDetail(values.labelTemplateId).then(res => {
      emit('reload');
      closeModal();
      if (designindexPrint.value && designindexPrint.value.clickTemplate) {
        designindexPrint.value.clickTemplate(res.data);
        designindexPrint.value.previewPrint([printDetail.value]);
      }
    });
  }
</script>

<style lang="less" scoped>
  :deep(.icon-ym-scanCode) {
    color: #ff7b00 !important;
  }
</style>
