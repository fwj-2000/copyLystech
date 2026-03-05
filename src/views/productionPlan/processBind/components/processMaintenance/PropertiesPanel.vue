<template>
  <div class="h-full w-400px property-panel">
    <div class="panel-title px-16px py-12px">{{ state.title || '--' }}</div>
    <ScrollContainer class="scroll-container">
      <div class="px-16px py-16px pb-50px">
        <div class="text-[#999]" v-if="!state.title">[ {{ t('common.enterProcessNode') }} ]</div>
        <a-tabs v-model:activeKey="tabKey" size="small" class="w-240px" v-show="state.title">
          <a-tab-pane key="base" :tab="t('common.basicType')"></a-tab-pane>
          <a-tab-pane key="quality" :tab="t('common.qualityType')"></a-tab-pane>
          <a-tab-pane key="devices" :tab="t('common.deviceType')"></a-tab-pane>
          <a-tab-pane key="mould" :tab="t('common.mouldType')"></a-tab-pane>
        </a-tabs>
        <BasicForm @register="registerForm" @field-value-change="handleFieldValueChange" />
      </div>
    </ScrollContainer>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, onMounted, ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useBaseStore } from '/@/store/modules/base';
  import { ScrollContainer } from '/@/components/Container';
  import { useI18n } from 'vue-i18n';
  const { t } = useI18n();
  const baseStore = useBaseStore();

  const emits = defineEmits(['register', 'update']);

  defineExpose({ init });
  const CONDITION_OPTIONS = [
    { id: 1, fullName: t('status.yes') },
    { id: 0, fullName: t('status.no') },
  ];
  interface State {
    title: string;
  }
  const state = reactive<State>({
    title: '',
  });
  const tabObj = {
    baseOptions: ['intelockStatus', 'intelockTime', 'standardWorkeHours', 'standardYieldRate', 'uph', 'isReceive', 'isPrintLabel'],
    qualityOptions: ['isReadPcc', 'isFeedMaterials', 'isTransport'],
    devicesOptions: ['isNeedGlue', 'glueUseTime'],
    mouldOptions: ['isUploadProgramCode', 'uploadProgramCodeTime', 'isUploadProgramProcess', 'isUploadProgramProcessTime'],
  };
  const tabKey = ref('base');
  const nodesSchemes = [
    {
      field: 'intelockStatus',
      component: 'Select',
      label: 'Intelock是否启用',
      componentProps: {
        options: CONDITION_OPTIONS,
        onChange: val => {
          !val && setFieldsValue({ intelockTime: null });
          val && setFieldsValue({ intelockTime: null });
        },
      },
      ifShow: opt => !!opt.values.intelockStatus && tabObj[tabKey.value + 'Options'].includes(opt.field),
    },
    {
      field: 'intelockTime',
      component: 'InputNumber',
      label: '启用时间',
      ifShow: opt => !!opt.values.intelockStatus && tabObj[tabKey.value + 'Options'].includes(opt.field),
      componentProps: {
        min: 0,
      },
    },
    {
      field: 'isReadPcc',
      component: 'Select',
      label: '是否需要查阅PCC',
      componentProps: {
        options: CONDITION_OPTIONS,
      },
      ifShow: opt => {
        return tabObj[tabKey.value + 'Options'].includes(opt.field);
      },
    },
    {
      field: 'standardWorkeHours',
      component: 'Input',
      label: '标准工时',
      ifShow: opt => {
        return tabObj[tabKey.value + 'Options'].includes(opt.field);
      },
    },
    {
      field: 'standardYieldRate',
      component: 'Input',
      label: '标准良率',
      ifShow: opt => {
        return tabObj[tabKey.value + 'Options'].includes(opt.field);
      },
    },
    {
      field: 'uph',
      component: 'Input',
      label: 'UPH',
      ifShow: opt => {
        return tabObj[tabKey.value + 'Options'].includes(opt.field);
      },
    },
    {
      field: 'isFeedMaterials',
      component: 'Select',
      label: '是否投料',
      componentProps: {
        options: CONDITION_OPTIONS,
      },
      ifShow: opt => {
        return tabObj[tabKey.value + 'Options'].includes(opt.field);
      },
    },
    {
      field: 'isTransport',
      component: 'Select',
      label: '是否送检',
      componentProps: {
        options: CONDITION_OPTIONS,
      },
      ifShow: opt => {
        return tabObj[tabKey.value + 'Options'].includes(opt.field);
      },
    },
    {
      field: 'isUploadProgramCode',
      component: 'Select',
      label: '是否上传程序代码',
      componentProps: {
        options: CONDITION_OPTIONS,
      },
      ifShow: opt => {
        return tabObj[tabKey.value + 'Options'].includes(opt.field);
      },
    },
    {
      field: 'uploadProgramCodeTime',
      component: 'ApiSelect',
      label: '上传时间',
      ifShow: opt => !!opt.values.isUploadProgramCode && tabObj[tabKey.value + 'Options'].includes(opt.field),
      componentProps: {
        api: () => {
          return baseStore.getDictionaryData('uploadTimeNode');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
    },
    {
      field: 'isUploadProgramProcess',
      component: 'Select',
      label: '是否上传程序工艺',
      componentProps: {
        options: CONDITION_OPTIONS,
      },
      ifShow: opt => {
        return tabObj[tabKey.value + 'Options'].includes(opt.field);
      },
    },
    {
      field: 'isUploadProgramProcessTime',
      component: 'ApiSelect',
      ifShow: opt => !!opt.values.isUploadProgramProcess && tabObj[tabKey.value + 'Options'].includes(opt.field),
      label: '上传时间',
      componentProps: {
        api: () => {
          return baseStore.getDictionaryData('uploadTimeNode');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
    },

    {
      field: 'isReceive',
      component: 'Select',
      label: '是否需要接收物料',
      componentProps: {
        options: CONDITION_OPTIONS,
      },
      ifShow: opt => {
        return tabObj[tabKey.value + 'Options'].includes(opt.field);
      },
    },
    {
      field: 'isNeedGlue',
      component: 'Select',
      label: '是否需要胶水',
      componentProps: {
        options: CONDITION_OPTIONS,
      },
      ifShow: opt => {
        return tabObj[tabKey.value + 'Options'].includes(opt.field);
      },
    },
    {
      field: 'glueUseTime',
      component: 'Input',
      label: '胶水使用有效期',
      ifShow: opt => {
        return !!opt.values.isNeedGlue && tabObj[tabKey.value + 'Options'].includes(opt.field);
      },
    },
    {
      field: 'isPrintLabel',
      component: 'Select',
      label: '是否需要打印标签',
      componentProps: {
        options: CONDITION_OPTIONS,
      },
      ifShow: opt => {
        return tabObj[tabKey.value + 'Options'].includes(opt.field);
      },
    },
  ];

  const [registerForm, { setFieldsValue, resetSchema, resetFields }] = useForm({
    layout: 'vertical',
    labelWidth: 160,
    // baseColProps: { span: 6 },
    // actionColOptions: { span: 24 },
    autoSubmitOnEnter: true,
  });

  // form表单数据发生改变后要修改父组件的节点数组数据
  const handleFieldValueChange = (key, value) => {
    emits('update', key, value);
  };

  async function init(data) {
    resetFields();
    tabKey.value = 'base';
    state.title = data?.title;
    if (data) {
      resetSchema(nodesSchemes as any);
      setFieldsValue(data?.currentNodeDetail);
      const _isPrintLabel = data?.currentNodeDetail.hasOwnProperty('isPrintLabel') ? data?.currentNodeDetail.isPrintLabel : 0;
      const _isReceive = data?.currentNodeDetail.hasOwnProperty('isReceive') ? data?.currentNodeDetail.isReceive : 1;

      setFieldsValue({ isPrintLabel: _isPrintLabel, isReceive: _isReceive });
    } else {
      resetSchema([]);
      setFieldsValue({});
    }
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

      /* 中文/正文14 */

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
