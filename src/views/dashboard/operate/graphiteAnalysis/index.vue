<!-- 石墨共性分析 -->
<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white p-10px">
        <SearchForm
          v-bind="{
            searchFormValue,
            showOrganizeTreeSelect: false,
            isRangePicker: true,
            showTimeDimension: false,
          }">
          <template #right>
            <a-button type="primary" @click="goMultipleAnalysis"> 自定义因子分析 </a-button>
          </template>
        </SearchForm>
        <Sankey :analysisFactor="analysisfactorlist" :nodes="nodes" :links="links" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';

  import dayjs from 'dayjs';
  import { useRouter } from 'vue-router';
  import { useSearchForm } from '/@/views/dashboard/commonHooks/useSearchForm';
  import { analyseMainApi, getMainAnalysisfactorlistApi } from '/@/api/dashbord/report';

  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import Sankey from './Sankey.vue';
  defineOptions({ name: 'dashboard-operate-graphiteAnalysis' });

  const router = useRouter();
  const nodes = ref([]);
  const links = ref([]);
  const setDataInfo = (data: any) => {
    nodes.value = data.nodes;
    links.value = data.links;
  };
  const getParams = () => {
    return {
      startTime: getDateDimParamsAllDim().startDim,
      endTime: getDateDimParamsAllDim().endDim,
    };
  };

  const defaultDate = dayjs().tz().subtract(1, 'day');
  const { searchFormValue, getDateDimParamsAllDim } = useSearchForm({
    searchApi: analyseMainApi,
    isAutoSearch: true,
    defaultSearchFormValue: {
      dateRange: [defaultDate.subtract(6, 'day'), defaultDate],
    },
    getParams,
    afterSearch: setDataInfo,
  });

  const analysisfactorlist = ref([]);
  const getAnalysisfactorlist = async () => {
    const { data } = await getMainAnalysisfactorlistApi();
    analysisfactorlist.value = Object.values(data);
  };

  const goMultipleAnalysis = () => {
    router.push('./multipleAnalysis');
  };

  onMounted(() => {
    getAnalysisfactorlist();
  });
</script>
