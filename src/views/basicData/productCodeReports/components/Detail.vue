<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    @ok="handleSaveAction"
    :showOkBtn="hasBtnP('btn_edit')"
    :okText="sign === 'review' ? '编辑' : '保存'"
    destroyOnClose
    cancelText="取消"
    title="成品内部编码查看"
    class="full-popup p-10px top-0">
    <template #insertToolbar>
      <a-space :size="10">
        <a-button v-if="state.currentData.Status == '3'" @click="handleReview" v-auth="'btn_detail'" type="primary">审核</a-button>
        <a-button v-if="state.currentData.Status == '2'" @click="handleReview" v-auth="'btn_enable'" type="primary">启用</a-button>
        <a-button v-if="state.currentData.Status == '1'" @click="handleReview" v-auth="'btn_edit'" type="primary">禁用</a-button>

        <a-button @click="handlePre" v-auth="'btn_detail'">上一条</a-button>
        <a-button @click="handleNext" v-auth="'btn_detail'" type="primary">下一条</a-button>
      </a-space>
    </template>
    <ScrollContainer> <DetailView :sign="sign" ref="detailViewRef" @changeLoading="changeLoading" /> </ScrollContainer
  ></BasicPopup>
</template>

<script lang="ts" setup>
  import DetailView from './DetailView.vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { ScrollContainer } from '/@/components/Container';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, toRefs, ref, nextTick } from 'vue';
  import { cloneDeep } from 'lodash-es';
  import { message } from 'ant-design-vue';
  import { partnumberapplyDisable, partnumberapplyEnable, partnumberapplyReview, putCustomerList } from '/@/api/basicData/productCodeApply';
  import { usePermission } from '/@/hooks/web/usePermission';

  const emit = defineEmits(['reload', 'register']);

  const { hasBtnP } = usePermission();
  const { createMessage } = useMessage();

  const detailViewRef = ref(null);
  const state = reactive({
    title: '查看详情',
    sign: 'review',
    reasonTypeOption: [],
    directCustomerList: [],
    terminalCustomerList: [],
    InsideProjectCodeOption: [],
    mainProcessOption: [],
    shipPattern: [],
    fileList: [],
    ImmediateCustomerCodeOption: [],
    mainProcess: '',
    currentData: {},
    allList: [],
  });

  const { sign } = toRefs(state);

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  async function init(data) {
    changeLoading(true);
    setTimeout(() => {
      changeLoading(false);
    }, 100);
    const cloneData = cloneDeep(data);
    delete data.cacheList;
    state.allList = cloneData.cacheList;
    state.currentData = data;
    state.sign = 'review';
    detailViewRef.value.setVisible(true, data);
  }

  function handlePre() {
    const index = state.allList.findIndex(item => item.Id === state.currentData.Id);
    if (index === 0) {
      return message.error('当前已经是第一条');
    }
    state.currentData = state.allList[index - 1];
    detailViewRef.value.initData(state.allList[index - 1]);
  }

  function handleNext() {
    const index = state.allList.findIndex(item => item.Id === state.currentData.Id);
    if (index === state.allList.length - 1) {
      return message.error('当前已经是最后一条');
    }
    state.currentData = state.allList[index + 1];
    detailViewRef.value.initData(state.allList[index + 1]);
  }

  function handleSaveAction() {
    nextTick(async () => {
      if (state.sign === 'review') {
        state.sign = 'edit';
        // detailEditRef.value.setVisible(true, state.currentData);
      } else if (state.sign === 'edit') {
        // validateFields

        changeLoading(true);
        // const values = await detailEditRef.value.validateFields();
        // if (!values) return;
        // delete values.Status;
        // values.ProductImage = state.fileList;
        const values = await detailViewRef.value.buildParams();

        putCustomerList({
          ...values,
          ProductLineCode: values.ProductLineCode.split('/')[0],
        })
          .then(({ code, msg }) => {
            if (code === 200) {
              createMessage.success(msg);
            }
            emit('reload');
            closePopup();
          })
          .catch(() => {
            changeLoading(false);
          });
        // detailEditRef.value.handleSaveAction();
      }
    });
  }

  async function handleReview() {
    // 1 生效 2 失效 3 审核

    if (state.currentData.Status === '3') {
      partnumberapplyReview([state.currentData.Id]).then(({ code, msg }) => {
        if (code === 200) {
          message.success(msg);
          state.currentData.Status = '1';
          detailViewRef.value.initData(state.currentData);
        }
      });
    } else if (state.currentData.Status === '2') {
      partnumberapplyEnable([state.currentData.Id]).then(({ code, msg }) => {
        if (code === 200) {
          message.success(msg);
          state.currentData.Status = '1';
          detailViewRef.value.initData(state.currentData);
        }
      });
    } else if (state.currentData.Status === '1') {
      partnumberapplyDisable([state.currentData.Id]).then(({ code, msg }) => {
        if (code === 200) {
          message.success(msg);
          state.currentData.Status = '2';
          detailViewRef.value.initData(state.currentData);
        }
      });
    }
  }
</script>
