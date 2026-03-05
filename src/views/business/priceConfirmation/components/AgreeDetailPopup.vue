<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    @ok="handleSaveAction"
    :showOkBtn="false"
    :okText="t('common.submitText')"
    destroyOnClose
    :cancelText="t('common.cancelText')"
    :title="t('dict.QuotationFlowNode.Confirm')"
    class="full-popup p-10px top-0">
    <ScrollContainer class="p-10px">
      <div class="result-icon-box">
        <img v-if="record.confirmOpinion === 1" :src="agree" />
        <img v-if="record.confirmOpinion === 2" :src="disagree" />
      </div>
      <Subtitle :title="t('common.priceInformation')" />
      <BasicForm @register="priceInfoRegisterForm" />

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
    getPriceInfoSchemas,
    productResetFields,
    prodUpdateSchema,
    materialStringColumns,
  } from '/@/views/business/priceConfirmation/CONFIG';
  import ScrollContainer from '/@/components/Container/src/ScrollContainer.vue';
  import { Subtitle } from '/@/components/Subtitle';
  import { reactive, toRefs, nextTick } from 'vue';
  import { confirmQuotationSingle, getQuotationBomByBomId } from '/@/api/business/priceConfirmation';
  import { bignumber, divide, subtract } from 'mathjs';
  import agree from '/@/assets/svg/result/agree.svg';
  import disagree from '/@/assets/svg/result/disagree.svg';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';

  const emit = defineEmits(['reload', 'register']);
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  const { t } = useI18n();
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
  const { confirmOpinion, confirmRemark, record } = toRefs(state);

  function init(data) {
    const { record, mode } = data;
    console.log(record);
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
    state.record = record;
    console.log(record.confirmOpinion, 'confirmOpinion');
    console.log(record.confirmRemark, 'confirmRemark');
    baseInfoResetFields(record);
    priceInfoSetFields(record);
    console.log(record.parentPartInfo.singleCost);
    console.log(record.parentPartInfo.singleCostActual);
    const advanceCost = divide(bignumber(record?.parentPartInfo?.singleCost || 0), subtract(bignumber(1), divide(bignumber(20), bignumber(100)))).toFixed(6);
    const actualAdvanceCost = divide(
      bignumber(record?.parentPartInfo?.singleCostActual || 0),
      subtract(bignumber(1), divide(bignumber(20), bignumber(100))),
    ).toFixed(6);
    productResetFields({
      ...record.parentPartInfo,
      ...record,
      advanceCost,
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
  const [priceInfoRegisterForm, { setFieldsValue: priceInfoSetFields }] = useForm({
    baseColProps: { span: 4 },
    schemas: getPriceInfoSchemas(),
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
    confirmQuotationSingle({
      id: record.id,
      confirmOpinion,
      confirmRemark,
    })
      .then(({ code, msg }) => {
        console.log(code, msg);
        if (code == 200) {
          createMessage.success(msg);
          emit('reload');
          closePopup();
        } else {
          createMessage.error(msg);
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

  .result-icon-box {
    position: absolute;
    right: 10px;
    top: 0;
    z-index: 10;
  }

  :deep(.ant-form-item) {
    border: 0;
  }

  :deep(div.vxe-grid--layout-body-wrapper) {
    padding: 0;
  }
</style>
