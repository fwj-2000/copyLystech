<!-- 绩效排名单个指标项组件 -->
<template>
  <div class="rank-item-compo-container">
    <!-- 指标项名称 -->
    <div class="rank-header mb-8px flex center justify-between">
      <p>{{ props.name }}</p>
      <p class="text-[12px]">单位：万元、%</p>
    </div>
    <!-- 报表表格 -->
    <BasicTable sticky class="table-wrapper" @register="registerTable">
      <template v-if="!isEmpty(summaryCellList)" #summary>
        <a-table-summary fixed="top">
          <a-table-summary-row>
            <a-table-summary-cell v-for="(item, idx) in summaryCellList" :key="idx" :style="`text-align: ${item.align || 'center'}`"
              >{{ getCellContent(item) }}
            </a-table-summary-cell>
          </a-table-summary-row>
        </a-table-summary>
      </template>
      <template v-slot:bodyCell="{ column, record }">
        <!-- 排名 -->
        <template v-if="column.type === ETableCellSlotType.RANKING">
          <div class="flex">
            <div class="process-wrapper mr-8px">
              <div class="process" :style="{ width: getProcessWidth(column.dataIndex, record) || '0.00%' }"></div>
            </div>
            <span :style="`width: 128px;${column.cssStyle}`">
              {{ column.customRender ? column.customRender({ record }) : record[column.dataIndex] }}
            </span>
          </div>
        </template>
        <!-- 可跳转 -->
        <template v-else-if="column.type === ETableCellSlotType.LINK">
          <span class="text-hover" :style="column.cssStyle" @click="goPage(column, record)">
            {{ column.customRender ? column.customRender({ record }) : record[column.dataIndex] }}
          </span>
        </template>
      </template>
    </BasicTable>
  </div>
</template>

<script lang="ts" setup>
  import { inject, computed } from 'vue';
  import { isEmpty } from 'lodash-es';
  import { useGo } from '/@/hooks/web/usePage';
  import { objectToQueryParams } from '/@/views/dashboard/operate/metricsCenter/utils';
  import { BasicTable, BasicColumn, useTable } from '/@/components/Table';

  import { ETableCellSlotType } from './type';

  const go = useGo();
  const getSearchFormValue = inject('getSearchFormValue', () => ({}));

  const props = defineProps({
    name: { type: String, required: true },
    columns: {
      type: Array as PropType<BasicColumn[]>,
      required: true,
    },
    // 表格数据
    dataSource: {
      type: Array as PropType<Recordable<any>[]>,
      required: true,
    },
    summaryInfo: {
      type: Object as PropType<Recordable<any>>,
      required: true,
    },
  });

  const getCellContent = item => {
    if (item.customCell) {
      return item.customRender({ record: props.summaryInfo, column: item });
    }
    return item.value;
  };
  // 总结信息
  const summaryCellList = computed(() => {
    const cols: any[] = props.columns.reduce((pre, cur) => {
      if (cur?.children) {
        return [...pre, ...(cur?.children || [])];
      }
      return [...pre, cur];
    }, []);
    const res = cols.map(item => ({
      ...item,
      value: props.summaryInfo[item.dataIndex] || '',
    }));
    return res;
  });

  // 获取进度条
  const getProcessWidth = (dataIndex, record) => {
    if (!record[dataIndex]) return '0%';
    const cur = Number.parseFloat(Number.parseFloat(record[dataIndex]).toFixed(2));
    if (cur < 0) return '0%';
    const max = Math.max(...props.dataSource.map(item => Number.parseFloat(Number.parseFloat(item[dataIndex] || 0).toFixed(2))));
    if (max >= 100) {
      return `${((cur / max) * 100).toFixed(2)}%`;
    }
    return `${cur}%`;
  };

  // 打开新标签页
  const goPage = ({ routePath, getRoutePath, getRouteParams }, record) => {
    const searchFormValue = getSearchFormValue() as any;
    const query = getRouteParams(searchFormValue, record);
    // 构造路由参数
    const urlString = getRoutePath ? getRoutePath({ searchFormValue, record }) : routePath;
    const url = `${urlString}?${objectToQueryParams(query)}`;
    go(url);
  };

  // 注册表格hook
  const [registerTable] = useTable({
    columns: props.columns,
    dataSource: props.dataSource,
    pagination: false,
    useSearchForm: false,
    showTableSetting: false,
    showIndexColumn: false,
    canResize: true,
    bordered: true,
    striped: true,
    inset: true,
  });
</script>

<style lang="less" scoped>
  .rank-item-compo-container {
    padding: 0 24px;
    margin: 8px 0;
    width: 100%;
    height: 100%;

    :deep(.ant-table-thead > tr) {
      & > th {
        font-weight: 700;
        white-space: pre-wrap;

        /* 允许换行 */
        word-break: break-word;

        /* 自动断词 */
        text-align: left;
        // border-color: @borderColor !important;
      }
    }

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
</style>
