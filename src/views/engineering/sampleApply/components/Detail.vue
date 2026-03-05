<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :okText="t('common.saveText')"
    :title="title"
    @ok="handleSave"
    :destroy-on-close="true"
    @open-change="handleVisibleChange"
    class="full-popup top-0">
    <template #insertToolbar>
      <div class="toggle-current flex" v-if="state.total > 1">
        <a-button preIcon="icon-ym icon-ym-left" @click="changeCurrent('pre')" :disabled="state.currentIndex < 1"></a-button>
        <div class="state-box m-2">
          <span>{{ state.currentIndex + 1 }}</span> / {{ state.total }}
        </div>
        <a-button preIcon="icon-ym icon-ym-right" @click="changeCurrent('next')" :disabled="state.currentIndex >= state.total - 1"></a-button>
        <a-divider type="vertical" class="ml-10px"></a-divider>
      </div>
    </template>
    <div class="popup-container">
      <div class="p-16px" style="width: 40%">
        <div class="title"><titleLeftStick></titleLeftStick>基础信息</div>
        <div v-for="(item, i) in dataConfig" :key="i" style="line-height: 1.8">
          <span style="color: #666">{{ item.title }}：</span>
          <!-- <span class="h">{{ state.base[item.dataIndex] || '--' }}</span> -->
          <span class="h">{{ state.base[item.dataIndex] == 0 ? 0 : toVal(item, state.base) }}</span>
        </div>
      </div>
      <a-divider type="vertical" class="ml-10px"></a-divider>
      <div class="p-16px" style="width: 100%; height: 100%; overflow: auto">
        <div class="title"> <titleLeftStick></titleLeftStick>回复详情 </div>
        <lydc-empty
          v-if="state.showEmpty"
          class="pt-30"
          style="filter: grayscale(0.5)"
          description="暂无回复"
          :image="Empty.PRESENTED_IMAGE_DEFAULT"></lydc-empty>
        <a-steps v-else direction="vertical" :current="current" size="small">
          <!-- 回复状态 -->
          <a-step status="wait">
            <template #icon>
              <div class="icon-wrap">
                <i class="icon-ym icon-ym-arrow-down"></i>
              </div>
            </template>
            <template #title>
              <div class="flex justify-between">
                <div>
                  <span class="h mr-3">{{ state.base.applyUserName }}</span>
                  <a-tag color="green">工程</a-tag>
                </div>
              </div>
            </template>
            <template #description>
              <div class="content">
                <a-form>
                  <a-form-item label="意见">
                    <lydcSelect v-model:value="state.submit.opinion" :options="state.replayList"></lydcSelect>
                  </a-form-item>
                  <a-form-item label="备注">
                    <a-textarea v-model:value="state.submit.remark" :col="1" :row="1" :max="200" :placeholder="t('common.inputText') + '...'"></a-textarea>
                  </a-form-item>
                </a-form>
              </div>
            </template>
          </a-step>
          <!-- 回复记录 -->
          <a-step status="wait" v-for="replyItem in state.base.sampleApplyReplyRecordOutputs" :key="replyItem.id">
            <template #icon>
              <div class="icon-wrap">
                <i class="icon-ym icon-ym-arrow-down"></i>
              </div>
            </template>
            <template #title>
              <div class="flex justify-between">
                <div class="flex-1">
                  <span class="h mr-3"> {{ replyItem.sendUserName }} </span>
                  <a-tag :color="replyItem.replyType == 2 ? 'orange' : 'green'">{{ replyItem.replyTypeDesc }}</a-tag>
                </div>
                <div class="desc"> {{ replyItem.lastModifyDateTime }}</div>
              </div>
            </template>
            <template #description>
              <div class="content">
                <div v-if="replyItem.replyType == 2">
                  <span v-for="(item, i) in purchaseConfig" :key="i" class="mr-10">
                    <span class="h">{{ item.title }}：</span>
                    <span class="desc">{{ replyItem[item.dataIndex] || '--' }}{{ item.sign }}{{ replyItem[item?.extra] }}</span>
                  </span>
                </div>
                <div v-else>
                  <span class="h">意见：</span>
                  <span class="desc">{{ replyItem.opinionDesc || '--' }}</span>
                </div>
                <div>
                  <span class="h">备注：</span>
                  <span class="desc">{{ replyItem['remark'] || '--' }}</span>
                </div>
              </div>
            </template>
          </a-step>
        </a-steps>
      </div>
    </div>
  </BasicPopup>
