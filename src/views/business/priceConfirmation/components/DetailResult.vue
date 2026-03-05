<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    @ok="handleSaveAction"
    :showOkBtn="mode != 'view'"
    :okText="t('common.submitText')"
    destroyOnClose
    :cancelText="t('common.cancel')"
    :title="t('dict.QuotationFlowNode.Confirm')"
    class="full-popup p-10px top-0">
    <template #insertToolbar>
      <div class="flex">
        <p class="mr-8px">{{ t('common.commentRemark') }}:</p>
        <a-switch
          v-model:checked="confirmOpinion"
          style="width: 70px"
          :checked-value="1"
          :un-checked-value="2"
          :checked-children="t('common.agree')"
          :disabled="mode === 'view'"
          :un-checked-children="t('common.disagree')" />
        <p class="mr-8px ml-12px">{{ t('common.priceCommentRemark') }}:</p>
        <a-input :disabled="mode === 'view'" v-model:value="confirmRemark" :placeholder="t('common.inputPlaceholder')" style="width: 200px" />
      </div>
    </template>

    <ScrollContainer class="p-10px">
      <Subtitle :title="t('common.baseinfo')" />
      <BasicForm @register="baseInfoRegisterForm" />

      <Subtitle :title="t('common.productInformation')" />
      <BasicForm @register="baseProductRegisterForm" />

      <Subtitle :title="t('common.productCost')" />
      <BasicForm @register="costRegisterForm" />

      <Subtitle :title="t('common.materialComposition')" />
      <Grid />
    </ScrollContainer>
  </BasicPopup>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { BasicForm, useForm } from '/@/components/Form';
  import {
    baseProductRegisterForm,
    costRegisterForm,
    costSetFields,
    getBaseInfoSchemas,
    productResetFields,
    prodUpdateSchema,
    materialStringColumns,
  } from '/@/views/business/priceConfirmation/CONFIG';
  import ScrollContainer from '/@/components/Container/src/ScrollContainer.vue';
  import { Subtitle } from '/@/components/Subtitle';
  import { nextTick, reactive, toRefs } from 'vue';
  import { confirmQuotationSingle, getQuotationBomByBomId } from '/@/api/business/priceConfirmation';
  import { bignumber, divide, subtract } from 'mathjs';
  import { message } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';

  const { t } = useI18n();

  const emit = defineEmits(['reload', 'register']);
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  const state = reactive<{
    confirmOpinion: number | string;
    confirmRemark: string;
    record: any;
    mode: string;
  }>({
    confirmOpinion: 1,
    confirmRemark: '',
    record: {},
    mode: '',
  });
  const { confirmOpinion, confirmRemark, mode } = toRefs(state);

  function init(data) {
    const { record, mode } = data;

    console.log(record);
    state.record = record;
    baseInfoResetFields(record);
    state.mode = mode;
    if (mode == 'view') {
      prodUpdateSchema([
        {
          field: 'advanceCost',
          ifShow: false,
        },
        {
          field: 'actualAdvanceCost',
          ifShow: false,
        },
      ]);
    }
    console.log(record.parentPartInfo.singleCost);
    console.log(record.parentPartInfo.singleCostActual);
    const advanceCost = bignumber(record?.parentPartInfo?.singleCost || 0)
      .dividedBy(0.8) // 1 - 0.2 = 0.8
      .toFixed(6);
    const advanceCost25 = bignumber(record?.parentPartInfo?.singleCost || 0)
      .dividedBy(0.75) // 1 - 0.25 = 0.75
      .toFixed(6);
    const actualAdvanceCost = divide(
      bignumber(record?.parentPartInfo?.singleCostActual || 0),
      subtract(bignumber(1), divide(bignumber(20), bignumber(100))),
    ).toFixed(6);
    productResetFields({
      ...record,
      ...record.parentPartInfo,
      advanceCost,
      advanceCost25,
      actualAdvanceCost,
    });
    costSetFields({
      ...record.parentPartInfo,
      fpy: (record.parentPartInfo.fpy * 100).toFixed(2) + '%',
    });

    nextTick(() => {
      gridApi.clearData().then(() => {
        gridApi.reload();
      });
    });
  }

  const [baseInfoRegisterForm, { setFieldsValue: baseInfoResetFields }] = useForm({
    baseColProps: { span: 4 },
    schemas: getBaseInfoSchemas(),
    disabled: true,
    layout: 'vertical',
    labelWidth: 200,
  });
  // const [baseProductRegisterForm, { setFieldsValue: productResetFields }] = useForm({
  //   baseColProps: { span: 4 },
  //   schemas: getProductSchemas(),
  //   disabled: true,
  //   layout: "vertical",
  //   labelWidth: 200
  // });
  // const [costRegisterForm, { setFieldsValue: costResetFields }] = useForm({
  //   baseColProps: { span: 4 },
  //   schemas: getCostSchemas(),
  //   disabled: true,
  //   layout: "vertical",
  //   labelWidth: 200
  // });

  const [Grid, gridApi] = useVbenVxeGrid({
    showSearchForm: false,
    gridOptions: {
      id: 'business-priceConfirmation-detail-result',
      columns: materialStringColumns,
      api: () => getQuotationBomByBomId(state.record?.bomId || ''),
      // @ts-ignore
      proxyConfig: {
        response: {
          list: 'data',
        },
      },
      pagerConfig: {
        enabled: false,
      },
      toolbarConfig: {
        enabled: false,
      },
    },
  });

  function handleSaveAction() {
    changeLoading(true);
    const { confirmOpinion, confirmRemark, record } = state;
    console.log(confirmOpinion, confirmRemark);
    confirmQuotationSingle({
      id: record.id,
      confirmOpinion,
      confirmRemark,
    })
      .then(({ code, msg }) => {
        console.log(code, msg);
        if (code == 200) {
          message.success(msg);
          emit('reload');
          closePopup();
        } else {
          message.error(msg);
        }
      })
      .finally(() => {
        changeLoading(false);
      });
  }
</script>
<style lang="less" scoped>
  :deep(.lydc-basic-form .ant-form-item:not(.ant-form-item-with-help)) {
    margin-bottom: 8px;
    border-right: 0;
  }

  :deep(div.vxe-grid--layout-body-wrapper) {
    padding: 0;
  }
</style>
