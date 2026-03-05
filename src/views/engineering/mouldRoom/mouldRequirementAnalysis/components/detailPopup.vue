<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="state.isCanEdit"
    :showCancelBtn="false"
    :title="state.title"
    destroyOnClose
    :showFooter="false"
    :okText="t('common.submit')"
    :okButtonProps="{ class: 'mr-12px' }"
    @ok="handleSubmitFn"
    class="full-popup pb-10px">
    <Grid>
      <template #buttons>
        <Subtitle :title="t('common.reviewInfo')" />
      </template>
    </Grid>
  </BasicPopup>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getReviewDataList, reviewApply } from '/@/api/engineering/mould';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { editRules, COLUMNS } from './detailConfig';
  import { isNullOrUnDef } from '/@/utils/is';

  import { Subtitle } from '/@/components/Subtitle';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';

  const emits = defineEmits(['reload']);

  const state = reactive({
    title: '',
    columns: [] as any,
    isCanEdit: false,
  });
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const [registerPopup, { closePopup, changeLoading, changeOkLoading }] = usePopupInner(init);
  const [Grid, { getDataSource, reloadData, validate, setGridOptions }] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-mouldRoom-mouldRequirementAnalysis-detailGrid',
      height: 'auto',
      columns: COLUMNS,
      rowConfig: {
        keyField: 'uuid',
      },
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      toolbarConfig: {
        enabled: true,
        refresh: false,
        slots: {
          buttons: 'buttons',
        },
      },
      pagerConfig: {
        enabled: false,
      },
      i18nConfig: {
        moduleCode: 'MouldRoomColumn',
      },
      editRules,
    },
  });

  async function init(data: { title: string; ids: string[]; isCanEdit: boolean }) {
    const { title, ids, isCanEdit = false } = data;
    state.title = title;
    state.isCanEdit = isCanEdit;

    setGridOptions({
      editConfig: {
        enabled: isCanEdit,
      },
    });

    try {
      changeLoading(true);
      const { data, code } = await getReviewDataList(ids);
      if (code !== 200) {
        return;
      }
      reloadData(
        data.map(item => ({
          ...item,
          isProcessMeet: isNullOrUnDef(item.isProcessMeet) ? '' : `${item.isProcessMeet}`,
        })),
      );
    } finally {
      changeLoading(false);
    }
  }

  function setLoading(isLoading: boolean) {
    changeLoading(isLoading);
    changeOkLoading(isLoading);
  }

  async function handleSubmitFn() {
    try {
      if (await validate(true)) {
        createMessage.warning(t('dict.CommonCol.enterRequiredFields'));
        return;
      }

      setLoading(true);
      const params = getDataSource();
      const { code, msg } = await reviewApply({ list: params, bizType: 1 });
      if (code === 200) {
        createMessage.success(msg);
        emits('reload');
        closePopup();
        return;
      }
      createMessage.error(msg);
    } finally {
      setLoading(false);
    }
  }
</script>

<style lang="less" scoped>
  :deep(.lydc-subtitle-container) {
    padding-bottom: 0;
  }
</style>
