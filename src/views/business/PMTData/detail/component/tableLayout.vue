<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button @click="handleExport">{{ t('common.batchExport') }}</a-button>
            </a-space>
          </template>
          <template v-for="slotName in slotNames" :key="slotName" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps"></slot>
          </template>
        </Grid>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { SetupContext } from 'vue';

  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ref, computed, nextTick, useSlots } from 'vue';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';
  import dayjs from 'dayjs';
  import { useRoute } from 'vue-router';
  import { useI18n } from '/@/hooks/web/useI18n';

  const route = useRoute();
  const { t } = useI18n();

  const slots: SetupContext['slots'] = useSlots();

  const slotNames = computed(() => {
    const keys = Object.keys(slots);
    return keys.filter(key => key !== 'default');
  });

  const currentRowType = ref<string>('');

  const props = defineProps({
    /** 获取数据接口(api) */
    getDataApi: {
      type: Function,
      default: () => {
        return Promise.resolve({ data: [] });
      },
    },
    /** 表格列配置 */
    columns: {
      type: Array as PropType<Array<any>>,
      default: () => [],
    },
    /** 搜索配置 */
    schemas: {
      type: Array as PropType<Array<any>>,
      default: () => [],
    },
    /** 格式化参数 */
    formatParams: {
      type: Function as PropType<(params: any) => Record<string, any>>,
      default: (params: any) => params,
    },
    /** 请求数据后的回调 */
    afterFetch: {
      type: Function as PropType<(res: any) => { data: Array<any> }>,
      default: (res: any) => res,
    },
    /** 国际化编码 */
    i18nCode: {
      type: String,
      default: '',
    },
  });

  const schemasFields = computed(() => props.schemas.map(item => item.fieldName));
  const mergeColumnFields = computed(() => {
    return props.columns.filter(item => item.merge).map(item => item.field);
  });
  const allColumnsFields = computed(() => {
    return props.columns.map(item => item.field);
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: schemasFields.value.length > 4,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: props.schemas,
      handleSubmit: getDataSource,
      ...(props.i18nCode
        ? {
            i18nConfig: {
              moduleCode: props.i18nCode,
              transferRange: ['placeholder'],
            },
          }
        : {}),
    },
    gridOptions: {
      id: `business-PMTData-detail-${route.path.split('/').pop()}-list`,
      columns: props.columns,
      rowConfig: {
        keyField: 'id',
        height: 32,
      },
      columnConfig: {
        maxFixedSize: 100,
      },
      api: getTableData,
      pagerConfig: {
        autoHidden: false,
      },
      ...(props.i18nCode
        ? {
            i18nConfig: {
              moduleCode: props.i18nCode,
            },
          }
        : {}),
      // @ts-ignore
      proxyConfig: {
        enabled: false,
        autoLoad: false,
        response: {
          list: 'data.list',
          total: 'data.total',
        },
      },
      toolbarConfig: {
        export: true,
      },
      // exportConfig: {
      //   isMerge: true,
      //   isFooter: true,
      //   type: 'xlsx',
      //   types: ['xlsx'],
      //   mode: 'current',
      //   modes: ['current'],
      //   filename: () => {
      //     return `${t(route.meta.title)}_${dayjs().format('YYYY-MM-DD')}`;
      //   },
      // },
    },
  });

  const dataSource = ref<Array<any>>([]);
  async function getDataSource(params: any) {
    dataSource.value.length = 0;
    gridApi.setLoading(true);
    return props
      .getDataApi(formatFetchQuery(params))
      .then(async (res: { data: Array<any> }) => {
        res = props.afterFetch(res);
        const data = Array.isArray(res.data) ? res.data : [];
        dataSource.value = data;
        return;
      })
      .catch((err: any) => console.warn('🚀 ~ list:res.data.slice ~ err:', err))
      .finally(() => {
        gridApi.setLoading(false);
        gridApi.reload();
      });
  }

  function formatFetchQuery(params: any) {
    if (params.time && params.time.length > 0) {
      params.startDim = dayjs(params.time[0]).format('YYYY-MM-DD');
      params.endDim = dayjs(params.time[1]).format('YYYY-MM-DD');
      delete params.time;
    }

    return props.formatParams({ ...params, rowType: currentRowType.value });
  }

  /**
   * 前端实现分页，数据源来自`dataSource.value`
   * @param params
   */
  function getTableData(params: { currentPage: number; pageSize: number }) {
    gridApi.grid.clearMergeCells();
    const startIndex = (params.currentPage - 1) * params.pageSize;
    const endIndex = startIndex + params.pageSize;
    const paginatedData = dataSource.value.slice(startIndex, endIndex);

    mergeColumnFields.value.length > 0 &&
      setTimeout(() => {
        gridApi.grid.setMergeCells(getSpecifiedColumnsMergeInfo(paginatedData, mergeColumnFields.value, allColumnsFields.value));
      }, 10);

    return Promise.resolve({
      data: {
        list: paginatedData,
        total: dataSource.value.length,
      },
    });
  }

  /**
   * 获取指定列的单元格合并信息
   * @param data 表格数据（对象数组）
   * @param fields 需要合并的列字段列表（如 ['FactoryName', 'TmlCusPrjCode']）
   * @param allColumns 表格所有列字段列表（如 ['FactoryName', 'TmlCusPrjCode', 'Title1', ...]）
   * @returns 合并信息数组
   */
  function getSpecifiedColumnsMergeInfo(
    data: Array<any>,
    fields: Array<string>,
    allColumns: Array<string>,
  ): Array<{ row: number; rowspan: number; col: number; colspan: number }> {
    if (data.length === 0 || fields.length === 0 || allColumns.length === 0) return [];

    const mergeInfo: Array<{ row: number; rowspan: number; col: number; colspan: number }> = [];
    const rowCount = data.length;

    // 遍历每个需要合并的列
    fields.forEach(field => {
      const colIndex = allColumns.indexOf(field);
      if (colIndex === -1) return; // 跳过不存在的列

      let row = 0;
      while (row < rowCount) {
        let count = 1; // 连续相同值的行数

        // 向下查找连续相同的行
        while (row + count < rowCount && data[row][field] === data[row + count][field]) {
          count++;
        }

        // 如果连续行数大于1，则记录合并信息
        if (count > 1) {
          mergeInfo.push({
            row,
            rowspan: count,
            col: colIndex,
            colspan: 1, // 始终为1（列不合并）
          });
        }

        // 跳过已合并的行
        row += count;
      }
    });

    return mergeInfo;
  }

  /** 导出 */
  function handleExport() {
    gridApi.grid.openExport({
      isMerge: true,
      isFooter: true,
      type: 'xlsx',
      types: ['xlsx'],
      mode: 'current',
      modes: ['current'],
      filename: () => {
        return `${t(route.meta.title)}_${dayjs().format('YYYY-MM-DD')}`;
      },
    });
  }

  useRouteParams(
    schemasFields.value.reduce(
      (obj, item) => {
        // 对时间进行特殊处理
        if (item === 'time') {
          obj['startDim'] = {};
          obj['endDim'] = {};
        } else {
          // 默认处理
          obj[item] = {};
        }
        return obj;
      },
      { rowType: {} },
    ),
    params => {
      nextTick(() => {
        currentRowType.value = params.rowType;
        schemasFields.value.forEach(fieldName => {
          if (fieldName === 'time' && params.startDim && params.endDim) {
            gridApi.formApi.setFieldValue('time', [dayjs(params.startDim).valueOf(), dayjs(params.endDim).valueOf()]);
          } else {
            gridApi.formApi.setFieldValue(fieldName, params[fieldName]);
          }
        });
        gridApi.formApi.submitForm();
      });
    },
  );
</script>

<style lang="less" scoped>
  :deep(td .vxe-cell) {
    height: 32px !important;
  }
</style>
