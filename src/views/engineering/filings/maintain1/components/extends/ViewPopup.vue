<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showCancelBtn="false"
    :title="title"
    :destroy-on-close="true"
    style="position: relative; background-color: red"
    class="top-0"
    contentHeight="100%">
    <div class="lydc-basic-cell-content">
      <div style="display: flex; height: 100%; border-bottom: 1px solid #d9d9d9">
        <div style="width: 100%; border-right: 1px solid #d9d9d9" class="pt-8px">
          <Subtitle
            :title="t('views.finalFilingForm.exportMainlandFilingForm')"
            class="mt-2px pl-12px pr-12px"
            style="padding-bottom: 8px"
            :extra="{ show: state.type == 'add', hideAdd: true }">
          </Subtitle>
          <BasicForm @register="registerExportMainlandForm"></BasicForm>
        </div>
        <div style="width: 100%" class="pt-8px">
          <Subtitle
            :title="t('views.finalFilingForm.outboundFilingForm')"
            class="mt-2px pl-12px pr-12px"
            style="padding-bottom: 8px"
            :extra="{ show: state.type == 'add', hideAdd: true }">
          </Subtitle>
          <BasicForm @register="registerExportOutboundForm"></BasicForm>
        </div>
      </div>
      <div class="lydc-basic-cell-footer">
        <div>
          历史记录：
          <a-select
            style="width: 200px"
            v-model:value="innerValue"
            v-bind="getSelectBindValue"
            :options="options"
            @change="onChange"
            @click="openSelectModal" />
        </div>
        <div>
          <a-button @click="handleClose">{{ t('common.cancelText') }}</a-button>
          <a-button @click="handleClose" type="primary" class="ml-8px">{{ t('common.submit') }}</a-button>
        </div>
      </div>
    </div>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, computed } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Subtitle } from '/@/components/Subtitle';
  import { BasicForm, useForm } from '/@/components/Form';
  import { baseFormConfig, outboundFormConfig } from './config';
  import { getFilingsCustomerDetail } from '/@/api/customerSerivce/index';

  const emits = defineEmits(['register', 'refresh']);

  interface State {
    type: 'view' | 'add';
    Id: string;
    role: string;
    title: string;
    base: any;
    tableList: any[];
    tempList: any[];
    innerMaterialNumList: any[];
    harhorList: any[];
    factoryList: any[];
    customerList: any[];
    langList: any[];
    shipmentList: any[];
    fetching: boolean;
    line: number;
    innerValue: any;
    options: any[];
  }

  const { t } = useI18n();
  const state = reactive<State>({
    type: 'add',
    role: '',
    base: {},
    Id: '',
    title: '',
    tableList: [],
    tempList: [],
    innerMaterialNumList: [],
    harhorList: [],
    factoryList: [],
    customerList: [],
    langList: [
      {
        id: 1,
        fullName: '英文',
      },
      {
        id: 2,
        fullName: '中文',
      },
    ],
    shipmentList: [],
    fetching: false,
    line: 1,
    innerValue: '',
    options: [],
  });
  const { title, innerValue, options } = toRefs(state);

  const getSelectBindValue = computed(() => {
    return {
      // value: innerValue.value,
      // disabled: false,
      // allowClear: true,
      // size: 'default',
      placeholder: '请选择',
      // onChange: onChange,
      // onSearch: onChange,
      // onSelect: onChange,
      // onFocus: onChange,
      // onBlur: onChange,
    };
  });

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const [registerExportMainlandForm, { setFieldsValue: setBaseInfoFieldsValue }] = useForm({
    schemas: baseFormConfig,
    layout: 'vertical',
    labelWidth: 120,
    baseColProps: {
      span: 8,
    },
    baseRowStyle: {
      'margin-left': '4px',
      'margin-right': '4px',
    },
  });
  const [registerExportOutboundForm, { setFieldsValue: setOutboundFieldsValue }] = useForm({
    schemas: outboundFormConfig,
    layout: 'vertical',
    labelWidth: 120,
    baseColProps: {
      span: 8,
    },
    baseRowStyle: {
      'margin-left': '4px',
      'margin-right': '4px',
    },
  });

  async function init(data) {
    state.title = data?.title || t('common.detailText');
    changeLoading(true);
    try {
      const res = await getFilingsCustomerDetail(data.ids);
      if (res.code == 200) {
        state.base = res.data;
        setBaseInfoFieldsValue(res.data);
      }
    } catch (error) {
      // closePopup();
    }
    changeLoading(false);
  }
  function handleClose() {
    closePopup();
  }
  function onChange() {
    // options.value = [];
    // emit('change', '', {});
  }
  async function openSelectModal() {
    // if (props.disabled) return;
    // visible.value = true;
    // nextTick(() => {
    //   getForm().resetFields();
    //   setSelectedRowKeys(innerValue.value ? [innerValue.value] : []);
    // });
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

    .lydc-basic-cell-footer {
      // position: fixed;
      bottom: 16px;
      right: 8px;
      padding: 16px 16px 6px;
      display: flex;
      justify-content: space-between;
    }
  }
</style>
