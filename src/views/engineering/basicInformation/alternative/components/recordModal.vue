<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :cancelText="t('common.closeText')"
    :show-ok-btn="false"
    :title="t('dict.PCCColumn.revisionRemark')"
    :width="1100"
    :minHeight="500"
    destroy-on-close>
    <Grid />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getUpdateHis } from '/@/api/engineering/alternative';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { columns } from './recordModalConfig';

  import { BasicModal, useModalInner } from '/@/components/Modal';

  const emit = defineEmits(['register', 'reload']);
  const { t } = useI18n();

  const state = reactive<{
    id: string;
  }>({
    id: '',
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    showSearchForm: false,
    gridOptions: {
      columns,
      height: 500,
      api: getTableData,
      pagerConfig: {
        enabled: false,
        autoHidden: false,
      },
      toolbarConfig: {
        enabled: false,
      },
      // i18nConfig: {
      //   moduleCode: '',
      // },
    },
  });

  function getTableData() {
    gridApi.setLoading(true);
    getUpdateHis(state.id)
      .then(res => {
        gridApi.reloadData(res.data);
      })
      .finally(() => {
        gridApi.setLoading(false);
      });
  }

  const [registerModal] = useModalInner(init);
  function init(data: { id: string }) {
    state.id = data.id;
    getTableData();
  }
</script>
