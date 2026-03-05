<!-- 绩效排名单个指标项组件 -->
<template>
  <div class="rank-item-compo-container">
    <!-- 指标项名称 -->
    <div class="h-[48px] rank-header flex justify-start">
      <p>{{ props.name }}（可针对不同维度进行选择分析）</p>
      <a-button v-auth="'btn_download'" class="mx-8px" type="primary" ghost @click="setModalProps({ open: true })">查看分析</a-button>

      <a-button v-auth="'btn_download'" type="primary" ghost @click="exportToExcel">
        <span>导出数据</span>
      </a-button>
    </div>
    <!-- 报表表格 -->
    <div class="w-[100%]" style="height: calc(100% - 60px)">
      <BaseVxeTable
        ref="tableRef"
        v-bind="{
          dataSource: props.dataSource,
          summaryInfo: props.summaryInfo,
          showColumns: columns,
          searchFormValue: getSearchFormValue(),
          allColumnsOptions,
        }"
        footer-cell-class-name="foot-data-cell"></BaseVxeTable>
    </div>
  </div>
  <!-- 分析彈窗组件 -->
  <BasicModal
    v-bind="{
      footer: null,
      draggable: true,
      visible: false,
    }"
    class="analysis-dialog"
    @register="registerModal"
    style="width: 50vw">
    <template #title>
      <div class="flex justify-start">
        <span>Top</span>
        <div class="w-[74px] mx-[8px]">
          <a-input-number v-model:value="topNum" :max="props.dataSource.length"> </a-input-number>
        </div>
        <span>分析</span>
      </div>
    </template>
    <div>
      <p v-for="(item, idx) in analysisInfo" :key="idx" class="bg-[#f2f2f2] mb-8px py-6px px-12px">
        <span v-for="(content, cidx) in item" :keys="cidx">
          <template v-if="content.type === 'text'">
            {{ content.content }}
          </template>
          <template v-if="content.type === 'value'">
            <span :style="content.style || {}">{{ content.content }}</span>
          </template>
        </span>
      </p>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { inject, ref, watch } from 'vue';
  import { allColumnsOptions } from './config';
  import { getAnalysisInfo } from './utils';
  import { IAnalysisInfo } from './types';
  import { saveVxeTableDatasToExcelByExceljs } from '/@/utils/file/download';

  import BaseVxeTable from '/@/views/dashboard/operate/components/BaseVxeTable/index.vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';

  const getSearchFormValue = inject('getSearchFormValue', () => ({}));
  const getRequestParams = inject('getRequestParams', () => ({}));
  const [registerModal, { setModalProps }] = useModalInner();
  const tableRef = ref<InstanceType<typeof BaseVxeTable>>();
  const analysisInfo = ref<IAnalysisInfo[][]>([]);
  const topNum = ref<number>(5);

  const props = defineProps({
    name: { type: String, required: true },
    summaryInfo: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    }, // 汇总数据
    columns: {
      type: Array as PropType<any[]>,
      required: true,
    },
    // 表格数据
    dataSource: {
      type: Array as PropType<Recordable<any>[]>,
      required: true,
    },
  });

  const exportToExcel = () => {
    const tableList = tableRef.value?.gridRef?.getData() ?? [];
    const columns = tableRef.value?.columns;
    const footerData = tableRef.value?.gridRef?.footerData ?? [];
    const params = getRequestParams();
    const { busbuDim = '', startDim = '', endDim = '' } = (params as any)?.value ?? {};
    saveVxeTableDatasToExcelByExceljs({
      columns,
      tableList: [...tableList, ...footerData],
      fileName: `${busbuDim.toUpperCase()}维度排名${startDim}-${endDim}`,
    });
  };

  watch(
    [() => topNum.value, () => props.dataSource],
    () => {
      const info = props.dataSource.slice(0, topNum.value);
      analysisInfo.value = getAnalysisInfo(info);
    },
    { immediate: true, deep: true },
  );
</script>

<style lang="less">
  .analysis-dialog .ant-modal-body > .scrollbar {
    padding: 24px !important;
  }
</style>

<style lang="less" scoped>
  .rank-item-compo-container {
    padding: 0 24px;
    width: 100%;
    height: 100%;

    .rank-header {
      color: #1a1a1a;
      font-size: 16px;
      font-weight: 700;
    }

    .process-wrapper {
      width: 30vw;
      background-color: #ddd;
      border-radius: 10px;

      .process {
        max-width: 100%;
        height: 8px;
        border-radius: 10px;
        background: linear-gradient(90deg, #d2e0ff -20%, #4b7bec 80%);
        background-size: 200% 100%;
      }
    }
  }

  :deep(.ant-table-thead > tr) {
    & > th {
      font-weight: 700;
      white-space: pre-wrap;

      /* 允许换行 */
      word-break: break-word;

      /* 自动断词 */
      text-align: center !important;
      // border-color: @borderColor !important;
    }
  }
</style>
<style lang="less">
  .foot-data-cell {
    font-weight: bold; /* 字体加粗 */
    color: #000;
    background-color: rgb(255 123 0 / 20%);
  }
</style>
