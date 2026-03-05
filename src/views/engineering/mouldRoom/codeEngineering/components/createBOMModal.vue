<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('dict.CommonCol.createBOM')" showOkBtn @ok="handleSubmit" :width="1200" :minHeight="500">
    <Grid style="height: 500px"></Grid>
  </BasicModal>
</template>
<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getElectrodebomPage, moldprogramMakebom } from '/@/api/engineering/mould';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { getColumn } from '/@/views/engineering/mouldRoom/electrodeBOM/config';

  const id = ref('');
  const moldNo = ref('');
  const partNo = ref('');

  const emit = defineEmits(['register', 'added', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();

  const [Grid, { reload, getSelectRows }] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-mouldRoom-codeEngineering-bomList',
      columns: getColumn().filter(item => item.field !== 'action'),
      api: getElectrodebomPage,
      showIndexColumn: true,
      beforeFetch: params => {
        return {
          ...params,
          enabledStatus: 1,
          moldNo: moldNo.value,
          partNo: partNo.value,
          partRelationId: id.value,
        };
      },
      toolbarConfig: {
        enabled: false,
      },
      i18nConfig: {
        moduleCode: 'ElectrodeBomColumn',
      },
    },
  });

  const getData = async () => {
    reload();
  };

  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  async function init(data) {
    id.value = data.id;
    moldNo.value = data.moldNo;
    partNo.value = data.partNo;
    getData();
  }

  //提交
  async function handleSubmit() {
    let rows = getSelectRows();
    if (rows.length === 0) {
      createMessage.warning(t('dict.CheckDataTip'));
      return;
    }
    const bomDetailIds = rows.map(item => item.id);
    changeOkLoading(true);
    const params = {
      id: id.value,
      bomId: rows[0].bomId,
      bomDetailIds,
    };
    const res = await moldprogramMakebom(params).finally(() => {
      changeOkLoading(false);
    });
    createMessage.success(res.msg);
    closeModal(); //关闭弹窗
    emit('reload');
  }

  onMounted(() => {});
</script>
