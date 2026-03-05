<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :showCancelBtn="true"
    :title="getTitle"
    :destroyOnClose="true"
    :showFooter="false"
    @ok="handleSubmit"
    :ok-text="t('common.submit')"
    class="full-popup">
    <ScrollContainer class="bg-[#ebeef5] pt-12px pr-12px">
      <Card class="mb-12px">
        <!-- <div class="mb-24px">
          <a-button type="primary" @click="handleSAPSelect">{{ t('common.selectSAP') }} </a-button>
          来料总数：
          <span class="text-[blue] text-[16px]"> {{ state.total }}</span>
        </div> -->
        <BasicForm @register="registerForm"> </BasicForm>
      </Card>

      <BaseInfo ref="baseInfoRef" />
      <OtherBasicInfo ref="otherBasicInfoRef" />
    </ScrollContainer>
    <TestingSelectModal @register="registerTesingSelectModal" @onSelect="onTesingSelect" />
  </BasicPopup>
</template>

<script setup lang="ts">
  import { Card } from 'ant-design-vue';
  import { computed, reactive, ref, unref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useBaseStore } from '/@/store/modules/base';
  import { useI18n } from '/@/hooks/web/useI18n';
  import BaseInfo from './BaseInfo/index.vue';
  import OtherBasicInfo from './OtherBasicInfo/index.vue';
  import TestingSelectModal from './TestingSelectModal.vue';
  import { useModal } from '/@/components/Modal';
  import { ScrollContainer } from '/@/components/Container';
  import { addIqcapply } from '/@/api/qms/iqc';

  interface State {
    dataForm: any;
    total: number | null;
    checkRowKeys: string;
    purchaseReceiptOrders: any;
    factoryArea: string;
  }
  const { t } = useI18n();
  const emits = defineEmits(['register', 'reload', 'onSelect']);
  const baseStore = useBaseStore();
  const { createMessage } = useMessage();

  const state = reactive<State>({
    purchaseReceiptOrders: [],
    factoryArea: '',
    checkRowKeys: '',
    dataForm: {
      parentId: '',
      parentCategory: '',
      parentOrganizeIdTree: '',
    },
    total: null,
  });
  const baseInfoRef = ref();
  const otherBasicInfoRef = ref();
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const [registerTesingSelectModal, { openModal: openTesingSelectModal }] = useModal();

  // 其他基础信息
  const SAPFormSchemas: FormSchema[] = [
    {
      field: 'searchKey',
      component: 'Input',
      label: '检验批次号',
      rules: [{ required: true, trigger: 'change', message: '必填' }],
      componentProps: {
        readonly: true,
        onClick: () => {
          openTesingSelectModal(true, { factoryArea: state.factoryArea });
        },
      },
      colProps: {
        span: 8,
      },
    },
    {
      field: 'total',
      component: 'Input',
      label: '来料总数',
      componentProps: {
        readonly: true,
      },
      colProps: {
        span: 8,
      },
    },
  ];
  const [registerForm, { validate, getFieldsValue, setFieldsValue, resetFields }] = useForm({
    schemas: SAPFormSchemas,
    labelWidth: 120,
    actionColOptions: { span: 24 },
    autoSubmitOnEnter: true,
    labelAlign: 'left',
    layout: 'vertical',
    submitFunc: handleSubmit,
    fieldMapToTime: [['dateVal', ['startTime', 'endTime']]],
  });

  const getTitle = computed(() => t('同步模具'));

  function init(data) {
    state.total = null;
    state.factoryArea = data.factoryArea;
  }

  async function handleSubmit() {
    changeLoading(true);
    try {
      const [inspectionInfoFromParams, baseInfoParams, otherBasicInfoParams] = await Promise.all([
        validate(),
        unref(baseInfoRef).formApi.validate(),
        unref(otherBasicInfoRef).formApi.validate(),
      ]);
      if ([inspectionInfoFromParams, baseInfoParams, otherBasicInfoParams].includes(false)) return;
      const params: any = {
        ...getFieldsValue(),
        ...baseInfoParams,
        ...otherBasicInfoParams,
        purchaseReceiptOrders: state.purchaseReceiptOrders,
        materialCodeSource: 'SAP',
        factoryArea: state.factoryArea,
      };
      if (params.notifyPeopleId) {
        params.notifyPeopleId = params.notifyPeopleId.join(',');
      }
      const { code, msg } = await addIqcapply(params);
      if (code === 200) {
        emits('reload');
        closePopup();
        createMessage.success(msg);
      }
    } catch (error) {
      console.log(error, '校验未通过');
    } finally {
      changeLoading(false);
    }
  }
  function handleSAPSelect(e) {
    openTestingSelectModal(true, { checkRowKeys: state.checkRowKeys });
  }

  function onTesingSelect(e) {
    let _total = 0;
    let lotNoArr: any = [];
    e.forEach(item => {
      _total += item.materialInCount;
      lotNoArr.push(item.lotNo);
    });
    state.total = _total;
    state.checkRowKeys = lotNoArr.join(',');
    state.purchaseReceiptOrders = e;
    // setFieldsValue({ purchaseReceiptOrders: e });
    setFieldsValue({ searchKey: lotNoArr.join(',') });
    setFieldsValue({ total: _total });
  }
</script>
