<template>
  <BasicPopup v-bind="$attrs" @register="registerPopup" :showCancelBtn="false" :title="title" destroyOnClose class="full-popup p-10px">
    <DieCutPerPrint ref="dieCutPerPrint" />
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, toRefs } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import DieCutPerPrint from '../../dieCutPerPrint/index.vue';

  const emits = defineEmits(['register', 'refresh']);
  const [registerPopup] = usePopupInner(init);

  interface State {
    title: string;
  }

  const state = reactive<State>({
    title: '',
  });

  const { title } = toRefs(state);

  function init(data) {
    state.title = data?.title;
  }
</script>
