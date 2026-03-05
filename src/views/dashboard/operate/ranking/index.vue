<!-- 绩效排名首页 -->
<template>
  <div class="dashboard-page-container">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header">
      <SearchForm
        v-bind="{
          searchFormValue,
          showOrganizeTreeSelect: true,
          showTimeDimension: showTimeDimension,
          showPeriodDimension: showPeriodDimension && searchFormValue.timeDimension !== TimeDimension.DAY,
          isFetchAllOrgCode: true,
        }">
        <!-- 费用 -->
        <template v-if="pageName === EModules.EXPENSE" #timeDimension>
          <a-form-item name="timeDimension">
            <a-select v-model:value="searchFormValue.timeDimension">
              <a-select-option value="week">周</a-select-option>
              <a-select-option value="month">月</a-select-option>
            </a-select>
          </a-form-item>
        </template>
        <!-- 产销汇总 -->
        <template v-if="pageName === EModules.PRODUCTION" #timeDimension>
          <a-form-item name="timeDimension">
            <a-select v-model:value="searchFormValue.timeDimension">
              <a-select-option value="week">周</a-select-option>
              <a-select-option value="month">月</a-select-option>
              <a-select-option value="year">年</a-select-option>
            </a-select>
          </a-form-item>
        </template>
        <template v-if="showQuarterDimension" #timeDimension>
          <a-form-item name="timeDimension">
            <a-select v-model:value="searchFormValue.timeDimension">
              <a-select-option value="day">天</a-select-option>
              <a-select-option value="week">周</a-select-option>
              <a-select-option value="month">月</a-select-option>
              <a-select-option value="quarter">季度</a-select-option>
              <a-select-option value="year">年</a-select-option>
            </a-select>
          </a-form-item>
        </template>
        <template #left>
          <a-form-item v-if="searchFormValue.orgCode === 'MQ' && pageName !== EModules.MPF" name="orgLevel">
            <a-select v-model:value="searchFormValue.orgLevel">
              <a-select-option v-for="(key, idx) in Object.keys(EOrgLevel)" :key="idx" :value="EOrgLevel[key]">
                {{ key }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </template>
        <template #right>
          <div v-if="showIncludeOptions" class="flex">
            <div class="flex px-6px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6">是否纳入边贡</div>
            <a-select ref="select" v-model:value="searchFormValue.isBian" :dropdownMatchSelectWidth="false">
              <a-select-option v-for="item in IS_INCLUDE_OPTIONS" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
          </div>
          <!-- AOI条件 -->
          <div v-if="pageName === EModules.AOIDATA" class="flex">
            <a-form-item name="mark">
              <a-select ref="select" v-model:value="searchFormValue.mark">
                <a-select-option v-for="item in AOI_MARK_OPTIONS" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <!-- 时间稼动率条件 -->
          <div v-if="pageName === EModules.TIME_UTILIZATION_RATE" class="flex">
            <a-form-item name="range">
              <div class="flex">
                <!-- <div class="flex px-6px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6">含NPI</div> -->
                <a-select ref="select" v-model:value="searchFormValue.tag">
                  <a-select-option v-for="item in isContainOptions" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
                </a-select>
              </div>
            </a-form-item>
          </div>
          <div v-if="pageName === EModules.MPF" class="flex">
            <a-form-item name="range">
              <div class="flex">
                <a-select ref="select" v-model:value="searchFormValue.types">
                  <a-select-option v-for="item in groupOptions" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
                </a-select>
              </div>
            </a-form-item>
          </div>
        </template>
      </SearchForm>
    </div>
    <!-- 内容加载封装组件 -->
    <div class="dashboard-content-container">
      <SpinContent
        v-bind="{
          loading: loading,
          isEmptyData,
          isRequestError,
          showList: false,
        }">
        <RankItem v-for="(item, idx) in rankList" :key="idx" :name="(item.name as string)" :columns="item.columns" :dataSource="item.dataSource"></RankItem>
      </SpinContent>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, provide, watch } from 'vue';
  import dayjs, { Dayjs } from 'dayjs';
  import { useSearchForm } from '/@/hooks/web/useSearchForm';
  import { useRoute, useRouter } from 'vue-router';
  import { PAGE_CONFIG_INFO } from './config';
  import { BasicColumn } from '/@/components/Table';

  import { EModules, EOrgLevel } from './type';
  import { TimeDimension } from '/@/views/dashboard/operate/types';
  import { EIsInClude, IS_INCLUDE_OPTIONS } from '/@/views/dashboard/operate/metricsCenter/components/Financeeconomic/config';
  import { AOI_MARK_OPTIONS, DEFAULT_AOI_MARK } from '/@/views/dashboard/operate/metricsCenter/components/UtilizationRate/config';
  import { DEFAULT_IS_CONTAIN, isContainOptions, groupOptions } from '/@/views/dashboard/operate/metricsCenter/components/TimeUtilizationRate/chart/config';

  import RankItem from './RankItem.vue';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';
  import { isEmpty, omit } from 'lodash-es';
  import { useTabs } from '/@/hooks/web/useTabs';

  defineOptions({ name: 'dashboard-operate-ranking' });

  const route = useRoute();
  const router = useRouter();
  const { setTitle } = useTabs(router);

  const { query: routeQuery = {} } = route;
  const pageName = (routeQuery?.name || EModules.ATTENDANCE) as string;
  watch(
    () => route.query.title,
    newTitle => {
      if (newTitle) {
        setTitle(newTitle as string);
      }
    },
    { immediate: true }, // 立即执行，确保初始化时也能捕捉到
  );
  const { getColumnsOptions, api, defaultSearchFormValue = {} } = PAGE_CONFIG_INFO[pageName] || PAGE_CONFIG_INFO[EModules.ATTENDANCE];

  const rankList = ref<
    {
      name: string;
      columns: BasicColumn[];
      dataSource: Recordable<any>[];
    }[]
  >([]);

  provide('getSearchFormValue', () => {
    return searchFormValue;
  });
  // 是否展示时间维度
  const showTimeDimension = computed(() => {
    return ![EModules.MPF].includes(pageName as EModules);
  });
  // 是否展示工作日和非工作日
  const showPeriodDimension = computed(() => {
    return ![EModules.PRODUCTION, EModules.MPF].includes(pageName as EModules);
  });

  // 是否展示季度和年维度
  const showQuarterDimension = computed(() => {
    return [EModules.FINANCEECONOMIC, EModules.MATERIAL_LOSS, EModules.ARTIFICIAL].includes(pageName as EModules);
  });

  // 是否展示纳入边贡条件
  const showIncludeOptions = computed(() => {
    return [EModules.FINANCEECONOMIC, EModules.MATERIAL_LOSS, EModules.ARTIFICIAL].includes(pageName as EModules);
  });

  const getSafeDate = (dateStr: string, defaultDate: Dayjs): Dayjs => {
    if (!dateStr) return defaultDate;
    const date = dayjs(dateStr).tz();
    return date.isValid() ? date : defaultDate;
  };
  const date: Dayjs = getSafeDate(routeQuery?.date as string, dayjs().tz().subtract(1, 'day'));

  // 获取表头配置信息
  const getColumns = (dataSource, itemName): BasicColumn[] => {
    return getColumnsOptions({
      dataSource,
      itemName,
      searchFormValue,
    }).reduce((pre, cur) => {
      const { sortable = false, baseInfo, dataIndex } = cur;
      return [
        ...pre,
        {
          dataIndex,
          ...baseInfo,
          ...(sortable
            ? {
                sorter: (a, b) => {
                  const aValue = Number.parseFloat(a[dataIndex]) || 0;
                  const bValue = Number.parseFloat(b[dataIndex]) || 0;
                  return aValue - bValue;
                },
              }
            : {}),
        },
      ];
    }, []) as BasicColumn[];
  };

  // 处理接口数据，设置表格数据
  const setTableData = (queryParams, searchFormValue) => {
    return new Promise((resolve, reject) => {
      api(queryParams, searchFormValue)
        .then(res => {
          const { data } = res;
          resolve(res);
          const list = data.list || data;
          if (isEmpty(list)) return;
          rankList.value = list.map(item => ({
            columns: getColumns(item.RList, item.RankItem),
            name: item.RankItem,
            dataSource: item.Rlist.map((row, idx) => {
              return {
                ...row,
                Rank: row.rank || idx + 1,
              };
            }),
          }));
        })
        .catch(error_ => {
          reject(error_);
        });
    });
  };
  // 使用维度搜索hooks
  const { loading, searchFormValue, isRequestError, isEmptyData } = useSearchForm({
    defaultDate: date,
    isTrendData: false,
    isRangePicker: true,
    showPeriodDimension: showPeriodDimension.value,
    defaultSearchFormValue: {
      orgCode: 'MQ',
      orgLevel: EOrgLevel.SBU,
      isBian: EIsInClude.YES,
      mark: DEFAULT_AOI_MARK,
      tag: DEFAULT_IS_CONTAIN,
      types: groupOptions[0].value,
      ...omit(defaultSearchFormValue, 'orgCode'),
    },
    searchReqMth: setTableData,
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
  @import url('../../../../design/dashboard.less');

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
