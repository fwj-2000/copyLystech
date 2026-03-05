<template>
  <a-modal v-model:open="visible" :ok-text="t('common.confirm')" :cancel-text="t('common.cancelText')" :width="800" class="modal-wrapper">
    <template #title>
      <div class="title-box">
        <TitleStick />
        <div class="modal-title">{{ t('dict.DrawingsReviewColumn.issue') }}</div>
      </div>
    </template>
    <div class="top-bar">
      <div class="qus">
        <span>{{ t('dict.DrawingsReviewColumn.issue') }}:</span>
        <div>{{ questionOps.find(item => item.enCode === currentData.issueType)?.fullName }}</div>
      </div>
      <div class="top-bar-time"
        ><p>{{ currentData.reviewUserName }}</p>
        {{ currentData.reviewDate ? dayjs(currentIndex.reviewDate).tz().format('YYYY-MM-DD HH:mm:ss') : '' }}
      </div>
    </div>

    <div class="editor-wrap" style="height: 500px; overflow-y: scroll">
      <div v-html="text"></div>
      <div v-if="!beforeEPM" v-html="qusAdvance" class="qus-advance" style="overflow-y: scroll"></div>
    </div>

    <template #footer>
      <div class="footer-wrap">
        <div class="footer-left">
          <a-button preIcon="icon-ym icon-ym-left" @click="changeCurrent('pre')"></a-button>
          <div class="state-box">
            <span>{{ currentIndex + 1 }}</span>
            / {{ total }}
          </div>
          <a-button preIcon="icon-ym icon-ym-right" @click="changeCurrent('next')"></a-button>
        </div>
        <div class="footer-btns">
          <a-button key="back" @click="visible = false">{{ t('common.cancelText') }}</a-button>
          <!-- <a-button key="submit" type="primary" @click="handleConfirm">确认</a-button> -->
        </div>
      </div>
    </template>
  </a-modal>
</template>
<script setup lang="ts">
  import TitleStick from '/@/views/basicData/encodingSettings/components/titleLeftStick.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { computed, reactive, ref, toRefs, unref } from 'vue';
  import { message } from 'ant-design-vue';
  import { useBaseStore } from '/@/store/modules/base';
  import dayjs from 'dayjs';

  const { t } = useI18n();
  const baseStore = useBaseStore();
  type typeOps = {
    enCode: string;
    fullName: string;
  };

  interface State {
    text: string;
    currentIndex: number;
    total: number;
    hasAdvance: boolean;
    questionOps: typeOps[];
    baseData: any;
    currentData: any;
    cacheList: any[];
    qusAdvance: string;
  }

  const state = reactive<State>({
    text: t('dict.DrawingsReviewColumn.problemDescription'),
    hasAdvance: false,
    currentIndex: 0,
    total: 3,
    questionOps: [],
    baseData: {},
    currentData: {},
    cacheList: [],
    qusAdvance: '',
  });
  const { text, currentIndex, total, qusAdvance, questionOps, currentData } = toRefs(state);
  const beforeEPM = computed(() => state?.baseData?.reviewNode == 'Engineering' || state.baseData?.reviewNode?.includes('PdLeaderCheck'));

  /**
   * 初始化数据
   * @param data
   */
  function initData(data) {
    const { current, cacheList, index } = data;
    state.cacheList = cacheList;
    state.baseData = current;
    state.currentIndex = index;
    state.currentData = cacheList[index];
    state.total = cacheList.length;
    const text = useAdditionRich(cacheList[index].issueDetail, cacheList[index].scenario);

    if (!unref(beforeEPM)) {
      state.text = cacheList[index].customerReply;
      state.qusAdvance = text;
      return;
    }
    state.text = text;
  }

  const visible = ref<boolean>(false);
  const setVisible = (e: boolean, data) => {
    if (!e) return (visible.value = e);
    initData(data);
    getTypeOption();
    visible.value = e;
  };

  function handleEditorChange(e, text) {
    // console.log(e);
  }

  function handleConfirm() {
    console.log(state.text);
    visible.value = false;
  }

  function useAdditionRich(issueDetail: string, scenario: string | null): string {
    if (!scenario) return issueDetail;
    return `${issueDetail}<hr /><p>{{ t('dict.DrawingsReviewColumn.scenario') }}:</p>${scenario}`;
  }

  /**
   *
   * @param type 'pre' | 'next'
   */
  function changeCurrent(type: 'pre' | 'next') {
    const index = unref(currentIndex);
    // 上一个
    if (type === 'pre') {
      if (index === 0) {
        return message.error(t('common.firstOneTip'));
      }
      const current = state.cacheList[index - 1];
      state.currentData = current;
      const text = useAdditionRich(current.issueDetail, current.scenario);
      if (!unref(beforeEPM)) {
        state.qusAdvance = text;
        state.text = current.customerReply;
      } else {
        state.text = text;
      }
      state.currentIndex = index - 1;
    }
    // 下一个
    if (type === 'next') {
      if (index === state.total - 1) {
        return message.error(t('common.lastOneTip'));
      }
      const current = state.cacheList[index + 1];
      const text = useAdditionRich(current.issueDetail, current.scenario);
      if (!unref(beforeEPM)) {
        state.qusAdvance = text;
        state.text = current.customerReply;
      } else {
        state.text = text;
      }
      state.currentData = current;
      state.currentIndex = index + 1;
    }
  }

  async function getTypeOption() {
    const res = await baseStore.getDictionaryData('DrawingsReview.IssueType');
    state.questionOps = res;
  }

  defineExpose({
    setVisible,
  });
</script>
<style scoped lang="less">
  .title-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 20px;

    .modal-title {
      color: #1a1a1a;

      /* 中文/标题16 */

      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: 24px; /* 150% */
    }
  }

  .editor-wrap {
    //padding: 5px;
    padding: 5px 36px;

    :deep(img) {
      display: inline-block;
      vertical-align: baseline;
    }

    :deep(p) {
      margin: 10px 0;
    }
  }

  .top-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 10px 36px 0;

    .top-bar-time {
      display: flex;
      flex-direction: row;
      color: #ccc;

      /* 中文/正文(注释)12 */

      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px; /* 166.667% */
      align-items: center;

      p {
        margin-right: 8px;
        color: #999;

        /* 中文/正文13 */

        font-size: 13px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px; /* 153.846% */
      }
    }

    .qus {
      display: flex;
      flex-direction: row;
      align-items: center;

      span {
        flex: 1;
        margin-right: 10px;
      }

      .ipt {
        flex: 3;
      }
    }
  }

  .toggle-current {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .state-box {
    margin: 0 10px;
  }

  .footer-wrap {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .footer-left {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
</style>
