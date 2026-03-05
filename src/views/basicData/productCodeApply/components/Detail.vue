<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    @ok="handleSaveAction"
    :showOkBtn="hasBtnP('btn_edit')"
    :okText="sign === 'review' ? t('common.editText') : t('common.submitText')"
    destroyOnClose
    :title="t('dict.PartNumberApplyColumn.finishedProducts')"
    class="full-popup code-apply-popup top-0">
    <template #centerToolbar>
      <a-space :size="10">
        <a-button v-if="state.currentData.Status == '3'" @click="handleReview" v-auth="'btn_detail'" type="primary">{{ t('common.audit') }} </a-button>
        <a-button v-if="state.currentData.Status == '2'" @click="handleReview" v-auth="'btn_enable'" type="primary"
          >{{ t('dict.PartNumberApplyStatus.1') }}
        </a-button>
        <a-button v-if="state.currentData.Status == '1'" @click="handleReview" v-auth="'btn_edit'" type="primary">{{ t('common.disableText') }} </a-button>

        <a-button @click="handlePre" v-auth="'btn_detail'">{{ t('common.prevRecord') }} </a-button>
        <a-button @click="handleNext" v-auth="'btn_detail'" type="primary">{{ t('common.nextRecord') }} </a-button>
      </a-space>
    </template>
    <ScrollContainer>
      <DetailView :sign="sign" ref="detailViewRef" @changeLoading="changeLoading" />
    </ScrollContainer>
  </BasicPopup>
</template>

<script lang="ts" setup>
  import DetailView from './DetailView.vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { ScrollContainer } from '/@/components/Container';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, toRefs, ref, nextTick } from 'vue';
  import { cloneDeep } from 'lodash-es';
  import { message } from 'ant-design-vue';
  import { partnumberapplyDisable, partnumberapplyEnable, partnumberapplyReview, putCustomerList } from '/@/api/basicData/productCodeApply';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const emit = defineEmits(['reload', 'register']);

  const { hasBtnP } = usePermission();
  const { createMessage } = useMessage();

  const detailViewRef = ref(null);
  const state = reactive({
    title: t('common.viewDetails'),
    sign: 'review',
    reasonTypeOption: [],
    directCustomerList: [],
    terminalCustomerList: [],
    InsideProjectCodeOption: [],
    mainProcessOption: [],
    shipPattern: [],
    fileList: [],
    ImmediateCustomerCodeOption: [],
    mainProcess: '',
    currentData: {},
    allList: [],
  });

  const { sign } = toRefs(state);

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  async function init(data) {
    const cloneData = cloneDeep(data);
    delete data.cacheList;
    state.allList = cloneData.cacheList;
    state.currentData = data;
    state.sign = 'review';
    detailViewRef.value.setVisible(true, data);
  }

  function handlePre() {
    const index = state.allList.findIndex(item => item.Id === state.currentData.Id);
    if (index === 0) {
      return message.error(t('common.alreadyAtTheFirstDataEntry'));
    }
    state.currentData = state.allList[index - 1];
    detailViewRef.value.initData(state.allList[index - 1]);
  }

  function handleNext() {
    const index = state.allList.findIndex(item => item.Id === state.currentData.Id);
    if (index === state.allList.length - 1) {
      return message.error(t('common.alreadyAtTheLastDataEntry'));
    }
    state.currentData = state.allList[index + 1];
    detailViewRef.value.initData(state.allList[index + 1]);
  }

  function handleSaveAction() {
    nextTick(async () => {
      if (state.sign === 'review') {
        state.sign = 'edit';
        // detailEditRef.value.setVisible(true, state.currentData);
      } else if (state.sign === 'edit') {
        // validateFields

        changeLoading(true);
        // const values = await detailEditRef.value.validateFields();
        // if (!values) return;
        // delete values.Status;
        // values.ProductImage = state.fileList;
        const values = await detailViewRef.value.buildParams();

        putCustomerList({
          ...values,
          ProductLineCode: values.ProductLineCode.split('/')[0],
        })
          .then(({ code, msg }) => {
            if (code === 200) {
              createMessage.success(msg);
            }
            emit('reload');
            closePopup();
          })
          .catch(() => {
            changeLoading(false);
          });
        // detailEditRef.value.handleSaveAction();
      }
    });
  }

  async function handleReview() {
    // 1 生效 2 失效 3 审核

    if (state.currentData.Status === '3') {
      partnumberapplyReview([state.currentData.Id]).then(({ code, msg }) => {
        if (code === 200) {
          message.success(msg);
          state.currentData.Status = '1';
          detailViewRef.value.initData(state.currentData);
          emit('reload');
        }
      });
    } else if (state.currentData.Status === '2') {
      partnumberapplyEnable([state.currentData.Id]).then(({ code, msg }) => {
        if (code === 200) {
          message.success(msg);
          state.currentData.Status = '1';
          detailViewRef.value.initData(state.currentData);
          emit('reload');
        }
      });
    } else if (state.currentData.Status === '1') {
      partnumberapplyDisable([state.currentData.Id]).then(({ code, msg }) => {
        if (code === 200) {
          message.success(msg);
          state.currentData.Status = '2';
          detailViewRef.value.initData(state.currentData);
          emit('reload');
        }
      });
    }
  }
</script>
<style lang="less">
  .code-apply-popup {
    .pop-item {
      border-bottom: 10px solid #f0f0f0;
      padding: 20px 20px 10px;

      &:last-child {
        border-bottom: 0;
      }
    }
  }
</style>
