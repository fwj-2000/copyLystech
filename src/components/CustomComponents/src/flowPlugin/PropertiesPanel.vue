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
          <a-tab-pane key="material" :tab="t('common.materialType')"></a-tab-pane>
        </a-tabs>
        <BasicForm @register="registerForm" @field-value-change="handleFieldValueChange" />
      </div>
    </ScrollContainer>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, onMounted, ref } from 'vue';
  import { CONDITION_OPTIONS } from './config';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useBaseStore } from '/@/store/modules/base';
  import { ScrollContainer } from '/@/components/Container';
  import { useI18n } from 'vue-i18n';
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
  const tabObj = {
    baseOptions: ['intelockTime', 'standardWorkeHours', 'standardYieldRate', 'uph', 'isReceive', 'isPrintLabel'],
    qualityOptions: ['isReadPcc', 'isFeedMaterials', 'isTransport'],
    devicesOptions: ['isNeedGlue', 'glueUseTime'],
    mouldOptions: ['isUploadProgramCode', 'uploadProgramCodeTime', 'isUploadProgramProcess', 'isUploadProgramProcessTime'],
    materialOptions: ['outboundCoolTimes', 'outboundWarnTimes', 'outboundErrorTimes', 'singleReportQty'],
  };

  const tabKey = ref('base');
  const nodesSchemes = [
    // {
    //   field: 'intelockStatus',
    //   component: 'Select',
    //   label: 'Intelock是否启用',
    //   componentProps: {
    //     options: CONDITION_OPTIONS,
    //     onChange: val => {
    //       !val && setFieldsValue({ intelockTime: null });
    //       val && setFieldsValue({ intelockTime: null });
    //     },
    //   },
    //   ifShow: opt => !!opt.values.intelockStatus && tabObj[tabKey.value + 'Options'].includes(opt.field),
    // },
    {
      field: 'intelockTime',
      component: 'InputNumber',
      label: 'Interlock时长（h）',
      // ifShow: opt => !!opt.values.intelockStatus && tabObj[tabKey.value + 'Options'].includes(opt.field),
      ifShow: opt => tabObj[tabKey.value + 'Options'].includes(opt.field),
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
    {
      field: 'isNeedCirculation',
      component: 'Select',
      label: '是否需要转出',
      componentProps: {
        options: CONDITION_OPTIONS,
      },
      ifShow: opt => {
        return tabObj[tabKey.value + 'Options'].includes(opt.field);
      },
    },
    {
      field: 'outboundCoolTimes',
      component: 'InputNumber',
      label: '出库冷却时长（h）',
      ifShow: opt => {
        return tabObj[tabKey.value + 'Options'].includes(opt.field);
      },
    },
    {
      field: 'outboundWarnTimes',
      component: 'InputNumber',
      label: '出库警告时长（h）',
      ifShow: opt => {
        return tabObj[tabKey.value + 'Options'].includes(opt.field);
      },
    },
    {
      field: 'outboundErrorTimes',
      component: 'InputNumber',
      label: '出库限制时长（h）',
      ifShow: opt => {
        return tabObj[tabKey.value + 'Options'].includes(opt.field);
      },
    },
    {
      field: 'singleReportQty',
      component: 'InputNumber',
      label: '单次报工数量',
      componentProps: {
        precision: 0,
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

  const handleFieldValueChange = (key, value) => {
    console.log(key, value, 'handleFieldValueChange');
    emits('update', state.activeKey, state.type, key, value);
  };
  function setProperties() {
    console.log('setProperties');
  }
  async function init({ data, nodeIndex, circulationType }) {
    resetFields();
    state.activeKey = data?.id;
    state.title = data?.title;
    state.type = data?.type;
    if (data) {
      const res = (await baseStore.getDictionaryData('ProcessRoute.NodeResultType')) as any[];
      const secheme =
        data.type == 'better-line'
          ? [
              {
                field: 'resultType',
                component: 'Select',
                label: '节点结果',
                componentProps: {
                  options: res || [],
                  fieldNames: {
                    label: 'fullName',
                    value: 'fullName',
                  },
                },
              },
            ]
          : nodesSchemes;
      resetSchema(secheme as any);
      setFieldsValue(data?.form);
      data?.form;
      // // 工艺路线类型为批次流转的时候，流转标签打印全部默认为是
      // if (circulationType === 1) {
      //   const _isPrintLabel = data?.form.hasOwnProperty('isPrintLabel') ? data?.form.isPrintLabel : 1;
      //   setFieldsValue({ isPrintLabel: _isPrintLabel });
      // }
      // // 工艺路线类型为单品流转的时候，第一个打印标签为是，后面的不默认
      // if (circulationType === 2 && nodeIndex === 0) {
      //   const _isPrintLabel = data?.form.hasOwnProperty('isPrintLabel') ? data?.form.isPrintLabel : 1;
      //   setFieldsValue({ isPrintLabel: _isPrintLabel });
      // }
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
