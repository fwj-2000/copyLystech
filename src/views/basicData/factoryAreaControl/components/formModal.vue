<template>
  <BasicModal v-bind="$attrs" :title="getTitle" :draggable="true" :showOkBtn="hasBtnP('btn_edit')" @ok="handleSubmit" @register="registerModal">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { saveFactoryAreaControl } from '/@/api/basicData/factoryAreaControl';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { formSchema } from '../config';
  import { isNullOrUnDef } from '/@/utils/is';

  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';

  const { hasBtnP } = usePermission();

  interface State {
    dataForm: {
      id?: string;
      isCustomsAffairsEAP: 'true' | 'false' | '';
      factory: string;
    };
  }

  const state = reactive<State>({
    dataForm: {
      id: '',
      isCustomsAffairsEAP: '',
      factory: '',
    },
  });

  const getTitle = computed(() => (state.dataForm.id ? t('common.editText') : t('common.addText')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const [registerForm, { setFieldsValue, setProps, validate, resetFields }] = useForm({ labelWidth: '100%', schemas: formSchema, layout: 'vertical' });
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  async function init(data: any) {
    resetFields();
    state.dataForm.id = '';

    if (data.id) {
      setProps({
        disabled: !hasBtnP('btn_edit'),
      });
      const formData = { ...data };
      // 从布尔值转换字符串
      formData.isCustomsAffairsEAP = isNullOrUnDef(formData.isCustomsAffairsEAP) ? null : `${formData.isCustomsAffairsEAP}`;
      formData.isSendMoldApplyPr = isNullOrUnDef(formData.isSendMoldApplyPr) ? null : `${formData.isSendMoldApplyPr}`;
      formData.isSendMoldApplyPo = isNullOrUnDef(formData.isSendMoldApplyPo) ? null : `${formData.isSendMoldApplyPo}`;
      formData.factory = formData.factory.split('/')[0];
      setFieldsValue(formData);
      state.dataForm = formData;
    } else {
      setProps({
        disabled: !hasBtnP('btn_add'),
      });
    }
  }

  function getBooleanValue(v: 'true' | 'false' | boolean | undefined | null) {
    if (typeof v === 'boolean') {
      return v;
    }
    if (typeof v === 'string') {
      return v === 'true';
    }
    return undefined;
  }

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    const query = {
      id: state.dataForm.id,
      // 从字符串转换为布尔值
      isCustomsAffairsEAP: getBooleanValue(values.isCustomsAffairsEAP),
      isSendMoldApplyPr: getBooleanValue(values.isSendMoldApplyPr),
      isSendMoldApplyPo: getBooleanValue(values.isSendMoldApplyPo),
      moldApplyPriceControl: values.moldApplyPriceControl,
      designEngineeringWorkNoPrefix: values.designEngineeringWorkNoPrefix,
      factory: values.factory,
    };

    changeOkLoading(true);
    return saveFactoryAreaControl(query)
      .then(res => {
        createMessage.success(res.msg);
        closeModal(); //关闭弹窗
        emit('reload');
      })
      .catch(() => {})
      .finally(() => {
        changeOkLoading(false);
      });
  }
</script>
