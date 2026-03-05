<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showCancelBtn="true"
    :show-ok-btn="false"
    :cancelButtonProps="{ class: 'mr-12px' }"
    :ok-text="t('common.submit')"
    :title="title"
    :destroy-on-close="true"
    style="position: relative; background-color: red"
    class="top-0"
    contentHeight="100%"
    @ok="handleSubmit">
    <div class="lydc-basic-cell-content">
      <div style="display: flex; height: 100%; border-bottom: 1px solid #d9d9d9; overflow-y: scroll">
        <div style="width: 100%; border-right: 1px solid #d9d9d9; height: max-content" class="pt-8px">
          <Subtitle
            :title="t('views.finalFilingForm.exportMainlandFilingForm')"
            class="mt-2px pl-12px pr-12px"
            style="padding-bottom: 8px"
            :extra="{ show: true, hideAdd: true }">
            <template #extra>
              <span>{{ t('common.viewHistoryText') }} : </span>
              <a-select
                v-model:value="state.exportMainlandSelectedValue"
                style="width: 200px"
                :options="exportMainlandVersionList"
                :placeholder="t('common.chooseText')"
                @change="onExportMainlandVersionChange" />
            </template>
          </Subtitle>
          <BasicForm @register="registerExportMainlandForm"></BasicForm>
        </div>
        <div style="width: 100%" class="pt-8px">
          <Subtitle
            :title="t('views.finalFilingForm.outboundFilingForm')"
            class="mt-2px pl-12px pr-12px"
            style="padding-bottom: 8px"
            :extra="{ show: true, hideAdd: true }">
            <template #extra>
              <span>{{ t('common.viewHistoryText') }} : </span>
              <a-select
                v-model:value="state.outboundSelectedValue"
                style="width: 200px"
                :options="outboundVersionList"
                :placeholder="t('common.chooseText')"
                @change="onOutboundVersionChange" />
            </template>
          </Subtitle>
          <BasicForm @register="registerExportOutboundForm"></BasicForm>
        </div>
      </div>
      <!-- <div class="lydc-basic-cell-footer">
        <div>
          {{ t('common.viewHistoryText') }}：
          <a-select style="width: 200px" v-model:value="innerValue" :options="outboundVersionList" :placeholder="t('common.chooseText')" @change="onOutboundVersionChange" />
        </div>
        <div>
          <a-button @click="handleClose">{{ t('common.cancelText') }}</a-button>
          <a-button @click="handleSubmit" type="primary" class="ml-8px">{{ t('common.submit') }}</a-button>
        </div>
      </div> -->
    </div>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, nextTick } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Subtitle } from '/@/components/Subtitle';
  import { BasicForm, useForm } from '/@/components/Form';
  import { baseFormConfig, outboundFormConfig } from './detailPopupConfig';
  import dayjs from 'dayjs';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { omit } from 'lodash-es';
  import { saveClearPort, saveInland, getFinalVersionHistory /** getDetail */ } from '/@/api/logisticAffairs/filingsFinalForm';
  import { FILING_TYPE_ENUM } from '../config';

  const { createMessage } = useMessage();

  const emits = defineEmits(['register', 'refresh', 'reload']);

  interface State {
    type: 'view' | 'edit';
    customsAffairsApplyId: string;
    role: string;
    title: string;
    base: any;
    tableList: any[];
    tempList: any[];
    innerMaterialNumList: any[];
    harhorList: any[];
    factoryList: any[];
    customerList: any[];
    shipmentList: any[];
    fetching: boolean;
    line: number;
    options: any[];
    innerMaterialId: any;
    mainlandInfo: any;
    outboundInfo: any;
    exportMainlandSelectedValue: any;
    exportMainlandVersionList: any[];
    outboundSelectedValue: any;
    outboundVersionList: any[];
  }

  const { t } = useI18n();
  const state = reactive<State>({
    type: 'edit',
    role: '',
    base: {},
    customsAffairsApplyId: '',
    title: '',
    tableList: [],
    tempList: [],
    innerMaterialNumList: [],
    harhorList: [],
    factoryList: [],
    customerList: [],
    shipmentList: [],
    fetching: false,
    line: 1,
    options: [],
    innerMaterialId: '',
    mainlandInfo: '',
    outboundInfo: '',
    exportMainlandSelectedValue: '',
    exportMainlandVersionList: [],
    outboundSelectedValue: '',
    outboundVersionList: [],
  });
  const { title, exportMainlandVersionList, outboundVersionList } = toRefs(state);

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const [registerExportMainlandForm, { setFieldsValue: setBaseInfoFieldsValue, getFieldsValue: getBaseInfoFieldsValue, setProps: setBaseInfoProps }] = useForm({
    schemas: baseFormConfig,
    layout: 'vertical',
    labelWidth: '100%',
    baseColProps: {
      span: 8,
    },
    baseRowStyle: {
      'margin-left': '4px',
      'margin-right': '4px',
    },
    i18nConfig: {
      moduleCode: 'CustomsAffairsFinalVersion',
      transferRange: ['placeholder', 'label'],
    },
  });
  const [registerExportOutboundForm, { setFieldsValue: setOutboundFieldsValue, getFieldsValue: getOutboundFieldsValue, setProps: setOutboundProps }] = useForm({
    schemas: outboundFormConfig,
    layout: 'vertical',
    labelWidth: '100%',
    baseColProps: {
      span: 8,
    },
    baseRowStyle: {
      'margin-left': '4px',
      'margin-right': '4px',
    },
    i18nConfig: {
      moduleCode: 'CustomsAffairsFinalVersion',
      transferRange: ['placeholder', 'label'],
    },
  });

  function init(data) {
    state.outboundVersionList.length = 0;
    state.exportMainlandVersionList.length = 0;
    state.title = data?.title || t('common.detailText');
    state.type = data?.type || 'view';
    state.customsAffairsApplyId = data?.id;
    state.outboundSelectedValue = '';
    state.exportMainlandSelectedValue = '';
    getVersionsList();

    nextTick(() => {
      const disabled = state.type == 'view';
      setBaseInfoProps({ disabled });
      setOutboundProps({ disabled });
    });
  }

  // async function getDetailInCustomsAffairsApplyId() {
  //   getDetail([state.customsAffairsApplyId]).then(res => {
  //     const data = res.data || {};
  //     setOutboundFieldsValue(data);
  //     setBaseInfoFieldsValue(cloneDeep(data));
  //   });
  // }

  function getVersionsList() {
    changeLoading(true);
    getFinalVersionHistory({ id: state.customsAffairsApplyId })
      .then(async res => {
        if (res.code == 200) {
          (res.data || [])
            .sort((a, b) => b.creatorTime - a.creatorTime)
            .forEach((item: any) => {
              if (`${item.finalVersionType}` === `${FILING_TYPE_ENUM.出口内地备案表}`) {
                state.exportMainlandVersionList.push({
                  value: item.creatorTime,
                  content: item,
                  label: dayjs(item.creatorTime).tz().format('YYYY-MM-DD HH:mm'),
                });
              } else if (`${item.finalVersionType}` === `${FILING_TYPE_ENUM.出港备案表}`) {
                state.outboundVersionList.push({
                  value: item.creatorTime,
                  content: item,
                  label: dayjs(item.creatorTime).tz().format('YYYY-MM-DD HH:mm'),
                });
              }
            });
          state.exportMainlandVersionList.length > 0 && onExportMainlandVersionChange(state.exportMainlandVersionList[0]?.value);
          state.outboundVersionList.length > 0 && onOutboundVersionChange(state.outboundVersionList[0]?.value);
        }
      })
      .finally(() => {
        changeLoading(false);
      });
  }
  // function handleClose() {
  //   closePopup();
  // }
  async function handleSubmit() {
    changeLoading(true);
    Promise.all([
      saveInland([
        omit({ ...getBaseInfoFieldsValue(), customsAffairsApplyId: state.customsAffairsApplyId }, [
          'applyDate',
          'applyUserName',
          'customersName',
          'prot',
          'immediateCustomerName',
        ]),
      ]),
      saveClearPort([
        omit({ ...getOutboundFieldsValue(), customsAffairsApplyId: state.customsAffairsApplyId }, ['applyDate', 'applyUserName', 'customersName', 'prot']),
      ]),
    ])
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        closePopup();
        emits('reload');
      })
      .finally(() => {
        changeLoading(false);
      });
  }
  function onExportMainlandVersionChange(key: number | string) {
    const target = state.exportMainlandVersionList.find(item => item.value === key);
    state.exportMainlandSelectedValue = target?.value || '';
    setBaseInfoFieldsValue(target ? target.content : {});
  }

  function onOutboundVersionChange(key: number | string) {
    const target = state.outboundVersionList.find(item => item.value === key);
    state.outboundSelectedValue = target?.value || '';
    setOutboundFieldsValue(target ? target.content : {});
  }
</script>

<style lang="less" scoped>
  .lydc-basic-popup {
    :deep(.scrollbar__view) {
      height: 100% !important;
      padding: 0 0 10px !important;
    }
  }

  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  :deep(.lydc-basic-table) {
    height: calc(100% - 70px);
  }

  .lydc-basic-cell-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // position: relative;

    // .lydc-basic-cell-footer {
    //   // position: fixed;
    //   bottom: 16px;
    //   right: 8px;
    //   padding: 16px 16px 6px;
    //   display: flex;
    //   justify-content: space-between;
    // }
  }
</style>
