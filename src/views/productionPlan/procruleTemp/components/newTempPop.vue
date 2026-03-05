<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :okText="t('common.submit')"
    :title="title"
    destroyOnClose
    @ok="handleSave($event, 1)"
    class="full-popup pb-10px">
    <TempInfo ref="tempInfoRef" />
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, onMounted, ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { saveProcrulesTempDetail } from '/@/api/basicData/processrulestemplate';
  import { useMessage } from '/@/hooks/web/useMessage';
  import TempInfo from './tempInfo.vue';
  const emits = defineEmits(['register', 'refresh']);
  const [registerPopup, { closePopup }] = usePopupInner(init);

  const { t } = useI18n();
  const { createMessage } = useMessage();

  interface State {
    title: string;
    id: string;
    type: string;
  }

  const state = reactive<State>({
    title: '',
    id: '',
    type: '',
  });

  const tempInfoRef = ref();

  const { title } = toRefs(state);

  function init(data) {
    state.title = data?.title;
    state.id = data?.id || '';
    state.type = data?.type;
    tempInfoRef.value.init(data);
  }

  async function handleSave(e, val) {
    if (state.type === 'copy') {
      state.id = '';
    }
    const params = await tempInfoRef.value.getParams();
    saveProcrulesTempDetail(state.id ? { id: state.id, ...params } : params)
      .then(res => {
        createMessage.success(res?.msg || '保存成功');
        closePopup();
        emits('refresh');
      })
      .catch(err => {
        console.log(err, 'err');
      });
  }
</script>

<style lang="less" scoped>
  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }
</style>
