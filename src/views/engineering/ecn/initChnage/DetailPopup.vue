<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    :showCancelBtn="true"
    :cancelButtonProps="{ class: 'mr-12px' }"
    :title="t('common.reviewText')"
    destroyOnClose
    class="full-popup pb-10px">
    <template #centerToolbar>
      <a-button v-auth="'btn_recall'" :loading="saveLoading" v-if="mode === 'edit'" @click="handleSubmit('save')" type="primary" ghost
        >{{ t('common.temporarySave') }}
      </a-button>
      <a-button v-auth="'btn_download'" :loading="saveLoading" v-if="mode === 'edit'" class="mx-12px" @click="handleSubmit('commit')" type="primary"
        >{{ t('common.submit') }}
      </a-button>
    </template>
    <ScrollContainer class="scroll-container" ref="mainScroll">
      <EcnApply ref="ecnApplyRef" />
      <QuantitativeChange ref="QuantitativeChangeRef" @getPartNumberList="getPartNumberList" :applyList="ecnApplyList" />
    </ScrollContainer>
  </BasicPopup>
</template>

<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { ScrollContainer } from '/@/components/Container';
  import { reactive, ref, toRefs } from 'vue';
  import EcnApply from '/@/views/engineering/ecn/components/EcnApply.vue';
  import QuantitativeChange from '/@/views/engineering/ecn/components/QuantitativeChange.vue';
  import Template from '/@/views/engineering/pcc/pccApply/components/Template.vue';
  import { addEcn, getEcnDetail, getMasterDetail, updateEcn } from '/@/api/engineering/ecn';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { cloneDeep, isFunction } from 'lodash-es';
  import { isObject } from '/@/utils/is';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const emit = defineEmits(['reload', 'register']);

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  const ecnApplyRef = ref(null);
  const QuantitativeChangeRef = ref(null);
  const mainScroll = ref(null);
  const { createMessage } = useMessage();

  const state = reactive({
    mode: '',
    cacheList: [],
    index: 0,
    detailData: {},
    ecnApplyList: [],
    saveLoading: false,
  });

  function getPartNumberList() {
    state.ecnApplyList = ecnApplyRef.value.getDataSource();
  }

  const { mode, ecnApplyList, saveLoading } = toRefs(state);

  function init(data) {
    const { cacheList, index } = data;
    state.mode = data.mode;
    state.cacheList = cacheList;
    state.index = index;

    const currentData = cacheList[index];
    /**
     * 详情初始化分三种情况
     * 1、有ECR单号，从ECR单号申请过来需要初始化ecnApplyRef数据，只能查看ECR数据，不能修改
     * 2、无id。为工程直接新增数据。需要开启编辑
     * 3、数据来源为PCC or ED，需要新增数据，开启编辑
     */
    if (currentData) {
      console.log('🚀 ~ init ~ currentData: ', currentData);
      const { origin, id } = currentData;
      console.log('🚀 ~ init ~ origin: ', origin);
      if (origin === 'ECR') {
        // ECR
        getMasterDetail(currentData).then(({ code, data: ret }) => {
          if (code === 200) {
            ecnApplyRef.value.init({
              ...ret,
              ...data,
              origin,
              mode: 'view',
            });
            QuantitativeChangeRef.value.init({
              ...data,
              origin,
              mode: 'edit',
            });
            changeLoading(false);
          }
        });
      } else if (origin === 'PCC' || origin === 'ED') {
        // PCC
        const { cacheList } = data;
        data.partNumberList = cacheList.map(item => ({
          insidePartNumber: item.insidePartNumber,
          productDesc: item.productDesc,
          version: item.version,
          documentType: item.documentType,
          factoryName: item.factoryName,
          factoryCode: item.factoryCode,
          onEdit: true,
          editable: true,
          disabled: {
            ...(item.disabled || {}),
            productDesc: true,
            insidePartNumber: true,
          },
        }));
        ecnApplyRef.value.init({
          ...data,
          origin,
          mode: 'view',
        });
        QuantitativeChangeRef.value.init({
          ...data,
          origin,
          mode: 'edit',
        });
        changeLoading(false);
      } else {
        changeLoading(true);
        console.log('init ecn');
        console.log(data.mode, 'init ecn mode----------');
        // ECN
        getEcnDetail(currentData)
          .then(({ code, data: ret }) => {
            console.log(666, {
              ...ret,
              ...data,
              origin,
              mode: data.mode,
            });
            ecnApplyRef.value.init({
              ...ret,
              ...data,
              origin,
              mode: data.mode,
            });
            QuantitativeChangeRef.value.init({
              ...ret,
              ...data,
              origin,
              mode: data.mode,
            });
          })
          .finally(() => {
            changeLoading(false);
          });
      }
    } else {
      // 无id，纯新增
      ecnApplyRef.value.init({
        ...data,
      });
      QuantitativeChangeRef.value.init({
        ...data,
        origin: 'ECN',
        mode: 'edit',
      });
      changeLoading(false);
    }
    // if (cacheList[index]) {
    // 详情
    // getEcrDetail(cacheList[index]).then(({ code, data: ret }) => {
    //   if (code === 200) {
    //     console.log(ret);
    //     state.detailData = ret;
    //     ecnApplyRef.value.init({
    //       ...ret,
    //       ...data,
    //     });
    //     changeLoading(false);
    //   }
    // });
    // } else {
    //   // 新增
    //   ecnApplyRef.value.init({
    //     ...data,
    //     index: -1,
    //   });
    //   QuantitativeChangeRef.value.init({
    //     ...data,
    //     index: -1
    //   })
    //   state.detailData = {};
    //   setTimeout(() => {
    //     changeLoading(false);
    //   });
    // }
  }

  function handleSubmit(type: 'save' | 'commit') {
    let func;
    const { cacheList, index } = state;
    // const { origin, id } = cacheList[index];
    // const origin = cacheList[index].origin;
    // const id = cacheList[index].id;
    const partNumberData = ecnApplyRef.value.submit();
    const quantitativeData = QuantitativeChangeRef.value.submit(type === 'commit');
    console.log(quantitativeData);
    if (isFunction(quantitativeData)) return;
    const { relevanceList, countersignList } = quantitativeData;
    const { partNumberList } = partNumberData;

    const partnumList = cloneDeep(partNumberList);
    partnumList.forEach((item, index) => {
      if (cacheList[index]) {
        item.origin = cacheList[index]?.origin;
        item.originId = cacheList[index]?.id;
      }
      if (!relevanceList[index]) return;
      item.relatedFilesList = relevanceList[index].relatedFilesList.map(item => {
        const target = {
          key: isObject(item) ? item.key : item,
        };
        if (target.key === 10) {
          target.value = relevanceList[index].otherVal;
        }
        return target;
      });
    });
    const attachmentList = [...partNumberData.attachmentList, ...quantitativeData.attachmentList];
    const data = {
      ...quantitativeData,
      ...partNumberData,
      countersignList,
      attachmentList,
      partNumberList: partnumList,
    };
    if (type === 'commit') {
      data.saveAndCommit = true;
    } else {
      state.saveLoading = true;
    }
    if (cacheList[index]?.applyCode) {
      func = updateEcn;
      data.id = cacheList[index]?.id;
    } else {
      func = addEcn;
    }

    state.saveLoading = true;
    changeLoading(true);
    func(data)
      .then(({ code, msg, data }) => {
        if (code === 200) {
          emit('reload');
          closePopup();
          createMessage.success(msg);
        }
      })
      .finally(() => {
        state.saveLoading = false;
        changeLoading(false);
      });
  }
</script>
<style lang="less" scoped>
  .main-nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    background: rgb(255 255 255 / 80%);
    border-bottom: 1px solid #dbdbdb;

    .nav-item {
      display: flex;
      padding: 8px 16px;
      flex-direction: column;
      align-items: center;
      gap: -3px;
      color: #666;
      cursor: pointer;
    }

    .active {
      border-bottom: 1px solid #ff7b00;
      color: #1a1a1a;
      transition: all 0.3s;
    }
  }
</style>
