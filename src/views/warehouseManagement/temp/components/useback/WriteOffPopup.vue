<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :title="t('common.writeOff')"
    :okText="t('common.writeOff')"
    destroyOnClose
    class="full-popup print-table-popup"
    @ok="handleSave">
    <div class="h-full p-10px">
      <Grid />
    </div>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, toRefs } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { bulkBackConfirmWriteOff } from '/@/api/productionDeal/moIdUseBack';

  const { t } = useI18n();
  const emits = defineEmits(['register', 'reload']);
  const [registerPopup, { changeLoading, closePopup }] = usePopupInner(init);

  interface State {
    columns: any[];
    data: any[];
  }

  const state = reactive<State>({
    data: [],
    columns: [],
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      mouseConfig: {
        area: false,
      },
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      columns: [],
      pagerConfig: {
        enabled: false,
      },
      toolbarConfig: {
        enabled: false,
      },
      i18nConfig: {
        moduleCode: 'MoldReceiveRefundColumn',
      },
      position: 'modal',
    },
  });
  const { reloadColumn, reloadData } = gridApi;
  // 页面初始化
  function init(data: { columns: any[]; title: string; detailApi: null | Function; apiParams: Object; list?: any[] }) {
    state.columns = data.columns || [];
    state.data = data.list || [];
    reloadColumn(data.columns || []);
    setTimeout(() => {
      getTableList(data);
    }, 0);
  }

  // 渲染列表数据
  async function getTableList(data) {
    const { detailApi, list } = data;
    // 有传值时，优先使用传值数据
    if (list) {
      return reloadData(list);
    }
    if (detailApi) {
      changeLoading(true);
      try {
        const res = await detailApi(data.apiParams);
        state.data = res.data;
        reloadData(res.data);
        changeLoading(false);
      } catch (error) {
        console.error('获取列表数据时出现异常：', error);
        changeLoading(false);
      }
    }
  }

  // 提交数据
  async function handleSave() {
    const { data } = state;
    const res = await bulkBackConfirmWriteOff(data.map(item => item.id));
    if (res.code === 200) {
      emits('reload');
      closePopup();
    }
  }
</script>

<style lang="less">
  @page {
    // 页码
    @bottom-right {
      content: 'Page ' counter(page) '/' counter(pages);
      font-size: 10px;
    }

    size: a4 portrait;
    margin: 20px;
    margin-bottom: 2cm;
  }
  @media print {
    .print-table-popup {
      width: 210mm;
      overflow: visible !important;

      /* 强制表格容器不出现滚动条 */
      .vxe-table--render-wrapper {
        overflow: visible !important;
        width: 100% !important;
      }

      /* 隐藏所有滚动条 */
      ::-webkit-scrollbar {
        display: none;
        width: 0 !important;
      }
    }
  }
</style>
