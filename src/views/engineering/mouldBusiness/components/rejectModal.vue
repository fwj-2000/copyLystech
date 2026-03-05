<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :width="500" :height="300" @ok="handleSubmit" destroyOnClose class="lydc-condition-modal">
    <template #title>
      <Subtitle :title="title" style="padding-bottom: 0" />
    </template>
    <div>
      <a-textarea v-model:value="values" :placeholder="t('common.reasonInput')" rows="8" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, unref, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Subtitle } from '/@/components/Subtitle';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
  let rejectApi: Function = () => {};
  const { createMessage } = useMessage();
  const emit = defineEmits(['register', 'reload']);
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);
  const state = reactive<{ ids: Array<string> }>({
    ids: [],
  });
  const values = ref();
  const title = ref(t('common.rejectText'));

  function init(data: { ids: Array<string>; rejectApi: Function; title?: string }) {
    state.ids = data.ids;
    rejectApi = data.rejectApi;
    title.value = data.title || t('common.rejectText');
    values.value = '';
  }
  async function handleSubmit() {
    if (!values.value) {
      return createMessage.warning(t('common.reasonInput'));
    }
    try {
      changeOkLoading(true);
      changeLoading(true);
      const { code, msg } = await rejectApi({ ids: state.ids, reason: unref(values) });
      if (code === 200) {
        emit('reload', unref(values));
        createMessage.success(msg);
        closeModal();
      } else {
        createMessage.error(msg);
      }
    } finally {
      changeLoading(false);
      changeOkLoading(false);
    }
  }
</script>
