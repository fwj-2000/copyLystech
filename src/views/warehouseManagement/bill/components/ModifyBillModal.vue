<template>
  <BasicModal
    v-bind="$attrs"
    :width="900"
    :height="600"
    :title="state.title"
    destroyOnClose
    class="batch-modal"
    :showOkBtn="state.showOkBtn"
    :okText="t('common.submit')"
    @ok="handleSubmit"
    @register="registerModal">
    <div style="height: 500px">
      <Grid> </Grid>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { nextTick, reactive } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { pick } from 'lodash-es';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';

  const emits = defineEmits(['reload']);
  const { t } = useI18n();
  const { createMessage } = useMessage();

  const [registerModal, { changeLoading, closeModal }] = useModalInner(init);

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: `warehouse-mouldBusiness-bill-modifySupplier`,
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      columnConfig: { resizable: true },
      showOverflow: false,
      showIndexColumn: true,
      columns: [],
      keyboardConfig: {
        isBack: false,
      },
      pagerConfig: {
        enabled: false,
      },
      toolbarConfig: {
        enabled: false,
      },
      editConfig: {
        enabled: true,
        trigger: 'dblclick',
        mode: 'row',
      },
      clipConfig: {
        isPaste: true,
      },
      i18nConfig: {
        moduleCode: 'MoldLedgerColumn',
      },
      position: 'modal',
    },
  });
  const { reloadColumn, reloadData, getDataSource } = gridApi;

  const state = reactive({
    picks: [],
    submitApi: null,
    beforeSubmitFetch: null,
    title: '',
    showOkBtn: true,
  });

  /**
   * @description 初始化修改记录
   * @param data
   */
  function init(data) {
    reloadColumn(data.columns || []);
    state.picks = data.picks;
    state.showOkBtn = !!data.submitApi;
    state.submitApi = data.submitApi;
    state.beforeSubmitFetch = data.beforeSubmitFetch;
    state.title = data.title;

    handleTableData(data); // 初始化表格数据
  }

  async function handleTableData(data) {
    if (data.detailApi) {
      const res = await data.detailApi(data.detailApiParams || {});
      if (res) {
        gridApi.grid.reloadData(res.data || []);
      }
    } else {
      nextTick(() => {
        gridApi.grid.reloadData(data.list || []);
      });
    }
  }

  async function handleSubmit() {
    // 当没有submitApi时，直接关闭弹窗
    if (!state.submitApi) {
      return closeModal();
    }

    // 校验必填项
    if (await gridApi.grid.validate(true)) {
      return createMessage.warning(t('dict.SalesSiteColumn.requiredTip'));
    }
    changeLoading(true);
    let data = gridApi.getDataSource().map(item => pick(item, state.picks));

    if (state.beforeSubmitFetch) {
      data = state.beforeSubmitFetch(data);
    }
    state
      .submitApi(data)
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        emits('reload');
        closeModal();
      })
      .finally(() => {
        changeLoading(false);
      });
  }
</script>
