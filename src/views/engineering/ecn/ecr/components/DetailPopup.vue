<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    :showCancelBtn="true"
    :title="t('common.reviewText')"
    destroyOnClose
    class="full-popup pb-10px">
    <template #centerToolbar>
      <a-space :size="10">
        <a-button v-auth="'btn_edit'" v-if="mode === 'edit'" class="ml-12px" @click="handleSubmit('save')" type="primary" ghost>{{
          t('common.temporarySave')
        }}</a-button>
        <a-button v-auth="'btn_edit'" class="mr-12px" @click="handleSubmit('commit')" type="primary">{{ t('dict.Flow.NodeAction.1') }} </a-button>
      </a-space>
    </template>
    <ScrollContainer class="scroll-container" ref="mainScroll">
      <EcnApply ref="ecnApplyRef" />
    </ScrollContainer>
  </BasicPopup>
</template>

<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { ScrollContainer } from '/@/components/Container';
  import { reactive, ref, toRefs } from 'vue';
  import EcnApply from './EcnApply.vue';
  // 引入滚动容器组件
  import { addEcr, getEcrDetail, updateEcr } from '/@/api/engineering/ecn';
  // 引入reactive、ref、toRefs方法
  import { useMessage } from '/@/hooks/web/useMessage';
  // 引入EcnApply组件
  import { isFunction } from '/@/utils/is';
  // 引入添加Ecr、获取Ecr详情、更新Ecr的接口
  import { useI18n } from '/@/hooks/web/useI18n';
  // 引入消息提示的方法

  const emit = defineEmits(['reload', 'register']);
  const { t } = useI18n();

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  const ecnApplyRef = ref(null);
  const mainScroll = ref(null);
  const { createMessage } = useMessage();

  const state = reactive({
    mode: '',
    cacheList: [],
    index: 0,
    detailData: {},
  });

  const { mode } = toRefs(state);

  function init(data) {
    changeLoading(true);
    const { cacheList, index } = data;
    state.mode = data.mode;

    if (cacheList[index]) {
      // 详情
      getEcrDetail(cacheList[index]).then(({ code, data: ret }) => {
        if (code === 200) {
          console.log(ret);
          state.detailData = ret;
          ecnApplyRef.value.init({
            ...ret,
            ...data,
          });
          changeLoading(false);
        }
      });
    } else {
      // 新增
      ecnApplyRef.value.init({
        ...data,
        index: -1,
      });
      state.detailData = {};
      setTimeout(() => {
        changeLoading(false);
      });
    }
  }

  function handleSubmit(type: 'save' | 'commit') {
    changeLoading(true);
    let func;

    const data = ecnApplyRef.value.submit();
    if (isFunction(data)) return changeLoading(false);
    if (type === 'commit') {
      data.saveAndCommit = true;
    }
    if (state.detailData.id) {
      func = updateEcr;
      data.id = state.detailData.id;
    } else {
      func = addEcr;
    }
    func(data)
      .then(({ code, msg, data }) => {
        if (code === 200) {
          emit('reload');
          closePopup();
          createMessage.success(msg);
        }
      })
      .finally(() => {
        changeLoading(false);
      });
  }
</script>
<style lang="less" scoped>
  .main-nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    background: rgb(255 255 255 / 80%);
    border-bottom: 1px solid #dbdbdb;

    .nav-item {
      display: flex;
      padding: 8px 16px;
      flex-direction: column;
      align-items: center;
      gap: -3px;
      color: #666;
      cursor: pointer;
    }

    .active {
      border-bottom: 1px solid #ff7b00;
      color: #1a1a1a;
      transition: all 0.3s;
    }
  }

  //.scroll-container {
  //  padding-bottom: 60px;
  //}
</style>
