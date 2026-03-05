<template>
  <a-modal v-model:open="visible" :ok-text="t('common.confirm')" :cancel-text="t('common.cancelText')" :width="800" class="modal-wrapper">
    <template #title>
      <div class="title-box">
        <TitleStick />
        <div class="modal-title">{{ t('dict.DrawingsReviewColumn.addQuestion') }}</div>
      </div>
    </template>
    <div class="top-bar">
      <div class="qus">
        <span>{{ t('dict.DrawingsReviewColumn.issue') }}:</span>
        <a-select
          class="ipt"
          v-model:value="issueType"
          :options="questionOps"
          :fieldNames="{ label: 'fullName', value: 'enCode' }"
          :placeholder="t('dict.DrawingsReviewColumn.issue')" />
      </div>
      <a-button class="advance" @click="handleAdvance"
        >{{ hasAdvance ? t('common.delText') : t('common.add1Text') }} {{ t('dict.DrawingsReviewColumn.scenario') }}
      </a-button>
    </div>
    <!--    :height="beforeEPM ? 560 : 260"-->
    <div class="editor-wrap">
      <LydcTinymceEditor
        v-model:value="text"
        :height="200"
        :placeholder="isEPM ? t('dict.DrawingsReviewColumn.customerReply') : t('dict.DrawingsReviewColumn.problemDescription')"
        :toolbar="toolbar"
        :plugins="plugins"
        :showImageUpload="false"
        :options="{
          paste_data_images: false,
        }"></LydcTinymceEditor>
      <BasicUpload :maxSize="20" :maxNumber="10" @change="handleChange" :api="uploadDrawingReviewImg" class="my-5" :accept="['image/*']" />
    </div>
    <div v-if="!beforeEPM" v-html="qusAdvance" :class="!beforeEPM ? 'qus-advance epm' : 'qus-advance'" style="overflow-y: scroll"></div>

    <template #footer>
      <div class="footer-wrap" :style="sign === 'edit' ? 'justify-content: space-between;' : 'justify-content: end;'">
        <div v-if="sign === 'edit'" class="footer-left">
          <a-button preIcon="icon-ym icon-ym-left" @click="changeCurrent('pre')"></a-button>
          <div class="state-box">
            <span>{{ currentIndex + 1 }}</span>
            / {{ total }}
          </div>
          <a-button preIcon="icon-ym icon-ym-right" @click="changeCurrent('next')"></a-button>
        </div>
        <div class="footer-btns">
          <a-button key="back" @click="visible = false">{{ t('common.cancelText') }}</a-button>
          <a-button v-if="beforeEPM && currentData.status != 3" key="submit" type="primary" @click="handleConfirm">{{ t('common.confirm') }}</a-button>
        </div>
      </div>
    </template>
  </a-modal>
