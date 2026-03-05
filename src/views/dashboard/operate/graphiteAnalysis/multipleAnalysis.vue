<!-- 自定义因子分析 -->
<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <div class="analysis-page">
          <a-form ref="formRef" name="advanced_search" class="ant-advanced-search-form w-[100%] mt-10px" :model="searchFormValue">
            <a-row :gutter="24">
              <a-col :span="6">
                <a-form-item name="time" label="">
                  <a-range-picker v-model:value="searchFormValue.dateRange" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item name="projectNo" label="项目号">
                  <a-select
                    ref="select"
                    placeholder="请选择项目号"
                    v-model:value="searchFormValue.projectNo"
                    mode="multiple"
                    style="min-width: 120px"
                    @select="projectSelect"
                    @deselect="projectdeSelect">
                    <a-select-option v-for="item in projectnolist" :key="item" :value="item">{{ item === 'all' ? '全部' : item }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item name="timeDimension" label="分析因子列表">
                  <a-select ref="select" v-model:value="searchFormValue.analysisFactor" mode="multiple" style="min-width: 120px" placeholder="请选择分析因子">
                    <a-select-option v-for="item in analysisfactorlist" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-item name="sn" label="">
                  <div class="flex justify-start">
                    <ImpExcel @success="importSuccess">
                      <a-tooltip placement="rightTop">
                        <template #title>
                          <div>
                            {{ searchFormValue.sn && searchFormValue.sn.length ? `Sn Excel文档共${searchFormValue.sn.length}条数据` : '请导入Sn Excel文档' }}
                          </div>
                        </template>
                        <a-button type="primary"> SN Excel文档导入 </a-button>
                      </a-tooltip>
                    </ImpExcel>
                    <a-button class="ml-10px" type="primary" @click="clearSn" ghost v-if="searchFormValue.sn && searchFormValue.sn.length">
                      清除SN Excel文档
                    </a-button>
                    <a-button class="ml-10px" type="primary" @click="goReportForm"> SN明细数据 </a-button>
                    <a-button class="ml-10px" type="primary" @click="setDataInfo" :loading="isBtnLoading">查询</a-button>
                  </div>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>

          <div class="sankey-content">
            <Sankey
              :analysisFactor="analysisFactor"
              :nodes="item.data.nodes"
              :links="item.data.links"
              :projectNo="item.projectNo"
              v-for="(item, index) in sankeyList"
              :key="index"
              class="w-[100%] h-[78%]" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch, reactive } from 'vue';
  import dayjs, { Dayjs } from 'dayjs';
  import { ImpExcel } from '/@/components/Excel';
  import { useRouter } from 'vue-router';
  import { getAnalysisfactorlistApi, getProjectnolistApi, analyseAssistantApi } from '/@/api/dashbord/report';
  import Sankey from './Sankey.vue';

  import type { UnwrapRef } from 'vue';

  defineOptions({ name: 'dashboard-dashboard-operate-graphiteAnalysis-multipleAnalysis' });
  const isBtnLoading = ref<Boolean>(false);
  interface SearchFormValueType {
    dateRange: Dayjs[];
    projectNo: string[];
    analysisFactor: string[];
    sn: string[];
  }

  const router = useRouter();
  const analysisFactor = ref<any[]>([]);
  const defaultDate = dayjs().tz().subtract(1, 'day');
  const searchFormValue = reactive<UnwrapRef<SearchFormValueType>>({
    dateRange: [defaultDate.subtract(6, 'day'), defaultDate],
    projectNo: [],
    analysisFactor: [],
    sn: [],
  });

  const projectSelect = value => {
    const isAllSelect = searchFormValue.projectNo.filter(item => item !== 'all').length === projectnolist.value.filter(item => item !== 'all').length;
    if (!isAllSelect && value === 'all') {
      // 不是全选的情况下点击了全选
      searchFormValue.projectNo = JSON.parse(JSON.stringify(projectnolist.value));
      return;
    }
    if (!isAllSelect && searchFormValue.projectNo.includes('all')) {
      // 不是全选的情况下，要去掉全选
      searchFormValue.projectNo = searchFormValue.projectNo.filter(item => item !== 'all');
      return;
    }
    if (isAllSelect && !searchFormValue.projectNo.includes('all')) {
      // 已经全选的情况要把全选默认勾选
      searchFormValue.projectNo.unshift('all');
    }
  };

  const projectdeSelect = value => {
    // 在全选的情况下，勾去其他选项，也要把全选去掉
    if (value !== 'all' && searchFormValue.projectNo.includes('all')) {
      searchFormValue.projectNo = searchFormValue.projectNo.filter(item => item !== 'all');
    }
  };

  const importSuccess = res => {
    const data = res[0];
    const header = data.header;
    const values = data.results.map(item => item[header[0]]);
    searchFormValue.sn = [header[0], ...values];
  };

  const clearSn = () => {
    searchFormValue.sn = [];
  };

  const getParams = () => {
    const dateRange = searchFormValue.dateRange;
    return {
      startTime: dateRange![0].format('YYYY-MM-DD'),
      endTime: dateRange![1].format('YYYY-MM-DD'),
      projectNo: searchFormValue.projectNo.filter(item => item !== 'all'),
      analysisFactor: searchFormValue.analysisFactor,
      sn: searchFormValue.sn,
    };
  };

  const sankeyList = ref<any[]>([]);

  const setDataInfo = () => {
    if (searchFormValue.analysisFactor.length < 2 || searchFormValue.projectNo.length < 1) return;
    isBtnLoading.value = true;
    analyseAssistantApi(getParams())
      .then(res => {
        sankeyList.value = res.data;
      })
      .catch(res => {
        console.log(res);
      })
      .finally(() => {
        isBtnLoading.value = false;
      });
  };

  const analysisfactorlist = ref<any[]>([]);
  const getAnalysisfactorlist = async () => {
    const { data } = await getAnalysisfactorlistApi();
    analysisfactorlist.value = Object.entries(data).map(([key, value]) => ({
      label: value,
      value: key,
    }));
  };

  const projectnolist = ref<string[]>([]);
  const getProjectnolist = async () => {
    const dateRange = searchFormValue.dateRange;
    const { data } = await getProjectnolistApi({
      startTime: dateRange![0].format('YYYY-MM-DD'),
      endTime: dateRange![1].format('YYYY-MM-DD'),
    });
    projectnolist.value = data;
    projectnolist.value.unshift('all');
  };

  const goReportForm = () => {
    router.push('./reportForm');
  };

  onMounted(() => {
    // 获取分析因子列表
    getAnalysisfactorlist();
    // 项目号列表
    getProjectnolist();
  });

  watch(
    () => searchFormValue.analysisFactor,
    val => {
      if (val.length >= 2) {
        analysisFactor.value = val.map(item => {
          const match = analysisfactorlist.value.find(obj => item === obj.value);
          return match.label;
        });
      }
    },
    { immediate: true, deep: true },
  );

  watch(
    () => searchFormValue.dateRange,
    () => {
      searchFormValue.projectNo = [];
      getProjectnolist();
    },
    { immediate: true, deep: true },
  );

  // watch(
  //   () => searchFormValue,
  //   () => {
  //     setDataInfo();
  //   },
  //   { immediate: true, deep: true },
  // );
</script>

<style lang="less" scoped>
  @import url('/@/design/dashboard.less');

  .analysis-page {
    padding: 20px;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    background-color: #fff;

    .sankey-content {
      flex: 1;
      overflow: scroll;
    }
  }
</style>
