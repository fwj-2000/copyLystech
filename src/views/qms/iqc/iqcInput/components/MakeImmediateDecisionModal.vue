<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" :draggable="true" showOkBtn @ok="handleSubmit">
    <div class="pl-24px pb-12px">
      正在对
      <div v-for="item in state.reviewData">{{ item.iqcchkNo }} </div>
      进行提交审核操作
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addMaterial } from '/@/api/purchase/materialBase';
  import { useBaseStore } from '/@/store/modules/base';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { SAPColumns } from './config';
  import dayjs from 'dayjs';
  import { getLotnolist } from '../../../../../api/qms/quality';
  interface State {
    reviewData: any[];
  }
  const state = reactive<State>({
    reviewData: [],
  });
  const emits = defineEmits(['register', 'reload', 'onSelect']);

  const { t } = useI18n();
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  const getTitle = computed(() => t('common.add1Text'));
  function init(data) {
    const reviewer: string[] = [];
    data.reviewData.forEach((item: any) => {
      reviewer.push(item.chkUserNo);
    });
    console.log(reviewer);
  }
</script>
