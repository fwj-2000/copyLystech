<template>
  <BasicPopup
    v-bind="$attrs"
    :showOkBtn="false"
    :showCancelBtn="false"
    :title="t('common.detailText')"
    class="full-popup"
    destroyOnClose
    @register="registerPopup">
    <template #appendToolbar>
      <a-space>
        <!-- 取消 -->
        <a-button @click="handleCancel">{{ t('common.cancel') }}</a-button>
        <!-- 驳回 -->
        <a-button v-if="isCanEdit" type="primary" ghost @click="handleReject">{{ t('common.rejectText') }}</a-button>
        <!-- 提交 -->
        <a-button v-if="isCanEdit" type="primary" @click="handleSubmit">{{ t('common.submit') }}</a-button>
        <!-- 数据切换 -->
        <template v-if="total > 1">
          <a-button preIcon="icon-ym icon-ym-left" @click="changeCurrent(-1)"></a-button>
          <span>
            <span style="color: #ff7b00">{{ currentIndex + 1 }}</span> / {{ total }}
          </span>
          <a-button preIcon="icon-ym icon-ym-right" @click="changeCurrent(1)"></a-button>
        </template>
      </a-space>
    </template>
    <ScrollContainer class="p-10px">
      <!-- 判定信息 -->
      <div class="pt-8px">
        <Subtitle :title="t('dict.mouldBusiness.anormalyJudgmentTitle')" />
        <BasicForm @register="registerJudgmentForm" @field-value-change="handleFieldValueChange" />
      </div>

      <!-- 图纸信息 -->
      <div class="pt-8px">
        <Subtitle :title="t('common.uploadDrawings')" />
        <UploadArea v-model:file-list="currentData.fileJson" :disabled="!isCanEdit" :style="{ height: currentData.fileJson.length > 0 ? '100%' : '200px' }" />
      </div>

      <!-- 异常信息 -->
      <div class="pt-8px">
        <Subtitle :title="t('common.abnormalMoldInfo')" />
        <BasicForm @register="registerAbnormalForm" />
      </div>
    </ScrollContainer>

    <RejectModal @register="registerRejectModal" @reload="handleCompleted" />
  </BasicPopup>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { getJudgmentSchemas, abnormalSchemas, BUSINESS_UNIT_ENUM, OPINION_ENUM, REPAIR_ENUM, REASON_ENUM } from './detailPopupConfig';
  import { judge, bulkreject, getDetailById } from '/@/api/productionDeal/mouldBusinessMaintenance';
  import { EXCEPTION_CATEGORY_ENUM, renderCustomText } from '/@/views/productionDeal/mouldBusiness/maintenance/config';
  import { formatToDateTime } from '/@/utils/dateUtil';
  import { STATUS_ENUM } from '../config';

  import { ScrollContainer } from '/@/components/Container';
  import { Subtitle } from '/@/components/Subtitle';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { BasicForm, useForm } from '/@/components/Form';
  import RejectModal from '/@/components/CustomComponents/src/RejectModal.vue';
  // import UploadArea from '/@/views/productionDeal/mouldBusiness/maintenance/components/uploadArea.vue';
  import UploadArea from '/@/views/purchase/mouldBusiness/confirm/components/uploadArea.vue';

  const emits = defineEmits(['register', 'reload']);

  const { t } = useI18n();

  const { createMessage } = useMessage();

  // 判定表单
  const [
    registerJudgmentForm,
    {
      getFieldsValue: getJudgmentFieldsValue,
      validate: validateJudgment,
      setFieldsValue: setJudgmentFieldsValue,
      clearValidate: clearJudgmentValidate,
      setProps: setJudgmentProps,
      updateSchema: updateJudgmentSchema,
    },
  ] = useForm({
    baseColProps: {
      span: 4,
    },
    labelWidth: '100%',
    layout: 'vertical',
    i18nConfig: {
      moduleCode: 'MoldRepairApplyColumn',
      transferRange: ['label'],
    },
    // @ts-ignore
    schemas: getJudgmentSchemas(),
  });

  // 模具异常信息表单
  const [registerAbnormalForm, { setFieldsValue: setAbnormalFieldsValue }] = useForm({
    baseColProps: {
      span: 4,
    },
    labelWidth: '100%',
    layout: 'vertical',
    i18nConfig: {
      moduleCode: 'MoldRepairApplyColumn',
      transferRange: ['label'],
    },
    // @ts-ignore
    schemas: abnormalSchemas,
  });

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  type DataItemType = {
    id: string;
    fileJson: Array<any>;
    /** 当前数据是否获取过详情 */
    isGetDetail: boolean;
  };

  /** 数据列表 */
  const dataList = ref<Array<DataItemType & Record<string, any>>>([]);
  /** 当前展示数据 */
  const currentData = ref<DataItemType & Record<string, any>>({ id: '', fileJson: [], isGetDetail: false });
  /** 当前数据索引 */
  const currentIndex = ref<number>(0);
  /** 数据条数 */
  const total = ref<number>(0);
  /** 是否可以编辑 */
  const isCanEdit = ref<boolean>(false);

  async function init(data: { ids: Array<string>; isCanEdit: boolean }) {
    if (data.ids.length <= 0) {
      closePopup();
      return false;
    }
    currentIndex.value = 0;
    total.value = data.ids.length;
    isCanEdit.value = data.isCanEdit;
    // 初始化数据
    dataList.value = data.ids.map(id => {
      return {
        id,
        fileJson: [],
        isGetDetail: false,
      };
    });
    changeCurrentData();
  }

  /**
   * 切换数据
   */
  async function changeCurrentData() {
    getCurrentData().then(targetData => {
      if (!targetData) {
        return;
      }

      currentData.value = targetData;
      setJudgmentFieldsValue(currentData.value);
      setJudgmentProps({ disabled: !isCanEdit.value });
      clearJudgmentValidate();
      setAbnormalFieldsValue(currentData.value);
    });
  }

  /**
   * 获取当前数据详情
   */
  async function getCurrentData() {
    const targetData = dataList.value[currentIndex.value];
    if (targetData.isGetDetail) {
      return Promise.resolve(targetData);
    }
    changeLoading(true);
    return getDetailById(targetData.id)
      .then(({ data = {} }) => {
        if (data.engTechJudgeStatus === STATUS_ENUM.已处理) {
          createMessage.warn(t('dict.CommonCol.processed'));
          closePopup();
          return;
        }

        data.exceptionCategoryName = renderCustomText(
          data.exceptionCategory,
          data,
          'exceptionCategoryName',
          'otherExceptionCategory',
          EXCEPTION_CATEGORY_ENUM.其他,
        );
        Object.assign(targetData, data, { demandType: `${data.demandType}`, moldStatus: `${data.moldStatus}` });
        targetData.isGetDetail = true;
        return Promise.resolve(targetData);
      })
      .catch(e => {
        console.warn('getCurrentData error:', e);
        return Promise.resolve(targetData);
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  /**
   * 提交
   */
  async function handleSubmit() {
    const flag = await validateJudgment();
    if (!flag) {
      return false;
    }
    const formValues = getJudgmentFieldsValue();
    // const formData = new FormData();
    // for (const key in formValues) {
    //   if (formValues[key]) {
    //     if (key === 'requireDeliveryTime') {
    //       formData.append(key, formatToDateTime(formValues[key], 'YYYY-MM-DD'));
    //     } else {
    //       formData.append(key, formValues[key]);
    //     }
    //   }
    // }
    // (currentData.value.fileJson || []).forEach(item => {
    //   formData.append('fileJson', item.file);
    // });

    // formData.append('id', currentData.value.id);
    const params = {
      ...formValues,
      requireDeliveryTime: formValues['requireDeliveryTime'] ? formatToDateTime(formValues['requireDeliveryTime'], 'YYYY-MM-DD') : '',
      id: currentData.value.id,
      fileJson: currentData.value.fileJson,
    };

    changeLoading(true);
    return judge(params)
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        emits('reload');
        // closePopup();
        handleCompleted();
      })
      .catch(() => {})
      .finally(() => {
        changeLoading(false);
      });
  }

  /**
   * 取消
   */
  function handleCancel() {
    closePopup();
  }

  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  /**
   * 打开驳回弹窗
   */
  function handleReject() {
    if (!currentData.value.id) {
      return false;
    }

    openRejectModal(true, {
      api: bulkreject,
      ids: [currentData.value.id],
      beforeFetch: ({ ids, rejectRemark }) => {
        return [
          {
            id: ids[0],
            rejectRemark,
          },
        ];
      },
    });
  }

  /**
   * 当前数据处理完成之后('驳回'、'提交'之后)
   */
  function handleCompleted() {
    if (currentIndex.value < total.value - 1) {
      changeCurrent(1);
    } else {
      closePopup();
      emits('reload');
    }
  }

  /**
   * 工程/生技判定信息发生改变，处理
   */
  function handleFieldValueChange(key: string) {
    const formData = getJudgmentFieldsValue();
    // 当`判定责任单位(responsibleDepartment)`或者`工程/生技意见(engineeringTechnicianOpinions)`发生改变时，自动赋值给`维修类型(repairType)`
    if (
      ['responsibleDepartment', 'engineeringTechnicianOpinions'].includes(key) &&
      formData.responsibleDepartment &&
      formData.engineeringTechnicianOpinions === OPINION_ENUM.维修
    ) {
      setJudgmentFieldsValue({ repairType: formData.responsibleDepartment === BUSINESS_UNIT_ENUM.供应商 ? REPAIR_ENUM.免费维修 : REPAIR_ENUM.付费维修 });
    } else if (['responsibleDepartment', 'engineeringTechnicianOpinions'].includes(key) && formData.engineeringTechnicianOpinions !== OPINION_ENUM.维修) {
      setJudgmentFieldsValue({ repairType: '' });
    }

    // 当`原因分析(causeAnalysis)`为`其他`时，允许编辑`其他原因分析(otherCauseAnalysis)`
    if (key === 'causeAnalysis') {
      updateJudgmentSchema({
        field: 'otherCauseAnalysis',
        componentProps: {
          disabled: formData.causeAnalysis !== REASON_ENUM.其他,
        },
      });
    }
  }

  /**
   * 切换当前数据
   * @param step 前进或者后退的步数，正数则展示后面相应步数的数据，负数则展示前面相应步数的数据
   */
  function changeCurrent(step: number) {
    const newIndex = currentIndex.value + step;
    if (newIndex < 0 || newIndex >= total.value) {
      return false;
    }
    currentIndex.value = newIndex;
    // 数据切换
    changeCurrentData();
    return true;
  }
</script>
