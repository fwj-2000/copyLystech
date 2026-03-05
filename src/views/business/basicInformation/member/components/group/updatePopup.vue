<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :okText="t('common.saveText')"
    :title="title"
    destroyOnClose
    class="full-popup p-10px top-0"
    @ok="handleSave"
    @visible-change="handleVisibleChange">
    <div class="pt-20px">
      <groupItem ref="groupItemRef" @ok="closePopup" :reload="state.reload" @error="handleErr"></groupItem>
    </div>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, ref, toRefs } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import groupItem from './groupItem.vue';

  const emits = defineEmits(['register', 'reload']);

  interface State {
    title: string;
    updateType: string;
    mainProcess: string;
    ids: string[];
    reload: number;
  }

  const { t } = useI18n();
  const state = reactive<State>({
    title: '',
    updateType: '',
    mainProcess: '',
    ids: [],
    reload: 0,
  });

  const { title } = toRefs(state);

  const [registerPopup, { changeOkLoading, closePopup }] = usePopupInner(init);

  function init(data) {
    state.title = '项目成员团队维护';
    // 更新数据
    state.ids = data.ids || [];
    state.updateType = data.updateType;
    state.reload++;
  }
  const handleVisibleChange = v => {
    if (!v) {
      state.ids = [];
      emits('reload', state.updateType);
    }
  };

  const groupItemRef = ref();
  const handleSave = () => {
    changeOkLoading(true);
    groupItemRef.value.saveMateria();
  };

  function handleErr() {
    changeOkLoading(false);
  }
</script>
