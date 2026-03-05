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
      <InspectionInfoFrom ref="inspectionInfoFromRef" />
      <BaseInfo ref="baseInfoRef" />
      <OtherBasicInfo ref="otherBasicInfoRef" />
    </ScrollContainer>
  </BasicPopup>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { computed, onMounted, reactive, ref, unref } from 'vue';
  import { ScrollContainer } from '/@/components/Container';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import InspectionInfoFrom from './InspectionInfoFrom/index.vue';
  import BaseInfo from './BaseInfo/index.vue';
  import OtherBasicInfo from './OtherBasicInfo/index.vue';
  import { addIqcapply, getApplyOrder, updateIqcapply } from '/@/api/qms/iqc';

  interface IState {
    id: string;
    factoryArea: string;
  }

  const state = reactive<IState>({
    id: '',
    factoryArea: '',
  });
  const { t } = useI18n();
  const inspectionInfoFromRef = ref();
  const baseInfoRef = ref();
  const otherBasicInfoRef = ref();

  const emits = defineEmits(['reload']);
  const { createMessage, createConfirm } = useMessage();

  const [registerPopup, { closePopup, changeLoading, changeOkLoading }] = usePopupInner(init);

  const getTitle = computed(() => (state.id ? t('common.editText') : t('common.startTesting')));

  onMounted(() => {});

  async function init(data) {
    const { id, factoryArea } = data;
    state.factoryArea = factoryArea;
    state.id = id;
    if (id) {
      getApplyOrderFn({ id });
    } else if (factoryArea) {
      unref(inspectionInfoFromRef).initFn({ tableData: { materialCodeFacatoryArea: factoryArea } }); // 默认材料厂区
    }
  }

  async function getApplyOrderFn(params) {
    changeLoading(true);
    try {
      const { data, code } = await getApplyOrder(params);
      if (code === 200) {
        if (data?.purchaseReceiptOrders?.length) {
          unref(inspectionInfoFromRef).initFn({ tableData: data.purchaseReceiptOrders[0] });
        }
        unref(baseInfoRef).initFn({ tableData: data });
        unref(otherBasicInfoRef).initFn({ tableData: data });
      }
    } catch (error) {
      console.log(error);
    } finally {
      changeLoading(false);
    }
  }

  async function handleSubmit(type = 1) {
    changeLoading(true);
    try {
      const [inspectionInfoFromParams, baseInfoParams, otherBasicInfoParams] = await Promise.all([
        unref(inspectionInfoFromRef).getParamsFn(1),
        unref(baseInfoRef).getParamsFn(1),
        unref(otherBasicInfoRef).getParamsFn(1),
      ]);
      if ([inspectionInfoFromParams, baseInfoParams, otherBasicInfoParams].includes(false)) return;
      const params = {
        id: state.id,
        purchaseReceiptOrders: [inspectionInfoFromParams],
        ...otherBasicInfoParams,
        ...baseInfoParams,
        factoryArea: state.factoryArea,
      };
      if (params.notifyPeopleId) {
        params.notifyPeopleId = params.notifyPeopleId.join(',');
      }
      const api = state.id ? updateIqcapply : addIqcapply;
      const { code, msg } = await api(params);
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
</script>

<style lang="less" scoped>
  .scroll-tab {
    position: absolute;
    left: 210px;
    display: flex;
    border-left: 2px solid #e5e5e5;
    height: 40px;
    padding-left: 20px;

    &-item {
      width: 60px;
      height: 44px;
      line-height: 46px;
      margin-right: 12px;
      text-align: center;
    }
  }

  .active-btn {
    border-bottom: 4px solid @primary-color;
  }

  .print-icon {
    cursor: pointer;
    margin-right: 12px;

    i {
      font-size: 26px;

      &:hover {
        color: @primary-color;
      }
    }
  }
</style>
