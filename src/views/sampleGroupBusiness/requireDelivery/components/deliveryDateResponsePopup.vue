<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :showCancelBtn="true"
    :okText="t('common.submitText')"
    :title="t('dict.SampleDeliveryReplyNode.DeliveryReply')"
    destroyOnClose
    @ok="handleSubmit"
    class="full-popup">
    <template #centerToolbar>
      <a-button @click="handleSubmit(0)" class="ml-12px" type="primary" ghost>{{ t('common.temporarySave') }}</a-button>
    </template>
    <div class="h-full p-10px">
      <Subtitle :title="t('dict.SampleDeliveryReplyNode.DeliveryReply')"></Subtitle>
      <Grid style="height: calc(100% - 38px)" />
    </div>
  </BasicPopup>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { storageDetail, saveDetail, getDetails } from '/@/api/productionPlan/mainplan';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { deliveryDateResponse } from '/@/api/engineering/sampleApply';
  import { ref } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import dayjs from 'dayjs';

  const { createMessage } = useMessage();

  const emits = defineEmits(['reload']);
  const [registerPopup, { closePopup, changeLoading, changeOkLoading }] = usePopupInner(init);

  const { t } = useI18n();
  const TIME_FORMAT = 'YYYY-MM-DD';

  const columns: any[] = [
    { title: '单号', field: 'applyCode' },
    { title: '产品内部料号', field: 'insidePartNumber', width: 260 },
    { title: '需求数量(PCS)', field: 'demandQty' },
    { title: '客户要求交期', field: 'customerDeliveryTime', cellRender: { name: 'Date', format: TIME_FORMAT } },
    // 下一节点处理人
    {
      title: '下一节点处理人',
      field: 'applyUserName',
      i18nField: 'CommonCol.nextHandler',
      width: 190,
    },
    {
      title: '样品预估交期',
      field: 'sampleEstimateDeliveryTime',
      cellRender: { name: 'Date', format: TIME_FORMAT },
      editRender: {
        name: 'DatePicker',
        props: {
          format: TIME_FORMAT,
          valueFormat: TIME_FORMAT,
        },
      },
    },
    {
      title: '备注',
      field: 'remark',
      editRender: {
        name: 'Input',
      },
    },
  ];

  const [Grid, gridApi] = useVbenVxeGrid({
    showSearchForm: false,
    gridOptions: {
      id: `sampleGroupBusiness-requireDelivery-delivery-list`,
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      columns: columns,
      rowConfig: {
        keyField: 'id',
      },
      stripe: true,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'SampleDeliveryReplyColumn',
      },
      toolbarConfig: {
        enabled: false,
      },
      clipConfig: {
        isPaste: true,
      },
      pagerConfig: {
        enabled: false,
      },
    },
  });

  const { reloadData, getDataSource } = gridApi;

  async function init({ dataSource }) {
    reloadData(dataSource);
  }

  async function handleSubmit(type = 1) {
    const dataSource = getDataSource().map(item => {
      return {
        ...item,
        // `样品预估交期`与原版保持一致，使用毫秒级时间戳；
        sampleEstimateDeliveryTime: item.sampleEstimateDeliveryTime ? dayjs(item.sampleEstimateDeliveryTime, TIME_FORMAT).valueOf() : '',
      };
    });

    changeLoading(true);
    try {
      const { code, msg } = await deliveryDateResponse({ type, list: dataSource });
      if (code == 200) {
        createMessage.success(msg);
        closePopup();
        emits('reload');
      }
    } catch (error) {
      console.error(error, 'handleSubmit error');
    } finally {
      changeLoading(false);
    }
  }
</script>
<style scoped lang="less">
  :deep(.lydc-basic-popup-header) {
    padding-left: 12px;
  }

  :deep(.ml-12) {
    margin-left: 12px;
  }
</style>
