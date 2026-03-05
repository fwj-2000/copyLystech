<template>
  <BasicPopup
    v-bind="$attrs"
    title="修改"
    @register="registerPopup"
    :showOkBtn="true"
    :okText="t('common.saveText')"
    destroyOnClose
    class="full-popup p-10px top-0"
    @ok="handleSave"
    @visible-change="handleVisibleChange">
    <div>
      <materia
        v-show="state.configType == 3"
        ref="metariaRef"
        @reload="handleVisibleChange"
        @error="handleError"
        type="update"
        :mainProcess="state.mainProcess"
        :updateType="state.updateType"
        :ids="state.ids"></materia>
      <customer
        v-show="state.configType == 2"
        ref="customerRef"
        @reload="handleVisibleChange"
        @error="handleError"
        type="update"
        :mainProcess="state.mainProcess"
        :updateType="state.updateType"
        :ids="state.ids"></customer>
      <innerCode
        v-show="state.configType == 1"
        ref="innerCodeRef"
        @reload="handleVisibleChange"
        @error="handleError"
        type="update"
        :mainProcess="state.mainProcess"
        :updateType="state.updateType"
        :ids="state.ids"></innerCode>
    </div>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, onMounted, ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import materia from './updateMember/materia.vue';
  import customer from './updateMember/customer.vue';
  import innerCode from './updateMember/innderCode.vue';

  import { useMemberStore } from '/@/store/modules/projectMember';
  const memberStore = useMemberStore();

  const emits = defineEmits(['register', 'reload']);

  interface State {
    updateType: string;
    mainProcess: string;
    configType: number;
    ids: string[];
  }

  const { t } = useI18n();
  const state = reactive<State>({
    updateType: '',
    mainProcess: '',
    configType: 3,
    ids: [],
  });

  const [registerPopup, { changeOkLoading, closePopup }] = usePopupInner(init);

  function init(data) {
    // 更新数据
    state.ids = data.ids;
    state.updateType = data.updateType;
    state.mainProcess = data.mainProcess;
    state.configType = memberStore.configType;
  }
  const handleVisibleChange = v => {
    if (!v) {
      emits('reload', state.updateType);
    }
    state.ids = [];
    closePopup();
  };

  function handleError() {
    changeOkLoading(false);
  }

  const metariaRef = ref();
  const customerRef = ref();
  const innerCodeRef = ref();

  const handleSave = () => {
    changeOkLoading(true);
    switch (memberStore.configType) {
      case 3:
        metariaRef.value.saveMateria();
        break;
      case 2:
        customerRef.value.handleSave();
        break;
      case 1:
        innerCodeRef.value.handleSave();
        break;
    }
  };
</script>
