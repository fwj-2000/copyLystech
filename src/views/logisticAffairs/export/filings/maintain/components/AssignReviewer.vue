<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :minHeight="200" :title="state.title" showOkBtn @ok="handleSubmit" destroy-on-close>
    <div>
      <div class="mb-8px">{{ state.labelText }}</div>
      <lydc-custom-user-select class="w-full" :placeholder="t('common.chooseText')" :allowClear="true" @change="handleSelect" show-search>
      </lydc-custom-user-select>
    </div>
    <div class="mt-16px">
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
  import { getTransferUserList } from '/@/api/basic/user';

  const id = ref('');
  const { t } = useI18n();
  const state = reactive<{
    remark: string;
    transferUser: string;
    userList: any[];
    submitCallback: null | CallableFunction;
    transferUserInfo: any;
    title: string;
    labelText: string;
  }>({
    remark: '',
    transferUser: '',
    userList: [],
    submitCallback: null,
    transferUserInfo: null,
    title: '',
    labelText: t('common.transferPerson'),
  });
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init(data) {
    changeLoading(true);
    changeOkLoading(false);
    setTimeout(() => {
      id.value = data.id;
      state.transferUser = '';
      state.remark = '';
      state.title = data?.title || t('common.transfer');
      state.labelText = data?.labelText || t('common.transferPerson');
      state.submitCallback = data.submitCallback;
      changeLoading(false);
    });
  }

  // 获取转办用户
  async function getUserList() {
    const r = await getTransferUserList();
    if (r.code == 200) {
      state.userList = r.data;
    }
  }
  await getUserList();

  // 选择后，存入人员id
  const handleSelect = (e, data) => {
    state.transferUser = e;
    state.transferUserInfo = data;
  };

  // 提交数据
  async function handleSubmit(e) {
    changeOkLoading(true);
    if (state.submitCallback) {
      const r = await state.submitCallback({
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
    }
    return createMessage.warning('缺失submitCallback参数');
  }
</script>
