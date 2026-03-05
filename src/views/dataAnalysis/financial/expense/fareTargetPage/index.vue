<!-- 费用目标 -->
<template>
  <TableLayout>
    <template #toolbarLeft>
      <a-button v-for="(item, idx) in jumpButtonOptions" :key="idx" type="primary" class="mr-8px" @click="handleJump(item)">
        {{ item.title }}
      </a-button>
      <a-button @click="handleFlag">{{ isShow ? '隐藏分析列' : '显示分析列' }}</a-button>
      <a-button @click="handleSave" :loading="saveLoading" v-if="isSyncBtnShow">保存</a-button>
    </template>
  </TableLayout>
</template>

<script lang="ts" setup>
  import { reactive, ref, onActivated, onMounted, watch, computed } from 'vue';
  import { getAllColumns, formOptions, reversedDimTypeKeyMap, jumpButtonOptions } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { targetdetailPage, analysisAddOrUpdate } from '/@/api/dataAnalysis/fare';
  import { EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
  import type { VxeGridProps } from 'vxe-table';
  import { useRouter, useRoute } from 'vue-router';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useRouteParams } from '/@/views/dataAnalysis/hooks/useRouteParams';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isEmpty } from 'lodash-es';
  import { IJumpButtonOption } from '/@/views/dataAnalysis/components/TableLayout/types';
  import { extractAnalysisFields, filterAnalysisAndStrategy, processData } from './utils';
  const { goPath } = useRouteParams();

  const { createMessage, createConfirm } = useMessage();
  const { t } = useI18n();

  defineOptions({ name: 'dataAnalysis-financial-expense-fareTargetPage' });

  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-expense-fareTargetPage-list',
    proxyConfig: {
      response: {
        list: 'data.List',
      },
    },
    rowConfig: {
      resizable: true,
    },
    resizableConfig: {
      isAllRowDrag: true,
      isDblclickAutoWidth: true,
      isDblclickAutoHeight: true,
    },
    cellConfig: {
      height: -1,
      verticalAlign: 'top',
    },
    // showOverflow: false,
    showFooterOverflow: true,
    filterConfig: {
      remote: true,
    },
    keepSource: true,
    editConfig: {
      trigger: 'dblclick',
      mode: 'cell',
      showStatus: true,
    },
  });
  const isShow = ref(false);
  const saveLoading = ref(false);
  const isSyncBtnShow = ref(false);
  const columns = ref(getAllColumns(isSyncBtnShow.value));
  const filterOptions = ref<TFormItemOption[]>([]);
  const router = useRouter();
  const route = useRoute();
  const { setTitle } = useTabs(router);
  const { getParams } = useRouteParams();

  let arr: string[] = [];
  const handleFlag = () => {
    isShow.value = !isShow.value;
    if (isShow.value) api.getGridInstance().refreshColumn();
    arr = extractAnalysisFields(api.getGridInstance()?.getFullColumns());
    isShow.value ? api.getGridInstance().showColumn(arr) : api.getGridInstance().hideColumn(arr);
  };
  const getTargetdetailPage = async (params: Record<string, any>) => {
    params.showTarget = route.query.paramsId ? 0 : 1;
    let res = await targetdetailPage(params);
    return res;
  };

  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions,
      filterOptions,
    },
    tableConfig: {
      columns,
      attrs,
      footerFiled: 'data.Total',
      isFrontPagination: true,
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startDim, endDim } = getFormParams();
        const filename = `费用目标_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      beforeQuery: params => {
        // const { dimensionType } = params;
        // const isDimensionType = (dimensionType.includes('mjkm') && dimensionType.includes('dygbsywd')) || isSyncBtnShow.value;
        columns.value = getAllColumns(isSyncBtnShow.value);
      },
      api: async params => {
        const processedParams = { ...params };

        Object.keys(processedParams).forEach(key => {
          if (key.startsWith('DimesionType_')) {
            const newKey = key.replace('DimesionType_', '');
            processedParams[reversedDimTypeKeyMap[newKey]] = processedParams[key];
            delete processedParams[key];
          }
        });
        return await getTargetdetailPage(processedParams);
      },
      formatFrontData: data => {
        attrs.footerCellClassName = ({ row, column }) => {
          // console.log(row[column.field], column.field, column);
          if (column.field.includes('分析_占比(%)') && 1 * (row[column.field] || '0').replace('%', '') > 0) {
            return 'text-red vxe-foot-data-cell';
          }
          return 'vxe-foot-data-cell';
        };
        return data;
      },
    },
  });

  // 重新激活页面
  onActivated(() => {
    const params = getParams();
    if (params.title) {
      setTitle(params.title);
    }
  });

  onMounted(() => {
    const { state } = api.searchFormApi;
    watch(
      [() => state.searchLoading, () => state.searchFormValue.orgCode, () => state.searchFormValue.dimensionType],
      () => {
        if (!state.searchLoading && !isEmpty(state.searchFormValue)) {
          const options = (api.searchFormApi.getFormSignItem('orgCode') as any).options;
          const level = options.find(item => item.value === state.searchFormValue.orgCode)?.level;
          isSyncBtnShow.value = level !== 3 && state.searchFormValue.dimensionType.includes('mjkm') && state.searchFormValue.dimensionType.includes('dygbsywd');
        }
      },
      { immediate: true, deep: true },
    );
    watch(
      [() => state.formOptions],
      () => {
        const { formOptions = [] } = api.searchFormApi.state;
        const params = getParams();
        const dimensionOptions = (formOptions.find(item => item.key === 'dimensionType') as any)?.options || [];
        filterOptions.value = dimensionOptions.map(({ text: label, value: dimensionType }) => {
          return {
            label,
            type: EFormItemType.INPUT,
            default: params[dimensionType] ?? '',
            key: dimensionType,
          };
        });
      },
      {
        deep: true,
        immediate: true,
      },
    );
  });

  const searchFormValue = computed(() => {
    const { state } = api.searchFormApi;
    return state.searchFormValue;
  });
  const formParams = computed(() => {
    const { getFormParams } = api.searchFormApi;
    return getFormParams();
  });

  // 跳转
  const handleJump = (item: IJumpButtonOption) => {
    const { getPathUrl, getPathParams } = item;
    const path = getPathUrl(formParams.value, searchFormValue.value);
    const params = getPathParams?.(formParams.value, searchFormValue.value) ?? {};
    goPath(path, params);
  };
  const handleSave = () => {
    saveLoading.value = true;
    const { updateRecords } = api.getGridInstance().getRecordset();

    const updateRecordsArr = processData(filterAnalysisAndStrategy(updateRecords), searchFormValue.value.orgCode);
    if (updateRecordsArr.length === 0) {
      saveLoading.value = false;
      createMessage.warning(t('dict.common.dataUnchanged'));
      return;
    }
    analysisAddOrUpdate(updateRecordsArr)
      .then(({ code, msg }) => {
        if (code == 200) {
          createMessage.success(msg);
          api.forceUpdate();
        } else {
          createMessage.error(msg);
        }
      })
      .catch(() => {})
      .finally(() => {
        saveLoading.value = false;
      });
  };
</script>

<style lang="less" scoped>
  @import url('/@/views/dataAnalysis/style.less');

  :deep(.vxe-cell.c--title) {
    width: 100% !important;
  }
</style>
