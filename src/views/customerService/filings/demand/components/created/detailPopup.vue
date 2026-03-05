<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="isCanEdit"
    :showCancelBtn="true"
    :okText="t('common.submitText')"
    :cancelButtonProps="{ class: 'mr-12px' }"
    :title="t('views.filings.demand')"
    destroyOnClose
    @ok="handleSubmit"
    class="full-popup">
    <ScrollContainer class="p-10px">
      <Subtitle :title="t('common.applyInfo')" />
      <BasicForm @register="registerApplyInfoForm" />
    </ScrollContainer>
  </BasicPopup>
</template>

<script setup lang="ts">
  import { ref, nextTick } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getSchemas } from './detailPopupConfig';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { save, getDetail } from '/@/api/customerSerivce/customsAffairsApply';
  import { STATUS_ENUM } from './config';

  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { ScrollContainer } from '/@/components/Container';
  import { BasicForm, useForm } from '/@/components/Form';

  const { t } = useI18n();

  const emits = defineEmits(['reload']);
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const { createMessage } = useMessage();

  const isCanEdit = ref<boolean>(false);

  const state = ref<any>({});

  const [
    registerApplyInfoForm,
    {
      setFieldsValue: setApplyInfoFieldsValue,
      // getFieldsValue: getApplyInfoFieldsValue,
      setProps: setApplyProps,
      validate: validateApplyInfo,
    },
  ] = useForm({
    schemas: [],
    layout: 'vertical',
    labelWidth: 'unset',
    baseColProps: {
      span: 4,
    },
    disabled: !isCanEdit.value,
    i18nConfig: {
      moduleCode: 'CAApplyColumn',
      transferRange: ['label'],
    },
  });

  async function init(data: { id: string }) {
    // 状态数据记录
    state.value = data || {};

    nextTick(() => {
      setApplyProps({
        schemas: getSchemas(setApplyInfoFieldsValue),
      });
      getFormData(data.id);
    });
  }

  async function getFormData(id: string) {
    changeLoading(true);
    return getDetail(id)
      .then(res => {
        setApplyInfoFieldsValue(res?.data || {});
        isCanEdit.value = res?.data?.status === STATUS_ENUM.撤回;
        setApplyProps({
          disabled: !isCanEdit.value,
        });
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  async function handleSubmit() {
    const applyInfoData = await validateApplyInfo();

    changeLoading(true);
    return save([applyInfoData])
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        emits('reload');
        closePopup();
      })
      .catch(() => {})
      .finally(() => {
        changeLoading(false);
      });
  }
</script>
