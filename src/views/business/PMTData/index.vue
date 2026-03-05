<template>
  <div class="lydc-content-wrapper-content bg-white h-full">
    <Grid>
      <template #toolbar-actions>
        <a-space>
          <a-button type="primary" :loading="copyLinkLoading" @click="handleCopyLink">{{ t('dict.PMTData.copyLink') }}</a-button>
          <a-button @click="handleExport">{{ t('common.batchExport') }}</a-button>
        </a-space>
      </template>
      <template #Link="{ row, column }">
        <span
          v-if="row[column.field] && DETAIL_PAGE_INFO_MAP[row.RowType]"
          class="table-a cursor-pointer"
          :class="{ 'bg-red': row.RowType && row.RowType.startsWith('un_') }"
          @click="handleLink(row, column)">
          {{ row[column.field] }}
        </span>
        <span v-else-if="row[column.field]" :class="{ 'bg-red': row.RowType && row.RowType.startsWith('un_') }">
          {{ row[column.field] }}
        </span>
      </template>
    </Grid>
  </div>
</template>

<script lang="ts" setup>
  import { nextTick, ref, computed } from 'vue';
  import { getColumns, getFormConfig } from './config';
  import { DETAIL_PAGE_INFO_MAP } from './detail/config/index';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import {
    getColumnsConfigList,
    formatDataList,
    getDateRangeDim,
    ETimeDimension,
    getMergeInfo,
    parseWeekString,
    createStickyMask,
    copyToClipboard,
    getStripeClassByFlowNode,
  } from './utils';
  import dayjs from 'dayjs';
  import { getReportData } from '/@/api/business/PMTData';
  import { useGo } from '/@/hooks/web/usePage';
  import { useRouter } from 'vue-router';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { omit } from 'lodash-es';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';

  defineOptions({ name: 'business-PMTData' });

  const tableColumns = ref<Array<any>>([]);
  const go = useGo();
  const router = useRouter();
  const { t } = useI18n();
  const { createMessage } = useMessage();

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: getFormConfig(),
      handleSubmit: getDataSource,
    },
    gridOptions: {
      // id: 'business-PMTData-List',
      columns: getColumns() as any,
      beforeFetch: formatParams,
      afterFetch: createStickyMask,
      api: getTableData,
      pagerConfig: {
        autoHidden: false,
        pageSizes: [20, 50, 100, 200, 500, 1000, 2000],
      },
      toolbarConfig: {
        refresh: false,
      },
      // @ts-ignore
      proxyConfig: {
        autoLoad: false,
        response: {
          list: 'data.list',
          total: 'data.total',
        },
      },
      cellConfig: {
        height: 32,
      },
      cellClassName: ({ columnIndex }) => {
        // `流程节点`列之前的列需要做粘性定位
        return columnIndex > 5 ? 'normal-cell' : 'long-merge-cell';
      },
      headerCellConfig: {
        height: 36,
      },
      columnConfig: {
        maxFixedSize: 100,
      },
      showOverflow: 'tooltip',
      rowClassName: getStripeClassByFlowNode,
      virtualYConfig: {
        enabled: false,
        scrollToTopOnChange: true,
      },
      // headerCellClassName: ({ column }) => {
      // 隐藏`指标子级表头`
      // if (column.field === 'TitleList_Title1') {
      //   column.colSpan = gridApi.grid.getColumns().filter(item => item.field.startsWith('TitleList')).length;
      // } else if (column.field.startsWith('TitleList')) {
      //   return 'hidden';
      // }
      // 其余表头不做处理
      // return '';
      // },
      exportConfig: {
        isMerge: true,
        // sheetMethod: ({ options, worksheet }) => {
        // // 合并所有指标列的表头，及以`TitleList`开头的列
        // const titleColumnsCount = options.columns.filter((column: any) => column.field.startsWith('TitleList')).length;
        // // 取第一个指标在excel的列索引，65为大写字母`A`的unicode编码
        // const startX = options.columns.findIndex((column: any) => column.field.startsWith('TitleList')) + 65;
        // // 计算结束列在excel中的坐标
        // const endX = startX + titleColumnsCount - 1;
        // worksheet.mergeCells(`${String.fromCharCode(startX)}1:${String.fromCharCode(endX)}1`);
        // },
      },
    },
    gridEvents: {
      resizableChange: createStickyMask,
      custom: () => {
        setMergeCells(gridApi.getDataSource()).then(() => createStickyMask());
      },
    },
  });

  /** 格式化请求参数 */
  function formatParams(params: any) {
    const query = { ...params };
    if (query.weekRange) {
      const weekRange = getDateRangeDim(ETimeDimension.WEEK, query.weekRange);
      Object.assign(query, weekRange);
      delete query.weekRange;
    }
    return query;
  }

  const dataSource = ref<Array<any>>([]);
  /** 获取全部的列表数据 */
  async function getDataSource(params: any) {
    gridApi.formApi.setLatestSubmissionValues({ ...params });

    dataSource.value.length = 0;
    const query = formatParams(params);
    gridApi.setLoading(true);
    return getReportData(query)
      .then(async res => {
        const data = formatTableData(Array.isArray(res.data) ? res.data : []);
        const originColumns = getColumns();

        tableColumns.value = getColumnsConfigList({ data, columns: originColumns, query });
        await gridApi.reloadColumn(tableColumns.value);

        dataSource.value = formatDataList({ data, columns: originColumns });
        return;
      })
      .catch(err => console.warn('🚀 ~ list:res.data.slice ~ err:', err))
      .finally(() => {
        gridApi.setLoading(false);
        gridApi.reload();
      });
  }

  /**
   * 前端实现分页，数据源来自`dataSource.value`
   * @param params
   */
  async function getTableData(params: { currentPage: number; pageSize: number }) {
    return new Promise(resolve => {
      setTimeout(() => {
        const startIndex = (params.currentPage - 1) * params.pageSize;
        const endIndex = startIndex + params.pageSize;
        const paginatedData = dataSource.value.slice(startIndex, endIndex);
        setMergeCells(paginatedData);

        resolve({
          data: {
            list: paginatedData,
            total: dataSource.value.length,
          },
        });
      }, 700);
    });
  }

  /** 从字符串末尾提取数字 */
  function extractNumberFromEnd(str: string): number {
    let result = '';
    for (let i = str.length - 1; i >= 0; i--) {
      if (/\d/.test(str[i])) {
        result = str[i] + result;
      } else {
        break;
      }
    }
    return result ? Number.parseInt(result, 10) : 0;
  }

  /** 格式化数据源 */
  function formatTableData(data: Array<any>) {
    return data.map(item => {
      const keys = Object.keys(item).filter(key => key.startsWith('Title'));
      const TitleList = keys
        .map(key => {
          return {
            keys: key,
            values: item[key],
          };
        })
        .sort((a, b) => {
          // 排序
          const numA = extractNumberFromEnd(a.keys);
          const numB = extractNumberFromEnd(b.keys);
          return numA - numB;
        });
      return {
        ...item,
        TitleList,
      };
    });
  }

  /** 跳转明细处理 */
  async function handleLink(row: any, column: any) {
    if (!DETAIL_PAGE_INFO_MAP[row.RowType]) {
      createMessage.warn(t('dict.PMTData.noDetailsTip'));
      return false;
    }

    const path = `/business/PMTData/detail/${row.RowType}`;

    const { getQuery } = DETAIL_PAGE_INFO_MAP[row.RowType];

    const isWeekColumn = column.field.startsWith('List_');

    const params = getDateRangeDim(ETimeDimension.WEEK, (await gridApi.getFetchParams()).weekRange);
    const startWeek = isWeekColumn ? column.field.split('_')[1] : params.startDim;
    const endWeek = isWeekColumn ? column.field.split('_')[1] : params.endDim;

    const pathInfo: { path: string; query: Recordable<any> } = {
      path,
      query:
        typeof getQuery === 'function'
          ? getQuery(row)
          : {
              prjCode: row.PrjCode,
              tmlCusPrjCode: row.TmlCusPrjCode,
              startDim: parseWeekString(startWeek),
              endDim: parseWeekString(endWeek, true),
              factory: typeof row.OrgCode === 'string' ? row.OrgCode.split('/')[0] : '',
              rowType: row.RowType,
              stage: row.customerProductStage,
            },
    };

    if (column.field === 'Total') {
      delete pathInfo.query.startDim;
      delete pathInfo.query.endDim;
    }

    go(router.resolve(pathInfo).fullPath);
  }

  /** 设置表格单元格合并 */
  async function setMergeCells(list: Array<any>) {
    await nextTick(() => gridApi.grid.clearMergeCells());
    const mergeCells = getMergeInfo(
      list,
      tableColumns.value.reduce((list, item) => {
        if (Array.isArray(item.children)) {
          list.push(...item.children.map((c: any) => c.field));
        } else {
          list.push(item.field);
        }
        return list;
      }, []),
    );
    return gridApi.grid.setMergeCells(mergeCells);
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
      filename: () => `${t('routes.business-PMTData')}_${dayjs().format('YYYY-MM-DD')}`,
    });
  }

  const copyLinkLoading = ref(false);
  /** 根据搜索内容，生成链接并且复制到剪切板 */
  async function handleCopyLink() {
    copyLinkLoading.value = true;
    const params = await gridApi.getFetchParams();
    const { startDim, endDim } = getDateRangeDim(ETimeDimension.WEEK, params.weekRange);
    params.startDim = parseWeekString(startDim);
    params.endDim = parseWeekString(endDim, true);
    delete params.weekRange;
    const link = router.resolve({
      path: '/business/PMTData/share',
      query: omit(params, 'currentPage', 'pageSize'),
    });
    link &&
      copyToClipboard(window.location.origin + link.fullPath)
        .then(() => {
          createMessage.success(t('common.copySuccess'));
        })
        .finally(() => {
          copyLinkLoading.value = false;
        });
  }

  const schemasFields = computed(() =>
    getFormConfig()
      .map(item => item.fieldName)
      .concat('startDim', 'endDim'),
  );
  useRouteParams(
    schemasFields.value.reduce(
      (obj: { [key: string]: any }, item) => {
        obj[item] = {};
        return obj;
      },
      { rowType: {} },
    ),
    params => {
      nextTick(() => {
        if (params.startDim && params.endDim) {
          gridApi.formApi.setFieldValue('weekRange', [dayjs(params.startDim), dayjs(params.endDim)]);
        }
        schemasFields.value.forEach(fieldName => {
          if (!params[fieldName]) {
            return false;
          }

          if (fieldName !== 'startDim' && fieldName !== 'endDim') {
            gridApi.formApi.setFieldValue(fieldName, params[fieldName]);
          }
        });
        gridApi.formApi.submitForm();
      });
    },
  );
</script>

<style lang="less" scoped>
  :deep(.lydc-content-wrapper-search-box) {
    margin-bottom: 0 !important;
  }

  :deep(td.vxe-body--column .vxe-cell) {
    height: 32px !important;
  }

  :deep(td.long-merge-cell .vxe-cell .vxe-cell--wrapper) {
    height: 100%;
    text-overflow: clip !important;

    span.vxe-cell--label span {
      // 隐藏
      color: transparent;
    }
  }

  :deep(.title-cell div.vxe-cell) {
    width: 100% !important;
  }

  :deep(.bg-yellow) {
    background-color: rgb(254 239 208);
  }

  :deep(.bg-blue) {
    background-color: #fafafa;
  }

  .bg-red {
    color: @error-color;
  }
</style>