</template>
<script setup lang="ts">
  import TitleStick from '/@/views/basicData/encodingSettings/components/titleLeftStick.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { computed, reactive, ref, toRefs, unref } from 'vue';
  import { BasicUpload } from '/@/components/Upload';
  import { message } from 'ant-design-vue';
  import { useBaseStore } from '/@/store/modules/base';
  import { postDrawingsReviewContent, postDrawingsReviewCustomerReply, putDrawingsReviewContent } from '/@/api/engineering/drawingReview';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { uploadDrawingReviewImg } from '/@/api/sys/upload';

  const { t } = useI18n();
  const baseStore = useBaseStore();
  const toolbar = ['bold italic underline code codesample bullist numlist media'];
  const plugins = [''];

  const emit = defineEmits(['reload']);
  const { createMessage } = useMessage();

  type typeOps = {
    enCode: string;
    fullName: string;
  };

  interface State {
    text: string;
    hasAdvance: boolean;
    currentIndex: number;
    total: number;
    sign: 'add' | 'edit' | '';
    currentData: any;
    baseData: any;
    questionOps: typeOps[];
    issueType: string;
    qusAdvance: string;
  }

  const state = reactive<State>({
    text: '',
    hasAdvance: false,
    currentIndex: 1,
    total: 3,
    sign: '',
    baseData: {},
    currentData: {},
    questionOps: [],
    issueType: '1',
    qusAdvance: '',
  });
  const { text, hasAdvance, currentIndex, total, sign, questionOps, issueType, qusAdvance, currentData } = toRefs(state);

  const visible = ref<boolean>(false);
  const isEPM = computed(() => state.baseData?.reviewNodeName === t('dict.DrawingsReview.FlowNode.EPMReview'));

  const beforeEPM = computed(() => state?.baseData?.reviewNode == 'Engineering' || state.baseData?.reviewNode?.includes('PdLeaderCheck'));

  function initData(data, sign) {
    const { current, cacheList, index } = data;
    state.baseData = current;
    if (sign === 'add') return;
    state.cacheList = cacheList;
    state.currentIndex = index;
    state.currentData = cacheList[index];
    state.total = cacheList.length;
    const text = useAdditionRich(cacheList[index].issueDetail, cacheList[index].scenario);
    // 如果是EPM评审，只能新增客户回复
    if (!unref(beforeEPM)) {
      state.text = cacheList[index].customerReply;
      state.qusAdvance = text;
      return;
    }
    // if (current.reviewNodeName === 'EPM评审') {
    //   console.log(cacheList[index].customerReply)
    //   state.text = cacheList[index].customerReply
    //   state.qusAdvance = text;
    //   return
    // }
    state.text = text;
  }

  const setVisible = (e: boolean, data, sign) => {
    // 如果false直接隐藏
    if (!e) return (visible.value = e);
    getTypeOption();
    initData(data, sign);
    state.sign = sign;
    visible.value = e;
  };

  function handleChange(list: string[]) {
    // createMessage.success(`已上传文件${JSON.stringify(list)}`);
  }

  async function handleConfirm() {
    const { sign } = state;
    const { baseData: data } = state;

    console.log(state.currentData.status);

    return;
    // 判断是否有建议方案，如果没有，直接传入问题描述 issueDetail
    // 如果有，需要根据<hr />拆分成两部分传入 scenario
    const [, { scenario, issueDetail }] = useRichAdvance(state.text);
    const params = {
      ...data,
      issueType: state.issueType,
      issueDetail,
      scenario,
    };
    if (unref(isEPM)) {
      const issueRecover = {
        id: state.currentData.id,
        customerReply: state.text,
      };
      const { code, msg } = await postDrawingsReviewCustomerReply(issueRecover);
      if (code === 200) {
        message.success(msg);
        emit('reload');
        visible.value = false;
        return;
      }
    }
    if (sign === 'add') {
      const { code, msg, data: id } = await postDrawingsReviewContent(params);
      if (code === 200) {
        message.success(msg);
        emit('reload', { id });
        visible.value = false;
      }
    } else if (sign === 'edit') {
      params.id = state.currentData.id;
      const { code, msg } = await putDrawingsReviewContent(params);
      if (code === 200) {
        message.success(msg);
        emit('reload');
        visible.value = false;
      }
    }
  }

  function handleAdvance() {
    if (state.hasAdvance) {
      // 删除建议方案
      const [, { issueDetail }] = useRichAdvance(state.text);
      state.text = issueDetail;
      state.hasAdvance = false;
    } else {
      // 添加建议方案
      state.text = `
      ${state.text}
      <hr />
      <p>{{ t('dict.DrawingsReviewColumn.scenario') }}:</p>
      `;
      state.hasAdvance = true;
    }
  }

  interface AdvanceInfo {
    issueDetail: string;
    scenario: string;
  }

  type UseRichAdvanceResult = [boolean, AdvanceInfo];

  /**
   * 传入富文本，切割成两个部分
   * @param text
   */
  function useRichAdvance(text: string): UseRichAdvanceResult {
    const parts = text.split('<hr />');
    const hasAdvance = parts.length > 1;
    return [
      hasAdvance,
      {
        issueDetail: parts[0],
        scenario: parts.length > 1 ? parts[1] : '',
      },
    ];
  }

  /**
   * 拼装富文本
   * @param issueDetail
   * @param scenario
   */
  function useAdditionRich(issueDetail: string, scenario: string | null): string {
    if (!scenario) return issueDetail;
    return `${issueDetail}<hr /><p>{{ t('dict.DrawingsReviewColumn.scenario') }}:</p>${scenario}`;
  }

  async function getTypeOption() {
    const res = await baseStore.getDictionaryData('DrawingsReview.IssueType');
    state.questionOps = res;
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
      state.currentData = current;
      const text = useAdditionRich(current.issueDetail, current.scenario);
      if (!unref(beforeEPM)) {
        state.qusAdvance = text;
        state.text = current.customerReply;
      } else {
        state.text = text;
      }
      state.currentIndex = index + 1;
    }
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
    padding: 5px 15px;
  }

  .top-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 10px 10px 0;

    .qus {
      display: flex;
      flex-direction: row;
      align-items: center;

      span {
        flex: 1;
      }

      .ipt {
        flex: 8;
        margin-left: 10px;
        width: 280px;
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
    //justify-content: space-between;

    .footer-left {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }

  .qus-advance {
    overflow-y: scroll;
    height: 300px;
    padding: 5px 15px;
  }
</style>
