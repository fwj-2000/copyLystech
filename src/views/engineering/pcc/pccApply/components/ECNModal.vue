<template>
  <BasicModal v-bind="$attrs" :closable="false" @register="registerModal" canFullscreen draggable title="提示" destroy-on-close>
    要发起ECN内容吗?
    <template #footer>
      <a-button key="back" @click="handleNoInit">不发起 </a-button>
      <a-button key="back" @click="handleWaitInit" type="primary" ghost>待发起 </a-button>
      <a-button key="submit" type="primary" @click="handleInit">立即发起 </a-button>
    </template>
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModal, useModalInner } from '/@/components/Modal';
  import { BasicColumn, useTable } from '/@/components/Table';
  import { reactive, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { canMakeECN, getPccTomake } from '/@/api/engineering/pcc';
  import { useRouter } from 'vue-router';

  const filePreviewRef = ref<any | null>(null);
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const { hasBtnP } = usePermission();
  const emit = defineEmits(['submit', 'register', 'openAttachUpload', 'close']);

  const router = useRouter();

  const state = reactive({
    id: '',
  });

  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init(data) {
    console.log('init');
    state.id = data.id;
  }

  function handleNoInit() {
    changeOkLoading(true);
    // 不发起
    canMakeECN({
      id: state.id,
      can: false,
    })
      .then(({ code, msg }) => {
        if (code === 200) {
          closeModal();
          emit('close');
        }
      })
      .finally(() => {
        changeOkLoading(false);
      });
  }

  function handleWaitInit() {
    changeOkLoading(true);
    // 待发起
    canMakeECN({
      id: state.id,
      can: true,
    })
      .then(({ code, msg }) => {
        if (code === 200) {
          createMessage.success(msg);
          closeModal();
          emit('close');
        }
      })
      .finally(() => {
        changeOkLoading(false);
      });
  }

  function handleInit() {
    // go(`/engineering/ecn/initChnage?id=${state.id}`);
    changeOkLoading(true);
    // 发起
    canMakeECN({
      id: state.id,
      can: true,
    })
      .then(({ code, msg }) => {
        if (code === 200) {
          createMessage.success(msg);
          closeModal();
          emit('close');
          // 跳转到发起页面
          router.push({
            path: `/engineering/ecn/initChnage`,
          });
        }
      })
      .finally(() => {
        changeOkLoading(false);
      });
  }

  // function handleSubmit() {
  //   const rows = getSelectRows();
  //   emit("submit", rows);
  // }
</script>
