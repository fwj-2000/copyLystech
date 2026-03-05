<!-- SN明细数据 -->
<template>
  <div class="dashboard-page-container flex flex-col">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header flex ct-between">
      <a-form ref="formRef" name="advanced_search" class="ant-advanced-search-form w-[100%] mt-10px" :model="searchFormValue">
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-item name="time" label="">
              <a-range-picker v-model:value="searchFormValue.dateRange" @change="getTableData" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item name="projectNo" label="项目号">
              <a-select
                ref="select"
                v-model:value="searchFormValue.projectNo"
                @select="projectSelect"
                @deselect="projectdeSelect"
                mode="multiple"
                placeholder="请选择项目号"
                style="min-width: 120px">
                <a-select-option v-for="item in projectnolist" :key="item" :value="item">{{ item === 'all' ? '全部' : item }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="8">
            <a-form-item name="sn" label="">
              <div class="flex">
                <a-input
                  v-model:value="sn"
                  :disabled="searchFormValue.sn && searchFormValue.sn.length !== 0"
                  @pressEnter="getTableData"
                  placeholder="请输入SN"
                  allowClear
                  class="mr-4px" />
                <ImpExcel @success="importSuccess">
                  <a-tooltip placement="rightTop">
                    <template #title>
                      <div>
                        {{ searchFormValue.sn && searchFormValue.sn.length ? `Sn Excel文档共${searchFormValue.sn.length}条数据` : '请导入Sn Excel文档' }}
                      </div>
                    </template>
                    <a-button type="primary" :disabled="sn.length !== 0"> SN Excel文档导入 </a-button>
                  </a-tooltip>
                </ImpExcel>
                <a-button class="ml-10px" type="primary" @click="clearSn" ghost v-if="searchFormValue.sn && searchFormValue.sn.length">
                  清除SN Excel文档
                </a-button>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 内容加载封装组件 -->
    <div class="dashboard-content-container h-[100%] flex-shrink-1 p-[16px]">
      <Grid> </Grid>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue';
  import dayjs from 'dayjs';
  import { column } from './config';
  import { Dayjs } from 'dayjs';
  import { getCommonalityanalysePage, getProjectnolistApi } from '/@/api/dashbord/report';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ImpExcel } from '/@/components/Excel';

  import type { UnwrapRef } from 'vue';
  defineOptions({ name: 'dashboard-dashboard-operate-graphiteAnalysis-reportForm' });
  interface SearchFormValueType {
    dateRange: Dayjs[];
    projectNo: string[];
    analysisFactor: string[];
    sn: string[];
  }

  const sn = ref('');
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
      getTableData();
      return;
    }
    if (!isAllSelect && searchFormValue.projectNo.includes('all')) {
      // 不是全选的情况下，要去掉全选
      searchFormValue.projectNo = searchFormValue.projectNo.filter(item => item !== 'all');
      getTableData();
      return;
    }
    if (isAllSelect && !searchFormValue.projectNo.includes('all')) {
      // 已经全选的情况要把全选默认勾选
      searchFormValue.projectNo.unshift('all');
    }

    getTableData();
  };

  const projectdeSelect = value => {
    // 在全选的情况下，勾去其他选项，也要把全选去掉
    if (value !== 'all' && searchFormValue.projectNo.includes('all')) {
      searchFormValue.projectNo = searchFormValue.projectNo.filter(item => item !== 'all');
    }

    getTableData();
  };

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      columns: column,
      api: getCommonalityanalysePage,
      pagerConfig: {
        autoHidden: false,
      },
      beforeFetch: params => {
        const dateRange = searchFormValue.dateRange;
        return {
          ...params,
          projectNo: searchFormValue.projectNo.filter(item => item !== 'all'),
          sn: sn.value ? [sn.value] : searchFormValue.sn,
          startTime: dateRange![0].format('YYYY-MM-DD'),
          endTime: dateRange![1].format('YYYY-MM-DD'),
        };
      },
    },
  });

  // 导入Sn
  const importSuccess = res => {
    const data = res[0];
    const header = data.header;
    const values = data.results.map(item => item[header[0]]);
    searchFormValue.sn = [header[0], ...values];
    getTableData();
  };
  // 清除Sn
  const clearSn = () => {
    searchFormValue.sn = [];
  };

  const getTableData = () => {
    const proxyInfo = gridApi.grid?.getProxyInfo();
    if (proxyInfo && proxyInfo.pager) {
      proxyInfo.pager.currentPage = 1;
    }
    return gridApi.query();
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

  onMounted(() => {
    // 项目号列表
    getProjectnolist();
    // 获取表格数据
    getTableData();
  });
</script>

<style lang="less">
  .table-wrapper {
    .hightlignt-row {
      td {
        background-color: #fff2e6;
      }
    }
  }
</style>

<style lang="less" scoped>
  @import url('/@/design/dashboard.less');

  @borderColor: #ccc;

  .dashboard-content-container {
    height: calc(100% - 60px);

    :deep(.ant-spin-container) {
      min-height: 60vh;
    }

    .empty-wrapper {
      min-height: 60vh;
    }
  }

  :deep(.ant-table-container) {
    font-size: 12px;
  }

  :deep(.ant-table-thead > tr) {
    & > th {
      font-weight: 700;
      white-space: pre-wrap;

      /* 允许换行 */
      word-break: break-word;

      /* 自动断词 */
      text-align: center !important;
      // border-color: @borderColor !important;
    }
  }

  :deep(.ant-table-tbody > tr) {
    &:first-child {
      & > td {
        padding: 0 !important;
      }
    }

    & > td {
      white-space: pre-wrap;

      /* 允许换行 */
      word-break: break-word;

      /* 自动断词 */
      border-color: @borderColor !important;
      padding: 4px 8px !important;
    }
  }
</style>
