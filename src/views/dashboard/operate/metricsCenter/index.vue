<!-- 运营报表首页 -->
<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center flex row all-start">
      <NoPermission v-if="noPermission"></NoPermission>
      <!-- 报表内容区域 -->
      <div class="report-content-container" id="operateContentIndex">
        <!-- 组织结构树形选择条件 -->
        <div class="dashboard-search-compo-header flex ct-between">
          <SearchForm
            v-model:noPermission="noPermission"
            v-bind="{
              searchFormValue,
              organizeKeyword: '',
              showOrganizeTreeSelect: true,
              showTimeDimension: false,
              afterGetOrganizationMth: afterGetOrganization,
            }"></SearchForm>
          <a-button @click="showCustomizeModel">自定义视图</a-button>
        </div>
        <!-- 可拖拽组件 -->
        <Content :list="customizeCompoList" :operable="false" :queryInfo="searchFormValue" class="drag-content-wrapper" @update-values="handleUpdateValues">
        </Content>
      </div>
      <!-- end -->
    </div>
    <!-- 自定义视图弹窗 -->
    <CustomizeModel
      ref="customizeModelRef"
      :list="customizeCompoList"
      :queryInfo="searchFormValue"
      @update-config="handleUpdateConfig"
      @restore="handleRestoreList">
    </CustomizeModel>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import { computed, ref, shallowRef, provide, unref } from 'vue';
  import { useSearchForm } from '/@/hooks/web/useSearchForm';
  import { getViewSetting } from '/@/api/dashbord/operate';

  import CustomizeModel, { CustomizeModelExposed } from './CustomizeModel.vue';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import NoPermission from '/@/views/dashboard/operate/components/NoPermission.vue';

  import Content from './Content/index.vue';
  import { ALL_CUSTOMIZE_COMPO_LIST, devConfig } from './Content/config';
  import { CustomCompoInfo } from './types';
  import { cloneDeep } from 'lodash-es';

  defineOptions({ name: 'dashboard-operate-metricsCenter' });

  const noPermission = ref(false);
  const customizeModelRef = ref<null | CustomizeModelExposed>(null);

  const customizeCompoList = ref<CustomCompoInfo[]>([]);
  const viewConfig = ref<CustomCompoInfo[]>([]);

  const isShowValue = ref(false);
  const isShowEM = ref(false); // 展示边贡
  const HIDE_ID_LIST = [13, 20]; // 如果isShowValue为false 需要隐藏的组件
  const HIDE_EM_ID_LIST = [14, 15, 16, 17, 18]; // 如果isShowEM为false 需要隐藏的组件

  // 将查询条件提供给子孙组件
  provide('getSearchFormValue', () => {
    return searchFormValue;
  });

  // 隐藏产值和边贡
  const filterIds = computed(() => {
    return [...(isShowValue.value ? [] : HIDE_ID_LIST), ...(isShowEM.value ? [] : HIDE_EM_ID_LIST)];
  });

  // 从接口获取用户视图配置
  const getCustomerCompoConfig = async () => {
    let config;
    const res = await getViewSetting().catch(() => ({ data: {} }));
    const configStr = res.data;
    try {
      config = [...devConfig, ...cloneDeep(JSON.parse(configStr))];
    } catch {} // 完全按照后台返回的字段渲染组件
    viewConfig.value = config;
    customizeCompoList.value = config
      .map(item => {
        return {
          ...item,
          ...ALL_CUSTOMIZE_COMPO_LIST.find(compo => compo.id === item.id),
          show: item.show,
        };
      })
      .map(item => ({
        ...item,
        component: shallowRef(item.component),
      }))
      .filter(item => !filterIds.value.includes(item.id));
  };

  const afterGetOrganization = res => {
    const { isShowValue: showValue = false, isShowEM: emShowValue = false } = res.data || {};
    isShowValue.value = showValue;
    isShowEM.value = emShowValue;
    getCustomerCompoConfig();
  };
  // 更新配置信息
  const handleUpdateConfig = config => {
    viewConfig.value = config;
  };

  // 恢复默认配置
  const handleRestoreList = () => {
    const list = viewConfig.value;
    customizeCompoList.value = list
      .reduce((pre, item) => {
        const compo = ALL_CUSTOMIZE_COMPO_LIST.find(compo => compo.id === item.id);
        if (compo) {
          return [
            ...pre,
            {
              ...compo,
              show: item.show,
            },
          ];
        }
        return pre;
      }, [])
      .map(item => ({
        ...item,
        component: shallowRef(item.component),
      }))
      .filter(item => !filterIds.value.includes(item.id));
  };

  // 更新图表数据
  const handleUpdateValues = (id, values) => {
    const idx = unref(customizeCompoList).findIndex(item => item.id === id);
    if (idx !== -1) {
      unref(customizeCompoList)[idx].values = values;
    }
  };

  // 打开自定义视图弹窗
  const showCustomizeModel = () => {
    customizeModelRef?.value?.showModal();
  };

  // 中午3点之前，显示是前天的数据   3点之后，显示昨天的数据
  const defaultDate = dayjs().tz().subtract(39, 'hours');
  // if (defaultDate.day() === 0) {
  //   // 如果是周日，选择下一天两天(产销组件
  //   defaultDate = defaultDate.add(1, 'day');
  // }
  // 使用维度搜索hooks
  const { searchFormValue } = useSearchForm({
    defaultDate,
  });
</script>
<style lang="less">
  @import url('../../../../design/dashboard.less');
</style>

<style lang="less" scoped>
  @contractRight: 21px;

  .full-modal {
    :deep(.ant-modal) {
      max-width: 100%;
      top: 0;
      padding-bottom: 0;
      margin: 0;
    }

    .ant-modal-body {
      flex: 1;
    }
  }

  :deep(.ant-modal-content) {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }

  .lydc-content-wrapper {
    background-color: #fff;
  }

  .report-content-container {
    width: 100%;
    height: 100%;
    transition: width 0.5s ease-in-out;
    overflow-y: auto;

    &.shrink {
      width: calc(100% - @contractRight);
    }

    .drag-content-wrapper {
      width: 100%;
      padding: 4px @contractRight @contractRight @contractRight;
    }

    .dashboard-search-compo-header {
      width: 100%;
      height: 50px;
      padding: 6px @contractRight;
    }
  }
</style>
