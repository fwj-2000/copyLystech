<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    :showCancelBtn="true"
    :cancelButtonProps="{ class: 'my-12px' }"
    :title="state.title"
    :okText="t('common.submitText')"
    :okButtonProps="{ class: 'mr-12px' }"
    destroyOnClose
    class="full-popup">
    <template #centerToolbar>
      <BasicPopPage :config="state" @change="handleChangePage"></BasicPopPage>
      <span v-if="editStatus">
        <a-button type="primary" ghost v-auth="'btn_reject'" @click="handleReject" class="ml-12px">{{ t('common.rejectText') }}</a-button>
        <a-button type="primary" v-auth="'btn_agree'" @click="handleAgree" class="mx-12px">{{ t('common.agree') }}</a-button>
        <UploadBtn v-if="state.dqeEditStatus" type="button" ref="uploadRef" @success="afterUpload" class="ml-12px"></UploadBtn>
      </span>
    </template>
    <ScrollContainer>
      <!-- 问题审核 -->
      <div class="pop-item">
        <subtitle :title="t('common.baseinfo')"></subtitle>
        <BasicForm @register="registerReviewForm"></BasicForm>
        <div class="pb-10px">
          <FileListInfo ref="fileListRef" :mode="state.dqeEditStatus ? 'edit' : 'view'"></FileListInfo>
        </div>
      </div>
      <div class="pop-item">
        <subtitle :title="t('common.baseinfo')"></subtitle>
        <BasicForm @register="registerForm"></BasicForm>
      </div>
      <div class="pop-item">
        <subtitle :title="t('common.metariaInfo')"></subtitle>
        <BasicForm @register="registerqsInfoForm"></BasicForm>
        <div class="pb-10px">
          <FileListInfo ref="imgListRef" mode="view"></FileListInfo>
        </div>
      </div>
    </ScrollContainer>
    <RejectModal @register="registerRejectModal" @reload="handleReload"></RejectModal>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { computed, reactive, nextTick, ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { handleForm, qsInfoForm, reviewForm } from './config';
  import { ScrollContainer } from '/@/components/Container';
  import { getQsDetail } from '/@/api/business/projectQs';
  import { bulkRejectQsAudit, agreeProblem } from '/@/api/business/projectQsAudit';
  import { Subtitle } from '/@/components/Subtitle';
  import { useModal } from '/@/components/Modal';
  import { RejectModal } from '/@/components/CustomComponents';
  import FileListInfo from '../Files/FileListInfo.vue';
  import { BasicPopPage } from '/@/components/Basic';
  import { UploadBtn } from '/@/components/Upload';
  import { useUserStore } from '/@/store/modules/user';

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const emits = defineEmits(['register', 'refresh']);
  const userStore = useUserStore();

  interface StateType {
    title: string;
    type: 'edit' | 'review' | 'view' | 'detailed';
    currentNode: string;
    id: string;
    fileList: any[];
    total: 0;
    currentIndex: 0;
    ids: [];
    dqeEditStatus: boolean;
  }

  // 是否可编辑
  const editStatus = computed(() => {
    return state.type != 'detailed';
  });
  const imgListRef = ref();
  const fileListRef = ref();
  const state = reactive<StateType>({
    title: '新增',
    type: 'view',
    currentNode: '',
    id: '',
    fileList: [],
    total: 0,
    currentIndex: 0,
    ids: [],
    dqeEditStatus: false, // DQE节点&可编辑
  });

  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const [registerForm, { setFieldsValue: setFieldsValueHandle, getFieldsValue: getFieldsValueHandle, validate: validateHandle, setProps: setPropsHandle }] =
    useForm(handleForm());
  const [
    registerReviewForm,
    { setFieldsValue: setFieldsValueReview, getFieldsValue: getFieldsValueReview, validate: validateReview, setProps: setPropsReview },
  ] = useForm(reviewForm());
  const [registerqsInfoForm, { setFieldsValue: setFieldsValueQsinfo, setProps: setPropsQsinfo }] = useForm(qsInfoForm());

  async function init(data) {
    state.type = data.mode || 'edit';
    state.title = data.title || t('common.detailText');
    state.id = data.id;
    if (data.ids) {
      state.ids = data.ids;
      state.id = data.ids[0];
      state.total = data.ids.length;
    }
    setPropsQsinfo({ disabled: true });
    setPropsHandle({ disabled: true });
    getDetail();
  }

  // 判断当前节点是否为DEQ
  function isDQE(data) {
    const currentNode = data.currentNode;
    return currentNode === 'DQEProblemReview';
  }
  // 处理DQE和编辑状态
  function handleDQE(data) {
    if (isDQE(data) && editStatus.value) {
      state.dqeEditStatus = true;
      setPropsReview({ disabled: false });
    } else {
      state.dqeEditStatus = false;
      setPropsReview({ disabled: true });
    }
  }

  async function getDetail() {
    try {
      changeLoading(true);
      const r = await getQsDetail([state.id]);
      const _d = r.data[0];
      state.id = _d.id;
      state.currentNode = _d.currentNode;
      setFieldsValueHandle(_d);
      setFieldsValueQsinfo(_d);
      setFieldsValueReview(_d);
      imgListRef.value?.init(_d.problemReleaseFiles || []);
      fileListRef.value?.init(_d.dqeProblemReviewFiles || []);
      handleDQE(_d);
      nextTick(() => {
        changeLoading(false);
      });
    } catch (error) {
      console.log(error);
      closePopup();
    }
  }

  // 数据上下切换
  function handleChangePage(type) {
    if (type == 'pre') {
      state.currentIndex--;
    } else {
      state.currentIndex++;
    }
    state.id = state.ids[state.currentIndex];
    getDetail();
  }
  const uploadRef = ref();
  // 拿到上传后的图片进行处理
  function afterUpload(fileList) {
    fileListRef.value?.handleAddFile(
      fileList.value.map(item => {
        return {
          ...item,
          creatorUserName: item.creatorUserName || userStore.getUserInfo.userName,
          creatorTime: item.createTime || Date.now(),
        };
      }),
    );
    uploadRef.value?.handleClear();
  }

  // 驳回
  function handleReject() {
    openRejectModal(true, {
      id: [state.id],
      api: bulkRejectQsAudit,
      beforeFetch: params => {
        return {
          ...params,
          ids: [state.id],
        };
      },
    });
  }

  // 审核
  async function handleAgree() {
    let params: any = {
      id: state.id,
    };
    // 判断当前节点
    if (isDQE(state)) {
      params = {
        ...params,
        ...getFieldsValueReview(),
        dqeProblemReviewFiles: fileListRef.value?.getFileList(),
      };
    }
    const res = await agreeProblem([params]);
    if (res.code == 200) {
      handleReload();
    }
  }

  // 重新加载
  function handleReload() {
    createMessage.success(t('sys.api.operationSuccess'));
    if (state.ids.length < 2) {
      closePopup();
      emits('refresh');
    } else {
      handleChangePage('next');
    }
  }
</script>
<style lang="less" scoped>
  .pop-item {
    border-bottom: 10px solid #f0f0f0;
    padding: 20px 20px 0;
  }
</style>
