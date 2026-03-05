<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('dict.CommonCol.batchBindProcessRoute')" showOkBtn @ok="handleSubmit" :width="1050">
    <Grid class="h-[550px]"></Grid>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getpartroutelist, partbindroute } from '/@/api/engineering/mould';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { partbindrouteColumn, partbindrouteSchema } from '../config';

  const emit = defineEmits(['register', 'added', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      showCollapseButton: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-4 gap-4',
      schema: partbindrouteSchema,
      i18nConfig: {
        moduleCode: 'MoldProgramColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'engineering-mouldRoom-process-partbindroute-list',
      api: getpartroutelist,
      columns: partbindrouteColumn,
      proxyConfig: {
        autoLoad: false,
      },
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      i18nConfig: {
        moduleCode: 'MoldProgramColumn',
      },
    },
  });

  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  const partRelationIds = ref<string[]>([]);
  async function init(data) {
    partRelationIds.value = data.partRelationIds;
    gridApi.reload();
  }

  //提交
  async function handleSubmit() {
    let rows = gridApi.getSelectRows();
    if (rows.length === 0) {
      createMessage.warning(t('dict.CheckDataTip'));
      return;
    }
    if (rows.length > 1) {
      createMessage.warning(t('dict.CommonCol.selectedOneData'));
      return;
    }
    changeOkLoading(true);

    const res = await partbindroute({
      routeBindId: rows[0].routeBindId,
      partRelationIds: partRelationIds.value,
    }).finally(() => {
      changeOkLoading(false);
    });
    createMessage.success(res.msg);
    closeModal(); //关闭弹窗
    emit('reload');
  }
</script>
<style lang="scss" scoped></style>
