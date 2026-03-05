<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :showCancelBtn="false"
    :okText="t('common.submit')"
    :title="t('dict.ProductTypeColumn.Maintenance')"
    @ok="() => handleSave(true)"
    class="full-popup popup-top">
    <template #insertToolbar>
      <a-button @click="showHistoryModal" class="mr-12px">{{ t('common.quotaHistory') }}</a-button>
      <a-button :loading="translating" class="mr-12px" @click="handleTranslate">
        {{ t('sys.lang.translate') }}
      </a-button>
    </template>
    <template #centerToolbar>
      <a-button class="ml-12px" :loading="isLoading" @click="() => handleSave(false)" type="primary" ghost>{{ t('common.temporarySave') }}</a-button>
    </template>
    <div v-if="!loading" class="h-full p-10px container-box" :class="{ 'half-container-item': isShowProduce }">
      <div class="container-item">
        <EngineerEditTable ref="engineerEditTableRef" />
      </div>
      <div v-if="isShowProduce" class="container-item">
        <ProduceEditTable ref="produceEditTableRef" />
      </div>
    </div>

    <HistoryModal @register="registerHistoryModal" @submit="handleQutaHistory" />
  </BasicPopup>
</template>

<script lang="ts" setup>
  import { nextTick, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getDict } from './ApplyPopConfig';
  import { getDetail, save, temporaryStorage } from '/@/api/engineering/customsAffairsEngineering';
  import { useModal } from '/@/components/Modal';

  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import EngineerEditTable from './ApplyPopEditTable.vue';
  import ProduceEditTable from '/@/views/productionDeal/fillings/maintain/components/ApplyPopEditTable.vue';
  import HistoryModal from './historyModal.vue';

  const { t } = useI18n();
  const emits = defineEmits(['register', 'reload']);

  const [registerPopup, { closePopup, changeOkLoading, changeLoading }] = usePopupInner(init);

  const { createMessage } = useMessage();
  const engineerEditTableRef = ref<InstanceType<typeof EngineerEditTable>>();
  const produceEditTableRef = ref<InstanceType<typeof ProduceEditTable>>();

  const ids = ref<Array<string>>([]);

  /** 是否展示`生产备案资料` */
  const isShowProduce = ref<boolean>(false);

  async function init(data: { ids?: Array<string> }) {
    isShowProduce.value = false;
    await getDict();

    return nextTick(() => {
      if (data.ids && data.ids.length > 0) {
        ids.value = Array.isArray(data.ids) ? data.ids : (data.ids as string).split(',');

        getTableData(data.ids);
      }
    });
  }

  const loading = ref<boolean>(false);
  function getTableData(ids: Array<string>) {
    changeLoading(true);
    getDetail(ids.join(','))
      .then(res => {
        const data = res?.data || {};

        // 判断是否展示`生产备案资料`
        const productData = data?.affairsProduceOutputs || [];
        isShowProduce.value = productData.length > 0;
        return data;
      })
      .then(data => {
        nextTick(() => {
          initTableData(data, ids);
        });
      })
      .catch(() => {
        closePopup();
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  /**
   * 初始化表格数据
   * @param data
   * @param ids
   */
  function initTableData(data: any, ids: Array<string>) {
    const { affairsEngineeringOutputs, translateEngineeringOutputs, affairsProduceOutputs } = data || {};
    const engineerData = [
      ...(affairsEngineeringOutputs || []),
      ...(translateEngineeringOutputs || []).map(item => {
        item.isTranslate = true;
        return item;
      }),
    ];
    defaultFilingsLanguage.value = affairsEngineeringOutputs?.[0]?.filingsLanguage || '';
    engineerEditTableRef.value && engineerEditTableRef.value.initTableData(engineerData, ids);

    const productData = affairsProduceOutputs || [];
    isShowProduce.value &&
      nextTick(() => {
        produceEditTableRef.value && produceEditTableRef.value.initTableData(productData, ids);
      });
  }

  /** 记录初始化备案语言 */
  const defaultFilingsLanguage = ref<string>('');
  const [registerHistoryModal, { openModal: openHistoryModal }] = useModal();
  /**
   * 打开历史数据弹窗
   */
  function showHistoryModal() {
    openHistoryModal(true, { filingsLanguage: defaultFilingsLanguage.value });
  }

  /**
   * 引用历史数据弹窗
   * @param data 引用数据
   */
  function handleQutaHistory(data: any) {
    engineerEditTableRef.value && engineerEditTableRef.value.qutaHistory(data);
  }

  const translating = ref<boolean>(false);
  /** 翻译 */
  function handleTranslate() {
    if (!engineerEditTableRef.value) {
      return false;
    }
    translating.value = true;
    engineerEditTableRef.value.handleTranslate().finally(() => {
      translating.value = false;
    });
  }

  const isLoading = ref<boolean>(false);
  /**
   * 设置加载状态
   * @param loading
   */
  function setLoading(loading = false) {
    changeLoading(loading);
    changeOkLoading(loading);
    isLoading.value = loading;
  }

  /**
   * 保存
   */
  async function handleSave(isSubmit = false) {
    // 校验
    const task: Array<Promise<any>> = [];
    engineerEditTableRef.value && task.push(engineerEditTableRef.value.getTableData(isSubmit));
    produceEditTableRef.value && task.push(produceEditTableRef.value.getTableData(isSubmit));

    // 获取数据
    let engineeringData: Array<any> = [];
    let produceData: Array<any> = [];
    let flag = true;
    await Promise.all(task)
      .then(res => {
        engineeringData = res[0] || [];
        produceData = res[1] || [];
      })
      .catch(() => {
        flag = false;
      });

    if (!flag) {
      return false;
    }

    const api = isSubmit ? save : temporaryStorage;

    // 发送请求
    setLoading(true);
    return api({
      customsAffairsApplyId: ids.value.join(','),
      engineeringUpInputs: engineeringData.filter(item => !item.isTranslate),
      translateEngineerings: engineeringData.filter(item => item.isTranslate),
      produceUpInputs: produceData,
    })
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        emits('reload');
        isSubmit ? closePopup() : nextTick(() => getTableData(ids.value));
      })
      .finally(() => {
        setLoading(false);
      });
  }
</script>

<style lang="less" scoped>
  .popup-top {
    top: 0;
  }

  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  :deep(.basic-content-wrap) {
    display: inline-flex;
  }

  .basic-form {
    display: inline-block;
    width: 200px;
    margin-right: 8px;
  }

  .container-box {
    display: flex;
    flex-direction: column;
  }

  .container-item {
    flex: 1;
    min-height: 0;
    width: 100%;
  }

  .half-container-item {
    .container-item {
      flex: 0 1 50%;
    }
  }
</style>
