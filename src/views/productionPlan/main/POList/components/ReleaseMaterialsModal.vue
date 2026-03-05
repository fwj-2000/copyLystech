<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('dict.PRList.releaseExclusiveMaterial')" showOkBtn @ok="handleSubmit" width="700px">
    <Grid></Grid>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getDetailPO, updateOnlymaterialPO } from '/@/api/mps/productionPlan/MPS';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { releaseMaterialsColumn } from '../config';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useBaseStore } from '/@/store/modules/base';
  const baseStore = useBaseStore();

  const emit = defineEmits(['register', 'added', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const idList = ref([]);

  const [Grid, { reload, validate, getDataSource, reloadData }] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionPlan-main-POList-list-ReleaseMaterialsModal',
      columns: releaseMaterialsColumn,
      i18nConfig: {
        moduleCode: 'PoOrderColumn',
      },
      showIndexColumn: true,
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        autoHidden: true,
      },
      position: 'modal',
    },
  });

  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);
  async function init({ ids }) {
    changeLoading(true);
    idList.value = ids;
    const { code, data } = await getDetailPO(ids).finally(() => {
      changeLoading(false);
    });
    if (code == 200) {
      reloadData(data);
    }
  }

  //提交
  async function handleSubmit() {
    if (await validate(true)) {
      createMessage.warning(t('dict.CommonCol.enterRequiredFields'));
      return;
    }
    changeOkLoading(true);
    // const tableData = await getDataSource();
    const res = await updateOnlymaterialPO({ ids: idList.value }).finally(() => {
      changeOkLoading(false);
    });
    createMessage.success(res.msg);
    changeOkLoading(false); //用于修改确认按钮的loading状态
    closeModal();
    emit('reload');
  }
</script>
