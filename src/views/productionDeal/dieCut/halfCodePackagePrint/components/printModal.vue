<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('dict.CommonCol.packageLabelPrint')" showOkBtn @ok="handleSubmit" width="700px">
    <div class="mb-12px">
      <span>{{ t('dict.CommonCol.scanQRCode') }}：</span>
      <div class="w-1/2">
        <LydcInput
          :suffixIcon="'icon-ym icon-ym-scanCode'"
          v-model:value="translateInput"
          :placeholder="t('dict.CommonCol.scanQRCode')"
          @Keydown="handlerInputKeydown" />
      </div>
    </div>
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
  <designindex v-show="false" ref="designindexPrint" />
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { printFormSchema } from '../config';
  import designindex from '/@/views/system/printTemplate/components/LydcPrintDesign/src/designIndex.vue';
  import { getAllPrintTemplate, GetCurrentDetailBySnOrDocNo, PrintApi, getPrintTemplateDetail } from '/@/api/productionDeal/packagePrint';

  import { useI18n } from '/@/hooks/web/useI18n';
  import dayjs from 'dayjs';

  const translateInput = ref('');
  interface DesignindexPrintType {
    clickTemplate: (data: any) => void;
    previewPrint: (data: any) => void;
  }
  const designindexPrint = ref<DesignindexPrintType>();
  const emit = defineEmits(['register', 'added', 'reload']);
  const { t } = useI18n();
  const [registerForm, { setFieldsValue, validate, updateSchema, resetFields }] = useForm({
    labelWidth: 180,
    schemas: printFormSchema,
    layout: 'vertical',
    baseColProps: { span: 12 },
    i18nConfig: {
      moduleCode: 'PackLabelPrintColumn',
      transferRange: ['label', 'placeholder'],
    },
  });

  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);
  async function init() {
    translateInput.value = '';
    resetFields();
  }

  const code = ref('');
  const handlerInputKeydown = async (e: any) => {
    if (e.keyCode !== 13) return;
    const val = e.target._value;
    code.value = val;
    handlerInputChangeFn(val);
  };

  const labelTemplateName = ref('');
  const handlerInputChangeFn = async (code: string) => {
    changeLoading(true);
    const { data } = await GetCurrentDetailBySnOrDocNo({ code }).finally(() => {
      changeLoading(false);
    });
    setFieldsValue(data);
    // 获取最大的打印数量
    const totalNum = Math.floor(data.remainingQty / data.peQty);
    // 打印数量不能超过最大的打印数量
    updateSchema({
      field: 'printQty',
      componentProps: {
        max: totalNum,
      },
    });
    const res = await getAllPrintTemplate({});
    //  获取标签模板下拉数据
    updateSchema({
      field: 'labelTemplateId',
      componentProps: {
        options: res.data.map(item => {
          return {
            fullName: item.name,
            enCode: item.id,
          };
        }),
        fieldNames: { value: 'enCode' },
        onChange: (e, { fullName }) => {
          labelTemplateName.value = fullName;
          if (e) {
            updateSchema({
              field: 'printQty',
              componentProps: {
                disabled: false,
              },
            });
          }
        },
      },
    });
  };

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    const { printQty, packDate, labelTemplateId, remark } = values;
    changeOkLoading(true);
    const params = {
      labelTemplateId,
      labelTemplateName: labelTemplateName.value,
      printQty,
      packDate: dayjs(packDate).format('YYYY-MM-DD'),
      code: code.value,
      remark,
    };
    const { data } = await PrintApi(params).finally(() => {
      changeOkLoading(false);
    });
    getPrintTemplateDetail(labelTemplateId).then(res => {
      emit('reload');
      closeModal();
      if (designindexPrint.value && designindexPrint.value.clickTemplate) {
        designindexPrint.value.clickTemplate(res.data);
        designindexPrint.value.previewPrint(data);
      }
    });
  }
</script>

<style lang="less" scoped>
  :deep(.icon-ym-scanCode) {
    color: #ff7b00 !important;
  }
</style>
