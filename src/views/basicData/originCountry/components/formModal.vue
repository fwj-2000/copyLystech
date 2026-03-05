<template>
  <BasicModal v-bind="$attrs" :title="getTitle" :draggable="true" :showOkBtn="hasBtnP('btn_edit')" @ok="handleSubmit" @register="registerModal">
    <BasicForm @register="registerForm">
      <template #orgId>
        <LydcOrganizeSelect :disabled="!hasBtnP('btn_edit')" v-model:value="organizeIdTree" placeholder="请选择" @change="onOrganizeChange" />
      </template>
    </BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
  import type { OrigincountryItem } from '/@/api/basicData/originCountry';

  import { computed, reactive, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addOrigincountry, updateOrigincountry } from '/@/api/basicData/originCountry';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { formSchema, STATUS_ENUM } from '../config';

  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';

  const { hasBtnP } = usePermission();

  interface State {
    dataForm: any;
  }

  const state = reactive<State>({
    dataForm: {},
  });

  const getTitle = computed(() => (state.dataForm.id ? t('common.editText') : t('common.addText')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const [registerForm, { setFieldsValue, setProps, validate, resetFields, clearValidate }] = useForm({ labelWidth: 100, schemas: formSchema });
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  async function init(data: OrigincountryItem) {
    resetFields();
    if (data.id) {
      setProps({
        disabled: !hasBtnP('btn_edit'),
      });
      data.status = (data.status ? data.status : STATUS_ENUM.启用).toString() as `${STATUS_ENUM}`;
      setFieldsValue(data);
      organizeIdTree.value = [data.orgId || ''];
      state.dataForm = data;
    } else {
      setProps({
        disabled: !hasBtnP('btn_add'),
      });
      organizeIdTree.value = [];
      setFieldsValue({ status: STATUS_ENUM.启用 });
      state.dataForm = { status: STATUS_ENUM.启用 };
    }
  }
  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      id: state.dataForm.id,
    };

    const api = query.id ? updateOrigincountry : addOrigincountry;

    api(query)
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

  const organizeIdTree = ref<string[]>([]);
  function onOrganizeChange(val: any) {
    setFieldsValue({ orgId: !val || !val.length ? '' : val[val.length - 1] });
    if (!val || !val.length) return;
    clearValidate('orgId');
  }
</script>
