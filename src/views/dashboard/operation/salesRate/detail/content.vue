<!-- 产销率报表 -->
<template>
  <div class="dashboard-page-container h-[100%]">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header flex ct-between">
      <SearchForm
        v-bind="{
          searchFormValue,
          organizeKeyword: '1',
          showOrganizeTreeSelect: true,
          showTimeDimension: false,
          isRangePicker: true,
        }">
        <template #right>
          <div v-for="(item, idx) in allOptions" :key="idx" class="flex">
            <div class="flex px-6px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6">
              {{ item.text }}
            </div>
            <a-form-item :name="item.props">
              <a-select ref="select" v-model:value="searchFormValue[item.props]" :style="`${item.width ? `width: ${item.width}px;text-align: left` : ''}`">
                <a-select-option v-for="option in item.options" :key="option.value" :value="option.value">
                  {{ option.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <a-form-item>
            <a-input v-model:value="searchFormValue.keyword" placeholder="请输入合并料号" />
          </a-form-item>
        </template>
        <template #timeDimension>
          <a-form-item name="timeDimension">
            <a-select v-model:value="searchFormValue.timeDimension">
              <a-select-option value="week">周</a-select-option>
              <a-select-option value="month">月</a-select-option>
            </a-select>
          </a-form-item>
        </template>
      </SearchForm>
      <!-- 工具栏 -->
      <div>
        <Icon
          class="zoom-icon"
          :icon="isExpandAll ? 'system-uicons:chevron-up-double' : 'system-uicons:chevron-down-double'"
          size="32"
          @click="handleExtendAllChange" />
        <Icon
          class="zoom-icon"
          :icon="props.isFullScreen ? 'system-uicons:scale-contract' : 'system-uicons:scale-extend'"
          size="32"
          @click="handleFullSceenChange" />
      </div>
    </div>
    <!-- 内容加载封装组件 -->
    <div class="dashboard-content-container" style="height: calc(100% - 58px)" v-loading="loading">
      <div class="h-[calc(100%-38px)]"> <vxe-grid ref="tableRef" v-bind="gridOptions"></vxe-grid></div>
      <div class="mt-8px text-right">
        <a-pagination
          v-model:current="searchFormValue.currentPage"
          v-model:page-size="searchFormValue.pageSize"
          :pageSizeOptions="['50', '100', '500']"
          :total="searchFormValue.total"
          :show-total="total => `共 ${total} 条数据`" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch, reactive } from 'vue';
  import { useSearchForm } from '/@/views/dashboard/commonHooks/useSearchForm';
  import { useRouteQuery } from '/@/views/dashboard/operate/hooks/useRouteQuery';
  import { columnsOptions, defaultOptionValue, headerCellStyleOptions } from './config';
  import { getChanxiaolvDetail } from '/@/api/dashbord/report';
  import { getAllOptions } from '../config';

  import Icon from '/@/components/Icon';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { IOption } from '../../../types';

  import type { VxeGridInstance, VxeGridProps } from 'vxe-table';
  import { uniq } from 'lodash-es';

  interface IProps {
    isFullScreen: boolean;
  }
  const props = withDefaults(defineProps<IProps>(), {
    isFullScreen: false,
  });
  const emits = defineEmits(['update:isFullScreen']);
  const { routeQuery } = useRouteQuery();
  const tableRef = ref<VxeGridInstance>();
  const allOptions = ref<IOption[]>([]);
  const isExpandAll = ref<boolean>(false);
  const defaultPagerConfig = {
    total: 0,
    currentPage: 1,
    pageSize: 50,
  };
  // 表格配置
  const gridOptions = reactive<VxeGridProps>({
    size: 'mini',
    mouseConfig: {
      area: false, // 是否开启区域选取
      extension: false,
    },
    scrollY: {
      enabled: true,
      gt: 200,
    },
    treeConfig: {
      rowField: 'weeks',
      childrenField: 'children',
    },
    columnConfig: {
      isHover: false,
    },
    height: 'auto',
    columns: columnsOptions,
    data: [],
    headerCellStyle({ column }) {
      const item = headerCellStyleOptions.find(item => item.fields.includes(column.field)) || { style: {} };
      return item.style;
    }, // 表头单元格样式
  });

  // 获取请求参数
  const getParams = () => {
    const dateDim = getDateDimParams();
    const params = {
      currentPage: searchFormValue.currentPage,
      pageSize: searchFormValue.pageSize,
      keyword: searchFormValue.keyword,
      orgCode: searchFormValue.orgCode,
      dimension: searchFormValue.timeDimension,
      ...dateDim,
      ...Object.keys(defaultOptionValue).reduce(
        (pre, cur) => ({
          ...pre,
          [cur]: searchFormValue[cur] || '',
        }),
        {},
      ),
    };
    return params;
  };

  // 请求数据处理
  const afterSearch = data => {
    const { list, pagination } = data.list || { list: [], pagination: {} };
    gridOptions.data = list;
    searchFormValue.total = pagination.total;
    // 配置动态筛选
    gridOptions.columns = columnsOptions.map(column => {
      const { filterMultiple, field } = column;
      if (filterMultiple) {
        const filterValues: string[] = uniq(
          list.map(item => {
            return (field && item[field]) || '';
          }),
        );
        return {
          ...column,
          filters: filterValues.map(item => ({
            label: item,
            value: item,
          })),
        };
      }
      return column;
    });
  };

  const { loading, getDateDimParams, searchFormValue } = useSearchForm({
    isAutoSearch: true,
    defaultSearchFormValue: {
      ...routeQuery,
      ...defaultPagerConfig,
    },
    getParams,
    searchApi: getChanxiaolvDetail,
    afterSearch,
  });

  // 设置下拉条件
  const setAllOptions = params => {
    const dateDim = getDateDimParams();
    getAllOptions({
      orgCode: searchFormValue.orgCode,
      dimension: searchFormValue.timeDimension,
      prodline: searchFormValue.prodline,
      notAll: true,
      ...dateDim,
      ...params,
    }).then(res => {
      allOptions.value = res;
    });
  };
  setAllOptions({ prodline: '' });
  // 监听产品线--改变项目下拉项
  watch([() => searchFormValue.prodline, () => searchFormValue.orgCode, () => searchFormValue.timeDimension, () => searchFormValue.dateRange], () => {
    const dateDim = getDateDimParams();
    searchFormValue.item = defaultOptionValue.item;
    setAllOptions({
      orgCode: searchFormValue.orgCode,
      dimension: searchFormValue.timeDimension,
      prodline: searchFormValue.prodline,
      ...dateDim,
    });
  });

  // 展开树型数据
  const handleExtendAllChange = () => {
    isExpandAll.value = !isExpandAll.value;
    tableRef.value?.setAllTreeExpand(isExpandAll.value);
  };

  // 全屏
  const handleFullSceenChange = () => {
    emits('update:isFullScreen', !props.isFullScreen);
  };
</script>

<style lang="less" scoped>
  @import url('/@/design/dashboard.less');
  @import url('/@/views/dashboard/operation/salesRate/table.less');

  .table-style(
    @borderColor: #aaa,
    @containerFontSize: 12px,
    @headFontSize: 12px,
    @bodyFontSize: 12px,
    @tdPadding: 3px 6px,
  );
</style>
