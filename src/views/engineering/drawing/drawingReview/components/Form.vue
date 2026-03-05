<template>
  <BasicModal
    canFullscreen
    :draggable="true"
    :width="650"
    v-bind="$attrs"
    @register="registerModal"
    :title="t('dict.DrawingsReviewColumn.addQuestion')"
    :showOkBtn="false"
    destroy-on-close>
    <BasicForm @register="registerForm"></BasicForm>
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
          <a-button key="back" @click="closeModal">{{ t('common.cancelText') }}</a-button>
          <!--          <a-button key="submit" :loading="confirmLoading" v-if="beforeEPM && currentData?.status != 3" type="primary" @click="handleSubmit">{{-->
          <!--            t('component.modal.okText')-->
          <!--          }}</a-button>-->
          <a-button key="submit" :loading="confirmLoading" v-if="beforeEPM && currentData?.status != 3" type="primary" @click="handleSubmit">{{
            t('component.modal.okText')
          }}</a-button>
          <a-button key="submit" :loading="confirmLoading" v-if="isEPM && currentData?.status != 3" type="primary" @click="handleConfirm">{{
            t('component.modal.okText')
          }}</a-button>
        </div>
      </div>
    </template>
  </BasicModal>
</template>
<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { uploadDrawingReviewImg } from '/@/api/sys/upload';
  import { useBaseStore } from '/@/store/modules/base';
  import { computed, nextTick, reactive, toRefs, unref } from 'vue';
  import { postDrawingsReviewContent, postDrawingsReviewCustomerReply, putDrawingsReviewContent } from '/@/api/engineering/drawingReview';
  import { message } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
  const emit = defineEmits(['register', 'reload']);

  interface State {
    currentIndex: number;
    total: number;
    sign: 'add' | 'edit' | '';
    currentData: any;
    baseData: any;
    cacheList: any[];
    confirmLoading: boolean;
  }
  const state = reactive<State>({
    currentIndex: 1,
    total: 3,
    sign: '',
    baseData: {},
    currentData: {},
    cacheList: [],
    confirmLoading: false,
  });
  const { total, currentIndex, sign, currentData, confirmLoading } = toRefs(state);
  const beforeEPM = computed(() => state?.baseData?.reviewNode == 'Engineering' || state.baseData?.reviewNode?.includes('PdLeaderCheck'));

  // const isEPM = computed(() => state.baseData?.reviewNodeName === t('dict.DrawingsReview.FlowNode.EPMReview'));
  const isEPM = computed(() => state.baseData?.reviewNode?.includes('EPMReview'));

  const toolbar = ['bold italic underline code codesample bullist numlist media'];
  const plugins = [''];
  const baseStore = useBaseStore();

  const [registerForm, { setFieldsValue, validateFields, updateSchema, setProps }] = useForm({
    schemas: getSchemas(),
    layout: 'horizontal',
    labelWidth: 130,
    i18nConfig: {
      moduleCode: 'DrawingsReviewColumn',
      transferRange: ['placeholder', 'label'],
    },
  });

  const [registerModal, { changeLoading, changeOkLoading, closeModal }] = useModalInner(init);

  async function initData(data) {
    console.log('🚀 ~ initData ~ data: ', data);
    const { current, cacheList, index, sign, disabled } = data;
    console.log(sign);

    const cache = cacheList[index];
    state.sign = sign;
    state.baseData = current;
    if (sign === 'add') return;
    state.cacheList = cacheList;
    state.currentIndex = index;
    state.currentData = cacheList[index];
    state.total = cacheList.length;
    console.log(disabled);
    setProps({ disabled: !!disabled });
    setValue(cache);

    console.log(isEPM.value, 'isEPM.valueisEPM.valueisEPM.valueisEPM.valueisEPM.value');
    await nextTick();
    updateSchema([
      {
        field: 'issueType',
        componentProps: {
          disabled: isEPM.value,
        },
      },
      {
        field: 'issueDetail',
        componentProps: {
          disabled: isEPM.value,
        },
      },
      {
        field: 'issueDetailImage',
        componentProps: {
          disabled: isEPM.value,
        },
      },
      {
        field: 'scenario',
        componentProps: {
          disabled: isEPM.value,
        },
      },
      {
        field: 'scenarioImage',
        componentProps: {
          disabled: isEPM.value,
        },
      },
      {
        field: 'customerReply',
        componentProps: {
          disabled: !isEPM.value,
        },
      },
      {
        field: 'customerReplyImage',
        componentProps: {
          disabled: !isEPM.value,
        },
      },
    ]);
  }

  function setValue(cache) {
    const { issueType, issueDetail, issueDetailImage, scenario, scenarioImage, customerReply, customerReplyImage } = cache;
    setFieldsValue({
      issueType,
      issueDetail,
      issueDetailImage,
      scenario,
      scenarioImage,
      customerReply,
      customerReplyImage,
    });
  }
  async function init(data) {
    getTypeOps();
    initData(data);
  }

  function getSchemas(): FormSchema[] {
    return [
      {
        field: 'issueType',
        label: '问题类型',
        component: 'Select',
        componentProps: {
          maxlength: 50,
          disabled: isEPM.value,
        },
        rules: [{ required: true, trigger: 'blur', message: '必填' }],
      },
      {
        field: 'issueDetail',
        label: '问题详情',
        component: 'Textarea',
        componentProps: {
          height: 200,
          disabled: isEPM.value,
          toolbar,
          plugins,
          showImageUpload: false,
          options: {
            paste_data_images: false,
          },
        },
        rules: [{ required: true, trigger: 'blur', message: '必填' }],
      },
      {
        field: 'issueDetailImage',
        label: '问题详情图片',
        component: 'ImageUpload',
        helpMessage: t('dict.DrawingsReviewColumn.onlyImageFormatsAllowedToUpload'),
        componentProps: {
          placeholder: '',
          api: uploadDrawingReviewImg,
          disabled: isEPM.value,
          maxNumber: 4,
          style: {
            minHeight: '102px',
          },
        },
        // rules: [{ required: true, trigger: 'change', message: '必填', type: 'array' }],
      },
      {
        field: 'scenario',
        label: '建议方案',
        component: 'Textarea',
        componentProps: {
          height: 200,
          toolbar,
          plugins,
          disabled: isEPM.value,
          showImageUpload: false,
          options: {
            paste_data_images: false,
          },
        },
      },
      {
        field: 'scenarioImage',
        label: '建议方案图片',
        component: 'ImageUpload',
        helpMessage: t('dict.DrawingsReviewColumn.onlyImageFormatsAllowedToUpload'),
        componentProps: {
          placeholder: '',
          api: uploadDrawingReviewImg,
          maxNumber: 4,
          disabled: isEPM.value,
          style: {
            minHeight: '102px',
          },
        },
      },
      {
        field: 'customerReply',
        label: '客户回复',
        component: 'Textarea',
        componentProps: {
          height: 200,
          toolbar,
          plugins,
          showImageUpload: false,
          disabled: !isEPM.value,
          options: {
            paste_data_images: false,
          },
        },
      },
      {
        field: 'customerReplyImage',
        label: '客户回复图片',
        component: 'ImageUpload',
        helpMessage: t('dict.DrawingsReviewColumn.onlyImageFormatsAllowedToUpload'),
        componentProps: {
          placeholder: '',
          api: uploadDrawingReviewImg,
          maxNumber: 4,
          disabled: !isEPM.value,
          style: {
            minHeight: '102px',
          },
        },
      },
    ];
  }

  async function getTypeOps() {
    const list = await baseStore.getDictionaryData('DrawingsReview.IssueType');
    updateSchema({
      field: 'issueType',
      componentProps: {
        options: list,
        fieldNames: { value: 'enCode' },
      },
    });
  }

  async function handleSubmit() {
    try {
      state.confirmLoading = true;
      const { sign, baseData: data } = state;
      const val = await validateFields();
      if (!val) return (state.confirmLoading = false);
      // 如果是EPM评审，则需要作客户回复
      if (unref(isEPM)) {
      }
      if (sign === 'add') {
        const {
          code,
          msg,
          data: id,
        } = await postDrawingsReviewContent({
          ...val,
          ...data,
          reviewId: data.id,
        });
        if (code === 200) {
          message.success(msg);
          emit('reload', { id });
          closeModal();
        }
      } else if (sign === 'edit') {
        const {
          code,
          msg,
          data: id,
        } = await putDrawingsReviewContent({
          ...val,
          ...data,
          id: state.currentData.id,
        });
        if (code === 200) {
          message.success(msg);
          emit('reload', { id });
          closeModal();
        }
      }
      await nextTick();
      state.confirmLoading = false;
    } catch (e) {
      state.confirmLoading = false;
    }
  }

  async function handleConfirm() {
    state.confirmLoading = true;
    const { sign, baseData: data, cacheList, index } = state;
    const val = await validateFields();
    if (!val) return (state.confirmLoading = false);

    console.log(val);
    console.log(data);
    console.log(state.currentData, 'state.currentDatastate.currentDatastate.currentData');

    const { code, msg } = await postDrawingsReviewCustomerReply({
      ...val,
      ...data,
      reviewId: data.id,
      id: state.currentData.id,
    });
    if (code === 200) {
      message.success(msg);
      emit('reload', { id: state.baseData.id });
      closeModal();
    }
    await nextTick();
    state.confirmLoading = false;
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
      setValue(current);
      state.currentIndex = index - 1;
    }
    // 下一个
    if (type === 'next') {
      if (index === state.total - 1) {
        return message.error(t('common.lastOneTip'));
      }
      const current = state.cacheList[index + 1];
      state.currentData = current;
      setValue(current);
      state.currentIndex = index + 1;
    }
  }
</script>

<style lang="less" scoped>
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

  .state-box {
    margin: 0 10px;
  }
</style>
