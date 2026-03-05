<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :title="title"
    :okText="t('common.printText')"
    destroyOnClose
    class="full-popup print-table-popup"
    @ok="beforePrint">
    <div class="h-full p-10px">
      <Grid />
    </div>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, ref, h, createApp, nextTick } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useVueToPrint } from 'vue-to-print';
  import printTable from './printTable.vue';

  const { t } = useI18n();
  const emits = defineEmits(['register', 'reload']);
  const [registerPopup, { changeLoading }] = usePopupInner(init);

  interface State {
    title: string;
    columns: any[];
    data: any[];
    brforeConfirmApi: null | Function;
  }

  const state = reactive<State>({
    title: '',
    data: [],
    columns: [],
  });
  const { title } = toRefs(state);

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
    },
  });
  const { reloadColumn, reloadData, getDataSource } = gridApi;
  // 页面初始化
  function init(data: { columns: any[]; title: string; detailApi: null | Function; apiParams: Object; list?: any[]; brforeConfirmApi: null | Fucntion }) {
    state.title = data?.title || t('common.printText');
    state.columns = data.columns || [];
    state.data = data.list || [];
    state.brforeConfirmApi = data.brforeConfirmApi;
    state.beforeConfirmFetch = data.beforeConfirmFetch;
    reloadColumn(data.columns || []);
    getTableList(data);
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

  // 打印
  async function beforePrint() {
    if (state.brforeConfirmApi) {
      try {
        const params = state.beforeConfirmFetch({});
        // 打印前确认
        const res = await state.brforeConfirmApi(params);
        if (res.code != 200) {
          return false;
        }
      } catch (error) {
        return false;
      }
    }
    handleToPrint();
  }

  // 执行打印
  function handleToPrint() {
    // 挂载节点
    const tempDiv = document.createElement('div');
    let app: any = createApp({
      render: () =>
        h(printTable, {
          columns: state.columns,
          data: state.data,
        }),
    });
    app.mount(tempDiv);
    // 执行打印
    nextTick(() => {
      console.log(tempDiv);
      const { handlePrint } = useVueToPrint({
        content: tempDiv,
        removeAfterPrint: true,
        onAfterPrint: () => {
          // 关闭打印之后销毁
          app.unmount();
          app = null;
        },
      });
      handlePrint();
    });
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
