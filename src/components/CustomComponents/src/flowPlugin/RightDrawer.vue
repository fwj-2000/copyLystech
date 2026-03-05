<template>
  <BasicDrawer
    v-bind="$attrs"
    width="250px"
    @register="registerDrawer"
    class="lydc-logic-drawer"
    destroyOnClose
    :headerStyle="{ height: 'auto', padding: '16px' }"
    :title="state.title"
    :closable="false"
    :mask="false"
    :getContainer="null"
    :style="{ position: 'absolute' }"
    @close="handleClose">
    <template #title>
      {{ state.title }}
    </template>
    <div class="px-16px py-16px bg-white">
      <BasicForm @register="registerForm" />
    </div>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { CONDITION_OPTIONS } from './config';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useBaseStore } from '/@/store/modules/base';

  const baseStore = useBaseStore();

  const emits = defineEmits(['register', 'update']);

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
    },
    {
      field: 'intelockTime',
      component: 'InputNumber',
      label: '启用时间',
      ifShow: opt => !!opt.values.intelockStatus,
      componentProps: {
        min: 0,
      },
    },
    {
      field: 'isFeedMaterials',
      component: 'Select',
      label: '是否投料',
      componentProps: {
        options: CONDITION_OPTIONS,
      },
    },
    {
      field: 'isTransport',
      component: 'Select',
      label: '是否送检',
      componentProps: {
        options: CONDITION_OPTIONS,
      },
    },
  ];

  const [registerDrawer] = useDrawerInner(init);
  const [registerForm, { setFieldsValue, getFieldsValue, resetSchema }] = useForm({
    layout: 'vertical',
    labelWidth: 160,
    // baseColProps: { span: 6 },
    // actionColOptions: { span: 24 },
    autoSubmitOnEnter: true,
  });

  function handleClose(v) {
    console.log(v, 'v');
    const formValue = getFieldsValue();
    console.log(formValue, 'getFieldsValue');
    emits('update', formValue, state.activeKey, state.type);
  }
  async function init(data) {
    state.activeKey = data.id;
    state.title = data.title;
    state.type = data.type;
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
  }
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
</style>
