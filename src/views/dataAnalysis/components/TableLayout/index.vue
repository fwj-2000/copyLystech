<!-- 表格页面布局封装 -->
<template>
  <div class="lydc-content-wrapper">
    <div class="data-analysis-common-page-container">
      <div class="data-analysis-common-index-container">
        <!-- 搜索条件 -->
        <SearchForm v-show="showSearchForm">
          <template #right>
            <a-button type="primary" @click="handleSearch" :loading="searchBtnLoading">查询</a-button>
          </template>
        </SearchForm>
        <!-- 报表表格 -->
        <div class="w-[100%] h-[100%] overflow-hidden data-analysis-vxe-table">
          <BaseVxeTable @register="register" @refresh="handleSearch">
            <!-- 左侧按钮 -->
            <template #toolbarActions>
              <a-space>
                <slot name="toolbarLeft"></slot>
                <!-- 批量导入导出 -->
                <BatchMenu v-if="showBatchMenu" :formParams="formParams" :menuItems="props?.toolbarConfig?.batchMenuItems ?? []" :methods="toolBarMethod" />
                <a-button v-if="showBatchExport" :loading="batchExportLoading" @click="handleBatchExport">{{ t('common.batchExport') }}</a-button>
                <slot name="toolbarRight"></slot>
              </a-space>
            </template>
            <!-- 右侧工具栏区域 -->
            <template #toolbarTools>
              <slot name="toolbarTools"></slot>
            </template>
            <template #customCell="{ row, column }">
              <slot name="customCell" :row="row" :column="column"></slot>
            </template>
          </BaseVxeTable>
        </div>
      </div>
    </div>
    <!-- end -->
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, unref, reactive, nextTick } from 'vue';
  import { get, isEmpty, isEqual, isFunction, omit, pick } from 'lodash-es';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useBaseVxeTable } from '/@/views/dataAnalysis/components/BaseVxeTable/useBaseVxeTable';
  import { useSearchForm } from '/@/views/dataAnalysis/components/BaseSearchForm/useSearchForm';

  import BaseVxeTable from '/@/views/dataAnalysis/components/BaseVxeTable/index.vue';
  import BatchMenu from '../BatchMenu/index.vue';
  import Api from './api';

  import { IProps, ICacheInfo } from './types';
  import { usePermission } from '/@/hooks/web/usePermission';

  const batchExportLoading = ref(false);
  const searchBtnLoading = ref(false);
  const isForceSearch = ref(false); // 强制刷新数据（拉取接口
  const cacheInfo = reactive<ICacheInfo>({
    cacheData: [], // 前端分页缓存数据
    lastParams: {}, // 上次请求参数
    result: {}, // 请求完整的结果
  });

  const props = withDefaults(defineProps<IProps>(), {
    api: () => new Api(),
    formConfig: () => ({
      formOptions: [],
      filterOptions: [],
      commonAttrs: {},
      enabled: true,
    }),
    tableConfig: () => ({
      columns: [],
      attrs: {},
      customFieldOptions: {},
      isFrontPagination: false,
      getExportParams: () => {},
      api: () => new Promise(() => ({})),
    }),
    toolbarConfig: () => ({
      batchMenuItems: [],
    }),
  });

  const { t } = useI18n();
  const { hasBtnP } = usePermission();
  const [SearchForm, searchFormApi] = useSearchForm({
    formOptions: props.formConfig.formOptions,
    filterOptions: props.formConfig.filterOptions,
    commonAttrs: props.formConfig.commonAttrs,
  });

  const searchLoading = computed(() => {
    const { state } = searchFormApi;
    return state.searchLoading;
  });
  const searchFormValue = computed(() => {
    const { state } = searchFormApi;
    return state.searchFormValue;
  });
  const formParams = () => {
    const { getFormParams } = searchFormApi;
    return getFormParams();
  };
  const columns = computed(() => {
    return unref(props.tableConfig.columns);
  });
  const showBatchMenu = computed(() => {
    const { batchAuth } = props.tableConfig;
    return (!batchAuth || hasBtnP(batchAuth)) && !isEmpty(props?.toolbarConfig?.batchMenuItems ?? []);
  });
  const showSearchForm = computed(() => {
    if (!props.formConfig) return true;
    const { enabled } = props.formConfig;
    return typeof enabled === 'undefined' ? true : enabled;
  });
  const showBatchExport = computed(() => {
    const { getExportParams } = props.tableConfig;
    const { baseExportMethod } = props.toolbarConfig;
    return isFunction(getExportParams) || isFunction(baseExportMethod) ? true : false;
  });

  const [register, { reloadData, getGridInstance }] = useBaseVxeTable({
    isAutoQuery: false,
    immediateQuery: true,
    searchFormValue,
    searchLoading,
    columns,
    ...pick(props.tableConfig, ['customFieldOptions', 'attrs', 'footerFiled', 'beforeQuery', 'afterQuery']),
    getParams: () => {
      const params = formParams();
      // const params = searchFormApi.getFormParams();
      const { getQueryExtraParams } = props.tableConfig;
      if (isFunction(getQueryExtraParams)) {
        return {
          ...getQueryExtraParams(),
          ...params,
        };
      }
      return params;
    },
    api: params => tableApi(params),
  });

  const toolBarMethod = {};

  props?.api?.mount({
    searchFormApi,
    cacheInfo,
    forceUpdate,
    getGridInstance,
  });

  // 批量导出
  const handleBatchExport = async () => {
    const { baseExportMethod } = props.toolbarConfig;
    if (isFunction(baseExportMethod)) {
      batchExportLoading.value = true;
      try {
        await baseExportMethod();
      } catch (error) {
        console.error('导出失败:', error);
      } finally {
        batchExportLoading.value = false;
      }
    } else {
      const grid = getGridInstance?.();
      const params = props.tableConfig?.getExportParams?.() ?? {};
      console.log(params, 'paramsparamsparamsparams');
      if (grid) {
        grid.openExport({
          ...params,
          sheetMethod: ({ worksheet }) => {
            worksheet.eachRow(excelRow => {
              excelRow.eachCell(excelCell => {
                excelCell.numFmt = '@';
                // typeof excelCell.value === 'number' ? (excelCell.numFmt = params?.numFmt || '@') : (excelCell.numFmt = '@');
              });
            });
          },
        });
      }
    }
  };

  /**
   * @description: 强制刷新数据（拉取接口）
   */
  function forceUpdate() {
    nextTick(async () => {
      isForceSearch.value = true;
      searchBtnLoading.value = true;
      reloadData({}).finally(() => {
        isForceSearch.value = false;
        searchBtnLoading.value = false;
      });
    });
  }

  // 查询
  const handleSearch = () => {
    const { setState } = searchFormApi;
    setState('isExtendFilters', false);
    nextTick(async () => {
      isForceSearch.value = true;
      searchBtnLoading.value = true;
      reloadData({}).finally(() => {
        isForceSearch.value = false;
        searchBtnLoading.value = false;
      });
    });
  };

  function tableApi(params: any) {
    if (!props.tableConfig.isFrontPagination) {
      return props.tableConfig.api(params);
    }
    return new Promise(async (resolve, reject) => {
      // 添加 reject 参数
      try {
        const omitParams = omit(params, ['currentPage', 'pageSize', 'total']);
        const isParamsEqual = isEqual(cacheInfo.lastParams, omitParams);
        const { attrs, formatFrontData } = props.tableConfig;
        const listField = attrs?.proxyConfig?.response?.list ?? 'data';
        if (isEmpty(cacheInfo.cacheData) || !isParamsEqual || isForceSearch.value) {
          const res = await props.tableConfig.api(params); // 如果这里出错会抛出异常
          let dataList = get(res, listField as string);
          if (isFunction(formatFrontData)) {
            dataList = formatFrontData(dataList);
          }
          cacheInfo.lastParams = omitParams;
          cacheInfo.cacheData = dataList ?? [];
          cacheInfo.result = res ?? {};
        }
        const { currentPage, pageSize } = params;
        const begin = (currentPage - 1) * pageSize;
        const end = currentPage * pageSize;
        const result = {
          data: {
            ...(listField === 'data' ? {} : cacheInfo.result.data),
            list: cacheInfo.cacheData.slice(begin, end),
            pagination: {
              Total: cacheInfo.cacheData.length,
            },
          },
        };
        setTimeout(() => {
          resolve(result);
        }, 200);
      } catch (error) {
        // 添加错误处理，确保 Promise 能够正确结束
        reject(error);
      }
    });
  }
</script>

<style lang="less" scoped>
  @import url('/@/views/dataAnalysis/style.less');

  :deep(.vxe-cell.c--title) {
    width: 100% !important;
  }
</style>
