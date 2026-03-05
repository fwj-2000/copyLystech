<!-- 绩效排名单个指标项组件 -->
<template>
  <div class="rank-item-compo-container">
    <!-- 指标项名称 -->
    <div class="rank-header mb-8px">
      <p>{{ props.name }}</p>
    </div>
    <!-- 报表表格 -->
    <BasicTable class="table-wrapper" @register="registerTable">
      <template v-slot:bodyCell="{ column, record, index }">
        <!-- 排名 -->
        <template v-if="column.type === ETableCellSlotType.RANKING">
          <div class="flex">
            <div class="process-wrapper mr-8px">
              <div class="process" :style="{ width: getProcessWidth(column.dataIndex, record) || '0.00%' }"></div>
            </div>
            <span :style="`width: 128px;${column.cssStyle}`">
              {{ record[column.dataIndex] }}
            </span>
          </div>
        </template>
        <!-- 可跳转 -->
        <template v-else-if="column.type === ETableCellSlotType.LINK && hasPermission(record)">
          <span :class="{ 'text-hover': hasPermission(record) }" :style="column.cssStyle" @click="goPage(column, record)">{{
            column.customRender ? column.customRender({ record }) : record[column.dataIndex]
          }}</span>
        </template>
        <!-- 其他 -->
        <template v-else>
          <span :style="column.cssStyle">{{ column.customRender ? column.customRender({ record, index }) : record[column.dataIndex] }}</span>
        </template>
      </template>
    </BasicTable>
  </div>
</template>

<script lang="ts" setup>
  import { inject, ref } from 'vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { objectToQueryParams } from '/@/views/dashboard/operate/metricsCenter/utils';
  import { BasicTable, BasicColumn, useTable } from '/@/components/Table';

  import { ETableCellSlotType } from './type';
  import { getOrganization } from '/@/api/dashbord/operate';

  const allPermissionOrgCode = ref<string[]>([]);

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
    showTableIndexColumn: {
      type: Boolean,
      default: false,
    },
  });

  // 权限判断
  const hasPermission = record => {
    const res = allPermissionOrgCode.value.includes(record.OrgCode);
    return res;
  };
  getOrganization().then(res => {
    const {
      data: { list },
    } = res;
    allPermissionOrgCode.value = list.map(item => item.org_Code);
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
  const goPage = ({ routePath, getRouteParams }, record) => {
    const query = getRouteParams(getSearchFormValue() as any, record);
    // 构造路由参数
    const url = `${routePath}?${objectToQueryParams(query)}`;
    go(url);
  };

  // 注册表格hook
  const [registerTable] = useTable({
    columns: props.columns,
    dataSource: props.dataSource,
    pagination: false,
    useSearchForm: false,
    showTableSetting: false,
    showIndexColumn: props.showTableIndexColumn,
    canResize: false,
    bordered: true,
    striped: true,
  });
</script>

<style lang="less" scoped>
  .rank-item-compo-container {
    padding: 0 24px;
    margin: 8px 0;

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
