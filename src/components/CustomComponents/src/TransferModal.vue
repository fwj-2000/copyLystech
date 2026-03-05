<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :minHeight="300" :title="state.title" showOkBtn @ok="handleSubmit" destroy-on-close>
    <div>
      <div class="mb-8px">{{ state.labelText }}</div>
      <lydc-custom-user-select class="w-full" :placeholder="t('common.chooseText')" :allowClear="true" @change="handleSelect" show-search>
      </lydc-custom-user-select>
    </div>
    <div class="mt-16px" v-if="state.hasRemark">
      <div class="mb-8px">{{ t('common.remark') }}</div>
      <a-textarea :showCount="true" v-model:value.trim="state.remark" :placeholder="t('common.inputText')" :maxlength="200" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';

  const id = ref('');
  const { t } = useI18n();
  const state = reactive<{
    remark: string;
    transferUser: string;
    submitCallback: null | CallableFunction;
    transferUserInfo: any;
    title: string;
    labelText: string;
    hasRemark: boolean;
    beforeFetch: null | CallableFunction;
    api: null | CallableFunction;
    afterFetch: null | CallableFunction;
  }>({
    remark: '',
    transferUser: '',
    submitCallback: null,
    transferUserInfo: null,
    title: '',
    labelText: t('common.transferPerson'),
    hasRemark: true,
    beforeFetch: null,
    api: null,
    afterFetch: null,
  });
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init(data) {
    changeLoading(true);
    setTimeout(() => {
      id.value = data.id;
      state.transferUser = '';
      state.remark = '';
      state.hasRemark = data.hasRemark === false ? false : true;
      state.title = data?.title || t('common.transfer');
      state.labelText = data?.labelText || t('common.transferPerson');
      state.submitCallback = data.submitCallback;
      state.beforeFetch = data.beforeFetch;
      state.api = data.api;
      state.afterFetch = data.afterFetch;
      changeLoading(false);
    });
  }

  // 选择后，存入人员id
  const handleSelect = (e, data) => {
    state.transferUser = e;
    state.transferUserInfo = data;
  };

  // 通过api去调用
  async function handleSubmitByApi() {
    try {
      if (!state.transferUser) {
        changeOkLoading(false);
        return createMessage.warning(t('common.selectPlaceholder', [t('common.transferPerson')]));
      }
      let params = {
        id: id.value,
        remark: state.remark,
        transferUser: state.transferUser,
        transferUserInfo: state.transferUserInfo,
      };
      if (state.beforeFetch) {
        params = state.beforeFetch(params);
      }
      const r = await state?.api(params);
      if (r.code !== 200) return createMessage.warning(r.msg || t('sys.api.operationFailed'));
      changeOkLoading(false);
      emit('reload');
      closeModal();
    } catch (e) {
      return changeOkLoading(false);
    }
  }

  // 通过submitCallback去调用
  async function handleSubmitBySubmitCb() {
    try {
      if (!state.transferUser) {
        changeOkLoading(false);
        return createMessage.warning(t('common.selectPlaceholder', [t('common.transferPerson')]));
      }
      const r = await state?.submitCallback({
        id: id.value,
        remark: state.remark,
        transferUser: state.transferUser,
        transferUserInfo: state.transferUserInfo,
      });
      if (r.code !== 200) return createMessage.warning(r.msg || t('sys.api.operationFailed'));
      createMessage.success(t('sys.api.operationSuccess'));
      changeOkLoading(false);
      closeModal();
      return emit('reload');
    } catch (e) {
      return changeOkLoading(false);
    }
  }

  // 提交数据
  async function handleSubmit() {
    changeOkLoading(true);
    // 适配其他组件风格，当有api和beforeFetch时，不使用submitCallback
    if (state.api) {
      handleSubmitByApi();
    } else if (state.submitCallback) {
      // 兼容旧版
      handleSubmitBySubmitCb();
    } else {
      console.error('缺失api/submitCallback');
    }
  }
</script>
