<!-- 绩效排名首页 -->
<template>
  <div class="dashboard-page-container flex flex-col">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header">
      <SearchForm
        v-bind="{
          searchFormValue,
          showOrganizeTreeSelect: true,
          showTimeDimension: false,
          isRangePicker: true,
          getOrganizationApi: getSyOrganization,
          organizeKeyword: '',
        }">
        <template #left>
          <a-form-item v-if="searchFormValue.orgCode === 'MQ'" name="orgLevel">
            <a-select v-model:value="searchFormValue.orgLevel">
              <a-select-option v-for="(key, idx) in Object.keys(EOrgLevel)" :key="idx" :value="EOrgLevel[key]">
                {{ key }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </template>
        <template #right>
          <div class="flex">
            <div class="flex px-6px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6">纳入边贡</div>
            <a-form-item name="isBian">
              <a-select ref="select" v-model:value="searchFormValue.isBian">
                <a-select-option v-for="(item, idx) in isBainOptions" :key="idx" :value="item.value">{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <div class="flex">
            <div class="flex px-6px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6">维度</div>
            <a-form-item name="dimensionType">
              <a-select mode="multiple" v-model:value="searchFormValue.dimensionType" style="min-width: 124px">
                <a-select-option v-for="(item, idx) in dimensionTypeOptions" :key="idx" :value="item.value">{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <div class="flex">
            <div class="flex px-6px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6">工单类型</div>
            <a-form-item name="workNoType">
              <a-select mode="multiple" v-model:value="searchFormValue.workNoType" style="min-width: 84px">
                <a-select-option v-for="(item, idx) in workNoTypeOptions" :key="idx" :value="item.value">{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </div>
        </template>
      </SearchForm>
    </div>
    <!-- 内容加载封装组件 -->
    <div class="dashboard-content-container h-[100%] flex-shrink-1">
      <SpinContent
        v-bind="{
          loading: loading,
          isEmptyData,
          isRequestError,
          showList: false,
        }">
        <!-- 报表表格 -->
        <RankItem
          v-for="(item, idx) in rankList"
          :key="idx"
          :name="item.name"
          :columns="item.columns"
          :dataSource="item.dataSource"
          :summaryInfo="summaryInfo"></RankItem>
      </SpinContent>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, provide } from 'vue';
  import dayjs, { Dayjs } from 'dayjs';
  import { useSearchForm } from '/@/hooks/web/useSearchForm';
  import { PAGE_CONFIG_INFO, columns, getCommonParams } from './config';
  import { useRouteQuery } from '/@/views/dashboard/operate/hooks/useRouteQuery';

  import { EOrgLevel } from '/@/views/dashboard/operate/ranking/type';
  import { DEFAULT_WORK_NO_TYPE, DEFAULT_IS_BAIN, isBainOptions } from '../config';

  import RankItem from './RankItem.vue';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import { isEmpty } from 'lodash-es';
  import { getDimensionWordNoSearchparameter, getDimensionDimensionTypeparameter } from '/@/api/dashbord/report';
  import { getSyOrganization } from '/@/api/dashbord/operate';

  defineOptions({ name: 'dashboard-operate-biangong-dimension-ranking' });

  const { api, defaultSearchFormValue = {} } = PAGE_CONFIG_INFO;

  const rankList = ref<
    {
      name: string;
      columns: any[];
      dataSource: Recordable<any>[];
    }[]
  >([]);
  const dimensionTypeOptions = ref<any[]>([]);
  const workNoTypeOptions = ref<any[]>([]);
  const summaryInfo = ref<any>({});
  const requestParams = ref<any>({});
  const { routeQuery } = useRouteQuery();

  provide('getSearchFormValue', () => {
    return searchFormValue;
  });
  provide('getRequestParams', () => {
    return requestParams;
  });

  // 处理接口数据，设置表格数据
  const setTableData = (queryParams, searchFormValue) => {
    getDimensionWordNoSearchparameterInfo();
    requestParams.value = getCommonParams(queryParams, searchFormValue);
    return new Promise((resolve, reject) => {
      api(queryParams, searchFormValue)
        .then(res => {
          const {
            data: { list, total = {} },
          } = res as any;
          resolve({ data: { list, total } });
          if (isEmpty(list)) return;
          summaryInfo.value = total;
          const dataList = list
            .sort((a, b) => a.sort - b.sort)
            .map(item => {
              return {
                ...item,
                ...item.dimesionType.reduce(
                  (pre, cur) => ({
                    ...pre,
                    [cur.keys]: cur.values,
                  }),
                  {},
                ),
              };
            });
          const columnKeys = [...Object.keys(dataList[0])];
          rankList.value = [
            {
              columns: columns.filter(({ field }) => columnKeys.includes(field)),
              name: '模切BG制程边贡损失额排名榜',
              dataSource: dataList,
            },
          ];
        })
        .catch(res => {
          reject(res);
        });
    });
  };
  // 使用维度搜索hooks
  const date: Dayjs = dayjs().tz().subtract(1, 'week');
  const { loading, searchFormValue, isRequestError, isEmptyData } = useSearchForm({
    defaultDate: date,
    isTrendData: true,
    isRangePicker: true,
    showPeriodDimension: true,
    defaultSearchFormValue: {
      bu: 'MQ',
      orgLevel: EOrgLevel.BU,
      isBian: DEFAULT_IS_BAIN,
      workNoType: DEFAULT_WORK_NO_TYPE,
      dimensionType: ['cpx'], // 默认产品线
      dateRange: [dayjs(date).tz(), dayjs(date).tz()],
      ...defaultSearchFormValue,
      ...routeQuery,
      ...(routeQuery?.dimensionType
        ? {
            dimensionType: [routeQuery.dimensionType],
          }
        : {}),
    },
    searchReqMth: setTableData,
  });

  // 获取查询参数信息
  const getDimensionWordNoSearchparameterInfo = () => {
    let [startDate = dayjs().tz(), endDate = dayjs().tz()] = searchFormValue.dateRange || [];
    getDimensionWordNoSearchparameter({
      sbu: searchFormValue.orgCode !== 'MQ' ? searchFormValue.orgCode : '',
      startDim: `${startDate.year()}WK${startDate.week().toString().padStart(2, '0')}`,
      endDim: `${endDate.year()}WK${endDate.week().toString().padStart(2, '0')}`,
      isBian: searchFormValue.isBian,
    }).then(({ data }) => {
      workNoTypeOptions.value = data.map(item => ({
        label: item,
        value: item,
      }));
    });
  };

  // 维度类型参数信息
  const getDimensionDimensionTypeparameterInfo = () => {
    getDimensionDimensionTypeparameter({}).then(({ data }) => {
      dimensionTypeOptions.value = Object.entries(data).map(([key, value]) => ({
        label: value,
        value: key,
      }));
    });
  };
  getDimensionWordNoSearchparameterInfo();
  getDimensionDimensionTypeparameterInfo();
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
  @import url('../../../../../design/dashboard.less');

  .dashboard-content-container {
    padding: 0 !important;

    :deep(.ant-spin-container) {
      min-height: 20vh !important;
    }

    .empty-wrapper {
      min-height: 60vh;
    }
  }
</style>
./types
