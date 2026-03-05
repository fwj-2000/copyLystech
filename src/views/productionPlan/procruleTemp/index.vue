<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center bg-white">
      <div class="lydc-search-block">
        <div class="w-[260px] m-r-16px">
          <LydcInput
            suffixIcon="icon-ym icon-ym-search"
            v-model:value="state.processName"
            @pressEnter="getProcessrulestemplateFn"
            allow-clear
            :placeholder="t('dict.CommonCol.processType')"
            @change="handlerValChangeFn('processName')" />
        </div>

        <LydcSelect
          v-model:value="state.operationType"
          allowClear
          :fieldNames="{ label: 'fullName', value: 'enCode' }"
          :options="state.operationTypeList"
          @change="handlerValChangeFn('operationType')"
          style="width: 140px" />

        <a-button @click="getProcessrulestemplateFn" class="ml-16px">{{ t('common.searchText') }}</a-button>
      </div>

      <div class="lydc-content-wrapper-content p-16px">
        <div class="lydc-new-template lydc-temp-block" @click="handlerTemplateFn('')">
          <PlusOutlined />
          <span> {{ t('common.newTemplate') }}</span>
        </div>
        <div v-for="item in state.list" :key="item.createTime" class="lydc-temp-block">
          <TempCard :data="item" @delFn="delFn(item)" @editFn="editFn(item)" @toggleFn="toggleFn(item)" @viewFn="viewFn(item)" @copyFn="copyFn(item)" />
        </div>

        <div class="lydc-temp-block pre-set-temp" v-for="item in preSetTempList" :key="item.name" :style="{ backgroundImage: item.img }">
          <div class="hover-modal">
            <div class="hover-modal-btn" @click="showDemoModal(item)"> {{ t('common.previewText') }} </div>
            <div class="hover-modal-btn" @click="useTempFn(item)"> {{ t('common.quoteText') }} </div>
          </div>
          <img :src="item.img" style="width: 100%" alt="" />
          <div class="pre-set-temp-title"> {{ t('common.exampleTemplate') }}({{ item.name }}) </div>
        </div>
      </div>
    </div>
    <NewTempPop @register="registerNewTempPop" @refresh="init" />
    <tempDemo @register="registerDemoModal" @onEdit="useTempFn" />
  </div>
