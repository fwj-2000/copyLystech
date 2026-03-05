<template>
  <BasicModal
    :title="title"
    canFullscreen
    :draggable="true"
    v-bind="$attrs"
    :width="600"
    @register="registerModal"
    destroy-on-close
    :cancelText="t('common.closeText')"
    :showOkBtn="true"
    @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { OPERATION_TYPE_ENUM } from '../config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { changeMoldDrawingFileStatus } from '/@/api/engineering/moldDrawingLibrary';

  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicModal, useModalInner } from '/@/components/Modal';

  const props = defineProps({
    isShowVersion: {
      type: Boolean,
      default: false,
    },
  });

  const emits = defineEmits(['reload', 'register']);

  const [registerModal, { closeModal, changeOkLoading, changeLoading }] = useModalInner(initData);
  const { t } = useI18n();
  const { createMessage } = useMessage();

  const title = ref<string>(t('common.enableText'));
  const type = ref<OPERATION_TYPE_ENUM>(OPERATION_TYPE_ENUM.启用);
  const ids = ref<Array<string>>([]);

  const [registerForm, { resetFields, validate }] = useForm({
    layout: 'vertical',
    labelWidth: '100%',
    baseColProps: { span: 24 },
    schemas: [
      {
        required: true,
        field: 'reason',
        label: t('common.reasonText'),
        component: 'Textarea',
        componentProps: {
          allowClear: false,
          rows: 6,
          placeholder: t('common.reasonInput'),
        },
      },
    ],
  });

  function initData(data: { type: OPERATION_TYPE_ENUM; ids: Array<string> }) {
    type.value = data.type;
    title.value = getTitle(data.type);
    ids.value = data.ids;
    resetFields();
  }

  function getTitle(val: OPERATION_TYPE_ENUM) {
    if (val === OPERATION_TYPE_ENUM.禁用) {
      return t('common.disableText');
    } else if (val === OPERATION_TYPE_ENUM.废弃) {
      return t('common.discard');
    } else {
      return t('common.enableText');
    }
  }

  function setLoading(isLoading = false) {
    changeLoading(isLoading);
    changeOkLoading(isLoading);
  }

  async function handleSubmit() {
    const values = await validate();
    if (!values) return false;

    setLoading(true);
    changeMoldDrawingFileStatus({ drawingStatus: type.value, reason: values.reason, ids: ids.value })
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        closeModal();
        emits('reload');
      })
      .finally(() => {
        setLoading(false);
      });
  }
</script>
