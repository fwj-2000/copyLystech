<template>
  <BasicModal v-bind="$attrs" :width="1200" @register="registerModal" title="选择项目团队" :draggable="true" showOkBtn @ok="handleSave">
    <div class="p-3">
      <groupItem ref="groupItemRef" updateType="listView" @ok="closeModal" :reload="state.reload"></groupItem>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import groupItem from './groupItem.vue';

  const { t } = useI18n();
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  const emits = defineEmits(['register', 'reload']);

  interface State {
    title: string;
    updateType: string;
    mainProcess: string;
    ids: string[];
    reload: number;
  }
  const state = reactive<State>({
    title: '',
    updateType: '',
    mainProcess: '',
    ids: [],
    reload: 0,
  });

  function init(data) {
    changeLoading(true);
    state.ids = data.ids || [];
    state.updateType = data.updateType;
    state.reload++;

    changeLoading(false);
  }

  const groupItemRef = ref();
  const handleSave = () => {
    changeOkLoading(true);
    const d = groupItemRef.value.getSelectGroup();
    if (d) {
      emits('reload', d);
      closeModal();
    }
    changeOkLoading(false);
  };
</script>
