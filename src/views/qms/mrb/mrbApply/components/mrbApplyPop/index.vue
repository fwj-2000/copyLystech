<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="state.mode !== 'view'"
    :showCancelBtn="true"
    :title="state.title"
    :destroyOnClose="true"
    :showFooter="false"
    @ok="handleSubmit"
    @close="handleClose"
    :ok-text="t('common.temporarySave')"
    class="full-popup">
    <template #appendToolbar>
      <a-button type="primary" v-if="state.mode !== 'view'" @click="handlePublish" class="mr-12px">
        {{ t('common.submit') }}
      </a-button>
    </template>
    <ScrollContainer class="bg-[white] p-16px">
      <div>
        <BasicInfoForm ref="basicInfoFormRef" />
        <DynamicTable ref="badTypeRef" moduleCode="MrbApplyColumn" />
        <DynamicTable ref="orderBadTypeRef" moduleCode="MrbApplyColumn" />
        <MemberForm ref="memberFormRef" />
      </div>
    </ScrollContainer>
  </BasicPopup>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { nextTick, reactive, ref, unref } from 'vue';
  import { ScrollContainer } from '/@/components/Container';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useForm } from '/@/components/Form';
  import BasicInfoForm from './BasicInfoForm.vue';
  import MemberForm from './MemberForm.vue';
  import DynamicTable from './DynamicTable.vue';
  import { BADPRODUCTTYPE_COLUMNS, BADPRODUCTTYPE_COLUMNS_RELUS, ORDER_BADPRODUCTTYPE_COLUMNS, BASICINFO_SCHEMAS, MEMBER_SCHEMAS } from './config';
  import { addMrbapply, getMrbapplyDetail } from '/@/api/qms/mrb';
  interface IState {
    id: string;
    title: string;
    mode: 'add' | 'edit' | 'view';
    iqcParams: any;
  }

  const state = reactive<IState>({
    title: '',
    id: '',
    mode: 'add',
    iqcParams: {},
  });

  const basicInfoFormRef = ref();
  const badTypeRef = ref();
  const orderBadTypeRef = ref();
  const memberFormRef = ref();
  const { t } = useI18n();
  const emits = defineEmits(['reload']);
  const { createMessage } = useMessage();
  //表单
  const [registerForm, formApi] = useForm({
    schemas: [{ field: 'type', component: 'Input', label: '类型' }],
    labelWidth: 180,
    baseColProps: { span: 6 },
    actionColOptions: { span: 24 },
    autoSubmitOnEnter: true,
    submitFunc: handleSubmit,
    i18nConfig: {
      moduleCode: 'MrbApplyColumn',
      transferRange: ['placeholder'],
    },
  });

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  async function init({ data, title, mode, iqcDetails }) {
    // 通过iqc审核那边进入
    if (iqcDetails) {
      const basicData = {
        poNo: iqcDetails.purchaseNo,
        insidePartNumber: iqcDetails.innerMaterialCode,
        quantity: iqcDetails.materialInCount,
        materialType: iqcDetails.materialTypeName,
        supplierId: iqcDetails.supplierNo,
        notifiedPersons: iqcDetails.notifyPeopleId,
        factory: iqcDetails.materialCodeFacatoryArea,
        lotNo: iqcDetails.lotNo,
        relationNo: iqcDetails.testNo,
        remark: iqcDetails.remark,
        unit: iqcDetails.materialInUnit,
      };
      state.iqcParams = {
        lotNo: iqcDetails.lotNo,
        relationNo: iqcDetails.testNo,
      };

      let badTypeData: any[] = [];

      iqcDetails.ngTestItems?.forEach(element => {
        if (element.testProjectCode == '100001' && element.testItems) {
          // 外观不良
          element.testItems.forEach(ngItem => {
            const badTypeItem = { badType: '1', badRate: 100, badDescription: ngItem.badName };
            badTypeData.push(badTypeItem);
          });
        } else if (element.testProjectCode == '100002' && element.testItems) {
          // 尺寸不良
          element.testItems.forEach(ngItem => {
            const badTypeItem = { badType: '3', badRate: 100, badDescription: ngItem.badName };
            badTypeData.push(badTypeItem);
          });
        }
      });
      unref(basicInfoFormRef).initFn({ tableData: basicData });
      unref(badTypeRef)?.initFn({
        title: t('dict.MrbApplyColumn.badProductFillTitle'),
        columns: BADPRODUCTTYPE_COLUMNS,
        editRules: BADPRODUCTTYPE_COLUMNS_RELUS,
        data: badTypeData || [],
        mode,
      });
      unref(orderBadTypeRef)?.initFn({
        title: t('dict.MrbApplyColumn.workOrderBadFillTitle'),
        columns: ORDER_BADPRODUCTTYPE_COLUMNS,
        // data: detailData?.workOrderList || [],
        mode,
      });
      return;
    }
    const { id } = data;
    state.id = id;
    state.title = title;
    state.mode = mode;

    const detailData = id && (await getMrbapplyDetailFn(id));
    if (detailData) {
      const basicData = getDataByFormScemas(BASICINFO_SCHEMAS, detailData);
      const memberData = getDataByFormScemas(MEMBER_SCHEMAS, detailData);
      unref(basicInfoFormRef).initFn({ tableData: basicData, id, mode });
      const memberInfo = {
        sqeUserName: detailData.sqeUserName,
        pdUserName: detailData.pdUserName,
        purchaseUserName: detailData.purchaseUserName,
        sqeResult: detailData.sqeResult,
        pdResult: detailData.pdResult,
        purchaseResult: detailData.purchaseResult,
        sqeReviewTakeTime: detailData.sqeReviewTakeTime,
        pdReviewTakeTime: detailData.pdReviewTakeTime,
        purchaseReviewTakeTime: detailData.purchaseReviewTakeTime,
        sqeReviewTime: detailData.sqeReviewTime,
        pdReviewTime: detailData.pdReviewTime,
        purchaseReviewTime: detailData.purchaseReviewTime,
        sqeReviewRemark: detailData.sqeReviewRemark,
        pdReviewRemark: detailData.pdReviewRemark,
        purchaseReviewRemark: detailData.purchaseReviewRemark,
      };
      unref(memberFormRef).initFn({ tableData: memberData, memberInfo, id, mode });
    }
    nextTick(() => {
      unref(badTypeRef)?.initFn({
        title: t('dict.MrbApplyColumn.badProductFillTitle'),
        columns: BADPRODUCTTYPE_COLUMNS,
        editRules: BADPRODUCTTYPE_COLUMNS_RELUS,
        data: detailData?.badTypeList || [],
        mode,
      });
      unref(orderBadTypeRef)?.initFn({
        title: t('dict.MrbApplyColumn.workOrderBadFillTitle'),
        columns: ORDER_BADPRODUCTTYPE_COLUMNS,
        data: detailData?.workOrderList || [],
        mode,
      });
    });
  }

  function getDataByFormScemas(formSchema, data) {
    const obj = {};
    formSchema.forEach(item => {
      obj[item.field] = data[item.field];
    });
    return obj;
  }
  async function getMrbapplyDetailFn(params) {
    changeLoading(true);
    try {
      const { data, code } = await getMrbapplyDetail(params);
      if (code === 200) {
        return data;
      }
    } catch (error) {
      console.log(error);
    } finally {
      changeLoading(false);
    }
  }
  async function handleClose() {
    if (!state.iqcParams.relationNo) {
      return closePopup();
    }
    //router.replace({ query: {} });
    changeLoading(true);
    try {
      let params: any = {};
      const [
        basicInfoParams,
        badTypeParams,
        // orderBadTypeParams,
        //  memberFormParams
      ] = await Promise.all([
        unref(basicInfoFormRef).formApi.getFieldsValue(),
        unref(badTypeRef).getParamsFn(),
        // unref(orderBadTypeRef).getParamsFn(),
        // unref(memberFormRef).formApi.getFieldsValue(),
      ]);
      params = {
        id: state.id,
        ...basicInfoParams,
        badTypeList: badTypeParams,
        // workOrderList: orderBadTypeParams,
        // ...memberFormParams,
        isOnlyCreate: 1,
      };
      if (params.notifiedPersons) {
        params.notifiedPersons = params.notifiedPersons.join(',');
      }
      // 通过iqc审核带入参数
      if (state.iqcParams.relationNo) {
        params = { ...params, ...state.iqcParams };
      }
      const { code, msg } = await addMrbapply(params);
      if (code === 200) {
        createMessage.success(msg);
        //closePopup();
        emits('reload');
        state.iqcParams = {};
        // 获取当前路径（不含查询参数）
        const path = window.location.pathname;
        // 替换 URL（不触发页面刷新）
        window.history.replaceState({}, document.title, path);
      }
    } catch (error) {
      console.log('获取值时出现错误', error);
    } finally {
      changeLoading(false);
    }
  }

  // 发布
  function handlePublish() {
    handleSubmit(1);
  }

  // 提交草稿
  async function handleSubmit(type = 0) {
    changeLoading(true);
    try {
      let params: any = {};
      const [basicInfoParams, badTypeParams, orderBadTypeParams, memberFormParams] = await Promise.all([
        unref(basicInfoFormRef).getParamsFn(1),
        unref(badTypeRef).gridApi.validateFn(),
        unref(orderBadTypeRef).gridApi.validateFn(),
        unref(memberFormRef).formApi.validate(),
      ]);
      if ([basicInfoParams, badTypeParams, orderBadTypeParams, memberFormParams].includes(false)) return;
      params = {
        id: state.id,
        ...basicInfoParams,
        badTypeList: badTypeParams,
        workOrderList: orderBadTypeParams,
        ...memberFormParams,
        type,
      };
      if (params.notifiedPersons) {
        params.notifiedPersons = params.notifiedPersons.join(',');
      }

      // 通过iqc审核带入参数
      if (state.iqcParams.relationNo) {
        params = { ...params, ...state.iqcParams };
      }
      console.log(params, 'handleSubmit');
      const { code, msg } = await addMrbapply(params);
      if (code === 200) {
        emits('reload');
        closePopup();
        createMessage.success(msg);
        if (state.iqcParams.relationNo) {
          state.iqcParams = {};
          // 获取当前路径（不含查询参数）
          const path = window.location.pathname;
          // 替换 URL（不触发页面刷新）
          window.history.replaceState({}, document.title, path);
        }
      }
    } catch (error) {
      console.log('校验未通过', error);
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
