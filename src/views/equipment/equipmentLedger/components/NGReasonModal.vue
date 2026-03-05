<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('dict.EquipmentLedgerColumn.NGReasonAnalysis')" showOkBtn @ok="handleSubmit" :width="800">
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { onMounted, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicForm, useForm } from '/@/components/Form';
  import { equipmentledgerCommitapply } from '/@/api/equipment/equipmentLedger';
  import { useBaseStore } from '/@/store/modules/base';

  const emit = defineEmits(['register', 'reload']);
  const { t } = useI18n();
  const baseStore = useBaseStore();

  const state = reactive({
    factoryArea: '',
    currentYear: '',
    currentWeek: '',
  });

  const [registerForm, { validate, setFieldsValue, resetFields, getFieldsValue }] = useForm({
    labelWidth: 180,
    baseColProps: { span: 12 },
    schemas: [
      {
        field: 'ng1Reason',
        label: '有账无物（NG1）',
        i18nField: 'NG1',
        component: 'Textarea',
        required: true,
        componentProps: {
          placeholder: '请输入',
        },
      },
      {
        field: 'ng2Reason',
        label: '有物无账（NG2）',
        i18nField: 'NG2',
        component: 'Textarea',
        required: true,
        componentProps: {
          placeholder: '请输入',
        },
      },
      {
        field: 'cleanedReasonS',
        label: '已被清理',
        i18nField: 'cleaned',
        required: true,
        component: 'ApiSelect',
        componentProps: {
          api: () => baseStore.getDictionaryData('cleanReason'),
          labelField: 'fullName',
          valueField: 'enCode',
          showSearch: true,
          filterOption: false,
          mode: 'multiple',
        },
      },
      {
        field: 'processingReason',
        label: '在建工程',
        i18nField: 'processing',
        component: 'Textarea',
        required: true,
        componentProps: {
          placeholder: '请输入',
        },
      },
      {
        field: 'remark',
        label: '备注',
        component: 'Textarea',
        componentProps: {
          placeholder: '请输入',
        },
        //colProps: { span: 24 },
      },
    ],
    layout: 'vertical',
    i18nConfig: {
      moduleCode: 'EquipmentLedgerColumn',
      transferRange: ['label', 'placeholder'],
    },
  });

  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  function init(data) {
    resetFields();
    state.factoryArea = data.factoryArea;
    state.currentYear = data.currentYear;
    state.currentWeek = data.currentWeek;
  }

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const formValue = getFieldsValue();
    const { code } = await equipmentledgerCommitapply({
      factoryArea: state.factoryArea,
      currentYear: state.currentYear,
      currentWeek: state.currentWeek,
      ...formValue,
      cleanedReason: formValue.cleanedReasonS.join(','),
    }).finally(() => {
      changeOkLoading(false);
      closeModal(); //关闭弹窗
    });
    if (code === 200) {
      closeModal(); //关闭弹窗
      emit('reload');
    }
  }

  onMounted(() => {});
</script>
