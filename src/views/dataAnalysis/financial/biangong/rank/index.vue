<!-- 维度分组页面 -->
<template>
  <TableLayout class="biangong-table-layout">
    <template #toolbarLeft>
      <!-- {{ dimensionTypeOptions }} -->
      <ToolBarAction :dataSource="dataSource" />
    </template>
    <template #toolbarRight>
      <a-button v-if="showUpdateSap" @click="handleDingDingRobotNotific">推送</a-button>
    </template>
  </TableLayout>
</template>

<script lang="ts" setup>
  import { isEmpty } from 'lodash-es';
  import { computed, ref, reactive, watch, onMounted } from 'vue';
  import { getAllColumns, formOptions, customFieldOptions, dimensionTypeKeyMap } from './config';
  import { useTableLayout } from '/@/views/dataAnalysis/components/TableLayout/useTableLayout';
  import { getDimensionRankingData, getDimensionWordNoSearchparameter, postDingDingRobotNotific } from '/@/api/dataAnalysis/financial';

  import ToolBarAction from './ToolBarAction.vue';
  import type { VxeGridProps } from 'vxe-table';

  defineOptions({ name: 'dataAnalysis-financial-biangong-rank' });
  // const dimensionTypeOptions = ref({});

  const columns = ref(getAllColumns());
  const attrs = reactive<VxeGridProps<any>>({
    id: 'dataAnalysis-financial-biangong-rank-list',
    stripe: true,
    filterConfig: {
      remote: true,
    },
    sortConfig: {
      remote: false,
    },
    pagerConfig: {
      enabled: true,
    },
    proxyConfig: {
      autoLoad: true,
      response: {
        list: 'data.list',
      },
    },
  });

  const [TableLayout, api] = useTableLayout({
    formConfig: {
      formOptions,
    },
    tableConfig: {
      columns,
      attrs,
      customFieldOptions,
      isFrontPagination: true,
      footerFiled: 'data.total',
      batchAuth: 'btn_download',
      formatFrontData: data => {
        return data.sort((a, b) => a.sort - b.sort);
      },
      getExportParams: () => {
        const { getFormParams } = api.searchFormApi;
        const { startDim, endDim } = getFormParams();
        const filename = `维度排名_${startDim}-${endDim}`;
        return {
          filename,
        };
      },
      api: params => {
        const processedParams = { ...params };
        // console.log('params', params);
        Object.keys(processedParams).forEach(key => {
          if (key.startsWith('dimesionType_')) {
            const newKey = key.replace('dimesionType_', '');
            processedParams[dimensionTypeKeyMap[newKey]] = processedParams[key];
            delete processedParams[key];
          }
        });
        return getDimensionRankingData(processedParams);
      },
    },
  });

  const dataSource = computed(() => {
    const { result } = api.getCacheInfo();
    const { list } = result.data ?? { list: [] };
    return list;
  });

  const showUpdateSap = computed(() => {
    const { getFormParams } = api.searchFormApi;
    const { orgCode = '' } = getFormParams();
    return orgCode.length >= 9;
  });

  onMounted(() => {
    const { state } = api.searchFormApi;
    // 拉取项目下拉
    watch(
      [() => state.searchLoading, () => state.searchFormValue.orgCode, () => state.searchFormValue.dateRange, () => state.searchFormValue.dimension],
      () => {
        if (!state.searchLoading && !isEmpty(state.searchFormValue)) {
          getDimensionWordNoSearchparameterInfo();
        }
      },
      { immediate: true, deep: true },
    );
    // 动态显示隐藏bu/sbu维度
    watch(
      () => state.searchFormValue.orgCode,
      () => {
        const { state, setState } = api.searchFormApi;
        const isHide = state.searchFormValue.orgCode !== 'MQ';
        const keyIdx = state.formOptions.findIndex(item => item.key === 'busbuDim');
        setState(`formOptions.${keyIdx}.isHide`, isHide);
      },
      { immediate: true, deep: true },
    );
    // watch(
    //   [() => state.searchLoading],
    //   () => {
    //     if (!state.searchLoading && !isEmpty(state.searchFormValue)) {
    //       getDimensionTypeOptions();
    //     }
    //   },
    //   { immediate: true, deep: true },
    // );
  });

  // 获取查询参数信息
  function getDimensionWordNoSearchparameterInfo() {
    const { state, getFormParams, setState } = api.searchFormApi;
    const { orgCode, startDim, endDim, dimension } = getFormParams();
    getDimensionWordNoSearchparameter({
      orgCode,
      startDim,
      endDim,
      dimension,
    }).then(({ data }) => {
      const keyIdx = formOptions.findIndex(item => item.key === 'workNoType');
      if (state.formOptions[keyIdx]) {
        const options = data.map(item => ({
          text: item,
          value: item,
        }));
        setState(`formOptions.${keyIdx}.options`, options);
      }
    });
  }

  const handleDingDingRobotNotific = async () => {
    const { getFormParams } = api.searchFormApi;
    const { orgCode } = getFormParams();
    await postDingDingRobotNotific(orgCode);
  };
  // 取接口 获取维度的下拉框
  // function getDimensionTypeOptions() {
  //   const { getFormSignItem } = api.searchFormApi;
  //   const options = getFormSignItem('dimensionType');
  //   // console.log(options.options, 'api.searchFormApi');
  //   dimensionTypeOptions.value = options.options.reduce((acc, item) => {
  //     acc[item.text] = item.value;
  //     return acc;
  //   }, {});
  // }
</script>
<style lang="less" scoped>
  //  公共表头padding
  :deep(tr .vxe-header--column) {
    padding: 2px 0 !important;
  }

  // 合并 一级表头padding
  :deep(tr .col--group) {
    padding: 0 !important;
  }
</style>
