<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :okText="t('common.saveText')"
    :title="title"
    destroyOnClose
    class="full-popup top-0"
    @ok="handleSave"
    @visible-change="handleVisibleChange">
    <groupItem
      ref="groupItemRef"
      :team-type="state.teamType"
      :main-process="state.mainProcess"
      @ok="closePopup"
      :reload="state.reload"
      @error="handleErr"></groupItem>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, ref, toRefs } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import groupItem from './GroupItem.vue';

  const emits = defineEmits(['register', 'reload']);

  interface State {
    title: string;
    updateType: string;
    mainProcess: string;
    ids: string[];
    reload: number;
    teamType: string; // 团队类型
  }

  const { t } = useI18n();
  const state = reactive<State>({
    title: t('common.maintianGroup'),
    updateType: '',
    mainProcess: '',
    ids: [],
    reload: 0,
    teamType: '1',
  });

  const { title } = toRefs(state);

  const [registerPopup, { changeOkLoading, closePopup }] = usePopupInner(init);

  function init(data) {
    // 更新数据
    state.ids = data.ids || [];
    state.updateType = data.updateType;
    state.teamType = data.teamType;
    state.reload++;
    state.mainProcess = data.mainProcess;
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