</template>
<script setup lang="ts">
  import { PlusOutlined } from '@ant-design/icons-vue';
  import TempCard from './components/tempCard.vue';
  import { onMounted, reactive } from 'vue';
  import { usePopup } from '/@/components/Popup';
  import { useModal } from '/@/components/Modal';
  import NewTempPop from './components/newTempPop.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getProcessrulestemplate, delteProcrulesTemp, updatestatus } from '/@/api/basicData/processrulestemplate';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useBaseStore } from '/@/store/modules/base';
  import { usePermission } from '/@/hooks/web/usePermission';
  import bggx from '/@/assets/images/process/bggx.png';
  import lzgx from '/@/assets/images/process/lzgx.png';
  import ydy from '/@/assets/images/process/ydy.png';
  import tempDemo from './components/tempDemo.vue';

  const preSetTempList = [
    {
      name: '预打印标签',
      type: '3',
      img: ydy,
      isShowOperator: false,
    },
    {
      name: '报工工序',
      type: '2',
      img: bggx,
      isShowOperator: false,
    },
    {
      name: '流转工序',
      type: '1',
      img: lzgx,
      isShowOperator: false,
    },
  ];
  const { hasBtnP } = usePermission();
  const { createMessage, createConfirm } = useMessage();

  const baseStore = useBaseStore();

  defineOptions({ name: 'productionPlan-procruleTemp' });

  const { t } = useI18n();

  const [registerNewTempPop, { openPopup: openNewTempPop }] = usePopup();
  const [registerDemoModal, { openModal: openDemoModal }] = useModal();

  interface State {
    list: any[];
    processName: string;
    operationTypeList: any[];
    operationType: string;
  }

  const state = reactive<State>({
    list: [],
    processName: '',
    operationTypeList: [],
    operationType: '',
  });

  function showDemoModal(item) {
    console.log(item);
    openDemoModal(true, { id: '', item, title: t('common.view') });
  }

  function handlerValChangeFn(field) {
    if (!state[field]) {
      getProcessrulestemplateFn();
    }
  }

  function handlerTemplateFn(id: string = '', type = ''): void {
    if (!hasBtnP('btn_add')) {
      createMessage.warning(t('dict.CommonCol.addTemplatesNoPermission'));
      return;
    }
    openNewTempPop(true, { id, title: id ? t('common.editTemplate') : t('common.newTemplate'), type });
  }

  function useTempFn(item) {
    openNewTempPop(true, { title: t('common.newTemplate'), operationType: item.type });
  }
  async function getProcessrulestemplateFn() {
    const { processName, operationType } = state;
    const { code, data } = await getProcessrulestemplate({ processName, operationType });
    if (code == 200) {
      state.list = data.list;
    }
  }

  async function updatestatusFn({ id, status }) {
    try {
      const { code, msg } = await updatestatus(id, status);
      if (code == 200) {
        createMessage.success(msg);
      } else {
        createMessage.warning(msg);
      }
    } catch (error) {
      console.error(error);
    } finally {
      init();
    }
  }

  function delFn(e) {
    if (!hasBtnP('btn_remove')) {
      createMessage.warning(t('dict.CommonCol.deleteTemplatesNoPermission'));
      return;
    }
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.delTip'),
      onOk: async () => {
        try {
          delteProcrulesTemp(e.id).then(res => {
            createMessage.success(res.msg);
          });
          setTimeout(() => {
            init();
          }, 600);
        } catch (error) {
          console.error(error);
        }
      },
    });
  }

  function toggleFn({ id, status }) {
    updatestatusFn({ id, status });
  }

  function editFn(e) {
    if (!hasBtnP('btn_add')) {
      createMessage.warning(t('dict.CommonCol.editTemplatesNoPermission'));
      return;
    }
    handlerTemplateFn(e.id);
  }

  function viewFn(e) {
    showDemoModal({ type: e.operationType, id: e.id });
  }

  function copyFn(e) {
    if (!hasBtnP('btn_add')) {
      createMessage.warning(t('dict.CommonCol.editTemplatesNoPermission'));
      return;
    }
    handlerTemplateFn(e.id, 'copy');
    // showDemoModal({ type: e.operationType, id: e.id, model: 'copy' });
  }

  function init() {
    getProcessrulestemplateFn();
  }

  onMounted(async () => {
    init();
    // const allItem = {
    //   fullName: '全部',
    //   enCode: '',
    // };
    const list: any = await baseStore.getDictionaryData('ProcessRules.OperationType');
    state.operationTypeList = list;
    // state.operationType = state.operationTypeList[0].enCode;
  });
</script>

<style scoped lang="less">
  .lydc-new-template {
    border: 1px dashed#ff7b00;
    text-align: center;
    height: 184px;
    line-height: 184px;
    color: #ff7b00;
    cursor: pointer;
  }

  .lydc-content-wrapper {
    &-content {
      flex: none !important;
      overflow: auto !important;
      display: grid !important;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); /* 自适应列宽 */
      grid-gap: 20px 24px; /* 仅设置行间距为 20px */ /* 仅设置列间距为 10px */
    }

    &-center {
      overflow-y: auto;
      scrollbar-width: thin;
    }
  }

  .lydc-search-block {
    display: flex;
    align-items: center;
    padding: 16px 0 0;

    button,
    input {
      border-radius: 4px;
    }
  }

  .lydc-temp-block {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .pre-set-temp {
    width: 100%;
    height: 184px;
    border-radius: 4px;
    overflow: hidden;
    position: relative;

    &:hover {
      .hover-modal {
        visibility: visible;
      }
    }

    &-title {
      height: 48px;
      display: flex;
      width: 100%;
      align-items: center;
      position: absolute;
      bottom: 0;
      left: 0;
      background-color: #f6f6f6;
      border: 1px solid #e9e9e9;
      padding-left: 16px;
    }
  }

  .hover-modal {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    background: rgb(0 0 0 / 30%);
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 144px;
    padding: 0 80px;
    visibility: hidden;
    transition: all 0.1s;

    &-btn {
      height: 34px;
      color: #fff;
      border: 1px solid #fff;
      border-radius: 90px;
      padding: 6px 24px;

      &:hover {
        background: rgb(255 255 255 / 30%);
        cursor: pointer;
        transition: all 0.1s;
      }

      &:active {
        background: rgb(0 0 0 / 20%);
        color: #fff;
      }
    }
  }
</style>
