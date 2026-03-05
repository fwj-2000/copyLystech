<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button @click="handleExport()">{{ t('common.batchExport') }}</a-button>
            </a-space>
          </template>
        </Grid>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { getHrTrainFormConfig, getHrTrainPageColumns, getColumnsConfigList, formatDataList } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { reportstatus } from '/@/api/hr/netHouseSubsidy';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import dayjs from 'dayjs';

  defineOptions({ name: 'hrBis-maintenanceHR' });
  const { t } = useI18n();
  onMounted(async () => {
    setFieldValue('month', [dayjs().subtract(1, 'month'), dayjs().subtract(0, 'month')]).then(async () => {
      getDataSource(await gridApi.formApi.getValues());
    });
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: false,
      submitOnChange: false,
      showCollapseButton: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      // fieldMappingTime: [['month', ['startDim', 'endDim'], 'YYYY-MM']]
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getHrTrainFormConfig(),
      handleSubmit: getDataSource,
      resetButtonOptions: {
        content: t('common.resetText'),
        show: false,
      },
      i18nConfig: {
        moduleCode: 'hrBisColumn',
        transferRange: ['placeholder'], //placeholder
      },
    },
    gridOptions: {
      showIndexColumn: true,
      id: 'hrBis-maintenanceHR',
      columns: getHrTrainPageColumns() as any,
      beforeFetch: params => {
        const { month, ...res } = params;
        return {
          ...handleMonthChange(month),
          ...res,
        };
      },
      api: getTableData,
      pagerConfig: {
        pageSize: 50,
        autoHidden: false,
        pageSizes: [50, 500, 1000, 2000],
      },
      // @ts-ignore
      proxyConfig: {
        autoLoad: false,
        response: {
          list: 'data.list',
          total: 'data.total',
        },
      },
      i18nConfig: {
        moduleCode: 'hrBisColumn',
      },
    },
  });
  const { setFieldValue, setLatestSubmissionValues, getFromValue } = gridApi;

  const tableColumns = ref<Array<any>>([]);
  const dataSource = ref<Array<any>>([]);
  /** 获取全部的列表数据 */
  async function getDataSource(params: any) {
    gridApi.formApi.setLatestSubmissionValues({ ...params });
    dataSource.value.length = 0;
    const { month, ...res } = params;
    const query = handleMonthChange(month);
    gridApi.setLoading(true);
    return reportstatus({ ...query, ...res })
      .then(async res => {
        const data = res.data;
        const originColumns = getHrTrainPageColumns();
        tableColumns.value = getColumnsConfigList({ data, columns: originColumns });
        await gridApi.reloadColumn(tableColumns.value);
        dataSource.value = formatDataList({ data, columns: originColumns });
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
        resolve({
          data: {
            list: paginatedData,
            total: dataSource.value.length,
          },
        });
      }, 700);
    });
  }

  async function handleExport() {
    const { month } = await gridApi.getFetchParams();

    // 确保存在queryAll方法
    if (gridApi.grid && gridApi.grid.proxyConfig && gridApi.grid.proxyConfig.ajax) {
      // 如果queryAll不存在，则基于现有的query方法创建一个忽略分页的版本
      if (!gridApi.grid.proxyConfig.ajax.queryAll) {
        gridApi.grid.proxyConfig.ajax.queryAll = async (params): Promise<any> => {
          try {
            // 调用现有的query方法，但忽略分页参数，以获取全部数据
            const result = await gridApi.grid?.proxyConfig?.ajax?.query?.({
              page: { currentPage: 1, pageSize: 9999999999, total: 9999999999 },
              ...params,
            });
            return result;
          } catch (error) {
            console.error('Error occurred while querying all data:', error);
            throw error;
          }
        };
      }
    }

    gridApi.grid.openExport({
      type: 'xlsx',
      types: ['xlsx'],
      mode: 'all',
      modes: ['all'],
      filename: () => `${t('routes.hrBis-maintenanceHR')}_${dayjs(month[0]).format('YYYY-MM')}_${dayjs(month[1]).format('YYYY-MM')}`,
    });
  }
  /**
   * 处理月份选择器值变化，转换为开始和结束时间维度
   * @param month 月份范围数组，格式为 [startDate, endDate]
   * @returns 包含开始和结束时间维度的对象
   */
  const handleMonthChange = (month: [Date | string | null, Date | string | null] | null) => {
    // 检查month是否存在且有值
    if (month && month.length === 2 && month[0] && month[1]) {
      return {
        startDim: dayjs(month[0]).format('YYYY-MM'),
        endDim: dayjs(month[1]).format('YYYY-MM'),
      };
    }
    // 默认返回空字符串
    return {};
  };
</script>
