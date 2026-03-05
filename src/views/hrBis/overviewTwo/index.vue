<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button v-auth="'btn_download'" @click="handleExport()">{{ t('common.batchExport') }}</a-button>
            </a-space>
          </template>
        </Grid>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { dataMock, getHrTrainFormConfig, getHrTrainPageColumns, spanMethodFun, getColumnsConfigList, formatDataList } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { reportdetail, reportdatapageparam } from '/@/api/hr/netHouseSubsidy';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import dayjs from 'dayjs';
  defineOptions({ name: 'hrBis-overviewTwo' });

  const { t } = useI18n();
  onMounted(async () => {
    gridApi.setFieldValue('month', [dayjs().subtract(1, 'month'), dayjs().subtract(0, 'month')]).then(async () => {
      // console.log('🚀 ~  .getFromValue', await gridApi.getFromValue());
      getDataSource(await gridApi.formApi.getValues());
    });
    init();
  });

  const init = async () => {
    reportdatapageparam({}).then(res => {
      const orgCode = Object.entries(res.data.orgList).map(([key, value]) => ({
        label: value,
        value: key,
      }));
      const workNoList = res.data.workNoList.map(item => ({
        label: item,
        value: item,
      }));
      const userNameList = Object.entries(res.data.userNameList).map(([key, value]) => ({
        label: value,
        value: key,
      }));
      gridApi.updateSchema([
        {
          fieldName: 'orgCode',
          componentProps: {
            options: orgCode,
          },
        },
        {
          fieldName: 'creatorUserAccount',
          componentProps: {
            options: workNoList,
          },
        },
        {
          fieldName: 'creatorUserId',
          componentProps: {
            options: userNameList,
          },
        },
      ]);
    });
  };
  /** 导出 */
  async function handleExport() {
    const { month } = await gridApi.getFetchParams();

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
      filename: () => `${t('routes.hrBis-overviewTwo')}_${dayjs(month[0]).format('YYYY-MM')}_${dayjs(month[1]).format('YYYY-MM')}`,
    });
  }
  const [Grid, /*setFieldValue,*/ gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: false,
      submitOnChange: false,
      showCollapseButton: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
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
      id: 'hrBis-overviewTwo',
      columns: getHrTrainPageColumns() as any,
      api: getTableData,
      spanMethod: spanMethodFun, //合并列
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
  const tableColumns = ref<Array<any>>([]);
  const dataSource = ref<Array<any>>([]);
  /** 获取全部的列表数据 */
  async function getDataSource(params: any) {
    gridApi.formApi.setLatestSubmissionValues({ ...params });
    dataSource.value.length = 0;
    const query = formatParams(params);
    gridApi.setLoading(true);
    return reportdetail(query)
      .then(async res => {
        // const data = dataMock.data;
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

  /** 格式化请求参数 */
  function formatParams(params: any) {
    const _params = {
      ...params,
    };
    if (params.month) {
      _params.startDim = dayjs(params.month[0]).format('YYYY-MM');
      _params.endDim = dayjs(params.month[1]).format('YYYY-MM');
      delete _params.month;
    }
    return _params;
  }
</script>