</template>
<script setup lang="ts">
  import { computed, reactive, ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { dataConfig, purchaseConfig } from './config';
  import { Empty, message } from 'ant-design-vue';
  import titleLeftStick from '/@/views/basicData/encodingSettings/components/titleLeftStick.vue';
  import { getDetailById, replayStorage } from '/@/api/engineering/sample';
  import { toVal } from '/@/utils/baseinfo';

  const current = ref<number>(3);

  interface StateType {
    total: number;
    currentIndex: number;
    current: any;
    continueChecked: boolean;
    type: 'add' | 'edit' | 'view';
    id: string;
    ids: any[];
    base: any;
    replayList: any[];
    submit: {
      remark: string;
      opinion: any;
    };
    showEmpty: boolean;
  }
  const state = reactive<StateType>({
    total: 0,
    currentIndex: 0,
    current: {},
    continueChecked: true,
    type: 'edit',
    id: '',
    ids: [],
    base: {},
    replayList: [
      {
        id: 1,
        fullName: '满足',
      },
      {
        id: 2,
        fullName: '不满足',
      },
      {
        id: 3,
        fullName: '结束',
      },
    ],
    submit: {
      remark: '',
      opinion: 1,
    },
    showEmpty: true,
  });
  const { t } = useI18n();

  const title = computed(() => (state.base.insidePartNumber || '') + '(内部料号)-回复');
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  async function init(data) {
    changeLoading(true);
    state.id = data.id;
    state.ids = data.ids || [];
    if (data.ids) {
      state.total = data.ids.length;
      state.currentIndex = data.index || 0;
      state.id = data.ids[data.index];
    }
    state.submit = {
      opinion: 1,
      remark: '',
    };
    getDetail();
    changeLoading(false);
  }

  async function getDetail() {
    changeLoading(true);
    const { id } = state;
    const r = await getDetailById(id);
    if (r.code == 200) {
      state.base = r.data;
      const { sampleApplyReplyRecordOutputs, sampleApplyReplyRecordStorageOutputs } = r.data;
      // 有缓存内容时，覆写缓存内容
      if (sampleApplyReplyRecordStorageOutputs.length) {
        state.submit.opinion = sampleApplyReplyRecordStorageOutputs[0].opinion;
        state.submit.remark = sampleApplyReplyRecordStorageOutputs[0].remark;
      }
      // 如果没有任何回复内容时，显示empty
      state.showEmpty = !sampleApplyReplyRecordOutputs.length;
    }
    changeLoading(false);
  }

  const handleSave = async () => {
    const r = await replayStorage(state.id, {
      ...state.submit,
    });
    if (r.code == 200) {
      // 成功
      message.success(t('sys.api.operationSuccess'));
      closePopup();
    }
  };
  const handleVisibleChange = (v?: any) => {
    if (!v) {
      emits('refresh');
    }
  };

  const emits = defineEmits(['register', 'refresh']);
  function changeCurrent(type) {
    if (type == 'pre') {
      state.currentIndex--;
    } else {
      state.currentIndex++;
    }
    state.id = state.ids[state.currentIndex];
    getDetail();
  }
</script>
<style lang="less" scoped>
  .popup-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
    padding: 0;
    height: 100%;

    > div {
      height: 100%;
    }

    .title {
      display: flex;
      align-items: center;
      // padding-left: 10px;
      margin-top: 10px;
      margin-bottom: 10px;
      font-size: 16px;
      font-weight: bold;
      position: relative;

      // &::before {
      //   content: '|';
      //   position: absolute;
      //   left: 0;
      //   top: 46%;
      //   transform: translateY(-50%);
      //   color: #ff7b00;
      // }
    }

    .icon-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 22px;
      border: 1px solid #dbdbdb;
      border-radius: 50%;
      padding: 3px;

      i {
        color: #ff7b00;
        font-weight: bold;
        font-size: 16px;
      }
    }
  }

  .h {
    color: #1a1a1a;
  }

  .desc {
    color: #999;
  }

  .content {
    background-color: #f7f7f7;
    border-radius: 8px;
    padding: 8px;
    color: #1a1a1a;
    line-height: 2;
    margin-top: 8px;
    margin-bottom: 10px;
  }
</style>
