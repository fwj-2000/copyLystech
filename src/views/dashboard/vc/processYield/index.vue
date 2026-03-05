<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white p-16px">
        <SearchForm @register="register">
          <template #right>
            <a-button type="primary" @click="init">查询</a-button>
          </template>
        </SearchForm>

        <div class="overflow-y-auto h-[100%] custom-scrollbar">
          <div
            :class="processYieldData.length > 1 ? ['h-[400px]'] : ['pb-20px']"
            class="flex w-full justify-start items-start"
            v-for="(item, index) in processYieldData"
            :key="index">
            <div class="mb-13px mr-7.5px w-[100%] border border-solid border-color-[#f0f0f0] border-t-0 box-border">
              <div class="title-box w-full h-40px flex flex-row justify-start align-center py-8px px-16px mb-10px border border-solid border-color-[#f9e8e1]">
                <div class="flex">
                  <div class="w-3px h-16px mr-10px" style="background: #ff7b00"></div>
                  <span class="font-bold">{{ item.dimStr }} </span>
                </div>
              </div>

              <div :class="processYieldData.length > 1 ? ['overflow-y-hidden'] : ['flex-wrap']" class="pl-16px pr-16px flex justify-start pb-10px">
                <div
                  v-for="(listItem, idx) in item.list"
                  :key="idx"
                  class="border border-solid border-color-[#f0f0f0] h-310px mr-10px"
                  :class="processYieldData.length > 1 ? ['w-500px'] : 'w-[calc(33.33333333%-10px)]'">
                  <div class="flex justify-start h-30px py-5px px-16px" style="background: #f3f3f3">
                    <div class="bg w-2px h-16px mr-10px" style="background: #ff7b00"></div>
                    <div class="font-bold">{{ listItem.processes }} </div>
                  </div>
                  <Chart
                    :class="processYieldData.length > 1 ? ['w-500px'] : 'w-[calc(100%)]'"
                    class="h-260px"
                    height="100%"
                    width="100%"
                    :options="handleChartData(listItem.yield)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  defineOptions({ name: 'dashboard-vc-processYield' });
  import { Chart } from '/@/components/Chart';
  import { onMounted, ref, watch } from 'vue';
  import { isEmpty, merge } from 'lodash-es';
  import { commonOptions, getProcessesChart } from './config';
  import SearchForm from '/@/views/dashboard/commonComponents/SearchForm/index.vue';
  import { useSearchForm } from '/@/views/dashboard/commonComponents/SearchForm/useSearchForm';
  import { getProcessYield, getProcesseparam } from '/@/api/dashbord/operate';
  import { ProcessYieldItem } from './type';

  const processYieldData = ref<ProcessYieldItem[]>([]);
  const [register, { searchFormValue, searchLoading, api }] = useSearchForm({
    formOptions: commonOptions,
  });

  onMounted(() => {
    // 工序下拉值 由是否关键工序动态变化
    watch(
      [() => searchFormValue.value.isCriticalProcess],
      () => {
        if (!searchLoading.value && !isEmpty(searchFormValue.value)) {
          getDimensionWordNoSearchparameterInfo();
        }
      },
      { deep: true },
    );

    watch(
      [() => searchLoading.value],
      () => {
        if (!searchLoading.value && !isEmpty(searchFormValue.value)) {
          init();
        }
      },
      { immediate: true, deep: true },
    );
  });

  const init = async () => {
    const { code, data } = await getProcessYield(api.getFormParams());
    if (code == 200) {
      processYieldData.value = data ?? [];
    }
  };

  const handleChartData = (data: Array<{ project: string; rate: number }>) => {
    const xAxis: string[] = [];
    const directYieldRate: number[] = [];
    data.forEach(item => {
      xAxis.push(item.project);
      directYieldRate.push(Number.parseFloat((item.rate * 100).toFixed(1)));
    });
    return merge({}, getProcessesChart(), {
      xAxis: {
        data: xAxis,
      },
      series: [{ data: directYieldRate }],
      dataZoom: [{ show: directYieldRate.length > 1 ? true : false, endValue: 6 }],
    });
  };
  // 获取查询参数信息
  function getDimensionWordNoSearchparameterInfo() {
    const { isCriticalProcess } = api.getFormParams();

    getProcesseparam({
      isCriticalProcess,
    }).then(({ data }) => {
      const keyIdx = commonOptions.findIndex(item => item.key === 'processe');
      if (commonOptions[keyIdx]) {
        const options = data.map(item => ({
          text: item,
          value: item,
        }));
        (commonOptions[keyIdx] as any).options = options;
      }
    });
  }
</script>
<style lang="less" scoped>
  // @import url('./styles.less');

  :deep(.dashboard-common-search-header .search-form) {
    padding: 0 !important;
  }

  .custom-scrollbar {
    scrollbar-width: auto; /* 可选值：auto（默认）、thin（纤细）、none（隐藏） */
    scrollbar-color: #ddd #f5f5f5; /* 第一个值：滑块颜色，第二个值：轨道颜色 */
    .title-box {
      background: linear-gradient(180deg, #ffede5 0%, #fff8f5 100%);
    }
  }
</style>
