<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="isCanEdit"
    :showCancelBtn="true"
    :okText="t('common.submitText')"
    :title="t('common.detailText')"
    destroyOnClose
    @ok="() => handleSubmit(true)"
    class="full-popup">
    <template #centerToolbar>
      <a-button v-if="isCanEdit" @click="() => handleSubmit(false)" type="primary" ghost class="ml-12px">{{ t('common.temporarySave') }}</a-button>
      <template v-if="isCanStopOrRevoke">
        <a-button type="primary" ghost danger class="mx-3" v-auth="'btn_stop'" @click="handleStop">
          {{ t('common.stopText') }}
        </a-button>
        <ModelConfirmButton
          v-auth="'btn_recall'"
          v-bind="{
            modelConfirm: {
              title: t('common.tipTitle'),
              content: t('views.filings.sureRevokeData'),
              onOk: handleRecall.bind(null),
            },
            type: 'primary',
            ghost: true,
          }">
          <span>{{ t('common.revoke') }}</span>
        </ModelConfirmButton>
      </template>
    </template>

    <ScrollContainer class="p-10px">
      <Subtitle :title="t('common.applyInfo')" />
      <BasicForm @register="registerApplyInfoForm" />

      <template v-if="isShowReplyInfo">
        <Subtitle :title="t('common.replyInfo')" />
        <BasicForm @register="registerReplyInfoForm" />
      </template>
    </ScrollContainer>
  </BasicPopup>

  <StopModal @register="registerStopModal" @reload="handleAfterStop" />
</template>

<script setup lang="ts">
  import { ref, nextTick } from 'vue';
  import { getSampleMaterialApplyDetailById, updateSampleMaterialApply, recallPro, stopPro } from '/@/api/engineering/sample';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getApplyInfoSchemas, getReplyInfoSchemas } from './viewPopupConfig.ts';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import dayjs from 'dayjs';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { ScrollContainer } from '/@/components/Container';
  import { BasicForm, useForm } from '/@/components/Form';
  import { ModelConfirmButton } from '/@/components/Button';
  import { StopModal } from '/@/components/CustomComponents';

  const { t } = useI18n();

  const emits = defineEmits(['reload']);
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const { createMessage } = useMessage();

  const isCanEdit = ref<boolean>(false);
  const isShowReplyInfo = ref<boolean>(false);
  const isCanStopOrRevoke = ref<boolean>(false);

  const state = ref<any>({});

  const [
    registerApplyInfoForm,
    {
      setFieldsValue: setApplyInfoFieldsValue,
      setProps: setApplyInfoFieldsProps,
      getFieldsValue: getApplyInfoFieldsValue,
      setProps: setApplyProps,
      validate: validateApplyInfo,
    },
  ] = useForm({
    schemas: [],
    layout: 'vertical',
    labelWidth: 'unset',
    baseColProps: {
      span: 4,
    },
    i18nConfig: {
      moduleCode: 'SampleApplyColumn',
      transferRange: ['label'],
      excludeFields: ['purchaseUserId'],
    },
  });

  const [
    registerReplyInfoForm,
    {
      setFieldsValue: setReplyInfoFieldsValue,
      setProps: setReplyInfoFieldsProps,
      getFieldsValue: getReplyInfoFieldsValue,
      setProps: setReplyProps,
      validate: validateReplyInfo,
    },
  ] = useForm({
    schemas: [],
    layout: 'vertical',
    labelWidth: 'unset',
    baseColProps: {
      span: 4,
    },
    i18nConfig: {
      moduleCode: 'SampleApplyColumn',
      transferRange: ['label'],
    },
  });

  async function init(data: {
    id: string | number;
    status?: number;
    isShowReplyInfo?: boolean;
    isCanEdit?: boolean;
    isCanStopOrRevoke?: boolean;
    api?: () => Promise<any>;
  }) {
    // 状态数据记录
    state.value = data || {};
    isShowReplyInfo.value = !!data.isShowReplyInfo;
    isCanEdit.value = !!data.isCanEdit;
    isCanStopOrRevoke.value = !!data.isCanStopOrRevoke;

    // 设置表单项
    nextTick(() => {
      setApplyProps({
        schemas: getApplyInfoSchemas(setApplyInfoFieldsValue, getApplyInfoFieldsValue),
      });
      isShowReplyInfo.value &&
        setReplyProps({
          schemas: getReplyInfoSchemas(setReplyInfoFieldsValue, getReplyInfoFieldsValue),
        });
    });

    // 获取详情
    changeLoading(true);
    getSampleMaterialApplyDetailById(data.id, isShowReplyInfo.value)
      .then(res => {
        const resData = res?.data?.[0] || {};
        setApplyInfoFieldsValue(resData);

        if (isShowReplyInfo.value) {
          setApplyInfoFieldsProps({ disabled: true });
          setReplyInfoFieldsProps({ disabled: !isCanEdit.value });
          setReplyInfoFieldsValue(resData);
        } else {
          setApplyInfoFieldsProps({ disabled: !isCanEdit.value });
        }
      })
      .catch(() => {
        closePopup();
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  async function handleSubmit(isSubmit = false) {
    const applyInfoData = await validateApplyInfo();
    applyInfoData.requestArrivalDate = dayjs(applyInfoData.requestArrivalDate).format('YYYY-MM-DD');

    const replyInfoData: any = {};
    if (isShowReplyInfo.value) {
      Object.assign(replyInfoData, await validateReplyInfo());
      replyInfoData.arrivalDate = dayjs(replyInfoData.arrivalDate).format('YYYY-MM-DD');
    }

    changeLoading(true);
    const api =
      typeof state.value.api === 'function' && isShowReplyInfo
        ? state.value.api(applyInfoData, replyInfoData, isSubmit)
        : updateSampleMaterialApply([applyInfoData], isSubmit);
    return api
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        emits('reload');
        isSubmit && closePopup();
      })
      .catch(() => {})
      .finally(() => {
        changeLoading(false);
      });
  }

  async function handleRecall() {
    changeLoading(true);
    return recallPro([state.value.id])
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        emits('reload');
        closePopup();
      })
      .catch(() => {})
      .finally(() => {
        changeLoading(false);
      });
  }

  //  终止
  const [registerStopModal, { openModal: openStopModal }] = useModal();
  async function handleStop() {
    openStopModal(true, {
      api: stopPro,
      type: 'stop',
      title: t('common.stopText'),
      required: true,
      beforeFetch: params => {
        return {
          idList: [state.value.id],
          remark: params.remark,
        };
      },
    });
  }

  function handleAfterStop() {
    createMessage.success(t('sys.api.operationSuccess'));
    emits('reload');
    closePopup();
  }
</script>
