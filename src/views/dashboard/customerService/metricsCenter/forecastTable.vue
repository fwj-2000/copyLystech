<!-- FC数据指标中心 -->
<template>
  <div class="lydc-content-wrapper">
    <div class="dashboard-fc-page-container">
      <div class="dashboard-fc-full-index-container">
        <!-- 搜索条件 -->
        <SearchForm @register="register">
          <template #right>
            <a-tooltip v-if="searchFormValue.customerPerson?.length === 1" placement="bottomLeft" :arrow="false">
              <template #title>
                <span>{{ materialPrinciple || '' }}</span>
              </template>
              <a-button type="primary" ghost>{{ t('dict.fcDataAudit.MP') }}</a-button>
            </a-tooltip>
          </template>
        </SearchForm>
        <!-- 内容 -->
        <div class="content-container">
          <div class="metrics-content-container">
            <div v-for="({ component, attrs }, idx) in components" :key="idx" v-bind="attrs" class="metric-item h-[100%]">
              <div class="h-[100%] pb-12px px-6px">
                <div class="w-[100%] h-[100%] metric-item-container">
                  <component
                    :is="component"
                    v-bind="{
                      searchFormValue,
                      searchLoading,
                    }"></component>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end -->
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch, markRaw } from 'vue';
  import { componentList } from './config';
  import { commonOptions } from '/@/views/dashboard/customerService/config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useRouteQuery } from '/@/views/dashboard/operate/hooks/useRouteQuery';
  import { useSearchForm } from '/@/views/dashboard/commonComponents/SearchForm/useSearchForm';

  import SearchForm from '/@/views/dashboard/commonComponents/SearchForm/index.vue';
  import { Grid } from 'ant-design-vue';
  defineOptions({ name: 'dashboard-customerService-forecastTable' });

  const useBreakpoint = Grid.useBreakpoint;
  const screens = useBreakpoint();
  const { t } = useI18n();
  const { routeQuery } = useRouteQuery();

  const { materialPreparationPrinciple } = routeQuery;
  const materialPrinciple = ref(materialPreparationPrinciple);
  const components = ref(
    componentList.map(item => {
      return {
        component: markRaw(item.component),
        attrs: {},
      };
    }),
  );

  const [register, { searchFormValue, searchLoading }] = useSearchForm({
    commonAttrs: {
      disabled: true,
    },
    formOptions: commonOptions,
  });

  watch(
    () => screens,
    () => {
      const points = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];
      // xs: 屏幕宽度 < 576px
      // sm: 屏幕宽度 ≥ 576px
      // md: 屏幕宽度 ≥ 768px
      // lg: 屏幕宽度 ≥ 992px
      // xl: 屏幕宽度 ≥ 1200px
      // xxl: 屏幕宽度 ≥ 1600px
      components.value = components.value.map((item, idx) => {
        const pointIdx = points.findIndex(point => screens.value[point] && componentList[idx]?.gridStyle[point]);
        const point = points[pointIdx];
        const style = componentList[idx]?.gridStyle[point] ?? {};
        return {
          ...item,
          attrs: {
            style,
          },
        };
      });
    },
    { deep: true, immediate: true },
  );
</script>

<style lang="less">
  @import url('/@/views/dashboard/customerService/style.less');
</style>
