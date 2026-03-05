<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('common.LabelPrinting')" showOkBtn @ok="handleSubmit" width="1000px">
    <div v-if="state.tempListData.length">
      <TempForm
        :tempList="state.tempListData"
        ref="tempFormRef"
        :colSpan="6"
        :isNeedValidate="true"
        :processName="state.processName"
        :operationType="state.operationType"
        @onIntTypeInputChange="handleIntTypeInputChange" />
    </div>
  </BasicModal>
</template>
<script setup lang="ts">
  import { reactive, ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { AddSplitPrint } from '/@/api/productionDeal/splitPrint';
  import TempForm from '/@/views/productionPlan/procruleTemp/components/tempForm.vue';
  import { getDetailbyprocessname } from '/@/api/basicData/processrulestemplate';
  import { useUserStore } from '/@/store/modules/user';
  import Decimal from 'decimal.js';

  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const userStore = useUserStore();

  interface State {
    tempListData: Array<any>;
    processName: string;
    operationType: string;
  }
  const state = reactive<State>({
    tempListData: [],
    processName: '',
    operationType: '',
  });

  const tempFormRef = ref();

  // 获取字段配置列表
  async function getProcrulesTempDetailFn(operationType) {
    changeLoading(true);
    try {
      const { code, data } = await getDetailbyprocessname({ operationType: operationType });
      if (code == 200) {
        if (!data) return;
        state.tempListData = data.map(item => {
          if (item.fieldEnName === 'creatorTime') {
            item.fieldValue = Date.now();
          } else if (item.fieldEnName === 'creatorUserName') {
            item.fieldValue = unref(userStore.getUserInfo).userName;
          } else if (item.fieldEnName === 'operatorId') {
            item.fieldValue = [unref(userStore.getUserInfo).userId];
          }
          return item;
        });
      }
    } finally {
      changeLoading(false);
    }
  }

  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);
  async function init(data) {
    state.tempListData = []; // 清空组件对象
    state.operationType = data.operationType;
    getProcrulesTempDetailFn(data.operationType);
  }

  function isExist(value: any) {
    return value !== undefined && value !== null && value !== '';
  }

  // 输入【打印数量】计算【退料宽度】
  const handleIntTypeInputChange = (tempList, fieldEnName) => {
    if (fieldEnName !== 'printQuantity' && fieldEnName !== 'splitWidth') return;
    const rawMatWidth = tempList.find(item => item.fieldEnName === 'rawMatWidth' && item.fieldValue)?.fieldValue; // 原材宽度
    const splitWidth = tempList.find(item => item.fieldEnName === 'splitWidth' && item.fieldValue)?.fieldValue; // 分切宽度
    const printQuantity = tempList.find(item => item.fieldEnName === 'printQuantity' && item.fieldValue)?.fieldValue; // 打印数量
    calculateRetMatWidth(tempList, rawMatWidth, splitWidth, printQuantity);
  };

  function calculateRetMatWidth(tempList, rawMatWidth, splitWidth, printQuantity) {
    if (!isExist(rawMatWidth) || !isExist(splitWidth) || !isExist(printQuantity)) return;
    const rawMatW = Number(new Decimal(Number.parseInt(rawMatWidth)).sub(new Decimal(splitWidth).mul(printQuantity)));
    const retMatWidth = Math.max(rawMatW, 0);
    const newTempList = tempList.map(item => {
      if (item.fieldEnName === 'retMatWidth') {
        return {
          ...item,
          fieldValue: retMatWidth,
        };
      } else {
        return { ...item };
      }
    });
    tempFormRef.value.updateTempList(newTempList);
  }

  //提交
  async function handleSubmit() {
    const validate = await tempFormRef.value.validateFormFn();
    if (!validate) return;
    let params: any = {};
    validate.forEach(o => {
      params[o.fieldEnName] = o.fieldValue;
      if (o.isMultiSelect === 1) {
        params[o.fieldEnName] = o.fieldValue.join(',');
      }
    });
    changeOkLoading(true);
    const res = await AddSplitPrint({ ...params }).finally(() => {
      changeOkLoading(false);
    });
    const { list, warnMsg } = res.data;
    warnMsg ? createMessage.warning({ content: warnMsg, duration: 3 }) : createMessage.success(res.msg);
    changeOkLoading(false); //用于修改确认按钮的loading状态
    closeModal(); //关闭弹窗
    emit('reload', list);
  }
</script>
