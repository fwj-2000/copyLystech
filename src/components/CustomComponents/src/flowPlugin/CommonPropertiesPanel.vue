<template>
  <div class="h-full w-400px property-panel">
    <div class="panel-title px-16px py-12px">{{ state.title || '--' }}</div>
    <ScrollContainer class="scroll-container">
      <div class="px-16px py-16px pb-50px">
        <div class="text-[#999]" v-if="!state.title">[ {{ t('common.enterProcessNode') }} ]</div>
        <!-- <a-tabs v-model:activeKey="tabKey" size="small" class="w-240px" v-show="state.title">
          <a-tab-pane key="base" :tab="t('common.basicType')"></a-tab-pane>
          <a-tab-pane key="quality" :tab="t('common.qualityType')"></a-tab-pane>
          <a-tab-pane key="devices" :tab="t('common.deviceType')"></a-tab-pane>
          <a-tab-pane key="mould" :tab="t('common.mouldType')"></a-tab-pane>
        </a-tabs> -->
        <BasicForm @register="registerForm" @field-value-change="handleFieldValueChange" />
      </div>
    </ScrollContainer>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, onMounted, ref } from 'vue';
  import { STATUS_OPTIONS } from './config';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useBaseStore } from '/@/store/modules/base';
  import { ScrollContainer } from '/@/components/Container';
  import { useI18n } from 'vue-i18n';
  import { format } from 'path';
  const { t } = useI18n();
  const baseStore = useBaseStore();

  const emits = defineEmits(['register', 'update']);

  defineExpose({ setProperties, init });

  interface State {
    activeKey: string;
    activeName: string;
    dataForm: any;
    title: string;
    type: string;
    nodesStatusOptions: any[];
  }
  const state = reactive<State>({
    activeKey: '',
    activeName: '',
    title: '',
    type: '',
    dataForm: {
      intelockStatus: '',
    },
    nodesStatusOptions: [],
  });

  const edgesFormSchemes = [
    {
      field: 'branchType',
      component: 'ApiSelect',
      label: '分支类型',
      componentProps: {
        api: () => {
          return baseStore.getDictionaryData('FlowBranchType');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
    },
    {
      field: 'condition',
      component: 'Input',
      label: '流转条件',
    },
  ];

  const nodesFormSchemes = [
    {
      field: 'nodeType',
      component: 'ApiSelect',
      label: '节点类型',
      ifShow: opt => !!opt.values.isUploadProgramCode && tabObj[tabKey.value + 'Options'].includes(opt.field),
      componentProps: {
        api: () => {
          return baseStore.getDictionaryData('flowNodeType');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
    },
    {
      field: 'handler',
      component: 'CustomUserSelect',
      label: '处理人',
      componentProps: {},
      // ifShow: opt => !!opt.values.intelockStatus,
    },
    {
      field: 'handlerType',
      component: 'ApiSelect',
      label: '处理人类型',
      componentProps: {
        api: () => {
          return baseStore.getDictionaryData('flowHandlerType');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
    },
    {
      field: 'withdrawWay',
      component: 'ApiSelect',
      label: '撤回条件',
      componentProps: {
        api: () => {
          return baseStore.getDictionaryData('flowWithdrawWay');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
    },
    {
      field: 'rejectWay',
      component: 'ApiSelect',
      label: '驳回方式',
      componentProps: {
        api: () => {
          return baseStore.getDictionaryData('flowRejectWay');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
    },
    {
      field: 'rejectNode',
      component: 'Input',
      label: '驳回节点',
      ifShow: opt => opt.values.rejectWay === '4',
    },
    {
      field: 'handleWay',
      component: 'ApiSelect',
      label: '处理方式',
      componentProps: {
        api: () => {
          return baseStore.getDictionaryData('flowHandleWay');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
    },
    {
      field: 'sendMsg',
      component: 'Select',
      label: '是否发送通知消息',
      componentProps: {
        options: STATUS_OPTIONS,
      },
    },
    {
      field: 'msgTemplate',
      component: 'Input',
      label: '消息文本Key',
    },
    {
      field: 'url',
      component: 'Input',
      label: 'URL链接：',
    },
    {
      field: 'remark',
      component: 'Input',
      label: '备注',
    },
  ];

  const [registerForm, { setFieldsValue, resetSchema, resetFields, getFieldsValue }] = useForm({
    layout: 'vertical',
    labelWidth: 160,
    // baseColProps: { span: 6 },
    // actionColOptions: { span: 24 },
    autoSubmitOnEnter: true,
  });

  const handleFieldValueChange = (key, value) => {
    emits('update', state.activeKey, state.type, key, value, getFieldsValue());
  };
  function setProperties() {
    console.log('setProperties');
  }
  async function init(data) {
    resetFields();
    state.activeKey = data?.id;
    state.title = data?.title;
    state.type = data?.type;
    if (data) {
      const secheme = data.type == 'better-line' ? edgesFormSchemes : nodesFormSchemes;
      resetSchema(secheme as any);
      const formValue: any = formatFieldsValue(data?.form);
      setFieldsValue(formValue);
      // const _isPrintLabel = data?.form.hasOwnProperty('isPrintLabel') ? data?.form.isPrintLabel : 1;
      // setFieldsValue({ isPrintLabel: _isPrintLabel });
    } else {
      resetSchema([]);
      setFieldsValue({});
    }
  }

  function formatFieldsValue(form) {
    if (!form) return {};
    // 需要转成字符串回显的字段
    const strKey = ['branchType', 'nodeType', 'handlerType', 'withdrawWay', 'rejectWay', 'handleWay', 'sendMsg'];
    strKey.forEach(key => {
      if (form[key]) {
        form[key] = form[key].toString();
      }
    });
    return form;
  }
  onMounted(() => {});
</script>
<style lang="less" scoped>
  .lydc-logic-drawer {
    .ant-collapse {
      border-top: 1px solid @border-color-base1;

      .ant-collapse-item {
        border-bottom: 1px solid @border-color-base1;
      }
    }

    .lydc-code-box {
      background: #848484;
      padding: 15px;
      color: #fff;
      font-size: 12px;
      border-radius: 4px;
    }
  }

  :deep(.ant-drawer-title) {
    white-space: normal !important;
    word-break: break-all;
  }

  .property-panel {
    .panel-title {
      color: #1a1a1a;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px; /* 157.143% */
      width: 100%;
      min-height: 44px;
      box-shadow: 0 4px 4px 0 rgb(0 0 0 / 7%);
    }
  }
</style>
