<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="附件下载" @ok="handleSubmit" destroyOnClose class="export-modal">
    <div>
      <!-- 单选 -->
      <a-radio-group v-model:value="state.downType" style="display: flex; flex-wrap: wrap">
        <a-radio v-for="(item, i) in state.downList" :key="i" :style="radioStyle" :value="item.enCode">{{ item.fullName }}</a-radio>
      </a-radio-group>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { exportCharts } from '/@/api/customerSerivce/filling';
  import { downloadByUrl } from '/@/utils/file/download';
  import { useBaseStore } from '/@/store/modules/base';
  const baseStore = useBaseStore();
  const dataType = ref(0);
  const radioStyle = reactive({
    display: 'flex',
    height: '30px',
    lineHeight: '30px',
    width: '48%',
  });
  const listQuery = ref({});
  const state = reactive<any>({
    downType: '',
    downList: [],
  });

  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);
  function init(data) {
    dataType.value = 0;
    listQuery.value = data.listQuery;
    state.Ids = data.ids;
    baseStore.getDictionaryData('FilingsBill.CustomizedReportEnterprise').then(res => {
      state.downList = res;
    });
  }

  function handleSubmit() {
    changeOkLoading(true);
    let query: any = {
      ...listQuery.value,
    };
    if (state.Ids) {
      query.Ids = state.Ids;
    }
    exportCharts(state.downType, query)
      .then(res => {
        changeOkLoading(false);
        if (!res.data.url) return;
        downloadByUrl({ url: res.data.url });
        closeModal();
      })
      .catch(() => {
        changeOkLoading(false);
      });
  }
</script>
