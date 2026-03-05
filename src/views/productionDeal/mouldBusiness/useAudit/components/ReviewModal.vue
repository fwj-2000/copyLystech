<template>
  <BasicModal v-bind="$attrs" :width="900" :title="state.title" destroyOnClose @register="registerModal" @ok="handleSubmit">
    <Grid :style="{ height: '550px' }"></Grid>
  </BasicModal>
</template>
<script lang="ts" setup>
  /**
   * 该组件有多处引用
   **/
  import { nextTick, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';

  const { t } = useI18n();
  const emit = defineEmits(['reload', 'register']);
  const state = reactive({
    insideProjectCode: '',
    init: true,
    title: '',
    api: null,
    beforeFetch: null,
  });

  const [Grid, { getSelectRows, reloadColumn, reloadData, getDataSource, setGridOptions }] = useVbenVxeGrid({
    gridOptions: {
      toolbarConfig: {
        enabled: false,
      },
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'CommonCol',
      },
      pagerConfig: {
        enabled: false,
      },
      editConfig: {
        mode: 'row',
        trigger: 'dblclick',
      },
      position: 'modal',
    },
  });
  const [registerModal, { changeLoading, closeModal }] = useModalInner(init);
  async function init(data) {
    changeLoading(true);
    state.title = data.title;
    state.api = data.api;
    state.beforeFetch = data.beforeFetch;
    if (data.i18nConfig) {
      // 动态配置i18n
      setGridOptions({
        i18nConfig: {
          moduleCode: data.i18nConfig,
        },
      });
    }
    reloadColumn(data.columns || []);
    setTimeout(() => {
      reloadData(data.list || []);
      changeLoading(false);
    }, 0);
  }
  // 提交
  async function handleSubmit() {
    if (state.api) {
      changeLoading(true);
      let params;
      try {
        if (state.beforeFetch) {
          params = state.beforeFetch(getDataSource());
        } else {
          params = getDataSource().map(item => item.id);
        }
        await state.api(params);
        closeModal();
        emit('reload', getSelectRows());
      } catch (error) {
        changeLoading(false);
        console.error(error);
      }
    }
  }
</script>
