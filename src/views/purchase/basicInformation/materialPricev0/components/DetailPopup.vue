<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    @ok="handleSaveAction"
    :showOkBtn="hasBtnP('btn_edit')"
    :okText="sign === 'view' ? '编辑' : '保存'"
    destroyOnClose
    cancelText="取消"
    title="材料价格申请"
    class="full-popup p-10px top-0">
    <ScrollContainer>
      <View :currentData="currentData" :sign="sign" ref="viewRef" />
    </ScrollContainer>
  </BasicPopup>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { ScrollContainer } from '/@/components/Container';
  import { reactive, toRefs, ref } from 'vue';
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  // import Edit from './Edit.vue';
  import View from './View.vue';
  import { cloneDeep } from 'lodash-es';
  import { updatePurchaseQuotation } from '/@/api/finance/materialPrice';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';

  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const { hasBtnP } = usePermission();

  interface State {
    cacheList: any[];
    currentData: any;
    sign: 'view' | 'edit';
  }
  const state = reactive<State>({
    cacheList: [],
    currentData: {},
    sign: 'view',
  });
  const { sign, currentData } = toRefs(state);
  const viewRef = ref(null);

  async function init(data) {
    changeLoading(true);
    state.sign = 'view';
    initData(data);
    setTimeout(() => {
      changeLoading(false);
    }, 100);
  }

  function initData(data) {
    viewRef.value.setCurrentData(data);
    state.currentData = cloneDeep(data);
  }

  async function handleSaveAction() {
    if (state.sign === 'view') {
      state.sign = 'edit';
      return;
    }
    const params = await viewRef.value.getCurrencyFields();
    const { code, msg } = await updatePurchaseQuotation(params);
    if (code === 200) {
      createMessage.success(msg);
      emit('reload');
      closePopup();
    }
  }
</script>
